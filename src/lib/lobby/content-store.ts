import type { LobbyArticle } from './types';
import { LOBBY_AUTHORS } from './authors';

export const LOBBY_ARTICLES: LobbyArticle[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. THE WEEK THAT MATTERS — LEAD BRIEFING 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-lead-bsa-2026',
    slug: 'building-safety-act-what-fm-teams-need-to-know-now',
    title: 'Building Safety Act Secondary Legislation: What Commercial FM Duty Holders Must Verify Before Q4',
    standfirst:
      'The transition period for mandatory digital occurrence reporting and safety case submissions is closing for mixed-use and higher-risk estates. Here is how leading FM operations desks are auditing their statutory evidence registers to eliminate personal duty-holder exposure.',
    contentType: 'briefing',
    franchise: 'week-that-matters',
    topics: ['building-safety', 'compliance', 'asset-management', 'cafm-technology'],
    author: LOBBY_AUTHORS['entirefm-compliance'],
    publishedAt: '2026-08-27',
    updatedAt: '2026-08-27',
    reviewedAt: '2026-08-26',
    reviewBy: 'EntireFM Head of Statutory Compliance',
    status: 'published',
    contentLifecycle: 'time-sensitive',
    heroImage: '/images/editorial/entirefm-client-review-2000w.webp',
    heroImageAlt: 'EntireFM engineering leadership reviewing commercial building compliance register',
    readingTimeMinutes: 5,
    featured: true,
    seoTitle: 'Building Safety Act 2026 Guidance for FM Teams | The Lobby | EntireFM',
    seoDescription:
      'Essential Building Safety Act guidance for UK facilities managers: digital occurrence reporting, golden thread registers, and competency validation.',
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Under the Building Safety Act 2022 and its associated secondary statutory instruments, the legal framework governing commercial and mixed-use real estate has shifted from periodic post-hoc audits to continuous, contemporaneous safety governance. For facilities managers, property directors, and designated Responsible Persons, the operational implications are non-negotiable.',
      },
      {
        type: 'keyPoint',
        content:
          'Crucially, statutory liability cannot be contractually assigned away to a managing agent or hard FM subcontractor. If unrecorded fire compartment penetrations or uncertified M&E remedials occur on site, the statutory duty holder remains strictly liable.',
      },
      {
        type: 'heading2',
        content: '1. The 48-Hour Digital Occurrence Reporting Requirement',
      },
      {
        type: 'paragraph',
        content:
          'Mandatory Occurrence Reporting (MOR) requires specified safety-critical events—including failure of structural elements, uncontained fire spread, or simultaneous failure of active life safety systems—to be logged and submitted to the Building Safety Regulator. FM helpdesks must ensure their incident escalation protocols reflect this compressed timeline.',
      },
      {
        type: 'bulletList',
        items: [
          'Emergency generator and central battery failure during power outage test',
          'Breach of primary compartmentation during mechanical ductwork installation',
          'Wet riser pressure loss or isolation valve seizure exceeding 4 hours',
          'Uncontrolled refrigerant discharge in occupied enclosed plantrooms',
        ],
      },
      {
        type: 'heading2',
        content: '2. Golden Thread Data Interoperability',
      },
      {
        type: 'paragraph',
        content:
          'A digital Golden Thread is not a folder of unindexed PDF scans on a local server. The Regulator expects machine-readable, spatially indexed asset records that persist seamlessly across changes in managing agent or facilities management provider. When equipment is repaired, decommissioned, or modified, the change must be reconciled in the CAFM within 48 hours.',
      },
      {
        type: 'technicalRule',
        content:
          'DUTY HOLDER DIRECTIVE: Require all incoming contractors to supply geolocated photo evidence, commissioning sheets, and third-party accreditation certificates (e.g. FIRAS, NICEIC, BESA) before closing any remedial work order.',
      },
    ],
    weekThatMattersData: {
      weekCommencing: '25 August 2026',
      editionNumber: '2026.35',
      leadTakeaway:
        'Duty holders must audit contractor onboarding credentials and ensure every remedial work order links directly to the building’s digital Golden Thread.',
      keyPoints: [
        'Mandatory occurrence reporting requires incident logging within 48 hours.',
        'Subcontractor competency matrices must link to verified external accreditations.',
        'Digital Golden Thread records must be stored in open, machine-readable formats.',
      ],
    },
    sources: [
      {
        title: 'Building Safety Act 2022 Statutory Guidance',
        authority: 'Building Safety Regulator / HSE',
        url: 'https://www.hse.gov.uk/building-safety/',
        publishedDate: '2024 (Updated 2026)',
      },
      {
        title: 'Golden Thread Principles and Digital Information Management',
        authority: 'Department for Levelling Up, Housing and Communities',
        url: 'https://www.gov.uk',
      },
    ],
    relatedContentSlugs: [
      'mandatory-digital-occurrence-reporting-duty-holder-rules',
      'fixed-wire-testing-eicr-bs7671-amendment-3-enforcement',
    ],
    relatedResources: [
      {
        title: 'FM Statutory Compliance Checker',
        description: 'Audit your building compliance across 10 statutory UK regimes in 3 minutes.',
        url: '/tools/compliance-checker',
        type: 'tool',
        badge: 'Interactive Tool',
      },
      {
        title: 'PPM Schedule Builder',
        description: 'Asset-led 52-week maintenance matrix with verified statutory frequencies.',
        url: '/tools/ppm-schedule-builder',
        type: 'tool',
        badge: 'Planning Suite',
      },
      {
        title: 'Fire Risk Assessment Compliance Guide',
        description: 'Comprehensive guide to RRO 2005 obligations, review triggers, and competent assessors.',
        url: '/compliance/fire-risk-assessment',
        type: 'compliance',
        badge: 'Statutory Authority',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. THE WEEK THAT MATTERS — BRIEFING 2
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-lead-fgas-2026',
    slug: 'f-gas-phase-down-and-refrigerant-costs-2026',
    title: 'F-Gas Phase-Down Quotas: Why Commercial VRF Maintenance Costs Are Diverging in 2026',
    standfirst:
      'Accelerating EU and UK quota reductions on high-GWP refrigerants (such as R410A) are driving virgin gas price spikes. Here is how estate managers can mitigate financial exposure through proactive leak testing and asset replacement modelling.',
    contentType: 'analysis',
    franchise: 'week-that-matters',
    topics: ['hvac', 'ppm', 'sustainability', 'procurement'],
    author: LOBBY_AUTHORS['entirefm-technical'],
    publishedAt: '2026-08-20',
    status: 'published',
    contentLifecycle: 'time-sensitive',
    heroImage: '/images/editorial/entirefm-hvac-cassette-service-1200w.webp',
    heroImageAlt: 'EntireFM HVAC engineer conducting refrigerant leak detection on commercial VRF system',
    readingTimeMinutes: 4,
    seoTitle: 'F-Gas Phase-Down & VRF Refrigerant Costs 2026 | The Lobby | EntireFM',
    seoDescription:
      'Understanding the commercial impact of F-Gas quota reductions on R410A systems and how planned leak testing prevents catastrophic recharge costs.',
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Under the UK F-Gas Regulations, statutory quota reductions continue to compress the supply of virgin hydrofluorocarbons (HFCs) with high Global Warming Potential (GWP). For estates operating R410A (GWP 2088) or R404A systems, the cost of emergency recharges following an unmanaged leak has risen sharply.',
      },
      {
        type: 'heading2',
        content: 'Why Reactive Top-Ups Are No Longer Commercially Viable',
      },
      {
        type: 'paragraph',
        content:
          'In previous years, minor micro-leaks were frequently tolerated by budget holders who simply approved periodic gas top-ups during annual services. In 2026, virgin R410A allocation limits mean that a 15kg charge loss can add thousands of pounds to a single repair invoice.',
      },
      {
        type: 'technicalRule',
        content:
          'STATUTORY FREQUENCY: Systems containing 50 to 500 tonnes CO2 equivalent must undergo mandatory leak checks at least every 6 months (or every 12 months if an automatic fixed leak detection system is fitted).',
      },
    ],
    sources: [
      {
        title: 'Fluorinated Greenhouse Gases Regulations 2015 as amended',
        authority: 'Environment Agency / DEFRA',
        url: 'https://www.gov.uk/guidance/fluorinated-gas-f-gas-guidance-for-users-producers-and-traders',
      },
    ],
    relatedContentSlugs: ['condenser-airflow-starvation-on-enclosed-rooftops'],
    relatedResources: [
      {
        title: 'HVAC & Commercial Air Conditioning Services',
        description: 'Certified REFCOM Elite engineering for chillers, AHUs, and VRF systems.',
        url: '/hvac-contractor',
        type: 'guide',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. COMPLIANCE WATCH — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-cw-digital-occurrence',
    slug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
    title: 'Mandatory Digital Occurrence Reporting: The Duty Holder Translation',
    standfirst:
      'A concise statutory breakdown of the Building Safety Regulator’s mandatory digital occurrence reporting requirements for commercial and mixed-use estate duty holders.',
    contentType: 'update',
    franchise: 'compliance-watch',
    topics: ['building-safety', 'compliance', 'health-safety'],
    author: LOBBY_AUTHORS['entirefm-compliance'],
    publishedAt: '2026-08-27',
    reviewedAt: '2026-08-26',
    status: 'published',
    contentLifecycle: 'time-sensitive',
    heroImage: '/images/editorial/entirefm-switchroom-survey-1200w.webp',
    heroImageAlt: 'Commercial electrical switchroom compliance survey',
    readingTimeMinutes: 3,
    featured: true,
    seoTitle: 'Digital Occurrence Reporting for FM Duty Holders | Compliance Watch | EntireFM',
    seoDescription:
      'What changed, who it affects, what to do, and when it matters under mandatory occurrence reporting regulations.',
    complianceData: {
      statute: 'Building Safety Act 2022 / The Higher-Risk Buildings (Key Building Information etc.) Regulations',
      governingBody: 'Building Safety Regulator (HSE)',
      urgency: 'HIGH',
      effectiveDate: 'Enforced Q4 2026',
      actionDeadline: 'Immediate for active PPM contracts',
      whatChanged:
        'The Building Safety Regulator has clarified that duty holders cannot outsource ultimate legal liability for unrecorded structural, fire barrier, or M&E modifications to third-party managing agents. All physical changes must be indexed to the building’s digital Golden Thread within 48 hours of sign-off.',
      whoItAffects:
        'Commercial landlords, estates directors, corporate facilities heads, and responsible persons managing residential, student accommodation, or mixed-use multi-tenanted commercial buildings.',
      whatYouNeedToDo:
        'Audit your current CAFM asset change-log. Ensure every M&E maintenance contractor provides verified digital commissioning sheets, photographed fire-stopping penetrations, and traceable engineer credentials before work orders are closed out.',
      whenItMatters:
        'Immediate action required for active PPM cycles and planned Q4 remedial works. Non-compliant logbooks expose duty holders to formal enforcement notices and invalidate property insurance terms.',
      complianceClassification: 'LEGAL DUTY',
      officialSourceUrl: 'https://www.hse.gov.uk/building-safety/',
    },
    bodyBlocks: [
      {
        type: 'heading2',
        content: 'Detailed Operational Breakdown',
      },
      {
        type: 'paragraph',
        content:
          'Under the new enforcement regime, the Building Safety Regulator has established that digital occurrence reporting must be integrated directly into day-to-day facilities management workflows rather than treated as an annual desktop compliance review.',
      },
      {
        type: 'heading3',
        content: 'What Constitutes a Reportable Safety Occurrence?',
      },
      {
        type: 'bulletList',
        items: [
          'Uncontrolled failure of common-area fire suppression or smoke extract systems lasting > 24 hours',
          'Discovery of compromised fire compartmentation in vertical service risers or ceiling voids',
          'Unplanned loss of primary incoming electrical or water supplies to critical life safety plant',
          'Structural movement or façade cladding detachment identified during drone or visual surveys',
        ],
      },
    ],
    sources: [
      {
        title: 'Mandatory Occurrence Reporting System Guidance',
        authority: 'Health and Safety Executive (HSE)',
        url: 'https://www.hse.gov.uk',
      },
    ],
    relatedResources: [
      {
        title: 'FM Building Health Check Diagnostic',
        description: 'Evaluate your estate against core UK statutory maintenance baselines.',
        url: '/tools/fm-health-check',
        type: 'tool',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. COMPLIANCE WATCH — ITEM 2
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-cw-fixed-wire-testing',
    slug: 'fixed-wire-testing-eicr-bs7671-amendment-3-enforcement',
    title: 'Fixed Wire Testing & Thermographic Surveys: The 2026 Insurer Baseline',
    standfirst:
      'Why commercial property insurers are demanding annual thermographic imaging alongside standard 5-yearly EICR certification for high-density electrical distribution boards.',
    contentType: 'update',
    franchise: 'compliance-watch',
    topics: ['electrical', 'compliance', 'ppm'],
    author: LOBBY_AUTHORS['entirefm-compliance'],
    publishedAt: '2026-08-15',
    status: 'published',
    contentLifecycle: 'time-sensitive',
    heroImage: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    heroImageAlt: 'EntireFM electrical testing engineer inspecting low-voltage distribution board',
    readingTimeMinutes: 3,
    complianceData: {
      statute: 'Electricity at Work Regulations 1989 / BS 7671:2018+A3:2024',
      governingBody: 'IET / Health and Safety Executive',
      urgency: 'MEDIUM',
      effectiveDate: 'Active Standard',
      whatChanged:
        'Commercial property insurers are increasingly imposing warranty conditions requiring annual thermal imaging surveys of main intake switchgear and high-load sub-distribution panels, treating 5-yearly EICR intervals alone as insufficient for high-density occupied environments.',
      whoItAffects:
        'Duty holders of commercial offices, data centres, logistics warehouses, and manufacturing plants with continuous high electrical loads.',
      whatYouNeedToDo:
        'Schedule non-intrusive thermal imaging during normal peak load operating hours, and resolve any discovered Code 1 (C1) or Code 2 (C2) thermal anomalies within 14 days.',
      whenItMatters:
        'Annual property insurance renewals. Unresolved C1/C2 electrical defects can lead to condition precedent clauses invalidating fire claims.',
      complianceClassification: 'APPROVED CODE / GUIDANCE',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Regulation 4(2) of the Electricity at Work Regulations 1989 requires all systems to be maintained so as to prevent danger. While BS 7671 sets maximum recommended testing intervals, thermal imaging provides real-time verification of loose connections, phase imbalances, and harmonic overheating under load.',
      },
    ],
    sources: [
      {
        title: 'Memorandum of guidance on the Electricity at Work Regulations 1989 (HSR25)',
        authority: 'HSE Books',
        url: 'https://www.hse.gov.uk/pubns/books/hsr25.htm',
      },
    ],
    relatedResources: [
      {
        title: 'Fixed Wire Testing & EICR Compliance Guide',
        description: 'BS 7671 periodic inspection intervals and legal duties explained.',
        url: '/compliance/fixed-wire-testing-eicr',
        type: 'compliance',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. THE ENGINEER'S NOTE — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-en-condenser-starvation',
    slug: 'condenser-airflow-starvation-on-enclosed-rooftops',
    title: 'Condenser Airflow Starvation on Enclosed Rooftop Plant Decks',
    standfirst:
      'Why clean coil faces still trip high-pressure switches when acoustic louvres or parapets are retrofitted around rooftop VRF condensers.',
    contentType: 'technical-note',
    franchise: 'engineers-note',
    topics: ['hvac', 'engineering', 'ppm'],
    author: LOBBY_AUTHORS['entirefm-technical'],
    publishedAt: '2026-08-27',
    status: 'published',
    contentLifecycle: 'evergreen',
    heroImage: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    heroImageAlt: 'Rooftop condenser bank with acoustic enclosure and discharge baffles',
    readingTimeMinutes: 3,
    featured: true,
    engineersNoteData: {
      assetType: 'Inverter VRF / Packaged Rooftop Condensers',
      discipline: 'Mechanical & Climate Engineering',
      symptom: 'Recurring E3/HP high-pressure lockout faults during peak summer ambient days despite clean coils.',
      technicalObservation:
        'The root cause was micro-recirculation. Following tenant noise complaints, solid acoustic louvres were installed within 1.2m of the condenser discharge face. Under high solar gain, the high-velocity discharge air bounced off the acoustic louvres and was re-ingested into the coil intakes. Intake temperatures measured 47.8°C while ambient rooftop air was only 29.4°C.',
      fieldRule:
        'RULE OF THUMB: Minimum discharge clearance on upward-blowing packaged condensers is 2.5× the fan diameter. Where louvres are mandatory, install 45° discharge hood extensions to push thermal exhaust clear of the acoustic boundary envelope.',
      diagramNote: 'Observed: +18.4°C thermal recirculation delta at condenser intake under 80% compressor load.',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'During recent site diagnostics across commercial office rooftops in Birmingham and London, our senior mechanical engineering team was called to investigate persistent high-pressure trips on modern VRF plant. In all cases, routine PPM records showed clean coils, correct oil levels, and verified F-Gas charge.',
      },
      {
        type: 'heading2',
        content: 'The Physics of Thermal Re-Ingestion',
      },
      {
        type: 'paragraph',
        content:
          'When acoustic screening walls are erected without computational airflow modelling, the hot discharge plume slows down upon hitting the louvre slats. Negative pressure created by the condenser intake fans pulls this superheated air back downward across the condensing coils, severely reducing heat rejection capacity.',
      },
      {
        type: 'technicalRule',
        content:
          'DIAGNOSTIC TEST: Place calibrated temperature dataloggers directly on the coil intake grilles and compare readings against a free-air ambient sensor 5 metres away. An intake delta greater than +4°C indicates severe recirculation requiring ducting cowls.',
      },
    ],
    relatedResources: [
      {
        title: 'Commercial HVAC & Air Conditioning Services',
        description: 'Specialist planned and reactive chiller engineering.',
        url: '/hvac-contractor',
        type: 'guide',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. THE ENGINEER'S NOTE — ITEM 2
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-en-ahu-belts',
    slug: 'why-commercial-ahu-belts-fail-prematurely',
    title: 'Why Commercial AHU Belts Fail Prematurely in Variable-Speed Systems',
    standfirst:
      'Diagnosing drive belt shredding, pulley misalignment, and tension resonance on inverter-driven Air Handling Units.',
    contentType: 'technical-note',
    franchise: 'engineers-note',
    topics: ['hvac', 'engineering', 'ppm'],
    author: LOBBY_AUTHORS['entirefm-technical'],
    publishedAt: '2026-08-10',
    status: 'published',
    contentLifecycle: 'evergreen',
    heroImage: '/images/editorial/entirefm-hvac-plantroom-pumps-1200w.webp',
    heroImageAlt: 'Air handling unit belt drive and motor assembly inspection',
    readingTimeMinutes: 3,
    engineersNoteData: {
      assetType: 'Air Handling Units (AHU) / Belt-Drive Centrifugal Fans',
      discipline: 'Mechanical Engineering & PPM',
      symptom: 'Premature drive belt snapping and excessive black rubber dust inside supply fan chambers within 90 days of replacement.',
      technicalObservation:
        'When VFD inverter drives ramp fan speed between 25Hz and 50Hz, standard single V-belts experience torsional resonance if pulley laser alignment exceeds 0.5° angular offset. Over-tensioning by maintenance technicians to stop slip merely accelerates bearing failure.',
      fieldRule:
        'PRACTICAL STANDARD: Always use matched cogged-edge raw-edge belts (XPA/XPB profile) or banded multi-rib belts on inverter drives. Check alignment with dual-beam laser tools, not a steel straightedge.',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Belt failure on large supply and extract AHUs causes immediate loss of indoor air quality and tenant complaints. Switching from fixed-speed to variable-speed control alters the harmonic vibration profile across the belt drive assembly.',
      },
    ],
    relatedResources: [
      {
        title: 'PPM Schedule Builder',
        description: 'Generate SFG20 compliant AHU service task schedules.',
        url: '/tools/ppm-schedule-builder',
        type: 'tool',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. ASK ENTIREFM — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-ask-mobilisation-handover',
    slug: 'mobilisation-handover-what-compliance-data-to-demand',
    title: 'Taking Over a 140,000 sq ft Commercial Office: What Compliance Data Must You Demand from the Outgoing FM?',
    standfirst:
      'A practical procurement and mobilisation guide for property operations heads taking over major commercial buildings from an incumbent provider.',
    contentType: 'q-and-a',
    franchise: 'ask-entirefm',
    topics: ['mobilisation', 'procurement', 'compliance', 'contract-management'],
    author: LOBBY_AUTHORS['entirefm-operations'],
    publishedAt: '2026-08-27',
    status: 'published',
    contentLifecycle: 'evergreen',
    heroImage: '/images/editorial/entirefm-facilities-management-meeting-1200w.webp',
    heroImageAlt: 'Commercial facilities management handover and mobilisation review meeting',
    readingTimeMinutes: 4,
    featured: true,
    askEntireFMData: {
      question:
        'We are taking over a 140,000 sq ft multi-let office building. What specific compliance documentation must we demand from the incumbent FM provider before signing off the handover?',
      askedBy: 'Head of Property Operations',
      role: 'Head of Property Operations',
      organisation: 'UK Institutional Property Fund',
      estateProfile: 'Grade-A Multi-Let Commercial Office, London EC2',
      shortAnswer:
        'Never accept a generic "clean bill of health". Demand the contemporaneous certificates, Form 6 schedules, water sampling logs, F-Gas registers, and O&M manuals—with any missing document recorded on the deed as an incumbent liability.',
      fullAnswer:
        'During commercial contract transitions, the single largest financial exposure is inheriting unrecorded statutory defects or lapsed certification. You must establish a formal Document Handover Register covering all 10 UK compliance regimes. Any item that cannot be evidenced with a verified engineer certificate must be documented on the handover deed as an incumbent remedial liability prior to final commercial settlement.',
      keyAnswerPoints: [
        'Demand the full Form 6 / EICR distribution board schedule, including specific C1, C2, and FI remedial closeout certificates.',
        'Require the written ACOP L8 Legionella risk assessment and 24 months of continuous temperature and sampling logbook data.',
        'Inspect the physical F-Gas logbook with refrigerant addition/recovery records mapped to individual equipment serial numbers.',
        'Verify the mandatory 3-hour annual emergency lighting discharge test certificate and fire alarm commissioning records under BS 5839.',
      ],
      whatToDoNext:
        'Download the 120-Point Mobilisation Handover Matrix from our Document Vault to run a structured gap audit during week 1 of transition.',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'When taking over an estate, managing agents frequently encounter "paper compliance"—where an outgoing provider claims full compliance in executive summaries, but physical certificates, as-built M&E drawings, and maintenance logbooks are missing or out of date.',
      },
    ],
    relatedResources: [
      {
        title: 'FM Tender Brief & RFP Generator',
        description: 'Generate a structured facilities specification and SLA framework.',
        url: '/tools/tender-brief',
        type: 'tool',
      },
      {
        title: 'FM Document Vault',
        description: 'Download the Mobilisation Handover Matrix in Excel format.',
        url: '/resources/document-vault',
        type: 'template',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. ASK ENTIREFM — ITEM 2
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-ask-hard-soft-consolidation',
    slug: 'combining-hard-and-soft-fm-into-single-contract',
    title: 'Consolidating Hard and Soft FM: When Does Total Facilities Management Deliver Real ROI?',
    standfirst:
      'Evaluating the commercial and operational threshold where managing separate cleaning, security, and M&E engineering suppliers becomes counterproductive.',
    contentType: 'q-and-a',
    franchise: 'ask-entirefm',
    topics: ['contract-management', 'procurement', 'ppm'],
    author: LOBBY_AUTHORS['entirefm-operations'],
    publishedAt: '2026-08-05',
    status: 'published',
    contentLifecycle: 'evergreen',
    heroImage: '/images/editorial/entirefm-site-arrival-1200w.webp',
    heroImageAlt: 'Integrated facilities management engineering team arriving on commercial estate',
    readingTimeMinutes: 4,
    askEntireFMData: {
      question:
        'We currently manage 7 different contracts for M&E, cleaning, security, grounds, and lift maintenance across 4 regional sites. At what point does consolidating into a single Total FM contract actually save money rather than just adding management margin?',
      askedBy: 'Estates Procurement Lead',
      role: 'Estates Procurement Lead',
      organisation: 'National Distribution Group',
      estateProfile: '4 Regional Logistics Hubs (360,000 sq ft total)',
      shortAnswer:
        'Consolidation delivers genuine ROI when internal administration drag exceeds 15% of contract value and when lack of single-point accountability causes maintenance delays.',
      fullAnswer:
        'Managing multiple disparate suppliers creates hidden overhead: invoice processing, multiple helpdesk handoffs, disputed liability when access issues prevent maintenance, and conflicting risk assessments. A consolidated Hard + Soft FM model succeeds when the provider operates self-delivered mobile engineering and transparent digital CAFM reporting rather than simply subcontracting everything.',
      keyAnswerPoints: [
        'Single operations helpdesk eliminates "not our fault" disputes between fabric and engineering contractors.',
        'Consolidated monthly CAFM compliance reporting provides instant audit-readiness across all sites.',
        'Bundled contract volumes reduce hourly mobile engineer callout rates by 12–18%.',
      ],
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Commercial buyers often fear that a Total FM provider will merely insert a margin markup over third-party subcontractors. The test is whether the provider employs directly delivered core mobile M&E engineers and dedicated account leadership.',
      },
    ],
    relatedResources: [
      {
        title: 'FM ROI & Total Cost of Ownership Calculator',
        description: 'Compare reactive multiple-supplier spend with planned consolidated delivery.',
        url: '/tools/fm-roi-calculator',
        type: 'tool',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. FROM THE FIELD — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-ftf-condenser-vibration',
    slug: 'rooftop-condenser-vibration-resonance-defect',
    title: 'From The Field: Diagnosing Rooftop Condenser Vibration Resonance',
    standfirst:
      'An operational diagnostic case study: how metal-to-metal spring isolator bottoming was telegraphing 50Hz low-frequency acoustic noise into executive suites below.',
    contentType: 'field-note',
    franchise: 'from-the-field',
    topics: ['hvac', 'engineering', 'asset-management'],
    author: LOBBY_AUTHORS['entirefm-technical'],
    publishedAt: '2026-08-27',
    status: 'published',
    contentLifecycle: 'evergreen',
    heroImage: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    heroImageAlt: 'Commercial rooftop HVAC condenser bank inspection showing vibration isolators',
    readingTimeMinutes: 3,
    featured: true,
    fromTheFieldData: {
      imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
      imageAlt: 'Commercial rooftop HVAC condenser bank inspection',
      locationDescription: '210,000 sq ft Commercial Headquarters, West Midlands',
      environmentType: 'Rooftop Plant Deck & Chilled Water Infrastructure',
      challengeTitle: 'Can you spot the critical defect in this condenser bank installation?',
      observation:
        'At first glance, this rooftop condenser installation appears pristine: brand-new powder-coated enclosures, clean pipe insulation, and cable tray alignment. However, look closely at the condensate drainage routing and anti-vibration mountings.',
      problem:
        'The anti-vibration spring isolators have been fully compressed metal-to-metal due to incorrect spring rate sizing during installation. Structure-borne vibration was telegraphing through the steel deck into the executive boardrooms on Floor 6, creating a low-frequency 50Hz acoustic resonance.',
      answer:
        'Incorrect spring deflection calculations caused solid bottoming out, bypassing acoustic isolation completely.',
      technicalExplanation:
        'Static deflection was recalculated for the full operating wet weight of the units. Tuned neoprene-composite isolation pads were installed alongside flexible pipe couplings to eliminate structure-borne transmission without taking the chiller offline.',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Acoustic complaints in modern commercial buildings are frequently misdiagnosed as airborne noise when the true transmission path is structural. When heavy refrigeration compressors cycle under load, inadequate isolation springs transfer mechanical energy directly into structural steel beams.',
      },
    ],
    relatedResources: [
      {
        title: 'Commercial Building Maintenance Services',
        description: 'Fabric upkeep, acoustic mitigation, and structural maintenance.',
        url: '/building-maintenance',
        type: 'guide',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. WORTH ATTENDING — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-wa-decarbonisation-2026',
    slug: 'building-decarbonisation-hard-fm-summit-2026',
    title: 'Building Decarbonisation & Hard FM Asset Electrification Summit 2026',
    standfirst:
      'Curated technical briefing on replacing commercial gas calorifiers with commercial heat pumps without electrical capacity bottlenecks.',
    contentType: 'event',
    franchise: 'worth-attending',
    topics: ['sustainability', 'engineering', 'hvac'],
    author: LOBBY_AUTHORS['entirefm-editorial'],
    publishedAt: '2026-08-27',
    status: 'published',
    contentLifecycle: 'time-sensitive',
    readingTimeMinutes: 2,
    worthAttendingData: {
      eventName: 'Building Decarbonisation & Hard FM Asset Electrification Summit 2026',
      organiser: 'UK Facilities & Estates Executive Forum',
      eventDate: 'Wednesday, 16 September 2026 · 10:00 - 11:30 BST',
      location: 'Live Interactive Broadcast (CPD Certified)',
      eventType: 'Webinar',
      externalLink: '/contact-us',
      whyItMatters:
        'Essential for estates managers planning the replacement of legacy gas calorifiers with high-temperature commercial heat pumps without risking electrical switchboard capacity bottlenecks.',
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Decarbonising commercial building heating requires careful coordination between mechanical heating design and incoming low-voltage electrical distribution capacity. This summit reviews real estate case studies of successful heat pump retrofits.',
      },
    ],
    relatedResources: [
      {
        title: 'Mechanical & Electrical Engineering Overview',
        description: 'Full M&E engineering design and maintenance capabilities.',
        url: '/mechanical-electrical',
        type: 'guide',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. ONE USEFUL THING — ITEM 1
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'art-ut-mobilisation-matrix',
    slug: 'fm-mobilisation-handover-audit-matrix',
    title: '120-Point FM Mobilisation & Handover Audit Matrix (.xlsx)',
    standfirst:
      'An editable, structured handover spreadsheet covering statutory certificates, asset barcoding, logbook verification, and contractor credential checklists.',
    contentType: 'resource-feature',
    franchise: 'useful-thing',
    topics: ['mobilisation', 'compliance', 'ppm', 'procurement'],
    author: LOBBY_AUTHORS['entirefm-operations'],
    publishedAt: '2026-08-27',
    status: 'published',
    contentLifecycle: 'evergreen',
    readingTimeMinutes: 2,
    usefulThingData: {
      assetFormat: 'Spreadsheet (.xlsx)',
      downloadUrl: '/resources/document-vault',
      existingResourceUrl: '/resources/document-vault',
      whyItMatters:
        'The single largest financial and compliance risk during an FM contract transition is inheriting unrecorded defects or lapsed certificates. This matrix prevents liability drift from Day 1.',
      keyPoints: [
        '120-point verified handover criteria mapped to UK statutory duties',
        'Formatted tabs for M&E, Life Safety, Fabric, Soft FM, and CAFM data',
        'Includes risk rating scoring (C1/C2/FI) for defect discovery during mobilisation',
      ],
    },
    bodyBlocks: [
      {
        type: 'paragraph',
        content:
          'Designed by practicing EntireFM mobilisation engineers, this matrix standardises the physical inspection and documentation audit process for new estate takeovers.',
      },
    ],
    relatedResources: [
      {
        title: 'Document Vault — All Downloadable FM Templates',
        description: 'Free, ungated spreadsheets, logbooks, and audit checklists.',
        url: '/resources/document-vault',
        type: 'template',
      },
      {
        title: 'Tender Brief Generator Tool',
        description: 'Generate a structured FM RFP specification ready for market.',
        url: '/tools/tender-brief',
        type: 'tool',
      },
    ],
  },
];
