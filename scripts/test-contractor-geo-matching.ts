/**
 * ENTIREFM CONTRACTOR MATCHING & GEOLOCATION TEST SUITE
 * =====================================================
 * Validates deterministic trade matching, real Haversine geolocation,
 * multi-depot nearest distance resolution, and strict fail-closed eligibility gates.
 *
 * Test Scenarios:
 *   1. Haversine spherical math accuracy (real-world UK postcodes)
 *   2. Missing provider locations (fail-closed, no 8.5m fallback)
 *   3. Distance exceeding coverage_radius_miles (ineligible)
 *   4. Contractor with no trades on file (fail-closed Gate 3)
 *   5. Contractor with no geographic coverage (fail-closed Gate 4)
 *   6. P1 Critical 24/7 emergency requirement (fail-closed Gate 5)
 *   7. Multi-depot nearest depot resolution (minimum distance selection)
 *   8. Happy-path local contractor dispatch & ranking (top tier 25 pts)
 *   9. Null distance ranking penalty (0 pts lowest proximity tier)
 *
 * Run:
 *   npx tsx scripts/test-contractor-geo-matching.ts
 */

import { haversineDistanceMiles, normaliseUkPostcode, formatDisplayPostcode } from '../src/server/geo/geocoding';
import { evaluateContractorEligibility } from '../src/server/ai/dispatch/eligibility';
import { rankEligibleContractors } from '../src/server/ai/dispatch/ranking';
import { orchestrateReactiveDispatch } from '../src/server/ai/dispatch/orchestrator';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
    failedCount++;
  } else {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  }
}

