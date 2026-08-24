/**
 * ENTIREFM DATA SUBJECT RIGHTS DOMAIN MODULE
 * ===========================================
 * Dedicated handler for UK GDPR & Data Protection Act 2018
 * Data Subject Rights Requests (SARs, Erasure, Rectification, Objection).
 * Distinct from Data Protection Complaints.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { UserSession } from '../identity';

export type DataSubjectRightType =
  | 'ACCESS' // Subject Access Request (SAR)
  | 'RECTIFICATION' // Inaccurate records
  | 'ERASURE' // Right to be forgotten
  | 'RESTRICTION' // Temporary restriction
  | 'PORTABILITY' // Machine-readable transfer
  | 'OBJECTION' // Right to object to marketing/profiling
  | 'AUTOMATED_DECISION'; // Human review of automated decision

export type DataRightsStatus =
  | 'SUBMITTED'
  | 'IDENTITY_VERIFICATION'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXTENSION_APPLIED';

export interface DataRightsRequest {
  id: string;
  reference: string;
  right_type: DataSubjectRightType;
  full_name: string;
  email: string;
  phone?: string;
  relationship: 'CLIENT_CONTACT' | 'BUILDING_OCCUPANT' | 'CONTRACTOR_PERSONNEL' | 'JOB_APPLICANT' | 'WEBSITE_VISITOR' | 'OTHER';
  organisation_name?: string;
  request_details: string;
  specific_data_scope?: string;
  identity_verified: boolean;
  status: DataRightsStatus;
  received_at: string;
  statutory_due_date: string; // Exactly 1 calendar month under Art 12(3)
  extended_due_date?: string; // Max +2 months for complex cases
  completed_at?: string;
  rejection_reason?: string;
  assigned_dpo_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Generate unique SAR reference (e.g. SAR-2026-X8K9L)
 */
export function generateDataRightsReference(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SAR-${year}-${random}`;
}

/**
 * Create and register a formal Data Subject Rights request
 */
export async function createDataRightsRequest(payload: {
  right_type: DataSubjectRightType;
  full_name: string;
  email: string;
  phone?: string;
  relationship: DataRightsRequest['relationship'];
  organisation_name?: string;
  request_details: string;
  specific_data_scope?: string;
}): Promise<{ record: DataRightsRequest; reference: string }> {
  const reference = generateDataRightsReference();
  const now = new Date();
  const receivedAt = now.toISOString();

  // Calculate 1 calendar month statutory deadline (UK GDPR Article 12(3))
  const dueDate = new Date(now);
  dueDate.setMonth(dueDate.getMonth() + 1);
  const statutoryDueDate = dueDate.toISOString();

  const record: DataRightsRequest = {
    id: `dr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    reference,
    right_type: payload.right_type,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    relationship: payload.relationship,
    organisation_name: payload.organisation_name,
    request_details: payload.request_details,
    specific_data_scope: payload.specific_data_scope,
    identity_verified: false,
    status: 'SUBMITTED',
    received_at: receivedAt,
    statutory_due_date: statutoryDueDate,
    created_at: receivedAt,
    updated_at: receivedAt,
  };

  try {
    await dbQuery('data_rights_requests', {
      method: 'POST',
      body: record,
    });
  } catch {
    console.log('[DATA_RIGHTS_REQUEST_LOG]', record);
  }

  // Record audit ledger event
  await recordAuditEvent({
    event_type: 'DATA_RIGHTS_REQUEST_LOGGED',
    object_type: 'DATA_RIGHTS_REQUEST',
    object_id: reference,
    reason: `Data Subject Rights Request registered: ${payload.right_type} (${reference})`,
    source: 'PUBLIC_WEB',
    after_state: { reference, right_type: payload.right_type, statutory_due_date: statutoryDueDate },
  });

  return { record, reference };
}

/**
 * List live Data Subject Rights requests for DPO / compliance admin
 */
export async function listDataRightsRequests(
  session: UserSession,
  status?: DataRightsStatus
): Promise<DataRightsRequest[]> {
  let endpoint = 'data_rights_requests?select=*&order=received_at.desc';
  if (status) {
    endpoint += `&status=eq.${encodeURIComponent(status)}`;
  }
  const { data } = await dbQuery<DataRightsRequest[]>(endpoint);
  return data || [];
}
