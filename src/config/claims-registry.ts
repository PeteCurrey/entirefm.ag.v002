/**
 * ENTIREFM CENTRAL LEGAL CLAIM REGISTRY & GOVERNANCE GATE
 * ========================================================
 * Forensic single source of truth for all corporate, legal, technical,
 * insurance, compliance, and operational claims across EntireFM.
 *
 * CRITICAL RULE:
 * AI / code may PROPOSE policy claims ('PROPOSED_BUSINESS_POLICY').
 * AI / code MUST NEVER approve its own proposed policies or promote them to 'APPROVED_BUSINESS_POLICY'.
 * Only recorded human approval events may assign 'APPROVED_BUSINESS_POLICY'.
 *
 * State Machine:
 * - VERIFIED: Backing statutory/official document or verified contract exists.
 * - PROPOSED_BUSINESS_POLICY: Policy drafted by engineering/AI awaiting formal human approval.
 * - APPROVED_BUSINESS_POLICY: Formal human approval recorded by authorized executive.
 * - CONFIG_REQUIRED: Awaiting missing factual config (VAT, ICO, Insurer).
 * - NOT_PUBLIC: Internal architecture/controls; must never be claimed publicly.
 * - LEGAL_REVIEW_REQUIRED: Held pending external legal counsel review.
 * - REJECTED: Rejected by human reviewer; prohibited from publication.
 */

export type ClaimVerificationStatus =
  | 'VERIFIED'
  | 'PROPOSED_BUSINESS_POLICY'
  | 'APPROVED_BUSINESS_POLICY'
  | 'CONFIG_REQUIRED'
  | 'NOT_PUBLIC'
  | 'LEGAL_REVIEW_REQUIRED'
  | 'REJECTED';

export type ClaimCategory =
  | 'CORPORATE'
  | 'DATA_PROTECTION'
  | 'SECURITY'
  | 'INSURANCE'
  | 'CONTRACT'
  | 'CONTRACTOR'
  | 'HEALTH_SAFETY'
  | 'ENVIRONMENT'
  | 'AI'
  | 'PROCUREMENT'
  | 'ACCREDITATION'
  | 'SERVICE_LEVEL'
  | 'FINANCIAL'
  | 'REGULATORY';

export type SecurityEvidenceLevel =
  | 'CODE_VERIFIED'
  | 'PROVIDER_DOCUMENTED'
  | 'PRODUCTION_CONFIG_VERIFIED'
  | 'CONTRACT_VERIFIED'
  | 'NOT_VERIFIED';

export type SubprocessorVerificationStatus =
  | 'DETECTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED_ACTIVE'
  | 'INACTIVE'
  | 'REMOVED';

export interface HumanApprovalRecord {
  claimId: string;
  previousStatus: ClaimVerificationStatus;
  newStatus: 'APPROVED_BUSINESS_POLICY' | 'REJECTED' | 'LEGAL_REVIEW_REQUIRED';
  approverIdentity: string;
  approverRole: 'CEO' | 'DIRECTOR' | 'COMPLIANCE_MANAGER' | 'LEGAL_COUNSEL';
  timestamp: string;
  policyVersion: string;
  approvalNote?: string;
  auditEventId: string;
}

export interface LegalClaimEntry {
  claimId: string;
  category: ClaimCategory;
  claim: string;
  status: ClaimVerificationStatus;
  evidenceLevel?: SecurityEvidenceLevel;
  sourceType:
    | 'COMPANIES_HOUSE'
    | 'STATUTE'
    | 'BUSINESS_POLICY'
    | 'CONTRACT'
    | 'INFRASTRUCTURE_AUDIT'
    | 'UNVERIFIED';
  sourceReference: string;
  approvedBy: string | null;
  approvedAt: string | null;
  humanApprovalRecord?: HumanApprovalRecord;
  lastVerifiedAt: string;
  reviewDueAt: string;
  publicWording: string | null;
  internalNotes: string;
  affectedPages?: string[];
  affectedWorkflows?: string[];
}

/**
 * Live Claim Registry
 * Note: All generated policies are demoted to PROPOSED_BUSINESS_POLICY until Pete/executives formally approve.
 */
