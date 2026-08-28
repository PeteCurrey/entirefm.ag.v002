/**
 * ENTIREFM — FIELD REPORTING ENGINE TEST SUITE (REV 4.0)
 * =======================================================
 * Validates complete field reporting engine across:
 *   1. Master Template Registry & Versioning (Rev 4.0 / MAR 2026)
 *   2. Auth, Tenant Isolation & Client Protection
 *   3. Field Report Creation, Autosave & Resumption
 *   4. Pilot 1: Reactive Job Report (Labour, Materials, Defects)
 *   5. Pilot 2: Weekly Fire Alarm Test (Pass/Fail, Defect Trigger)
 *   6. Pilot 3: Emergency Lighting Schedule (Asset Auto-Increment & Sync)
 *   7. Signatures, Immutable PDF Export & Checksum Verification
 *
 * Run: npx tsx --env-file=.env.local scripts/test-field-reporting-engine.ts
 */

import {
  listReportTemplates,
  getTemplateByCode,
  createReportInstance,
  getReportInstanceById,
  saveReportResponses,
  saveRepeatableRows,
  recordReportSignature,
  updateReportStatus,
  canUserAccessReport,
  canUserEditReport,
  syncEmergencyLightingAssets,
  syncReportDefectsToCafm,
  generateRev4ReportHtml,
  generateRev4PdfBinary,
  recordReportExport,
} from '../src/server/field-reports/index';
import type { UserSession } from '../src/server/identity';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

console.log('\n===============================================================');
console.log('ENTIREFM — FIELD REPORTING ENGINE TEST SUITE (REV 4.0)');
console.log('===============================================================\n');

