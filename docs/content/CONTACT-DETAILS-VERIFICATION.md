# CONTACT DETAILS VERIFICATION REGISTER
## EntireFM SEO Rebuild — Phase 07
**Generated:** 2026-08-22  
**Authority:** Single source of truth for all operational telephone numbers, email addresses, and postal addresses.  
**Zero-Tolerance Rule:** No placeholder numbers (e.g. `0800 000 0000`) or unverified contact data may appear as stated facts in production.

---

## 1. Telephone Numbers Verification

| Contact Purpose | Number / Value | Source / Context | Verification Status | Production Display Rule |
|---|---|---|---|---|
| **Main National Helpdesk (24/7)** | `[PHONE NUMBER TO VERIFY]` | Historic G1/G2 | **TO_VERIFY** | Display guarded string `[PHONE TO VERIFY]` during staging. |
| **London Direct Line** | `[LONDON DIRECT LINE TO VERIFY]` | Historic G1 (`020 ...`) | **TO_VERIFY** | Display guarded string. Do NOT fabricate `020` number. |
| **Chesterfield Operational Depot** | `[CHESTERFIELD LINE TO VERIFY]` | Historic G1 (`01246 ...`) | **TO_VERIFY** | Display guarded string. |
| **Lincoln Regional Centre** | `[LINCOLN LINE TO VERIFY]` | Historic G1 (`01522 ...`) | **TO_VERIFY** | Display guarded string. |
| **Emergency Reactive Dispatch** | `[24/7 HELPDESK TO VERIFY]` | Operations Spec | **TO_VERIFY** | Guarded callout in header and emergency banners. |

---

## 2. Email Inboxes Verification

| Contact Purpose | Email Address | Source | Verification Status | Production Rule |
|---|---|---|---|---|
| **General Enquiries / Tenders** | `enquiries@entirefm.com` | Corporate Registry | **VERIFIED (Routing)** | Safe for commercial enquiry forms and footer. |
| **Operations Helpdesk** | `helpdesk@entirefm.com` | Operations Portal | **VERIFIED (Routing)** | Dedicated client support routing. |
| **Client Portal Support** | `portal@entirefm.com` | Portal Login Spec | **VERIFIED (Routing)** | Linked from client login page. |

---

## 3. Physical Addresses & Regional Presence

| Location | Address | Operational Status | Verification Status | Schema Rule |
|---|---|---|---|---|
| **Headquarters / Operating Base** | Lincoln Operational Centre | Direct Operations Base | **VERIFIED (Regional Base)** | Use Organization schema. |
| **London Coverage** | Greater London (Zones 1–6) | Mobile Fleet / Dispatch | **VERIFIED (Service Area)** | Use ServiceArea schema; NO fake street address. |
| **Midlands & North Depots** | Sheffield, Manchester, Birmingham | Mobile Engineering Corridors | **VERIFIED (Service Area)** | ServiceArea coverage. |
