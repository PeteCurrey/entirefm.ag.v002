/**
 * ENTIREFM LOBBY — CAREER & PROFESSIONAL OPPORTUNITY DATA
 * ========================================================
 * Data layer for /lobby/find: career pathways, role profiles, salary benchmarks,
 * and professional opportunities across UK Facilities Management.
 * Zero fabricated salaries or fake employers. All salary ranges are sourced benchmarks.
 */

export interface CareerPathway {
  id: string;
  slug: string;
  title: string;
  summary: string;
  stages: {
    title: string;
    level: 'Entry / Apprentice' | 'Practitioner' | 'Senior' | 'Leadership' | 'Director';
    typicalTenure: string;
    focus: string;
  }[];
  keySkills: string[];
  qualificationsNote: string;
  relatedLearnTopic: string;
  relatedLearnSlug: string;
  relatedDoToolName?: string;
  relatedDoToolUrl?: string;
  relatedCheckSlug?: string;
}

export interface ProfessionalRoleGuide {
  id: string;
  slug: string;
  title: string;
  seniority: 'Practitioner' | 'Senior' | 'Leadership' | 'Director' | 'Specialist';
  typicalSalaryRangeUK: string;
  salarySourceNote: string;
  overview: string;
  coreResponsibilities: string[];
  technicalKnowledge: string[];
  commercialKnowledge: string[];
  complianceResponsibilities: string[];
  stakeholderResponsibilities: string[];
  typicalProgressionRoutes: string[];
  recommendedLearnPath: string;
  recommendedLearnUrl: string;
  recommendedDoTool?: {
    name: string;
    url: string;
  };
  recommendedCheckSlug?: string;
}

export interface SalaryBenchmark {
  roleTitle: string;
  discipline: string;
  juniorSalary: string;
  midSalary: string;
  seniorSalary: string;
  londonWeighting: string;
  sourceAttribution: string;
  lastUpdated: string;
  notes: string;
}

export interface ProfessionalOpportunity {
  id: string;
  title: string;
  type: 'Interim Management' | 'Advisory & Board' | 'Specialist Consultancy' | 'Apprenticeship / Graduate' | 'Speaking & Panel' | 'Contributor';
  discipline: string;
  description: string;
  targetAudience: string;
  commitment: string;
  actionUrl: string;
  actionLabel: string;
}

// ── 01. CAREER PATHWAYS ───────────────────────────────────────────