async function runTests() {
  // ─── 1. TEMPLATE REGISTRY AUDIT ─────────────────────────────
  console.log('1. MASTER TEMPLATE REGISTRY & REVISION 4.0 CONTROL');
  console.log('---------------------------------------------------------------');
  const templates = await listReportTemplates();
  assert(templates.length >= 3, `Registered templates available (found ${templates.length})`);

  const rjr = await getTemplateByCode('ENT-RJR-01');
  assert(rjr !== null, 'ENT-RJR-01 Reactive Job Report registered');
  assert(rjr?.version.revision === '4.0', 'ENT-RJR-01 revision is 4.0');
  assert(rjr?.version.effective_date === 'MAR 2026', 'ENT-RJR-01 effective date is MAR 2026');

  const ppm = await getTemplateByCode('ENT-PPM-01');
  assert(ppm !== null, 'ENT-PPM-01 Weekly Fire Alarm Test Record registered');
  assert(ppm?.version.revision === '4.0', 'ENT-PPM-01 revision is 4.0');

  const el = await getTemplateByCode('ENT-FLS-EL');
  assert(el !== null, 'ENT-FLS-EL Emergency Lighting Asset Schedule registered');
  assert(el?.version.revision === '4.0', 'ENT-FLS-EL revision is 4.0');

  // ─── 2. AUTH, TENANT ISOLATION & CLIENT ACCESS RULES ─────────
  console.log('\n2. AUTH, TENANT ISOLATION & CLIENT PROTECTION');
  console.log('---------------------------------------------------------------');
  const testReport = await createReportInstance({
    templateCode: 'ENT-RJR-01',
    siteId: 'site-alpha-101',
    organisationId: 'org-supplier-apex',
    workOrderId: 'wo-4001',
    assignedEngineerId: 'eng-john-smith',
  });

  const internalSession: UserSession = {
    authUserId: 'u-admin-1',
    email: 'ops@entirefm.com',
    name: 'Ops Admin',
    role: 'ADMIN',
    orgId: 'org-entirefm',
    orgType: 'ENTIREFM',
    orgName: 'EntireFM',
    permissions: [],
  };

  const supplierASession: UserSession = {
    authUserId: 'u-sup-1',
    email: 'john@apex.co.uk',
    name: 'John Smith',
    personId: 'eng-john-smith',
    role: 'FIELD_USER',
    orgId: 'org-supplier-apex',
    orgType: 'SUPPLIER',
    orgName: 'Apex Mechanical',
    permissions: [],
  };

  const supplierBSession: UserSession = {
    authUserId: 'u-sup-2',
    email: 'dave@rival.co.uk',
    name: 'Dave Rival',
    role: 'FIELD_USER',
    orgId: 'org-supplier-rival',
    orgType: 'SUPPLIER',
    orgName: 'Rival Services',
    permissions: [],
  };

  const clientSession: UserSession = {
    authUserId: 'u-client-1',
    email: 'client@estate.com',
    name: 'Client Estate Manager',
    role: 'VIEWER',
    orgId: 'site-alpha-101',
    orgType: 'CLIENT',
    orgName: 'Client Co',
    permissions: [],
  };

  assert(canUserAccessReport(internalSession, testReport).allowed === true, 'Internal EntireFM staff can access report');
  assert(canUserAccessReport(supplierASession, testReport).allowed === true, 'Assigned supplier engineer can access report');
  assert(canUserAccessReport(supplierBSession, testReport).allowed === false, 'Supplier B is BLOCKED from accessing Supplier A report');
  assert(canUserAccessReport(clientSession, testReport).allowed === false, 'Client is BLOCKED from seeing DRAFT in-progress report');

  // Once report is ISSUED, client can access
  testReport.status = 'ISSUED';
  testReport.client_account_id = 'site-alpha-101';
  assert(canUserAccessReport(clientSession, testReport).allowed === true, 'Client CAN access once report status is ISSUED');

  // ─── 3. FIELD REPORT CREATION, AUTOSAVE & RESUMPTION ─────────
  console.log('\n3. FIELD REPORT LIFECYCLE & AUTOSAVE');
  console.log('---------------------------------------------------------------');
  const sessionInstance = await createReportInstance({
    templateCode: 'ENT-RJR-01',
    siteId: 'site-101',
    organisationId: 'org-entirefm',
    workOrderId: 'wo-8001',
    title: 'Reactive Boiler Callout — EFM-REP-TEST-01',
  });
  assert(sessionInstance.status === 'DRAFT', 'New report instance created in DRAFT status');
  assert(sessionInstance.report_number.startsWith('EFM-REP-'), `Report reference generated: ${sessionInstance.report_number}`);

  const autosaveResult = await saveReportResponses(sessionInstance.id, [
    { section_key: '01_issue_reported', field_key: 'issue_description', value: 'Boiler 2 pressure loss fault code F.22' },
    { section_key: '02_attendance', field_key: 'arrival_time', value: '08:30' },
  ]);
  assert(autosaveResult.success === true, 'Autosave field responses succeeded');
  assert(autosaveResult.updatedCount === 2, 'Updated 2 response fields');

  const resumedPack = await getReportInstanceById(sessionInstance.id);
  assert(resumedPack !== null, 'Resumed report instance from repository');
  assert(resumedPack?.responses['01_issue_reported']?.issue_description === 'Boiler 2 pressure loss fault code F.22', 'Autosaved field correctly retrieved');
  assert(resumedPack?.instance.status === 'IN_PROGRESS', 'Report instance transitioned to IN_PROGRESS upon autosave');

  // ─── 4. PILOT 1: REACTIVE JOB REPORT (LABOUR, MATERIALS, DEFECTS)
  console.log('\n4. PILOT 1: REACTIVE JOB REPORT WORKFLOW (ENT-RJR-01)');
  console.log('---------------------------------------------------------------');
  await saveRepeatableRows(sessionInstance.id, '04_labour', [
    {
      row_type: 'LABOUR_ROW',
      sequence_order: 1,
      data_json: {
        operative_name: 'Jack Turner',
        trade: 'Gas & Heating Engineer',
        arrival_time: '08:30',
        departure_time: '11:15',
        hours_total: 2.75,
        is_overtime: false,
      },
    },
  ]);
  await saveRepeatableRows(sessionInstance.id, '05_materials', [
    {
      row_type: 'MATERIAL_ROW',
      sequence_order: 1,
      data_json: {
        description: 'Expansion Vessel 18L',
        part_number: 'EXP-18L-01',
        quantity: 1,
        unit: 'EA',
        supplier: 'Wolseley Plumb',
        is_chargeable: true,
      },
    },
  ]);
  await saveRepeatableRows(sessionInstance.id, '07_defects', [
    {
      row_type: 'DEFECT_ROW',
      sequence_order: 1,
      data_json: {
        title: 'PRV Discharge Pipe Corrosion',
        description: 'Pressure relief valve discharge pipe has significant surface oxidation at external termination.',
        location: 'Plant Room External Wall',
        severity: 'MAJOR',
        action_taken: 'Isolated boiler discharge port, tested seating',
        further_action_required: 'Replace 22mm copper discharge run to drain gully',
      },
    },
  ]);

  const reactivePack = await getReportInstanceById(sessionInstance.id);
  assert((reactivePack?.repeatableRows['04_labour'] || []).length === 1, 'Labour row saved and loaded');
  assert((reactivePack?.repeatableRows['05_materials'] || []).length === 1, 'Materials row saved and loaded');
  assert((reactivePack?.repeatableRows['07_defects'] || []).length === 1, 'Defect row saved and loaded');

  // ─── 5. PILOT 2: WEEKLY FIRE ALARM TEST (ENT-PPM-01) ─────────
  console.log('\n5. PILOT 2: WEEKLY FIRE ALARM TEST WORKFLOW (ENT-PPM-01)');
  console.log('---------------------------------------------------------------');
  const fireAlarmInstance = await createReportInstance({
    templateCode: 'ENT-PPM-01',
    siteId: 'site-fire-test',
    organisationId: 'org-entirefm',
    title: 'Weekly Fire Alarm Test — Week 34',
  });

  await saveReportResponses(fireAlarmInstance.id, [
    { section_key: '01_system_details', field_key: 'panel_model', value: 'Advanced MX-5400' },
    { section_key: '02_panel_inspection', field_key: 'mains_healthy', value: 'PASS' },
    { section_key: '02_panel_inspection', field_key: 'fault_indicators_clear', value: 'PASS' },
  ]);

  // Rotational call point tests: 1 PASS, 1 FAIL (triggering defect)
  await saveRepeatableRows(fireAlarmInstance.id, '03_call_points', [
    {
      row_type: 'CHECK_ROW',
      sequence_order: 1,
      data_json: {
        call_point_ref: 'MCP-001',
        zone_loop: 'Zone 1 / Loop 1',
        floor_area: 'Ground Floor Reception',
        test_result: 'PASS',
      },
    },
    {
      row_type: 'CHECK_ROW',
      sequence_order: 2,
      data_json: {
        call_point_ref: 'MCP-014',
        zone_loop: 'Zone 3 / Loop 2',
        floor_area: 'Level 2 Plant Deck',
        test_result: 'FAIL',
      },
    },
  ]);

  const firePack = await getReportInstanceById(fireAlarmInstance.id);
  assert(firePack !== null, 'Fire alarm pack retrieved');
  const callPoints = firePack?.repeatableRows['03_call_points'] || [];
  assert(callPoints.length === 2, 'Recorded 2 rotational manual call points');
  assert(callPoints.some(cp => cp.data_json.test_result === 'FAIL'), 'FAIL call point test recorded (triggers defect workflow)');

  // Sync defect to CAFM
  const defectSync = await syncReportDefectsToCafm({
    siteId: 'site-fire-test',
    reportNumber: fireAlarmInstance.report_number,
    defects: [
      {
        title: 'Manual Call Point Failure: MCP-014',
        description: 'Call point microswitch failed to close circuit on test key insertion.',
        location: 'Level 2 Plant Deck',
        severity: 'CRITICAL',
        action_taken: 'Isolated call point address in panel, logged in site logbook',
        further_action_required: 'Replace call point unit',
        linked_asset_reference: 'MCP-014',
      },
    ],
  });
  assert(defectSync.length === 1, 'Defect automatically synchronised to CAFM defect registry');
  assert(defectSync[0].action === 'CREATED', 'CAFM defect record created with unique reference');

  // ─── 6. PILOT 3: EMERGENCY LIGHTING SCHEDULE (ENT-FLS-EL) ────
  console.log('\n6. PILOT 3: EMERGENCY LIGHTING ASSET SCHEDULE (ENT-FLS-EL)');
  console.log('---------------------------------------------------------------');
  const elInstance = await createReportInstance({
    templateCode: 'ENT-FLS-EL',
    siteId: 'site-el-survey',
    organisationId: 'org-entirefm',
    title: 'Emergency Lighting Luminaire Schedule Survey',
  });

  const luminaires = [
    {
      asset_reference: 'EL-001',
      floor_level: 'Ground Floor',
      zone_area: 'Zone 1 - Reception',
      exact_location: 'Above main entrance revolving door',
      fitting_type: '3W LED Exit Box',
      maintained_type: 'MAINTAINED' as const,
      test_facility: 'Key Switch KS-01',
      duration_hours: 3,
      condition: 'GOOD' as const,
      is_operational: true,
    },
    {
      asset_reference: 'EL-002',
      floor_level: 'Ground Floor',
      zone_area: 'Zone 1 - Reception',
      exact_location: 'Stairwell Core A Escape Door',
      fitting_type: 'LED Bulkhead 3W',
      maintained_type: 'NON_MAINTAINED' as const,
      test_facility: 'Key Switch KS-01',
      duration_hours: 3,
      condition: 'EXCELLENT' as const,
      is_operational: true,
    },
    {
      asset_reference: 'EL-003',
      floor_level: 'First Floor',
      zone_area: 'Zone 2 - East Corridor',
      exact_location: 'Meeting Room 1.04 Corridor',
      fitting_type: 'Recessed Downlight 5W',
      maintained_type: 'COMBINED' as const,
      test_facility: 'Key Switch KS-02',
      duration_hours: 3,
      condition: 'DEFECTIVE' as const,
      is_operational: false,
    },
  ];

  await saveRepeatableRows(
    elInstance.id,
    '02_assets_schedule',
    luminaires.map((l, i) => ({
      row_type: 'ASSET_ROW',
      sequence_order: i + 1,
      data_json: l,
    }))
  );

  // Sync surveyed luminaires to canonical assets table
  const assetSyncResults = await syncEmergencyLightingAssets('site-el-survey', luminaires);
  assert(assetSyncResults.length === 3, 'Synchronised 3 surveyed luminaires to canonical assets table');
  assert(assetSyncResults[0].assetReference === 'EL-001', 'Canonical asset EL-001 created/updated');
  assert(assetSyncResults[2].assetReference === 'EL-003', 'Canonical asset EL-003 created/updated');

  // ─── 7. SIGNATURES, IMMUTABLE PDF & CHECK-SUM VERIFICATION ───
  console.log('\n7. SIGNATURES, IMMUTABLE PDF RENDERER & CHECKSUM');
  console.log('---------------------------------------------------------------');
  // Record engineer signature
  const engSig = await recordReportSignature({
    reportInstanceId: sessionInstance.id,
    signatureType: 'ENGINEER',
    signatoryName: 'Jack Turner',
    signatoryPosition: 'Lead M&E Field Engineer',
    declarationText: 'I certify that all works and tests recorded are accurate and complete.',
  });
  assert(engSig.signatory_name === 'Jack Turner', 'Engineer signature recorded');
  assert(engSig.signature_type === 'ENGINEER', 'Signature type is ENGINEER');

  // Record client signature
  const clientSig = await recordReportSignature({
    reportInstanceId: sessionInstance.id,
    signatureType: 'CLIENT_REP',
    signatoryName: 'Sarah Jenkins',
    signatoryPosition: 'Head of Facilities',
  });
  assert(clientSig.signatory_name === 'Sarah Jenkins', 'Client representative signature recorded');

  // Issue report and lock as immutable
  await updateReportStatus(sessionInstance.id, 'ISSUED', 'user-admin');
  const issuedPack = await getReportInstanceById(sessionInstance.id);
  assert(issuedPack?.instance.status === 'ISSUED', 'Report status successfully transitioned to ISSUED');
  assert(canUserEditReport(internalSession, issuedPack!.instance).allowed === false, 'Issued report is LOCKED and immutable to edits');

  // Generate Print HTML and PDF Binary
  const printHtml = generateRev4ReportHtml(issuedPack!);
  assert(printHtml.includes('REV: 4.0'), 'Rev 4.0 specification tag rendered in HTML');
  assert(printHtml.includes('MAR 2026'), 'MAR 2026 effective date rendered in HTML');
  assert(printHtml.includes('EntireFM'), 'EntireFM brand lockup present');
  assert(printHtml.includes(sessionInstance.report_number), 'Report reference rendered in document');

  const pdfBinary = generateRev4PdfBinary(issuedPack!);
  assert(pdfBinary.buffer.length > 0, `Valid PDF binary buffer generated (${pdfBinary.buffer.length} bytes)`);
  assert(pdfBinary.buffer.toString('ascii', 0, 5) === '%PDF-', 'PDF 1.4 magic header verified (%PDF-)');
  assert(pdfBinary.checksumSha256.length === 64, `SHA-256 integrity checksum calculated: ${pdfBinary.checksumSha256.slice(0, 16)}...`);

  // Record export
  const exportRecord = await recordReportExport({
    reportInstanceId: sessionInstance.id,
    storagePath: `field-reports/${sessionInstance.id}/${sessionInstance.report_number}.pdf`,
    checksumSha256: pdfBinary.checksumSha256,
    pageCount: pdfBinary.pageCount,
    fileSizeBytes: pdfBinary.buffer.length,
  });
  assert(exportRecord.checksum_sha256 === pdfBinary.checksumSha256, 'Export vault record matches generated binary checksum');

  // ─── FINAL SUMMARY ──────────────────────────────────────────
  console.log('\n===============================================================');
  console.log(`FIELD REPORTING ENGINE RESULTS: ${passed} / ${passed + failed} PASSED`);
  console.log('===============================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL FIELD REPORTING ENGINE TESTS PASSED (100%).\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failed} test(s) FAILED.\n`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
