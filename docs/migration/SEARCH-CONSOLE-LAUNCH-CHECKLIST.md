# GOOGLE SEARCH CONSOLE LAUNCH & SITEMAP SUBMISSION CHECKLIST
## EntireFM SEO Rebuild — Phase 08
**Generated:** 2026-08-22  
**Authority:** Step-by-step procedure for Search Console activation post-cutover. (Do not execute until production deployment is approved).

---

## 1. Pre-Submission Verification (Day 0)

1. Verify Domain DNS property ownership in Google Search Console for `entirefm.com` (Domain level: `sc-domain:entirefm.com`).
2. Verify URL-prefix property for `https://entirefm.com/`.
3. Confirm `https://entirefm.com/robots.txt` is live and returns HTTP 200 with `Allow: /` and `Sitemap: https://entirefm.com/sitemap.xml`.
4. Confirm `https://entirefm.com/sitemap.xml` returns valid XML index pointing to all 11 sub-sitemaps.

---

## 2. Sitemap Submission Sequence

1. Submit Master Index: `https://entirefm.com/sitemap.xml`
2. Validate processing status in Search Console (expect "Success" with ~229 URLs discovered).
3. Perform Live URL Inspection on Tier-1 Recovery URLs:
   * `https://entirefm.com/`
   * `https://entirefm.com/fm-london`
   * `https://entirefm.com/facilities-management-london`
   * `https://entirefm.com/london-facilities-management`
   * `https://entirefm.com/mechanical-electrical`
   * `https://entirefm.com/hvac-contractor`
   * `https://entirefm.com/ppm`
   * `https://entirefm.com/industrial-cleaning`
4. Request initial re-indexing for Tier-1 P0 URLs.
