/**
 * REMOTE DATABASE AUDIT
 * Inspects all operational tables for provenance, counts, and mock/demo records.
 * Classifies records as: REAL/IMPORTED | ENTIREFM_NATIVE | TEST_FIXTURE | DEMO/MOCK | UNKNOWN
 */

import { Client } from 'pg';

const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

const client = new Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function q(sql: string, params: any[] = []) {
  try {
    const res = await client.query(sql, params);
    return res.rows;
  } catch (err: any) {
    return null; // table might not exist
  }
}

async function countTable(table: string): Promise<number | null> {
  const rows = await q(`SELECT COUNT(*) as n FROM public.${table}`);
  if (!rows) return null;
  return parseInt(rows[0]?.n ?? '0', 10);
}

// Known test fixture identifiers seeded by scripts or test suites
const KNOWN_FIXTURE_IDS = [
  // Phase 0J addendum test IDs
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000003',
  '40000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  '70000000-0000-0000-0000-000000000001',
  '80000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000001',
];

// Known demo name strings
const DEMO_NAME_PATTERNS = [
  'Victoria House',
  'Manchester Hub',
  'Birmingham Logistics',
  'Leeds Sovereign',
  'Manchester HQ',
  'ABC Mechanical',
  'ABC Estates',
  'Apex Facilities',
  'Boilerplate',
  'Test Corp',
  'Demo',
  'Sample',
  'Example Ltd',
];

function classifyRecord(row: any): string {
  if (!row) return 'UNKNOWN';
  
  // Check known fixture UUIDs
  if (KNOWN_FIXTURE_IDS.some(id => Object.values(row).includes(id))) {
    return 'TEST_FIXTURE';
  }

  // Check import provenance
  if (row.source_system && row.external_id) {
    return 'REAL/IMPORTED';
  }

  // Check demo/mock name patterns
  const nameFields = [row.name, row.company_name, row.trading_name, row.address_line1];
  for (const field of nameFields) {
    if (field && DEMO_NAME_PATTERNS.some(p => String(field).toLowerCase().includes(p.toLowerCase()))) {
      return 'DEMO/MOCK';
    }
  }

  // Check ID-prefixed test patterns
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === 'string' && (v.startsWith('FIXTURE_') || v.startsWith('TEST_') || v.startsWith('DEMO_') || v.startsWith('MOCK_'))) {
      return 'DEMO/MOCK';
    }
  }

  return 'ENTIREFM_NATIVE';
}

async function auditTable(
  tableName: string,
  nameCol: string | null,
  includeProvenance: boolean = true
): Promise<{ count: number; breakdown: Record<string, number>; mockRows: any[] }> {
  const cols = ['id', nameCol, includeProvenance ? 'source_system' : null, includeProvenance ? 'external_id' : null]
    .filter(Boolean)
    .join(', ');

  const rows = await q(`SELECT ${cols} FROM public.${tableName} LIMIT 500`);
  if (!rows) {
    return { count: -1, breakdown: { 'TABLE_NOT_FOUND': 1 }, mockRows: [] };
  }

  const breakdown: Record<string, number> = {};
  const mockRows: any[] = [];

  for (const row of rows) {
    const cls = classifyRecord(row);
    breakdown[cls] = (breakdown[cls] || 0) + 1;
    if (cls === 'DEMO/MOCK' || cls === 'TEST_FIXTURE') {
      mockRows.push({ table: tableName, id: row.id, name: row[nameCol!] || '(no name)', class: cls });
    }
  }

  return { count: rows.length, breakdown, mockRows };
}

