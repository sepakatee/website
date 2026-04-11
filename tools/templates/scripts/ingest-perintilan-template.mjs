#!/usr/bin/env node
/**
 * Indexes economical templates under website/semua template/Perintilan (Template Praktis).
 * Output: perintilan-inventory.json + bundle for static site.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writePerintilanBundle } from './build-perintilan-bundle.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = path.join(__dirname, '../../..');
const PERINTILAN_DIR = path.join(WEBSITE_ROOT, 'semua template', 'Perintilan');
const OUT_FILE = path.join(__dirname, '../data/perintilan-inventory.json');

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

function main() {
  const files = [];
  walkWordDocs(PERINTILAN_DIR, files);
  files.sort();

  const items = files.map((abs) => {
    const rel = path.relative(WEBSITE_ROOT, abs).split(path.sep).join('/');
    const relUnder = path.relative(PERINTILAN_DIR, abs).split(path.sep).join('/');
    const basename = path.basename(abs);
    const ext = path.extname(abs).toLowerCase().replace('.', '');
    const st = fs.statSync(abs);
    const sizeBytes = st.size;
    const { index, title } = parseFilename(basename);
    const titleUpper = title.toUpperCase();
    const family = detectFamily(titleUpper);
    const id = slugify('tp-' + relUnder.replace(/\.(docx|doc)$/i, ''));

    return {
      id,
      product_type: 'perintilan',
      source_rel: rel,
      file_ext: ext,
      file_size_bytes: sizeBytes,
      file_size_kb: Math.round((sizeBytes / 1024) * 10) / 10,
      index,
      title,
      slug: slugify(title),
      family,
      provisional_tier: 'C',
      ipaymu_flow_key: 'perintilan-single',
      flags: {},
    };
  });

  const summary = {
    generated_at: new Date().toISOString(),
    source_dir: path.relative(WEBSITE_ROOT, PERINTILAN_DIR).split(path.sep).join('/'),
    count: items.length,
    by_family: {},
  };

  for (const it of items) {
    summary.by_family[it.family] = (summary.by_family[it.family] || 0) + 1;
  }

  const FAMILY_LABELS_UI = {
    perjanjian: 'Perjanjian',
    kontrak: 'Kontrak',
    surat_kuasa: 'Surat kuasa',
    surat_pernyataan: 'Surat pernyataan',
    berita_acara: 'Berita acara',
    akta_notaris: 'Akta & notaris',
    surat_perjanjian: 'Surat perjanjian',
    kuasa_other: 'Kuasa (lainnya)',
    lainnya: 'Lainnya',
  };
  const famMap = {};
  for (const it of items) {
    const k = it.family;
    famMap[k] = (famMap[k] || 0) + 1;
  }
  summary.praktis_categories = Object.keys(famMap)
    .map(function (slug) {
      return {
        slug: slug,
        label: FAMILY_LABELS_UI[slug] || slug,
        count: famMap[slug],
      };
    })
    .sort(function (a, b) {
      return a.label.localeCompare(b.label, 'id');
    });

  const payload = { summary, items };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Wrote', items.length, 'items to', path.relative(WEBSITE_ROOT, OUT_FILE));
  writePerintilanBundle();
}

main();