export const LEGAL_CLAIM_REGISTRY: LegalClaimEntry[] = [
  // ── 1. CORPORATE & STATUTORY FACTS ──────────────────────────────────────────
  {
    claimId: 'CORP_LEGAL_ENTITY',
    category: 'CORPORATE',
    claim: 'Alkota Group Limited is a registered private limited company in England and Wales (Company No. 13535215).',
    status: 'VERIFIED',
    evidenceLevel: 'CONTRACT_VERIFIED',
    sourceType: 'COMPANIES_HOUSE',
    sourceReference: 'Companies House API / WebCHeck 13535215',
    approvedBy: 'Companies House Statutory Record',
    approvedAt: '2026-08-23',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'Alkota Group Limited (Company No. 13535215), registered in England and Wales.',
    internalNotes: 'Authoritative company name and number from statutory register.',
    affectedPages: ['/legal/disclosures', '/legal/terms-of-use', '/legal/privacy'],
  },
  {
    claimId: 'CORP_TRADING_NAME',
    category: 'CORPORATE',
    claim: 'EntireFM is an active business trading name of Alkota Group Limited.',
    status: 'PROPOSED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'Awaiting formal executive sign-off on trading name declaration format',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: 'EntireFM (trading name of Alkota Group Limited)',
    internalNotes: 'Awaiting human sign-off from Pete Currey.',
    affectedPages: ['/legal/disclosures', '/legal/terms-of-business'],
  },
  {
    claimId: 'CORP_VAT_NUMBER',
    category: 'CORPORATE',
    claim: 'EntireFM / Alkota Group Limited UK VAT Registration Number',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Awaiting VAT Registration Certificate from Business Owner',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'VAT number is not yet supplied. Must not be displayed or claimed publicly until verified.',
  },
  {
    claimId: 'CORP_ICO_REGISTRATION',
    category: 'REGULATORY',
    claim: 'ICO Data Protection Registration Number',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Awaiting ICO Registration Number from Business Owner',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Must NOT render any fallback claim (no "pending", "available on request", or implied registration).',
  },

  // ── 2. INSURANCE ────────────────────────────────────────────────────────────
  {
    claimId: 'INS_EMPLOYERS_LIABILITY',
    category: 'INSURANCE',
    claim: 'Employer’s Liability Insurance Limit & Policy',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Insurance Policy Schedule Pending Upload',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Specific limits removed. Awaiting policy schedule before publishing figures.',
  },
  {
    claimId: 'INS_PUBLIC_LIABILITY',
    category: 'INSURANCE',
    claim: 'Public & Products Liability Insurance Limit',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Insurance Policy Schedule Pending Upload',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Configurable field. Awaiting verified broker schedule.',
  },

  // ── 3. ETHICS & PROCUREMENT ─────────────────────────────────────────────────
  {
    claimId: 'ETHICS_HOSPITALITY_THRESHOLD',
    category: 'PROCUREMENT',
    claim: 'Gifts and Hospitality Registration Policy (Proportionate, transparent, recorded in register)',
    status: 'PROPOSED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'Anti-Bribery Policy Proposal',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: 'All corporate gifts and hospitality must be modest, proportionate, transparent, and recorded in the Corporate Hospitality Register.',
    internalNotes: 'Arbitrary £50 removed. Awaiting formal human approval on exact operational rules.',
    affectedPages: ['/legal/anti-bribery'],
  },
  {
    claimId: 'PROC_SUPPLIER_PAYMENT_TERMS',
    category: 'PROCUREMENT',
    claim: 'Supplier and Contractor Payment Terms settled strictly in accordance with agreed written POs',
    status: 'PROPOSED_BUSINESS_POLICY',
    sourceType: 'CONTRACT',
    sourceReference: 'Commercial Supply Chain Policy Proposal',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: 'Payments to approved contractors and suppliers are settled strictly in accordance with agreed written purchase orders and contractual payment terms.',
    internalNotes: 'Awaiting commercial director sign-off.',
    affectedPages: ['/legal/supplier-code', '/legal/contractor-terms'],
  },

  // ── 4. DISPUTE RESOLUTION ───────────────────────────────────────────────────
  {
    claimId: 'DISPUTE_ADR_MEDIATION',
    category: 'CONTRACT',
    claim: 'Commercial Alternative Dispute Resolution & Mediation Clause',
    status: 'LEGAL_REVIEW_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Legal Counsel Review Queue',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-15',
    publicWording: 'Where a commercial dispute cannot be resolved directly, parties may mutually explore independent alternative dispute resolution or professional mediation prior to initiating formal proceedings.',
    internalNotes: 'CEDR mandate removed. Non-binding ADR exploration pending solicitor review.',
    affectedPages: ['/legal/complaints', '/legal/terms-of-business'],
  },

  // ── 5. CONTRACTOR ACCREDITATIONS & PREQUALIFICATION ────────────────────────
  {
    claimId: 'ACCRED_CONTRACTOR_PREQUALIFICATION',
    category: 'CONTRACTOR',
    claim: 'EntireFM operates a risk-tiered contractor prequalification matrix (trade certifications, insurance, RAMS capability, SSIP where applicable).',
    status: 'PROPOSED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'Contractor Competence & Prequalification Matrix Proposal',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: 'Contractors are vetted for trade competence, statutory compliance, insurance cover, and safe working capabilities appropriate to their specific trade and risk class.',
    internalNotes: 'Universal SSIP requirement removed. Replaced with trade-specific competency matrix awaiting approval.',
    affectedPages: ['/legal/contractor-terms', '/legal/work-order-terms'],
  },

  // ── 6. SUBPROCESSORS & DATA INFRASTRUCTURE ──────────────────────────────────
  {
    claimId: 'SUBPROC_CORE_HOSTING_DATABASE',
    category: 'DATA_PROTECTION',
    claim: 'Core Cloud Hosting and Database Processing Infrastructure',
    status: 'VERIFIED',
    evidenceLevel: 'CODE_VERIFIED',
    sourceType: 'INFRASTRUCTURE_AUDIT',
    sourceReference: 'Supabase PostgREST Client & Vercel Edge Framework',
    approvedBy: 'Lead Systems Architect & DPO',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-11-24',
    publicWording: 'Core platform hosting and database services are provided by Vercel Inc. and Supabase Inc. (AWS eu-west-2 London region).',
    internalNotes: 'Database hosting region verified in AWS London. International transfer assessment maintained separately.',
    affectedPages: ['/legal/subprocessors', '/legal/privacy'],
  },

  // ── 7. TECHNICAL SECURITY & CONTROLS ────────────────────────────────────────
  {
    claimId: 'SEC_TECHNICAL_CONTROLS',
    category: 'SECURITY',
    claim: 'Technical and Organisational Security Measures',
    status: 'VERIFIED',
    evidenceLevel: 'CODE_VERIFIED',
    sourceType: 'INFRASTRUCTURE_AUDIT',
    sourceReference: 'Repository Auth & Storage Architecture (HMAC Cookies, RBAC Matrix, Supabase RLS, HTTPS TLS)',
    approvedBy: 'Head of Security & Compliance',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'EntireFM maintains appropriate technical and organisational measures, including role-based access control, cryptographic session signing, industry-standard transport encryption, and tenant data isolation.',
    internalNotes: 'Uses durable outcome-based language. Sensitive internal algorithm names, cookie details, and unverified hardware claims are strictly excluded from public copy.',
    affectedPages: ['/legal/security', '/legal/data-processing'],
  },

  // ── 8. AI GOVERNANCE & HUMAN BOUNDARIES ──────────────────────────────────────
  {
    claimId: 'AI_HUMAN_OVERSIGHT_BOUNDARY',
    category: 'AI',
    claim: 'AI tools provide analytical recommendations and operate under non-delegable human operational supervision.',
    status: 'PROPOSED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'AI Governance Framework Proposal',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: 'AI-assisted features in EntireFM provide analytical triage and drafting assistance. Critical safety, contractor appointment, disciplinary, and commercial decisions remain subject to human operational review.',
    internalNotes: 'Awaiting formal human policy approval.',
    affectedPages: ['/legal/ai'],
  },
];

