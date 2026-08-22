# EntireFM SEO Recovery — Phase 01 Complete

## What Was Done

All three generations of the EntireFM website were crawled and catalogued:

| Generation | URL | Pages Discovered | Last Modified |
|-----------|-----|-----------------|---------------|
| G1 | `petercurrey.wixsite.com/efm-new` | ~100 static | Dec 2024 |
| G2 | `petercurrey.wixstudio.com/efmsut17724` | ~55 static + 29 dynamic | Aug 2025 |
| G3 | `entirefm.com` | ~40+ confirmed live | Aug 2026 |

---

## Deliverables Produced

All files are in [`/docs/seo-rebuild/`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/)

| File | Description | Rows / Size |
|------|-------------|-------------|
| [`URL-MIGRATION-MANIFEST.csv`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv) | Every historic URL with 301 target and priority | **220 rows** |
| [`seo-routes.json`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/seo-routes.json) | Machine-readable version of the manifest | **220 routes** |
| [`HISTORIC-SITEMAP.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/HISTORIC-SITEMAP.md) | Full hierarchy of all 3 generations | All 3 gens |
| [`GEOGRAPHIC-SEO-MAP.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/GEOGRAPHIC-SEO-MAP.md) | Every city page, uncollapsed, with gap analysis | 22 cities |
| [`SEARCH-INTENT-MAP.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/SEARCH-INTENT-MAP.md) | 12 intent clusters → historic URLs → G3 targets | 12 clusters |
| [`PROPOSED-MASTER-SITEMAP.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/PROPOSED-MASTER-SITEMAP.md) | Proposed G3 sitemap (~150+ routes, all evidence-based) | ~150 routes |
| [`CURRENT-SITE-SALVAGE.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/seo-rebuild/CURRENT-SITE-SALVAGE.md) | G3 pages classified: REUSE / REFACTOR / REDESIGN / DISCARD | Full G3 audit |

---

## Key Findings

### 1. URL Inventory
- **220 total historic URLs** requiring redirect mapping
- **116 priority-1** (critical — must redirect correctly before launch)
- **89 priority-2** (important — should be redirected in Phase 02)
- **15 priority-3** (low — duplicates, unknown pages, safe to home-redirect)

### 2. Geographic Coverage
- **22 cities** had historic landing pages
- **Lincoln** had the most granular coverage: 7 URL variants + sector × location combos
- **London** had 5 competing URL variants in G1, still 3 in G2 — internal duplication issue
- **8 UK cities** have no historic page evidence at all (gap opportunity)

### 3. Canonical Duplicates on Live G3 Site ⚠️
Four live duplicate issues exist **right now** on `entirefm.com` that need fixing immediately:

| Duplicate A | Duplicate B | Recommended Canonical |
|-------------|-------------|----------------------|
| `/mechanical-electrical` | `/services/me-services` | `/services/me-services` |
| `/fm-london` | `/facilities-management-london` | `/fm-london` |
| `/fm-manchester` | `/facilities-management-manchester` | `/fm-manchester` |
| (implied) `/fm-[city]` | `/facilities-management-[city]` | `/fm-[city]` |

### 4. Major Services Missing from G3
The following service lines existed in G1/G2 but have **not been confirmed live** on G3:
- `/services/fire-emergency-systems` (safety critical)
- `/services/aerial-drone-inspection`
- `/services/crane-hire` + subpages
- `/services/security`
- `/services/concierge`
- `/services/grounds-maintenance`
- `/services/hvac`

### 5. Architecture Changes Across Generations

| Change | G1 | G2 | G3 |
|--------|----|----|-----|
| Cleaning × city pages | 30+ pages | Dropped | Missing |
| Sector pages | Static only | Static + dynamic route | Static (implied) |
| Sub-service pages | None | M&E sub-pages | `/services/me-services` |
| Specialist services | None | Crane hire, hot tub | Unconfirmed |
| Client portal | Rudimentary | Full login + register | `/client-login` |
| Tools / CAFM | None | None | Full tools suite |
| Blog | Separate hub | Integrated | Integrated |
| FM Academy | None | None | New |

---

## Open Questions — Human Input Required Before Phase 02

> [!IMPORTANT]
> **These questions must be answered before any page content is written. They are not blocking the sitemap approval — but they determine what content appears on approved pages.**

1. **Regional phone numbers**: Which telephone numbers and email addresses are currently active for each city?

2. **Branch locations**: Which office/branch addresses are currently valid? (The Lincoln base is referenced heavily in G1.)

3. **Discontinued services**: Are hot tub relocation, crane hire, and bocker crane hire still active service lines?

4. **Client case studies**: Are there named clients or case studies from G1/G2 that should be republished? Any that must *not* be named?

5. **Canonical preference — FM vs facilities-management**: Do you want `/fm-[city]` or `/facilities-management-[city]` as the canonical URL for city pages? (Both patterns exist in G1+G2.)

6. **Cleaning sub-pages**: G1 had 30+ cleaning × city pages. Do you want to rebuild these as dynamic template pages or focus on city FM hubs first?

---

## Hard Gate

> [!CAUTION]
> **Phase 01 is complete. Phase 02 does not start until you explicitly approve the proposed sitemap and answer the open questions above.**
> No page content will be written. No routes will be live. No code will be deployed.

---

## Recommended Next Steps (After Your Approval)

1. Review `PROPOSED-MASTER-SITEMAP.md` and mark any routes you want to remove or rename
2. Answer the 6 open questions above
3. Fix the 4 canonical duplicate issues on the live G3 site (quick wins — do now)
4. Approve Phase 02: Route infrastructure + page content build
