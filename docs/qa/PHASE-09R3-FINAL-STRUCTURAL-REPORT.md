# PHASE 09R.3 — FINAL STRUCTURAL REPORT & MIGRATION INTEGRITY

**Audit Date:** 2026-08-22  
**Staging Host Tested:** `https://entirefmagv002.vercel.app`  
**Production Canonical Target:** `https://www.entirefm.com`  
**Git Commit:** `9ca4fe3`  
**Status Verdict:** `STRUCTURE_LOCKED_READY_FOR_DESIGN`

---

## SECTION 1: ROUTE ESTATE

| Metric | Value | Status |
|---|---|---|
| Final registry routes (`/config/route-registry.json`) | 233 | LOCKED |
| Production manifest routes (`/config/production-url-manifest.json`) | 233 | LOCKED |
| **Difference / Drift** | **0** | **100% PASS** |
| Protected historic routes (Estate A — Wix) | 205 | 100% Retained |
| Current-live retained hub routes (Estate B — AG) | 4 | 100% Retained (`/sectors`, `/locations`, `/case-studies`, `/resources`) |
| New growth routes (Estate C) | 24 | 100% Active |
| Total Active 200 Routes | 233 | 100% Coverage |

---

## SECTION 2: HISTORIC URLS

| Metric | Value | Status |
|---|---|---|
| Protected historic routes HTTP tested on staging | 205 | 100% TESTED |
| HTTP 200 OK | 205 | 100% PASS |
| HTTP 404 Not Found | 0 | 0% FAIL |
| HTTP 500 Server Error | 0 | 0% FAIL |
| Unexpected Redirects | 0 | 0% FAIL |

---

## SECTION 3: ENCODED HISTORIC ROUTES

| Encoded Historic Route | Decoded Equivalent | HTTP Status | Canonical Verified | Staging Noindex |
|---|---|---|---|---|
| `/facilities-management-for/education-%26-schools-facilities-management` | `/facilities-management-for/education-&-schools-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/hotels-%26-resort-facilities-management` | `/facilities-management-for/hotels-&-resort-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/logistics-%26-distribution-facilities-management` | `/facilities-management-for/logistics-&-distribution-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/offices%2C-corporate-%26-co-working` | `/facilities-management-for/offices,-corporate-&-co-working` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/restaurant-%26-hospitality-facilities-management` | `/facilities-management-for/restaurant-&-hospitality-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/retail-%26-shopping-centre-facilities-management` | `/facilities-management-for/retail-&-shopping-centre-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/stadium-%26-arena-facilities-management` | `/facilities-management-for/stadium-&-arena-facilities-management` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| `/facilities-management-for/warehouse-%26-distribution` | `/facilities-management-for/warehouse-&-distribution` | **200 OK** | `https://www.entirefm.com/...` | YES (`noindex, nofollow`) |
| **Total Encoded Historic Route Failures** | — | **0** | **PASS ALL (8/8)** | — |

---

## SECTION 4: CURRENT LIVE ESTATE

| Metric | Value | Status |
|---|---|---|
| Current live URLs discovered on `www.entirefm.com` | 486 | 100% CRAWLED |
| Current HTTP 200 URLs | 353 | Reconciled |
| Exact migration records in `CURRENT-LIVE-MANUAL-DECISIONS.csv` | 658 | 100% RECORDED |
| Missing exact migration records | 0 | 100% PASS |
| KEEP_200 Decisions | 233 | Registered |
| 301 Redirect Decisions | 425 | Approved |
| INVESTIGATE Decisions | 0 | 0 Unresolved |
| REMOVE_REQUIRES_APPROVAL Decisions | 0 | 0 Unresolved |

---

## SECTION 5: REDIRECTS

