# EntireFM Multi-Touch Attribution Methodology

## 1. Attribution Models Defined

The EntireFM attribution system avoids single-touch bias by capturing and storing multiple perspectives for every inbound commercial enquiry:

```
  Organic Search (Google)
          │
          ▼  [FIRST TOUCH]
  /facilities-management-manchester
          │
          ▼  [ASSISTED TOUCH 1]
  /mechanical-electrical
          │
          ▼  [ASSISTED TOUCH 2]
  /tools/ppm-schedule-builder
          │
          ▼  [CONVERSION / LAST TOUCH]
  /contact-us  (Enquiry Submitted)
```

### Attribution Definitions
1. **First Touch (Acquisition)**: The initial landing page and referrer that introduced the visitor to EntireFM.
2. **Last Touch (Conversion Page)**: The exact URL where the visitor completed and submitted the enquiry form.
3. **Assisted Pages**: All substantive intermediate URLs (services, guides, tools, blog articles) engaged prior to submission.
4. **Lead Creation Form**: The specific form component (`form_id`) and variant used.

---

## 2. Privacy-Safe Session Storage
- Journey trails are maintained locally in `sessionStorage` (`efm_journey_trail`).
- No cross-site tracking or third-party fingerprinting is used.
- Multi-touch trail is transmitted server-side only upon explicit form submission.
