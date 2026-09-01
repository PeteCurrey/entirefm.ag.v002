/**
 * ENTIREFM AUTOMATED CHASING & ESCALATION SWEEP (Phase 0M Addendum)
 * ===================================================================
 * Evaluates all active work orders on a scheduled cadence (e.g. every 15 mins),
 * runs the pure evaluateJobChase decision function against real DB state,
 * dispatches idempotent communication events, auto-reassigns stalled assignments,
 * and escalates severe delays to human operators.
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { createNotification } from '@/server/notifications';
import { emitContractorCommunicationEvent, emitClientCommunicationEvent } from '@/server/communications';
import { handleContractorDecline } from '@/server/ai/dispatch/orchestrator';
import { evaluateJobChase, ActiveJobChaseContext } from './chasing';
import { deriveLifecycleStage, RawWorkOrderState, RawLifecycleArtifacts } from './lifecycle';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';

export interface ChaseSweepResult {
  total_evaluated: number;
  chases_sent: number;
  auto_reassigned: number;
  escalated_to_human: number;
  skipped: number;
  errors: Array<{ work_order_id: string; error: string }>;
}

function normalizeTrade(trade?: string): TradeCategory {
  if (!trade) return 'OTHER';
  const upper = trade.toUpperCase().replace(/\s+/g, '_');
  const validTrades: TradeCategory[] = [
    'HVAC',
    'PLUMBING',
    'ELECTRICAL',
    'FIRE_LIFE_SAFETY',
    'BUILDING_FABRIC',
    'CLEANING',
    'SECURITY',
    'DRAINAGE',
    'PEST_CONTROL',
    'GROUNDS',
    'OTHER',
  ];
  if (validTrades.includes(upper as TradeCategory)) {
    return upper as TradeCategory;
  }
  return 'OTHER';
}

function normalizePriority(priority?: string): UrgencyLevel {
  if (!priority) return 'P3_MEDIUM';
  if (priority === 'P1' || priority === 'P1_CRITICAL') return 'P1_CRITICAL';
  if (priority === 'P2' || priority === 'P2_HIGH') return 'P2_HIGH';
  if (priority === 'P3' || priority === 'P3_MEDIUM') return 'P3_MEDIUM';
  if (priority === 'P4' || priority === 'P4_LOW') return 'P4_LOW';
  if (priority === 'P5' || priority === 'P5_ROUTINE') return 'P5_ROUTINE';
  return 'P3_MEDIUM';
}

export async function runChaseSweep(currentTimeMs: number = Date.now()): Promise<ChaseSweepResult> {
  const result: ChaseSweepResult = {
    total_evaluated: 0,
    chases_sent: 0,
    auto_reassigned: 0,
    escalated_to_human: 0,
    skipped: 0,
    errors: [],
  };

  // 1. Fetch active work orders (not CANCELLED)
  const { data: workOrders, error: woError } = await dbQuery<any[]>(
    'work_orders?status=neq.CANCELLED&select=*'
  );

  if (woError || !workOrders || workOrders.length === 0) {
    return result;
  }

  for (const wo of workOrders) {
    result.total_evaluated++;

    try {
      // 2. Fetch associated artifacts in parallel
      const [assignmentRes, visitsRes, quotesRes, orgRes] = await Promise.all([
        dbQuery<any[]>(`work_assignments?work_order_id=eq.${wo.id}&order=created_at.desc&limit=1`),
        dbQuery<any[]>(`visits?work_order_id=eq.${wo.id}&order=created_at.desc&limit=1`),
        dbQuery<any[]>(`quotes?work_order_id=eq.${wo.id}&order=created_at.desc&limit=5`),
        wo.provider_organisation_id
          ? dbQuery<any[]>(`organisations?id=eq.${wo.provider_organisation_id}&select=id,name,primary_contact_email&limit=1`)
          : Promise.resolve({ data: null, error: null, status: 200 }),
      ]);

      const assignment = assignmentRes.data?.[0];
      const visit = visitsRes.data?.[0];
      const quotes = quotesRes.data || [];
      const providerOrg = orgRes.data?.[0];

      let providerEmail = providerOrg?.primary_contact_email;
      let providerName = providerOrg?.name || wo.provider_organisation_name;

      if (!providerEmail && assignment?.provider_org_id && assignment.provider_org_id !== wo.provider_organisation_id) {
        const { data: assignOrg } = await dbQuery<any[]>(
          `organisations?id=eq.${assignment.provider_org_id}&select=id,name,primary_contact_email&limit=1`
        );
        if (assignOrg?.[0]) {
          providerEmail = assignOrg[0].primary_contact_email;
          providerName = assignOrg[0].name;
        }
      }

      // Build artifacts structure
      const artifacts: RawLifecycleArtifacts = {
        assignment: assignment
          ? {
              id: assignment.id,
              status: assignment.status,
              assigned_at: assignment.assigned_at,
              responded_at: assignment.accepted_at || assignment.rejected_at,
              chase_count: assignment.chase_count || 0,
              last_chase_at: assignment.last_chase_at,
            }
          : undefined,
        visit: visit
          ? {
              id: visit.id,
              status: visit.status,
              journey_started_at: visit.scheduled_start_at,
              arrived_at: visit.actual_check_in_at,
              completed_at: visit.actual_check_out_at,
            }
          : undefined,
        quotes: quotes.map((q: any) => ({
          id: q.id,
          status: q.status,
          total_price_gbp: q.total_price_gbp ? Number(q.total_price_gbp) : undefined,
          created_at: q.created_at,
        })),
      };

      const rawWo: RawWorkOrderState = {
        id: wo.id,
        work_order_number: wo.work_order_number,
        title: wo.title,
        status: wo.status,
        priority: wo.priority,
        trade: wo.trade,
        site_id: wo.site_id,
        client_id: wo.organisation_id,
        provider_organisation_id: wo.provider_organisation_id,
        assigned_engineer_id: wo.lead_engineer_id,
        billing_status: wo.billing_status,
        completed_at: wo.actual_completion_at || wo.completed_at,
        sla_response_due_at: wo.sla_response_due_at,
        sla_resolution_due_at: wo.sla_resolution_due_at,
        created_at: wo.created_at,
        updated_at: wo.updated_at,
      };

      const lifecycle = deriveLifecycleStage(rawWo, artifacts);

      const chaseContext: ActiveJobChaseContext = {
        work_order_id: wo.id,
        work_order_number: wo.work_order_number,
        priority: wo.priority,
        stage: lifecycle.stage,
        assigned_at: assignment?.assigned_at,
        accepted_at: assignment?.accepted_at,
        arrived_at: visit?.actual_check_in_at,
        quote_issued_at: quotes[0]?.created_at,
        completed_at: rawWo.completed_at,
        current_chase_count: assignment?.chase_count || 0,
        last_chase_at: assignment?.last_chase_at,
      };

      const decision = evaluateJobChase(chaseContext, currentTimeMs);

      if (decision.action_recommended === 'SEND_CHASE') {
        const attemptNumber = decision.attempt_number;

        if (decision.recipient_type === 'CLIENT') {
          await emitClientCommunicationEvent({
            work_order_id: wo.id,
            work_order_number: wo.work_order_number,
            eventType: 'QUOTE_APPROVAL_REQUIRED',
            data: {
              site_name: wo.site_name,
              trade: wo.trade,
              recipient_email: wo.client_contact_email,
            },
            idempotencyKey: `${wo.id}:CLIENT:QUOTE_APPROVAL_CHASE:${attemptNumber}`,
          });
        } else {
          // Contractor / Engineer
          let contractorEventType: any = 'PROGRESS_UPDATE_REQUEST';
          if (decision.chase_type === 'ACKNOWLEDGEMENT_CHASE') {
            contractorEventType = 'ACKNOWLEDGEMENT_CHASE';
          } else if (decision.chase_type === 'SUPPLIER_INVOICE_CHASE') {
            contractorEventType = 'SUPPLIER_INVOICE_CHASE';
          }

          await emitContractorCommunicationEvent({
            work_order_id: wo.id,
            work_order_number: wo.work_order_number,
            eventType: contractorEventType,
            data: {
              site_name: wo.site_name,
              trade: wo.trade,
              priority: wo.priority,
              attempt_number: attemptNumber,
              recipient_email: providerEmail,
            },
            idempotencyKey: `${wo.id}:CONTRACTOR:${decision.chase_type}:${attemptNumber}`,
          });
        }

        // Increment assignment chase count if assignment exists
        if (assignment) {
          await dbQuery(`work_assignments?id=eq.${assignment.id}`, {
            method: 'PATCH',
            body: {
              chase_count: attemptNumber,
              last_chase_at: new Date(currentTimeMs).toISOString(),
            },
          });
        }

        await recordAuditEvent({
          event_type: 'WORK_ORDER_CHASE_SENT',
          actor_type: 'CRON',
          source: 'CHASING_ENGINE',
          object_type: 'work_orders',
          object_id: wo.id,
          reason: `Automated chase attempt #${attemptNumber} (${decision.chase_type}) sent to ${decision.recipient_type}.`,
          after_state: {
            chase_type: decision.chase_type,
            attempt_number: attemptNumber,
            recipient_type: decision.recipient_type,
          },
        });

        result.chases_sent++;
      } else if (decision.action_recommended === 'TRIGGER_AUTO_REASSIGN') {
        const decliningSupplierId = assignment?.provider_org_id || wo.provider_organisation_id;
        const decliningSupplierName = providerName || 'Assigned Contractor';

        // Reassign using the AI dispatch orchestrator
        await handleContractorDecline({
          work_order_id: wo.id,
          work_order_number: wo.work_order_number,
          title: wo.title,
          trade: normalizeTrade(wo.trade),
          priority: normalizePriority(wo.priority),
          site_id: wo.site_id,
          declining_supplier_id: decliningSupplierId || '',
          declining_supplier_name: decliningSupplierName,
          decline_reason: decision.escalation_reason || `Unacknowledged after ${assignment?.chase_count || 2} automated chases.`,
        });

        if (assignment) {
          await dbQuery(`work_assignments?id=eq.${assignment.id}`, {
            method: 'PATCH',
            body: {
              status: 'EXPIRED',
              escalated_at: new Date(currentTimeMs).toISOString(),
            },
          });
        }

        await recordAuditEvent({
          event_type: 'WORK_ORDER_AUTO_REASSIGNED',
          actor_type: 'CRON',
          source: 'CHASING_ENGINE',
          object_type: 'work_orders',
          object_id: wo.id,
          reason: decision.escalation_reason,
        });

        result.auto_reassigned++;
      } else if (decision.action_recommended === 'ESCALATE_TO_HUMAN') {
        // Escalate to human review via central notifications
        await createNotification({
          type: 'SLA_RISK',
          category: 'OPERATIONS',
          severity: 'CRITICAL',
          title: `Chasing Escalation: ${wo.work_order_number}`,
          message: decision.escalation_reason || `Work order ${wo.work_order_number} requires human coordinator intervention.`,
          entity_type: 'work_order',
          entity_id: wo.id,
          action_url: `/admin/operations/work-orders/${wo.id}`,
          dedupe_key: `workorder:${wo.id}:chase-escalation`,
          metadata: {
            reason: decision.escalation_reason,
            stage: lifecycle.stage,
            priority: wo.priority,
          },
        });

        if (assignment) {
          await dbQuery(`work_assignments?id=eq.${assignment.id}`, {
            method: 'PATCH',
            body: {
              escalated_at: new Date(currentTimeMs).toISOString(),
            },
          });
        }

        await recordAuditEvent({
          event_type: 'WORK_ORDER_ESCALATED_TO_HUMAN',
          actor_type: 'CRON',
          source: 'CHASING_ENGINE',
          object_type: 'work_orders',
          object_id: wo.id,
          reason: decision.escalation_reason,
        });

        result.escalated_to_human++;
      } else {
        result.skipped++;
      }
    } catch (err: any) {
      console.error(`[CHASE_SWEEP_ERROR] Failed processing work order ${wo.id}:`, err);
      result.errors.push({
        work_order_id: wo.id,
        error: err?.message || String(err),
      });
    }
  }

  return result;
}
