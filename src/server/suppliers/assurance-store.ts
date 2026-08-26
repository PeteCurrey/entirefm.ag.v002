import {
  SupplierOnboardingPlan,
  AssurancePlanItem,
  SupplierDocumentRecord,
  SupplierInsuranceRecord,
  HealthAndSafetyAssessmentRecord,
  InformationSecurityAssessmentRecord,
  SupplierBankRecord,
  SupplierRemediationAction,
  ServiceApprovalRecord,
  GeographicApprovalRecord,
  ComplianceHoldRecord,
  SupplierAgreementRecord,
  SupplierReassessmentRecord,
  SupplierAssuranceAuditRecord,
  SupplierPortalUserRecord,
  ItemReviewStatus,
  DocumentLifecycleState,
  RemediationStatus,
  HoldScope,
  AgreementStatus,
  BankVerificationStatus,
} from './assurance-types';
import { generateSupplierOnboardingPlan, recalculatePlanProgress, evaluateDocumentExpiry } from './assurance-engine';
import { getSupplierOrganisation, listSupplierOrganisations } from './store';
import { dbQuery } from '@/server/db/client';

class SupplierAssuranceMemoryStore {
  public onboardingPlans = new Map<string, SupplierOnboardingPlan>();
  public documents = new Map<string, SupplierDocumentRecord>();
  public insuranceRecords = new Map<string, SupplierInsuranceRecord>();
  public hsAssessments = new Map<string, HealthAndSafetyAssessmentRecord>();
  public infoSecAssessments = new Map<string, InformationSecurityAssessmentRecord>();
  public bankRecords = new Map<string, SupplierBankRecord>();
  public remediationActions = new Map<string, SupplierRemediationAction>();
  public serviceApprovals = new Map<string, ServiceApprovalRecord>();
  public geographicApprovals = new Map<string, GeographicApprovalRecord>();
  public complianceHolds = new Map<string, ComplianceHoldRecord>();
  public agreements = new Map<string, SupplierAgreementRecord>();
  public reassessments = new Map<string, SupplierReassessmentRecord>();
  public auditLogs: SupplierAssuranceAuditRecord[] = [];
  public portalUsers = new Map<string, SupplierPortalUserRecord>();

  constructor() {
    this.seedInitialAssuranceData();
  }

