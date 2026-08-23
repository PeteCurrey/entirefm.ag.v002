/**
 * ENTIREFM COMMUNICATIONS DOMAIN MODULE
 * =====================================
 * Unified communications threads, SMS, Email, and Helpdesk notifications.
 */

import { dbQuery } from '../db/client';

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
  body: string;
  is_incoming: boolean;
  is_ai_generated: boolean;
  created_at: string;
}

export async function listThreads(status?: string): Promise<CommunicationThread[]> {
  let endpoint = 'communication_threads?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<CommunicationThread[]>(endpoint);
  return data || [];
}
