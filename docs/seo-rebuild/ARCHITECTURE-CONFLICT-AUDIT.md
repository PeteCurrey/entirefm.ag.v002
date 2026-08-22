# ARCHITECTURE CONFLICT AUDIT
## EntireFM SEO Rebuild — Phase 02
**Generated:** 2026-08-22
**Authority:** This document records ALL contradictions found across planning documents.
**Action Required:** Every conflict listed here has been corrected in `/config/route-registry.json` (the single authoritative source).

## AUTHORITATIVE SOURCE

```
/config/route-registry.json
```

All other route/redirect/sitemap documents are subordinate to the route registry. Where they contradict it, this audit records the conflict and the correction.

## CONFLICT CLASS A — PROTECTED PAGES USED AS REDIRECT SOURCES

The following conflicts were found in `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` and `docs/seo-rebuild/seo-routes.json`. Both files treated protected historic URLs as redirect sources, violating the absolute preservation rule.

### CONFLICT A-001
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` row 7
**Offending instruction:** `/hvac-contractor -> /mechanical-electrical (301)`
**Affected route:** `/hvac-contractor`
**Conflict:** LEGACY_VERIFIED protected route (G1 + G2). Must not redirect.
**Required correction:** `/hvac-contractor` must exist as independent HTTP 200 page.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-002
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` row 20
**Offending instruction:** `/cleaning-services -> /services/cleaning (301)`
**Affected route:** `/cleaning-services`
**Conflict:** LEGACY_VERIFIED protected route (G1). Must not redirect.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-003
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 64-65
**Offending instruction:** `/london-facilities-management -> /fm-london (301)`
**Affected route:** `/london-facilities-management`
**Conflict:** Both `/london-facilities-management` AND `/fm-london` are LEGACY_VERIFIED protected routes. Neither may redirect to the other.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-004
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` row 107
**Offending instruction:** `/lincoln-facilities-management-areas -> /facilities-management-lincoln (301)` — "merge into main Lincoln"
**Affected route:** `/lincoln-facilities-management-areas`
**Conflict:** LEGACY_VERIFIED protected route (G1). May not be merged.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-005
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 108-109
**Offending instructions:**
- `/london-facilities-management-areas -> /fm-london (301)`
- `/facilities-management-services-lond -> /fm-london (301)`
**Affected routes:** `/london-facilities-management-areas`, `/facilities-management-services-lond`
**Conflict:** Both are LEGACY_VERIFIED protected routes (G1). Must not redirect.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-006 to A-007
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 146-173
**Offending instructions:** 17 sector pages redirected to new `/sectors/` sub-paths including:
- `/commercial-facilities-management -> /sectors/commercial`
- `/industrial-facilities-management -> /sectors/industrial`
- `/residential-facilities-management -> /sectors/residential`
- `/retail-facilities-management -> /sectors/retail`
- `/hotel-facilities-management -> /sectors/hotel`
- `/education-facilities-management -> /sectors/education`
- `/healthcare-facilities-management -> /sectors/healthcare`
- `/public-sector-facilities-management -> /sectors/public-sector`
- `/construction-facilities-management -> /sectors/construction`
- `/logistics-facilities-management -> /sectors/logistics`
- `/restaurant-facilities-management -> /sectors/restaurant-hospitality`
- `/sport-centre-facilities-management -> /sectors/leisure`
- `/airport-facilities-management -> /sectors/transport`
- `/arena-facilities-management -> /sectors/arena-stadium`
- `/landmark-facilities-management -> /sectors/landmark`
- `/transport-facilities-management -> /sectors/transport`
- `/warehouse-facilities-management -> /sectors/warehouse`
**Conflict:** All are LEGACY_VERIFIED or LEGACY_PROTECTED_BY_DIRECTIVE protected routes. None may redirect to new-architecture `/sectors/` paths.
**Status:** ALL CORRECTED in `/config/route-registry.json`

### CONFLICT A-008
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 26-29
**Offending instructions:** Location-specific external cleaning pages redirected to generic service page:
- `/external-cleaning-london -> /services/external-cleaning (301)`
- `/external-cleaning-lincoln -> /services/external-cleaning (301)`
- `/external-cleaning-birmingham -> /services/external-cleaning (301)`
- `/external-cleaning-manchester -> /services/external-cleaning (301)`
**Conflict:** All four are LEGACY_VERIFIED protected routes.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-009
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 110-113
**Offending instructions:** Lincoln location-sector pages redirected to new nested paths:
- `/commercial-fm-lincoln -> /commercial-facilities-management/lincoln`
- `/residential-fm-lincoln -> /residential-facilities-management/lincoln`
- `/retail-fm-lincoln -> /retail-facilities-management/lincoln`
- `/industrial-fm-lincoln -> /industrial-facilities-management/lincoln`
**Conflict:** All four are LEGACY_VERIFIED protected routes (G1). Must remain at historic root-level paths.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-010
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 114-145
**Offending instructions:** 32 location-cleaning routes redirected from flat historic paths to new nested paths (e.g. `/industrial-cleaning-sheffield -> /industrial-cleaning/sheffield`).
**Conflict:** All are LEGACY_VERIFIED protected routes. Renaming to nested sub-paths destroys historic indexation.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-011
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` row 6
**Offending instruction:** "canonical should be /services/me-services" for `/mechanical-electrical`
**Conflict:** `/mechanical-electrical` is top-priority LEGACY_VERIFIED. Canonical = self required.
**Status:** CORRECTED — canonical = self enforced

