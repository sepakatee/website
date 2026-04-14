// HTML document template — bilingual two-column (EN left | ID right), aligned with DOCX
const documentTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Non-Disclosure Agreement / Perjanjian Kerahasiaan</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');
        .bdoc-root, .bdoc-root * { box-sizing: border-box; }
        .bdoc-root { font-family: 'Manrope', sans-serif; max-width: 100%; margin: 0; padding: 0; color: #111; background: #fff; }
        .bdoc { display: grid; grid-template-columns: 1fr 1fr; column-gap: 0; width: 100%; }
        .ben { padding-right: 20px; border-right: 1px solid #bbb; }
        .bid { padding-left: 20px; }
        .ben, .bid { padding-top: 6px; padding-bottom: 6px; }
        .ben p, .bid p { margin: 0 0 10px; text-align: justify; font-size: 0.87em; line-height: 1.65; }
        .bdoc-title { font-weight: 800; text-transform: uppercase; text-align: center; letter-spacing: 0.04em; padding: 4px 0 14px !important; font-size: 0.95em; text-decoration: underline; }
        .bdoc-article-head { font-weight: 700; text-align: center; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.03em; padding: 18px 0 10px !important; }
        .bdoc-full-row { grid-column: 1 / -1; }
        .bdoc-hr { border: none; border-top: 1.5px solid #555; margin: 0 0 12px; }
        ol.contract-numbered-list { list-style: none; counter-reset: docnum; margin: 8px 0 10px; padding: 0; }
        ol.contract-numbered-list > li { counter-increment: docnum; position: relative; padding-left: 2.2em; margin: 7px 0; text-align: justify; font-size: 0.87em; line-height: 1.65; }
        ol.contract-numbered-list > li::before { content: "(" counter(docnum, decimal) ")"; position: absolute; left: 0; width: 2em; text-align: right; font-weight: 700; }
        ol.contract-letter-list { list-style: none; counter-reset: doclet; margin: 6px 0 8px 0.5em; padding: 0; }
        ol.contract-letter-list > li { counter-increment: doclet; position: relative; padding-left: 1.8em; margin: 5px 0; text-align: justify; font-size: 0.87em; line-height: 1.65; }
        ol.contract-letter-list > li::before { content: counter(doclet, upper-alpha) "."; position: absolute; left: 0; width: 1.4em; font-weight: 700; }
        .signature-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 0; margin-top: 40px; }
        .sig-col { padding: 0; }
        .sig-col.ben { padding-right: 20px; }
        .sig-col.bid { padding-left: 20px; }
        .sig-line { border-bottom: 1px solid #111; margin-top: 60px; margin-bottom: 6px; }
        .sig-col p { margin: 2px 0; font-size: 0.85em; }
    </style>
</head>
<body>
<div class="bdoc-root">
<div class="bdoc">

    <!-- Title row -->
    <div class="ben bdoc-title">NON DISCLOSURE AGREEMENT</div>
    <div class="bid bdoc-title">PERJANJIAN KERAHASIAAN</div>

    <!-- Divider -->
    <div class="bdoc-full-row"><hr class="bdoc-hr"></div>

    <!-- Opening -->
    <div class="ben"><p>This AGREEMENT, effective as of <strong>{{tanggal}}</strong>, is entered into by and between:</p></div>
    <div class="bid"><p>PERJANJIAN ini, efektif sejak tanggal <strong>{{tanggal}}</strong>, dibuat oleh dan antara:</p></div>

    <!-- Party A -->
    <div class="ben"><p><strong>A. {{nama_pihak_pemberi}}</strong>, a {{jenis_pihak_pemberi}}, domiciled at {{alamat_pihak_pemberi}} (hereinafter referred to as the <strong>"Disclosing Party"</strong>); and</p></div>
    <div class="bid"><p><strong>A. {{nama_pihak_pemberi}}</strong>, sebuah {{jenis_pihak_pemberi}}, berkedudukan di {{alamat_pihak_pemberi}} (selanjutnya disebut <strong>"Pihak Pemberi"</strong>); dan</p></div>

    <!-- Party B -->
    <div class="ben"><p><strong>B. {{nama_pihak_penerima}}</strong>, a {{jenis_pihak_penerima}}, domiciled at {{alamat_pihak_penerima}} (hereinafter referred to as the <strong>"Receiving Party"</strong>).</p></div>
    <div class="bid"><p><strong>B. {{nama_pihak_penerima}}</strong>, sebuah {{jenis_pihak_penerima}}, berkedudukan di {{alamat_pihak_penerima}} (selanjutnya disebut <strong>"Pihak Penerima"</strong>).</p></div>

    <!-- WHEREAS 1 -->
    <div class="ben"><p>WHEREAS, each Party has requested information from the other party in order to pursue and evaluate a possible transaction or relationship between the Parties in connection with <strong>{{tujuan_pengungkapan}}</strong>.</p></div>
    <div class="bid"><p>MENGINGAT, masing-masing Pihak telah meminta informasi dari Pihak lainnya untuk melanjutkan dan mengevaluasi kemungkinan transaksi atau kerjasama antara Para Pihak terkait <strong>{{tujuan_pengungkapan}}</strong>.</p></div>

    <!-- WHEREAS 2 -->
    <div class="ben"><p>WHEREAS, in order to pursue and evaluate the possible transaction or relationship, each Party may disclose to the other Party confidential, important, and/or proprietary trade secret information concerning each Party and its activities.</p></div>
    <div class="bid"><p>MENGINGAT, untuk melanjutkan dan mengevaluasi kemungkinan transaksi atau kerjasama, masing-masing Pihak dapat mengungkapkan kepada Pihak lainnya informasi rahasia, hal penting miliknya, dan/atau kepemilikan informasi rahasia dagang tiap Pihak mengenai aktivitasnya.</p></div>

    <!-- THEREFORE -->
    <div class="ben"><p>THEREFORE, in consideration of the premises stated hereinabove and the covenants herein, the Parties agree to enter into a confidential relationship and execute this Agreement.</p></div>
    <div class="bid"><p>OLEH KARENA ITU, dengan pertimbangan dari ketentuan di atas dan Perjanjian ini, Para Pihak sepakat untuk membuat Perjanjian mengenai hubungan kerahasiaan dan melaksanakan Perjanjian ini.</p></div>

    <!-- IT IS AGREED -->
    <div class="ben"><p><strong>IT IS HEREBY AGREED as follows:</strong></p></div>
    <div class="bid"><p><strong>DENGAN INI DISEPAKATI sebagai berikut:</strong></p></div>

    <!-- Article 1 heading -->
    <div class="ben bdoc-article-head">CONFIDENTIAL INFORMATION</div>
    <div class="bid bdoc-article-head">INFORMASI RAHASIA</div>

    <!-- Article 1 content -->
    <div class="ben">
        <p>"Confidential Information" shall mean all information, data, documents, and materials, including but not limited to <strong>{{jenis_informasi_rahasia}}</strong>, disclosed by either Party to the other in connection with <strong>{{tujuan_pengungkapan}}</strong>, whether oral, written, electronic, or in any other form.</p>
        <p>"Confidential Information" shall <em>not</em> include information that:</p>
        <ol class="contract-letter-list">
            <li>is or becomes part of the public domain without breach of this Agreement;</li>
            <li>was known by the Receiving Party prior to receipt from the Disclosing Party;</li>
            <li>is lawfully received from a third party without confidentiality obligation;</li>
            <li>is required to be disclosed by applicable law or court order.</li>
        </ol>
    </div>
    <div class="bid">
        <p>"Informasi Rahasia" berarti semua informasi, data, dokumen, dan materi, termasuk namun tidak terbatas pada <strong>{{jenis_informasi_rahasia}}</strong>, yang diungkapkan oleh salah satu Pihak kepada Pihak lainnya sehubungan dengan <strong>{{tujuan_pengungkapan}}</strong>, baik secara lisan, tertulis, elektronik, maupun bentuk lainnya.</p>
        <p>"Informasi Rahasia" <em>tidak</em> mencakup informasi yang:</p>
        <ol class="contract-letter-list">
            <li>telah atau menjadi tersedia untuk publik tanpa pelanggaran perjanjian ini;</li>
            <li>telah diketahui oleh Pihak Penerima sebelum diterimanya dari Pihak Pemberi;</li>
            <li>diperoleh secara sah dari pihak ketiga tanpa kewajiban kerahasiaan;</li>
            <li>diwajibkan untuk diungkapkan oleh hukum atau perintah pengadilan yang berlaku.</li>
        </ol>
    </div>

    <!-- Article 2 heading -->
    <div class="ben bdoc-article-head">CONFIDENTIALITY UNDERTAKING</div>
    <div class="bid bdoc-article-head">KESANGGUPAN KERAHASIAAN</div>

    <!-- Article 2 content -->
    <div class="ben">
        <p>Each Party agrees that the Confidential Information disclosed hereunder shall:</p>
        <ol class="contract-numbered-list">
            <li>be used solely for the purpose of <strong>{{tujuan_pengungkapan}}</strong> and for no other purpose;</li>
            <li>be kept strictly confidential and not disclosed to any third party without prior written consent of the disclosing Party;</li>
            <li>be protected with security measures no less rigorous than those applied to the Receiving Party's own confidential information.</li>
        </ol>
        <p>{{penggunaan_informasi}}</p>
    </div>
    <div class="bid">
        <p>Masing-masing Pihak setuju bahwa Informasi Rahasia yang diungkapkan berdasarkan Perjanjian ini akan:</p>
        <ol class="contract-numbered-list">
            <li>digunakan semata-mata untuk tujuan <strong>{{tujuan_pengungkapan}}</strong> dan tidak untuk tujuan lain;</li>
            <li>dijaga kerahasiaannya dan tidak diungkapkan kepada pihak ketiga tanpa persetujuan tertulis terlebih dahulu dari Pihak yang mengungkapkan;</li>
            <li>dilindungi dengan langkah-langkah keamanan yang tidak kurang ketat dari yang diterapkan terhadap informasi rahasia Pihak Penerima sendiri.</li>
        </ol>
        <p>{{penggunaan_informasi}}</p>
    </div>

    <!-- Article 3 heading -->
    <div class="ben bdoc-article-head">LIABILITY</div>
    <div class="bid bdoc-article-head">KEWAJIBAN HUKUM</div>

    <!-- Article 3 content -->
    <div class="ben"><p>The Party who breaches this Agreement shall be liable for any loss, damage, or expense suffered by the other Party as a direct or consequential result of such breach, including but not limited to loss of revenues, loss of goodwill, and costs of enforcement.</p></div>
    <div class="bid"><p>Pihak yang melanggar Perjanjian ini bertanggung jawab atas setiap kerugian, kerusakan, atau biaya yang diderita oleh pihak lainnya sebagai akibat langsung maupun tidak langsung dari pelanggaran tersebut, termasuk namun tidak terbatas pada kehilangan pendapatan, kehilangan reputasi, dan biaya penegakan hukum.</p></div>

    <!-- Article 4 heading -->
    <div class="ben bdoc-article-head">DURATION</div>
    <div class="bid bdoc-article-head">DURASI</div>

    <!-- Article 4 content -->
    <div class="ben"><p>The confidentiality obligations under this Agreement shall remain in force for a period of <strong>{{durasi_rahasia}}</strong> from the effective date hereof and shall survive the termination or expiration of any business relationship between the Parties.</p></div>
    <div class="bid"><p>Kewajiban kerahasiaan berdasarkan Perjanjian ini berlaku selama <strong>{{durasi_rahasia}}</strong> sejak tanggal berlakunya perjanjian ini dan tetap berlaku meskipun hubungan bisnis antara Para Pihak berakhir atau diakhiri.</p></div>

    <!-- Article 5 heading -->
    <div class="ben bdoc-article-head">GOVERNING LAW &amp; DISPUTE RESOLUTION</div>
    <div class="bid bdoc-article-head">HUKUM YANG BERLAKU &amp; PENYELESAIAN SENGKETA</div>

    <!-- Article 5 content -->
    <div class="ben"><p>This Agreement shall be governed by the laws of the Republic of Indonesia. Any dispute shall first be attempted to be resolved through good-faith negotiation within 30 (thirty) days. If unresolved, the dispute shall be submitted to the competent Indonesian court.</p></div>
    <div class="bid"><p>Perjanjian ini diatur oleh hukum Republik Indonesia. Setiap sengketa pertama-tama akan diselesaikan secara musyawarah dengan itikad baik dalam 30 (tiga puluh) hari. Apabila tidak tercapai penyelesaian, sengketa akan diajukan ke pengadilan yang berwenang di Indonesia.</p></div>

    <!-- Article 6 heading -->
    <div class="ben bdoc-article-head">GENERAL PROVISIONS</div>
    <div class="bid bdoc-article-head">KETENTUAN UMUM</div>

    <!-- Article 6 content -->
    <div class="ben"><p>This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior understandings. Any amendment must be made in writing and signed by both Parties. This Agreement may be executed in counterparts, each deemed an original.</p></div>
    <div class="bid"><p>Perjanjian ini merupakan keseluruhan kesepakatan antara Para Pihak dan menggantikan semua pemahaman sebelumnya. Setiap perubahan harus dilakukan secara tertulis dan ditandatangani oleh kedua Pihak. Perjanjian ini dapat dibuat dalam beberapa rangkap, yang masing-masing dianggap sebagai asli.</p></div>

    <!-- Closing -->
    <div class="ben"><p><em>IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the date first written above.</em></p></div>
    <div class="bid"><p><em>DEMIKIAN Perjanjian Kerahasiaan ini dibuat dan ditandatangani oleh Para Pihak pada tanggal sebagaimana tercantum di atas.</em></p></div>

</div>

<!-- Signature block -->
<div class="signature-row">
    <div class="sig-col ben">
        <p><strong>DISCLOSING PARTY / PIHAK PEMBERI</strong></p>
        <p>{{nama_pihak_pemberi}}</p>
        <div class="sig-line"></div>
        <p>Tanda Tangan / Signature</p>
    </div>
    <div class="sig-col bid">
        <p><strong>RECEIVING PARTY / PIHAK PENERIMA</strong></p>
        <p>{{nama_pihak_penerima}}</p>
        <div class="sig-line"></div>
        <p>Tanda Tangan / Signature</p>
    </div>
</div>

  </div>

</body>
</html>`;


// Variable mapping
const variableMapping = {
  tanggal: 'tanggal',
  nama_pihak_pemberi: 'nama_pihak_pemberi',
  jenis_pihak_pemberi: 'jenis_pihak_pemberi',
  alamat_pihak_pemberi: 'alamat_pihak_pemberi',
  nama_pihak_penerima: 'nama_pihak_penerima',
  jenis_pihak_penerima: 'jenis_pihak_penerima',
  alamat_pihak_penerima: 'alamat_pihak_penerima',
  tujuan_pengungkapan: 'tujuan_pengungkapan',
  jenis_informasi_rahasia: 'jenis_informasi_rahasia',
  durasi_rahasia: 'durasi_rahasia',
  penggunaan_informasi: 'penggunaan_informasi',
  pengecualian_umum: 'pengecualian_umum',
  pengecualian_dimiliki: 'pengecualian_dimiliki',
  pengecualian_pihakketiga: 'pengecualian_pihakketiga',
  pengecualian_hukum: 'pengecualian_hukum'
};

const previewFieldLabels = {
  tanggal: 'Tanggal Perjanjian',
  nama_pihak_pemberi: 'Nama Pihak Pemberi',
  jenis_pihak_pemberi: 'Jenis Pihak Pemberi',
  alamat_pihak_pemberi: 'Alamat Pihak Pemberi',
  nama_pihak_penerima: 'Nama Pihak Penerima',
  jenis_pihak_penerima: 'Jenis Pihak Penerima',
  alamat_pihak_penerima: 'Alamat Pihak Penerima',
  tujuan_pengungkapan: 'Tujuan Pengungkapan',
  jenis_informasi_rahasia: 'Jenis Informasi Rahasia',
  durasi_rahasia: 'Durasi Kerahasiaan',
  penggunaan_informasi: 'Penggunaan Informasi'
};


// Format date to Indonesian
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Replace variables in template (forPreview adds data-field for live preview scroll/highlight)
function replaceVariables(template, data, forPreview = false) {
  let result = template;
  const previewData = { ...data };
  
  result = result.replace('{{CONDITIONAL_PEMBAYARAN_BERTAHAP}}', '');
  
  // Format dates
  if (previewData.tanggal_mulai) {
    previewData.tanggal_mulai = formatDate(previewData.tanggal_mulai);
  }
  if (previewData.tanggal_akhir) {
    previewData.tanggal_akhir = formatDate(previewData.tanggal_akhir);
  }

  Object.keys(variableMapping).forEach(key => {
    const value = previewData[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    const fieldName = key.replace(/_/g, ' ');
    
    if (value && value !== '') {
      const displayVal = key === 'batas_akhir_pelunasan' ? formatDate(value) : value;
      if (forPreview) {
        result = result.replace(
          regex,
          `<span class="filled-field preview-field" data-field="${key}">${displayVal}</span>`
        );
      } else {
        result = result.replace(regex, key === 'batas_akhir_pelunasan' ? formatDate(value) : value);
      }
    } else {
      if (forPreview) {
        result = result.replace(
          regex,
          `<span class="placeholder-field preview-field" data-field="${key}">[${previewFieldLabels[key] || fieldName}]</span>`
        );
      } else {
        result = result.replace(regex, `<mark style="background-color: #F5F5F5; padding: 2px 4px;">[${fieldName}]</mark>`);
      }
    }
  });
  
  return result;
}

// Keep inline template styles when rendering into preview containers.
function buildPreviewHtmlWithStyles(htmlContent) {
  const styleMatches = [...htmlContent.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)];
  const styleBlock = styleMatches.map(match => match[0]).join('\n');
  const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  return `${styleBlock}${bodyContent}`;
}

// Generate preview with highlighted sections
function generatePreview(formData) {
  const preview = document.getElementById('documentPreview');
  if (!preview) return;
  
  let htmlContent = replaceVariables(documentTemplate, formData, true);

  preview.innerHTML = buildPreviewHtmlWithStyles(htmlContent);
}

// Collect form data
function collectFormData() {
  const form = document.getElementById('documentForm');
  const data = {};
  
  Object.keys(variableMapping).forEach(key => {
    const element = form.elements[key];
    if (element) {
      data[key] = element.type === 'checkbox' ? element.checked : (element.value || '');
    }
  });

  return data;
}

// Save progress to localStorage
function saveProgressToLocalStorage() {
  const formData = collectFormData();
  const timestamp = Date.now();
  const saveKey = `formperjanjiankerahasiaan_progress_${timestamp}`;
  
  // Also save to a "latest" key for easy retrieval
  const latestKey = 'formperjanjiankerahasiaan_progress_latest';
  
  const saveData = {
    data: formData,
    timestamp: timestamp,
    savedAt: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(saveKey, JSON.stringify(saveData));
    localStorage.setItem(latestKey, JSON.stringify(saveData));
    
    // Show save indicator
    const indicator = document.getElementById('saveProgressIndicator');
    if (indicator) {
      indicator.style.display = 'flex';
      setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.style.display = 'none';
          indicator.style.opacity = '1';
        }, 300);
      }, 2000);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
}

// Load progress from localStorage
function loadProgressFromLocalStorage() {
  const latestKey = 'formperjanjiankerahasiaan_progress_latest';
  
  try {
    const savedData = localStorage.getItem(latestKey);
    if (!savedData) return false;
    
    const parsed = JSON.parse(savedData);
    const formData = parsed.data;
    
    // Restore form fields
    Object.keys(formData).forEach(key => {
      const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = formData[key];
        } else {
          element.value = formData[key] || '';
        }
      }
    });
    
    // Update preview and progress
    generatePreview(formData);
    updateProgress();
    
    return true;
  } catch (error) {
    console.error('Error loading progress:', error);
    return false;
  }
}

// Debounce function for auto-save
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Auto-save function (debounced)
const autoSave = debounce(() => {
  saveProgressToLocalStorage();
}, 2000);

// Update progress bar
function updateProgress() {
  const form = document.getElementById('documentForm');
  if (!form) return;
  const allFields = form.querySelectorAll('input:not([type="checkbox"]), textarea');
  
  let filledCount = 0;
  let totalCount = 0;
  
  allFields.forEach(field => {
    if (field.disabled) return;
    totalCount++;
    if (field.value && field.value.trim() !== '') {
      filledCount++;
    }
  });
  
  const percentage = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
  
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercentage = document.getElementById('progressPercentage');
  
  if (progressBarFill) {
    progressBarFill.style.width = `${percentage}%`;
  }
  if (progressPercentage) {
    progressPercentage.textContent = `${percentage}%`;
  }
}

// Generate full document preview for preview view (same rules as live preview: spans + {{key}} empty)
function generateFullDocumentPreview(formData) {
  const fullPreview = document.getElementById('fullDocumentPreview');
  if (!fullPreview) return;

  let htmlContent = replaceVariables(documentTemplate, formData, true);
  fullPreview.innerHTML = buildPreviewHtmlWithStyles(htmlContent);
}

// Preview view functions removed - now using separate page

// Replace variables in TXT template (syarat_ketentuan_penggunaan_platform_template_variables.txt)
function replaceTxtTemplateVariables(txt, data) {
  let result = txt;
  const d = Object.assign({}, data || {});

  const txtMapping = {
    Tanggal: 'tanggal',
    'Nama Perusahaan': 'nama_perusahaan',
    'Alamat Perusahaan': 'alamat_perusahaan',
    Website: 'website',
    Email: 'email',
    'Nomor WhatsApp': 'nomor_whatsapp'
  };

  Object.keys(variableMapping).forEach(key => {
    const val = d[key];
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val !== undefined && val !== '' ? val : '');
  });
  Object.entries(txtMapping).forEach(([txtKey, formKey]) => {
    const val = d[formKey];
    result = result.replace(new RegExp(`\\{\\{${txtKey}\\}\\}`, 'g'), val !== undefined && val !== '' ? val : '');
  });

  return result;
}

const TEMPLATE_CACHE_VERSION = '20260411f';
const SOURCE_DOCX_FILENAME = 'Sepakatee I Perjanjian Kerahasiaan.docx';
const SOURCE_DOCX_URL = '../../../legaldocs/' + encodeURIComponent(SOURCE_DOCX_FILENAME).replace(/%20/g, '%20');
const JSZIP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

// Generate Word from TXT template (tools/templates/documents/syarat_ketentuan_penggunaan_platform_template_variables.txt)
async function generateWordFromTxtTemplate(formData) {
  const url = '../documents/syarat_ketentuan_penggunaan_platform_template_variables.txt?v=' + TEMPLATE_CACHE_VERSION;

  let txtContent;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Template tidak ditemukan');
    txtContent = await res.text();
  } catch (e) {
    console.warn('TXT template fetch failed, using embedded HTML:', e);
    const fullHtml = replaceVariables(documentTemplate, formData);
    const wordHtml = fullHtml.replace('<html lang="id">',
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="id">');
    return downloadWordBlob(wordHtml);
  }

  const bodyText = replaceTxtTemplateVariables(txtContent, formData);
  const escaped = bodyText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const paragraphs = escaped.split(/\n\n+/).filter(p => p.trim()).map(p => `<p style="margin: 0 0 1em 0; text-align: justify;">${p.replace(/\n/g, '<br>')}</p>`).join('');
  const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="id">
<head><meta charset="UTF-8"><title>Perjanjian Kerahasiaan</title></head>
<body style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
${paragraphs}
</body>
</html>`;

  downloadWordBlob(wordHtml);
}

function downloadWordBlob(html) {
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Perjanjian_Kerahasiaan.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate and download Word document (uses TXT template, fallback to HTML)
function generateWordDocument(formData) {
  generateWordFromTxtTemplate(formData);
}

function xmlEscape(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildTokenRunRegex(token) {
  // Word sering memecah teks placeholder ke beberapa <w:t> berbeda.
  // Regex ini mengizinkan sisipan tag XML di antara tiap karakter token.
  const chars = Array.from(String(token || ''));
  const sep = '(?:<[^>]+>)*';
  return new RegExp(chars.map((c) => escapeRegExp(c)).join(sep), 'g');
}

function replaceTokenSmart(input, token, value) {
  const escapedValue = xmlEscape(value || '');
  let out = input;
  // Fast path: token utuh dalam 1 text node.
  out = out.split(token).join(escapedValue);
  // Fallback: token terpecah antar XML tags/runs.
  out = out.replace(buildTokenRunRegex(token), escapedValue);
  return out;
}

function replaceFirstN(input, needle, values) {
  const rx = buildTokenRunRegex(needle);
  let idx = 0;
  return input.replace(rx, () => {
    if (idx >= values.length) return needle;
    const v = values[idx++];
    if (v == null || String(v).trim() === '') return needle;
    return xmlEscape(v);
  });
}

function replaceAllLiteral(input, needle, value) {
  if (value == null || String(value).trim() === '') return input;
  return replaceTokenSmart(input, needle, value);
}

function downloadBlobAsFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function ensureJsZipLoaded() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-jszip="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.JSZip));
      existing.addEventListener('error', () => reject(new Error('Gagal memuat JSZip')));
      return;
    }
    const s = document.createElement('script');
    s.src = JSZIP_CDN;
    s.async = true;
    s.dataset.jszip = '1';
    s.onload = () => resolve(window.JSZip);
    s.onerror = () => reject(new Error('Gagal memuat JSZip'));
    document.head.appendChild(s);
  });
}