  private seedInitialAssuranceData() {
    // Seed Apex HVAC (sup-01) as an approved supplier with full assurance history
    const plan1: SupplierOnboardingPlan = {
      id: 'plan-sup-01',
      supplier_id: 'sup-01',
      rule_version: 'v3.0.0-canonical',
      generated_at: '2026-01-10T09:00:00.000Z',
      risk_level: 'HIGH',
      total_applicable_items: 8,
      total_mandatory_items: 6,
      completed_mandatory_items: 6,
      completion_percentage: 100,
      is_onboarding_complete: true,
      items: [
        {
          id: 'item-sup-01-corp-01',
          requirement_id: 'req-corp-01',
          internal_code: 'CORP_COMPANIES_HOUSE',
          title: 'Companies House Registration',
          category: 'CORPORATE',
          description: 'Active UK registration',
          is_mandatory: true,
          evidence_type: 'STRUCTURED_DATA_ENTRY',
          consequence_on_expiry: 'MANUAL_REVIEW',
          status: 'ACCEPTED',
          assigned_reviewer_role: 'compliance_manager',
          reviewed_by: 'Head of Compliance',
          reviewed_at: '2026-01-12T10:00:00.000Z',
        },
        {
          id: 'item-sup-01-ins-pl',
          requirement_id: 'req-ins-01',
          internal_code: 'INS_PUBLIC_LIABILITY',
          title: 'Public & Products Liability (£5M)',
          category: 'INSURANCE',
          description: 'Policy certificate',
          is_mandatory: true,
          evidence_type: 'DOCUMENT_UPLOAD',
          consequence_on_expiry: 'COMPLIANCE_HOLD',
          status: 'ACCEPTED',
          assigned_reviewer_role: 'compliance_manager',
          reviewed_by: 'Head of Compliance',
          reviewed_at: '2026-01-12T10:30:00.000Z',
          expiry_date: '2027-01-01',
        },
        {
          id: 'item-sup-01-tech-fgas',
          requirement_id: 'req-tech-hvac-fgas',
          internal_code: 'TECH_FGAS_REFCOM',
          title: 'F-Gas & REFCOM Certification',
          category: 'TECHNICAL',
          description: 'REFCOM Elite company registration',
          is_mandatory: true,
          evidence_type: 'ACCREDITATION_CERTIFICATE',
          consequence_on_expiry: 'RESTRICT_SERVICE',
          status: 'ACCEPTED',
          assigned_reviewer_role: 'technical_head',
          reviewed_by: 'Technical Director',
          reviewed_at: '2026-01-13T14:00:00.000Z',
          expiry_date: '2028-06-30',
        },
      ],
    };
    this.onboardingPlans.set('sup-01', plan1);

    // Scoped Approvals for Apex HVAC
    this.serviceApprovals.set('sa-sup-01-hvac', {
      id: 'sa-sup-01-hvac',
      supplier_id: 'sup-01',
      service_slug: 'hvac',
      service_name: 'HVAC & Chillers',
      approval_status: 'APPROVED',
      effective_date: '2026-01-15T00:00:00.000Z',
      review_date: '2027-01-15T00:00:00.000Z',
      approved_by: 'EntireFM Procurement Director',
      rationale: 'Fully compliant F-Gas / REFCOM contractor with exemplary RAMS.',
    });

    this.geographicApprovals.set('ga-sup-01-manc', {
      id: 'ga-sup-01-manc',
      supplier_id: 'sup-01',
      region_or_city: 'Manchester',
      is_approved: true,
      approved_by: 'EntireFM Operations Director',
      approved_at: '2026-01-15T00:00:00.000Z',
    });

    this.geographicApprovals.set('ga-sup-01-leeds', {
      id: 'ga-sup-01-leeds',
      supplier_id: 'sup-01',
      region_or_city: 'Leeds',
      is_approved: true,
      approved_by: 'EntireFM Operations Director',
      approved_at: '2026-01-15T00:00:00.000Z',
    });

    // Bank Details for Apex HVAC (Verified)
    this.bankRecords.set('sup-01', {
      id: 'bank-sup-01',
      supplier_id: 'sup-01',
      account_name: 'Apex Mechanical & HVAC Services Ltd',
      bank_name: 'Barclays Commercial',
      sort_code_masked: '20-**-**',
      account_number_masked: '****4455',
      verification_status: 'VERIFIED',
      submitted_by: 'Finance Director (Apex)',
      submitted_at: '2026-01-11T12:00:00.000Z',
      verified_by: 'Finance Officer (EntireFM)',
      verified_at: '2026-01-12T16:00:00.000Z',
      audit_note: 'Verified via telephone callback and bank statement check.',
    });

    // Code of Conduct & MSA Agreement
    this.agreements.set('agr-sup-01', {
      id: 'agr-sup-01',
      supplier_id: 'sup-01',
      agreement_type: 'MASTER_SERVICES_AGREEMENT',
      version: 'v2.4-2026',
      status: 'SIGNED',
      issued_at: '2026-01-14T09:00:00.000Z',
      signed_at: '2026-01-14T17:30:00.000Z',
      signatory_name: 'Marcus Vance',
      signatory_title: 'Managing Director',
      signatory_email: 'm.vance@apexhvac.example.co.uk',
      ip_address: '185.120.45.10',
    });
  }
}

const gAssurance = globalThis as unknown as { __efm_supplierAssuranceStore?: SupplierAssuranceMemoryStore };
if (!gAssurance.__efm_supplierAssuranceStore) {
  gAssurance.__efm_supplierAssuranceStore = new SupplierAssuranceMemoryStore();
}
const store = gAssurance.__efm_supplierAssuranceStore;

