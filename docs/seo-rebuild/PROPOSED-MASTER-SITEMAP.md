# EntireFM Proposed Master Sitemap — Phase 02

> Based on historic evidence only. Every proposed page is justified by at least one G1 or G2 URL.
> **This is a proposal for human approval. No pages should be built until approved.**

---

## Route Summary

| Group | Page Count | Route Pattern |
|-------|-----------|---------------|
| Home | 1 | `/` |
| Services — Core | ~18 | `/services/[slug]` |
| Services — Sub-pages | ~6 | `/services/[slug]/[sub]` |
| Services — Specialist | ~5 | `/services/[slug]` |
| Locations — City Hubs | ~16 | `/fm-[city]` + `/facilities-management-[city]` |
| Location × Service | ~60 (dynamic) | `/[service]/[city]` |
| Sectors | ~18 | `/sectors/[slug]` |
| Resources / Intelligence | ~10 | `/fm-intelligence/[slug]` |
| Blog | dynamic | `/blog/[slug]` |
| Tools | ~4 | `/tools/[slug]` |
| Platform | ~3 | `/[slug]` |
| About | ~4 | `/about/[slug]?` |
| Support / Portal | ~6 | `/[slug]` |
| Legal | ~3 | `/[slug]` |
| **Total** | **~150+ routes** | |

---

## Group 1: Home
- `/` — Home

---

## Group 2: Services

### Hard FM
- `/services/hard-services` — Hard FM hub ✅
- `/services/me-services` — Mechanical & Electrical ✅ (canonical for `/mechanical-electrical`)
- `/services/me-services/access-control` — Access control sub-page
- `/services/me-services/emergency-light-testing` — Emergency lighting sub-page
- `/services/hvac` — HVAC (from G1+G2 `/hvac-contractor`)
- `/services/plumbing-gas` — Plumbing & Gas
- `/services/fire-emergency-systems` — Fire & Safety Systems (from G1 `/fire-emergency-systems` + G2 `/safety-critical-emergency-systems`)
- `/services/building-maintenance` — Building Maintenance
- `/services/building-inspection` — Building Inspection & Testing (from G2 `/building-inspecting-testing`)
- `/services/aerial-drone-inspection` — Drone Inspection
- `/services/working-at-heights` — Working at Heights

### PPM
- `/services/ppm` — Planned Preventative Maintenance ✅

### Soft FM
- `/services/soft-fm` — Soft FM hub ✅
- `/services/concierge` — Concierge & Front of House
- `/services/security` — Security Services
- `/services/landscaping` — Landscaping & Grounds
- `/services/grounds-maintenance` — Grounds Maintenance
- `/services/carpark-management` — Car Park Management
- `/services/gates-barriers` — Gates & Barriers
- `/services/vending` — Vending
- `/services/caretaker` — Caretaker Services
- `/services/washroom-management` — Washroom Management
- `/services/digital-displays` — Digital Displays / Media

### Cleaning
- `/services/cleaning` — Cleaning hub
- `/services/industrial-cleaning` — Industrial Cleaning ✅
- `/services/contract-cleaning` — Contract Cleaning
- `/services/office-cleaning` — Office Cleaning
- `/services/commercial-cleaning` — Commercial Cleaning
- `/services/window-cleaning` — Window Cleaning
- `/services/pressure-washing` — Pressure Washing
- `/services/external-cleaning` — External Cleaning
- `/services/internal-cleaning` — Internal Cleaning
- `/services/reactive-cleaning` — Reactive Cleaning
- `/services/medical-cleaning` — Medical Cleaning
- `/services/education-cleaning` — Education Cleaning
- `/services/retail-cleaning` — Retail Cleaning
- `/services/residential-cleaning` — Residential Cleaning

### Specialist Services
- `/services/crane-hire` — Mobile Crane Hire
- `/services/crane-hire/sheffield` — Crane Hire Sheffield
- `/services/crane-hire/chesterfield` — Crane Hire Chesterfield
- `/services/crane-hire/truck-mount` — Truck Mount Crane Hire
- `/services/bocker-crane-hire` — Bocker Crane Hire
- `/services/hot-tub-relocation` — Hot Tub Relocation

### 24/7 Support
- `/services/helpdesk` — 24/7 FM Helpdesk

---

## Group 3: Locations — City Hubs

> Each city has two URL variants — a short `/fm-[city]` and a long `/facilities-management-[city]`.
> **Recommended architecture:** Short URL is canonical, long URL 301s to short. Both are included for redirect continuity.

### P1 Cities (major, confirmed in both G1 and G2)
- `/fm-london` ✅ + `/facilities-management-london`
- `/fm-manchester` + `/facilities-management-manchester`
- `/fm-birmingham` + `/facilities-management-birmingham`
- `/fm-chesterfield` + `/facilities-management-chesterfield`
- `/fm-derby` + `/facilities-management-derby`
- `/fm-lincoln` + `/facilities-management-lincoln`
- `/fm-sheffield`
- `/fm-leeds`
- `/fm-liverpool`
- `/fm-bradford` + `/facilities-management-bradford`
- `/fm-nottingham`

