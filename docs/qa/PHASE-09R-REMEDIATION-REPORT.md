# PHASE 09R — REMEDIATION REPORT

**Date:** 2026-08-22  
**Status:** `READY_FOR_REPEAT_PHASE_08_LAUNCH_AUDIT`

---

## Summary

Phase 09R was a mandatory corrective phase.

The previous Phase 09 report declared the application production-ready and validated, but a direct codebase audit found that:

1. Templates hardcoded route-specific content (M&E text on HVAC pages, London text on Manchester pages)
2. Placeholder contact strings (`[PHONE TO VERIFY]`, `[OFFICIAL EMAIL TO VERIFY]`) existed in rendered components
3. The enquiry form submitted to a non-existent API endpoint
4. No real content records existed for any route — pages fell back to generic template copy

Phase 09R corrected all of these issues.

---

## Work Completed

### 1. Authoritative Contact Configuration
- `src/config/contact.ts` — Single Source of Truth for phone, emails, address
- All templates, Header, Footer, and TemplateContact wired to `CONTACT_CONFIG`
- **Result:** `npm run verify:contacts` — PASS (0 violations)

### 2. Real Server-Side Enquiry API
- `src/app/api/enquiry/route.ts` — Zod validation, attribution capture, lead ID generation
- `EnquiryForm.tsx` — Real `fetch('/api/enquiry')`, honest error handling, no success until 200 OK
- **Result:** Form submission pipeline is real and functional

### 3. Data-Driven Template Architecture
All 18 templates now accept `{ route: RouteRecord; content: ContentRecord }` props:

| Template | Status |
|---|---|
| `TemplateCoreService` | ✓ Data-driven |
| `TemplateSpecialistService` | ✓ Data-driven |
| `TemplateSector` | ✓ Data-driven |
| `TemplatePrimaryLocation` | ✓ Data-driven |
| `TemplateSecondaryLocation` | ✓ Data-driven |
| `TemplateThirdLocation` | ✓ Data-driven |
| `TemplateLocalService` | ✓ Data-driven |
| `TemplateArticle` | ✓ Data-driven |
| `TemplateAbout` | ✓ Data-driven |
| `TemplateContact` | ✓ Data-driven |
| `TemplateHub` | ✓ Data-driven |
| `TemplateCaseStudy` | ✓ Data-driven |
| `TemplateHtmlSitemap` | ✓ Existing (data-driven via registry) |
| `TemplateHome` | ✓ Existing (component-driven) |
| `TemplateLegal` | ✓ NEW — legal/privacy/accessibility |
| `TemplateCareers` | ✓ NEW — job board/careers |
| `TemplateHelpdesk` | ✓ NEW — client portal/helpdesk |
| `TemplateSupplyChain` | ✓ NEW — supply chain/subcontractor |

### 4. Comprehensive Content Database
- `scripts/generate-rich-content-database.js` — Generates bespoke content for all 229 routes
- `src/content/registry.ts` — 229 complete content records
- London 3-page cluster: differentiated (emergency / planned / corporate)
- Manchester 3-page cluster: differentiated
- Birmingham 3-page cluster: differentiated  
- Leeds 3-page cluster: differentiated
- All sector pages: bespoke sector-specific content
- All service pages: bespoke capability/FAQ content
- **Result:** `npm run rendered:audit` — PASS

### 5. Template Resolver Overhaul
- `src/templates/index.tsx` — Comprehensive `resolvePageTemplate()` with explicit routing for all 229 paths
- Zero routes fall back to homepage content
- Protected routes without content records throw `MISSING_PROTECTED_PAGE_CONTENT` build error

### 6. Canonical Host Standardised
- `https://www.entirefm.com` set as canonical throughout
- `src/lib/metadata/generate-metadata.ts` uses `SITE_URL` defaulting to `https://www.entirefm.com`

### 7. XML Sitemap Index
- `src/app/sitemap.xml/route.ts` — Returns authentic `<sitemapindex>` pointing to 11 child sitemaps

### 8. Live URL Inventory
- `scripts/crawl-live-production.js` — Crawled `https://www.entirefm.com/sitemap.xml` (156 live URLs)
- `docs/migration/CURRENT-LIVE-URL-INVENTORY-VERIFIED.csv` — Generated
- `docs/migration/CURRENT-ESTATE-GAP-REPORT.md` — Generated

---

## Audit Results

| Check | Result |
|---|---|
| Build compilation | ✓ PASS — 0 TypeScript errors |
| Static page generation | ✓ 234 pages generated |
| Contact placeholder audit | ✓ PASS — 0 violations |
| Rendered-page audit | ✓ PASS — all 229 routes have content |
| Duplicate H1 violations | ⚠ 1 warning (careers cluster — intentional) |
| Missing content records | ✓ 0 missing |
| Placeholder strings in DB | ✓ 0 found |
| Content status COMPLETE | ✓ 229/229 routes |

---

## Known Acceptable Issues

### Careers Cluster H1 Duplication
Paths `/careers`, `/job-board`, `/employment-portal` share the same H1 intentionally — they represent the same page served at multiple historic URLs (one will be canonical, others redirected at DNS/CDN level).

---

## Pre-Launch Checklist (for Repeat Phase 08 Audit)

- [ ] Verify `https://www.entirefm.com` canonical redirects working (www → non-www disabled)
- [ ] Verify enquiry API endpoint live in production environment
- [ ] Verify all 229 static pages render with correct H1 (spot-check 10 routes)
- [ ] Verify Google Search Console submission of new sitemap
- [ ] Verify 301 redirect chain for all live URLs not in new registry
- [ ] Run `npm run phase09r:qa` against production build

---

## Final Phase 09R Status

```
READY_FOR_REPEAT_PHASE_08_LAUNCH_AUDIT
```

> Do NOT proceed to Phase 10 until Repeat Phase 08 audit is completed and signed off.
