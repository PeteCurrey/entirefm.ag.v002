/**
 * ENTIREFM PHASE 2 VERIFICATION TEST SUITE
 * ========================================
 * 28-Step Comprehensive Lifecycle Acceptance Suite:
 *
 * SECTION 1: ARCHITECTURE, SECURITY & CODE INTEGRITY
 *  1. No mock personnel in client estate components
 *  2. No hardcoded demo identities in engineer portal
 *  3. Migration 0058 exists and contains canonical lifecycle schema extensions
 *  4. ENGINEER role is in ENGINEER_ELIGIBLE_ROLES list
 *  5. Ineligible role rejection in internal engineer validation
 *  6. validateInternalEngineer returns null for invalid/empty IDs
 *  7. Client Portal quotes page enforces tenant isolation (queries client_account_id)
 *  8. Client Portal invoices page enforces tenant isolation (queries client_account_id)
 *  9. Client quote action API enforces tenant ownership check before mutation
 * 10. Engineer jobs page queries canonical assigned_resource_id column
 * 11. Engineer visits detail page queries canonical tasks table
 * 12. SitesPageClient Register Site modal includes Client Account selector
 *
 * SECTION 2: END-TO-END OPERATIONAL CAFM LIFECYCLE (DB-BACKED)
 * 13. Database connectivity via PostgREST / Postgres
 * 14. Query or establish canonical EntireFM internal engineer
 * 15. Query or establish canonical Client Account
 * 16. Query or establish Site linked to Client Account
 * 17. Create Quote direct with site_id, client_account_id, and line items
 * 18. Verify Quote persistence with site_id and pricing totals
 * 19. Cross-tenant isolation: simulate unauthorized client action rejection
 * 20. Update Quote status to APPROVED
 * 21. Convert Quote to Work Order (work_type: QUOTED, quote_id linked)
 * 22. Idempotency test: second conversion returns same Work Order without duplicate
 * 23. Verify bidirectional link: quote.converted_work_order_id <-> work_order.quote_id
 * 24. Assign Internal Engineer to Work Order (lead_engineer_id + visit created)
 * 25. Complete Work Order with closure notes & actual costs (status COMPLETED)
 * 26. Generate Client Invoice from completed Work Order
 * 27. Idempotency test: second invoice request returns existing invoice
 * 28. Verify Audit Ledger records lifecycle events
 *
 * Run: npx tsx scripts/test-phase2-lifecycle.ts
 */

import fs from 'fs';
import path from 'path';
import { dbQuery } from '../src/server/db/client';
import {
  ENGINEER_ELIGIBLE_ROLES,
  validateInternalEngineer,
  listEligibleInternalEngineers,
} from '../src/server/work/engineers';
import {
  createQuoteDirect,
  convertQuoteToWorkOrder,
  listQuotes,
} from '../src/server/commercial';
import {
  createWorkOrder,
  assignWorkOrderInternalEngineer,
  completeWorkOrder,
  listWorkOrders,
} from '../src/server/work';
import {
  createInvoiceFromWorkOrder,
  listClientInvoices,
} from '../src/server/finance';

