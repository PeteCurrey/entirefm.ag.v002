import {
  AssuranceRequirementDefinition,
  AssurancePlanItem,
  SupplierOnboardingPlan,
  SupplierDocumentRecord,
  SupplierInsuranceRecord,
  ServiceApprovalRecord,
  GeographicApprovalRecord,
  ComplianceHoldRecord,
  DataAccessClassification,
} from './assurance-types';
import { SupplierOrganisationRecord, RiskLevel, SupplierType } from './types';

/**
 * CANONICAL ASSURANCE REQUIREMENT CATALOGUE (CONFIGURABLE)
 */
export const CANONICAL_REQUIREMENT_CATALOGUE: AssuranceRequirementDefinition[] = [
  // 1. CORPORATE & REGISTRATION
  {
    id: 'req-corp-01',
    internal_code: 'CORP_COMPANIES_HOUSE',
    title: 'Companies House Registration & Status Confirmation',
    description: 'Active UK registration certificate, verified company number, and registered office address check.',
    category: 'CORPORATE',
    is_mandatory_by_default: true,
    evidence_type: 'STRUCTURED_DATA_ENTRY',
    consequence_on_expiry: 'MANUAL_REVIEW',
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-corp-02',
    internal_code: 'CORP_BANK_VERIFICATION',
    title: 'Corporate Bank Account Confirmation & Dual-Control Verification',
    description: 'Redacted bank statement / official voided cheque confirming BACS payment remittance details.',
    category: 'FINANCIAL',
    is_mandatory_by_default: true,
    evidence_type: 'BANK_STATEMENT',
    consequence_on_expiry: 'COMPLIANCE_HOLD',
    approval_authority_role: 'finance_officer',
    is_active: true,
    version: 1,
  },

  // 2. INSURANCE REQUIREMENTS
  {
    id: 'req-ins-01',
    internal_code: 'INS_PUBLIC_LIABILITY',
    title: 'Public & Products Liability Insurance (£5,000,000 Minimum)',
    description: 'Verified policy schedule providing indemnity of not less than £5M per occurrence.',
    category: 'INSURANCE',
    is_mandatory_by_default: true,
    evidence_type: 'DOCUMENT_UPLOAD',
    default_expiry_days: 365,
    consequence_on_expiry: 'COMPLIANCE_HOLD',
    required_minimum_insurance_limit_gbp: 5000000,
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-ins-02',
    internal_code: 'INS_EMPLOYERS_LIABILITY',
    title: 'Employers Liability Insurance (£10,000,000 Statutory)',
    description: 'Certificate of Employers Liability insurance covering direct and temporary operational workforce.',
    category: 'INSURANCE',
    is_mandatory_by_default: true,
    evidence_type: 'DOCUMENT_UPLOAD',
    default_expiry_days: 365,
    consequence_on_expiry: 'COMPLIANCE_HOLD',
    required_minimum_insurance_limit_gbp: 10000000,
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-ins-03',
    internal_code: 'INS_PROFESSIONAL_INDEMNITY',
    title: 'Professional Indemnity Insurance (£2,000,000 Minimum)',
    description: 'Required for technical design, surveying, consultancy, and specialist engineering disciplines.',
    category: 'INSURANCE',
    is_mandatory_by_default: false,
    evidence_type: 'DOCUMENT_UPLOAD',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    required_minimum_insurance_limit_gbp: 2000000,
    applicable_services: ['engineering', 'compliance-inspection', 'bms', 'consultancy'],
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-ins-04',
    internal_code: 'INS_CYBER_LIABILITY',
    title: 'Cyber & Data Liability Insurance (£1,000,000 Minimum)',
    description: 'Required for software, IoT telemetry, CAFM integration, and technology suppliers accessing client network data.',
    category: 'INFORMATION_SECURITY',
    is_mandatory_by_default: false,
    evidence_type: 'DOCUMENT_UPLOAD',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    required_minimum_insurance_limit_gbp: 1000000,
    applicable_supplier_types: ['TECHNOLOGY_PROVIDER'],
    applicable_data_access: ['PERSONAL_DATA', 'SENSITIVE_CLIENT_DATA', 'SYSTEM_ACCESS', 'PRIVILEGED_ACCESS'],
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },

  // 3. HEALTH & SAFETY AND GOVERNANCE
  {
    id: 'req-hs-01',
    internal_code: 'HS_POLICY_STATEMENT',
    title: 'Health & Safety Policy Statement & Competent Person Evidence',
    description: 'Signed corporate H&S policy statement and identification of designated qualified competent advice.',
    category: 'HEALTH_AND_SAFETY',
    is_mandatory_by_default: true,
    evidence_type: 'DOCUMENT_UPLOAD',
    default_expiry_days: 365,
    consequence_on_expiry: 'WARNING',
    approval_authority_role: 'hs_lead',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-hs-02',
    internal_code: 'HS_SSIP_ACCREDITATION',
    title: 'SSIP Member Scheme Accreditation (SafeContractor / CHAS / SMAS / Constructionline)',
    description: 'Current valid SSIP certificate providing mutual recognition for core health and safety management.',
    category: 'HEALTH_AND_SAFETY',
    is_mandatory_by_default: false, // Recommended, Stage 1 due diligence fallback if absent
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 365,
    consequence_on_expiry: 'WARNING',
    approval_authority_role: 'hs_lead',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-hs-03',
    internal_code: 'HS_RAMS_SAMPLE',
    title: 'Site-Specific Risk Assessment & Method Statement (RAMS) Sample',
    description: 'Representative task-specific RAMS demonstrating hazard identification, control hierarchy, and dynamic safety.',
    category: 'HEALTH_AND_SAFETY',
    is_mandatory_by_default: true,
    evidence_type: 'DOCUMENT_UPLOAD',
    consequence_on_expiry: 'MANUAL_REVIEW',
    approval_authority_role: 'hs_lead',
    is_active: true,
    version: 1,
  },

  // 4. TECHNICAL TRADE COMPETENCY (SERVICE-SPECIFIC)
  {
    id: 'req-tech-hvac-fgas',
    internal_code: 'TECH_FGAS_REFCOM',
    title: 'F-Gas Company Registration & REFCOM Certification',
    description: 'Mandatory company certification and technician qualifications for refrigerant handling and heat pumps.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 1095, // 3 years
    consequence_on_expiry: 'RESTRICT_SERVICE',
    applicable_services: ['hvac', 'refrigeration'],
    approval_authority_role: 'technical_head',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-tech-elec-niceic',
    internal_code: 'TECH_NICEIC_NAPIT',
    title: 'Electrical Competent Person Registration (NICEIC / NAPIT / ECA)',
    description: 'Approved contractor accreditation for commercial electrical installation and statutory EICR testing.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    applicable_services: ['electrical'],
    approval_authority_role: 'technical_head',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-tech-gas-safe',
    internal_code: 'TECH_GAS_SAFE',
    title: 'Gas Safe Commercial Registration & Category Verification',
    description: 'Current Gas Safe registration covering commercial direct/indirect fired appliances and pipework.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    applicable_services: ['gas', 'heating', 'mechanical'],
    approval_authority_role: 'technical_head',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-tech-rope-irata',
    internal_code: 'TECH_IRATA_ACCESS',
    title: 'IRATA Company Membership & Operative Logbook Verification',
    description: 'IRATA operator certification, Level 3 supervision arrangements, and equipment inspection logs.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    applicable_services: ['rope-access', 'working-at-height-rope-access-bmu'],
    approval_authority_role: 'technical_head',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-tech-fire-bafe',
    internal_code: 'TECH_BAFE_FIA',
    title: 'BAFE Scheme Registration / FIA Modular Competency',
    description: 'Certification under BAFE SP203-1 for fire alarm systems or SP101 for fire extinguisher servicing.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'ACCREDITATION_CERTIFICATE',
    default_expiry_days: 365,
    consequence_on_expiry: 'RESTRICT_SERVICE',
    applicable_services: ['fire-life-safety', 'fire-emergency-systems'],
    approval_authority_role: 'technical_head',
    is_active: true,
    version: 1,
  },
  {
    id: 'req-tech-clean-bics',
    internal_code: 'TECH_BICS_COSHH',
    title: 'BICSc Cleaning Standards & COSHH Assessment File',
    description: 'COSHH data sheets, operative chemical handling training, and British Institute of Cleaning Science standards.',
    category: 'TECHNICAL',
    is_mandatory_by_default: false,
    evidence_type: 'DOCUMENT_UPLOAD',
    consequence_on_expiry: 'WARNING',
    applicable_services: ['cleaning', 'cleaning-services'],
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },

  // 5. WORKFORCE & SUBCONTRACTING
  {
    id: 'req-wf-01',
    internal_code: 'WF_SUBCONTRACTOR_DECLARATION',
    title: 'Workforce Delivery Model & Subcontractor Declaration',
    description: 'Formal declaration of direct labour vs subcontracting proportions and second-tier due diligence procedures.',
    category: 'WORKFORCE',
    is_mandatory_by_default: true,
    evidence_type: 'DIGITAL_DECLARATION',
    default_expiry_days: 365,
    consequence_on_expiry: 'WARNING',
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },

  // 6. ETHICAL GOVERNANCE & CODE OF CONDUCT
  {
    id: 'req-eth-01',
    internal_code: 'ETH_CODE_OF_CONDUCT',
    title: 'EntireFM Supplier Code of Conduct & Ethical Compliance Commitment',
    description: 'Binding digital acceptance of fair wage standards, anti-slavery protocols, anti-bribery, and whistleblower protections.',
    category: 'ETHICAL',
    is_mandatory_by_default: true,
    evidence_type: 'DIGITAL_DECLARATION',
    default_expiry_days: 365,
    consequence_on_expiry: 'COMPLIANCE_HOLD',
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },

  // 7. INFORMATION SECURITY
  {
    id: 'req-sec-01',
    internal_code: 'SEC_DATA_PROTECTION_DPA',
    title: 'Information Security & Data Processing Agreement (DPA)',
    description: 'GDPR compliance declaration, encryption controls, and access boundaries for suppliers accessing systems or resident data.',
    category: 'INFORMATION_SECURITY',
    is_mandatory_by_default: false,
    evidence_type: 'DIGITAL_DECLARATION',
    consequence_on_expiry: 'COMPLIANCE_HOLD',
    applicable_supplier_types: ['TECHNOLOGY_PROVIDER', 'CONSULTANT'],
    applicable_data_access: ['PERSONAL_DATA', 'SENSITIVE_CLIENT_DATA', 'SYSTEM_ACCESS', 'PRIVILEGED_ACCESS'],
    approval_authority_role: 'compliance_manager',
    is_active: true,
    version: 1,
  },
];