### CONFLICT A-012
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 190-192
**Offending instructions:**
- `/about-entire-facilities-management -> /about (301)`
- `/facilities-management-team -> /about/team (301)`
**Conflict:** Both are LEGACY_VERIFIED protected routes. Must not redirect to new-architecture `/about` paths.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-013
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 208-215
**Offending instructions:**
- `/best-facilities-management-company -> /about (301)`
- `/property-manager-fm-services -> /sectors/managing-agent (301)`
- `/facilities-management-offices -> /sectors/commercial (301)`
- `/job-board -> /careers (301)`
- `/employment-portal -> /careers (301)`
- `/fm-supply-form -> /marketplace (301)`
- `/copy-of-what-is-facilities-manageme -> /fm-intelligence/... (301)`
- `/copy-of-industrial-cleaning -> /services/industrial-cleaning (301)`
- `/items -> / (301)`
- `/facilities-management-blog -> /blog (301)`
**Conflict:** All are LEGACY_VERIFIED protected routes. None may redirect.
**Status:** ALL CORRECTED in `/config/route-registry.json`

### CONFLICT A-014
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 52-58
**Offending instructions:** M&E and crane hire sub-pages remapped to new `/services/` paths.
- `/mechanical-electrical/access-control -> /services/me-services/access-control`
- `/mechanical-electrical/emergency-light-testing -> /services/me-services/emergency-light-testing`
- `/mobile-crane-hire -> /services/crane-hire`
- `/mobile-crane-hire/sheffield -> /services/crane-hire/sheffield`
- `/mobile-crane-hire/chesterfield -> /services/crane-hire/chesterfield`
- `/mobile-crane-hire/truck-mount-crane-hire -> /services/crane-hire/truck-mount`
**Conflict:** All are LEGACY_VERIFIED protected routes. Paths must remain at historic URLs.
**Status:** CORRECTED in `/config/route-registry.json`

