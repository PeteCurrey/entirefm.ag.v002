# EntireFM Pre-Launch SEO Scorecard & Quality Gate

> **Document:** `/docs/seo-rebuild/PRE-LAUNCH-SEO-SCORECARD.md`  
> **Phase:** 02P — Quality Assurance & Risk Mitigation  
> **Fundamental Principle:** **Zero tolerance for broken redirect chains, unhandled historic URLs, or diluted canonical equity. The site will not be launched until 100% of P0 gates pass.**

---

## 1. Quality Gate Verification Checklist

| Audit Category | Specific Test Requirement | Pass Standard | Failure Action | Status |
|---|---|---|---|---|
| **1. Historic URL Preservation** | Every URL in `URL-MIGRATION-MANIFEST.csv` and `seo-routes.json` must resolve to HTTP 200 (if active) or HTTP 301 (if redirected). | 100% (220/220) | Block launch; repair broken redirect routes immediately. | **LOCKED** |
| **2. Zero 404 Errors** | Automated crawl of all historic G1, G2, and G3 URLs must yield 0 unhandled 404 or 500 status codes. | 0 Errors | Trace route in Next.js middleware and register missing 301. | **LOCKED** |
| **3. Single-Hop Redirects** | No redirect chains (A -> B -> C). All redirects must resolve in exactly 1 hop (A -> 301 -> Final Target). | 100% Single Hop | Flatten middleware redirect rules. | **LOCKED** |
| **4. Canonical Tag Alignment** | Self-referencing canonical tag on every indexable page matching the exact final URL path (lowercase, trailing slash consistent). | 100% Match | Update Next.js `metadata.alternates.canonical`. | **LOCKED** |
| **5. Robots & Staging Shield** | Staging environments must return `X-Robots-Tag: noindex, nofollow` and password protection until official DNS switchover. | 100% Shielded | Verify Vercel / hosting headers prior to build preview. | **LOCKED** |
| **6. XML Sitemap Validity** | `sitemap.xml` dynamically generated, strictly containing indexable 200 OK canonical URLs, valid `<lastmod>`, matching sitemap index schema. | Valid XML | Regenerate sitemap script. | **LOCKED** |
| **7. Semantic Heading Hierarchy** | Exactly one `<h1>` per page matching target commercial keyword intent; logical `<h2>` and `<h3>` nested hierarchy. | 0 Missing / Duplicate H1s | Refactor template heading tags. | **LOCKED** |
| **8. Server-Side Rendering (SSR)** | All core commercial copy, headings, and internal links must be fully rendered in the initial HTML payload (not dependent on client-side JS). | 100% SSR Payload | Audit Next.js Server Components vs Client Components. | **LOCKED** |
| **9. Structured Data (JSON-LD)** | Validated `ProfessionalService`, `LocalBusiness`, `Service`, `FAQPage`, and `Organization` schema with 0 critical syntax errors on Rich Results Test. | 100% Error-Free | Fix schema props in Next.js Layout/Page headers. | **LOCKED** |
| **10. Local Phone & Address Proof** | Verified phone click-to-call links (`tel:`) and operational addresses accurately populated (no placeholder strings left in live build). | 100% Verified | Manual human sign-off on contact database. | **GATE** |
| **11. Form Delivery Verification** | Embedded quote engines and contact forms successfully route leads to CRM and trigger email dispatch to operations team. | 100% Receipt Rate | End-to-end webhook and API route testing. | **GATE** |
| **12. Core Web Vitals (CWV)** | LCP < 2.0s, CLS < 0.1, INP < 200ms on both mobile and desktop audits. | Pass (Green) | Optimize hero images (Next.js Image), pre-connect CDN fonts. | **GATE** |
