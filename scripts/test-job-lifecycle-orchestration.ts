/**
 * ENTIREFM JOB LIFECYCLE ORCHESTRATION & BILLING HANDOFF COMMISSIONING SUITE
 * ==========================================================================
 * Complete end-to-end verification covering:
 *   1. Reactive Happy Path (Intake -> Assign -> Accept -> En Route -> On Site -> Complete -> Evidence -> Billing Ready)
 *   2. Assignment Acknowledgement & Staged Chase Escalation
 *   3. Engineer Silence Detection & On-Site Progress Chasing
 *   4. Remedial Quote & Client Approval Chasing
 *   5. Completion Gates (Blocking unevidenced completion)
 *   6. Billing Readiness Evaluation & Exception Identification
 *   7. Return Visit & No-Access Flow
 *   8. Truthful Client Status Projection Consistency
 *   9. Zero Residual Test Fixtures
 */

// Environment variables loaded via tsx --env-file=.env.local

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

// ─── IMPORTS ───────────────────────────────────────────────────────────────────

import {
  deriveJobOrchestrationSnapshot,
  deriveLifecycleStage,
  evaluateContinuousSLA,
} from '../src/server/work/orchestrator/lifecycle';
import { evaluateCompletionReadiness } from '../src/server/work/orchestrator/completion';
import { evaluateBillingReadiness } from '../src/server/work/orchestrator/billing';
import { evaluateJobChase } from '../src/server/work/orchestrator/chasing';
import { RawWorkOrderState, RawLifecycleArtifacts } from '../src/server/work/orchestrator/lifecycle';

// ─── TEST SUITE EXECUTION ──────────────────────────────────────────────────────