/**
 * 1. GET OR INITIALISE ONBOARDING PLAN
 */
export async function getSupplierOnboardingPlan(supplierId: string): Promise<SupplierOnboardingPlan | null> {
  if (store.onboardingPlans.has(supplierId)) {
    return store.onboardingPlans.get(supplierId)!;
  }

  const supplier = await getSupplierOrganisation(supplierId);
  if (!supplier) return null;

  const plan = generateSupplierOnboardingPlan(supplier);
  store.onboardingPlans.set(supplierId, plan);
  return plan;
}

/**
 * 2. UPDATE PLAN ITEM REVIEW STATUS (WITH AUDIT)
 */
export async function updateAssuranceItemStatus(params: {
  supplierId: string;
  itemId: string;
  newStatus: ItemReviewStatus;
  reviewer: string;
  rejectionReason?: string;
  waivedReason?: string;
  expiryDate?: string;
}): Promise<SupplierOnboardingPlan | null> {
  const plan = await getSupplierOnboardingPlan(params.supplierId);
  if (!plan) return null;

  const itemIndex = plan.items.findIndex((i) => i.id === params.itemId);
  if (itemIndex === -1) return null;

  const oldStatus = plan.items[itemIndex].status;
  plan.items[itemIndex].status = params.newStatus;
  plan.items[itemIndex].reviewed_by = params.reviewer;
  plan.items[itemIndex].reviewed_at = new Date().toISOString();
  if (params.rejectionReason) plan.items[itemIndex].rejection_reason = params.rejectionReason;
  if (params.waivedReason) {
    plan.items[itemIndex].waived_reason = params.waivedReason;
    plan.items[itemIndex].waived_by = params.reviewer;
    plan.items[itemIndex].waived_at = new Date().toISOString();
  }
  if (params.expiryDate) plan.items[itemIndex].expiry_date = params.expiryDate;

  const updatedPlan = recalculatePlanProgress(plan);
  store.onboardingPlans.set(params.supplierId, updatedPlan);

  // Record Audit
  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: params.supplierId,
    actor: params.reviewer,
    action: 'UPDATE_ASSURANCE_ITEM',
    entity_type: 'AssurancePlanItem',
    entity_id: params.itemId,
    old_value: oldStatus,
    new_value: params.newStatus,
    reason: params.rejectionReason || params.waivedReason || 'Reviewer assessment',
    timestamp: new Date().toISOString(),
  });

  return updatedPlan;
}

/**
 * 3. DOCUMENT VAULT MANAGEMENT (WITH VERSIONING)
 */
export async function uploadSupplierDocument(params: {
  supplier_id: string;
  requirement_id?: string;
  document_type: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path: string;
  issued_by?: string;
  certificate_number?: string;
  expiry_date?: string;
  uploaded_by: string;
}): Promise<SupplierDocumentRecord> {
  const existingDocs = Array.from(store.documents.values()).filter(
    (d) => d.supplier_id === params.supplier_id && d.document_type === params.document_type && d.document_state === 'CURRENT'
  );

  const docId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const newDoc: SupplierDocumentRecord = {
    id: docId,
    supplier_id: params.supplier_id,
    requirement_id: params.requirement_id,
    document_type: params.document_type,
    file_name: params.file_name,
    file_size_bytes: params.file_size_bytes,
    mime_type: params.mime_type,
    storage_path: params.storage_path,
    issued_by: params.issued_by,
    certificate_number: params.certificate_number,
    expiry_date: params.expiry_date,
    document_state: 'CURRENT',
    review_status: 'SUBMITTED',
    version: existingDocs.length + 1,
    uploaded_by: params.uploaded_by,
    uploaded_at: new Date().toISOString(),
  };

  // Supersede existing current documents
  for (const oldDoc of existingDocs) {
    oldDoc.document_state = 'SUPERSEDED';
    oldDoc.replaced_by_id = docId;
    store.documents.set(oldDoc.id, oldDoc);
  }

  store.documents.set(docId, newDoc);

  // Link to plan item if requirement_id provided
  const plan = store.onboardingPlans.get(params.supplier_id);
  if (plan) {
    const item = plan.items.find((i) => i.requirement_id === params.requirement_id || i.internal_code === params.document_type);
    if (item) {
      item.status = 'SUBMITTED';
      item.evidence_document_id = docId;
      item.expiry_date = params.expiry_date;
      store.onboardingPlans.set(params.supplier_id, recalculatePlanProgress(plan));
    }
  }

  return newDoc;
}

