#!/usr/bin/env node
/**
 * Embeds catalog-inventory.json as window.__SEPAKATEE_CATALOG__ for offline / file:// use.
 * Run after ingest: node website/tools/templates/scripts/build-catalog-bundle.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const JSON_PATH = path.join(__dirname, '../data/catalog-inventory.json');
const OUT_PATH = path.join(__dirname, '../data/catalog-inventory.bundle.js');

export function writeCatalogBundle() {
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);
  const banner =
    '/* Auto-generated from data/catalog-inventory.json — run scripts/build-catalog-bundle.mjs after ingest. */\n';
  const body = 'window.__SEPAKATEE_CATALOG__=' + JSON.stringify(data) + ';\n';
  fs.writeFileSync(OUT_PATH, banner + body, 'utf8');
  console.log('Wrote', OUT_PATH);
}

var isCli =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  writeCatalogBundle();
}