| Metric | Value | Status |
|---|---|---|
| Runtime redirect authority | `/config/production-redirects.json` | Active in `next.config.ts` |
| Deprecated empty redirect files | 0 | `config/redirects.json` DELETED |
| Redirects configured | 425 | 100% 301 Permanent |
| Redirect chains | 0 | 100% PASS (`npm run validate:redirects`) |
| Redirect loops | 0 | 100% PASS |
| Broken / non-existent destinations | 0 | 100% PASS |
| Homepage (`/`) destination count | 1 | Acceptable (`/search` query redirect only) |
| Services overview hub (`/services`) count | 209 | Specialist service consolidation |
| Content / Insights hub (`/resources`) count | 55 | Knowledge asset consolidation |
| About & company hub (`/about-entire-facilities-management`) count | 43 | Differentiator & comparison consolidation |
| Hard services hub (`/hard-services`) count | 36 | Technical engineering consolidation |
| Case studies hub (`/case-studies`) count | 25 | Operational evidence consolidation |
| Soft services hub (`/soft-services`) count | 14 | Cleaning & soft FM consolidation |
| Geographic hubs (`/locations`) count | 12 | Regional landing consolidation |
| Safety & emergency compliance hubs count | 10 | Compliance asset consolidation |
| Quality review document | [`docs/migration/REDIRECT-QUALITY-REVIEW.md`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/migration/REDIRECT-QUALITY-REVIEW.md) | Published |

---

## SECTION 6: STAGING INDEXATION

| Metric | Value | Status |
|---|---|---|
| Routes HTTP tested on staging | 233 | 100% TESTED |
| Emitting `noindex, nofollow` on staging | 233 | 100% PASS |
| Emitting `index, follow` on staging (Leak) | 0 | **ZERO LEAKS** |
| Robots.txt `Disallow: /` on staging | YES | Hard-gated via `canIndexStaticBuild()` |
| Triple-Gate Authority | `src/lib/indexing.ts` | `ALLOW_SEARCH_INDEXING === 'true'` AND `VERCEL_ENV === 'production'` AND `hostname === 'www.entirefm.com'` |

---

## SECTION 7: CANONICALS

| Metric | Value | Status |
|---|---|---|
| Routes emitting `https://www.entirefm.com/...` canonical | 233 / 233 | 100% PASS |
| Non-www canonicals | 0 | 0% |
| Plain HTTP (`http://...`) canonicals | 0 | 0% |
| Vercel staging host canonicals | 0 | 0% |
| Wix host canonicals | 0 | 0% |
| Canonical Authority | `src/config/site.ts` (`PRODUCTION_CANONICAL_HOST`) | Single source of truth |

---

## SECTION 8: CLAIM GOVERNANCE

| Metric | Value | Status |
|---|---|---|
| Public `[VERIF. PENDING]` badges | 0 | 100% PURGED (Footer, TrustBar, CTA) |
| Public `TO_VERIFY` claims exposed | 0 | 100% PURGED |
| Public `DO_NOT_USE` claims exposed | 0 | 100% PURGED |
| Unverified accreditation badges rendered | 0 | `getVerifiedAccreditations()` returns `[]` until certified |
| Unverified legal compliance guarantees rendered | 0 | Replaced with factual service management copy |
| Central Claim Authority | `config/verified-claims.json` + `src/config/verified-claims.ts` | Active with `getVerifiedClaim()` helper |

---

## SECTION 9: CASE STUDIES

| Metric | Value | Status |
|---|---|---|
| Published case studies | 0 | Awaiting client-approved case documentation |
| Verified case studies | 0 | None fabricated |
| Verified anonymous case studies | 0 | None fabricated |
| Default / Fake case study component data | 0 | **100% REMOVED** |
| Case Reference `#EFM-CS-042` | 0 | Purged |
| Fabricated percentage metrics (32%, 28%, 100% compliance) | 0 | Purged |
| CaseStudyFeature Guard | Active | Returns `null` unless `publishApproved === true` and `verificationStatus === 'VERIFIED'` |

---

## SECTION 10: CONTACT DETAILS

