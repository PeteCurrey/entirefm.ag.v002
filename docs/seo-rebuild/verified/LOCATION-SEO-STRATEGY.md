# Location Pages — Per-Page SEO Strategy (Tier 1)

**Generated:** 2026-08-22 · regenerate with `npm run seo:location-strategy`
**Search Console window:** 2026-05-07 → 2026-08-20

Every figure below is measured, not estimated. Page targets come from the
Search Console export in `./gsc/`; content angles come from the records built
by `src/content/locations/build-tier1.ts`, so this document cannot describe a
page differently from how the site actually renders it.

---

## Tier 1 at a glance

Ordered by measured impressions. "Position" is the current average — most of
these pages already have demand and rank badly, which is the opportunity.

| City | Impressions | Avg position | URLs rebuilt | Imagery |
|---|---:|---:|---:|---|
| London | 34,339 | 50.4 | 4 | ✓ verified |
| Sheffield | 22,978 | 61.4 | 4 | ✓ verified |
| Manchester | 21,598 | 52.6 | 3 | ✓ verified |
| Leeds | 16,021 | 35.1 | 3 | ✗ **missing** |
| Birmingham | 6,459 | 39.6 | 3 | ✓ verified |
| Derby | 6,254 | 71.8 | 3 | ✓ verified |
| Lincoln | 1,845 | 25.0 | 4 | ✗ **missing** |
| Nottingham | 1,527 | 38.5 | 3 | ✓ verified |
| Liverpool | 9 | 5.0 | 3 | ✓ verified |

> **Imagery gap.** Leeds and Lincoln have no verified photography. The Leeds source folder is byte-identical to Sheffield and its identifiable landmark is the Sheffield Winter Garden, so publishing it on a Leeds page would put another city on it. These pages render without an image rather than with a wrong one. Leeds carries the 4th-highest demand of any city and ranks best of all on query position — it is the highest-value shoot to commission.

---

## London

*Greater London and the M25 corridor. London commercial property carries the tightest access rules, the heaviest compliance load and the least tolerance for disruption of any UK market.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management london | 1,249 | 1 | 36.9 |
| facilities maintenance london | 538 | 0 | 37.0 |
| facilities management companies london | 440 | 1 | 34.3 |
| london facilities management | 427 | 0 | 35.6 |
| facilities management companies in london | 378 | 0 | 39.3 |
| facilities management company london | 364 | 0 | 37.0 |

### `/facilities-management-london`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management london` |
| Secondary | `facilities management companies london`, `facilities maintenance london`, `commercial facilities management london`, `building maintenance london` |
| Title | Facilities Management London | Commercial FM | EntireFM |
| H1 | Facilities Management in London |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/london/facilities-management-london-rooftop-plant-inspection-1600w.webp` |
| Internal links | `/fm-london`, `/london-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: London) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from London |

### `/fm-london`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm london` |
| Secondary | `london fm services`, `outsourced facilities management london`, `facilities management companies london`, `fm contractor london` |
| Title | FM London | Outsourced Facilities Management | EntireFM |
| H1 | FM London: Outsourced Facilities Management Under One Contract |
| GSC baseline | 27 clicks · 34,339 impressions · pos 50.4 |
| Hero image | `/images/locations/london/facilities-management-london-city-of-london-skyline-1600w.webp` |
| Internal links | `/facilities-management-london`, `/london-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: London) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a London estate |

### `/london-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `london facilities management` |
| Secondary | `multi site facilities management london`, `london facilities management company`, `commercial property maintenance london`, `estate facilities management Greater London and the M25 corridor` |
| Title | London Facilities Management | Multi-Site Estates | EntireFM |
| H1 | London Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/london/facilities-management-london-tower-bridge-response-1600w.webp` |
| Internal links | `/fm-london`, `/facilities-management-london`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: London) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Greater London and the M25 corridor |

### `/london-facilities-management-areas`

**Role:** Coverage lookup — Searcher is checking whether their site is covered.

**Content angle:** District-by-district coverage, stated honestly including the absence of a local depot.

| | |
|---|---|
| Target query | `london facilities management areas` |
| Secondary | `facilities management coverage london`, `fm service areas london`, `london areas covered facilities management` |
| Title | London FM Coverage Areas | Districts Served | EntireFM |
| H1 | London Facilities Management Coverage Areas |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/london/facilities-management-london-engineers-st-pauls-1600w.webp` |
| Internal links | `/fm-london`, `/facilities-management-london`, `/london-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical` |
| Schema | WebPage · Service (areaServed: London) · FAQPage · BreadcrumbList |
| Conversion goal | Confirm coverage and generate a site enquiry within Greater London and the M25 corridor |

