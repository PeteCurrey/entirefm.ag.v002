# EntireFM Search Intent Map

> Maps search intent → historic pages → proposed G3 canonical URLs
> Source: Historic sitemap analysis + G3 live page content

---

## Intent Cluster: `brand-navigation`
**Query patterns:** "EntireFM", "Entire Facilities Management", "FM company UK"

| Historic URL(s) | G3 Target | Action |
|-----------------|-----------|--------|
| G1: `/` | `/` | Retain |
| G2: `/` | `/` | Retain |
| G1: `/about-entire-facilities-management` | `/about` | 301 |
| G2: `/about-entire-facilities-management` | `/about` | 301 |
| G1: `/best-facilities-management-company` | `/about` | 301 |
| G1: `/facilities-management-services` | `/services` | 301 |
| G1: `/services` | `/services` | 301 |

---

## Intent Cluster: `hard-fm`
**Query patterns:** "hard FM services", "M&E services", "mechanical electrical contractor", "HVAC contractor UK", "building maintenance FM"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1+G2: `/mechanical-electrical` | `/services/me-services` | Existing G3 page; `/mechanical-electrical` also live — pick canonical |
| G1+G2: `/hvac-contractor` | `/services/me-services` | HVAC merged under M&E |
| G1+G2: `/hard-services` | `/services/hard-services` | ✅ Confirmed live |
| G1+G2: `/plumbing-gas` | `/services/plumbing-gas` | Create if not live |
| G1: `/building-maintenance` | `/services/building-maintenance` | Create if not live |
| G1: `/working-at-heights` | `/services/working-at-heights` | Create if not live |
| G1: `/fm-technical-services` | `/services/hard-services` | Merge, redirect |
| G2: `/building-inspecting-testing` | `/services/building-inspection` | Create if not live |
| G2: `/safety-critical-emergency-systems` | `/services/fire-emergency-systems` | Create if not live |
| G1: `/fire-emergency-systems` | `/services/fire-emergency-systems` | Same target |
| G2: `/mechanical-electrical/access-control` | `/services/me-services/access-control` | Sub-page |
| G2: `/mechanical-electrical/emergency-light-testing` | `/services/me-services/emergency-light-testing` | Sub-page |

**⚠ Canonical decision required:** Does `/mechanical-electrical` become `/services/me-services` or vice versa? Both are live on G3.

---

## Intent Cluster: `ppm`
**Query patterns:** "planned preventative maintenance", "PPM FM", "SFG20 maintenance schedule", "reactive maintenance FM"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1+G2: `/ppm` | `/services/ppm` | ✅ Confirmed live on G3 |
| G1: `/24-7-fm-support` | `/services/helpdesk` | 24/7 reactive support |

---

## Intent Cluster: `soft-fm`
**Query patterns:** "soft FM services", "cleaning company UK", "grounds maintenance FM", "security services FM", "concierge FM"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1: `/soft-services` | `/services/soft-fm` | ✅ Confirmed live |
| G1: `/cleaning-services` | `/services/cleaning` | Hub page needed |
| G1: `/concierge-services` | `/services/concierge` | Create |
| G1: `/security-services` | `/services/security` | Create |
| G1: `/landscaping` | `/services/landscaping` | Create |
| G1: `/grounds-maintenance` | `/services/grounds-maintenance` | Create |
| G1: `/carpark-management` | `/services/carpark-management` | Create |
| G1: `/gates-barriers` | `/services/gates-barriers` | Create |
| G1: `/vending-supplier` | `/services/vending` | Create |
| G1: `/caretaker` | `/services/caretaker` | Create |
| G1: `/washroom-management` | `/services/washroom-management` | Create |

---

