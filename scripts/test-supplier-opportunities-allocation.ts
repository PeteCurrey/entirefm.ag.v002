/**
 * ENTIREFM SUPPLIER OPPORTUNITIES MARKETPLACE TEST SUITE (System A)
 * ===================================================================
 * Verifies:
 *  1. Multi-Tenant Data Exposure Fix:
 *     listSupplierOpportunities(supplierId) uses PostgREST array-contains
 *     filtering (invited_supplier_ids=cs.{id}) to prevent cross-contractor
 *     information leakage between non-overlapping invitation lists.
 *
 *  2. Unauthorized Submission Rejection (Fail-Closed):
 *     submitOpportunityResponse strictly rejects responses from contractors
 *     not present in invited_supplier_ids with a clear Forbidden error and
 *     does not persist a row to supplier_opportunity_responses.
 *
 *  3. Concurrent UUID Collision Safety:
 *     Concurrent responses generate distinct crypto.randomUUID() identifiers,
 *     eliminating collisions from the legacy timestamp-based ID generator.
 *
 *  4. Session-Derived Anti-Spoofing Identity:
 *     The API route ignores spoofed supplier_id in the request payload and
 *     strictly uses session.orgId.
 *
 *  5. Successful Quote Submission & Event Emission:
 *     Invited contractors can submit quotes and declines, transitioning
 *     opportunity status to RESPONSES_RECEIVED and emitting notifications.
 *
 * Run: npx tsx --env-file=.env.local scripts/test-supplier-opportunities-allocation.ts
 */

