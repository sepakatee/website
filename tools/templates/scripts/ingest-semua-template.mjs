#!/usr/bin/env node
/**
 * Indexes premium files under website/semua template/Perjanjian and writes catalog-inventory.json
 * with Pass-1 family tags + provisional tier heuristics.
 *
 * Usage (from repo root):
 *   node website/tools/templates/scripts/ingest-semua-template.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeCatalogBundle } from './build-catalog-bundle.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = path.join(__dirname, '../../..');
const PREMIUM_DIR = path.join(WEBSITE_ROOT, 'semua template', 'Perjanjian');
const OUT_FILE = path.join(__dirname, '../data/catalog-inventory.json');

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 120);
}

function parseFilename(basename) {
  const m = basename.match(/^(\d+)\.\s*(.+)\.(docx|doc)$/i);
  if (!m) return { index: null, title: basename.replace(/\.(docx|doc)$/i, '') };
  return { index: parseInt(m[1], 10), title: m[2].trim() };
}

function detectFamily(titleUpper) {
  const t = titleUpper;
  if (/\bAKTA\b|NOTARIS|NOTARIAL/i.test(t)) return 'akta_notaris';
  if (/SURAT\s+KUASA/i.test(t)) return 'surat_kuasa';
  if (/SURAT\s+PERNYATAAN/i.test(t)) return 'surat_pernyataan';
  if (/BERITA\s+ACARA/i.test(t)) return 'berita_acara';
  if (/PERJANJIAN|PERJANJIN|PIAGAM\s+PERJANJIAN/i.test(t)) return 'perjanjian';
  if (/KONTRAK/i.test(t)) return 'kontrak';
  if (/SURAT\s+PERJANJIAN/i.test(t)) return 'surat_perjanjian';
  if (/KUASA/i.test(t)) return 'kuasa_other';
  return 'lainnya';
}

function provisionalTierAndFlags(titleUpper, family, sizeBytes) {
  const flags = {
    requires_notary: /NOTARIS|\bAKTA\b|NOTARIAL/i.test(titleUpper),
    property: /SEWA|MENYEWA|KONTRAKTOR|PROPERTI|RUMAH|GEDUNG|TANAH|VILLA|MALL/i.test(titleUpper),
    employment: /KERJA|PEGAWAI|PKWT|PKWTT|MAGANG|FREELANC|KONSULTAN/i.test(titleUpper),
    corporate: /SAHAM|RUPS|DIREKSI|KOMISARIS|YAYASAN|PT\b|PERSEROAN/i.test(titleUpper),
  };

  // Premium catalog policy:
  // - 149k (Tier B) for smaller files
  // - 199k (Tier A) for larger/more complex files
  const kb = sizeBytes / 1024;
  let tier = kb >= 45 ? 'A' : 'B';

  // Boost to Tier A for complex legal markers even if file is small.
  if (
    flags.requires_notary ||
    /PEMEGANG\s*SAHAM|RUPS|PERSEROAN|AKUISISI|MERGER|OBLIGASI|WANPRESTASI|ARBITRASE|FIDUSIA/i.test(
      titleUpper
    )
  ) {
    tier = 'A';
  }

  return { provisional_tier: tier, flags };
}

function walkWordDocs(dir, acc) {
  if (!fs.existsSync(dir)) {
    console.error('Missing folder:', dir);
    process.exit(1);
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkWordDocs(full, acc);
    else if (e.isFile() && /\.(docx|doc)$/i.test(e.name)) acc.push(full);
  }
}

/** Folder langsung di bawah .../Perjanjian/ — untuk filter katalog utama. */
function premiumCategoryFromRel(rel) {
  const parts = rel.split('/');
  const i = parts.indexOf('Perjanjian');
  if (i >= 0 && parts[i + 1]) {
    const label = parts[i + 1];
    return { slug: slugify(label), label };
  }
  return { slug: 'lainnya', label: 'Lainnya' };
}

function ipaymuFlowForPremiumTier(tier) {
  const L = String(tier || 'B').toUpperCase();
  if (L === 'A') return 'catalog-tier-a';
  return 'catalog-tier-b';
}

function main() {
  const files = [];
  walkWordDocs(PREMIUM_DIR, files);
  files.sort();

  const items = files.map((abs) => {
    const rel = path.relative(WEBSITE_ROOT, abs).split(path.sep).join('/');
    const basename = path.basename(abs);
    const ext = path.extname(abs).toLowerCase().replace('.', '');
    const st = fs.statSync(abs);
    const sizeBytes = st.size;
    const { index, title } = parseFilename(basename);
    const titleUpper = title.toUpperCase();
    const family = detectFamily(titleUpper);
    const { provisional_tier, flags } = provisionalTierAndFlags(titleUpper, family, sizeBytes);
    const id = slugify((index != null ? index + '-' : '') + title);
    const pc = premiumCategoryFromRel(rel);

    return {
      id,
      product_type: 'perjanjian',
      source_rel: rel,
      file_ext: ext,
      file_size_bytes: sizeBytes,
      file_size_kb: Math.round((sizeBytes / 1024) * 10) / 10,
      index,
      title,
      slug: slugify(title),
      family,
      provisional_tier,
      flags,
      premium_category_slug: pc.slug,
      premium_category_label: pc.label,
      ipaymu_flow_key: ipaymuFlowForPremiumTier(provisional_tier),
    };
  });

  const summary = {
    generated_at: new Date().toISOString(),
    source_dir: path.relative(WEBSITE_ROOT, PREMIUM_DIR).split(path.sep).join('/'),
    count: items.length,
    by_family: {},
    by_provisional_tier: { A: 0, B: 0, C: 0 },
  };

  for (const it of items) {
    summary.by_family[it.family] = (summary.by_family[it.family] || 0) + 1;
    summary.by_provisional_tier[it.provisional_tier] =
      (summary.by_provisional_tier[it.provisional_tier] || 0) + 1;
  }

  const catMap = {};
  for (const it of items) {
    const k = it.premium_category_slug || 'lainnya';
    if (!catMap[k]) {
      catMap[k] = {
        slug: k,
        label: it.premium_category_label || 'Lainnya',
        count: 0,
      };
    }
    catMap[k].count += 1;
  }
  summary.premium_categories = Object.values(catMap).sort((a, b) =>
    a.label.localeCompare(b.label, 'id')
  );

  const payload = { summary, items };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote', items.length, 'items to', path.relative(WEBSITE_ROOT, OUT_FILE));
  console.log('By tier (Pass-1):', JSON.stringify(summary.by_provisional_tier));
  writeCatalogBundle();
}

main();