async function main() {
  await client.connect();

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM — REMOTE DATABASE PROVENANCE AUDIT');
  console.log('  Remote: tyrknahwlodspvzfkdzk.supabase.co');
  console.log('════════════════════════════════════════════════════════════════\n');

  const allMockRows: any[] = [];
  const allUnknownRows: any[] = [];
  const results: Record<string, any> = {};

  // 1. ORGANISATIONS
  {
    const r = await auditTable('organisations', 'name', true);
    results['organisations'] = r;
    allMockRows.push(...r.mockRows);
    console.log(`organisations:            ${r.count === -1 ? 'NOT FOUND' : r.count} records | ${JSON.stringify(r.breakdown)}`);
  }

  // 2. CLIENT ACCOUNTS
  {
    const r = await auditTable('client_accounts', 'name', true);
    results['client_accounts'] = r;
    allMockRows.push(...r.mockRows);
    console.log(`client_accounts:          ${r.count === -1 ? 'NOT FOUND' : r.count} records | ${JSON.stringify(r.breakdown)}`);
  }

  // 3. SITES
  {
    const r = await auditTable('sites', 'name', true);
    results['sites'] = r;
    allMockRows.push(...r.mockRows);
    console.log(`sites:                    ${r.count === -1 ? 'NOT FOUND' : r.count} records | ${JSON.stringify(r.breakdown)}`);
  }

  // 4. BUILDINGS (may not exist)
  {
    const count = await countTable('buildings');
    console.log(`buildings:                ${count === null ? 'NOT FOUND' : count} records`);
    results['buildings'] = { count };
  }

  // 5. SPACES
  {
    const count = await countTable('spaces');
    console.log(`spaces:                   ${count === null ? 'NOT FOUND' : count} records`);
    results['spaces'] = { count };
  }

  // 6. SYSTEMS
  {
    const count = await countTable('systems');
    console.log(`systems:                  ${count === null ? 'NOT FOUND' : count} records`);
    results['systems'] = { count };
  }

  // 7. ASSETS
  {
    const count = await countTable('assets');
    console.log(`assets:                   ${count === null ? 'NOT FOUND' : count} records`);
    results['assets'] = { count };
  }

  // 8. PROVIDER ORGANISATIONS
  {
    const r = await auditTable('provider_organisations', 'name', true);
    results['provider_organisations'] = r;
    allMockRows.push(...r.mockRows);
    console.log(`provider_organisations:   ${r.count === -1 ? 'NOT FOUND' : r.count} records | ${JSON.stringify(r.breakdown)}`);
  }

  // 9. PROVIDER RESOURCES
  {
    const count = await countTable('provider_resources');
    console.log(`provider_resources:       ${count === null ? 'NOT FOUND' : count} records`);
    results['provider_resources'] = { count };
  }

  // 10. SERVICE REQUESTS
  {
    const count = await countTable('service_requests');
    console.log(`service_requests:         ${count === null ? 'NOT FOUND' : count} records`);
    results['service_requests'] = { count };
  }

  // 11. WORK ORDERS
  {
    const count = await countTable('work_orders');
    console.log(`work_orders:              ${count === null ? 'NOT FOUND' : count} records`);
    results['work_orders'] = { count };
  }

  // 12. ASSIGNMENTS
  {
    const count = await countTable('assignments');
    console.log(`assignments:              ${count === null ? 'NOT FOUND' : count} records`);
    results['assignments'] = { count };
  }

  // 13. VISITS
  {
    const count = await countTable('visits');
    console.log(`visits:                   ${count === null ? 'NOT FOUND' : count} records`);
    results['visits'] = { count };
  }

  // 14. PPM PLANS
  {
    const count = await countTable('ppm_plans');
    console.log(`ppm_plans:                ${count === null ? 'NOT FOUND' : count} records`);
    results['ppm_plans'] = { count };
  }

  // 15. PPM OCCURRENCES
  {
    const count = await countTable('ppm_occurrences');
    console.log(`ppm_occurrences:          ${count === null ? 'NOT FOUND' : count} records`);
    results['ppm_occurrences'] = { count };
  }

  // 16. COMPLIANCE OBLIGATIONS
  {
    const count = await countTable('compliance_obligations');
    console.log(`compliance_obligations:   ${count === null ? 'NOT FOUND' : count} records`);
    results['compliance_obligations'] = { count };
  }

  // 17. COMPLIANCE EXCEPTIONS
  {
    const count = await countTable('compliance_exceptions');
    console.log(`compliance_exceptions:    ${count === null ? 'NOT FOUND' : count} records`);
    results['compliance_exceptions'] = { count };
  }

  // 18. CERTIFICATES
  {
    const count = await countTable('certificates');
    console.log(`certificates:             ${count === null ? 'NOT FOUND' : count} records`);
    results['certificates'] = { count };
  }

  // 19. QUOTES
  {
    const count = await countTable('quotes');
    console.log(`quotes:                   ${count === null ? 'NOT FOUND' : count} records`);
    results['quotes'] = { count };
  }

  // 20. BILLING RECORDS / CLIENT INVOICES
  {
    const count = await countTable('client_invoices');
    const countB = await countTable('billing_records');
    console.log(`client_invoices:          ${count === null ? 'NOT FOUND' : count} records`);
    console.log(`billing_records:          ${countB === null ? 'NOT FOUND' : countB} records`);
    results['client_invoices'] = { count };
    results['billing_records'] = { count: countB };
  }

  // 21. SUPPLIER INVOICES
  {
    const count = await countTable('supplier_invoices');
    console.log(`supplier_invoices:        ${count === null ? 'NOT FOUND' : count} records`);
    results['supplier_invoices'] = { count };
  }

  // 22. AI RUNS / ACTIONS
  {
    const count = await countTable('ai_actions');
    const countR = await countTable('ai_runs');
    console.log(`ai_actions:               ${count === null ? 'NOT FOUND' : count} records`);
    console.log(`ai_runs:                  ${countR === null ? 'NOT FOUND' : countR} records`);
  }

  // 23. NOTIFICATIONS
  {
    const count = await countTable('notifications');
    console.log(`notifications:            ${count === null ? 'NOT FOUND' : count} records`);
  }

  // 24. DATA IMPORT TABLES (Migration 0023)
  console.log('\n--- Migration 0023 Import Tables ---');
  for (const t of ['data_import_batches', 'data_import_files', 'data_import_rows', 'data_import_mappings', 'data_import_issues']) {
    const count = await countTable(t);
    console.log(`${t.padEnd(30)} ${count === null ? 'NOT FOUND' : count} records`);
  }

  // 25. CONFIGURATION / REFERENCE TABLES (not operational — expected to have data)
  console.log('\n--- Configuration & Reference Tables (NOT operational data) ---');
  for (const t of ['compliance_kpi_registry', 'compliance_rules', 'compliance_sources', 'ai_agents', 'service_types', 'trade_categories', 'permission_codes']) {
    const count = await countTable(t);
    console.log(`${t.padEnd(30)} ${count === null ? 'NOT FOUND' : count} records (config)`);
  }

  // Summary
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('  PROVENANCE SUMMARY');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`\nConfirmed DEMO/MOCK or TEST_FIXTURE operational records: ${allMockRows.length}`);
  if (allMockRows.length > 0) {
    for (const r of allMockRows) {
      console.log(`  - [${r.class}] ${r.table}: ${r.id} / "${r.name}"`);
    }
  }

  // Write results to JSON for cleanup script
  const fs = await import('node:fs/promises');
  await fs.writeFile('/tmp/efm-remote-audit.json', JSON.stringify({ results, allMockRows }, null, 2));
  console.log('\nAudit results written to /tmp/efm-remote-audit.json');

  await client.end();
}

main().catch(async (err) => {
  console.error('Audit error:', err.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
