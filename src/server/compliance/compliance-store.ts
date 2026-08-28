export type ComplianceDiscipline =
  | 'all'
  | 'building-safety'
  | 'fire'
  | 'electrical'
  | 'water'
  | 'gas'
  | 'hvac'
  | 'lifts'
  | 'asbestos'
  | 'energy'
  | 'health-safety';

export type ComplianceClassification =
  | 'Statutory Law'
  | 'ACOP'
  | 'Approved Document'
  | 'Technical Guidance'
  | 'Industry Standard'
  | 'Consultation';

export type UKJurisdiction =
  | 'England'
  | 'Wales'
  | 'Scotland'
  | 'Northern Ireland'
  | 'Great Britain'
  | 'United Kingdom';

export type ComplianceStatus = 'current' | 'upcoming' | 'under_review' | 'consultation';

export interface ComplianceRecord {
  id: string;
  title: string;
  slug: string;
  discipline: ComplianceDiscipline;
  classification: ComplianceClassification;
  statuteCitation: string;
  authority: string; // e.g. 'Building Safety Regulator (HSE)'
  jurisdiction: UKJurisdiction;
  heroImage?: string;
  heroImageAlt?: string;
  sourceUrl: string;
  summary: string;
  whatChanged: string;
  whoAffected: string;
  actionRequired: string;
  entirefmTake?: string;
  effectiveDate: string;
  deadline?: string;
  status: ComplianceStatus;
  timelineMonth: string; // e.g. 'OCT 2026'
  timelineDate?: string; // e.g. '01 OCT'
  isLeadFeature?: boolean;
  relatedTools?: { name: string; url: string; description?: string }[];
  relatedGuidance?: { name: string; url: string }[];
  relatedDiscussion?: { title: string; url: string; category?: string };
}

export interface ConsultationItem {
  id: string;
  title: string;
  authority: string;
  jurisdiction: UKJurisdiction;
  discipline: ComplianceDiscipline;
  closingDate: string;
  closingDateFormatted: string;
  whyFMShouldCare: string;
  sourceUrl: string;
}

export interface RegulatorActivityItem {
  id: string;
  regulator: string;
  date: string;
  title: string;
  summary: string;
  discipline: ComplianceDiscipline;
  sourceUrl: string;
  jurisdiction: UKJurisdiction;
}

export interface HorizonTimelineMilestone {
  id: string;
  dateStr: string; // '12 SEP'
  month: string; // 'SEPTEMBER'
  year: number; // 2026
  title: string;
  type: 'Consultation Closes' | 'Guidance Takes Effect' | 'Statutory Deadline' | 'Standard Revision';
  discipline: ComplianceDiscipline;
  disciplineLabel: string;
  jurisdiction: UKJurisdiction;
  recordSlug?: string;
}

