# ENTIREFM REDIRECT & MIGRATION POLICY
**Authority:** Single Source of Truth for URL Redirect Management
**Status:** ACTIVE & ENFORCED

---

## 1. CORE GOVERNING LAW

### THE HISTORIC WIX URL ESTATE IS THE ABSOLUTE FLOOR, NOT THE CEILING.

Every genuine historic Wix content URL is an independent, permanent commercial SEO asset.
Under no circumstances may any protected historic route be redirected into a newer hub, a parent service, a sibling city, or a generic landing page.

---

## 2. ALLOWED REDIRECTS (TECHNICAL URL NORMALISATION)

The only permissible 301/308 redirects in `/config/production-redirects.json` are:

1. **Protocol Normalisation:**
   - `http://` → `https://`
2. **Canonical Host Normalisation:**
   - `https://entirefm.com/*` → `https://www.entirefm.com/*` (Single-hop 301 preserving path & query)
3. **Historic Trailing Slash Normalisation:**
   - `/path/` → `/path` (handled automatically)
4. **Historic Wix Query & Dynamic Asset Normalisation:**
   - Historic Wix file/attachment URLs, blog tag pagination parameters, or obsolete feed endpoints.
5. **Genuinely Discontinued Non-Content URLs:**
   - Outdated third-party vendor tracking endpoints that never carried search rankings.

---

## 3. STRICTLY PROHIBITED REDIRECTS

The following redirect patterns are **VIOLATIONS** of EntireFM SEO architecture and will cause automated build failures:

1. ✗ **Historic City Page Consolidation:**
   - Example: `/london-facilities-management -> /fm-london` (PROHIBITED: Both must exist as independent 200 pages)
   - Example: `/facilities-management-manchester -> /fm-manchester` (PROHIBITED)
2. ✗ **Historic Service Flattening:**
   - Example: `/hvac-contractor -> /services/hvac` or `/services` (PROHIBITED: /hvac-contractor must exist as independent 200 page)
   - Example: `/cleaning-services -> /services/cleaning` (PROHIBITED)
3. ✗ **Historic Sector Sub-path Remapping:**
   - Example: `/commercial-facilities-management -> /sectors/commercial` (PROHIBITED: Must remain at flat root URL)
4. ✗ **Historic Article Merging:**
   - Example: `/post/what-is-facilities-management-1 -> /post/what-is-facilities-management` (PROHIBITED)
5. ✗ **Redirecting Any Protected Historic URL into Homepage (`/`):**
   - PROHIBITED.

---

## 4. CODE-LEVEL ENFORCEMENT & SAFETY GATE

Every pull request and build runs `npm run validate:redirects` and `npm run seo:audit`.

```typescript
if (route.historic || route.routeProvenance === 'LEGACY_VERIFIED' || route.routeProvenance === 'LEGACY_PROTECTED_BY_DIRECTIVE') {
  if (redirectSources.has(route.path)) {
    throw new Error(`FATAL SEO REGRESSION: Protected route ${route.path} appears in redirects.json`);
  }
}
```

---

## 5. AUDIT STATUS
- **Total Redirects in Production:** 424
- **Historic Wix Content URLs in Redirects:** 0 (0% - ZERO TOLERANCE)
- **Status:** 100% COMPLIANT
