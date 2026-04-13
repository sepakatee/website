# 301 redirects: `/tools/templates/*` → `/templates/*`

GitHub Pages **tidak** mengirim header HTTP 301 dari file HTML statis. Untuk **mempertahankan otoritas tautan** dari URL lama, pasang salah satu berikut di depan `sepakatee.com` (disarankan: **Cloudflare** dengan domain yang sama).

## Opsi A — Cloudflare Bulk Redirects (disarankan)

1. Cloudflare Dashboard → **Rules** → **Redirect Rules** (atau **Bulk Redirects**).
2. Impor daftar pasangan **sumber → tujuan** dengan status **301 Permanent Redirect**.
3. Contoh baris (sesuaikan host jika perlu):

| Sumber | Tujuan |
|--------|--------|
| `https://www.sepakatee.com/tools/templates` | `https://www.sepakatee.com/templates/` |
| `https://www.sepakatee.com/tools/templates/index.html` | `https://www.sepakatee.com/templates/` |
| `https://www.sepakatee.com/tools/templates/sewa-menyewa/landing.html` | `https://www.sepakatee.com/templates/sewa-menyewa/` |
| `https://www.sepakatee.com/tools/templates/sewa-menyewa/form.html` | `https://www.sepakatee.com/templates/sewa-menyewa/form/` |
| `https://www.sepakatee.com/tools/templates/sewa-menyewa/preview.html` | `https://www.sepakatee.com/templates/sewa-menyewa/preview/` |
| `https://www.sepakatee.com/tools/templates/sewa-menyewa/receipt.html` | `https://www.sepakatee.com/templates/sewa-menyewa/receipt/` |
| `https://www.sepakatee.com/tools/templates/jual-beli-barang-bergerak/landing.html` | `https://www.sepakatee.com/templates/jual-beli/` |
| `https://www.sepakatee.com/tools/templates/jual-beli-barang-bergerak/form.html` | `https://www.sepakatee.com/templates/jual-beli/form/` |
| `https://www.sepakatee.com/tools/templates/jual-beli-barang-bergerak/preview.html` | `https://www.sepakatee.com/templates/jual-beli/preview/` |
| `https://www.sepakatee.com/tools/templates/jual-beli-barang-bergerak/receipt.html` | `https://www.sepakatee.com/templates/jual-beli/receipt/` |

Ulangi pola yang sama untuk `payment.html` → `payment/`, `invoice.html` → `invoice/`, dan duplikat aturan untuk **apex** `https://sepakatee.com/...` jika dipakai.

## Opsi B — Fallback di repo (bukan 301)

Folder `website/tools/templates/` berisi halaman pengalihan ringan (meta refresh + `location.replace`) agar pengguna yang membookmark URL lama tidak mentok 404. Google mungkin **tidak** menganggap ini setara 301; tetap gunakan Opsi A untuk SEO kuat.
