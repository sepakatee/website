// HTML Document template with proper styling
const documentTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perjanjian Jual Beli Barang Bergerak</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');
        body { font-family: 'Manrope', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #000; background: #fff; }
        h1 { text-align: center; font-weight: bold; margin-bottom: 30px; }
        p { text-align: justify; margin: 15px 0; }
        .section-title { font-weight: bold; text-align: center; margin: 20px 0; }
        .signature-table { width: 100%; margin-top: 40px; border-collapse: collapse; }
        .signature-table td { width: 50%; padding: 20px; vertical-align: top; text-align: center; }
        .signature-line { margin-top: 80px; border-bottom: 1px solid #000; width: 200px; margin-left: auto; margin-right: auto; }
    </style>
</head>
<body>
<style>
ol.contract-numbered-list { list-style: none; counter-reset: docnum; margin: 12px 0 16px; padding: 0; }
ol.contract-numbered-list > li { counter-increment: docnum; position: relative; padding-left: 2.35em; margin: 10px 0; text-align: justify; }
ol.contract-numbered-list > li::before { content: "(" counter(docnum, decimal) ")"; position: absolute; left: 0; width: 2.1em; text-align: right; font-weight: 700; }
ol.contract-letter-list { list-style: none; counter-reset: doclet; margin: 12px 0 16px; padding: 0; }
ol.contract-letter-list > li { counter-increment: doclet; position: relative; padding-left: 2em; margin: 10px 0; text-align: justify; }
ol.contract-letter-list > li::before { content: counter(doclet, lower-alpha) "."; position: absolute; left: 0; width: 1.5em; font-weight: 700; }
ol.contract-numbered-list ol.contract-letter-list { margin: 8px 0 4px; }
ol.contract-decimal-list { list-style: none; counter-reset: clause-decimal; margin: 12px 0 16px; padding: 0; }
ol.contract-decimal-list > li { counter-increment: clause-decimal; position: relative; padding-left: 2em; margin: 10px 0; text-align: justify; }
ol.contract-decimal-list > li::before { content: counter(clause-decimal, decimal) '.'; position: absolute; left: 0; width: 1.85em; text-align: right; font-weight: 700; }
</style>
    <h1>PERJANJIAN JUAL BELI BARANG BERGERAK</h1>
    <p>PERJANJIAN JUAL BELI ini dibuat dan ditandatangani di {{tempat_penandatanganan}}, pada hari {{hari}}, tanggal {{tanggal}} bulan {{bulan}} tahun {{tahun}} (“Perjanjian”), oleh dan antara:</p>
    <ol class="contract-decimal-list">
    <li>{{nama_penjual}}, lahir di {{ttl_penjual}}, pemilik KTP nomor {{ktp_penjual}}, bertempat tinggal di {{alamat_penjual}}, selanjutnya disebut “Penjual”; dan</li>
    <li>{{nama_pembeli}}, lahir di {{ttl_pembeli}}, pemilik KTP nomor {{ktp_pembeli}}, bertempat tinggal di {{alamat_pembeli}}, selanjutnya disebut “Pembeli”,</li>
    </ol>
    <p>secara bersama-sama disebut “Para Pihak”. Para Pihak dengan ini terlebih dahulu menerangkan hal-hal sebagai berikut:</p>
    <ol class="contract-decimal-list">
    <li>Bahwa Penjual adalah perseorangan yang memiliki barang berupa {{barang_jual}}.</li>
    <li>Bahwa Penjual bermaksud untuk menjual barang tersebut kepada Pembeli dan Pembeli bersedia untuk membelinya dari Penjual.</li>
    <li>Berdasarkan hal-hal tersebut di atas, Para Pihak sepakat mengikatkan diri dalam Perjanjian ini dengan ketentuan sebagai berikut:</li>
    </ol>
    <div class="section-title">PASAL 1<br>DEFINISI DAN INTERPRETASI</div>
    <p>Kata-kata dan ungkapan-ungkapan yang digunakan dalam Perjanjian ini memiliki pengertian sebagaimana ditetapkan dalam Lampiran 1, kecuali jika konteksnya menentukan lain.</p>
    <p>Dalam Perjanjian ini, kecuali jika konteksnya menentukan lain:</p>
    <ol class="contract-numbered-list">
    <li>kata-kata yang dalam bentuk tunggal mencakup bentuk jamak dan sebaliknya;</li>
    <li>kata-kata yang mengindikasikan jenis kelamin mencakup semua jenis kelamin;</li>
    <li>rujukan kepada dokumen apapun (termasuk Perjanjian ini) mencakup rujukan pada dokumen tersebut sebagaimana diamandemen, dikonsolidasikan, ditambahkan, diperbaharui atau diganti, dari waktu ke waktu;</li>
    <li>rujukan pada suatu perjanjian mencakup setiap usaha, representasi, akta, kesepakatan atau perintah yang berkekuatan hukum, pengaturan atau pemahaman baik secara tertulis atau tidak;</li>
    <li>rujukan pada Perjanjian ini berarti mencakup rujukan pada Perjanjian ini beserta aneks, lampiran, dan ekshibitnya;</li>
    <li>rujukan pada pasal, klausul, pendahuluan, lampiran, aneks, dan ekshibit merujuk pada pasal dan klausul, serta lampiran, aneks, dan ekshibit dalam Perjanjian ini;</li>
    <li>judul hanya untuk memudahkan dan harus diabaikan dalam menafsirkan Perjanjian ini;</li>
    <li>rujukan pada setiap orang atau Pihak manapun mencakup rujukan pada penerus, penerima kuasa atau substitusi, eksekutor dan administrator;</li>
    <li>referensi kepada orang mencakup rujukan pada seseorang, perusahaan, badan usaha, asosiasi, kemitraan, perusahaan patungan, perwalian atau negara atau pemerintah atau lembaga negara atau pemerintahan;</li>
    <li>jika suatu pembayaran atau tindakan lain (tetapi untuk klausul ini) harus dilakukan atau dilaksanakan pada hari yang bukan merupakan Hari Kerja, maka tindakan tersebut harus dilakukan atau dilaksanakan pada Hari Kerja berikutnya;</li>
    <li>Perjanjian ini merupakan hasil negosiasi antara Para Pihak dan pelaksanaan Perjanjian ini harus diinterpretasikan secara netral, dan tidak lebih kuat untuk atau melawan pihak mana pun berdasarkan sumber pembuatannya;</li>
    <li>referensi pada “Rupiah” atau “Rp” adalah merujuk pada Rupiah Indonesia.</li>
    <li>Lampiran dan Apendiks merupakan bagian yang tidak terpisahkan dari Perjanjian ini.</li>
    </ol>
    <div class="section-title">PASAL 2<br>KESEPAKATAN</div>
    <p>Penjual setuju menjual dan mengalihkan hak kepemilikan atas Barang kepada Pembeli, dan Pembeli setuju membeli serta menerima pengalihan tersebut, dengan tunduk pada Perjanjian ini.</p>
    <div class="section-title">PASAL 3<br>BARANG</div>
    <p>Objek jual beli adalah barang bergerak berupa {{barang_jual}} (“Barang”).</p>
    <div class="section-title">PASAL 4<br>PENYERAHAN</div>
    <p>Penyerahan Barang oleh Penjual kepada Pembeli dilaksanakan selambat-lambatnya dalam jangka waktu {{jumlah_hari}} ({{jumlah_hari_teks}}) Hari Kerja sejak tanggal Perjanjian ini, kecuali disepakati lain secara tertulis.</p>
    <div class="section-title">PASAL 5<br>HARGA DAN PEMBAYARAN BERTAHAP</div>
    <p>Total harga barang adalah sebesar Rp {{harga_barang_angka}} ({{harga_barang_huruf}}) (“Harga Barang”). Pembayaran dilakukan secara bertahap:</p>
    <ol class="contract-letter-list">
    <li>Pembayaran Tahap 1 sebesar {{persen_tahap1}}% ({{persen_tahap1_terbilang}} persen) dari Harga Barang atau sebesar Rp {{nominal_tahap1}} ({{nominal_tahap1_huruf}} rupiah); dan</li>
    <li>Pembayaran Tahap 2 sebesar Rp {{nominal_tahap2}} ({{nominal_tahap2_huruf}} rupiah).</li>
    </ol>
    <p>Pembayaran dilakukan melalui transfer ke rekening bank atas nama {{nama_pemilik_rekening}} pada {{nama_bank}}, nomor rekening {{nomor_rekening}}, kecuali disepakati lain secara tertulis.</p>
    <div class="section-title">PASAL 6<br>DENDA KETERLAMBATAN (RINGKASAN)</div>
    <p>Untuk keterlambatan penyerahan Barang oleh Penjual, denda sebesar {{jumlah_persen}}% per hari keterlambatan dari Harga Barang dapat dikenakan, dengan jumlah keseluruhan denda tidak melebihi {{masukan_jumlah_persen}}% dari Harga Barang, sepanjang diatur lebih lanjut dalam naskah lengkap Perjanjian.</p>
    <div class="section-title">PASAL 7<br>HUKUM YANG BERLAKU</div>
    <p>Perjanjian ini diatur oleh hukum Republik Indonesia.</p>
    <div class="section-title">PASAL 8<br>PERSELISIHAN</div>
    <p>Perselisihan diselesaikan terlebih dahulu dengan musyawarah dalam waktu {{batas_waktu_penyelesaian}} hari; apabila tidak tercapai mufakat, diselesaikan di Pengadilan Negeri yang berwenang.</p>
    <div class="section-title">PASAL 9<br>KETENTUAN PENUTUP</div>
    <p>Perjanjian ini dibuat dalam rangkap yang disepakati Para Pihak. Tanda tangan efektif: {{tanda_tangan_tanggal}}.</p>
    <p>PIHAK PERTAMA</p>
    <p>_____________________________________</p>
    <p>Nama:</p>
    <p>PIHAK KEDUA</p>
    <p>_____________________________________</p>
    <p>Nama:</p>
</body>
</html>`;

// Variable mapping
const variableMapping = {
  tempat_penandatanganan: 'tempat_penandatanganan',
  hari: 'hari',
  tanggal: 'tanggal',
  bulan: 'bulan',
  tahun: 'tahun',
  nama_penjual: 'nama_penjual',
  ttl_penjual: 'ttl_penjual',
  ktp_penjual: 'ktp_penjual',
  alamat_penjual: 'alamat_penjual',
  nama_pembeli: 'nama_pembeli',
  ttl_pembeli: 'ttl_pembeli',
  ktp_pembeli: 'ktp_pembeli',
  alamat_pembeli: 'alamat_pembeli',
  barang_jual: 'barang_jual',
  harga_barang_angka: 'harga_barang_angka',
  harga_barang_huruf: 'harga_barang_huruf',
  jumlah_hari: 'jumlah_hari',
  jumlah_hari_teks: 'jumlah_hari_teks',
  persen_tahap1: 'persen_tahap1',
  persen_tahap1_terbilang: 'persen_tahap1_terbilang',
  nominal_tahap1: 'nominal_tahap1',
  nominal_tahap1_huruf: 'nominal_tahap1_huruf',
  nominal_tahap2: 'nominal_tahap2',
  nominal_tahap2_huruf: 'nominal_tahap2_huruf',
  jumlah_persen: 'jumlah_persen',
  masukan_jumlah_persen: 'masukan_jumlah_persen',
  nama_pemilik_rekening: 'nama_pemilik_rekening',
  nama_bank: 'nama_bank',
  nomor_rekening: 'nomor_rekening',
  batas_waktu_penyelesaian: 'batas_waktu_penyelesaian',
  tanda_tangan_tanggal: 'tanda_tangan_tanggal'
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
  
  Object.keys(variableMapping).forEach(key => {
    const value = previewData[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    const fieldName = key.replace(/_/g, ' ');
    
    if (value && value !== '') {
      const displayVal = value;
      if (forPreview) {
        result = result.replace(
          regex,
          `<span class="filled-field preview-field" data-field="${key}">${displayVal}</span>`
        );
      } else {
        result = result.replace(regex, displayVal);
      }
    } else {
      if (forPreview) {
        result = result.replace(
          regex,
          `<span class="placeholder-field preview-field" data-field="${key}">{{${key}}}</span>`
        );
      } else {
        result = result.replace(regex, `<mark style="background-color: #F5F5F5; padding: 2px 4px;">[${fieldName}]</mark>`);
      }
    }
  });
  
  return result;
}

// Generate preview with highlighted sections
function generatePreview(formData) {
  const preview = document.getElementById('documentPreview');
  if (!preview) return;
  
  let htmlContent = replaceVariables(documentTemplate, formData, true);
  
  const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    htmlContent = bodyMatch[1];
  }
  
  preview.innerHTML = htmlContent;
}

// Collect form data
function collectFormData() {
  const form = document.getElementById('documentForm');
  const data = {};
  
  Object.keys(variableMapping).forEach(key => {
    const element = form.elements[key];
    if (element) {
      data[key] = element.value || '';
    }
  });
  
  // Collect email (not in variableMapping but needed for payment)
  const emailElement = form.elements['email'];
  if (emailElement) {
    data.email = emailElement.value || '';
  }
  
  return data;
}

// Save progress to localStorage
function saveProgressToLocalStorage() {
  const formData = collectFormData();
  const timestamp = Date.now();
  const saveKey = `formjualbelibarangergerak_progress_${timestamp}`;
  
  // Also save to a "latest" key for easy retrieval
  const latestKey = 'formjualbelibarangergerak_progress_latest';
  
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
  const latestKey = 'formjualbelibarangergerak_progress_latest';
  
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
  const allFields = form.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], textarea');
  
  let filledCount = 0;
  let totalCount = 0;
  
  allFields.forEach(field => {
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
  const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
  fullPreview.innerHTML = bodyMatch ? bodyMatch[1] : htmlContent;
}

// Preview view functions removed - now using separate page

// Replace variables in TXT template (perjanjian_sewa_menyewa_template_variables.txt)
function replaceTxtTemplateVariables(txt, data) {
  let result = txt;
  const d = Object.assign({}, data || {});

  // Format dates for display in document
  if (d.tanggal_mulai) d.tanggal_mulai = formatDate(d.tanggal_mulai);
  if (d.tanggal_akhir) d.tanggal_akhir = formatDate(d.tanggal_akhir);
  if (d.batas_akhir_pelunasan) d.batas_akhir_pelunasan = formatDate(d.batas_akhir_pelunasan);

  // First line: tempat, hari, tanggal, bulan, tahun (replace blanks)
  result = result.replace(/ditandatangani dan dilangsungkan di\s+, pada hari\s+, tanggal\s+bulan\s+tahun\s+,/,
    `ditandatangani dan dilangsungkan di ${d.tempat_penandatanganan || ''}, pada hari ${d.hari || ''}, tanggal ${d.tanggal || ''} bulan ${d.bulan || ''} tahun ${d.tahun || ''},`);

  // Duplicate vars: {{nama}}, {{nomor_ktp}}, {{alamat_tinggal}} — first=pemberi, second=penyewa
  let n = 0;
  result = result.replace(/\{\{nama\}\}/g, () => (++n === 1 ? (d.nama_penjual || '') : (d.nama_pembeli || '')));
  n = 0;
  result = result.replace(/\{\{nomor_ktp\}\}/g, () => (++n === 1 ? (d.ktp_penjual || '') : (d.ktp_pembeli || '')));
  n = 0;
  result = result.replace(/\{\{alamat_tinggal\}\}/g, () => (++n === 1 ? (d.alamat_penjual || '') : (d.alamat_pembeli || '')));

  // TXT-specific var names -> form data
  const txtMapping = {
    masukan_nomor_shm: 'nomor_shm',
    masukan_nama_pemilik: 'nama_pemilik_shm',
    masukan_alamat_lengkap_jalan_no_rt_rw_kelurahan_kecamatan_kabupaten_kota_provinsi_kode_pos: 'alamat_lengkap_tempat',
    angka_nominal: 'harga_sewa_angka',
    huruf_rupiah: 'harga_sewa_huruf',
    durasi: 'durasi_sewa',
    jumlah_hari_bulan: 'jumlah_hari_pemberitahuan',
    huruf: 'huruf_hari_pemberitahuan',
    jumlah_hari: 'jumlah_hari_pelanggaran',
    batas_waktu: 'batas_waktu_penyelesaian'
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

const TEMPLATE_CACHE_VERSION = '20260413j';
const SOURCE_DOCX_FILENAME = 'Sepakatee I Perjanjian Jual Beli Barang Bergerak.docx';
const SOURCE_DOCX_URL = '../../../legaldocs/' + encodeURIComponent(SOURCE_DOCX_FILENAME).replace(/%20/g, '%20');
const JSZIP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

// Generate Word from TXT template (tools/templates/documents/perjanjian_sewa_menyewa_template_variables.txt)
async function generateWordFromTxtTemplate(formData) {
  const fullHtml = replaceVariables(documentTemplate, formData);
  const wordHtml = fullHtml.replace(
    '<html lang="id">',
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="id">'
  );
  downloadWordBlob(wordHtml);
}

function downloadWordBlob(html) {
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Perjanjian_Jual_Beli_Barang_Bergerak.doc';
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

  const map = {
    '{{TEMPAT_PENANDATANGANAN}}': d.tempat_penandatanganan,
    '{{HARI}}': d.hari,
    '{{TANGGAL}}': d.tanggal,
    '{{BULAN}}': d.bulan,
    '{{TAHUN}}': d.tahun,
    '{{barang_jual}}': d.barang_jual,
    '{{jumlah_hari}}': d.jumlah_hari,
    '{{jumlah_hari_teks}}': d.jumlah_hari_teks,
    '{{jumlah persen}}': d.jumlah_persen,
    '{{masukan jumlah persen}}': d.masukan_jumlah_persen,
    '{{HARGA_BARANG_ANGKA}}': d.harga_barang_angka,
    '{{HARGA_BARANG_HURUF}}': d.harga_barang_huruf,
    '{{PERSEN_TAHAP1}}': d.persen_tahap1,
    '{{PERSEN_TAHAP1_TERBILANG}}': d.persen_tahap1_terbilang,
    '{{NOMINAL_TAHAP1}}': d.nominal_tahap1,
    '{{NOMINAL_TAHAP1_HURUF}}': d.nominal_tahap1_huruf,
    '{{NOMINAL_TAHAP2}}': d.nominal_tahap2,
    '{{NOMINAL_TAHAP2_HURUF}}': d.nominal_tahap2_huruf,
    '{{TANDA_TANGAN_TANGGAL}}': d.tanda_tangan_tanggal,
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
      cleanPath = cleanPath.split('/').pop() || '/tools/templates/forms/formjualbelibarangergerak.html';
    }
    
    // Generate unique reference ID
    // iPaymu referenceId should be alphanumeric, max 50 characters
    // Format: alphanumeric only, no special characters
    const refTimestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase();
    const referenceId = `JBB${refTimestamp}${randomStr}`.substring(0, 50); // Max 50 chars
    
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
      name: (formData.nama_pembeli || 'Customer').trim(),
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
      const latest = localStorage.getItem('formjualbelibarangergerak_progress_latest');
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
  if (buyerName && buyerName !== '-') fallback.nama_pembeli = buyerName;
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
  const preview = document.getElementById('documentPreview');
  
  // Initialize preview
  generatePreview({});
  updateProgress();
  
  // Navigation functionality
  const navSections = document.querySelectorAll('.form-nav-section');
  const navItems = document.querySelectorAll('.form-nav-item');
  const formGroups = document.querySelectorAll('.form-group--collapsible');
  
  // Handle parent section toggle
  navSections.forEach(section => {
    const parentButton = section.querySelector('.form-nav-item--parent');
    if (parentButton) {
      parentButton.addEventListener('click', () => {
        section.classList.toggle('is-expanded');
      });
    }
  });
  
  // Handle navigation item clicks
  navItems.forEach(item => {
    if (!item.classList.contains('form-nav-item--parent')) {
      item.addEventListener('click', () => {
        // Remove active from all items
        navItems.forEach(i => i.classList.remove('is-active'));
        // Add active to clicked item
        item.classList.add('is-active');
        
        // Get group name
        const groupName = item.getAttribute('data-group');
        if (!groupName) return;
        
        // Close all form groups
        formGroups.forEach(group => {
          group.classList.remove('is-expanded');
        });
        
        // Open target group
        const group = document.querySelector(`[data-group="${groupName}"].form-group--collapsible`);
        if (group) {
          group.classList.add('is-expanded');
        }
      });
    }
  });
  
  // Handle pembayaran bertahap checkbox
  // Update progress on input (with auto-save). Don't call generatePreview here -
  // it replaces entire innerHTML and resets scroll. updateLivePreview handles
  // per-field span updates and scrollToPreview.
  form.addEventListener('input', () => {
    updateProgress();
    autoSave(); // Auto-save on input
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
        if (fieldName === 'harga_barang_angka') {
          const terbilangField = document.querySelector('.preview-field[data-field="harga_barang_huruf"]');
          const hurufInput = document.getElementById('harga_barang_huruf');
          if (terbilangField && fieldValue) {
            const angka = parseInt(fieldValue.replace(/\D/g, ''), 10);
            if (!isNaN(angka)) {
              const w = numberToWords(angka) + ' Rupiah';
              terbilangField.textContent = w;
              terbilangField.classList.add('filled');
              if (hurufInput && !hurufInput.value.trim()) hurufInput.value = w;
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
    2: ['pemberi-sewa', 'penyewa'],
    3: ['informasi-tempat', 'ketentuan-sewa'],
    4: ['informasi-pembayaran', 'ketentuan-lainnya']
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
