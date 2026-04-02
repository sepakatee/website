/**
 * Browse catalog from data/catalog-inventory.json (ingest output).
 * Depends on SepakateePricing from pricing.js for tier → IDR display.
 *
 * Optional: window.SEPAKATEE_CATALOG_IDS = { search, family, tier, pageSize, meta, list, pagination }
 * Optional: window.SEPAKATEE_CATALOG_JSON = 'data/catalog-inventory.json'
 * Fallback: window.__SEPAKATEE_CATALOG__ (from data/catalog-inventory.bundle.js)
 */
(function () {
  'use strict';

  var FAMILY_LABELS = {
    perjanjian: 'Perjanjian',
    kontrak: 'Kontrak',
    surat_kuasa: 'Surat Kuasa',
    surat_pernyataan: 'Surat Pernyataan',
    berita_acara: 'Berita Acara',
    akta_notaris: 'Akta / Notaris',
    surat_perjanjian: 'Surat Perjanjian',
    kuasa_other: 'Kuasa (lainnya)',
    lainnya: 'Lainnya',
  };

  var DEFAULT_IDS = {
    search: 'catSearch',
    family: 'catFamily',
    tier: 'catTier',
    pageSize: 'catPageSize',
    meta: 'catMeta',
    list: 'catList',
    pagination: 'catPagination',
  };

  function getIds() {
    var out = {};
    for (var k in DEFAULT_IDS) {
      out[k] = DEFAULT_IDS[k];
    }
    var o =
      typeof window !== 'undefined' && window.SEPAKATEE_CATALOG_IDS;
    if (o && typeof o === 'object') {
      for (var key in o) {
        if (o[key]) out[key] = o[key];
      }
    }
    return out;
  }

  function getEl(name) {
    var id = getIds()[name];
    return id ? document.getElementById(id) : null;
  }

  function jsonUrl() {
    if (typeof window !== 'undefined' && window.SEPAKATEE_CATALOG_JSON) {
      return window.SEPAKATEE_CATALOG_JSON;
    }
    return 'data/catalog-inventory.json';
  }

  var state = {
    items: [],
    summary: null,
    filtered: [],
    page: 1,
    pageSize: 48,
  };

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatCatalogTitle(s) {
    if (!s) return '';
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
  }

  function familyLabel(key) {
    return FAMILY_LABELS[key] || key || '—';
  }

  function applyFilters() {
    var q = ((getEl('search') && getEl('search').value) || '').trim().toLowerCase();
    var fam = (getEl('family') && getEl('family').value) || '';
    var tier = (getEl('tier') && getEl('tier').value) || '';

    state.filtered = state.items.filter(function (it) {
      if (fam && it.family !== fam) return false;
      if (tier && String(it.provisional_tier) !== tier) return false;
      if (q) {
        var hay = (it.title + ' ' + it.slug + ' ' + it.id).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    state.page = 1;
    render();
  }

  function renderMeta() {
    var meta = getEl('meta');
    if (!meta) return;
    var s = state.summary;
    if (!s) {
      meta.textContent = '';
      return;
    }
    var n = state.filtered.length;
    if (n === s.count) {
      meta.textContent = s.count + ' dokumen hukum siap Anda telusuri.';
    } else {
      meta.textContent =
        n + ' dokumen sesuai filter — dari ' + s.count + ' judul dalam katalog.';
    }
  }

  function renderPagination() {
    var el = getEl('pagination');
    if (!el) return;
    var total = state.filtered.length;
    var ps = state.pageSize;
    var pages = Math.max(1, Math.ceil(total / ps));
    if (state.page > pages) state.page = pages;

    el.innerHTML = '';
    if (pages <= 1) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn--ghost';
    prev.textContent = '← Sebelumnya';
    prev.disabled = state.page <= 1;
    prev.addEventListener('click', function () {
      state.page--;
      render();
    });

    var info = document.createElement('span');
    info.className = 'catalog-page-info';
    info.textContent = 'Halaman ' + state.page + ' / ' + pages;

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn--ghost';
    next.textContent = 'Berikutnya →';
    next.disabled = state.page >= pages;
    next.addEventListener('click', function () {
      state.page++;
      render();
    });

    el.appendChild(prev);
    el.appendChild(info);
    el.appendChild(next);
  }

  function renderList(slice) {
    var list = getEl('list');
    if (!list) return;

    var fmt = window.SepakateePricing && window.SepakateePricing.formatIdr;
    var tierPrice =
      window.SepakateePricing && window.SepakateePricing.priceForTierLetter;

    if (!slice || !slice.length) {
      list.innerHTML =
        '<p class="catalog-empty">Tidak ada dokumen yang cocok. Ubah filter atau kata kunci.</p>';
      return;
    }

    var Pak = typeof window !== 'undefined' && window.SepakateePaket;

    var html = slice
      .map(function (it) {
        var price = tierPrice ? tierPrice(it.provisional_tier) : 0;
        var priceStr = fmt ? fmt(price) : 'Rp —';
        var notary = it.flags && it.flags.requires_notary;
        var chip =
          Pak && Pak.meta
            ? Pak.meta(it.provisional_tier).chip
            : 'Paket';
        var href = 'dokumen/index.html?id=' + encodeURIComponent(it.id);
        return (
          '<a class="catalog-card" href="' +
          escapeHtml(href) +
          '">' +
          '<div class="catalog-card__badges">' +
          '<span class="catalog-badge catalog-badge--tier">' +
          escapeHtml(chip) +
          '</span>' +
          '<span class="catalog-badge">' +
          escapeHtml(familyLabel(it.family)) +
          '</span>' +
          (notary
            ? '<span class="catalog-badge catalog-badge--warn">Notaris</span>'
            : '') +
          '</div>' +
          '<h3 class="catalog-card__title">' +
          escapeHtml(formatCatalogTitle(it.title)) +
          '</h3>' +
          '<p class="catalog-card__price">Mulai <strong>' +
          priceStr +
          '</strong> <span class="catalog-card__hint">per dokumen</span></p>' +
          '<p class="catalog-card__meta">Buka halaman produk →</p>' +
          '</a>'
        );
      })
      .join('');

    list.innerHTML = html;
  }

  function render() {
    renderMeta();
    var total = state.filtered.length;
    var ps = state.pageSize;
    var pages = Math.max(1, Math.ceil(total / ps));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * ps;
    var slice = state.filtered.slice(start, start + ps);

    renderPagination();
    renderList(slice);
  }

  function fillFamilyOptions() {
    var sel = getEl('family');
    if (!sel || !state.summary) return;
    var counts = state.summary.by_family || {};
    var keys = Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a];
    });
    keys.forEach(function (k) {
      var opt = document.createElement('option');
      opt.value = k;
      opt.textContent = familyLabel(k) + ' (' + counts[k] + ')';
      sel.appendChild(opt);
    });
  }

  function init() {
    if (!getEl('list')) return;

    function loadCatalogData() {
      var emb =
        typeof window !== 'undefined' && window.__SEPAKATEE_CATALOG__;
      return fetch(jsonUrl())
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .catch(function () {
          if (emb && emb.items && emb.items.length) return emb;
          throw new Error('no catalog');
        });
    }

    loadCatalogData()
      .then(function (data) {
        state.summary = data.summary;
        state.items = data.items || [];
        state.filtered = state.items.slice();
        fillFamilyOptions();
        render();
      })
      .catch(function (e) {
        console.error(e);
        var list = getEl('list');
        if (list) {
          list.innerHTML =
            '<p class="catalog-empty catalog-empty--error">Tidak dapat memuat daftar dokumen. Muat ulang halaman atau coba lagi sebentar lagi.</p>';
        }
      });

    var search = getEl('search');
    var fam = getEl('family');
    var tier = getEl('tier');
    var size = getEl('pageSize');

    if (search)
      search.addEventListener('input', function () {
        applyFilters();
      });
    if (fam)
      fam.addEventListener('change', function () {
        applyFilters();
      });
    if (tier)
      tier.addEventListener('change', function () {
        applyFilters();
      });
    if (size)
      size.addEventListener('change', function () {
        state.pageSize = parseInt(size.value, 10) || 48;
        state.page = 1;
        render();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
