import type { LobbyContent } from './types';

export const LOBBY_DATA: LobbyContent = {
  leadBriefing: {
    franchise: 'THE WEEK THAT MATTERS',
    title: 'Building Safety Act Secondary Legislation: What Commercial FM Duty Holders Must Verify Before Q4',
    standfirst:
      'The transition period for mandatory digital occurrence reporting and safety case submissions is closing for mixed-use and higher-risk estates. Here is how leading FM operations desks are auditing their statutory evidence registers to eliminate personal duty-holder exposure.',
    publishedAt: '27 August 2026',
    readingTime: '5 min intelligence brief',
    author: {
      name: 'EntireFM Technical Directorate',
      role: 'Building Compliance & Engineering Operations',
    },
    keyTakeaways: [
      'Digital occurrence reporting now requires contemporaneous logging within 48 hours for specified safety-critical envelope and structural events.',
      'Subcontractor competency matrices must link directly to verified third-party accreditation (e.g. BESA, NICEIC, FIRAS) rather than self-certified checklists.',
      'Golden Thread asset records must be stored in open, machine-readable formats accessible across changes in managing agent or hard FM supplier.',
    ],
    fullBriefingUrl: '/compliance',
    tags: ['Building Safety', 'Statutory Compliance', 'Golden Thread', 'Asset Governance'],
  },

  complianceWatch: {
    id: 'cw-2026-08',
    statute: 'Building Safety Act 2022 / Golden Thread Regulations',
    regulationTitle: 'Mandatory Digital Occurrence Reporting & Competency Verification',
    urgency: 'HIGH',
    effectiveDate: 'Enforced Q4 2026',
    whatChanged:
      'The Building Safety Regulator has clarified that duty holders cannot outsource ultimate legal liability for unrecorded structural, fire barrier, or M&E modifications to third-party managing agents. All physical changes must be indexed to the building’s digital Golden Thread within 48 hours of sign-off.',
    whoItAffects:
      'Commercial landlords, estates directors, corporate facilities heads, and responsible persons managing residential, student accommodation, or mixed-use multi-tenanted commercial buildings.',
    whatYouNeedToDo:
      'Audit your current CAFM asset change-log. Ensure every M&E maintenance contractor provides verified digital commissioning sheets, photographed fire-stopping penetrations, and traceable engineer credentials before work orders are closed out.',
    whenItMatters:
      'Immediate action required for active PPM cycles and planned Q4 remedial works. Non-compliant logbooks expose duty holders to formal enforcement notices and invalidate property insurance terms.',
    governingBody: 'Building Safety Regulator (HSE)',
    sourceDocUrl: '/compliance/fire-risk-assessment',
  },

  briefingStrip: [
    {
      id: 'bs-01',
      category: 'F-Gas & HVAC',
      headline: 'Phase-down quotas accelerate R410A price surges across commercial VRF estates',
      summary:
        'Refrigerant reclamation allocations have reduced virgin R410A availability by 18%. Maintain PPM leak-testing schedules to prevent emergency recharge lockouts.',
      sector: 'Commercial Offices & Retail',
      impactLevel: 'Operational',
      timestamp: 'Today, 08:30',
      topicImage: '/images/editorial/refrigerant-pressure-gauges-r410a.jpg',
      topicImageAlt: 'Refrigerant pressure gauge manifold on commercial rooftop chiller',
      sourcePublisher: 'F-Gas Regulation (EU) 2024/573',
      url: '/lobby/f-gas-r410a-phase-down-2026',
    },
    {
      id: 'bs-02',
      category: 'Electrical Safety',
      headline: 'BS 7671 Amendment 3 updates thermal imaging expectations for high-load distribution boards',
      summary:
        'Annual thermographic surveys increasingly required by major property insurers alongside standard 5-yearly EICR testing for high-density switchrooms.',
      sector: 'Industrial & Logistics',
      impactLevel: 'Direct Duty',
      timestamp: 'Yesterday',
      topicImage: '/images/editorial/three-phase-distribution-board-eicr.jpg',
      topicImageAlt: 'Commercial three-phase electrical distribution board interior with MCBs',
      sourcePublisher: 'IET Wiring Regulations',
      url: '/lobby/bs7671-amendment-3-thermal-imaging',
    },
    {
      id: 'bs-03',
      category: 'Water Hygiene',
      headline: 'ACOP L8 seasonal temperature monitoring alert issued following prolonged high ambient heat',
      summary:
        'Cold water storage tank sentinels require bi-weekly validation where ambient plantroom temperatures exceed 20°C to prevent biological growth spikes.',
      sector: 'Healthcare & Public Realm',
      impactLevel: 'Operational',
      timestamp: '2 days ago',
      topicImage: '/images/editorial/potable-water-booster-pump-set.jpg',
      topicImageAlt: 'Commercial cold water booster pump set in plant room with expansion vessels',
      sourcePublisher: 'HSE ACOP L8',
      url: '/lobby/acop-l8-seasonal-temperature-monitoring',
    },
  ],

  engineersNote: {
    id: 'en-2026-08',
    title: 'Condenser Airflow Starvation on Enclosed Rooftop Plant Decks',
    discipline: 'Mechanical & Climate Engineering',
    subtitle: 'Why clean coil faces still trip high-pressure switches when acoustic louvres are retrofitted',
    leadParagraph:
      'During recent site investigations across three multi-tenant office rooftops, our engineering team diagnosed recurring high-pressure lockout faults on modern inverter VRF systems. In each case, maintenance logbooks showed recent coil washing and normal refrigerant charge.',
    technicalObservation:
      'The root cause was micro-recirculation. Following tenant complaints regarding acoustic noise, solid acoustic baffles had been fitted within 1.2m of the condenser discharge face. Under high solar gain, the high-velocity discharge air bounced off the acoustic louvres and was re-ingested into the coil intakes. Intake temperatures measured 47.8°C while ambient rooftop air was only 29.4°C.',
    fieldRule:
      'RULE OF THUMB: Minimum discharge clearance on upward-blowing packaged condensers is 2.5× the fan diameter. Where louvres are mandatory, install 45° discharge hood extensions to push thermal exhaust clear of the acoustic boundary envelope.',
    author: {
      name: 'Marcus Vance, CEng MCIBSE',
      title: 'Senior Building Services Engineer',
      credentials: 'BSc (Hons) M&E Engineering, 18+ Years Commercial Plant Diagnostics',
    },
    diagramNote: 'Observed: +18.4°C thermal recirculation delta at condenser intake under 80% compressor load.',
  },

  usefulThing: {
    id: 'ut-mobilisation-checklist',
    title: 'Commercial FM Mobilisation & Incoming Handover Checklist',
    category: 'Operational Toolkit',
    format: 'Spreadsheet (.xlsx)',
    description:
      'A structured 120-point audit matrix covering statutory certification registers, barcoded asset handover logs, BMS sensor calibration records, spare parts staging, and incoming TUPE staffing protocols.',
    whyItMatters:
      'The single largest risk during an FM contract transition is inheriting uncertified compliance gaps or unrecorded plant defects from the outgoing supplier. This matrix prevents liability drift from Day 1.',
    actionUrl: '/resources/document-vault',
    actionLabel: 'Download Handover Matrix (.xlsx)',
    isExistingResource: true,
  },

  fromTheField: {
    id: 'ftf-2026-08',
    imageKey: 'hvac-rooftop-condensers',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    imageAlt: 'Commercial rooftop HVAC condenser bank and chiller deck inspection',
    locationContext: '210,000 sq ft Commercial Headquarters, West Midlands',
    environmentType: 'Rooftop Plant Deck & Chilled Water Infrastructure',
    challengeTitle: 'Can you spot the critical defect in this condenser bank installation?',
    observation:
      'At first glance, this rooftop condenser installation appears pristine: brand-new powder-coated enclosures, clean pipe insulation, and cable tray alignment. However, look closely at the condensate drainage routing and anti-vibration mountings.',
    lessonLearned:
      'The anti-vibration spring isolators have been fully compressed metal-to-metal due to incorrect spring rate sizing during installation. Structure-borne vibration was telegraphing through the steel deck into the executive boardrooms on Floor 6, creating a low-frequency 50Hz acoustic resonance.',
    remedialAction:
      'Recalculated static deflection requirements, installed tuned neoprene-composite isolation pads, and reinstated flexible pipe couplings to eliminate structure-borne transmission without taking the chiller offline.',
  },

  askEntireFM: {
    id: 'ask-2026-08',
    question:
      'We are taking over a 140,000 sq ft multi-let office building. What specific compliance documentation must we demand from the incumbent FM provider before signing off the handover?',
    askerContext: 'Head of Property Operations, UK Institutional Property Fund',
    estateProfile: 'Grade-A Multi-Let Commercial Office, London EC2',
    keyAnswerPoints: [
      'Demand the full Form 6 / EICR distribution board schedule, including specific C1, C2, and FI remedial closeout certificates.',
      'Require the written ACOP L8 Legionella risk assessment and 24 months of continuous temperature and sampling logbook data.',
      'Inspect the physical F-Gas logbook with refrigerant addition/recovery records mapped to individual equipment serial numbers.',
      'Verify the mandatory 3-hour annual emergency lighting discharge test certificate and fire alarm commissioning records under BS 5839.',
    ],
    fullAnswerSummary:
      'Never accept a generic "clean bill of health" statement. You must demand the contemporaneous engineering sign-off sheets, as-built M&E schematics, operation and maintenance (O&M) manuals, and active manufacturer warranty documentation. Any missing certificate must be documented on the handover deed as an incumbent liability to be resolved prior to commercial settlement.',
    responder: {
      name: 'EntireFM Helpdesk & Mobilisation Desk',
      role: 'Commercial Operations & Governance Team',
    },
  },

  toolkit: [
    {
      id: 'tool-ppm-builder',
      title: 'PPM Schedule Builder',
      category: 'Maintenance Planning',
      description:
        'Select your building assets across HVAC, electrical, fire, and water systems to generate an asset-led 52-week maintenance matrix with verified statutory frequencies.',
      url: '/tools/ppm-schedule-builder',
      ctaText: 'Launch Schedule Builder',
      statsBadge: 'SFG20 & Statutory Aligned',
      tag: 'Interactive Tool',
    },
    {
      id: 'tool-compliance-checker',
      title: 'FM Statutory Compliance Checker',
      category: 'Legal & Risk Screening',
      description:
        'Audit your estate against 10 mandatory UK statutory regimes (Fire Safety, EICR, Gas, Legionella, LOLER) in 3 minutes to identify legal exposure.',
      url: '/tools/compliance-checker',
      ctaText: 'Audit Your Building',
      statsBadge: '10 UK Regimes',
      tag: 'Risk Diagnostic',
    },
    {
      id: 'tool-tender-brief',
      title: 'FM Tender Brief & RFP Generator',
      category: 'Procurement & Strategy',
      description:
        'Create a clear, structured Facilities Management tender brief covering service scopes, SLA response matrices, and CAFM reporting requirements.',
      url: '/tools/tender-brief',
      ctaText: 'Build Tender Brief',
      statsBadge: 'Neutral Specification',
      tag: 'Procurement Tool',
    },
  ],

  lobbyQuestion: {
    id: 'lq-2026-w35',
    weekNumber: 35,
    topic: 'Electrical Statutory Testing (BS 7671)',
    difficulty: 'Practitioner',
    question:
      'Under BS 7671 / IET Guidance Note 3, what is the maximum recommended routine inspection and testing interval for electrical installations in a commercial office environment with normal occupancy?',
    options: [
      { id: 'opt-a', text: '1 Year (Annual)', isCorrect: false },
      { id: 'opt-b', text: '3 Years', isCorrect: false },
      { id: 'opt-c', text: '5 Years (or at change of occupancy)', isCorrect: true },
      { id: 'opt-d', text: '10 Years', isCorrect: false },
    ],
    explanation:
      'For commercial offices, BS 7671 and IET Guidance Note 3 recommend a maximum interval of 5 years between full Electrical Installation Condition Reports (EICR), or sooner upon a significant change of occupancy. However, routine visual inspections of distribution boards should take place annually.',
    governingStandard: 'BS 7671:2018+A2:2022 / IET Guidance Note 3 Table 3.2',
  },

  lobbyPulse: {
    id: 'pulse-2026-08',
    question: 'What is currently causing your facilities team the greatest operational headache?',
    context: 'Monthly UK Facilities Management Sentiment Benchmark',
    totalVotes: 0,
    totalVotesBaseline: 0,
    options: [
      { id: 'p1', label: 'Compliance & Statutory Evidence Gaps', percentage: 0 },
      { id: 'p2', label: 'Supply Chain & Subcontractor Reliability', percentage: 0 },
      { id: 'p3', label: 'HVAC Plant Age & Energy Costs', percentage: 0 },
      { id: 'p4', label: 'Budget Pressure & Reactive Overspend', percentage: 0 },
      { id: 'p5', label: 'CAFM Data Hygiene & Asset Visibility', percentage: 0 },
    ],
  },

  worthAttending: {
    id: 'wa-2026-09',
    title: 'Building Decarbonisation & Hard FM Asset Electrification Summit 2026',
    organizer: 'UK Facilities & Estates Executive Forum',
    eventType: 'Webinar',
    date: 'Wednesday, 16 September 2026 · 10:00 - 11:30 BST',
    location: 'Live Interactive Broadcast (CPD Certified)',
    editorialReason:
      'Essential for estates managers planning the replacement of legacy gas calorifiers with high-temperature commercial heat pumps without risking electrical capacity bottlenecks.',
    registrationUrl: '/contact-us',
  },
};
