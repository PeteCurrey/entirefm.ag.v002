/**
 * ENTIREFM SUPPLIER ASSURANCE & COMPLIANCE ENGINE DOMAIN (PHASE 3)
 * ================================================================
 * Granular risk classification, dynamic onboarding requirement plans,
 * multi-version document vault, H&S / InfoSec / Bank verification workflows,
 * scoped service & geographic approvals, compliance holds, remediation,
 * and immutable audit trail.
 */

import { SupplierType, RiskLevel, CommercialRelationship, SupplierComplianceStatus } from './types';

export type AssuranceCategory =
  | 'CORPORATE'
  | 'INSURANCE'
  | 'HEALTH_AND_SAFETY'
  | 'TECHNICAL'
  | 'WORKFORCE'
  | 'ENVIRONMENTAL'
  | 'ETHICAL'
  | 'INFORMATION_SECURITY'
  | 'FINANCIAL'
  | 'CLIENT_SPECIFIC'
  | 'SERVICE_SPECIFIC'
  | 'OTHER';

export type EvidenceType =
  | 'DOCUMENT_UPLOAD'
  | 'ACCREDITATION_CERTIFICATE'
  | 'DIGITAL_DECLARATION'
  | 'QUESTIONNAIRE'
  | 'BANK_STATEMENT'
  | 'STRUCTURED_DATA_ENTRY'
  | 'MANUAL_AUDIT_SIGNOFF';

export type ExpiryConsequence =
  | 'INFORMATION_ONLY'
  | 'WARNING'
  | 'RESTRICT_SERVICE'
  | 'COMPLIANCE_HOLD'
  | 'SUSPEND_SUPPLIER'
  | 'MANUAL_REVIEW';

export type ApplicationLifecycleStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'SCREENING'
  | 'INFORMATION_REQUIRED'
  | 'ACCEPTED_FOR_ONBOARDING'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'CONVERTED';

export type OrgVerificationStatus =
  | 'SELF_DECLARED'
  | 'DOCUMENT_VERIFIED'
  | 'MANUALLY_VERIFIED'
  | 'EXTERNAL_VERIFIED'
  | 'NOT_VERIFIED';

export type DataAccessClassification =
  | 'NONE'
  | 'BASIC_OPERATIONAL'
  | 'PERSONAL_DATA'
  | 'SENSITIVE_CLIENT_DATA'
  | 'SYSTEM_ACCESS'
  | 'PRIVILEGED_ACCESS';

export type ItemReviewStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'INFORMATION_REQUIRED'
  | 'WAIVED';

export type DocumentLifecycleState =
  | 'CURRENT'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'SUPERSEDED'
  | 'WITHDRAWN';

export type RemediationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RemediationStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'SUPPLIER_ACTION'
  | 'ENTIREFM_REVIEW'
  | 'RESOLVED'
  | 'OVERDUE'
  | 'WAIVED'
  | 'CANCELLED';

export type HoldScope = 'GLOBAL' | 'SERVICE' | 'GEOGRAPHY' | 'CLIENT';

export type AgreementStatus =
  | 'NOT_REQUIRED'
  | 'NOT_ISSUED'
  | 'ISSUED'
  | 'AWAITING_SIGNATURE'
  | 'SIGNED'
  | 'EXPIRED'
  | 'SUPERSEDED'
  | 'TERMINATED';

export type BankVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'CHANGE_PENDING'
  | 'REJECTED';

export type ReassessmentFrequency =
  | '6_MONTHS'
  | '12_MONTHS'
  | '24_MONTHS'
  | '36_MONTHS'
  | 'CUSTOM';

export type PortalAccessStage =
  | 'APPLICATION_ACCESS'
  | 'ONBOARDING_ACCESS'
  | 'APPROVED_SUPPLIER_ACCESS'
  | 'FULL_OPERATIONAL_ACCESS';

export type SupplierPortalRole =
  | 'SUPPLIER_ADMIN'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'FINANCE'
  | 'FIELD_USER'
  | 'VIEWER';

/**
 * Canonical Assurance Requirement Definition
 */
