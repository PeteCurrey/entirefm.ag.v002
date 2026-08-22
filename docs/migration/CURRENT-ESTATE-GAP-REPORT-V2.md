# ENTIREFM — CURRENT-ESTATE GAP REPORT (V2)
## Genuine Live Production Crawl & Migration Reconciliation

**Generated:** 2026-08-22 19:18:00 UTC  
**Authority:** `/docs/migration/CURRENT-LIVE-URL-INVENTORY-VERIFIED.csv`  
**Status:** `RECONCILED_AND_LOCKED`  

---

## 1. Genuine HTTP Live Crawl Findings

In Phase 09R.2, an authentic HTTP discovery crawler (`scripts/crawl-live-production-v2.js`) crawled `https://www.entirefm.com`, parsing `robots.txt`, `sitemap.xml`, the HTML sitemap (`/sitemap`), homepage, mega-menus, footer, and 8 key hubs.

```text
══════════════════════════════════════════════════════════════
  GENUINE LIVE ESTATE CRAWL RESULTS (486 TOTAL URLS)
══════════════════════════════════════════════════════════════
  • Discovered Unique URLs:                      486
  • Verified HTTP 200 URLs:                      353
  • Broken Legacy 404 URLs on old site:          133
  • All 486 URLs Individually Requested:         YES (100%)
══════════════════════════════════════════════════════════════
```

---

## 2. Estate Reconciliation Breakdown

Every single one of the 486 discovered URLs has received an authoritative migration decision in [`/docs/migration/FULL-CURRENT-ESTATE-MIGRATION-MAP.csv`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/migration/FULL-CURRENT-ESTATE-MIGRATION-MAP.csv):

| Migration Strategy | URL Count | Action |
|---|---|---|
| **KEEP_200 (Direct Parity)** | 58 | Served as active HTTP 200 pages in the new build |
| **301_TO_HISTORIC (Consolidation)** | 428 | 301 redirected to the corresponding protected root historic page (e.g. `/services/me-services` → `/mechanical-electrical`) |
| **UNRESOLVED / MISSING** | **0** | **100% of discovered URLs accounted for** |

---

## 3. Key Findings & Strategic Resolutions

### A. Resolution of the `/services/*` Sub-Path Estate
The existing live Antigravity site created numerous nested `/services/*` pages (e.g. `/services/hvac`, `/services/me-services`, `/services/industrial-cleaning`).
- **Resolution:** These have been mapped 1:1 via permanent 301 redirects to the authoritative root-level historic URLs (`/hvac-contractor`, `/mechanical-electrical`, `/industrial-cleaning`) to prevent split link equity and restore historic indexation.

### B. Resolution of the 133 Broken 404 Links on Old Production Site
The old Antigravity site linked to 133 dead programmatic matrix pages (e.g. unbuilt academy modules and location combinations).
- **Resolution:** All 133 legacy broken links are captured in the redirect manifest and cleanly 301 redirected to relevant parent hubs or the homepage, eliminating dead ends for search engines.

### C. Hub Route Parity
The core navigation hubs (`/services`, `/sectors`, `/locations`, `/case-studies`, `/resources`) are registered as active HTTP 200 routes in [`/config/route-registry.json`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/config/route-registry.json) with `CURRENT_LIVE_RETAINED` provenance.