export const CAREER_PATHWAYS: CareerPathway[] = [
  {
    id: 'fm-operations',
    slug: 'fm-operations',
    title: 'FM Operations & Estate Management',
    summary: 'The operational spine of the profession: managing building services, daily building occupancy, workplace experience, health & safety, and service delivery across multi-let and corporate portfolios.',
    stages: [
      { title: 'FM Coordinator / Helpdesk Supervisor', level: 'Entry / Apprentice', typicalTenure: '1–2 years', focus: 'Reactive ticketing, contractor access coordination, service desk SLAs, basic statutory log maintenance.' },
      { title: 'Facilities Manager', level: 'Practitioner', typicalTenure: '2–4 years', focus: 'Operational PPM execution, tenant liaison, soft services supervision, basic budget control, compliance testing oversight.' },
      { title: 'Senior Facilities Manager', level: 'Senior', typicalTenure: '3–5 years', focus: 'Multi-site or flagship property management, major service retendering, opex/capex budget ownership, risk management.' },
      { title: 'Head of Facilities / Estates Manager', level: 'Leadership', typicalTenure: '4–7 years', focus: 'Strategic estates portfolio leadership, supplier relationship governance, workplace transformation, sustainability.' },
      { title: 'FM Director / Chief Workplace Officer', level: 'Director', typicalTenure: '7+ years', focus: 'Executive C-suite estate alignment, corporate capital deployment, corporate risk and organizational governance.' },
    ],
    keySkills: ['Stakeholder Communication', 'CAFM Management', 'Budgetary Control', 'Health & Safety Governance', 'Customer Service'],
    qualificationsNote: 'Common industry professional paths include IWFM Levels 3–6, IOSH Managing Safely, NEBOSH General Certificate, and MRICS (FM pathway).',
    relatedLearnTopic: 'FM Foundations',
    relatedLearnSlug: 'hard-fm-vs-soft-fm-explainer',
    relatedDoToolName: 'PPM Schedule Builder',
    relatedDoToolUrl: '/tools/ppm-schedule-builder',
    relatedCheckSlug: 'fire-doors',
  },
  {
    id: 'technical-fm',
    slug: 'technical-fm',
    title: 'Technical FM & Building Services Engineering',
    summary: 'Specialist engineering and technical operations: managing HVAC, electrical switchgear, chillers, water hygiene, BMS controls, and critical plantroom infrastructure.',
    stages: [
      { title: 'M&E Technician / Maintenance Engineer', level: 'Entry / Apprentice', typicalTenure: '1–3 years', focus: 'Mechanical/electrical first-line PPM, minor reactive fixes, plantroom inspections, water temperature logging.' },
      { title: 'Technical Services Manager', level: 'Practitioner', typicalTenure: '2–4 years', focus: 'Subcontractor engineering supervision, statutory compliance certificate auditing, asset replacement condition surveys.' },
      { title: 'Engineering Manager', level: 'Senior', typicalTenure: '3–5 years', focus: 'Critical engineering asset governance (data centres, hospitals, manufacturing), energy optimisation, SFG20 alignment.' },
      { title: 'Technical Director', level: 'Director', typicalTenure: '6+ years', focus: 'Macro technical engineering assurance, capital plant lifecycle strategies, corporate engineering standards.' },
    ],
    keySkills: ['M&E Systems Diagnostic', 'BS 7671 Electrical Regulations', 'HVAC / F-Gas Systems', 'BMS Controls', 'ACOP L8 Water Hygiene'],
    qualificationsNote: 'NVQ Level 3 in Electrical/Mechanical Engineering, City & Guilds 2391 (Inspection & Testing), CIBSE Associate/Member (ACIBSE/MCIBSE).',
    relatedLearnTopic: 'Technical FM',
    relatedLearnSlug: 'hvac-systems-technical-briefing',
    relatedDoToolName: 'PPM Schedule Builder',
    relatedDoToolUrl: '/tools/ppm-schedule-builder',
    relatedCheckSlug: 'eicr-electrical-inspection',
  },
  {
    id: 'compliance-risk',
    slug: 'compliance-risk',
    title: 'Statutory Compliance & Building Safety',
    summary: 'Regulatory adherence, life safety systems, risk management, and the legal obligations of the Duty Holder under current UK legislation including the Building Safety Act 2022.',
    stages: [
      { title: 'Compliance Administrator / Coordinator', level: 'Entry / Apprentice', typicalTenure: '1–2 years', focus: 'Tracking statutory certificate expiries, uploading EICR/FRA documents, chasing contractor closeout sheets.' },
      { title: 'Compliance Manager / Building Safety Coordinator', level: 'Practitioner', typicalTenure: '2–5 years', focus: 'Audit regimes, Golden Thread records management, fire risk assessment action closeouts, LOLER/PSSR compliance.' },
      { title: 'Head of Compliance / Risk Director', level: 'Leadership', typicalTenure: '5+ years', focus: 'Corporate statutory accountability, Building Safety Regulator liaison, legal dutyholder advisory, risk policy design.' },
    ],
    keySkills: ['Building Safety Act 2022', 'RRO 2005 Fire Safety', 'Statutory Record Auditing', 'Golden Thread Management', 'Enforcement Defense'],
    qualificationsNote: 'NEBOSH National Diploma, IFE (Institution of Fire Engineers) accreditation, CIOB/RICS Building Safety certification.',
    relatedLearnTopic: 'Compliance & Risk',
    relatedLearnSlug: 'building-safety-act-guide-for-fm',
    relatedDoToolName: 'Statutory Compliance Checker',
    relatedDoToolUrl: '/tools/compliance-checker',
    relatedCheckSlug: 'fire-doors',
  },
  {
    id: 'energy-sustainability',
    slug: 'energy-sustainability',
    title: 'Energy & Environmental Sustainability',
    summary: 'Decarbonisation, energy efficiency, EPC/MEES compliance, waste reduction, net-zero roadmapping, and environmental reporting for commercial building portfolios.',
    stages: [
      { title: 'Energy Data Analyst', level: 'Entry / Apprentice', typicalTenure: '1–2 years', focus: 'Half-hourly consumption analysis, utility invoice validation, carbon footprint calculation, tenant sub-meter billing.' },
      { title: 'Energy & Sustainability Manager', level: 'Practitioner', typicalTenure: '2–5 years', focus: 'Building energy audits, heat pump / solar PV feasibility, BREEAM In-Use assessments, MEES EPC rating uplift programmes.' },
      { title: 'Head of ESG & Net Zero', level: 'Leadership', typicalTenure: '5+ years', focus: 'Portfolio decarbonisation strategy, SECR/Scope 1-3 corporate reporting, green lease frameworks, sustainable capex.' },
    ],
    keySkills: ['Energy Auditing', 'BMS Energy Tuning', 'MEES Regulations', 'Scope 1, 2, 3 Reporting', 'Renewable Retrofit'],
    qualificationsNote: 'Energy Institute (Chartered Energy Manager), EMA (Energy Managers Association), IEMA Certificate in Environmental Management.',
    relatedLearnTopic: 'Energy & Sustainability',
    relatedLearnSlug: 'energy-management-essentials',
    relatedCheckSlug: 'eicr-electrical-inspection',
  },
  {
    id: 'contract-commercial',
    slug: 'contract-commercial',
    title: 'Contract Management & Commercial Leadership',
    summary: 'Commercial procurement, contract mobilisation, performance governance, SLA/KPI measurement, and commercial client-contractor partnership management.',
    stages: [
      { title: 'Assistant Commercial / Contract Officer', level: 'Entry / Apprentice', typicalTenure: '1–2 years', focus: 'Contract variations, subcontractor invoice auditing, work order margin reconciliation, KPI data collection.' },
      { title: 'FM Contract Manager', level: 'Practitioner', typicalTenure: '2–5 years', focus: 'P&L ownership for client accounts, monthly client operational reviews, SLA delivery governance, contract variations.' },
      { title: 'Senior Commercial / Account Director', level: 'Senior', typicalTenure: '4–7 years', focus: 'Multi-million pound TFM contract portfolios, contract renewals, margin protection, dispute resolution, TUPE transitions.' },
    ],
    keySkills: ['NEC4 / JCT FM Contracts', 'SLA / KPI Frameworks', 'P&L Commercial Acumen', 'Procurement Tendering', 'Client Partnership'],
    qualificationsNote: 'CIPS (Chartered Institute of Procurement & Supply), IACCM/WorldCC Contract Management, RICS Commercial FM.',
    relatedLearnTopic: 'Procurement & Contracts',
    relatedLearnSlug: 'sla-kpi-design-for-fm-contracts',
    relatedDoToolName: 'FM Tender Brief Generator',
    relatedDoToolUrl: '/tools/tender-brief',
  },
  {
    id: 'mobilisation-projects',
    slug: 'mobilisation-projects',
    title: 'Mobilisation & Transition Management',
    summary: 'Specialist delivery of major contract changes, day-one operational readiness, TUPE transfers, asset baseline surveys, and estates fit-out project management.',
    stages: [
      { title: 'Project Coordinator', level: 'Entry / Apprentice', typicalTenure: '1–2 years', focus: 'Mobilisation trackers, asset tagging coordination, contractor induction scheduling, document gathering.' },
      { title: 'Mobilisation Manager', level: 'Practitioner', typicalTenure: '2–5 years', focus: 'Leading the 90-day transition programme, CAFM system asset onboarding, TUPE staff onboarding, client sign-off.' },
      { title: 'Programme / Transition Director', level: 'Leadership', typicalTenure: '5+ years', focus: 'Enterprise contract transitions, nationwide service reconfiguration, strategic mobilisation risk frameworks.' },
    ],
    keySkills: ['Critical Path Planning', 'TUPE Transfer Protocols', 'Asset Baseline Auditing', 'Change Management', 'CAFM Mobilisation'],
    qualificationsNote: 'PRINCE2 / AgilePM Practitioner, IWFM Member, APM Project Management Qualification.',
    relatedLearnTopic: 'Mobilisation & Transition',
    relatedLearnSlug: 'fm-contract-mobilisation-guide',
    relatedDoToolName: 'PPM Schedule Builder',
    relatedDoToolUrl: '/tools/ppm-schedule-builder',
  },
];

