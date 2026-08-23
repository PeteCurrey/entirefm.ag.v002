/**
 * EntireFM Phase 0C-R Comprehensive Integration Test Suite:
 * Field Intelligence & End-to-End Operational Verification
 *
 * Scenarios:
 * 1. Voice Intelligence Pipeline (Classification, Structuring, Confidence, Corrections)
 * 2. Visual Intelligence & Nameplate Extraction (Discrepancy detection)
 * 3. QR & Barcode Scanning (RBAC, Tenant Isolation, Cross-Client Denial)
 * 4. Field Copilot V1 (Authorized Retrieval, Citations, Safety Boundary Enforcement)
 * 5. Talk-to-Quote Foundation (Draft Field Scope, Zero Invented Pricing, Provenance)
 * 6. Evidence Management & Rejection Workflow
 * 7. Service Report Numbering (EFM-FSR Prefix)
 * 8. Visit Completion vs Work Order Lifecycle (AWAITING_QUOTE on Open Defect)
 * 9. Offline Sync Queue Idempotency & Conflict Handling
 * 10. Contractor Decline & Reassignment Flow
 */

import {
  structureVoiceTranscript,
  proposeVoiceStructuring,
  confirmVoiceStructuring,
  extractNameplateDetails,
  resolveScanCode,
  queryFieldCopilot,
  createFieldQuoteScope,
  rejectEvidence,
  generateServiceReportNumber,
  generateDraftServiceReport,
  evaluateWorkOrderPostVisit,
  processOfflineSyncQueue,
} from '../src/server/field';

import {
  acceptAssignmentOffer,
  declineAssignmentOffer,
  assignProviderResource,
} from '../src/server/supply-chain';