export async function listSupplierDocuments(supplierId?: string): Promise<SupplierDocumentRecord[]> {
  const all = Array.from(store.documents.values());
  if (!supplierId) return all;
  return all.filter((d) => d.supplier_id === supplierId);
}

/**
 * 4. STRUCTURED INSURANCE MANAGEMENT
 */
export async function saveSupplierInsurance(insurance: SupplierInsuranceRecord): Promise<SupplierInsuranceRecord> {
  const isBelow = insurance.limit_gbp < insurance.required_limit_gbp;
  const record: SupplierInsuranceRecord = {
    ...insurance,
    is_below_required_limit: isBelow,
    status: isBelow ? 'BELOW_LIMIT' : 'VALID',
  };
  store.insuranceRecords.set(`${insurance.supplier_id}-${insurance.insurance_type}`, record);
  return record;
}

export async function listSupplierInsurance(supplierId: string): Promise<SupplierInsuranceRecord[]> {
  return Array.from(store.insuranceRecords.values()).filter((i) => i.supplier_id === supplierId);
}

/**
 * 5. BANK DETAILS WORKFLOW (DUAL CONTROL)
 */
export async function submitBankDetails(params: {
  supplier_id: string;
  account_name: string;
  bank_name: string;
  sort_code: string;
  account_number: string;
  submitted_by: string;
}): Promise<SupplierBankRecord> {
  const maskedSort = `${params.sort_code.slice(0, 2)}-**-**`;
  const maskedAcc = `****${params.sort_code.slice(-4)}`;

  const record: SupplierBankRecord = {
    id: `bank-${params.supplier_id}`,
    supplier_id: params.supplier_id,
    account_name: params.account_name,
    bank_name: params.bank_name,
    sort_code_masked: maskedSort,
    account_number_masked: maskedAcc,
    verification_status: 'VERIFICATION_REQUIRED',
    submitted_by: params.submitted_by,
    submitted_at: new Date().toISOString(),
  };

  store.bankRecords.set(params.supplier_id, record);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: params.supplier_id,
    actor: params.submitted_by,
    action: 'SUBMIT_BANK_DETAILS',
    entity_type: 'SupplierBankRecord',
    entity_id: record.id,
    new_value: 'VERIFICATION_REQUIRED',
    reason: 'Bank detail change submitted, pending dual-control review',
    timestamp: new Date().toISOString(),
  });

  return record;
}

export async function verifyBankDetails(params: {
  supplier_id: string;
  verified_by: string;
  decision: 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
  audit_note?: string;
}): Promise<SupplierBankRecord | null> {
  const record = store.bankRecords.get(params.supplier_id);
  if (!record) return null;

  record.verification_status = params.decision;
  record.verified_by = params.verified_by;
  record.verified_at = new Date().toISOString();
  if (params.rejection_reason) record.rejection_reason = params.rejection_reason;
  if (params.audit_note) record.audit_note = params.audit_note;

  store.bankRecords.set(params.supplier_id, record);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: params.supplier_id,
    actor: params.verified_by,
    action: 'VERIFY_BANK_DETAILS',
    entity_type: 'SupplierBankRecord',
    entity_id: record.id,
    new_value: params.decision,
    reason: params.rejection_reason || params.audit_note || 'Dual control verification completed',
    timestamp: new Date().toISOString(),
  });

  return record;
}

