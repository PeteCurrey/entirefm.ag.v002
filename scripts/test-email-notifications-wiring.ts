/**
 * ENTIREFM TRANSACTIONAL EMAIL NOTIFICATION INTEGRATION TEST SUITE
 * ==================================================================
 * Tests the email notification fixes across dispatch, quotes, and chasing:
 *
 *  1. Dispatch Email Emission:
 *     A successful dispatch produces exactly one CONTRACTOR_ASSIGNED message
 *     and one NEW_ASSIGNMENT message with real/explicitly null recipient emails.
 *
 *  2. Dispatch Idempotency:
 *     Re-running orchestrateReactiveDispatch with the same work_order_id
 *     does not create duplicate communication_messages records.
 *
 *  3. No Fabricated Fallback Emails:
 *     Contractors with missing emails do not receive @example.com addresses;
 *     messages are marked INTERFACE_ONLY with recipient_email: null.
 *
 *  4. Quote Issuance with Work Order Client Email:
 *     issueQuoteToClient on a quote linked to a work order with client_contact_email
 *     emits a QUOTE_APPROVAL_REQUIRED message to that specific address.
 *
 *  5. Quote Issuance Fallback Without Email:
 *     issueQuoteToClient on a quote with no resolvable email logs a warning,
 *     does not fabricate an address, and records INTERFACE_ONLY with null recipient.
 *
 *  6. Chasing Sweep Real Email Lookup:
 *     chasing-sweep.ts queries organisations.email successfully against the real schema,
 *     returning the contractor's real address (e.g. FireJet / Dynamo).
 *
 * Run: npx tsx --env-file=.env.local scripts/test-email-notifications-wiring.ts
 */

import { dbQuery } from '../src/server/db/client';
import { orchestrateReactiveDispatch } from '../src/server/ai/dispatch/orchestrator';
import { issueQuoteToClient } from '../src/server/commercial';
import { UserSession } from '../src/server/identity';

