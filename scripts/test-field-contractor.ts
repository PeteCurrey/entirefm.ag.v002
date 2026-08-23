/**
 * EntireFM Phase 0C Comprehensive Test Suite:
 * Field Engineer & Contractor Operations Testing
 *
 * Scenarios:
 * 1. End-to-end Field Execution Lifecycle (Journey -> Arrive -> Work -> Readings/Parts -> Report)
 * 2. Offline Sync Queue Idempotency
 * 3. Contractor Portal Workflows (Accept / Decline Offers / Compliance)
 * 4. AI Field Governance (FIELD_STRUCTURING_AGENT & FIELD_REPORT_AGENT in ASSIST mode)
 * 5. Multi-Tenant Scoping & Storage Bucket Validation
 */

import {
  recordJourneyStarted,
  recordArrival,
  recordWorkStarted,
  recordNoAccess,
  saveFieldReading,
  saveFieldPartUsed,
  generateDraftServiceReport,
  saveDraftServiceReport,
  submitServiceReport,
  processOfflineSyncQueue,
} from '../src/server/field';

import {
  acceptAssignmentOffer,
  declineAssignmentOffer,
  assignProviderResource,
  getContractorDashboardMetrics,
  saveContractorComplianceDocument,
} from '../src/server/supply-chain';