/**
 * DETERMINISTIC ONBOARDING PLAN GENERATOR
 * Dynamically computes applicable requirements based on structured factors.
 */
export function generateSupplierOnboardingPlan(
  supplier: SupplierOrganisationRecord,
  options?: {
    dataAccessLevel?: DataAccessClassification;
    clientSector?: string;
  }
): SupplierOnboardingPlan {
  const dataAccess = options?.dataAccessLevel || 'BASIC_OPERATIONAL';
  const serviceSlugs = supplier.services.map((s) => s.service_slug.toLowerCase());
  const supplierTypes = supplier.supplier_types;
  const risk = supplier.risk_level;

  const applicableCatalogue = CANONICAL_REQUIREMENT_CATALOGUE.filter((req) => {
    if (!req.is_active) return false;

    // Check Service Applicability
    if (req.applicable_services && req.applicable_services.length > 0) {
      const match = req.applicable_services.some((srv) =>
        serviceSlugs.some((s) => s.includes(srv) || srv.includes(s))
      );
      if (!match) return false;
    }

    // Check Supplier Type Applicability
    if (req.applicable_supplier_types && req.applicable_supplier_types.length > 0) {
      const match = req.applicable_supplier_types.some((t) => supplierTypes.includes(t));
      if (!match) return false;
    }

    // Check Risk Level Applicability
    if (req.applicable_risk_levels && req.applicable_risk_levels.length > 0) {
      if (!req.applicable_risk_levels.includes(risk)) return false;
    }

    // Check Data Access Applicability
    if (req.applicable_data_access && req.applicable_data_access.length > 0) {
      if (!req.applicable_data_access.includes(dataAccess)) return false;
    }

    return true;
  });

  const items: AssurancePlanItem[] = applicableCatalogue.map((req) => {
    // Determine mandatory flag based on trade risk
    let isMandatory = req.is_mandatory_by_default;
    if (req.applicable_services && req.applicable_services.length > 0) {
      // Technical certificates for requested services are strictly mandatory
      isMandatory = true;
    }

    return {
      id: `item-${supplier.id}-${req.internal_code.toLowerCase()}`,
      requirement_id: req.id,
      internal_code: req.internal_code,
      title: req.title,
      category: req.category,
      description: req.description,
      is_mandatory: isMandatory,
      evidence_type: req.evidence_type,
      consequence_on_expiry: req.consequence_on_expiry,
      status: 'NOT_SUBMITTED',
      assigned_reviewer_role: req.approval_authority_role,
    };
  });

  const totalApplicable = items.length;
  const mandatoryItems = items.filter((i) => i.is_mandatory);
  const completedMandatory = mandatoryItems.filter((i) => i.status === 'ACCEPTED' || i.status === 'WAIVED').length;
  const percentage = mandatoryItems.length > 0
    ? Math.round((completedMandatory / mandatoryItems.length) * 100)
    : 100;

  return {
    id: `plan-${supplier.id}`,
    supplier_id: supplier.id,
    rule_version: 'v3.0.0-canonical',
    generated_at: new Date().toISOString(),
    risk_level: risk,
    total_applicable_items: totalApplicable,
    total_mandatory_items: mandatoryItems.length,
    completed_mandatory_items: completedMandatory,
    completion_percentage: percentage,
    is_onboarding_complete: percentage === 100,
    items,
  };
}

