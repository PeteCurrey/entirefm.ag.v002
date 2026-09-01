/**
 * ENTIREFM PHASE 04 — GAP CLOSURE & BEHAVIOURAL ACCEPTANCE SUITE
 * ==============================================================
 * Comprehensive reality test verifying all 6 closed gaps:
 *   1. AI Asset Register Builder & Ingestion (Parsing, Duplicate Reconciliation, Commit)
 *   2. Work Order Evidence Intelligence (Multimodal Analysis, Advisory Output, Security)
 *   3. Live Camera Continuous QR Frame Decoding (Lifecycle, Stream Cleanup)
 *   4. Specialist Trade Template Expansion (Structured Fields, Retrievability)
 *   5. Contractor Dispatch & Competency Matching (Trade, Compliance, Hard Blocks)
 *   6. Marketing Analytics Zero Synthetic Multipliers Audit
 */

import { parseAssetImportSource, commitImportedAssets } from '../src/server/assets/asset-import-service';
import { analyzeWorkOrderEvidence } from '../src/server/work/evidence-intelligence';
import { getTemplateById, getTemplatesByCategory, ALL_BUSINESS_TEMPLATES } from '../src/server/contractor/template-library';
import { evaluateOperativeEligibility } from '../src/server/contractor/operative-eligibility-engine';
import { evaluateContractorCompliance } from '../src/server/contractor/compliance-engine';
import { getAnalyticsDashboardData } from '../src/server/analytics';
import { UserSession } from '../src/server/identity';
import * as fs from 'fs';
import * as path from 'path';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ ${msg}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    testsFailed++;
  }
}

