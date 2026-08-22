# CANONICAL AUDIT & PRODUCTION URL NORMALISATION
## EntireFM SEO Rebuild — Phase 08
**Generated:** 2026-08-22  
**Authority:** Single authoritative canonical configuration.  
**Rule:** 100% of indexable routes must resolve to their absolute production URL on `https://entirefm.com` with self-referencing canonicals.

---

## 1. Global Canonical Configuration

* **Production Canonical Origin:** `https://entirefm.com` (non-www, HTTPS)
* **Trailing Slash Standard:** Stripped (no trailing slash, e.g. `https://entirefm.com/mechanical-electrical`)
* **Case Standard:** Strictly lowercase (e.g. `https://entirefm.com/fm-london`)
* **Self-Canonical Compliance:** 229 / 229 indexable routes produce self-referencing canonical tags.
* **No Staging Hosts:** Zero canonical tags contain `localhost`, `vercel.app`, or `wixsite.com`.

---

## 2. Canonical Validation Table (P0 & Sample Routes)

| Route Path | Production Canonical URL | Expected Status | Self-Referencing | Validation Status |
|---|---|---|---|---|
| `/` | `https://entirefm.com` | 200 | Yes | **PASSED ✓** |
| `/fm-london` | `https://entirefm.com/fm-london` | 200 | Yes | **PASSED ✓** |
| `/facilities-management-london` | `https://entirefm.com/facilities-management-london` | 200 | Yes | **PASSED ✓** |
| `/london-facilities-management` | `https://entirefm.com/london-facilities-management` | 200 | Yes | **PASSED ✓** |
| `/mechanical-electrical` | `https://entirefm.com/mechanical-electrical` | 200 | Yes | **PASSED ✓** |
| `/hvac-contractor` | `https://entirefm.com/hvac-contractor` | 200 | Yes | **PASSED ✓** |
| `/ppm` | `https://entirefm.com/ppm` | 200 | Yes | **PASSED ✓** |
| `/industrial-cleaning` | `https://entirefm.com/industrial-cleaning` | 200 | Yes | **PASSED ✓** |
| `/industrial-cleaning-london` | `https://entirefm.com/industrial-cleaning-london` | 200 | Yes | **PASSED ✓** |
| `/industrial-facilities-management` | `https://entirefm.com/industrial-facilities-management` | 200 | Yes | **PASSED ✓** |
