#!/usr/bin/env node
/**
 * Embeds perintilan-inventory.json as window.__SEPAKATEE_PERINTILAN_CATALOG__

 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, '../data/perintilan-inventory.json');
const OUT_PATH = path.join(__dirname, '../data/perintilan-inventory.bundle.js');

export function writePerintilanBundle() {
  if (!fs.existsSync(JSON_PATH)) {
    console.warn('Skip perintilan bundle:', JSON_PATH, 'not found');
    return;
  }
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);
  const banner =
    '/* Auto-generated: perintilan-inventory.json — run scripts/ingest-perintilan-template.mjs */\n';
  const body = 'window.__SEPAKATEE_PERINTILAN_CATALOG__=' + JSON.stringify(data) + ';\n';
  fs.writeFileSync(OUT_PATH, banner + body, 'utf8');
  console.log('Wrote', OUT_PATH);
}

var isCli =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  writePerintilanBundle();
}