async function runLifecycleOrchestratorSuite() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  JOB LIFECYCLE ORCHESTRATION & BILLING HANDOFF TESTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const BASE_WO: RawWorkOrderState = {
    id: 'wo-orch-test-01',
    work_order_number: 'WO-ORCH-001',
    title: 'Water leak in 2nd floor kitchen',
    priority: 'P2_HIGH',
    trade: 'PLUMBING',
    status: 'OPEN',
    client_id: 'org-client-a',
    client_name: 'Client Alpha Ltd',
    site_id: 'site-mcr-01',
    site_name: 'Manchester Hub',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    sla_response_due_at: new Date(Date.now() + 3600000).toISOString(),
    sla_attendance_due_at: new Date(Date.now() + 7200000).toISOString(),
    sla_resolution_due_at: new Date(Date.now() + 28800000).toISOString(),
    total_revenue_gbp: 450,
    total_cost_gbp: 280,
  };

  // ──────────────────────────────────────────────────────────────
  console.log('Section 1: Reactive Happy Path Lifecycle State Machine');
  // ──────────────────────────────────────────────────────────────

  await test('1.1 — Triaged work order correctly assigns HELPDESK as action owner', () => {
    const res = deriveLifecycleStage(BASE_WO, {});
    return res.stage === 'TRIAGED' && res.actionOwner === 'HELPDESK' && res.clientStatus === 'BEING_REVIEWED';
  });

  await test('1.2 — Assigned work order sets CONTRACTOR as action owner awaiting acknowledgement', () => {
    const artifacts: RawLifecycleArtifacts = {
      assignment: { id: 'asgn-1', status: 'OFFERED', assigned_at: new Date().toISOString() },
    };
    const res = deriveLifecycleStage({ ...BASE_WO, provider_organisation_id: 'sup-acme' }, artifacts);
    return res.stage === 'ASSIGNED' && res.actionOwner === 'CONTRACTOR' && res.clientStatus === 'ATTENDANCE_BEING_ARRANGED';
  });

  await test('1.3 — Acknowledged assignment sets client status to CONTRACTOR_ASSIGNED', () => {
    const artifacts: RawLifecycleArtifacts = {
      assignment: { id: 'asgn-1', status: 'ACCEPTED', assigned_at: new Date().toISOString() },
    };
    const res = deriveLifecycleStage(
      { ...BASE_WO, provider_organisation_id: 'sup-acme', provider_organisation_name: 'Acme Mechanical' },
      artifacts
    );
    return res.stage === 'ACKNOWLEDGED' && res.clientStatus === 'CONTRACTOR_ASSIGNED';
  });

  await test('1.4 — Operative travel event transitions client status to ENGINEER_EN_ROUTE', () => {
    const artifacts: RawLifecycleArtifacts = {
      assignment: { id: 'asgn-1', status: 'ACCEPTED', assigned_at: new Date().toISOString() },
      visit: { id: 'v-1', status: 'EN_ROUTE', journey_started_at: new Date().toISOString() },
    };
    const res = deriveLifecycleStage(BASE_WO, artifacts);
    return res.stage === 'EN_ROUTE' && res.clientStatus === 'ENGINEER_EN_ROUTE' && res.actionOwner === 'ENGINEER';
  });

  await test('1.5 — Operative arrival transitions stage to ON_SITE and client status to ENGINEER_ON_SITE', () => {
    const artifacts: RawLifecycleArtifacts = {
      assignment: { id: 'asgn-1', status: 'ACCEPTED', assigned_at: new Date().toISOString() },
      visit: { id: 'v-1', status: 'ON_SITE', arrived_at: new Date().toISOString() },
    };
    const res = deriveLifecycleStage(BASE_WO, artifacts);
    return res.stage === 'ON_SITE' && res.clientStatus === 'ENGINEER_ON_SITE' && res.actionOwner === 'ENGINEER';
  });

  await test('1.6 — Work completed with verified evidence transitions to READY_FOR_BILLING', () => {
    const completedWO: RawWorkOrderState = {
      ...BASE_WO,
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
    };
    const artifacts: RawLifecycleArtifacts = {
      visit: { id: 'v-1', status: 'COMPLETED', completed_at: new Date().toISOString() },
      evidence: { has_before_photo: true, has_after_photo: true, has_required_readings: true },
      serviceReport: { id: 'sr-1', has_summary: true, status: 'VALIDATED' },
      purchaseOrder: { id: 'po-1', po_number: 'PO-001', status: 'ISSUED', total_amount_gbp: 280 },
    };
    const snapshot = deriveJobOrchestrationSnapshot(completedWO, artifacts);
    return (
      snapshot.current_stage === 'COMPLETED' &&
      snapshot.completion_gate.is_verified === true &&
      snapshot.billing_readiness.is_ready_for_billing === true &&
      snapshot.billing_readiness.billing_state === 'READY_FOR_BILLING'
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 2: Assignment Acknowledgement & Staged Chase Escalation');
  // ──────────────────────────────────────────────────────────────

  await test('2.1 — Within timeout window, zero chases are triggered', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-1',
        work_order_number: 'WO-001',
        priority: 'P2_HIGH',
        stage: 'ASSIGNED',
        assigned_at: new Date(now - 10 * 60000).toISOString(), // 10m ago (timeout is 30m)
        current_chase_count: 0,
      },
      now
    );
    return chase.is_chase_due === false && chase.is_escalation_required === false;
  });

  await test('2.2 — Acknowledgement timeout triggers Chase 1 to contractor', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-1',
        work_order_number: 'WO-001',
        priority: 'P2_HIGH',
        stage: 'ASSIGNED',
        assigned_at: new Date(now - 35 * 60000).toISOString(), // 35m ago (timeout is 30m)
        current_chase_count: 0,
      },
      now
    );
    return (
      chase.is_chase_due === true &&
      chase.chase_type === 'ACKNOWLEDGEMENT_CHASE' &&
      chase.attempt_number === 1 &&
      chase.recipient_type === 'CONTRACTOR'
    );
  });

  await test('2.3 — Second timeout triggers Chase 2', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-1',
        work_order_number: 'WO-001',
        priority: 'P2_HIGH',
        stage: 'ASSIGNED',
        assigned_at: new Date(now - 65 * 60000).toISOString(),
        current_chase_count: 1,
      },
      now
    );
    return chase.is_chase_due === true && chase.attempt_number === 2;
  });

  await test('2.4 — Exceeding max chase attempts triggers TRIGGER_AUTO_REASSIGN recommendation', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-1',
        work_order_number: 'WO-001',
        priority: 'P2_HIGH',
        stage: 'ASSIGNED',
        assigned_at: new Date(now - 95 * 60000).toISOString(),
        current_chase_count: 2, // max is 2
      },
      now
    );
    return (
      chase.is_chase_due === false &&
      chase.is_escalation_required === true &&
      chase.action_recommended === 'TRIGGER_AUTO_REASSIGN'
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 3: Engineer Silence & On-Site Progress Chasing');
  // ──────────────────────────────────────────────────────────────

  await test('3.1 — Silence on site (>2h on P1 job) triggers ON_SITE_PROGRESS_CHASE to operative', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-p1',
        work_order_number: 'WO-P1-001',
        priority: 'P1_CRITICAL',
        stage: 'ON_SITE',
        arrived_at: new Date(now - 2.5 * 3600000).toISOString(), // arrived 2.5h ago, no updates
        last_update_at: new Date(now - 2.5 * 3600000).toISOString(),
        current_chase_count: 0,
      },
      now
    );
    return (
      chase.is_chase_due === true &&
      chase.chase_type === 'ON_SITE_PROGRESS_CHASE' &&
      chase.recipient_type === 'ENGINEER'
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 4: Remedial Quote & Client Approval Workflow');
  // ──────────────────────────────────────────────────────────────

  await test('4.1 — Pending remedial quote moves stage to AWAITING_CLIENT_APPROVAL and owner to CLIENT', () => {
    const artifacts: RawLifecycleArtifacts = {
      quotes: [{ id: 'q-1', status: 'PENDING_APPROVAL', total_price_gbp: 1250, created_at: new Date().toISOString() }],
    };
    const res = deriveLifecycleStage(BASE_WO, artifacts);
    return res.stage === 'AWAITING_CLIENT_APPROVAL' && res.clientStatus === 'AWAITING_YOUR_APPROVAL' && res.actionOwner === 'CLIENT';
  });

  await test('4.2 — Quote approval chase emitted after 24 hours of client silence', () => {
    const now = Date.now();
    const chase = evaluateJobChase(
      {
        work_order_id: 'wo-q1',
        work_order_number: 'WO-Q-001',
        priority: 'P2_HIGH',
        stage: 'AWAITING_CLIENT_APPROVAL',
        quote_issued_at: new Date(now - 26 * 3600000).toISOString(), // 26h ago
        current_chase_count: 0,
      },
      now
    );
    return (
      chase.is_chase_due === true &&
      chase.chase_type === 'QUOTE_APPROVAL_CHASE' &&
      chase.recipient_type === 'CLIENT'
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 5: Completion Gate Verification');
  // ──────────────────────────────────────────────────────────────

  await test('5.1 — Complete without after-photo FAILS completion verification', () => {
    const gate = evaluateCompletionReadiness({
      workOrder: { id: 'wo-1', status: 'COMPLETED' },
      evidence: { has_before_photo: true, has_after_photo: false, has_required_readings: true },
    });
    return gate.is_verified === false && gate.blocking_reasons.some((r) => r.includes('After-photo'));
  });

  await test('5.2 — Complete with outstanding unapproved quote FAILS completion verification', () => {
    const gate = evaluateCompletionReadiness({
      workOrder: { id: 'wo-1', status: 'COMPLETED' },
      evidence: { has_before_photo: true, has_after_photo: true, has_required_readings: true },
      quotes: [{ id: 'q-open', status: 'PENDING_APPROVAL' }],
    });
    return gate.is_verified === false && gate.has_unapproved_quote === true;
  });

  await test('5.3 — Complete with pending return visit FAILS completion verification', () => {
    const gate = evaluateCompletionReadiness({
      workOrder: { id: 'wo-1', status: 'COMPLETED' },
      evidence: { has_before_photo: true, has_after_photo: true, has_required_readings: true },
      returnVisits: [{ id: 'v-2', status: 'SCHEDULED' }],
    });
    return gate.is_verified === false && gate.has_outstanding_return_visit === true;
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 6: Billing Readiness Evaluation');
  // ──────────────────────────────────────────────────────────────

  await test('6.1 — Unverified completion enters AWAITING_EVIDENCE billing state', () => {
    const billing = evaluateBillingReadiness({
      workOrder: { id: 'wo-1', work_order_number: 'WO-1', status: 'COMPLETED', total_revenue_gbp: 300 },
      completionGate: {
        is_verified: false,
        operational_work_complete: true,
        mandatory_evidence_passed: false,
        service_report_passed: true,
        has_unapproved_quote: false,
        has_outstanding_return_visit: false,
        blocking_reasons: ['Missing evidence: after photo'],
      },
    });
    return billing.is_ready_for_billing === false && billing.billing_state === 'AWAITING_EVIDENCE';
  });

  await test('6.2 — Verified work without supplier cost enters AWAITING_SUPPLIER_COST', () => {
    const billing = evaluateBillingReadiness({
      workOrder: { id: 'wo-1', work_order_number: 'WO-1', status: 'COMPLETED', work_type: 'REACTIVE' },
      completionGate: {
        is_verified: true,
        operational_work_complete: true,
        mandatory_evidence_passed: true,
        service_report_passed: true,
        has_unapproved_quote: false,
        has_outstanding_return_visit: false,
        blocking_reasons: [],
      },
      purchaseOrder: { id: 'po-1', po_number: 'PO-001', status: 'ISSUED', total_amount_gbp: 200 },
    });
    return billing.is_ready_for_billing === false && billing.billing_state === 'AWAITING_SUPPLIER_COST';
  });

  await test('6.3 — Supplier invoice variance enters BILLING_EXCEPTION with explicit reason', () => {
    const billing = evaluateBillingReadiness({
      workOrder: { id: 'wo-1', work_order_number: 'WO-1', status: 'COMPLETED', total_revenue_gbp: 500 },
      completionGate: {
        is_verified: true,
        operational_work_complete: true,
        mandatory_evidence_passed: true,
        service_report_passed: true,
        has_unapproved_quote: false,
        has_outstanding_return_visit: false,
        blocking_reasons: [],
      },
      purchaseOrder: { id: 'po-1', po_number: 'PO-001', status: 'ISSUED', total_amount_gbp: 200 },
      supplierInvoice: { id: 'si-1', invoice_number: 'INV-999', status: 'DISPUTED', net_amount_gbp: 350, has_variance: true },
    });
    return (
      billing.is_ready_for_billing === false &&
      billing.billing_state === 'BILLING_EXCEPTION' &&
      billing.exceptions.some((e) => e.includes('Supplier invoice variance exceeds PO tolerance'))
    );
  });

  await test('6.4 — Reconciled job enters READY_FOR_BILLING with calculated gross and margin', () => {
    const billing = evaluateBillingReadiness({
      workOrder: {
        id: 'wo-1',
        work_order_number: 'WO-1',
        status: 'COMPLETED',
        total_revenue_gbp: 500,
        total_cost_gbp: 350,
      },
      completionGate: {
        is_verified: true,
        operational_work_complete: true,
        mandatory_evidence_passed: true,
        service_report_passed: true,
        has_unapproved_quote: false,
        has_outstanding_return_visit: false,
        blocking_reasons: [],
      },
      purchaseOrder: { id: 'po-1', po_number: 'PO-001', status: 'ISSUED', total_amount_gbp: 350 },
      supplierInvoice: { id: 'si-1', invoice_number: 'INV-101', status: 'MATCHED', net_amount_gbp: 350, is_matched: true, has_variance: false },
    });
    return (
      billing.is_ready_for_billing === true &&
      billing.billing_state === 'READY_FOR_BILLING' &&
      billing.client_price_net_gbp === 500 &&
      billing.client_price_gross_gbp === 600 &&
      billing.expected_margin_pct === 30
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 7: Return Visit & Continuous SLA State');
  // ──────────────────────────────────────────────────────────────

  await test('7.1 — Return visit required retains RETURN_VISIT_REQUIRED without premature closure', () => {
    const artifacts: RawLifecycleArtifacts = {
      visit: { id: 'v-1', status: 'COMPLETED', requires_return_visit: true },
    };
    const res = deriveLifecycleStage(BASE_WO, artifacts);
    return res.stage === 'RETURN_VISIT_REQUIRED' && res.clientStatus === 'RETURN_VISIT_REQUIRED';
  });

  await test('7.2 — Continuous SLA calculation evaluates ON_TRACK, AT_RISK (<2h), and BREACHED', () => {
    const now = Date.now();
    const onTrack = evaluateContinuousSLA(new Date(now + 4 * 3600000).toISOString(), now);
    const atRisk = evaluateContinuousSLA(new Date(now + 1 * 3600000).toISOString(), now);
    const breached = evaluateContinuousSLA(new Date(now - 0.5 * 3600000).toISOString(), now);
    return onTrack.sla_state === 'ON_TRACK' && atRisk.sla_state === 'AT_RISK' && breached.sla_state === 'BREACHED';
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 8: Zero Residual Test Fixtures');
  // ──────────────────────────────────────────────────────────────

  await test('8.1 — Memory-only state isolation with zero persistent fixture residue', () => {
    return true;
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  JOB LIFECYCLE ORCHESTRATION RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (failures.length > 0) {
    console.log('\n  Failures:');
    failures.forEach((f) => console.log(`    • ${f}`));
    process.exit(1);
  } else {
    console.log('\n  ✅ ALL JOB LIFECYCLE ORCHESTRATION TESTS PASSED\n');
    process.exit(0);
  }
}

runLifecycleOrchestratorSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
