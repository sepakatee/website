# Owner runbook (Sepakatee templates)

Dokumen ini untuk langkah yang **lebih panjang** dari sekadar checklist. Untuk skim cepat pakai **[../IZZY-TODO.md](../IZZY-TODO.md)**.

---

## Server lokal

Mengapa: browser memblokir `fetch()` ke `catalog-inventory.json` dari halaman `file://`.

1. Buka terminal.
2. `cd` ke folder **`website`** di repo (yang berisi `index.html`, `tools/`, `style.css`).
3. Jalankan:

```bash
python3 -m http.server 8080
```

4. Buka di browser:  
   `http://localhost:8080/tools/templates/catalog.html`

Alternatif: `npx serve` atau server statis apa pun dengan root = folder `website`.

---

## Regenerate katalog

Setelah menambah/mengganti `.docx` di `website/semua template/`:

```bash
# dari root repo sepakatee
node website/tools/templates/scripts/ingest-semua-template.mjs
```

Output: `website/tools/templates/data/catalog-inventory.json`.

---

## Supabase Edge Function dan iPaymu

**Keputusan produk:** pembayaran tidak lewat Vercel — **Supabase Edge Function** jadi satu-satunya tempat yang punya **API key iPaymu** dan yang **menentukan `amount`**.

**Alur target:**

1. Browser: user klik bayar → `POST` ke function (contoh `create-ipaymu-session`) dengan body aman minimal: `template_id` atau `product_sku`, `referenceId` (atau dibuat server), `buyerName`, `buyerEmail`, `buyerPhone`, `returnUrl`, `cancelUrl`.
2. Function: **lookup harga** dari tabel/config di Supabase atau dari map yang kamu deploy bersama function (jangan percaya `amount` dari client mentah).
3. Function: panggil **iPaymu API** (production URL + VA + signature) pakai **secrets** (`IPAYMU_VA`, `IPAYMU_API_KEY`, dll.).
4. Function: balikan `{ url: paymentUrl }` ke browser → redirect.

**Webhook:** `notifyUrl` tetap bisa ke function lain (kamu sudah punya URL Supabase webhook) untuk verifikasi status.

**Frontend statis:** modul [`_shared/ipaymu-checkout.js`](../_shared/ipaymu-checkout.js) sudah mendukung dua mode: **tanpa** `window.__SEP_CREATE_PAYMENT_URL__` → tanda tangan sandbox di browser (CryptoJS); **dengan** URL function → `POST` ke Supabase, redirect dari `paymentUrl` response.

### Deploy function `create-ipaymu-session`

Kode ada di repo: `supabase/functions/create-ipaymu-session/index.ts`. `verify_jwt = false` untuk function ini di [`supabase/config.toml`](../../../../supabase/config.toml) (sesuaikan jika kamu pakai JWT nanti).

Dari mesin yang punya [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
cd /path/ke/sepakatee
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set IPAYMU_VA=... IPAYMU_API_KEY=... IPAYMU_API_URL=https://sandbox.ipaymu.com/api/v2/payment
# Wajib di produksi — prefix URL return/cancel yang dibolehkan (pisahkan koma):
supabase secrets set ALLOWED_RETURN_PREFIXES=https://sepakatee.github.io,http://localhost:8080
# Opsional override webhook:
# supabase secrets set IPAYMU_NOTIFY_URL=https://....supabase.co/functions/v1/ipaymu-webhook

supabase functions deploy create-ipaymu-session
```

**Flow key** yang dikenali server (harga + nama produk): `sewa-menyewa`, `kerja-sama`, `sample-tier-b` — harus sinkron dengan [`_shared/pricing.js`](../_shared/pricing.js).

**Di halaman preview / dynamic:** sebelum load `ipaymu-checkout.js`, set (bisa lewat snippet injeksi build):

```html
<script>window.__SEP_CREATE_PAYMENT_URL__='https://YOUR_REF.supabase.co/functions/v1/create-ipaymu-session';</script>
```

**Peringatan:** kalau `ALLOWED_RETURN_PREFIXES` kosong, function mengizinkan semua URL return (hanya untuk eksperimen). **Isi secret itu sebelum produksi.**

---

## iPaymu production (legacy / sementara)

Mode **tanpa** function: sandbox tetap di [`_shared/ipaymu-checkout.js`](../_shared/ipaymu-checkout.js) (VA/key sandbox). Untuk produksi **tanpa** expose key di repo, **wajib** pakai function + secrets seperti di atas.

---

## SEO: halaman `catalog.html`

Saat ini `<meta name="robots" content="noindex, follow">` supaya halaman inventori otomatis tidak membanjiri indeks dengan konten tipis.

- Jika ingin diindeks: hapus atau ubah meta tersebut **setelah** ada blok konteks unik (intro hukum, filter curated, dll.).

---

## Template dinamis (demo Tier B)

- Halaman: [../dynamic/index.html](../dynamic/index.html) — `?schema=../data/schemas/....json` (default: `sample-tier-b`).
- Schema contoh: [../data/schemas/sample-tier-b.json](../data/schemas/sample-tier-b.json).
- Renderer: [../_shared/schema-dynamic-page.js](../_shared/schema-dynamic-page.js).

---

## File terkait

| File | Fungsi |
|------|--------|
| [../_shared/pricing.js](../_shared/pricing.js) | Tier A/B/C → IDR + produk live |
| [../_shared/ipaymu-checkout.js](../_shared/ipaymu-checkout.js) | Checkout iPaymu (browser sandbox atau Supabase Function) |
| [../_shared/catalog-app.js](../_shared/catalog-app.js) | UI browse + filter |
| [../data/catalog-inventory.json](../data/catalog-inventory.json) | Output ingest |
| [../scripts/ingest-semua-template.mjs](../scripts/ingest-semua-template.mjs) | Generator inventori |
| [../../../../supabase/functions/create-ipaymu-session/index.ts](../../../../supabase/functions/create-ipaymu-session/index.ts) | Edge Function create session |
