/**
 * Auto "edukasi singkat" for katalog Word pages from judul + family (bukan isi file).
 * Bahasa Indonesia, umum — bukan nasihat hukum spesifik.
 */
(function (global) {
  'use strict';

  var FAMILY_FALLBACK = {
    perjanjian: {
      heading: 'Tentang perjanjian tertulis',
      paragraphs: [
        'Perjanjian tertulis mencatat kesepakatan para pihak agar hak dan kewajiban tidak bergantung pada ingatan lisan saja.',
        'Dokumen ini biasanya memuat identitas pihak, objek perjanjian, harga atau imbalan, jadwal pelaksanaan, dan cara menyelesaikan sengketa.',
      ],
      bullets: [
        'Pastikan identitas badan hukum/NPWP atau KTP sesuai dokumen pendukung.',
        'Tinjau pasal pemutusan kontrak, denda, dan force majeure agar seimbang.',
      ],
    },
    kontrak: {
      heading: 'Tentang kontrak bisnis',
      paragraphs: [
        'Kontrak mengatur hubungan jangka panjang atau proyek tertentu antar pihak bisnis.',
        'Struktur umum meliputi ruang lingkup, SLA, kerahasiaan, pembayaran, dan penyelesaian sengketa.',
      ],
      bullets: [
        'Samakan istilah teknis dan deliverable dengan proposal atau penawaran sebelumnya.',
        'Perjelas kepemilikan hak atas hasil kerja (IP) jika melibatkan karya atau software.',
      ],
    },
    surat_perjanjian: {
      heading: 'Tentang surat perjanjian',
      paragraphs: [
        'Surat perjanjian sering dipakai untuk kesepakatan yang lebih ringkas dari kontrak panjang, namun tetap mengikat jika memenuhi syarat hukum.',
      ],
      bullets: [
        'Cantumkan tanggal dan tempat penandatanganan.',
        'Lampirkan rujukan ke dokumen induk jika ini addendum atau amandemen.',
      ],
    },
    surat_kuasa: {
      heading: 'Tentang surat kuasa',
      paragraphs: [
        'Surat kuasa memberi wewenang kepada orang atau badan lain untuk bertindak atas nama pemberi kuasa dalam hal-hal yang dicantumkan secara tertulis.',
        'Kuasa dapat bersifat umum atau khusus; untuk urusan penting (jual beli properti, perbankan) sering membutuhkan kuasa khusus yang jelas.',
      ],
      bullets: [
        'Batasi ruang lingkup kuasa (berapa kali transaksi, batas nominal, atau jangka waktu).',
        'Cabut atau ganti kuasa secara tertulis jika situasi berubah.',
      ],
    },
    surat_pernyataan: {
      heading: 'Tentang surat pernyataan',
      paragraphs: [
        'Surat pernyataan dipakai untuk mengakui suatu fakta, komitmen, atau tanggung jawab secara tertulis.',
        'Biasanya lebih pendek dari perjanjian penuh, tetapi tetap dapat dipakai sebagai bukti administratif.',
      ],
      bullets: [
        'Gunakan bahasa yang spesifik: apa yang dinyatakan, oleh siapa, dan sejak kapan.',
        'Hindari klaim yang tidak dapat dibuktikan jika dokumen akan diajukan ke pihak ketiga.',
      ],
    },
    berita_acara: {
      heading: 'Tentang berita acara',
      paragraphs: [
        'Berita acara mencatat kejadian atau hasil pertemuan/inspeksi secara ringkas dan faktual.',
        'Sering dipakai untuk serah terima barang, hasil rapat, atau kronologi kejadian.',
      ],
      bullets: [
        'Cantumkan tempat, tanggal, jam, dan daftar hadir atau pihak yang menandatangani.',
        'Lampirkan foto atau daftar barang jika relevan.',
      ],
    },
    akta_notaris: {
      heading: 'Tentang dokumen terkait akta / notaris',
      paragraphs: [
        'Akta notaris adalah akta otentik yang dibuat menurut Undang-Undang Jabatan Notaris.',
        'Template di sini berupa kerangka atau bahan diskusi; teks final harus disesuaikan dan dibuatkan oleh notaris/PPAT yang berwenang.',
      ],
      bullets: [
        'Siapkan sertifikat, identitas pihak, dan dokumen pajak terkait sebelum konsultasi notaris.',
        'Jangan gunakan draf final tanpa paraf atau stempel notaris untuk transaksi resmi.',
      ],
    },
    kuasa_other: {
      heading: 'Tentang dokumen kuasa',
      paragraphs: [
        'Dokumen kuasa mengatur pendelegasian kewenangan tertentu dari pemberi kuasa kepada penerima kuasa.',
      ],
      bullets: [
        'Perjelas apakah kuasa dapat didelegasikan lagi (sub-kuasa) atau tidak.',
      ],
    },
    lainnya: {
      heading: 'Tentang dokumen hukum ini',
      paragraphs: [
        'Dokumen hukum bertujuan mencatat kesepakatan atau pernyataan secara tertulis agar dapat dibuktikan dan dijalankan konsisten.',
      ],
      bullets: [
        'Sesuaikan isi dengan fakta dan regulasi yang berlaku pada bidang Anda.',
        'Konsultasikan ke penasihat hukum untuk transaksi bernilai tinggi atau lintas yurisdiksi.',
      ],
    },
  };

  var TITLE_RULES = [
    {
      re: /ADDENDUM|ADENDUM/,
      heading: 'Apa itu addendum?',
      paragraphs: [
        'Addendum (lampiran tambahan) adalah dokumen yang menambah atau mengubah sebagian ketentuan perjanjian utama tanpa membatalkan kontrak induk.',
        'Umum dipakai saat jadwal, harga, ruang lingkup pekerjaan, atau pihak terkait perlu disesuaikan setelah kontrak pertama ditandatangani.',
      ],
      bullets: [
        'Selalu sebutkan judul/tanggal perjanjian induk yang diubah.',
        'Tuliskan hanya pasal yang berubah; selebihnya tetap mengacu ke kontrak asli.',
        'Para pihak yang berwenang menandatangani harus sama atau dikuasakan secara sah.',
      ],
    },
    {
      re: /PENGAKUAN\s+HUTANG|BERHUTANG|PIUTANG/,
      heading: 'Pengakuan hutang & dokumen terkait',
      paragraphs: [
        'Dokumen pengakuan hutang mencatat secara tertulis adanya utang, besarannya, dan cara pelunasan.',
        'Membantu memperjelas posisi para pihak sebelum sengketa atau sebagai lampiran administrasi.',
      ],
      bullets: [
        'Cantumkan pokok utang, bunga (jika ada), jadwal cicilan, dan konsekuensi wanprestasi.',
        'Lampirkan bukti transfer atau perjanjian sebelumnya jika menjadi dasar utang.',
      ],
    },
    {
      re: /JUAL\s*BELI.*TANAH|JUAL\s*BELI\s+TANAH|PPJB|PERJANJIAN\s+JUAL\s*BELI/,
      heading: 'Perjanjian jual beli tanah / properti',
      paragraphs: [
        'Perjanjian pra-akta (sering disebut PPJB) mengatur kesepakatan jual beli sebelum akta resmi dibuat di hadapan PPAT/notaris.',
        'Biasanya mencakup uang muka, jadwal pelunasan, serah terima, dan sanksi jika salah satu pihak mengundurkan diri.',
      ],
      bullets: [
        'Verifikasi nomor sertifikat, luas, dan status sertifikat (hak milik, HGB, dll.).',
        'Atur siapa yang menanggung pajak dan biaya balik nama.',
        'Akta otentik tetap dibuat melalui notaris/PPAT sesuai lokasi objek.',
      ],
    },
    {
      re: /SEWA.*MENYEWA|MENYEWA|KONTRAKTOR|KONTRAK\s+KARYA/,
      heading: 'Sewa menyewa & pekerjaan',
      paragraphs: [
        'Perjanjian sewa atau kerja memuat hak pakai atau pelaksanaan pekerjaan, imbalan, dan masa berlaku.',
        'Penting mengatur perawatan, sub-sewa, dan pengosongan di akhir masa.',
      ],
      bullets: [
        'Tentukan deposit, kenaikan sewa berkala, dan mekanisme perpanjangan.',
        'Untuk pekerjaan: jelaskan ruang lingkup, milestone, dan kriteria penerimaan.',
      ],
    },
    {
      re: /NDA|KERAHASIAAN|RAHASIA/,
      heading: 'Kerahasiaan (NDA)',
      paragraphs: [
        'Perjanjian kerahasiaan melindungi informasi sensitif yang dibagikan antar pihak selama diskusi atau kerja sama.',
      ],
      bullets: [
        'Definisikan apa yang dianggap “informasi rahasia” dan pengecualiannya (informasi umum, sudah diketahui publik).',
        'Atur jangka waktu kewajiban setelah hubungan usaha berakhir.',
      ],
    },
    {
      re: /KERJASAMA|KERJA\s+SAMA|MOU|PERJANJIAN\s+KERJA\s+SAMA/,
      heading: 'Kerja sama bisnis',
      paragraphs: [
        'Dokumen kerja sama mengatur pembagian peran, kontribusi, dan pembagian hasil atau risiko antar mitra.',
      ],
      bullets: [
        'Jelas mekanisme pengambilan keputusan dan exit jika salah satu pihak keluar.',
        'Pertimbangkan pasal non-kompetisi dan non-solicitation jika relevan.',
      ],
    },
    {
      re: /PHK|PEMUTUSAN\s+HUBUNGAN\s+KERJA|PKWT|PKWTT/,
      heading: 'Ketenagakerjaan',
      paragraphs: [
        'Dokumen ketenagakerjaan harus selaras dengan Undang-Undang Ketenagakerjaan dan peraturan turunannya.',
      ],
      bullets: [
        'Pastikan jenis perjanjian (PKWT/PKWTT/permanen) sesuai fakta hubungan kerja.',
        'Lampirkan aturan internal perusahaan yang dirujuk jika ada.',
      ],
    },
  ];

  function getBlock(family, title) {
    var t = String(title || '').toUpperCase();
    var i;
    for (i = 0; i < TITLE_RULES.length; i++) {
      if (TITLE_RULES[i].re.test(t)) {
        return {
          heading: TITLE_RULES[i].heading,
          paragraphs: TITLE_RULES[i].paragraphs.slice(),
          bullets: TITLE_RULES[i].bullets.slice(),
        };
      }
    }
    var fb = FAMILY_FALLBACK[family] || FAMILY_FALLBACK.lainnya;
    return {
      heading: fb.heading,
      paragraphs: fb.paragraphs.slice(),
      bullets: fb.bullets.slice(),
    };
  }

  global.SepakateeCatalogEducation = { getBlock: getBlock };
})(typeof window !== 'undefined' ? window : globalThis);
