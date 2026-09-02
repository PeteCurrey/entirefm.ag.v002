/**
 * ENTIREFM LOBBY COMPLIANCE DATA
 * ==============================
 * Sourced statutory compliance taxonomy, testing frequencies, documentary evidence,
 * and authoritative UK legislative references. Zero fabricated statutes or frequencies.
 */

export interface ComplianceTopic {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  statusContext: 'Legal Statutory Duty' | 'British Standard / ACOP' | 'Official Regulatory Guidance';
  whatIsIt: string;
  whoIsResponsible: string;
  whatNeedsToHappen: string[];
  howOften: string;
  frequencySource: string;
  evidenceRequired: string[];
  implicationsIfMissed: string;
  officialSources: { title: string; issuingBody: string; url: string; lastUpdated: string }[];
  entireFmGuidance: string;
  relatedKnowSlug?: string;
  relatedDoToolUrl?: string;
  relatedDoToolName?: string;
  relatedFindCategory?: string;
  lastReviewedDate: string;
}

export interface FrequencyRecord {
  id: string;
  system: string;
  activity: string;
  frequency: string;
  sourceStandard: string;
  dutyHolder: string;
  notes: string;
}

export interface EvidenceRecord {
  system: string;
  evidenceType: string;
  retentionPeriod: string;
  description: string;
  statutoryBasis: string;
}

export interface LegislationItem {
  id: string;
  title: string;
  issuingBody: string;
  inForceYear: string;
  status: 'In Force' | 'Amended / Expanded' | 'Staged Implementation';
  topic: string;
  summary: string;
  officialUrl: string;
}

// ── 01. 10 CORE STATUTORY DISCIPLINES ─────────────────────────────
export interface ComplianceDisciplineMeta {
  id: string;
  name: string;
  shortCode: string;
  primaryAct: string;
  standard: string;
  dutyHolder: string;
  typicalCadence: string;
  enforcingBody: string;
  evidenceSummary: string;
}