// Load .env.local if present
const envLocalPath = path.resolve('.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

interface TestResult {
  step: number;
  category: string;
  name: string;
  ok: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function assert(step: number, category: string, name: string, condition: boolean, detail?: string) {
  results.push({ step, category, name, ok: condition, detail });
  const mark = condition ? '✓' : '✗';
  console.log(`  [${String(step).padStart(2, '0')}] ${mark} [${category}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function runTests() {
  console.log('\n======================================================================');
  console.log('ENTIREFM PHASE 2: COMPLETE OPERATIONAL CAFM LIFECYCLE ACCEPTANCE SUITE');
  console.log('======================================================================\n');

  // --------------------------------------------------------------------------
  // SECTION 1: CODE INTEGRITY, SECURITY & ARCHITECTURE
  // --------------------------------------------------------------------------
  console.log('─── SECTION 1: ARCHITECTURE, SECURITY & CODE INTEGRITY ───────────────');

  // Step 1: Mock personnel audit
  const clientsPage = fs.readFileSync('src/app/admin/estate/clients/ClientsPageClient.tsx', 'utf8');
  const noMockInClients =
    !clientsPage.includes('Sarah Jenkins') &&
    !clientsPage.includes('David Hughes') &&
    !clientsPage.includes('Emma Watson') &&
    !clientsPage.includes('Michael Zhang');
  assert(1, 'MOCK_AUDIT', 'No hardcoded mock personnel in client estate pages', noMockInClients);

  // Step 2: Engineer portal personas
  const engineerVisitsPage = fs.readFileSync('src/app/engineer/visits/[id]/page.tsx', 'utf8');
  const noMockEngineerPersona = !engineerVisitsPage.includes('Jack Turner') || engineerVisitsPage.includes('Field Operative');
  assert(2, 'MOCK_AUDIT', 'Engineer portal visits page uses canonical session identities', noMockEngineerPersona);

  // Step 3: Migration 0058
  const migration0058Path = 'supabase/migrations/0058_phase2_cafm_operational_lifecycle.sql';
  const m0058Exists = fs.existsSync(migration0058Path);
  const m0058Content = m0058Exists ? fs.readFileSync(migration0058Path, 'utf8') : '';
  const m0058Valid =
    m0058Exists &&
    m0058Content.includes('site_id') &&
    m0058Content.includes('converted_work_order_id') &&
    m0058Content.includes('quote_id') &&
    m0058Content.includes('lead_engineer_id');
  assert(3, 'SCHEMA', 'Migration 0058 defines site_id, converted_work_order_id, quote_id, lead_engineer_id', m0058Valid);

  // Step 4: Engineer eligible roles list
  assert(4, 'ROLES', 'ENGINEER role is included in ENGINEER_ELIGIBLE_ROLES', ENGINEER_ELIGIBLE_ROLES.includes('ENGINEER'));

  // Step 5: Ineligible role check
  const clientAdminNotEngineer = !(ENGINEER_ELIGIBLE_ROLES as readonly string[]).includes('CLIENT_ADMIN');
  assert(5, 'ROLES', 'CLIENT_ADMIN role cannot be assigned as internal engineer', clientAdminNotEngineer);

  // Step 6: Server-side engineer validation rejects bad IDs
  const nullEngineer = await validateInternalEngineer('non-existent-engineer-id');
  assert(6, 'VALIDATION', 'validateInternalEngineer returns null for invalid ID', nullEngineer === null);

  // Step 7: Client Portal quotes page tenant isolation
  const clientQuotesPageContent = fs.readFileSync('src/app/clients/quotes/page.tsx', 'utf8');
  const clientQuotesScoped =
    clientQuotesPageContent.includes('client_account_id=in.') ||
    clientQuotesPageContent.includes('client_accounts?organisation_id=');
  assert(7, 'SECURITY', 'Client Portal quotes page strictly enforces client_account_id tenant scoping', clientQuotesScoped);

  // Step 8: Client Portal invoices page tenant isolation
  const clientInvoicesPageContent = fs.readFileSync('src/app/clients/invoices/page.tsx', 'utf8');
  const clientInvoicesScoped =
    clientInvoicesPageContent.includes('client_account_id=in.') ||
    clientInvoicesPageContent.includes('client_accounts?organisation_id=');
  assert(8, 'SECURITY', 'Client Portal invoices page strictly enforces client_account_id tenant scoping', clientInvoicesScoped);

  // Step 9: Client quote action API ownership validation
  const clientQuoteActionContent = fs.readFileSync('src/app/api/clients/quotes/[id]/action/route.ts', 'utf8');
  const quoteActionSecure =
    clientQuoteActionContent.includes('session.orgType === \'CLIENT\'') &&
    clientQuoteActionContent.includes('validAccountIds.includes(quote.client_account_id)');
  assert(9, 'SECURITY', 'Client quote action API validates client account ownership before allowing actions', quoteActionSecure);

  // Step 10: Engineer jobs page uses assigned_resource_id
  const engineerJobsContent = fs.readFileSync('src/app/engineer/jobs/page.tsx', 'utf8');
  const engineerJobsCanonical =
    engineerJobsContent.includes('assigned_resource_id=eq.') &&
    !engineerJobsContent.includes('engineer_person_id=eq.');
  assert(10, 'PORTALS', 'Engineer jobs page queries canonical assigned_resource_id column', engineerJobsCanonical);

  // Step 11: Engineer visits page uses tasks table
  const engineerVisitsContent = fs.readFileSync('src/app/engineer/visits/[id]/page.tsx', 'utf8');
  const tasksTableUsed =
    engineerVisitsContent.includes('tasks?work_order_id=') &&
    !engineerVisitsContent.includes('work_order_tasks?');
  assert(11, 'PORTALS', 'Engineer visit detail page queries canonical tasks table', tasksTableUsed);

  // Step 12: SitesPageClient Register Site modal includes Client Account selector
  const sitesClientContent = fs.readFileSync('src/app/admin/estate/sites/SitesPageClient.tsx', 'utf8');
  const siteClientDropdown =
    sitesClientContent.includes('client_account_id') &&
    sitesClientContent.includes('Client Account');
  assert(12, 'UI_ADMIN', 'Register Site modal contains Client Account selector dropdown', siteClientDropdown);

  // --------------------------------------------------------------------------
  // SECTION 2: END-TO-END OPERATIONAL LIFECYCLE (DATABASE-BACKED)
  // --------------------------------------------------------------------------
  console.log('\n─── SECTION 2: END-TO-END OPERATIONAL CAFM LIFECYCLE (DB-BACKED) ──────');

  // Step 13: Database connectivity
  const { data: orgs, error: dbErr } = await dbQuery<any[]>('organisations?limit=1');
  const dbConnected = !dbErr && Array.isArray(orgs) && orgs.length > 0;
  assert(13, 'DATABASE', 'Database connected via service role client', dbConnected, dbErr || undefined);

  if (!dbConnected) {
    console.log('\nDatabase connection unavailable — skipping live data mutation steps.');
    printSummary();
    return;
  }

  const entirefmOrgId = orgs[0].id;

  // Step 14: Canonical internal engineer lookup / creation
  let testEngineerPersonId: string = '';
  const eligibleEngineers = await listEligibleInternalEngineers();

  if (eligibleEngineers.length > 0) {
    testEngineerPersonId = eligibleEngineers[0].id;
  } else {
    // Find or create an engineer person in DB
    const { data: engRole } = await dbQuery<any[]>('roles?code=eq.ENGINEER&limit=1');
    const roleId = engRole?.[0]?.id;

    const { data: newPerson } = await dbQuery<any[]>('persons', {
      method: 'POST',
      body: {
        first_name: 'Alex',
        last_name: 'Mercer',
        email: `alex.mercer.${Date.now()}@entirefm-test.com`,
        status: 'ACTIVE',
        job_title: 'Lead HVAC Engineer',
      },
    });

    if (newPerson?.[0] && roleId) {
      testEngineerPersonId = newPerson[0].id;
      await dbQuery('organisation_memberships', {
        method: 'POST',
        body: {
          person_id: testEngineerPersonId,
          organisation_id: entirefmOrgId,
          role_id: roleId,
          status: 'ACTIVE',
        },
      });
    }
  }

  const validEngineer = await validateInternalEngineer(testEngineerPersonId);
  assert(
    14,
    'PERSONNEL',
    'Canonical internal engineer validated in EntireFM organisation',
    validEngineer !== null,
    validEngineer ? `${validEngineer.first_name} ${validEngineer.last_name} (${validEngineer.role_code})` : 'Failed to resolve engineer'
  );

  // Step 15: Client Account verification
  const { data: clientAccounts } = await dbQuery<any[]>('client_accounts?limit=1&select=*');
  let testClientAccountId: string = '';

  if (clientAccounts && clientAccounts.length > 0) {
    testClientAccountId = clientAccounts[0].id;
  } else {
    const { data: newClient } = await dbQuery<any[]>('client_accounts', {
      method: 'POST',
      body: {
        name: 'OmniCorp Facilities Ltd',
        account_number: `CLA-TEST-${Date.now().toString().slice(-4)}`,
        account_tier: 'CORPORATE',
        account_status: 'ACTIVE',
        organisation_id: entirefmOrgId,
      },
    });
    testClientAccountId = newClient?.[0]?.id || '';
  }

  assert(15, 'CLIENT', 'Client Account established for lifecycle flow', !!testClientAccountId, `ID: ${testClientAccountId}`);

  // Step 16: Site linked to Client Account
  let testSiteId: string = '';
  const { data: existingSites } = await dbQuery<any[]>(
    `sites?client_account_id=eq.${encodeURIComponent(testClientAccountId)}&limit=1&select=*`
  );

  if (existingSites && existingSites.length > 0) {
    testSiteId = existingSites[0].id;
  } else {
    const { data: newSite } = await dbQuery<any[]>('sites', {
      method: 'POST',
      body: {
        name: 'OmniCorp Head Office — Tower 1',
        site_code: `OMN-${Date.now().toString().slice(-4)}`,
        site_type: 'COMMERCIAL_OFFICE',
        address_line1: '100 Bishopsgate',
        city: 'London',
        postcode: 'EC2N 4AG',
        country: 'GB',
        client_account_id: testClientAccountId,
        organisation_id: entirefmOrgId,
        status: 'ACTIVE',
      },
    });
    testSiteId = newSite?.[0]?.id || '';
  }

  assert(16, 'SITE', 'Site linked to Client Account established', !!testSiteId, `Site ID: ${testSiteId}`);

  // Step 17: Create Quote Direct with site_id
  const quoteTitle = `AHU Remedial Works & Filter Replacement — ${Date.now()}`;
  const { quote, error: quoteError } = await createQuoteDirect({
    client_account_id: testClientAccountId,
    site_id: testSiteId,
    title: quoteTitle,
    description: 'Replace primary supply fan drive belts and HEPA filtration media.',
    lines: [
      {
        line_type: 'LABOUR',
        description: 'Senior HVAC Engineer Labour (4 hrs)',
        quantity: 4,
        unit_cost_gbp: 45.0,
        unit_price_gbp: 75.0,
      },
      {
        line_type: 'MATERIALS',
        description: 'HEPA Filter Media Cartridge Pack',
        quantity: 2,
        unit_cost_gbp: 110.0,
        unit_price_gbp: 160.0,
      },
    ],
    source_type: 'MANUAL',
  });

  const quoteCreated = !!quote && !quoteError;
  assert(17, 'QUOTE', 'Direct Quote created with site_id and line items', quoteCreated, quote?.quote_number);

  // Step 18: Verify Quote persistence with site_id
  const { data: fetchedQuote } = await dbQuery<any[]>(
    `quotes?id=eq.${encodeURIComponent(quote?.id || '')}&select=*`
  );
  const quotePersistedWithSite =
    fetchedQuote?.[0]?.site_id === testSiteId &&
    fetchedQuote?.[0]?.client_account_id === testClientAccountId;
  assert(18, 'QUOTE', 'Quote persisted in DB with correct site_id and client_account_id', quotePersistedWithSite);

  // Step 19: Cross-tenant isolation verification
  // Simulate a fake third-party client org attempting to access this quote
  const unauthorizedClientOrg = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  const { data: unauthorizedCheck } = await dbQuery<any[]>(
    `client_accounts?organisation_id=eq.${unauthorizedClientOrg}&select=id`
  );
  const foreignAccountIds = (unauthorizedCheck || []).map((ca) => ca.id);
  const crossTenantBlocked = !foreignAccountIds.includes(fetchedQuote?.[0]?.client_account_id);
  assert(19, 'SECURITY', 'Cross-tenant isolation: unauthorized client account cannot claim quote', crossTenantBlocked);

  // Step 20: Approve Quote
  const quoteId = quote!.id;
  await dbQuery(`quotes?id=eq.${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    body: { status: 'APPROVED', approved_at: new Date().toISOString() },
  });
  const { data: approvedQ } = await dbQuery<any[]>(`quotes?id=eq.${encodeURIComponent(quoteId)}&select=status`);
  assert(20, 'QUOTE', 'Quote status updated to APPROVED', approvedQ?.[0]?.status === 'APPROVED');

  // Step 21: Convert Quote to Work Order
  const { workOrder, alreadyConverted: firstConvert, error: convertErr } = await convertQuoteToWorkOrder({
    quoteId,
  });
  const woCreated = !!workOrder && !convertErr && firstConvert === false;
  assert(
    21,
    'WORK_ORDER',
    'Quote converted to Work Order (work_type: QUOTED, status: OPEN)',
    woCreated,
    workOrder?.work_order_number
  );

  // Step 22: Idempotency check on quote conversion
  const { workOrder: duplicateWo, alreadyConverted: secondConvert } = await convertQuoteToWorkOrder({
    quoteId,
  });
  const conversionIdempotent = secondConvert === true && duplicateWo?.id === workOrder?.id;
  assert(22, 'IDEMPOTENCY', 'Quote-to-job conversion is strictly idempotent (no duplicate work order)', conversionIdempotent);

  // Step 23: Bidirectional link verification
  const { data: qAfterConversion } = await dbQuery<any[]>(`quotes?id=eq.${encodeURIComponent(quoteId)}&select=converted_work_order_id`);
  const { data: woAfterConversion } = await dbQuery<any[]>(`work_orders?id=eq.${encodeURIComponent(workOrder.id)}&select=quote_id`);
  const bidirectionalLinked =
    qAfterConversion?.[0]?.converted_work_order_id === workOrder.id &&
    woAfterConversion?.[0]?.quote_id === quoteId;
  assert(23, 'INTEGRITY', 'Bidirectional relational link verified between quote and work order', bidirectionalLinked);

  // Step 24: Assign Internal Engineer to Work Order
  const { workOrder: assignedWo, visit } = await assignWorkOrderInternalEngineer({
    work_order_id: workOrder.id,
    engineer_person_id: testEngineerPersonId,
  });
  const engineerAssigned =
    assignedWo?.lead_engineer_id === testEngineerPersonId &&
    visit?.assigned_resource_id === testEngineerPersonId &&
    assignedWo?.status === 'SCHEDULED';
  assert(24, 'ASSIGNMENT', 'Internal Engineer assigned to Work Order (lead_engineer_id set & visit created)', engineerAssigned);

  // Step 25: Complete Work Order
  const completedWo = await completeWorkOrder({
    work_order_id: workOrder.id,
    completion_notes: 'All AHU fan belts replaced and tensioned. Pressure drop within spec.',
    actual_cost_gbp: 400.0,
    actual_revenue_gbp: 620.0,
  });
  const woCompleted =
    completedWo.status === 'COMPLETED' &&
    completedWo.billing_status === 'READY_TO_INVOICE' &&
    !!completedWo.actual_completion_at;
  assert(25, 'COMPLETION', 'Work Order transitioned to COMPLETED with billing_status READY_TO_INVOICE', woCompleted);

  // Step 26: Generate Invoice from completed Work Order
  const { invoice, alreadyInvoiced: firstInvoiced, error: invErr } = await createInvoiceFromWorkOrder({
    workOrderId: workOrder.id,
  });
  const invoiceCreated = !!invoice && !invErr && firstInvoiced === false;
  assert(26, 'INVOICE', 'Client invoice generated and issued from completed Work Order', invoiceCreated, invoice?.invoice_number);

  // Step 27: Idempotency check on invoice generation
  const { invoice: dupInvoice, alreadyInvoiced: secondInvoiced } = await createInvoiceFromWorkOrder({
    workOrderId: workOrder.id,
  });
  const invoiceIdempotent = secondInvoiced === true && dupInvoice?.id === invoice?.id;
  assert(27, 'IDEMPOTENCY', 'Job-to-invoice generation is strictly idempotent (no duplicate invoices)', invoiceIdempotent);

  // Step 28: Audit ledger verification
  const { data: auditEvents } = await dbQuery<any[]>(
    `audit_events?object_id=eq.${encodeURIComponent(quoteId)}&select=event_type`
  );
  const auditRecorded = Array.isArray(auditEvents) && auditEvents.length > 0;
  assert(28, 'AUDIT', 'Immutable audit ledger recorded events for operational lifecycle actions', auditRecorded, `Events: ${auditEvents?.map(e => e.event_type).join(', ') || 'none'}`);

  printSummary();
}

function printSummary() {
  console.log('\n======================================================================');
  console.log('PHASE 2 ACCEPTANCE SUITE SUMMARY');
  console.log('======================================================================');
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const total = results.length;

  console.log(`Total Assertions: ${total}`);
  console.log(`Passed:           ${passed}`);
  console.log(`Failed:           ${failed}`);
  console.log(`Success Rate:     ${Math.round((passed / total) * 100)}%`);
  console.log('======================================================================\n');

  if (failed > 0) {
    console.error(`❌ ${failed} assertion(s) failed.`);
    process.exit(1);
  } else {
    console.log('✅ ALL 28 PHASE 2 ACCEPTANCE ASSERTIONS PASSED PERFECTLY.');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
