/**
 * Unified iPaymu checkout via server-side payment session creation.
 *
 * Set before load (e.g. inline in preview.html):
 *   window.__SEP_CREATE_PAYMENT_URL__ = 'https://YOUR_REF.supabase.co/functions/v1/create-ipaymu-session';
 *
 * Return URL base (receipt after iPaymu):
 *   window.__SEP_SITE_BASE_URL__ = 'http://127.0.0.1:8080';
 * iPaymu cannot redirect to file:// — open the site over http(s) or set the base above.
 * Optional: localStorage 'sep_site_base_url' (same format) when using file://.
 *
 * flowKey must match server FLOW_PRODUCT keys + pricing.js PRODUCTS.
 */
(function (global) {
  'use strict';

  var RECEIPT_SEGMENT = {
    'sewa-menyewa': 'sewa-menyewa',
    'jual-beli-barang-bergerak': 'jual-beli-barang-bergerak',
    'kerja-sama': 'kerja-sama',
    'perjanjian-kerahasiaan': 'perjanjian-kerahasiaan',
    'syarat-ketentuan-platform': 'syarat-ketentuan-platform',
    'kebijakan-privasi': 'kebijakan-privasi',
    'perjanjian-pendiri': 'perjanjian-pendiri',
    'perjanjian-waralaba': 'perjanjian-waralaba',
    'sample-tier-b': 'dynamic',
    'catalog-paket-bisnis': 'dokumen',
    'catalog-paket-dasar': 'dokumen',
    'catalog-tier-a': 'dokumen',
    'catalog-tier-b': 'dokumen',
    'catalog-tier-c': 'dokumen',
    'perintilan-single': 'dokumen',
    'perintilan-bundle': 'dokumen',
  };

  // Backward compatibility for older payment backends that have not added
  // newer flow keys yet.
  var SERVER_FLOW_FALLBACK = {
    'perjanjian-kerahasiaan': 'catalog-tier-b',
  };

  function cleanForIpaymu(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[`'"\\]/g, '').trim().substring(0, 255);
  }

  function baseUrlDefault() {
    var custom = '';
    try {
      custom =
        global.__SEP_SITE_BASE_URL__ &&
        String(global.__SEP_SITE_BASE_URL__).trim();
    } catch (e) {}
    if (custom) return custom.replace(/\/$/, '');

    var o = global.location && global.location.origin;
    if (o && /^https?:\/\//i.test(String(o))) return String(o).replace(/\/$/, '');

    // file:// — cannot be used as iPaymu returnUrl; prefer dev server + __SEP_SITE_BASE_URL__
    try {
      if (global.localStorage) {
        var saved = global.localStorage.getItem('sep_site_base_url');
        if (saved && /^https?:\/\//i.test(String(saved).trim())) {
          return String(saved).trim().replace(/\/$/, '');
        }
      }
    } catch (e2) {}

    // file:// or missing origin: receipt must be absolute https (apex matches live site)
    return 'https://sepakatee.com';
  }

  function generateReferenceId() {
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return 'KNTF-' + y + m + d + '-' + rand;
  }

  function persistBeforeRedirect(referenceId, buyerName, buyerEmail) {
    try {
      global.sessionStorage.setItem('paymentReferenceId', referenceId);
      global.sessionStorage.setItem('paymentBuyerName', buyerName);
      global.sessionStorage.setItem('paymentBuyerEmail', buyerEmail);
      var previewData = global.sessionStorage.getItem('previewDocumentData');
      if (previewData) {
        global.localStorage.setItem('previewDocumentData_backup', previewData);
        global.localStorage.setItem('previewDocumentData_ref', referenceId);
        // Cadangan per-ID pesanan: tidak tertimpa pembayaran lain; dipakai receipt setelah redirect iPaymu.
        try {
          global.localStorage.setItem('sep_receipt_form_' + referenceId, previewData);
        } catch (e3) {}
      }

      // For catalog purchases, sessionStorage is often cleared on the cross-origin redirect.
      // Backup the selected catalog doc so `tools/templates/dokumen/receipt.html` can download it.
      var catalogPurchaseId = global.sessionStorage.getItem('catalogPurchaseId');
      var catalogPurchaseTitle = global.sessionStorage.getItem('catalogPurchaseTitle');
      if (catalogPurchaseId) {
        global.localStorage.setItem('catalogPurchaseId_backup', catalogPurchaseId);
        try {
          global.localStorage.setItem(
            'sep_catalog_order_' + referenceId,
            JSON.stringify({
              id: catalogPurchaseId,
              title: catalogPurchaseTitle || '',
            })
          );
        } catch (e2) {}
      }
      if (catalogPurchaseTitle) {
        global.localStorage.setItem('catalogPurchaseTitle_backup', catalogPurchaseTitle);
      }
    } catch (e) {
      console.warn('sessionStorage', e);
    }
  }

  /**
   * @param {object} opts
   * @param {string} opts.flowKey - sewa-menyewa | kerja-sama | sample-tier-b
   * @param {string} opts.buyerName
   * @param {string} opts.buyerEmail
   * @param {string} opts.buyerPhone
   */
  async function redirectToPayment(opts) {
    var flowKey = opts.flowKey;
    var buyerName = cleanForIpaymu(opts.buyerName) || 'Customer';
    var buyerEmail = cleanForIpaymu(opts.buyerEmail) || 'customer@example.com';
    var buyerPhone = cleanForIpaymu(opts.buyerPhone) || '08123456789';

    var baseUrl = baseUrlDefault();
    var seg = RECEIPT_SEGMENT[flowKey];
    if (!seg) throw new Error('Unknown flowKey: ' + flowKey);

    var referenceId = generateReferenceId();
    persistBeforeRedirect(referenceId, buyerName, buyerEmail);

    // Optional catalog metadata (used by the universal receipt page).
    var catalogPurchaseId = '';
    var catalogPurchaseTitle = '';
    try {
      catalogPurchaseId = String(global.sessionStorage.getItem('catalogPurchaseId') || '');
      catalogPurchaseTitle = String(global.sessionStorage.getItem('catalogPurchaseTitle') || '');
    } catch (e) {}

    var extraCatalogQuery = '';
    if (catalogPurchaseId) {
      extraCatalogQuery +=
        '&catalog_id=' + encodeURIComponent(catalogPurchaseId);
    }
    if (catalogPurchaseTitle) {
      extraCatalogQuery +=
        '&catalog_title=' + encodeURIComponent(catalogPurchaseTitle);
    }

    var receiptBase =
      baseUrl +
      '/tools/templates/' +
      seg +
      '/receipt.html?ref=' +
      encodeURIComponent(referenceId) +
      '&status=berhasil' +
      extraCatalogQuery;
    var returnUrl =
      receiptBase +
      '&name=' +
      encodeURIComponent(buyerName) +
      '&email=' +
      encodeURIComponent(buyerEmail);
    var cancelUrl =
      baseUrl +
      '/tools/templates/' +
      seg +
      '/receipt.html?ref=' +
      encodeURIComponent(referenceId) +
      '&status=batal' +
      extraCatalogQuery;

    var fnUrl =
      global.__SEP_CREATE_PAYMENT_URL__ &&
      String(global.__SEP_CREATE_PAYMENT_URL__).trim();

    if (fnUrl) {
      var requestPaymentUrl = async function (serverFlowKey) {
        var res = await fetch(fnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flow_key: serverFlowKey,
            buyerName: buyerName,
            buyerEmail: buyerEmail,
            buyerPhone: buyerPhone,
            returnUrl: returnUrl,
            cancelUrl: cancelUrl,
            referenceId: referenceId,
          }),
        });
        var data = await res.json().catch(function () {
          return {};
        });
        return { res: res, data: data };
      };

      var first = await requestPaymentUrl(flowKey);
      if (first.res.ok && first.data && first.data.paymentUrl) {
        global.location.href = first.data.paymentUrl;
        return;
      }

      var serverError = String((first.data && first.data.error) || '');
      var fallbackFlowKey = SERVER_FLOW_FALLBACK[flowKey];
      if (
        fallbackFlowKey &&
        /invalid flow_key/i.test(serverError)
      ) {
        var second = await requestPaymentUrl(fallbackFlowKey);
        if (second.res.ok && second.data && second.data.paymentUrl) {
          global.location.href = second.data.paymentUrl;
          return;
        }
        throw new Error((second.data && second.data.error) || 'Payment function error ' + second.res.status);
      }

      if (!first.res.ok) {
        throw new Error(serverError || 'Payment function error ' + first.res.status);
      }
      throw new Error((first.data && first.data.error) || 'No paymentUrl from server');
    }

    throw new Error(
      'Pembayaran belum dikonfigurasi di situs ini. Muat checkout-endpoint.js dan set window.__SEP_CREATE_PAYMENT_URL__ ke endpoint server create-ipaymu-session.'
    );
  }

  global.SepakateeIpaymuCheckout = {
    redirectToPayment: redirectToPayment,
  };
})(typeof window !== 'undefined' ? window : globalThis);