**Local material this city owns** — the facts that keep these pages distinct:

- **ULEZ and Congestion Charge affect every attendance** — Vehicle compliance and charging windows change the true cost and timing of a callout. Response planning that ignores them produces quotes that do not survive contact with a London site.
- **Access is negotiated, not assumed** — Permits to work, landlord approval, lift bookings and restricted loading windows routinely add a day to what looks like a two-hour job. Out-of-hours working is the default for anything disruptive.
- **Tall-building water systems raise the Legionella burden** — Long pipe runs, roof tanks and intermittently occupied floors make L8 monitoring, temperature regimes and dead-leg management materially harder than in low-rise stock.
- **MEES and EPC deadlines are driving plant replacement** — Minimum energy efficiency standards are pulling forward HVAC, lighting and controls upgrades across older London office stock, often on tenanted floors.
- **Service charge scrutiny is intense** — Managing agents and tenants examine FM spend line by line. Evidence, certification and cost transparency matter as much as the work itself.

---

## Sheffield

*South Yorkshire. Sheffield’s commercial estate is weighted toward advanced manufacturing and heavy industrial process, which changes what facilities management actually has to be good at.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management sheffield | 222 | 0 | 3.2 |
| sheffield generator maintenance | 105 | 0 | 6.5 |
| fire alarm testing sheffield | 95 | 0 | 47.5 |
| sheffield facilities management | 88 | 0 | 3.6 |
| commercial property refurbishment sheffield | 87 | 0 | 56.6 |
| emergency light testing sheffield | 56 | 0 | 88.0 |

### `/facilities-management-sheffield`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management sheffield` |
| Secondary | `facilities management companies sheffield`, `facilities maintenance sheffield`, `commercial facilities management sheffield`, `building maintenance sheffield` |
| Title | Facilities Management Sheffield | Commercial FM | EntireFM |
| H1 | Facilities Management in Sheffield |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/sheffield/facilities-management-sheffield-winter-garden-1600w.webp` |
| Internal links | `/fm-sheffield`, `/sheffield-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Sheffield) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Sheffield |

### `/fm-services-sheffield`

**Role:** Service listing — Searcher already wants a provider and is checking scope.

**Content angle:** Hard services, soft services and statutory compliance as a scannable catalogue.

