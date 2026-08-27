/**
 * ENTIREFM CANONICAL COMPETENCY & QUALIFICATION FRAMEWORK (CP-04)
 * ===============================================================
 * Canonical definition of trades, competencies, qualifications,
 * training modules, and prerequisite rules for supply-chain assurance.
 */

export type TradeScope =
  | 'ELECTRICAL'
  | 'GAS_AND_HEATING'
  | 'HVAC_AND_REFRIGERATION'
  | 'PLUMBING_AND_DRAINAGE'
  | 'WATER_HYGIENE'
  | 'FIRE_AND_LIFE_SAFETY'
  | 'BUILDING_FABRIC'
  | 'ROPE_ACCESS'
  | 'SECURITY_AND_ACCESS'
  | 'CLEANING_AND_SOFT_FM'
  | 'GROUNDS_AND_LANDSCAPING'
  | 'ROOFING'
  | 'GENERAL_MAINTENANCE';

export interface CanonicalQualificationDef {
  code: string;
  name: string;
  issuingBody: string;
  trade: TradeScope | 'GENERAL';
  hasExpiry: boolean;
  standardValidityMonths?: number;
  isStatutory: boolean;
  criticality: 'CRITICAL' | 'STANDARD' | 'OPTIONAL';
  description: string;
}

export interface CanonicalTrainingDef {
  code: string;
  name: string;
  category: 'HEALTH_AND_SAFETY' | 'TECHNICAL' | 'INDUCTION' | 'COMPLIANCE';
  renewalIntervalMonths: number; // 0 if one-off
  mandatoryForTrades: (TradeScope | 'ALL')[];
  description: string;
}

export interface CanonicalCompetencyDef {
  code: string;
  title: string;
  trade: TradeScope;
  workScope: string;
  criticality: 'CRITICAL' | 'STANDARD';
  requiredQualifications: string[]; // Qualification codes required
  requiredTraining: string[]; // Training codes required
  requiresEntirefmApproval: boolean;
  description: string;
}