async function buildFilledSourceDocx(formData) {
  await ensureJsZipLoaded();
  const res = await fetch(SOURCE_DOCX_URL + '?v=' + TEMPLATE_CACHE_VERSION, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Template DOCX tidak tersedia di server');

  const arrayBuffer = await res.arrayBuffer();
  const zip = await window.JSZip.loadAsync(arrayBuffer);
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) throw new Error('Template DOCX tidak valid');

  let xml = await docXmlFile.async('string');
  const d = Object.assign({}, formData || {});

  if (d.tanggal_mulai) d.tanggal_mulai = formatDate(d.tanggal_mulai);
  if (d.tanggal_akhir) d.tanggal_akhir = formatDate(d.tanggal_akhir);
  if (d.batas_akhir_pelunasan) d.batas_akhir_pelunasan = formatDate(d.batas_akhir_pelunasan);

  // Token di DOCX memakai {{...}} (sering terpecah antar <w:r>); replaceTokenSmart menanganinya.
  xml = replaceFirstN(xml, '{{NAMA}}', [d.nama_pemberi_sewa, d.nama_penyewa]);
  xml = replaceFirstN(xml, '{{NOMOR_KTP}}', [d.ktp_pemberi_sewa, d.ktp_penyewa]);
  xml = replaceFirstN(xml, '{{ALAMAT}}', [d.alamat_pemberi_sewa, d.alamat_penyewa]);
  xml = replaceFirstN(xml, '{{JUMLAH HARI/BULAN}}', [
    d.jumlah_hari_pemberitahuan,
    d.jumlah_hari_bulan_keterlambatan,
  ]);
  xml = replaceFirstN(xml, '{{JUMLAH HARI}}', [
    d.jumlah_hari_pelanggaran,
    d.jumlah_hari_bulan_keterlambatan,
    d.jumlah_hari_pelanggaran,
  ]);
  xml = replaceFirstN(xml, '{{HURUF}}', [
    d.huruf_hari_pemberitahuan,
    d.huruf_hari_pelanggaran,
    d.huruf_keterlambatan,
    d.huruf_hari_pelanggaran,
  ]);

  const map = {
    '{{NOMOR_SHM}}': d.nomor_shm,
    '{{NAMA_PEMILIK}}': d.nama_pemilik_shm,
    '{{ALAMAT_LENGKAP}}': d.alamat_lengkap_tempat,
    '{{ANGKA_NOMINAL}}': d.harga_sewa_angka,
    '{{HURUF_RUPIAH}}': d.harga_sewa_huruf,
    '{{HURUF RUPIAH}}': d.nominal_deposit_huruf,
    '{{DURASI}}': d.durasi_sewa,
    '{{TANGGAL_MULAI}}': d.tanggal_mulai,
    '{{TANGGAL_AKHIR}}': d.tanggal_akhir,
    '{{NAMA PEMILIK REKENING}}': d.nama_pemilik_rekening,
    '{{NAMA BANK}}': d.nama_bank,
    '{{NOMOR REKENING}}': d.nomor_rekening,
    '{{NOMINAL DEPOSIT}}': d.nominal_deposit,
    '{{JUMLAH CICILAN}}': d.jumlah_cicilan,
    '{{NOMINAL CICILAN}}': d.nominal_cicilan,
    '{{TANGGAL PEMBAYARAN}}': d.tanggal_pembayaran,
    '{{BATAS AKHIR PELUNASAN}}': d.batas_akhir_pelunasan,
    '{{PERSENTASE DENDA}}': d.persentase_denda,
    '{{BATAS WAKTU}}': d.batas_waktu_penyelesaian,
    '{{TEMPAT_PERJANJIAN}}': d.tempat_penandatanganan,
    '{{NAMA_HARI}}': d.hari,
    '{{NOMOR_TANGGAL}}': d.tanggal,
    '{{NAMA_BULAN}}': d.bulan,
    '{{NOMOR_TAHUN}}': d.tahun,
  };

  Object.keys(map).forEach((k) => {
    xml = replaceAllLiteral(xml, k, map[k]);
  });

  zip.file('word/document.xml', xml);
  return zip.generateAsync({ type: 'blob' });
}

