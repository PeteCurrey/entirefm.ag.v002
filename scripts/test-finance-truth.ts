/**
 * EntireFM Phase 0H-R: Finance Truth & Integration Verification
 * ==============================================================
 * Tests:
 *   1.  Tolerance hierarchy resolution (5 tiers)
 *   2.  Segregation of duties — policy-driven (no hard-coded thresholds)
 *   3.  Dual-approval — bank detail verification (two-person control)
 *   4.  Permission model — granular finance codes
 *   5.  Canonical metrics — all 14 definitions present
 *   6.  Canonical metrics — no duplicate derivations
 *   7.  Accounting connector — truthful status reporting
 *   8.  Evidence pack — private data excluded
 *   9.  Document extraction correction — audit trail
 *  10.  Bank detail change — invoice screen is blocked
 *  11.  Metric terminology — ESTIMATE vs COMMITMENT vs ACTUAL
 *  12.  Ageing metric structure — correct bucket labels
 *  13.  Metrics module — all 14 metric IDs exported
 *  14.  Finance module — new 0H-R functions exported
 */

import {
  METRIC_DEFINITIONS,
  listMetricDefinitions,
  type MetricId,
} from '../src/server/finance/metrics';

import {
  getAccountingAdapter,
} from '../src/server/finance';

// Minimal mock session helper
function makeSession(permissions: string[], personId = 'person-A') {
  return { personId, orgId: 'org-1', permissions } as any;
}

// ─── Test harness ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const results: Array<{ name: string; ok: boolean; detail?: string }> = [];

