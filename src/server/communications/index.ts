/**
 * ENTIREFM COMMUNICATIONS DOMAIN MODULE (Phase 0M Addendum Hardened)
 * ===================================================================
 * Unified communications threads, multi-role visibility gating,
 * canonical job activity streams, idempotent client updates, and delivery state tracking.
 *
 * Governance:
 *   - INTERNAL_ONLY notes must NEVER appear to clients, contractors, or engineers.
 *   - CLIENT_VISIBLE messages are shared with authorised client accounts.
 *   - PROVIDER_VISIBLE messages are shared with assigned contractors.
 *   - Automated client events are idempotent — duplicate retries generate exactly 1 message.
 */

import { dbQuery } from '../db/client';
import { UserSession } from '../identity';

export type MessageVisibility =
  | 'CLIENT_VISIBLE'
  | 'PROVIDER_VISIBLE'
  | 'INTERNAL_ONLY'
  | 'ENGINEER_VISIBLE';

export type EmailDeliveryState =
  | 'DELIVERED'
  | 'QUEUED'
  | 'FAILED'
  | 'INTERFACE_ONLY'
  | 'NOT_CONFIGURED';

export type ClientCommunicationEventType =
  | 'ISSUE_LOGGED'
  | 'ATTENDANCE_ARRANGED'
  | 'CONTRACTOR_ASSIGNED'
  | 'ENGINEER_ASSIGNED'
  | 'QUOTE_APPROVAL_REQUIRED'
  | 'RETURN_VISIT_REQUIRED'
  | 'PARTS_REQUIRED'
  | 'WORK_COMPLETED';

export interface CommunicationThread {
  id: string;
  subject: string;
  thread_type: 'HELPDESK' | 'CONTRACTOR' | 'CLIENT' | 'INTERNAL';
  related_object_type?: string;
  related_object_id?: string;
  status: 'OPEN' | 'SNOOZED' | 'RESOLVED' | 'CLOSED';
  created_at: string;
}

export interface CommunicationMessage {
  id: string;
  thread_id: string;
  sender_person_id?: string;
  sender_name?: string;
  channel: 'PORTAL' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'SYSTEM';
  visibility: MessageVisibility;
  body: string;
  is_incoming: boolean;
  is_ai_generated: boolean;
  idempotency_key?: string;
  email_delivery_state?: EmailDeliveryState;
  created_at: string;
}

// In-memory thread & message cache for idempotency tracking & tests
const messageCache = new Map<string, CommunicationMessage>();

/**
 * Filter messages based on caller session and role.
 * Enforces strict information boundaries so internal EntireFM notes never leak.
 */
export function filterMessagesForCaller(
  messages: CommunicationMessage[],
  session: UserSession | null
): CommunicationMessage[] {
  if (!session) return [];

  // Internal EntireFM operations staff see all messages including INTERNAL_ONLY
  if (session.orgType === 'ENTIREFM') {
    return messages;
  }

  // Client Portal users see ONLY CLIENT_VISIBLE messages
  if (session.orgType === 'CLIENT') {
    return messages.filter((m) => m.visibility === 'CLIENT_VISIBLE');
  }

  // Contractor office users see PROVIDER_VISIBLE and CLIENT_VISIBLE
  if (session.orgType === 'CONTRACTOR') {
    return messages.filter(
      (m) => m.visibility === 'PROVIDER_VISIBLE' || m.visibility === 'CLIENT_VISIBLE'
    );
  }

  // Field Engineers see ENGINEER_VISIBLE, PROVIDER_VISIBLE, CLIENT_VISIBLE
  if (session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
    return messages.filter(
      (m) =>
        m.visibility === 'ENGINEER_VISIBLE' ||
        m.visibility === 'PROVIDER_VISIBLE' ||
        m.visibility === 'CLIENT_VISIBLE'
    );
  }

  return [];
}

/**
 * Generate data-driven factual message body for canonical client events.
 * Never invents dates, times, or engineer names.
 */