| | |
|---|---|
| Target query | `fm services sheffield` |
| Secondary | `facilities management services sheffield`, `sheffield fm service list`, `hard and soft services sheffield` |
| Title | FM Services Sheffield | Hard & Soft Services | EntireFM |
| H1 | FM Services in Sheffield |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/sheffield/facilities-management-sheffield-winter-garden-1600w.webp` |
| Internal links | `/fm-sheffield`, `/facilities-management-sheffield`, `/sheffield-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical` |
| Schema | WebPage · Service (areaServed: Sheffield) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a scoped service enquiry from Sheffield |

### `/fm-sheffield`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm sheffield` |
| Secondary | `sheffield fm services`, `outsourced facilities management sheffield`, `facilities management companies sheffield`, `fm contractor sheffield` |
| Title | FM Sheffield | Outsourced Facilities Management | EntireFM |
| H1 | FM Sheffield: Outsourced Facilities Management Under One Contract |
| GSC baseline | 21 clicks · 22,978 impressions · pos 58.2 |
| Hero image | `/images/locations/sheffield/facilities-management-sheffield-city-centre-response-1600w.webp` |
| Internal links | `/facilities-management-sheffield`, `/sheffield-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Sheffield) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Sheffield estate |

### `/sheffield-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `sheffield facilities management` |
| Secondary | `multi site facilities management sheffield`, `sheffield facilities management company`, `commercial property maintenance sheffield`, `estate facilities management South Yorkshire` |
| Title | Sheffield Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Sheffield Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp` |
| Internal links | `/fm-sheffield`, `/facilities-management-sheffield`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Sheffield) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across South Yorkshire |

**Local material this city owns** — the facts that keep these pages distinct:

- **Industrial power is the defining asset class** — HV and LV distribution, transformers, standby generation and three-phase supplies dominate the risk profile. Thermographic surveys and fixed-wire testing carry more weight here than in an office-led estate.
- **Extraction and LEV are a statutory constant** — Local exhaust ventilation in engineering and manufacturing environments requires thorough examination and testing at defined intervals. Missing an LEV inspection is a health-and-safety failure, not a housekeeping one.
- **Topography affects access and attendance** — Sheffield’s gradients and constrained industrial access roads change vehicle routing, lifting operations and winter response planning.
- **Controlled environments do not tolerate ad-hoc work** — On the Advanced Manufacturing Park, maintenance affecting temperature, humidity or particulate control has to be planned around production and validated afterwards.
- **Legacy heavy-industrial buildings carry legacy risk** — Asbestos management surveys, ageing roof structures and original distribution boards are common in Lower Don Valley stock and need to be known before work starts.

---

## Manchester

*Greater Manchester and the North West. Manchester combines converted Victorian mill stock, a decade of new Grade A development and Europe’s largest industrial estate inside one travel pattern.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management manchester | 1,117 | 2 | 11.7 |
| facility management companies manchester | 649 | 1 | 10.2 |
| facilities management companies manchester | 492 | 1 | 9.0 |
| manchester facilities management | 457 | 0 | 7.5 |
| facilities management company manchester | 436 | 2 | 10.4 |
| facilities management companies in manchester | 421 | 1 | 12.0 |

### `/facilities-management-manchester`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management manchester` |
| Secondary | `facilities management companies manchester`, `facilities maintenance manchester`, `commercial facilities management manchester`, `building maintenance manchester` |
| Title | Facilities Management Manchester | Commercial FM | EntireFM |
| H1 | Facilities Management in Manchester |
| GSC baseline | 34 clicks · 21,598 impressions · pos 49.9 |
| Hero image | `/images/locations/manchester/facilities-management-manchester-castlefield-viaduct-1600w.webp` |
| Internal links | `/fm-manchester`, `/manchester-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Manchester) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Manchester |

### `/fm-manchester`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm manchester` |
| Secondary | `manchester fm services`, `outsourced facilities management manchester`, `facilities management companies manchester`, `fm contractor manchester` |
| Title | FM Manchester | Outsourced Facilities Management | EntireFM |
| H1 | FM Manchester: Outsourced Facilities Management Under One Contract |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/manchester/facilities-management-manchester-deansgate-city-centre-1600w.webp` |
| Internal links | `/facilities-management-manchester`, `/manchester-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Manchester) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Manchester estate |

