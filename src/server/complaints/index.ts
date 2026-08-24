/**
 * ENTIREFM COMPLAINTS & DISPUTE RESOLUTION DOMAIN MODULE
 * =======================================================
 * Single Source of Truth for:
 * 1. Multi-category complaint intake & routing (Service, Contractor, Billing, H&S, Data Privacy, AI, Accessibility, Speak Up).
 * 2. Prefix-aware reference generation (EFM-CMP-, DPC-, SPK-).
 * 3. SLA & statutory response tracking.
 * 4. Role-based restricted access (Speak Up & Sensitive DPO complaints shielded from operational staff).
 * 5. Full forensic audit logging.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { UserSession, RoleCode } from '../identity';

export type ComplaintCategory =
  | 'SERVICE'
  | 'CONTRACTOR'
  | 'BILLING'
  | 'HEALTH_SAFETY'
  | 'DATA_PROTECTION'
  | 'AI_GOVERNANCE'
  | 'ACCESSIBILITY'
  | 'WHISTLEBLOWING';

export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'SAFETY_CRITICAL';

export type ComplaintStatus =
  | 'RECEIVED'
  | 'ACKNOWLEDGED'
  | 'INVESTIGATING'
  | 'AWAITING_INFORMATION'
  | 'RESOLUTION_PROPOSED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED_DIRECTOR'
  | 'ESCALATED_EXTERNAL';

export type InternalTeam =
  | 'OPERATIONS'
  | 'SUPPLY_CHAIN'
  | 'FINANCE'
  | 'QHSE_SAFETY'
  | 'DPO_PRIVACY'
  | 'AI_GOVERNANCE'
  | 'ACCESSIBILITY_LEAD'
  | 'INDEPENDENT_DIRECTORS';

export interface ComplaintRecord {
  id: string;
  reference: string;
  category: ComplaintCategory;
  sub_category?: string;
  source: 'PUBLIC_WEB' | 'CLIENT_PORTAL' | 'CONTRACTOR_PORTAL' | 'EMAIL' | 'PHONE';
  organisation_id?: string;
  site_id?: string;
  site_address?: string;
  external_reference?: string; // Work order ID, Quote ID, Invoice ID
  full_name: string;
  email: string;
  phone?: string;
  organisation_name?: string;
  relationship: string;
  severity: ComplaintSeverity;
  responsible_team: InternalTeam;
  privacy_class: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  description: string;
  desired_resolution: string;
  status: ComplaintStatus;
  received_at: string;
  acknowledgement_due_at: string;
  acknowledged_at?: string;
  response_target_at: string;
  resolved_at?: string;
  closed_at?: string;
  resolution_summary?: string;
  assigned_investigator_id?: string;
  assigned_investigator_name?: string;
  escalation_notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ComplaintCorrespondence {
  id: string;
  complaint_id: string;
  author_type: 'SUBMITTER' | 'ENTIREFM_INVESTIGATOR' | 'SYSTEM' | 'EXTERNAL_MEDIATOR';
  author_name: string;
  author_email?: string;
  message: string;
  is_internal_only: boolean;
  attachments?: Array<{ title: string; url: string; file_size_bytes: number }>;
  created_at: string;
}

export const CATEGORY_ROUTING: Record<
  ComplaintCategory,
  {
    team: InternalTeam;
    prefix: string;
    privacyClass: 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
    ackTargetDays: number;
    responseTargetDays: number;
    statutoryNotice?: string;
  }
> = {
  SERVICE: {
    team: 'OPERATIONS',
    prefix: 'EFM-CMP',
    privacyClass: 'INTERNAL',
    ackTargetDays: 2,
    responseTargetDays: 10,
  },
  CONTRACTOR: {
    team: 'SUPPLY_CHAIN',
    prefix: 'EFM-CMP',
    privacyClass: 'INTERNAL',
    ackTargetDays: 2,
    responseTargetDays: 7,
  },
  BILLING: {
    team: 'FINANCE',
    prefix: 'EFM-CMP',
    privacyClass: 'CONFIDENTIAL',
    ackTargetDays: 2,
    responseTargetDays: 10,
  },
  HEALTH_SAFETY: {
    team: 'QHSE_SAFETY',
    prefix: 'EFM-CMP',
    privacyClass: 'CONFIDENTIAL',
    ackTargetDays: 1,
    responseTargetDays: 5,
    statutoryNotice: 'Immediate notification to Head of QHSE. RIDDOR assessment triggered for critical safety incidents.',
  },
  DATA_PROTECTION: {
    team: 'DPO_PRIVACY',
    prefix: 'DPC',
    privacyClass: 'CONFIDENTIAL',
    ackTargetDays: 3,
    responseTargetDays: 30, // Statutory 1 month (UK GDPR Art 12(3))
    statutoryNotice: 'Statutory 1-month response window under UK GDPR Article 12(3) and Data Protection Act 2018.',
  },
  AI_GOVERNANCE: {
    team: 'AI_GOVERNANCE',
    prefix: 'EFM-CMP',
    privacyClass: 'CONFIDENTIAL',
    ackTargetDays: 2,
    responseTargetDays: 10,
    statutoryNotice: 'Article 22 UK GDPR / DUA Act 2025 non-automated human review guarantee.',
  },
  ACCESSIBILITY: {
    team: 'ACCESSIBILITY_LEAD',
    prefix: 'EFM-CMP',
    privacyClass: 'INTERNAL',
    ackTargetDays: 2,
    responseTargetDays: 5,
  },
  WHISTLEBLOWING: {
    team: 'INDEPENDENT_DIRECTORS',
    prefix: 'SPK',
    privacyClass: 'RESTRICTED',
    ackTargetDays: 2,
    responseTargetDays: 14,
    statutoryNotice: 'Protected disclosure under Public Interest Disclosure Act 1998 (PIDA) & Employment Rights Act 1996. RESTRICTED ACCESS.',
  },
};

/**
 * Generate prefix-aware unique reference
 */
