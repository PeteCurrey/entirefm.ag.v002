/**
 * ENTIREFM — RED-04 FINANCE TRUTH & OPERATIONAL PIPELINE TEST SUITE
 * =================================================================
 * Validates the complete finance pipeline against live Supabase:
 *   Invoice → SoD → Approval → Actual Cost → Commitment → Margin
 *
 * Acceptance Principle:
 *   Real user action → real API → real domain logic → real database state
 *   → real downstream consequence → truthful UI.
 */

import { Client } from 'pg';
import { approveSupplierInvoice, postActualCost } from '../src/server/finance';
import { getMetric, getMarginBreakdown } from '../src/server/finance/metrics';
import type { UserSession } from '../src/server/identity';

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(desc: string) {
  console.log(`  ✓ ${desc}`);
  passed++;
}

function fail(desc: string, detail?: string) {
  const msg = `${desc}${detail ? ` — ${detail}` : ''}`;
  console.error(`  ✗ [FAIL] ${msg}`);
  failures.push(msg);
  failed++;
}

function section(title: string) {
  console.log(`\n═══ ${title} ${'═'.repeat(Math.max(0, 70 - title.length))}`);
}

function assert(desc: string, condition: boolean, detail?: string) {
  if (condition) ok(desc);
  else fail(desc, detail);
}

// ── Deterministic Fixture IDs ────────────────────────────────────────────────
const FX = {
  org:            '00000000-f1e0-0000-0000-000000000001',
  client_account: '00000000-f1e0-0000-0000-000000000002',
  contract:       '00000000-f1e0-0000-0000-000000000003',
  site:           '00000000-f1e0-0000-0000-000000000004',
  supplier_org:   '00000000-f1e0-0000-0000-000000000005',
  po_creator:     '00000000-f1e0-0000-0000-000000000006',
  approver:       '00000000-f1e0-0000-0000-000000000007',
  work_order:     '00000000-f1e0-0000-0000-000000000010',
  po_standard:    '00000000-f1e0-0000-0000-000000000020',
  po_high_val:    '00000000-f1e0-0000-0000-000000000021',
  commitment:     '00000000-f1e0-0000-0000-000000000030',
  inv_standard:   '00000000-f1e0-0000-0000-000000000040',
  inv_high_val:   '00000000-f1e0-0000-0000-000000000041',
  billing_record: '00000000-f1e0-0000-0000-000000000050',
};

// ── Cleanup ──────────────────────────────────────────────────────────────────
async function cleanup(pg: Client) {
  const deletes: [string, string][] = [
    ['client_billing_records', `id = '${FX.billing_record}'`],
    ['supplier_invoice_lines', `supplier_invoice_id IN ('${FX.inv_standard}', '${FX.inv_high_val}')`],
    ['supplier_invoices', `id IN ('${FX.inv_standard}', '${FX.inv_high_val}')`],
    ['cost_commitments', `id = '${FX.commitment}'`],
    ['purchase_orders', `id IN ('${FX.po_standard}', '${FX.po_high_val}')`],
    ['work_orders', `id = '${FX.work_order}'`],
    ['sites', `id = '${FX.site}'`],
    ['contracts', `id = '${FX.contract}'`],
    ['client_accounts', `id = '${FX.client_account}'`],
    ['organisations', `id IN ('${FX.org}', '${FX.supplier_org}')`],
    ['persons', `id IN ('${FX.po_creator}', '${FX.approver}')`],
  ];

  for (const [table, cond] of deletes) {
    try {
      await pg.query(`DELETE FROM ${table} WHERE ${cond}`);
    } catch {
      // ignore teardown cascading errors
    }
  }
}