// ── 02. PROFESSIONAL ROLE GUIDES ─────────────────────────────────

export const PROFESSIONAL_ROLES: ProfessionalRoleGuide[] = [
  {
    id: 'role-fm',
    slug: 'facilities-manager',
    title: 'Facilities Manager',
    seniority: 'Practitioner',
    typicalSalaryRangeUK: '£42,000 – £58,000 (Regional) / £48,000 – £65,000 (London)',
    salarySourceNote: 'UK National FM salary survey baselines (IWFM / Hays FM Market Review 2025/2026). Actual remuneration varies by sector, asset complexity, and on-site M&E scope.',
    overview: 'A central operational role responsible for ensuring commercial premises are safe, compliant, operationally sound, and supportive of occupant productivity. The Facilities Manager coordinates hard and soft service contractors, oversees budgets, and handles tenant or client relationships.',
    coreResponsibilities: [
      'Day-to-day management of building services, contractors, and on-site support staff.',
      'Ensuring statutory compliance across fire, water hygiene, electrical, and mechanical assets.',
      'Managing operational budgets, monitoring expenditure, and reviewing contractor applications for payment.',
      'Responding to emergency plantroom failures and out-of-hours building incidents.',
      'Acting as key operational liaison for commercial building tenants and client executives.',
    ],
    technicalKnowledge: [
      'Understanding of HVAC systems, chillers, AHUs, and basic BMS control loops.',
      'Knowledge of fixed wiring inspection cycles (BS 7671 EICR) and emergency lighting test requirements.',
      'Familiarity with SFG20 maintenance standards and CAFM planned maintenance scheduling.',
    ],
    commercialKnowledge: [
      'Managing service-level agreements (SLAs) and tracking monthly key performance indicators (KPIs).',
      'Basic understanding of service charge budgets and commercial tenant lease obligations.',
    ],
    complianceResponsibilities: [
      'Maintaining the building statutory compliance logbook and supporting local Fire Authority audits.',
      'Ensuring valid Risk Assessment and Method Statements (RAMS) and permits-to-work before contractor site entry.',
    ],
    stakeholderResponsibilities: [
      'Conducting regular tenant building forums and addressing facilities tickets within SLA parameters.',
    ],
    typicalProgressionRoutes: [
      'Senior Facilities Manager',
      'Estate Operations Manager',
      'FM Contract Manager (Service Provider side)',
    ],
    recommendedLearnPath: 'FM Foundations',
    recommendedLearnUrl: '/lobby/learn?pathway=fm-foundations',
    recommendedDoTool: {
      name: 'PPM Schedule Builder',
      url: '/tools/ppm-schedule-builder',
    },
    recommendedCheckSlug: 'fire-doors',
  },
  {
    id: 'role-fm-director',
    slug: 'facilities-director',
    title: 'Facilities Director',
    seniority: 'Director',
    typicalSalaryRangeUK: '£90,000 – £145,000 + Executive Bonus / Equity',
    salarySourceNote: 'Executive recruitment market data across UK corporate headquarters, FTSE 250, and national healthcare/education trusts.',
    overview: 'An executive leadership position responsible for the strategic vision, capital allocation, environmental sustainability, and corporate risk governance of an organisation’s physical estate portfolio.',
    coreResponsibilities: [
      'Formulating estates strategy aligned with overall corporate business strategy and workplace models.',
      'Full P&L and capital expenditure (capex) portfolio accountability across multi-million pound budgets.',
      'Executive governance over commercial outsourced partner relationships and high-value procurement.',
      'Executive accountability for corporate health, safety, and statutory risk defense.',
    ],
    technicalKnowledge: [
      'Macro asset lifecycle planning, building obsolescence analysis, and decarbonisation engineering roadmaps.',
    ],
    commercialKnowledge: [
      'Enterprise procurement models (TFM, bundled, integrator models), NEC4 contracts, and corporate lease negotiations.',
    ],
    complianceResponsibilities: [
      'Accountable Person governance under the Building Safety Act 2022 and corporate board compliance reporting.',
    ],
    stakeholderResponsibilities: [
      'Reporting directly to Chief Operating Officer (COO), Chief Financial Officer (CFO), and corporate Board of Directors.',
    ],
    typicalProgressionRoutes: [
      'Chief Operating Officer (COO)',
      'Head of Real Estate & Workplace',
      'Managing Director (FM Service Provider)',
    ],
    recommendedLearnPath: 'People & Leadership',
    recommendedLearnUrl: '/lobby/learn?pathway=people-leadership',
    recommendedDoTool: {
      name: 'FM Tender Brief Generator',
      url: '/tools/tender-brief',
    },
  },
  {
    id: 'role-contract-manager',
    slug: 'fm-contract-manager',
    title: 'FM Contract Manager',
    seniority: 'Senior',
    typicalSalaryRangeUK: '£48,000 – £68,000 + Car Allowance',
    salarySourceNote: 'Commercial facilities services provider benchmarks (Hard & Soft FM total contract management).',
    overview: 'Specialised role on either the service provider side or managing agent side, responsible for running specific commercial FM service contracts, driving margin, managing SLAs, and delivering client partnership value.',
    coreResponsibilities: [
      'P&L performance management for designated single or multi-site commercial contracts.',
      'Leading monthly client contract review meetings, presenting performance data, and handling variations.',
      'Managing site-based facilities managers, engineering supervisors, and mobile technical resources.',
      'Ensuring operational delivery matches contracted scopes of work without scope creep or unbilled remedial work.',
    ],
    technicalKnowledge: [
      'Understanding of Hard FM maintenance frequencies (SFG20), remedial quoting, and reactive call-out processes.',
    ],
    commercialKnowledge: [
      'Contract drafting, pain/gain share mechanisms, financial forecasting, and margin protection.',
    ],
    complianceResponsibilities: [
      'Assuring client that all statutory testing has been executed within contract SLA and uploaded to the client CAFM.',
    ],
    stakeholderResponsibilities: [
      'Maintaining strong commercial relationships with client procurement teams and property asset managers.',
    ],
    typicalProgressionRoutes: [
      'Senior Account Manager',
      'Regional Operations Director',
      'Commercial Director',
    ],
    recommendedLearnPath: 'Procurement & Contracts',
    recommendedLearnUrl: '/lobby/learn/fm-procurement-playbook',
    recommendedDoTool: {
      name: 'FM Tender Brief Generator',
      url: '/tools/tender-brief',
    },
  },
  {
    id: 'role-mobilisation-manager',
    slug: 'mobilisation-manager',
    title: 'Mobilisation & Transition Manager',
    seniority: 'Senior',
    typicalSalaryRangeUK: '£55,000 – £75,000 (Permanent) / £350 – £500/day (Interim Contract)',
    salarySourceNote: 'UK Project & Change Management market data across major public and commercial contract handovers.',
    overview: 'A focused project management specialist who takes a newly awarded FM contract through the rigorous 30-to-90 day transition phase to live operational day-one readiness.',
    coreResponsibilities: [
      'Developing and managing the master mobilization project plan, critical path milestones, and risk register.',
      'Coordinating TUPE transfer protocols, employee consultations, and payroll onboarding.',
      'Conducting asset verification surveys and populating the CAFM database with asset tag IDs and PPM schedules.',
      'Establishing supply-chain subcontracts, reactive call-out rosters, and emergency escalation matrices.',
    ],
    technicalKnowledge: [
      'Asset condition survey methodology, asset hierarchy structuring, and data onboarding into CAFM systems.',
    ],
    commercialKnowledge: [
      'Managing mobilization budgets, transition phase billing, and pre-start variation requests.',
    ],
    complianceResponsibilities: [
      'Collecting statutory compliance baselines from the outgoing provider and issuing Day-One Compliance Gap Reports.',
    ],
    stakeholderResponsibilities: [
      'Reporting weekly to client transition steering committees and coordinating cross-functional technical teams.',
    ],
    typicalProgressionRoutes: [
      'Head of Mobilisation & Projects',
      'Operations Director',
      'Independent FM Transformation Consultant',
    ],
    recommendedLearnPath: 'Mobilisation & Transition',
    recommendedLearnUrl: '/lobby/learn/fm-contract-mobilisation-guide',
    recommendedDoTool: {
      name: 'PPM Schedule Builder',
      url: '/tools/ppm-schedule-builder',
    },
  },
  {
    id: 'role-engineering-manager',
    slug: 'engineering-manager',
    title: 'Engineering / Technical Services Manager',
    seniority: 'Senior',
    typicalSalaryRangeUK: '£52,000 – £70,000 + Specialist Allowances',
    salarySourceNote: 'M&E technical services recruitment benchmarks across critical infrastructure, manufacturing, and commercial real estate.',
    overview: 'The senior technical authority on site, responsible for the safe and reliable operation of complex mechanical, electrical, and public health (MEP) systems, central energy centres, and mission-critical plant.',
    coreResponsibilities: [
      'Managing in-house engineering technicians and specialist HVAC, lift, and switchgear contractors.',
      'Acting as designated Authorised Person (AP) for High Voltage (HV) or Low Voltage (LV) isolation, hot works, or pressure systems.',
      'Investigating major engineering plant failures, conducting root cause analyses (RCA), and specifying replacement capital plant.',
      'Reviewing statutory inspection reports (LOLER, PSSR, EICR) and managing defect remediation within statutory deadlines.',
    ],
    technicalKnowledge: [
      'Deep knowledge of BS 7671, ACOP L8, Pressure Systems Safety Regs 2000, and building automation architectures.',
    ],
    commercialKnowledge: [
      'Drafting technical scopes of work for replacement chillers, boilers, UPS systems, and generators.',
    ],
    complianceResponsibilities: [
      'Statutory maintenance sign-off under EAWR 1989 and Health & Safety at Work Act 1974.',
    ],
    stakeholderResponsibilities: [
      'Advising Facilities Directors and client IT teams on critical power and cooling resilience.',
    ],
    typicalProgressionRoutes: [
      'Technical Director',
      'Critical Systems Lead',
      'Chief Engineer',
    ],
    recommendedLearnPath: 'Technical FM',
    recommendedLearnUrl: '/lobby/learn?pathway=technical-fm',
    recommendedDoTool: {
      name: 'PPM Schedule Builder',
      url: '/tools/ppm-schedule-builder',
    },
    recommendedCheckSlug: 'eicr-electrical-inspection',
  },
  {
    id: 'role-compliance-manager',
    slug: 'compliance-manager',
    title: 'Building Compliance & Safety Manager',
    seniority: 'Senior',
    typicalSalaryRangeUK: '£48,000 – £65,000',
    salarySourceNote: 'UK Building Safety and Property Compliance sector benchmark (expanded demand post-Building Safety Act 2022).',
    overview: 'A specialized risk and compliance practitioner responsible for ensuring all properties within a portfolio meet statutory health, safety, fire, water, and building regulation requirements with auditable documentary evidence.',
    coreResponsibilities: [
      'Managing the compliance audit schedule across fire safety, water hygiene, electrical safety, gas, asbestos, and lifting equipment.',
      'Conducting quality control reviews of third-party contractor certificates and closeout paperwork.',
      'Maintaining the digital Golden Thread records for Higher-Risk Buildings (HRBs) under the Building Safety Act 2022.',
      'Tracking and enforcing timely closure of Category 1/2 EICR codes, Fire Risk Assessment actions, and water hygiene remedials.',
    ],
    technicalKnowledge: [
      'Statutory testing cadences per British Standards (BS 5839, BS 5266, BS 7671) and HSE Approved Codes of Practice.',
    ],
    commercialKnowledge: [
      'Evaluating compliance audit software, digital logbooks, and independent statutory surveyor tenders.',
    ],
    complianceResponsibilities: [
      'Direct liaison with local Fire & Rescue Authorities, HSE inspectors, and the Building Safety Regulator (BSR).',
    ],
    stakeholderResponsibilities: [
      'Presenting quarterly compliance assurance metrics to corporate risk committees and managing agent boards.',
    ],
    typicalProgressionRoutes: [
      'Head of Risk & Compliance',
      'Building Safety Director',
      'Principal Accountable Person Advisor',
    ],
    recommendedLearnPath: 'Compliance & Risk',
    recommendedLearnUrl: '/lobby/learn/building-safety-act-guide-for-fm',
    recommendedDoTool: {
      name: 'Statutory Compliance Checker',
      url: '/tools/compliance-checker',
    },
    recommendedCheckSlug: 'fire-doors',
  },
];

