/**
 * ENTIREFM CLIENT HELPDESK SUBMISSION API (Phase 0M + AI Triage)
 * ===============================================================
 * Creates canonical ServiceRequest and WorkOrder from Client Helpdesk intake.
 * Wires parseHelpdeskIntake for AI-assisted triage with priority escalation
 * and trade disagreement capture.
 *
 * Rules:
 *   - Verifies caller has active scope for the specified site
 *   - AI priority may escalate client priority but NEVER downgrades it
 *   - If AI and client disagree on trade, client trade is authoritative for dispatch;
 *     triage_status = 'MODEL_DISAGREEMENT' is recorded for operator review
 *   - Canonical SLA derived from final resolved priority
 *   - Triggers reactive dispatch orchestrator
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createServiceRequest, createWorkOrder } from '@/server/work';
import { orchestrateReactiveDispatch } from '@/server/ai/dispatch/orchestrator';
import { CANONICAL_SLA_HOURS, parseHelpdeskIntake } from '@/server/ai/helpdesk/intake';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';

// Priority severity map — higher = more critical
const PRIORITY_SEVERITY: Record<string, number> = {
  P1_CRITICAL: 5,
  P2_HIGH: 4,
  P3_MEDIUM: 3,
  P4_LOW: 2,
  P5_ROUTINE: 1,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      site_id,
      location_description,
      asset_id,
      title,
      description,
      trade = 'GENERAL_MAINTENANCE',
      priority = 'P3_MEDIUM',
      access_notes,
      attachments = [],
    } = body;

    if (!site_id) {
      return NextResponse.json({ error: 'site_id is required' }, { status: 400 });
    }
    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
    }

    // 1. Authorisation & Cross-Tenant Security Check
    const { data: siteRecords } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(site_id)}&select=id,name,organisation_id,city,postcode`
    );
    const targetSite = siteRecords?.[0];

    if (!targetSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    if (session.orgType === 'CLIENT' && !isViewAs) {
      if (targetSite.organisation_id !== session.orgId) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorised to report issues for this site' },
          { status: 403 }
        );
      }
      if (!hasScope(session, 'SITE', site_id)) {
        return NextResponse.json(
          { error: 'Forbidden: Your user account is restricted from this site' },
          { status: 403 }
        );
      }
    }

    // 2. Resolve Client Account
    const { data: clientAccounts } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(session.orgId)}&limit=1`
    );
    const clientAccountId = clientAccounts?.[0]?.id;

    // 3. Run AI Triage Engine
    const fullText = [title, description].filter(Boolean).join('\n');
    let triageResult = null;
    try {
      triageResult = await parseHelpdeskIntake({
        text: fullText,
        channel: 'CLIENT_PORTAL',
        correlationId: `helpdesk-submit-${Date.now()}`,
      });
    } catch (triageErr: any) {
      console.warn('[HELPDESK_SUBMIT_TRIAGE_WARN]:', triageErr?.message);
    }

    // 4. Priority Reconciliation — never downgrade client's priority
    const clientSeverity = PRIORITY_SEVERITY[priority as string] || 0;
    const aiPrioritySeverity = PRIORITY_SEVERITY[triageResult?.canonical_priority || ''] || 0;
    const finalPriority: string =
      aiPrioritySeverity > clientSeverity ? triageResult!.canonical_priority : (priority as string);

    // 5. Trade Disagreement Detection — client trade stays authoritative for dispatch
    const aiTrade = triageResult?.intake.trade;
    const tradeDisagreement = aiTrade && aiTrade !== trade && aiTrade !== 'OTHER';
    let triageStatus = 'PENDING';
    let triageExceptionReason: string | undefined;
    let disagreementNotes: string[] | undefined;

    if (triageResult) {
      if (tradeDisagreement) {
        triageStatus = 'MODEL_DISAGREEMENT';
        triageExceptionReason = `AI suggested trade '${aiTrade}' but client selected '${trade}'. Client trade used for dispatch.`;
        disagreementNotes = triageResult.disagreement_notes
          ? [...triageResult.disagreement_notes, triageExceptionReason]
          : [triageExceptionReason];
      } else if (finalPriority !== priority) {
        triageStatus = 'REQUIRES_OPERATOR_TRIAGE';
        triageExceptionReason = `Priority escalated from '${priority}' to '${finalPriority}' by AI triage.`;
      } else {
        triageStatus =
          triageResult.triage_status === 'READY_FOR_DISPATCH'
            ? 'AUTO_TRIAGED'
            : triageResult.triage_status || 'AUTO_TRIAGED';
        disagreementNotes = triageResult.disagreement_notes;
      }
    }

    // 6. Create Canonical Service Request with triage metadata
    const fullDescription = `${description}${location_description ? `\n\nLocation on site: ${location_description}` : ''}${access_notes ? `\nAccess Notes: ${access_notes}` : ''}`;

    const sr = await createServiceRequest({
      organisation_id: session.orgId,
      client_account_id: clientAccountId,
      site_id,
      asset_id: asset_id || undefined,
      title,
      description: fullDescription,
      category: trade,
      priority: finalPriority as any,
      source: 'AI_HELPDESK',
      requester_name: session.name,
      requester_email: session.email,
      triage_status: triageStatus,
      ai_summary: triageResult?.intake.issue_summary || null,
      ai_model_provider: triageResult?.model_provider || null,
      ai_model_name: triageResult?.model_name || null,
      ai_confidence_score: triageResult?.intake.confidence_score ?? null,
      ai_disagreement_notes: disagreementNotes ? JSON.stringify(disagreementNotes) : null,
      ai_candidate_count: 1,
      triage_exception_reason: triageExceptionReason || null,
      ai_suggested_trade: aiTrade || null,
      ai_suggested_priority: triageResult?.canonical_priority || null,
      sla_due_at: triageResult?.sla_resolution_due_at || null,
    });

    // 7. Create Canonical Work Order (client trade authoritative for dispatch)
    const wo = await createWorkOrder({
      organisation_id: session.orgId,
      site_id,
      asset_id: asset_id || undefined,
      service_request_id: sr.id,
      title,
      description: sr.description,
      work_type: 'REACTIVE',
      priority: finalPriority as any,
    });

    // 8. Trigger Reactive Dispatch Orchestrator (client trade is authoritative)
    const slaHours = CANONICAL_SLA_HOURS[finalPriority as UrgencyLevel] || 24;
    const slaResolutionDue =
      triageResult?.sla_resolution_due_at ||
      new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    let dispatchResult = null;
    try {
      dispatchResult = await orchestrateReactiveDispatch({
        work_order_id: wo.id,
        work_order_number: wo.work_order_number,
        title: wo.title,
        trade: trade as TradeCategory, // client trade authoritative
        priority: finalPriority as UrgencyLevel,
        site_id: targetSite.id,
        site_name: targetSite.name,
        site_city: targetSite.city,
        client_id: session.orgId,
        client_name: session.orgName,
        automation_level: 'AUTO_DISPATCH_AND_PO',
      });
    } catch (err: any) {
      console.warn('[HELPDESK_SUBMISSION] Non-blocking dispatch notice:', err?.message);
    }

    return NextResponse.json({
      success: true,
      service_request: {
        id: sr.id,
        reference: sr.reference,
        title: sr.title,
        status: sr.status,
        priority: finalPriority,
        created_at: sr.created_at,
        sla_hours: slaHours,
        sla_resolution_due: slaResolutionDue,
        triage_status: triageStatus,
      },
      work_order: {
        id: wo.id,
        work_order_number: wo.work_order_number,
        status: wo.status,
      },
      dispatch: dispatchResult
        ? {
            status: dispatchResult.status,
            assigned_supplier: dispatchResult.assigned_supplier_name,
            client_message: dispatchResult.client_update_message,
          }
        : null,
      triage: triageResult
        ? {
            trade: aiTrade,
            priority: finalPriority,
            confidence: triageResult.intake.confidence_score,
            status: triageStatus,
            exception_reason: triageExceptionReason || null,
          }
        : null,
      message: `Your issue has been logged under reference ${sr.reference}.`,
    });
  } catch (err: any) {
    console.error('[HELPDESK_SUBMIT_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Failed to submit issue' }, { status: 500 });
  }
}
