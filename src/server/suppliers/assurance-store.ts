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
import { dbQuery, isDbConfigured } from '@/server/db/client';

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function getOwnerFilter(supplierId: string): string {
  return isUuid(supplierId)
    ? `organisation_id=eq.${supplierId}`
    : `supplier_org_id=eq.${encodeURIComponent(supplierId)}`;
}

function getOwnerInsert(supplierId: string): { organisation_id?: string; supplier_org_id?: string } {
  return isUuid(supplierId)
    ? { organisation_id: supplierId, supplier_org_id: undefined }
    : { supplier_org_id: supplierId, organisation_id: undefined };
}

/**
 * 1. GET OR INITIALISE ONBOARDING PLAN
 */
export async function getSupplierOnboardingPlan(supplierId: string): Promise<SupplierOnboardingPlan | null> {
  if (!isDbConfigured()) return null;

  const filter = getOwnerFilter(supplierId);
  const { data: plans } = await dbQuery<any[]>(`supplier_onboarding_plans?${filter}&limit=1`);

  if (plans && plans.length > 0) {
    const planRow = plans[0];
    const { data: items } = await dbQuery<any[]>(
      `supplier_assurance_plan_items?plan_id=eq.${encodeURIComponent(planRow.id)}&order=internal_code.asc`
    );

    return {
      id: planRow.id,
      supplier_id: planRow.organisation_id || planRow.supplier_org_id || supplierId,
      rule_version: planRow.rule_version,
      generated_at: planRow.generated_at,
      risk_level: planRow.risk_level,
      total_applicable_items: planRow.total_applicable_items,
      total_mandatory_items: planRow.total_mandatory_items,
      completed_mandatory_items: planRow.completed_mandatory_items,
      completion_percentage: Number(planRow.completion_percentage || 0),
      is_onboarding_complete: planRow.is_onboarding_complete,
      items: (items || []).map((i) => ({
        id: i.id,
        requirement_id: i.requirement_id,
        internal_code: i.internal_code,
        title: i.title,
        category: i.category,
        description: i.description || '',
        is_mandatory: i.is_mandatory,
        evidence_type: i.evidence_type,
        consequence_on_expiry: i.consequence_on_expiry,
        status: i.status,
        evidence_document_id: i.evidence_document_id || undefined,
        evidence_notes: i.evidence_notes || undefined,
        rejection_reason: i.rejection_reason || undefined,
        assigned_reviewer_role: i.assigned_reviewer_role,
        reviewed_by: i.reviewed_by || undefined,
        reviewed_at: i.reviewed_at || undefined,
        expiry_date: i.expiry_date || undefined,
        waived_reason: i.waived_reason || undefined,
        waived_by: i.waived_by || undefined,
        waived_at: i.waived_at || undefined,
      })),
    };
  }

  const supplier = await getSupplierOrganisation(supplierId);
  if (!supplier) return null;

  const generated = generateSupplierOnboardingPlan(supplier);
  const ownerCols = getOwnerInsert(supplierId);

  await dbQuery('supplier_onboarding_plans', {
    method: 'POST',
    body: {
      id: generated.id,
      ...ownerCols,
      rule_version: generated.rule_version,
      generated_at: generated.generated_at,
      risk_level: generated.risk_level,
      total_applicable_items: generated.total_applicable_items,
      total_mandatory_items: generated.total_mandatory_items,
      completed_mandatory_items: generated.completed_mandatory_items,
      completion_percentage: generated.completion_percentage,
      is_onboarding_complete: generated.is_onboarding_complete,
    },
  });

  if (generated.items && generated.items.length > 0) {
    const itemRows = generated.items.map((i) => ({
      id: i.id,
      plan_id: generated.id,
      requirement_id: i.requirement_id,
      internal_code: i.internal_code,
      title: i.title,
      category: i.category,
      description: i.description,
      is_mandatory: i.is_mandatory,
      evidence_type: i.evidence_type,
      consequence_on_expiry: i.consequence_on_expiry,
      status: i.status,
      assigned_reviewer_role: i.assigned_reviewer_role,
    }));
    await dbQuery('supplier_assurance_plan_items', {
      method: 'POST',
      body: itemRows,
    });
  }

  return generated;
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
  const now = new Date().toISOString();

  const itemUpdates: any = {
    status: params.newStatus,
    reviewed_by: params.reviewer,
    reviewed_at: now,
    updated_at: now,
  };

  if (params.rejectionReason) itemUpdates.rejection_reason = params.rejectionReason;
  if (params.waivedReason) {
    itemUpdates.waived_reason = params.waivedReason;
    itemUpdates.waived_by = params.reviewer;
    itemUpdates.waived_at = now;
  }
  if (params.expiryDate) itemUpdates.expiry_date = params.expiryDate;

  await dbQuery(`supplier_assurance_plan_items?id=eq.${encodeURIComponent(params.itemId)}`, {
    method: 'PATCH',
    body: itemUpdates,
  });

  plan.items[itemIndex].status = params.newStatus;
  plan.items[itemIndex].reviewed_by = params.reviewer;
  plan.items[itemIndex].reviewed_at = now;
  if (params.rejectionReason) plan.items[itemIndex].rejection_reason = params.rejectionReason;
  if (params.waivedReason) {
    plan.items[itemIndex].waived_reason = params.waivedReason;
    plan.items[itemIndex].waived_by = params.reviewer;
    plan.items[itemIndex].waived_at = now;
  }
  if (params.expiryDate) plan.items[itemIndex].expiry_date = params.expiryDate;

  const updatedPlan = recalculatePlanProgress(plan);

  await dbQuery(`supplier_onboarding_plans?id=eq.${encodeURIComponent(plan.id)}`, {
    method: 'PATCH',
    body: {
      completed_mandatory_items: updatedPlan.completed_mandatory_items,
      completion_percentage: updatedPlan.completion_percentage,
      is_onboarding_complete: updatedPlan.is_onboarding_complete,
      updated_at: now,
    },
  });

  await recordAssuranceAudit({
    supplier_id: params.supplierId,
    actor: params.reviewer,
    action: 'UPDATE_ASSURANCE_ITEM',
    entity_type: 'AssurancePlanItem',
    entity_id: params.itemId,
    old_value: oldStatus,
    new_value: params.newStatus,
    reason: params.rejectionReason || params.waivedReason || 'Reviewer assessment',
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
  const existingDocs = await listSupplierDocuments(params.supplier_id);
  const matched = existingDocs.filter(
    (d) => d.document_type === params.document_type && d.document_state === 'CURRENT'
  );

  const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(params.supplier_id);

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
    version: matched.length + 1,
    uploaded_by: params.uploaded_by,
    uploaded_at: now,
  };

  // Supersede previous current versions in DB
  for (const oldDoc of matched) {
    await dbQuery(`supplier_document_records?id=eq.${encodeURIComponent(oldDoc.id)}`, {
      method: 'PATCH',
      body: { document_state: 'SUPERSEDED', replaced_by_id: docId },
    });
  }

  await dbQuery('supplier_document_records', {
    method: 'POST',
    body: {
      id: docId,
      ...ownerCols,
      requirement_id: params.requirement_id || null,
      document_type: params.document_type,
      file_name: params.file_name,
      file_size_bytes: params.file_size_bytes,
      mime_type: params.mime_type,
      storage_path: params.storage_path,
      issued_by: params.issued_by || null,
      certificate_number: params.certificate_number || null,
      expiry_date: params.expiry_date || null,
      document_state: 'CURRENT',
      review_status: 'SUBMITTED',
      version: newDoc.version,
      uploaded_by: params.uploaded_by,
      uploaded_at: now,
    },
  });

  return newDoc;
}

export async function listSupplierDocuments(supplierId?: string): Promise<SupplierDocumentRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_document_records?${getOwnerFilter(supplierId)}&order=uploaded_at.desc`
    : 'supplier_document_records?order=uploaded_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    supplier_id: d.organisation_id || d.supplier_org_id || '',
    requirement_id: d.requirement_id || undefined,
    document_type: d.document_type,
    file_name: d.file_name,
    file_size_bytes: Number(d.file_size_bytes || 0),
    mime_type: d.mime_type,
    storage_path: d.storage_path,
    issued_by: d.issued_by || undefined,
    certificate_number: d.certificate_number || undefined,
    issue_date: d.issue_date || undefined,
    effective_date: d.effective_date || undefined,
    expiry_date: d.expiry_date || undefined,
    document_state: d.document_state as DocumentLifecycleState,
    review_status: d.review_status as ItemReviewStatus,
    reviewed_by: d.reviewed_by || undefined,
    reviewed_at: d.reviewed_at || undefined,
    rejection_reason: d.rejection_reason || undefined,
    version: d.version || 1,
    replaced_by_id: d.replaced_by_id || undefined,
    uploaded_by: d.uploaded_by,
    uploaded_at: d.uploaded_at,
  }));
}

/**
 * 4. STRUCTURED INSURANCE MANAGEMENT
 */
export async function saveSupplierInsurance(insurance: SupplierInsuranceRecord): Promise<SupplierInsuranceRecord> {
  const isBelow = insurance.limit_gbp < insurance.required_limit_gbp;
  const status = isBelow ? 'BELOW_LIMIT' : 'VALID';
  const id = insurance.id || `ins-${insurance.supplier_id}-${insurance.insurance_type}`;
  const ownerCols = getOwnerInsert(insurance.supplier_id);
  const now = new Date().toISOString();

  const record: SupplierInsuranceRecord = {
    ...insurance,
    id,
    is_below_required_limit: isBelow,
    status,
  };

  await dbQuery('supplier_insurance_records', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      insurance_type: insurance.insurance_type,
      insurer_name: insurance.insurer_name,
      policy_number: insurance.policy_number,
      limit_gbp: insurance.limit_gbp,
      required_limit_gbp: insurance.required_limit_gbp,
      is_below_required_limit: isBelow,
      start_date: insurance.start_date,
      expiry_date: insurance.expiry_date,
      document_id: insurance.document_id || null,
      status,
      updated_at: now,
    },
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });

  return record;
}

export async function listSupplierInsurance(supplierId: string): Promise<SupplierInsuranceRecord[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>(
    `supplier_insurance_records?${getOwnerFilter(supplierId)}&order=created_at.desc`
  );
  if (!data) return [];

  return data.map((i) => ({
    id: i.id,
    supplier_id: i.organisation_id || i.supplier_org_id || supplierId,
    insurance_type: i.insurance_type,
    insurer_name: i.insurer_name,
    policy_number: i.policy_number,
    limit_gbp: Number(i.limit_gbp || 0),
    required_limit_gbp: Number(i.required_limit_gbp || 0),
    is_below_required_limit: Boolean(i.is_below_required_limit),
    start_date: i.start_date,
    expiry_date: i.expiry_date,
    document_id: i.document_id || undefined,
    status: i.status,
  }));
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
  const maskedAcc = `****${params.account_number.slice(-4)}`;
  const id = `bank-${params.supplier_id}`;
  const ownerCols = getOwnerInsert(params.supplier_id);
  const now = new Date().toISOString();

  const record: SupplierBankRecord = {
    id,
    supplier_id: params.supplier_id,
    account_name: params.account_name,
    bank_name: params.bank_name,
    sort_code_masked: maskedSort,
    account_number_masked: maskedAcc,
    verification_status: 'VERIFICATION_REQUIRED',
    submitted_by: params.submitted_by,
    submitted_at: now,
  };

  await dbQuery('supplier_bank_records', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      account_name: params.account_name,
      bank_name: params.bank_name,
      sort_code_masked: maskedSort,
      account_number_masked: maskedAcc,
      verification_status: 'VERIFICATION_REQUIRED',
      submitted_by: params.submitted_by,
      submitted_at: now,
      updated_at: now,
    },
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });

  await recordAssuranceAudit({
    supplier_id: params.supplier_id,
    actor: params.submitted_by,
    action: 'SUBMIT_BANK_DETAILS',
    entity_type: 'SupplierBankRecord',
    entity_id: id,
    new_value: 'VERIFICATION_REQUIRED',
    reason: 'Bank detail change submitted, pending dual-control review',
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
  const existing = await getSupplierBankDetails(params.supplier_id);
  if (!existing) return null;

  const now = new Date().toISOString();
  await dbQuery(`supplier_bank_records?id=eq.${encodeURIComponent(existing.id)}`, {
    method: 'PATCH',
    body: {
      verification_status: params.decision,
      verified_by: params.verified_by,
      verified_at: now,
      rejection_reason: params.rejection_reason || null,
      audit_note: params.audit_note || null,
      updated_at: now,
    },
  });

  existing.verification_status = params.decision;
  existing.verified_by = params.verified_by;
  existing.verified_at = now;
  if (params.rejection_reason) existing.rejection_reason = params.rejection_reason;
  if (params.audit_note) existing.audit_note = params.audit_note;

  await recordAssuranceAudit({
    supplier_id: params.supplier_id,
    actor: params.verified_by,
    action: 'VERIFY_BANK_DETAILS',
    entity_type: 'SupplierBankRecord',
    entity_id: existing.id,
    new_value: params.decision,
    reason: params.rejection_reason || params.audit_note || 'Dual control verification completed',
  });

  return existing;
}

export async function getSupplierBankDetails(supplierId: string): Promise<SupplierBankRecord | null> {
  if (!isDbConfigured()) return null;

  const { data } = await dbQuery<any[]>(
    `supplier_bank_records?${getOwnerFilter(supplierId)}&limit=1`
  );
  if (!data || data.length === 0) return null;

  const b = data[0];
  return {
    id: b.id,
    supplier_id: b.organisation_id || b.supplier_org_id || supplierId,
    account_name: b.account_name,
    bank_name: b.bank_name,
    sort_code_masked: b.sort_code_masked,
    account_number_masked: b.account_number_masked,
    verification_status: b.verification_status as BankVerificationStatus,
    submitted_by: b.submitted_by,
    submitted_at: b.submitted_at,
    verified_by: b.verified_by || undefined,
    verified_at: b.verified_at || undefined,
    rejection_reason: b.rejection_reason || undefined,
    audit_note: b.audit_note || undefined,
  };
}

/**
 * 6. REMEDIATION ACTIONS ENGINE
 */
export async function createRemediationAction(
  action: Omit<SupplierRemediationAction, 'id' | 'status' | 'raised_date'>
): Promise<SupplierRemediationAction> {
  const id = `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(action.supplier_id);

  const newAction: SupplierRemediationAction = {
    ...action,
    id,
    status: 'OPEN',
    raised_date: now,
  };

  await dbQuery('supplier_remediation_actions', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      requirement_id: action.requirement_id || null,
      issue_summary: action.issue_summary,
      detailed_remediation_required: action.detailed_remediation_required,
      severity: action.severity,
      assigned_to_role: action.assigned_to_role,
      supplier_contact: action.supplier_contact || null,
      raised_date: now,
      due_date: action.due_date,
      status: 'OPEN',
    },
  });

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
  if (!isDbConfigured()) return null;

  const now = new Date().toISOString();
  const updates: any = {
    status: params.status,
  };
  if (params.closedBy) updates.closed_by = params.closedBy;
  if (params.resolutionNotes) updates.resolution_notes = params.resolutionNotes;
  if (params.status === 'RESOLVED') updates.closed_at = now;

  const { data } = await dbQuery<any[]>(
    `supplier_remediation_actions?id=eq.${encodeURIComponent(params.actionId)}`,
    {
      method: 'PATCH',
      body: updates,
    }
  );

  if (!data || data.length === 0) return null;
  const r = data[0];
  return {
    id: r.id,
    supplier_id: r.organisation_id || r.supplier_org_id || '',
    requirement_id: r.requirement_id || undefined,
    issue_summary: r.issue_summary,
    detailed_remediation_required: r.detailed_remediation_required,
    severity: r.severity,
    assigned_to_role: r.assigned_to_role,
    supplier_contact: r.supplier_contact || undefined,
    raised_date: r.raised_date,
    due_date: r.due_date,
    status: r.status,
    resolution_notes: r.resolution_notes || undefined,
    closed_by: r.closed_by || undefined,
    closed_at: r.closed_at || undefined,
  };
}