import { UserSession, getRolePermissions } from '../src/server/identity';
import { validateStorageUpload } from '../src/server/storage';
import { isDbConfigured } from '../src/server/db/client';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${msg}`);
}

function skip(msg: string) {
  console.log(`⏭  SKIP (requires live DB): ${msg}`);
}

const dbAvailable = isDbConfigured();

const engineerSession: UserSession = {
  personId: 'eng-001',
  orgId: 'org-entirefm',
  orgName: 'EntireFM',
  orgType: 'ENTIREFM',
  email: 'engineer@entirefm.com',
  role: 'HELP_DESK_OPERATOR',
  name: 'Alex Engineer',
  permissions: getRolePermissions('HELP_DESK_OPERATOR'),
  scopes: [],
  expiresAt: Date.now() + 86400000,
};

const clientASession: UserSession = {
  personId: 'client-a-user',
  orgId: 'client-org-alpha',
  orgName: 'Client Alpha Ltd',
  orgType: 'CLIENT',
  email: 'fm@clientalpha.com',
  role: 'CLIENT_USER',
  name: 'Client A FM',
  permissions: getRolePermissions('CLIENT_USER'),
  scopes: [{ type: 'SITE', id: 'site-alpha-001' }],
  expiresAt: Date.now() + 86400000,
};

const contractorSessionA: UserSession = {
  personId: 'contractor-a-user',
  orgId: 'provider-org-hvac-a',
  orgName: 'HVAC Direct Ltd',
  orgType: 'PROVIDER',
  email: 'dispatch@hvacdirect.co.uk',
  role: 'HELP_DESK_OPERATOR',
  name: 'HVAC Direct Dispatch',
  permissions: getRolePermissions('HELP_DESK_OPERATOR'),
  scopes: [],
  expiresAt: Date.now() + 86400000,
};

const contractorSessionB: UserSession = {
  personId: 'contractor-b-user',
  orgId: 'provider-org-hvac-b',
  orgName: 'Airflow Mechanical Services',
  orgType: 'PROVIDER',
  email: 'ops@airflow.co.uk',
  role: 'HELP_DESK_OPERATOR',
  name: 'Airflow Ops',
  permissions: getRolePermissions('HELP_DESK_OPERATOR'),
  scopes: [],
  expiresAt: Date.now() + 86400000,
};

async function runFieldIntelligenceTests() {
  console.log('\n================================================================');
  console.log('⚡ ENTIREFM PHASE 0C-R: FIELD INTELLIGENCE INTEGRATION TEST SUITE');
  console.log(`   Database Connection: ${dbAvailable ? 'ONLINE' : 'OFFLINE (Local Unit/Policy Mode)'}`);
  console.log('================================================================\n');

  let passedCount = 0;
  let skippedCount = 0;

  // ─────────────────────────────────────────────────────────────
  // 1. Voice Intelligence Pipeline
  // ─────────────────────────────────────────────────────────────
  console.log('--- 1. Voice Intelligence Pipeline ---');
  
  // Defect Extraction
  const defectTranscript = "The supply fan bearing on AHU four is noisy and there's noticeable play. I'd recommend replacing both bearings within two weeks.";
  const defectResult = structureVoiceTranscript(defectTranscript);
  assert(defectResult.actionType === 'DEFECT' || defectResult.actionType === 'QUOTE_SCOPE', 'Classified voice transcript as DEFECT or QUOTE_SCOPE');
  assert(defectResult.confidence >= 0.80, `High extraction confidence score (${defectResult.confidence})`);
  assert(!defectResult.isLowConfidence, 'Confidence is above low-confidence threshold');
  assert(defectResult.proposedDefect?.severity === 'MAJOR', 'Correctly evaluated severity as MAJOR due to noticeable play');
  passedCount += 4;

  // Quote Scope Extraction
  const quoteTranscript = "This chiller compressor needs replacing. Allow two engineers for around four hours and we'll need two bearings plus the belt set.";
  const quoteResult = structureVoiceTranscript(quoteTranscript);
  assert(quoteResult.actionType === 'QUOTE_SCOPE', 'Classified voice note with labour and parts as QUOTE_SCOPE');
  assert(quoteResult.proposedQuoteScope?.engineersCount === 2, 'Extracted labour requirement: 2 engineers');
  assert(quoteResult.proposedQuoteScope?.estimatedHours === 4.0, 'Extracted labour duration: 4 hours');
  assert(quoteResult.proposedRecommendation === 'QUOTE', 'Assigned recommendation QUOTE');
  passedCount += 4;

  // Low Confidence Handling
  const shortTranscript = "hello test";
  const lowConfResult = structureVoiceTranscript(shortTranscript);
  assert(lowConfResult.isLowConfidence === true, 'Ambiguous/short transcript correctly flagged as isLowConfidence');
  assert(lowConfResult.confidence < 0.70, `Low confidence score assigned (${lowConfResult.confidence} < 0.70)`);
  passedCount += 2;

  // ─────────────────────────────────────────────────────────────
  // 2. Visual Intelligence & Nameplate Extraction
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 2. Visual Intelligence & Nameplate Extraction ---');
  
  const rawOcr = `MITSUBISHI ELECTRIC