## Intent Cluster: `cleaning`
**Query patterns:** "industrial cleaning UK", "contract cleaning company", "commercial cleaning service", "office cleaning", "pressure washing", "window cleaning"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1+G2: `/industrial-cleaning` | `/services/industrial-cleaning` | ✅ Confirmed live |
| G1: `/contract-cleaning` | `/services/contract-cleaning` | Create |
| G1: `/office-cleaning` | `/services/office-cleaning` | Create |
| G1: `/window-cleaning` | `/services/window-cleaning` | Create |
| G1: `/pressure-washing` | `/services/pressure-washing` | Create |
| G1: `/internal-cleaning` | `/services/internal-cleaning` | Create |
| G1: `/reactive-cleaning-services` | `/services/reactive-cleaning` | Create |
| G1: `/medical-cleaning` | `/services/medical-cleaning` | Create |
| G1: `/education-cleaning` | `/services/education-cleaning` | Create |
| G1: `/retail-cleaning` | `/services/retail-cleaning` | Create |
| G1: `/residential-cleaning` | `/services/residential-cleaning` | Create |

### Cleaning × Location (all P2 or P3 — large but templated)
**Pattern:** `/[cleaning-type]/[city]`  
**Example:** `/industrial-cleaning/london`, `/commercial-cleaning/manchester`

| Service | Cities with Historic Pages |
|---------|--------------------------|
| industrial-cleaning | Sheffield, Nottingham, Manchester, London, Lincoln, Leeds, Derby, Chesterfield, Birmingham |
| commercial-cleaning | London, Manchester, Nottingham, Sheffield, Lincoln, Leeds, Chesterfield, Birmingham |
| contract-cleaning | Manchester, Chesterfield, Leeds, Lincoln, London, Sheffield |
| office-cleaning | London, Lincoln, Manchester |
| pressure-washing | Manchester, Lincoln, Birmingham, London, Sheffield |
| external-cleaning | London, Lincoln, Birmingham, Manchester |

**G3 pattern:** Create `/[cleaning-type]/[city]` templated pages (dynamic route recommended).

---

## Intent Cluster: `local-fm`
**Query patterns:** "facilities management [city]", "FM company [city]", "FM services [city]"

| City | G1 URL Variants | G2 URL Variants | G3 Canonical Target |
|------|----------------|----------------|---------------------|
| London | 5 variants | 3 variants | `/fm-london` |
| Manchester | 3 variants (incl. typo) | 2 variants | `/fm-manchester` |
| Birmingham | 2 variants | 2 variants | `/fm-birmingham` |
| Chesterfield | 2 variants | 2 variants | `/fm-chesterfield` |
| Derby | 2 variants | 2 variants | `/fm-derby` |
| Lincoln | 7 variants (incl. sector combos) | 2 variants | `/fm-lincoln` |
| Sheffield | 2 variants | 1 variant | `/fm-sheffield` |
| Leeds | 1 variant | 1 variant | `/fm-leeds` |
| Liverpool | 1 variant | 1 variant | `/fm-liverpool` |
| Bradford | 2 variants | 2 variants | `/fm-bradford` |
| Nottingham | 1 variant | 1 variant | `/fm-nottingham` |
| Telford | 1 variant | 1 variant | `/facilities-management-telford` |
| Matlock | 1 variant | — | `/fm-matlock` |
| Midlands | 1 variant | 1 variant | `/facilities-management-midlands` |

---

## Intent Cluster: `sector-fm`
**Query patterns:** "facilities management for [sector]", "[sector] FM company", "FM services [industry]"

| Sector | G1 Evidence | G2 Evidence | G3 Target |
|--------|------------|------------|-----------|
| Commercial / Offices | G1 static | G2 static + dynamic | `/sectors/commercial` |
| Industrial | G1 static | G2 static + dynamic | `/sectors/industrial` |
| Residential | G1 static | G2 static + dynamic | `/sectors/residential` |
| Retail | G1 static | G2 static + dynamic | `/sectors/retail` |
| Hotel / Hospitality | G1 static | G2 static + dynamic | `/sectors/hotel` |
| Education | G1 static | G2 dynamic | `/sectors/education` |
| Healthcare | G1 static | G2 dynamic | `/sectors/healthcare` |
| Construction | G1 static | G2 dynamic | `/sectors/construction` |
| Logistics | G1 static | G2 dynamic | `/sectors/logistics` |
| Restaurant / Hospitality | G1 static | G2 dynamic | `/sectors/restaurant-hospitality` |
| Leisure / Sport | G1 static | G2 dynamic (leisure centre + sports venue) | `/sectors/leisure` |
| Airport / Transport | G1 static | G2 static + static | `/sectors/transport` |
| Warehouse | — | G2 static + dynamic | `/sectors/warehouse` |
| Arena / Stadium | G1 static | G2 static + dynamic | `/sectors/arena-stadium` |
| Landmark | G1 static | G2 static | `/sectors/landmark` |
| Service Station | G1 static | G2 static | `/sectors/service-station` |
| Tier-One / Enterprise | G1 static (typo) | G2 static | `/sectors/tier-one` |
| Managing Agent | — | G2 dynamic | `/sectors/managing-agent` |
| Public Sector | G1 static | — | `/sectors/public-sector` |

