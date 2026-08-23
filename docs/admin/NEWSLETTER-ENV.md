# EntireFM Newsletter & Content Distribution Engine Environment Variables

> [!NOTE]
> This document lists the environment variable names used by the EntireFM Newsletter & Content Distribution Engine. Never place secret values in repository documentation.

---

## 1. Primary Email Delivery Providers

Set either `RESEND_API_KEY` (preferred) or `POSTMARK_API_KEY` to connect live SMTP/API delivery for **The FM Briefing** and test sends. If neither is set, the system operates in **SAFE OFFLINE MOCK MODE** without failing.

| Variable Name | Purpose | Example / Format |
|---|---|---|
| `RESEND_API_KEY` | Resend API key for bulk marketing & test email delivery | `re_...` |
| `POSTMARK_API_KEY` | Postmark server API token (alternative provider) | `...` |
| `SENDGRID_API_KEY` | SendGrid API key (alternative adapter) | `SG....` |

---

## 2. Sending Domain & Identity

| Variable Name | Purpose | Default / Fallback |
|---|---|---|
| `NEWSLETTER_FROM_NAME` | Default sender display name | `EntireFM Editorial Team` |
| `NEWSLETTER_FROM_EMAIL` | Sender address for The FM Briefing | `editorial@entirefm.com` |
| `NEWSLETTER_REPLY_TO` | Reply-to address | `editorial@entirefm.com` |
| `NEWSLETTER_DOMAIN` | Production verified sending domain | `entirefm.com` |

---

## 3. Database Persistence

| Variable Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project REST URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used to write subscribers, campaigns, and suppressions |

---

## 4. Production Domain Attribution

| Variable Name | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical website domain for UTM link compilation | `https://www.entirefm.com` |