export async function listRemediationActions(supplierId?: string): Promise<SupplierRemediationAction[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_remediation_actions?${getOwnerFilter(supplierId)}&order=raised_date.desc`
    : 'supplier_remediation_actions?order=raised_date.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    supplier_id: r.organisation_id || r.supplier_org_id || '',
    requirement_id: r.requirement_id || undefined,
    issue_summary: r.issue_summary,
    detailed_remediation_required: r.detailed_remediation_required,
    severity: r.severity,
    assigned_to_role: r.assigned_to_role,
    supplier_contact: r.supplier_contact || undefined,
    raised_date: r.raised_date,
    due_date: r.due_date,
    status: r.status,
    resolution_notes: r.resolution_notes || undefined,
    closed_by: r.closed_by || undefined,
    closed_at: r.closed_at || undefined,
  }));
}

/**
 * 7. SCOPED SERVICE & GEOGRAPHIC APPROVALS
 */
export async function saveServiceApproval(approval: Omit<ServiceApprovalRecord, 'id'>): Promise<ServiceApprovalRecord> {
  const id = `sa-${approval.supplier_id}-${approval.service_slug}`;
  const ownerCols = getOwnerInsert(approval.supplier_id);
  const now = new Date().toISOString();

  const record: ServiceApprovalRecord = { ...approval, id };

  await dbQuery('supplier_service_approvals', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      service_slug: approval.service_slug,
      service_name: approval.service_name,
      approval_status: approval.approval_status,
      effective_date: approval.effective_date,
      review_date: approval.review_date,
      restrictions: approval.restrictions || [],
      approved_by: approval.approved_by,
      rationale: approval.rationale || '',
      updated_at: now,
    },
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });

  await recordAssuranceAudit({
    supplier_id: approval.supplier_id,
    actor: approval.approved_by,
    action: 'SERVICE_APPROVAL_DECISION',
    entity_type: 'ServiceApprovalRecord',
    entity_id: id,
    new_value: approval.approval_status,
    reason: approval.rationale,
  });

  return record;
}

export async function listServiceApprovals(supplierId?: string): Promise<ServiceApprovalRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_service_approvals?${getOwnerFilter(supplierId)}&order=created_at.desc`
    : 'supplier_service_approvals?order=created_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((s) => ({
    id: s.id,
    supplier_id: s.organisation_id || s.supplier_org_id || '',
    service_slug: s.service_slug,
    service_name: s.service_name,
    approval_status: s.approval_status,
    effective_date: s.effective_date,
    review_date: s.review_date,
    restrictions: s.restrictions || [],
    approved_by: s.approved_by,
    rationale: s.rationale || '',
  }));
}