export const COMPLIANCE_DISCIPLINES: ComplianceDisciplineMeta[] = [
  {
    id: 'fire',
    name: 'Fire & Life Safety',
    shortCode: 'RRO 2005 / FSA 2021',
    primaryAct: 'Regulatory Reform (Fire Safety) Order 2005 & Fire Safety Act 2021',
    standard: 'BS 5839-1 (Alarms), BS 5266-1 (Lighting), BS 9999, BS 8214 (Doors)',
    dutyHolder: 'Responsible Person (Owner, Employer, or Managing Agent with premises control)',
    typicalCadence: 'Weekly call-point test · Monthly emergency lighting flick test · 6-Monthly alarm service · Annual FRA review',
    enforcingBody: 'Local Fire & Rescue Authority',
    evidenceSummary: 'Written Fire Risk Assessment (FRA), signed alarm logbook, 3-hour emergency lighting discharge certificate, fire door gap audit log.',
  },
  {
    id: 'electrical',
    name: 'Electrical Systems',
    shortCode: 'EAWR 1989 / BS 7671',
    primaryAct: 'Electricity at Work Regulations 1989',
    standard: 'BS 7671:2018+A3:2024 (IET Wiring Regulations, 18th Edition)',
    dutyHolder: 'Duty Holder (Employer, Building Owner, or Managing Agent)',
    typicalCadence: 'Fixed wire testing (EICR) max 5 years (commercial) or 3 years (industrial) · Annual thermal imaging recommended · Routine user checks',
    enforcingBody: 'Health and Safety Executive (HSE)',
    evidenceSummary: 'Electrical Installation Condition Report (EICR) with zero unaddressed C1/C2 codes, distribution board schedules, PAT/portable appliance records.',
  },
  {
    id: 'water',
    name: 'Water Hygiene & Legionella',
    shortCode: 'ACOP L8 / HSG274',
    primaryAct: 'Health and Safety at Work etc. Act 1974 & COSHH Regulations 2002',
    standard: 'HSE Approved Code of Practice L8 & HSG274 Parts 1, 2, 3',
    dutyHolder: 'Statutory Duty Holder & Nominated Responsible Person (Water Hygiene)',
    typicalCadence: 'Monthly sentinel outlet temperatures · 6-Monthly storage tank inspection · Annual calorifier drain · Biennial Legionella Risk Assessment review',
    enforcingBody: 'Health and Safety Executive (HSE)',
    evidenceSummary: 'Legionella Risk Assessment (LRA), physical/digital water hygiene logbook, monthly sentinel temperatures (<20°C cold, >50°C hot after 1 min), microbiological sampling reports.',
  },
  {
    id: 'hvac',
    name: 'HVAC, Chillers & Refrigerants',
    shortCode: 'F-GAS / EPBD TM44',
    primaryAct: 'Fluorinated Greenhouse Gases Regulations 2015 & Energy Performance of Buildings Regs',
    standard: 'UK F-Gas Regs / CIBSE TM44 Air Conditioning Energy Assessment',
    dutyHolder: 'System Operator (FM Director, Tenant, or Managing Agent)',
    typicalCadence: 'F-Gas leak testing: 12 months (5–50 t CO2e), 6 months (50–500 t CO2e), 3 months (>500 t CO2e) · 5-Year TM44 energy inspections',
    enforcingBody: 'Environment Agency (EA)',
    evidenceSummary: 'F-Gas logbook with certified technician numbers, refrigerant recovery certificates, EPBD TM44 report lodged on the central register.',
  },
  {
    id: 'lifting',
    name: 'Lifting & Access Equipment',
    shortCode: 'LOLER 1998 / PUWER',
    primaryAct: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER)',
    standard: 'BS EN 81-20/50 / SAFed Guidelines',
    dutyHolder: 'Premises Duty Holder / Lift Owner / Managing Agent',
    typicalCadence: '6 Months (passenger carrying lifts) · 12 Months (goods-only hoists & lifting gear) · Periodic maintenance contract',
    enforcingBody: 'Health and Safety Executive (HSE)',
    evidenceSummary: 'Thorough Examination Report by an independent competent inspection engineer (competent person/insurer), maintenance visit worksheets, emergency release log.',
  },
  {
    id: 'gas',
    name: 'Gas Systems & Pressure Vessels',
    shortCode: 'GSIUR 1998 / PSSR 2000',
    primaryAct: 'Gas Safety (Installation and Use) Regs 1998 & Pressure Systems Safety Regs 2000',
    standard: 'IGEM Standards / Written Schemes of Examination (WSE)',
    dutyHolder: 'Employer / Landlord / Building Operator',
    typicalCadence: 'Annual gas safety inspection by Gas Safe commercial engineer · Pressure vessels inspected per Written Scheme of Examination',
    enforcingBody: 'Health and Safety Executive (HSE)',
    evidenceSummary: 'Non-Domestic Gas Safety Certificate (CP17/CD11), Written Scheme of Examination (WSE) signed by a competent person, boiler service logs.',
  },
  {
    id: 'asbestos',
    name: 'Asbestos Management',
    shortCode: 'CAR 2012 Reg 4',
    primaryAct: 'Control of Asbestos Regulations 2012 (Regulation 4: Duty to Manage)',
    standard: 'HSE HSG264 (Asbestos: The survey guide) & HSG227',
    dutyHolder: 'Dutyholder (Every person who has by virtue of a contract or tenancy an obligation of maintenance)',
    typicalCadence: 'Annual condition re-inspection of known ACMs · Management plan reviewed at least every 12 months or prior to refurbishment',
    enforcingBody: 'Health and Safety Executive (HSE)',
    evidenceSummary: 'Asbestos Register, Asbestos Management Plan (AMP), annual condition re-inspection survey reports, contractor sign-in/briefing records before works.',
  },
  {
    id: 'building-safety',
    name: 'Building Safety & Golden Thread',
    shortCode: 'BSA 2022 Part 4',
    primaryAct: 'Building Safety Act 2022 & The Higher-Risk Buildings (Management of Safety Risks) Regs 2023',
    standard: 'BS 8644-1 (Digital management of fire and safety information)',
    dutyHolder: 'Principal Accountable Person (PAP) and Accountable Persons (APs)',
    typicalCadence: 'Continuous Golden Thread maintenance · Safety Case Report live updates · Mandatory occurrence reporting within 10 days',
    enforcingBody: 'Building Safety Regulator (BSR)',
    evidenceSummary: 'Building Safety Case Report, Golden Thread digital records, Residents Engagement Strategy, mandatory occurrence log, structural integrity records.',
  },
  {
    id: 'health-safety',
    name: 'Workplace Health & Safety',
    shortCode: 'HASAWA 1974 / COSHH',
    primaryAct: 'Health and Safety at Work etc. Act 1974 & Management of H&S at Work Regs 1999',
    standard: 'Work at Height Regs 2005, COSHH Regs 2002, PUWER 1998',
    dutyHolder: 'Employer & Building Controller',
    typicalCadence: 'Continuous risk assessment review · Annual Mansafe/fall-arrest line testing · Biennial COSHH register update',
    enforcingBody: 'Health and Safety Executive (HSE) & Local Authority Environmental Health',
    evidenceSummary: 'General risk assessments, COSHH safety data sheets and assessments, fall-arrest re-certification certificates, accident book (RIDDOR log).',
  },
  {
    id: 'environmental',
    name: 'Environmental & Energy Compliance',
    shortCode: 'EPA 1990 / EPBD',
    primaryAct: 'Environmental Protection Act 1990 (Duty of Care) & Energy Act 2023',
    standard: 'The Waste (England and Wales) Regulations 2011 / MEES Regulations',
    dutyHolder: 'Waste Producer / Property Owner',
    typicalCadence: 'Commercial EPC valid 10 years (MEES minimum rating compliance) · Waste transfer notes held 2 years · Hazardous waste consignment notes held 3 years',
    enforcingBody: 'Environment Agency (EA)',
    evidenceSummary: 'Valid Commercial Energy Performance Certificate (EPC rating E or higher), Waste Transfer Notes (WTNs), Hazardous Waste Consignment Notes.',
  },
];

