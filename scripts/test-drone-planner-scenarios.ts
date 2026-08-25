/**
 * ENTIREFM DRONE INSPECTION PLANNER SCENARIO VERIFICATION TEST
 * =============================================================
 * Tests the deterministic recommendation engine against all 6 required test scenarios.
 */

import { generateDroneRecommendation, calculateLeadPriority } from '../src/config/dronePlanner';

interface TestCase {
  scenario: string;
  name: string;
  site: any;
  inspection: any;
  contact?: any;
  expectedPrimaryService: string;
  expectedPackSubstring?: string;
  expectedRemedialSubstring?: string;
  expectedPriority?: string;
}

const TEST_CASES: TestCase[] = [
  {
    scenario: 'Scenario 1',
    name: 'Roof Leak & Thermal Investigation',
    site: {
      siteType: 'Office / Commercial Building',
      siteScale: 'Single Building',
      city: 'Leeds',
    },
    inspection: {
      assetsToInspect: ['Roof', 'Gutters / Roof Drainage'],
      roofType: 'Flat',
      inspectionReasons: ['Water ingress / leak', 'Heat loss / insulation concern'],
      urgency: 'Within 7 Days',
      heightBand: '3–5 Storeys',
      accessDifficult: 'No',
      accessConstraints: ['unknown'],
      requestedOutputs: ['Thermal Imagery', 'Annotated Defect Images'],
      remediationInterest: 'Yes — inspection and remedial works',
      frequency: 'One-Off Inspection',
    },
    expectedPrimaryService: 'Roof & Gutter Drone Inspection',
    expectedPackSubstring: 'Roof Condition Pack + Thermal Drone Survey',
    expectedPriority: 'HIGH',
  },
  {
    scenario: 'Scenario 2',
    name: 'Solar PV Fault & Thermography',
    site: {
      siteType: 'Solar Installation',
      siteScale: 'Large External Site',
      city: 'Sheffield',
    },
    inspection: {
      assetsToInspect: ['Solar PV Array'],
      solarCapacity: 'Large commercial',
      inspectionReasons: ['Solar performance issue', 'Electrical / thermal anomaly'],
      urgency: 'Within 30 Days',
      heightBand: '1–2 Storeys',
      accessDifficult: 'No',
      accessConstraints: ['unknown'],
      requestedOutputs: ['Thermal Imagery', 'Thermal Anomaly Report'],
      remediationInterest: 'Possibly — advise me after the survey',
      frequency: 'Annually',
    },
    expectedPrimaryService: 'Solar PV Drone Inspections & Thermography',
    expectedPackSubstring: 'Energy Intelligence Pack',
    expectedPriority: 'HIGH',
  },
  {
    scenario: 'Scenario 3',
    name: 'Construction Progress Monitoring',
    site: {
      siteType: 'Construction Site',
      siteScale: 'Large External Site',
      city: 'Manchester',
    },
    inspection: {
      assetsToInspect: ['Construction Site', 'Whole Building'],
      inspectionReasons: ['Construction progress', 'Measurement / mapping'],
      urgency: 'Planned / No Immediate Urgency',
      heightBand: '6–10 Storeys',
      accessDifficult: 'Yes',
      accessConstraints: ['active construction site'],
      requestedOutputs: ['Construction Progress Report', 'Orthomosaic / Site Map'],
      remediationInterest: 'Inspection only',
      frequency: 'Construction Milestones',
    },
    expectedPrimaryService: 'Drone Construction Progress Monitoring',
    expectedPackSubstring: 'Construction Monitoring Pack',
    expectedPriority: 'HIGH',
  },
  {
    scenario: 'Scenario 4',
    name: 'High-Rise Façade & Cladding Deterioration',
    site: {
      siteType: 'Office / Commercial Building',
      siteScale: 'Single Building',
      city: 'London',
    },
    inspection: {
      assetsToInspect: ['Facade', 'Cladding', 'Glazing'],
      inspectionReasons: ['Loose / damaged cladding', 'Visible deterioration'],
      urgency: 'Within 7 Days',
      heightBand: '11+ Storeys',
      accessDifficult: 'Yes',
      accessConstraints: ['city centre', 'busy public area'],
      requestedOutputs: ['Annotated Defect Images', 'Condition Report'],
      remediationInterest: 'Yes — inspection and remedial works',
      frequency: 'One-Off Inspection',
    },
    expectedPrimaryService: 'Building Envelope & Façade Drone Inspection',
    expectedPackSubstring: 'Building Envelope Pack',
    expectedRemedialSubstring: 'Rope Access',
    expectedPriority: 'HIGH',
  },
  {
    scenario: 'Scenario 5',
    name: 'Estate-Scale PPM Programme',
    site: {
      siteType: 'Estate / Multi-Building Portfolio',
      siteScale: 'Estate / Campus',
      city: 'Birmingham',
    },
    inspection: {
      assetsToInspect: ['Multiple Buildings', 'Roof', 'Facade'],
      inspectionReasons: ['Planned condition survey', 'Routine PPM inspection'],
      urgency: 'Planned / No Immediate Urgency',
      heightBand: '3–5 Storeys',
      accessDifficult: 'No',
      accessConstraints: ['unknown'],
      requestedOutputs: ['Condition Report', 'Orthomosaic / Site Map', 'CAFM / Asset Record Evidence'],
      remediationInterest: 'Yes — inspection and remedial works',
      frequency: 'Annually',
    },
    expectedPrimaryService: 'Drone PPM & Estate Asset Inspections',
    expectedPackSubstring: 'Estate Condition Pack + Drone PPM Programme',
    expectedPriority: 'HIGH',
  },
  {
    scenario: 'Scenario 6',
    name: 'Emergency Storm Damage',
    site: {
      siteType: 'Warehouse / Logistics',
      siteScale: 'Single Building',
      city: 'Nottingham',
    },
    inspection: {
      assetsToInspect: ['Roof', 'Gutters / Roof Drainage'],
      inspectionReasons: ['Storm damage', 'Water ingress / leak'],
      stormStatus: 'recent',
      urgency: 'Emergency / Immediate Concern',
      heightBand: 'Industrial / Variable Height',
      accessDifficult: 'Yes',
      accessConstraints: ['unknown'],
      requestedOutputs: ['Insurance Evidence', 'High-Resolution Imagery'],
      remediationInterest: 'Yes — inspection and remedial works',
      frequency: 'One-Off Inspection',
    },
    expectedPrimaryService: 'Emergency & Insurance Drone Survey',
    expectedPackSubstring: 'Storm Response Pack',
    expectedPriority: 'HIGH',
  },
];