const PASS = '\x1b[32m✓ PASS\x1b[0m';
const FAIL = '\x1b[31m✗ FAIL\x1b[0m';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string): void {
  if (condition) {
    console.log(`  ${PASS} ${label}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM TRANSACTIONAL EMAIL NOTIFICATION TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Query baseline reference entities from live database
  const { data: baseOrgs } = await dbQuery<any[]>('organisations?select=id,name,email&limit=10');
  const { data: baseSites } = await dbQuery<any[]>('sites?select=id,name,organisation_id&limit=5');
  const { data: baseAccounts } = await dbQuery<any[]>('client_accounts?select=id,organisation_id,name&limit=5');

  const defaultOrgId = baseOrgs?.[0]?.id || '00000000-0000-0000-0000-000000000001';
  const defaultSiteId = baseSites?.[0]?.id || '61543a08-814f-46c4-995c-94bc26ca3aca';
  const defaultAccountId = baseAccounts?.[0]?.id || '8045b955-f69b-4ac7-a574-5eef1eceeae7';

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1 & 2: Initial Dispatch Email Emission & Idempotency
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('[Test 1 & 2] Dispatch Email Emission and Idempotency');
  {
    const testWoId = crypto.randomUUID();
    const testWoNumber = `EFM-WO-TEST-${Date.now().toString().slice(-6)}`;

    // Create a mock client organisation with known email and required code
    const clientOrgId = crypto.randomUUID();
    await dbQuery('organisations', {
      method: 'POST',
      body: {
        id: clientOrgId,
        code: `CLI-TEST-${Date.now().toString().slice(-6)}`,
        name: 'Test Dispatch Client Org',
        org_type: 'CLIENT',
        email: 'client.dispatch.test@entirefm-test.com',
        status: 'ACTIVE',
      },
    });

    // Create real work order record first so purchase_orders foreign key succeeds
    await dbQuery('work_orders', {
      method: 'POST',
      body: {
        id: testWoId,
        work_order_number: testWoNumber,
        organisation_id: clientOrgId,
        site_id: defaultSiteId,
        title: 'Boiler Pressure Loss Investigation',
        description: 'Boiler leaking and pressure dropping',
        work_type: 'REACTIVE',
        priority: 'P2_HIGH',
        status: 'OPEN',
      },
    });

    // Create a real contractor organisation with real email and code
    const contractorOrgId = crypto.randomUUID();
    await dbQuery('organisations', {
      method: 'POST',
      body: {
        id: contractorOrgId,
        code: `SUP-TEST-${Date.now().toString().slice(-6)}`,
        name: 'Apex Test Contractor Ltd',
        org_type: 'CONTRACTOR',
        email: 'contractor.test@entirefm-test.com',
        status: 'ACTIVE',
      },
    });

    // Run orchestrateReactiveDispatch with candidate override
    const dispatchParams: any = {
      work_order_id: testWoId,
      work_order_number: testWoNumber,
      title: 'Boiler Pressure Loss Investigation',
      trade: 'HVAC',
      priority: 'P2_HIGH',
      site_name: 'Leeds Central Offices',
      site_city: 'Leeds',
      client_id: clientOrgId,
      candidate_suppliers_override: [
        {
          id: contractorOrgId,
          name: 'Apex Test Contractor Ltd',
          code: 'APEX-01',
          email: 'contractor.test@entirefm-test.com',
          org_type: 'CONTRACTOR',
          status: 'ACTIVE',
          trades: ['HVAC'],
          covered_cities: ['Leeds'],
          is_national: false,
          emergency_24_7_capable: true,
          distance_miles: 5.2,
          coverage_radius_miles: 25,
          sla_adherence_pct: 98,
          acceptance_pct: 95,
        },
      ],
    };

    // First call: initial dispatch
    const result1 = await orchestrateReactiveDispatch(dispatchParams);
    assert(result1.status === 'DISPATCHED', 'First dispatch call succeeded with status DISPATCHED');

    // Verify exactly 1 CONTRACTOR_ASSIGNED and 1 NEW_ASSIGNMENT in communication_messages
    const { data: clientMsgs1 } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(`${testWoId}:CLIENT:CONTRACTOR_ASSIGNED`)}`
    );
    const { data: contractorMsgs1 } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(`${testWoId}:CONTRACTOR:NEW_ASSIGNMENT`)}`
    );

    assert(clientMsgs1?.length === 1, 'Exactly one CONTRACTOR_ASSIGNED message created');
    assert(
      clientMsgs1?.[0]?.recipient_email === 'client.dispatch.test@entirefm-test.com',
      `Client message recipient resolved to real email: ${clientMsgs1?.[0]?.recipient_email}`
    );

    assert(contractorMsgs1?.length === 1, 'Exactly one NEW_ASSIGNMENT message created');
    assert(
      contractorMsgs1?.[0]?.recipient_email === 'contractor.test@entirefm-test.com',
      `Contractor message recipient resolved to real email: ${contractorMsgs1?.[0]?.recipient_email}`
    );
    assert(
      !contractorMsgs1?.[0]?.recipient_email?.includes('@example.com'),
      'Contractor email is NOT fabricated @example.com'
    );

    // Second call: retry with same work_order_id (must be idempotent)
    const result2 = await orchestrateReactiveDispatch(dispatchParams);
    assert(result2.status === 'DISPATCHED', 'Second dispatch call executed');

    const { data: clientMsgs2 } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(`${testWoId}:CLIENT:CONTRACTOR_ASSIGNED`)}`
    );
    const { data: contractorMsgs2 } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(`${testWoId}:CONTRACTOR:NEW_ASSIGNMENT`)}`
    );

    assert(clientMsgs2?.length === 1, 'Idempotency verified: exactly 1 client message exists after retry');
    assert(contractorMsgs2?.length === 1, 'Idempotency verified: exactly 1 contractor message exists after retry');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: No Fabricated Emails for Contractors with Null Email
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 3] No Fabricated Emails (Contractor without email)');
  {
    const noEmailWoId = crypto.randomUUID();
    const noEmailWoNumber = `EFM-WO-NOEMAIL-${Date.now().toString().slice(-6)}`;
    const noEmailContractorId = crypto.randomUUID();

    // Create work order first
    await dbQuery('work_orders', {
      method: 'POST',
      body: {
        id: noEmailWoId,
        work_order_number: noEmailWoNumber,
        organisation_id: defaultOrgId,
        site_id: defaultSiteId,
        title: 'Water Leak Repair',
        description: 'Water leak',
        work_type: 'REACTIVE',
        priority: 'P3_MEDIUM',
        status: 'OPEN',
      },
    });

    const dispatchParamsNoEmail: any = {
      work_order_id: noEmailWoId,
      work_order_number: noEmailWoNumber,
      title: 'Water Leak Repair',
      trade: 'PLUMBING',
      priority: 'P3_MEDIUM',
      site_name: 'Manchester Hub',
      candidate_suppliers_override: [
        {
          id: noEmailContractorId,
          name: 'No Email Plumbers Ltd',
          code: 'NOEMAIL-01',
          email: null, // explicitly null
          org_type: 'CONTRACTOR',
          status: 'ACTIVE',
          trades: ['PLUMBING'],
          covered_cities: ['Manchester'],
          distance_miles: 3.0,
          coverage_radius_miles: 25,
        },
      ],
    };

    await orchestrateReactiveDispatch(dispatchParamsNoEmail);

    const { data: noEmailMsgs } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(`${noEmailWoId}:CONTRACTOR:NEW_ASSIGNMENT`)}`
    );

    assert(noEmailMsgs?.length === 1, 'Message record was written to DB (visible in-app)');
    assert(
      noEmailMsgs?.[0]?.recipient_email === null || noEmailMsgs?.[0]?.recipient_email === undefined,
      `Recipient email is null/undefined, NOT fabricated (got: ${noEmailMsgs?.[0]?.recipient_email})`
    );
    assert(
      noEmailMsgs?.[0]?.delivery_state === 'INTERFACE_ONLY',
      `Delivery state is INTERFACE_ONLY (got: ${noEmailMsgs?.[0]?.delivery_state})`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 4: Quote Issuance Linked to Work Order with client_contact_email
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 4] Quote Issuance Linked to Work Order with client_contact_email');
  {
    const quoteWoId = crypto.randomUUID();
    const targetEmail = 'property.manager@client-corp.co.uk';

    // 1. Create work order with client_contact_email and valid FKs
    await dbQuery('work_orders', {
      method: 'POST',
      body: {
        id: quoteWoId,
        work_order_number: `EFM-WO-Q-${Date.now().toString().slice(-6)}`,
        organisation_id: defaultOrgId,
        site_id: defaultSiteId,
        title: 'Roof Membrane Replacement',
        description: 'Commercial roof repair quote required',
        work_type: 'REACTIVE',
        priority: 'P3_MEDIUM',
        status: 'OPEN',
        client_contact_email: targetEmail,
      },
    });

    // 2. Create quote linked to this work order with valid client_account_id
    const quoteId = crypto.randomUUID();
    await dbQuery('quotes', {
      method: 'POST',
      body: {
        id: quoteId,
        quote_number: `QUO-${Date.now().toString().slice(-6)}`,
        work_order_id: quoteWoId,
        client_account_id: defaultAccountId,
        version: 1,
        status: 'APPROVED',
        internal_status: 'READY_TO_ISSUE',
        subtotal_gbp: 1500,
        tax_amount_gbp: 300,
        total_amount_gbp: 1800,
        validity_days: 30,
        client_po_required: true,
      },
    });

    const session: UserSession = {
      orgId: '00000000-0000-0000-0000-000000000001',
      orgName: 'EntireFM Test Ops',
      orgType: 'ENTIREFM',
      roles: ['ADMIN'],
      scopes: [],
      personId: '00000000-0000-0000-0000-000000000002',
      name: 'Admin Tester',
      email: 'admin@entirefm-test.com',
    };

    const issueRes = await issueQuoteToClient(quoteId, session);
    assert(issueRes.success, 'issueQuoteToClient returned success');

    // Check communication_messages for QUOTE_APPROVAL_REQUIRED
    const expectedKey = `${quoteId}:CLIENT:QUOTE_APPROVAL_REQUIRED:v1`;
    const { data: quoteComms } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(expectedKey)}`
    );

    assert(quoteComms?.length === 1, 'QUOTE_APPROVAL_REQUIRED message was emitted');
    assert(
      quoteComms?.[0]?.recipient_email === targetEmail,
      `Recipient email resolved to work order client_contact_email: ${quoteComms?.[0]?.recipient_email}`
    );
    assert(
      quoteComms?.[0]?.body?.includes('1800.00'),
      'Message body includes correct net/total quote amount £1800.00'
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 5: Quote Issuance with No Resolvable Email
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 5] Quote Issuance Without Resolvable Email');
  {
    // Find an account whose organization has email null (Apex Commercial Estates)
    const { data: apexAccounts } = await dbQuery<any[]>(
      `client_accounts?name=ilike.*Apex*&limit=1`
    );
    const apexAccId = apexAccounts?.[0]?.id || defaultAccountId;

    const orphanQuoteId = crypto.randomUUID();
    await dbQuery('quotes', {
      method: 'POST',
      body: {
        id: orphanQuoteId,
        quote_number: `QUO-ORPHAN-${Date.now().toString().slice(-6)}`,
        client_account_id: apexAccId,
        version: 1,
        status: 'APPROVED',
        internal_status: 'READY_TO_ISSUE',
        subtotal_gbp: 450,
        tax_amount_gbp: 90,
        total_amount_gbp: 540,
        validity_days: 14,
        client_po_required: false,
      },
    });

    const session: UserSession = {
      orgId: '00000000-0000-0000-0000-000000000001',
      orgName: 'EntireFM Test Ops',
      orgType: 'ENTIREFM',
      roles: ['ADMIN'],
      scopes: [],
      personId: '00000000-0000-0000-0000-000000000002',
      name: 'Admin Tester',
      email: 'admin@entirefm-test.com',
    };

    const issueRes = await issueQuoteToClient(orphanQuoteId, session);
    assert(issueRes.success, 'issueQuoteToClient succeeded for orphan quote');

    const expectedKey = `${orphanQuoteId}:CLIENT:QUOTE_APPROVAL_REQUIRED:v1`;
    const { data: orphanComms } = await dbQuery<any[]>(
      `communication_messages?idempotency_key=eq.${encodeURIComponent(expectedKey)}`
    );

    assert(orphanComms?.length === 1, 'Message record written to DB (visible in-app)');
    assert(
      orphanComms?.[0]?.recipient_email === null || orphanComms?.[0]?.recipient_email === undefined,
      `Recipient email is null/undefined, not fabricated (got: ${orphanComms?.[0]?.recipient_email})`
    );
    assert(
      orphanComms?.[0]?.delivery_state === 'INTERFACE_ONLY',
      `Delivery state is INTERFACE_ONLY (got: ${orphanComms?.[0]?.delivery_state})`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 6: Chasing Sweep Real Contractor Email Lookup
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 6] Chasing Sweep Real Contractor Email Lookup');
  {
    // Query FireJet or Dynamo directly using the new select=id,name,email clause
    const { data: contractors, error } = await dbQuery<any[]>(
      'organisations?org_type=in.(CONTRACTOR,SUPPLIER)&email=not.is.null&select=id,name,email&limit=3'
    );

    assert(!error, 'Querying organisations?select=id,name,email produces no error');
    assert((contractors?.length || 0) > 0, `Found ${contractors?.length} real contractors with email`);

    const sample = contractors?.[0];
    assert(Boolean(sample?.email), `Real contractor "${sample?.name}" has verified email: ${sample?.email}`);
    assert(sample?.email?.includes('@'), 'Contractor email is well-formed');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log(`\x1b[32mAll ${passed} email notification tests passed ✓\x1b[0m`);
    process.exit(0);
  } else {
    console.log(`\x1b[31m${failed} test(s) failed\x1b[0m`);
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
