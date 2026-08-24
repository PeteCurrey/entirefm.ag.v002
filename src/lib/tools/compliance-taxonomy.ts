/**
 * COMPLIANCE & STATUTORY REGIMES TAXONOMY
 * ========================================
 * Authoritative regulatory context, British Standards, and Approved Codes of Practice
 * governing UK commercial building maintenance and estate management.
 */

export type ComplianceClassification =
  | 'LEGAL_STATUTORY_DUTY'
  | 'BRITISH_INDUSTRY_STANDARD'
  | 'SFG20_PLANNED_PRACTICE'
  | 'MANUFACTURER_REQUIREMENT'
  | 'RISK_BASED_SITE_SPECIFIC'
  | 'INDUSTRY_BEST_PRACTICE';

export interface ComplianceRegime {
  id: string;
  name: string;
  shortCode: string;
  primaryLegislation: string;
  governingStandard: string;
  statutoryDutyHolder: string;
  classification: ComplianceClassification;
  typicalInterval: string;
  enforcingAuthority: string;
  evidenceRequired: string;
  riskIfBreached: string;
}

export const COMPLIANCE_REGIMES: Record<string, ComplianceRegime> = {
  FIRE_SAFETY_ORDER: {
    id: 'FIRE_SAFETY_ORDER',
    name: 'Fire Risk Assessment & Life Safety Systems',
    shortCode: 'RRO 2005 / FSA 2021',
    primaryLegislation: 'Regulatory Reform (Fire Safety) Order 2005 & Fire Safety Act 2021',
    governingStandard: 'BS 9999 / PAS 79',
    statutoryDutyHolder: 'Responsible Person (Building Owner, Employer, or Managing Agent with control)',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Live Document (Annual Review / Significant Change)',
    enforcingAuthority: 'Local Fire & Rescue Authority',
    evidenceRequired: 'Written Fire Risk Assessment, logged action closeouts, staff training records',
    riskIfBreached: 'Unlimited fines, formal enforcement notices, prohibition notices, criminal prosecution',
  },
  FIRE_ALARM: {
    id: 'FIRE_ALARM',
    name: 'Fire Detection & Alarm Systems',
    shortCode: 'BS 5839-1',
    primaryLegislation: 'RRO 2005 Article 17 (Maintenance)',
    governingStandard: 'BS 5839-1:2017 Fire detection and fire alarm systems for buildings',
    statutoryDutyHolder: 'Responsible Person / Designated Competent Person',
    classification: 'BRITISH_INDUSTRY_STANDARD',
    typicalInterval: 'Weekly User Test / 6-Monthly Competent Engineer Inspection',
    enforcingAuthority: 'Local Fire & Rescue Authority',
    evidenceRequired: 'Fire alarm logbook with weekly call-point tests, 6-monthly engineering inspection certificates',
    riskIfBreached: 'System failure during fire event, non-compliance notice, invalidation of building insurance',
  },
  EMERGENCY_LIGHTING: {
    id: 'EMERGENCY_LIGHTING',
    name: 'Emergency Escape Lighting',
    shortCode: 'BS 5266-1',
    primaryLegislation: 'RRO 2005 Article 17 & Health and Safety (Safety Signs and Signals) Regs 1996',
    governingStandard: 'BS 5266-1:2016 Code of practice for emergency lighting',
    statutoryDutyHolder: 'Responsible Person',
    classification: 'BRITISH_INDUSTRY_STANDARD',
    typicalInterval: 'Monthly Short Functional Test / Annual Full 3-Hour Discharge Test',
    enforcingAuthority: 'Local Fire & Rescue Authority',
    evidenceRequired: 'Emergency lighting logbook recording monthly flick tests and annual 3-hour battery certificates',
    riskIfBreached: 'Dark escape routes during blackout/fire, prohibition notices, severe life safety liability',
  },
  FIRE_DOORS: {
    id: 'FIRE_DOORS',
    name: 'Fire Resisting Doorsets & Compartmentation',
    shortCode: 'BS 8214 / FSR 2022',
    primaryLegislation: 'RRO 2005 & Fire Safety (England) Regulations 2022',
    governingStandard: 'BS 8214:2016 Timber-based fire door assemblies / BS 9999',
    statutoryDutyHolder: 'Responsible Person',
    classification: 'BRITISH_INDUSTRY_STANDARD',
    typicalInterval: '6-Monthly (Commercial) / Quarterly (Multi-Occupied Residential >11m)',
    enforcingAuthority: 'Local Fire & Rescue Authority / Building Safety Regulator',
    evidenceRequired: 'Fire door inspection schedule, gap measurement records (2–4mm), seal & closer checks',
    riskIfBreached: 'Rapid smoke and fire propagation between building compartments',
  },
  ELECTRICAL_INSTALLATION: {
    id: 'ELECTRICAL_INSTALLATION',
    name: 'Fixed Electrical Installation (Periodic Inspection)',
    shortCode: 'BS 7671 / EAWR 1989',
    primaryLegislation: 'Electricity at Work Regulations 1989 Regulation 4(2)',
    governingStandard: 'BS 7671:2018+A2:2022 (IET Wiring Regulations) & IET Guidance Note 3',
    statutoryDutyHolder: 'Duty Holder (Employer / Facility Controller)',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: '3 to 5 Years (Risk-Based by Environment, Max 5 Years Commercial, 3 Years Industrial)',
    enforcingAuthority: 'Health and Safety Executive (HSE) / Local Authority',
    evidenceRequired: 'Electrical Installation Condition Report (EICR) with Satisfactory assessment and C1/C2 closeouts',
    riskIfBreached: 'Electrical shock, electrical fire, HSE improvement notices, commercial lease default',
  },
  PORTABLE_APPLIANCES: {
    id: 'PORTABLE_APPLIANCES',
    name: 'In-Service Inspection and Testing of Electrical Equipment (PAT)',
    shortCode: 'IET COP 5th Ed',
    primaryLegislation: 'Electricity at Work Regulations 1989 Regulation 4(2)',
    governingStandard: 'IET Code of Practice for In-service Inspection and Testing of Electrical Equipment (5th Edition)',
    statutoryDutyHolder: 'Employer / Duty Holder',
    classification: 'RISK_BASED_SITE_SPECIFIC',
    typicalInterval: 'Risk-Based (e.g. 12-24 Months Office, 3-6 Months Construction/Heavy Tools)',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'PAT register, pass/fail test tags, formal defect quarantine procedure',
    riskIfBreached: 'Appliance electrocution, fault currents, equipment fire hazard',
  },
  LIGHTNING_PROTECTION: {
    id: 'LIGHTNING_PROTECTION',
    name: 'Lightning Protection Systems (LPS)',
    shortCode: 'BS EN 62305',
    primaryLegislation: 'Electricity at Work Regulations 1989',
    governingStandard: 'BS EN 62305 Protection against lightning',
    statutoryDutyHolder: 'Duty Holder',
    classification: 'BRITISH_INDUSTRY_STANDARD',
    typicalInterval: '11-Monthly (to account for seasonal soil resistivity variance over 12 years)',
    enforcingAuthority: 'HSE / Property Insurers',
    evidenceRequired: 'LPS annual test certificate recording earth electrode resistance and continuity',
    riskIfBreached: 'Structural strike damage, catastrophic surge destruction of building IT/plant, fire',
  },
  LEGIONELLA_CONTROL: {
    id: 'LEGIONELLA_CONTROL',
    name: 'Legionella Risk Assessment & Water Hygiene Control',
    shortCode: 'ACOP L8 / HSG274',
    primaryLegislation: 'Health and Safety at Work etc. Act 1974 & COSHH Regulations 2002',
    governingStandard: 'HSE Approved Code of Practice L8 & HSG274 Parts 1, 2, 3',
    statutoryDutyHolder: 'Duty Holder / Appointed Statutory Responsible Person (Water)',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Risk Assessment: Review 2-Yearly; Monitoring: Monthly Temperatures, Annual Tank Checks',
    enforcingAuthority: 'HSE / Local Environmental Health',
    evidenceRequired: 'Water hygiene logbook, monthly sentinel temperatures, annual tank visual inspection, schematic drawings',
    riskIfBreached: 'Legionnaires’ disease outbreaks, corporate manslaughter charges, HSE prohibition notices',
  },
  GAS_SAFETY: {
    id: 'GAS_SAFETY',
    name: 'Commercial Gas Installation & Heating Plant',
    shortCode: 'GSIUR 1998',
    primaryLegislation: 'Gas Safety (Installation and Use) Regulations 1998 Regulation 35/36',
    governingStandard: 'IGEM/UP/1, IGEM/UP/2, BS 6644',
    statutoryDutyHolder: 'Employer / Landlord / Building Operator',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Annually (12 Months Maximum)',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Gas Safe Commercial Non-Domestic Safety Certificate (CP15 / CP17 / CP42), combustion analysis records',
    riskIfBreached: 'Carbon monoxide poisoning, gas explosion, immediate gas supply isolation, prosecution',
  },
  PASSENGER_LIFTS: {
    id: 'PASSENGER_LIFTS',
    name: 'Passenger Carrying Lifting Equipment',
    shortCode: 'LOLER 1998 (6M)',
    primaryLegislation: 'Lifting Operations and Lifting Equipment Regulations 1998 Reg 9(3)(a)',
    governingStandard: 'BS EN 81-20/50 & SAFed Guidelines',
    statutoryDutyHolder: 'Duty Holder (Lift Owner / Managing Agent)',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: '6-Monthly Thorough Examination (Independent Competent Person) + Routine PPM',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'LOLER Thorough Examination reports from engineer surveyor, defect category A/B closeout evidence',
    riskIfBreached: 'Lift passenger trapping/injury, immediate HSE equipment prohibition notice',
  },
  GOODS_LIFTS: {
    id: 'GOODS_LIFTS',
    name: 'Goods Only Lifts & Mechanical Handling',
    shortCode: 'LOLER 1998 (12M)',
    primaryLegislation: 'Lifting Operations and Lifting Equipment Regulations 1998 Reg 9(3)(b)',
    governingStandard: 'LOLER 1998 / PUWER 1998',
    statutoryDutyHolder: 'Duty Holder',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: '12-Monthly Thorough Examination + Routine PPM',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Annual LOLER Report of Thorough Examination',
    riskIfBreached: 'Equipment failure, load collapse, HSE enforcement',
  },
  PRESSURE_SYSTEMS: {
    id: 'PRESSURE_SYSTEMS',
    name: 'Pressure Systems & Expansion Vessels',
    shortCode: 'PSSR 2000',
    primaryLegislation: 'Pressure Systems Safety Regulations 2000 Regulation 8 & 9',
    governingStandard: 'PSSR 2000 Approved Code of Practice L122',
    statutoryDutyHolder: 'User / Owner of Pressure System',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'As Defined in Written Scheme of Examination (Typically 12 to 24 Months)',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Certified Written Scheme of Examination (WSE), examination reports, relief valve calibration records',
    riskIfBreached: 'Vessel over-pressurisation rupture, explosive steam/gas release, HSE prosecution',
  },
  F_GAS_REFRIGERATION: {
    id: 'F_GAS_REFRIGERATION',
    name: 'Fluorinated Greenhouse Gases (F-Gas Refrigerants)',
    shortCode: 'F-Gas Regs',
    primaryLegislation: 'Fluorinated Greenhouse Gases Regulations 2015 (as amended GB)',
    governingStandard: 'BS EN 378 & DEFRA / Environment Agency Guidance',
    statutoryDutyHolder: 'Operator of Refrigeration / Heat Pump / AC Equipment',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Threshold Dependent: 5–50 t CO2e (12M), 50–500 t CO2e (6M), >500 t CO2e (3M)',
    enforcingAuthority: 'Environment Agency',
    evidenceRequired: 'F-Gas logbook with technician F-Gas certification numbers, leak check records, refrigerant recovery logs',
    riskIfBreached: 'Civil penalties up to £200,000, environmental enforcement action',
  },
  LEV_EXTRACTION: {
    id: 'LEV_EXTRACTION',
    name: 'Local Exhaust Ventilation (Dust / Fume Extract)',
    shortCode: 'COSHH Reg 9',
    primaryLegislation: 'Control of Substances Hazardous to Health Regulations 2002 Reg 9',
    governingStandard: 'HSG258 Controlling airborne contaminants at work',
    statutoryDutyHolder: 'Employer',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: '14-Monthly Maximum Interval (Strict Statutory Requirement)',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Thorough Examination and Test (TExT) report with capture velocity and static pressure measurements',
    riskIfBreached: 'Occupational respiratory disease, COSHH improvement notices, employee compensation claims',
  },
  AIR_CONDITIONING_ENERGY: {
    id: 'AIR_CONDITIONING_ENERGY',
    name: 'Air Conditioning Energy Inspections (TM44)',
    shortCode: 'EPBD / TM44',
    primaryLegislation: 'Energy Performance of Buildings (England and Wales) Regulations 2012 Reg 18',
    governingStandard: 'CIBSE TM44 Inspection of air conditioning systems',
    statutoryDutyHolder: 'Building Owner / Person with control of AC system >12kW total effective output',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: '5-Yearly Maximum Interval',
    enforcingAuthority: 'Local Authority Trading Standards',
    evidenceRequired: 'Valid TM44 inspection certificate and report lodged on central government register',
    riskIfBreached: 'Trading standards fines (£300 per building), non-compliance disclosures during lease transactions',
  },
  ASBESTOS_DUTY: {
    id: 'ASBESTOS_DUTY',
    name: 'Duty to Manage Asbestos in Non-Domestic Premises',
    shortCode: 'CAR 2012 Reg 4',
    primaryLegislation: 'Control of Asbestos Regulations 2012 Regulation 4',
    governingStandard: 'HSG264 Asbestos: The survey guide & HSG227',
    statutoryDutyHolder: 'Duty Holder (Owner or Person responsible for maintenance/repair)',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Asbestos Management Plan: Live Document; Condition Re-Inspection: Annually (12 Months)',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Asbestos Register, Asbestos Management Plan, annual material condition re-inspection log, contractor sign-off sheets',
    riskIfBreached: 'Asbestos fibre release, criminal prosecution, unlimited corporate fines, severe reputational crisis',
  },
  WORKING_AT_HEIGHT: {
    id: 'WORKING_AT_HEIGHT',
    name: 'Fall Protection, Man-Safe Systems & BMU Cradles',
    shortCode: 'WAHR 2005',
    primaryLegislation: 'Work at Height Regulations 2005 & LOLER 1998 (for powered cradles)',
    governingStandard: 'BS EN 795, BS 7883, BS 6037',
    statutoryDutyHolder: 'Duty Holder / Building Owner',
    classification: 'LEGAL_STATUTORY_DUTY',
    typicalInterval: 'Man-safe Eyebolts: 6-12 Months; Roof Wire Lines: 12-Monthly; BMU Cradles: 6-Monthly LOLER',
    enforcingAuthority: 'HSE',
    evidenceRequired: 'Test and calibration certificates, pull-test logs, LOLER thorough examination certificates for cradles',
    riskIfBreached: 'Fatal fall from height liability, immediate prohibition notices, severe corporate manslaughter exposure',
  },
};

