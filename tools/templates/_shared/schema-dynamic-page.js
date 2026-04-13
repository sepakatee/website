/**
 * Minimal schema-driven form + text preview for Tier B demos.
 * Expects global fetch'd schema object with variables[], preview_template, landing_content, seo_fields.
 */
(function (global) {
  'use strict';

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function applySeo(schema) {
    var seo = schema.seo_fields || {};
    if (seo.title) document.title = seo.title;
    if (seo.robots) {
      var m = document.querySelector('meta[name="robots"]');
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute('name', 'robots');
        document.head.appendChild(m);
      }
      m.setAttribute('content', seo.robots);
    }
    if (seo.description) {
      var d = document.querySelector('meta[name="description"]');
      if (!d) {
        d = document.createElement('meta');
        d.setAttribute('name', 'description');
        document.head.appendChild(d);
      }
      d.setAttribute('content', seo.description);
    }
  }

  function renderLanding(container, schema) {
    var lc = schema.landing_content || {};
    container.innerHTML =
      '<h1>' +
      escapeHtml(lc.headline || schema.template_id || 'Template') +
      '</h1><p class="dyn-intro">' +
      escapeHtml(lc.intro || '') +
      '</p>';
  }

  function renderForm(container, variables) {
    var html =
      '<h2>Data</h2><form id="dynFormEl" class="dyn-form">';
    (variables || []).forEach(function (v) {
      var req = v.required ? ' required' : '';
      var id = 'f_' + v.key;
      html += '<div class="dyn-field"><label for="' + id + '">' + escapeHtml(v.label || v.key) + '</label>';
      if (v.type === 'textarea') {
        html +=
          '<textarea id="' +
          id +
          '" name="' +
          escapeHtml(v.key) +
          '" rows="3"' +
          req +
          '></textarea>';
      } else {
        html +=
          '<input type="' +
          (v.type === 'number' ? 'number' : 'text') +
          '" id="' +
          id +
          '" name="' +
          escapeHtml(v.key) +
          '"' +
          req +
          ' />';
      }
      html += '</div>';
    });
    html +=
      '<button type="button" class="btn btn--ghost" id="dynPreviewBtn">Lihat preview</button></form>';
    container.innerHTML = html;
  }

  function collectValues(variables) {
    var out = {};
    (variables || []).forEach(function (v) {
      var el = document.getElementById('f_' + v.key);
      if (el) out[v.key] = el.value.trim();
    });
    return out;
  }

  function fillPreview(template, data) {
    if (!template) return '';
    return template.replace(/\{\{(\w+)\}\}/g, function (_, key) {
      return data[key] != null && data[key] !== '' ? data[key] : '…';
    });
  }

  function mount(schema) {
    applySeo(schema);
    renderLanding(document.getElementById('dynLanding'), schema);
    renderForm(document.getElementById('dynFormHost'), schema.variables);

    var prevHost = document.getElementById('dynPreviewHost');
    var payBtn = document.getElementById('dynPayBtn');
    payBtn.disabled = true;

    document.getElementById('dynPreviewBtn').addEventListener('click', function () {
      var data = collectValues(schema.variables);
      var text = fillPreview(schema.preview_template, data);
      prevHost.innerHTML =
        '<h2>Preview</h2><pre class="dyn-preview-pre">' + escapeHtml(text) + '</pre>';
      try {
        sessionStorage.setItem(
          'previewDocumentData',
          JSON.stringify({ dynamic: true, schema_id: schema.template_id, fields: data, preview_text: text })
        );
      } catch (e) {
        console.warn(e);
      }
      payBtn.disabled = false;
    });

    payBtn.addEventListener('click', async function () {
      var data = collectValues(schema.variables);
      var email = data.email_pembeli || 'customer@example.com';
      payBtn.disabled = true;
      payBtn.textContent = 'Memproses...';
      try {
        await global.SepakateeIpaymuCheckout.redirectToPayment({
          flowKey: 'sample-tier-b',
          buyerName: data.nama_pihak_a || 'Customer',
          buyerEmail: email,
          buyerPhone: '08123456789',
        });
      } catch (err) {
        alert(err.message || String(err));
        payBtn.disabled = false;
        payBtn.textContent = 'Lanjut ke pembayaran';
      }
    });
  }

  global.SepakateeSchemaDynamic = {
    mount: mount,
  };
})(typeof window !== 'undefined' ? window : globalThis);