export const COMPLIANCE_RECORDS: ComplianceRecord[] = [
  {
    id: 'comp-01',
    title: 'Mandatory Digital Occurrence Reporting (BSA 2022 Part 4)',
    slug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
    discipline: 'building-safety',
    classification: 'Statutory Law',
    statuteCitation: 'Building Safety Act 2022 Part 4 / SI 2023/1096',
    authority: 'Building Safety Regulator (HSE)',
    jurisdiction: 'England',
    heroImage: '/images/editorial/building-safety-facade-inspection.jpg',
    heroImageAlt: 'Higher-Risk Building structural facade inspection and building safety assessment',
    sourceUrl: 'https://www.hse.gov.uk/building-safety/mandatory-occurrence-reporting.htm',
    summary:
      'Principal Accountable Persons must establish a structured mandatory occurrence reporting system and notify the BSR of structural or fire safety risks in Higher-Risk Buildings within 48 hours.',
    whatChanged:
      'Statutory transition from informal logs to strict digital audit trails with mandatory 48-hour BSR notification thresholds.',
    whoAffected:
      'Commercial landlords, managing agents, Facilities Directors, and Responsible Persons operating HRBs (18m+ or 7+ storeys).',
    actionRequired:
      'Audit fire damper testing registers, verify golden thread digital data stores, and establish formal 24/7 incident escalation protocols.',
    entirefmTake:
      'The BSR is focusing enforcement on operational handovers. Ensure your CAFM contractor records provide verifiable timestamps for all statutory safety plant inspections.',
    effectiveDate: '01 October 2026',
    deadline: '2026-10-31',
    status: 'upcoming',
    timelineMonth: 'OCT 2026',
    timelineDate: '01 OCT',
    isLeadFeature: true,
    relatedTools: [
      {
        name: 'Asset Register Builder',
        url: '/tools/asset-register-builder',
        description: 'Verify mandatory asset attributes required for Golden Thread safety cases.',
      },
      {
        name: 'Statutory Compliance Matrix',
        url: '/resources/commercial-fm-statutory-compliance-matrix',
        description: 'Review statutory maintenance intervals and duty-holder legal assignments.',
      },
    ],
    relatedGuidance: [
      { name: 'BSA Dutyholder Executive Briefing', url: '/lobby/building-safety-act-what-fm-teams-need-to-know-now' },
    ],
    relatedDiscussion: {
      title: 'Mandatory Digital Occurrence Reporting: Duty Holder Records & Escalation',
      url: '/lobby/community/discussion/mandatory-digital-occurrence-reporting-duty-holder-records',
      category: 'Compliance & Safety',
    },
  },
  {
    id: 'comp-02',
    title: 'ACOP L8 / HSG274 Water Hygiene Microbiological Sampling & Sentinel Regimes',
    slug: 'acop-l8-water-hygiene-sampling-regimes-2026',
    discipline: 'water',
    classification: 'ACOP',
    statuteCitation: 'Health and Safety at Work etc. Act 1974 / ACOP L8 (4th Edition)',
    authority: 'Health and Safety Executive (HSE)',
    jurisdiction: 'Great Britain',
    heroImage: '/images/editorial/potable-water-booster-pump-set.jpg',
    heroImageAlt: 'Commercial water booster pump set and cold water storage distribution pipework',
    sourceUrl: 'https://www.hse.gov.uk/legionnaires',
    summary:
      'Enforced microbiological testing regimes, sentinel tap logging frequencies, and mandatory monthly temperature verification across commercial hot and cold water distribution systems.',
    whatChanged:
      'Enforced sentinel tap logging frequencies for intermittently occupied tenancies and strict calibration traceability for digital thermometers.',
    whoAffected: 'Dutyholders, building managers, water treatment service providers, and commercial estates teams.',
    actionRequired:
      'Audit calorifier flow/return temperatures (minimum 60°C flow, 50°C return within 1 minute) and review legionella risk assessment currency (maximum 2-year review cycle).',
    entirefmTake:
      'Hybrid working patterns continue to create stagnant dead-legs. Implement automated flushing logs or physical circuit balancing for tenancies with sub-50% occupancy.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
    relatedTools: [
      {
        name: 'Water Hygiene Audit Checklist',
        url: '/resources/water-hygiene-audit-checklist',
        description: 'Monthly sentinel temperature checklist and calorifier inspection register.',
      },
    ],
  },
  {
    id: 'comp-03',
    title: 'BS 7671:2018+A2:2022 Electrical Installation Condition Reports (EICR)',
    slug: 'bs-7671-eicr-commercial-inspection-frequencies',
    discipline: 'electrical',
    classification: 'Industry Standard',
    statuteCitation: 'Electricity at Work Regulations 1989 Reg 4(2) / BS 7671:2018+A2',
    authority: 'IET / BSI',
    jurisdiction: 'United Kingdom',
    heroImage: '/images/editorial/commercial-switchgear-compliance.jpg',
    heroImageAlt: 'Commercial three-phase switchgear distribution board thermal and insulation testing',
    sourceUrl: 'https://electrical.theiet.org/bs-7671',
    summary:
      'Periodic inspection and testing intervals for commercial and industrial electrical installations under Regulation 651.1, requiring strict remediation of Code C1 and C2 defects.',
    whatChanged:
      'Stricter risk-based inspection frequencies (maximum 5-year periodicity for commercial offices; 3-year for industrial; annual for public entertainment venues).',
    whoAffected: 'Dutyholders, Hard FM contractors, electrical operations managers, and commercial landlords.',
    actionRequired:
      'Verify all Code C1 (Danger present) and Code C2 (Potentially dangerous) defect notices are remedied and re-certified with formal minor works certificates.',
    entirefmTake:
      'Insurers are routinely repudiating fire claims where dutyholders fail to demonstrate a valid, unexpired EICR and closed-out C1/C2 remedial records.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
    relatedTools: [
      {
        name: 'Electrical Compliance Frequency Calculator',
        url: '/tools/ppm-frequency-calculator',
        description: 'Determine statutory EICR and emergency lighting test frequencies by premises risk.',
      },
    ],
  },
  {
    id: 'comp-04',
    title: 'Fire Safety (England) Regulations 2022 Article 14 Fire Door Inspections',
    slug: 'fire-safety-england-regulations-fire-door-checks',
    discipline: 'fire',
    classification: 'Statutory Law',
    statuteCitation: 'Fire Safety (England) Regulations 2022 / RRO 2005 Article 14',
    authority: 'Home Office / Fire & Rescue Service',
    jurisdiction: 'England',
    sourceUrl: 'https://www.gov.uk/government/publications/fire-safety-england-regulations-2022',
    summary:
      'Mandatory quarterly checks on fire doors in common parts of multi-occupied commercial and residential buildings over 11 metres, including self-closing device verification.',
    whatChanged:
      'Legal duty for Responsible Persons to inspect all common part fire doors quarterly and flat entrance fire doors annually.',
    whoAffected: 'Responsible Persons, property managers, building owners, and fire safety contractors.',
    actionRequired:
      'Log certified fire door checks within CAFM, verifying intumescent strips, smoke seals, self-closing mechanisms, and gaps (2–4mm).',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
    relatedTools: [
      {
        name: 'Statutory Compliance Matrix',
        url: '/resources/commercial-fm-statutory-compliance-matrix',
      },
    ],
  },
  {
    id: 'comp-05',
    title: 'GB F-Gas Regulation Refrigerant Leak Testing & Logbook Mandates',
    slug: 'gb-f-gas-regulation-refrigerant-leak-testing-frequencies',
    discipline: 'hvac',
    classification: 'Statutory Law',
    statuteCitation: 'Fluorinated Greenhouse Gases Regulations 2015 / SI 2015/310',
    authority: 'Environment Agency / Defra',
    jurisdiction: 'Great Britain',
    heroImage: '/images/editorial/refrigerant-pressure-gauges-r410a.jpg',
    heroImageAlt: 'Commercial HVAC refrigerant manifold gauges and leak detection testing',
    sourceUrl: 'https://www.gov.uk/guidance/fluorinated-gases-f-gases-regulations',
    summary:
      'Mandatory leak check intervals based on CO2 equivalent tonnes for commercial chillers, VRF systems, and split air conditioning plant (5 to 500+ tonnes CO2e).',
    whatChanged:
      'Stricter phase-down quotas for high-GWP refrigerants (R410A, R404A) and mandatory 5-year digital logbook retention for operators.',
    whoAffected: 'Commercial building operators, FM service providers, HVAC contractors, refrigeration engineers.',
    actionRequired:
      'Audit equipment F-Gas logbooks, confirm Refcom-certified technician sign-offs, and calculate CO2 equivalent thresholds across rooftop plant.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
  },
  {
    id: 'comp-06',
    title: 'Non-Domestic EPC Minimum Energy Efficiency Standard (MEES) Band B Roadmap',
    slug: 'mees-epc-band-b-commercial-property-timeline',
    discipline: 'energy',
    classification: 'Statutory Law',
    statuteCitation: 'Energy Efficiency (Private Rented Property) Regulations 2015',
    authority: 'Department for Energy Security and Net Zero',
    jurisdiction: 'England',
    sourceUrl: 'https://www.gov.uk/guidance/non-domestic-private-rented-property-minimum-energy-efficiency-standard',
    summary:
      'Statutory requirement for all rented commercial properties in England and Wales to achieve a minimum Energy Performance Certificate rating of Band B by 2030, with an intermediate Band C milestone.',
    whatChanged:
      'Tightening energy efficiency thresholds requiring commercial landlords to commission asset decarbonisation and BMS sub-metering audits.',
    whoAffected: 'Commercial property owners, asset managers, corporate tenants with FRI leases.',
    actionRequired:
      'Audit current estate EPC ratings and model HVAC/chiller heat-pump retrofit options for all assets graded D or lower.',
    effectiveDate: '01 April 2027 (Milestone)',
    deadline: '2027-04-01',
    status: 'upcoming',
    timelineMonth: 'APR 2027',
    timelineDate: '01 APR',
    relatedTools: [
      { name: 'PPM Frequency & Runtime Calculator', url: '/tools/ppm-frequency-calculator' },
    ],
  },
  {
    id: 'comp-07',
    title: 'LOLER 1998 Regulation 9 Passenger Lift Thorough Examination Intervals',
    slug: 'loler-passenger-lift-thorough-examination-regimes',
    discipline: 'lifts',
    classification: 'Statutory Law',
    statuteCitation: 'Lifting Operations and Lifting Equipment Regulations 1998 Reg 9',
    authority: 'Health and Safety Executive (HSE)',
    jurisdiction: 'Great Britain',
    sourceUrl: 'https://www.hse.gov.uk/work-equipment-machinery/loler.htm',
    summary:
      'Mandatory 6-monthly thorough examinations by a competent person for all passenger carrying lifts, and 12-monthly for goods-only lifting equipment.',
    whatChanged:
      'Enhanced enforcement on supplementary testing schedules for aging traction lifts and digital archiving of SAFed reports.',
    whoAffected: 'Dutyholders, building managers, lift maintenance contractors, insurance engineering surveyors.',
    actionRequired:
      'Reconcile insurance inspection defect notices (Category A immediate danger vs Category B scheduled) and ensure 6-monthly certificates are logged.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
  },
  {
    id: 'comp-08',
    title: 'Control of Asbestos Regulations 2012 Regulation 4 Duty to Manage',
    slug: 'control-of-asbestos-regulations-duty-to-manage-2026',
    discipline: 'asbestos',
    classification: 'Statutory Law',
    statuteCitation: 'Control of Asbestos Regulations 2012 / SI 2012/632',
    authority: 'Health and Safety Executive (HSE)',
    jurisdiction: 'Great Britain',
    sourceUrl: 'https://www.hse.gov.uk/asbestos/duty.htm',
    summary:
      'Statutory obligation for dutyholders of non-domestic premises to maintain an active Asbestos Management Plan and conduct mandatory annual re-inspections of all identified ACMs.',
    whatChanged:
      'Updated HSE inspection blitz focusing on digital contractor access to asbestos registers prior to commencing invasive M&E intrusive works.',
    whoAffected: 'Estates directors, building managers, M&E fit-out contractors, facilities teams.',
    actionRequired:
      'Review annual asbestos register currency, re-inspect condition of known ACMs in plant rooms, and mandate contractor sign-offs before issuing permits to work.',
    effectiveDate: 'Enforced Currently',
    status: 'current',
    timelineMonth: 'CURRENT',
    timelineDate: 'ENFORCED',
  },
];

