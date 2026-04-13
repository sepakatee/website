#!/usr/bin/env node
/**
 * Fetch keyword-tagged Unsplash URLs (free, non-Plus) for catalog thumbnails.
 * Output: data/catalog-stock-pool.json { version: 2, pools: { bank: [...], ... }, general: [...] }
 *
 * Run: node scripts/fetch-catalog-stock-pool.mjs
 * Requires network.
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/catalog-stock-pool.json');

/** Per-key target count; script dedupes globally so totals may be slightly lower. */
const POOL_CONFIG = [
  {
    key: 'addendum',
    perKey: 32,
    queries: ['contract amendment signing', 'legal document pages pen', 'supplementary agreement desk', 'revision contract office'],
  },
  { key: 'bank', perKey: 42, queries: ['bank building facade', 'bank lobby interior', 'atm cash machine'] },
  { key: 'saham', perKey: 42, queries: ['stock exchange trading floor', 'stock market chart', 'investment portfolio desk'] },
  { key: 'valas', perKey: 36, queries: ['foreign currency money', 'currency exchange counter', 'international money bills'] },
  { key: 'hutang', perKey: 38, queries: ['loan agreement desk', 'calculator finance papers', 'debt finance planning'] },
  { key: 'property', perKey: 48, queries: ['apartment building residential', 'house keys real estate', 'commercial office building exterior', 'construction blueprint house'] },
  { key: 'automotive', perKey: 36, queries: ['car repair garage workshop', 'auto mechanic shop', 'motorcycle parking urban'] },
  { key: 'employment', perKey: 40, queries: ['office team meeting professional', 'factory workers industrial', 'laptop work desk employee'] },
  { key: 'corporate', perKey: 42, queries: ['boardroom meeting business', 'skyscraper business district', 'handshake business suits'] },
  { key: 'legal', perKey: 48, queries: ['law library books', 'courthouse columns', 'legal documents desk', 'gavel justice scale'] },
  { key: 'kuasa', perKey: 32, queries: ['signing document pen', 'contract signature hands', 'notary stamp document'] },
  { key: 'nda', perKey: 32, queries: ['cybersecurity lock screen', 'confidential folder office', 'privacy data protection'] },
  { key: 'commerce', perKey: 38, queries: ['retail store shopping', 'warehouse boxes logistics', 'shipping cargo port'] },
  { key: 'construction', perKey: 34, queries: ['construction site crane', 'hard hat engineer site', 'building under construction'] },
  { key: 'meeting', perKey: 34, queries: ['conference room meeting', 'business presentation whiteboard', 'team discussion office'] },
  { key: 'documents', perKey: 32, queries: ['paper documents organized', 'pen paper desk minimal', 'filing cabinet office'] },
  { key: 'medical', perKey: 28, queries: ['hospital reception clean', 'medical clinic interior', 'doctor office professional'] },
  { key: 'tech', perKey: 32, queries: ['software developer laptop', 'server room technology', 'digital office workspace'] },
];

const GENERAL_QUERIES = [
  'professional office neutral',
  'minimal desk workspace',
  'business abstract clean',
  'corporate hallway modern',
];
const GENERAL_EXTRA = 120;

const seen = new Set();
const pools = {};

function toCardUrl(raw) {
  const u = new URL(raw);
  u.searchParams.set('w', '640');
  u.searchParams.set('h', '400');
  u.searchParams.set('fit', 'crop');
  u.searchParams.set('q', '80');
  u.searchParams.set('auto', 'format');
  return u.toString();
}

async function fetchPage(q, page) {
  const u = new URL('https://unsplash.com/napi/search/photos');
  u.searchParams.set('query', q);
  u.searchParams.set('per_page', '30');
  u.searchParams.set('page', String(page));
  const r = await fetch(u);
  if (!r.ok) throw new Error(r.status + ' ' + q);
  return r.json();
}

async function fillPool(key, perKey, queries) {
  if (!pools[key]) pools[key] = [];
  for (const q of queries) {
    if (pools[key].length >= perKey) break;
    for (let page = 1; page <= 4 && pools[key].length < perKey; page++) {
      let data;
      try {
        data = await fetchPage(q, page);
      } catch {
        break;
      }
      for (const p of data.results || []) {
        const raw = p.urls && p.urls.raw;
        if (!raw || String(raw).includes('plus.unsplash.com')) continue;
        const card = toCardUrl(raw);
        if (seen.has(card)) continue;
        seen.add(card);
        pools[key].push(card);
        if (pools[key].length >= perKey) break;
      }
      await new Promise((r) => setTimeout(r, 320));
    }
  }
}

async function fillGeneral() {
  const general = [];
  for (const q of GENERAL_QUERIES) {
    for (let page = 1; page <= 5 && general.length < GENERAL_EXTRA; page++) {
      let data;
      try {
        data = await fetchPage(q, page);
      } catch {
        break;
      }
      for (const p of data.results || []) {
        const raw = p.urls && p.urls.raw;
        if (!raw || String(raw).includes('plus.unsplash.com')) continue;
        const card = toCardUrl(raw);
        if (seen.has(card)) continue;
        seen.add(card);
        general.push(card);
        if (general.length >= GENERAL_EXTRA) break;
      }
      await new Promise((r) => setTimeout(r, 320));
    }
  }
  return general;
}

for (const block of POOL_CONFIG) {
  await fillPool(block.key, block.perKey, block.queries);
  console.error(block.key, pools[block.key]?.length || 0);
}

const general = await fillGeneral();
console.error('general', general.length);

const total = Object.values(pools).reduce((a, arr) => a + arr.length, 0) + general.length;
writeFileSync(
  OUT,
  JSON.stringify({ version: 2, total, pools, general }, null, 0) + '\n',
  'utf8'
);
console.error('Wrote', OUT, 'unique total', total);