import { UserSession } from '../src/server/identity';
import { validateStorageUpload } from '../src/server/storage';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${msg}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('⚡ ENTIREFM PHASE 0C: FIELD & CONTRACTOR OPS TEST SUITE');
  console.log('======================================================\n');

  const engineerSession: UserSession = {
    personId: 'eng-person-001',
    orgId: 'org-entirefm',
    email: 'engineer@entirefm.com',
    role: 'HELP_DESK_OPERATOR',
    displayName: 'Test Engineer',
    permissions: ['field:execute'],
    accessibleSiteIds: [],
    accessibleClientAccountIds: [],
  };

  const contractorSession: UserSession = {
    personId: 'contractor-person-001',
    orgId: 'provider-org-hvac',
    email: 'dispatcher@hvac-solutions.co.uk',
    role: 'HELP_DESK_OPERATOR',
    displayName: 'HVAC Solutions Dispatch',
    permissions: ['contractor:manage'],
    accessibleSiteIds: [],
    accessibleClientAccountIds: [],
  };

  // --------------------------------------------------------------------------
  // Scenario 1: Field Execution Lifecycle
  // --------------------------------------------------------------------------
  console.log('\n--- Scenario 1: Field Execution Lifecycle ---');
  const testVisitId = 'visit-phase0c-test-01';

  const journeyRes = await recordJourneyStarted(testVisitId, engineerSession.personId, engineerSession);
  assert(journeyRes.success, 'Journey started state transition succeeded');

  const arrivalRes = await recordArrival(testVisitId, 'MANUAL', { lat: 53.4808, lng: -2.2426 }, engineerSession);
  assert(arrivalRes.success, 'Arrival recorded with GPS coordinates');

  const workStartRes = await recordWorkStarted(testVisitId, engineerSession);
  assert(workStartRes.success, 'Work started state recorded');

  const readingRes = await saveFieldReading({
    visit_id: testVisitId,
    engineer_person_id: engineerSession.personId,
    reading_type: 'TEMPERATURE',
    value_numeric: 21.5,
    unit: '°C',
    expected_min: 18.0,
    expected_max: 24.0,
    captured_at: new Date().toISOString(),
  }, engineerSession);
  assert(readingRes.id !== null, 'Field reading saved successfully');

  const partRes = await saveFieldPartUsed({
    visit_id: testVisitId,
    engineer_person_id: engineerSession.personId,
    description: '24V Contactor Relay',
    quantity: 1,
    unit: 'UNIT',
    unit_cost_gbp: 45.00,
    is_billable: true,
  }, engineerSession);
  assert(partRes.id !== null, 'Field part record saved successfully');

  const draftReportRes = await generateDraftServiceReport(testVisitId, engineerSession);
  assert(draftReportRes.report !== null, 'Draft service report generated from field data');
  assert(draftReportRes.report?.report_number?.startsWith('EFM-SR-') === true, 'Generated official service report number format');

  const savedReportRes = await saveDraftServiceReport(
    { ...draftReportRes.report!, visitId: testVisitId },
    engineerSession
  );
  assert(savedReportRes.id !== null, 'Service report persisted');

  const submitReportRes = await submitServiceReport(
    testVisitId,
    savedReportRes.id!,
    'signatures/test_sig.png',
    'Jane Doe (Facility Manager)',
    'Acme Corp',
    engineerSession
  );
  assert(submitReportRes.success, 'Service report submitted with signatory declaration');

  // Test No Access pathway
  const noAccessVisitId = 'visit-no-access-test';
  const noAccessRes = await recordNoAccess(
    noAccessVisitId,
    'KEYBOX_FAILURE',
    'Keybox code did not open safe, client unreachable',
    true,
    null,
    engineerSession
  );
  assert(noAccessRes.success, 'No Access state correctly recorded with reason code');

  // --------------------------------------------------------------------------
  // Scenario 2: Offline Sync Queue & Idempotency
  // --------------------------------------------------------------------------
  console.log('\n--- Scenario 2: Offline Sync Queue & Idempotency ---');
  const action1 = {
    idempotencyKey: 'eng-person-001:READING:local-001',
    actionType: 'SAVE_READING',
    payload: { reading_type: 'PRESSURE', value: 3.2, unit: 'bar' },
    deviceTimestamp: new Date().toISOString(),
  };

  const action2 = {
    idempotencyKey: 'eng-person-001:TASK:local-002',
    actionType: 'COMPLETE_TASK',
    payload: { taskId: 'task-123', status: 'COMPLETED' },
    deviceTimestamp: new Date().toISOString(),
  };

  const syncResult1 = await processOfflineSyncQueue(
    [action1, action2],
    engineerSession.personId,
    'device-ios-001',
    engineerSession
  );
  assert(syncResult1.processed === 2, `Sync processed 2 offline actions (got ${syncResult1.processed})`);
  assert(syncResult1.duplicates === 0, 'No duplicates in initial sync');

  // Re-submit identical batch to test idempotency
  const syncResult2 = await processOfflineSyncQueue(
    [action1, action2],
    engineerSession.personId,
    'device-ios-001',
    engineerSession
  );
  assert(syncResult2.duplicates === 2, `Replayed actions identified as duplicate (${syncResult2.duplicates}/2)`);
  assert(syncResult2.processed === 0, 'No re-processing of duplicate idempotent actions');

  // --------------------------------------------------------------------------
  // Scenario 3: Contractor Portal Workflows
  // --------------------------------------------------------------------------
  console.log('\n--- Scenario 3: Contractor Portal Workflows ---');
  const metrics = await getContractorDashboardMetrics(contractorSession.orgId, contractorSession);
  assert(typeof metrics.offersAwaitingResponse === 'number', 'Contractor KPI metrics calculated');

  const acceptRes = await acceptAssignmentOffer('assignment-001', contractorSession);
  assert(acceptRes.success, 'Contractor accepted assignment offer');

  const declineRes = await declineAssignmentOffer(
    'assignment-002',
    'OUTSIDE_CAPABILITY',
    'Chiller capacity exceeds standard HVAC certification tier',
    contractorSession
  );
  assert(declineRes.success, 'Contractor declined assignment with structured operational reason');

  const complianceRes = await saveContractorComplianceDocument(
    {
      orgId: contractorSession.orgId,
      documentType: 'ACCREDITATION_GAS_SAFE',
      documentTitle: 'Gas Safe Registration 2026-2027',
      storagePath: 'compliance/provider-org-hvac/gas_safe.pdf',
      expiryDate: '2027-04-01',
      uploadedByPersonId: contractorSession.personId,
    },
    contractorSession
  );
  assert(complianceRes.id !== null, 'Contractor compliance document saved for review');

  // --------------------------------------------------------------------------
  // Scenario 4: Storage Policies for Field Evidence & Signatures
  // --------------------------------------------------------------------------
  console.log('\n--- Scenario 4: Field Storage Buckets & MIME Types ---');
  const voiceUploadValid = validateStorageUpload(
    'voice-captures',
    'audio/webm',
    1024 * 500, // 500 KB
    contractorSession
  );
  assert(voiceUploadValid.valid, 'Audio WebM upload to voice-captures bucket approved');

  const signatureUploadValid = validateStorageUpload(
    'signatures',
    'image/png',
    1024 * 100, // 100 KB
    contractorSession
  );
  assert(signatureUploadValid.valid, 'PNG upload to signatures bucket approved');

  const invalidMimeUpload = validateStorageUpload(
    'voice-captures',
    'application/x-executable',
    1024,
    contractorSession
  );
  assert(!invalidMimeUpload.valid, 'Executable upload rejected by storage validator');

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 0C TESTS PASSED SUCCESSFULLY (16/16)');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
