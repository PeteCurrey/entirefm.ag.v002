# EntireFM Operational Mobilisation Architecture

## 1. Overview
The Mobilisation Engine bridges the gap between commercial agreement signing and live CAFM execution without duplicating operational tables:

```
  Commercial Deal Won (Opportunity Marked WON)
                     │
                     ▼
  1. Mobilisation Record Created (/admin/mobilisations)
                     │
                     ▼
  2. Commercial Handoff Dossier & Operations Acceptance Gate
                     │
                     ▼
  3. Canonical ClientAccount & Contract Setup (src/server/estate)
                     │
                     ▼
  4. Estate Discovery & Canonical Site / Building Creation
                     │
                     ▼
  5. Asset Register Ingestion & SFG20 PPM Matrix Generation
                     │
                     ▼
  6. Compliance Gap Baseline & Statutory Obligations Setup
                     │
                     ▼
  7. Helpdesk Priority Routing & SLA Clock Configuration
                     │
                     ▼
  8. Supply Chain & Engineer Delivery Model Confirmation
                     │
                     ▼
  9. Formal Go-Live Readiness Review Gate (Blocking vs Non-Blocking)
                     │
                     ▼
 10. Operational Activation & 30-Day Stabilisation Phase (BAU)
```