---

## Intent Cluster: `safety-compliance`
**Query patterns:** "fire alarm testing FM", "emergency lighting testing", "safety critical systems FM", "compliance FM"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1: `/fire-emergency-systems` | `/services/fire-emergency-systems` | Core compliance service |
| G2: `/safety-critical-emergency-systems` | `/services/fire-emergency-systems` | Renamed — same destination |
| G2: `/mechanical-electrical/emergency-light-testing` | `/services/me-services/emergency-light-testing` | Sub-page |
| G2: `/mechanical-electrical/access-control` | `/services/me-services/access-control` | Sub-page |

---

## Intent Cluster: `specialist-services`
**Query patterns:** "mobile crane hire UK", "bocker crane hire", "aerial drone inspection building", "building inspection FM"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G2: `/mobile-crane-hire` | `/services/crane-hire` | New service — high specificity |
| G2: `/mobile-crane-hire/sheffield` | `/services/crane-hire/sheffield` | City sub-page |
| G2: `/mobile-crane-hire/chesterfield` | `/services/crane-hire/chesterfield` | City sub-page |
| G2: `/mobile-crane-hire/truck-mount-crane-hire` | `/services/crane-hire/truck-mount` | Type sub-page |
| G2: `/bocker-crane-hire` | `/services/bocker-crane-hire` | Specialist equipment |
| G2: `/hot-tub-relocation` | `/services/hot-tub-relocation` | Niche |
| G1+G2: `/aerial-drone-building-inspection` | `/services/aerial-drone-inspection` | Unique differentiator |

---

## Intent Cluster: `informational`
**Query patterns:** "what is facilities management", "FM glossary", "FM industry", "facilities management guide"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1: `/what-is-facilities-management` | `/fm-intelligence/what-is-facilities-management` | High-volume informational |
| G2: `/fm-support-n-contact/facilities-management-glossary` | `/fm-intelligence/glossary` | Valuable resource |
| G1: `/facilities-management-blog` | `/blog` | Blog hub |
| G2: `/blog` | `/blog` | Blog hub |

**G3 has dedicated `/fm-intelligence` hub — all informational content routes here.**

---

## Intent Cluster: `procurement`
**Query patterns:** "FM supply chain", "FM contractor marketplace", "FM supplier"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1: `/fm-supply-chain` | `/marketplace` | G3 has `/marketplace` |
| G1: `/fm-supply-form` | `/marketplace` | Supply form → marketplace |

---

## Intent Cluster: `client-support`
**Query patterns:** "EntireFM login", "FM helpdesk", "report FM issue"

| Historic URL(s) | G3 Target | Notes |
|-----------------|-----------|-------|
| G1: `/helpdesk` | `/helpdesk` | ✅ Portal |
| G1: `/helpdesk-registration` | `/helpdesk/register` | Create |
| G1: `/fm-client-info` | `/client-login` | Merge |
| G2: `/client-login` | `/client-login` | ✅ Portal |
| G2: `/client-login/account-registration` | `/client-login/register` | Create |
| G1: `/fm-support-n-contact` | `/contact` | Redirect |
| G2: `/fm-support-n-contact` | `/contact` | Redirect |
| G2: `/contact-us` | `/contact` | Redirect |
