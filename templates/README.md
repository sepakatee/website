# 📦 Templates Directory Structure

Clean, scalable folder structure where each template has its own complete flow.

## 🎯 Philosophy

**1 template = 1 folder** with complete user flow:
- Landing → Form → Preview → Payment → Receipt

## 📁 Directory Structure

```
/tools/templates/
├── index.html                    # Main template catalog
├── products.js                   # Template metadata & configuration
│
├── sewa-menyewa/                 # 🏠 Rental Agreement Template
│   ├── landing.html              # Template showcase & CTA
│   ├── form.html                 # User input form
│   ├── form.js                   # Form logic & validation
│   ├── preview.html              # Document preview before payment
│   ├── payment.html              # iPaymu payment integration
│   └── receipt.html              # Download & email confirmation
│
├── kerja-sama/                   # 🤝 Joint Venture Agreement Template
│   ├── landing.html
│   ├── form.html
│   ├── form.js
│   ├── preview.html
│   ├── payment.html
│   └── receipt.html
│
└── _shared/                      # ♻️ Reusable utilities
    ├── form-handler.js           # Form autosave, validation, localStorage
    ├── payment-handler.js        # iPaymu payment integration logic
    ├── preview-renderer.js       # Preview generation & formatting
    └── receipt-generator.js      # DOCX/PDF generation & download
```

## ✨ Benefits

### 1. **Self-Contained Templates**
- All files for a template live in one folder
- Easy to find everything related to a specific template
- Clear separation of concerns

### 2. **No File Chaos**
- No random files at root level
- Consistent naming across all templates
- Easy to navigate and maintain

### 3. **Reusable Logic**
- Shared utilities in `_shared/` folder
- DRY principle - no code duplication
- Easy to update common functionality

### 4. **Scalable**
- Adding new template = copy folder structure
- No need to modify multiple locations
- Clear template for creating new templates

## 🚀 Adding a New Template

### Step 1: Create Template Folder

```bash
mkdir tools/templates/new-template-name
```

### Step 2: Create Flow Files

Copy from existing template as starter:

```bash
cp tools/templates/sewa-menyewa/* tools/templates/new-template-name/
```

### Step 3: Customize Files

Update the content in each file:
- `landing.html` - Update showcase content, pricing, features
- `form.html` - Update form fields specific to your template
- `form.js` - Update form validation & data handling
- `preview.html` - Update preview rendering logic
- `payment.html` - Update payment product name & price
- `receipt.html` - Update receipt content & download logic

### Step 4: Register Template

Add to `products.js`:

```javascript
const templates = [
  // Add your template here
  { 
    name: 'Your Template Name',
    category: 'Kontrak Bisnis',
    color: 'green',
    icon: 'lease',
    available: true
  },
  // ... other templates
];

// Add URL mapping
const templateUrlMap = {
  'your-template-slug': 'new-template-name/landing.html',
  // ... other mappings
};
```

### Step 5: Test Complete Flow

1. Visit `/tools/templates/index.html`
2. Click on your new template card
3. Test the complete flow:
   - Landing → Form → Preview → Payment → Receipt

## 📝 File Naming Conventions

### Consistent Across All Templates:
- `landing.html` - Always the entry point
- `form.html` - Always the user input form
- `form.js` - Always the form logic
- `preview.html` - Always the preview page
- `payment.html` - Always the payment page
- `receipt.html` - Always the final receipt page

### Why Consistent Naming?
- Easy to find any file across templates
- Scripts can reference files predictably
- New developers understand structure immediately

## 🔧 Shared Utilities

Located in `_shared/` folder - use these to avoid code duplication:

### `form-handler.js`
- `setupAutosave(formId, storageKey, callback)`
- `saveFormData(formId, storageKey)`
- `loadFormData(formId, storageKey)`
- `validateForm(formId, requiredFields)`
- `getFormDataAsObject(formId)`

### `payment-handler.js`
- `initiatePayment(formData)` - Start iPaymu payment flow
- `normalisePhone(phone)` - Format phone to 628xxxx format

### `preview-renderer.js`
- `formatDateID(dateString)` - Format to Indonesian date
- `formatRupiah(amount)` - Format currency
- `renderTemplate(template, data)` - Replace placeholders
- `loadPreviewData(storageKey)` - Load from sessionStorage

### `receipt-generator.js`
- `generateDOCX(templateData)` - Generate Word document
- `generatePDF(templateData)` - Generate PDF
- `downloadFile(blob, filename)` - Trigger download
- `sendReceiptEmail(email, blob, filename)` - Email receipt

## 🎨 Flow Architecture

