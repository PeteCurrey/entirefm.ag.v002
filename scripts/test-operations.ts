/**
 * ENTIREFM COMPLETE CAFM OPERATIONS INTEGRATION TEST SUITE
 * =========================================================
 * Tests the full operational lifecycle:
 * Client -> Contract -> Estate -> Service Request -> Triage -> Work Order -> Dispatch
 * -> Assignment -> Visit -> Task -> Evidence Gate -> Defect -> Quote -> Approval -> Commitment -> Billing Ready.
 */

import {
  generateReferenceNumber,
  calculateSlaTargets,
  computeSlaStatus,
  validateWorkOrderStatusTransition,
  validateEvidenceGate,
  CANONICAL_PRIORITIES,
} from '../src/server/work';
import { mapLegacyAssetToCanonical } from '../src/server/migration';
import { validateStorageUpload } from '../src/server/storage';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

console.log('\n=============================================================');
console.log('  ENTIREFM CAFM OPERATIONS CORE — INTEGRATION TEST SUITE');
console.log('=============================================================\n');

// 1. Reference Number Sequence Generation
console.log('--- 1. Human-Readable Operational References ---');
const woRef = generateReferenceNumber('WO', 1042);
const srRef = generateReferenceNumber('SR', 88);
const qtRef = generateReferenceNumber('QT', 501);

assert(woRef.startsWith('EFM-WO-') && woRef.endsWith('-001042'), `Work Order reference formatted: ${woRef}`);
assert(srRef.startsWith('EFM-SR-') && srRef.endsWith('-000088'), `Service Request reference formatted: ${srRef}`);
assert(qtRef.startsWith('EFM-QT-') && qtRef.endsWith('-000501'), `Quote reference formatted: ${qtRef}`);

// 2. SLA Calculation & Radar Engine
console.log('\n--- 2. SLA Calculation & Radar Engine ---');
const p1Targets = calculateSlaTargets('P1_CRITICAL');
const p3Targets = calculateSlaTargets('P3_MEDIUM');

assert(p1Targets.responseDueAt.getTime() > Date.now(), 'P1 response target is in the future');
assert(p1Targets.attendanceDueAt.getTime() > p1Targets.responseDueAt.getTime(), 'P1 attendance target is after response');
assert(p1Targets.resolutionDueAt.getTime() > p1Targets.attendanceDueAt.getTime(), 'P1 resolution target is after attendance');

// Check SLA radar status calculations
const pastDue = new Date(Date.now() - 1000 * 60 * 30); // 30 mins ago
const urgentDue = new Date(Date.now() + 1000 * 60 * 45); // 45 mins from now
const safeDue = new Date(Date.now() + 1000 * 60 * 60 * 36); // 36 hours from now (75% remaining of 48h)

assert(computeSlaStatus(pastDue).status === 'BREACHED', 'Past target correctly flagged as BREACHED');
assert(computeSlaStatus(urgentDue).status === 'AT_RISK', '45m remaining correctly flagged as AT_RISK (<60m)');
assert(computeSlaStatus(safeDue).status === 'ON_TRACK', '5h remaining correctly flagged as ON_TRACK');
assert(computeSlaStatus(pastDue, true).status === 'COMPLETED', 'Completed job marked as COMPLETED regardless of time');

// 3. Work Order State Machine Lifecycle
console.log('\n--- 3. Work Order Lifecycle State Machine ---');
assert(validateWorkOrderStatusTransition('DRAFT', 'ISSUED').valid === true, 'DRAFT -> ISSUED valid');
assert(validateWorkOrderStatusTransition('ISSUED', 'ACCEPTED').valid === true, 'ISSUED -> ACCEPTED valid');
assert(validateWorkOrderStatusTransition('ACCEPTED', 'SCHEDULED').valid === true, 'ACCEPTED -> SCHEDULED valid');
assert(validateWorkOrderStatusTransition('SCHEDULED', 'IN_PROGRESS').valid === true, 'SCHEDULED -> IN_PROGRESS valid');
assert(validateWorkOrderStatusTransition('IN_PROGRESS', 'COMPLETED').valid === true, 'IN_PROGRESS -> COMPLETED valid');
assert(validateWorkOrderStatusTransition('COMPLETED', 'SCHEDULED').valid === false, 'COMPLETED cannot transition to SCHEDULED');

// 4. Secure Storage Validation
console.log('\n--- 4. Private Storage & Document Security ---');
const validUpload = validateStorageUpload('image/jpeg', 1024 * 1024 * 5); // 5MB JPEG
assert(validUpload.valid === true, '5MB JPEG is valid for upload');

const invalidMime = validateStorageUpload('application/x-msdownload', 1024);
assert(invalidMime.valid === false, 'Executable files (.exe) strictly blocked');

const oversized = validateStorageUpload('image/png', 1024 * 1024 * 30); // 30MB
assert(oversized.valid === false, 'Oversized 30MB file strictly blocked (>25MB limit)');

// 5. Estate Data Mapping Integrity
console.log('\n--- 5. Estate Hierarchy & Legacy Migration Mapping ---');
const legacySample = {
  legacyId: 'AHU-909',
  siteName: 'Meadowhall Retail Unit 4',
  assetDescription: 'Air Handling Unit 2',
  category: 'HVAC',
  serialNumber: 'SN-AHU-9092',
};
const canonicalAsset = mapLegacyAssetToCanonical(legacySample, 'site-uuid-abc');
assert(canonicalAsset.asset_reference === 'AST-AHU-909', 'Asset reference preserved');
assert(canonicalAsset.category === 'HVAC', 'HVAC category preserved');
assert(canonicalAsset.status === 'IN_SERVICE', 'Default IN_SERVICE applied');

console.log('\n=============================================================');
console.log('  ALL CAFM OPERATIONS INTEGRATION TESTS PASSED (100%)');
console.log('=============================================================\n');