/**
 * RE-CALCULATE PLAN PROGRESS
 */
export function recalculatePlanProgress(plan: SupplierOnboardingPlan): SupplierOnboardingPlan {
  const mandatoryItems = plan.items.filter((i) => i.is_mandatory);
  const completedMandatory = mandatoryItems.filter((i) => i.status === 'ACCEPTED' || i.status === 'WAIVED').length;
  const percentage = mandatoryItems.length > 0
    ? Math.round((completedMandatory / mandatoryItems.length) * 100)
    : 100;

  return {
    ...plan,
    total_applicable_items: plan.items.length,
    total_mandatory_items: mandatoryItems.length,
    completed_mandatory_items: completedMandatory,
    completion_percentage: percentage,
    is_onboarding_complete: percentage === 100,
  };
}

/**
 * DOCUMENT EXPIRY RADAR CALCULATOR
 */
export function evaluateDocumentExpiry(
  document: SupplierDocumentRecord,
  now: Date = new Date()
): {
  daysRemaining: number | null;
  state: 'CURRENT' | 'EXPIRING' | 'EXPIRED';
  isExpired: boolean;
} {
  if (!document.expiry_date) {
    return { daysRemaining: null, state: 'CURRENT', isExpired: false };
  }

  const expiry = new Date(document.expiry_date);
  const diffTime = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { daysRemaining, state: 'EXPIRED', isExpired: true };
  }
  if (daysRemaining <= 60) {
    return { daysRemaining, state: 'EXPIRING', isExpired: false };
  }
  return { daysRemaining, state: 'CURRENT', isExpired: false };
}