### `/manchester-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `manchester facilities management` |
| Secondary | `multi site facilities management manchester`, `manchester facilities management company`, `commercial property maintenance manchester`, `estate facilities management Greater Manchester and the North West` |
| Title | Manchester Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Manchester Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/manchester/facilities-management-manchester-rooftop-plant-engineers-1600w.webp` |
| Internal links | `/fm-manchester`, `/facilities-management-manchester`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Manchester) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Greater Manchester and the North West |

**Local material this city owns** — the facts that keep these pages distinct:

- **Mill conversions hide their services** — Plant is often retrofitted into structures never designed for it — restricted risers, awkward plant rooms and asset registers that do not match what is actually installed. Surveying properly is the difference between a working PPM plan and a fictional one.
- **Clean air and city-centre access** — Greater Manchester’s air quality measures, Metrolink routes and pedestrianised streets restrict vehicle access across the core. Loading windows shape attendance planning.
- **Cladding and fire-safety remediation is live work** — Many city-centre residential and mixed-use blocks are mid-remediation. FM has to work alongside remediation contractors without breaking compartmentation or invalidating fire strategy.
- **Trafford Park runs on uptime** — Manufacturing and distribution occupiers measure failure in production hours. Dock levellers, shutters, yard lighting, extraction and three-phase power need planned attention, not reactive callouts.
- **Student and BTR density drives seasonal peaks** — Turnaround windows in student and build-to-rent stock compress a year of maintenance into a few summer weeks.

---

## Leeds

*West Yorkshire. Leeds is the largest financial and legal centre outside London, and its estate is dominated by multi-tenant offices where service standards are contractual.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management leeds | 991 | 3 | 3.4 |
| leeds facilities management | 533 | 0 | 3.2 |
| leeds fm services | 309 | 0 | 2.7 |
| facilities management companies leeds | 259 | 2 | 3.1 |
| facilities management company leeds | 214 | 0 | 3.3 |
| facilities management companies in leeds | 143 | 2 | 3.0 |

### `/facilities-management-leeds`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management leeds` |
| Secondary | `facilities management companies leeds`, `facilities maintenance leeds`, `commercial facilities management leeds`, `building maintenance leeds` |
| Title | Facilities Management Leeds | Commercial FM | EntireFM |
| H1 | Facilities Management in Leeds |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | — none (no verified photography) |
| Internal links | `/fm-leeds`, `/leeds-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Leeds) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Leeds |

### `/fm-leeds`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm leeds` |
| Secondary | `leeds fm services`, `outsourced facilities management leeds`, `facilities management companies leeds`, `fm contractor leeds` |
| Title | FM Leeds | Outsourced Facilities Management | EntireFM |
| H1 | FM Leeds: Outsourced Facilities Management Under One Contract |
| GSC baseline | 34 clicks · 16,021 impressions · pos 34.4 |
| Hero image | — none (no verified photography) |
| Internal links | `/facilities-management-leeds`, `/leeds-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Leeds) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Leeds estate |

### `/leeds-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `leeds facilities management` |
| Secondary | `multi site facilities management leeds`, `leeds facilities management company`, `commercial property maintenance leeds`, `estate facilities management West Yorkshire` |
| Title | Leeds Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Leeds Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | — none (no verified photography) |
| Internal links | `/fm-leeds`, `/facilities-management-leeds`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Leeds) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across West Yorkshire |

**Local material this city owns** — the facts that keep these pages distinct:

- **Multi-tenant service standards are contractual** — In Wellington Place-grade buildings, response times, common-part presentation and reporting are written into occupational leases. FM performance is measured against the lease, not against goodwill.
- **Financial and legal occupiers need continuity** — Trading floors, data rooms and secure document areas make unplanned power or cooling loss expensive. UPS, standby generation and cooling resilience carry the risk.
- **Conversion stock complicates compliance** — Holbeck and south-bank mill conversions frequently have original structure with modern occupancy, which affects fire strategy, compartmentation and means of escape.
- **Aire Valley sites run long operating hours** — Distribution occupiers work shift patterns that leave narrow maintenance windows, usually overnight or at weekends.
- **Seasonal turnaround in student and BTR stock** — Large student and build-to-rent portfolios compress reactive repairs, redecoration and statutory testing into short summer windows.

---

## Birmingham

*the West Midlands. Birmingham is a charging Clean Air Zone with a city centre in sustained redevelopment, and both facts change how facilities work is planned and priced.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management birmingham | 945 | 0 | 19.5 |
| fire safety maintenance birmingham | 435 | 0 | 41.6 |
| commercial maintenance birmingham | 261 | 0 | 54.9 |
| facilities management companies birmingham | 230 | 0 | 10.9 |
| office maintenance birmingham | 156 | 0 | 39.3 |
| planned preventative maintenance birmingham | 97 | 0 | 55.4 |