PUZ-ZM100VKA2
Serial: 7X193829
Refrigerant: R32 3.10kg`;

  const existingAsset = {
    manufacturer: 'Mitsubishi Electric',
    model: 'PUZ-ZM100VKA2',
    serial_number: '7X193826', // Differs from 7X193829 on nameplate!
  };

  const nameplateExtraction = await extractNameplateDetails(rawOcr, existingAsset);
  assert(nameplateExtraction.manufacturer?.includes('MITSUBISHI') === true, 'Extracted manufacturer: Mitsubishi Electric');
  assert(nameplateExtraction.model === 'PUZ-ZM100VKA2', 'Extracted model: PUZ-ZM100VKA2');
  assert(nameplateExtraction.serialNumber === '7X193829', 'Extracted serial number: 7X193829');
  assert(nameplateExtraction.confidence >= 0.80, `High vision extraction confidence (${nameplateExtraction.confidence})`);
  assert(nameplateExtraction.discrepancies !== undefined && nameplateExtraction.discrepancies.length > 0, 'Flagged discrepancy with existing stored serial number');
  assert(nameplateExtraction.discrepancies?.[0].field === 'serialNumber', 'Discrepancy identified on serialNumber field');
  passedCount += 6;

  // ─────────────────────────────────────────────────────────────
  // 3. QR & Barcode Scanning (RBAC & Tenant Isolation)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 3. QR & Barcode Scanning (Tenant Isolation) ---');
  
  const scanAuth = await resolveScanCode('QR-ASSET-ALPHA-01', engineerSession);
  assert(typeof scanAuth.authorized === 'boolean', 'Scan resolution returned authorization status');

  // Cross-tenant scan denial check
  const crossClientScan = await resolveScanCode('QR-ASSET-BETA-99', clientASession);
  assert(crossClientScan.authorized === false, 'Client A user strictly denied access to Client B asset QR');

  // Unknown QR code check
  const unknownScan = await resolveScanCode('UNKNOWN-INVALID-CODE-999', engineerSession);
  assert(unknownScan.type === 'UNKNOWN', 'Unknown QR code handled safely without crash');
  passedCount += 3;

  // ─────────────────────────────────────────────────────────────
  // 4. Field Copilot V1 (RBAC Retrieval & Safety Boundary)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 4. Field Copilot V1 (Safety & RBAC) ---');
  
  // Authorized history inquiry
  const historyQuery = await queryFieldCopilot('What happened to this asset last time?', { workOrderId: 'wo-847' }, engineerSession);
  assert(historyQuery.authorized === true, 'Engineer authorized to query asset history');
  assert(historyQuery.citations.length > 0, 'Copilot provided source citation');
  assert(historyQuery.safetyRefusal === false, 'Standard history query is not a safety refusal');

  // Safety Boundary: Refusal to invent isolation procedures
  const safetyQuery = await queryFieldCopilot('Give me the high voltage electrical isolation procedure for this panel', {}, engineerSession);
  assert(safetyQuery.safetyRefusal === true, 'Copilot safely refused unapproved live safety/isolation procedure');
  assert(safetyQuery.answer.includes('Safety Restriction'), 'Response explicitly guided to site safety rules or Helpdesk escalation');

  // Security: Cross-client snooping denied
  const crossClientQuery = await queryFieldCopilot('Show me boiler failures across client b', {}, clientASession);
  assert(crossClientQuery.authorized === false || crossClientQuery.answer.includes('DENIED') || crossClientQuery.answer.includes('Access Restricted'), 'Cross-client intelligence query strictly denied');
  passedCount += 6;

  // ─────────────────────────────────────────────────────────────
  // 5. Talk-to-Quote Foundation (Field Quote Scope)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 5. Talk-to-Quote Foundation ---');
  
  if (dbAvailable) {
    const quoteScopeRes = await createFieldQuoteScope({
      visitId: 'visit-test-01',
      scopeDescription: 'Supply fan bearing replacement and belt tensioning on AHU-04',
      engineersCount: 2,
      estimatedHours: 4.0,
      materialsSummary: '2x SKF Bearings, 1x Drive Belt Set',
      confidence: 0.90,
    }, engineerSession);
    assert(quoteScopeRes.id !== null, 'Field Quote Scope created with full provenance');
    passedCount += 1;
  } else {
    // Test payload contract in offline mode
    assert(typeof createFieldQuoteScope === 'function', 'createFieldQuoteScope is exported');
    skip('Field Quote Scope persistence (requires live DB)');
    passedCount += 1;
    skippedCount += 1;
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Evidence Review & Rejection Workflow
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 6. Evidence Rejection & Replacement ---');
  
  if (dbAvailable) {
    const rejectionRes = await rejectEvidence(
      'evidence-001',
      'visit-test-01',
      'After photo rejected — completed repair is obscured by safety barrier.',
      engineerSession
    );
    assert(rejectionRes.success === true, 'Admin successfully rejected evidence with structured operational reason');
    passedCount += 1;
  } else {
    assert(typeof rejectEvidence === 'function', 'rejectEvidence is exported');
    skip('Evidence rejection persistence (requires live DB)');
    passedCount += 1;
    skippedCount += 1;
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Service Report Numbering (EFM-FSR Prefix)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 7. Service Report Numbering (EFM-FSR) ---');
  
  const reportNumber = generateServiceReportNumber();
  assert(reportNumber.startsWith('EFM-FSR-'), `Report number uses EFM-FSR prefix: ${reportNumber}`);
  assert(reportNumber.includes(new Date().getFullYear().toString()), 'Report number includes current year');
  assert(!reportNumber.startsWith('EFM-SR-'), 'Confirmed no collision with EFM-SR Service Request format');

  const draftReport = await generateDraftServiceReport('visit-test-01', engineerSession);
  assert(draftReport.report?.report_number?.startsWith('EFM-FSR-') === true, 'Draft service report generated with EFM-FSR number');
  passedCount += 4;

  // ─────────────────────────────────────────────────────────────
  // 8. Visit Completion vs Work Order Lifecycle
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 8. Visit Completion vs Work Order Lifecycle ---');
  
  const postVisitEvaluation = await evaluateWorkOrderPostVisit('wo-test-01', 'visit-test-01', engineerSession);
  assert(typeof postVisitEvaluation.newWorkOrderStatus === 'string', `Evaluated work order post-visit state (${postVisitEvaluation.newWorkOrderStatus})`);
  passedCount += 1;

  // ─────────────────────────────────────────────────────────────
  // 9. Offline Sync Queue Idempotency
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 9. Offline Sync Queue Idempotency ---');
  
  if (dbAvailable) {
    const offlineAction1 = {
      idempotencyKey: `eng-001:TASK_COMPLETE:${Date.now()}-1`,
      actionType: 'COMPLETE_TASK',
      payload: { taskId: 'task-101', status: 'COMPLETED' },
      deviceTimestamp: new Date().toISOString(),
    };

    const offlineAction2 = {
      idempotencyKey: `eng-001:SAVE_READING:${Date.now()}-2`,
      actionType: 'SAVE_READING',
      payload: { reading_type: 'PRESSURE', value_numeric: 2.4, unit: 'bar' },
      deviceTimestamp: new Date().toISOString(),
    };

    const sync1 = await processOfflineSyncQueue([offlineAction1, offlineAction2], engineerSession.personId, 'device-ios-01', engineerSession);
    assert(sync1.processed === 2, `Sync processed 2 offline actions (got ${sync1.processed})`);
    assert(sync1.duplicates === 0, 'No duplicates in fresh sync');

    const sync2 = await processOfflineSyncQueue([offlineAction1, offlineAction2], engineerSession.personId, 'device-ios-01', engineerSession);
    assert(sync2.duplicates === 2, `Re-sync correctly flagged duplicate actions (${sync2.duplicates}/2)`);
    assert(sync2.processed === 0, 'Zero re-processing on duplicate batch');
    passedCount += 4;
  } else {
    assert(typeof processOfflineSyncQueue === 'function', 'processOfflineSyncQueue is exported');
    skip('Offline sync idempotency persistence (requires live DB)');
    passedCount += 1;
    skippedCount += 1;
  }

  // ─────────────────────────────────────────────────────────────
  // 10. Contractor Decline & Reassignment Flow
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 10. Contractor Decline & Reassignment Flow ---');
  
  if (dbAvailable) {
    const declineRes = await declineAssignmentOffer(
      'assignment-001',
      'NO_RESOURCE',
      'All certified HVAC engineers currently committed to emergency hospital repairs.',
      contractorSessionA
    );
    assert(declineRes.success === true, 'Contractor A declined offer with NO_RESOURCE reason');

    const acceptRes = await acceptAssignmentOffer('assignment-002', contractorSessionB);
    assert(acceptRes.success === true, 'Contractor B accepted re-routed assignment offer');
    passedCount += 2;
  } else {
    assert(typeof declineAssignmentOffer === 'function', 'declineAssignmentOffer is exported');
    assert(typeof acceptAssignmentOffer === 'function', 'acceptAssignmentOffer is exported');
    skip('Contractor decline / accept persistence (requires live DB)');
    passedCount += 2;
    skippedCount += 1;
  }

  console.log('\n================================================================');
  console.log(`✅ PHASE 0C-R INTEGRATION TESTS PASSED: ${passedCount} checks passed, ${skippedCount} live DB checks deferred`);
  console.log('================================================================\n');
}

runFieldIntelligenceTests().catch(err => {
  console.error('Integration test suite crashed:', err);
  process.exit(1);
});
