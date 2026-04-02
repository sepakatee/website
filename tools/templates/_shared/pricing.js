/**
 * Canonical tier + product pricing for template flows (static site).
 * Tier C = lowest IDR, Tier B = mid, Tier A = highest (per product plan).
 * Edit amounts here; preview/payment/landing read from this file.
 */
(function (global) {
  'use strict';

  /** Tier letters for katalog semua-template (A = paling kompleks). Builder sewa/JV tetap pakai harga produk sendiri. */
  var TIER_PRICE_IDR = {
    A: 250000,
    B: 199000,
    C: 149000,
  };

  var PRODUCTS = {
    'sewa-menyewa': {
      tier: 'A',
      priceIdr: 350000,
      productName: 'Perjanjian Sewa Menyewa Tempat',
    },
    'kerja-sama': {
      tier: 'A',
      priceIdr: 350000,
      productName: 'Perjanjian Kerja Sama Usaha (Joint Venture)',
    },
    'sample-tier-b': {
      tier: 'B',
      priceIdr: 199000,
      productName: 'Contoh dokumen Tier B (dynamic template demo)',
    },
    'catalog-paket-bisnis': {
      tier: 'B',
      priceIdr: 199000,
      productName: 'Paket Bisnis — dokumen hukum Sepakatee',
    },
    'catalog-paket-dasar': {
      tier: 'C',
      priceIdr: 149000,
      productName: 'Paket Dasar — dokumen hukum Sepakatee',
    },
    'catalog-tier-a': {
      tier: 'A',
      priceIdr: 250000,
      productName: 'Katalog dokumen Tier A — Sepakatee',
    },
    'catalog-tier-b': {
      tier: 'B',
      priceIdr: 199000,
      productName: 'Katalog dokumen Tier B — Sepakatee',
    },
    'catalog-tier-c': {
      tier: 'C',
      priceIdr: 149000,
      productName: 'Katalog dokumen Tier C — Sepakatee',
    },
  };

  var BUNDLES = {};

  function flowKeyFromPath(pathname) {
    if (!pathname) return null;
    var m = pathname.match(/\/(sewa-menyewa|kerja-sama)(?:\/|$)/);
    return m ? m[1] : null;
  }

  function resolvePrice(product) {
    if (!product) return TIER_PRICE_IDR.A;
    if (typeof product.priceIdr === 'number') return product.priceIdr;
    var t = product.tier || 'A';
    return TIER_PRICE_IDR[t] != null ? TIER_PRICE_IDR[t] : TIER_PRICE_IDR.A;
  }

  function getByPath(pathname) {
    var key = flowKeyFromPath(pathname);
    var p = key ? PRODUCTS[key] : null;
    if (!p) {
      p = PRODUCTS['sewa-menyewa'];
    }
    return {
      flowKey: key || 'sewa-menyewa',
      tier: p.tier,
      priceIdr: resolvePrice(p),
      productName: p.productName,
    };
  }

  function getByFlowKey(flowKey) {
    var p = PRODUCTS[flowKey];
    if (!p) return getByPath('/' + flowKey + '/');
    return {
      flowKey: flowKey,
      tier: p.tier,
      priceIdr: resolvePrice(p),
      productName: p.productName,
    };
  }

  function formatIdr(n) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  }

  function amountString(priceIdr) {
    return String(priceIdr);
  }

  function priceForTierLetter(letter) {
    var k = String(letter || 'C').toUpperCase();
    return TIER_PRICE_IDR[k] != null ? TIER_PRICE_IDR[k] : TIER_PRICE_IDR.C;
  }

  global.SepakateePricing = {
    TIER_PRICE_IDR: TIER_PRICE_IDR,
    PRODUCTS: PRODUCTS,
    BUNDLES: BUNDLES,
    getByPath: getByPath,
    getByFlowKey: getByFlowKey,
    resolvePrice: resolvePrice,
    formatIdr: formatIdr,
    amountString: amountString,
    priceForTierLetter: priceForTierLetter,
  };
})(typeof window !== 'undefined' ? window : globalThis);
