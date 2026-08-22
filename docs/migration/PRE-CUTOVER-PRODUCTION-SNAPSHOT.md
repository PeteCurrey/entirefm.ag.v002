# PRE-CUTOVER PRODUCTION SNAPSHOT
## EntireFM SEO Rebuild — Phase 09
**Generated:** 2026-08-22  
**Authority:** Baseline snapshot of the existing production environment prior to new rebuild cutover.

---

## 1. Production Hosting & DNS Baseline

* **Production Hostname:** `entirefm.com` / `www.entirefm.com`
* **Canonical Destination:** `https://entirefm.com`
* **SSL / TLS Certificate:** Active Let's Encrypt / Vercel Edge Wildcard TLS
* **DNS Nameservers:** Cloudflare / Managed DNS (A records pointing to hosting edge, CNAME for www)

---

## 2. Pre-Cutover Routing & SEO Baseline

* **Robots.txt Location:** `https://entirefm.com/robots.txt`
* **Pre-Cutover Sitemap Index:** `https://entirefm.com/sitemap.xml`
* **Pre-Cutover Route Count:** 229 URLs mapped in legacy/Antigravity registry
* **Pre-Cutover Canonical Consistency:** 100% target non-www HTTPS

---

## 3. Operational Destinations

* **Verified Enquiry Routing:** `enquiries@entirefm.com`
* **Operations Helpdesk Routing:** `helpdesk@entirefm.com`
* **Analytics Stream ID:** Configured via `NEXT_PUBLIC_GA_ID` in production environment