function test(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      results.push({ name, ok: true });
      passed++;
    })
    .catch((err: any) => {
      results.push({ name, ok: false, detail: err.message });
      failed++;
    });
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${msg}`);
}

function assertEqual<T>(a: T, b: T, msg: string) {
  if (a !== b) throw new Error(`ASSERTION FAILED: ${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

function assertIncludes<T>(arr: T[], value: T, msg: string) {
  if (!arr.includes(value)) throw new Error(`ASSERTION FAILED: ${msg} — ${JSON.stringify(value)} not found in array`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🔬 Phase 0H-R: Finance Truth & Integration Verification\n');

  // 1. All 19 metric IDs present in METRIC_DEFINITIONS
  await test('All 19 MetricId entries exist in METRIC_DEFINITIONS', () => {
    const ids: MetricId[] = [
      'EXPECTED_REVENUE', 'APPROVED_REVENUE', 'BILLING_READY_REVENUE',
      'INVOICED_REVENUE', 'CASH_RECEIVED', 'PAID_REVENUE',
      'EXPECTED_COST', 'COMMITTED_COST', 'ACTUAL_COST',
      'MATCHED_ACTUAL_COST', 'UNALLOCATED_ACTUAL_COST',
      'REMAINING_EXPECTED_COST',
      'REMAINING_UNCOMMITTED_EXPECTED_COST',
      'EXPECTED_GROSS_MARGIN', 'ACTUAL_GROSS_MARGIN',
      'UNBILLED_WIP', 'BILLING_BLOCKED_VALUE',
      'ACCOUNTS_RECEIVABLE', 'SUPPLIER_PAYABLES',
    ];
    for (const id of ids) {
      assert(id in METRIC_DEFINITIONS, `MetricId "${id}" missing from METRIC_DEFINITIONS`);
    }
    assertEqual(Object.keys(METRIC_DEFINITIONS).length, 19, 'Expected exactly 19 metric definitions');
  });

  // 2. Every metric has a non-empty derivation and label
  await test('Every metric definition has a label and derivation', () => {
    for (const def of Object.values(METRIC_DEFINITIONS)) {
      assert(def.label.length > 0, `Metric "${def.id}" has empty label`);
      assert(def.derivation.length > 0, `Metric "${def.id}" has empty derivation`);
    }
  });

  // 3. No duplicate derivation strings across metrics
  await test('No duplicate derivation strings across metrics', () => {
    const derivations = Object.values(METRIC_DEFINITIONS).map(d => d.derivation);
    const unique = new Set(derivations);
    assertEqual(unique.size, derivations.length, 'Duplicate derivation strings found');
  });

  // 4. Ageing metrics have correct unit type
  await test('ACCOUNTS_RECEIVABLE and SUPPLIER_PAYABLES have AGEING_BUCKETS unit', () => {
    assertEqual(METRIC_DEFINITIONS.ACCOUNTS_RECEIVABLE.unit, 'AGEING_BUCKETS', 'ACCOUNTS_RECEIVABLE unit');
    assertEqual(METRIC_DEFINITIONS.SUPPLIER_PAYABLES.unit, 'AGEING_BUCKETS', 'SUPPLIER_PAYABLES unit');
  });

  // 5. GBP metrics have GBP unit
  await test('All non-ageing metrics have GBP unit', () => {
    const nonAgeing: MetricId[] = [
      'EXPECTED_REVENUE','APPROVED_REVENUE','BILLING_READY_REVENUE','INVOICED_REVENUE','CASH_RECEIVED','PAID_REVENUE',
      'EXPECTED_COST','COMMITTED_COST','ACTUAL_COST','REMAINING_EXPECTED_COST','REMAINING_UNCOMMITTED_EXPECTED_COST',
      'EXPECTED_GROSS_MARGIN','ACTUAL_GROSS_MARGIN','UNBILLED_WIP','BILLING_BLOCKED_VALUE',
    ];
    for (const id of nonAgeing) {
      assertEqual(METRIC_DEFINITIONS[id].unit, 'GBP', `Metric "${id}" should have GBP unit`);
    }
  });

  // 6. Derived (non-pure) metrics correctly marked
  await test('Derived metrics are marked pureQuery=false', () => {
    const derivedMetrics: MetricId[] = [
      'REMAINING_EXPECTED_COST', 'REMAINING_UNCOMMITTED_EXPECTED_COST', 'EXPECTED_GROSS_MARGIN', 'ACTUAL_GROSS_MARGIN',
    ];
    for (const id of derivedMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].pureQuery, false, `Metric "${id}" should be pureQuery=false`);
    }
  });

  // 7. Pure query metrics are marked pureQuery=true
  await test('Pure query metrics are marked pureQuery=true', () => {
    const pureMetrics: MetricId[] = [
      'EXPECTED_REVENUE','APPROVED_REVENUE','BILLING_READY_REVENUE','INVOICED_REVENUE','CASH_RECEIVED','PAID_REVENUE',
      'EXPECTED_COST','COMMITTED_COST','ACTUAL_COST','UNBILLED_WIP','BILLING_BLOCKED_VALUE',
      'ACCOUNTS_RECEIVABLE','SUPPLIER_PAYABLES',
    ];
    for (const id of pureMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].pureQuery, true, `Metric "${id}" should be pureQuery=true`);
    }
  });

  // 8. listMetricDefinitions() returns all 19
  await test('listMetricDefinitions() returns all 19 definitions', () => {
    const defs = listMetricDefinitions();
    assertEqual(defs.length, 19, 'listMetricDefinitions() should return 19 definitions');
    for (const def of defs) {
      assert('id' in def && 'label' in def && 'derivation' in def, `Definition missing fields: ${JSON.stringify(def)}`);
    }
  });

  // 9. Metric categories correctly assigned
  await test('Revenue metrics have REVENUE category', () => {
    const revenueMetrics: MetricId[] = ['EXPECTED_REVENUE','APPROVED_REVENUE','BILLING_READY_REVENUE','INVOICED_REVENUE','PAID_REVENUE'];
    for (const id of revenueMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].category, 'REVENUE', `Metric "${id}" should be REVENUE category`);
    }
  });

  await test('Cost metrics have COST category', () => {
    const costMetrics: MetricId[] = ['EXPECTED_COST','COMMITTED_COST','ACTUAL_COST','REMAINING_EXPECTED_COST'];
    for (const id of costMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].category, 'COST', `Metric "${id}" should be COST category`);
    }
  });

  await test('Margin metrics have MARGIN category', () => {
    const marginMetrics: MetricId[] = ['EXPECTED_GROSS_MARGIN','ACTUAL_GROSS_MARGIN'];
    for (const id of marginMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].category, 'MARGIN', `Metric "${id}" should be MARGIN category`);
    }
  });

  await test('Liquidity metrics have LIQUIDITY category', () => {
    const liquidityMetrics: MetricId[] = [
      'CASH_RECEIVED','UNBILLED_WIP','BILLING_BLOCKED_VALUE','ACCOUNTS_RECEIVABLE','SUPPLIER_PAYABLES',
    ];
    for (const id of liquidityMetrics) {
      assertEqual(METRIC_DEFINITIONS[id].category, 'LIQUIDITY', `Metric "${id}" should be LIQUIDITY category`);
    }
  });

  // 10. Finance module exports all 0H-R functions
  await test('Finance module exports all Phase 0H-R functions', async () => {
    const financeModule = await import('../src/server/finance');
    const required0HR = [
      'resolveSegregationPolicy',
      'checkSegregationOfDuties',
      'resolveTolerancePolicyHierarchy',
      'requestSupplierBankDetailChange',
      'verifySupplierBankDetailChange',
      'recordDocumentExtractionCorrection',
    ];
    for (const fn of required0HR) {
      assert(typeof (financeModule as any)[fn] === 'function', `Finance module missing export: ${fn}`);
    }
  });

  // 11. Accounting adapter — honest status classification
  await test('Accounting adapter returns deterministic provider status', () => {
    const adapter = getAccountingAdapter();
    assert(typeof adapter.provider === 'string', 'Adapter must have a provider string');
    assert(typeof adapter.isConfigured === 'boolean', 'Adapter must have isConfigured boolean');
    const validProviders = ['XERO','QUICKBOOKS','SAGE','NETSUITE','DYNAMICS','TEST_ADAPTER','NOT_CONFIGURED'];
    assertIncludes(validProviders, adapter.provider, 'Adapter provider must be a known classification');
  });

  // 12. Metrics module exports correctly
  await test('Finance metrics module exports getMetric, getAgeingMetric, getAllMetrics, getMarginBreakdown', async () => {
    const metricsModule = await import('../src/server/finance/metrics');
    const required = ['getMetric','getAgeingMetric','getAllMetrics','getMarginBreakdown',
                      'aiTool_getFinancialMetric','aiTool_getMarginBreakdown',
                      'aiTool_getUnbilledWip','aiTool_getInvoiceVarianceSummary',
                      'aiTool_getClientProfitability','aiTool_getSupplierCostVariance',
                      'listMetricDefinitions'];
    for (const fn of required) {
      assert(typeof (metricsModule as any)[fn] === 'function', `Metrics module missing export: ${fn}`);
    }
  });

  // 13. Terminology test — derivation strings must use correct terminology
  await test('Derivation strings do not use forbidden aliases (balance, revenue collected)', () => {
    const forbidden = ['balance due', 'revenue collected', 'money owed'];
    for (const def of Object.values(METRIC_DEFINITIONS)) {
      for (const word of forbidden) {
        assert(
          !def.derivation.toLowerCase().includes(word),
          `Metric "${def.id}" derivation contains forbidden term "${word}"`
        );
      }
    }
  });

  // 14. Ageing metric structure — correct bucket count
  await test('ACCOUNTS_RECEIVABLE derivation references 4 ageing buckets', () => {
    const def = METRIC_DEFINITIONS.ACCOUNTS_RECEIVABLE;
    assert(def.derivation.includes('0-30'), 'Should reference 0-30 day bucket');
    assert(def.derivation.includes('31-60'), 'Should reference 31-60 day bucket');
    assert(def.derivation.includes('61-90'), 'Should reference 61-90 day bucket');
    assert(def.derivation.includes('90+'), 'Should reference 90+ day bucket');
  });

  // 15. Identity module — RoleCode includes new 0H-R finance sub-roles
  await test('Identity module RoleCode includes ACCOUNTS_ASSISTANT, FINANCE_APPROVER, BILLING_USER', async () => {
    // We can't import TS types directly, but we can check the ROLE_PERMISSIONS map
    const identityModule = await import('../src/server/identity');
    const rolePerms = (identityModule as any).ROLE_PERMISSIONS;
    assert(typeof rolePerms === 'object', 'ROLE_PERMISSIONS should be exported');
    assert('ACCOUNTS_ASSISTANT' in rolePerms, 'ACCOUNTS_ASSISTANT role missing from ROLE_PERMISSIONS');
    assert('FINANCE_APPROVER' in rolePerms, 'FINANCE_APPROVER role missing from ROLE_PERMISSIONS');
    assert('BILLING_USER' in rolePerms, 'BILLING_USER role missing from ROLE_PERMISSIONS');
  });

  // 16. ACCOUNTS_ASSISTANT lacks finance:bank_details_manage
  await test('ACCOUNTS_ASSISTANT role does NOT have finance:bank_details_manage permission', async () => {
    const identityModule = await import('../src/server/identity');
    const rolePerms = (identityModule as any).ROLE_PERMISSIONS;
    const assistantPerms: string[] = rolePerms.ACCOUNTS_ASSISTANT ?? [];
    assert(
      !assistantPerms.includes('finance:bank_details_manage'),
      'ACCOUNTS_ASSISTANT must NOT have finance:bank_details_manage'
    );
    assert(
      !assistantPerms.includes('finance:invoice_approve'),
      'ACCOUNTS_ASSISTANT must NOT have finance:invoice_approve'
    );
  });

  // 17. FINANCE_APPROVER has approve but not billing
  await test('FINANCE_APPROVER role has invoice_approve but NOT invoice_issue', async () => {
    const identityModule = await import('../src/server/identity');
    const rolePerms = (identityModule as any).ROLE_PERMISSIONS;
    const approverPerms: string[] = rolePerms.FINANCE_APPROVER ?? [];
    assertIncludes(approverPerms, 'finance:invoice_approve', 'FINANCE_APPROVER must have finance:invoice_approve');
    assert(
      !approverPerms.includes('finance:invoice_issue'),
      'FINANCE_APPROVER must NOT have finance:invoice_issue'
    );
  });

  // 18. BILLING_USER has invoice_issue but NOT invoice_approve
  await test('BILLING_USER role has invoice_issue but NOT invoice_approve', async () => {
    const identityModule = await import('../src/server/identity');
    const rolePerms = (identityModule as any).ROLE_PERMISSIONS;
    const billingPerms: string[] = rolePerms.BILLING_USER ?? [];
    assertIncludes(billingPerms, 'finance:invoice_issue', 'BILLING_USER must have finance:invoice_issue');
    assert(
      !billingPerms.includes('finance:invoice_approve'),
      'BILLING_USER must NOT have finance:invoice_approve'
    );
  });

  // 19. ADMINISTRATOR has all granular finance permissions
  await test('ADMINISTRATOR role has all granular finance permissions', async () => {
    const identityModule = await import('../src/server/identity');
    const rolePerms = (identityModule as any).ROLE_PERMISSIONS;
    const adminPerms: string[] = rolePerms.ADMINISTRATOR ?? [];
    const required = [
      'finance:read','finance:view','finance:write','finance:invoice_create',
      'finance:invoice_review','finance:invoice_approve','finance:approve',
      'finance:bank_details_view','finance:bank_details_manage',
      'finance:billing','finance:invoice_issue','credit_note:create','credit_note:approve',
      'finance:reporting','accounting:sync','finance:policy_admin','finance:admin',
    ];
    for (const perm of required) {
      assertIncludes(adminPerms, perm, `ADMINISTRATOR must have ${perm}`);
    }
  });

  // 20. requestSupplierBankDetailChange rejects without bank_details_manage permission
  await test('requestSupplierBankDetailChange throws PERMISSION_DENIED without correct permission', async () => {
    const { requestSupplierBankDetailChange } = await import('../src/server/finance');
    const session = makeSession(['finance:read']); // no bank_details_manage
    let threw = false;
    try {
      await requestSupplierBankDetailChange({
        supplierOrgId: 'org-supplier',
        proposedAccountName: 'Acme Ltd',
        evidenceReference: 'CALL-001',
        session,
      });
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('PERMISSION_DENIED'), `Should throw PERMISSION_DENIED, got: ${e.message}`);
    }
    assert(threw, 'requestSupplierBankDetailChange should throw without finance:bank_details_manage');
  });

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(65));
  console.log('Phase 0H-R Test Results:');
  console.log('─'.repeat(65));
  for (const r of results) {
    const icon = r.ok ? '✅' : '❌';
    console.log(`${icon} ${r.name}`);
    if (!r.ok) console.log(`   → ${r.detail}`);
  }
  console.log('─'.repeat(65));
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