async function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM CONTRACTOR GEO-MATCHING & FAIL-CLOSED TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ─────────────────────────────────────────────────────────────
  console.log('Section 1: Haversine Great-Circle Distance Math Accuracy');
  // ─────────────────────────────────────────────────────────────

  // Sheffield (S1 2HH) to Leeds (LS1 1UR): approx 28.8 miles
  const sheffieldLat = 53.3809;
  const sheffieldLon = -1.4680;
  const leedsLat = 53.7940;
  const leedsLon = -1.5475;
  const sheffieldToLeeds = haversineDistanceMiles(sheffieldLat, sheffieldLon, leedsLat, leedsLon);
  assert(
    Math.abs(sheffieldToLeeds - 28.8) <= 0.5,
    'Sheffield S1 to Leeds LS1 distance is ~28.8 miles',
    `Calculated: ${sheffieldToLeeds} miles`
  );

  // London Westminster (SW1A 1AA) to Birmingham (B1 1AA): approx 101.4 miles
  const londonLat = 51.5014;
  const londonLon = -0.1419;
  const bhamLat = 52.4774;
  const bhamLon = -1.9004;
  const londonToBham = haversineDistanceMiles(londonLat, londonLon, bhamLat, bhamLon);
  assert(
    Math.abs(londonToBham - 101.4) <= 1.0,
    'London SW1A to Birmingham B1 distance is ~101.4 miles',
    `Calculated: ${londonToBham} miles`
  );

  // Normalisation test
  assert(normaliseUkPostcode('  sw1a 1aa ') === 'SW1A1AA', 'Normalise postcode trims and cleans spaces');
  assert(formatDisplayPostcode('SW1A1AA') === 'SW1A 1AA', 'Display postcode formats with inward space');

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 2: Missing Location & Coordinates (Strict Fail-Closed)');
  // ─────────────────────────────────────────────────────────────

  // Contractor with no provider locations and no coordinates
  const ungeocodedContractor = {
    id: 'sup-ungeocoded-001',
    name: 'Ungeocoded Services Ltd',
    code: 'UNG-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: ['HVAC'],
    covered_cities: [],
    is_national: false,
    distance_miles: null,
    coverage_radius_miles: 25,
  };

  const gateNoLoc = evaluateContractorEligibility({
    supplier: ungeocodedContractor,
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P3_MEDIUM',
    },
  });

  assert(
    !gateNoLoc.is_eligible,
    'Contractor without coordinates/depot fails Gate 4 (not defaulted to 8.5m)'
  );
  assert(
    gateNoLoc.failed_checks.includes('OUTSIDE_GEOGRAPHIC_AREA'),
    'Failed checks includes OUTSIDE_GEOGRAPHIC_AREA'
  );
  assert(
    gateNoLoc.exclusion_reasons.some((r) => r.includes('no geographic coverage or operating depot')),
    'Exclusion reason clearly notes missing geographic coverage/operating depot'
  );

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 3: Coverage Radius Enforcement');
  // ─────────────────────────────────────────────────────────────

  // Contractor is 42 miles away, but their stated coverage radius is 25 miles
  const contractorTooFar = {
    id: 'sup-toofar-001',
    name: 'Faraway Facilities Ltd',
    code: 'FAR-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: ['HVAC'],
    covered_cities: ['Manchester'],
    is_national: false,
    distance_miles: 42.0,
    coverage_radius_miles: 25,
  };

  const gateTooFar = evaluateContractorEligibility({
    supplier: contractorTooFar,
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P3_MEDIUM',
    },
  });

  assert(
    !gateTooFar.is_eligible,
    'Contractor further than coverage_radius_miles is INELIGIBLE on Gate 4'
  );
  assert(
    gateTooFar.exclusion_reasons.some((r) => r.includes('exceeds contractor stated coverage radius')),
    'Exclusion reason explicitly states distance exceeds stated coverage radius'
  );

  // Contractor is 20 miles away with coverage radius 25 miles -> eligible!
  const contractorWithinRadius = {
    ...contractorTooFar,
    distance_miles: 20.0,
  };
  const gateWithinRadius = evaluateContractorEligibility({
    supplier: contractorWithinRadius,
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P3_MEDIUM',
    },
  });
  assert(
    gateWithinRadius.is_eligible,
    'Contractor within coverage_radius_miles passes Gate 4'
  );

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 4: Empty Trades Profile (Strict Fail-Closed)');
  // ─────────────────────────────────────────────────────────────

  // Contractor with no trades on file
  const contractorNoTrades = {
    id: 'sup-notrades-001',
    name: 'Blank Trades Ltd',
    code: 'NOTRD-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: [], // Empty!
    covered_cities: ['Manchester'],
    is_national: true,
  };

  const gateNoTrades = evaluateContractorEligibility({
    supplier: contractorNoTrades,
    requirement: {
      trade: 'HVAC',
      site_city: 'Manchester',
      priority: 'P3_MEDIUM',
    },
  });

  assert(
    !gateNoTrades.is_eligible,
    'Contractor with empty trades is strictly excluded on Gate 3'
  );
  assert(
    gateNoTrades.failed_checks.includes('TRADE_MISMATCH'),
    'Gate 3 failed check is TRADE_MISMATCH'
  );
  assert(
    gateNoTrades.exclusion_reasons.some((r) => r.includes('no trade discipline on file')),
    'Exclusion reason informs admin: contractor profile incomplete: no trade discipline on file'
  );

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 5: P1 Critical 24/7 Emergency Requirement (Fail-Closed)');
  // ─────────────────────────────────────────────────────────────

  const contractorNo247 = {
    id: 'sup-no247-001',
    name: 'Standard Hours Ltd',
    code: 'STD-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: ['ELECTRICAL'],
    covered_cities: ['Leeds'],
    is_national: false,
    distance_miles: 5.0,
    coverage_radius_miles: 25,
    emergency_24_7_capable: false, // NOT 24/7 capable
  };

  const gateP1Fail = evaluateContractorEligibility({
    supplier: contractorNo247,
    requirement: {
      trade: 'ELECTRICAL',
      site_city: 'Leeds',
      priority: 'P1_CRITICAL',
    },
  });

  assert(
    !gateP1Fail.is_eligible,
    'Contractor without 24/7 capability is excluded for P1 Critical job'
  );
  assert(
    gateP1Fail.failed_checks.includes('NO_24_7_EMERGENCY_COVER'),
    'Gate 5 failed check is NO_24_7_EMERGENCY_COVER'
  );

  // Same contractor for P3 job -> eligible!
  const gateP3Pass = evaluateContractorEligibility({
    supplier: contractorNo247,
    requirement: {
      trade: 'ELECTRICAL',
      site_city: 'Leeds',
      priority: 'P3_MEDIUM',
    },
  });
  assert(
    gateP3Pass.is_eligible,
    'Contractor without 24/7 capability is eligible for non-critical P3 Medium job'
  );

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 6: Multi-Depot Nearest Proximity Calculation');
  // ─────────────────────────────────────────────────────────────

  // Multi-depot contractor: HQ in London (170m away), Branch depot in Leeds (4m away)
  // Job site in Leeds: (53.7940, -1.5475)
  const multiDepotContractor = {
    id: 'sup-multidepot-001',
    name: 'National FM Solutions Ltd',
    code: 'NAT-01',
    status: 'ACTIVE',
    org_type: 'CONTRACTOR',
    trades: ['HVAC'],
    is_national: false,
    coverage_radius_miles: 25,
    provider_locations: [
      {
        id: 'loc-london',
        name: 'London HQ',
        is_hq: true,
        is_dispatch_point: false,
        latitude: 51.5014,
        longitude: -0.1419,
        city: 'London',
      },
      {
        id: 'loc-leeds',
        name: 'Leeds Northern Depot',
        is_hq: false,
        is_dispatch_point: true,
        latitude: 53.7500, // ~3.5 miles from Leeds center
        longitude: -1.5300,
        city: 'Leeds',
      },
    ],
  };

  const dispatchResult = await orchestrateReactiveDispatch({
    work_order_id: 'wo-test-multidepot',
    work_order_number: 'WO-TEST-MD',
    title: 'Boiler failure in Leeds depot',
    trade: 'HVAC',
    priority: 'P3_MEDIUM',
    site_city: 'Leeds',
    site_postcode: 'LS1 1UR',
    site_latitude: 53.7940,
    site_longitude: -1.5475,
    candidate_suppliers_override: [multiDepotContractor],
  });

  const candidate = dispatchResult.ranked_candidates[0];
  assert(
    candidate != null,
    'Multi-depot contractor was evaluated'
  );
  assert(
    candidate?.geographic_distance_miles != null && candidate.geographic_distance_miles < 10,
    `Nearest depot selected (calculated distance ${candidate?.geographic_distance_miles?.toFixed(1)} miles, NOT London ~170m)`
  );
  assert(
    candidate?.eligibility_gates.is_eligible === true,
    'Contractor is eligible based on nearest branch depot'
  );

  // ─────────────────────────────────────────────────────────────
  console.log('\nSection 7: Ranking Proximity Score Tiers & Null Distance Handling');
  // ─────────────────────────────────────────────────────────────

  // Candidate with null distance receives 0 proximity points
  const candidateNullDist = {
    supplier_id: 'sup-nulldist',
    supplier_name: 'National Provider Distance Pending',
    supplier_code: 'NAT-PEND',
    trades: ['HVAC'],
    distance_miles: undefined,
    eligibility_gate: {
      is_eligible: true,
      passed_checks: ['GEOGRAPHIC_COVERAGE_APPROVED'],
      failed_checks: [],
      exclusion_reasons: [],
    },
  };

  const candidateCloseDist = {
    supplier_id: 'sup-close',
    supplier_name: 'Local Provider 3m',
    supplier_code: 'LOC-3M',
    trades: ['HVAC'],
    distance_miles: 3.5,
    eligibility_gate: {
      is_eligible: true,
      passed_checks: ['GEOGRAPHIC_COVERAGE_APPROVED'],
      failed_checks: [],
      exclusion_reasons: [],
    },
  };

  const ranked = rankEligibleContractors([candidateNullDist, candidateCloseDist], {
    trade: 'HVAC',
    priority: 'P3_MEDIUM',
    site_city: 'Manchester',
  });

  const rankedClose = ranked.find((r) => r.supplier_id === 'sup-close');
  const rankedNull = ranked.find((r) => r.supplier_id === 'sup-nulldist');

  assert(
    rankedClose?.scoring_factors.location_coverage_explanation.includes('Local primary depot'),
    'Local provider receives Local primary depot explanation'
  );
  assert(
    rankedNull?.scoring_factors.location_coverage_explanation.includes('unranked proximity tier'),
    'Null distance receives 0 pts unranked proximity tier explanation'
  );
  assert(
    (rankedClose?.total_suitability_score || 0) > (rankedNull?.total_suitability_score || 0),
    `Local contractor scores higher (${rankedClose?.total_suitability_score}) than null distance (${rankedNull?.total_suitability_score})`
  );

  // ─────────────────────────────────────────────────────────────
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  RESULTS: ${passedCount} passed, ${failedCount} failed`);
  console.log('───────────────────────────────────────────────────────────────\n');

  if (failedCount > 0) {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  } else {
    console.log('✅ ALL CONTRACTOR GEO-MATCHING & FAIL-CLOSED TESTS PASSED (100%)\n');
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
