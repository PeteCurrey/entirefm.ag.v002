/**
 * ENTIREFM CONTRACTOR PREQUALIFICATION & COMPETENCY MATRIX
 * =========================================================
 * CDM 2015 Regulation 8 & 15 Compliance Framework.
 *
 * Replaces simplistic universal SSIP requirement with a configurable,
 * risk-tiered competency matrix based on trade, risk class, and site requirements.
 */

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGH_CRITICAL';

export type CompetencyEvidenceStream =
  | 'TRADE_LICENCE_MANDATORY' // Gas Safe, NICEIC Part P / Approved, F-Gas (REFCOM), BAFE Fire
  | 'SSIP_MEMBER_SCHEME' // CHAS, SafeContractor, SMAS, Constructionline (Where requested by client)
  | 'TRAINING_CERTIFICATES' // IPAF, PASMA, Asbestos Awareness (UKATA/IATP), First Aid, Confined Space
  | 'INSURANCE_SCHEDULE' // Verified Employers / Public / Professional Liability
  | 'ORGANISATIONAL_RAMS' // Site-specific Risk Assessment & Method Statement vetting
  | 'TRADE_REFERENCES' // Client / Managing Agent verified references
  | 'WASTE_CARRIER_LICENCE'; // Environment Agency Upper Tier Waste Carrier

export interface TradeQualificationRule {
  tradeId: string;
  tradeName: string;
  defaultRiskTier: RiskTier;
  mandatoryLicences: string[];
  mandatoryEvidenceStreams: CompetencyEvidenceStream[];
  optionalEvidenceStreams: CompetencyEvidenceStream[];
  annualAuditRequired: boolean;
  internalNotes: string;
}

export const CONTRACTOR_QUALIFICATION_MATRIX: TradeQualificationRule[] = [
  {
    tradeId: 'gas_combustion',
    tradeName: 'Gas & Commercial Combustion Engineering',
    defaultRiskTier: 'HIGH_CRITICAL',
    mandatoryLicences: ['Gas Safe Register (Commercial / Domestic Scope)'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'INSURANCE_SCHEDULE',
      'ORGANISATIONAL_RAMS',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME', 'TRAINING_CERTIFICATES'],
    annualAuditRequired: true,
    internalNotes: 'Gas Safe registration is non-delegable statutory requirement.',
  },
  {
    tradeId: 'electrical_compliance',
    tradeName: 'Electrical Installation, Testing & EICR',
    defaultRiskTier: 'HIGH',
    mandatoryLicences: ['NICEIC / NAPIT / ECA Approved Contractor'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'INSURANCE_SCHEDULE',
      'ORGANISATIONAL_RAMS',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME', 'TRAINING_CERTIFICATES'],
    annualAuditRequired: true,
    internalNotes: '18th Edition BS 7671 verification required for all deployed electricians.',
  },
  {
    tradeId: 'hvac_refrigeration',
    tradeName: 'HVAC, Chillers & F-Gas Refrigeration',
    defaultRiskTier: 'HIGH',
    mandatoryLicences: ['REFCOM F-Gas Company Certificate', 'City & Guilds 2079 / CITB J11'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'INSURANCE_SCHEDULE',
      'ORGANISATIONAL_RAMS',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME', 'WASTE_CARRIER_LICENCE'],
    annualAuditRequired: true,
    internalNotes: 'F-Gas tracking register required for refrigerant recovery/charging.',
  },
  {
    tradeId: 'fire_safety',
    tradeName: 'Fire Alarm, Detection & Extinguishers',
    defaultRiskTier: 'HIGH_CRITICAL',
    mandatoryLicences: ['BAFE SP203-1 / BAFE SP101 or FIA Third-Party Certified'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'INSURANCE_SCHEDULE',
      'ORGANISATIONAL_RAMS',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME'],
    annualAuditRequired: true,
    internalNotes: 'Regulatory Reform (Fire Safety) Order 2005 life-safety critical.',
  },
  {
    tradeId: 'water_hygiene',
    tradeName: 'Water Hygiene & Legionella Control',
    defaultRiskTier: 'HIGH',
    mandatoryLicences: ['Legionella Control Association (LCA) Code of Conduct Registration'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'INSURANCE_SCHEDULE',
      'ORGANISATIONAL_RAMS',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME'],
    annualAuditRequired: true,
    internalNotes: 'ACOP L8 / HSG274 compliance evidence required.',
  },
  {
    tradeId: 'general_fabric',
    tradeName: 'General Building Fabric & Handyman',
    defaultRiskTier: 'LOW',
    mandatoryLicences: [],
    mandatoryEvidenceStreams: ['INSURANCE_SCHEDULE', 'ORGANISATIONAL_RAMS'],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME', 'TRAINING_CERTIFICATES', 'TRADE_REFERENCES'],
    annualAuditRequired: false,
    internalNotes: 'Low risk maintenance; universal SSIP is not mandated for basic fabric work.',
  },
  {
    tradeId: 'waste_clearance',
    tradeName: 'Waste Clearance & Environmental Services',
    defaultRiskTier: 'MEDIUM',
    mandatoryLicences: ['Environment Agency Upper Tier Waste Carrier Licence'],
    mandatoryEvidenceStreams: [
      'TRADE_LICENCE_MANDATORY',
      'WASTE_CARRIER_LICENCE',
      'INSURANCE_SCHEDULE',
    ],
    optionalEvidenceStreams: ['SSIP_MEMBER_SCHEME'],
    annualAuditRequired: true,
    internalNotes: 'Duty of Care Waste Transfer Notes (WTNs) mandatory for all consignments.',
  },
];

/**
 * Determine required evidence for a trade / risk tier combination
 */
export function getRequiredEvidenceForTrade(tradeId: string, riskTierOverride?: RiskTier): {
  rule: TradeQualificationRule;
  effectiveRiskTier: RiskTier;
  mandatoryEvidence: CompetencyEvidenceStream[];
} {
  const rule =
    CONTRACTOR_QUALIFICATION_MATRIX.find((m) => m.tradeId === tradeId) ||
    CONTRACTOR_QUALIFICATION_MATRIX.find((m) => m.tradeId === 'general_fabric')!;

  const effectiveRiskTier = riskTierOverride || rule.defaultRiskTier;
  return {
    rule,
    effectiveRiskTier,
    mandatoryEvidence: rule.mandatoryEvidenceStreams,
  };
}
