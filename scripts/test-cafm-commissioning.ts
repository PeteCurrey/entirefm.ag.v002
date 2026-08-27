/**
 * ENTIREFM — END-TO-END CAFM COMMISSIONING TEST SCRIPT
 * =====================================================
 * Validates the complete operational lifecycle from estate creation through
 * client billing against the live Supabase PostgreSQL schema.
 *
 * Lifecycle tested:
 *   A. Organisation → Client Account → Contract → Site → Building → Space → Asset
 *   B. Supply Chain: Supplier Organisation → Trade
 *   C. Reactive Job: Service Request → Work Order → Visit → Complete
 *   D. Commercial: Defect → Quote → Approval → Purchase Order
 *   E. Planned Maintenance: Requirement → Plan → Plan Item → Occurrence → Work Order
 *   F. Finance Pipeline: Supplier Invoice → Match → Cost Posting → Client Invoice
 *   G. Cross-Cutting Integrity Verifications
 *   H. Clean Teardown: 0 residual fixture records
 *
 * All IDs are deterministic (zero-prefixed UUIDs) to ensure clean teardown.
 */

import { Client } from 'pg';

const CONNECTION_STRING =
  'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(description: string) {
  console.log(`  ✓ ${description}`);
  passed++;
}
function fail(description: string, detail?: string) {
  const msg = `${description}${detail ? ` — ${detail}` : ''}`;
  console.error(`  ✗ [FAIL] ${msg}`);
  failures.push(msg);
  failed++;
}
function section(title: string) {
  console.log(`\n═══ ${title} ${'═'.repeat(Math.max(0, 75 - title.length))}`);
}
function assert(description: string, condition: boolean, detail?: string) {
  if (condition) ok(description);
  else fail(description, detail);
}

// ─── FIXTURE IDs (deterministic) ──────────────────────────────────────────────

const FX = {
  org:            '00000000-cafe-0000-0000-000000000001',
  supplier_org:   '00000000-cafe-0000-0000-000000000002',
  client_account: '00000000-cafe-0000-0000-000000000010',
  contract:       '00000000-cafe-0000-0000-000000000011',
  site:           '00000000-cafe-0000-0000-000000000020',
  building:       '00000000-cafe-0000-0000-000000000021',
  floor_zone:     '00000000-cafe-0000-0000-000000000023',
  space:          '00000000-cafe-0000-0000-000000000022',
  asset:          '00000000-cafe-0000-0000-000000000030',
  trade:          '00000000-cafe-0000-0000-000000000040',
  service_req:    '00000000-cafe-0000-0000-000000000060',
  work_order:     '00000000-cafe-0000-0000-000000000070',
  visit:          '00000000-cafe-0000-0000-000000000080',
  defect:         '00000000-cafe-0000-0000-000000000090',
  quote:          '00000000-cafe-0000-0000-0000000000a0',
  purchase_order: '00000000-cafe-0000-0000-0000000000b0',
  ppm_req:        '00000000-cafe-0000-0000-0000000000c0',
  ppm_plan:       '00000000-cafe-0000-0000-0000000000c1',
  ppm_item:       '00000000-cafe-0000-0000-0000000000c2',
  ppm_occurrence: '00000000-cafe-0000-0000-0000000000d0',
  ppm_wo:         '00000000-cafe-0000-0000-0000000000e0',
  sup_invoice:    '00000000-cafe-0000-0000-0000000000f0',
  client_invoice: '00000000-cafe-0000-0000-000000000100',
};

// ─── CLEANUP ──────────────────────────────────────────────────────────────────

