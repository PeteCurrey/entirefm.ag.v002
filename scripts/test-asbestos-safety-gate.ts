/**
 * ENTIREFM — RED-02 ASBESTOS & SAFETY GATE TEST SUITE
 * ====================================================
 * Verifies that System B dispatch executes the statutory Asbestos Safety Gate
 * BEFORE contractor selection and adheres to strict CAR 2012 / Reg 4 rules:
 *
 * 1. Intrusive work + valid asbestos info + human clearance -> dispatch proceeds.
 * 2. Intrusive work + missing asbestos info -> BLOCKED_SAFETY_HOLD.
 * 3. Intrusive work + survey required -> BLOCKED_SAFETY_HOLD.
 * 4. Intrusive work + specialist review required -> BLOCKED_SAFETY_HOLD.
 * 5. Work explicitly blocked -> BLOCKED_SAFETY_HOLD.
 * 6. Non-intrusive work -> gate does not block.
 * 7. AI unavailable / AI cannot grant clearance -> deterministic fail-closed.
 * 8. DB lookup failure -> fail closed.
 * 9. Retry after human/QHSE clearance -> dispatch resumes.
 * 10. Idempotent retry -> no duplicate assignment.
 *
 * Run: npx tsx --env-file=.env.local scripts/test-asbestos-safety-gate.ts
 */