### `/birmingham-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `birmingham facilities management` |
| Secondary | `multi site facilities management birmingham`, `birmingham facilities management company`, `commercial property maintenance birmingham`, `estate facilities management the West Midlands` |
| Title | Birmingham Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Birmingham Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/birmingham/facilities-management-birmingham-industrial-plant-survey-1600w.webp` |
| Internal links | `/fm-birmingham`, `/facilities-management-birmingham`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Birmingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across the West Midlands |

### `/facilities-management-birmingham`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management birmingham` |
| Secondary | `facilities management companies birmingham`, `facilities maintenance birmingham`, `commercial facilities management birmingham`, `building maintenance birmingham` |
| Title | Facilities Management Birmingham | Commercial FM | EntireFM |
| H1 | Facilities Management in Birmingham |
| GSC baseline | 0 clicks · 339 impressions · pos 30.8 |
| Hero image | `/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-1600w.webp` |
| Internal links | `/fm-birmingham`, `/birmingham-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Birmingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Birmingham |

### `/fm-birmingham`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm birmingham` |
| Secondary | `birmingham fm services`, `outsourced facilities management birmingham`, `facilities management companies birmingham`, `fm contractor birmingham` |
| Title | FM Birmingham | Outsourced Facilities Management | EntireFM |
| H1 | FM Birmingham: Outsourced Facilities Management Under One Contract |
| GSC baseline | 20 clicks · 6,459 impressions · pos 28.6 |
| Hero image | `/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp` |
| Internal links | `/facilities-management-birmingham`, `/birmingham-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Birmingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Birmingham estate |

**Local material this city owns** — the facts that keep these pages distinct:

- **The Clean Air Zone charges non-compliant vehicles daily** — Birmingham operates a charging CAZ covering the city centre inside the A4540 ring road. Fleet compliance directly affects attendance cost, and any provider quoting without accounting for it is understating the price.
- **Infrastructure works disrupt access continuously** — Sustained city-centre redevelopment and transport works change road access, loading and parking at short notice. Attendance planning has to assume disruption rather than treat it as exceptional.
- **Listed stock constrains plant replacement** — Colmore Row and the Jewellery Quarter contain substantial listed and conservation-area buildings where external plant, flues and roof works require consent and sympathetic specification.
- **Canal-side buildings have water and damp exposure** — Brindleyplace and Gas Street stock sits directly on the canal network, which affects damp management, drainage, pumping and basement plant.
- **Events venues work to fixed, immovable dates** — NEC and arena occupiers cannot move an event. Planned maintenance has to fit the calendar, and reactive response has to be fast enough to protect a live event.

---

## Derby

*Derbyshire and the East Midlands. Derby has the highest concentration of advanced engineering employment in the country, and its facilities requirements follow production rather than office hours.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management derby | 233 | 0 | 5.0 |
| derby facilities management | 104 | 0 | 5.6 |
| derbyshire generator maintenance | 46 | 0 | 5.8 |
| infrastructure company derby | 24 | 0 | 24.5 |

### `/derby-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `derby facilities management` |
| Secondary | `multi site facilities management derby`, `derby facilities management company`, `commercial property maintenance derby`, `estate facilities management Derbyshire and the East Midlands` |
| Title | Derby Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Derby Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/derby/facilities-management-derby-industrial-estate-1600w.webp` |
| Internal links | `/fm-derby`, `/facilities-management-derby`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Derby) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Derbyshire and the East Midlands |

### `/facilities-management-derby`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management derby` |
| Secondary | `facilities management companies derby`, `facilities maintenance derby`, `commercial facilities management derby`, `building maintenance derby` |
| Title | Facilities Management Derby | Commercial FM | EntireFM |
| H1 | Facilities Management in Derby |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/derby/facilities-management-derby-rooftop-survey-1600w.webp` |
| Internal links | `/fm-derby`, `/derby-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Derby) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Derby |