export async function getSupplierBankDetails(supplierId: string): Promise<SupplierBankRecord | null> {
  return store.bankRecords.get(supplierId) || null;
}

/**
 * 6. REMEDIATION ACTIONS ENGINE
 */
export async function createRemediationAction(action: Omit<SupplierRemediationAction, 'id' | 'status' | 'raised_date'>): Promise<SupplierRemediationAction> {
  const newAction: SupplierRemediationAction = {
    ...action,
    id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    status: 'OPEN',
    raised_date: new Date().toISOString(),
  };

  store.remediationActions.set(newAction.id, newAction);

  // If Critical Severity, raise compliance hold
  if (newAction.severity === 'CRITICAL') {
    await raiseComplianceHold({
      supplier_id: newAction.supplier_id,
      hold_reason: `Critical Remediation Action: ${newAction.issue_summary}`,
      hold_scope: 'GLOBAL',
      raised_by: 'System (Critical Remediation Escalation)',
      review_date: newAction.due_date,
      resolution_required: newAction.detailed_remediation_required,
    });
  }

  return newAction;
}

export async function updateRemediationStatus(params: {
  actionId: string;
  status: RemediationStatus;
  closedBy?: string;
  resolutionNotes?: string;
}): Promise<SupplierRemediationAction | null> {
  const action = store.remediationActions.get(params.actionId);
  if (!action) return null;

  action.status = params.status;
  if (params.closedBy) action.closed_by = params.closedBy;
  if (params.resolutionNotes) action.resolution_notes = params.resolutionNotes;
  if (params.status === 'RESOLVED') action.closed_at = new Date().toISOString();

  store.remediationActions.set(params.actionId, action);
  return action;
}

export async function listRemediationActions(supplierId?: string): Promise<SupplierRemediationAction[]> {
  const all = Array.from(store.remediationActions.values());
  if (!supplierId) return all;
  return all.filter((r) => r.supplier_id === supplierId);
}

/**
 * 7. SCOPED SERVICE & GEOGRAPHIC APPROVALS
 */
export async function saveServiceApproval(approval: Omit<ServiceApprovalRecord, 'id'>): Promise<ServiceApprovalRecord> {
  const id = `sa-${approval.supplier_id}-${approval.service_slug}`;
  const record: ServiceApprovalRecord = { ...approval, id };
  store.serviceApprovals.set(id, record);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: approval.supplier_id,
    actor: approval.approved_by,
    action: 'SERVICE_APPROVAL_DECISION',
    entity_type: 'ServiceApprovalRecord',
    entity_id: id,
    new_value: approval.approval_status,
    reason: approval.rationale,
    timestamp: new Date().toISOString(),
  });

  return record;
}

export async function listServiceApprovals(supplierId?: string): Promise<ServiceApprovalRecord[]> {
  const all = Array.from(store.serviceApprovals.values());
  if (!supplierId) return all;
  return all.filter((s) => s.supplier_id === supplierId);
}

export async function saveGeographicApproval(approval: Omit<GeographicApprovalRecord, 'id'>): Promise<GeographicApprovalRecord> {
  const id = `ga-${approval.supplier_id}-${approval.region_or_city.toLowerCase()}`;
  const record: GeographicApprovalRecord = { ...approval, id };
  store.geographicApprovals.set(id, record);
  return record;
}

export async function listGeographicApprovals(supplierId?: string): Promise<GeographicApprovalRecord[]> {
  const all = Array.from(store.geographicApprovals.values());
  if (!supplierId) return all;
  return all.filter((g) => g.supplier_id === supplierId);
}

/**
 * 8. COMPLIANCE HOLDS ENGINE
 */
