#!/usr/bin/env node
/**
 * Batch-extract plain text from catalog .docx files and append DRAFT SEO entries
 * to stdout (or a file you redirect). Human edit required before merging into
 * catalog-seo-overrides.json — raw Word text is noisy for meta tags.
 *
 * Setup:  cd website/tools/templates && npm install
 * Usage:  node scripts/extract-seo-drafts-from-docx.mjs --offset=0 --limit=25
 *         node scripts/extract-seo-drafts-from-docx.mjs --id=146-surat-kuasa-berhutang
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = path.join(__dirname, '../../..');
const CATALOG_PATH = path.join(__dirname, '../data/catalog-inventory.json');

function argNum(name, def) {
  const a = process.argv.find((x) => x.startsWith('--' + name + '='));
  if (!a) return def;
  return parseInt(a.split('=')[1], 10) || def;
}

function argStr(name) {
  const a = process.argv.find((x) => x.startsWith('--' + name + '='));
  return a ? a.split('=').slice(1).join('=') : '';
}

function squish(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function clip(s, n) {
  const t = squish(s);
  if (t.length <= n) return t;
  return t.slice(0, n - 1).trim() + '…';
}

async function main() {
  let mammoth;
  try {
    mammoth = (await import('mammoth')).default;
  } catch (e) {
    console.error('Install mammoth first: cd website/tools/templates && npm install');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const items = catalog.items || [];
  const idFilter = argStr('id');
  let offset = argNum('offset', 0);
  let limit = argNum('limit', 20);

  let slice = items;
  if (idFilter) {
    slice = items.filter((it) => it.id === idFilter);
    offset = 0;
    limit = slice.length;
  } else {
    slice = items.slice(offset, offset + limit);
  }

  const out = { version: 1, _draft: true, _note: 'Edit then merge by_id into catalog-seo-overrides.json', by_id: {} };

  for (const it of slice) {
    const abs = path.join(WEBSITE_ROOT, it.source_rel);
    if (!fs.existsSync(abs)) {
      console.warn('Skip missing file:', it.id, abs);
      continue;
    }
    const { value: raw } = await mammoth.extractRawText({ path: abs });
    const text = squish(raw);
    if (!text.length) {
      console.warn('Skip empty text:', it.id);
      continue;
    }

    out.by_id[it.id] = {
      page_title: it.title.replace(/\s+/g, ' ').trim(),
      meta_description: clip(text, 158),
      hero_subtitle: clip(text, 220),
      summary_intro: clip(text, 520),
      summary_points: [
        'Sesuaikan isi dengan fakta hukum dan identitas pihak Anda.',
        'Tinjau ulang dengan konsultan hukum jika transaksi bernilai tinggi.',
      ],
      _source_excerpt: clip(text, 120),
    };
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