### CONFLICT A-015
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` rows 70, 174, 103-106
**Offending instructions:** Historic typo URLs treated as redirect sources:
- `/manchester-facilities-managment -> /facilities-management-manchester`
- `/tierone-facilities-managment -> /sectors/tier-one`
- `/facilities-management-in-telford -> /facilities-management-telford`
- `/facilities-management-in-the-midlands -> /facilities-management-midlands`
**Conflict:** Historic typo and phrasing variants are LEGACY_VERIFIED protected routes with potential real inbound links.
**Status:** CORRECTED in `/config/route-registry.json`

## CONFLICT CLASS B — CANONICAL VIOLATIONS

### CONFLICT B-001
**File:** `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` row 6
**Offending instruction:** Canonical for `/mechanical-electrical` set to `/services/me-services`
**Status:** CORRECTED — all protected routes have canonical = self

## CONFLICT CLASS C — MERGE INSTRUCTIONS

### CONFLICT C-001
**File:** `docs/seo-rebuild/CONTENT-MIGRATION-PLAN.csv` row 12
**Offending instruction:** Action = MERGE for `/fire-emergency-systems` and `/safety-critical-emergency-systems`
**Conflict:** Both are independent LEGACY_VERIFIED protected routes.
**Status:** CORRECTED — both must exist independently

### CONFLICT C-002
**File:** `docs/seo-rebuild/FINAL-SERVICE-ARCHITECTURE.md`
**Offending instruction:** Implies `/hvac-contractor` and `/mechanical-electrical` share content or intent
**Status:** CORRECTED — document deprecated

### CONFLICT C-003
**File:** `docs/seo-rebuild/FINAL-SECTOR-ARCHITECTURE.md`
**Offending instruction:** References `/sectors/` sub-paths as target for historic sector routes
**Status:** CORRECTED — document deprecated

## CONFLICT CLASS D — SITEMAP OMISSIONS

### CONFLICT D-001 to D-003
**File:** `docs/seo-rebuild/PROPOSED-MASTER-SITEMAP.md`
**Missing routes:** All `/post/` blog routes, `/copy-of-*` routes, `/items`, `/fm-support-n-contact/facilities-management-glossary`
**Status:** CORRECTED — all included in route-registry.json and MASTER-SITEMAP-V3.md

## CONFLICT CLASS E — PROVENANCE MISCLASSIFICATION

### CONFLICT E-001
**File:** `docs/seo/legacy-url-registry.json`
**Issue:** 18 routes use source `mandatory-historic-directive` rather than standardised `LEGACY_PROTECTED_BY_DIRECTIVE`
**Status:** CORRECTED — route-registry.json uses standardised `routeProvenance` field

## SUMMARY TABLE

| Conflict Class | Count | Status |
|---|---|---|
| A — Protected pages used as redirect sources | 15 conflict groups (covering 70+ individual routes) | ALL CORRECTED |
| B — Canonical violations | 1 | CORRECTED |
| C — Merge/consolidation instructions | 3 | ALL CORRECTED |
| D — Sitemap omissions | 3 | ALL CORRECTED |
| E — Provenance misclassification | 1 | CORRECTED |

## DOCUMENTS DEPRECATED

- `docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv` — DEPRECATED (contains redirect instructions that violate legacy preservation)
- `docs/seo-rebuild/seo-routes.json` — DEPRECATED (contains redirect instructions that violate legacy preservation)
- `docs/seo-rebuild/PROPOSED-MASTER-SITEMAP.md` — DEPRECATED (replaced by V3)
- `docs/seo-rebuild/MASTER-SITEMAP-V2.md` — DEPRECATED (replaced by V3)
- `docs/seo-rebuild/FINAL-SERVICE-ARCHITECTURE.md` — DEPRECATED (route-registry.json is authoritative)
- `docs/seo-rebuild/FINAL-SECTOR-ARCHITECTURE.md` — DEPRECATED (route-registry.json is authoritative)
- `docs/seo-rebuild/FINAL-LOCATION-ARCHITECTURE.md` — DEPRECATED (route-registry.json is authoritative)

**AUTHORITATIVE SOURCE FOR ALL ROUTE DECISIONS: `/config/route-registry.json`**