// ── 02. COMPLIANCE TOPIC LIBRARY (FOR REUSABLE TOPIC PAGES) ──────
export const COMPLIANCE_TOPICS: ComplianceTopic[] = [
  {
    slug: 'fire-doors',
    title: 'Fire Doors & Compartmentation',
    category: 'Fire & Life Safety',
    categorySlug: 'fire',
    statusContext: 'Legal Statutory Duty',
    whatIsIt: 'Fire doors are engineered passive safety assemblies designed to resist the passage of smoke, toxic gases, and flames for a specified period (typically FD30 or FD60), safeguarding protected escape corridors and stairwells.',
    whoIsResponsible: 'The Responsible Person under the Regulatory Reform (Fire Safety) Order 2005 (in residential buildings over 11m, specific quarterly/annual checks fall under the Fire Safety (England) Regulations 2022).',
    whatNeedsToHappen: [
      'Inspect perimeter gaps: clearance between door leaf and frame should be consistent (typically 3mm to 4mm) and threshold undercut ≤8mm (≤3mm for smoke control without drop seal).',
      'Verify intumescent strips and cold smoke seals are undamaged and continuous along frame or leaf edges.',
      'Check self-closing devices shut the leaf completely into the rebate without binding, overcoming latch resistance from any angle.',
      'Ensure vision panels retain certified fire-rated glazing and glazing beads are secure without missing screws.',
      'Verify hinges (minimum 3 CE/UKCA marked grade 13 fire-rated hinges) have no missing screws and no signs of metal wear or leakage.',
    ],
    howOften: 'Commercial: Routine 6-monthly inspections recommended by BS 9999 / BS 8214. Residential (>11m): Quarterly communal fire doors, annual flat entrance doors per Fire Safety (England) Regs 2022.',
    frequencySource: 'BS 8214:2016, BS 9999:2017 & Fire Safety (England) Regulations 2022 Regulation 10.',
    evidenceRequired: [
      'Comprehensive fire door inspection asset register with individual door ID numbers',
      'Per-door defect inspection worksheets recording gaps, seals, closer operation, and hardware condition',
      'Remedial works closeout certificate from a competent/FIRAS-certified installer',
      'Third-party fire door assembly test certificates (certifire data sheets)',
    ],
    implicationsIfMissed: 'Failure to maintain fire doors can lead to rapid compartmentation failure during a fire. Fire and Rescue Authorities can issue Article 30 Enforcement Notices or Article 31 Prohibition Notices closing premises.',
    officialSources: [
      {
        title: 'Fire Safety (England) Regulations 2022: Fire Door Guidance',
        issuingBody: 'Home Office',
        url: 'https://www.gov.uk/government/publications/fire-safety-england-regulations-2022',
        lastUpdated: 'May 2024',
      },
      {
        title: 'BS 8214:2016 Timber-based fire door assemblies. Code of practice',
        issuingBody: 'British Standards Institution (BSI)',
        url: 'https://knowledge.bsigroup.com',
        lastUpdated: 'December 2016',
      },
    ],
    entireFmGuidance: 'EntireFM recommends fitting all high-traffic communal fire doors with mechanical push-plates and certified magnetic hold-open devices linked directly to the fire alarm system, eliminating wedging and closer arm damage.',
    relatedKnowSlug: 'building-safety-act-what-fm-teams-need-to-know-now',
    relatedDoToolUrl: '/contractor-resources/fire-door-inspection-checklist',
    relatedDoToolName: 'Fire Door Inspection Checklist',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
  {
    slug: 'legionella-water-hygiene',
    title: 'Legionella Control & Water Hygiene',
    category: 'Water Hygiene',
    categorySlug: 'water',
    statusContext: 'Legal Statutory Duty',
    whatIsIt: 'Legionella bacteria colonise domestic and industrial water systems at temperatures between 20°C and 45°C. Inhalation of contaminated water aerosol droplets causes Legionnaires’ disease, a potentially fatal pneumonia.',
    whoIsResponsible: 'The Statutory Duty Holder (employer or person in control of premises) and their formally designated Nominated Responsible Person for Water Hygiene.',
    whatNeedsToHappen: [
      'Maintain hot water storage at 60°C minimum and distribution at 50°C minimum (55°C in healthcare) at sentinel taps within 1 minute of running.',
      'Maintain cold water distribution below 20°C at sentinel taps within 2 minutes of running.',
      'Inspect cold water storage tanks annually for sediment, ingress, microbial slime, and pest mesh integrity.',
      'Descale, clean, and disinfect showerheads and hoses quarterly or as indicated by inspection.',
      'Flush little-used water outlets weekly (e.g. unoccupied tenant suites, disabled WC taps, emergency showers).',
      'Test thermostatic mixing valves (TMVs) annually for failsafe shut-off operation to prevent scalding.',
    ],
    howOften: 'Monthly sentinel temperature checks · Quarterly shower descaling · 6-Monthly calorifier blowdown · Annual tank inspection · Review Legionella Risk Assessment at least biennially or after significant system modification.',
    frequencySource: 'HSE Approved Code of Practice L8 (4th edition) & HSG274 Part 2.',
    evidenceRequired: [
      'Written Legionella Risk Assessment (LRA) by a competent assessor (e.g. LCA registered)',
      'Water Hygiene Logbook containing signed monthly sentinel temperature records',
      'Cold water storage tank inspection and disinfection certificates',
      'Microbiological test certificates (TVC, Legionella spp) where sampling is required (e.g. cooling towers, high-risk healthcare)',
      'Written scheme of control detailing roles, system schematic, and remedial procedures',
    ],
    implicationsIfMissed: 'Failure to manage Legionella risk violates Section 2, 3, or 4 of the Health and Safety at Work etc. Act 1974. HSE prosecutes corporate dutyholders following outbreaks with substantial criminal fines regardless of whether fatalities occurred.',
    officialSources: [
      {
        title: 'HSE ACOP L8: Legionnaires disease. The control of legionella bacteria in water systems',
        issuingBody: 'Health and Safety Executive (HSE)',
        url: 'https://www.hse.gov.uk/legionnaires/index.htm',
        lastUpdated: '2024',
      },
      {
        title: 'HSG274 Part 2: The control of legionella bacteria in hot and cold water systems',
        issuingBody: 'Health and Safety Executive (HSE)',
        url: 'https://www.hse.gov.uk/pubns/books/hsg274.htm',
        lastUpdated: '2024',
      },
    ],
    entireFmGuidance: 'EntireFM recommends installing wireless LoRaWAN pipe temperature sensors on sentinel incoming mains and return loops. Continuous 15-minute telemetry eliminates manual logging labour and flags hot/cold crossover heating immediately.',
    relatedKnowSlug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
    relatedDoToolUrl: '/tools/compliance-checker',
    relatedDoToolName: 'Statutory Compliance Checker',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
  {
    slug: 'eicr-electrical-inspection',
    title: 'Electrical Installation Condition Report (EICR)',
    category: 'Electrical Systems',
    categorySlug: 'electrical',
    statusContext: 'Legal Statutory Duty',
    whatIsIt: 'An in-depth inspection and testing of the fixed electrical wiring, switchgear, distribution boards, earthing, bonding, and circuit protection devices within a building to verify safety against electrical shock and fire.',
    whoIsResponsible: 'The Duty Holder under Regulation 4(2) of the Electricity at Work Regulations 1989 (Employers, Building Owners, Managing Agents).',
    whatNeedsToHappen: [
      'Engage a qualified competent electrical testing engineer (e.g. NICEIC, ECA, NAPIT approved).',
      'Conduct 100% visual inspection and representative instrument testing (insulation resistance, earth fault loop impedance, RCD disconnection times).',
      'Verify distribution board schedules and circuit labeling match physical distribution.',
      'Remediate all Code C1 (Danger Present - immediate risk) and Code C2 (Potentially Dangerous) defects promptly.',
      'Obtain an Overall Condition Assessment of "SATISFACTORY". An "UNSATISFACTORY" report indicates non-compliance until remediated.',
    ],
    howOften: 'Maximum 5 years for commercial offices, retail, and public buildings; maximum 3 years for industrial facilities. Frequencies may be shortened by competent engineer recommendation.',
    frequencySource: 'BS 7671:2018+A3:2024 (IET Wiring Regulations) & Guidance Note 3 (Inspection & Testing).',
    evidenceRequired: [
      'Full Electrical Installation Condition Report (EICR) with schedule of inspections and test results',
      'Electrical Installation Certificates (EICs) or Minor Electrical Installation Works Certificates (MEIWCs) for remedial repairs',
      'Up-to-date single-line electrical distribution schematic diagram',
    ],
    implicationsIfMissed: 'Operating electrical systems with unaddressed C1/C2 defects breaches Regulation 4 of EAWR 1989. In the event of an electrical fire, building insurers may refuse indemnification if statutory periodic testing is unevidenced.',
    officialSources: [
      {
        title: 'Electricity at Work Regulations 1989: Guidance on Regulations (HSR25)',
        issuingBody: 'Health and Safety Executive (HSE)',
        url: 'https://www.hse.gov.uk/pubns/books/hsr25.htm',
        lastUpdated: '2024',
      },
      {
        title: 'IET Wiring Regulations BS 7671:2018+A3:2024',
        issuingBody: 'The Institution of Engineering and Technology (IET) & BSI',
        url: 'https://electrical.theiet.org/bs-7671/',
        lastUpdated: 'July 2024',
      },
    ],
    entireFmGuidance: 'EntireFM recommends conducting infrared thermal imaging surveys of main switchboards annually under normal operational electrical load. Thermography detects loose connections and phase imbalances before they escalate to catastrophic arcing.',
    relatedDoToolUrl: '/tools/compliance-checker',
    relatedDoToolName: 'Statutory Compliance Checker',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
  {
    slug: 'emergency-lighting-testing',
    title: 'Emergency Lighting Inspection & Discharge Testing',
    category: 'Fire & Life Safety',
    categorySlug: 'fire',
    statusContext: 'British Standard / ACOP',
    whatIsIt: 'Emergency escape lighting automatically illuminates building exit routes and designated safety equipment in the event of a primary mains power failure.',
    whoIsResponsible: 'The Responsible Person under the Regulatory Reform (Fire Safety) Order 2005.',
    whatNeedsToHappen: [
      'Monthly short-duration function test ("flick test"): simulate mains failure and verify each luminaire illuminates.',
      'Annual full-duration discharge test: switch off mains supply and confirm all luminaires remain illuminated for their full rated duration (typically 3 hours).',
      'Clean optical diffusers and check that directional escape sign arrows point along valid escape routes.',
      'Promptly replace any battery pack or luminaire failing to achieve the rated duration.',
    ],
    howOften: 'Monthly brief functional test · Annual full 3-hour rated duration test.',
    frequencySource: 'BS 5266-1:2016 Emergency lighting. Code of practice for the emergency lighting of premises & BS EN 50172.',
    evidenceRequired: [
      'Emergency lighting logbook recording dates, tester name, test duration, and luminaire identification',
      'Annual 3-hour full-duration discharge test certificate signed by a competent engineer',
      'Asset register of all emergency fittings and central battery units where applicable',
    ],
    implicationsIfMissed: 'Discharge battery failure during a mains outage can leave occupants in pitch darkness during an evacuation. Fire authorities regularly cite incomplete emergency lighting logs as grounds for Enforcement Notices.',
    officialSources: [
      {
        title: 'BS 5266-1:2016 Emergency lighting. Code of practice',
        issuingBody: 'British Standards Institution (BSI)',
        url: 'https://knowledge.bsigroup.com',
        lastUpdated: '2016',
      },
    ],
    entireFmGuidance: 'EntireFM recommends transitioning to DALI-compatible self-testing emergency luminaires during refurbishment. Automated addressable self-test systems record monthly and annual discharge results directly to a digital log, preventing human error.',
    relatedDoToolUrl: '/contractor-resources/eicr-visual-checklist',
    relatedDoToolName: 'Visual Electrical Checklist',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
  {
    slug: 'loler-passenger-lifts',
    title: 'Lifting Equipment & Passenger Lifts (LOLER)',
    category: 'Lifting & Access',
    categorySlug: 'lifting',
    statusContext: 'Legal Statutory Duty',
    whatIsIt: 'Statutory independent engineering examination of passenger lifts, goods lifts, hoists, window cleaning cradles, and lifting accessories to verify mechanical integrity and prevent collapse or entrapment.',
    whoIsResponsible: 'The Lift Owner, Employer, or Managing Agent with control over the lifting equipment.',
    whatNeedsToHappen: [
      'Arrange an independent Thorough Examination by a competent person (typically an engineering insurance surveyor) independent from the routine maintenance contractor.',
      'Ensure the routine maintenance provider rectifies any Category A defects (posing immediate danger) before the lift is returned to service.',
      'Rectify Category B defects within the time limit specified in the surveyor’s report.',
      'Maintain an emergency passenger entrapment release protocol with 24/7 response capability.',
    ],
    howOften: 'Thorough Examination every 6 months for passenger carrying equipment (or per an agreed Written Scheme); every 12 months for goods-only lifting equipment.',
    frequencySource: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER) Regulation 9.',
    evidenceRequired: [
      'Thorough Examination Reports issued by an independent engineering surveyor',
      'Maintenance service logbooks showing routine lubrication, rope checks, and brake adjustments',
      'Safety gear, overspeed governor, and buffer test certificates',
    ],
    implicationsIfMissed: 'The competent person is legally mandated under LOLER Regulation 10 to send a copy of any report identifying immediate danger (Category A) directly to the HSE if defects are not rectified.',
    officialSources: [
      {
        title: 'LOLER 1998: Safe use of lifting equipment. Approved Code of Practice (L113)',
        issuingBody: 'Health and Safety Executive (HSE)',
        url: 'https://www.hse.gov.uk/pubns/books/l113.htm',
        lastUpdated: '2024',
      },
    ],
    entireFmGuidance: 'EntireFM emphasizes that a lift maintenance contract does NOT constitute a statutory Thorough Examination. Always ensure independent insurer engineering surveyors conduct the LOLER examination separately from your servicing contractor.',
    relatedDoToolUrl: '/tools/compliance-checker',
    relatedDoToolName: 'Statutory Compliance Checker',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
  {
    slug: 'fgas-refrigerant-compliance',
    title: 'F-Gas Refrigerant Containment & Leak Testing',
    category: 'HVAC, Chillers & Refrigerants',
    categorySlug: 'hvac',
    statusContext: 'Legal Statutory Duty',
    whatIsIt: 'Statutory containment rules regulating fluorinated greenhouse gases (HFCs, HFOs) used in commercial chillers, VRF/VRV air conditioning systems, and heat pumps to curb atmospheric global warming emissions.',
    whoIsResponsible: 'The System Operator (the entity exercising actual operational control over the cooling/heating equipment).',
    whatNeedsToHappen: [
      'Calculate the Global Warming Potential (GWP) and carbon dioxide equivalent (t CO2e) charge for each stationary refrigeration/air conditioning system.',
      'Conduct mandatory leak checks by certified personnel (F-Gas Category 1 certified technicians).',
      'Repair any detected leaks within 14 days and conduct a follow-up verification test within 1 month.',
      'Maintain an on-site or digital F-Gas register logging refrigerant added, recovered, and decommissioned.',
    ],
    howOften: 'Systems ≥5 t CO2e: at least every 12 months (24 months if fitted with automatic leak detection). ≥50 t CO2e: every 6 months. ≥500 t CO2e: every 3 months.',
    frequencySource: 'Fluorinated Greenhouse Gases Regulations 2015 & Regulation (EU) 2024/573.',
    evidenceRequired: [
      'Comprehensive F-Gas system asset register with charge weight (kg) and t CO2e calculations',
      'Leak test inspection records signed by Refcom / F-Gas certified engineers',
      'Waste transfer/recovery consignment notes for recovered refrigerant gases',
    ],
    implicationsIfMissed: 'The Environment Agency (EA) issues Civil Sanction Enforcement Notices and variable monetary penalties for failure to maintain F-Gas records or failure to repair leaks within 14 days.',
    officialSources: [
      {
        title: 'F-Gas in refrigeration, air conditioning and heat pump systems: UK guidance',
        issuingBody: 'Department for Environment, Food & Rural Affairs (DEFRA) and Environment Agency',
        url: 'https://www.gov.uk/guidance/f-gas-in-refrigeration-air-conditioning-and-heat-pumps',
        lastUpdated: 'April 2024',
      },
    ],
    entireFmGuidance: 'EntireFM notes that under the latest refrigerant phase-down schedules, legacy high-GWP refrigerants (R404A, R410A) face supply constraints and sharp price escalation. Factor R32 or ultra-low GWP R290/R1234ze retrofit planning into your 5-year capital replacement plan.',
    relatedDoToolUrl: '/contractor-resources/fgas-inspection-checklist',
    relatedDoToolName: 'F-Gas Inspection Checklist',
    relatedFindCategory: 'CONTRACTORS',
    lastReviewedDate: 'August 2026',
  },
];

// ── 03. "HOW OFTEN?" FREQUENCIES LIBRARY ──────────────────────────
export const INSPECTION_FREQUENCIES_LIBRARY: FrequencyRecord[] = [
  {
    id: 'freq-01',
    system: 'Fire Detection & Alarm System',
    activity: 'Manual call-point testing & sounder verification',
    frequency: 'Weekly',
    sourceStandard: 'BS 5839-1:2017 Clause 44.2',
    dutyHolder: 'Responsible Person / Building Operator',
    notes: 'Rotate through different call points weekly so all zones are tested over a 13-week cycle.',
  },
  {
    id: 'freq-02',
    system: 'Fire Detection & Alarm System',
    activity: 'Competent engineer maintenance inspection & battery discharge check',
    frequency: '6-Monthly',
    sourceStandard: 'BS 5839-1:2017 Clause 45.3',
    dutyHolder: 'Responsible Person (via competent specialist contractor)',
    notes: 'Includes sensor head sensitivity checks, sound pressure dB measurements, and standby battery load tests.',
  },
  {
    id: 'freq-03',
    system: 'Emergency Escape Lighting',
    activity: 'Short duration functional test ("flick test")',
    frequency: 'Monthly',
    sourceStandard: 'BS 5266-1:2016 Clause 12.4.2',
    dutyHolder: 'Responsible Person / Nominated Competent Person',
    notes: 'Switch on test switch briefly to verify every lamp illuminates; log in the emergency lighting register.',
  },
  {
    id: 'freq-04',
    system: 'Emergency Escape Lighting',
    activity: 'Full-duration discharge test (typically 3 hours)',
    frequency: 'Annual',
    sourceStandard: 'BS 5266-1:2016 Clause 12.4.3',
    dutyHolder: 'Responsible Person (via competent electrical contractor)',
    notes: 'Ensure sufficient charging time before building re-occupancy so escape lighting is not left depleted during occupancy.',
  },
  {
    id: 'freq-05',
    system: 'Fixed Electrical Installation',
    activity: 'Electrical Installation Condition Report (EICR)',
    frequency: 'Max 5 Years (Commercial) / Max 3 Years (Industrial)',
    sourceStandard: 'BS 7671:2018+A3:2024 / IET GN3',
    dutyHolder: 'Duty Holder under EAWR 1989',
    notes: 'Frequency may be shortened based on environmental harshness, damp, dust, or competent inspector judgment.',
  },
  {
    id: 'freq-06',
    system: 'Water Hygiene / Legionella',
    activity: 'Sentinel tap temperature monitoring (hot >50°C, cold <20°C)',
    frequency: 'Monthly',
    sourceStandard: 'HSE ACOP L8 & HSG274 Part 2 Table 2.1',
    dutyHolder: 'Nominated Responsible Person (Water Hygiene)',
    notes: 'Cold outlet measured after 2 minutes; hot outlet measured after 1 minute; log temperatures in water register.',
  },
  {
    id: 'freq-07',
    system: 'Water Hygiene / Legionella',
    activity: 'Cold water storage tank visual inspection and temperature check',
    frequency: 'Annual',
    sourceStandard: 'HSE HSG274 Part 2 Table 2.1',
    dutyHolder: 'Competent Water Hygiene Specialist',
    notes: 'Inspect for thermal stratification, sediment accumulation, rodent mesh integrity, and tight-fitting lid.',
  },
  {
    id: 'freq-08',
    system: 'Passenger Carrying Lifts',
    activity: 'Statutory Thorough Examination under LOLER',
    frequency: 'Every 6 Months',
    sourceStandard: 'LOLER 1998 Regulation 9(3)(a)(i)',
    dutyHolder: 'Lift Owner / Premises Duty Holder',
    notes: 'Must be performed by an independent competent person (e.g. engineering insurance surveyor).',
  },
  {
    id: 'freq-09',
    system: 'Goods Only Hoists & Lifting Equipment',
    activity: 'Statutory Thorough Examination under LOLER',
    frequency: 'Every 12 Months',
    sourceStandard: 'LOLER 1998 Regulation 9(3)(a)(ii)',
    dutyHolder: 'Premises Duty Holder',
    notes: 'Applies to equipment not intended for passenger conveyance, pallet hoists, and lifting accessories.',
  },
  {
    id: 'freq-10',
    system: 'Commercial Gas Appliances & Pipework',
    activity: 'Gas safety inspection, flue analysis & soundness testing',
    frequency: 'Annual',
    sourceStandard: 'Gas Safety (Installation and Use) Regs 1998 Reg 35',
    dutyHolder: 'Landlord / Building Operator',
    notes: 'Must be executed by a Gas Safe registered commercial engineer with relevant non-domestic modules.',
  },
  {
    id: 'freq-11',
    system: 'Pressure Systems & Air Receivers',
    activity: 'Examination in accordance with a Written Scheme of Examination (WSE)',
    frequency: 'Specified in WSE (typically 12–24 months)',
    sourceStandard: 'Pressure Systems Safety Regulations 2000 (PSSR) Reg 8',
    dutyHolder: 'Pressure System User / Owner',
    notes: 'A certified competent person must draft and sign the Written Scheme before operation.',
  },
  {
    id: 'freq-12',
    system: 'Asbestos-Containing Materials (ACMs)',
    activity: 'Condition re-inspection survey of identified or presumed ACMs',
    frequency: 'Annual',
    sourceStandard: 'Control of Asbestos Regulations 2012 Regulation 4',
    dutyHolder: 'Statutory Dutyholder',
    notes: 'Update the Asbestos Register with surface condition, sealing integrity, and risk score adjustments.',
  },
  {
    id: 'freq-13',
    system: 'Air Conditioning Systems (>12kW)',
    activity: 'Energy efficiency inspection and TM44 lodgement',
    frequency: 'Every 5 Years',
    sourceStandard: 'Energy Performance of Buildings (England & Wales) Regs Reg 18',
    dutyHolder: 'Building Controller / System Operator',
    notes: 'Must be lodged on the central landmark register by an accredited Air Conditioning Energy Assessor.',
  },
  {
    id: 'freq-14',
    system: 'Fall Arrest & Mansafe Roof Systems',
    activity: 'Structural anchor proof testing and cable re-certification',
    frequency: 'Annual',
    sourceStandard: 'BS EN 795 / BS 7883 / Work at Height Regs 2005',
    dutyHolder: 'Premises Duty Holder',
    notes: 'Inspect swages, shock absorbers, tension, and chemical anchors before permitting roof access.',
  },
];

// ── 04. "WHAT EVIDENCE SHOULD I HOLD?" EVIDENCE REGISTER ─────────
export const EVIDENCE_REGISTER: EvidenceRecord[] = [
  {
    system: 'Fire Safety & Life Safety',
    evidenceType: 'Fire Risk Assessment (FRA)',
    retentionPeriod: 'Life of building (current edition plus previous revisions)',
    description: 'A comprehensive written evaluation of fire hazards, means of escape, compartmentation, and occupant vulnerability. Must record significant findings.',
    statutoryBasis: 'Regulatory Reform (Fire Safety) Order 2005 Article 9',
  },
  {
    system: 'Fire Safety & Life Safety',
    evidenceType: 'Fire Alarm & Detection Logbook',
    retentionPeriod: 'Minimum 3 years',
    description: 'Physical or digital log recording weekly call point activations, false alarm causes, quarterly engineering visits, and sensor cleaning.',
    statutoryBasis: 'BS 5839-1:2017 Clause 48',
  },
  {
    system: 'Electrical Installations',
    evidenceType: 'Electrical Installation Condition Report (EICR)',
    retentionPeriod: 'Until superseded by next full periodic report',
    description: 'Form BS 7671 condition report detailing circuit schedules, test instrument calibrations, and classification of any defects (C1, C2, C3, FI).',
    statutoryBasis: 'Electricity at Work Regulations 1989 Regulation 4(2)',
  },
  {
    system: 'Water Hygiene',
    evidenceType: 'Water Hygiene Logbook & Sentinel Records',
    retentionPeriod: 'Minimum 5 years',
    description: 'Monthly hot and cold temperature records, remedial water action closeouts, showerhead descaling sheets, and microbial test lab certificates.',
    statutoryBasis: 'HSE ACOP L8 Paragraph 65',
  },
  {
    system: 'Lifting Operations',
    evidenceType: 'LOLER Thorough Examination Certificate',
    retentionPeriod: 'Minimum 2 years (or until equipment permanently decommissioned)',
    description: 'Official inspection certificate from independent competent examiner detailing SWL, safe operation declaration, and category A/B defects.',
    statutoryBasis: 'Lifting Operations and Lifting Equipment Regulations 1998 Reg 11',
  },
  {
    system: 'Refrigerant & HVAC',
    evidenceType: 'F-Gas Leak Check Records & System Log',
    retentionPeriod: 'Minimum 5 years',
    description: 'Log documenting refrigerant type, baseline charge (kg and t CO2e), recovered quantities, leak check dates, and technician certification details.',
    statutoryBasis: 'Fluorinated Greenhouse Gases Regulations 2015 Regulation 6',
  },
  {
    system: 'Asbestos Management',
    evidenceType: 'Asbestos Register & Management Plan (AMP)',
    retentionPeriod: 'Permanently (transferable upon freehold/leasehold disposal)',
    description: 'Plan recording exact location, extent, and condition of all known or presumed ACMs, with priority scoring and re-inspection audit logs.',
    statutoryBasis: 'Control of Asbestos Regulations 2012 Regulation 4',
  },
  {
    system: 'Pressure Systems',
    evidenceType: 'Written Scheme of Examination (WSE)',
    retentionPeriod: 'Lifetime of the pressure vessel',
    description: 'Certified scheme drafted by a competent person defining inspection intervals and test methods for pressure vessels operating above 0.5 bar.',
    statutoryBasis: 'Pressure Systems Safety Regulations 2000 Regulation 8',
  },
];

// ── 05. CURATED LEGISLATION & GUIDANCE DIRECTORY ─────────────────
export const LEGISLATION_DIRECTORY: LegislationItem[] = [
  {
    id: 'leg-01',
    title: 'Health and Safety at Work etc. Act 1974',
    issuingBody: 'UK Parliament / HSE',
    inForceYear: '1974',
    status: 'In Force',
    topic: 'General Health & Safety',
    summary: 'The primary piece of legislation covering occupational health and safety in Great Britain. Imposes general duties on employers, building owners, and landlords to ensure the safety of employees and visitors.',
    officialUrl: 'https://www.legislation.gov.uk/ukpga/1974/37/contents',
  },
  {
    id: 'leg-02',
    title: 'Regulatory Reform (Fire Safety) Order 2005 (RRO)',
    issuingBody: 'Home Office / Parliament',
    inForceYear: '2005',
    status: 'Amended / Expanded',
    topic: 'Fire Safety',
    summary: 'Designates the "Responsible Person" with legal obligations to conduct fire risk assessments, maintain passive/active fire precautions, and formulate emergency evacuation strategies.',
    officialUrl: 'https://www.legislation.gov.uk/uksi/2005/1541/contents/made',
  },
  {
    id: 'leg-03',
    title: 'Building Safety Act 2022',
    issuingBody: 'Ministry of Housing, Communities & Local Government',
    inForceYear: '2022',
    status: 'Staged Implementation',
    topic: 'Building Safety',
    summary: 'Reforms building safety regulations for Higher-Risk Buildings (HRBs ≥18m or ≥7 storeys). Establishes the Building Safety Regulator, Accountable Persons, Golden Thread of information, and mandatory occurrence reporting.',
    officialUrl: 'https://www.legislation.gov.uk/ukpga/2022/30/contents',
  },
  {
    id: 'leg-04',
    title: 'Electricity at Work Regulations 1989',
    issuingBody: 'Health and Safety Executive (HSE)',
    inForceYear: '1989',
    status: 'In Force',
    topic: 'Electrical Systems',
    summary: 'Requires electrical systems to be constructed, maintained, and operated in a manner that prevents electrical danger so far as is reasonably practicable.',
    officialUrl: 'https://www.legislation.gov.uk/uksi/1989/635/contents/made',
  },
  {
    id: 'leg-05',
    title: 'Control of Asbestos Regulations 2012 (Regulation 4)',
    issuingBody: 'Health and Safety Executive (HSE)',
    inForceYear: '2012',
    status: 'In Force',
    topic: 'Asbestos Management',
    summary: 'Regulation 4 places a legal Duty to Manage asbestos in non-domestic premises, requiring dutyholders to identify ACMs, assess condition, maintain an asbestos register, and review the management plan.',
    officialUrl: 'https://www.legislation.gov.uk/uksi/2012/632/contents/made',
  },
  {
    id: 'leg-06',
    title: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER)',
    issuingBody: 'Health and Safety Executive (HSE)',
    inForceYear: '1998',
    status: 'In Force',
    topic: 'Lifting Equipment',
    summary: 'Mandates that lifting equipment for lifting persons undergoes statutory thorough examination by an independent competent person at intervals not exceeding 6 months.',
    officialUrl: 'https://www.legislation.gov.uk/uksi/1998/2307/contents/made',
  },
  {
    id: 'leg-07',
    title: 'Pressure Systems Safety Regulations 2000 (PSSR)',
    issuingBody: 'Health and Safety Executive (HSE)',
    inForceYear: '2000',
    status: 'In Force',
    topic: 'Pressure Systems',
    summary: 'Prevents serious injury from the hazard of stored energy in pressure systems (boilers, air receivers, steam systems). Requires a certified Written Scheme of Examination.',
    officialUrl: 'https://www.legislation.gov.uk/uksi/2000/128/contents/made',
  },
];