// ─────────────────────────────────────────────────────────────
// 1. CANONICAL QUALIFICATIONS CATALOGUE
// ─────────────────────────────────────────────────────────────
export const CANONICAL_QUALIFICATIONS: CanonicalQualificationDef[] = [
  // General & Health and Safety
  {
    code: 'ECS_CARD',
    name: 'ECS Electrotechnical Certification Scheme Card',
    issuingBody: 'JIB / ECS',
    trade: 'ELECTRICAL',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Mandatory proof of electrical occupational competence and H&S level.',
  },
  {
    code: 'CSCS_SKILLCARD',
    name: 'CSCS / Engineering Services SKILLcard',
    issuingBody: 'CSCS / BESA',
    trade: 'GENERAL',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Construction Skills Certification Scheme site access safety card.',
  },
  // Electrical
  {
    code: 'BS7671_18TH',
    name: '18th Edition BS 7671 IET Wiring Regulations (C&G 2382)',
    issuingBody: 'City & Guilds / EAL',
    trade: 'ELECTRICAL',
    hasExpiry: false,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Statutory compliance with current UK national wiring regulations standard.',
  },
  {
    code: 'CG_2391_INSPECTION',
    name: 'City & Guilds 2391 Inspection and Testing (EICR)',
    issuingBody: 'City & Guilds',
    trade: 'ELECTRICAL',
    hasExpiry: false,
    isStatutory: false,
    criticality: 'STANDARD',
    description: 'Periodic inspection, testing, and certification of electrical installations.',
  },
  // Gas & Commercial Heating
  {
    code: 'GAS_SAFE_CCN1',
    name: 'Gas Safe Core Domestic Natural Gas (CCN1)',
    issuingBody: 'Gas Safe Register',
    trade: 'GAS_AND_HEATING',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Statutory Gas Safe registration for domestic appliances and meters.',
  },
  {
    code: 'GAS_SAFE_COCN1',
    name: 'Gas Safe Core Commercial Gas Safety (COCN1)',
    issuingBody: 'Gas Safe Register',
    trade: 'GAS_AND_HEATING',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Statutory Gas Safe registration for commercial gas plant and distribution.',
  },
  {
    code: 'GAS_SAFE_CIGA1',
    name: 'Commercial Indirect Fired Gas Appliances (CIGA1)',
    issuingBody: 'Gas Safe Register',
    trade: 'GAS_AND_HEATING',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Commercial boilers, air heaters, and plant room installations.',
  },
  // HVAC & F-Gas
  {
    code: 'FGAS_CAT1',
    name: 'City & Guilds 2079-11 F-Gas Category 1 (Refrigerant Handling)',
    issuingBody: 'City & Guilds / BESA',
    trade: 'HVAC_AND_REFRIGERATION',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Statutory certification to recover, install, maintain stationary refrigeration and AC with >3kg fluorinated gas.',
  },
  // Access & Working at Height
  {
    code: 'IPAF_3A_3B',
    name: 'IPAF Powered Access Licence (Mobile Vertical 3A / Mobile Boom 3B)',
    issuingBody: 'IPAF',
    trade: 'GENERAL',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: false,
    criticality: 'STANDARD',
    description: 'Operator training licence for scissor lifts and self-propelled boom lifts.',
  },
  {
    code: 'PASMA_TOWERS',
    name: 'PASMA Towers for Users Certificate',
    issuingBody: 'PASMA',
    trade: 'GENERAL',
    hasExpiry: true,
    standardValidityMonths: 60,
    isStatutory: false,
    criticality: 'STANDARD',
    description: 'Competency to safely erect, inspect, dismantle and use mobile access towers.',
  },
  {
    code: 'IRATA_ROPE_ACCESS',
    name: 'IRATA International Rope Access Level 1–3',
    issuingBody: 'IRATA',
    trade: 'ROPE_ACCESS',
    hasExpiry: true,
    standardValidityMonths: 36,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'Industrial rope access technician certification for high-level maintenance.',
  },
  // Fire & Water Hygiene
  {
    code: 'FIA_FIRE_ALARM',
    name: 'FIA Foundation in Fire Detection & Alarm Systems (BS 5839)',
    issuingBody: 'Fire Industry Association (FIA)',
    trade: 'FIRE_AND_LIFE_SAFETY',
    hasExpiry: false,
    isStatutory: false,
    criticality: 'CRITICAL',
    description: 'Competency in design, installation, commissioning and servicing of fire alarms.',
  },
  {
    code: 'WATER_LEGIONELLA_CERT',
    name: 'City & Guilds / WMSoc Legionella Water Hygiene Certification',
    issuingBody: 'WMSoc / City & Guilds',
    trade: 'WATER_HYGIENE',
    hasExpiry: true,
    standardValidityMonths: 36,
    isStatutory: true,
    criticality: 'CRITICAL',
    description: 'ACOP L8 compliance for temperature monitoring, sampling, and disinfection.',
  },
];

// ─────────────────────────────────────────────────────────────
// 2. CANONICAL TRAINING COURSES CATALOGUE
// ─────────────────────────────────────────────────────────────
export const CANONICAL_TRAINING_COURSES: CanonicalTrainingDef[] = [
  {
    code: 'UKATA_ASBESTOS',
    name: 'UKATA Asbestos Awareness (Category A)',
    category: 'HEALTH_AND_SAFETY',
    renewalIntervalMonths: 12,
    mandatoryForTrades: ['ALL'],
    description: 'Annual statutory refresher for recognizing asbestos hazards in commercial buildings.',
  },
  {
    code: 'WORKING_AT_HEIGHT',
    name: 'Working at Height & Harness Safety',
    category: 'HEALTH_AND_SAFETY',
    renewalIntervalMonths: 36,
    mandatoryForTrades: ['ALL'],
    description: 'Safe use of ladders, step ladders, fall restraint, and roof access controls.',
  },
  {
    code: 'FIRST_AID_EFAW',
    name: 'Emergency First Aid at Work (EFAW)',
    category: 'HEALTH_AND_SAFETY',
    renewalIntervalMonths: 36,
    mandatoryForTrades: ['ALL'],
    description: 'HSE-compliant emergency first aid training for field engineers.',
  },
  {
    code: 'MANUAL_HANDLING',
    name: 'Manual Handling & Ergonomics',
    category: 'HEALTH_AND_SAFETY',
    renewalIntervalMonths: 36,
    mandatoryForTrades: ['ALL'],
    description: 'Safe lifting and transport of plant, tools, and heavy materials.',
  },
  {
    code: 'SAFE_ISOLATION_ELEC',
    name: 'Safe Electrical Isolation Procedures',
    category: 'TECHNICAL',
    renewalIntervalMonths: 24,
    mandatoryForTrades: ['ELECTRICAL', 'HVAC_AND_REFRIGERATION'],
    description: 'Dead testing, lock-off tag-out (LOTO), and GS38 voltage indicator verification.',
  },
  {
    code: 'ENTIREFM_INDUCTION',
    name: 'EntireFM Supply Chain Operative Induction',
    category: 'INDUCTION',
    renewalIntervalMonths: 24,
    mandatoryForTrades: ['ALL'],
    description: 'EntireFM site operating rules, customer service standards, CAFM mobile workflow, and zero-defect policy.',
  },
];