/**
 * COMBINED DISPATCH ELIGIBILITY EVALUATION
 * Enforces strict compliance firewall and multi-dimensional approval checks.
 */
export function evaluateSupplierWorkEligibility(params: {
  supplier: SupplierOrganisationRecord;
  serviceSlug: string;
  cityOrRegion: string;
  clientId?: string;
  serviceApprovals: ServiceApprovalRecord[];
  geographicApprovals: GeographicApprovalRecord[];
  activeHolds: ComplianceHoldRecord[];
}): {
  isEligible: boolean;
  blockReason?: string;
  activeHold?: ComplianceHoldRecord;
} {
  const { supplier, serviceSlug, cityOrRegion, clientId, serviceApprovals, geographicApprovals, activeHolds } = params;

  // 1. Check Organisation Status
  if (supplier.compliance_status === 'SUSPENDED' || supplier.compliance_status === 'OFFBOARDED') {
    return { isEligible: false, blockReason: `Supplier is ${supplier.compliance_status}` };
  }

  // 2. Check Global Holds
  const globalHold = activeHolds.find((h) => h.is_active && h.hold_scope === 'GLOBAL');
  if (globalHold) {
    return { isEligible: false, blockReason: `Active Global Compliance Hold: ${globalHold.hold_reason}`, activeHold: globalHold };
  }

  // 3. Check Service-Specific Approval
  const srvApproval = serviceApprovals.find(
    (sa) => sa.service_slug.toLowerCase() === serviceSlug.toLowerCase()
  );
  if (!srvApproval || srvApproval.approval_status === 'NOT_APPROVED' || srvApproval.approval_status === 'RESTRICTED') {
    return { isEligible: false, blockReason: `Service '${serviceSlug}' is not approved for this supplier` };
  }

  // 4. Check Service-Specific Hold
  const serviceHold = activeHolds.find(
    (h) => h.is_active && h.hold_scope === 'SERVICE' && h.affected_service_slug?.toLowerCase() === serviceSlug.toLowerCase()
  );
  if (serviceHold) {
    return { isEligible: false, blockReason: `Active Hold on Service '${serviceSlug}': ${serviceHold.hold_reason}`, activeHold: serviceHold };
  }

  // 5. Check Geographic Approval
  const geoApproval = geographicApprovals.find(
    (ga) => ga.region_or_city.toLowerCase() === cityOrRegion.toLowerCase() && ga.is_approved
  );
  if (!supplier.is_national && !geoApproval) {
    return { isEligible: false, blockReason: `Supplier is not approved to deliver works in '${cityOrRegion}'` };
  }

  // 6. Check Client-Specific Hold
  if (clientId) {
    const clientHold = activeHolds.find(
      (h) => h.is_active && h.hold_scope === 'CLIENT' && h.affected_client_id === clientId
    );
    if (clientHold) {
      return { isEligible: false, blockReason: `Active Compliance Hold for Client '${clientId}': ${clientHold.hold_reason}`, activeHold: clientHold };
    }
  }

  return { isEligible: true };
}