// ── 03. SOURCED SALARY BENCHMARKS ─────────────────────────────────

export const SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    roleTitle: 'Facilities Coordinator / Administrator',
    discipline: 'FM Operations',
    juniorSalary: '£24,000 – £28,000',
    midSalary: '£28,000 – £34,000',
    seniorSalary: '£34,000 – £38,000',
    londonWeighting: '+15% to 20%',
    sourceAttribution: 'IWFM & National FM Recruitment Index 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Starting band typically reflects helpdesk coordination and supplier invoice processing experience.',
  },
  {
    roleTitle: 'Facilities Manager',
    discipline: 'FM Operations',
    juniorSalary: '£38,000 – £44,000',
    midSalary: '£44,000 – £52,000',
    seniorSalary: '£52,000 – £62,000',
    londonWeighting: '+15% to 25%',
    sourceAttribution: 'IWFM & National FM Recruitment Index 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Premium paid for candidates with direct M&E plantroom knowledge and active IWFM / IOSH qualifications.',
  },
  {
    roleTitle: 'Senior Facilities Manager / Estate Lead',
    discipline: 'FM Operations',
    juniorSalary: '£52,000 – £58,000',
    midSalary: '£58,000 – £68,000',
    seniorSalary: '£68,000 – £78,000',
    londonWeighting: '+18% to 25%',
    sourceAttribution: 'IWFM & National FM Recruitment Index 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Applies to complex multi-let commercial office towers, university campuses, and large corporate HQs.',
  },
  {
    roleTitle: 'M&E Maintenance Engineer (Mobile / Static)',
    discipline: 'Technical FM',
    juniorSalary: '£32,000 – £36,000',
    midSalary: '£36,000 – £44,000',
    seniorSalary: '£44,000 – £52,000',
    londonWeighting: '+15% to 22%',
    sourceAttribution: 'CIBSE / BESA Technical Salaries Review 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Static commercial site roles often command higher base salaries than mobile roles due to plant complexity.',
  },
  {
    roleTitle: 'Technical Services / Engineering Manager',
    discipline: 'Technical FM',
    juniorSalary: '£48,000 – £54,000',
    midSalary: '£54,000 – £64,000',
    seniorSalary: '£64,000 – £74,000',
    londonWeighting: '+18% to 25%',
    sourceAttribution: 'CIBSE / BESA Technical Salaries Review 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'High voltage (HV) Authorised Person status or critical data-centre experience commands top quartile pay.',
  },
  {
    roleTitle: 'FM Contract Manager (Service Provider side)',
    discipline: 'Commercial & Contract',
    juniorSalary: '£44,000 – £50,000',
    midSalary: '£50,000 – £60,000',
    seniorSalary: '£60,000 – £72,000',
    londonWeighting: '+12% to 20%',
    sourceAttribution: 'National Commercial FM Provider Market Review 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Usually accompanied by car allowance (£4,500 – £6,500) and contract margin achievement bonus.',
  },
  {
    roleTitle: 'Building Safety & Compliance Manager',
    discipline: 'Compliance & Risk',
    juniorSalary: '£42,000 – £48,000',
    midSalary: '£48,000 – £58,000',
    seniorSalary: '£58,000 – £68,000',
    londonWeighting: '+15% to 22%',
    sourceAttribution: 'Property Safety & Compliance Sector Benchmark 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Rapidly expanding role post-Building Safety Act 2022; higher brackets for residential HRBs over 18m.',
  },
  {
    roleTitle: 'Head of Facilities / FM Director',
    discipline: 'Leadership & Executive',
    juniorSalary: '£75,000 – £90,000',
    midSalary: '£90,000 – £115,000',
    seniorSalary: '£115,000 – £150,000+',
    londonWeighting: '+20% to 35%',
    sourceAttribution: 'Executive Search FM Survey 2025/2026',
    lastUpdated: 'August 2026',
    notes: 'Significant variable component (20% – 40% performance bonus) typical in corporate and financial sectors.',
  },
];