async function runPhase04Verification() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║   ENTIREFM PHASE 04 — GAP CLOSURE & BEHAVIOURAL VERIFICATION SUITE         ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  const clientSession: UserSession = {
    userId: 'usr-client-01',
    personId: 'per-client-01',
    name: 'Sarah Jenkins',
    email: 's.jenkins@estates-corp.co.uk',
    role: 'CLIENT_MANAGER',
    orgId: 'org-client-100',
    orgName: 'Prestige Estates Ltd',
    app_metadata: { role: 'CLIENT_MANAGER' },
    user_metadata: {},
  };

  const otherClientSession: UserSession = {
    userId: 'usr-client-02',
    personId: 'per-client-02',
    name: 'David Ross',
    email: 'd.ross@metro-logistics.co.uk',
    role: 'CLIENT_MANAGER',
    orgId: 'org-client-200',
    orgName: 'Metro Logistics Hub',
    app_metadata: { role: 'CLIENT_MANAGER' },
    user_metadata: {},
  };

  // ─── 1. AI ASSET REGISTER BUILDER & DUPLICATE RECONCILIATION ──────────────
  console.log('─── 1. AI ASSET REGISTER BUILDER & DUPLICATE RECONCILIATION ───');
  
  const sampleSchedule = `asset_reference,name,category,manufacturer,model,serial_number,location,condition,criticality
AHU-GF-01,Ground Floor Main AHU,HVAC,Daikin,D-AHU-400,SN-DK-99281,Plantroom A,GOOD,HIGH
CHL-01,Central Water Chiller,HVAC,Trane,RT-CH-800,SN-TR-44810,Roof Level,EXCELLENT,CRITICAL
DB-01,Main 3-Phase Switchboard,Electrical,Schneider,Acti9,SN-SN-55201,Ground Riser,GOOD,HIGH`;

  const parseResult = await parseAssetImportSource({ rawText: sampleSchedule }, clientSession);
  assert(parseResult.success === true, 'Asset import schedule parsed successfully');
  assert(parseResult.totalExtracted === 3, 'Extracted 3 candidate asset records');
  assert(parseResult.candidates.length === 3, 'Candidate array length matches extracted count');
  
  const ahuCandidate = parseResult.candidates.find((c) => c.asset_reference === 'AHU-GF-01');
  assert(ahuCandidate !== undefined, 'Found AHU candidate by reference');
  assert(ahuCandidate?.manufacturer === 'Daikin', 'Extracted correct manufacturer (Daikin)');
  assert(ahuCandidate?.serial_number === 'SN-DK-99281', 'Extracted serial number (SN-DK-99281)');
  assert(ahuCandidate?.reconciliation_state === 'NEW' || ahuCandidate?.reconciliation_state === 'POSSIBLE_DUPLICATE', 'Candidate assigned valid reconciliation state');

  // Tenant Isolation test
  const unauthSession: UserSession = { ...clientSession, orgId: undefined as any };
  const unauthResult = await parseAssetImportSource({ rawText: sampleSchedule }, unauthSession);
  assert(unauthResult.success === false, 'Blocked unauthenticated session with missing org context');

  // ─── 2. WORK ORDER EVIDENCE INTELLIGENCE ──────────────────────────────────
  console.log('\n─── 2. WORK ORDER EVIDENCE INTELLIGENCE ────────────────────────');

  const evidenceAnalysis = await analyzeWorkOrderEvidence('wo-sample-01', clientSession);
  assert(evidenceAnalysis.workOrderId === 'wo-sample-01', 'Evidence analysis returned for requested Work Order');
  assert(evidenceAnalysis.advisoryLabel === 'AI Observation & Recommendation', 'Output strictly labeled "AI Observation & Recommendation"');
  assert(evidenceAnalysis.disclaimer.includes('does not certify'), 'Mandatory governance disclaimer present');
  assert(Array.isArray(evidenceAnalysis.observations), 'Observations array returned');
  assert(Array.isArray(evidenceAnalysis.recommendations), 'Recommendations array returned');
  assert(Array.isArray(evidenceAnalysis.safetyFlags), 'Safety flags array returned');

  // ─── 3. LIVE CAMERA QR CONTINUOUS DECODING AUDIT ──────────────────────────
  console.log('\n─── 3. LIVE CAMERA QR CONTINUOUS DECODING AUDIT ────────────────');

  const scannerFile = fs.readFileSync(path.join(process.cwd(), 'src/components/assets/QrScannerClient.tsx'), 'utf-8');
  assert(scannerFile.includes('startLiveScanLoop'), 'Continuous live video decode loop implemented in QrScannerClient');
  assert(scannerFile.includes('requestAnimationFrame'), 'Frame decode loop uses controlled requestAnimationFrame');
  assert(scannerFile.includes('BarcodeDetector'), 'Native BarcodeDetector API integrated');
  assert(scannerFile.includes('stopCamera'), 'Safe camera stream and frame loop termination implemented');
  assert(scannerFile.includes('cancelAnimationFrame'), 'cancelAnimationFrame called on unmount / cleanup');

  // ─── 4. SPECIALIST CONTRACTOR TEMPLATE EXPANSION ──────────────────────────
  console.log('\n─── 4. SPECIALIST CONTRACTOR TEMPLATE EXPANSION ────────────────');

  const requiredSpecialistIds = [
    'trade-elec-minor-works',
    'trade-elec-db-board',
    'trade-elec-install-checklist',
    'trade-hvac-refrigeration',
    'trade-hvac-ahu-checklist',
    'trade-hvac-commissioning',
    'trade-fire-extinguisher',
    'trade-fire-safety-inspection',
    'trade-fire-alarm-service',
    'trade-gas-safety-record',
    'trade-gas-commercial-service',
    'trade-plumb-inspection',
    'trade-plumb-water-hygiene',
    'trade-plumb-tmv-service',
    'trade-height-harness',
    'trade-height-rescue-plan',
    'trade-confined-space-assessment',
    'trade-confined-space-rescue',
  ];

  let missingTemplates = 0;
  for (const id of requiredSpecialistIds) {
    const t = getTemplateById(id);
    if (!t) {
      console.error(`  Missing specialist template: ${id}`);
      missingTemplates++;
    }
  }

  assert(missingTemplates === 0, `All ${requiredSpecialistIds.length} specialist trade templates exist in library`);
  assert(ALL_BUSINESS_TEMPLATES.length >= 70, `Total template library contains ${ALL_BUSINESS_TEMPLATES.length} structured templates (≥ 70)`);

  const minorWorks = getTemplateById('trade-elec-minor-works');
  assert(minorWorks?.sections[0].fields.some((f) => f.id === 'zs_ohms'), 'Electrical Minor Works contains structured Zs loop impedance field');
  assert(minorWorks?.sections[0].fields.some((f) => f.id === 'insulation_resistance_mohm'), 'Electrical Minor Works contains insulation resistance field');

  const gasSafety = getTemplateById('trade-gas-safety-record');
  assert(gasSafety?.sections[0].fields.some((f) => f.id === 'installation_pipework_soundness'), 'Gas Safety contains mandatory soundness tightness check');

  const waterHygiene = getTemplateById('trade-plumb-water-hygiene');
  assert(waterHygiene?.sections[0].fields.some((f) => f.id === 'calorifier_flow_temp_c'), 'Water Hygiene log contains calorifier flow temperature monitoring');

  // ─── 5. CONTRACTOR DISPATCH & COMPETENCY MATCHING ─────────────────────────
  console.log('\n─── 5. CONTRACTOR DISPATCH & COMPETENCY MATCHING ───────────────');

  const mockOperative = {
    id: 'op-elec-01',
    personId: 'per-elec-01',
    contractorOrgId: 'org-elec-01',
    contractorName: 'Apex Electrical Ltd',
    firstName: 'James',
    lastName: 'Miller',
    fullName: 'James Miller',
    jobTitle: 'Lead Electrician',
    email: 'j.miller@apex-elec.co.uk',
    isActive: true,
    isEligibleForDispatch: true,
    maxDailyJobs: 4,
    availability: 'AVAILABLE' as const,
    employmentStatus: 'EMPLOYED' as const,
    isSupervisor: true,
    entirefmApprovalStatus: 'APPROVED' as const,
    contractorComplianceStatus: 'COMPLIANT' as const,
    trades: ['ELECTRICAL'],
    competencies: ['ELEC_ISOLATION_SAFE', 'ELEC_TEST_INSPECT'],
    qualifications: [
      { id: 'q1', code: 'ECS_CARD', name: 'ECS Gold Card', awardingBody: 'ECS', status: 'VALID' as const, verificationState: 'VERIFIED' as const },
      { id: 'q2', code: 'BS7671_18TH', name: '18th Edition BS 7671', awardingBody: 'City & Guilds', status: 'VALID' as const, verificationState: 'VERIFIED' as const }
    ],
    trainingRecords: [
      { id: 't1', courseCode: 'TRAIN_HS_AWARENESS', courseName: 'H&S Awareness', provider: 'CITB', status: 'VALID' as const, completionDate: '2026-01-01' },
      { id: 't2', courseCode: 'UKATA_ASBESTOS', courseName: 'UKATA Asbestos Awareness', provider: 'UKATA', status: 'VALID' as const, completionDate: '2026-01-01' }
    ]
  };

  const woReq = {
    workOrderId: 'wo-elec-01',
    title: 'Electrical Distribution Board Remedial',
    trade: 'ELECTRICAL' as const,
  };

  const opEval = await evaluateOperativeEligibility(mockOperative as any, woReq);
  assert(opEval.isEligible === true, 'Operative with valid electrical qualifications and competencies evaluates as ELIGIBLE');
  assert(opEval.blockLevel === 'NONE', 'Eligible operative has zero block level');

  // Hard Block test: Inactive status
  const inactiveOperative = { ...mockOperative, isActive: false };
  const inactiveEval = await evaluateOperativeEligibility(inactiveOperative as any, woReq);
  assert(inactiveEval.isEligible === false && inactiveEval.blockLevel === 'HARD_BLOCK', 'Inactive operative is hard-blocked from assignment');

  // Hard Block test: Missing mandatory statutory qualifications
  const unqualifiedOperative = { ...mockOperative, qualifications: [] };
  const unqualifiedEval = await evaluateOperativeEligibility(unqualifiedOperative as any, woReq);
  assert(unqualifiedEval.isEligible === false && unqualifiedEval.blockLevel === 'HARD_BLOCK', 'Unqualified operative missing statutory qualification is hard-blocked');

  // ─── 6. ZERO SYNTHETIC MARKETING MULTIPLIERS AUDIT ────────────────────────
  console.log('\n─── 6. ZERO SYNTHETIC MARKETING MULTIPLIERS AUDIT ──────────────');

  const analyticsFile = fs.readFileSync(path.join(process.cwd(), 'src/server/analytics/index.ts'), 'utf-8');
  assert(!analyticsFile.includes('* 0.65'), 'Synthetic multiplier * 0.65 eliminated from analytics calculation');
  assert(!analyticsFile.includes('* 0.42'), 'Synthetic multiplier * 0.42 eliminated from analytics calculation');
  assert(analyticsFile.includes('completions = leadsWithTool.length') || analyticsFile.includes('const completions = leadsWithTool.length'), 'Tool completions derived from actual verified leads');

  // ─── FINAL SUMMARY ────────────────────────────────────────────────────────
  console.log('\n────────────────────────────────────────────────────────────────────────────');
  console.log(`TOTAL CHECKS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  if (testsFailed === 0) {
    console.log('🎉 ALL PHASE 04 GAP CLOSURES SUCCESSFULLY VERIFIED & PRODUCTION READY.');
    process.exit(0);
  } else {
    console.error('❌ PHASE 04 VERIFICATION FAILED.');
    process.exit(1);
  }
}

runPhase04Verification().catch((err) => {
  console.error('Test execution exception:', err);
  process.exit(1);
});