export async function saveGeographicApproval(approval: Omit<GeographicApprovalRecord, 'id'>): Promise<GeographicApprovalRecord> {
  const id = `ga-${approval.supplier_id}-${approval.region_or_city.toLowerCase().replace(/\s+/g, '-')}`;
  const ownerCols = getOwnerInsert(approval.supplier_id);
  const now = new Date().toISOString();

  const record: GeographicApprovalRecord = { ...approval, id };

  await dbQuery('supplier_geographic_approvals', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      region_or_city: approval.region_or_city,
      is_approved: approval.is_approved,
      approved_by: approval.approved_by,
      approved_at: approval.approved_at,
      restrictions: approval.restrictions || [],
      updated_at: now,
    },
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });

  return record;
}

export async function listGeographicApprovals(supplierId?: string): Promise<GeographicApprovalRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_geographic_approvals?${getOwnerFilter(supplierId)}&order=created_at.desc`
    : 'supplier_geographic_approvals?order=created_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((g) => ({
    id: g.id,
    supplier_id: g.organisation_id || g.supplier_org_id || '',
    region_or_city: g.region_or_city,
    is_approved: Boolean(g.is_approved),
    approved_by: g.approved_by,
    approved_at: g.approved_at,
    restrictions: g.restrictions || [],
  }));
}

/**
 * 8. COMPLIANCE HOLDS ENGINE
 */
export async function raiseComplianceHold(
  hold: Omit<ComplianceHoldRecord, 'id' | 'raised_at' | 'is_active'>
): Promise<ComplianceHoldRecord> {
  const id = `hold-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(hold.supplier_id);

  const record: ComplianceHoldRecord = {
    ...hold,
    id,
    raised_at: now,
    is_active: true,
  };

  await dbQuery('supplier_compliance_holds', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      hold_reason: hold.hold_reason,
      hold_scope: hold.hold_scope,
      affected_service_slug: hold.affected_service_slug || null,
      affected_city: hold.affected_city || null,
      affected_client_id: hold.affected_client_id || null,
      raised_by: hold.raised_by,
      raised_at: now,
      review_date: hold.review_date,
      resolution_required: hold.resolution_required,
      is_active: true,
    },
  });

  await recordAssuranceAudit({
    supplier_id: hold.supplier_id,
    actor: hold.raised_by,
    action: 'RAISE_COMPLIANCE_HOLD',
    entity_type: 'ComplianceHoldRecord',
    entity_id: id,
    new_value: hold.hold_scope,
    reason: hold.hold_reason,
  });

  return record;
}

