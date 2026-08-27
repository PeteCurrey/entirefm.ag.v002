/**
 * ENTIREFM AUTOMATED CHASING & ESCALATION ENGINE (Phase 0M Addendum)
 * ===================================================================
 * Evaluates active work orders against configurable chase timers and triggers
 * staged escalations (Chase 1 -> Chase 2 -> Re-dispatch / Human Escalation).
 *
 * Rules:
 *   - No infinite chase loops: max_attempts enforced
 *   - Silence detection on high-priority work triggers progress chases
 *   - Quote approval reminders sent to clients without over-messaging
 */

import { ChasePolicy, ChaseType, JobLifecycleStage } from './types';

export const DEFAULT_CHASE_POLICY: ChasePolicy = {
  acknowledgement_timeout_mins: 30, // 15m for P1, 30m for P2/P3
  max_chase_attempts: 2,
  reassignment_after_chase_failure: true,
  on_site_update_cadence_hours: 2,
  quote_approval_reminder_cadence_hours: 24,
  supplier_invoice_chase_cadence_days: 7,
};

export interface ActiveJobChaseContext {
  work_order_id: string;
  work_order_number: string;
  priority: string;
  stage: JobLifecycleStage;
  assigned_at?: string;
  accepted_at?: string;
  arrived_at?: string;
  last_update_at?: string;
  quote_issued_at?: string;
  completed_at?: string;
  current_chase_count: number;
  last_chase_at?: string;
  policy?: Partial<ChasePolicy>;
}

export interface ChaseDecision {
  is_chase_due: boolean;
  chase_type?: ChaseType;
  attempt_number: number;
  recipient_type?: 'CONTRACTOR' | 'ENGINEER' | 'CLIENT' | 'HELPDESK_OPERATOR';
  chase_message_template?: string;
  is_escalation_required: boolean;
  escalation_reason?: string;
  action_recommended?: 'SEND_CHASE' | 'TRIGGER_AUTO_REASSIGN' | 'ESCALATE_TO_HUMAN';
}

