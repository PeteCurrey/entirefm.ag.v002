# EntireFM Live Intelligence Platform — Source Registry & Integration Architecture

This document provides the authoritative register of all primary statutory, technical, trade, procurement, and discovery sources integrated into the EntireFM Live Intelligence Network.

---

## 1. Source Authority Model

| Authority Tier | Designation | Examples | Ingestion Mode | Ranking Policy |
|---|---|---|---|---|
| **Tier 1** | **Primary / Statutory / Regulator** | GOV.UK, legislation.gov.uk, HSE, MHCLG/BSR, UK Parliament, Contracts Finder, Find a Tender, OPSS | Official APIs / OCDS / Atom feeds | Always ranks as **Primary Source** in deduplication clusters. High-impact items trigger human review. |
| **Tier 2** | **Official Technical / Professional Body** | CIBSE, BESA, IET, FIA, ECA, IWFM, CIPHE, APHC, LEIA, BSIA, UKATA | Official RSS / Atom / Structured feeds | Ranks as technical authority for standards, training, and engineering best practices. |
| **Tier 3** | **Industry Trade Press** | FMJ, PFM, Facilities Management Journal, change-monitored pages | Structured RSS & ChangeDetection.io | Industry commentary, market analysis, and award announcements. |
| **Tier 4** | **Discovery Aggregator** | GNews API, NewsAPI | Filtered REST API | **Discovery only**. Never outranks Tier 1/2 sources. Mapped back to canonical authority where known. |

---

## 2. Integrated Source Catalog

### Tier 1: Statutory, Regulatory & Government (Live — No Key Required)

#### 1. GOV.UK Search API
- **Endpoint**: `https://www.gov.uk/api/search.json`
- **Access Method**: Public REST API (Open Data)
- **Credential**: None required
- **Authority Tier**: 1 (Primary Government Authority)
- **Poll Frequency**: Every 20 minutes
- **Taxonomies Monitored**: Building Safety Regulator, Mandatory Occurrence Reporting, Commercial Fire Safety, F-Gas Quotas, ACOP L8 Legionella, BS 7671 EICR.
- **Status**: `LIVE`

#### 2. GOV.UK Content API
- **Endpoint**: `https://www.gov.uk/api/content`
- **Access Method**: Structured JSON endpoint
- **Authority Tier**: 1
- **Poll Frequency**: Real-time upon discovery
- **Data Captured**: Canonical `content_id`, `first_published_at`, `public_updated_at`, withdrawal state, consultation closing dates.
- **Status**: `LIVE`

#### 3. legislation.gov.uk
- **Endpoint**: `https://www.legislation.gov.uk/new/data.feed`
- **Access Method**: Atom XML Feed
- **Authority Tier**: 1
- **Poll Frequency**: Every 30 minutes
- **Jurisdictions**: England, Wales, Scotland, Northern Ireland, United Kingdom
- **Data Captured**: UK Statutory Instruments, Acts of Parliament, Commencement Orders, Welsh Statutory Instruments, Scottish Statutory Instruments.
- **Status**: `LIVE`

#### 4. UK Parliament Bills API
- **Endpoint**: `https://bills-api.parliament.uk/api/v1/Bills`
- **Access Method**: Public REST API
- **Authority Tier**: 1
- **Poll Frequency**: Every 60 minutes
- **Destination**: `/lobby/today` (Parliament Watch Early Warning)
- **Data Captured**: Bill Title, Current House (Commons/Lords), Stage (1st/2nd Reading, Committee), Sessions.
- **Status**: `LIVE`

#### 5. Health and Safety Executive (HSE) Public Media Wire
- **Endpoint**: `https://www.hse.gov.uk/news/rss/news.xml`
- **Access Method**: RSS Feed
- **Authority Tier**: 1
- **Poll Frequency**: Every 30 minutes
- **Data Captured**: Statutory prosecutions, safety notices, enforcement actions, ACOP updates.
- **Status**: `LIVE`

#### 6. Contracts Finder (Crown Commercial Service)
- **Endpoint**: `https://www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search`
- **Access Method**: Open Contracting Data Standard (OCDS)
- **Authority Tier**: 1
- **Poll Frequency**: Every 30 minutes
- **Destinations**: `/lobby/opportunities` & "Who Won What"
- **Data Captured**: Buyer Authority, Supplier, Award Value, CPV Codes, Region, Tender Closing Dates, Official Notice URLs.
- **Status**: `LIVE`