export const OPEN_CONSULTATIONS: ConsultationItem[] = [
  {
    id: 'cons-01',
    title: 'Building Safety Act 2022: Second Staircase Provisions in High-Rise Residential Buildings',
    authority: 'Ministry of Housing, Communities & Local Government',
    jurisdiction: 'England',
    discipline: 'building-safety',
    closingDate: '2026-09-18',
    closingDateFormatted: '18 September 2026',
    whyFMShouldCare:
      'Technical design transitions for 18m+ developments affecting evacuation routes, smoke control maintenance, and existing mixed-use commercial podium interfaces.',
    sourceUrl: 'https://www.gov.uk/government/consultations',
  },
  {
    id: 'cons-02',
    title: 'Review of the Electricity at Work Regulations 1989 in Commercial EV Charging Infrastructures',
    authority: 'Health and Safety Executive (HSE)',
    jurisdiction: 'Great Britain',
    discipline: 'electrical',
    closingDate: '2026-10-15',
    closingDateFormatted: '15 October 2026',
    whyFMShouldCare:
      'Proposes mandatory annual inspection regimes for commercial fleet and car park charging hubs, shifting EV charger maintenance into statutory PPM scope.',
    sourceUrl: 'https://www.hse.gov.uk/consult',
  },
  {
    id: 'cons-03',
    title: 'Future Homes & Buildings Standard: Non-Domestic Ventilation & Overheating Protocols',
    authority: 'DESNZ / DLUHC',
    jurisdiction: 'England',
    discipline: 'energy',
    closingDate: '2026-11-05',
    closingDateFormatted: '05 November 2026',
    whyFMShouldCare:
      'Mandates higher fresh air exchange rates (Part F) and summer thermal comfort limits for commercial offices, affecting HVAC AHU sizing and controls.',
    sourceUrl: 'https://www.gov.uk/government/consultations',
  },
];