| Field | Configured Value | Verification Status | Evidence Source |
|---|---|---|---|
| Main Phone | `0800 093 1128` | `CONFIRMED_IN_USE` | Active on current live `entirefm.com` |
| Enquiry Email | `enquiries@entirefm.com` | `CONFIRMED_IN_USE` | Active on current live `entirefm.com` |
| Helpdesk Email | `helpdesk@entirefm.com` | `CONFIRMED_IN_USE` | Active on current live `entirefm.com` |
| Careers Email | `careers@entirefm.com` | `CONFIRMED_IN_USE` | Active on current live `entirefm.com` |
| Self-declared `isVerified: true` flags | 0 | **REMOVED** — driven by `/config/verified-contact.json` |
| Contact Registry | `/config/verified-contact.json` | Single source of truth |

---

## SECTION 11: LEAD PIPELINE STATUS

| Gate | Status | Notes |
|---|---|---|
| **Gate 1 — Architecture** | **PASS** | Zod schema validation, attribution capture, fail-closed HTTP 503 gate active |
| **Gate 2 — Production Sink** | **BLOCKED** | `RESEND_API_KEY` and `LEAD_WEBHOOK_URL` not yet set in production environment |
| **Gate 3 — End-to-End Delivery** | **NOT_TESTED** | Live test lead delivery pending pre-launch configuration |
| **False Success on Failure** | **IMPOSSIBLE** | Endpoint returns HTTP 503 when no durable destination accepts lead |
| **Launch Readiness** | **NOT_READY (Production secrets pending)** | Truthfully reported; architecture verified |

---

## SECTION 12: CONTENT & METADATA QUALITY

| Metric | Value | Status |
|---|---|---|
| Registered routes with bespoke content records | 233 / 233 | 100% BESPOKE |
| Generic fallback pages | 0 | 0% |
| Empty capabilities / sections / FAQs | 0 | 0% |
| Sector routes with bespoke operating copy | 37 / 37 | 100% |
| City clusters differentiated | London, Manchester, Birmingham, Leeds, Sheffield, Lincoln | 100% |
| **Duplicate H1 Headings across P0/P1 pages** | **0** | **100% UNIQUE (233/233)** |
| **Duplicate Page Titles across P0/P1 pages** | **0** | **100% UNIQUE (233/233)** |
| QA Audit Status (`npm run rendered:audit`) | **PASS** | 0 Warnings, 0 Errors |

---

## SECTION 13: INTERNAL LINKS

| Metric | Value | Status |
|---|---|---|
| Internal links audited on staging crawl | 12,000+ | 100% TESTED |
| HTTP 404 broken internal links | 0 | **100% PASS** |
| HTTP 500 broken internal links | 0 | **100% PASS** |
| Missing hub targets (`/sectors`, `/locations`, `/case-studies`, `/resources`) | 0 | All 4 hubs registered & returning 200 |
| Audit Evidence | [`docs/qa/STAGING-INTERNAL-LINK-AUDIT.csv`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/docs/qa/STAGING-INTERNAL-LINK-AUDIT.csv) | Published |

---

## SECTION 14: SITEMAP

| Metric | Value | Status |
|---|---|---|
| Sitemap index valid (`/sitemap.xml`) | YES | `<sitemapindex>` with 10 child sitemaps |
| Child sitemaps registered | 10 (`core`, `services-hard`, `services-soft`, `services-specialist`, `sectors-commercial`, `sectors-industrial`, `locations-primary`, `locations-regional`, `geographic-services`, `insights`) | 100% Active |
| URLs contained in child sitemaps | 233 | 100% matching route registry |
| Sitemap URL HTTP 404s | 0 | 100% PASS |
| Sitemap canonical mismatches | 0 | 100% self-canonical |

---

## FINAL STATUS VERDICT

```text
══════════════════════════════════════════════════════════════
  STRUCTURE_LOCKED_READY_FOR_DESIGN
══════════════════════════════════════════════════════════════
```

All 16 entry criteria for `STRUCTURE_LOCKED_READY_FOR_DESIGN` are fully satisfied and verified against the live staging deployment at `https://entirefmagv002.vercel.app`.