async function cleanup(pg: Client) {
  console.log('\n  [Cleanup] Removing any prior commissioning fixtures...');

  const deletes: [string, string][] = [
    ['client_invoices', `id = '${FX.client_invoice}'`],
    ['supplier_invoices', `id = '${FX.sup_invoice}'`],
    ['purchase_orders', `id = '${FX.purchase_order}'`],
    ['quotes', `id = '${FX.quote}'`],
    ['defects', `id = '${FX.defect}'`],
    ['visits', `id = '${FX.visit}'`],
    ['maintenance_occurrences', `id = '${FX.ppm_occurrence}'`],
    ['work_orders', `id IN ('${FX.ppm_wo}', '${FX.work_order}')`],
    ['maintenance_plan_items', `id = '${FX.ppm_item}'`],
    ['maintenance_plans', `id = '${FX.ppm_plan}'`],
    ['maintenance_requirements', `id = '${FX.ppm_req}'`],
    ['service_requests', `id = '${FX.service_req}'`],
    ['assets', `id = '${FX.asset}'`],
    ['spaces', `id = '${FX.space}'`],
    ['floor_zones', `id = '${FX.floor_zone}'`],
    ['buildings', `id = '${FX.building}'`],
    ['sites', `id = '${FX.site}'`],
    ['contracts', `id = '${FX.contract}'`],
    ['client_accounts', `id = '${FX.client_account}'`],
    ['trades', `id = '${FX.trade}'`],
    ['organisations', `id IN ('${FX.org}', '${FX.supplier_org}')`],
  ];

  for (const [table, where] of deletes) {
    await pg.query(`DELETE FROM ${table} WHERE ${where}`).catch(() => {});
  }

  console.log('  [Cleanup] Complete.');
}

// ─── SECTION A: Estate Foundation ─────────────────────────────────────────────