export function getClassificationLabel(classification: ComplianceClassification): string {
  switch (classification) {
    case 'LEGAL_STATUTORY_DUTY':
      return 'Legal / Statutory Duty';
    case 'BRITISH_INDUSTRY_STANDARD':
      return 'British / Industry Standard';
    case 'SFG20_PLANNED_PRACTICE':
      return 'SFG20 / Planned Practice';
    case 'MANUFACTURER_REQUIREMENT':
      return 'Manufacturer Requirement';
    case 'RISK_BASED_SITE_SPECIFIC':
      return 'Risk-Based / Site Specific';
    case 'INDUSTRY_BEST_PRACTICE':
      return 'Industry Best Practice';
  }
}

export function getClassificationColor(classification: ComplianceClassification): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (classification) {
    case 'LEGAL_STATUTORY_DUTY':
      return {
        bg: 'bg-rose-950/30',
        text: 'text-rose-400',
        border: 'border-rose-800/40',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      };
    case 'BRITISH_INDUSTRY_STANDARD':
      return {
        bg: 'bg-blue-950/30',
        text: 'text-blue-400',
        border: 'border-blue-800/40',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      };
    case 'SFG20_PLANNED_PRACTICE':
      return {
        bg: 'bg-emerald-950/30',
        text: 'text-emerald-400',
        border: 'border-emerald-800/40',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      };
    case 'MANUFACTURER_REQUIREMENT':
      return {
        bg: 'bg-amber-950/30',
        text: 'text-amber-400',
        border: 'border-amber-800/40',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      };
    case 'RISK_BASED_SITE_SPECIFIC':
      return {
        bg: 'bg-purple-950/30',
        text: 'text-purple-400',
        border: 'border-purple-800/40',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      };
    case 'INDUSTRY_BEST_PRACTICE':
      return {
        bg: 'bg-slate-900/40',
        text: 'text-slate-400',
        border: 'border-slate-800/40',
        badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      };
  }
}