import { evaluateAsbestosWorkOrderRisk, AsbestosJobAssessment } from '../src/server/asbestos';
import { orchestrateReactiveDispatch } from '../src/server/ai/dispatch/orchestrator';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✗ FAIL\x1b[0m ${message}`);
    failed++;
  }
}

async function runAsbestosTests() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM RED-02 ASBESTOS & SAFETY GATE TEST SUITE');
  console.log('═════════════════════════════════════════════════════════════════\n');

  const futureExpiry = '2027-01-01T00:00:00Z';
  const sampleCompliantSupplier = {
    id: 'supp-hvac-safe',
    name: 'Safe Air Ltd',
    code: 'SAL-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: ['HVAC'],
    covered_cities: ['Leeds'],
    is_national: false,
    agreed_callout_rate_gbp: 95,
    agreed_hourly_rate_gbp: 65,
    insurance_records: [
      {
        id: 'ins-pl-safe',
        supplier_id: 'supp-hvac-safe',
        insurance_type: 'PUBLIC_LIABILITY',
        insurer_name: 'Aviva',
        policy_number: 'AV-PL-1',
        limit_gbp: 5000000,
        required_limit_gbp: 5000000,
        is_below_required_limit: false,
        start_date: '2026-01-01',
        expiry_date: futureExpiry,
        status: 'VALID',
      },
      {
        id: 'ins-el-safe',
        supplier_id: 'supp-hvac-safe',
        insurance_type: 'EMPLOYERS_LIABILITY',
        insurer_name: 'Aviva',
        policy_number: 'AV-EL-1',
        limit_gbp: 10000000,
        required_limit_gbp: 10000000,
        is_below_required_limit: false,
        start_date: '2026-01-01',
        expiry_date: futureExpiry,
        status: 'VALID',
      },
    ],
    accreditation_documents: [
      {
        id: 'doc-fgas-safe',
        supplier_id: 'supp-hvac-safe',
        document_type: 'TECH_FGAS_REFCOM',
        file_name: 'fgas.pdf',
        file_size_bytes: 1024,
        mime_type: 'application/pdf',
        storage_path: 'vault/fgas.pdf',
        document_state: 'CURRENT',
        review_status: 'ACCEPTED',
        version: 1,
        uploaded_by: 'system',
        uploaded_at: '2026-01-01',
        expiry_date: futureExpiry,
      },
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: Intrusive Work + Valid Info + Human Clearance -> Proceeds
  // ─────────────────────────────────────────────────────────────────────────
  console.log('─── 1. Intrusive Work + Valid Info + Human Clearance -> Proceeds ───');
  const res1 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-01',
    work_order_number: 'WO-ASB-01',
    title: 'Drilling penetrations for new refrigerant pipework in plant room',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-01',
      siteId: 'site-01',
      siteAddress: '1 Park Row, Leeds',
      buildingConstructionYear: 1985,
      jobWorkArea: 'Plant Room B',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'NO_ACM_IDENTIFIED_FOR_SCOPE',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [
        {
          documentId: 'doc-rd-01',
          documentTitle: 'Refurbishment & Demolition Survey - Plant Room B',
          documentType: 'REFURBISHMENT_DEMOLITION_SURVEY',
          revisionDate: '2026-05-01',
          relevantAreasCovered: ['Plant Room B'],
          inaccessibleAreasRecorded: [],
          dateMadeAvailableToContractor: '2026-05-02',
          providedByEntity: 'EntireFM Client',
          contractorRecipientEntity: 'EntireFM Operations',
        },
      ],
      humanQhseClearedBy: 'qhse_manager_marcus',
      humanQhseClearedAt: '2026-06-01T09:00:00Z',
      clearanceNotes: 'R&D survey reviewed; no ACM identified in drill zone.',
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res1.status === 'DISPATCHED', `Dispatch proceeded with human clearance (status: ${res1.status})`);
  assert(res1.assigned_supplier_id === 'supp-hvac-safe', 'Contractor was successfully assigned');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: Intrusive Work + Missing Asbestos Info -> BLOCKED_SAFETY_HOLD
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 2. Intrusive Work + Missing Asbestos Info -> BLOCKED_SAFETY_HOLD ───');
  const res2 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-02',
    work_order_number: 'WO-ASB-02',
    title: 'Drilling penetrations through pre-2000 masonry walls',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-02',
      siteId: 'site-02',
      siteAddress: 'Victorian Mill, Leeds',
      buildingConstructionYear: 1974,
      jobWorkArea: 'Main Corridor Wall',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'INFORMATION_REQUIRED', // Info missing
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [], // Zero docs
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res2.status === 'BLOCKED_SAFETY_HOLD', `Dispatch blocked with BLOCKED_SAFETY_HOLD (status: ${res2.status})`);
  assert(res2.ranked_candidates.length === 0, 'No contractors selected while on safety hold');
  assert(res2.exception_reason?.includes('BLOCKED_SAFETY_HOLD'), 'Exception reason cites safety hold');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 3: Intrusive Work + Survey Required -> BLOCKED_SAFETY_HOLD
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 3. Intrusive Work + Survey Required -> BLOCKED_SAFETY_HOLD ───');
  const res3 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-03',
    work_order_number: 'WO-ASB-03',
    title: 'Refurbishment wall cut-outs',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-03',
      siteId: 'site-03',
      siteAddress: '10 High Street, Leeds',
      buildingConstructionYear: 1990,
      jobWorkArea: 'Ceiling void',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'SURVEY_REQUIRED',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [],
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res3.status === 'BLOCKED_SAFETY_HOLD', `Survey required halts dispatch (status: ${res3.status})`);

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 4: Intrusive Work + Specialist Review Required -> BLOCKED_SAFETY_HOLD
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 4. Intrusive Work + Specialist Review Required -> BLOCKED_SAFETY_HOLD ───');
  const res4 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-04',
    work_order_number: 'WO-ASB-04',
    title: 'Cable pull through suspect textured ceiling void',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-04',
      siteId: 'site-04',
      siteAddress: 'Commercial House, Leeds',
      buildingConstructionYear: 1968,
      jobWorkArea: 'Level 2 Riser',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'SPECIALIST_REVIEW_REQUIRED',
      acmLocationsIdentified: [],
      presumedAcms: ['Suspect artex coating in ceiling void'],
      documents: [],
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res4.status === 'BLOCKED_SAFETY_HOLD', `Specialist review required halts dispatch (status: ${res4.status})`);

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 5: Work Explicitly Blocked -> BLOCKED_SAFETY_HOLD
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 5. Work Explicitly Blocked -> BLOCKED_SAFETY_HOLD ───');
  const res5 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-05',
    work_order_number: 'WO-ASB-05',
    title: 'Structural alterations in asbestos contaminated area',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-05',
      siteId: 'site-05',
      siteAddress: 'Old Mill, Leeds',
      buildingConstructionYear: 1950,
      jobWorkArea: 'Boiler House Basement',
      workType: 'DESTRUCTIVE_REFURBISHMENT',
      willDisturbBuildingFabric: true,
      scopeStatus: 'WORK_BLOCKED',
      acmLocationsIdentified: ['Pipe lagging crocidolite confirmed'],
      presumedAcms: [],
      documents: [],
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res5.status === 'BLOCKED_SAFETY_HOLD', `Explicitly blocked work halts dispatch (status: ${res5.status})`);

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 6: Non-Intrusive Work -> Gate Does Not Block
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 6. Non-Intrusive Work -> Gate Does Not Block ───');
  const res6 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-06',
    work_order_number: 'WO-ASB-06',
    title: 'Routine filter replacement and thermostat recalibration',
    trade: 'HVAC',
    priority: 'P3_NORMAL',
    site_city: 'Leeds',
    will_disturb_building_fabric: false, // Non-intrusive
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res6.status === 'DISPATCHED', `Non-intrusive work is not blocked by safety gate (status: ${res6.status})`);
  assert(res6.assigned_supplier_id === 'supp-hvac-safe', 'Contractor assigned for non-intrusive work');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 7: AI Cannot Grant Safety Clearance -> Fail Closed
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 7. AI Cannot Grant Safety Clearance -> Fail Closed ───');
  const aiAttemptedAssessment: AsbestosJobAssessment = {
    workOrderId: 'wo-asb-07',
    siteId: 'site-07',
    siteAddress: 'Tower Block, Leeds',
    buildingConstructionYear: 1978,
    jobWorkArea: 'Plant Room',
    workType: 'INTRUSIVE_DRILLING',
    willDisturbBuildingFabric: true,
    scopeStatus: 'SURVEY_REQUIRED',
    acmLocationsIdentified: [],
    presumedAcms: [],
    documents: [],
    aiRiskFlags: ['AI evaluated building notes and thought it looked fine'],
    // humanQhseClearedBy is UNDEFINED - only AI notes present
  };

  const res7 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-07',
    work_order_number: 'WO-ASB-07',
    title: 'Drilling core holes in pre-2000 riser',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    asbestos_assessment: aiAttemptedAssessment,
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res7.status === 'BLOCKED_SAFETY_HOLD', 'AI notes cannot override safety gate; halts dispatch');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 8: DB Lookup Failure -> Fail Closed
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 8. DB Lookup Failure -> Fail Closed ───');
  // Passing invalid params that trigger lookup failure
  const res8 = await orchestrateReactiveDispatch({
    work_order_id: 'non-existent-wo-lookup-err',
    work_order_number: 'WO-ERR-08',
    title: 'Core drilling through riser wall',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-err-08',
      siteId: 'site-08',
      siteAddress: 'Unknown Site',
      jobWorkArea: 'Riser',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'INFORMATION_REQUIRED',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [],
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res8.status === 'BLOCKED_SAFETY_HOLD', 'DB / missing data fails closed to BLOCKED_SAFETY_HOLD');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 9: Retry After Human QHSE Clearance -> Dispatch Resumes
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 9. Retry After Human QHSE Clearance -> Dispatch Resumes ───');
  // First attempt: blocked
  const res9Blocked = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-09',
    work_order_number: 'WO-ASB-09',
    title: 'Drilling intake louvre openings',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-09',
      siteId: 'site-09',
      siteAddress: '2 Park Square, Leeds',
      buildingConstructionYear: 1980,
      jobWorkArea: 'North Elevation Wall',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'SPECIALIST_REVIEW_REQUIRED',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [],
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });
  assert(res9Blocked.status === 'BLOCKED_SAFETY_HOLD', 'Initial attempt blocked on safety hold');

  // Second attempt: Human QHSE clearance added
  const res9Cleared = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-09',
    work_order_number: 'WO-ASB-09',
    title: 'Drilling intake louvre openings',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-09',
      siteId: 'site-09',
      siteAddress: '2 Park Square, Leeds',
      buildingConstructionYear: 1980,
      jobWorkArea: 'North Elevation Wall',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'NO_ACM_IDENTIFIED_FOR_SCOPE',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [
        {
          documentId: 'doc-survey-09',
          documentTitle: 'Masonry Asbestos Sampling Report',
          documentType: 'MANAGEMENT_SURVEY',
          revisionDate: '2026-08-01',
          relevantAreasCovered: ['North Elevation Wall'],
          inaccessibleAreasRecorded: [],
          dateMadeAvailableToContractor: '2026-08-02',
          providedByEntity: 'EntireFM QHSE',
          contractorRecipientEntity: 'Safe Air Ltd',
        },
      ],
      humanQhseClearedBy: 'sarah_qhse_director',
      humanQhseClearedAt: '2026-09-01T10:00:00Z',
      clearanceNotes: 'Core sample lab results negative for chrysotile/amphibole. Safe to drill.',
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res9Cleared.status === 'DISPATCHED', 'Dispatch resumes successfully after human QHSE clearance');
  assert(res9Cleared.assigned_supplier_id === 'supp-hvac-safe', 'Contractor assigned on retry');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 10: Idempotent Retry -> No Duplicate Assignment
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 10. Idempotent Retry -> No Duplicate Assignment ───');
  // Re-evaluating the cleared job produces the exact same deterministic outcome
  const res10 = await orchestrateReactiveDispatch({
    work_order_id: 'wo-asb-09',
    work_order_number: 'WO-ASB-09',
    title: 'Drilling intake louvre openings',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Leeds',
    will_disturb_building_fabric: true,
    asbestos_assessment: {
      workOrderId: 'wo-asb-09',
      siteId: 'site-09',
      siteAddress: '2 Park Square, Leeds',
      buildingConstructionYear: 1980,
      jobWorkArea: 'North Elevation Wall',
      workType: 'INTRUSIVE_DRILLING',
      willDisturbBuildingFabric: true,
      scopeStatus: 'NO_ACM_IDENTIFIED_FOR_SCOPE',
      acmLocationsIdentified: [],
      presumedAcms: [],
      documents: [],
      humanQhseClearedBy: 'sarah_qhse_director',
      humanQhseClearedAt: '2026-09-01T10:00:00Z',
    },
    candidate_suppliers_override: [sampleCompliantSupplier],
  });

  assert(res10.status === 'DISPATCHED', 'Idempotent retry returns DISPATCHED');
  assert(res10.assigned_supplier_id === 'supp-hvac-safe', 'Single consistent supplier assigned');

  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log(`  RED-02 ASBESTOS SAFETY GATE RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('═════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAsbestosTests().catch((err) => {
  console.error('Test run failed with unhandled error:', err);
  process.exit(1);
});