### `/fm-derby`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm derby` |
| Secondary | `derby fm services`, `outsourced facilities management derby`, `facilities management companies derby`, `fm contractor derby` |
| Title | FM Derby | Outsourced Facilities Management | EntireFM |
| H1 | FM Derby: Outsourced Facilities Management Under One Contract |
| GSC baseline | 9 clicks · 6,254 impressions · pos 71.8 |
| Hero image | `/images/locations/derby/facilities-management-derby-cathedral-quarter-1600w.webp` |
| Internal links | `/facilities-management-derby`, `/derby-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Derby) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Derby estate |

**Local material this city owns** — the facts that keep these pages distinct:

- **Maintenance windows follow production, not the working day** — Aerospace and automotive supply-chain sites run shift patterns that leave narrow, fixed maintenance windows. Planned work that overruns stops a line, so scheduling discipline matters more than headline rates.
- **Process environments carry heavy statutory exposure** — Pressure systems, LEV, COSHH-relevant ventilation and specialist extraction all carry defined examination regimes with real legal consequence if missed.
- **World Heritage status constrains the Derwent Valley** — Mill buildings in commercial reuse sit within a World Heritage Site. External plant, flues, roofing and glazing changes need sympathetic specification and consent.
- **Clean and controlled areas need validated maintenance** — Aerospace and precision manufacturing include controlled environments where particulate, temperature and humidity control must be maintained and evidenced.
- **Supply-chain sites inherit their client’s audit regime** — Tier 1 manufacturers audit their suppliers. Facilities records, competence evidence and compliance certification are examined as part of that audit, not just by the site itself.

---

## Lincoln

*Lincolnshire. Lincolnshire is a large, largely rural county, so facilities coverage here is judged on genuine travel capability rather than a city-centre postcode.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| generator servicing lincolnshire | 250 | 0 | 8.7 |
| generator repairs lincolnshire | 233 | 0 | 10.8 |
| generator maintenance lincoln | 156 | 0 | 4.2 |
| facilities management lincoln | 146 | 2 | 2.5 |
| lincolnshire generator repair | 92 | 0 | 12.0 |
| facilities manager in lincolnshire | 74 | 0 | 15.0 |

### `/facilities-management-lincoln`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management lincoln` |
| Secondary | `facilities management companies lincoln`, `facilities maintenance lincoln`, `commercial facilities management lincoln`, `building maintenance lincoln` |
| Title | Facilities Management Lincoln | Commercial FM | EntireFM |
| H1 | Facilities Management in Lincoln |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | — none (no verified photography) |
| Internal links | `/fm-lincoln`, `/lincoln-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Lincoln) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Lincoln |

### `/fm-lincoln`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm lincoln` |
| Secondary | `lincoln fm services`, `outsourced facilities management lincoln`, `facilities management companies lincoln`, `fm contractor lincoln` |
| Title | FM Lincoln | Outsourced Facilities Management | EntireFM |
| H1 | FM Lincoln: Outsourced Facilities Management Under One Contract |
| GSC baseline | 18 clicks · 1,845 impressions · pos 4.6 |
| Hero image | — none (no verified photography) |
| Internal links | `/facilities-management-lincoln`, `/lincoln-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Lincoln) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Lincoln estate |

### `/lincoln-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `lincoln facilities management` |
| Secondary | `multi site facilities management lincoln`, `lincoln facilities management company`, `commercial property maintenance lincoln`, `estate facilities management Lincolnshire` |
| Title | Lincoln Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Lincoln Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | — none (no verified photography) |
| Internal links | `/fm-lincoln`, `/facilities-management-lincoln`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Lincoln) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Lincolnshire |

### `/lincoln-facilities-management-areas`

**Role:** Coverage lookup — Searcher is checking whether their site is covered.

**Content angle:** District-by-district coverage, stated honestly including the absence of a local depot.

| | |
|---|---|
| Target query | `lincoln facilities management areas` |
| Secondary | `facilities management coverage lincoln`, `fm service areas lincoln`, `lincoln areas covered facilities management` |
| Title | Lincoln FM Coverage Areas | Districts Served | EntireFM |
| H1 | Lincoln Facilities Management Coverage Areas |
| GSC baseline | 0 clicks · 1 impressions · pos 74.0 |
| Hero image | — none (no verified photography) |
| Internal links | `/fm-lincoln`, `/facilities-management-lincoln`, `/lincoln-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical` |
| Schema | WebPage · Service (areaServed: Lincoln) · FAQPage · BreadcrumbList |
| Conversion goal | Confirm coverage and generate a site enquiry within Lincolnshire |

**Local material this city owns** — the facts that keep these pages distinct:

- **Coverage is a travel problem before it is a technical one** — Lincolnshire is geographically large with limited dual carriageway. Realistic response times depend on where engineers actually are, and any provider quoting uniform county-wide response times should be asked how.
- **Steep Hill and the uphill quarter restrict everything** — The gradient and narrow historic streets of the uphill area limit vehicle size, lifting operations and material handling. Work that is routine elsewhere needs planning here.
- **Food production carries its own hygiene regime** — Food and agricultural processing sites impose hygiene, segregation and audit requirements on maintenance work, including on the equipment and clothing engineers bring on site.
- **Listed fabric constrains plant and services** — Cathedral Quarter buildings need consent for external plant, flues and roof work, and sympathetic specification for anything visible.
- **Rural sites often have private infrastructure** — Private water supplies, package treatment plant, LPG and standby generation are far more common here than in an urban estate, and each carries its own maintenance and testing regime.