export async function resolveComplianceHold(holdId: string, resolvedBy: string): Promise<ComplianceHoldRecord | null> {
  if (!isDbConfigured()) return null;

  const now = new Date().toISOString();
  const { data } = await dbQuery<any[]>(
    `supplier_compliance_holds?id=eq.${encodeURIComponent(holdId)}`,
    {
      method: 'PATCH',
      body: {
        is_active: false,
        resolved_by: resolvedBy,
        resolved_at: now,
      },
    }
  );

  if (!data || data.length === 0) return null;
  const h = data[0];

  await recordAssuranceAudit({
    supplier_id: h.organisation_id || h.supplier_org_id || '',
    actor: resolvedBy,
    action: 'RESOLVE_COMPLIANCE_HOLD',
    entity_type: 'ComplianceHoldRecord',
    entity_id: holdId,
    new_value: 'INACTIVE',
    reason: 'Compliance issue verified and cleared',
  });

  return {
    id: h.id,
    supplier_id: h.organisation_id || h.supplier_org_id || '',
    hold_reason: h.hold_reason,
    hold_scope: h.hold_scope as HoldScope,
    affected_service_slug: h.affected_service_slug || undefined,
    affected_city: h.affected_city || undefined,
    affected_client_id: h.affected_client_id || undefined,
    raised_by: h.raised_by,
    raised_at: h.raised_at,
    review_date: h.review_date,
    resolution_required: h.resolution_required,
    is_active: Boolean(h.is_active),
    resolved_by: h.resolved_by || undefined,
    resolved_at: h.resolved_at || undefined,
  };
}

