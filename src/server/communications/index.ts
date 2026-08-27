/**
 * ENTIREFM COMMUNICATIONS DOMAIN MODULE (Phase 0M Addendum)
 * ==========================================================
 * Unified communications threads, multi-role visibility gating,
 * and canonical job activity stream.
 *
 * Governance:
 *   - INTERNAL_ONLY notes must NEVER appear to clients, contractors, or engineers.
 *   - CLIENT_VISIBLE messages are shared with authorised client accounts.
 *   - PROVIDER_VISIBLE messages are shared with assigned contractors.
 */

import { dbQuery } from '../db/client';
import { UserSession } from '../identity';

export type MessageVisibility =
  | 'CLIENT_VISIBLE'
  | 'PROVIDER_VISIBLE'
  | 'INTERNAL_ONLY'
  | 'ENGINEER_VISIBLE';

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
  created_at: string;
}

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

export async function listThreads(status?: string): Promise<CommunicationThread[]> {
  let endpoint = 'communication_threads?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<CommunicationThread[]>(endpoint);
  return data || [];
}

/** Canonical export used by admin communications page */
export const listCommunicationThreads = listThreads;