async function run() {
  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM RED-04: FINANCE TRUTH & PIPELINE VERIFICATION SUITE');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const pg = new Client({ connectionString: CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
  await pg.connect();
  console.log('  ✓ PostgreSQL direct connection established\n');

  await cleanup(pg);

  try {
    // ── 1. SETUP FIXTURES ───────────────────────────────────────────────────────
    section('1. FIXTURE CREATION — Estate, WO, PO & Cost Commitment');

    // Persons (PO Creator & Finance Approver)
    await pg.query(`
      INSERT INTO persons (id, first_name, last_name, email, job_title, status, created_at, updated_at)
      VALUES 
        ($1, 'Alice', 'Creator', 'alice.creator@entirefm-test.com', 'Operations Coordinator', 'ACTIVE', NOW(), NOW()),
        ($2, 'Bob', 'Approver', 'bob.approver@entirefm-test.com', 'Finance Director', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
    `, [FX.po_creator, FX.approver]);
    ok('Persons: Alice (PO Creator) and Bob (Finance Approver) seeded');

    // Organisations
    await pg.query(`
      INSERT INTO organisations (id, code, name, org_type, created_at, updated_at)
      VALUES 
        ($1, 'ORG-FIN-CLIENT', 'EntireFM Test Client Ltd', 'CLIENT', NOW(), NOW()),
        ($2, 'ORG-FIN-SUPP', 'EntireFM Test HVAC Ltd', 'CONTRACTOR', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.org, FX.supplier_org]);

    // Client Account & Contract (£120k annual = £10k/month)
    await pg.query(`
      INSERT INTO client_accounts (id, organisation_id, account_code, name, status, created_at, updated_at)
      VALUES ($1, $2, 'CA-FIN-001', 'EntireFM Test Client Ltd', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.client_account, FX.org]);

    await pg.query(`
      INSERT INTO contracts (id, client_account_id, contract_ref, name, annual_value_gbp, status, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, 'CON-FIN-001', 'Total FM 2026', 120000.00, 'ACTIVE', '2026-01-01', '2026-12-31', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET annual_value_gbp = EXCLUDED.annual_value_gbp
    `, [FX.contract, FX.client_account]);

    // Site
    await pg.query(`
      INSERT INTO sites (id, organisation_id, site_code, name, address_line1, city, postcode, created_at, updated_at)
      VALUES ($1, $2, 'SITE-FIN-001', 'City Tower Hub', '100 London Wall', 'London', 'EC2M 5QQ', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.site, FX.org]);

    // Work Order with expected revenue £1,000, initial cost £0
    await pg.query(`
      INSERT INTO work_orders (id, work_order_number, organisation_id, site_id, title, description,
        priority, status, total_revenue_gbp, total_cost_gbp, billing_status, created_at, updated_at)
      VALUES ($1, 'WO-FIN-001', $2, $3, 'Emergency Chiller Pressure Fault',
        'Inspect and repair low pressure lock out on Chiller 2',
        'P2_HIGH', 'COMPLETED', 1000.00, 0.00, 'PENDING_COST_POSTING', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, [FX.work_order, FX.org, FX.site]);
    ok('Work Order WO-FIN-001 created: Revenue £1,000.00, Initial Cost £0.00, Status COMPLETED');

    // Purchase Orders (Standard £540 gross, High Value £6,600 gross)
    await pg.query(`
      INSERT INTO purchase_orders (id, po_number, work_order_id, supplier_org_id, status,
        total_amount_gbp, created_by_id, created_at, updated_at)
      VALUES 
        ($1, 'PO-FIN-001', $2, $3, 'ISSUED', 540.00, $4, NOW(), NOW()),
        ($5, 'PO-FIN-HIGH', $2, $3, 'ISSUED', 6600.00, $4, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET total_amount_gbp = EXCLUDED.total_amount_gbp
    `, [FX.po_standard, FX.work_order, FX.supplier_org, FX.po_creator, FX.po_high_val]);
    ok('Purchase Orders created by Alice: Standard PO (£540 gross) & High-Value PO (£6,600 gross)');

    // Cost Commitment for Standard PO
    await pg.query(`
      INSERT INTO cost_commitments (id, work_order_id, purchase_order_id, provider_org_id, description,
        committed_amount_gbp, actual_invoiced_gbp, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'Emergency Chiller Callout & Labour', 450.00, 0.00, 'COMMITTED', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [FX.commitment, FX.work_order, FX.po_standard, FX.supplier_org]);
    ok('Cost Commitment created: £450.00 committed, £0.00 invoiced, status COMMITTED');

    // ── 2. INVOICE INGESTION & MATCHING ─────────────────────────────────────────
    section('2. INVOICE INTAKE — Match against PO');

    // Standard invoice (£450 net, £90 tax, £540 gross)
    await pg.query(`
      INSERT INTO supplier_invoices (id, invoice_ref, purchase_order_id, matched_po_id,
        supplier_org_id, work_order_id, status, processing_status, match_status,
        issue_date, due_date, subtotal_gbp, tax_amount_gbp, total_amount_gbp,
        actual_cost_posted, created_at, updated_at)
      VALUES ($1, 'INV-HVAC-2026-001', $2, $2, $3, $4,
        'MATCHED', 'REVIEW_REQUIRED', 'EXACT_MATCH',
        '2026-09-01', '2026-10-01', 450.00, 90.00, 540.00,
        false, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [FX.inv_standard, FX.po_standard, FX.supplier_org, FX.work_order]);

    // Line item for standard invoice
    await pg.query(`
      INSERT INTO supplier_invoice_lines (id, supplier_invoice_id, work_order_id, description,
        quantity, unit_price_gbp, total_amount_gbp, tax_rate_pct, tax_amount_gbp, match_status, created_at)
      VALUES (gen_random_uuid(), $1, $2, '4hr Specialist Chiller Diagnosis & Leak Seal',
        1, 450.00, 450.00, 20.00, 90.00, 'EXACT_MATCH', NOW())
    `, [FX.inv_standard, FX.work_order]);

    // High-value invoice (£5,500 net, £1,100 tax, £6,600 gross)
    await pg.query(`
      INSERT INTO supplier_invoices (id, invoice_ref, purchase_order_id, matched_po_id,
        supplier_org_id, work_order_id, status, processing_status, match_status,
        issue_date, due_date, subtotal_gbp, tax_amount_gbp, total_amount_gbp,
        actual_cost_posted, created_at, updated_at)
      VALUES ($1, 'INV-HVAC-HIGH-VAL', $2, $2, $3, $4,
        'MATCHED', 'REVIEW_REQUIRED', 'EXACT_MATCH',
        '2026-09-01', '2026-10-01', 5500.00, 1100.00, 6600.00,
        false, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [FX.inv_high_val, FX.po_high_val, FX.supplier_org, FX.work_order]);
    ok('Supplier Invoices ingested: INV-HVAC-2026-001 (£540.00) & INV-HVAC-HIGH-VAL (£6,600.00)');

    // ── 3. SEGREGATION OF DUTIES (SoD) ENFORCEMENT ──────────────────────────────
    section('3. SEGREGATION OF DUTIES (SoD) — Fail-Closed Self-Approval Guard');

    const creatorSession: UserSession = {
      userId: FX.po_creator,
      personId: FX.po_creator,
      orgId: FX.org,
      orgType: 'ENTIREFM',
      role: 'OPERATIONS',
      email: 'alice.creator@entirefm-test.com',
      firstName: 'Alice',
      lastName: 'Creator',
    };

    let sodBlocked = false;
    try {
      // Alice (creator of high-value PO) attempts to approve the matching £6,600 invoice
      await approveSupplierInvoice(FX.inv_high_val, creatorSession);
    } catch (err: any) {
      if (err.message.includes('SEGREGATION_OF_DUTIES')) {
        sodBlocked = true;
      }
    }
    assert('SoD Policy: PO creator blocked from self-approving high-value invoice (>£5,000)', sodBlocked);

    // Verify DB state remains unapproved
    const { rows: highValRows } = await pg.query(`SELECT processing_status FROM supplier_invoices WHERE id = $1`, [FX.inv_high_val]);
    assert('Database state preserved: high-value invoice remains in REVIEW_REQUIRED', highValRows[0]?.processing_status === 'REVIEW_REQUIRED');

    // ── 4. AUTHORIZED APPROVAL ──────────────────────────────────────────────────
    section('4. AUTHORIZED APPROVAL — Independent Finance Sign-Off');

    const approverSession: UserSession = {
      userId: FX.approver,
      personId: FX.approver,
      orgId: FX.org,
      orgType: 'ENTIREFM',
      role: 'FINANCE',
      email: 'bob.approver@entirefm-test.com',
      firstName: 'Bob',
      lastName: 'Approver',
    };

    await approveSupplierInvoice(FX.inv_standard, approverSession);

    const { rows: approvedRows } = await pg.query(
      `SELECT status, processing_status, approved_by_id, approved_at FROM supplier_invoices WHERE id = $1`,
      [FX.inv_standard]
    );
    assert('Invoice status transitioned to APPROVED', approvedRows[0]?.status === 'APPROVED');
    assert('Invoice processing_status is APPROVED', approvedRows[0]?.processing_status === 'APPROVED');
    assert('Approver ID recorded as Bob (Finance)', approvedRows[0]?.approved_by_id === FX.approver);
    assert('Approval timestamp recorded', !!approvedRows[0]?.approved_at);

    // ── 5. ACTUAL COST POSTING & COMMITMENT CONSUMPTION ─────────────────────────
    section('5. ACTUAL COST POSTING — Ledger Commit & Commitment Consumption');

    const postResult = await postActualCost(FX.inv_standard, approverSession);

    assert('postActualCost returned updated work order ID', postResult.workOrdersUpdated.includes(FX.work_order));
    assert('postActualCost returned consumed commitment ID', postResult.commitmentsConsumed.includes(FX.commitment));

    // Verify supplier_invoices status updated to POSTED
    const { rows: postedInvRows } = await pg.query(
      `SELECT actual_cost_posted, processing_status, actual_cost_posted_by_id FROM supplier_invoices WHERE id = $1`,
      [FX.inv_standard]
    );
    assert('supplier_invoices.actual_cost_posted === true', postedInvRows[0]?.actual_cost_posted === true);
    assert('supplier_invoices.processing_status === POSTED', postedInvRows[0]?.processing_status === 'POSTED');

    // Verify work_orders.total_cost_gbp updated
    const { rows: woAfterPost } = await pg.query(
      `SELECT total_cost_gbp, total_revenue_gbp, billing_status FROM work_orders WHERE id = $1`,
      [FX.work_order]
    );
    const updatedCost = parseFloat(woAfterPost[0]?.total_cost_gbp);
    assert('work_orders.total_cost_gbp updated to £450.00 net direct cost (got £' + updatedCost + ')', updatedCost === 450.00);
    assert('work_orders.billing_status set to READY_TO_BILL', woAfterPost[0]?.billing_status === 'READY_TO_BILL');

    // Verify cost_commitments consumed
    const { rows: commAfterPost } = await pg.query(
      `SELECT committed_amount_gbp, actual_invoiced_gbp, status FROM cost_commitments WHERE id = $1`,
      [FX.commitment]
    );
    const actualInvoiced = parseFloat(commAfterPost[0]?.actual_invoiced_gbp);
    assert('cost_commitments.actual_invoiced_gbp updated to £540.00', actualInvoiced === 540.00);
    assert('cost_commitments.status transitioned to INVOICED', commAfterPost[0]?.status === 'INVOICED');

    // Verify duplicate posting guard (idempotency / fail-closed)
    let duplicateBlocked = false;
    try {
      await postActualCost(FX.inv_standard, approverSession);
    } catch (err: any) {
      if (err.message.includes('already been posted') || err.message.includes('Current status')) {
        duplicateBlocked = true;
      }
    }
    assert('Duplicate posting attempt blocked (fail-closed)', duplicateBlocked);

    // ── 6. REAL MARGIN & TRUTHFUL FINANCIAL METRICS ────────────────────────────
    section('6. MARGIN & CANONICAL METRICS RECALCULATION');

    // Work Order gross margin check: Net Revenue £1,000 - Net Cost £450 = £550 (55.0%)
    const revenue = parseFloat(woAfterPost[0]?.total_revenue_gbp);
    const marginGbp = revenue - updatedCost;
    const marginPct = Math.round(((marginGbp / revenue) * 100) * 10) / 10;
    assert('Work Order Gross Margin is £550.00', marginGbp === 550.00);
    assert('Work Order Gross Margin % is 55.0%', marginPct === 55.0);

    // Live financial metrics execution against Supabase
    const actualCostMetric = await getMetric('ACTUAL_COST', {});
    assert('getMetric("ACTUAL_COST") executed without DB errors', typeof actualCostMetric.value_gbp === 'number');

    const expectedRevMetric = await getMetric('EXPECTED_REVENUE', {});
    assert('getMetric("EXPECTED_REVENUE") executed without DB errors', typeof expectedRevMetric.value_gbp === 'number');
    assert('EXPECTED_REVENUE incorporates £10,000 monthly contract revenue', expectedRevMetric.value_gbp >= 10000.00);

    const committedCostMetric = await getMetric('COMMITTED_COST', {});
    assert('getMetric("COMMITTED_COST") executed without DB errors', typeof committedCostMetric.value_gbp === 'number');

    const marginBreakdown = await getMarginBreakdown({});
    assert('getMarginBreakdown() executed successfully', typeof marginBreakdown.expected_gross_margin === 'number');

    // ── 7. CLEANUP & TEARDOWN ───────────────────────────────────────────────────
    section('7. TEARDOWN — Zero-Fixture Guarantee');
    await cleanup(pg);

    const { rows: residualWos } = await pg.query(`SELECT id FROM work_orders WHERE id = $1`, [FX.work_order]);
    assert('Teardown complete: 0 residual test fixtures in database', residualWos.length === 0);

  } finally {
    await pg.end();
  }

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log(`  RED-04 PIPELINE RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('══════════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error in RED-04 test suite:', err);
  process.exit(1);
});
