/**
 * ENTIREFM SUPPLIER RFI, REVIEW & SCOPED APPROVAL ENGINE
 * =======================================================
 * Manages Request For Information (RFI) lifecycle, supplier responses,
 * re-reviews, scoped approvals with geographic/service boundaries,
 * conditional approvals, and decline audit trails.
 */

import { getSupplierOnboardingDraft, saveSupplierOnboardingDraft, getSupplierOrganisation, supplierMemoryStore } from './store';
import { ServiceApprovalRecord, GeographicApprovalRecord } from './assurance-types';

export type RfiStatus = 'ACTION_REQUIRED' | 'DRAFT_RESPONSE' | 'RESPONSE_SUBMITTED' | 'RESOLVED';

export interface SupplierRfiRecord {
  id: string;
  supplier_id: string;
  application_ref: string;
  section_key: string;
  title: string;
  requirement_description: string;
  due_date?: string;
  status: RfiStatus;
  raised_by: string;
  raised_at: string;
  supplier_response_text?: string;
  supplier_response_document_id?: string;
  responded_at?: string;
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
}

export interface SupplierApprovalDecision {
  supplier_id: string;
  decision_type: 'APPROVED' | 'CONDITIONALLY_APPROVED' | 'DECLINED';
  approved_services: {
    service_slug: string;
    service_name: string;
    approved_geographies: string[];
    restrictions?: string[];
  }[];
  condition_description?: string;
  condition_deadline?: string;
  decline_reason_category?: string;
  decline_explanation?: string;
  decided_by: string;
  decided_at: string;
  effective_date: string;
  next_review_date: string;
}

class MemorySupplierRfiStore {
  public rfis: Map<string, SupplierRfiRecord> = new Map();
  public decisions: Map<string, SupplierApprovalDecision> = new Map();
  public processedWebhookEvents: Set<string> = new Set();

  constructor() {
    this.seedInitialRfis();
  }

  private seedInitialRfis() {
    // Seed initial demo RFI
    const rfi1: SupplierRfiRecord = {
      id: 'rfi-001',
      supplier_id: 'sup-test-01',
      application_ref: 'SUP-260825-9921',
      section_key: 'insurance',
      title: 'Public Liability Schedule Indemnity Confirmation',
      requirement_description: 'Please upload the full policy schedule showing the £10M indemnity limit and broker contact details.',
      due_date: '2026-09-15',
      status: 'ACTION_REQUIRED',
      raised_by: 'Head of Compliance',
      raised_at: '2026-08-20T10:00:00.000Z',
    };
    this.rfis.set(rfi1.id, rfi1);
  }
}

export const supplierRfiStore = new MemorySupplierRfiStore();

/**
 * List RFIs for a supplier (isolated by organisation ID)
 */
export async function listSupplierRfis(supplierId: string, status?: RfiStatus): Promise<SupplierRfiRecord[]> {
  let list = Array.from(supplierRfiStore.rfis.values()).filter((r) => r.supplier_id === supplierId);
  if (status) list = list.filter((r) => r.status === status);
  return list.sort((a, b) => new Date(b.raised_at).getTime() - new Date(a.raised_at).getTime());
}

/**
 * Get RFI by ID
 */
export async function getSupplierRfi(rfiId: string): Promise<SupplierRfiRecord | null> {
  return supplierRfiStore.rfis.get(rfiId) || null;
}

/**
 * Create a new Request For Information (RFI) from reviewer
 * Updates application state to INFORMATION_REQUIRED
 */
