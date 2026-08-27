/**
 * ENTIREFM CONTRACTOR COMPLIANCE INTELLIGENCE ENGINE (CP-03)
 * ==========================================================
 * Canonical Source of Truth for:
 * 1. Data-driven compliance requirements catalogue across 9 categories
 * 2. Dynamic applicability engine based on contractor profile, trades & size
 * 3. Deterministic compliance scoring (excluding non-applicable controls)
 * 4. Critical operational overrides (e.g. expired insurance -> RESTRICTED)
 * 5. Multi-dimensional eligibility checking (Org, Trade, Service, Client)
 * 6. Audit-ready compliance history and verification workflows
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ComplianceCategory =
  | 'CORPORATE'
  | 'INSURANCE'
  | 'HEALTH_AND_SAFETY'
  | 'ENVIRONMENTAL'
  | 'QUALITY'
  | 'GOVERNANCE_AND_ETHICS'
  | 'INFORMATION_SECURITY'
  | 'WORKFORCE'
  | 'TRADE_SPECIFIC';

export type RequirementCriticality = 'CRITICAL' | 'MANDATORY' | 'STANDARD' | 'OPTIONAL';

export type EvidenceType =
  | 'DOCUMENT_UPLOAD'
  | 'ACCREDITATION_CERTIFICATE'
  | 'DIGITAL_DECLARATION'
  | 'STRUCTURED_DATA'
  | 'EXTERNAL_VERIFICATION'
  | 'GENERATED_RECORD'
  | 'ENTIREFM_REVIEW';

export type RequirementState =
  | 'COMPLIANT'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'MISSING'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'ACTION_REQUIRED'
  | 'NOT_APPLICABLE'
  | 'OPTIONAL';

export type OperationalStatus =
  | 'COMPLIANT'
  | 'COMPLIANT_RENEWALS_UPCOMING'
  | 'ACTION_REQUIRED'
  | 'RESTRICTED'
  | 'SUSPENDED';

export interface ComplianceRequirementDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  criticality: RequirementCriticality;
  evidenceType: EvidenceType;
  defaultExpiryDays?: number;
  requiredMinimumLimitGbp?: number;
  applicableTrades?: string[];
  applicableOrgTypes?: string[];
  requiresEmployees?: boolean;
  requiresSubcontractors?: boolean;
  requiresHighRisk?: boolean;
  approvalAuthorityRole: 'COMPLIANCE_MANAGER' | 'HS_LEAD' | 'TECHNICAL_HEAD' | 'FINANCE_OFFICER';
  helpText?: string;
  version: number;
}

export interface EvaluatedRequirement {
  id: string;
  requirementId: string;
  code: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  criticality: RequirementCriticality;
  evidenceType: EvidenceType;
  state: RequirementState;
  isApplicable: boolean;
  isMandatory: boolean;
  
  // Evidence details if available
  evidenceDocumentId?: string;
  evidenceFileName?: string;
  evidenceFileUrl?: string;
  issueDate?: string;
  expiryDate?: string;
  daysUntilExpiry?: number | null;
  coverAmountGbp?: number;
  policyNumber?: string;
  insurerOrBody?: string;
  
  // Verification details
  verificationStatus: 'NOT_REQUIRED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUPERSEDED';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  contractorVisibleNote?: string;
  
  // Action details
  actionRequired?: string;
  actionPriority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  actionDeadline?: string;
}

export interface ContractorComplianceSummary {
  contractorOrgId: string;
  contractorName: string;
  lifecycleStatus: string;
  operationalStatus: OperationalStatus;
  complianceScorePct: number;
  totalApplicableMandatory: number;
  totalSatisfiedMandatory: number;
  criticalActionsCount: number;
  highPriorityActionsCount: number;
  upcomingRenewalsCount: number;
  underReviewCount: number;
  rejectedCount: number;
  missingCount: number;
  categories: {
    category: ComplianceCategory;
    title: string;
    totalApplicable: number;
    satisfiedCount: number;
    status: 'COMPLIANT' | 'WARNING' | 'ACTION_REQUIRED' | 'UNDER_REVIEW';
  }[];
  actions: {
    id: string;
    requirementCode: string;
    title: string;
    category: ComplianceCategory;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    resolutionCta: string;
    deadline?: string;
    documentId?: string;
  }[];
  requirements: EvaluatedRequirement[];
  lastEvaluatedAt: string;
}

// ── Canonical Compliance Requirements Catalogue ──────────────────────────────

export const CANONICAL_REQUIREMENTS_CATALOGUE: ComplianceRequirementDefinition[] = [
  // 1. CORPORATE
  {
    id: 'req-corp-reg',
    code: 'CORP_COMPANIES_HOUSE',
    title: 'Companies House Registration & Status',
    description: 'Active UK registration, verified company number, and confirmed registered office address.',
    category: 'CORPORATE',
    criticality: 'CRITICAL',
    evidenceType: 'STRUCTURED_DATA',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    helpText: 'Automatically verified via Companies House records or official certificate of incorporation.',
    version: 1,
  },
  {
    id: 'req-corp-vat',
    code: 'CORP_VAT_CONFIRMATION',
    title: 'VAT Registration Confirmation',
    description: 'Verified HMRC VAT registration number where applicable to commercial turnover.',
    category: 'CORPORATE',
    criticality: 'STANDARD',
    evidenceType: 'STRUCTURED_DATA',
    approvalAuthorityRole: 'FINANCE_OFFICER',
    version: 1,
  },

  // 2. INSURANCE
  {
    id: 'req-ins-pl',
    code: 'INS_PUBLIC_LIABILITY',
    title: 'Public & Products Liability Insurance (£5M Minimum)',
    description: 'Verified policy schedule providing indemnity of not less than £5,000,000 per occurrence.',
    category: 'INSURANCE',
    criticality: 'CRITICAL',
    evidenceType: 'DOCUMENT_UPLOAD',
    defaultExpiryDays: 365,
    requiredMinimumLimitGbp: 5000000,
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    helpText: 'Mandatory for all field attendance. Work dispatch is restricted immediately upon expiry.',
    version: 1,
  },
  {
    id: 'req-ins-el',
    code: 'INS_EMPLOYERS_LIABILITY',
    title: 'Employers Liability Insurance (£10M Statutory)',
    description: 'Statutory certificate of Employers Liability insurance covering direct and operational workforce.',
    category: 'INSURANCE',
    criticality: 'CRITICAL',
    evidenceType: 'DOCUMENT_UPLOAD',
    defaultExpiryDays: 365,
    requiredMinimumLimitGbp: 10000000,
    requiresEmployees: true, // Not applicable to single-person sole traders with no employees
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },
  {
    id: 'req-ins-pi',
    code: 'INS_PROFESSIONAL_INDEMNITY',
    title: 'Professional Indemnity Insurance (£2M Minimum)',
    description: 'Required for technical design, surveying, consultancy, engineering validation, and design-build.',
    category: 'INSURANCE',
    criticality: 'MANDATORY',
    evidenceType: 'DOCUMENT_UPLOAD',
    defaultExpiryDays: 365,
    requiredMinimumLimitGbp: 2000000,
    applicableTrades: ['engineering', 'consultancy', 'surveying', 'bms', 'fire-design', 'water-hygiene-consulting'],
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 3. HEALTH & SAFETY
  {
    id: 'req-hs-policy',
    code: 'HS_POLICY_STATEMENT',
    title: 'Health & Safety Policy Statement & Competent Person',
    description: 'Signed corporate Health & Safety policy statement identifying designated qualified competent advice.',
    category: 'HEALTH_AND_SAFETY',
    criticality: 'MANDATORY',
    evidenceType: 'DOCUMENT_UPLOAD',
    defaultExpiryDays: 365,
    approvalAuthorityRole: 'HS_LEAD',
    version: 1,
  },
  {
    id: 'req-hs-ssip',
    code: 'HS_SSIP_ACCREDITATION',
    title: 'SSIP Member Scheme Accreditation (SafeContractor / CHAS / SMAS / Alcumus)',
    description: 'Valid SSIP certificate providing mutual recognition of core health and safety management.',
    category: 'HEALTH_AND_SAFETY',
    criticality: 'MANDATORY',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 365,
    approvalAuthorityRole: 'HS_LEAD',
    version: 1,
  },
  {
    id: 'req-hs-rams',
    code: 'HS_RAMS_SAMPLE',
    title: 'Task-Specific Risk Assessment & Method Statement (RAMS)',
    description: 'Representative task-specific RAMS demonstrating hazard identification, control hierarchy, and dynamic safety.',
    category: 'HEALTH_AND_SAFETY',
    criticality: 'MANDATORY',
    evidenceType: 'DOCUMENT_UPLOAD',
    approvalAuthorityRole: 'HS_LEAD',
    version: 1,
  },
  {
    id: 'req-hs-coshh',
    code: 'HS_COSHH_ASSESSMENT',
    title: 'COSHH Assessment & Chemical Safety File',
    description: 'Material Safety Data Sheets and risk controls for substances hazardous to health.',
    category: 'HEALTH_AND_SAFETY',
    criticality: 'STANDARD',
    evidenceType: 'DOCUMENT_UPLOAD',
    applicableTrades: ['cleaning', 'water-treatment', 'pest-control', 'grounds', 'painting', 'hvac-chemical-dosing'],
    approvalAuthorityRole: 'HS_LEAD',
    version: 1,
  },
  {
    id: 'req-hs-work-at-height',
    code: 'HS_WORK_AT_HEIGHT',
    title: 'Working at Height Procedures & Fall Protection Protocol',
    description: 'Documented safe system of work for roof access, MEWPs, scaffolding, and harness inspection registers.',
    category: 'HEALTH_AND_SAFETY',
    criticality: 'MANDATORY',
    evidenceType: 'DOCUMENT_UPLOAD',
    applicableTrades: ['roofing', 'rope-access', 'window-cleaning', 'cladding', 'drainage-gutters', 'hvac-rooftop'],
    approvalAuthorityRole: 'HS_LEAD',
    version: 1,
  },

  // 4. ENVIRONMENTAL
  {
    id: 'req-env-policy',
    code: 'ENV_POLICY_STATEMENT',
    title: 'Environmental & Sustainability Policy',
    description: 'Corporate commitment to waste hierarchy, carbon footprint reduction, and environmental protection.',
    category: 'ENVIRONMENTAL',
    criticality: 'STANDARD',
    evidenceType: 'DOCUMENT_UPLOAD',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },
  {
    id: 'req-env-waste-carrier',
    code: 'ENV_WASTE_CARRIER_LICENCE',
    title: 'Environment Agency Waste Carrier Licence',
    description: 'Upper Tier / Lower Tier Waste Carrier Registration for transporting job debris or controlled waste.',
    category: 'ENVIRONMENTAL',
    criticality: 'MANDATORY',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 1095, // 3 years
    applicableTrades: ['waste-management', 'drainage', 'general-building', 'grounds', 'clearance', 'plumbing'],
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 5. QUALITY
  {
    id: 'req-qual-policy',
    code: 'QUAL_POLICY_AND_SLA',
    title: 'Quality Management Policy & Defect Rectification',
    description: 'Documented quality assurance procedures, complaint handling, and first-time-fix governance.',
    category: 'QUALITY',
    criticality: 'STANDARD',
    evidenceType: 'DOCUMENT_UPLOAD',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 6. GOVERNANCE & ETHICS
  {
    id: 'req-gov-code-of-conduct',
    code: 'GOV_CODE_OF_CONDUCT',
    title: 'EntireFM Supplier Code of Conduct & Ethical Compliance Commitment',
    description: 'Binding digital acceptance of fair wage standards, anti-slavery protocols, anti-bribery, and whistleblowing.',
    category: 'GOVERNANCE_AND_ETHICS',
    criticality: 'CRITICAL',
    evidenceType: 'DIGITAL_DECLARATION',
    defaultExpiryDays: 365,
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },
  {
    id: 'req-gov-modern-slavery',
    code: 'GOV_MODERN_SLAVERY',
    title: 'Modern Slavery & Supply Chain Due Diligence Statement',
    description: 'Policy controls preventing forced labour, ensuring right-to-work verification across all tiers.',
    category: 'GOVERNANCE_AND_ETHICS',
    criticality: 'MANDATORY',
    evidenceType: 'DIGITAL_DECLARATION',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 7. INFORMATION SECURITY
  {
    id: 'req-sec-gdpr',
    code: 'SEC_DATA_PROTECTION_GDPR',
    title: 'Data Protection & GDPR Operational Safeguards',
    description: 'Declaration of secure data handling, non-disclosure of resident data, and cyber breach reporting procedures.',
    category: 'INFORMATION_SECURITY',
    criticality: 'MANDATORY',
    evidenceType: 'DIGITAL_DECLARATION',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 8. WORKFORCE
  {
    id: 'req-wf-subcontractor',
    code: 'WF_SUBCONTRACTOR_GOVERNANCE',
    title: 'Workforce Delivery Model & Subcontractor Due Diligence',
    description: 'Declaration of direct labour proportions and cascading compliance controls for secondary labour.',
    category: 'WORKFORCE',
    criticality: 'MANDATORY',
    evidenceType: 'DIGITAL_DECLARATION',
    defaultExpiryDays: 365,
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },
  {
    id: 'req-wf-training-matrix',
    code: 'WF_TRAINING_MATRIX',
    title: 'Operative Competency & Training Matrix Maintenance',
    description: 'Maintained register of engineer qualifications, trade cards (CSCS/ECS), and statutory refreshers.',
    category: 'WORKFORCE',
    criticality: 'MANDATORY',
    evidenceType: 'STRUCTURED_DATA',
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },

  // 9. TRADE-SPECIFIC REGULATED ACCREDITATIONS
  {
    id: 'req-trade-niceic',
    code: 'TRADE_NICEIC_NAPIT_ECA',
    title: 'Electrical Competent Person Scheme (NICEIC / NAPIT / ECA)',
    description: 'Approved Contractor registration for commercial electrical installations and statutory EICR condition reporting.',
    category: 'TRADE_SPECIFIC',
    criticality: 'CRITICAL',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 365,
    applicableTrades: ['electrical', 'ev-charging', 'lighting', 'power', 'fire-alarms-install'],
    approvalAuthorityRole: 'TECHNICAL_HEAD',
    version: 1,
  },
  {
    id: 'req-trade-gas-safe',
    code: 'TRADE_GAS_SAFE_REGISTER',
    title: 'Gas Safe Commercial Registration & Category Scope',
    description: 'Valid Gas Safe registration covering commercial direct/indirect fired appliances, boilers, and pipework.',
    category: 'TRADE_SPECIFIC',
    criticality: 'CRITICAL',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 365,
    applicableTrades: ['gas', 'heating', 'commercial-boilers', 'mechanical', 'plumbing-gas'],
    approvalAuthorityRole: 'TECHNICAL_HEAD',
    version: 1,
  },
  {
    id: 'req-trade-fgas',
    code: 'TRADE_FGAS_REFCOM',
    title: 'F-Gas Company Registration & REFCOM Elite Certification',
    description: 'Company certification and refrigerant handling qualifications for DX air conditioning, VRF/VRV, and chillers.',
    category: 'TRADE_SPECIFIC',
    criticality: 'CRITICAL',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 1095, // 3 years
    applicableTrades: ['hvac', 'refrigeration', 'air-conditioning', 'chillers', 'heat-pumps'],
    approvalAuthorityRole: 'TECHNICAL_HEAD',
    version: 1,
  },
  {
    id: 'req-trade-irata',
    code: 'TRADE_IRATA_ROPE_ACCESS',
    title: 'IRATA Company Membership & Operative Logbook Verification',
    description: 'IRATA operator certification, Level 3 supervision arrangements, and equipment inspection logs.',
    category: 'TRADE_SPECIFIC',
    criticality: 'CRITICAL',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 365,
    applicableTrades: ['rope-access', 'working-at-height-rope-access-bmu', 'abseil-maintenance'],
    approvalAuthorityRole: 'TECHNICAL_HEAD',
    version: 1,
  },
  {
    id: 'req-trade-bafe',
    code: 'TRADE_BAFE_FIRE_SAFETY',
    title: 'BAFE Scheme Registration (SP203-1 / SP101) & FIA Certification',
    description: 'Certified scheme competence for fire alarm systems, detection, suppression, or portable extinguishers.',
    category: 'TRADE_SPECIFIC',
    criticality: 'CRITICAL',
    evidenceType: 'ACCREDITATION_CERTIFICATE',
    defaultExpiryDays: 365,
    applicableTrades: ['fire-life-safety', 'fire-emergency-systems', 'fire-alarms', 'fire-extinguishers'],
    approvalAuthorityRole: 'TECHNICAL_HEAD',
    version: 1,
  },
  {
    id: 'req-trade-bics',
    code: 'TRADE_BICS_CLEANING',
    title: 'BICSc Cleaning Standards & Colour-Coded Hygiene Protocol',
    description: 'British Institute of Cleaning Science accredited procedures, cross-contamination controls, and audit checklists.',
    category: 'TRADE_SPECIFIC',
    criticality: 'STANDARD',
    evidenceType: 'DOCUMENT_UPLOAD',
    applicableTrades: ['cleaning', 'commercial-cleaning', 'window-cleaning', 'deep-clean'],
    approvalAuthorityRole: 'COMPLIANCE_MANAGER',
    version: 1,
  },
];

// ── Dynamic Applicability Engine ──────────────────────────────────────────────

export interface ContractorApplicabilityProfile {
  orgId: string;
  legalName: string;
  businessType?: string;
  hasEmployees: boolean;
  hasSubcontractors: boolean;
  declaredTrades: string[];
  declaredRegions: string[];
  isNational: boolean;
  lifecycleStatus: string;
}

/**
 * Determines whether a compliance requirement applies to a specific contractor profile.
 */
