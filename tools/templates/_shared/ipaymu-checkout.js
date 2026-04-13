/**
 * Unified iPaymu checkout: optional Supabase Edge Function, else browser sandbox signing.
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

  var SANDBOX = {
    va: '0000005776604685',
    apiKey: 'SANDBOX98A25EA0-9F38-49BC-82C1-9DD6EB48AFBC',
    url: 'https://sandbox.ipaymu.com/api/v2/payment',
    notifyUrl: 'https://jblbjdvipspzrcjeipei.supabase.co/functions/v1/ipaymu-webhook',
  };

  var RECEIPT_SEGMENT = {
    'sewa-menyewa': 'sewa-menyewa',
    'kerja-sama': 'kerja-sama',
    'sample-tier-b': 'dynamic',
    'catalog-paket-bisnis': 'dokumen',
    'catalog-paket-dasar': 'dokumen',
    'catalog-tier-a': 'dokumen',
    'catalog-tier-b': 'dokumen',
    'catalog-tier-c': 'dokumen',
    'perintilan-single': 'dokumen',
    'perintilan-bundle': 'dokumen',
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
      var res = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow_key: flowKey,
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
      if (!res.ok) {
        throw new Error(data.error || 'Payment function error ' + res.status);
      }
      if (!data.paymentUrl) {
        throw new Error(data.error || 'No paymentUrl from server');
      }
      global.location.href = data.paymentUrl;
      return;
    }

    if (typeof global.CryptoJS === 'undefined') {
      throw new Error('CryptoJS required for client-side iPaymu');
    }

    var pr = global.SepakateePricing.getByFlowKey(flowKey);
    var amountStr = global.SepakateePricing.amountString(pr.priceIdr);
    var productLabel = pr.productName;

    var body = {
      product: [productLabel],
      qty: ['1'],
      price: [amountStr],
      amount: amountStr,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      notifyUrl: SANDBOX.notifyUrl,
      referenceId: referenceId,
      buyerName: buyerName,
      buyerPhone: buyerPhone,
      buyerEmail: buyerEmail,
    };

    var bodyEncrypt = global.CryptoJS.SHA256(JSON.stringify(body));
    var stringtosign =
      'POST:' + SANDBOX.va + ':' + bodyEncrypt + ':' + SANDBOX.apiKey;
    var signature = global.CryptoJS.enc.Hex.stringify(
      global.CryptoJS.HmacSHA256(stringtosign, SANDBOX.apiKey)
    );

    var response = await fetch(SANDBOX.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        va: SANDBOX.va,
        signature: signature,
        timestamp: '20150201121045',
      },
      body: JSON.stringify(body),
    });

    var result = await response.json();
    var d = result && result.Data;
    var paymentUrl =
      (d && d.Url) || (d && d.PaymentUrl) || null;
    if (!paymentUrl) {
      var errMsg =
        (result && result.Message) ||
        (result && result.message) ||
        'Gagal mendapatkan URL pembayaran dari iPaymu';
      throw new Error(errMsg);
    }
    global.location.href = paymentUrl;
  }

  global.SepakateeIpaymuCheckout = {
    redirectToPayment: redirectToPayment,
  };
})(typeof window !== 'undefined' ? window : globalThis);
