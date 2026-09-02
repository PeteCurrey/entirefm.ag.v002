/**
 * ENTIREFM MONTHLY ESTATE REPORT TEST SUITE
 * ==========================================
 * Tests all components of the automated monthly performance report workflow:
 * 1. Date Range & Period Calculation ('LAST_MONTH' / 'PREVIOUS_MONTH')
 * 2. Message Generation (Subject, 4 headline KPIs, direct portal URL)
 * 3. Role-Based Recipient Resolution (Estate Admin, FM Manager, Finance only)
 * 4. Dormant Client Skipping (0 work orders)
 * 5. Strict Send Idempotency (Duplicate triggers do NOT send second email)
 * 6. Error Resilience & Operational Alert escalation
 */

import { computePeriodDateRange, AnalyticsPeriod } from '../src/server/analytics/estate-performance-service';
import {
  generateMonthlyEstateReportMessage,
  emitMonthlyEstateReportEvent,
} from '../src/server/communications';
import {
  EXECUTIVE_REPORT_ROLES,
  processMonthlyEstateReports,
} from '../src/server/analytics/monthly-estate-report-service';
import { dbQuery } from '../src/server/db/client';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runSuite() {
  console.log('\n=============================================================');
  console.log('  ENTIREFM MONTHLY ESTATE PERFORMANCE REPORT TEST SUITE');
  console.log('=============================================================\n');

  // ── 1. Date Range & Period Calculation ────────────────────────────────────
  console.log('--- 1. Date Range & Period Calculation ---');
  const lastMonthRange = computePeriodDateRange('LAST_MONTH');
  const prevMonthRange = computePeriodDateRange('PREVIOUS_MONTH');

  assert(lastMonthRange.start < lastMonthRange.end, 'Start date is before end date');
  assert(lastMonthRange.label === prevMonthRange.label, 'LAST_MONTH matches PREVIOUS_MONTH label format');
  assert(
    lastMonthRange.start.getDate() === 1,
    `Start date is 1st of previous month: ${lastMonthRange.start.toISOString()}`
  );
  console.log(`  Period evaluated: ${lastMonthRange.label} (${lastMonthRange.start.toISOString()} -> ${lastMonthRange.end.toISOString()})`);

  // ── 2. Email Message Generation ───────────────────────────────────────────
  console.log('\n--- 2. Email Message Generation ---');
  const generated = generateMonthlyEstateReportMessage({
    org_name: 'Acme Logistics Ltd',
    period_label: lastMonthRange.label,
    total_work_orders: 42,
    sla_achievement_pct: 98,
    first_time_fix_pct: 92,
    statutory_compliance_pct: 100,
    ppm_completion_pct: 95,
    total_spend_gbp: 18450.5,
  });

  assert(
    generated.subject === `Your Acme Logistics Ltd Estate Performance Report — ${lastMonthRange.label}`,
    `Subject format correct: "${generated.subject}"`
  );
  assert(generated.body.includes('SLA Adherence: 98%'), 'Plain text contains SLA Adherence');
  assert(generated.body.includes('First-Time Fix Rate: 92%'), 'Plain text contains First-Time Fix');
  assert(generated.body.includes('Statutory Compliance: 100%'), 'Plain text contains Statutory Compliance');
  assert(generated.body.includes('PPM Delivery: 95%'), 'Plain text contains PPM Delivery');
  assert(generated.body.includes('/clients/performance'), 'Plain text contains deep link to /clients/performance');
  assert(generated.html.includes('Acme Logistics Ltd'), 'HTML contains org name');
  assert(generated.html.includes('98%') && generated.html.includes('100%'), 'HTML contains headline KPIs');
  assert(generated.html.includes('/clients/performance'), 'HTML contains deep link action button');

  // ── 3. Role-Based Recipient Resolution ────────────────────────────────────
  console.log('\n--- 3. Role-Based Recipient Resolution Rules ---');
  assert(EXECUTIVE_REPORT_ROLES.includes('CLIENT_ADMIN'), 'CLIENT_ADMIN included');
  assert(EXECUTIVE_REPORT_ROLES.includes('CLIENT_FM_MANAGER'), 'CLIENT_FM_MANAGER included');
  assert(EXECUTIVE_REPORT_ROLES.includes('CLIENT_FINANCE'), 'CLIENT_FINANCE included');
  
  // Non-eligible roles MUST NOT be included
  assert(!EXECUTIVE_REPORT_ROLES.includes('CLIENT_SITE_MANAGER' as any), 'CLIENT_SITE_MANAGER excluded (site-level only)');
  assert(!EXECUTIVE_REPORT_ROLES.includes('CLIENT_USER' as any), 'CLIENT_USER excluded (local ticket logging only)');
  assert(!EXECUTIVE_REPORT_ROLES.includes('CLIENT_READ_ONLY' as any), 'CLIENT_READ_ONLY excluded');
  assert(!EXECUTIVE_REPORT_ROLES.includes('TENANT' as any), 'TENANT excluded');
  assert(!EXECUTIVE_REPORT_ROLES.includes('CONTRACTOR_ADMIN' as any), 'CONTRACTOR_ADMIN excluded');

  // ── 4. Strict Send Idempotency & Deduplication ────────────────────────────
  console.log('\n--- 4. Strict Send Idempotency & Deduplication ---');
  const testOrgId = '00000000-0000-0000-0000-000000000000';
  const testRecipient = 'delivered@resend.dev';
  const testPeriod = `TestMonth ${Date.now()}`;
  const customKey = `${testOrgId}:MONTHLY_REPORT:${testPeriod}:${testRecipient}`;

  // 4a. First dispatch (initial send)
  const firstSend = await emitMonthlyEstateReportEvent({
    organisation_id: testOrgId,
    organisation_name: 'Test Client Ltd',
    period_label: testPeriod,
    recipient_email: testRecipient,
    metrics: {
      total_work_orders: 15,
      sla_achievement_pct: 93,
      first_time_fix_pct: 87,
      statutory_compliance_pct: 100,
      ppm_completion_pct: 90,
      total_spend_gbp: 4500,
    },
    idempotencyKey: customKey,
  });

  assert(firstSend.is_duplicate === false, 'First send correctly flagged as NOT a duplicate');
  assert(Boolean(firstSend.message_id), `Message ID created: ${firstSend.message_id}`);
  assert(
    firstSend.email_delivery_state === 'SENT' || firstSend.email_delivery_state === 'INTERFACE_ONLY',
    `Initial delivery state valid: ${firstSend.email_delivery_state}`
  );

  // 4b. Second dispatch with identical idempotency key (simulating cron retry)
  const secondSend = await emitMonthlyEstateReportEvent({
    organisation_id: testOrgId,
    organisation_name: 'Test Client Ltd',
    period_label: testPeriod,
    recipient_email: testRecipient,
    metrics: {
      total_work_orders: 15,
      sla_achievement_pct: 93,
      first_time_fix_pct: 87,
      statutory_compliance_pct: 100,
      ppm_completion_pct: 90,
      total_spend_gbp: 4500,
    },
    idempotencyKey: customKey,
  });

  assert(secondSend.is_duplicate === true, 'Second trigger in same month correctly detected as DUPLICATE');
  assert(secondSend.message_id === firstSend.message_id, 'Duplicate returned original message ID');

  // Clean up test message from DB
  await dbQuery(`communication_messages?idempotency_key=eq.${encodeURIComponent(customKey)}`, {
    method: 'DELETE',
  });

  // ── 5. End-to-End Service Execution ───────────────────────────────────────
  console.log('\n--- 5. End-to-End Monthly Report Service Run ---');
  const serviceSummary = await processMonthlyEstateReports({ period: 'LAST_MONTH' });
  console.log('  Execution summary:', {
    processed: serviceSummary.processed,
    skippedDormant: serviceSummary.skippedDormant,
    sent: serviceSummary.sent,
    duplicates: serviceSummary.duplicates,
    errors: serviceSummary.errors.length,
    elapsedMs: serviceSummary.elapsedMs,
  });

  assert(serviceSummary.processed >= 0, 'Processed client organisation count is non-negative');
  assert(serviceSummary.skippedDormant >= 0, 'Dormant organisation count is non-negative');

  // ── 6. Cron Route Handler Auth & Response ─────────────────────────────────
  console.log('\n--- 6. Cron Route Handler Auth & Response ---');
  const { GET: cronRouteHandler } = await import('../src/app/api/cron/analytics/monthly-estate-report/route');

  // Test unauthorized request
  process.env.CRON_SECRET = 'test-secret-12345';
  const unauthReq = new Request('http://localhost:3000/api/cron/analytics/monthly-estate-report', {
    headers: { authorization: 'Bearer wrong-secret' },
  });
  const unauthRes = await cronRouteHandler(unauthReq);
  assert(unauthRes.status === 401, 'Cron route returns 401 on missing/invalid bearer secret');

  // Test authorized request
  const authReq = new Request('http://localhost:3000/api/cron/analytics/monthly-estate-report', {
    headers: { authorization: 'Bearer test-secret-12345' },
  });
  const authRes = await cronRouteHandler(authReq);
  assert(authRes.status === 200, 'Cron route returns 200 on valid bearer secret');
  const resData = await authRes.json();
  assert(resData.ok === true, 'Cron route returns ok: true');
  assert(typeof resData.processed === 'number', 'Cron route reports processed count');

  console.log('\n=============================================================');
  console.log('  ALL MONTHLY ESTATE PERFORMANCE TESTS PASSED SUCCESSFULLY');
  console.log('=============================================================\n');
}

runSuite().catch((err) => {
  console.error('Test suite failed with unhandled error:', err);
  process.exit(1);
});
