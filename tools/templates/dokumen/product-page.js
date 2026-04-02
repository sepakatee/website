/**
 * Product detail for catalog items: ?id= from catalog-inventory.
 */
(function () {
  'use strict';

  /**
   * Same guarantees as _shared/catalog-shim.js — runs inside this file so ad blockers
   * that block pricing.js / paket-commercial.js / catalog-shim.js cannot break the page.
   * Keep tier amounts in sync with _shared/pricing.js.
   */
  function ensureCatalogGlobals() {
    var g = typeof window !== 'undefined' ? window : globalThis;
    var TIER_PRICE_IDR = { A: 250000, B: 199000, C: 149000 };
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

    var P = g.SepakateePricing;
    if (!P) g.SepakateePricing = P = {};
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

    function letter(t) {
      return String(t == null ? 'C' : t).toUpperCase();
    }

    var K = g.SepakateePaket;
    if (!K) g.SepakateePaket = K = {};
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
    if (typeof K.metaForCatalog !== 'function') {
      K.metaForCatalog = function (tierLetter) {
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
      };
    }
    if (typeof K.ipaymuFlowKey !== 'function') {
      K.ipaymuFlowKey = function (tierLetter) {
        var L = letter(tierLetter);
        if (L === 'A') return 'catalog-tier-a';
        if (L === 'B') return 'catalog-tier-b';
        return 'catalog-tier-c';
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

  ensureCatalogGlobals();

  var JSON_URL = '../data/catalog-inventory.json';
  var SEO_JSON_URL = '../data/catalog-seo-overrides.json';

  /** Stale or mistaken ?id= values (old links, typos) → canonical catalog id */
  var ID_ALIASES = {
    '62-akta-jual-beli-tanah-bersama-notaris': '82-akta-jual-beli-tanah-bersama-notaris',
  };

  var FAMILY_LABELS = {
    perjanjian: 'Perjanjian',
    kontrak: 'Kontrak',
    surat_kuasa: 'Surat kuasa',
    surat_pernyataan: 'Surat pernyataan',
    berita_acara: 'Berita acara',
    akta_notaris: 'Akta & notaris',
    surat_perjanjian: 'Surat perjanjian',
    kuasa_other: 'Kuasa',
    lainnya: 'Dokumen lainnya',
  };

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
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
  }

  function familyLabel(key) {
    return FAMILY_LABELS[key] || 'Dokumen hukum';
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

  function loadSeoOverrides() {
    var emb =
      typeof window !== 'undefined' &&
      window.__SEPAKATEE_CATALOG_SEO__ &&
      typeof window.__SEPAKATEE_CATALOG_SEO__.by_id === 'object'
        ? window.__SEPAKATEE_CATALOG_SEO__
        : null;
    return fetch(SEO_JSON_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .catch(function () {
        return emb || { version: 1, by_id: {} };
      });
  }

  function clampMeta(s, maxLen) {
    if (!s) return '';
    var t = String(s).trim();
    if (t.length <= maxLen) return t;
    return t.substring(0, maxLen - 1).trim() + '…';
  }

  function setMetaKeywords(content) {
    if (!content) return;
    var kw = document.querySelector('meta[name="keywords"]');
    if (!kw) {
      kw = document.createElement('meta');
      kw.setAttribute('name', 'keywords');
      document.head.appendChild(kw);
    }
    kw.setAttribute('content', content);
  }

  var FAMILY_EMOJI = {
    perjanjian: '📋',
    kontrak: '📝',
    surat_kuasa: '✍️',
    surat_pernyataan: '📜',
    berita_acara: '📑',
    akta_notaris: '⚖️',
    surat_perjanjian: '📋',
    kuasa_other: '✍️',
    lainnya: '📄',
  };

  var CLAUSE_DEFAULTS = {
    perjanjian: [
      'Identitas dan data para pihak',
      'Objek perjanjian',
      'Imbalan, harga, atau jadwal pembayaran',
      'Jangka waktu dan perpanjangan',
      'Hak dan kewajiban masing-masing pihak',
      'Wanprestasi dan pemutusan',
      'Penyelesaian sengketa dan hukum yang berlaku',
      'Ketentuan lain-lain',
    ],
    kontrak: [
      'Ruang lingkup pekerjaan atau layanan',
      'Jadwal, SLA, dan kriteria penerimaan',
      'Harga, termin, dan invoice',
      'Kerahasiaan dan kekayaan intelektual',
      'Jangka waktu dan perpanjangan',
      'Wanprestasi dan ganti rugi',
      'Penyelesaian sengketa',
    ],
    surat_kuasa: [
      'Identitas pemberi dan penerima kuasa',
      'Ruang lingkup kuasa secara spesifik',
      'Batas waktu berlaku kuasa',
      'Larangan substitusi (jika perlu)',
      'Pencabutan kuasa',
      'Tanda tangan dan identitas pendukung',
    ],
    surat_pernyataan: [
      'Identitas yang menyatakan',
      'Fakta atau komitmen yang dinyatakan',
      'Dasar atau konteks pernyataan',
      'Konsekuensi atas kebenaran pernyataan',
      'Tanggal dan tempat',
    ],
    berita_acara: [
      'Waktu, tempat, dan agenda',
      'Pihak yang hadir atau diwakili',
      'Hasil atau temuan yang dicatat',
      'Tindakan lanjutan (jika ada)',
      'Lampiran bukti (foto, daftar, dll.)',
    ],
    akta_notaris: [
      'Identitas pihak dan objek transaksi',
      'Referensi dokumen kepemilikan / bukti',
      'Harga dan mekanisme pembayaran (jika relevan)',
      'Pernyataan para pihak',
      'Penutup menuju akta otentik di notaris',
    ],
    surat_perjanjian: [
      'Identitas para pihak',
      'Objek kesepakatan',
      'Hak dan kewajiban ringkas',
      'Jangka waktu',
      'Pemutusan dan sengketa',
    ],
    kuasa_other: [
      'Pemberi dan penerima kuasa',
      'Uraian kuasa',
      'Batas waktu',
      'Tanda tangan',
    ],
    lainnya: [
      'Identitas pihak terkait',
      'Objek atau maksud dokumen',
      'Jangka waktu atau batas berlaku',
      'Hak dan kewajiban utama',
      'Penyelesaian sengketa',
    ],
  };

  function syncPriceDisplays(priceStr) {
    document.querySelectorAll('[data-price-display]').forEach(function (el) {
      el.textContent = priceStr;
    });
  }

  function emojiForFamily(family) {
    return FAMILY_EMOJI[family] || FAMILY_EMOJI.lainnya;
  }

  function clauseListFor(family, seo) {
    if (seo && seo.clause_items && seo.clause_items.length) return seo.clause_items;
    return CLAUSE_DEFAULTS[family] || CLAUSE_DEFAULTS.lainnya;
  }

  function useCaseList(seo, eduBlock) {
    if (seo && seo.use_case_items && seo.use_case_items.length) return seo.use_case_items;
    var out = [];
    if (seo && seo.summary_points && seo.summary_points.length) {
      out = seo.summary_points.slice();
    } else if (eduBlock && eduBlock.bullets && eduBlock.bullets.length) {
      out = eduBlock.bullets.slice();
    }
    if (out.length) return out;
    return [
      'Ketika Anda membutuhkan bukti tertulis yang konsisten untuk administrasi atau hubungan antar pihak.',
      'Sebelum transaksi atau kerja sama yang membutuhkan kejelasan hak dan kewajiban dasar.',
      'Untuk melengkapi dokumen internal perusahaan atau arsip pribadi yang rapi.',
    ];
  }

  function buildLockedPreviewInnerHtml(displayTitle, fam, notary, seo) {
    seo = seo || {};
    var upper = escapeHtml(displayTitle).toUpperCase();
    var lead =
      seo.preview_intro ||
      'Pratinjau ini menampilkan kerangka isi; teks lengkap dalam file Word (.docx) tersedia setelah pembelian.';
    var lockTitle = seo.lock_title || 'Beli Template untuk Melihat Dokumen Lengkap';
    var lockBody =
      seo.lock_body ||
      'File mencakup pasal-pasal siap edit: identitas pihak, objek, jangka waktu, hak dan kewajiban, wanprestasi, dan penyelesaian sengketa—disesuaikan dengan jenis dokumen ini.';
    var extraNotary = notary
      ? '<p><em>Dokumen terkait akta/notaris wajib disesuaikan dengan notaris atau PPAT yang berwenang.</em></p>'
      : '';
    return (
      '<h3 class="document-title">' +
      upper +
      '</h3>' +
      '<p>' +
      escapeHtml(lead) +
      '</p>' +
      '<p>Pada hari ini, <span class="placeholder-field">[Hari/Tanggal]</span>, bertempat di <span class="placeholder-field">[Kota]</span>, oleh dan antara <span class="placeholder-field">[Pihak Pertama]</span> dan <span class="placeholder-field">[Pihak Kedua]</span> (selanjutnya disebut <strong>Para Pihak</strong>).</p>' +
      '<p>Para Pihak sepakat mengikatkan diri dalam perjanjian dengan pokok ketentuan sebagai berikut.</p>' +
      '<h4>PASAL 1<br>OBJEK</h4>' +
      '<p>Objek perjanjian ini adalah <span class="placeholder-field">[Uraian objek / ruang lingkup]</span> untuk kategori <strong>' +
      escapeHtml(fam) +
      '</strong>.</p>' +
      '<h4>PASAL 2<br>JANGKA WAKTU DAN IMBALAN</h4>' +
      '<p>Jangka waktu berlaku <span class="placeholder-field">[Durasi]</span>. Imbalan atau harga <span class="placeholder-field">[Nominal / skema pembayaran]</span>, dibayarkan sesuai jadwal yang disepakati Para Pihak.</p>' +
      '<h4>PASAL 3<br>HAK DAN KEWAJIBAN</h4>' +
      '<p>Masing-masing pihak berkewajiban melaksanakan prestasi dengan itikad baik. Detail hak dan kewajiban diatur lebih lanjut dalam dokumen lengkap.</p>' +
      extraNotary +
      '<div class="document-lock">' +
      '<div class="lock-overlay"></div>' +
      '<div class="lock-content">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>' +
      '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>' +
      '</svg>' +
      '<h3>' +
      escapeHtml(lockTitle) +
      '</h3>' +
      '<p>' +
      escapeHtml(lockBody) +
      '</p>' +
      '</div></div>'
    );
  }

  function descriptionGridItem(text) {
    return (
      '<div class="description-item">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<polyline points="20 6 9 17 4 12"></polyline>' +
      '</svg>' +
      '<span>' +
      escapeHtml(text) +
      '</span></div>'
    );
  }

  function buildDescriptionMainHtml(displayTitle, familyKey, seo, eduBlock) {
    seo = seo || {};
    var about =
      seo.summary_intro ||
      (eduBlock && eduBlock.paragraphs && eduBlock.paragraphs[0]) ||
      displayTitle +
        ' tersedia sebagai template Word (.docx) dari katalog Sepakatee. Dokumen membantu Anda mencatat kesepakatan atau pernyataan secara tertulis dengan struktur yang jelas.';
    var clauses = clauseListFor(familyKey, seo);
    var uses = useCaseList(seo, eduBlock);
    return (
      '<div class="description-section">' +
      '<h2>Tentang Dokumen Ini</h2>' +
      '<p>' +
      escapeHtml(about) +
      '</p></div>' +
      '<div class="description-section">' +
      '<h3>Klausul yang Dicakup</h3>' +
      '<div class="description-grid">' +
      clauses.map(descriptionGridItem).join('') +
      '</div></div>' +
      '<div class="description-section">' +
      '<h3>Kapan Menggunakan Dokumen Ini?</h3>' +
      '<p class="description-intro">Dokumen ini cocok digunakan untuk:</p>' +
      '<div class="description-grid">' +
      uses.map(descriptionGridItem).join('') +
      '</div></div>'
    );
  }

  function buildArticleHtml(displayTitle, seo, eduBlock, pak) {
    seo = seo || {};
    if (seo.article_html) {
      return seo.article_html;
    }
    var h2 =
      seo.article_title ||
      'Panduan singkat: ' + displayTitle + ' (template Word Sepakatee)';
    var parts = [];
    parts.push('<h2>' + escapeHtml(h2) + '</h2>');
    var introBits = [];
    if (seo.hero_subtitle) introBits.push(seo.hero_subtitle);
    if (seo.summary_intro) introBits.push(seo.summary_intro);
    if (!introBits.length && eduBlock && eduBlock.paragraphs) {
      introBits = eduBlock.paragraphs.slice(0, 2);
    }
    if (introBits.length) {
      parts.push('<div class="article-intro">');
      introBits.forEach(function (p) {
        parts.push('<p>' + escapeHtml(p) + '</p>');
      });
      parts.push('</div>');
    }
    if (eduBlock && eduBlock.heading) {
      parts.push('<div class="article-section">');
      parts.push('<h3>' + escapeHtml(eduBlock.heading) + '</h3>');
      (eduBlock.paragraphs || []).forEach(function (p) {
        parts.push('<p>' + escapeHtml(p) + '</p>');
      });
      parts.push('</div>');
    }
    if (eduBlock && eduBlock.bullets && eduBlock.bullets.length) {
      parts.push('<div class="article-section">');
      parts.push('<h3>Hal yang perlu diperhatikan</h3>');
      parts.push('<ul class="article-list">');
      eduBlock.bullets.forEach(function (b) {
        parts.push('<li>' + escapeHtml(b) + '</li>');
      });
      parts.push('</ul></div>');
    }
    parts.push('<div class="article-section">');
    parts.push('<h3>Kesimpulan</h3>');
    parts.push(
      '<p>' +
        escapeHtml(
          'Template ' +
            displayTitle +
            ' membantu Anda memulai dengan struktur yang rapi. Sesuaikan isi dengan fakta transaksi Anda dan, bila perlu, konsultasikan dengan penasihat hukum untuk kasus bernilai tinggi.'
        ) +
        '</p>'
    );
    parts.push(
      '<p><em>Paket: ' +
        escapeHtml(pak.name) +
        '. Ini penjelasan edukasi umum, bukan nasihat hukum untuk kasus spesifik.</em></p>'
    );
    parts.push('</div>');
    return parts.join('');
  }

  function faqChevronSvg() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
  }

  function faqItem(q, a) {
    return (
      '<div class="faq-item">' +
      '<button type="button" class="faq-question">' +
      '<span>' +
      escapeHtml(q) +
      '</span>' +
      faqChevronSvg() +
      '</button>' +
      '<div class="faq-answer"><p>' +
      escapeHtml(a) +
      '</p></div></div>'
    );
  }

  function buildFaqHtml(displayTitle, seo) {
    seo = seo || {};
    if (seo.faq && seo.faq.length) {
      return seo.faq
        .map(function (item) {
          return faqItem(item.q || item.question || '', item.a || item.answer || '');
        })
        .join('');
    }
    var dn = displayTitle;
    return (
      faqItem(
        'Apakah dokumen ini sesuai dengan hukum Indonesia?',
        'Template disusun mengacu pada praktik dokumen bisnis dan hukum perdata Indonesia pada umumnya. Untuk kasus khusus, sesuaikan dengan regulasi sektoral dan fakta Anda.'
      ) +
      faqItem(
        'Dapatkah saya mengedit dokumen setelah membeli?',
        'Ya. File dikirim dalam format Word (.docx) sehingga Anda dapat menyesuaikan teks sebelum penandatanganan.'
      ) +
      faqItem(
        'Apa yang saya dapatkan untuk ' + dn + '?',
        'Anda mendapatkan template ' +
          dn +
          ' sesuai katalog, termasuk struktur pasal yang lazim dipakai untuk jenis dokumen ini.'
      ) +
      faqItem(
        'Berapa lama saya akan menerima file setelah pembayaran?',
        'Setelah pembayaran terverifikasi, tim mengirimkan file melalui saluran yang aman sesuai alur Sepakatee (biasanya dalam waktu singkat pada jam kerja).'
      )
    );
  }

  function attachFaqHandlers(root) {
    if (!root) return;
    var items = root.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq-question');
      if (!q || q.dataset.ppBound) return;
      q.dataset.ppBound = '1';
      q.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (o) {
          o.classList.remove('is-open');
        });
        if (!open) item.classList.add('is-open');
      });
    });
  }

  function showPpError(title, lead) {
    var box = document.getElementById('ppError');
    var root = document.getElementById('ppRoot');
    var tEl = document.getElementById('ppErrorTitle');
    var lEl = document.getElementById('ppErrorLead');
    if (tEl) tEl.textContent = title;
    if (lEl) lEl.textContent = lead;
    if (box) box.hidden = false;
    if (root) root.hidden = true;
  }

  function run() {
    ensureCatalogGlobals();
    var params = new URLSearchParams(window.location.search);
    var rawId = params.get('id');
    var id = rawId;
    if (id && ID_ALIASES[id]) id = ID_ALIASES[id];
    if (!id) {
      showPpError(
        'Parameter tidak lengkap',
        'Buka dokumen dari katalog agar tautan memuat ID yang benar.'
      );
      return;
    }

    Promise.all([loadCatalogData(), loadSeoOverrides()])
      .then(function (pair) {
        var data = pair[0];
        var seoDb = pair[1] || { by_id: {} };
        var items = data.items || [];
        var it = items.find(function (x) {
          return x.id === id;
        });
        if (!it) {
          showPpError(
            'Dokumen tidak ditemukan',
            'ID ini tidak ada di katalog kami. Tautan mungkin sudah usang — cari judul yang sama di katalog.'
          );
          return;
        }

        if (rawId && rawId !== it.id) {
          try {
            var u = new URL(window.location.href);
            u.searchParams.set('id', it.id);
            window.history.replaceState({}, '', u.pathname + u.search + u.hash);
          } catch (e) {}
        }

        var Pak = window.SepakateePaket;
        var Price = window.SepakateePricing;
        if (
          !Pak ||
          !Price ||
          typeof Price.priceForTierLetter !== 'function' ||
          typeof Price.formatIdr !== 'function' ||
          (typeof Pak.metaForCatalog !== 'function' && typeof Pak.meta !== 'function')
        ) {
          showPpError(
            'Halaman belum siap',
            'Lingkungan peramban ini tidak bisa menyiapkan data paket/harga. Muat ulang halaman, coba jendela penyamaran, atau nonaktifkan pemblokir iklan / perlindungan ketat untuk sepakatee.com.'
          );
          return;
        }

        var pak =
          typeof Pak.metaForCatalog === 'function'
            ? Pak.metaForCatalog(it.provisional_tier)
            : Pak.meta(it.provisional_tier);
        var displayTitle = formatTitle(it.title);
        var fam = familyLabel(it.family);
        var notary = it.flags && it.flags.requires_notary;
        var priceIdr = Price.priceForTierLetter(it.provisional_tier);
        var priceStr = Price.formatIdr(priceIdr);

        var seo = (seoDb.by_id && seoDb.by_id[it.id]) || {};

        document.title = (seo.page_title ? formatTitle(seo.page_title) : displayTitle) + ' | Sepakatee';
        var md = document.querySelector('meta[name="description"]');
        if (md) {
          var desc =
            seo.meta_description ||
            displayTitle +
              ' — ' +
              pak.name +
              ' di Sepakatee. Beli template Word (.docx); unduh setelah pembayaran terverifikasi.';
          md.setAttribute('content', clampMeta(desc, 158));
        }
        if (seo.keywords) {
          setMetaKeywords(seo.keywords);
        }

        var errBox = document.getElementById('ppError');
        if (errBox) errBox.hidden = true;

        document.getElementById('ppRoot').dataset.mode = 'beli';
        document.getElementById('ppRoot').hidden = false;

        document.getElementById('ppBreadcrumb').innerHTML =
          '<a href="../index.html">Templates</a><span>/</span><a href="../index.html#katalog-dokumen">Katalog</a><span>/</span><span>' +
          escapeHtml(fam) +
          '</span><span>/</span><span>' +
          escapeHtml(displayTitle) +
          '</span>';

        document.getElementById('ppTitle').textContent = displayTitle;
        document.getElementById('ppSub').textContent =
          seo.hero_subtitle ||
          'Template Word (.docx) dari katalog dokumen hukum Sepakatee — ' +
          pak.name.toLowerCase() +
          '. Beli sekali, unduh file setelah pembayaran terverifikasi.';

        document.getElementById('ppCategory').textContent = fam + ' · ' + pak.name;
        document.getElementById('ppEmoji').textContent = emojiForFamily(it.family);

        syncPriceDisplays(priceStr);

        var purchaseHead = document.getElementById('ppPurchaseHeading');
        if (purchaseHead) purchaseHead.textContent = pak.sidebarTitle;

        var purchaseNote = document.getElementById('ppPurchaseNote');
        if (purchaseNote) {
          purchaseNote.textContent =
            seo.purchase_note || pak.sidebarHint || 'Setelah konfirmasi, dokumen akan dikirim langsung.';
        }

        var Edu = window.SepakateeCatalogEducation;
        var eduBlock = null;
        if (!seo.hide_auto_education && Edu && typeof Edu.getBlock === 'function') {
          eduBlock = Edu.getBlock(it.family, it.title);
        }

        var prevEl = document.getElementById('ppDocumentPreview');
        if (prevEl) {
          prevEl.innerHTML = buildLockedPreviewInnerHtml(displayTitle, fam, notary, seo);
        }

        var descEl = document.getElementById('ppDescriptionMain');
        if (descEl) {
          descEl.innerHTML = buildDescriptionMainHtml(displayTitle, it.family, seo, eduBlock);
        }

        var artEl = document.getElementById('ppSeoArticle');
        if (artEl) {
          if (seo.article_html) {
            artEl.innerHTML = seo.article_html;
          } else {
            artEl.innerHTML = buildArticleHtml(displayTitle, seo, eduBlock, pak);
          }
        }

        var faqEl = document.getElementById('ppFaqList');
        if (faqEl) {
          faqEl.innerHTML = buildFaqHtml(displayTitle, seo);
          attachFaqHandlers(faqEl);
        }

        var flowKey = Pak.ipaymuFlowKey(it.provisional_tier);
        var beliBtn = document.getElementById('ppCtaBeli');
        var beliErr = document.getElementById('ppBeliErr');

        beliBtn.addEventListener('click', function () {
          if (beliErr) {
            beliErr.style.display = 'none';
            beliErr.textContent = '';
          }
          try {
            sessionStorage.setItem('catalogPurchaseTitle', displayTitle);
            sessionStorage.setItem('catalogPurchaseId', it.id);
          } catch (x) {}
          var Checkout = window.SepakateeIpaymuCheckout;
          if (!Checkout || !Checkout.redirectToPayment) {
            if (beliErr) {
              beliErr.textContent = 'Pembayaran belum siap di peramban ini.';
              beliErr.style.display = 'block';
            }
            return;
          }
          beliBtn.disabled = true;
          Checkout.redirectToPayment({
            flowKey: flowKey,
            buyerName: '',
            buyerEmail: '',
            buyerPhone: '',
          }).catch(function (err) {
            beliBtn.disabled = false;
            if (beliErr) {
              beliErr.textContent = err.message || 'Gagal memproses pembayaran.';
              beliErr.style.display = 'block';
            }
          });
        });
      })
      .catch(function () {
        showPpError(
          'Katalog tidak bisa dimuat',
          'Periksa koneksi lalu muat ulang. Jika Anda membuka file secara lokal (file://), buka situs lewat http://localhost agar data katalog tersedia.'
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
