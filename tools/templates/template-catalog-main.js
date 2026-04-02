/**
 * Main template catalog on index.html — full inventory, tier filters, no "coming soon".
 * Requires SepakateePricing (pricing.js).
 * Prefers fetch(data/catalog-inventory.json); falls back to window.__SEPAKATEE_CATALOG__ (bundle).
 */
(function () {
  'use strict';

  var JSON_URL = 'data/catalog-inventory.json';
  var PRODUCT_PAGE = 'dokumen/index.html';

  var FAMILY_LABELS = {
    perjanjian: 'Perjanjian',
    kontrak: 'Kontrak',
    surat_kuasa: 'Surat Kuasa',
    surat_pernyataan: 'Surat Pernyataan',
    berita_acara: 'Berita Acara',
    akta_notaris: 'Akta / Notaris',
    surat_perjanjian: 'Surat Perjanjian',
    kuasa_other: 'Kuasa',
    lainnya: 'Lainnya',
  };

  /** Tab key → families included (empty = all) */
  var BUCKET_FAMILIES = {
    all: null,
    perjanjian_kontrak: ['perjanjian', 'kontrak', 'surat_perjanjian'],
    kuasa: ['surat_kuasa', 'kuasa_other'],
    pernyataan: ['surat_pernyataan'],
    berita: ['berita_acara'],
    akta: ['akta_notaris'],
    lainnya: ['lainnya'],
  };

  var state = {
    items: [],
    summary: null,
    filtered: [],
    bucket: 'all',
    tier: '',
    page: 1,
    pageSize: 24,
    sort: 'title',
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTitle(s) {
    if (!s) return '';
    var t = String(s).toLowerCase().trim();
    return t.replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function familyLabel(key) {
    return FAMILY_LABELS[key] || key || '—';
  }

  function itemInBucket(it, bucket) {
    var fams = BUCKET_FAMILIES[bucket];
    if (!fams) return true;
    return fams.indexOf(it.family) !== -1;
  }

  function itemHref(it) {
    return PRODUCT_PAGE + '?id=' + encodeURIComponent(it.id);
  }

  function paketChipText(tierLetter) {
    var P = typeof window !== 'undefined' && window.SepakateePaket;
    if (P && P.meta) return P.meta(tierLetter).chip;
    return 'Paket';
  }

  function itemCtaLabel() {
    return 'Buka halaman produk';
  }

  function applyFilters() {
    var qEl = $('catalogMainSearch');
    var q = ((qEl && qEl.value) || '').trim().toLowerCase();
    var tierEl = $('catalogTierSelect');
    state.tier = (tierEl && tierEl.value) || '';

    var items = state.items.filter(function (it) {
      if (!itemInBucket(it, state.bucket)) return false;
      if (state.tier && String(it.provisional_tier) !== state.tier) return false;
      if (q) {
        var hay = (it.title + ' ' + it.slug + ' ' + it.id).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var sortEl = $('catalogSort');
    var sort = (sortEl && sortEl.value) || 'title';
    state.sort = sort;
    if (sort === 'tier') {
      var order = { A: 0, B: 1, C: 2 };
      items.sort(function (a, b) {
        var ta = order[a.provisional_tier] != null ? order[a.provisional_tier] : 9;
        var tb = order[b.provisional_tier] != null ? order[b.provisional_tier] : 9;
        if (ta !== tb) return ta - tb;
        return (a.title || '').localeCompare(b.title || '', 'id');
      });
    } else {
      items.sort(function (a, b) {
        return (a.title || '').localeCompare(b.title || '', 'id');
      });
    }

    state.filtered = items;
    state.page = 1;
    render();
  }

  function renderMeta() {
    var meta = $('catalogMainMeta');
    if (!meta) return;
    var s = state.summary;
    var n = state.filtered.length;
    if (!s) {
      meta.textContent = '';
      return;
    }
    if (n === s.count) {
      meta.textContent =
        s.count + ' dokumen hukum siap Anda telusuri.';
    } else {
      meta.textContent =
        n + ' dokumen sesuai filter Anda — dari ' + s.count + ' judul dalam katalog.';
    }
  }

  function renderPagination() {
    var el = $('catalogMainPagination');
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
    prev.className = 'doc-cat-pagebtn';
    prev.textContent = 'Sebelumnya';
    prev.disabled = state.page <= 1;
    prev.addEventListener('click', function () {
      state.page--;
      render();
    });

    var info = document.createElement('span');
    info.className = 'doc-cat-pageinfo';
    info.textContent = 'Halaman ' + state.page + ' / ' + pages;

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'doc-cat-pagebtn';
    next.textContent = 'Berikutnya';
    next.disabled = state.page >= pages;
    next.addEventListener('click', function () {
      state.page++;
      render();
    });

    el.appendChild(prev);
    el.appendChild(info);
    el.appendChild(next);
  }

  function renderGrid() {
    var grid = $('catalogMainGrid');
    if (!grid) return;

    var fmt = window.SepakateePricing && window.SepakateePricing.formatIdr;
    var tierPrice =
      window.SepakateePricing && window.SepakateePricing.priceForTierLetter;

    var total = state.filtered.length;
    var ps = state.pageSize;
    var pages = Math.max(1, Math.ceil(total / ps));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * ps;
    var slice = state.filtered.slice(start, start + ps);

    if (!slice.length) {
      grid.innerHTML =
        '<p class="doc-cat-empty">Tidak ada dokumen yang cocok. Ubah filter atau kata kunci.</p>';
      return;
    }

    var html = slice
      .map(function (it) {
        var tier = it.provisional_tier || 'C';
        var chipLabel = escapeHtml(paketChipText(tier));
        var price =
          fmt && tierPrice ? fmt(tierPrice(tier)) : '—';
        var notary = it.flags && it.flags.requires_notary;
        var href = escapeHtml(itemHref(it));
        var cta = escapeHtml(itemCtaLabel());
        return (
          '<a class="doc-card doc-card--tier-' +
          escapeHtml(String(tier).toLowerCase()) +
          '" href="' +
          href +
          '">' +
          '<span class="doc-card__rail" aria-hidden="true"></span>' +
          '<div class="doc-card__body">' +
          '<svg class="doc-card__deco" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
          '<div class="doc-card__chips">' +
          '<span class="doc-chip doc-chip--tier-' +
          escapeHtml(String(tier).toLowerCase()) +
          '">' +
          chipLabel +
          '</span>' +
          '<span class="doc-chip">' +
          escapeHtml(familyLabel(it.family)) +
          '</span>' +
          (notary ? '<span class="doc-chip doc-chip--notary">Notaris</span>' : '') +
          '</div>' +
          '<h3 class="doc-card__title">' +
          escapeHtml(formatTitle(it.title)) +
          '</h3>' +
          '<p class="doc-card__price">Mulai dari <strong>' +
          escapeHtml(price) +
          '</strong> <span class="doc-card__hint">per dokumen</span></p>' +
          '<span class="doc-card__cta-btn">' +
          cta +
          '</span>' +
          '</div></a>'
        );
      })
      .join('');

    grid.innerHTML = html;
  }

  function render() {
    renderMeta();
    renderPagination();
    renderGrid();
  }

  function initTabs() {
    var tabs = document.querySelectorAll('.doc-cat-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        state.bucket = tab.getAttribute('data-bucket') || 'all';
        applyFilters();
      });
    });
  }

  function syncHeroSearch() {
    var hero = $('templateSearch');
    var main = $('catalogMainSearch');
    if (!hero || !main) return;
    hero.addEventListener('input', function () {
      main.value = hero.value;
      applyFilters();
    });
    main.addEventListener('input', function () {
      hero.value = main.value;
    });
  }

  function scrollToCatalog() {
    var sec = $('katalog-dokumen');
    if (!sec) return;
    var headerOffset = 80;
    var y = sec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function init() {
    if (!$('catalogMainGrid')) return;

    initTabs();
    syncHeroSearch();

    var hero = $('templateSearch');
    if (hero) {
      hero.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          scrollToCatalog();
        }
      });
    }

    var mainSearch = $('catalogMainSearch');
    if (mainSearch) mainSearch.addEventListener('input', applyFilters);
    var tierSel = $('catalogTierSelect');
    if (tierSel) tierSel.addEventListener('change', applyFilters);
    var sortEl = $('catalogSort');
    if (sortEl) sortEl.addEventListener('change', applyFilters);
    var sizeEl = $('catalogPageSize');
    if (sizeEl)
      sizeEl.addEventListener('change', function () {
        state.pageSize = parseInt(sizeEl.value, 10) || 24;
        state.page = 1;
        render();
      });

    function loadCatalogData() {
      var emb =
        typeof window !== 'undefined' && window.__SEPAKATEE_CATALOG__;
      return fetch(JSON_URL)
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
        applyFilters();
      })
      .catch(function (err) {
        console.error(err);
        var grid = $('catalogMainGrid');
        if (grid) {
          grid.innerHTML =
            '<p class="doc-cat-empty doc-cat-empty--err">Tidak dapat memuat daftar dokumen. Muat ulang halaman atau coba lagi sebentar lagi.</p>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
