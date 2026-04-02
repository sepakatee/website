/**
 * Product detail for catalog items: ?id= from catalog-inventory.
 */
(function () {
  'use strict';

  var JSON_URL = '../data/catalog-inventory.json';

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

  function hl(text) {
    return '<span class="hl">' + escapeHtml(text) + '</span>';
  }

  function buildPreviewHtml(displayTitle, notary) {
    var t = escapeHtml(displayTitle);
    return (
      '<p><strong>' +
      t +
      '</strong></p>' +
      '<p>Dokumen ini disusun untuk keperluan formal antar pihak. Bagian berikut menunjukkan struktur yang akan Anda isi melalui panduan langkah demi langkah (Paket Panduan Penuh).</p>' +
      '<ul>' +
      '<li>Identitas pihak: ' +
      hl('[Nama lengkap / badan hukum]') +
      ' dan ' +
      hl('[Nama pihak kedua]') +
      '</li>' +
      '<li>Tempat dan tanggal: ' +
      hl('[Kota]') +
      ', ' +
      hl('[Tanggal]') +
      '</li>' +
      '<li>Ruang lingkup hak dan kewajiban utama</li>' +
      '<li>Jangka waktu dan mekanisme perpanjangan</li>' +
      '<li>Pasal penyelesaian sengketa dan hukum yang berlaku</li>' +
      '</ul>' +
      (notary
        ? '<p><em>Dokumen terkait notaris memerlukan penyesuaian dengan kantor notaris pilihan Anda.</em></p>'
        : '') +
      '<p style="font-size:0.8125rem;color:rgba(15,15,16,.5);">Tampilan di atas adalah ilustrasi struktur; teks final mengikuti pengisian Anda.</p>'
    );
  }

  function buildSummaryHtml(displayTitle, fam, notary) {
    return (
      '<p><strong>' +
      escapeHtml(displayTitle) +
      '</strong> tersedia dalam format Word (.docx) siap pakai setelah pembayaran terverifikasi.</p>' +
      '<ul>' +
      '<li>Kategori: <strong>' +
      escapeHtml(fam) +
      '</strong></li>' +
      '<li>File dapat diedit sesuai kebutuhan operasional Anda</li>' +
      '<li>Pengiriman melalui saluran yang aman setelah konfirmasi pembayaran</li>' +
      (notary ? '<li>Untuk variasi notaris, tim kami akan menghubungi Anda setelah pembelian</li>' : '') +
      '</ul>'
    );
  }

  function run() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) {
      document.getElementById('ppError').hidden = false;
      return;
    }

    loadCatalogData()
      .then(function (data) {
        var items = data.items || [];
        var it = items.find(function (x) {
          return x.id === id;
        });
        if (!it) {
          document.getElementById('ppError').hidden = false;
          return;
        }

        var Pak = window.SepakateePaket;
        var Price = window.SepakateePricing;
        if (!Pak || !Price) {
          document.getElementById('ppError').hidden = false;
          return;
        }

        var pak = Pak.meta(it.provisional_tier);
        var isPanduan = pak.key === 'A';
        var displayTitle = formatTitle(it.title);
        var fam = familyLabel(it.family);
        var notary = it.flags && it.flags.requires_notary;
        var priceIdr = Price.priceForTierLetter(it.provisional_tier);
        var priceStr = Price.formatIdr(priceIdr);

        document.title = displayTitle + ' | Sepakatee';
        var md = document.querySelector('meta[name="description"]');
        if (md) {
          md.setAttribute(
            'content',
            displayTitle +
              ' — ' +
              pak.name +
              ' di Sepakatee. ' +
              (isPanduan
                ? 'Pengisian terpandu dan pratinjau dokumen.'
                : 'Pembelian langsung dengan file siap unduh.')
          );
        }

        document.getElementById('ppRoot').dataset.mode = isPanduan ? 'panduan' : 'beli';
        document.getElementById('ppRoot').hidden = false;

        document.getElementById('ppBreadcrumb').innerHTML =
          '<a href="../index.html">Templates</a><span>/</span><a href="../index.html#katalog-dokumen">Katalog</a><span>/</span><span>' +
          escapeHtml(fam) +
          '</span><span>/</span><span>' +
          escapeHtml(displayTitle) +
          '</span>';

        document.getElementById('ppTitle').textContent = displayTitle;
        document.getElementById('ppSub').textContent =
          'Dokumen hukum untuk kebutuhan operasional dan perlindungan bisnis Anda — disajikan dalam ' +
          pak.name.toLowerCase() +
          '.';

        document.getElementById('ppPaketPill').textContent = pak.name;
        document.getElementById('ppFamilyPill').textContent = fam;
        document.getElementById('ppPriceHero').textContent = 'Mulai ' + priceStr;

        document.getElementById('ppSideTitle').textContent = pak.sidebarTitle;
        document.getElementById('ppSidePrice').textContent = priceStr;
        document.getElementById('ppSideNote').textContent = pak.sidebarHint;

        var feats = document.getElementById('ppFeatures');
        if (isPanduan) {
          feats.innerHTML =
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Panduan pengisian bertahap</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Pratinjau sebelum finalisasi</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Format Word (.docx) siap pakai</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Satu kali pembayaran per dokumen</li>';
        } else {
          feats.innerHTML =
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> File .docx lengkap</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Dapat diedit sepenuhnya</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Pengiriman setelah pembayaran terkonfirmasi</li>' +
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Panduan singkat penggunaan</li>';
        }

        if (isPanduan) {
          document.getElementById('ppPreviewBody').innerHTML = buildPreviewHtml(
            displayTitle,
            notary
          );
          var builderRel = Pak.builderLandingRel(it.slug);
          var cta = document.getElementById('ppCtaPanduan');
          if (builderRel) {
            cta.href = '../' + builderRel;
            cta.textContent = 'Buat dokumen sekarang';
          } else {
            cta.href =
              '../../../legal-aid/konsultasi-dokumen.html?judul=' +
              encodeURIComponent(displayTitle) +
              '&sumber=paket-panduan';
            cta.textContent = 'Mulai dengan tim hukum';
          }
        } else {
          document.getElementById('ppSummaryBody').innerHTML = buildSummaryHtml(
            displayTitle,
            fam,
            notary
          );
        }

        var flowKey = Pak.ipaymuFlowKey(it.provisional_tier);
        var overlay = document.getElementById('ppPayOverlay');
        var form = document.getElementById('ppPayForm');
        var errEl = document.getElementById('ppPayErr');

        document.getElementById('ppCtaBeli').addEventListener('click', function () {
          errEl.style.display = 'none';
          overlay.classList.add('is-open');
          overlay.setAttribute('aria-hidden', 'false');
        });

        document.getElementById('ppPayCancel').addEventListener('click', function () {
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden', 'true');
        });

        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
          }
        });

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          errEl.style.display = 'none';
          var name = document.getElementById('ppPayName').value.trim();
          var email = document.getElementById('ppPayEmail').value.trim();
          var phone = document.getElementById('ppPayPhone').value.trim();
          if (!name || !email || !phone) {
            errEl.textContent = 'Lengkapi semua field.';
            errEl.style.display = 'block';
            return;
          }
          try {
            sessionStorage.setItem('catalogPurchaseTitle', displayTitle);
            sessionStorage.setItem('catalogPurchaseId', it.id);
          } catch (x) {}
          var Checkout = window.SepakateeIpaymuCheckout;
          if (!Checkout || !Checkout.redirectToPayment) {
            errEl.textContent = 'Pembayaran belum siap di peramban ini.';
            errEl.style.display = 'block';
            return;
          }
          Checkout.redirectToPayment({
            flowKey: flowKey,
            buyerName: name,
            buyerEmail: email,
            buyerPhone: phone,
          }).catch(function (err) {
            errEl.textContent = err.message || 'Gagal memproses pembayaran.';
            errEl.style.display = 'block';
          });
        });
      })
      .catch(function () {
        document.getElementById('ppError').hidden = false;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