async function testEstateFoundation(pg: Client) {
  section('A. ESTATE FOUNDATION — Organisation → Client Account → Contract → Site → Asset');

  // A1: Organisation
  try {
    await pg.query(`
      INSERT INTO organisations (id, code, name, legal_name, org_type, status, portal_status, created_at, updated_at)
      VALUES ($1, 'EFM-COMMISSION', 'EntireFM Commissioning Client Ltd', 'EntireFM Commissioning Client Limited',
              'CLIENT', 'ACTIVE', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.org]);
    ok('A1: Organisation created (CLIENT)');
  } catch (e: any) { fail('A1: Organisation creation', e.message); }

  // A2: Client Account
  try {
    await pg.query(`
      INSERT INTO client_accounts (id, organisation_id, account_code, status, billing_currency, payment_terms_days, created_at, updated_at)
      VALUES ($1, $2, 'ACC-COMMISSION-001', 'ACTIVE', 'GBP', 30, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET account_code = EXCLUDED.account_code
    `, [FX.client_account, FX.org]);
    ok('A2: Client account created');
  } catch (e: any) { fail('A2: Client account creation', e.message); }

  // A3: Contract
  try {
    await pg.query(`
      INSERT INTO contracts (id, client_account_id, contract_ref, name, contract_type,
        start_date, end_date, annual_value_gbp, status, created_at, updated_at)
      VALUES ($1, $2, 'CON-COMMISSION-001', 'Commissioning FM Contract 2026', 'FULL_FM',
        '2026-01-01', '2027-12-31', 150000, 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.contract, FX.client_account]);
    ok('A3: Contract created (£150k annual)');
  } catch (e: any) { fail('A3: Contract creation', e.message); }

  // A4: Site
  try {
    await pg.query(`
      INSERT INTO sites (id, organisation_id, site_code, name, address_line1, city, postcode, country, status, created_at, updated_at)
      VALUES ($1, $2, 'CTE-01', 'Commissioning Test Tower', '1 Test Street', 'London', 'EC1A 1AA', 'GB', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.site, FX.org]);
    ok('A4: Site created (London EC1A)');
  } catch (e: any) { fail('A4: Site creation', e.message); }

  // A5: Building
  try {
    await pg.query(`
      INSERT INTO buildings (id, site_id, building_code, name, floors_above, construction_year, status, created_at, updated_at)
      VALUES ($1, $2, 'BLD-A', 'Main Building Block A', 8, 2001, 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.building, FX.site]);
    ok('A5: Building created (8 floors)');
  } catch (e: any) { fail('A5: Building creation', e.message); }

  // A6: Floor Zone
  try {
    await pg.query(`
      INSERT INTO floor_zones (id, building_id, name, floor_number, created_at, updated_at)
      VALUES ($1, $2, 'Level 3 Zone A', 3, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.floor_zone, FX.building]);
    ok('A6: Floor Zone created (Level 3 Zone A)');
  } catch (e: any) { fail('A6: Floor Zone creation', e.message); }

  // A7: Space
  try {
    await pg.query(`
      INSERT INTO spaces (id, floor_zone_id, space_code, name, space_type, status, created_at, updated_at)
      VALUES ($1, $2, 'PR-3F', 'Plant Room 3F', 'PLANT_ROOM', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.space, FX.floor_zone]);
    ok('A7: Space created (Plant Room 3F)');
  } catch (e: any) { fail('A7: Space creation', e.message); }

  // A8: Asset
  try {
    await pg.query(`
      INSERT INTO assets (id, site_id, space_id, asset_reference, name, category, criticality, condition, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'AHU-3F-01', 'Commercial AHU Unit 3F-01', 'HVAC', 'HIGH', 'GOOD', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.asset, FX.site, FX.space]);
    ok('A8: Asset (Commercial AHU Unit) registered');
  } catch (e: any) { fail('A8: Asset creation', e.message); }

  // A9: Verify Estate Hierarchy via query
  const { rows } = await pg.query(`
    SELECT a.id, a.name as asset_name, s.name as site_name, c.name as contract_name, o.name as org_name
    FROM assets a
    JOIN sites s ON s.id = a.site_id
    JOIN organisations o ON o.id = s.organisation_id
    JOIN client_accounts ca ON ca.organisation_id = o.id
    JOIN contracts c ON c.client_account_id = ca.id
    WHERE a.id = $1
  `, [FX.asset]);
  assert('A9: Full estate hierarchy join intact (Org → Client → Contract → Site → Asset)', rows.length === 1);
}

// ─── SECTION B: Supply Chain & Trades ─────────────────────────────────────────

async function testSupplyChain(pg: Client) {
  section('B. SUPPLY CHAIN & TRADES — Supplier Organisation → Trade');

  // B1: Supplier Organisation
  try {
    await pg.query(`
      INSERT INTO organisations (id, code, name, legal_name, org_type, status, portal_status, created_at, updated_at)
      VALUES ($1, 'CTCHVAC', 'CommissionTest HVAC Contractors Ltd', 'CommissionTest HVAC Contractors Limited',
              'CONTRACTOR', 'ACTIVE', 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.supplier_org]);
    ok('B1: Supplier organisation created (CONTRACTOR)');
  } catch (e: any) { fail('B1: Supplier org creation', e.message); }

  // B2: Trade
  try {
    await pg.query(`
      INSERT INTO trades (id, code, name, category, description, created_at)
      VALUES ($1, 'TRD-HVAC', 'HVAC & Refrigeration', 'MECHANICAL', 'Air conditioning, ventilation, chillers and heat pumps', NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.trade]);
    ok('B2: Trade registered (HVAC & Refrigeration)');
  } catch (e: any) { fail('B2: Trade creation', e.message); }

  // B3: Verification
  const { rows } = await pg.query(`SELECT id, status, org_type FROM organisations WHERE id = $1`, [FX.supplier_org]);
  assert('B3: Supplier verified as active CONTRACTOR', rows.length === 1 && rows[0].org_type === 'CONTRACTOR');
}

// ─── SECTION C: Reactive Job Lifecycle ────────────────────────────────────────

async function testReactiveJobLifecycle(pg: Client) {
  section('C. REACTIVE JOB — Service Request → Work Order → Visit → Complete');

  // C1: Service Request
  try {
    await pg.query(`
      INSERT INTO service_requests (id, reference, organisation_id, site_id, asset_id,
        title, description, category, priority, status, source, created_at, updated_at)
      VALUES ($1, 'SR-COMMISSION-001', $2, $3, $4,
        'AHU 3F-01 Fan Belt Failure — No airflow reported',
        'Reported by site manager: AHU on 3rd floor plant room has no airflow. Possible fan belt failure.',
        'HVAC', 'P2_HIGH', 'NEW', 'PHONE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, [FX.service_req, FX.org, FX.site, FX.asset]);
    ok('C1: Service request logged (SR-COMMISSION-001)');
  } catch (e: any) { fail('C1: Service request creation', e.message); }

  // C2: Triage
  try {
    await pg.query(`UPDATE service_requests SET status = 'TRIAGED', updated_at = NOW() WHERE id = $1`, [FX.service_req]);
    const { rows } = await pg.query(`SELECT status FROM service_requests WHERE id = $1`, [FX.service_req]);
    assert('C2: Service request triaged', rows[0]?.status === 'TRIAGED');
  } catch (e: any) { fail('C2: Triage SR', e.message); }

  // C3: Convert to Work Order
  try {
    await pg.query(`
      INSERT INTO work_orders (id, work_order_number, service_request_id, organisation_id, site_id,
        asset_id, contract_id, provider_organisation_id, title, description, work_type, priority,
        status, created_at, updated_at)
      VALUES ($1, 'WO-COMMISSION-001', $2, $3, $4, $5, $6, $7,
        'REACTIVE — AHU 3F-01 Fan Belt Failure',
        'Attend and replace AHU fan belt in 3rd floor plant room. Check drive alignment post replacement.',
        'REACTIVE_REPAIR', 'P2_HIGH', 'OPEN', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, [FX.work_order, FX.service_req, FX.org, FX.site, FX.asset, FX.contract, FX.supplier_org]);
    ok('C3: Work order raised (WO-COMMISSION-001)');
  } catch (e: any) { fail('C3: Work order creation', e.message); }

  // C4: Update Service Request status
  try {
    await pg.query(`UPDATE service_requests SET status = 'CONVERTED', updated_at = NOW() WHERE id = $1`, [FX.service_req]);
    ok('C4: Service request status updated to CONVERTED');
  } catch (e: any) { fail('C4: Update SR status', e.message); }

  // C5: Issue Work Order
  try {
    await pg.query(`UPDATE work_orders SET status = 'ISSUED', updated_at = NOW() WHERE id = $1`, [FX.work_order]);
    const { rows } = await pg.query(`SELECT status FROM work_orders WHERE id = $1`, [FX.work_order]);
    assert('C5: Work order issued', rows[0]?.status === 'ISSUED');
  } catch (e: any) { fail('C5: Issue WO', e.message); }

  // C6: Schedule Engineer Visit
  try {
    const scheduledStart = new Date(Date.now() + 3600000).toISOString();
    const scheduledEnd = new Date(Date.now() + 7200000).toISOString();
    await pg.query(`
      INSERT INTO visits (id, work_order_id, visit_number, status, scheduled_start_at, scheduled_end_at, site_notes, created_at, updated_at)
      VALUES ($1, $2, 1, 'PLANNED', $3, $4, 'Fan belt replacement and alignment check', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
    `, [FX.visit, FX.work_order, scheduledStart, scheduledEnd]);
    ok('C6: Engineer visit scheduled');
  } catch (e: any) { fail('C6: Schedule visit', e.message); }

  // C7: Progress & Complete Visit
  try {
    await pg.query(`
      UPDATE visits SET status = 'COMPLETED', actual_check_in_at = NOW() - INTERVAL '2 hours',
        actual_check_out_at = NOW(), sign_off_name = 'Site Manager John', updated_at = NOW()
      WHERE id = $1
    `, [FX.visit]);
    await pg.query(`UPDATE work_orders SET status = 'IN_PROGRESS', updated_at = NOW() WHERE id = $1`, [FX.work_order]);
    ok('C7: Visit executed & signed off by site manager');
  } catch (e: any) { fail('C7: Complete visit', e.message); }

  // C8: Complete Work Order with Cost & Revenue
  try {
    await pg.query(`
      UPDATE work_orders SET status = 'COMPLETED', actual_completion_at = NOW(),
        total_cost_gbp = 380.00, total_revenue_gbp = 520.00, billing_status = 'PENDING', updated_at = NOW()
      WHERE id = $1
    `, [FX.work_order]);
    const { rows } = await pg.query(`SELECT status, total_cost_gbp, total_revenue_gbp FROM work_orders WHERE id = $1`, [FX.work_order]);
    assert('C8: Work order completed (£380 cost, £520 revenue)', 
      rows[0]?.status === 'COMPLETED' &&
      parseFloat(rows[0]?.total_cost_gbp) === 380.00 &&
      parseFloat(rows[0]?.total_revenue_gbp) === 520.00);
  } catch (e: any) { fail('C8: Complete WO', e.message); }
}

// ─── SECTION D: Defect → Quote → Purchase Order ───────────────────────────────

async function testCommercialWorkflow(pg: Client) {
  section('D. COMMERCIAL — Defect → Quote → Approval → Purchase Order');

  // D1: Defect logged
  try {
    await pg.query(`
      INSERT INTO defects (id, site_id, asset_id, category, severity, description, current_state, created_at)
      VALUES ($1, $2, $3, 'MECHANICAL', 'MEDIUM',
        'Drive pulley showing excessive wear. Recommend replacement to prevent recurrence.',
        'OPEN', NOW())
      ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description
    `, [FX.defect, FX.site, FX.asset]);
    ok('D1: Defect logged against asset (Pulley wear)');
  } catch (e: any) { fail('D1: Log defect', e.message); }

  // D2: Quote Raised
  try {
    await pg.query(`
      INSERT INTO quotes (id, quote_number, work_order_id, client_account_id, provider_org_id,
        status, subtotal_gbp, tax_amount_gbp, total_amount_gbp, version, scope_description, created_at, updated_at)
      VALUES ($1, 'QUO-COMMISSION-001', $2, $3, $4,
        'DRAFT', 650.00, 130.00, 780.00, 1, 'Supply and install new cast iron drive pulley for AHU 3F-01', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET quote_number = EXCLUDED.quote_number
    `, [FX.quote, FX.work_order, FX.client_account, FX.supplier_org]);
    ok('D2: Quote created (£650 net, £780 gross)');
  } catch (e: any) { fail('D2: Create quote', e.message); }

  // D3: Quote Issued & Approved
  try {
    await pg.query(`UPDATE quotes SET status = 'ISSUED', issued_at = NOW(), updated_at = NOW() WHERE id = $1`, [FX.quote]);
    await pg.query(`UPDATE quotes SET status = 'APPROVED', approved_at = NOW(), updated_at = NOW() WHERE id = $1`, [FX.quote]);
    const { rows } = await pg.query(`SELECT status FROM quotes WHERE id = $1`, [FX.quote]);
    assert('D3: Quote issued and approved by client', rows[0]?.status === 'APPROVED');
  } catch (e: any) { fail('D3: Approve quote', e.message); }

  // D4: Purchase Order Raised
  try {
    await pg.query(`
      INSERT INTO purchase_orders (id, po_number, work_order_id, quote_id, supplier_org_id,
        status, total_amount_gbp, issued_at, created_at, updated_at)
      VALUES ($1, 'PO-COMMISSION-001', $2, $3, $4, 'ISSUED', 456.00, NOW(), NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET po_number = EXCLUDED.po_number
    `, [FX.purchase_order, FX.work_order, FX.quote, FX.supplier_org]);
    ok('D4: Purchase Order PO-COMMISSION-001 raised (£456.00 gross)');
  } catch (e: any) { fail('D4: Raise PO', e.message); }

  // D5: Verify PO Linkage
  const { rows } = await pg.query(`
    SELECT po.id, po.po_number, q.quote_number, wo.work_order_number
    FROM purchase_orders po
    JOIN quotes q ON q.id = po.quote_id
    JOIN work_orders wo ON wo.id = po.work_order_id
    WHERE po.id = $1
  `, [FX.purchase_order]);
  assert('D5: Purchase Order linked to Quote & Work Order', rows.length === 1);
}

// ─── SECTION E: Planned Maintenance (PPM) ─────────────────────────────────────

async function testPPMLifecycle(pg: Client) {
  section('E. PLANNED MAINTENANCE (PPM) — Requirement → Plan → Occurrence → Work Order');

  // E1: Maintenance Requirement
  try {
    await pg.query(`
      INSERT INTO maintenance_requirements (id, requirement_code, asset_class, title, description,
        frequency, frequency_interval_days, required_trade, version, status, created_at, updated_at)
      VALUES ($1, 'REQ-AHU-Q', 'AIR_HANDLING_UNIT', 'AHU Quarterly Comprehensive Service',
        'Inspect drive belts, check bearings, clean filters, verify damper actuation',
        'QUARTERLY', 90, 'HVAC', 1, 'ACTIVE', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, [FX.ppm_req]);
    ok('E1: Maintenance requirement created (Quarterly AHU)');
  } catch (e: any) { fail('E1: Maintenance requirement', e.message); }

  // E2: Maintenance Plan
  try {
    await pg.query(`
      INSERT INTO maintenance_plans (id, plan_number, client_account_id, site_id, name,
        version, status, effective_from, created_at, updated_at)
      VALUES ($1, 'PPM-COMMISSION-001', $2, $3, 'Annual PPM Plan — Commissioning Tower 2026',
        1, 'ACTIVE', '2026-01-01', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
    `, [FX.ppm_plan, FX.client_account, FX.site]);
    ok('E2: Maintenance plan created (PPM-COMMISSION-001)');
  } catch (e: any) { fail('E2: Maintenance plan', e.message); }

  // E3: Plan Item
  try {
    await pg.query(`
      INSERT INTO maintenance_plan_items (id, plan_id, asset_id, requirement_id, is_active, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
      ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active
    `, [FX.ppm_item, FX.ppm_plan, FX.asset, FX.ppm_req]);
    ok('E3: Plan item linked to asset and requirement');
  } catch (e: any) { fail('E3: Plan item', e.message); }

  // E4: Maintenance Occurrence
  try {
    const plannedDate = '2026-10-15';
    await pg.query(`
      INSERT INTO maintenance_occurrences (id, occurrence_code, plan_item_id, plan_id, asset_id,
        requirement_id, planned_date, window_start_date, window_end_date, status, created_at, updated_at)
      VALUES ($1, 'OCC-2026-Q4-001', $2, $3, $4, $5, $6, '2026-10-01', '2026-10-31', 'PLANNED', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET occurrence_code = EXCLUDED.occurrence_code
    `, [FX.ppm_occurrence, FX.ppm_item, FX.ppm_plan, FX.asset, FX.ppm_req, plannedDate]);
    ok('E4: Maintenance occurrence generated for Q4 2026');
  } catch (e: any) { fail('E4: Occurrence', e.message); }

  // E5: PPM Work Order generated from occurrence
  try {
    await pg.query(`
      INSERT INTO work_orders (id, work_order_number, organisation_id, site_id, asset_id, contract_id,
        provider_organisation_id, title, description, work_type, priority, status, created_at, updated_at)
      VALUES ($1, 'WO-PPM-COMMISSION-001', $2, $3, $4, $5, $6,
        'PPM — AHU 3F-01 Q4 2026 Comprehensive Service',
        'Statutory quarterly service per specification REQ-AHU-Q: belts, bearings, filters, dampers.',
        'PLANNED_PREVENTIVE', 'P5_ROUTINE', 'OPEN', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title
    `, [FX.ppm_wo, FX.org, FX.site, FX.asset, FX.contract, FX.supplier_org]);
    await pg.query(`UPDATE maintenance_occurrences SET work_order_id = $1, status = 'GENERATED' WHERE id = $2`,
      [FX.ppm_wo, FX.ppm_occurrence]);
    ok('E5: PPM work order raised and linked to occurrence');
  } catch (e: any) { fail('E5: PPM work order', e.message); }

  // E6: Complete PPM Occurrence
  try {
    await pg.query(`UPDATE work_orders SET status = 'COMPLETED', actual_completion_at = NOW(), updated_at = NOW() WHERE id = $1`, [FX.ppm_wo]);
    await pg.query(`UPDATE maintenance_occurrences SET status = 'SATISFIED', satisfied_at = NOW(), updated_at = NOW() WHERE id = $1`, [FX.ppm_occurrence]);
    const { rows } = await pg.query(`SELECT status FROM maintenance_occurrences WHERE id = $1`, [FX.ppm_occurrence]);
    assert('E6: PPM occurrence SATISFIED upon work order completion', rows[0]?.status === 'SATISFIED');
  } catch (e: any) { fail('E6: Complete PPM occurrence', e.message); }
}

// ─── SECTION F: Finance Pipeline ──────────────────────────────────────────────

async function testFinancePipeline(pg: Client) {
  section('F. FINANCE — Supplier Invoice → Match → Cost Posting → Client Invoice');

  // F1: Supplier Invoice received
  try {
    await pg.query(`
      INSERT INTO supplier_invoices (id, invoice_ref, purchase_order_id, supplier_org_id, work_order_id,
        status, issue_date, due_date, subtotal_gbp, tax_amount_gbp, total_amount_gbp, created_at, updated_at)
      VALUES ($1, 'SINV-CTCHVAC-2026-001', $2, $3, $4,
        'RECEIVED', '2026-08-20', '2026-09-20', 380.00, 76.00, 456.00, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET invoice_ref = EXCLUDED.invoice_ref
    `, [FX.sup_invoice, FX.purchase_order, FX.supplier_org, FX.work_order]);
    ok('F1: Supplier invoice logged (£380 net, £456 gross)');
  } catch (e: any) { fail('F1: Log supplier invoice', e.message); }

  // F2: Match Supplier Invoice against Purchase Order
  try {
    await pg.query(`
      UPDATE supplier_invoices SET status = 'MATCHED', match_status = 'EXACT_MATCH',
        matched_po_id = $1, matched_work_order_id = $2, matched_at = NOW(), updated_at = NOW()
      WHERE id = $3
    `, [FX.purchase_order, FX.work_order, FX.sup_invoice]);
    const { rows } = await pg.query(`SELECT status, match_status FROM supplier_invoices WHERE id = $1`, [FX.sup_invoice]);
    assert('F2: Supplier invoice 2-way matched to PO', 
      rows[0]?.status === 'MATCHED' && rows[0]?.match_status === 'EXACT_MATCH');
  } catch (e: any) { fail('F2: Match invoice', e.message); }

  // F3: Approve Supplier Invoice & Post Actual Cost
  try {
    await pg.query(`
      UPDATE supplier_invoices SET status = 'APPROVED', approved_at = NOW(),
        actual_cost_posted = true, actual_cost_posted_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [FX.sup_invoice]);
    await pg.query(`
      UPDATE work_orders SET billing_status = 'READY_TO_BILL', updated_at = NOW()
      WHERE id = $1
    `, [FX.work_order]);
    const { rows } = await pg.query(`SELECT billing_status FROM work_orders WHERE id = $1`, [FX.work_order]);
    assert('F3: Actual cost posted, work order marked READY_TO_BILL', rows[0]?.billing_status === 'READY_TO_BILL');
  } catch (e: any) { fail('F3: Approve invoice / post cost', e.message); }

  // F4: Client Invoice Issued
  try {
    await pg.query(`
      INSERT INTO client_invoices (id, invoice_number, client_account_id, contract_id,
        status, issue_date, due_date, subtotal_gbp, tax_amount_gbp, total_amount_gbp, created_at, updated_at)
      VALUES ($1, 'CINV-COMMISSION-2026-001', $2, $3,
        'ISSUED', '2026-08-27', '2026-09-27', 520.00, 104.00, 624.00, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET invoice_number = EXCLUDED.invoice_number
    `, [FX.client_invoice, FX.client_account, FX.contract]);
    ok('F4: Client invoice issued (£520 net, £624 gross incl. 20% VAT)');
  } catch (e: any) { fail('F4: Issue client invoice', e.message); }

  // F5: Verify Invoicing Integrity
  const { rows } = await pg.query(`SELECT id, status, total_amount_gbp FROM client_invoices WHERE id = $1`, [FX.client_invoice]);
  assert('F5: Client invoice verified with correct gross (£624.00)', 
    rows.length === 1 && parseFloat(rows[0].total_amount_gbp) === 624.00);
}

// ─── SECTION G: Cross-Cutting Verifications ───────────────────────────────────

async function testCrossCutting(pg: Client) {
  section('G. CROSS-CUTTING INTEGRITY VERIFICATIONS');

  // G1: Work orders linked to site
  const { rows: siteWOs } = await pg.query(`SELECT COUNT(*) as count FROM work_orders WHERE site_id = $1`, [FX.site]);
  assert('G1: Site has exactly 2 work orders (1 reactive + 1 PPM)', parseInt(siteWOs[0].count) === 2);

  // G2: Asset has linked service requests and work orders
  const { rows: assetWOs } = await pg.query(`SELECT COUNT(*) as count FROM work_orders WHERE asset_id = $1`, [FX.asset]);
  assert('G2: Asset linked to exactly 2 work orders', parseInt(assetWOs[0].count) === 2);

  // G3: Service request → Work order linkage
  const { rows: srLink } = await pg.query(`
    SELECT wo.work_order_number, sr.reference
    FROM work_orders wo
    JOIN service_requests sr ON sr.id = wo.service_request_id
    WHERE wo.id = $1
  `, [FX.work_order]);
  assert('G3: Service request correctly linked to work order', 
    srLink.length === 1 && srLink[0].reference === 'SR-COMMISSION-001');

  // G4: Defect linked to asset
  const { rows: defects } = await pg.query(`SELECT id FROM defects WHERE asset_id = $1`, [FX.asset]);
  assert('G4: Defect associated with asset', defects.length === 1);

  // G5: End-to-end margin calculation check
  // Reactive Job: Revenue £520, Cost £380 => Margin £140 (26.9%)
  const { rows: marginCheck } = await pg.query(`
    SELECT total_revenue_gbp, total_cost_gbp,
           (total_revenue_gbp - total_cost_gbp) as margin_gbp,
           ROUND(((total_revenue_gbp - total_cost_gbp) / total_revenue_gbp) * 100, 1) as margin_pct
    FROM work_orders
    WHERE id = $1
  `, [FX.work_order]);
  assert('G5: Job gross margin verified (£140.00 / 26.9%)', 
    parseFloat(marginCheck[0]?.margin_gbp) === 140.00 &&
    parseFloat(marginCheck[0]?.margin_pct) === 26.9);
}

// ─── SECTION H: Cleanup Verification ──────────────────────────────────────────

async function testCleanup(pg: Client) {
  section('H. CLEANUP & TEARDOWN — Remove all commissioning fixtures');

  await cleanup(pg);

  const checks: [string, string][] = [
    ['client_invoices', `id = '${FX.client_invoice}'`],
    ['supplier_invoices', `id = '${FX.sup_invoice}'`],
    ['purchase_orders', `id = '${FX.purchase_order}'`],
    ['quotes', `id = '${FX.quote}'`],
    ['defects', `id = '${FX.defect}'`],
    ['visits', `id = '${FX.visit}'`],
    ['maintenance_occurrences', `id = '${FX.ppm_occurrence}'`],
    ['work_orders', `id IN ('${FX.ppm_wo}', '${FX.work_order}')`],
    ['maintenance_plan_items', `id = '${FX.ppm_item}'`],
    ['maintenance_plans', `id = '${FX.ppm_plan}'`],
    ['maintenance_requirements', `id = '${FX.ppm_req}'`],
    ['service_requests', `id = '${FX.service_req}'`],
    ['assets', `id = '${FX.asset}'`],
    ['spaces', `id = '${FX.space}'`],
    ['buildings', `id = '${FX.building}'`],
    ['sites', `id = '${FX.site}'`],
    ['contracts', `id = '${FX.contract}'`],
    ['client_accounts', `id = '${FX.client_account}'`],
    ['trades', `id = '${FX.trade}'`],
    ['organisations', `id IN ('${FX.org}', '${FX.supplier_org}')`],
  ];

  let clean = true;
  for (const [table, where] of checks) {
    const { rows } = await pg.query(`SELECT COUNT(*) as count FROM ${table} WHERE ${where}`);
    if (parseInt(rows[0].count) > 0) {
      fail(`H: Table ${table} has residual records`, `${rows[0].count} records remain`);
      clean = false;
    }
  }

  if (clean) {
    ok('H: All commissioning test fixtures deleted — 0 residual records in database');
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM — END-TO-END CAFM COMMISSIONING TEST');
  console.log('  Tests the complete operational lifecycle from estate to billing');
  console.log('════════════════════════════════════════════════════════════════════════════════');

  const pg = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pg.connect();
    console.log('\n  ✓ Database connection established');

    // Pre-clean
    await cleanup(pg);

    await testEstateFoundation(pg);
    await testSupplyChain(pg);
    await testReactiveJobLifecycle(pg);
    await testCommercialWorkflow(pg);
    await testPPMLifecycle(pg);
    await testFinancePipeline(pg);
    await testCrossCutting(pg);
    await testCleanup(pg);

  } catch (e: any) {
    console.error('\n[FATAL] Unhandled error:', e.message);
    failed++;
  } finally {
    await pg.end();
  }

  const total = passed + failed;
  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log(`  COMMISSIONING RESULT: ${passed}/${total} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log('\n  FAILURES:');
    failures.forEach((f) => console.error(`    ✗ ${f}`));
  }
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