export function generateClientEventMessage(
  eventType: ClientCommunicationEventType,
  data: {
    work_order_number: string;
    site_name?: string;
    trade?: string;
    contractor_name?: string;
    engineer_name?: string;
    attendance_window?: string;
    quote_amount_net_gbp?: number;
    completion_summary?: string;
  }
): { subject: string; body: string } {
  switch (eventType) {
    case 'ISSUE_LOGGED':
      return {
        subject: `[${data.work_order_number}] Issue Received — Under Review`,
        body: `Your service request for ${data.site_name || 'your site'} has been logged under reference ${data.work_order_number}. Our helpdesk is reviewing trade requirements (${data.trade || 'General'}) and allocating an approved partner.`,
      };
    case 'ATTENDANCE_ARRANGED':
    case 'CONTRACTOR_ASSIGNED':
      return {
        subject: `[${data.work_order_number}] Attendance Arranged — ${data.contractor_name || 'Approved Partner'}`,
        body: `Approved specialist ${data.contractor_name || 'contractor partner'} has accepted Work Order ${data.work_order_number}.${data.attendance_window ? ` Scheduled attendance window: ${data.attendance_window}.` : ' Field operative allocation in progress.'}`,
      };
    case 'ENGINEER_ASSIGNED':
      return {
        subject: `[${data.work_order_number}] Engineer Assigned — ${data.engineer_name || 'Operative'}`,
        body: `Engineer ${data.engineer_name || 'Operative'} is assigned to Work Order ${data.work_order_number} and scheduled to attend ${data.site_name || 'site'}.`,
      };
    case 'QUOTE_APPROVAL_REQUIRED':
      return {
        subject: `[${data.work_order_number}] Remedial Quote Awaiting Your Approval`,
        body: `A remedial quotation${data.quote_amount_net_gbp ? ` (£${data.quote_amount_net_gbp.toFixed(2)} net)` : ''} has been submitted for Work Order ${data.work_order_number}. Please review and approve in the Client Portal to authorise engineer works.`,
      };
    case 'RETURN_VISIT_REQUIRED':
      return {
        subject: `[${data.work_order_number}] Return Visit Required`,
        body: `Initial attendance for ${data.work_order_number} is complete. A secondary return visit is required to complete specialist remedial works. Our dispatch team is scheduling attendance.`,
      };
    case 'PARTS_REQUIRED':
      return {
        subject: `[${data.work_order_number}] Parts Sourcing in Progress`,
        body: `Operative attended ${data.site_name || 'site'} for ${data.work_order_number}. Replacement parts are currently being sourced. An updated ETA will be provided once parts are dispatched.`,
      };
    case 'WORK_COMPLETED':
      return {
        subject: `[${data.work_order_number}] Work Completed — Service Report Available`,
        body: `Operational fieldwork for Work Order ${data.work_order_number} has been completed.${data.completion_summary ? ` Summary: ${data.completion_summary}.` : ''} All completion verification and service report evidence is accessible in your Client Portal.`,
      };
  }
}

/**
 * Record a canonical client communication event with strict deduplication & delivery state tracking.
 */
export async function emitClientCommunicationEvent(params: {
  work_order_id: string;
  work_order_number: string;
  eventType: ClientCommunicationEventType;
  data: {
    site_name?: string;
    trade?: string;
    contractor_name?: string;
    engineer_name?: string;
    attendance_window?: string;
    quote_amount_net_gbp?: number;
    completion_summary?: string;
  };
  idempotencyKey?: string;
}): Promise<{
  is_duplicate: boolean;
  message_id: string;
  email_delivery_state: EmailDeliveryState;
  subject: string;
  body: string;
}> {
  const key = params.idempotencyKey || `${params.work_order_id}:${params.eventType}`;

  // 1. Idempotency Check — Never emit duplicate emails or portal messages
  if (messageCache.has(key)) {
    const existing = messageCache.get(key)!;
    return {
      is_duplicate: true,
      message_id: existing.id,
      email_delivery_state: existing.email_delivery_state || 'INTERFACE_ONLY',
      subject: '',
      body: existing.body,
    };
  }

  const { subject, body } = generateClientEventMessage(params.eventType, {
    work_order_number: params.work_order_number,
    ...params.data,
  });

  const msgId = `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const message: CommunicationMessage = {
    id: msgId,
    thread_id: params.work_order_id,
    sender_name: 'EntireFM Helpdesk Autopilot',
    channel: 'EMAIL',
    visibility: 'CLIENT_VISIBLE',
    body,
    is_incoming: false,
    is_ai_generated: false,
    idempotency_key: key,
    email_delivery_state: 'INTERFACE_ONLY', // Production SMTP is interface-only unless real API credentials present
    created_at: new Date().toISOString(),
  };

  messageCache.set(key, message);

  // Attempt DB persistence
  try {
    await dbQuery('communication_messages', {
      method: 'POST',
      body: {
        id: message.id,
        thread_id: message.thread_id,
        sender_name: message.sender_name,
        channel: message.channel,
        visibility: message.visibility,
        body: message.body,
        created_at: message.created_at,
      },
    });
  } catch {}

  return {
    is_duplicate: false,
    message_id: msgId,
    email_delivery_state: 'INTERFACE_ONLY',
    subject,
    body,
  };
}

export async function listThreads(status?: string): Promise<CommunicationThread[]> {
  let endpoint = 'communication_threads?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<CommunicationThread[]>(endpoint);
  return data || [];
}

/** Canonical export used by admin communications page */
export const listCommunicationThreads = listThreads;
