/**
 * ENTIREFM IMMUTABLE AUDIT & EVENT LEDGER
 * =======================================
 * Records every state transition, user action, and AI execution.
 * Outbox pattern enables event-driven automation.
 */

import { dbQuery } from '../db/client';

export interface AuditEvent {
  id: string;
  event_type: string;
  correlation_id: string;
  actor_id?: string;
  actor_type: 'HUMAN' | 'SYSTEM' | 'AI_AGENT' | 'CRON';
  organisation_id?: string;
  object_type: string;
  object_id: string;
  before_state?: Record<string, any>;
  after_state?: Record<string, any>;
  reason?: string;
  source?: string;
  is_ai: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export async function recordAuditEvent(event: {
  event_type: string;
  correlation_id?: string;
  actor_id?: string;
  actor_type?: 'HUMAN' | 'SYSTEM' | 'AI_AGENT' | 'CRON';
  organisation_id?: string;
  object_type: string;
  object_id: string;
  before_state?: any;
  after_state?: any;
  reason?: string;
  source?: string;
  is_ai?: boolean;
}): Promise<boolean> {
  const row = {
    event_type: event.event_type,
    correlation_id: event.correlation_id || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actor_id: event.actor_id,
    actor_type: event.actor_type || 'SYSTEM',
    organisation_id: event.organisation_id,
    object_type: event.object_type,
    object_id: event.object_id,
    before_state: event.before_state,
    after_state: event.after_state,
    reason: event.reason,
    source: event.source || 'SYSTEM',
    is_ai: event.is_ai || false,
  };

  const { error } = await dbQuery('audit_events', {
    method: 'POST',
    body: row,
  });

  return !error;
}

export async function listAuditEvents(limit = 50): Promise<AuditEvent[]> {
  const { data } = await dbQuery<AuditEvent[]>(`audit_events?select=*&order=created_at.desc&limit=${limit}`);
  return data || [];
}
