/**
 * Ensures catalog + checkout globals exist if primary scripts fail (404, blockers, order).
 * Loads after pricing.js + paket-commercial.js; merges missing methods only.
 */
(function (global) {
  'use strict';

  var TIER_PRICE_IDR = {
    A: 350000,
    B: 249000,
    C: 149000,
  };

  var CATALOG_PRODUCTS = {
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
      priceIdr: 249000,
      productName: 'Contoh dokumen Tier B (dynamic template demo)',
    },
    'catalog-paket-bisnis': {
      tier: 'B',
      priceIdr: 249000,
      productName: 'Paket Bisnis — dokumen hukum Sepakatee',
    },
    'catalog-paket-dasar': {
      tier: 'C',
      priceIdr: 149000,
      productName: 'Paket Dasar — dokumen hukum Sepakatee',
    },
  };

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

  function ensurePricing() {
    var P = global.SepakateePricing;
    if (!P) global.SepakateePricing = P = {};

    if (!P.TIER_PRICE_IDR) P.TIER_PRICE_IDR = TIER_PRICE_IDR;
    if (!P.PRODUCTS) P.PRODUCTS = CATALOG_PRODUCTS;
    if (!P.BUNDLES) P.BUNDLES = {};

    if (typeof P.formatIdr !== 'function') {
      P.formatIdr = function (n) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(n);
      };
    }

    if (typeof P.amountString !== 'function') {
      P.amountString = function (priceIdr) {
        return String(priceIdr);
      };
    }

    if (typeof P.priceForTierLetter !== 'function') {
      P.priceForTierLetter = function (letter) {
        var k = String(letter || 'C').toUpperCase();
        return TIER_PRICE_IDR[k] != null ? TIER_PRICE_IDR[k] : TIER_PRICE_IDR.C;
      };
    }

    if (typeof P.resolvePrice !== 'function') {
      P.resolvePrice = resolvePrice;
    }

    if (typeof P.getByPath !== 'function') {
      P.getByPath = function (pathname) {
        var key = flowKeyFromPath(pathname);
        var p = key ? P.PRODUCTS[key] : null;
        if (!p) p = P.PRODUCTS['sewa-menyewa'];
        return {
          flowKey: key || 'sewa-menyewa',
          tier: p.tier,
          priceIdr: resolvePrice(p),
          productName: p.productName,
        };
      };
    }

    if (typeof P.getByFlowKey !== 'function') {
      P.getByFlowKey = function (flowKey) {
        var p = P.PRODUCTS[flowKey];
        if (!p) return P.getByPath('/' + flowKey + '/');
        return {
          flowKey: flowKey,
          tier: p.tier,
          priceIdr: resolvePrice(p),
          productName: p.productName,
        };
      };
    }
  }

  function letter(t) {
    return String(t == null ? 'C' : t).toUpperCase();
  }

  function ensurePaket() {
    var K = global.SepakateePaket;
    if (!K) global.SepakateePaket = K = {};

    if (typeof K.letter !== 'function') {
      K.letter = letter;
    }

    if (typeof K.meta !== 'function') {
      K.meta = function (tierLetter) {
        var L = letter(tierLetter);
        if (L === 'A') {
          return {
            key: 'A',
            name: 'Paket Panduan Penuh',
            chip: 'Panduan penuh',
            sidebarTitle: 'Buat dokumen',
            sidebarHint: 'Pengisian terpandu dan pratinjau sebelum finalisasi',
          };
        }
        if (L === 'B') {
          return {
            key: 'B',
            name: 'Paket Bisnis',
            chip: 'Paket Bisnis',
            sidebarTitle: 'Beli dokumen',
            sidebarHint: 'Satu kali pembayaran — file dikirim setelah konfirmasi',
          };
        }
        return {
          key: 'C',
          name: 'Paket Dasar',
          chip: 'Paket Dasar',
          sidebarTitle: 'Beli dokumen',
          sidebarHint: 'Satu kali pembayaran — file dikirim setelah konfirmasi',
        };
      };
    }

    if (typeof K.ipaymuFlowKey !== 'function') {
      K.ipaymuFlowKey = function (tierLetter) {
        var L = letter(tierLetter);
        if (L === 'B') return 'catalog-paket-bisnis';
        return 'catalog-paket-dasar';
      };
    }

    if (typeof K.builderLandingRel !== 'function') {
      K.builderLandingRel = function (slug) {
        var M = {
          'perjanjian-sewa-menyewa-tempat': 'sewa-menyewa/landing.html',
          'perjanjian-kerja-sama-usaha-joint-venture': 'kerja-sama/landing.html',
        };
        if (!slug) return null;
        return M[slug] || null;
      };
    }
  }

  ensurePricing();
  ensurePaket();
})(typeof window !== 'undefined' ? window : globalThis);