export async function listComplianceHolds(supplierId?: string): Promise<ComplianceHoldRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_compliance_holds?${getOwnerFilter(supplierId)}&order=raised_at.desc`
    : 'supplier_compliance_holds?order=raised_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((h) => ({
    id: h.id,
    supplier_id: h.organisation_id || h.supplier_org_id || '',
    hold_reason: h.hold_reason,
    hold_scope: h.hold_scope as HoldScope,
    affected_service_slug: h.affected_service_slug || undefined,
    affected_city: h.affected_city || undefined,
    affected_client_id: h.affected_client_id || undefined,
    raised_by: h.raised_by,
    raised_at: h.raised_at,
    review_date: h.review_date,
    resolution_required: h.resolution_required,
    is_active: Boolean(h.is_active),
    resolved_by: h.resolved_by || undefined,
    resolved_at: h.resolved_at || undefined,
  }));
}

/**
 * 9. AGREEMENTS & CODE OF CONDUCT
 */
export async function issueSupplierAgreement(
  agreement: Omit<SupplierAgreementRecord, 'id' | 'status' | 'issued_at'>
): Promise<SupplierAgreementRecord> {
  const id = `agr-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(agreement.supplier_id);

  const record: SupplierAgreementRecord = {
    ...agreement,
    id,
    status: 'ISSUED',
    issued_at: now,
  };

  await dbQuery('supplier_agreements', {
    method: 'POST',
    body: {
      id,
      ...ownerCols,
      agreement_type: agreement.agreement_type,
      version: agreement.version,
      status: 'ISSUED',
      issued_at: now,
      document_id: agreement.document_id || null,
    },
  });

  return record;
}