export interface AssuranceRequirementDefinition {
  id: string;
  internal_code: string;
  title: string;
  description: string;
  category: AssuranceCategory;
  is_mandatory_by_default: boolean;
  evidence_type: EvidenceType;
  default_review_frequency_months?: number;
  default_expiry_days?: number;
  consequence_on_expiry: ExpiryConsequence;
  applicable_supplier_types?: SupplierType[];
  applicable_services?: string[]; // e.g. ['hvac', 'refrigeration', 'rope-access']
  applicable_risk_levels?: RiskLevel[];
  applicable_data_access?: DataAccessClassification[];
  required_minimum_insurance_limit_gbp?: number;
  approval_authority_role: string; // e.g. 'compliance_manager', 'technical_head', 'finance_officer'
  is_active: boolean;
  version: number;
}

/**
 * Item in a Generated Dynamic Onboarding Plan
 */
export interface AssurancePlanItem {
  id: string;
  requirement_id: string;
  internal_code: string;
  title: string;
  category: AssuranceCategory;
  description: string;
  is_mandatory: boolean;
  evidence_type: EvidenceType;
  consequence_on_expiry: ExpiryConsequence;
  status: ItemReviewStatus;
  evidence_document_id?: string;
  evidence_notes?: string;
  rejection_reason?: string;
  assigned_reviewer_role: string;
  reviewed_by?: string;
  reviewed_at?: string;
  expiry_date?: string;
  waived_reason?: string;
  waived_by?: string;
  waived_at?: string;
}

/**
 * Supplier Dynamic Onboarding Plan
 */
export interface SupplierOnboardingPlan {
  id: string;
  supplier_id: string;
  rule_version: string;
  generated_at: string;
  risk_level: RiskLevel;
  total_applicable_items: number;
  total_mandatory_items: number;
  completed_mandatory_items: number;
  completion_percentage: number;
  is_onboarding_complete: boolean;
  items: AssurancePlanItem[];
}

/**
 * Supplier Compliance Document Record
 */
export interface SupplierDocumentRecord {
  id: string;
  supplier_id: string;
  requirement_id?: string;
  document_type: string; // e.g. 'PUBLIC_LIABILITY', 'GAS_SAFE', 'F_GAS', 'IRATA'
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path: string;
  issued_by?: string;
  certificate_number?: string;
  issue_date?: string;
  effective_date?: string;
  expiry_date?: string;
  document_state: DocumentLifecycleState;
  review_status: ItemReviewStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  version: number;
  replaced_by_id?: string;
  uploaded_by: string;
  uploaded_at: string;
}

/**
 * Structured Insurance Record
 */
export interface SupplierInsuranceRecord {
  id: string;
  supplier_id: string;
  insurance_type: 'PUBLIC_LIABILITY' | 'EMPLOYERS_LIABILITY' | 'PROFESSIONAL_INDEMNITY' | 'PRODUCT_LIABILITY' | 'MOTOR' | 'CYBER' | 'OTHER';
  insurer_name: string;
  policy_number: string;
  limit_gbp: number;
  required_limit_gbp: number;
  is_below_required_limit: boolean;
  start_date: string;
  expiry_date: string;
  document_id?: string;
  status: 'VALID' | 'BELOW_LIMIT' | 'EXPIRING' | 'EXPIRED';
}

/**
 * Health & Safety Assessment
 */
export interface HealthAndSafetyAssessmentRecord {
  id: string;
  supplier_id: string;
  assessed_by: string;
  assessed_at: string;
  overall_outcome: 'PASS' | 'PASS_WITH_ACTIONS' | 'FAIL' | 'NOT_APPLICABLE';
  competent_person_name?: string;
  riddor_incidents_last_3_years: number;
  rams_methodology_quality: 'EXEMPLARY' | 'ACCEPTABLE' | 'REQUIRES_IMPROVEMENT' | 'UNACCEPTABLE';
  working_at_height_controls: boolean;
  lone_working_procedures: boolean;
  coshh_governance: boolean;
  asbestos_awareness: boolean;
  notes: string;
}

/**
 * Information Security Assessment
 */