export function isRequirementApplicable(
  req: ComplianceRequirementDefinition,
  profile: ContractorApplicabilityProfile
): boolean {
  // Check employee requirement (e.g. Employers Liability is exempt for sole traders with 0 employees)
  if (req.requiresEmployees && !profile.hasEmployees) {
    return false;
  }

  // Check subcontractor governance
  if (req.requiresSubcontractors && !profile.hasSubcontractors) {
    return false;
  }

  // Check Trade Applicability
  if (req.applicableTrades && req.applicableTrades.length > 0) {
    const normalisedDeclared = profile.declaredTrades.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const matches = req.applicableTrades.some((tradeReq) => {
      const normReq = tradeReq.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalisedDeclared.some((dec) => dec.includes(normReq) || normReq.includes(dec));
    });
    if (!matches) return false;
  }

  return true;
}

// ── Deterministic Scoring & Evaluation Service ───────────────────────────────

/**
 * Evaluates the full compliance state for a contractor organisation.
 * Strictly calculates score: `valid satisfied mandatory / applicable mandatory`.
 * Determines OperationalStatus with critical overrides.
 */
export async function evaluateContractorCompliance(
  orgId: string,
  session?: UserSession
): Promise<ContractorComplianceSummary> {
  const now = new Date();

  // 1. Retrieve contractor profile, application draft, and documents
  const [orgRes, draftRes, docsRes, legacyDocsRes] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(orgId)}&select=*`),
    dbQuery<any[]>(`supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&select=*`),
    dbQuery<any[]>(`supplier_documents?supplier_id=eq.${encodeURIComponent(orgId)}&select=*`),
    dbQuery<any[]>(`contractor_compliance_documents?provider_organisation_id=eq.${encodeURIComponent(orgId)}&select=*`),
  ]);

  const org = orgRes.data?.[0] || null;
  const draft = draftRes.data?.[0] || null;
  const supplierDocs = docsRes.data || [];
  const legacyDocs = legacyDocsRes.data || [];

  // Combine documents cleanly (avoiding duplicates)
  const allDocs = [
    ...supplierDocs.map((d: any) => ({
      id: d.id,
      documentType: d.document_type || d.category,
      fileName: d.file_name || 'Document.pdf',
      fileUrl: d.file_url,
      issueDate: d.issue_date,
      expiryDate: d.expiry_date,
      status: d.status || 'UPLOADED',
      uploadedAt: d.uploaded_at || d.created_at,
      uploadedBy: d.uploaded_by,
      notes: d.notes,
    })),
    ...legacyDocs.map((d: any) => ({
      id: d.id,
      documentType: d.document_type,
      fileName: d.document_title || 'Document.pdf',
      fileUrl: d.storage_path,
      issueDate: undefined,
      expiryDate: d.expiry_date,
      status: d.review_status === 'VERIFIED' ? 'ACCEPTED' : d.review_status || 'UPLOADED',
      uploadedAt: d.created_at,
      uploadedBy: d.uploaded_by_person_id,
      notes: d.rejection_reason,
    })),
  ];

  // Build Contractor Applicability Profile
  const declaredTrades: string[] = [];
  if (draft?.selected_services && Array.isArray(draft.selected_services)) {
    declaredTrades.push(...draft.selected_services);
  }
  if (draft?.custom_services) {
    declaredTrades.push(draft.custom_services);
  }

  const employeeCount = parseInt(draft?.employee_count || draft?.field_operatives_count || '5', 10);
  const hasEmployees = !isNaN(employeeCount) ? employeeCount > 1 : true;
  const hasSubcontractors = draft?.has_subcontractors === true || (draft?.subcontractor_pct || 0) > 0;

  const profile: ContractorApplicabilityProfile = {
    orgId,
    legalName: org?.legal_name || draft?.legal_company_name || 'Contractor Organisation',
    businessType: draft?.business_type,
    hasEmployees,
    hasSubcontractors,
    declaredTrades,
    declaredRegions: draft?.selected_regions || [],
    isNational: draft?.coverage_type === 'NATIONAL' || draft?.national_mobilisation === true,
    lifecycleStatus: org?.lifecycle_status || draft?.lifecycle_status || 'DRAFT',
  };

  const evaluatedRequirements: EvaluatedRequirement[] = [];
  const actions: ContractorComplianceSummary['actions'] = [];

  let totalApplicableMandatory = 0;
  let totalSatisfiedMandatory = 0;
  let hasCriticalExpiry = false;
  let hasCriticalMissing = false;
  let upcomingRenewalsCount = 0;
  let underReviewCount = 0;
  let rejectedCount = 0;
  let missingCount = 0;

  // 2. Iterate and evaluate each canonical requirement
  for (const req of CANONICAL_REQUIREMENTS_CATALOGUE) {
    const isApplicable = isRequirementApplicable(req, profile);
    const isMandatory = req.criticality === 'CRITICAL' || req.criticality === 'MANDATORY';

    if (!isApplicable) {
      evaluatedRequirements.push({
        id: `eval-${orgId}-${req.code.toLowerCase()}`,
        requirementId: req.id,
        code: req.code,
        title: req.title,
        description: req.description,
        category: req.category,
        criticality: req.criticality,
        evidenceType: req.evidenceType,
        state: 'NOT_APPLICABLE',
        isApplicable: false,
        isMandatory: false,
        verificationStatus: 'NOT_REQUIRED',
      });
      continue;
    }

    if (isMandatory) {
      totalApplicableMandatory++;
    }

    // Match document evidence for this requirement
    const matchedDoc = allDocs.find((d) => {
      const type = (d.documentType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const reqCode = req.code.toUpperCase().replace(/[^A-Z0-9]/g, '');
      return (
        type.includes(reqCode) ||
        reqCode.includes(type) ||
        (req.code === 'INS_PUBLIC_LIABILITY' && (type.includes('PL') || type.includes('PUBLIC'))) ||
        (req.code === 'INS_EMPLOYERS_LIABILITY' && (type.includes('EL') || type.includes('EMPLOYER'))) ||
        (req.code === 'TRADE_GAS_SAFE_REGISTER' && type.includes('GAS')) ||
        (req.code === 'TRADE_FGAS_REFCOM' && type.includes('FGAS')) ||
        (req.code === 'TRADE_NICEIC_NAPIT_ECA' && (type.includes('NICEIC') || type.includes('ELEC'))) ||
        (req.code === 'HS_SSIP_ACCREDITATION' && (type.includes('CHAS') || type.includes('SSIP') || type.includes('SAFE')))
      );
    });

    let state: RequirementState = 'MISSING';
    let verificationStatus: EvaluatedRequirement['verificationStatus'] = 'NOT_REQUIRED';
    let daysUntilExpiry: number | null = null;
    let actionPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = req.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH';

    if (matchedDoc) {
      // Parse expiry
      if (matchedDoc.expiryDate) {
        const expDate = new Date(matchedDoc.expiryDate);
        if (!isNaN(expDate.getTime())) {
          const diffMs = expDate.getTime() - now.getTime();
          daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        }
      }

      // Check document status
      if (matchedDoc.status === 'REJECTED') {
        state = 'REJECTED';
        verificationStatus = 'REJECTED';
        rejectedCount++;
        actions.push({
          id: `act-rej-${req.code}`,
          requirementCode: req.code,
          title: `${req.title} Rejected`,
          category: req.category,
          priority: req.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          reason: matchedDoc.notes || 'Uploaded document does not meet EntireFM compliance standards.',
          resolutionCta: 'Upload Replacement Document',
          documentId: matchedDoc.id,
        });
      } else if (matchedDoc.status === 'UNDER_REVIEW' || matchedDoc.status === 'UPLOADED' || matchedDoc.status === 'PENDING') {
        state = 'UNDER_REVIEW';
        verificationStatus = 'PENDING';
        underReviewCount++;
      } else if (matchedDoc.status === 'ACCEPTED' || matchedDoc.status === 'VERIFIED') {
        verificationStatus = 'VERIFIED';
        if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
          state = 'EXPIRED';
          if (req.criticality === 'CRITICAL') hasCriticalExpiry = true;
          actions.push({
            id: `act-exp-${req.code}`,
            requirementCode: req.code,
            title: `${req.title} Expired`,
            category: req.category,
            priority: req.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            reason: `Policy expired on ${matchedDoc.expiryDate}. Immediate renewal required to maintain work eligibility.`,
            resolutionCta: 'Upload Renewal Certificate',
            deadline: 'Immediate',
            documentId: matchedDoc.id,
          });
        } else if (daysUntilExpiry !== null && daysUntilExpiry <= 30) {
          state = 'EXPIRING';
          upcomingRenewalsCount++;
          if (isMandatory) totalSatisfiedMandatory++; // Still valid today
          actions.push({
            id: `act-renew-${req.code}`,
            requirementCode: req.code,
            title: `${req.title} Expires in ${daysUntilExpiry} days`,
            category: req.category,
            priority: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
            reason: `Expires on ${matchedDoc.expiryDate}. Provide renewal schedule before expiry.`,
            resolutionCta: 'Upload Renewal',
            deadline: matchedDoc.expiryDate,
            documentId: matchedDoc.id,
          });
        } else {
          state = 'COMPLIANT';
          if (isMandatory) totalSatisfiedMandatory++;
        }
      }
    } else {
      // No evidence found
      state = 'MISSING';
      missingCount++;
      if (req.criticality === 'CRITICAL') hasCriticalMissing = true;
      if (isMandatory) {
        actions.push({
          id: `act-miss-${req.code}`,
          requirementCode: req.code,
          title: `${req.title} Required`,
          category: req.category,
          priority: req.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          reason: `Mandatory requirement for approved ${req.category.toLowerCase().replace(/_/g, ' ')} controls.`,
          resolutionCta: 'Upload Evidence',
        });
      }
    }

    evaluatedRequirements.push({
      id: `eval-${orgId}-${req.code.toLowerCase()}`,
      requirementId: req.id,
      code: req.code,
      title: req.title,
      description: req.description,
      category: req.category,
      criticality: req.criticality,
      evidenceType: req.evidenceType,
      state,
      isApplicable: true,
      isMandatory,
      evidenceDocumentId: matchedDoc?.id,
      evidenceFileName: matchedDoc?.fileName,
      evidenceFileUrl: matchedDoc?.fileUrl,
      issueDate: matchedDoc?.issueDate,
      expiryDate: matchedDoc?.expiryDate,
      daysUntilExpiry,
      verificationStatus,
      rejectionReason: matchedDoc?.status === 'REJECTED' ? matchedDoc.notes : undefined,
      actionRequired: state === 'MISSING' || state === 'EXPIRED' || state === 'REJECTED' ? 'Upload Evidence' : undefined,
      actionPriority,
    });
  }

  // 3. Compute Deterministic Score
  const complianceScorePct =
    totalApplicableMandatory > 0
      ? Math.round((totalSatisfiedMandatory / totalApplicableMandatory) * 100)
      : 100;

  // 4. Determine Operational Status with Critical Overrides
  let operationalStatus: OperationalStatus = 'COMPLIANT';
  if (profile.lifecycleStatus === 'SUSPENDED') {
    operationalStatus = 'SUSPENDED';
  } else if (hasCriticalExpiry || hasCriticalMissing) {
    operationalStatus = 'RESTRICTED';
  } else if (rejectedCount > 0 || missingCount > 0 || underReviewCount > 0) {
    operationalStatus = 'ACTION_REQUIRED';
  } else if (upcomingRenewalsCount > 0) {
    operationalStatus = 'COMPLIANT_RENEWALS_UPCOMING';
  }

  // 5. Category Breakdowns
  const categoryKeys: ComplianceCategory[] = [
    'CORPORATE',
    'INSURANCE',
    'HEALTH_AND_SAFETY',
    'ENVIRONMENTAL',
    'QUALITY',
    'GOVERNANCE_AND_ETHICS',
    'INFORMATION_SECURITY',
    'WORKFORCE',
    'TRADE_SPECIFIC',
  ];

  const categoryTitles: Record<ComplianceCategory, string> = {
    CORPORATE: 'Corporate & Company Details',
    INSURANCE: 'Statutory & Commercial Insurance',
    HEALTH_AND_SAFETY: 'Health, Safety & RAMS',
    ENVIRONMENTAL: 'Environmental & Sustainability',
    QUALITY: 'Quality & Service Delivery',
    GOVERNANCE_AND_ETHICS: 'Governance, Ethics & Fair Work',
    INFORMATION_SECURITY: 'Information Security & GDPR',
    WORKFORCE: 'Workforce & Competency',
    TRADE_SPECIFIC: 'Trade & Technical Accreditations',
  };

  const categories = categoryKeys.map((cat) => {
    const catReqs = evaluatedRequirements.filter((r) => r.category === cat && r.isApplicable);
    const satisfied = catReqs.filter((r) => r.state === 'COMPLIANT' || r.state === 'EXPIRING').length;
    let status: 'COMPLIANT' | 'WARNING' | 'ACTION_REQUIRED' | 'UNDER_REVIEW' = 'COMPLIANT';

    if (catReqs.some((r) => r.state === 'EXPIRED' || r.state === 'REJECTED' || (r.state === 'MISSING' && r.isMandatory))) {
      status = 'ACTION_REQUIRED';
    } else if (catReqs.some((r) => r.state === 'UNDER_REVIEW')) {
      status = 'UNDER_REVIEW';
    } else if (catReqs.some((r) => r.state === 'EXPIRING')) {
      status = 'WARNING';
    }

    return {
      category: cat,
      title: categoryTitles[cat],
      totalApplicable: catReqs.length,
      satisfiedCount: satisfied,
      status,
    };
  }).filter((c) => c.totalApplicable > 0);

  // Sort actions by priority (CRITICAL -> HIGH -> MEDIUM -> LOW)
  const priorityWeight = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  actions.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

  const criticalActionsCount = actions.filter((a) => a.priority === 'CRITICAL').length;
  const highPriorityActionsCount = actions.filter((a) => a.priority === 'HIGH').length;

  return {
    contractorOrgId: orgId,
    contractorName: profile.legalName,
    lifecycleStatus: profile.lifecycleStatus,
    operationalStatus,
    complianceScorePct,
    totalApplicableMandatory,
    totalSatisfiedMandatory,
    criticalActionsCount,
    highPriorityActionsCount,
    upcomingRenewalsCount,
    underReviewCount,
    rejectedCount,
    missingCount,
    categories,
    actions,
    requirements: evaluatedRequirements,
    lastEvaluatedAt: now.toISOString(),
  };
}