export const CENTRAL_CLAIMS_REGISTRY = LEGAL_CLAIM_REGISTRY;

/**
 * Retrieve public claim ONLY IF it is VERIFIED or APPROVED_BUSINESS_POLICY
 */
export function getPublicClaim(claimId: string): LegalClaimEntry | null {
  const claim = LEGAL_CLAIM_REGISTRY.find((c) => c.claimId === claimId);
  if (!claim) return null;
  if (claim.status === 'VERIFIED' || claim.status === 'APPROVED_BUSINESS_POLICY') {
    return claim;
  }
  return null;
}

export function getClaimsByStatus(status: ClaimVerificationStatus): LegalClaimEntry[] {
  return LEGAL_CLAIM_REGISTRY.filter((c) => c.status === status);
}

export function getClaimStatusCount(): Record<ClaimVerificationStatus, number> {
  const counts: Record<ClaimVerificationStatus, number> = {
    VERIFIED: 0,
    PROPOSED_BUSINESS_POLICY: 0,
    APPROVED_BUSINESS_POLICY: 0,
    CONFIG_REQUIRED: 0,
    NOT_PUBLIC: 0,
    LEGAL_REVIEW_REQUIRED: 0,
    REJECTED: 0,
  };
  for (const entry of LEGAL_CLAIM_REGISTRY) {
    counts[entry.status] = (counts[entry.status] || 0) + 1;
  }
  return counts;
}
