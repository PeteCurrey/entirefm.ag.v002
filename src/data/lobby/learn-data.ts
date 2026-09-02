/**
 * ENTIREFM LOBBY — LEARN DATA
 * ===========================
 * Learning pathways, resource catalogue, FM glossary, scenarios, and task discovery.
 * Zero fabricated experts, case study clients, qualifications, or CPD claims.
 * All content clearly marked as "Professional Development" — not formally accredited CPD.
 */

// ── TYPES ─────────────────────────────────────────────────────────────

export type ContentType =
  | 'Guide'
  | 'Playbook'
  | 'Technical Briefing'
  | 'Checklist'
  | 'Explainer'
  | 'Template'
  | 'Case Study'
  | 'Scenario'
  | 'Glossary'
  | 'Report'
  | 'Tool Guide';

export type ProfessionalLevel =
  | 'Foundation'
  | 'Practitioner'
  | 'Senior'
  | 'Leadership'
  | 'Specialist';

export type PathwayId =
  | 'fm-foundations'
  | 'technical-fm'
  | 'compliance-risk'
  | 'procurement-contracts'
  | 'people-leadership'
  | 'building-estates'
  | 'energy-sustainability'
  | 'digital-fm'
  | 'mobilisation-transition';

export interface LearningPathway {
  id: PathwayId;
  title: string;
  shortTitle: string;
  description: string;
  resourceCount: number;
  level: ProfessionalLevel[];
  accentColor: string;
}

export interface LearningResource {
  slug: string;
  title: string;
  summary: string;
  contentType: ContentType;
  pathway: PathwayId;
  level: ProfessionalLevel;
  readingTimeMinutes: number;
  publishedDate: string;
  lastReviewedDate: string;
  topic: string;
  isFeatured?: boolean;
  relatedToolUrl?: string;
  relatedToolName?: string;
  relatedCheckSlug?: string;
  status: 'PUBLISHED' | 'COMING_SOON';
}

export interface GlossaryTerm {
  id: string;
  term: string;
  abbreviation?: string;
  definition: string;
  topic: string;
  relatedTerms?: string[];
  relatedToolUrl?: string;
  relatedCheckSlug?: string;
  hasLegalSignificance: boolean;
  legalNote?: string;
}

export interface FMScenario {
  id: string;
  title: string;
  situation: string;
  level: ProfessionalLevel;
  topic: string;
  branches: {
    id: string;
    label: string;
    description: string;
    considerations: {
      immediate: string[];
      compliance: string[];
      operational: string[];
      communication: string[];
      documentation: string[];
      lessonsLearned: string[];
    };
    outcome: string;
  }[];
}

export interface TaskDiscoveryItem {
  id: string;
  label: string;
  description: string;
  primaryDestination: {
    label: string;
    url: string;
    section: string;
  };
  secondaryDestination?: {
    label: string;
    url: string;
    section: string;
  };
}

// ── 01. LEARNING PATHWAYS ─────────────────────────────────────────────

export const LEARNING_PATHWAYS: LearningPathway[] = [
  {
    id: 'fm-foundations',
    title: 'FM Foundations',
    shortTitle: 'Foundations',
    description: 'Core principles, terminology, and frameworks for developing FM professionals. Start here if you are new to facilities management or building your baseline knowledge.',
    resourceCount: 8,
    level: ['Foundation', 'Practitioner'],
    accentColor: 'neutral',
  },
  {
    id: 'technical-fm',
    title: 'Technical FM',
    shortTitle: 'Technical',
    description: 'Engineering, building services, M&E systems, and technical operations. Covers HVAC, electrical, water, fire systems, lifts, and building fabric.',
    resourceCount: 12,
    level: ['Practitioner', 'Senior', 'Specialist'],
    accentColor: 'blue',
  },
  {
    id: 'compliance-risk',
    title: 'Compliance & Risk',
    shortTitle: 'Compliance',
    description: 'Regulatory responsibilities, statutory duties, risk management, and compliance assurance frameworks for FM and property professionals.',
    resourceCount: 10,
    level: ['Practitioner', 'Senior', 'Specialist'],
    accentColor: 'amber',
  },
  {
    id: 'procurement-contracts',
    title: 'Procurement & Contracts',
    shortTitle: 'Procurement',
    description: 'FM tendering, procurement strategy, contract management, SLA design, KPI frameworks, and supplier relationships.',
    resourceCount: 9,
    level: ['Practitioner', 'Senior', 'Leadership'],
    accentColor: 'emerald',
  },
  {
    id: 'people-leadership',
    title: 'People & Leadership',
    shortTitle: 'Leadership',
    description: 'FM leadership, stakeholder management, team performance, TUPE, and people management in facilities and property services.',
    resourceCount: 6,
    level: ['Senior', 'Leadership'],
    accentColor: 'purple',
  },
  {
    id: 'building-estates',
    title: 'Building & Estates',
    shortTitle: 'Buildings',
    description: 'Building management, asset lifecycle, estates strategy, space management, condition surveys, and property management fundamentals.',
    resourceCount: 7,
    level: ['Practitioner', 'Senior', 'Leadership'],
    accentColor: 'orange',
  },
  {
    id: 'energy-sustainability',
    title: 'Energy & Sustainability',
    shortTitle: 'Energy',
    description: 'Energy management, carbon reduction, EPC compliance, MEES regulations, net-zero strategy, and environmental performance reporting.',
    resourceCount: 8,
    level: ['Practitioner', 'Senior', 'Leadership'],
    accentColor: 'green',
  },
  {
    id: 'digital-fm',
    title: 'Digital FM',
    shortTitle: 'Digital',
    description: 'CAFM systems, building data, AI applications in FM, automation, IoT integration, and digital transformation for facilities management.',
    resourceCount: 7,
    level: ['Practitioner', 'Senior', 'Leadership'],
    accentColor: 'cyan',
  },
  {
    id: 'mobilisation-transition',
    title: 'Mobilisation & Transition',
    shortTitle: 'Mobilisation',
    description: 'FM contract mobilisation, TUPE transfer, handover protocols, service transition, and operational readiness frameworks.',
    resourceCount: 6,
    level: ['Practitioner', 'Senior'],
    accentColor: 'rose',
  },
];