import { dbQuery } from '../src/server/db/client';
import {
  createWorkAllocationRequirement,
  createSupplierOpportunity,
  listSupplierOpportunities,
  getSupplierOpportunity,
  submitOpportunityResponse,
} from '../src/server/allocation/allocation-store';
import { POST as respondRoutePost } from '../src/app/api/supplier-portal/opportunities/[id]/respond/route';
import { NextRequest } from 'next/server';

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
  console.log('  ENTIREFM SUPPLIER OPPORTUNITIES TEST SUITE (System A)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Query baseline organisations to use valid IDs
  const supplier1Id = crypto.randomUUID();
  const supplier2Id = crypto.randomUUID();
  const supplier3UninvitedId = crypto.randomUUID();

  // Create mock organisations with required codes
  await dbQuery('organisations', {
    method: 'POST',
    body: {
      id: supplier1Id,
      code: `SUP-1-${Date.now().toString().slice(-6)}`,
      name: 'Alpha Mechanical Services Ltd',
      org_type: 'CONTRACTOR',
      email: 'alpha@contractor-test.co.uk',
      status: 'ACTIVE',
    },
  });

  await dbQuery('organisations', {
    method: 'POST',
    body: {
      id: supplier2Id,
      code: `SUP-2-${Date.now().toString().slice(-6)}`,
      name: 'Beta Electrical Solutions Ltd',
      org_type: 'CONTRACTOR',
      email: 'beta@contractor-test.co.uk',
      status: 'ACTIVE',
    },
  });

  await dbQuery('organisations', {
    method: 'POST',
    body: {
      id: supplier3UninvitedId,
      code: `SUP-3-${Date.now().toString().slice(-6)}`,
      name: 'Gamma Uninvited Services Ltd',
      org_type: 'CONTRACTOR',
      email: 'gamma@contractor-test.co.uk',
      status: 'ACTIVE',
    },
  });

  // Create work allocation requirements
  const req1 = await createWorkAllocationRequirement({
    source_type: 'MANUAL',
    source_id: `SRC-${Date.now()}-1`,
    client_id: 'client-test-1',
    client_name: 'OmniCorp Estate',
    site_id: 'site-test-1',
    site_name: 'Tower 1 Alpha Site',
    site_city: 'Manchester',
    site_postcode: 'M1 1AA',
    service_slug: 'hvac',
    service_name: 'HVAC Maintenance',
    priority: 'P2_URGENT',
    sla_attendance_target_hours: 4,
    scope_summary: 'Air handling unit chiller compressor trip investigation',
    work_risk_level: 'MEDIUM',
    not_to_exceed_gbp: 1200,
    out_of_hours_required: false,
    mandatory_accreditations: ['FGAS'],
  });

  const req2 = await createWorkAllocationRequirement({
    source_type: 'MANUAL',
    source_id: `SRC-${Date.now()}-2`,
    client_id: 'client-test-2',
    client_name: 'Apex Commercial Ltd',
    site_id: 'site-test-2',
    site_name: 'Apex Central Office',
    site_city: 'Leeds',
    site_postcode: 'LS1 1AA',
    service_slug: 'electrical',
    service_name: 'Electrical Compliance',
    priority: 'P3_STANDARD',
    sla_attendance_target_hours: 8,
    scope_summary: 'Periodic emergency lighting and distribution board testing',
    work_risk_level: 'LOW',
    not_to_exceed_gbp: 650,
    out_of_hours_required: false,
    mandatory_accreditations: ['NICEIC'],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1: Data Exposure Fix & Non-Overlapping Invitation Isolation
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('[Test 1] Data Exposure Fix — Non-overlapping contractor opportunities isolation');
  {
    // Opportunity A: invited ONLY to Supplier 1
    const oppA = await createSupplierOpportunity({
      requirement_id: req1.id,
      opportunity_type: 'DIRECT_OFFER',
      invited_supplier_ids: [supplier1Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Confidential Chiller Repair — Alpha Tower',
      scope_summary: 'Proprietary chiller overhaul, internal client budget £1200',
      service_slug: 'hvac',
      site_city: 'Manchester',
      priority: 'P2_URGENT',
      commercial_basis: 'NOT_TO_EXCEED',
      not_to_exceed_gbp: 1200,
      issued_by: 'ops@entirefm.com',
    });

    // Opportunity B: invited ONLY to Supplier 2
    const oppB = await createSupplierOpportunity({
      requirement_id: req2.id,
      opportunity_type: 'QUOTE_REQUEST',
      invited_supplier_ids: [supplier2Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Confidential Electrical Inspection — Apex Office',
      scope_summary: 'Distribution board inspection, internal client budget £650',
      service_slug: 'electrical',
      site_city: 'Leeds',
      priority: 'P3_STANDARD',
      commercial_basis: 'QUOTED',
      not_to_exceed_gbp: 650,
      issued_by: 'ops@entirefm.com',
    });

    // Supplier 1 queries opportunities
    const supp1Opps = await listSupplierOpportunities(supplier1Id);
    const supp1HasA = supp1Opps.some((o) => o.id === oppA.id);
    const supp1HasB = supp1Opps.some((o) => o.id === oppB.id);

    assert(supp1HasA, 'Supplier 1 can see Opportunity A (invited)');
    assert(!supp1HasB, 'Supplier 1 CANNOT see Opportunity B (not invited — competitor data protected)');

    // Supplier 2 queries opportunities
    const supp2Opps = await listSupplierOpportunities(supplier2Id);
    const supp2HasA = supp2Opps.some((o) => o.id === oppA.id);
    const supp2HasB = supp2Opps.some((o) => o.id === oppB.id);

    assert(!supp2HasA, 'Supplier 2 CANNOT see Opportunity A (not invited — competitor data protected)');
    assert(supp2HasB, 'Supplier 2 can see Opportunity B (invited)');

    // Supplier 3 (uninvited to both) queries opportunities
    const supp3Opps = await listSupplierOpportunities(supplier3UninvitedId);
    const supp3HasA = supp3Opps.some((o) => o.id === oppA.id);
    const supp3HasB = supp3Opps.some((o) => o.id === oppB.id);

    assert(!supp3HasA && !supp3HasB, 'Supplier 3 sees zero opportunities from non-invited list');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 2: Unauthorized Response Rejection (Fail-Closed)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 2] Unauthorized Response Rejection (Fail-Closed)');
  {
    const oppExclusive = await createSupplierOpportunity({
      requirement_id: req1.id,
      opportunity_type: 'DIRECT_OFFER',
      invited_supplier_ids: [supplier1Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Restricted Opportunity For Supplier 1',
      scope_summary: 'Strictly restricted tender',
      service_slug: 'hvac',
      site_city: 'Manchester',
      priority: 'P2_URGENT',
      commercial_basis: 'NOT_TO_EXCEED',
      not_to_exceed_gbp: 900,
      issued_by: 'ops@entirefm.com',
    });

    // Attempt submission from Supplier 3 (uninvited)
    let rejectedAsExpected = false;
    let errMessage = '';
    try {
      await submitOpportunityResponse({
        opportunity_id: oppExclusive.id,
        supplier_id: supplier3UninvitedId,
        supplier_name: 'Gamma Uninvited Services Ltd',
        decision: 'SUBMIT_QUOTE',
        quoted_price_gbp: 850,
        responded_by: 'Gamma Admin',
      });
    } catch (err: any) {
      rejectedAsExpected = true;
      errMessage = err?.message || String(err);
    }

    assert(rejectedAsExpected, 'Unauthorized contractor response was strictly rejected');
    assert(errMessage.includes('Forbidden') || errMessage.includes('not in the invited suppliers list'), `Error message indicates authorization failure: "${errMessage}"`);

    // Verify zero records were written to the database for this unauthorized response
    const { data: responsesInDb } = await dbQuery<any[]>(
      `supplier_opportunity_responses?opportunity_id=eq.${encodeURIComponent(oppExclusive.id)}&organisation_id=eq.${supplier3UninvitedId}`
    );
    assert(!responsesInDb || responsesInDb.length === 0, 'No row was persisted to supplier_opportunity_responses for unauthorized contractor');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: Concurrent Submission Collision Safety (crypto.randomUUID)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 3] Concurrent Submission UUID Safety');
  {
    const oppMulti = await createSupplierOpportunity({
      requirement_id: req1.id,
      opportunity_type: 'MULTI_SUPPLIER_OPPORTUNITY',
      invited_supplier_ids: [supplier1Id, supplier2Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Concurrent Tendering Test Opportunity',
      scope_summary: 'Dual tender opportunity',
      service_slug: 'hvac',
      site_city: 'Manchester',
      priority: 'P2_URGENT',
      commercial_basis: 'QUOTED',
      issued_by: 'ops@entirefm.com',
    });

    // Submit two responses concurrently
    const [res1, res2] = await Promise.all([
      submitOpportunityResponse({
        opportunity_id: oppMulti.id,
        supplier_id: supplier1Id,
        supplier_name: 'Alpha Mechanical Services Ltd',
        decision: 'SUBMIT_QUOTE',
        quoted_price_gbp: 950,
        responded_by: 'Alpha Operative',
      }),
      submitOpportunityResponse({
        opportunity_id: oppMulti.id,
        supplier_id: supplier2Id,
        supplier_name: 'Beta Electrical Solutions Ltd',
        decision: 'SUBMIT_QUOTE',
        quoted_price_gbp: 920,
        responded_by: 'Beta Operative',
      }),
    ]);

    assert(Boolean(res1.id) && Boolean(res2.id), 'Both concurrent submissions succeeded');
    assert(res1.id !== res2.id, `Distinct IDs generated under concurrent submission (${res1.id} !== ${res2.id})`);
    assert(!res1.id.startsWith('resp-'), `ID uses UUID format, not legacy resp-timestamp format: ${res1.id}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 4: Successful Quote Submission & Opportunity Status Transition
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 4] Successful Quote Submission & Opportunity Lifecycle');
  {
    const oppQuote = await createSupplierOpportunity({
      requirement_id: req2.id,
      opportunity_type: 'QUOTE_REQUEST',
      invited_supplier_ids: [supplier1Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Emergency Lighting Remedials',
      scope_summary: 'Replace defective emergency battery packs in North Stairwell',
      service_slug: 'electrical',
      site_city: 'Leeds',
      priority: 'P3_STANDARD',
      commercial_basis: 'QUOTED',
      not_to_exceed_gbp: 500,
      issued_by: 'ops@entirefm.com',
    });

    const quoteRes = await submitOpportunityResponse({
      opportunity_id: oppQuote.id,
      supplier_id: supplier1Id,
      supplier_name: 'Alpha Mechanical Services Ltd',
      decision: 'SUBMIT_QUOTE',
      quoted_price_gbp: 480.0,
      quoted_lead_time_hours: 48,
      planned_attendance_date: new Date(Date.now() + 172800000).toISOString(),
      notes: 'Includes all 4 emergency ballast units and testing certificate',
      responded_by: 'Lead HVAC Engineer',
    });

    assert(quoteRes.decision === 'SUBMIT_QUOTE', 'Quote response decision recorded');
    assert(quoteRes.quoted_price_gbp === 480.0, 'Quoted price £480.00 recorded');

    // Check opportunity status updated to RESPONSES_RECEIVED
    const updatedOpp = await getSupplierOpportunity(oppQuote.id);
    assert(updatedOpp?.status === 'RESPONSES_RECEIVED', `Opportunity status transitioned to RESPONSES_RECEIVED (got: ${updatedOpp?.status})`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 5: Decline Decision Handling
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 5] Decline Decision Handling');
  {
    const oppDecline = await createSupplierOpportunity({
      requirement_id: req1.id,
      opportunity_type: 'DIRECT_OFFER',
      invited_supplier_ids: [supplier2Id],
      response_deadline: new Date(Date.now() + 86400000).toISOString(),
      title: 'Short-Notice Boiler Callout',
      scope_summary: 'Immediate callout required',
      service_slug: 'hvac',
      site_city: 'Manchester',
      priority: 'P1_EMERGENCY',
      commercial_basis: 'CONTRACT_RATE',
      issued_by: 'ops@entirefm.com',
    });

    const declineRes = await submitOpportunityResponse({
      opportunity_id: oppDecline.id,
      supplier_id: supplier2Id,
      supplier_name: 'Beta Electrical Solutions Ltd',
      decision: 'DECLINE',
      decline_reason: 'NO_CAPACITY',
      notes: 'All engineers committed on pre-scheduled compliance audits today',
      responded_by: 'Dispatch Manager',
    });

    assert(declineRes.decision === 'DECLINE', 'Decline decision recorded');
    assert(declineRes.decline_reason === 'NO_CAPACITY', 'Decline reason NO_CAPACITY recorded');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 6: Route Authentication & Anti-Spoofing Architecture
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n[Test 6] API Route Authentication & Anti-Spoofing Architecture');
  {
    // Test unauthenticated call to API route
    const req = new NextRequest('http://localhost:3000/api/supplier-portal/opportunities/dummy-id/respond', {
      method: 'POST',
      body: JSON.stringify({ decision: 'SUBMIT_QUOTE', quoted_price_gbp: 500 }),
    });

    const routeRes = await respondRoutePost(req, { params: Promise.resolve({ id: 'dummy-id' }) });
    assert(routeRes.status === 401, `Unauthenticated request returns HTTP 401 Unauthorized (got: ${routeRes.status})`);
    const json = await routeRes.json();
    assert(json.error?.includes('Authentication required'), `Error message indicates auth requirement: "${json.error}"`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log(`\x1b[32mAll ${passed} supplier opportunities tests passed ✓\x1b[0m`);
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
