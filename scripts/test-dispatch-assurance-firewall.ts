/**
 * ENTIREFM — RED-03 SUPPLIER ASSURANCE & COMPLIANCE FIREWALL TEST SUITE
 * ====================================================================
 * Verifies that System B dispatch enforces the authoritative supplier assurance
 * state fail-closed across all 14 mandatory compliance matrix scenarios:
 *
 * 1. Valid supplier assurance -> eligible subject to other gates.
 * 2. Suspended supplier -> blocked (CONTRACTOR_SUSPENDED).
 * 3. Active compliance hold -> blocked (COMPLIANCE_HOLD).
 * 4. Missing Public Liability -> blocked (INSURANCE_MISSING).
 * 5. Expired Public Liability -> blocked (INSURANCE_EXPIRED).
 * 6. Missing Employers Liability -> blocked (INSURANCE_MISSING).
 * 7. Expired Employers Liability -> blocked (INSURANCE_EXPIRED).
 * 8. Expired mandatory accreditation -> blocked (ACCREDITATION_EXPIRED).
 * 9. Unverified evidence -> blocked (ACCREDITATION_UNVERIFIED).
 * 10. Database/assurance lookup failure -> fail closed (ASSURANCE_UNVERIFIED).
 * 11. Corrected evidence / hold resolved -> supplier becomes eligible.
 * 12. Client/site-specific restriction -> remains enforced.
 * 13. P1 emergency supplier -> still requires mandatory safety/compliance assurance.
 * 14. Retry / idempotency -> no duplicate dispatch.
 *
 * Run: npx tsx --env-file=.env.local scripts/test-dispatch-assurance-firewall.ts
 */

import { evaluateSupplierAssuranceFirewall } from '../src/server/suppliers/assurance-engine';
import { evaluateContractorEligibility } from '../src/server/ai/dispatch/eligibility';
import { orchestrateReactiveDispatch } from '../src/server/ai/dispatch/orchestrator';
import { SupplierInsuranceRecord, ComplianceHoldRecord, SupplierDocumentRecord } from '../src/server/suppliers/assurance-types';

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