export async function signSupplierAgreement(params: {
  agreementId: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  ipAddress: string;
}): Promise<SupplierAgreementRecord | null> {
  if (!isDbConfigured()) return null;

  const now = new Date().toISOString();
  const { data } = await dbQuery<any[]>(
    `supplier_agreements?id=eq.${encodeURIComponent(params.agreementId)}`,
    {
      method: 'PATCH',
      body: {
        status: 'SIGNED',
        signatory_name: params.signatoryName,
        signatory_title: params.signatoryTitle,
        signatory_email: params.signatoryEmail,
        ip_address: params.ipAddress,
        signed_at: now,
      },
    }
  );

  if (!data || data.length === 0) return null;
  const a = data[0];

  await recordAssuranceAudit({
    supplier_id: a.organisation_id || a.supplier_org_id || '',
    actor: params.signatoryName,
    action: 'SIGN_AGREEMENT',
    entity_type: 'SupplierAgreementRecord',
    entity_id: params.agreementId,
    new_value: 'SIGNED',
    reason: `Digitally executed by ${params.signatoryName} (${params.signatoryTitle})`,
  });

  return {
    id: a.id,
    supplier_id: a.organisation_id || a.supplier_org_id || '',
    agreement_type: a.agreement_type,
    version: a.version,
    status: a.status as AgreementStatus,
    issued_at: a.issued_at,
    signed_at: a.signed_at || undefined,
    signatory_name: a.signatory_name || undefined,
    signatory_title: a.signatory_title || undefined,
    signatory_email: a.signatory_email || undefined,
    ip_address: a.ip_address || undefined,
    document_id: a.document_id || undefined,
  };
}

