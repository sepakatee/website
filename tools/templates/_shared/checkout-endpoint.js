/**
 * Payment session API (Cloudflare Worker). Loaded before ipaymu-checkout.js.
 *
 * After you deploy: set CLOUDFLARE_CREATE_IPAYMU_SESSION_URL below to your Worker URL
 * (Wrangler prints it). Example: 'https://sepakatee-create-ipaymu-session.yourname.workers.dev'
 *
 * Leave empty ('') to keep the old browser fallback (sandbox keys in ipaymu-checkout.js — not for production).
 */
(function (global) {
  'use strict';

  var CLOUDFLARE_CREATE_IPAYMU_SESSION_URL = 'https://sepakatee-create-ipaymu-session.sepakatee.workers.dev';

  var url = String(CLOUDFLARE_CREATE_IPAYMU_SESSION_URL || '').trim().replace(/\/$/, '');
  if (url && !global.__SEP_CREATE_PAYMENT_URL__) {
    global.__SEP_CREATE_PAYMENT_URL__ = url;
  }
})(typeof window !== 'undefined' ? window : globalThis);