export async function createSupplierRfi(data: {
  supplier_id: string;
  application_ref: string;
  section_key: string;
  title: string;
  requirement_description: string;
  due_date?: string;
  raised_by: string;
}): Promise<SupplierRfiRecord> {
  const id = `rfi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record: SupplierRfiRecord = {
    id,
    supplier_id: data.supplier_id,
    application_ref: data.application_ref,
    section_key: data.section_key,
    title: data.title,
    requirement_description: data.requirement_description,
    due_date: data.due_date,
    status: 'ACTION_REQUIRED',
    raised_by: data.raised_by,
    raised_at: new Date().toISOString(),
  };

  supplierRfiStore.rfis.set(id, record);

  // Update onboarding draft state
  const draft = await getSupplierOnboardingDraft(data.supplier_id);
  draft.status = 'INFORMATION_REQUIRED';
  draft.updated_at = new Date().toISOString();
  await saveSupplierOnboardingDraft(data.supplier_id, draft);

  return record;
}

/**
 * Supplier responds to an RFI (Free of charge — No repeat application fee)
 */
export async function respondToSupplierRfi(
  rfiId: string,
  supplierId: string,
  responseText: string,
  documentId?: string
): Promise<{ success: boolean; rfi?: SupplierRfiRecord; error?: string }> {
  const rfi = supplierRfiStore.rfis.get(rfiId);
  if (!rfi) return { success: false, error: 'RFI not found' };
  if (rfi.supplier_id !== supplierId) {
    return { success: false, error: 'Unauthorised: RFI belongs to another organisation' };
  }

  rfi.supplier_response_text = responseText;
  if (documentId) rfi.supplier_response_document_id = documentId;
  rfi.responded_at = new Date().toISOString();
  rfi.status = 'RESPONSE_SUBMITTED';

  supplierRfiStore.rfis.set(rfi.id, rfi);

  // Check if all RFIs for this supplier are submitted/resolved
  const allRfis = await listSupplierRfis(supplierId);
  const hasPendingAction = allRfis.some((r) => r.status === 'ACTION_REQUIRED');

  if (!hasPendingAction) {
    const draft = await getSupplierOnboardingDraft(supplierId);
    draft.status = 'UNDER_REVIEW';
    draft.updated_at = new Date().toISOString();
    await saveSupplierOnboardingDraft(supplierId, draft);
  }

  return { success: true, rfi };
}

/**
 * Reviewer resolves / accepts RFI response
 */
export async function resolveSupplierRfi(
  rfiId: string,
  resolvedBy: string,
  notes?: string
): Promise<{ success: boolean; rfi?: SupplierRfiRecord; error?: string }> {
  const rfi = supplierRfiStore.rfis.get(rfiId);
  if (!rfi) return { success: false, error: 'RFI not found' };

  rfi.status = 'RESOLVED';
  rfi.resolved_by = resolvedBy;
  rfi.resolved_at = new Date().toISOString();
  rfi.resolution_notes = notes;

  supplierRfiStore.rfis.set(rfi.id, rfi);
  return { success: true, rfi };
}

/**
 * Reviewer Approves Supplier with Scoped Services and Geographies
 */
export async function approveSupplierWithScope(
  supplierId: string,
  decision: {
    approved_services: {
      service_slug: string;
      service_name: string;
      approved_geographies: string[];
      restrictions?: string[];
    }[];
    decided_by: string;
    effective_date?: string;
    next_review_date?: string;
  }
): Promise<{ success: boolean; decision: SupplierApprovalDecision }> {
  const now = new Date();
  const effective = decision.effective_date || now.toISOString().split('T')[0];
  const nextReview =
    decision.next_review_date ||
    new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const approvalRecord: SupplierApprovalDecision = {
    supplier_id: supplierId,
    decision_type: 'APPROVED',
    approved_services: decision.approved_services,
    decided_by: decision.decided_by,
    decided_at: now.toISOString(),
    effective_date: effective,
    next_review_date: nextReview,
  };

  supplierRfiStore.decisions.set(supplierId, approvalRecord);

  // Update Supplier Organisation
  const org = await getSupplierOrganisation(supplierId);
  if (org) {
    org.relationship_level = 'APPROVED_SUPPLIER';
    org.compliance_status = 'APPROVED';
    org.updated_at = now.toISOString();
    supplierMemoryStore.organisations.set(supplierId, org);
  }

  // Update Onboarding Draft State
  const draft = await getSupplierOnboardingDraft(supplierId);
  draft.status = 'APPROVED';
  draft.updated_at = now.toISOString();
  await saveSupplierOnboardingDraft(supplierId, draft);

  return { success: true, decision: approvalRecord };
}

/**
 * Reviewer Conditionally Approves Supplier
 */
export async function conditionallyApproveSupplier(
  supplierId: string,
  data: {
    condition_description: string;
    condition_deadline: string;
    approved_services: {
      service_slug: string;
      service_name: string;
      approved_geographies: string[];
      restrictions?: string[];
    }[];
    decided_by: string;
  }
): Promise<{ success: boolean; decision: SupplierApprovalDecision }> {
  const now = new Date();
  const effective = now.toISOString().split('T')[0];
  const nextReview = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const approvalRecord: SupplierApprovalDecision = {
    supplier_id: supplierId,
    decision_type: 'CONDITIONALLY_APPROVED',
    condition_description: data.condition_description,
    condition_deadline: data.condition_deadline,
    approved_services: data.approved_services,
    decided_by: data.decided_by,
    decided_at: now.toISOString(),
    effective_date: effective,
    next_review_date: nextReview,
  };

  supplierRfiStore.decisions.set(supplierId, approvalRecord);

  const draft = await getSupplierOnboardingDraft(supplierId);
  draft.status = 'CONDITIONALLY_APPROVED';
  draft.updated_at = now.toISOString();
  await saveSupplierOnboardingDraft(supplierId, draft);

  return { success: true, decision: approvalRecord };
}

/**
 * Reviewer Declines Supplier Application (No Automatic Refund)
 */
export async function declineSupplierApplication(
  supplierId: string,
  data: {
    reason_category: string;
    explanation: string;
    decided_by: string;
  }
): Promise<{ success: boolean; decision: SupplierApprovalDecision }> {
  const now = new Date();
  const decision: SupplierApprovalDecision = {
    supplier_id: supplierId,
    decision_type: 'DECLINED',
    approved_services: [],
    decline_reason_category: data.reason_category,
    decline_explanation: data.explanation,
    decided_by: data.decided_by,
    decided_at: now.toISOString(),
    effective_date: now.toISOString().split('T')[0],
    next_review_date: '',
  };

  supplierRfiStore.decisions.set(supplierId, decision);

  const draft = await getSupplierOnboardingDraft(supplierId);
  draft.status = 'DECLINED';
  draft.updated_at = now.toISOString();
  await saveSupplierOnboardingDraft(supplierId, draft);

  return { success: true, decision };
}

/**
 * Get supplier decision
 */
export async function getSupplierDecision(supplierId: string): Promise<SupplierApprovalDecision | null> {
  return supplierRfiStore.decisions.get(supplierId) || null;
}