/**
 * MANDATORY TRADE ACCREDITATION RESOLUTION
 */
export function getMandatoryAccreditationCodesForTrade(trade: string): string[] {
  const norm = trade.toLowerCase().replace(/_/g, '-');
  const codes: string[] = [];
  if (norm.includes('hvac') || norm.includes('refrigeration')) {
    codes.push('TECH_FGAS_REFCOM');
  }
  if (norm.includes('electrical')) {
    codes.push('TECH_NICEIC_NAPIT');
  }
  if (norm.includes('gas') || norm.includes('heating')) {
    codes.push('TECH_GAS_SAFE');
  }
  if (norm.includes('fire')) {
    codes.push('TECH_BAFE_FIA');
  }
  if (norm.includes('rope') || norm.includes('height')) {
    codes.push('TECH_IRATA_ACCESS');
  }
  return codes;
}

export interface SupplierAssuranceFirewallParams {
  supplierId: string;
  trade: string;
  clientId?: string;
  siteId?: string;
  cityOrRegion?: string;
  isSuspended?: boolean;
  complianceHolds?: ComplianceHoldRecord[];
  insuranceRecords?: SupplierInsuranceRecord[];
  documentRecords?: SupplierDocumentRecord[];
  providerProfile?: {
    insurance_verified?: boolean;
    public_liability_limit?: number;
    employers_liability_limit?: number;
    insurance_expiry?: string;
    vetting_status?: string;
  };
  settingsInsurance?: {
    public_liability?: { limit_gbp?: number; expiry_date?: string; status?: string };
    employers_liability?: { limit_gbp?: number; expiry_date?: string; status?: string };
  };
  lookupFailed?: boolean;
  now?: Date;
}