export function evaluateJobChase(
  context: ActiveJobChaseContext,
  currentTimeMs: number = Date.now()
): ChaseDecision {
  const policy: ChasePolicy = {
    ...DEFAULT_CHASE_POLICY,
    ...context.policy,
    // Dynamic policy override for P1 Emergency
    acknowledgement_timeout_mins:
      context.priority === 'P1_CRITICAL' ? 15 : context.policy?.acknowledgement_timeout_mins || 30,
  };

  const attempts = context.current_chase_count || 0;

  // ─── 1. ASSIGNMENT ACKNOWLEDGEMENT CHASE ────────────────────────────────────
  if (context.stage === 'ASSIGNED' && context.assigned_at) {
    const assignedTimeMs = new Date(context.assigned_at).getTime();
    const elapsedMins = (currentTimeMs - assignedTimeMs) / 60000;

    if (elapsedMins >= policy.acknowledgement_timeout_mins) {
      if (attempts >= policy.max_chase_attempts) {
        return {
          is_chase_due: false,
          attempt_number: attempts,
          is_escalation_required: true,
          escalation_reason: `Contractor failed to acknowledge Work Order ${context.work_order_number} after ${attempts} chases (${Math.round(elapsedMins)}m elapsed).`,
          action_recommended: policy.reassignment_after_chase_failure
            ? 'TRIGGER_AUTO_REASSIGN'
            : 'ESCALATE_TO_HUMAN',
        };
      }

      return {
        is_chase_due: true,
        chase_type: 'ACKNOWLEDGEMENT_CHASE',
        attempt_number: attempts + 1,
        recipient_type: 'CONTRACTOR',
        chase_message_template: `CHASE ${attempts + 1}: Please acknowledge Work Order ${context.work_order_number} and confirm attendance within target SLA (${context.priority}).`,
        is_escalation_required: false,
        action_recommended: 'SEND_CHASE',
      };
    }
  }

  // ─── 2. ON-SITE SILENCE / PROGRESS CHASE ────────────────────────────────────
  if (
    (context.stage === 'ON_SITE' || context.stage === 'IN_PROGRESS') &&
    (context.priority === 'P1_CRITICAL' || context.priority === 'P2_HIGH')
  ) {
    const lastActivityTime = context.last_update_at || context.arrived_at;
    if (lastActivityTime) {
      const lastActivityMs = new Date(lastActivityTime).getTime();
      const elapsedHours = (currentTimeMs - lastActivityMs) / 3600000;

      if (elapsedHours >= policy.on_site_update_cadence_hours) {
        if (attempts >= policy.max_chase_attempts) {
          return {
            is_chase_due: false,
            attempt_number: attempts,
            is_escalation_required: true,
            escalation_reason: `No progress update received from on-site operative for >${Math.round(elapsedHours)}h on ${context.priority} work order.`,
            action_recommended: 'ESCALATE_TO_HUMAN',
          };
        }

        return {
          is_chase_due: true,
          chase_type: 'ON_SITE_PROGRESS_CHASE',
          attempt_number: attempts + 1,
          recipient_type: 'ENGINEER',
          chase_message_template: `PROGRESS UPDATE REQUIRED: Please confirm current on-site status for ${context.work_order_number} (parts needed, repair progress, or estimated completion).`,
          is_escalation_required: false,
          action_recommended: 'SEND_CHASE',
        };
      }
    }
  }

  // ─── 3. QUOTE APPROVAL CHASE ────────────────────────────────────────────────
  if (context.stage === 'AWAITING_CLIENT_APPROVAL' && context.quote_issued_at) {
    const quoteTimeMs = new Date(context.quote_issued_at).getTime();
    const elapsedHours = (currentTimeMs - quoteTimeMs) / 3600000;

    if (elapsedHours >= policy.quote_approval_reminder_cadence_hours) {
      if (attempts >= 3) {
        return {
          is_chase_due: false,
          attempt_number: attempts,
          is_escalation_required: true,
          escalation_reason: `Client has not responded to quotation for ${context.work_order_number} after ${attempts} reminders (${Math.round(elapsedHours / 24)} days).`,
          action_recommended: 'ESCALATE_TO_HUMAN',
        };
      }

      return {
        is_chase_due: true,
        chase_type: 'QUOTE_APPROVAL_CHASE',
        attempt_number: attempts + 1,
        recipient_type: 'CLIENT',
        chase_message_template: `QUOTE APPROVAL REMINDER: Remedial proposal for ${context.work_order_number} is awaiting your approval to proceed with engineer attendance.`,
        is_escalation_required: false,
        action_recommended: 'SEND_CHASE',
      };
    }
  }

  // ─── 4. SUPPLIER INVOICE CHASE ──────────────────────────────────────────────
  if (context.stage === 'COMPLETED' && context.completed_at) {
    const compMs = new Date(context.completed_at).getTime();
    const elapsedDays = (currentTimeMs - compMs) / (86400 * 1000);

    if (elapsedDays >= policy.supplier_invoice_chase_cadence_days) {
      if (attempts >= 2) {
        return {
          is_chase_due: false,
          attempt_number: attempts,
          is_escalation_required: true,
          escalation_reason: `Missing supplier invoice for completed Work Order ${context.work_order_number} (${Math.round(elapsedDays)} days overdue).`,
          action_recommended: 'ESCALATE_TO_HUMAN',
        };
      }

      return {
        is_chase_due: true,
        chase_type: 'SUPPLIER_INVOICE_CHASE',
        attempt_number: attempts + 1,
        recipient_type: 'CONTRACTOR',
        chase_message_template: `INVOICE REQUIRED: Work Order ${context.work_order_number} is marked completed. Please submit your supplier invoice against the issued PO.`,
        is_escalation_required: false,
        action_recommended: 'SEND_CHASE',
      };
    }
  }

  return {
    is_chase_due: false,
    attempt_number: attempts,
    is_escalation_required: false,
  };
}
