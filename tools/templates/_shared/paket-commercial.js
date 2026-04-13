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

  /** Label untuk halaman katalog Word (semua template): semua beli langsung, beda harga per tier. */
  function metaForCatalog(tierLetter) {
    var L = letter(tierLetter);
    if (L === 'A') {
      return {
        key: 'A',
        name: 'Paket Kompleks',
        chip: 'Tingkat kompleks',
        sidebarTitle: 'Beli dokumen',
        sidebarHint: 'Satu kali pembayaran — unduh .docx setelah pembayaran terverifikasi',
      };
    }
    if (L === 'B') {
      return {
        key: 'B',
        name: 'Paket Bisnis',
        chip: 'Paket Bisnis',
        sidebarTitle: 'Beli dokumen',
        sidebarHint: 'Satu kali pembayaran — unduh .docx setelah pembayaran terverifikasi',
      };
    }
    return {
      key: 'C',
      name: 'Paket Dasar',
      chip: 'Paket Dasar',
      sidebarTitle: 'Beli dokumen',
      sidebarHint: 'Satu kali pembayaran — unduh .docx setelah pembayaran terverifikasi',
    };
  }

  function ipaymuFlowKey(tierLetter) {
    var L = letter(tierLetter);
    if (L === 'A') return 'catalog-tier-a';
    if (L === 'B') return 'catalog-tier-b';
    return 'catalog-tier-c';
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
    metaForCatalog: metaForCatalog,
    ipaymuFlowKey: ipaymuFlowKey,
    builderLandingRel: builderLandingRel,
    BUILDER_LANDING_BY_SLUG: BUILDER_LANDING_BY_SLUG,
  };
})(typeof window !== 'undefined' ? window : globalThis);