#### 7. Find a Tender Service (FTS)
- **Endpoint**: `https://www.find-tender.service.gov.uk/api/1.0/ocdsReleasePackages`
- **Access Method**: OCDS High-Value Public Procurement
- **Authority Tier**: 1
- **Poll Frequency**: Every 30 minutes
- **Data Captured**: High-value commercial & public estate frameworks, FM contracts exceeding WTO GPA thresholds.
- **Status**: `LIVE`

#### 8. Office for Product Safety and Standards (OPSS)
- **Endpoint**: `https://www.gov.uk/product-safety-alerts-reports-recalls.atom`
- **Access Method**: Atom Feed
- **Authority Tier**: 1
- **Poll Frequency**: Every 60 minutes
- **Destination**: `/lobby/today` (Product Safety & Recalls)
- **Data Captured**: Commercial electrical, fire suppression, and plant equipment recalls.
- **Status**: `LIVE`

---

### Tier 2: Official Technical & Professional Bodies (Live — No Key Required)

#### 9. CIBSE (Chartered Institution of Building Services Engineers)
- **Endpoint**: `https://www.cibse.org/rss/news`
- **Authority Tier**: 2
- **Poll Frequency**: Every 60 minutes
- **Disciplines**: HVAC, Building Services, Decarbonisation, Heat Pumps.
- **Status**: `LIVE`

#### 10. BESA (Building Engineering Services Association)
- **Endpoint**: `https://www.thebesa.com/news/rss`
- **Authority Tier**: 2
- **Poll Frequency**: Every 60 minutes
- **Disciplines**: Ventilation Hygiene (TR19), F-Gas, SFG20, Mechanical Maintenance.
- **Status**: `LIVE`

#### 11. IWFM (Institute of Workplace and Facilities Management)
- **Endpoint**: `https://www.iwfm.org.uk/news.rss`
- **Authority Tier**: 2
- **Poll Frequency**: Every 60 minutes
- **Disciplines**: Workplace Strategy, FM Competency Framework, Impact Awards.
- **Status**: `LIVE`

#### 12. FIA (Fire Industry Association)
- **Endpoint**: `https://www.fia.uk.com/news/rss.xml`
- **Authority Tier**: 2
- **Poll Frequency**: Every 60 minutes
- **Disciplines**: BS 5839 Fire Alarms, Third-Party Certification, Compartmentation.
- **Status**: `LIVE`

#### 13. ECA (Electrical Contractors' Association)
- **Endpoint**: `https://www.eca.co.uk/news-and-events/news/rss`
- **Authority Tier**: 2
- **Poll Frequency**: Every 60 minutes
- **Disciplines**: BS 7671 Wiring Regulations, EV Infrastructure, Switchgear Maintenance.
- **Status**: `LIVE`

---

### Tier 3 & 4: Credentialled Server-Side Integrations

#### 14. Companies House REST API
- **Endpoint**: `https://api.company-information.service.gov.uk`
- **Credential**: `COMPANIES_HOUSE_API_KEY` (Server-Only Basic Auth)
- **Authority Tier**: 1
- **Purpose**: Contractor & supplier verification, company number validation, accounts filing signals.
- **Status**: `LIVE` when key configured / `CREDENTIAL_REQUIRED` when key absent.

#### 15. GNews Discovery Engine
- **Endpoint**: `https://gnews.io/api/v4/search`
- **Credential**: `GNEWS_API_KEY` (Server-Only)
- **Authority Tier**: 4 (Discovery Only)
- **Purpose**: Broad UK FM media monitoring; preserves source image URLs and resolves to primary source.
- **Status**: `LIVE` when key configured / `CREDENTIAL_REQUIRED` when key absent.

#### 16. ChangeDetection.io Web Monitor
- **Endpoint**: Configurable via `CHANGEDETECTION_BASE_URL`
- **Credential**: `CHANGEDETECTION_API_KEY` (Server-Only)
- **Authority Tier**: 3
- **Purpose**: Non-RSS monitored public pages (awards deadlines, event agendas).
- **Status**: `LIVE` when key configured / `CREDENTIAL_REQUIRED` when key absent.

---

## 3. Strict Zero-Demo-Data Policy

When `LOBBY_ALLOW_DEMO_DATA=false`:
1. No mock respondent numbers, fake active chat members, or synthetic poll counts.
2. If external feeds are awaiting first poll or encountering network timeouts, graceful empty states render ("Awaiting official notice", "No active consultations closing this week").
3. Development fixtures remain isolated in test suites (`src/server/intelligence/__tests__/`) and never leak into production rendering.
