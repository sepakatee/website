/**
 * Template Praktis (Perintilan) — katalog terpisah, harga tetap Rp50.000.
 * Membutuhkan SepakateePricing.formatIdr; data: data/perintilan-inventory.json.
 */
(function () {
  'use strict';

  var JSON_URL = 'data/perintilan-inventory.json';
  var STOCK_POOL_URL = 'data/catalog-stock-pool.json';
  var PRODUCT_PAGE = 'dokumen/index.html';
  var PRACTIS_PRICE_IDR = 50000;

  var state = {
    items: [],
    summary: null,
    filtered: [],
    subject: 'all',
    page: 1,
    pageSize: 48,
    sort: 'title',
    imageById: null,
    seoById: {},
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

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  function picsumSeedFromId(id) {
    var s = String(id || '');
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = (h * 33) ^ s.charCodeAt(i);
    }
    return 'sk' + (h >>> 0).toString(16);
  }

  function formatTitle(s) {
    if (!s) return '';
    var t = String(s).toLowerCase().trim();
    return t.replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function itemHref(it) {
    return PRODUCT_PAGE + '?id=' + encodeURIComponent(it.id);
  }

  function itemBlurb(it) {
    var title = formatTitle(it.title);
    var shortT = title.length > 70 ? title.slice(0, 67).trim() + '…' : title;
    return (
      'Template praktis untuk ' +
      shortT +
      '. File Word (.docx) siap edit — cocok untuk kebutuhan cepat dan operasional harian.'
    );
  }

  function primaryImageKey(it) {
    if (it.family === 'berita_acara') return 'meeting';
    if (it.family === 'surat_pernyataan') return 'documents';
    var t = ' ' + (it.title || '').toUpperCase() + ' ';
    var rules = [
      { key: 'legal', re: /\bAKTA\b|NOTARIS|PPAT|PENGADILAN/ },
      { key: 'hutang', re: /GADAI|HUTANG|PIUTANG|PINJAMAN/ },
      { key: 'property', re: /SEWA|TANAH|RUMAH|GEDUNG/ },
      { key: 'employment', re: /KARYAWAN|PEGAWAI|KERJA/ },
      { key: 'corporate', re: /SAHAM|PT\b|DIREKSI/ },
      { key: 'kuasa', re: /KUASA/ },
      { key: 'commerce', re: /JUAL\s*BELI|DAGANG/ },
    ];
    var i;
    for (i = 0; i < rules.length; i++) {
      if (rules[i].re.test(t)) return rules[i].key;
    }
    return 'documents';
  }

  function hashPickString(salt) {
    var s = String(salt || '');
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = (h * 33) ^ s.charCodeAt(i);
    }
    return h >>> 0;
  }

  function pickFromArray(arr, salt) {
    if (!arr || !arr.length) return null;
    var idx = hashPickString(salt) % arr.length;
    return arr[idx];
  }

  function dedupeChain(seq) {
    var seen = {};
    var out = [];
    var i;
    for (i = 0; i < seq.length; i++) {
      var x = seq[i];
      if (!x || seen[x]) continue;
      seen[x] = 1;
      out.push(x);
    }
    return out;
  }

  var IMAGE_FALLBACK_EXTRA = {
    legal: ['documents', 'meeting'],
    hutang: ['documents', 'legal'],
    property: ['construction', 'documents'],
    employment: ['meeting', 'corporate', 'documents'],
    corporate: ['meeting', 'documents', 'legal'],
    kuasa: ['legal', 'documents'],
    commerce: ['corporate', 'documents'],
    meeting: ['corporate', 'documents'],
    documents: ['meeting', 'legal'],
  };

  var IMAGE_FALLBACK_TAIL = ['documents', 'legal', 'meeting', 'corporate'];

  function resolveImageUrl(pools, generalArr, key, id) {
    var chain = [key].concat(IMAGE_FALLBACK_EXTRA[key] || []).concat(IMAGE_FALLBACK_TAIL);
    chain = dedupeChain(chain);
    var i;
    for (i = 0; i < chain.length; i++) {
      var pk = chain[i];
      var arr = pools[pk];
      var url = pickFromArray(arr, id + '|img|' + pk);
      if (url) return url;
    }
    return pickFromArray(generalArr, id + '|img|general');
  }

  function buildImageByIdMap(items, poolData) {
    var pools = {};
    var general = [];
    if (poolData && poolData.version === 2 && poolData.pools) {
      pools = poolData.pools;
      general = (poolData.general || []).slice();
    } else if (poolData && poolData.urls && poolData.urls.length) {
      general = poolData.urls.slice();
    }

    var sorted = items.slice().sort(function (a, b) {
      return (a.id || '').localeCompare(b.id || '', 'en');
    });

    var map = {};
    sorted.forEach(function (it) {
      var k = primaryImageKey(it);
      var url = resolveImageUrl(pools, general, k, it.id);
      if (!url) {
        url = 'https://picsum.photos/seed/' + picsumSeedFromId(it.id) + '/640/853';
      }
      map[it.id] = url;
    });
    return map;
  }

  function loadStockPool() {
    return fetch(STOCK_POOL_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('pool');
        return r.json();
      })
      .catch(function () {
        return { version: 0, pools: {}, general: [] };
      });
  }

  function itemMatchesFamily(it, subjectId) {
    if (!subjectId || subjectId === 'all') return true;
    return it.family === subjectId;
  }

  function applyFilters() {
    var qEl = $('tpCatalogSearch');
    var q = ((qEl && qEl.value) || '').trim().toLowerCase();

    var items = state.items.filter(function (it) {
      if (!itemMatchesFamily(it, state.subject)) return false;
      if (q) {
        var hay = (it.title + ' ' + it.slug + ' ' + it.id).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var sortEl = $('tpCatalogSort');
    var sort = (sortEl && sortEl.value) || 'title';
    state.sort = sort;
    items.sort(function (a, b) {
      return (a.title || '').localeCompare(b.title || '', 'id');
    });

    state.filtered = items;
    state.page = 1;
    render();
  }

  function renderMeta() {
    var meta = $('tpCatalogMeta');
    if (!meta) return;
    var s = state.summary;
    var n = state.filtered.length;
    if (!s) {
      meta.textContent = '';
      return;
    }
    if (n === s.count) {
      meta.textContent = s.count + ' template praktis siap ditelusuri.';
    } else {
      meta.textContent =
        n + ' dokumen sesuai filter — dari ' + s.count + ' judul dalam koleksi.';
    }
  }

  function renderPagination() {
    var el = $('tpCatalogPagination');
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
    var grid = $('tpCatalogGrid');
    if (!grid) return;

    var fmt = window.SepakateePricing && window.SepakateePricing.formatIdr;
    var price = fmt ? fmt(PRACTIS_PRICE_IDR) : 'Rp50.000';

    var total = state.filtered.length;
    var ps = state.pageSize;
    var pages = Math.max(1, Math.ceil(total / ps));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * ps;
    var slice = state.filtered.slice(start, start + ps);

    if (!slice.length) {
      grid.innerHTML =
        '<p class="doc-cat-empty">Tidak ada dokumen yang cocok. Ubah kategori atau kata kunci.</p>';
      return;
    }

    var imgMap = state.imageById || {};
    var chipLabel = 'Template Praktis';

    var html = slice
      .map(function (it) {
        var href = escapeHtml(itemHref(it));
        var title = escapeHtml(formatTitle(it.title));
        var desc = escapeHtml(itemBlurb(it));
        var fbPlain = 'https://picsum.photos/seed/' + picsumSeedFromId(it.id) + '/640/853';
        var imgSrc = escapeHtml(imgMap[it.id] || fbPlain);
        var alt = escapeAttr(formatTitle(it.title));
        var fb = escapeHtml(fbPlain);
        return (
          '<a class="catalog-cover" href="' +
          href +
          '">' +
          '<div class="catalog-cover__media">' +
          '<img src="' +
          imgSrc +
          '" alt="' +
          alt +
          '" width="640" height="853" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' +
          fb +
          '\';" />' +
          '<span class="catalog-cover__badge catalog-cover__badge--praktis">' +
          escapeHtml(chipLabel) +
          '</span>' +
          '</div>' +
          '<h3 class="catalog-cover__title">' +
          title +
          '</h3>' +
          '<p class="catalog-cover__desc">' +
          desc +
          '</p>' +
          '<div class="catalog-cover__meta">' +
          '<span class="catalog-cover__price"><strong>' +
          escapeHtml(price) +
          '</strong> / file</span>' +
          '<span class="catalog-cover__cta">Lihat detail</span>' +
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

  function initSubjectNav() {
    var nav = $('tpSubjectNav');
    if (!nav || nav.dataset.bound) return;
    nav.dataset.bound = '1';
    nav.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-subject]') : null;
      if (!btn) return;
      setSubject(btn.getAttribute('data-subject') || 'all');
      applyFilters();
    });
  }

  function setSubject(subjectId) {
    var nav = $('tpSubjectNav');
    var sid = subjectId || 'all';
    state.subject = sid;
    if (!nav) return;
    var btns = nav.querySelectorAll('[data-subject]');
    btns.forEach(function (b) {
      var match = b.getAttribute('data-subject') === sid;
      b.classList.toggle('is-active', match);
      b.setAttribute('aria-selected', match ? 'true' : 'false');
    });
  }

  function renderPraktisCategoryNav(summary) {
    var nav = $('tpSubjectNav');
    if (!nav) return;
    var cats = summary && summary.praktis_categories;
    nav.innerHTML = '';

    function addBtn(slug, label, isActive) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat-sidebar__btn' + (isActive ? ' is-active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      b.setAttribute('data-subject', slug);
      b.textContent = label;
      nav.appendChild(b);
    }

    addBtn('all', 'Semua kategori', true);
    if (cats && cats.length) {
      cats.forEach(function (c) {
        addBtn(c.slug, c.label + ' (' + c.count + ')', false);
      });
    }
  }

  function loadPraktisData() {
    var emb = typeof window !== 'undefined' && window.__SEPAKATEE_PERINTILAN_CATALOG__;
    return fetch(JSON_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .catch(function () {
        if (emb && emb.items && emb.items.length) return emb;
        throw new Error('no praktis catalog');
      });
  }

  function init() {
    if (!$('tpCatalogGrid')) return;

    initSubjectNav();

    var mainSearch = $('tpCatalogSearch');
    if (mainSearch) mainSearch.addEventListener('input', applyFilters);
    var sizeEl = $('tpCatalogPageSize');
    if (sizeEl) {
      state.pageSize = parseInt(sizeEl.value, 10) || state.pageSize;
      sizeEl.addEventListener('change', function () {
        state.pageSize = parseInt(sizeEl.value, 10) || 24;
        state.page = 1;
        render();
      });
    }

    Promise.all([loadPraktisData(), loadStockPool()])
      .then(function (pair) {
        var data = pair[0];
        var poolJson = pair[1];
        state.summary = data.summary;
        state.items = data.items || [];
        renderPraktisCategoryNav(data.summary);
        state.imageById = buildImageByIdMap(state.items, poolJson);
        state.filtered = state.items.slice();
        applyFilters();
      })
      .catch(function (err) {
        console.error(err);
        var grid = $('tpCatalogGrid');
        if (grid) {
          grid.innerHTML =
            '<p class="doc-cat-empty doc-cat-empty--err">Tidak dapat memuat koleksi Template Praktis. Muat ulang halaman.</p>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
