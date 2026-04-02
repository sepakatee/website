#!/usr/bin/env node
/**
 * Indexes .docx files under website/semua template and writes catalog-inventory.json
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
const SEMUA_DIR = path.join(WEBSITE_ROOT, 'semua template');
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
  const m = basename.match(/^(\d+)\.\s*(.+)\.docx$/i);
  if (!m) return { index: null, title: basename.replace(/\.docx$/i, '') };
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

function provisionalTierAndFlags(titleUpper, family) {
  const flags = {
    requires_notary: /NOTARIS|\bAKTA\b|NOTARIAL/i.test(titleUpper),
    property: /SEWA|MENYEWA|KONTRAKTOR|PROPERTI|RUMAH|GEDUNG|TANAH|VILLA|MALL/i.test(titleUpper),
    employment: /KERJA|PEGAWAI|PKWT|PKWTT|MAGANG|FREELANC|KONSULTAN/i.test(titleUpper),
    corporate: /SAHAM|RUPS|DIREKSI|KOMISARIS|YAYASAN|PT\b|PERSEROAN/i.test(titleUpper),
  };

  let tier = 'C';
  if (flags.requires_notary) {
    tier = 'C';
  } else if (family === 'perjanjian' || family === 'kontrak') {
    tier = 'B';
    if (flags.property && /SEWA|MENYEWA|JUAL\s*BELI|JIWA/i.test(titleUpper)) tier = 'A';
  } else if (family === 'surat_kuasa' || family === 'surat_pernyataan') {
    tier = 'C';
  } else if (family === 'berita_acara') {
    tier = 'C';
  }

  return { provisional_tier: tier, flags };
}

function walkDocx(dir, acc) {
  if (!fs.existsSync(dir)) {
    console.error('Missing folder:', dir);
    process.exit(1);
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDocx(full, acc);
    else if (e.isFile() && /\.docx$/i.test(e.name)) acc.push(full);
  }
}

function main() {
  const files = [];
  walkDocx(SEMUA_DIR, files);
  files.sort();

  const items = files.map((abs) => {
    const rel = path.relative(WEBSITE_ROOT, abs).split(path.sep).join('/');
    const basename = path.basename(abs);
    const { index, title } = parseFilename(basename);
    const titleUpper = title.toUpperCase();
    const family = detectFamily(titleUpper);
    const { provisional_tier, flags } = provisionalTierAndFlags(titleUpper, family);
    const id = slugify((index != null ? index + '-' : '') + title);

    return {
      id,
      source_rel: rel,
      index,
      title,
      slug: slugify(title),
      family,
      provisional_tier,
      flags,
    };
  });

  const summary = {
    generated_at: new Date().toISOString(),
    source_dir: path.relative(WEBSITE_ROOT, SEMUA_DIR).split(path.sep).join('/'),
    count: items.length,
    by_family: {},
    by_provisional_tier: { A: 0, B: 0, C: 0 },
  };

  for (const it of items) {
    summary.by_family[it.family] = (summary.by_family[it.family] || 0) + 1;
    summary.by_provisional_tier[it.provisional_tier] =
      (summary.by_provisional_tier[it.provisional_tier] || 0) + 1;
  }

  const payload = { summary, items };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote', items.length, 'items to', path.relative(WEBSITE_ROOT, OUT_FILE));
  console.log('By tier (Pass-1):', JSON.stringify(summary.by_provisional_tier));
  writeCatalogBundle();
}

main();