---

## Nottingham

*Nottinghamshire and the East Midlands. Nottingham is the only UK city with a Workplace Parking Levy, which makes site access and staff parking an explicit line in every facilities budget.*

**Measured query demand**

| Query | Impressions | Clicks | Avg position |
|---|---:|---:|---:|
| facilities management nottingham | 822 | 2 | 34.2 |
| nottinghamshire generator maintenance | 156 | 0 | 8.5 |
| facilities management companies nottingham | 149 | 0 | 21.6 |
| nottingham facilities management | 121 | 0 | 23.0 |
| fire stopping nottingham | 113 | 0 | 64.3 |
| fire extinguisher testing nottingham | 74 | 0 | 77.2 |

### `/facilities-management-nottingham`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management nottingham` |
| Secondary | `facilities management companies nottingham`, `facilities maintenance nottingham`, `commercial facilities management nottingham`, `building maintenance nottingham` |
| Title | Facilities Management Nottingham | Commercial FM | EntireFM |
| H1 | Facilities Management in Nottingham |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/nottingham/facilities-management-nottingham-rooftop-city-view-1600w.webp` |
| Internal links | `/fm-nottingham`, `/nottingham-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Nottingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Nottingham |

### `/fm-nottingham`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm nottingham` |
| Secondary | `nottingham fm services`, `outsourced facilities management nottingham`, `facilities management companies nottingham`, `fm contractor nottingham` |
| Title | FM Nottingham | Outsourced Facilities Management | EntireFM |
| H1 | FM Nottingham: Outsourced Facilities Management Under One Contract |
| GSC baseline | 3 clicks · 1,527 impressions · pos 38.5 |
| Hero image | `/images/locations/nottingham/facilities-management-nottingham-old-market-square-1600w.webp` |
| Internal links | `/facilities-management-nottingham`, `/nottingham-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Nottingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Nottingham estate |

### `/nottingham-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `nottingham facilities management` |
| Secondary | `multi site facilities management nottingham`, `nottingham facilities management company`, `commercial property maintenance nottingham`, `estate facilities management Nottinghamshire and the East Midlands` |
| Title | Nottingham Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Nottingham Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/nottingham/facilities-management-nottingham-plant-room-maintenance-1600w.webp` |
| Internal links | `/fm-nottingham`, `/facilities-management-nottingham`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Nottingham) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Nottinghamshire and the East Midlands |

**Local material this city owns** — the facts that keep these pages distinct:

- **The Workplace Parking Levy is charged per space** — Nottingham levies an annual charge on employers providing workplace parking above a threshold. It affects how sites allocate spaces, and it affects contractor attendance and welfare arrangements on site.
- **Tram routes restrict city-centre vehicle access** — NET tram alignment and pedestrianisation across the city core limit where vehicles can stop and for how long, which shapes loading and equipment delivery.
- **Lace Market conversions are listed and tightly serviced** — Original warehouse structures with modern occupancy create constrained risers, limited plant space and consent requirements for external changes.
- **Clinical and life-science environments need validated work** — Ventilation, pressure regimes, water hygiene and temperature control in clinical and laboratory settings require documented, validated maintenance rather than general building work.
- **Student turnaround compresses the maintenance year** — Large university accommodation portfolios concentrate statutory testing and repair into short vacation windows.

---

## Liverpool

*Merseyside. Liverpool’s commercial estate sits on an exposed estuary, and salt-laden air measurably shortens the life of external plant, roofing and metalwork.*

### `/facilities-management-liverpool`

**Role:** Head commercial term — Highest-volume city term. Searcher is comparing providers.

**Content angle:** Local operating conditions — the material that proves genuine local knowledge rather than a templated page.

| | |
|---|---|
| Target query | `facilities management liverpool` |
| Secondary | `facilities management companies liverpool`, `facilities maintenance liverpool`, `commercial facilities management liverpool`, `building maintenance liverpool` |
| Title | Facilities Management Liverpool | Commercial FM | EntireFM |
| H1 | Facilities Management in Liverpool |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/liverpool/facilities-management-liverpool-waterfront-plant-room-1600w.webp` |
| Internal links | `/fm-liverpool`, `/liverpool-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Liverpool) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a commercial FM enquiry or site survey request from Liverpool |

### `/fm-liverpool`

**Role:** Short-form provider intent — Searcher wants a provider and is close to enquiring.

**Content angle:** Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.

| | |
|---|---|
| Target query | `fm liverpool` |
| Secondary | `liverpool fm services`, `outsourced facilities management liverpool`, `facilities management companies liverpool`, `fm contractor liverpool` |
| Title | FM Liverpool | Outsourced Facilities Management | EntireFM |
| H1 | FM Liverpool: Outsourced Facilities Management Under One Contract |
| GSC baseline | 0 clicks · 9 impressions · pos 8.2 |
| Hero image | `/images/locations/liverpool/facilities-management-liverpool-pier-head-liver-building-1600w.webp` |
| Internal links | `/facilities-management-liverpool`, `/liverpool-facilities-management`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Liverpool) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a contracted FM proposal enquiry for a Liverpool estate |

### `/liverpool-facilities-management`

**Role:** Regional / portfolio intent — Reversed word order skews local-first and multi-site.

**Content angle:** Districts, building stock and running a portfolio to one standard across the wider region.

| | |
|---|---|
| Target query | `liverpool facilities management` |
| Secondary | `multi site facilities management liverpool`, `liverpool facilities management company`, `commercial property maintenance liverpool`, `estate facilities management Merseyside` |
| Title | Liverpool Facilities Management | Multi-Site Estates | EntireFM |
| H1 | Liverpool Facilities Management for Multi-Site Estates |
| GSC baseline | no data — page currently 404s or has no impressions |
| Hero image | `/images/locations/liverpool/facilities-management-liverpool-rooftop-waterfront-1600w.webp` |
| Internal links | `/fm-liverpool`, `/facilities-management-liverpool`, `/ppm`, `/hard-services`, `/mechanical-electrical`, `/commercial-facilities-management` |
| Schema | WebPage · Service (areaServed: Liverpool) · FAQPage · BreadcrumbList |
| Conversion goal | Generate a multi-site estate FM enquiry across Merseyside |

**Local material this city owns** — the facts that keep these pages distinct:

- **Salt-air corrosion shortens external asset life** — Estuary and dockside exposure accelerates corrosion in external condensers, roof plant, fixings, handrails and metalwork. Inspection intervals and material specification should reflect that, not a generic national schedule.
- **Wind and driving rain drive fabric failures** — Exposure on the waterfront produces water ingress at roof edges, curtain walling and flashings more often than in inland cities. Fabric inspection carries more weight in the maintenance plan.
- **Listed waterfront buildings limit intervention** — Pier Head and commercial-district stock includes significant listed fabric where plant, flues and roofing changes require consent and sympathetic detailing.
- **Port and logistics sites run continuously** — Port-adjacent operations work around shipping and distribution schedules, leaving narrow planned-maintenance windows and requiring genuine out-of-hours capability.
- **Dense student accommodation concentrates turnaround** — Liverpool has one of the highest student accommodation densities in the country, compressing statutory testing and repair into short summer windows.

---

## Method and cautions

- **Window is short.** The export covers 2026-05-07 → 2026-08-20 (~105 days), not the 16 months the filter names. The property appears to hold no earlier data, so this is a baseline of the *current damaged site*, not of the historic Wix estate. It shows where demand exists now; it does not show what the legacy pages used to earn.
- **Impressions with poor positions are the opportunity.** Several cities draw tens of thousands of impressions at average positions between 35 and 72. The demand is proven and the ranking is not — which is what a differentiated page is for.
- **Restoration and indexation are separate decisions.** All 187 legacy URLs return content. Only Tier 1 carries bespoke content; the remainder should stay `noindex` until differentiated. Enforce with `npm run check:similarity`.
- **No local premises are claimed anywhere.** `GEO_REGIONAL_CENTRES` is `DO_NOT_USE` in the claims registry, so no page asserts a depot, branch or operations centre in a city. Location pages emit `Service` with `areaServed`, never `LocalBusiness`.
