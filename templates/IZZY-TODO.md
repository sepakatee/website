# Izzy — yang perlu kamu lakukan (skim-friendly)

Ringkasan cepat: **bold** = penting. Emoji = kategori. Detail panjang ada di **[docs/OWNER-RUNBOOK.md](docs/OWNER-RUNBOOK.md)**.

---

## **Sekarang (biar katalog jalan di laptop)**

- **Buka `catalog.html` lewat server lokal** — `fetch()` tidak jalan kalau file dibuka langsung (`file://`).  
  - **Cara cepat:** dari folder `website` jalankan `python3 -m http.server 8080` lalu buka `http://localhost:8080/tools/templates/catalog.html`  
  - **Lebih lengkap:** [OWNER-RUNBOOK.md § Server lokal](docs/OWNER-RUNBOOK.md#server-lokal)

---

## **Sebelum launch beneran (uang sungguhan)**

- **Pembayaran lewat Supabase Edge Function** (bukan Vercel): frontend cukup kirim `product_id` / `template_id`; **harga & tanda tangan iPaymu** di server. Kunci produksi di **Supabase secrets**.  
  - Detail alur: [OWNER-RUNBOOK.md — Supabase Edge Function dan iPaymu](docs/OWNER-RUNBOOK.md#supabase-edge-function-dan-ipaymu)  
- Sementara dev: sandbox iPaymu masih bisa di `preview.html` — OK untuk demo.

---

## **Konten & hukum (opsional)**

- Kalau mau perhalus tier manual: [docs/TIER-RUBRIC.md](docs/TIER-RUBRIC.md)

---

## **Setelah nambah / ubah file `.docx` di `semua template/`**

- **Jalankan ulang ingest** supaya `catalog-inventory.json` mutakhir:  
  `node website/tools/templates/scripts/ingest-semua-template.mjs`  
  - [OWNER-RUNBOOK.md § Regenerate katalog](docs/OWNER-RUNBOOK.md#regenerate-katalog)

---

## **Bundle (ditunda)**

- **Belum ada tugas** sampai kamu putuskan isi paket + harga.

---

# **IZZY TO DO** (checklist)

- [ ] **Tes** `catalog.html` via HTTP (bukan double-click file).
- [ ] **Putuskan** apakah halaman library boleh di-index Google (sekarang `noindex` — ubah di `catalog.html` kalau mau).
- [ ] **Sebelum produksi:** deploy **`create-ipaymu-session`** + secrets + **`ALLOWED_RETURN_PREFIXES`** (lihat [OWNER-RUNBOOK](docs/OWNER-RUNBOOK.md)).
- [ ] **Opsional uji function:** set `window.__SEP_CREATE_PAYMENT_URL__` di console di halaman preview, lalu bayar lagi.
- [ ] **Spot-check** beberapa dokumen bertanda **Notaris** untuk kebijakan produk (self-serve vs referral).
- [ ] **Regenerate** `data/catalog-inventory.json` setiap kali library Word berubah banyak.

---

*File ini sengaja dipisah supaya kamu bisa skim. Engineer lain baca README + runbook.*
