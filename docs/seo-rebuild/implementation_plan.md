# EntireFM SEO Recovery Rebuild — Phase 01 Implementation Plan

## Objective

Reconstruct EntireFM's complete SEO history across three website generations, produce a master URL migration manifest, geographic SEO map, intent map, and proposed sitemap — all for human approval before any build begins.

## Approach

This plan involves **pure research and documentation only**. No page designs, no production deployments, no DNS changes.

### Research Strategy

1. **Parallel crawl** all three generations simultaneously using subagents
2. **Consolidate** findings into the URL Migration Manifest and supporting documents
3. **Create the Next.js shell** (no page designs) with route protection infrastructure
4. **Stop and report** — hard gate before Phase 02

## Proposed Changes

### Docs / Output Files

#### [NEW] `/docs/seo-rebuild/URL-MIGRATION-MANIFEST.csv`
Master URL database — every discovered historic and current URL with migration action

#### [NEW] `/docs/seo-rebuild/HISTORIC-SITEMAP.md`
Reconstructed hierarchy of all three generations

#### [NEW] `/docs/seo-rebuild/GEOGRAPHIC-SEO-MAP.md`
City-by-city breakdown showing all historic landing pages per city (not collapsed)

#### [NEW] `/docs/seo-rebuild/SEARCH-INTENT-MAP.md`
Maps search intent → historic page → historic URL → current page → proposed page

#### [NEW] `/docs/seo-rebuild/INTERNAL-LINKING-RECOVERY.md`
Internal linking audit comparing all three generations

#### [NEW] `/docs/seo-rebuild/CONVERSION-RECOVERY.md`
Conversion architecture comparison — forms, CTAs, phone numbers, regional contacts

#### [NEW] `/docs/seo-rebuild/TRUST-ENTITY-RECOVERY.md`
Trust signals audit — logos, case studies, accreditations, contact details

#### [NEW] `/docs/seo-rebuild/CURRENT-SITE-SALVAGE.md`
Inventory of current Antigravity site assets classified as REUSE / REFACTOR / REDESIGN / DISCARD

#### [NEW] `/docs/seo-rebuild/PROPOSED-MASTER-SITEMAP.md`
Proposed sitemap for human approval — based on historic evidence only

#### [NEW] `/config/seo-routes.json`
Machine-enforceable URL registry for build-time route protection

### Next.js Shell

#### [NEW] `entirefm-seo-rebuild/` (Next.js 15, TypeScript, App Router)
- Foundation only — no page designs
- noindex/nofollow throughout
- Route protection test infrastructure
- No production deployment

## Open Questions

> [!IMPORTANT]
> The following need human confirmation **before** content is written into pages (not blocking Phase 01 research):
> 1. Which regional telephone numbers and email addresses are currently active?
> 2. Which office/branch locations remain factually valid?
> 3. Are there any service lines that have been discontinued since Generation 1/2?
> 4. Are there historic case studies or named clients that should not be republished?

## Verification Plan

### Research Verification
- Every URL in the manifest must have a source (G1/G2/G3) and status code
- Every city with historic evidence of multiple pages must show all pages separately

### Technical Verification
- `seo-routes.json` schema validates with `ajv` or `zod`
- Build test harness checks routes against registry
- Next.js shell builds cleanly: `next build` passes

### Human Gate
**STOP after report delivery. No Phase 02 without explicit approval.**
