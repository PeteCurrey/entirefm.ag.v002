# ENTIRE FACILITIES MANAGEMENT — SEO GLOSSARY ESTATE SPECIFICATION

## Overview
The EntireFM Facilities Management Glossary is a high-value technical reference estate providing authoritative, plain-English definitions of facilities management, M&E engineering, SFG20 planned preventative maintenance, and statutory compliance terminology.

The estate consists of:
1. **National Hub**: `/facilities-management-glossary` (A–Z index of 24 core FM definitions, live search filter, DefinedTermSet structured data, and regional market directory).
2. **21 Location-Specific Hubs**: `/facilities-management-glossary-[location]` across all 21 approved primary markets in the EntireFM Route Registry.

---

## URL & Routing Governance
- **Authority**: `config/route-registry.json`
- **Sitemap Group**: `glossary` (`/sitemaps/glossary.xml` and index at `/sitemap.xml`)
- **Canonical Strategy**: Self-canonicalizing (`https://www.entirefm.com/facilities-management-glossary...`)
- **Indexing Status**: `index, follow` across all 22 glossary routes.
- **Main Nav Isolation**: Commercial mega-menu preserved; glossary routes linked from Resources, FAQs, Footer, Location pages, HTML sitemap, and XML sitemaps.

---

## Approved Location Glossary Hubs (21 Markets)
| Location | Slug | Region | Focus Building Stock & Constraints |
|---|---|---|---|
| London | `london` | London & South East | ULEZ fleet logistics, multi-let service charge auditing, high-rise plant access |
| Manchester | `manchester` | North West | Converted heritage mill M&E, Trafford Park HV distribution, Metrolink access |
| Birmingham | `birmingham` | Midlands | Clean Air Zone fleet routing, automotive JIT shift windows, campus BMS |
| Leeds | `leeds` | Yorkshire | Financial & legal Grade-A estates, BREEAM/ESG auditing, River Aire drainage |
| Sheffield | `sheffield` | Yorkshire | Advanced Manufacturing Park (AMP), LEV extraction, 3-phase industrial power |
| Liverpool | `liverpool` | North West | Maritime saline HVAC corrosion, pharmaceutical cleanrooms, docks logistics |
| Nottingham | `nottingham` | East Midlands | Bioscience lab ventilation, Workplace Parking Levy EV infrastructure |
| Derby | `derby` | East Midlands | Aerospace precision clean power, rail rolling stock maintenance depots |
| Chesterfield | `chesterfield` | East Midlands | Markham Vale logistics dock levellers, limestone water descaling |
| Lincoln | `lincoln` | East Midlands | Distributed regional portfolio routing, agritech hygiene standards |
| Doncaster | `doncaster` | Yorkshire | iPort rail freight & mega-shed high-bay emergency lighting discharges |
| Rotherham | `rotherham` | Yorkshire | Advanced Manufacturing Park cleanrooms, factory floor decontamination |
| Bradford | `bradford` | Yorkshire | Chemical ATEX/DSEAR hazardous area M&E, Victorian mill stone maintenance |
| Bolton | `bolton` | North West | Logistics North switchgear, multi-tenant sub-metering |
| Bury | `bury` | North West | Retail public realm fire safety, Irwell Valley drainage & sump pumps |
| Preston | `preston` | North West | Student accommodation statutory testing, aerospace cleanroom filtration |
| Wigan | `wigan` | North West | Food cold-store refrigeration, M6 corridor reactive emergency triage |
| Oxford | `oxford` | South East | Science Vale lab containment & fume extraction, listed college fabric |
| Telford | `telford` | Midlands | Plastics moulding cooling loops, M54 corridor multi-trade coverage |
| Grimsby | `grimsby` | East Midlands | Seafood cold-chain ammonia refrigeration (PSSR), offshore wind bases |
| Matlock | `matlock` | East Midlands | Derbyshire Dales civic buildings, limestone masonry breathability, winterisation |

---

## Schema Architecture
- `DefinedTermSet` and `DefinedTerm` JSON-LD on all glossary routes.
- `FAQPage` JSON-LD on homepage and all 21 location glossary pages.
- `BreadcrumbList` navigation hierarchy.
