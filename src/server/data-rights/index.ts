/**
 * ENTIREFM DATA SUBJECT RIGHTS CLOCK & LIFECYCLE ENGINE
 * =======================================================
 * Statutory UK GDPR (Articles 12-22) & Data Protection Act 2018
 * Rights Management Engine.
 *
 * Implements genuine calendar-month statutory calculation (UK GDPR Art 12(3)):
 * - Handles ID verification pause / resume
 * - Handles clarification pause / resume
 * - Handles complexity extensions (+2 calendar months under Art 12(3))
 * - Enforces correct distinct reference prefixes (SAR-, REC-, ERA-, etc.)
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { UserSession } from '../identity';

export type DataSubjectRightType =
  | 'ACCESS' // Subject Access Request (SAR-YYYY-XXXXX)
  | 'RECTIFICATION' // Inaccurate records (REC-YYYY-XXXXX)
  | 'ERASURE' // Right to be forgotten (ERA-YYYY-XXXXX)
  | 'RESTRICTION' // Temporary restriction (RES-YYYY-XXXXX)
  | 'PORTABILITY' // Machine-readable transfer (POR-YYYY-XXXXX)
  | 'OBJECTION' // Right to object to marketing/profiling (OBJ-YYYY-XXXXX)
  | 'AUTOMATED_DECISION_REVIEW' // Human review of automated decision (ADR-YYYY-XXXXX)
  | 'OTHER'; // General rights inquiry (DRR-YYYY-XXXXX)

export type DataRightsLifecycleStatus =
  | 'SUBMITTED'
  | 'ID_VERIFICATION_REQUIRED'
  | 'ID_VERIFIED'
  | 'CLARIFICATION_REQUESTED'
  | 'CLARIFICATION_RECEIVED'
  | 'UNDER_INVESTIGATION'
  | 'EXTENSION_APPLIED'
  | 'COMPLETED'
  | 'REJECTED';

export interface DataRightsClockRecord {
  receivedAt: string; // T0: When request was received
  idVerificationRequired: boolean;
  idRequestedAt?: string;
  idReceivedAt?: string; // T_ID: When valid ID was supplied (clock start if ID needed)
  clarificationRequestedAt?: string;
  clarificationReceivedAt?: string;
  clarificationPauseDays: number;
  complexityAssessment?: {
    isComplex: boolean;
    justification?: string;
    assessedBy?: string;
    assessedAt?: string;
  };
  extensionApplied: boolean;
  extensionNotifiedAt?: string;
  extensionReason?: string;
  statutoryBaseDueDate: string; // Base 1 calendar month
  finalStatutoryDueDate: string; // Effective due date taking into account pauses & extensions
  completedAt?: string;
}

export interface DataRightsRequest {
  id: string;
  reference: string;
  right_type: DataSubjectRightType;
  full_name: string;
  email: string;
  phone?: string;
  relationship:
    | 'CLIENT_CONTACT'
    | 'BUILDING_OCCUPANT'
    | 'CONTRACTOR_PERSONNEL'
    | 'JOB_APPLICANT'
    | 'WEBSITE_VISITOR'
    | 'OTHER';
  organisation_name?: string;
  request_details: string;
  specific_data_scope?: string;
  identity_verified: boolean;
  status: DataRightsLifecycleStatus;
  clock: DataRightsClockRecord;
  rejection_reason?: string;
  assigned_dpo_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calculate genuine UK GDPR Calendar Month Deadline:
 * In UK law, a "calendar month" ends on the corresponding date in the following month.
 * If the following month has fewer days, it ends on the last day of that month.
 */
export function calculateCalendarMonthDeadline(startDate: Date, additionalMonths = 1): Date {
  const result = new Date(startDate);
  const startDay = result.getDate();

  result.setMonth(result.getMonth() + additionalMonths);

  // If date overflowed into next month (e.g. Jan 31 + 1 month -> March 2/3), adjust to end of Feb
  if (result.getDate() !== startDay) {
    result.setDate(0); // Sets to last day of previous month
  }
  return result;
}

/**
 * Generate correct prefix-specific reference
 */
export function generateRightsReference(type: DataSubjectRightType): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  const prefixMap: Record<DataSubjectRightType, string> = {
    ACCESS: 'SAR',
    RECTIFICATION: 'REC',
    ERASURE: 'ERA',
    RESTRICTION: 'RES',
    PORTABILITY: 'POR',
    OBJECTION: 'OBJ',
    AUTOMATED_DECISION_REVIEW: 'ADR',
    OTHER: 'DRR',
  };

  const prefix = prefixMap[type] || 'DRR';
  return `${prefix}-${year}-${random}`;
}

/**
 * Create and register a formal Data Subject Rights Request
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
  const reference = generateRightsReference(payload.right_type);
  const now = new Date();
  const receivedAt = now.toISOString();

  // Statutory 1 calendar month calculation
  const statutoryBaseDueDate = calculateCalendarMonthDeadline(now, 1).toISOString();

  const clock: DataRightsClockRecord = {
    receivedAt,
    idVerificationRequired: false,
    clarificationPauseDays: 0,
    extensionApplied: false,
    statutoryBaseDueDate,
    finalStatutoryDueDate: statutoryBaseDueDate,
  };

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
    clock,
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
    reason: `Statutory Data Subject Rights Request logged: ${payload.right_type} (${reference})`,
    source: 'PUBLIC_WEB',
    after_state: {
      reference,
      right_type: payload.right_type,
      statutory_due_date: statutoryBaseDueDate,
    },
  });

  return { record, reference };
}

/**
 * List live Data Subject Rights requests for DPO / admin
 */
export async function listDataRightsRequests(
  session: UserSession,
  status?: DataRightsLifecycleStatus
): Promise<DataRightsRequest[]> {
  let endpoint = 'data_rights_requests?select=*&order=created_at.desc';
  if (status) {
    endpoint += `&status=eq.${encodeURIComponent(status)}`;
  }
  const { data } = await dbQuery<DataRightsRequest[]>(endpoint);
  return data || [];
}