export async function listSupplierAgreements(supplierId?: string): Promise<SupplierAgreementRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_agreements?${getOwnerFilter(supplierId)}&order=issued_at.desc`
    : 'supplier_agreements?order=issued_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((a) => ({
    id: a.id,
    supplier_id: a.organisation_id || a.supplier_org_id || '',
    agreement_type: a.agreement_type,
    version: a.version,
    status: a.status as AgreementStatus,
    issued_at: a.issued_at,
    signed_at: a.signed_at || undefined,
    signatory_name: a.signatory_name || undefined,
    signatory_title: a.signatory_title || undefined,
    signatory_email: a.signatory_email || undefined,
    ip_address: a.ip_address || undefined,
    document_id: a.document_id || undefined,
  }));
}

/**
 * 10. AUDIT LOGS
 */
export async function listSupplierAuditLogs(supplierId?: string): Promise<SupplierAssuranceAuditRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_assurance_audit_logs?${getOwnerFilter(supplierId)}&order=timestamp.desc`
    : 'supplier_assurance_audit_logs?order=timestamp.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((l) => ({
    id: l.id,
    supplier_id: l.organisation_id || l.supplier_org_id || '',
    actor: l.actor,
    action: l.action,
    entity_type: l.entity_type,
    entity_id: l.entity_id,
    old_value: l.old_value || undefined,
    new_value: l.new_value || undefined,
    reason: l.reason || undefined,
    timestamp: l.timestamp,
  }));
}

export async function recordAssuranceAudit(
  log: Omit<SupplierAssuranceAuditRecord, 'id' | 'timestamp'>
): Promise<SupplierAssuranceAuditRecord> {
  const id = `aud-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(log.supplier_id);

  const record: SupplierAssuranceAuditRecord = {
    ...log,
    id,
    timestamp: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_assurance_audit_logs', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        actor: log.actor,
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        old_value: log.old_value || null,
        new_value: log.new_value || null,
        reason: log.reason || null,
        timestamp: now,
      },
    });
  }

  return record;
}

/**
 * 11. DUAL IDENTITY BACKFILL / PROMOTION HELPER (STEP 5)
 * On supplier approval, promote pre-approval records (keyed to supplier_org_id text)
 * to post-approval records (keyed to organisation_id uuid).
 */
export async function linkAssuranceRecordsOnApproval(
  supplierOrgId: string,
  organisationId: string
): Promise<void> {
  if (!isDbConfigured() || !supplierOrgId || !organisationId) return;

  const tables = [
    'supplier_onboarding_plans',
    'supplier_document_records',
    'supplier_insurance_records',
    'supplier_hs_assessments',
    'supplier_infosec_assessments',
    'supplier_bank_records',
    'supplier_remediation_actions',
    'supplier_service_approvals',
    'supplier_geographic_approvals',
    'supplier_compliance_holds',
    'supplier_agreements',
    'supplier_reassessments',
    'supplier_assurance_audit_logs',
    'supplier_portal_user_records',
    'supplier_scorecards',
    'supplier_quality_defects',
    'supplier_performance_improvement_plans',
    'supplier_performance_reviews',
    'supplier_opportunity_responses',
    'supplier_award_decisions',
    'work_order_dispatches',
    'supplier_availability',
  ];

  for (const table of tables) {
    try {
      await dbQuery(`${table}?supplier_org_id=eq.${encodeURIComponent(supplierOrgId)}`, {
        method: 'PATCH',
        body: {
          organisation_id: organisationId,
          supplier_org_id: null,
        },
      });
    } catch (err) {
      console.warn(`[LINK_ASSURANCE_ON_APPROVAL_WARN] Failed on table ${table}:`, err);
    }
  }
}