### User Journey:
```
1. Landing Page
   ↓ (User clicks "Buat Dokumen")
2. Form Page
   ↓ (User fills form & submits)
3. Preview Page
   ↓ (User reviews & clicks "Bayar")
4. Payment Page
   ↓ (iPaymu payment completes)
5. Receipt Page
   ↓ (User downloads DOCX/PDF)
```

### Data Flow:
```
Form → localStorage (autosave)
     ↓
     sessionStorage (on submit)
     ↓
Preview → sessionStorage (read)
        ↓
Payment → sessionStorage (payment info)
        ↓
Receipt → sessionStorage (read all data)
        ↓
        Download/Email
```

## 🔄 Migration Notes

### Old Structure (DEPRECATED):
```
/templates/
├── perjanjian-sewa-menyewa-tempat.html    ❌
├── forms/
│   ├── formsewamenyewa.html               ❌
│   ├── formsewamenyewa.js                 ❌
│   ├── preview-sewa-menyewa.html          ❌
│   ├── payment-sewa-menyewa.html          ❌
│   └── receipt-sewa-menyewa.html          ❌
```

### New Structure (CURRENT):
```
/templates/
├── sewa-menyewa/
│   ├── landing.html                       ✅
│   ├── form.html                          ✅
│   ├── form.js                            ✅
│   ├── preview.html                       ✅
│   ├── payment.html                       ✅
│   └── receipt.html                       ✅
```

## 🎯 Best Practices

1. **Keep templates self-contained** - All template-specific code stays in template folder
2. **Use shared utilities** - Don't duplicate common logic
3. **Consistent naming** - Always use the same file names across templates
4. **Document changes** - Update this README when structure changes
5. **Test complete flow** - Always test landing → form → preview → payment → receipt



## Pricing and tier bands

- Canonical **IDR amounts** and per-flow product names live in [`_shared/pricing.js`](_shared/pricing.js) (`window.SepakateePricing`). Tier **C** = lowest price, **B** = mid, **A** = highest.
- Template folders that include `pricing.js` on landing, preview, payment, and invoice keep **displayed prices** and **iPaymu `amount`** aligned.

## Raw `.docx` library (500+ files)

- Files live under [`../../semua template`](../../semua%20template) (path from this folder: `website/semua template`).
- Regenerate the indexed manifest (Pass-1 family tags + provisional tier heuristics):

```bash
node website/tools/templates/scripts/ingest-semua-template.mjs
```

- Output: [`data/catalog-inventory.json`](data/catalog-inventory.json). Pass-2 review guide: [`docs/TIER-RUBRIC.md`](docs/TIER-RUBRIC.md). Schema draft for config-driven templates: [`template-schema.json`](template-schema.json).



## Library browse (500+ rows)

- Halaman **[index.html](index.html)** (katalog utama) dan **[catalog.html](catalog.html)** memuat daftar dari `data/catalog-inventory.json` (pencarian, filter, tier, paginasi, harga dari `_shared/pricing.js`).
- **`data/catalog-inventory.bundle.js`** menyalin data yang sama ke `window.__SEPAKATEE_CATALOG__` agar katalog tetap jalan bila `fetch` ke JSON gagal. Regenerasi: `node website/tools/templates/scripts/build-catalog-bundle.mjs` (juga dipanggil otomatis setelah **ingest**).

## Checkout (browser vs Supabase)

- **[`_shared/ipaymu-checkout.js`](_shared/ipaymu-checkout.js)** — dipakai `sewa-menyewa/preview.html`, `kerja-sama/preview.html`, dan demo **[`dynamic/index.html`](dynamic/index.html)**. Tanpa `window.__SEP_CREATE_PAYMENT_URL__` → sandbox + CryptoJS; dengan URL itu → **POST** ke Edge Function.
- Function di repo: **[`../../../supabase/functions/create-ipaymu-session/index.ts`](../../../supabase/functions/create-ipaymu-session/index.ts)** — deploy & secrets: **[`docs/OWNER-RUNBOOK.md`](docs/OWNER-RUNBOOK.md)**.

## Template dinamis (demo)

- **[`dynamic/index.html`](dynamic/index.html)** + schema contoh **[`data/schemas/sample-tier-b.json`](data/schemas/sample-tier-b.json)** + **[`_shared/schema-dynamic-page.js`](_shared/schema-dynamic-page.js)**.

## 📞 Need Help?

Questions about the structure? Check:
1. Existing templates (sewa-menyewa, kerja-sama) as reference
2. Shared utilities documentation above
3. **`template-catalog-main.js`** untuk katalog di `index.html`

---

**Last Updated**: February 2026  
**Maintained by**: Sepakatee Dev Team