// ── 02. LEARNING RESOURCES ────────────────────────────────────────────

export const LEARN_RESOURCES: LearningResource[] = [
  {
    slug: 'understanding-planned-preventive-maintenance',
    title: 'Understanding Planned Preventive Maintenance (PPM)',
    summary: 'What PPM means, why it matters operationally and legally, how to structure a PPM strategy, what asset data you need, and what evidence to retain. Includes common mistakes made by FM teams.',
    contentType: 'Guide',
    pathway: 'technical-fm',
    level: 'Practitioner',
    readingTimeMinutes: 12,
    publishedDate: 'July 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Planned Preventive Maintenance',
    isFeatured: true,
    relatedToolUrl: '/tools/ppm-schedule-builder',
    relatedToolName: 'PPM Schedule Builder',
    status: 'PUBLISHED',
  },
  {
    slug: 'fm-contract-mobilisation-guide',
    title: 'FM Contract Mobilisation: A Practical Guide',
    summary: 'The critical 90-day window before a new FM contract goes live. Covers TUPE obligations, asset survey, system configuration, SLA baseline, contractor inductions, and day-one operational readiness.',
    contentType: 'Playbook',
    pathway: 'mobilisation-transition',
    level: 'Senior',
    readingTimeMinutes: 20,
    publishedDate: 'June 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Contract Mobilisation',
    isFeatured: true,
    relatedToolUrl: '/tools/ppm-schedule-builder',
    relatedToolName: 'PPM Schedule Builder',
    status: 'PUBLISHED',
  },
  {
    slug: 'fm-procurement-playbook',
    title: 'FM Procurement Playbook',
    summary: 'A structured guide to procuring FM services: specification writing, tender evaluation, market engagement, pricing models (GMP, cost-plus, fixed-fee), contract award, and mobilisation triggers.',
    contentType: 'Playbook',
    pathway: 'procurement-contracts',
    level: 'Senior',
    readingTimeMinutes: 22,
    publishedDate: 'July 2026',
    lastReviewedDate: 'August 2026',
    topic: 'FM Procurement',
    isFeatured: true,
    relatedToolUrl: '/tools/tender-brief',
    relatedToolName: 'FM Tender Brief Generator',
    status: 'PUBLISHED',
  },
  {
    slug: 'managing-contractors-safely',
    title: 'Managing Contractors Safely in FM',
    summary: 'The Duty Holder\'s guide to contractor management: pre-qualification, permit-to-work systems, induction requirements, RAMS review, hot works, and post-work sign-off. Grounded in CDM 2015 and HSE guidance.',
    contentType: 'Guide',
    pathway: 'compliance-risk',
    level: 'Practitioner',
    readingTimeMinutes: 15,
    publishedDate: 'June 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Contractor Management',
    isFeatured: true,
    relatedCheckSlug: 'fire-doors',
    status: 'PUBLISHED',
  },
  {
    slug: 'hard-fm-vs-soft-fm-explainer',
    title: 'Hard FM vs Soft FM: What is the Difference?',
    summary: 'Clear explanation of the distinction between hard FM (mechanical, electrical, structural) and soft FM (cleaning, security, catering), why it matters for procurement and SLA design.',
    contentType: 'Explainer',
    pathway: 'fm-foundations',
    level: 'Foundation',
    readingTimeMinutes: 5,
    publishedDate: 'May 2026',
    lastReviewedDate: 'August 2026',
    topic: 'FM Fundamentals',
    status: 'PUBLISHED',
  },
  {
    slug: 'what-is-cafm',
    title: 'What is a CAFM System and Do You Need One?',
    summary: 'Explains Computer-Aided Facilities Management systems: what they do, key features to evaluate, implementation considerations, and how they integrate with PPM, reactive, and compliance management.',
    contentType: 'Explainer',
    pathway: 'digital-fm',
    level: 'Practitioner',
    readingTimeMinutes: 8,
    publishedDate: 'June 2026',
    lastReviewedDate: 'August 2026',
    topic: 'CAFM & Technology',
    status: 'PUBLISHED',
  },
  {
    slug: 'energy-management-essentials',
    title: 'Energy Management Essentials for FM Teams',
    summary: 'Practical guide to energy monitoring, half-hourly data analysis, utility procurement, energy targeting, MEES compliance for commercial premises, and EPC obligations under current UK regulations.',
    contentType: 'Guide',
    pathway: 'energy-sustainability',
    level: 'Practitioner',
    readingTimeMinutes: 14,
    publishedDate: 'July 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Energy Management',
    relatedCheckSlug: 'eicr-electrical-inspection',
    status: 'PUBLISHED',
  },
  {
    slug: 'sla-kpi-design-for-fm-contracts',
    title: 'Designing Effective SLAs and KPIs for FM Contracts',
    summary: 'How to build SLA schedules and KPI frameworks that genuinely drive performance rather than generate paperwork. Covers attendance targets, response times, rectification periods, and reporting cadence.',
    contentType: 'Guide',
    pathway: 'procurement-contracts',
    level: 'Senior',
    readingTimeMinutes: 16,
    publishedDate: 'July 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Contract Management',
    relatedToolUrl: '/tools/tender-brief',
    relatedToolName: 'FM Tender Brief Generator',
    status: 'PUBLISHED',
  },
  {
    slug: 'building-safety-act-guide-for-fm',
    title: 'Building Safety Act 2022: What FM Teams Need to Know',
    summary: 'A practical breakdown of the Building Safety Act 2022 for facilities managers: Higher-Risk Buildings, Accountable Person duties, Golden Thread information requirements, and mandatory occurrence reporting.',
    contentType: 'Technical Briefing',
    pathway: 'compliance-risk',
    level: 'Senior',
    readingTimeMinutes: 18,
    publishedDate: 'June 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Building Safety Act',
    relatedCheckSlug: 'fire-doors',
    relatedToolUrl: '/tools/compliance-checker',
    relatedToolName: 'Statutory Compliance Checker',
    status: 'PUBLISHED',
  },
  {
    slug: 'tupe-guide-for-fm-professionals',
    title: 'TUPE in FM: A Guide for Facilities Managers',
    summary: 'The Transfer of Undertakings (Protection of Employment) Regulations 2006 applied to FM contract transitions. Covers service provision changes, information and consultation obligations, due diligence, and employee liability information.',
    contentType: 'Guide',
    pathway: 'mobilisation-transition',
    level: 'Senior',
    readingTimeMinutes: 14,
    publishedDate: 'June 2026',
    lastReviewedDate: 'August 2026',
    topic: 'TUPE & Employment',
    status: 'PUBLISHED',
  },
  {
    slug: 'hvac-systems-technical-briefing',
    title: 'HVAC Systems: A Technical Briefing for FM Professionals',
    summary: 'How commercial HVAC systems work, key component types (AHUs, FCUs, chillers, BMS-controlled VAV), statutory maintenance obligations, and common failure modes to understand before briefing a specialist contractor.',
    contentType: 'Technical Briefing',
    pathway: 'technical-fm',
    level: 'Practitioner',
    readingTimeMinutes: 16,
    publishedDate: 'July 2026',
    lastReviewedDate: 'August 2026',
    topic: 'HVAC & Building Services',
    relatedCheckSlug: 'fgas-refrigerant-compliance',
    status: 'PUBLISHED',
  },
  {
    slug: 'contractor-management-playbook',
    title: 'Contractor Management Playbook',
    summary: 'End-to-end contractor management framework: pre-qualification, approved supplier list management, permit-to-work, live work supervision, performance monitoring, and contract review cycles.',
    contentType: 'Playbook',
    pathway: 'procurement-contracts',
    level: 'Practitioner',
    readingTimeMinutes: 25,
    publishedDate: 'August 2026',
    lastReviewedDate: 'August 2026',
    topic: 'Contractor Management',
    relatedToolUrl: '/tools/compliance-checker',
    relatedToolName: 'Statutory Compliance Checker',
    status: 'COMING_SOON',
  },
];

