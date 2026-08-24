# EntireFM Geo SEO Search Intent & Cannibalisation Map (Phase 2A)

## 1. Core Architectural Intent Differentiation

To eliminate internal search competition across co-existing geographical URLs in the same city, every route is assigned a strict, defensible commercial search intent:

| Route Pattern | Example URL | Primary Search Intent | Target Audience | Key Differentiator Angle |
| :--- | :--- | :--- | :--- | :--- |
| `/fm-[city]` | `/fm-london` | Outsourced Total Facilities Management | Heads of FM, C-Suite, Estates Directors | Single-source total FM delivery, accountable commercial partnership, mobile engineering network. |
| `/facilities-management-[city]` | `/facilities-management-london` | Commercial FM, Planned Maintenance & Compliance | Building Managers, Operations Leads | SFG20 maintenance schedules, statutory EICR/Gas/Fire testing, digital compliance vault. |
| `/[city]-facilities-management` | `/london-facilities-management` | Commercial Portfolio Management & Managing Agents | Chartered Surveyors, Landlords, Property Agents | Multi-tenant common parts, service charge evidence packs, RICS cost allocation. |
| `/locations/[city]` | `/locations/london` | Regional Corporate Hub & Local Authority Page | Regional Procurement & Site Reviewers | Local regional desk contact, service directory gateway, coverage verification. |
| `/locations/[city]/services` | `/locations/london/services` | Service Catalogue for [City] | Prospective Buyers Comparing Scopes | Technical directory linking directly to specific service pages without duplicate thin copy. |
| `/ppm-[city]` | `/ppm-london` | Planned Preventative Maintenance Contractor | Technical Estate Managers, Compliance Officers | 52-week maintenance calendars, asset tagging, statutory safety regimes. |
| `/hvac-[city]` | `/hvac-london` | Commercial Air Conditioning & Chiller Servicing | Facilities Leads with Cooling/Heating Issues | F-Gas compliance, VRF/chiller maintenance, 24/7 breakdown response. |
| `/commercial-cleaning-[city]` | `/commercial-cleaning-london` | Office & Commercial Daily Contract Cleaning | Office Managers, Workplace Experience Leads | Daytime janitorial, daily hygiene, COSHH safety, office floor care. |
| `/industrial-cleaning-[city]` | `/industrial-cleaning-london` | Heavy Industrial & Warehouse Decontamination | Plant Managers, Logistics Directors | Factory floor scrubbing, high-level structural cleaning, silo washes. |
| `/working-at-height-[city]` | `/working-at-height-london` | Specialist High-Level Access & Façade Works | Property Surveyors, Building Envelope Managers | Abseiling, BMU cradle testing, anchor point certification, safety compliance. |

---

## 2. Cannibalisation Risk Clusters & Mitigation Rules

### Cluster A: The 4 Core FM Routes (`/fm-[city]`, `/facilities-management-[city]`, `/[city]-facilities-management`, `/locations/[city]`)
- **Risk Level**: `MEDIUM`
- **Why it exists**: Legacy SEO equity from Wix generations 1 & 2 co-existing with modern Next.js `/locations` architecture.
- **Strict Mitigation Strategy**:
  1. **Self-Referencing Canonicals**: Every route MUST have `canonical: 'self'`. Never cross-canonicalize `/fm-london` to `/locations/london`.
  2. **Distinct H1 Titles**:
     - `/fm-london`: `Facilities Management London // Strategic Estate Operations`
     - `/facilities-management-london`: `Commercial Facilities Management & Engineering in London`
     - `/london-facilities-management`: `London Commercial Facilities Management for Managing Agents`
     - `/locations/london`: `EntireFM London Regional Hub // Operational Engineering Desk`
  3. **Distinct Content Angles**:
     - `/fm-london` leads with integrated Hard/Soft FM contract structure.
     - `/facilities-management-london` leads with SFG20 PPM and statutory testing.
     - `/london-facilities-management` leads with multi-tenant commercial property and service charge transparency.
     - `/locations/london` serves as an interactive routing hub and regional contact gateway.
  4. **Internal Anchor Text Precision**:
     - Links targeting portfolio care use anchor: *"London commercial property FM"*
     - Links targeting technical engineering use anchor: *"London facilities maintenance"*
     - Links targeting general operations use anchor: *"London facilities management"*

---

### Cluster B: Nested Service Overviews vs Flat Service URLs
- **Risk Level**: `HIGH` (If implemented incorrectly)
- **Problem**: Creating `/locations/london/services/commercial-cleaning` when `/commercial-cleaning-london` already exists creates duplicate thin pages.
- **Strict Mitigation Strategy**:
  1. **Do NOT create nested service leaf pages** (e.g. `/locations/london/services/commercial-cleaning`).
  2. `/locations/[city]/services` serves purely as an aggregated **Directory / Gateway** page that links outward to the flat SEO routes (`/commercial-cleaning-london`, `/ppm-london`, `/hvac-london`).
  3. All internal links from navigation, footer, and city hubs point to the authoritative flat URL.

---

### Cluster C: Commercial Cleaning vs Contract Cleaning vs Office Cleaning
- **Risk Level**: `MEDIUM`
- **Problem**: In London, Manchester, and Lincoln, both `/commercial-cleaning-[city]` and `/contract-cleaning-[city]` and `/office-cleaning-[city]` exist as legacy URLs.
- **Strict Mitigation Strategy**:
  1. **Do NOT create new `/contract-cleaning` or `/office-cleaning` URLs in other cities** (marked `DO-NOT-CREATE` in the opportunity matrix).
  2. For existing legacy pages:
     - `/commercial-cleaning-[city]`: Focus on broad commercial facilities, multi-use premises, and corporate floor care.
     - `/office-cleaning-[city]`: Focus strictly on desk sanitisation, IT equipment hygiene, daytime janitorial, and boardroom turnaround.
     - `/contract-cleaning-[city]`: Focus on recurring service agreements, TUPE management, staff vetting, and periodic deep cleaning schedules.

---

### Cluster D: Specialized Access vs General Building Maintenance
- **Risk Level**: `LOW`
- **Differentiation**:
  - `/building-maintenance-[city]`: Covers internal fabric, joinery, glazing, minor carpentry, locks, and plasterwork.
  - `/working-at-height-[city]`: Focuses exclusively on high-level external envelope, rope access abseiling, BMU cradle maintenance, and fall arrest eyebolts.