export interface SupplierAssuranceFirewallResult {
  isCompliant: boolean;
  passedChecks: string[];
  failedChecks: string[];
  exclusionReasons: string[];
  activeHolds: ComplianceHoldRecord[];
  blockingDetails?: {
    reason: string;
    hold?: ComplianceHoldRecord;
    expiryDate?: string;
    evidenceType?: string;
  };
}

/**
 * CANONICAL SYSTEM B SUPPLIER ASSURANCE FIREWALL
 * ===============================================
 * Authoritative fail-closed assurance gate.
 * A supplier NEVER receives COMPLIANCE_CLEAR merely because is_suspended === false.
 * Must have unexpired £5M Public Liability, £10M Employers Liability, zero active holds,
 * and valid statutory trade accreditations where applicable.
 */
export function evaluateSupplierAssuranceFirewall(
  params: SupplierAssuranceFirewallParams
): SupplierAssuranceFirewallResult {
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  const exclusionReasons: string[] = [];
  const activeHoldsList: ComplianceHoldRecord[] = [];
  const now = params.now || new Date();

  // 1. Fail-closed on Database / Lookup Failure
  if (params.lookupFailed) {
    failedChecks.push('ASSURANCE_UNVERIFIED');
    exclusionReasons.push('Authoritative compliance assurance records could not be verified (system fail-closed)');
    return {
      isCompliant: false,
      passedChecks,
      failedChecks,
      exclusionReasons,
      activeHolds: [],
      blockingDetails: { reason: 'ASSURANCE_UNVERIFIED', evidenceType: 'SYSTEM_LOOKUP' },
    };
  }

  // 2. Administrative / Compliance Suspension Gate
  if (params.isSuspended) {
    failedChecks.push('CONTRACTOR_SUSPENDED');
    exclusionReasons.push('Contractor has an active administrative or compliance suspension');
  }

  // 3. Active Compliance Holds Gate
  const activeHolds = (params.complianceHolds || []).filter((h) => h.is_active);
  const normTrade = params.trade.toLowerCase().replace(/_/g, '-');

  for (const hold of activeHolds) {
    let matchesHold = false;
    let holdDetail = '';

    if (hold.hold_scope === 'GLOBAL') {
      matchesHold = true;
      holdDetail = `Active Global Compliance Hold: ${hold.hold_reason} (Raised: ${hold.raised_at})`;
    } else if (
      hold.hold_scope === 'SERVICE' &&
      hold.affected_service_slug &&
      (normTrade.includes(hold.affected_service_slug.toLowerCase()) ||
        hold.affected_service_slug.toLowerCase().includes(normTrade))
    ) {
      matchesHold = true;
      holdDetail = `Active Service Compliance Hold on '${params.trade}': ${hold.hold_reason} (Raised: ${hold.raised_at})`;
    } else if (hold.hold_scope === 'CLIENT' && params.clientId && hold.affected_client_id === params.clientId) {
      matchesHold = true;
      holdDetail = `Active Client Compliance Hold for '${params.clientId}': ${hold.hold_reason} (Raised: ${hold.raised_at})`;
    } else if (
      hold.hold_scope === 'GEOGRAPHY' &&
      params.cityOrRegion &&
      hold.affected_city &&
      hold.affected_city.toLowerCase().trim() === params.cityOrRegion.toLowerCase().trim()
    ) {
      matchesHold = true;
      holdDetail = `Active Regional Compliance Hold for '${params.cityOrRegion}': ${hold.hold_reason} (Raised: ${hold.raised_at})`;
    }

    if (matchesHold) {
      activeHoldsList.push(hold);
      if (!failedChecks.includes('COMPLIANCE_HOLD')) {
        failedChecks.push('COMPLIANCE_HOLD');
      }
      exclusionReasons.push(holdDetail);
    }
  }

  // 4. Mandatory Public & Products Liability Insurance (£5,000,000 Minimum)
  const plRecord = (params.insuranceRecords || []).find((i) => i.insurance_type === 'PUBLIC_LIABILITY');
  const plLimit = plRecord
    ? plRecord.limit_gbp
    : (params.settingsInsurance?.public_liability?.limit_gbp ?? params.providerProfile?.public_liability_limit);
  const plExpiry = plRecord
    ? plRecord.expiry_date
    : (params.settingsInsurance?.public_liability?.expiry_date ?? params.providerProfile?.insurance_expiry);
  const plStatus = plRecord
    ? plRecord.status
    : (params.settingsInsurance?.public_liability?.status ??
      (params.providerProfile?.insurance_verified ? 'VALID' : undefined));

  if (plLimit == null || !plExpiry) {
    failedChecks.push('INSURANCE_MISSING');
    exclusionReasons.push('Mandatory Public & Products Liability Insurance (£5,000,000 minimum) is missing from file');
  } else {
    const isPlExpired = new Date(plExpiry).getTime() < now.getTime();
    if (isPlExpired || plStatus === 'EXPIRED') {
      failedChecks.push('INSURANCE_EXPIRED');
      exclusionReasons.push(`Public Liability Insurance expired on ${plExpiry}`);
    } else if (plLimit < 5000000 || plStatus === 'BELOW_LIMIT') {
      failedChecks.push('INSURANCE_BELOW_LIMIT');
      exclusionReasons.push(
        `Public Liability Insurance indemnity (£${plLimit.toLocaleString()}) is below mandatory £5,000,000 minimum`
      );
    } else {
      passedChecks.push('PUBLIC_LIABILITY_VERIFIED');
    }
  }

  // 5. Mandatory Employers Liability Insurance (£10,000,000 Statutory Minimum)
  const elRecord = (params.insuranceRecords || []).find((i) => i.insurance_type === 'EMPLOYERS_LIABILITY');
  const elLimit = elRecord
    ? elRecord.limit_gbp
    : (params.settingsInsurance?.employers_liability?.limit_gbp ?? params.providerProfile?.employers_liability_limit);
  const elExpiry = elRecord
    ? elRecord.expiry_date
    : (params.settingsInsurance?.employers_liability?.expiry_date ?? params.providerProfile?.insurance_expiry);
  const elStatus = elRecord
    ? elRecord.status
    : (params.settingsInsurance?.employers_liability?.status ??
      (params.providerProfile?.insurance_verified && elLimit ? 'VALID' : undefined));

  if (elLimit == null || !elExpiry) {
    failedChecks.push('INSURANCE_MISSING');
    exclusionReasons.push('Mandatory Employers Liability Insurance (£10,000,000 statutory) is missing from file');
  } else {
    const isElExpired = new Date(elExpiry).getTime() < now.getTime();
    if (isElExpired || elStatus === 'EXPIRED') {
      failedChecks.push('INSURANCE_EXPIRED');
      exclusionReasons.push(`Employers Liability Insurance expired on ${elExpiry}`);
    } else if (elLimit < 10000000 || elStatus === 'BELOW_LIMIT') {
      failedChecks.push('INSURANCE_BELOW_LIMIT');
      exclusionReasons.push(
        `Employers Liability Insurance indemnity (£${elLimit.toLocaleString()}) is below mandatory £10,000,000 statutory requirement`
      );
    } else {
      passedChecks.push('EMPLOYERS_LIABILITY_VERIFIED');
    }
  }

  // 6. Mandatory Technical Trade Accreditations
  const requiredAccredCodes = getMandatoryAccreditationCodesForTrade(params.trade);
  if (requiredAccredCodes.length > 0) {
    const docs = params.documentRecords || [];
    for (const reqCode of requiredAccredCodes) {
      const matchDoc = docs.find((d) => {
        const dt = (d.document_type || '').toUpperCase().replace(/[-]/g, '_');
        const rc = reqCode.toUpperCase().replace(/[-]/g, '_');
        return dt === rc || rc.includes(dt) || dt.includes(rc) ||
          (rc.includes('FGAS') && dt.includes('FGAS')) ||
          (rc.includes('GAS_SAFE') && dt.includes('GAS')) ||
          (rc.includes('NICEIC') && (dt.includes('NICEIC') || dt.includes('NAPIT'))) ||
          (rc.includes('BAFE') && (dt.includes('BAFE') || dt.includes('FIA'))) ||
          (rc.includes('IRATA') && dt.includes('IRATA'));
      });

      if (!matchDoc) {
        failedChecks.push('ACCREDITATION_MISSING');
        exclusionReasons.push(`Mandatory technical accreditation '${reqCode}' for trade '${params.trade}' is missing from file`);
      } else {
        const isDocExpired =
          Boolean(matchDoc.expiry_date && new Date(matchDoc.expiry_date).getTime() < now.getTime()) ||
          matchDoc.document_state === 'EXPIRED';

        if (isDocExpired) {
          failedChecks.push('ACCREDITATION_EXPIRED');
          exclusionReasons.push(`Mandatory technical accreditation '${matchDoc.document_type}' expired on ${matchDoc.expiry_date}`);
        } else if (matchDoc.review_status && matchDoc.review_status !== 'ACCEPTED') {
          failedChecks.push('ACCREDITATION_UNVERIFIED');
          exclusionReasons.push(
            `Mandatory technical accreditation '${matchDoc.document_type}' is unverified (status: '${matchDoc.review_status}')`
          );
        } else {
          passedChecks.push(`ACCREDITATION_VERIFIED_${reqCode}`);
        }
      }
    }
  } else {
    passedChecks.push('TRADE_ACCREDITATION_NOT_APPLICABLE');
  }

  const isCompliant = failedChecks.length === 0;
  if (isCompliant) {
    passedChecks.push('COMPLIANCE_CLEAR');
  }

  let blockingDetails: SupplierAssuranceFirewallResult['blockingDetails'] = undefined;
  if (!isCompliant) {
    const primaryReason = failedChecks[0];
    const primaryHold = activeHoldsList[0];
    blockingDetails = {
      reason: primaryReason,
      hold: primaryHold,
      expiryDate: primaryReason === 'INSURANCE_EXPIRED' ? (plExpiry || elExpiry) : undefined,
      evidenceType: primaryReason.startsWith('INSURANCE') ? 'INSURANCE' : primaryReason.startsWith('ACCREDITATION') ? 'DOCUMENT' : 'COMPLIANCE_HOLD',
    };
  }

  return {
    isCompliant,
    passedChecks,
    failedChecks,
    exclusionReasons,
    activeHolds: activeHoldsList,
    blockingDetails,
  };
}