// ── 03. FM GLOSSARY TERMS ─────────────────────────────────────────────

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'cafm',
    term: 'Computer-Aided Facilities Management',
    abbreviation: 'CAFM',
    definition: 'Software platform used to manage, coordinate, and report on facilities operations — including reactive maintenance, planned preventive maintenance (PPM), asset registers, compliance records, help desk, and reporting. Sometimes referred to as IWMS (Integrated Workplace Management System) in larger enterprise deployments.',
    topic: 'Digital FM',
    relatedTerms: ['PPM', 'Asset Register', 'Helpdesk'],
    relatedToolUrl: '/lobby/learn/what-is-cafm',
    hasLegalSignificance: false,
  },
  {
    id: 'ppm',
    term: 'Planned Preventive Maintenance',
    abbreviation: 'PPM',
    definition: 'Scheduled maintenance activity carried out at predetermined intervals to reduce the likelihood of asset failure, maintain statutory compliance, and extend asset lifecycle. Frequencies are typically aligned with statutory standards (e.g. SFG20, CIBSE, BSI), manufacturer recommendations, or risk assessments.',
    topic: 'Asset Management',
    relatedTerms: ['Reactive Maintenance', 'Asset Register', 'SFG20'],
    relatedToolUrl: '/tools/ppm-schedule-builder',
    hasLegalSignificance: true,
    legalNote: 'Certain PPM activities (fire alarm testing, LOLER examinations, water hygiene monitoring) are statutory obligations with prescribed frequencies. Failure to perform them on time can constitute a criminal breach of duty.',
  },
  {
    id: 'sla',
    term: 'Service Level Agreement',
    abbreviation: 'SLA',
    definition: 'A contractual commitment between a service provider and client specifying defined performance targets — such as attendance times, rectification periods, system availability, and quality standards. SLAs typically distinguish between Emergency, Urgent, Routine, and Planned response categories.',
    topic: 'Contract Management',
    relatedTerms: ['KPI', 'Contract Management'],
    relatedToolUrl: '/tools/tender-brief',
    hasLegalSignificance: false,
  },
  {
    id: 'kpi',
    term: 'Key Performance Indicator',
    abbreviation: 'KPI',
    definition: 'A measurable value that indicates how effectively an FM contractor or service is meeting defined operational or contractual objectives. Common FM KPIs include first-time fix rate, SLA compliance percentage, PPM completion rate, reactive job closure time, and customer satisfaction scores.',
    topic: 'Contract Management',
    relatedTerms: ['SLA', 'Performance Management'],
    hasLegalSignificance: false,
  },
  {
    id: 'rams',
    term: 'Risk Assessment and Method Statement',
    abbreviation: 'RAMS',
    definition: 'A combined document required before contractors undertake non-routine or higher-risk work. The Risk Assessment identifies hazards and control measures; the Method Statement details the sequence of work, tools, and safety measures. RAMS must be reviewed by the Permit Issuer / Duty Holder before work commences.',
    topic: 'Health & Safety',
    relatedTerms: ['Permit to Work', 'CDM'],
    hasLegalSignificance: true,
    legalNote: 'Requirement to provide suitable and sufficient risk assessments derives from Regulation 3 of the Management of Health and Safety at Work Regulations 1999.',
  },
  {
    id: 'hard-fm',
    term: 'Hard FM',
    abbreviation: 'Hard FM',
    definition: 'The physical, technical, and engineering elements of facilities management — including mechanical and electrical systems (M&E), building fabric, HVAC, fire systems, lifts, water systems, and structural components. Hard FM services are typically delivered by specialist engineering contractors.',
    topic: 'FM Fundamentals',
    relatedTerms: ['Soft FM', 'M&E', 'PPM'],
    hasLegalSignificance: false,
  },
  {
    id: 'soft-fm',
    term: 'Soft FM',
    abbreviation: 'Soft FM',
    definition: 'Non-technical, people-centred facilities services — including cleaning, security, catering, reception/front-of-house, waste management, post room, landscaping, and office services. Soft FM services support the human experience within a building rather than the physical systems.',
    topic: 'FM Fundamentals',
    relatedTerms: ['Hard FM', 'TFM'],
    hasLegalSignificance: false,
  },
  {
    id: 'tupe',
    term: 'Transfer of Undertakings (Protection of Employment)',
    abbreviation: 'TUPE',
    definition: 'UK employment legislation (TUPE Regulations 2006) protecting employees whose employment transfers due to a business transfer or a service provision change. In FM, TUPE commonly applies when a contract is re-tendered or insourced/outsourced. Requires formal measures and consultation with affected employees.',
    topic: 'Employment & HR',
    relatedTerms: ['Mobilisation', 'TUPE Due Diligence', 'ELI'],
    hasLegalSignificance: true,
    legalNote: 'TUPE applies by operation of law. Failure to comply with information and consultation obligations can result in Employment Tribunal awards. Always obtain specialist HR/legal advice on individual TUPE situations.',
  },
  {
    id: 'responsible-person',
    term: 'Responsible Person',
    definition: 'The individual or organisation designated under the Regulatory Reform (Fire Safety) Order 2005 (RRO) with legal responsibility for fire safety in non-domestic premises. This is the employer in a workplace, or the building owner/managing agent where there is no employer. Not interchangeable with the Accountable Person under the Building Safety Act 2022.',
    topic: 'Fire Safety',
    relatedTerms: ['Fire Risk Assessment', 'Accountable Person'],
    relatedCheckSlug: 'fire-doors',
    hasLegalSignificance: true,
    legalNote: 'The Responsible Person has personal criminal liability for fire safety breaches under the RRO 2005. This is a defined statutory role, not a management appointment.',
  },
  {
    id: 'asset-register',
    term: 'Asset Register',
    definition: 'A structured record of all physical assets within a building or estate — including identity, location, age, condition, maintenance history, statutory testing records, and replacement cost. A comprehensive asset register is foundational to effective PPM planning, lifecycle budgeting, and compliance assurance.',
    topic: 'Asset Management',
    relatedTerms: ['PPM', 'CAFM', 'Lifecycle Cost'],
    relatedToolUrl: '/tools/ppm-schedule-builder',
    hasLegalSignificance: false,
  },
  {
    id: 'lifecycle-cost',
    term: 'Lifecycle Cost',
    definition: 'The total cost of an asset from acquisition through operation, maintenance, and disposal — also known as whole-life cost or total cost of ownership (TCO). Lifecycle costing informs capital planning, replacement decisions, and value-for-money assessments in FM and estates strategies.',
    topic: 'Asset Management',
    relatedTerms: ['Asset Register', 'Capex', 'Opex'],
    hasLegalSignificance: false,
  },
  {
    id: 'reactive-maintenance',
    term: 'Reactive Maintenance',
    definition: 'Unplanned maintenance activity triggered by an asset failure, fault report, or emergency. Distinct from Planned Preventive Maintenance (PPM). A balanced FM strategy minimises reactive demand through effective PPM while maintaining a responsive reactive maintenance capability with appropriate SLA targets.',
    topic: 'Asset Management',
    relatedTerms: ['PPM', 'CAFM', 'SLA'],
    hasLegalSignificance: false,
  },
  {
    id: 'statutory-inspection',
    term: 'Statutory Inspection',
    definition: 'An inspection or test required by law at defined intervals, typically carried out by or verified by a competent person. Examples include LOLER Thorough Examinations (lifts), EICR electrical testing, water hygiene monitoring, and fire alarm servicing. Failure to carry out statutory inspections on time can constitute a criminal breach of duty.',
    topic: 'Compliance',
    relatedTerms: ['PPM', 'Competent Person', 'LOLER', 'EICR'],
    relatedToolUrl: '/tools/compliance-checker',
    hasLegalSignificance: true,
    legalNote: 'Statutory inspection intervals are prescribed in specific legislation and associated Approved Codes of Practice. They cannot be extended by agreement between the building operator and contractor.',
  },
  {
    id: 'bms',
    term: 'Building Management System',
    abbreviation: 'BMS',
    definition: 'A computerised control and monitoring system for a building\'s mechanical and electrical services — including HVAC, heating, cooling, ventilation, lighting, access, and energy sub-metering. A BMS provides real-time data, fault alarms, energy reporting, and remote control capability. Also referred to as a Building Automation System (BAS).',
    topic: 'Digital FM',
    relatedTerms: ['CAFM', 'HVAC', 'IoT'],
    hasLegalSignificance: false,
  },
  {
    id: 'me',
    term: 'Mechanical and Electrical',
    abbreviation: 'M&E',
    definition: 'The mechanical and electrical engineering systems within a building — HVAC, plumbing, drainage, electrical distribution, fire detection, emergency lighting, lifts, data, and security. M&E maintenance typically constitutes the largest proportion of Hard FM operational expenditure.',
    topic: 'Technical FM',
    relatedTerms: ['Hard FM', 'HVAC', 'PPM'],
    hasLegalSignificance: false,
  },
  {
    id: 'mobilisation',
    term: 'Mobilisation',
    definition: 'The structured process of transitioning an FM contract from award to operational delivery — including TUPE transfer, asset survey, system configuration, SLA baseline setting, contractor induction, and day-one readiness. Typically a 4–12 week programme depending on contract complexity. Poor mobilisation is one of the most common causes of early contract performance issues.',
    topic: 'Contract Management',
    relatedTerms: ['TUPE', 'SLA', 'Asset Register'],
    hasLegalSignificance: false,
  },
  {
    id: 'permit-to-work',
    term: 'Permit to Work',
    abbreviation: 'PTW',
    definition: 'A formal document and safety control system authorising specific high-risk work activities — such as hot works, confined space entry, work at height, electrical isolation, and excavation. A permit is issued by an authorised Permit Issuer and must be acknowledged by the Contractor before work commences. It defines the scope, hazards, controls, and clearance procedure.',
    topic: 'Health & Safety',
    relatedTerms: ['RAMS', 'Hot Works', 'Isolation'],
    hasLegalSignificance: true,
    legalNote: 'Permit-to-work systems are required under several statutory frameworks including the Electricity at Work Regulations 1989 (electrical isolation) and are mandated by HSE guidance for confined spaces.',
  },
  {
    id: 'total-fm',
    term: 'Total Facilities Management',
    abbreviation: 'TFM',
    definition: 'A single-contract delivery model where one provider is responsible for all Hard and Soft FM services within a building or estate. A TFM model simplifies management accountability and procurement overhead but concentrates delivery risk in one supplier relationship.',
    topic: 'FM Strategy',
    relatedTerms: ['Hard FM', 'Soft FM', 'Bundled FM'],
    hasLegalSignificance: false,
  },
  {
    id: 'golden-thread',
    term: 'Golden Thread',
    abbreviation: 'Golden Thread',
    definition: 'A digital record of all building information — design, construction, occupation, and maintenance — required under the Building Safety Act 2022 for Higher-Risk Buildings (HRBs). The Golden Thread must be held digitally, kept up to date, and made accessible to the Building Safety Regulator and residents. It must survive changes in building ownership or FM provider.',
    topic: 'Building Safety',
    relatedCheckSlug: 'fire-doors',
    hasLegalSignificance: true,
    legalNote: 'A statutory requirement for Higher-Risk Buildings under the Building Safety Act 2022. Failure to maintain the Golden Thread is a criminal offence by the Principal Accountable Person.',
  },
  {
    id: 'eicr',
    term: 'Electrical Installation Condition Report',
    abbreviation: 'EICR',
    definition: 'A formal inspection and test of a building\'s fixed electrical installation carried out by a qualified electrical engineer. The EICR classifies defects as C1 (immediate danger), C2 (potentially dangerous), C3 (improvement recommended), or FI (further investigation). Required at intervals of max 5 years (commercial) or 3 years (industrial) under BS 7671.',
    topic: 'Electrical',
    relatedTerms: ['BS 7671', 'Electricity at Work Regulations'],
    relatedCheckSlug: 'eicr-electrical-inspection',
    relatedToolUrl: '/contractor-resources/eicr-visual-checklist',
    hasLegalSignificance: true,
    legalNote: 'Statutory requirement under Regulation 4 of the Electricity at Work Regulations 1989.',
  },
  {
    id: 'loler',
    term: 'Lifting Operations and Lifting Equipment Regulations 1998',
    abbreviation: 'LOLER',
    definition: 'UK statutory regulations requiring lifting equipment (including passenger lifts, goods hoists, and lifting accessories) to be properly maintained, and subjected to Thorough Examination by an independent competent person at defined intervals — every 6 months for passenger-carrying lifts.',
    topic: 'Compliance',
    relatedTerms: ['Statutory Inspection', 'Thorough Examination'],
    relatedCheckSlug: 'loler-passenger-lifts',
    hasLegalSignificance: true,
    legalNote: 'A breach of LOLER is a criminal offence under the Health and Safety at Work etc. Act 1974.',
  },
  {
    id: 'sfg20',
    term: 'SFG20',
    definition: 'The FM Industry Standard specification for building services maintenance — published by BESA (Building Engineering Services Association). SFG20 defines recommended maintenance activities and frequencies for over 70 building services systems, providing a structured basis for PPM schedules and FM contract specifications.',
    topic: 'Asset Management',
    relatedTerms: ['PPM', 'BESA', 'Asset Register'],
    relatedToolUrl: '/tools/ppm-schedule-builder',
    hasLegalSignificance: false,
  },
  {
    id: 'fra',
    term: 'Fire Risk Assessment',
    abbreviation: 'FRA',
    definition: 'A written assessment of fire hazards, risks to life, and fire precautions within a premises, required under the Regulatory Reform (Fire Safety) Order 2005. Must be carried out by a competent person, recorded in writing for premises with 5 or more employees, reviewed regularly, and updated following significant changes to the premises or use.',
    topic: 'Fire Safety',
    relatedTerms: ['Responsible Person', 'RRO 2005'],
    relatedCheckSlug: 'fire-doors',
    relatedToolUrl: '/tools/compliance-checker',
    hasLegalSignificance: true,
    legalNote: 'A legal requirement under Article 9 of the Regulatory Reform (Fire Safety) Order 2005.',
  },
];