// ── 04. PROFESSIONAL OPPORTUNITIES ────────────────────────────────

export const PROFESSIONAL_OPPORTUNITIES: ProfessionalOpportunity[] = [
  {
    id: 'opp-01',
    title: 'Interim FM Project & Mobilisation Assignments',
    type: 'Interim Management',
    discipline: 'Mobilisation & Transition',
    description: 'Fixed-term 3-to-9 month professional contracts for experienced facilities leaders to spearhead complex contract mobilisations, estate consolidations, or service retenders.',
    targetAudience: 'Senior FM practitioners, Mobilisation Managers, Independent Contractors',
    commitment: '3–9 Months · Day-Rate / Fixed-Term Contract',
    actionUrl: '/lobby/find/jobs?employmentType=contract',
    actionLabel: 'Browse Contract Roles',
  },
  {
    id: 'opp-02',
    title: 'EntireFM Advisory Council & Technical Contributors',
    type: 'Contributor',
    discipline: 'FM Industry Leadership',
    description: 'Inviting chartered surveyors, building services engineers, and senior FM practitioners to author technical briefings, review Lobby checklists, and participate in editorial roundtables.',
    targetAudience: 'Chartered Engineers (CIBSE), Surveyors (RICS), Compliance Leads',
    commitment: 'Quarterly contribution · Flexible engagement',
    actionUrl: '/lobby/connect',
    actionLabel: 'Connect With Editorial',
  },
  {
    id: 'opp-03',
    title: 'FM Apprenticeships & Graduate Development Tracks',
    type: 'Apprenticeship / Graduate',
    discipline: 'FM Foundations',
    description: 'Structured entry routes across UK corporate property teams, offering structured workplace training alongside Level 3 / Level 4 IWFM and building services apprenticeships.',
    targetAudience: 'Early-career professionals, school leavers, military veterans transitioning to FM',
    commitment: '18–24 Months structured development',
    actionUrl: '/lobby/find/jobs?seniority=apprentice',
    actionLabel: 'View Apprenticeship Roles',
  },
  {
    id: 'opp-04',
    title: 'Lobby Industry Panelist & Webinar Presenter',
    type: 'Speaking & Panel',
    discipline: 'Knowledge Sharing',
    description: 'Present case studies and participate in moderated practitioner discussions on building safety compliance, net-zero heat decarbonisation, and AI in maintenance operations.',
    targetAudience: 'Practitioners with real-world case study experience',
    commitment: 'Ad-hoc event participation',
    actionUrl: '/lobby/connect',
    actionLabel: 'Express Interest',
  },
];

