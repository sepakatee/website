# Template tier rubric (Sepakatee)

Use this for **Pass 2** human review after automated Pass 1 (filename + family heuristics in `catalog-inventory.json`).

## Tier meaning (product + price)

| Tier | UX depth | Typical price band | When to use |
| ---- | -------- | ------------------- | ----------- |
| **A** | Full landing, guided builder, live preview, CRO | **Highest** (see `_shared/pricing.js` `TIER_PRICE_IDR.A`) | High search demand, high legal/commercial stakes, SMB repeat use (e.g. sewa properti, JV, key employment). |
| **B** | Programmatic landing + schema-driven form + standard preview | **Mid** (`TIER_PRICE_IDR.B`) | Solid commercial docs with moderate complexity; worth indexing when intent is distinct. |
| **C** | Minimal flow; fastest path to paid delivery | **Lowest** (`TIER_PRICE_IDR.C`) | Long-tail Surat Kuasa / Pernyataan variants, simple Berita Acara, or clustered children of a parent template. |

**Rule:** Same business model everywhere — **pay once per purchase**. Tier only changes **price** and **how much UI** you invest.

## Scoring dimensions (qualitative)

When **Pass 1** is wrong or borderline, score 1–5 each:

1. **Demand** (search / sales potential)
2. **Negotiation complexity** (how many moving parts / parties)
3. **Legal downside if wrong** (exposure, enforceability)
4. **Willingness to pay** (B2B vs one-off consumer)

**Tier A:** high on 2–4 and meaningful on 1.  
**Tier B:** medium on several dimensions.  
**Tier C:** low complexity or duplicate intent of a parent — or **notaris/akta** lane (often C + special disclaimer / assisted), not self-serve “premium builder.”

## Notaris / Akta

Documents that imply **notarial deed** or **NOTARIS** in the title: do **not** promise full self-serve legal equivalence; flag `requires_notary` and keep tier **C** or separate product lane until legal sign-off.

## Merge vs separate SKU

If two filenames differ only by **venue label** (salon vs mall) with **same clause skeleton**, prefer **one parent schema** + variant field — one Tier B/C SKU, not 20 Tier A pages.