export async function raiseComplianceHold(hold: Omit<ComplianceHoldRecord, 'id' | 'raised_at' | 'is_active'>): Promise<ComplianceHoldRecord> {
  const id = `hold-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const record: ComplianceHoldRecord = {
    ...hold,
    id,
    raised_at: new Date().toISOString(),
    is_active: true,
  };
  store.complianceHolds.set(id, record);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: hold.supplier_id,
    actor: hold.raised_by,
    action: 'RAISE_COMPLIANCE_HOLD',
    entity_type: 'ComplianceHoldRecord',
    entity_id: id,
    new_value: hold.hold_scope,
    reason: hold.hold_reason,
    timestamp: new Date().toISOString(),
  });

  return record;
}

export async function resolveComplianceHold(holdId: string, resolvedBy: string): Promise<ComplianceHoldRecord | null> {
  const hold = store.complianceHolds.get(holdId);
  if (!hold) return null;

  hold.is_active = false;
  hold.resolved_by = resolvedBy;
  hold.resolved_at = new Date().toISOString();
  store.complianceHolds.set(holdId, hold);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: hold.supplier_id,
    actor: resolvedBy,
    action: 'RESOLVE_COMPLIANCE_HOLD',
    entity_type: 'ComplianceHoldRecord',
    entity_id: holdId,
    new_value: 'INACTIVE',
    reason: 'Compliance issue verified and cleared',
    timestamp: new Date().toISOString(),
  });

  return hold;
}

export async function listComplianceHolds(supplierId?: string): Promise<ComplianceHoldRecord[]> {
  const all = Array.from(store.complianceHolds.values());
  if (!supplierId) return all;
  return all.filter((h) => h.supplier_id === supplierId);
}

/**
 * 9. AGREEMENTS & CODE OF CONDUCT
 */
export async function issueSupplierAgreement(agreement: Omit<SupplierAgreementRecord, 'id' | 'status' | 'issued_at'>): Promise<SupplierAgreementRecord> {
  const id = `agr-${Date.now()}`;
  const record: SupplierAgreementRecord = {
    ...agreement,
    id,
    status: 'ISSUED',
    issued_at: new Date().toISOString(),
  };
  store.agreements.set(id, record);
  return record;
}

export async function signSupplierAgreement(params: {
  agreementId: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  ipAddress: string;
}): Promise<SupplierAgreementRecord | null> {
  const agreement = store.agreements.get(params.agreementId);
  if (!agreement) return null;

  agreement.status = 'SIGNED';
  agreement.signatory_name = params.signatoryName;
  agreement.signatory_title = params.signatoryTitle;
  agreement.signatory_email = params.signatoryEmail;
  agreement.ip_address = params.ipAddress;
  agreement.signed_at = new Date().toISOString();

  store.agreements.set(params.agreementId, agreement);

  store.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    supplier_id: agreement.supplier_id,
    actor: params.signatoryName,
    action: 'SIGN_AGREEMENT',
    entity_type: 'SupplierAgreementRecord',
    entity_id: params.agreementId,
    new_value: 'SIGNED',
    reason: `Digitally executed by ${params.signatoryName} (${params.signatoryTitle})`,
    timestamp: new Date().toISOString(),
  });

  return agreement;
}

export async function listSupplierAgreements(supplierId?: string): Promise<SupplierAgreementRecord[]> {
  const all = Array.from(store.agreements.values());
  if (!supplierId) return all;
  return all.filter((a) => a.supplier_id === supplierId);
}

/**
 * 10. AUDIT LOGS
 */
export async function listSupplierAuditLogs(supplierId?: string): Promise<SupplierAssuranceAuditRecord[]> {
  if (!supplierId) return store.auditLogs;
  return store.auditLogs.filter((a) => a.supplier_id === supplierId);
}

export async function recordAssuranceAudit(log: Omit<SupplierAssuranceAuditRecord, 'id' | 'timestamp'>): Promise<SupplierAssuranceAuditRecord> {
  const record: SupplierAssuranceAuditRecord = {
    ...log,
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  store.auditLogs.unshift(record);
  return record;
}