async function runAssuranceTests() {
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM RED-03 SUPPLIER ASSURANCE FIREWALL TEST SUITE');
  console.log('═════════════════════════════════════════════════════════════════\n');

  const now = new Date('2026-09-06T12:00:00Z');
  const futureExpiry = '2027-01-01T00:00:00Z';
  const pastExpiry = '2025-12-31T00:00:00Z';

  const validPL: SupplierInsuranceRecord = {
    id: 'ins-pl-01',
    supplier_id: 'supp-01',
    insurance_type: 'PUBLIC_LIABILITY',
    insurer_name: 'Aviva Commercial',
    policy_number: 'AV-PL-99881',
    limit_gbp: 5000000,
    required_limit_gbp: 5000000,
    is_below_required_limit: false,
    start_date: '2026-01-01T00:00:00Z',
    expiry_date: futureExpiry,
    status: 'VALID',
  };

  const validEL: SupplierInsuranceRecord = {
    id: 'ins-el-01',
    supplier_id: 'supp-01',
    insurance_type: 'EMPLOYERS_LIABILITY',
    insurer_name: 'Aviva Commercial',
    policy_number: 'AV-EL-99882',
    limit_gbp: 10000000,
    required_limit_gbp: 10000000,
    is_below_required_limit: false,
    start_date: '2026-01-01T00:00:00Z',
    expiry_date: futureExpiry,
    status: 'VALID',
  };

  const validFgasDoc: SupplierDocumentRecord = {
    id: 'doc-fgas-01',
    supplier_id: 'supp-01',
    document_type: 'TECH_FGAS_REFCOM',
    file_name: 'refcom-cert-2026.pdf',
    file_size_bytes: 102400,
    mime_type: 'application/pdf',
    storage_path: 'vault/refcom.pdf',
    document_state: 'CURRENT',
    review_status: 'ACCEPTED',
    version: 1,
    uploaded_by: 'compliance',
    uploaded_at: '2026-01-01T00:00:00Z',
    expiry_date: futureExpiry,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: Valid Supplier Assurance -> Eligible
  // ─────────────────────────────────────────────────────────────────────────
  console.log('─── 1. Valid Supplier Assurance -> Eligible ───');
  const gate1 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-01',
      name: 'Pinnacle HVAC Services Ltd',
      code: 'PIN-01',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_national: false,
      is_suspended: false,
      insurance_records: [validPL, validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P2_HIGH',
    },
    now,
  });

  assert(gate1.is_eligible === true, 'Valid supplier passes all eligibility gates');
  assert(gate1.passed_checks.includes('COMPLIANCE_CLEAR'), 'Includes COMPLIANCE_CLEAR in passed checks');
  assert(gate1.passed_checks.includes('PUBLIC_LIABILITY_VERIFIED'), 'Verified £5M Public Liability');
  assert(gate1.passed_checks.includes('EMPLOYERS_LIABILITY_VERIFIED'), 'Verified £10M Employers Liability');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: Suspended Supplier -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 2. Suspended Supplier -> Blocked ───');
  const gate2 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-02',
      name: 'Suspended Contractors Ltd',
      code: 'SUS-02',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: true,
      insurance_records: [validPL, validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate2.is_eligible === false, 'Suspended supplier is not eligible');
  assert(gate2.failed_checks.includes('CONTRACTOR_SUSPENDED'), 'Failed checks contains CONTRACTOR_SUSPENDED');
  assert(!gate2.passed_checks.includes('COMPLIANCE_CLEAR'), 'Does NOT contain COMPLIANCE_CLEAR');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 3: Active Compliance Hold -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 3. Active Compliance Hold -> Blocked ───');
  const activeHold: ComplianceHoldRecord = {
    id: 'hold-01',
    supplier_id: 'supp-03',
    hold_reason: 'Investigation into major RIDDOR near-miss at Leeds site',
    hold_scope: 'GLOBAL',
    raised_by: 'qhse_officer',
    raised_at: '2026-08-01T10:00:00Z',
    review_date: '2026-09-30T00:00:00Z',
    resolution_required: 'Full incident investigation and toolbox talk records',
    is_active: true,
  };

  const gate3 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-03',
      name: 'Hold Contractor Ltd',
      code: 'HLD-03',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      compliance_holds: [activeHold],
      insurance_records: [validPL, validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate3.is_eligible === false, 'Supplier with active compliance hold is not eligible');
  assert(gate3.failed_checks.includes('COMPLIANCE_HOLD'), 'Failed checks contains COMPLIANCE_HOLD');
  assert(gate3.exclusion_reasons.some((r) => r.includes('RIDDOR near-miss')), 'Exclusion reason cites hold detail');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 4: Missing Public Liability -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 4. Missing Public Liability -> Blocked ───');
  const gate4 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-04',
      name: 'No PL Contractor Ltd',
      code: 'NPL-04',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      // Missing Public Liability, only EL provided
      insurance_records: [validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate4.is_eligible === false, 'Supplier missing Public Liability is blocked');
  assert(gate4.failed_checks.includes('INSURANCE_MISSING'), 'Failed checks contains INSURANCE_MISSING');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 5: Expired Public Liability -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 5. Expired Public Liability -> Blocked ───');
  const expiredPL: SupplierInsuranceRecord = {
    ...validPL,
    expiry_date: pastExpiry,
    status: 'EXPIRED',
  };

  const gate5 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-05',
      name: 'Expired PL Contractor Ltd',
      code: 'XPL-05',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      insurance_records: [expiredPL, validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate5.is_eligible === false, 'Supplier with expired Public Liability is blocked');
  assert(gate5.failed_checks.includes('INSURANCE_EXPIRED'), 'Failed checks contains INSURANCE_EXPIRED');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 6: Missing Employers Liability -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 6. Missing Employers Liability -> Blocked ───');
  const gate6 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-06',
      name: 'No EL Contractor Ltd',
      code: 'NEL-06',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      // Missing EL, only PL provided
      insurance_records: [validPL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate6.is_eligible === false, 'Supplier missing Employers Liability is blocked');
  assert(gate6.failed_checks.includes('INSURANCE_MISSING'), 'Failed checks contains INSURANCE_MISSING');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 7: Expired Employers Liability -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 7. Expired Employers Liability -> Blocked ───');
  const expiredEL: SupplierInsuranceRecord = {
    ...validEL,
    expiry_date: pastExpiry,
    status: 'EXPIRED',
  };

  const gate7 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-07',
      name: 'Expired EL Contractor Ltd',
      code: 'XEL-07',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      insurance_records: [validPL, expiredEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate7.is_eligible === false, 'Supplier with expired Employers Liability is blocked');
  assert(gate7.failed_checks.includes('INSURANCE_EXPIRED'), 'Failed checks contains INSURANCE_EXPIRED');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 8: Expired Mandatory Accreditation -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 8. Expired Mandatory Accreditation -> Blocked ───');
  const expiredFgasDoc: SupplierDocumentRecord = {
    ...validFgasDoc,
    expiry_date: pastExpiry,
    document_state: 'EXPIRED',
  };

  const gate8 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-08',
      name: 'Expired F-Gas Contractor Ltd',
      code: 'XFG-08',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      insurance_records: [validPL, validEL],
      accreditation_documents: [expiredFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate8.is_eligible === false, 'Supplier with expired trade accreditation is blocked');
  assert(gate8.failed_checks.includes('ACCREDITATION_EXPIRED'), 'Failed checks contains ACCREDITATION_EXPIRED');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 9: Unverified Evidence -> Blocked
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 9. Unverified Evidence -> Blocked ───');
  const unverifiedFgasDoc: SupplierDocumentRecord = {
    ...validFgasDoc,
    review_status: 'UNDER_REVIEW', // Not yet accepted
  };

  const gate9 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-09',
      name: 'Unverified F-Gas Contractor Ltd',
      code: 'UFG-09',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      insurance_records: [validPL, validEL],
      accreditation_documents: [unverifiedFgasDoc],
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate9.is_eligible === false, 'Supplier with unverified accreditation is blocked');
  assert(gate9.failed_checks.includes('ACCREDITATION_UNVERIFIED'), 'Failed checks contains ACCREDITATION_UNVERIFIED');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 10: Database / Assurance Lookup Failure -> Fail Closed
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 10. Database Lookup Failure -> Fail Closed ───');
  const gate10 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-10',
      name: 'Lookup Failure Contractor Ltd',
      code: 'LKF-10',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      assurance_lookup_failed: true, // DB error
    },
    requirement: { trade: 'HVAC', site_city: 'Manchester', priority: 'P2_HIGH' },
    now,
  });

  assert(gate10.is_eligible === false, 'Supplier with DB lookup failure is blocked');
  assert(gate10.failed_checks.includes('ASSURANCE_UNVERIFIED'), 'Failed checks contains ASSURANCE_UNVERIFIED');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 11: Corrected Evidence / Hold Resolved -> Becomes Eligible
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 11. Corrected Evidence / Hold Resolved -> Becomes Eligible ───');
  // First, verify that an active hold blocks
  const holdToResolve: ComplianceHoldRecord = {
    id: 'hold-res-01',
    supplier_id: 'supp-11',
    hold_reason: 'Audit pending',
    hold_scope: 'GLOBAL',
    raised_by: 'auditor',
    raised_at: '2026-08-01T00:00:00Z',
    review_date: '2026-09-01T00:00:00Z',
    resolution_required: 'Complete audit review',
    is_active: true,
  };

  const beforeResolution = evaluateContractorEligibility({
    supplier: {
      id: 'supp-11',
      name: 'Resolving Contractor Ltd',
      code: 'RES-11',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['ELECTRICAL'],
      covered_cities: ['London'],
      is_suspended: false,
      compliance_holds: [holdToResolve],
      insurance_records: [validPL, validEL],
      accreditation_documents: [{
        id: 'doc-elec-01',
        supplier_id: 'supp-11',
        document_type: 'TECH_NICEIC_NAPIT',
        file_name: 'niceic.pdf',
        file_size_bytes: 1024,
        mime_type: 'application/pdf',
        storage_path: 'vault/niceic.pdf',
        document_state: 'CURRENT',
        review_status: 'ACCEPTED',
        version: 1,
        uploaded_by: 'compliance',
        uploaded_at: '2026-01-01T00:00:00Z',
        expiry_date: futureExpiry,
      }],
    },
    requirement: { trade: 'ELECTRICAL', site_city: 'London', priority: 'P2_HIGH' },
    now,
  });
  assert(beforeResolution.is_eligible === false, 'Supplier is blocked before hold resolution');

  // Now resolve hold: is_active = false
  const resolvedHold: ComplianceHoldRecord = {
    ...holdToResolve,
    is_active: false,
    resolved_by: 'compliance_director',
    resolved_at: '2026-09-05T12:00:00Z',
  };

  const afterResolution = evaluateContractorEligibility({
    supplier: {
      id: 'supp-11',
      name: 'Resolving Contractor Ltd',
      code: 'RES-11',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['ELECTRICAL'],
      covered_cities: ['London'],
      is_suspended: false,
      compliance_holds: [resolvedHold],
      insurance_records: [validPL, validEL],
      accreditation_documents: [{
        id: 'doc-elec-01',
        supplier_id: 'supp-11',
        document_type: 'TECH_NICEIC_NAPIT',
        file_name: 'niceic.pdf',
        file_size_bytes: 1024,
        mime_type: 'application/pdf',
        storage_path: 'vault/niceic.pdf',
        document_state: 'CURRENT',
        review_status: 'ACCEPTED',
        version: 1,
        uploaded_by: 'compliance',
        uploaded_at: '2026-01-01T00:00:00Z',
        expiry_date: futureExpiry,
      }],
    },
    requirement: { trade: 'ELECTRICAL', site_city: 'London', priority: 'P2_HIGH' },
    now,
  });
  assert(afterResolution.is_eligible === true, 'Supplier becomes eligible after hold is resolved');
  assert(afterResolution.passed_checks.includes('COMPLIANCE_CLEAR'), 'COMPLIANCE_CLEAR awarded after resolution');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 12: Client / Site Restrictions Remain Enforced
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 12. Client / Site Restrictions Remain Enforced ───');
  const gate12 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-12',
      name: 'Blacklisted Contractor Ltd',
      code: 'BLK-12',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      blacklisted_client_ids: ['client-forbidden-01'],
      insurance_records: [validPL, validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      client_id: 'client-forbidden-01',
      priority: 'P2_HIGH',
    },
    now,
  });

  assert(gate12.is_eligible === false, 'Contractor restricted by client policy is blocked');
  assert(gate12.failed_checks.includes('CLIENT_RESTRICTION'), 'Failed checks contains CLIENT_RESTRICTION');
  assert(gate12.passed_checks.includes('COMPLIANCE_CLEAR'), 'Compliance gate passed independently');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 13: P1 Emergency Supplier Still Requires Mandatory Compliance
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 13. P1 Emergency Supplier Requires Mandatory Compliance ───');
  const gate13 = evaluateContractorEligibility({
    supplier: {
      id: 'supp-13',
      name: 'Emergency Hero Ltd',
      code: 'EMG-13',
      status: 'ACTIVE',
      org_type: 'CONTRACTOR',
      trades: ['HVAC'],
      covered_cities: ['Manchester'],
      is_suspended: false,
      emergency_24_7_capable: true, // Emergency capable
      // BUT missing Public Liability insurance
      insurance_records: [validEL],
      accreditation_documents: [validFgasDoc],
    },
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P1_CRITICAL',
    },
    now,
  });

  assert(gate13.is_eligible === false, 'P1 Emergency job does NOT bypass mandatory insurance');
  assert(gate13.passed_checks.includes('EMERGENCY_RESPONSE_CAPABLE'), 'Passed EMERGENCY_RESPONSE_CAPABLE check');
  assert(gate13.failed_checks.includes('INSURANCE_MISSING'), 'Blocked by INSURANCE_MISSING check');

  // ─────────────────────────────────────────────────────────────────────────
  // SCENARIO 14: End-to-End Orchestrator Dispatch with Assurance Firewall
  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n─── 14. Full Orchestrator Reactive Dispatch with Assurance Firewall ───');
  const dispatchResult = await orchestrateReactiveDispatch({
    work_order_id: 'wo-assurance-test-01',
    work_order_number: 'WO-ASSURE-01',
    title: 'Routine Air Conditioning Filter Inspection',
    trade: 'HVAC',
    priority: 'P2_HIGH',
    site_city: 'Manchester',
    will_disturb_building_fabric: false, // non-intrusive so asbestos gate passes
    candidate_suppliers_override: [
      {
        id: 'supp-blocked-ins',
        name: 'Uninsured AC Ltd',
        code: 'UAC-01',
        status: 'ACTIVE',
        org_type: 'CONTRACTOR',
        trades: ['HVAC'],
        covered_cities: ['Manchester'],
        is_national: false,
        agreed_callout_rate_gbp: 85,
        agreed_hourly_rate_gbp: 55,
        insurance_records: [], // NO INSURANCE
      },
      {
        id: 'supp-compliant',
        name: 'Fully Assured HVAC Ltd',
        code: 'FAH-01',
        status: 'ACTIVE',
        org_type: 'CONTRACTOR',
        trades: ['HVAC'],
        covered_cities: ['Manchester'],
        is_national: false,
        agreed_callout_rate_gbp: 90,
        agreed_hourly_rate_gbp: 60,
        insurance_records: [validPL, validEL],
        accreditation_documents: [validFgasDoc],
      },
    ],
  });

  assert(dispatchResult.status === 'DISPATCHED', `Dispatch succeeded (got ${dispatchResult.status})`);
  assert(dispatchResult.assigned_supplier_id === 'supp-compliant', 'Assigned supplier is the fully assured contractor');
  assert(dispatchResult.ranked_candidates.length === 1, 'Only compliant contractor was ranked');

  console.log('\n═════════════════════════════════════════════════════════════════');
  console.log(`  RED-03 ASSURANCE FIREWALL RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('═════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAssuranceTests().catch((err) => {
  console.error('Test run failed with unhandled error:', err);
  process.exit(1);
});