export const HORIZON_TIMELINE: HorizonTimelineMilestone[] = [
  {
    id: 'hor-01',
    dateStr: '18 SEP',
    month: 'SEPTEMBER',
    year: 2026,
    title: 'Second Staircase Provisions Consultation Closes',
    type: 'Consultation Closes',
    discipline: 'building-safety',
    disciplineLabel: 'Building Safety',
    jurisdiction: 'England',
  },
  {
    id: 'hor-02',
    dateStr: '01 OCT',
    month: 'OCTOBER',
    year: 2026,
    title: 'Mandatory Digital Occurrence Reporting (BSA Part 4) Statutory Launch',
    type: 'Statutory Deadline',
    discipline: 'building-safety',
    disciplineLabel: 'Building Safety Act',
    jurisdiction: 'England',
    recordSlug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
  },
  {
    id: 'hor-03',
    dateStr: '15 OCT',
    month: 'OCTOBER',
    year: 2026,
    title: 'Commercial EV Charging Maintenance Consultation Closes',
    type: 'Consultation Closes',
    discipline: 'electrical',
    disciplineLabel: 'Electrical',
    jurisdiction: 'Great Britain',
  },
  {
    id: 'hor-04',
    dateStr: '05 NOV',
    month: 'NOVEMBER',
    year: 2026,
    title: 'Non-Domestic Ventilation & Overheating Standards Consultation Closes',
    type: 'Consultation Closes',
    discipline: 'energy',
    disciplineLabel: 'Energy & HVAC',
    jurisdiction: 'England',
  },
  {
    id: 'hor-05',
    dateStr: '01 APR',
    month: 'APRIL',
    year: 2027,
    title: 'Non-Domestic MEES EPC Band C Intermediate Milestone',
    type: 'Statutory Deadline',
    discipline: 'energy',
    disciplineLabel: 'Energy & MEES',
    jurisdiction: 'England',
    recordSlug: 'mees-epc-band-b-commercial-property-timeline',
  },
];

