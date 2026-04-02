/**
 * Outward-facing product "paket" labels (replaces raw A/B/C tier wording in UI).
 */
(function (global) {
  'use strict';

  function letter(t) {
    return String(t == null ? 'C' : t).toUpperCase();
  }

  function meta(tierLetter) {
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
  }

  function ipaymuFlowKey(tierLetter) {
    var L = letter(tierLetter);
    if (L === 'B') return 'catalog-paket-bisnis';
    return 'catalog-paket-dasar';
  }

  /** Slug → URL path to existing wizard landing (relative to tools/templates/) */
  var BUILDER_LANDING_BY_SLUG = {
    'perjanjian-sewa-menyewa-tempat': 'sewa-menyewa/landing.html',
    'perjanjian-kerja-sama-usaha-joint-venture': 'kerja-sama/landing.html',
  };

  function builderLandingRel(slug) {
    if (!slug) return null;
    return BUILDER_LANDING_BY_SLUG[slug] || null;
  }

  global.SepakateePaket = {
    letter: letter,
    meta: meta,
    ipaymuFlowKey: ipaymuFlowKey,
    builderLandingRel: builderLandingRel,
    BUILDER_LANDING_BY_SLUG: BUILDER_LANDING_BY_SLUG,
  };
})(typeof window !== 'undefined' ? window : globalThis);
