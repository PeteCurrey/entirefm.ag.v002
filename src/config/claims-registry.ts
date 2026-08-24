/**
 * ENTIREFM CENTRAL LEGAL CLAIM REGISTRY
 * =====================================
 * Forensic single source of truth for all corporate, legal, technical,
 * insurance, compliance, and operational claims across EntireFM.
 *
 * NON-NEGOTIABLE RULE:
 * Only claims with status === 'VERIFIED' or 'APPROVED_BUSINESS_POLICY'
 * may be presented publicly as established facts.
 * Claims with 'CONFIG_REQUIRED', 'NOT_PUBLIC', or 'LEGAL_REVIEW_REQUIRED'
 * must NEVER be exposed publicly or asserted as fact.
 */

export type ClaimVerificationStatus =
  | 'VERIFIED'
  | 'APPROVED_BUSINESS_POLICY'
  | 'CONFIG_REQUIRED'
  | 'NOT_PUBLIC'
  | 'LEGAL_REVIEW_REQUIRED';

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

export interface LegalClaimEntry {
  claimId: string;
  category: ClaimCategory;
  claim: string;
  status: ClaimVerificationStatus;
  sourceType: 'COMPANIES_HOUSE' | 'STATUTE' | 'BUSINESS_POLICY' | 'CONTRACT' | 'INFRASTRUCTURE_AUDIT' | 'UNVERIFIED';
  sourceReference: string;
  approvedBy: string | null;
  approvedAt: string | null;
  lastVerifiedAt: string;
  reviewDueAt: string;
  publicWording: string | null;
  internalNotes: string;
}

