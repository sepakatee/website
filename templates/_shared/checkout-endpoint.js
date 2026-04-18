/**
 * Payment session API (Cloudflare Worker). Loaded before ipaymu-checkout.js.
 *
 * Keep this file secret-free: it only points the frontend at the server endpoint
 * that signs iPaymu requests. The Worker URL is public; the API key stays server-side.
 */
(function (global) {
  'use strict';

  var CLOUDFLARE_CREATE_IPAYMU_SESSION_URL = 'https://sepakatee-create-ipaymu-session.sepakatee.workers.dev';

  var url = String(CLOUDFLARE_CREATE_IPAYMU_SESSION_URL || '').trim().replace(/\/$/, '');
  if (url && !global.__SEP_CREATE_PAYMENT_URL__) {
    global.__SEP_CREATE_PAYMENT_URL__ = url;
  }
})(typeof window !== 'undefined' ? window : globalThis);