### P2 Cities (G1 only or secondary evidence)
- `/facilities-management-telford`
- `/fm-matlock`
- `/facilities-management-midlands` — Midlands regional hub

---

## Group 4: Location × Service (Dynamic Routes)

> **Pattern:** `/[service]/[city]`  
> **Implementation:** Next.js dynamic segments — single template, populated via CMS/data
> **Total estimated pages:** ~60

### Confirmed historic combinations (G1 evidence):

| Service | Cities |
|---------|--------|
| `/industrial-cleaning/[city]` | sheffield, nottingham, manchester, london, lincoln, leeds, derby, chesterfield, birmingham |
| `/commercial-cleaning/[city]` | london, manchester, nottingham, sheffield, lincoln, leeds, chesterfield, birmingham |
| `/contract-cleaning/[city]` | manchester, chesterfield, leeds, lincoln, london, sheffield |
| `/office-cleaning/[city]` | london, lincoln, manchester |
| `/pressure-washing/[city]` | manchester, lincoln, birmingham, london, sheffield |
| `/external-cleaning/[city]` | london, lincoln, birmingham, manchester |
| `/commercial-facilities-management/[city]` | lincoln (+ expansion to all cities) |
| `/residential-facilities-management/[city]` | lincoln (+ expansion) |
| `/retail-facilities-management/[city]` | lincoln (+ expansion) |
| `/industrial-facilities-management/[city]` | lincoln (+ expansion) |

---

## Group 5: Sectors

- `/sectors` — Sectors hub
- `/sectors/commercial` — Commercial FM (offices, corporate, co-working)
- `/sectors/industrial` — Industrial FM
- `/sectors/residential` — Residential FM
- `/sectors/retail` — Retail & Shopping Centre FM
- `/sectors/hotel` — Hotel & Resort FM
- `/sectors/education` — Education FM
- `/sectors/healthcare` — Healthcare FM
- `/sectors/construction` — Construction FM
- `/sectors/logistics` — Logistics & Distribution FM
- `/sectors/restaurant-hospitality` — Restaurant & Hospitality FM
- `/sectors/leisure` — Leisure Centre & Sports Venue FM
- `/sectors/transport` — Airport & Transport FM
- `/sectors/warehouse` — Warehouse FM
- `/sectors/arena-stadium` — Arena & Stadium FM
- `/sectors/landmark` — Landmark Buildings FM
- `/sectors/service-station` — Service Station FM
- `/sectors/tier-one` — Tier-One Enterprise FM
- `/sectors/managing-agent` — Managing Agent / Property Manager FM
- `/sectors/public-sector` — Public Sector FM

---

## Group 6: FM Intelligence & Resources

- `/fm-intelligence` — Hub ✅
- `/fm-intelligence/what-is-facilities-management` — Core informational
- `/fm-intelligence/glossary` — FM Glossary ✅ (from G2)
- `/blog` — Blog hub ✅
- `/blog/[slug]` — Individual blog posts
- `/academy` — EntireFM Academy ✅
- `/resources/document-vault` — Document Vault ✅
- `/building-walk` — Building Walk Series ✅
- `/fm-market-report` — Market Report 2025 ✅
- `/partners` — Partner Network ✅

---

## Group 7: Tools

- `/tools/compliance-checker` — Compliance Audit Tool ✅
- `/tools/fm-health-check` — Health Check Quiz ✅
- `/tools/fm-roi-calculator` — ROI/TCO Calculator ✅
- `/tools/ppm-schedule-builder` — PPM Schedule Builder ✅

---

## Group 8: Platform

- `/entirecafm` — EntireCAFM Platform ✅
- `/marketplace` — Contractor Marketplace ✅

---

## Group 9: About

- `/about` — About EntireFM ✅
- `/about/team` — Team page
- `/about/portfolio` — Portfolio / Case Studies
- `/careers` — Careers / Job Board

---

## Group 10: Support & Client Portal

- `/contact` — Contact ✅
- `/helpdesk` — Helpdesk portal ✅
- `/helpdesk/register` — Helpdesk registration
- `/client-login` — Client login ✅
- `/client-login/register` — Client account registration

---

## Group 11: Legal

- `/privacy-policy` — Privacy Policy ✅
- `/terms` — Terms & Conditions ✅
- `/accessibility` — Accessibility Statement ✅

---

## Redirects Required (same domain — G3 internal)

| From | To | Reason |
|------|----|--------|
| `/mechanical-electrical` | `/services/me-services` | Duplicate canonical |
| `/facilities-management-london` | `/fm-london` | Shorter canonical |
| `/facilities-management-manchester` | `/fm-manchester` | Shorter canonical |
| `/facilities-management-[city]` | `/fm-[city]` | All long-form → short |

> **Exception:** If `/facilities-management-[city]` pages already rank significantly, keep them both alive with canonical pointing at the shorter URL rather than issuing a 301.