export const LEGAL_CLAIM_REGISTRY: LegalClaimEntry[] = [
  // ── 1. CORPORATE ────────────────────────────────────────────────────────────
  {
    claimId: 'CORP_LEGAL_ENTITY',
    category: 'CORPORATE',
    claim: 'Alkota Group Limited is a registered private limited company in England and Wales (Company No. 13535215).',
    status: 'VERIFIED',
    sourceType: 'COMPANIES_HOUSE',
    sourceReference: 'Companies House API / WebCHeck 13535215',
    approvedBy: 'Pete Currey / Companies House Public Record',
    approvedAt: '2026-08-23',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'Alkota Group Limited (Company No. 13535215), registered in England and Wales.',
    internalNotes: 'Authoritative company name and number from statutory register.',
  },
  {
    claimId: 'CORP_TRADING_NAME',
    category: 'CORPORATE',
    claim: 'EntireFM is an active trading name of Alkota Group Limited.',
    status: 'APPROVED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'Business Owner Governance Mandate',
    approvedBy: 'Pete Currey',
    approvedAt: '2026-08-23',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'EntireFM (trading name of Alkota Group Limited)',
    internalNotes: 'Trading name declaration under Companies Act 2006 disclosures.',
  },
  {
    claimId: 'CORP_VAT_NUMBER',
    category: 'CORPORATE',
    claim: 'EntireFM / Alkota Group Limited UK VAT Registration Number',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Awaiting VAT Certificate from Business Owner',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'VAT number is not yet supplied. Must not be fabricated or displayed publicly until verified.',
  },
  {
    claimId: 'CORP_ICO_REGISTRATION',
    category: 'REGULATORY',
    claim: 'ICO Data Protection Registration Number',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Awaiting ICO Certificate / Reference from Business Owner',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Must not claim registered status or expose "pending confirmation" wording publicly.',
  },

  // ── 2. INSURANCE ────────────────────────────────────────────────────────────
  {
    claimId: 'INS_EMPLOYERS_LIABILITY',
    category: 'INSURANCE',
    claim: 'Employer’s Liability Insurance Limit',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Insurance Policy Schedule Pending',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Specific limits (£10M, £5M) removed from public text. Verification pack available on procurement.',
  },
  {
    claimId: 'INS_PUBLIC_LIABILITY',
    category: 'INSURANCE',
    claim: 'Public & Products Liability Insurance Limit',
    status: 'CONFIG_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Insurance Policy Schedule Pending',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-01',
    publicWording: null,
    internalNotes: 'Configurable field. Do not assert specific figures until schedule is uploaded.',
  },

  // ── 3. ETHICS & PROCUREMENT ─────────────────────────────────────────────────
  {
    claimId: 'ETHICS_HOSPITALITY_THRESHOLD',
    category: 'PROCUREMENT',
    claim: 'Gifts and Hospitality Registration Threshold',
    status: 'APPROVED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'Updated Anti-Bribery Policy 2026',
    approvedBy: 'Compliance Directorate',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'All gifts and hospitality must be modest, proportionate, transparent, and recorded in the corporate hospitality register.',
    internalNotes: 'Arbitrary £50 threshold removed. Policy mandates proportionality and transparency.',
  },
  {
    claimId: 'PROC_SUPPLIER_PAYMENT_TERMS',
    category: 'PROCUREMENT',
    claim: 'Supplier and Contractor Payment Terms',
    status: 'APPROVED_BUSINESS_POLICY',
    sourceType: 'CONTRACT',
    sourceReference: 'EntireFM Standard Commercial Terms of Engagement',
    approvedBy: 'Commercial Directorate',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'Payments to approved contractors and suppliers are settled strictly in accordance with agreed written purchase orders and contractual payment schedules.',
    internalNotes: 'Unapproved blanket "30-day prompt payment" commitment removed.',
  },

  // ── 4. DISPUTE RESOLUTION ───────────────────────────────────────────────────
  {
    claimId: 'DISPUTE_CEDR_MEDIATION',
    category: 'CONTRACT',
    claim: 'CEDR Mediation Clause in Complaints Procedure',
    status: 'LEGAL_REVIEW_REQUIRED',
    sourceType: 'UNVERIFIED',
    sourceReference: 'Solicitor Review Queue',
    approvedBy: null,
    approvedAt: null,
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-09-15',
    publicWording: 'Where a dispute cannot be resolved directly, parties may mutually agree to engage independent alternative dispute resolution before initiating legal proceedings.',
    internalNotes: 'Removed mandatory CEDR binding commitment. Generalized to mutual ADR pending solicitor review.',
  },

  // ── 5. CONTRACTOR ACCREDITATIONS & SSIP ──────────────────────────────────────
  {
    claimId: 'ACCRED_SSIP_CONTRACTOR_VETTING',
    category: 'CONTRACTOR',
    claim: 'EntireFM requests verified SSIP accreditation or equivalent H&S evidence from specialist trade contractors where risk-appropriate.',
    status: 'APPROVED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'EntireFM Contractor Network Onboarding Protocol',
    approvedBy: 'Operations & Supply Chain Directorate',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'Contractors undertaking high-risk engineering works are vetted for trade competence and health & safety compliance (such as SSIP accreditation, Gas Safe, NICEIC, or documented RAMS).',
    internalNotes: 'Carefully framed: this is a vetting requirement for trade contractors, NOT a claim that EntireFM holds SSIP accreditation directly.',
  },

  // ── 6. SUBPROCESSORS & DATA INFRASTRUCTURE ──────────────────────────────────
  {
    claimId: 'SUBPROC_INFRASTRUCTURE_VERIFICATION',
    category: 'DATA_PROTECTION',
    claim: 'Active Third-Party Cloud Infrastructure Subprocessors',
    status: 'VERIFIED',
    sourceType: 'INFRASTRUCTURE_AUDIT',
    sourceReference: 'Codebase Integration Audit (Next.js Edge, Supabase Client, Resend SDK, GA4 Consent Tracker)',
    approvedBy: 'Engineering & Compliance Lead',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2026-11-24',
    publicWording: 'Subprocessors include Vercel (Edge Web Hosting), Supabase / AWS London (Database & Vault Storage), Resend (Service Communications), and Google Analytics 4 (Zero-PII Analytics, strictly consent-gated).',
    internalNotes: 'Confirmed from actual repository imports, API clients, and database connection logic.',
  },

  // ── 7. TECHNICAL SECURITY & CONTROLS ────────────────────────────────────────
  {
    claimId: 'SEC_TECHNICAL_CONTROLS',
    category: 'SECURITY',
    claim: 'Technical & Organisational Security Measures',
    status: 'VERIFIED',
    sourceType: 'INFRASTRUCTURE_AUDIT',
    sourceReference: 'Repository Auth Architecture (HMAC Cookies, RBAC Matrix, Supabase RLS, PostgREST HTTPS, Audit Ledger)',
    approvedBy: 'Security & Engineering Directorate',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'Platform security incorporates role-based access control (RBAC), cryptographically signed sessions, HTTPS/TLS encryption in transit, tenant data scoping, and an immutable audit event ledger.',
    internalNotes: 'Verified directly in src/server/identity, src/server/audit, and src/server/db. Unverified claims (e.g. SOC2, specific hardware certifications) are omitted.',
  },

  // ── 8. AI GOVERNANCE & HUMAN BOUNDARIES ──────────────────────────────────────
  {
    claimId: 'AI_HUMAN_OVERSIGHT_BOUNDARY',
    category: 'AI',
    claim: 'AI tools provide analytical recommendations and do not make sole binding safety, legal, or commercial decisions without human review.',
    status: 'APPROVED_BUSINESS_POLICY',
    sourceType: 'BUSINESS_POLICY',
    sourceReference: 'EntireFM AI Governance & Autonomy Framework (src/server/ai)',
    approvedBy: 'AI Governance Lead & CEO',
    approvedAt: '2026-08-24',
    lastVerifiedAt: '2026-08-24',
    reviewDueAt: '2027-08-24',
    publicWording: 'AI assistance within EntireFM operates under non-delegable human governance. AI suggestions for work order triage, contractor matching, and predictive maintenance are subject to human supervisor review.',
    internalNotes: 'Enforced via AutonomyLevel and EscalationQueue models in src/server/ai.',
  },
];

/**
 * Retrieve verified claim or return null
 */
export function getLegalClaim(claimId: string): LegalClaimEntry | null {
  const claim = LEGAL_CLAIM_REGISTRY.find((c) => c.claimId === claimId);
  if (!claim) return null;
  if (claim.status === 'VERIFIED' || claim.status === 'APPROVED_BUSINESS_POLICY') {
    return claim;
  }
  return null;
}

/**
 * Filter claims by status for admin inspection
 */
export function getClaimsByStatus(status: ClaimVerificationStatus): LegalClaimEntry[] {
  return LEGAL_CLAIM_REGISTRY.filter((c) => c.status === status);
}

/**
 * Export alias for admin console
 */
export const CENTRAL_CLAIMS_REGISTRY = LEGAL_CLAIM_REGISTRY;

/**
 * Compute counts by verification status
 */
export function getClaimStatusCount(): Record<ClaimVerificationStatus | 'total', number> {
  const counts: Record<string, number> = {
    VERIFIED: 0,
    APPROVED_BUSINESS_POLICY: 0,
    CONFIG_REQUIRED: 0,
    NOT_PUBLIC: 0,
    LEGAL_REVIEW_REQUIRED: 0,
    total: LEGAL_CLAIM_REGISTRY.length,
  };

  for (const claim of LEGAL_CLAIM_REGISTRY) {
    counts[claim.status] = (counts[claim.status] || 0) + 1;
  }

  return counts as Record<ClaimVerificationStatus | 'total', number>;
}
