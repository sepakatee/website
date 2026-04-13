/**
 * Main template catalog on index.html — sidebar subjects, card grid with unique imagery.
 * Requires SepakateePricing (pricing.js).
 * Prefers fetch(data/catalog-inventory.json); falls back to window.__SEPAKATEE_CATALOG__ (bundle).
 */
(function () {
  'use strict';

  var JSON_URL = 'data/catalog-inventory.json';
  var STOCK_POOL_URL = 'data/catalog-stock-pool.json';
  var PRODUCT_PAGE = 'dokumen/';

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
    subject: 'all',
    tier: '',
    page: 1,
    pageSize: 48,
    sort: 'title',
    /** @type {Record<string, string>|null} */
    imageById: null,
    /** @type {Record<string, { meta_description?: string }>} */
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

  function familyLabel(key) {
    return FAMILY_LABELS[key] || key || '—';
  }

  function itemInBucket(it, bucket) {
    var fams = BUCKET_FAMILIES[bucket];
    if (!fams) return true;
    return fams.indexOf(it.family) !== -1;
  }

  function titleIsAddendum(t) {
    return /\baddendum\b/i.test(t || '');
  }

  function itemMatchesTabKontrakBisnis(it) {
    var slug = it.premium_category_slug;
    if (slug === 'perjanjian-ketenagakerjaan' || slug === 'perjanjian-sewa-menyewa') return false;
    return true;
  }

  function itemMatchesTabKepemilikanSaham(it) {
    var slug = it.premium_category_slug;
    if (slug === 'perjanjian-perusahaan' || slug === 'perjanjian-seputar-keuangan-usaha') return true;
    var t = (it.title || '').toLowerCase();
    return /\b(saham|rups|obligasi|pemegang saham|dividen|modal disetor|warrant|emiten)\b/i.test(t);
  }

  function itemMatchesTabKetenagakerjaan(it) {
    if (it.premium_category_slug === 'perjanjian-ketenagakerjaan') return true;
    return legacyItemMatchesSubject(it, 'ketenagakerjaan');
  }

  function itemMatchesTabTataKelola(it) {
    if (it.premium_category_slug === 'tambahan-dan-perubahan-perjanjian') return true;
    if (it.flags && it.flags.corporate) return true;
    var t = (it.title || '').toLowerCase();
    return /\b(notulen|rapat umum|dewan komisaris|direksi|perseroan|badan hukum|yayasan|koperasi)\b/i.test(t);
  }

  function itemMatchesTabLainnya(it) {
    if (it.family === 'berita_acara' || it.family === 'akta_notaris' || it.family === 'lainnya') return true;
    if (it.premium_category_slug === 'perjanjian-kerja-sama-fotografi') return true;
    return false;
  }

  /** Filter utama: folder Perjanjian (premium_category_slug). */
  function itemMatchesSubject(it, subjectId) {
    if (!subjectId || subjectId === 'all') return true;
    if (subjectId === 'tab-kontrak-bisnis') return itemMatchesTabKontrakBisnis(it);
    if (subjectId === 'tab-kepemilikan-saham') return itemMatchesTabKepemilikanSaham(it);
    if (subjectId === 'tab-ketenagakerjaan') return itemMatchesTabKetenagakerjaan(it);
    if (subjectId === 'tab-tata-kelola') return itemMatchesTabTataKelola(it);
    if (subjectId === 'tab-lainnya') return itemMatchesTabLainnya(it);
    if (it.premium_category_slug) {
      return it.premium_category_slug === subjectId;
    }
    return legacyItemMatchesSubject(it, subjectId);
  }

  function legacyItemMatchesSubject(it, subjectId) {
    if (it.family === 'akta_notaris' && subjectId !== 'akta') return false;
    var t = (it.title || '').toLowerCase();
    var f = it.flags || {};
    switch (subjectId) {
      case 'addendum':
        return titleIsAddendum(t);
      case 'bisnis_kontrak':
        return itemInBucket(it, 'perjanjian_kontrak');
      case 'properti':
        return (
          f.property === true ||
          /sewa|menyewa|tanah|bangunan|gedung|properti|rusun|apartemen|rumah|ppjb|jual\s*beli\s*tanah|jual beli tanah|kontraktor|pembangunan|konter|kios|ruko|perumahan/i.test(
            t
          )
        );
      case 'ketenagakerjaan':
        return (
          f.employment === true ||
          /phk|pkwt|pkwtt|kerja|karyawan|pegawai|buruh|tenaga kerja|honor|outsourcing|hubungan kerja|pekerja/i.test(t)
        );
      case 'korporasi':
        return (
          f.corporate === true ||
          /\b(pt|cv|rups|dewan komisaris|direksi|perseroan|badan hukum|yayasan|koperasi|persero)\b/i.test(t)
        );
      case 'kuasa':
        return itemInBucket(it, 'kuasa');
      case 'pernyataan':
        return itemInBucket(it, 'pernyataan');
      case 'berita':
        return itemInBucket(it, 'berita');
      case 'akta':
        return itemInBucket(it, 'akta');
      case 'hutang':
        if (titleIsAddendum(t)) return false;
        return /hutang|piutang|pinjaman|pengakuan|cicilan|faktur|kredit|jaminan|berhutang|utang|gadai|gadaian/i.test(t);
      case 'rahasia':
        return /nda|kerahasiaan|rahasia|non\s*disclosure|data\s*pribadi|perlindungan\s*data/i.test(t);
      case 'lainnya':
        if (titleIsAddendum(t)) return false;
        return itemInBucket(it, 'lainnya');
      default:
        return true;
    }
  }

  function itemHref(it) {
    return PRODUCT_PAGE + '?id=' + encodeURIComponent(it.id);
  }

  function paketChipText(tierLetter) {
    var P = typeof window !== 'undefined' && window.SepakateePaket;
    if (P && P.metaForCatalog) return P.metaForCatalog(tierLetter).chip;
    if (P && P.meta) return P.meta(tierLetter).chip;
    return 'Paket';
  }

  function itemCtaLabel() {
    return 'Lihat detail';
  }

  /**
   * Map judul dokumen → kunci pool gambar (Unsplash per topik). Urutan: spesifik dulu (BANK, SAHAM…).
   */
  function primaryImageKey(it) {
    if (it.family === 'berita_acara') return 'meeting';
    if (it.family === 'surat_pernyataan') return 'documents';
    var t = ' ' + (it.title || '').toUpperCase() + ' ';
    var f = it.flags || {};
    var rules = [
      { key: 'addendum', re: /\bADDENDUM\b/ },
      { key: 'bank', re: /\bBANK\b|PERBANKAN|KREDIT\s*USAHA|KREDIT\s*MIKRO|\bKUR\b|TABUNGAN|DEPOSITO|GIRO|\bATM\b|REKENING\s*BANK|KANTOR\s*BANK|TELLER/ },
      { key: 'saham', re: /\bSAHAM\b|OBLIGASI|EMITEN|\bRUPS\b|PEMEGANG\s*SAHAM|DIVIDEN|MODAL\s*SAHAM|MODAL\s*SETOR|\bIPO\b|\bESOP\b|WARRANT|KONVERSI\s*SAHAM|LEMBAR\s*SAHAM/ },
      { key: 'valas', re: /VALAS|DEVISA|VALUTA|FOREX|MATA\s+UANG\s+ASING|\bDOLLAR\b|\bEURO\b|KURS(\s+MATA)?/ },
      {
        key: 'legal',
        re: /\bAKTA\b|NOTARIS|PPAT|PENGADILAN|GUGAT|PERKARA|SITA|EKSEKUSI|HIPOTIK|WARIS|WASIAT|TESTAMENT/,
      },
      {
        key: 'hutang',
        re: /GADAI|GADAIAN|HUTANG|PIUTANG|PINJAMAN|PENGAKUAN|PENAGIH|CICILAN|UTANG\s*PIUTANG|WANPRESTASI/,
      },
      { key: 'automotive', re: /BENGKEL|\bMOBIL\b|\bMOTOR\b|KENDARAAN|OTOMOTIF|VELG|\bBAN\b|KAPAL|PESAWAT|ARMADA|KENDARAAN\s*BERMOTOR/ },
      {
        key: 'property',
        re: /SEWA|MENYEWA|TANAH|BANGUNAN|RUKO|RUMAH|APARTEMEN|KONTRAKAN|RUSUN|PERUMAHAN|PPJB|KIOS|KONTER|GEDUNG|HAK\s*MILIK|SERTIFIKAT/,
      },
      {
        key: 'employment',
        re: /PHK|PKWT|PKWTT|KARYAWAN|PEGAWAI|BURUH|TENAGA\s*KERJA|HUBUNGAN\s*KERJA|OUTSOURCING|UPAH|LEMBUR|MAGANG\s*KERJA|SPK\s*KERJA/,
      },
      { key: 'nda', re: /NDA|KERAHASIAAN|RAHASIA|NON\s*-?\s*DISCLOSURE|DATA\s*PRIBADI|PERLINDUNGAN\s*DATA/ },
      {
        key: 'corporate',
        re: /DIREKSI|DEWAN\s*KOMISARIS|PERSEROAN|YAYASAN|\bPT\b|\bCV\b|KOPERASI|BADAN\s*HUKUM|NOTULEN|LIQUIDASI\s*PT/,
      },
      { key: 'kuasa', re: /KUASA/ },
      { key: 'commerce', re: /JUAL\s*BELI|PERDAGANGAN|DISTRIBUSI|SUPPLIER|\bAGEN\b|WARALABA|FRANCHISE|DAGANG|KOMISI|EKSPOR|IMPOR/ },
      { key: 'construction', re: /KONSTRUKSI|PEMBANGUNAN|PROYEK|BORONGAN|PELAKSANA\s*PEKERJAAN|PENGEMBANG/ },
      { key: 'commerce', re: /GUDANG|LOGISTIK|PENGIRIMAN|PENGANGKUTAN|EKSPEDISI|WAREHOUSE/ },
      { key: 'commerce', re: /TOKO|RETAIL|MINIMARKET|WARUNG/ },
      { key: 'medical', re: /RUMAH\s*SAKIT|\bRS\b|KLINIK|DOKTER|REKAM\s*MEDIS|MEDIS|PASIEN|APOTEK/ },
      { key: 'tech', re: /SOFTWARE|APLIKASI|WEBSITE|DOMAIN|HOSTING|LISENS(I|Y)|\bIT\b|SISTEM\s*INFORMASI|TEKNOLOGI\s*INFORMASI/ },
    ];
    var i;
    for (i = 0; i < rules.length; i++) {
      if (rules[i].re.test(t)) return rules[i].key;
    }
    if (f.property === true) return 'property';
    if (f.employment === true) return 'employment';
    if (f.corporate === true) return 'corporate';
    if (it.family === 'akta_notaris') return 'legal';
    if (it.family === 'surat_kuasa' || it.family === 'kuasa_other') return 'kuasa';
    return 'general';
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

  /** Fallback urutan pool jika pool utama kosong/habis — hindari Picsum acak yang tidak relevan. */
  var IMAGE_FALLBACK_EXTRA = {
    addendum: ['documents', 'legal', 'hutang'],
    hutang: ['documents', 'legal', 'bank'],
    bank: ['documents', 'legal'],
    saham: ['corporate', 'documents', 'bank'],
    valas: ['bank', 'hutang', 'documents'],
    automotive: ['commerce', 'documents'],
    property: ['construction', 'corporate', 'documents'],
    employment: ['meeting', 'corporate', 'documents'],
    nda: ['tech', 'documents'],
    corporate: ['meeting', 'documents', 'legal'],
    legal: ['documents', 'meeting'],
    kuasa: ['legal', 'documents'],
    commerce: ['corporate', 'documents'],
    construction: ['property', 'documents'],
    medical: ['documents'],
    tech: ['corporate', 'documents'],
    meeting: ['corporate', 'documents'],
    documents: ['meeting', 'legal'],
    general: ['documents', 'meeting', 'legal', 'corporate'],
  };

  var IMAGE_FALLBACK_TAIL = ['documents', 'legal', 'meeting', 'corporate', 'commerce', 'hutang'];

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

  function shortenCatalogBlurb(text, maxLen) {
    maxLen = maxLen || 132;
    var s = String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/\s*Sepakatee:\s*/gi, ' ')
      .trim();
    if (s.length <= maxLen) return s;
    var cut = s.slice(0, maxLen);
    var dot = cut.lastIndexOf('.');
    if (dot > 50) return cut.slice(0, dot + 1);
    var sp = cut.lastIndexOf(' ');
    if (sp > 40) cut = cut.slice(0, sp);
    return cut.trim() + '…';
  }

  function itemBlurb(it) {
    var seo = state.seoById && state.seoById[it.id];
    if (seo && seo.meta_description) return shortenCatalogBlurb(seo.meta_description, 140);

    var title = formatTitle(it.title);
    var shortT = title.length > 70 ? title.slice(0, 67).trim() + '…' : title;
    switch (it.family) {
      case 'berita_acara':
        return (
          'Berita acara untuk ' +
          shortT +
          '. Format Word (.docx); lengkapi tanggal, hadirin, dan ringkasan kejadian atau keputusan.'
        );
      case 'surat_kuasa':
      case 'kuasa_other':
        return (
          'Surat kuasa terkait ' +
          shortT +
          '. Template Word: identitas pemberi/penerima kuasa dan batas waktu serta ruang lingkup.'
        );
      case 'surat_pernyataan':
        return 'Surat pernyataan mengenai ' + shortT + '. Sesuaikan isi dengan fakta, lalu tandatangani.';
      case 'akta_notaris':
        return (
          'Kerangka draf untuk ' +
          shortT +
          '. Format Word; finalisasi teks dan akta resmi bersama notaris/PPAT berwenang.'
        );
      case 'kontrak':
      case 'perjanjian':
      case 'surat_perjanjian':
        return (
          'Perjanjian tertulis untuk ' +
          shortT +
          '. Dokumen Word (.docx) yang dapat diedit—hak, kewajiban, dan sanksi sesuai kebutuhan.'
        );
      case 'lainnya':
      default:
        return (
          'Dokumen hukum: ' +
          shortT +
          '. File Word (.docx); susun identitas pihak dan detail sesuai situasi Anda.'
        );
    }
  }

  function applyFilters() {
    var qEl = $('catalogMainSearch') || $('templateSearch');
    var q = ((qEl && qEl.value) || '').trim().toLowerCase();
    var tierEl = $('catalogTierSelect');
    state.tier = (tierEl && tierEl.value) || '';

    var items = state.items.filter(function (it) {
      if (!itemMatchesSubject(it, state.subject)) return false;
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
      meta.textContent = s.count + ' template Perjanjian premium siap Anda telusuri.';
    } else {
      meta.textContent =
        n + ' dokumen sesuai filter Anda — dari ' + s.count + ' judul dalam katalog Perjanjian.';
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

  function getCatalogGrid() {
    return $('catalogMainGrid') || $('templateGrid');
  }

  function renderGrid() {
    var grid = getCatalogGrid();
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
        '<p class="doc-cat-empty">Tidak ada dokumen yang cocok. Ubah subjek, filter, atau kata kunci.</p>';
      return;
    }

    var imgMap = state.imageById || {};

    var html = slice
      .map(function (it) {
        var tier = it.provisional_tier || 'C';
        var chipLabel = escapeHtml(paketChipText(tier));
        var price =
          fmt && tierPrice ? fmt(tierPrice(tier)) : '—';
        var href = escapeHtml(itemHref(it));
        var cta = escapeHtml(itemCtaLabel());
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
          '<span class="catalog-cover__badge">' +
          chipLabel +
          '</span>' +
          '</div>' +
          '<h3 class="catalog-cover__title">' +
          title +
          '</h3>' +
          '<p class="catalog-cover__desc">' +
          desc +
          '</p>' +
          '<div class="catalog-cover__meta">' +
          '<span class="catalog-cover__price">Mulai <strong>' +
          escapeHtml(price) +
          '</strong></span>' +
          '<span class="catalog-cover__cta">' +
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

  function initSubjectNav() {
    var nav = $('catalogSubjectNav');
    if (!nav || nav.dataset.bound) return;
    nav.dataset.bound = '1';
    nav.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('[data-subject]') : null;
      if (!btn) return;
      setSubject(btn.getAttribute('data-subject') || 'all');
      applyFilters();
    });
  }

  function syncHeroSearch() {
    var hero = $('templateSearch');
    var main = $('catalogMainSearch');
    if (!hero) return;
    if (main) {
      hero.addEventListener('input', function () {
        main.value = hero.value;
        applyFilters();
      });
      main.addEventListener('input', function () {
        hero.value = main.value;
      });
    } else {
      hero.addEventListener('input', applyFilters);
    }
  }

  function scrollToCatalog() {
    var sec = $('katalog-dokumen');
    if (!sec) return;
    var headerOffset = 80;
    var y = sec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /** Marketing deep links (index.html pills / hash) → subject id */
  var HASH_TO_SUBJECT = {
    ketenagakerjaan: 'tab-ketenagakerjaan',
    'kontrak bisnis': 'tab-kontrak-bisnis',
    'perjanjian sewa': 'perjanjian-sewa-menyewa',
  };

  var FEATURED_PREMIUM_SLUG = 'perjanjian-perusahaan';

  function renderPremiumCategoryNav(summary) {
    var nav = $('catalogSubjectNav');
    if (!nav) return;
    var cats = summary && summary.premium_categories;
    nav.innerHTML = '';

    function addBtn(slug, label, isActive, featured) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat-sidebar__btn' + (isActive ? ' is-active' : '');
      if (featured) b.className += ' cat-sidebar__btn--featured';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      b.setAttribute('data-subject', slug);
      b.textContent = label;
      nav.appendChild(b);
    }

    addBtn('all', 'Semua template', true, false);
    if (cats && cats.length) {
      cats.forEach(function (c) {
        var feat = c.slug === FEATURED_PREMIUM_SLUG;
        addBtn(c.slug, c.label, false, feat);
      });
    }
  }

  function normalizeHashFragment(raw) {
    if (!raw) return '';
    var h = String(raw).replace(/^#/, '');
    try {
      h = decodeURIComponent(h);
    } catch (e) {}
    return h
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function setSubject(subjectId) {
    var sid = subjectId || 'all';
    state.subject = sid;
    var nav = $('catalogSubjectNav');
    if (nav) {
      var btns = nav.querySelectorAll('[data-subject]');
      btns.forEach(function (b) {
        var match = b.getAttribute('data-subject') === sid;
        b.classList.toggle('is-active', match);
        b.setAttribute('aria-selected', match ? 'true' : 'false');
      });
    }
    document.querySelectorAll('.category-tab[data-subject]').forEach(function (b) {
      var match = b.getAttribute('data-subject') === sid;
      b.classList.toggle('is-active', match);
    });
  }

  function applyHashFromLocation() {
    var norm = normalizeHashFragment(typeof location !== 'undefined' ? location.hash : '');
    if (!norm) return false;
    if (norm === 'katalog-dokumen') {
      scrollToCatalog();
      return true;
    }
    var subj = HASH_TO_SUBJECT[norm];
    if (!subj) return false;
    setSubject(subj);
    applyFilters();
    scrollToCatalog();
    return true;
  }

  function initCategoryTabs() {
    var tabs = document.querySelectorAll('.category-tab[data-subject]');
    if (!tabs.length || document.body.dataset.categoryTabsBound) return;
    document.body.dataset.categoryTabsBound = '1';
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSubject(btn.getAttribute('data-subject') || 'all');
        applyFilters();
      });
    });
  }

  function init() {
    if (!getCatalogGrid()) return;

    var seoG = typeof window !== 'undefined' && window.__SEPAKATEE_CATALOG_SEO__;
    state.seoById = seoG && seoG.by_id && typeof seoG.by_id === 'object' ? seoG.by_id : {};

    if (!$('catalogMainSearch') && $('templateSearch')) {
      state.pageSize = 999;
    }

    initSubjectNav();
    initCategoryTabs();
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
    if (sizeEl) {
      state.pageSize = parseInt(sizeEl.value, 10) || state.pageSize;
      sizeEl.addEventListener('change', function () {
        state.pageSize = parseInt(sizeEl.value, 10) || 24;
        state.page = 1;
        render();
      });
    }

    function loadCatalogData() {
      var emb = typeof window !== 'undefined' && window.__SEPAKATEE_CATALOG__;
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

    Promise.all([loadCatalogData(), loadStockPool()])
      .then(function (pair) {
        var data = pair[0];
        var poolJson = pair[1];
        state.summary = data.summary;
        state.items = data.items || [];
        renderPremiumCategoryNav(data.summary);
        state.imageById = buildImageByIdMap(state.items, poolJson);
        state.filtered = state.items.slice();
        applyFilters();

        try {
          applyHashFromLocation();
        } catch (eHash) {}

        try {
          var _params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
          var _qs = (_params.get('search') || _params.get('q') || '').trim();
          if (_qs) {
            var _mainS = $('catalogMainSearch');
            var _heroS = $('templateSearch');
            if (_mainS) _mainS.value = _qs;
            if (_heroS) _heroS.value = _qs;
            applyFilters();
            scrollToCatalog();
          }
        } catch (eSync) {}
      })
      .catch(function (err) {
        console.error(err);
        var grid = getCatalogGrid();
        if (grid) {
          grid.innerHTML =
            '<p class="doc-cat-empty doc-cat-empty--err">Tidak dapat memuat daftar dokumen. Muat ulang halaman atau coba lagi sebentar lagi.</p>';
        }
      });

    window.addEventListener('hashchange', function () {
      if (!getCatalogGrid() || !state.items || !state.items.length) return;
      try {
        applyHashFromLocation();
      } catch (eHc) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