// ── 04. FM SCENARIOS ("WHAT WOULD YOU DO?") ─────────────────────────

export const FM_SCENARIOS: FMScenario[] = [
  {
    id: 'out-of-hours-plant-failure',
    title: 'Out-of-Hours Critical Plant Failure',
    situation: 'It is 23:15 on a Thursday. The on-call engineer contacts you to report that the main chiller serving a 12-storey commercial office building has failed. The building is unoccupied, but servers and critical IT infrastructure remain operational. The internal temperature in the server room is beginning to rise. A tenant\'s weekend trade show event starts on Saturday morning.',
    level: 'Practitioner',
    topic: 'Incident Management',
    branches: [
      {
        id: 'branch-a',
        label: 'Option A: Deploy on-call M&E contractor immediately',
        description: 'Mobilise the contracted out-of-hours M&E specialist immediately under the emergency SLA.',
        considerations: {
          immediate: [
            'Confirm contractor emergency response SLA time (typically 2–4 hours)',
            'Confirm the server room temperature reading and rate of rise',
            'Notify on-call Account Manager or Facilities Director',
            'Check whether portable cooling hire is available as contingency',
          ],
          compliance: [
            'Ensure contractor attends with valid RAMS for chiller fault investigation',
            'Confirm F-Gas registration if refrigerant handling is required',
            'Confirm working-at-height protocol if roof-mounted plant access is needed',
          ],
          operational: [
            'Check temporary cooling capacity for the server room',
            'Alert IT/tenant representative of the situation',
            'Consider whether Saturday event access/temperature requirements can still be met',
          ],
          communication: [
            'Log the incident on the CAFM system immediately with a timestamp',
            'Notify the building owner / client representative per contract escalation protocol',
            'Advise tenant of potential impact on Saturday event',
          ],
          documentation: [
            'Open reactive job on CAFM with full fault description',
            'Record all verbal authorisations in writing',
            'Retain engineer\'s job sheet and any test results',
          ],
          lessonsLearned: [
            'Review whether a temporary cooling contingency plan existed for this scenario',
            'Consider whether BMS temperature alerts should have triggered earlier',
            'Review whether the emergency contractor SLA was adequate for this criticality',
          ],
        },
        outcome: 'Structured response. Emergency contractor deployed. Server room protected by temporary cooling. Tenant notified. Saturday event proceeds with reduced risk.',
      },
      {
        id: 'branch-b',
        label: 'Option B: Monitor overnight and arrange morning repair',
        description: 'Deploy on-call monitoring but wait until normal hours to arrange repair.',
        considerations: {
          immediate: [
            'Assess whether server room temperature is rising to a dangerous level',
            'Confirm that no critical systems will fail overnight',
            'Document the decision and rationale precisely',
          ],
          compliance: [
            'Review duty of care obligations to the tenant and their data infrastructure',
            'Consider whether delay creates a foreseeable and avoidable risk of loss',
          ],
          operational: [
            'Set up temperature alerts and check every 30 minutes',
            'Identify what emergency cooling options exist if temperature escalates',
          ],
          communication: [
            'Inform client of decision and risk assessment in writing',
            'Ensure tenant is aware so they can make their own contingency decisions',
          ],
          documentation: [
            'Document the risk-based decision with timestamp',
            'Note who authorised the decision to defer repair',
          ],
          lessonsLearned: [
            'This option carries significant risk if IT infrastructure is damaged',
            'Consider whether the SLA would be breached by delayed response',
            'The Saturday event deadline may make deferred action commercially indefensible',
          ],
        },
        outcome: 'Higher risk. If temperature rises further, the delay may cause IT damage and SLA breach. Client/tenant communication is critical if this route is taken.',
      },
    ],
  },
  {
    id: 'contractor-arrives-missing-docs',
    title: 'Contractor Arrives Without Required Documentation',
    situation: 'A gas engineer arrives at your building at 08:30 for an annual boiler service visit. When you check the contractor management system, you find that their Gas Safe Registration certificate has expired and their RAMS for the boiler room work have not been submitted. The engineer says the paperwork is being processed and asks to proceed.',
    level: 'Practitioner',
    topic: 'Contractor Management',
    branches: [
      {
        id: 'branch-a',
        label: 'Option A: Refuse access until documentation is confirmed',
        description: 'Politely decline to allow work to start until the required documentation has been verified.',
        considerations: {
          immediate: [
            'Confirm that the engineer\'s Gas Safe registration has genuinely expired (check the Gas Safe Register online)',
            'Contact the contractor company to establish whether current documentation exists',
            'Explain clearly that access cannot be granted until documentation is confirmed',
          ],
          compliance: [
            'Gas Safety (Installation and Use) Regulations 1998 require gas work to be carried out by a registered Gas Safe engineer — allowing unregistered work is illegal',
            'Reviewing RAMS before commencing work is a legal requirement under the Management of H&S at Work Regulations 1999',
            'You have a duty to control who carries out work under CDM 2015',
          ],
          operational: [
            'Reschedule the visit once valid documentation is provided',
            'Assess whether the boiler service is overdue and carries an SLA/statutory implication',
          ],
          communication: [
            'Communicate the refusal to the engineer calmly and professionally',
            'Notify the contractor company in writing, requesting valid certification be sent before rescheduling',
            'Notify your line manager/client of the situation',
          ],
          documentation: [
            'Log the refused access in the CAFM system with timestamp and reason',
            'Record the name of the engineer and contractor company',
            'Keep a copy of any correspondence with the contractor regarding the lapse',
          ],
          lessonsLearned: [
            'Review whether your pre-qualification system checks certification expiry dates before visit booking',
            'Consider automated certificate expiry alerts in the contractor portal',
            'Review whether you would be liable if you allowed work to proceed and an incident occurred',
          ],
        },
        outcome: 'Correct action. Protects the building, occupants, and the Duty Holder from legal liability. Demonstrates robust contractor governance.',
      },
      {
        id: 'branch-b',
        label: 'Option B: Allow work to proceed on the engineer\'s assurance',
        description: 'Accept the verbal assurance that paperwork is being processed and allow the boiler service to proceed.',
        considerations: {
          immediate: [
            'Consider the legal risk: if the engineer is not registered and causes an incident, the Duty Holder may share criminal liability',
            'The verbal assurance carries no legal weight for Gas Safe registration requirements',
          ],
          compliance: [
            'Allowing unregistered gas work is a breach of the Gas Safety (Installation and Use) Regulations 1998',
            'If an incident occurs, building insurance may be invalidated',
            'The Duty Holder (you or your employer) could face HSE prosecution',
          ],
          operational: [
            'Even if the work proceeds without incident, the gas safety certificate cannot be issued by an unregistered engineer',
            'This creates an evidence gap that would not survive audit or insurance review',
          ],
          communication: [],
          documentation: [],
          lessonsLearned: [
            'This option is not appropriate regardless of operational pressure',
            'Duty Holders must never knowingly permit unregistered gas work to proceed',
          ],
        },
        outcome: 'Not appropriate. Creates criminal liability risk. The correct course is Option A regardless of schedule pressure.',
      },
    ],
  },
];

