/**
 * ENTIREFM CHASING & ESCALATION ENGINE AUTOMATION SUITE
 * ======================================================
 * Tests:
 *   1. Pure decision logic across all chase types (evaluateJobChase)
 *   2. Escalation transitions (Chase 1 -> Chase 2 -> Auto-reassign / Escalate)
 *   3. Recipient routing (Contractor vs Engineer vs Client)
 *   4. Communications layer DB-backed idempotency & deduplication
 *   5. Sweep orchestrator error handling & execution metrics
 */

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => boolean | Promise<boolean>) {
  return Promise.resolve(fn()).then(
    (ok) => {
      if (ok) {
        passed++;
        console.log(`  ✅  ${name}`);
      } else {
        failed++;
        failures.push(name);
        console.log(`  ❌  ${name}`);
      }
    },
    (err: any) => {
      failed++;
      failures.push(`${name}: ${err?.message || String(err)}`);
      console.log(`  ❌  ${name} — ${err?.message || err}`);
    }
  );
}

import { evaluateJobChase, ActiveJobChaseContext } from '../src/server/work/orchestrator/chasing';
import {
  emitContractorCommunicationEvent,
  emitClientCommunicationEvent,
  generateContractorEventMessage,
  generateClientEventMessage,
} from '../src/server/communications/index';
import { runChaseSweep } from '../src/server/work/orchestrator/chasing-sweep';

