/**
 * ENTIREFM HELPDESK EXCEPTIONS API — GET (Phase 0M)
 * ==================================================
 * Returns the current list of helpdesk exceptions requiring operator attention.
 * Sources: service requests with triage_status requiring review.
 */

import { NextResponse } from 'next/server';
import { dbQuery } from '@/server/db/client';

export async function GET() {
  try {
    // Fetch service requests with statuses that represent exceptions
    const { data: serviceRequests } = await dbQuery<any[]>(
      `service_requests?status=in.(NEW,ON_HOLD,PENDING_QUOTE)&order=created_at.asc&limit=50&select=*,site:sites(id,name,city)`
    );

    const exceptions = (serviceRequests || []).map((sr: any) => ({
      id: sr.id,
      reference: sr.reference || `SR-${sr.id.slice(0, 6).toUpperCase()}`,
      title: sr.title,
      site: sr.site?.name || sr.site_id || 'Unknown Site',
      site_city: sr.site?.city || '',
      priority: sr.priority || 'P3_MEDIUM',
      trade: sr.category || 'GENERAL_MAINTENANCE',
      channel: sr.source || 'PORTAL',
      status: (sr.triage_status as string) || mapStatusToException(sr.status),
      triage_status_label: sr.triage_status || sr.status,
      created_at: sr.created_at,
      sla_due_at: sr.sla_due_at || null,
      model_provider: sr.ai_model_provider || null,
      disagreement_notes: sr.ai_disagreement_notes ? JSON.parse(sr.ai_disagreement_notes) : undefined,
      candidate_count: sr.ai_candidate_count ?? undefined,
      exception_reason: sr.triage_exception_reason || null,
      ai_summary: sr.ai_summary || sr.description?.slice(0, 200) || null,
    }));

    return NextResponse.json({
      exceptions,
      total: exceptions.length,
      last_updated: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ exceptions: [], total: 0, error: err?.message }, { status: 200 });
  }
}

function mapStatusToException(
  status: string
): 'REQUIRES_OPERATOR_TRIAGE' | 'UNRESOLVED_ESTATE' | 'NO_ELIGIBLE_PROVIDER' | 'SLA_AT_RISK' | 'CONTRACTOR_DECLINED' | 'MODEL_DISAGREEMENT' {
  if (status === 'ON_HOLD') return 'REQUIRES_OPERATOR_TRIAGE';
  if (status === 'PENDING_QUOTE') return 'NO_ELIGIBLE_PROVIDER';
  return 'REQUIRES_OPERATOR_TRIAGE';
}
