# EntireFM Analytics Event Taxonomy

## Overview
This document defines the strict, authoritative event taxonomy for the EntireFM analytics and attribution layer.

---

## Zero-PII Policy
Under no circumstances may personal data (names, email addresses, phone numbers, free-text form inputs) be transmitted to external analytics providers (GA4, Google Tag Manager, Search Console, etc.).

---

## Event Definitions

### 1. `page_view`
- **Trigger**: User navigates to any URL in the EntireFM estate.
- **Allowed Parameters**: `path`, `page_type`, `referrer`.
- **Prohibited Parameters**: User email, personal search query, query string PII.

### 2. `cta_click`
- **Trigger**: User clicks any primary commercial or operational CTA button.
- **Allowed Parameters**: `cta_type`, `source_page`, `source_page_type`, `service`, `location`, `position`.
- **Prohibited Parameters**: User identity.

### 3. `form_start`
- **Trigger**: User focuses the first input of a contact or RFQ form.
- **Allowed Parameters**: `form_id`, `form_page`, `page_type`, `default_service`, `default_location`.
- **Prohibited Parameters**: Input field values.

### 4. `form_submit`
- **Trigger**: User completes and submits an RFQ form (confirmed server-side).
- **Allowed Parameters**: `form_id`, `form_page`, `service_requested`, `location`, `marketing_channel`, `has_assisted_content`.
- **Prohibited Parameters**: Prospect name, phone, email, message body.

### 5. `tool_start`
- **Trigger**: User interacts with an interactive tool (PPM Schedule Builder, ROI Calculator, Compliance Calendar).
- **Allowed Parameters**: `tool_id`, `source_page`.
- **Prohibited Parameters**: Estate financial details.

### 6. `tool_complete`
- **Trigger**: Interactive tool generates complete matrix / calculation output.
- **Allowed Parameters**: `tool_id`, `asset_count_bracket`, `statutory_task_count`.
- **Prohibited Parameters**: Specific client estate addresses.

### 7. `tool_export`
- **Trigger**: User downloads or exports generated tool schedule (PDF / CSV / Print).
- **Allowed Parameters**: `tool_id`, `export_format`.

### 8. `newsletter_signup`
- **Trigger**: User subscribes to *The FM Briefing*.
- **Allowed Parameters**: `signup_page`, `source_context`, `consent_version`.
- **Prohibited Parameters**: Subscriber email.

### 9. `phone_click`
- **Trigger**: User clicks a `tel:` phone link.
- **Allowed Parameters**: `phone_number_masked`, `source_page`.

### 10. `email_click`
- **Trigger**: User clicks a `mailto:` email link.
- **Allowed Parameters**: `destination_mailbox`, `source_page`.
