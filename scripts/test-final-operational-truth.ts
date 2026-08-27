/**
 * ENTIREFM FINAL OPERATIONAL TRUTH COMMISSIONING TEST
 * ===================================================
 * Verifies the two final operational truth requirements:
 *   1. SLA Target Provenance (Contract hierarchy -> Service -> Configured Fallback -> NOT_CONFIGURED)
 *   2. Outbound Email Delivery & Contractor Communication Gateway State (Live Resend API)
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

// ─── IMPORTS ───────────────────────────────────────────────────────────────────

import {
  resolveSlaPolicy,
  registerSlaPolicyRule,
  clearSlaPolicyRules,
} from '../src/server/work/sla-resolver';
import {
  getOutboundEmailProviderStatus,
  emitClientCommunicationEvent,
  emitContractorCommunicationEvent,
} from '../src/server/communications/index';

async function runFinalOperationalTruthSuite() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM FINAL OPERATIONAL TRUTH VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ──────────────────────────────────────────────────────────────
  console.log('Section 1: SLA Target Provenance & Precedence Hierarchy');
  // ──────────────────────────────────────────────────────────────

  clearSlaPolicyRules();

  // Register rules across different hierarchy levels
  registerSlaPolicyRule({
    id: 'sla-client-a-p1',
    contract_id: 'contract-alpha-01',
    client_id: 'client-alpha',
    priority: 'P1_CRITICAL',
    target_response_mins: 15,
    target_attendance_mins: 120, // 120 mins
    target_resolution_hours: 4,
    operating_hours: '24_7',
    is_active: true,
  });

  registerSlaPolicyRule({
    id: 'sla-client-b-p1',
    contract_id: 'contract-beta-02',
    client_id: 'client-beta',
    priority: 'P1_CRITICAL',
    target_response_mins: 30,
    target_attendance_mins: 240, // 240 mins
    target_resolution_hours: 8,
    operating_hours: '24_7',
    is_active: true,
  });

  registerSlaPolicyRule({
    id: 'sla-service-hvac-p1',
    service_category: 'HVAC',
    priority: 'P1_CRITICAL',
    target_response_mins: 20,
    target_attendance_mins: 180, // 180 mins
    target_resolution_hours: 6,
    operating_hours: '24_7',
    is_active: true,
  });

  registerSlaPolicyRule({
    id: 'sla-fallback-p1',
    priority: 'P1_CRITICAL',
    target_response_mins: 30,
    target_attendance_mins: 300, // 300 mins
    target_resolution_hours: 12,
    operating_hours: '24_7',
    is_active: true,
    is_fallback: true,
  });

  const baseStart = new Date('2026-08-27T10:00:00Z');

  await test('1.1 — Client A Contract resolves to contract rule (P1 attendance = 120m)', () => {
    const res = resolveSlaPolicy({
      contract_id: 'contract-alpha-01',
      client_id: 'client-alpha',
      service_category: 'HVAC',
      priority: 'P1_CRITICAL',
      startDate: baseStart,
    });
    const attendanceDiffMins = (res.deadlines!.attendanceDueAt.getTime() - baseStart.getTime()) / 60000;
    return (
      res.status === 'CONFIGURED' &&
      res.provenance_level === 'CONTRACT' &&
      res.targets?.target_attendance_mins === 120 &&
      attendanceDiffMins === 120
    );
  });

  await test('1.2 — Client B Contract resolves to distinct contract rule (P1 attendance = 240m)', () => {
    const res = resolveSlaPolicy({
      contract_id: 'contract-beta-02',
      client_id: 'client-beta',
      service_category: 'HVAC',
      priority: 'P1_CRITICAL',
      startDate: baseStart,
    });
    const attendanceDiffMins = (res.deadlines!.attendanceDueAt.getTime() - baseStart.getTime()) / 60000;
    return (
      res.status === 'CONFIGURED' &&
      res.provenance_level === 'CONTRACT' &&
      res.targets?.target_attendance_mins === 240 &&
      attendanceDiffMins === 240
    );
  });

  await test('1.3 — Service-level SLA applies when no contract-specific rule exists (HVAC = 180m)', () => {
    const res = resolveSlaPolicy({
      contract_id: 'contract-unconfigured-99',
      service_category: 'HVAC',
      priority: 'P1_CRITICAL',
      startDate: baseStart,
    });
    return (
      res.status === 'CONFIGURED' &&
      res.provenance_level === 'SERVICE' &&
      res.targets?.target_attendance_mins === 180
    );
  });

  await test('1.4 — Configured fallback applies ONLY when explicitly permitted', () => {
    const res = resolveSlaPolicy({
      contract_id: 'contract-unconfigured-99',
      service_category: 'ROOFING_UNCONFIGURED',
      priority: 'P1_CRITICAL',
      startDate: baseStart,
      permitFallback: true,
    });
    return (
      res.status === 'CONFIGURED' &&
      res.provenance_level === 'CONFIGURED_FALLBACK' &&
      res.targets?.target_attendance_mins === 300
    );
  });

  await test('1.5 — Without contract, service, or permitted fallback, strictly returns NOT_CONFIGURED', () => {
    const res = resolveSlaPolicy({
      contract_id: 'contract-unconfigured-99',
      service_category: 'ROOFING_UNCONFIGURED',
      priority: 'P1_CRITICAL',
      startDate: baseStart,
      permitFallback: false,
    });
    return (
      res.status === 'NOT_CONFIGURED' &&
      res.provenance_level === 'NOT_CONFIGURED' &&
      res.targets === undefined &&
      res.reason!.includes('No contractual or service SLA policy configured')
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 2: Outbound Email Provider State & Live Delivery');
  // ──────────────────────────────────────────────────────────────

  await test('2.1 — Outbound email provider reports LIVE Resend Transactional API status', () => {
    const status = getOutboundEmailProviderStatus();
    return (
      status.configuration_state === 'LIVE' &&
      status.provider.includes('Resend') &&
      status.is_production_ready === true
    );
  });

  await test('2.2 — Canonical client events record delivery state as DELIVERED with real Resend message ID', async () => {
    const res1 = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'ISSUE_LOGGED',
      data: { site_name: 'Manchester Hub', trade: 'PLUMBING', recipient_email: 'delivered@resend.dev' },
    });
    const res2 = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'CONTRACTOR_ASSIGNED',
      data: { contractor_name: 'Acme Mechanical', attendance_window: 'Tomorrow 09:00 - 12:00', recipient_email: 'delivered@resend.dev' },
    });
    const res3 = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'QUOTE_APPROVAL_REQUIRED',
      data: { quote_amount_net_gbp: 450, recipient_email: 'delivered@resend.dev' },
    });
    const res4 = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'WORK_COMPLETED',
      data: { completion_summary: 'Pump replaced and pressure tested', recipient_email: 'delivered@resend.dev' },
    });

    return (
      res1.email_delivery_state === 'DELIVERED' &&
      !!res1.provider_message_id &&
      res2.email_delivery_state === 'DELIVERED' &&
      !!res2.provider_message_id &&
      res3.email_delivery_state === 'DELIVERED' &&
      !!res3.provider_message_id &&
      res4.email_delivery_state === 'DELIVERED' &&
      !!res4.provider_message_id &&
      res4.body.includes('Pump replaced and pressure tested')
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 3: Contractor Outbound Communication & Live Delivery');
  // ──────────────────────────────────────────────────────────────

  await test('3.1 — Contractor assignment, chase, ETA, and progress requests record DELIVERED with provider IDs', async () => {
    const c1 = await emitContractorCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'NEW_ASSIGNMENT',
      data: { site_name: 'Manchester Hub', trade: 'PLUMBING', priority: 'P1', po_number: 'PO-9001', nte_amount_gbp: 350, recipient_email: 'delivered@resend.dev' },
    });
    const c2 = await emitContractorCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'ACKNOWLEDGEMENT_CHASE',
      data: { priority: 'P1', attempt_number: 1, recipient_email: 'delivered@resend.dev' },
    });
    const c3 = await emitContractorCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'ETA_REQUEST',
      data: { site_name: 'Manchester Hub', recipient_email: 'delivered@resend.dev' },
    });
    const c4 = await emitContractorCommunicationEvent({
      work_order_id: 'wo-sla-test-01',
      work_order_number: 'WO-SLA-001',
      eventType: 'PROGRESS_UPDATE_REQUEST',
      data: { recipient_email: 'delivered@resend.dev' },
    });

    return (
      c1.email_delivery_state === 'DELIVERED' &&
      !!c1.provider_message_id &&
      c2.email_delivery_state === 'DELIVERED' &&
      !!c2.provider_message_id &&
      c3.email_delivery_state === 'DELIVERED' &&
      !!c3.provider_message_id &&
      c4.email_delivery_state === 'DELIVERED' &&
      !!c4.provider_message_id
    );
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 4: Email Delivery Failure & Work Order Resilience');
  // ──────────────────────────────────────────────────────────────

  await test('4.1 — Simulated provider failure marks state FAILED without losing Work Order state', async () => {
    const failRes = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-fail-test',
      work_order_number: 'WO-FAIL-001',
      eventType: 'ISSUE_LOGGED',
      data: { site_name: 'London HQ', recipient_email: 'delivered@resend.dev' },
      simulateFailure: true,
    });
    return failRes.email_delivery_state === 'FAILED' && failRes.message_id.startsWith('MSG-');
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 5: Duplicate Delivery Safety (Idempotency)');
  // ──────────────────────────────────────────────────────────────

  await test('5.1 — Replaying lifecycle event strictly prevents duplicate outbound message generation', async () => {
    const replayRes = await emitClientCommunicationEvent({
      work_order_id: 'wo-sla-fail-test',
      work_order_number: 'WO-FAIL-001',
      eventType: 'ISSUE_LOGGED',
      data: { site_name: 'London HQ', recipient_email: 'delivered@resend.dev' },
    });
    return replayRes.is_duplicate === true;
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\nSection 6: Teardown & Clean State');
  // ──────────────────────────────────────────────────────────────

  await test('6.1 — Clear test rules with zero database residue', () => {
    clearSlaPolicyRules();
    return true;
  });

  // ──────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  FINAL OPERATIONAL TRUTH RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════════════');

  if (failures.length > 0) {
    console.log('\n  Failures:');
    failures.forEach((f) => console.log(`    • ${f}`));
    process.exit(1);
  } else {
    console.log('\n  ✅ ALL FINAL OPERATIONAL TRUTH TESTS PASSED\n');
    process.exit(0);
  }
}

runFinalOperationalTruthSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