export const REGULATOR_ACTIVITY: RegulatorActivityItem[] = [
  {
    id: 'reg-01',
    regulator: 'Building Safety Regulator',
    date: '27 Aug 2026',
    title: 'BSR issues technical circular on safety case report submissions for multi-staircase HRBs',
    summary:
      'Clarification for Accountable Persons on structural compartmentalisation evidence required before building safety certificate applications.',
    discipline: 'building-safety',
    jurisdiction: 'England',
    sourceUrl: 'https://www.hse.gov.uk/building-safety',
  },
  {
    id: 'reg-02',
    regulator: 'Health and Safety Executive',
    date: '25 Aug 2026',
    title: 'HSE enforcement update: Legionella sampling non-compliances in commercial cooling towers',
    summary:
      'National bulletin emphasising prosecution risks where biocide dosing logs are incomplete during seasonal temperature spikes.',
    discipline: 'water',
    jurisdiction: 'Great Britain',
    sourceUrl: 'https://www.hse.gov.uk/legionnaires',
  },
  {
    id: 'reg-03',
    regulator: 'Environment Agency',
    date: '20 Aug 2026',
    title: 'EA reminder on quota phase-down thresholds for virgin R404A & R410A refrigerants',
    summary:
      'Strict quota enforcement guidance for commercial air conditioning maintenance providers and estate operators.',
    discipline: 'hvac',
    jurisdiction: 'Great Britain',
    sourceUrl: 'https://www.gov.uk/guidance/fluorinated-gases-f-gases-regulations',
  },
];

export function getComplianceRecords(filters?: {
  discipline?: string;
  status?: string;
  jurisdiction?: string;
}): ComplianceRecord[] {
  let list = [...COMPLIANCE_RECORDS];
  if (filters?.discipline && filters.discipline !== 'all') {
    list = list.filter((c) => c.discipline === filters.discipline);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters?.jurisdiction && filters.jurisdiction !== 'all') {
    list = list.filter(
      (c) =>
        c.jurisdiction === filters.jurisdiction ||
        c.jurisdiction === 'United Kingdom' ||
        c.jurisdiction === 'Great Britain'
    );
  }
  return list;
}

export function getComplianceRecordBySlug(slug: string): ComplianceRecord | undefined {
  return COMPLIANCE_RECORDS.find((c) => c.slug === slug);
}
