# EntireFM Newsletter Technical Compliance Controls

## Implemented Technical Controls

This document outlines the technical architecture implemented to adhere to UK Privacy and Electronic Communications Regulations (PECR), the UK Data Protection Act 2018, and GDPR principles.

---

### 1. Explicit Consent Recording
- **Consent Versioning**: Every subscription payload stores `consent_text_version` (`2026-V1`) and an immutable timestamp `consented_at`.
- **Origin Page Attribution**: The exact URL where the user submitted their email is recorded (`signup_page`).
- **No Inferred Consent**: Commercial RFQ and contact form submissions (`/api/enquiry`) are strictly isolated from the newsletter database. Submitting an operational enquiry does NOT subscribe a contact to marketing broadcasts.

---

### 2. Unsubscribe & Preference Centre
- **Unique Security Token**: Every subscriber is assigned a cryptographically generated UUID `unsubscribe_token`.
- **One-Click Execution**: Unsubscribe links in emails directly resolve to `/fm-briefing/unsubscribe?token=[UUID]` without requiring account creation, logins, or multi-step questionnaires.
- **Immediate State Mutation**: The database record is transitioned to `UNSUBSCRIBED` upon submission and copied to the suppression table.

---

### 3. Permanent Suppression Database
- **Exclusion Guarantee**: When an address is marked as unsubscribed, bounced, or complained, it is committed to `newsletter_suppressions`.
- **Pre-Send Filter**: The campaign dispatch pipeline filters all outgoing recipient lists against `newsletter_suppressions` before sending.
- **No Accidental Re-Subscription**: CSV imports cannot re-activate an address listed in the suppression table.

---

### 4. Audit Logging & Security
- **Data Protection**: All subscriber database operations run server-side using the Supabase Service Role key; table RLS blocks public client scraping.
- **Export Logging**: Admin audience exports require authenticated session authorization.
