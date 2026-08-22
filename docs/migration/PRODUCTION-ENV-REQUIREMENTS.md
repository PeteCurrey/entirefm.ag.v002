# PRODUCTION ENVIRONMENT VARIABLES & CONFIGURATION REQUIREMENTS
## EntireFM SEO Rebuild — Phase 08
**Generated:** 2026-08-22  
**Authority:** Defines environment variable names and deployment requirements. (No secret values included).

---

## 1. Environment Variable Inventory

| Variable Name | Environment | Classification | Purpose | Expected Production Value |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Staging / Production | **REQUIRED (SEO Switch)** | Controls canonical generation, XML sitemaps, and robots.txt indexation flag. | `https://entirefm.com` |
| `NODE_ENV` | All | **REQUIRED** | Node runtime mode. | `production` |
| `FORM_NOTIFICATION_EMAIL` | Production | **REQUIRED (Leads)** | Destination inbox for verified proposal and commercial RFQ notifications. | `enquiries@entirefm.com` |
| `NEXT_PUBLIC_GA_ID` | Production Only | **OPTIONAL** | Google Analytics 4 Measurement ID for post-launch event tracking. | Production GA4 Stream ID |
| `NEXT_PUBLIC_GTM_ID` | Production Only | **OPTIONAL** | Google Tag Manager Container ID if tag management is utilised. | GTM Container ID |

---

## 2. Staging vs Production Indexation Switch

```text
STAGING MODE (Current):
NEXT_PUBLIC_SITE_URL is unset or empty -> robots.ts renders "Disallow: /", metadata renders "noindex, nofollow".

PRODUCTION MODE (Post-Cutover):
NEXT_PUBLIC_SITE_URL="https://entirefm.com" -> robots.ts allows indexing and points to sitemap.xml; metadata renders "index, follow" on all protected routes.
```