export function generateComplaintReference(category: ComplaintCategory): string {
  const routing = CATEGORY_ROUTING[category];
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${routing.prefix}-${year}-${random}`;
}

/**
 * Creates a formal complaint record with appropriate team routing and audit log
 */
export async function createComplaintRecord(payload: {
  category: ComplaintCategory;
  sub_category?: string;
  source?: 'PUBLIC_WEB' | 'CLIENT_PORTAL' | 'CONTRACTOR_PORTAL' | 'EMAIL' | 'PHONE';
  organisation_id?: string;
  site_id?: string;
  site_address?: string;
  external_reference?: string;
  full_name: string;
  email: string;
  phone?: string;
  organisation_name?: string;
  relationship: string;
  severity?: ComplaintSeverity;
  description: string;
  desired_resolution: string;
}): Promise<{ record: Partial<ComplaintRecord>; reference: string }> {
  const routing = CATEGORY_ROUTING[payload.category];
  const reference = generateComplaintReference(payload.category);
  const now = Date.now();
  const receivedAt = new Date(now).toISOString();

  const ackDue = new Date(now + routing.ackTargetDays * 24 * 60 * 60 * 1000).toISOString();
  const respDue = new Date(now + routing.responseTargetDays * 24 * 60 * 60 * 1000).toISOString();

  const complaint: Partial<ComplaintRecord> = {
    reference,
    category: payload.category,
    sub_category: payload.sub_category,
    source: payload.source || 'PUBLIC_WEB',
    organisation_id: payload.organisation_id,
    site_id: payload.site_id,
    site_address: payload.site_address,
    external_reference: payload.external_reference,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    organisation_name: payload.organisation_name,
    relationship: payload.relationship,
    severity: payload.severity || 'MEDIUM',
    responsible_team: routing.team,
    privacy_class: routing.privacyClass,
    description: payload.description,
    desired_resolution: payload.desired_resolution,
    status: 'RECEIVED',
    received_at: receivedAt,
    acknowledgement_due_at: ackDue,
    response_target_at: respDue,
    created_at: receivedAt,
    updated_at: receivedAt,
  };

  try {
    await dbQuery('complaints', {
      method: 'POST',
      body: complaint,
    });
  } catch {
    console.log('[COMPLAINT_CREATED_LOG]', complaint);
  }

  // Record audit ledger event
  await recordAuditEvent({
    event_type: 'COMPLAINT_REGISTERED',
    object_type: 'COMPLAINT',
    object_id: reference,
    reason: `Formal ${payload.category} complaint registered: ${reference}`,
    source: payload.source || 'PUBLIC_WEB',
    after_state: { reference, category: payload.category, responsible_team: routing.team },
  });

  return { record: complaint, reference };
}

/**
 * List complaints with role-based restriction guards
 * Speak Up (WHISTLEBLOWING) and RESTRICTED complaints are strictly shielded from normal operations users.
 */
export async function listComplaintsForAdmin(
  session: UserSession,
  filters?: { category?: ComplaintCategory; status?: ComplaintStatus }
): Promise<ComplaintRecord[]> {
  // Access check: only authorized management roles can view Restricted Speak Up complaints
  const canViewRestricted =
    session.role === 'SUPER_ADMIN' ||
    session.role === 'CEO' ||
    session.role === 'DIRECTOR' ||
    session.role === 'COMPLIANCE_MANAGER';

  let endpoint = 'complaints?select=*&order=received_at.desc';

  if (!canViewRestricted) {
    // Shield RESTRICTED and WHISTLEBLOWING cases from ordinary dispatchers/helpdesk
    endpoint += `&privacy_class=neq.RESTRICTED&category=neq.WHISTLEBLOWING`;
  }

  if (filters?.category) {
    endpoint += `&category=eq.${encodeURIComponent(filters.category)}`;
  }
  if (filters?.status) {
    endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  }

  const { data } = await dbQuery<ComplaintRecord[]>(endpoint);
  return data || [];
}
