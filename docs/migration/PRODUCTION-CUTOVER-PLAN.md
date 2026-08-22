# PRODUCTION CUTOVER & LAUNCH EXECUTION PLAN
## EntireFM SEO Rebuild — Phase 08
**Authority:** Ordered step-by-step procedure for Phase 09 production cutover.  
**Rule:** DO NOT EXECUTE until human launch approval is explicitly granted.

---

## Pre-Cutover Verification (T-Minus 1 Hour)

1. [ ] Confirm `npm run migration:audit` passes with 0 errors.
2. [ ] Confirm `npm run validate:routes` passes with 0 errors.
3. [ ] Confirm `npm run seo:audit` passes with 0 errors.
4. [ ] Confirm `npm run build` completes successfully (234/234 static routes).
5. [ ] Take snapshot backup of current live production state and DNS zone records.

---

## Cutover Sequence (T-0)

1. **Deploy Production Build:** Deploy release commit to production hosting environment.
2. **Configure Production Environment Variables:** Set `NEXT_PUBLIC_SITE_URL="https://entirefm.com"` and `NODE_ENV="production"`.
3. **Verify Edge Normalisation:** Test `http://`, `http://www.`, and `https://www.` redirect in 1 hop to `https://entirefm.com`.
4. **Verify Robots.txt & Noindex Removal:**
   * Fetch `https://entirefm.com/robots.txt` — confirm `Allow: /` and `Sitemap: https://entirefm.com/sitemap.xml`.
   * Fetch HTML head on `/` — confirm `<meta name="robots" content="index, follow">`.
5. **Run Production Smoke Test:** Execute `node scripts/production-smoke-test.js`.
6. **Run Full Historic Route Parity Test:** Execute `node scripts/test-historic-routes-production.js` (tests all 205 historic URLs live).
7. **Verify Conversion Journeys:**
   * Submit live test enquiry via `/contact-us` and `/fm-london`.
   * Verify email notification arrival at `enquiries@entirefm.com`.
   * Verify attribution parameters (`landing_page`, `conversion_page`, UTM tags).
8. **Search Console Activation:**
   * Submit `https://entirefm.com/sitemap.xml` in GSC.
   * Inspect and request indexation for top Tier-1 P0 URLs (`/`, `/fm-london`, `/mechanical-electrical`, `/ppm`).
9. **Initiate Post-Launch Monitoring:** Begin Day 1 crawl anomaly tracking.