export interface InformationSecurityAssessmentRecord {
  id: string;
  supplier_id: string;
  data_access_level: DataAccessClassification;
  assessed_by: string;
  assessed_at: string;
  has_iso27001: boolean;
  has_cyber_essentials: boolean;
  mfa_enforced: boolean;
  data_encrypted_at_rest: boolean;
  cyber_insurance_limit_gbp: number;
  gdpr_dpa_signed: boolean;
  status: 'COMPLIANT' | 'REMEDIATION_REQUIRED' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
}

/**
 * Bank Detail Record (Masked, Dual-Control)
 */
export interface SupplierBankRecord {
  id: string;
  supplier_id: string;
  account_name: string;
  bank_name: string;
  sort_code_masked: string; // e.g. "20-**-**"
  account_number_masked: string; // e.g. "****5678"
  verification_status: BankVerificationStatus;
  submitted_by: string;
  submitted_at: string;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  audit_note?: string;
}

/**
 * Remediation Action Item
 */
export interface SupplierRemediationAction {
  id: string;
  supplier_id: string;
  requirement_id?: string;
  issue_summary: string;
  detailed_remediation_required: string;
  severity: RemediationSeverity;
  assigned_to_role: string;
  supplier_contact?: string;
  raised_date: string;
  due_date: string;
  status: RemediationStatus;
  resolution_notes?: string;
  closed_by?: string;
  closed_at?: string;
}

/**
 * Scoped Service Approval Record
 */
export interface ServiceApprovalRecord {
  id: string;
  supplier_id: string;
  service_slug: string;
  service_name: string;
  approval_status: 'APPROVED' | 'CONDITIONALLY_APPROVED' | 'UNDER_REVIEW' | 'NOT_APPROVED' | 'RESTRICTED';
  effective_date: string;
  review_date: string;
  restrictions?: string[];
  approved_by: string;
  rationale: string;
}

/**
 * Scoped Geographic Approval Record
 */
export interface GeographicApprovalRecord {
  id: string;
  supplier_id: string;
  region_or_city: string;
  is_approved: boolean;
  approved_by: string;
  approved_at: string;
  restrictions?: string[];
}

/**
 * Compliance Hold Record
 */
export interface ComplianceHoldRecord {
  id: string;
  supplier_id: string;
  hold_reason: string;
  hold_scope: HoldScope;
  affected_service_slug?: string;
  affected_city?: string;
  affected_client_id?: string;
  raised_by: string;
  raised_at: string;
  review_date: string;
  resolution_required: string;
  is_active: boolean;
  resolved_by?: string;
  resolved_at?: string;
}

/**
 * Supplier Agreement Record
 */
export interface SupplierAgreementRecord {
  id: string;
  supplier_id: string;
  agreement_type: 'MASTER_SERVICES_AGREEMENT' | 'SPECIALIST_FRAMEWORK' | 'NON_DISCLOSURE_AGREEMENT' | 'CODE_OF_CONDUCT';
  version: string;
  status: AgreementStatus;
  issued_at: string;
  signed_at?: string;
  signatory_name?: string;
  signatory_title?: string;
  signatory_email?: string;
  ip_address?: string;
  document_id?: string;
}

/**
 * Supplier Reassessment Schedule Record
 */
export interface SupplierReassessmentRecord {
  id: string;
  supplier_id: string;
  frequency: ReassessmentFrequency;
  last_reassessment_date?: string;
  next_reassessment_due_date: string;
  status: 'DUE' | 'INITIATED' | 'SUPPLIER_ACTION' | 'UNDER_REVIEW' | 'COMPLETED' | 'OVERDUE';
  annual_declaration_signed: boolean;
  annual_declaration_signed_at?: string;
  reviewed_by?: string;
}

/**
 * Immutable Compliance Audit Record
 */
export interface SupplierAssuranceAuditRecord {
  id: string;
  supplier_id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
  timestamp: string;
}

/**
 * Supplier Portal User Record
 */
export interface SupplierPortalUserRecord {
  id: string;
  supplier_id: string;
  email: string;
  name: string;
  role: SupplierPortalRole;
  is_active: boolean;
  created_at: string;
}