// ─────────────────────────────────────────────────────────────
// 3. CANONICAL COMPETENCY FRAMEWORK
// ─────────────────────────────────────────────────────────────
export const CANONICAL_COMPETENCIES: CanonicalCompetencyDef[] = [
  // Electrical
  {
    code: 'ELEC_SAFE_ISOLATION',
    title: 'Safe Electrical Isolation (LOTO)',
    trade: 'ELECTRICAL',
    workScope: 'Low voltage circuit and distribution board safe lock-off and isolation',
    criticality: 'CRITICAL',
    requiredQualifications: ['BS7671_18TH', 'ECS_CARD'],
    requiredTraining: ['SAFE_ISOLATION_ELEC', 'UKATA_ASBESTOS'],
    requiresEntirefmApproval: false,
    description: 'Authorised to perform safe isolation and prove dead on LV systems prior to maintenance.',
  },
  {
    code: 'ELEC_PERIODIC_INSPECTION',
    title: 'Electrical Inspection & Testing (EICR)',
    trade: 'ELECTRICAL',
    workScope: 'Commercial electrical condition reports, certification and remedials',
    criticality: 'CRITICAL',
    requiredQualifications: ['BS7671_18TH', 'CG_2391_INSPECTION', 'ECS_CARD'],
    requiredTraining: ['SAFE_ISOLATION_ELEC', 'UKATA_ASBESTOS'],
    requiresEntirefmApproval: true,
    description: 'Authorised to carry out full periodic inspection, dead testing, and sign off electrical installation condition reports.',
  },
  {
    code: 'ELEC_EMERGENCY_LIGHTING',
    title: 'Emergency Lighting Maintenance (BS 5266)',
    trade: 'ELECTRICAL',
    workScope: 'Periodic 1hr and 3hr emergency lighting discharge testing and luminaire remedials',
    criticality: 'STANDARD',
    requiredQualifications: ['BS7671_18TH'],
    requiredTraining: ['UKATA_ASBESTOS', 'WORKING_AT_HEIGHT'],
    requiresEntirefmApproval: false,
    description: 'Authorised to maintain, test, and repair emergency escape lighting systems.',
  },
  // Gas & Commercial Heating
  {
    code: 'GAS_COMMERCIAL_BOILERS',
    title: 'Commercial Gas Boiler Servicing & Plant',
    trade: 'GAS_AND_HEATING',
    workScope: 'Commercial gas boilers >70kW, burners, and plant room distribution',
    criticality: 'CRITICAL',
    requiredQualifications: ['GAS_SAFE_COCN1', 'GAS_SAFE_CIGA1'],
    requiredTraining: ['UKATA_ASBESTOS', 'ENTIREFM_INDUCTION'],
    requiresEntirefmApproval: true,
    description: 'Authorised to service, commission, and repair commercial gas heating plant and safety shut-off systems.',
  },
  {
    code: 'GAS_DOMESTIC_SYSTEMS',
    title: 'Domestic Gas Appliances & System Boilers',
    trade: 'GAS_AND_HEATING',
    workScope: 'Individual dwelling gas boilers, water heaters, and pipework',
    criticality: 'CRITICAL',
    requiredQualifications: ['GAS_SAFE_CCN1'],
    requiredTraining: ['UKATA_ASBESTOS'],
    requiresEntirefmApproval: false,
    description: 'Authorised to service and issue landlord gas safety records (CP12).',
  },
  // HVAC
  {
    code: 'HVAC_FGAS_REFRIGERANT',
    title: 'F-Gas Refrigerant Recovery & Charging',
    trade: 'HVAC_AND_REFRIGERATION',
    workScope: 'Split AC, VRV/VRF systems, chillers, and refrigerant leak testing',
    criticality: 'CRITICAL',
    requiredQualifications: ['FGAS_CAT1'],
    requiredTraining: ['UKATA_ASBESTOS', 'WORKING_AT_HEIGHT'],
    requiresEntirefmApproval: true,
    description: 'Authorised to handle fluorinated greenhouse gases, perform vacuum testing, and recover refrigerant.',
  },
  {
    code: 'HVAC_AHU_AIR_HANDLING',
    title: 'Air Handling Unit (AHU) Maintenance',
    trade: 'HVAC_AND_REFRIGERATION',
    workScope: 'Belt changes, filter replacements, coil cleaning, and motor servicing',
    criticality: 'STANDARD',
    requiredQualifications: ['CSCS_SKILLCARD'],
    requiredTraining: ['WORKING_AT_HEIGHT', 'UKATA_ASBESTOS'],
    requiresEntirefmApproval: false,
    description: 'Authorised for mechanical ventilation plant servicing and filter changes.',
  },
  // Water Hygiene
  {
    code: 'WATER_ACOP_L8_MONITORING',
    title: 'Water Hygiene Temperature & Sampling (ACOP L8)',
    trade: 'WATER_HYGIENE',
    workScope: 'Sentinel tap temperatures, calorifier inspection, and Legionella microbiological sampling',
    criticality: 'CRITICAL',
    requiredQualifications: ['WATER_LEGIONELLA_CERT'],
    requiredTraining: ['UKATA_ASBESTOS', 'ENTIREFM_INDUCTION'],
    requiresEntirefmApproval: true,
    description: 'Authorised to maintain statutory water hygiene logbooks and collect UKAS lab samples.',
  },
  // Fire & Life Safety
  {
    code: 'FIRE_ALARM_SERVICING',
    title: 'Fire Alarm System Maintenance (BS 5839-1)',
    trade: 'FIRE_AND_LIFE_SAFETY',
    workScope: 'Addressable and conventional fire alarm panels, sounders, call points, and interfaces',
    criticality: 'CRITICAL',
    requiredQualifications: ['FIA_FIRE_ALARM'],
    requiredTraining: ['UKATA_ASBESTOS', 'WORKING_AT_HEIGHT'],
    requiresEntirefmApproval: true,
    description: 'Authorised to service life safety systems, test interfaces, and issue periodic certificates.',
  },
  // Access & Height
  {
    code: 'ACCESS_POWERED_MEWP',
    title: 'Powered Access MEWP Operation (3A / 3B)',
    trade: 'GENERAL_MAINTENANCE',
    workScope: 'Operation of scissor lifts and articulated mobile boom platforms',
    criticality: 'STANDARD',
    requiredQualifications: ['IPAF_3A_3B'],
    requiredTraining: ['WORKING_AT_HEIGHT'],
    requiresEntirefmApproval: false,
    description: 'Authorised to operate MEWP equipment on client premises with harness restraint.',
  },
  {
    code: 'ACCESS_ROPE_TECHNICIAN',
    title: 'Industrial Rope Access Operations (IRATA)',
    trade: 'ROPE_ACCESS',
    workScope: 'High-level facade repairs, window cleaning, and structural inspection via twin-rope system',
    criticality: 'CRITICAL',
    requiredQualifications: ['IRATA_ROPE_ACCESS'],
    requiredTraining: ['WORKING_AT_HEIGHT', 'FIRST_AID_EFAW'],
    requiresEntirefmApproval: true,
    description: 'Authorised to rig and operate rope access systems under level 3 supervision.',
  },
];