async function downloadSourceDocxWithFormData(formData) {
  try {
    const blob = await buildFilledSourceDocx(formData || {});
    downloadBlobAsFile(blob, SOURCE_DOCX_FILENAME);
  } catch (e) {
    console.error('DOCX fill error:', e);
    throw e;
  }
}

// SHA256 and HMAC-SHA256 using Web Crypto API (native browser, no CSP issues)
// This avoids CSP errors from crypto-js library
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(message, key) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Clean function to remove special characters and null values
// According to iPaymu docs: "Can be caused by illegal characters (like ` or special quotes) or sending data with null values"
function cleanPaymentData(data) {
  const cleaned = {};
  
  Object.keys(data).forEach(key => {
    let value = data[key];
    
    // Skip null or undefined values
    if (value === null || value === undefined) {
      return;
    }
    
    // Keep numbers as numbers (for amount field)
    if (typeof value === 'number') {
      cleaned[key] = value;
      return;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      cleaned[key] = value.map(item => {
        if (item === null || item === undefined) return '';
        // Remove special characters that might interfere with signature
        return String(item).replace(/[`'"]/g, '').trim();
      });
    } else {
      // Remove special characters and ensure no null
      cleaned[key] = String(value).replace(/[`'"]/g, '').trim();
    }
  });
  
  return cleaned;
}

// Show payment information on payment page
function showPaymentInfo(paymentInfo) {
  // Check if we're on payment page
  if (!window.location.pathname.includes('payment.html')) {
    // If not on payment page, redirect to payment page with info
    sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    window.location.href = 'payment.html?payment=success';
    return;
  }
  
  // Show payment info card
  const paymentInfoCard = document.getElementById('paymentInfoCard');
  const paymentInfoContent = document.getElementById('paymentInfoContent');
  
  if (paymentInfoCard && paymentInfoContent) {
    let infoHTML = '';
    
    if (paymentInfo.paymentNo) {
      infoHTML += `
        <div class="payment-info-item">
          <span class="payment-info-label">Nomor ${paymentInfo.method}:</span>
          <span class="payment-info-value">${paymentInfo.paymentNo}</span>
        </div>
      `;
    }
    
    infoHTML += `
      <div class="payment-info-item">
        <span class="payment-info-label">Jumlah:</span>
        <span class="payment-info-value">Rp ${paymentInfo.amount.toLocaleString('id-ID')}</span>
      </div>
    `;
    
    if (paymentInfo.expired) {
      infoHTML += `
        <div class="payment-info-item">
          <span class="payment-info-label">Batas Waktu:</span>
          <span class="payment-info-value">${paymentInfo.expired}</span>
        </div>
      `;
    }
    
    infoHTML += `
      <div class="payment-info-item">
        <span class="payment-info-label">Reference ID:</span>
        <span class="payment-info-value">${paymentInfo.referenceId}</span>
      </div>
    `;
    
    paymentInfoContent.innerHTML = infoHTML;
    paymentInfoCard.style.display = 'block';
    
    // Scroll to payment info
    paymentInfoCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide payment method selection
    const paymentMethods = document.querySelector('.payment-methods');
    const proceedBtn = document.getElementById('proceedPaymentBtn');
    if (paymentMethods) paymentMethods.style.display = 'none';
    if (proceedBtn) proceedBtn.style.display = 'none';
  }
}

// Generate signature for iPaymu API v2
// According to iPaymu PHP sample: https://github.com/ipaymu/ipaymu-payment-v2-sample-php
// Format: 
// 1. requestBody = SHA256(jsonBody) (lowercase)
// 2. stringToSign = "POST:va:requestBody:apiKey"
// 3. signature = HMAC-SHA256(stringToSign, apiKey)
async function generateIpaymuSignature(va, apiKey, bodyString, timestamp) {
  try {
    // Step 1: Hash body with SHA256 (lowercase)
    const requestBody = await sha256(bodyString);
    
    // Step 2: Create string to sign: POST:va:requestBody:apiKey
    const stringToSign = `POST:${va}:${requestBody}:${apiKey}`;
    
    // Step 3: Generate HMAC-SHA256 signature
    const signature = await hmacSha256(stringToSign, apiKey);
    
    // Debug log - remove in production
    console.log('=== iPaymu Signature Debug (v2) ===');
    console.log('VA:', va);
    console.log('API Key (first 10):', apiKey.substring(0, 10) + '...');
    console.log('Body (JSON):', bodyString);
    console.log('RequestBody (SHA256 of body):', requestBody);
    console.log('String to sign:', stringToSign);
    console.log('Signature (HMAC-SHA256):', signature);
    console.log('Timestamp:', timestamp);
    console.log('===================================');
    
    return signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error('Crypto API not available. Please use a modern browser.');
  }
}

// NOTE: initiatePayment function has been moved to payment.js
// This function is now handled by Supabase Edge Function
// Keeping this comment for reference - do not use this old implementation
/*
// OLD IMPLEMENTATION - REMOVED
// Initiate payment with iPaymu
async function initiatePayment_OLD(formData, paymentMethod = null, paymentChannel = null) {
  try {
    // Use direct values to avoid conflict with payment.js
    // These match the credentials from iPaymu dashboard
    const IPAYMU_VA = '0000005776604685';
    const IPAYMU_API_KEY = 'SANDBOX98A25EA0-9F38-49BC-82C1-9DD6EB48AFBC';
    const PRICE = 350000;
    
    // Get proper base URL (handle file:// protocol for local testing)
    let baseUrl = window.location.origin;
    if (baseUrl.startsWith('file://')) {
      // For local testing, use a placeholder URL that iPaymu can redirect to
      // In production, this should be your actual domain
      baseUrl = 'https://sepakatee.github.io/website'; // Change to your actual domain
    }
    
    // Clean pathname - remove local file paths
    let cleanPath = window.location.pathname;
    if (cleanPath.includes('/Users/') || cleanPath.includes('sepakatee/')) {
      // Extract just the filename or use a simple path
      cleanPath = cleanPath.split('/').pop() || '/tools/templates/forms/formsyaratketentuanplatform.html';
    }
    
    // Generate unique reference ID
    // iPaymu referenceId should be alphanumeric, max 50 characters
    // Format: alphanumeric only, no special characters
    const refTimestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase();
    const referenceId = `SEWA${refTimestamp}${randomStr}`.substring(0, 50); // Max 50 chars
    
    // Get timestamp for iPaymu (format: YYYYMMDDHHmmss)
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    
    // Prepare request body for iPaymu API v2 (JSON format)
    // According to iPaymu PHP sample: https://github.com/ipaymu/ipaymu-payment-v2-sample-php
    // Format: name, phone, email, amount, notifyUrl, referenceId, paymentMethod, paymentChannel
    // Use paymentMethod and paymentChannel from parameters if provided, otherwise use defaults
    const defaultPaymentMethod = paymentMethod || 'qris'; // Default to QRIS for easier payment
    const defaultPaymentChannel = paymentChannel || 'qris'; // Default to QRIS
    
    const rawRequestBody = {
      name: (formData.nama_penyewa || 'Customer').trim(),
      phone: (formData.phone || '081234567890').trim(),
      email: (formData.email || 'customer@example.com').trim(),
      amount: PRICE, // Number, not string
      notifyUrl: `${baseUrl}/api/payment/notify`,
      referenceId: referenceId,
      paymentMethod: defaultPaymentMethod,
      paymentChannel: defaultPaymentChannel
    };
    
    // Clean the data - remove special characters and null values
    // This is critical to avoid "unauthorized signature" error
    const requestBody = cleanPaymentData(rawRequestBody);
    
    // Validate - ensure no null values
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key] === null || requestBody[key] === undefined) {
        throw new Error(`Parameter ${key} cannot be null or undefined`);
      }
    });
    
    // Store form data in sessionStorage for after payment
    sessionStorage.setItem('pendingDocument', JSON.stringify({
      formData: formData,
      referenceId: referenceId,
      timestamp: Date.now()
    }));
    
    // Convert body to JSON string - must be same for signature and request
    // According to iPaymu PHP sample, use JSON_UNESCAPED_SLASHES equivalent
    // Sort parameters alphabetically for consistency
    const sortedBody = {};
    Object.keys(requestBody).sort().forEach(key => {
      sortedBody[key] = requestBody[key];
    });
    // JSON.stringify with no escaped slashes (like JSON_UNESCAPED_SLASHES in PHP)
    const bodyString = JSON.stringify(sortedBody).replace(/\\\//g, '/');
    
    // Generate signature using iPaymu v2 format (HMAC-SHA256, not MD5!)
    const signature = await generateIpaymuSignature(IPAYMU_VA, IPAYMU_API_KEY, bodyString, timestamp);
    
    // Call iPaymu API (Sandbox)
    const response = await fetch('https://sandbox.ipaymu.com/api/v2/payment/direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'va': IPAYMU_VA,
        'signature': signature,
        'timestamp': timestamp
      },
      body: bodyString // Use same sorted body for request
    });
    
    const result = await response.json();
    
    // Debug: Log full response
    console.log('iPaymu API Response:', result);
    console.log('Response Data:', result.Data);
    console.log('Data type:', typeof result.Data);
    console.log('Data keys:', result.Data ? Object.keys(result.Data) : 'No Data');
    console.log('ReferenceId used:', referenceId);
    
    // Check for success response
    if (result.Status === 200 && result.Success === true) {
      // Log all Data properties for debugging
      if (result.Data) {
        console.log('All Data properties:', Object.keys(result.Data));
        Object.keys(result.Data).forEach(key => {
          console.log(`  ${key}:`, result.Data[key], typeof result.Data[key]);
        });
      }
      
      // Check for payment URL in different possible locations
      // iPaymu might return URL in different formats
      const paymentUrl = result.Data?.Url || 
                        result.Data?.url || 
                        result.Data?.paymentUrl || 
                        result.Data?.PaymentUrl ||
                        result.Data?.SessionUrl ||
                        result.Data?.redirectUrl ||
                        result.Data?.RedirectUrl ||
                        result.Url || 
                        result.url;
      
      if (paymentUrl) {
        // Redirect to iPaymu payment page
        console.log('✅ Payment successful! Redirecting to:', paymentUrl);
        window.location.href = paymentUrl;
        return; // Exit function successfully
      } else {
        // If no URL but success, log the full response structure for debugging
        console.warn('⚠️ Payment successful but no URL found.');
        console.warn('Full response:', JSON.stringify(result, null, 2));
        console.warn('Data keys:', result.Data ? Object.keys(result.Data) : 'No Data object');
        console.warn('ReferenceId used:', referenceId);
        
        // iPaymu doesn't return payment URL for Virtual Account (VA) payments
        // Instead, it returns Virtual Account number that user needs to pay
        const paymentData = result.Data;
        const paymentNo = paymentData?.PaymentNo || paymentData?.paymentNo;
        const totalAmount = paymentData?.Total || paymentData?.total || PRICE;
        const expired = paymentData?.Expired || paymentData?.expired;
        const channel = paymentData?.Channel || paymentData?.channel || 'BCA';
        const via = paymentData?.Via || paymentData?.via || 'VA';
        
        console.log('⚠️ No payment URL in response (VA payment)');
        console.log('Payment Data:', paymentData);
        
        // Show payment information on payment page
        showPaymentInfo({
          method: via === 'VA' ? 'Virtual Account' : via,
          channel: channel,
          paymentNo: paymentNo,
          amount: totalAmount,
          expired: expired,
          referenceId: referenceId
        });
        
        console.log('Payment created successfully. User needs to pay to VA number:', paymentNo);
        return;
      }
    } else {
      // More detailed error message
      const errorMsg = result.Keterangan || result.Message || result.Error || 'Payment initiation failed';
      console.error('Payment failed:', result);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert(`Terjadi kesalahan saat memproses pembayaran: ${error.message}\n\nSilakan coba lagi atau hubungi support jika masalah berlanjut.`);
  }
}
*/

/**
 * Pulihkan data form untuk receipt/download setelah redirect pembayaran.
 * Urutan: cadangan per ID pesanan (paling tepercaya) → session → cadangan lama + ref → autosave form terakhir.
 */
function restoreFormDataForReceipt(referenceId) {
  const ref = String(referenceId || '').trim();
  const tryParse = function (s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  };

  let raw = null;
  // Prioritas: data yang disimpan saat bayar untuk ref ini — hindari session dari tab/form lain.
  if (ref && ref !== 'N/A') {
    try {
      raw = localStorage.getItem('sep_receipt_form_' + ref);
    } catch (e0) {}
  }

  if (!raw) {
    try {
      raw = sessionStorage.getItem('previewDocumentData');
    } catch (e) {}
  }

  if (!raw) {
    let backupRef = '';
    let backup = '';
    try {
      backupRef = localStorage.getItem('previewDocumentData_ref') || '';
      backup = localStorage.getItem('previewDocumentData_backup') || '';
    } catch (e3) {}
    if (backup && backupRef === ref) raw = backup;
    if (
      !raw &&
      backup &&
      ref &&
      backupRef &&
      ref.startsWith('KNTF-') &&
      backupRef.startsWith('KNTF-') &&
      backupRef.slice(0, 13) === ref.slice(0, 13)
    ) {
      raw = backup;
    }
  }

  if (!raw) {
    try {
      const latest = localStorage.getItem('formperjanjiankerahasiaan_progress_latest');
      if (latest) {
        const parsed = tryParse(latest);
        if (parsed && parsed.data && typeof parsed.data === 'object') return parsed.data;
      }
    } catch (e4) {}
  }

  if (raw) {
    const fd = tryParse(raw);
    if (fd && typeof fd === 'object') return fd;
  }
  return null;
}

if (typeof window !== 'undefined') {
  window.restoreFormDataForReceipt = restoreFormDataForReceipt;
}

// Create minimal formData for fallback download when session/localStorage data is lost (e.g. after iPaymu redirect)
function createFallbackFormData(buyerName, buyerEmail) {
  const fallback = {};
  Object.keys(variableMapping).forEach(key => { fallback[key] = ''; });
  fallback.pembayaran_bertahap = false;
  if (buyerName && buyerName !== '-') fallback.nama_penyewa = buyerName;
  if (buyerEmail && buyerEmail !== '-') fallback.email = buyerEmail;
  return fallback;
}

// Download document after payment confirmation
function downloadDocument(formData) {
  const refFromUrl = new URLSearchParams(window.location.search).get('ref');
  const refFromStorage = sessionStorage.getItem('paymentReferenceId');
  const effectiveRef = refFromUrl || refFromStorage || '';

  // On receipt flow, fill data directly into source DOCX to preserve formatting.
  if (window.location.pathname.includes('receipt.html')) {
    const btn = document.getElementById('downloadBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Menyiapkan dokumen...';
    }
    downloadSourceDocxWithFormData(formData || {})
      .catch((err) => {
        alert((err && err.message) || 'Gagal menyiapkan file .docx');
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML =
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
            '<polyline points="7 10 12 15 17 10"></polyline>' +
            '<line x1="12" y1="15" x2="12" y2="3"></line>' +
            '</svg>Download Dokumen';
        }
      });
    return;
  }

  if (!formData) {
    // Try to get from sessionStorage
    const pendingDoc = sessionStorage.getItem('pendingDocument');
    if (pendingDoc) {
      const parsed = JSON.parse(pendingDoc);
      formData = parsed.formData;
    }
  }
  
  if (formData) {
    generateWordDocument(formData);
    // Clear sessionStorage after download
    sessionStorage.removeItem('pendingDocument');
  }
}

// Check payment status from URL parameters
function checkPaymentStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  
  if (paymentStatus === 'success') {
    // Payment successful, enable download
    const pendingDoc = sessionStorage.getItem('pendingDocument');
    if (pendingDoc) {
      const parsed = JSON.parse(pendingDoc);
      const formData = parsed.formData;
      
      // Generate preview if on preview page
      if (window.location.pathname.includes('preview.html')) {
        generateFullDocumentPreview(formData);
        
        // Enable download button
        const payBtn = document.getElementById('payAndDownloadBtn');
        if (payBtn) {
          payBtn.textContent = 'Download Dokumen';
          payBtn.onclick = () => downloadDocument(formData);
        }
      }
    }
  } else if (paymentStatus === 'cancel') {
    // Payment cancelled
    alert('Pembayaran dibatalkan. Anda dapat mencoba lagi nanti.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('documentForm');
  
  // Initialize preview
  generatePreview({});
  updateProgress();
  const formGroups = document.querySelectorAll('.form-group--collapsible');

  formGroups.forEach(group => {
    const header = group.querySelector('.form-group__header');
    const toggle = group.querySelector('.group-toggle');
    if (!header) return;
    header.addEventListener('click', (event) => {
      if (event.target.closest('input, textarea, select')) return;
      if (toggle && event.target.closest('.group-toggle')) {
        event.preventDefault();
      }
      group.classList.toggle('is-expanded');
    });
  });
  
  // Update progress on input (with auto-save). Don't call generatePreview here -
  // it replaces entire innerHTML and resets scroll. updateLivePreview handles
  // per-field span updates and scrollToPreview.
  form.addEventListener('input', () => {
    updateProgress();
    autoSave(); // Auto-save on input
  });
  
  form.addEventListener('change', () => {
    const formData = collectFormData();
    generatePreview(formData);
    updateProgress();
    autoSave();
  });
  
  // Manual save button
  const saveProgressBtn = document.getElementById('saveProgressBtn');
  if (saveProgressBtn) {
    saveProgressBtn.addEventListener('click', () => {
      saveProgressToLocalStorage();
    });
  }
  
  // Load progress on page load
  loadProgressFromLocalStorage();
  
  
  // Handle form submission - show preview instead of download
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = collectFormData();
    const loader = document.getElementById('downloadLoader');
    const spinner = document.getElementById('loaderSpinner');
    const success = document.getElementById('loaderSuccess');
    const loaderText = document.getElementById('loaderText');
    const generateBtn = document.getElementById('generateBtn');
    
    // Show loader immediately
    if (loader) {
      loader.classList.add('is-visible');
    }
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Memproses...';
    }
    
    try {
      // Save form data to sessionStorage for preview page
      sessionStorage.setItem('previewDocumentData', JSON.stringify(formData));
      
      // Show success state after brief delay
      setTimeout(() => {
        if (spinner) spinner.style.display = 'none';
        if (success) success.style.display = 'block';
        if (loaderText) loaderText.textContent = 'Dokumen berhasil dibuat!';
        
        // Redirect to preview page
        setTimeout(() => {
          window.location.href = 'preview.html';
        }, 800);
      }, 1200);
      
    } catch (error) {
      console.error('Error generating document:', error);
      if (loader) loader.classList.remove('is-visible');
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Generate Dokumen';
      }
      if (spinner) spinner.style.display = 'block';
      if (success) success.style.display = 'none';
      if (loaderText) loaderText.textContent = 'Memproses dokumen Anda...';
      alert('Terjadi kesalahan saat membuat dokumen. Silakan coba lagi.');
    }
  });
  
  // Preview view buttons removed - now handled in preview.html
  
  // Check payment status on page load (only for preview page)
  if (window.location.pathname.includes('preview.html')) {
    checkPaymentStatus();
  }
  
  // ===== REAL-TIME LIVE PREVIEW =====
  // Track currently active field
  let currentActiveField = null;
  
  // Scroll preview to show the relevant field and highlight it
  function scrollToPreview(fieldName) {
    if (!fieldName) return;
    if (currentActiveField) currentActiveField.classList.remove('active-editing');
    const placeholders = document.querySelectorAll(`.preview-field[data-field="${fieldName}"]`);
    if (placeholders.length > 0) {
      const placeholder = placeholders[0];
      placeholder.classList.add('active-editing');
      currentActiveField = placeholder;
      const scrollContainer = document.querySelector('.preview-panel-new');
      if (scrollContainer) {
        requestAnimationFrame(() => {
          const placeholderRect = placeholder.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const relativeTop = placeholderRect.top - containerRect.top + scrollContainer.scrollTop;
          scrollContainer.scrollTo({
            top: Math.max(0, relativeTop - scrollContainer.clientHeight / 3),
            behavior: 'smooth'
          });
        });
      }
    }
  }
  
  // Remove active highlight when user clicks outside form fields
  document.addEventListener('click', (e) => {
    const isFormField = e.target.closest('#documentForm input, #documentForm textarea, #documentForm select');
    if (!isFormField && currentActiveField) {
      currentActiveField.classList.remove('active-editing');
      currentActiveField = null;
    }
  });
  
  function updateLivePreview() {
    const formInputs = document.querySelectorAll('#documentForm input, #documentForm textarea, #documentForm select');
    formInputs.forEach((input) => {
      input.addEventListener('focus', function() {
        scrollToPreview(this.id || this.name);
      });
      input.addEventListener('input', function() {
        const fieldName = this.id || this.name;
        const fieldValue = this.value.trim();
        const placeholderText = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        document.querySelectorAll(`.preview-field[data-field="${fieldName}"]`).forEach(pf => {
          pf.textContent = fieldValue || `[${placeholderText}]`;
          pf.classList.toggle('filled', !!fieldValue);
        });
        if (fieldName === 'harga_sewa_angka') {
          const terbilangField = document.querySelector('.preview-field[data-field="harga_sewa_huruf"]');
          if (terbilangField && fieldValue) {
            const angka = parseInt(fieldValue.replace(/\D/g, ''));
            if (!isNaN(angka)) {
              terbilangField.textContent = numberToWords(angka) + ' Rupiah';
              terbilangField.classList.add('filled');
            }
          }
        }
        scrollToPreview(fieldName);
      });
    });
  }
  
  // Convert number to Indonesian words
  function numberToWords(num) {
    if (num === 0) return 'Nol';
    
    const ones = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
    const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
    const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
    
    if (num < 10) return ones[num];
    if (num >= 10 && num < 20) return teens[num - 10];
    if (num >= 20 && num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    }
    if (num >= 100 && num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      return (hundred === 1 ? 'Seratus' : ones[hundred] + ' Ratus') + (rest ? ' ' + numberToWords(rest) : '');
    }
    if (num >= 1000 && num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const rest = num % 1000;
      return (thousand === 1 ? 'Seribu' : numberToWords(thousand) + ' Ribu') + (rest ? ' ' + numberToWords(rest) : '');
    }
    if (num >= 1000000) {
      const million = Math.floor(num / 1000000);
      const rest = num % 1000000;
      return numberToWords(million) + ' Juta' + (rest ? ' ' + numberToWords(rest) : '');
    }
    
    return num.toString();
  }
  
  // Initialize live preview
  console.log('🔄 About to initialize live preview...');
  updateLivePreview();
  console.log('✅ Live preview initialization complete!');
  
  // ===== WIZARD NAVIGATION LOGIC =====
  let currentWizardStep = 1;
  const totalSteps = 4;
  
  // Map steps to form groups
  const stepGroups = {
    1: ['informasi-umum'],
    2: ['pemberi'],
    3: ['penerima'],
    4: ['ketentuan']
  };
  
  function updateWizardStep() {
    // Update progress circles
    document.querySelectorAll('.step-new').forEach((step, index) => {
      const stepNum = index + 1;
      const circle = step.querySelector('.step-circle-new');
      
      if (stepNum < currentWizardStep) {
        step.classList.add('completed');
        step.classList.remove('active');
        circle.textContent = '✓';
      } else if (stepNum === currentWizardStep) {
        step.classList.add('active');
        step.classList.remove('completed');
        circle.textContent = stepNum;
      } else {
        step.classList.remove('active', 'completed');
        circle.textContent = stepNum;
      }
    });
    
    // Show/hide form groups based on current step
    const currentGroups = stepGroups[currentWizardStep] || [];
    document.querySelectorAll('.form-group[data-group]').forEach(group => {
      const groupName = group.getAttribute('data-group');
      if (currentGroups.includes(groupName)) {
        group.style.display = 'block';
        group.classList.add('is-expanded');
      } else {
        group.style.display = 'none';
      }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    // Show/hide prev button
    if (currentWizardStep === 1) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
    }
    
    // Show/hide next vs generate button
    if (currentWizardStep === totalSteps) {
      nextBtn.style.display = 'none';
      generateBtn.style.display = 'flex';
    } else {
      nextBtn.style.display = 'flex';
      generateBtn.style.display = 'none';
    }
    
    // Scroll to top of form
    document.querySelector('.wizard-header').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Next button handler
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentWizardStep < totalSteps) {
        currentWizardStep++;
        updateWizardStep();
      }
    });
  }
  
  // Previous button handler
  const prevBtn = document.getElementById('prevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentWizardStep > 1) {
        currentWizardStep--;
        updateWizardStep();
      }
    });
  }
  
  // Generate button handler
  const generateBtnWizard = document.getElementById('generateBtn');
  if (generateBtnWizard) {
    generateBtnWizard.addEventListener('click', () => {
      // Trigger form submission
      const form = document.getElementById('documentForm');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });
  }
  
  // Initialize wizard on page load
  updateWizardStep();
});