// ── 05. TASK-BASED DISCOVERY ──────────────────────────────────────────

export const TASK_DISCOVERY_ITEMS: TaskDiscoveryItem[] = [
  {
    id: 'manage-contractor',
    label: 'Manage a contractor',
    description: 'Pre-qualification, RAMS, permit to work, performance management',
    primaryDestination: {
      label: 'Contractor Management Guide',
      url: '/lobby/learn/managing-contractors-safely',
      section: 'LEARN',
    },
    secondaryDestination: {
      label: 'Partner Network',
      url: '/suppliers/partner-network',
      section: 'SUPPLIERS',
    },
  },
  {
    id: 'prepare-tender',
    label: 'Prepare a tender',
    description: 'Specification writing, evaluation, contract award',
    primaryDestination: {
      label: 'FM Tender Brief Generator',
      url: '/tools/tender-brief',
      section: 'DO',
    },
    secondaryDestination: {
      label: 'FM Procurement Playbook',
      url: '/lobby/learn/fm-procurement-playbook',
      section: 'LEARN',
    },
  },
  {
    id: 'mobilise-contract',
    label: 'Mobilise a new contract',
    description: 'Day-one readiness, TUPE, asset survey, system setup',
    primaryDestination: {
      label: 'Mobilisation Playbook',
      url: '/lobby/learn/fm-contract-mobilisation-guide',
      section: 'LEARN',
    },
  },
  {
    id: 'review-compliance',
    label: 'Review compliance',
    description: 'What to check, how often, and what evidence to hold',
    primaryDestination: {
      label: 'Statutory Compliance Checker',
      url: '/tools/compliance-checker',
      section: 'DO',
    },
    secondaryDestination: {
      label: 'CHECK Compliance Centre',
      url: '/lobby/check',
      section: 'CHECK',
    },
  },
  {
    id: 'build-ppm',
    label: 'Build a PPM strategy',
    description: 'PPM schedule design, asset-led planning, SFG20 alignment',
    primaryDestination: {
      label: 'PPM Schedule Builder',
      url: '/tools/ppm-schedule-builder',
      section: 'DO',
    },
    secondaryDestination: {
      label: 'Understanding PPM Guide',
      url: '/lobby/learn/understanding-planned-preventive-maintenance',
      section: 'LEARN',
    },
  },
  {
    id: 'manage-incident',
    label: 'Manage an incident',
    description: 'Escalation, RIDDOR, documentation, lessons learned',
    primaryDestination: {
      label: 'Incident Scenario',
      url: '/lobby/learn/scenarios',
      section: 'LEARN',
    },
  },
  {
    id: 'improve-energy',
    label: 'Improve energy performance',
    description: 'Monitoring, targeting, MEES, net-zero planning',
    primaryDestination: {
      label: 'Energy Management Guide',
      url: '/lobby/learn/energy-management-essentials',
      section: 'LEARN',
    },
  },
  {
    id: 'understand-regulation',
    label: 'Understand a regulation',
    description: 'Legislation, duties, official guidance',
    primaryDestination: {
      label: 'CHECK Compliance Centre',
      url: '/lobby/check',
      section: 'CHECK',
    },
    secondaryDestination: {
      label: 'Regulatory Intelligence',
      url: '/lobby/know',
      section: 'KNOW',
    },
  },
  {
    id: 'prepare-audit',
    label: 'Prepare for an audit',
    description: 'Evidence review, gap assessment, documentation readiness',
    primaryDestination: {
      label: 'Compliance Gap Review',
      url: '/lobby/check',
      section: 'CHECK',
    },
    secondaryDestination: {
      label: 'Statutory Compliance Checker',
      url: '/tools/compliance-checker',
      section: 'DO',
    },
  },
  {
    id: 'improve-reporting',
    label: 'Improve FM reporting',
    description: 'KPIs, dashboards, client reporting, performance data',
    primaryDestination: {
      label: 'SLA & KPI Design Guide',
      url: '/lobby/learn/sla-kpi-design-for-fm-contracts',
      section: 'LEARN',
    },
  },
  {
    id: 'fm-career',
    label: 'Build an FM career',
    description: 'Professional development, pathways, knowledge building',
    primaryDestination: {
      label: 'FM Learning Pathways',
      url: '/lobby/learn',
      section: 'LEARN',
    },
    secondaryDestination: {
      label: 'FM Jobs & Careers',
      url: '/lobby/find/jobs',
      section: 'FIND',
    },
  },
  {
    id: 'ai-in-fm',
    label: 'Use AI in FM',
    description: 'CAFM AI features, automation, intelligent maintenance',
    primaryDestination: {
      label: 'Digital FM Pathway',
      url: '/lobby/learn?pathway=digital-fm',
      section: 'LEARN',
    },
  },
];

// ── 06. ONE USEFUL THING (CURRENT EDITION) ────────────────────────────

export interface OneUsefulThing {
  editionNumber: number;
  title: string;
  description: string;
  format: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const ONE_USEFUL_THING: OneUsefulThing = {
  editionNumber: 12,
  title: 'Contractor Pre-Start Checklist',
  description: 'Before any contractor begins work on site, run through this structured checklist: gas/electrical registration verified, current RAMS reviewed, permits issued, isolation confirmed, emergency contact confirmed. 14 check points. Printable and digital formats.',
  format: 'Checklist',
  ctaLabel: 'View Checklist',
  ctaUrl: '/lobby/do',
};