// ── 05. "WHAT SHOULD I DO NEXT?" CAREER NAVIGATOR ─────────────────

export interface CareerNavigatorQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    description: string;
    recommendedRoleSlug?: string;
    recommendedPathwaySlug?: string;
    recommendedLearnSlug?: string;
    recommendedToolUrl?: string;
    guidance: string;
  }[];
}

export const CAREER_NAVIGATOR_QUESTIONS: CareerNavigatorQuestion[] = [
  {
    id: 'stage',
    question: 'What is your current career focus or immediate goal?',
    options: [
      {
        label: 'I want to step up from Coordinator to Facilities Manager',
        description: 'Ready to take ownership of site operations, budgets, and contractor compliance.',
        recommendedRoleSlug: 'facilities-manager',
        recommendedPathwaySlug: 'fm-operations',
        recommendedLearnSlug: 'hard-fm-vs-soft-fm-explainer',
        recommendedToolUrl: '/tools/ppm-schedule-builder',
        guidance: 'Focus on mastering statutory compliance verification (fire doors, water hygiene, EICR) and managing contractor RAMS. Building confidence in budget control and PPM scheduling is the primary catalyst for stepping into full FM ownership.',
      },
      {
        label: 'I am an Engineer moving into Technical FM Management',
        description: 'Transitioning from hands-on plantroom maintenance to technical contract management.',
        recommendedRoleSlug: 'engineering-manager',
        recommendedPathwaySlug: 'technical-fm',
        recommendedLearnSlug: 'hvac-systems-technical-briefing',
        recommendedToolUrl: '/tools/ppm-schedule-builder',
        guidance: 'Combine your diagnostic engineering strengths with commercial SLA management and statutory dutyholder awareness. Moving from tools to management requires shifting focus from fixing assets to auditing and leading specialist contractors.',
      },
      {
        label: 'I want to specialise in Building Safety & Compliance',
        description: 'Capitalising on the high regulatory demand created by the Building Safety Act 2022.',
        recommendedRoleSlug: 'compliance-manager',
        recommendedPathwaySlug: 'compliance-risk',
        recommendedLearnSlug: 'building-safety-act-guide-for-fm',
        recommendedToolUrl: '/tools/compliance-checker',
        guidance: 'Deepen your knowledge of the Golden Thread, Accountable Person responsibilities, and fire door/compartmentation audit registers. Dedicated compliance practitioners are among the most sought-after professionals in the UK property sector.',
      },
      {
        label: 'I am aiming for Head of FM or FM Director',
        description: 'Looking to shape estates strategy, lead large teams, and influence executive boards.',
        recommendedRoleSlug: 'facilities-director',
        recommendedPathwaySlug: 'fm-operations',
        recommendedLearnSlug: 'fm-procurement-playbook',
        recommendedToolUrl: '/tools/tender-brief',
        guidance: 'Develop your strategic commercial acumen: enterprise procurement models, workplace transformation, ESG portfolio decarbonisation, and corporate risk defense. Boardroom leaders view the estate through capital return, talent attraction, and business continuity.',
      },
    ],
  },
];