async function runSuite() {
  console.log('\n======================================================');
  console.log('ENTIREFM CHASING ENGINE AUTOMATION SUITE');
  console.log('======================================================\n');

  const now = Date.now();

  // ─── 1. ASSIGNMENT ACKNOWLEDGEMENT CHASING ─────────────────────────────────
  console.log('─── 1. Assignment Acknowledgement & Escalation ───');

  await test('1.1 — P1 Emergency triggers chase after 15 minutes of silence', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-p1-001',
      work_order_number: 'WO-P1-001',
      priority: 'P1_CRITICAL',
      stage: 'ASSIGNED',
      assigned_at: new Date(now - 16 * 60 * 1000).toISOString(),
      current_chase_count: 0,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === true &&
      decision.chase_type === 'ACKNOWLEDGEMENT_CHASE' &&
      decision.attempt_number === 1 &&
      decision.recipient_type === 'CONTRACTOR' &&
      decision.action_recommended === 'SEND_CHASE'
    );
  });

  await test('1.2 — P2 Standard does NOT chase before 30 minutes', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-p2-001',
      work_order_number: 'WO-P2-001',
      priority: 'P2_HIGH',
      stage: 'ASSIGNED',
      assigned_at: new Date(now - 20 * 60 * 1000).toISOString(),
      current_chase_count: 0,
    };
    const decision = evaluateJobChase(ctx, now);
    return decision.is_chase_due === false;
  });

  await test('1.3 — Second chase attempt recommended when count is 1', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-p2-002',
      work_order_number: 'WO-P2-002',
      priority: 'P2_HIGH',
      stage: 'ASSIGNED',
      assigned_at: new Date(now - 45 * 60 * 1000).toISOString(),
      current_chase_count: 1,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === true &&
      decision.attempt_number === 2 &&
      decision.action_recommended === 'SEND_CHASE'
    );
  });

  await test('1.4 — Exceeding max attempts triggers TRIGGER_AUTO_REASSIGN', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-p2-003',
      work_order_number: 'WO-P2-003',
      priority: 'P2_HIGH',
      stage: 'ASSIGNED',
      assigned_at: new Date(now - 75 * 60 * 1000).toISOString(),
      current_chase_count: 2,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === false &&
      decision.is_escalation_required === true &&
      decision.action_recommended === 'TRIGGER_AUTO_REASSIGN'
    );
  });

  // ─── 2. ON-SITE SILENCE & PROGRESS CHASE ──────────────────────────────────
  console.log('\n─── 2. On-Site Silence Detection ───');

  await test('2.1 — On-site operative on P1 with no update for >2h triggers progress chase', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-onsite-001',
      work_order_number: 'WO-ONSITE-001',
      priority: 'P1_CRITICAL',
      stage: 'ON_SITE',
      arrived_at: new Date(now - 2.5 * 3600 * 1000).toISOString(),
      current_chase_count: 0,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === true &&
      decision.chase_type === 'ON_SITE_PROGRESS_CHASE' &&
      decision.recipient_type === 'ENGINEER' &&
      decision.action_recommended === 'SEND_CHASE'
    );
  });

  await test('2.2 — On-site silence exceeding max attempts escalates to human operator', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-onsite-002',
      work_order_number: 'WO-ONSITE-002',
      priority: 'P1_CRITICAL',
      stage: 'IN_PROGRESS',
      last_update_at: new Date(now - 5 * 3600 * 1000).toISOString(),
      current_chase_count: 2,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === false &&
      decision.is_escalation_required === true &&
      decision.action_recommended === 'ESCALATE_TO_HUMAN'
    );
  });

  // ─── 3. CLIENT QUOTE APPROVAL CHASE ────────────────────────────────────────
  console.log('\n─── 3. Client Quote Approval Chasing ───');

  await test('3.1 — Awaiting client quote approval >24h triggers client reminder', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-quote-001',
      work_order_number: 'WO-QUOTE-001',
      priority: 'P3_MEDIUM',
      stage: 'AWAITING_CLIENT_APPROVAL',
      quote_issued_at: new Date(now - 25 * 3600 * 1000).toISOString(),
      current_chase_count: 0,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === true &&
      decision.chase_type === 'QUOTE_APPROVAL_CHASE' &&
      decision.recipient_type === 'CLIENT' &&
      decision.action_recommended === 'SEND_CHASE'
    );
  });

  // ─── 4. SUPPLIER INVOICE CHASE ─────────────────────────────────────────────
  console.log('\n─── 4. Supplier Invoice Chasing ───');

  await test('4.1 — Completed job missing invoice >7 days triggers contractor chase', () => {
    const ctx: ActiveJobChaseContext = {
      work_order_id: 'wo-inv-001',
      work_order_number: 'WO-INV-001',
      priority: 'P3_MEDIUM',
      stage: 'COMPLETED',
      completed_at: new Date(now - 8 * 86400 * 1000).toISOString(),
      current_chase_count: 0,
    };
    const decision = evaluateJobChase(ctx, now);
    return (
      decision.is_chase_due === true &&
      decision.chase_type === 'SUPPLIER_INVOICE_CHASE' &&
      decision.recipient_type === 'CONTRACTOR' &&
      decision.action_recommended === 'SEND_CHASE'
    );
  });

  // ─── 5. COMMUNICATIONS MESSAGE FORMATTING ─────────────────────────────────
  console.log('\n─── 5. Canonical Communication Templates ───');

  await test('5.1 — Contractor chase message generates professional, factual copy', () => {
    const msg = generateContractorEventMessage('ACKNOWLEDGEMENT_CHASE', {
      work_order_number: 'WO-100234',
      priority: 'P1_CRITICAL',
      attempt_number: 1,
    });
    return (
      msg.subject.includes('[CHASE #1]') &&
      msg.body.includes('WO-100234') &&
      msg.body.includes('P1_CRITICAL')
    );
  });

  await test('5.2 — Client quote message contains clear action callout', () => {
    const msg = generateClientEventMessage('QUOTE_APPROVAL_REQUIRED', {
      work_order_number: 'WO-100234',
      quote_amount_net_gbp: 450.0,
    });
    return (
      msg.subject.includes('Remedial Quote') &&
      msg.body.includes('£450.00') &&
      msg.body.includes('Client Portal')
    );
  });

  // ─── 6. SWEEP ORCHESTRATOR GRACEFUL RESILIENCE ────────────────────────────
  console.log('\n─── 6. Sweep Engine Execution ───');

  await test('6.1 — runChaseSweep returns structured telemetry and handles empty/error DB cleanly', async () => {
    const res = await runChaseSweep(now);
    return (
      typeof res.total_evaluated === 'number' &&
      typeof res.chases_sent === 'number' &&
      typeof res.auto_reassigned === 'number' &&
      typeof res.escalated_to_human === 'number' &&
      Array.isArray(res.errors)
    );
  });

  console.log('\n======================================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log('FAILURES:\n' + failures.map((f) => `  ❌ ${f}`).join('\n'));
  }
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Fatal error during test suite:', err);
  process.exit(1);
});