console.log('======================================================');
console.log(' ENTIREFM DRONE INSPECTION PLANNER — SCENARIOS TEST');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

for (const tc of TEST_CASES) {
  const rec = generateDroneRecommendation(tc.site, tc.inspection);
  const priority = calculateLeadPriority(tc.site, tc.inspection, tc.contact);

  let success = true;
  const errors: string[] = [];

  if (rec.primaryService.title !== tc.expectedPrimaryService) {
    success = false;
    errors.push(`Expected primaryService "${tc.expectedPrimaryService}", got "${rec.primaryService.title}"`);
  }

  if (tc.expectedPackSubstring && !rec.inspectionPack?.title.includes(tc.expectedPackSubstring)) {
    success = false;
    errors.push(`Expected pack containing "${tc.expectedPackSubstring}", got "${rec.inspectionPack?.title}"`);
  }

  if (tc.expectedRemedialSubstring) {
    const hasRemedial = rec.remedialServices.some(r => r.name.includes(tc.expectedRemedialSubstring!) || r.desc.includes(tc.expectedRemedialSubstring!));
    if (!hasRemedial) {
      success = false;
      errors.push(`Expected remedial containing "${tc.expectedRemedialSubstring}", got none`);
    }
  }

  if (tc.expectedPriority && priority !== tc.expectedPriority) {
    success = false;
    errors.push(`Expected priority "${tc.expectedPriority}", got "${priority}"`);
  }

  if (success) {
    passed++;
    console.log(`✓ PASS [${tc.scenario}] ${tc.name}`);
    console.log(`  └─ Service: ${rec.primaryService.title}`);
    console.log(`  └─ Pack: ${rec.inspectionPack?.title || 'None'}`);
    console.log(`  └─ Priority: ${priority} | Scope: ${rec.scopeCategory}\n`);
  } else {
    failed++;
    console.log(`✗ FAIL [${tc.scenario}] ${tc.name}`);
    errors.forEach(e => console.log(`  └─ ${e}`));
    console.log();
  }
}

console.log('======================================================');
console.log(`TOTAL: ${TEST_CASES.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('======================================================');

if (failed > 0) {
  process.exit(1);
}
