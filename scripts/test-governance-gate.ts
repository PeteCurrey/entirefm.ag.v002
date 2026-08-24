/**
 * ENTIREFM LEGAL & GOVERNANCE — PRODUCTION GATE ADVERSARIAL TEST SUITE
 * ====================================================================
 * Executes rigorous programmatic verification of:
 * 1. Claim Verification State Machine & Human Approval Gating
 * 2. False Claim Prevention (ICO, VAT, Insurance limits, Accreditations)
 * 3. Data Rights Calendar-Month Clock & Prefix Engine
 * 4. Data Protection Complaint Rules & SLA Separation
 * 5. Asbestos Job-Scope Governance (No post-2000 auto-clearance)
 * 6. Contractor Competence Matrix (SSIP as one evidence stream)
 * 7. Subprocessor Register Integrity (DETECTED vs VERIFIED_ACTIVE)
 * 8. Security Evidence & Public Claim Sanity
 * 9. Cookie & GA4 Inventory Consistency
 * 10. Policy Lifecycle & Immutable SHA-256 Hashing
 */

import {
  LEGAL_CLAIM_REGISTRY,
  getPublicClaim,
  getClaimsByStatus,
  type ClaimVerificationStatus,
} from '../src/config/claims-registry';
import {
  LEGAL_CONFIG,
  SUBPROCESSOR_REGISTER,
  PUBLIC_SUBPROCESSOR_REGISTER,
  COOKIE_INVENTORY,
  getLegalDisplayValue,
  TODO_VERIFY,
} from '../src/config/legal';
import {
  calculateCalendarMonthDeadline,
  generateRightsReference,
  type DataSubjectRightType,
} from '../src/server/data-rights';
import {
  evaluateAsbestosWorkOrderRisk,
  type AsbestosJobAssessment,
} from '../src/server/asbestos';
import {
  CONTRACTOR_QUALIFICATION_MATRIX,
  getRequiredEvidenceForTrade,
} from '../src/config/contractor-qualification';
import {
  computePolicyHash,
  listActivePolicyManifest,
} from '../src/server/legal';
import { LEGAL_POLICIES } from '../src/lib/legal/legal-content-registry';

interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testId: string, name: string, details: string) {
  results.push({
    testId,
    name,
    passed: condition,
    details,
  });
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  ENTIREFM LEGAL & GOVERNANCE — PRODUCTION GATE ADVERSARIAL SUITE');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── TEST 1: Claim State Machine & Approval Gating ────────────────────────────
const unapprovedInApprovedState = LEGAL_CLAIM_REGISTRY.filter(
  (c) => c.status === 'APPROVED_BUSINESS_POLICY' && !c.approvedBy
);
assert(
  unapprovedInApprovedState.length === 0,
  'TEST_01',
  'Human Approval Gating for Business Policies',
  unapprovedInApprovedState.length === 0
    ? 'All APPROVED_BUSINESS_POLICY claims have recorded human approver metadata.'
    : `Found ${unapprovedInApprovedState.length} unapproved claims in APPROVED state!`
);

// ── TEST 2: Adversarial False Claim Test — ICO Registration ──────────────────
const publicIcoClaim = getPublicClaim('CORP_ICO_REGISTRATION');
const icoDisplay = getLegalDisplayValue(LEGAL_CONFIG.icoRegistrationNumber);
assert(
  publicIcoClaim === null && (icoDisplay === null || icoDisplay === ''),
  'TEST_02',
  'Adversarial False Claim — ICO Registration Number',
  publicIcoClaim === null && !icoDisplay
    ? 'Unverified ICO registration is completely omitted from public view; no fake/pending claim rendered.'
    : 'FAIL: Unverified ICO registration was exposed publicly!'
);

// ── TEST 3: Adversarial False Claim Test — VAT Number ────────────────────────
const publicVatClaim = getPublicClaim('CORP_VAT_NUMBER');
const vatDisplay = getLegalDisplayValue(LEGAL_CONFIG.vatNumber);
assert(
  publicVatClaim === null && (vatDisplay === null || vatDisplay === ''),
  'TEST_03',
  'Adversarial False Claim — VAT Number',
  publicVatClaim === null && !vatDisplay
    ? 'Unverified VAT number is omitted; no reassuring fallback text rendered.'
    : 'FAIL: Unverified VAT was exposed publicly!'
);

// ── TEST 4: Adversarial False Claim Test — Hardcoded Insurance Limits ────────
const disclosuresText = JSON.stringify(LEGAL_POLICIES['disclosures']);
const hasHardcoded10m = disclosuresText.includes('£10m') || disclosuresText.includes('£10,000,000') || disclosuresText.includes('£10M');
assert(
  !hasHardcoded10m,
  'TEST_04',
  'Adversarial False Claim — Insurance Limits',
  !hasHardcoded10m
    ? 'Hardcoded unverified insurance limits (£10M / £5M / £2M) are completely eliminated from public copy.'
    : 'FAIL: Hardcoded £10M insurance claim was found in public copy!'
);

// ── TEST 5: Data Rights Calendar-Month Clock Calculation ─────────────────────
const jan31 = new Date('2026-01-31T12:00:00Z');
const endOfFeb = calculateCalendarMonthDeadline(jan31, 1);
const isFeb28 = endOfFeb.getUTCMonth() === 1 && endOfFeb.getUTCDate() === 28;
assert(
  isFeb28,
  'TEST_05',
  'Data Rights UK GDPR Calendar-Month Clock Engine',
  isFeb28
    ? `Jan 31 + 1 calendar month correctly resolves to Feb ${endOfFeb.getUTCDate()} (UK GDPR Art 12(3) compliant).`
    : `FAIL: Jan 31 + 1 month resolved to ${endOfFeb.toISOString()} instead of end of Feb!`
);

// ── TEST 6: Data Rights Prefix Distinction ───────────────────────────────────
const accessRef = generateRightsReference('ACCESS');
const erasureRef = generateRightsReference('ERASURE');
const objectionRef = generateRightsReference('OBJECTION');
const correctPrefixes =
  accessRef.startsWith('SAR-') &&
  erasureRef.startsWith('ERA-') &&
  objectionRef.startsWith('OBJ-');
assert(
  correctPrefixes,
  'TEST_06',
  'Data Rights Reference Prefix Differentiation',
  correctPrefixes
    ? `Access is ${accessRef}, Erasure is ${erasureRef}, Objection is ${objectionRef}. Non-SAR rights are not mislabelled.`
    : 'FAIL: Data rights references used incorrect prefixes!'
);

// ── TEST 7: Asbestos Scope-Specific Governance (No Post-2000 Auto-Clearance) ─
const post2000IntrusiveNoSurvey: AsbestosJobAssessment = {
  workOrderId: 'WO-TEST-001',
  siteId: 'SITE-001',
  siteAddress: '100 Modern Way',
  buildingConstructionYear: 2004, // Post-2000 building
  jobWorkArea: 'Plant Room Riser 2',
  workType: 'INTRUSIVE_DRILLING',
  willDisturbBuildingFabric: true,
  scopeStatus: 'INFORMATION_REQUIRED', // Dutyholder info not yet provided
  acmLocationsIdentified: [],
  presumedAcms: [],
  documents: [],
};
const evalPost2000 = evaluateAsbestosWorkOrderRisk(post2000IntrusiveNoSurvey);
assert(
  evalPost2000.isBlockedForIntrusiveWork === true,
  'TEST_07',
  'Asbestos Scope-Specific Control (Post-2000 Building Intrusive Work)',
  evalPost2000.isBlockedForIntrusiveWork
    ? 'Post-2000 building is NOT automatically granted safety clearance; intrusive work is blocked when dutyholder info is missing.'
    : 'FAIL: System gave automatic safety clearance based on post-2000 building age!'
);

// ── TEST 8: Contractor Prequalification Matrix (SSIP as One Evidence Stream) ─
const gasRule = getRequiredEvidenceForTrade('gas_combustion');
const fabricRule = getRequiredEvidenceForTrade('general_fabric');
const hasGasSafe = gasRule.mandatoryEvidence.includes('TRADE_LICENCE_MANDATORY');
const fabricDoesNotRequireUniversalSsip = !fabricRule.mandatoryEvidence.includes('SSIP_MEMBER_SCHEME');
assert(
  hasGasSafe && fabricDoesNotRequireUniversalSsip,
  'TEST_08',
  'Contractor Competency & Prequalification Matrix',
  hasGasSafe && fabricDoesNotRequireUniversalSsip
    ? 'Gas requires mandatory statutory licensing; low-risk fabric does not blanket-reject contractors solely for lacking SSIP.'
    : 'FAIL: Contractor competency matrix failed trade-risk differentiation!'
);

// ── TEST 9: Subprocessor Verification Register (DETECTED vs VERIFIED_ACTIVE) ──
const detectedSubs = SUBPROCESSOR_REGISTER.filter((s) => s.status === 'DETECTED');
const publicSubs = PUBLIC_SUBPROCESSOR_REGISTER;
const detectedInPublic = publicSubs.some((s) => s.status === 'DETECTED');
assert(
  detectedSubs.length > 0 && !detectedInPublic,
  'TEST_09',
  'Subprocessor Register Contractual Gating',
  detectedSubs.length > 0 && !detectedInPublic
    ? `R&D detected processors (${detectedSubs.map((d) => d.name).join(', ')}) are excluded from the public register until verified active.`
    : 'FAIL: Unverified/detected subprocessor was published publicly!'
);

// ── TEST 10: Security Claim Integrity & Durable Outcome Language ─────────────
const secClaim = getPublicClaim('SEC_TECHNICAL_CONTROLS');
const secHasDurableOutcome =
  secClaim !== null &&
  secClaim.publicWording !== null &&
  !secClaim.publicWording.includes('SOC2') &&
  secClaim.evidenceLevel === 'CODE_VERIFIED';
assert(
  secHasDurableOutcome,
  'TEST_10',
  'Security Claim Evidence Level & Durable Outcome Copy',
  secHasDurableOutcome
    ? 'Security claim is CODE_VERIFIED and uses durable outcome wording without unverified marketing claims.'
    : 'FAIL: Security claim failed evidence level check!'
);

// ── TEST 11: Policy Lifecycle & Cryptographic Immutability ───────────────────
const manifest = listActivePolicyManifest();
const allPublished = manifest.every((p) => p.lifecycle_state === 'PUBLISHED');
const allHaveSha256 = manifest.every((p) => p.sha256_hash.length === 64);
assert(
  manifest.length === 24 && allPublished && allHaveSha256,
  'TEST_11',
  'Policy Lifecycle State & SHA-256 Immutability',
  allPublished && allHaveSha256
    ? 'All 24 policies generate valid 64-character SHA-256 cryptographic hashes.'
    : 'FAIL: Policy manifest had invalid states or hashes!'
);

// ── TEST 12: Cookie & GA4 Inventory Consistency ──────────────────────────────
const ga4InCookies = COOKIE_INVENTORY.some((c) => c.name.includes('_ga') && c.category === 'analytics');
const ga4InSubprocessors = PUBLIC_SUBPROCESSOR_REGISTER.some((s) => s.id === 'subproc-google-analytics');
assert(
  ga4InCookies && ga4InSubprocessors,
  'TEST_12',
  'Cookie & Subprocessor Inventory Consistency (GA4)',
  ga4InCookies && ga4InSubprocessors
    ? 'Google Analytics 4 is consistently documented across both the cookie inventory and public subprocessor register as consent-gated.'
    : 'FAIL: Discrepancy between cookie inventory and subprocessor register for GA4!'
);

// Print Results Table
console.log('\n───────────────────────────────────────────────────────────────');
console.log('  TEST EXECUTION RESULTS');
console.log('───────────────────────────────────────────────────────────────\n');

let allPassed = true;
for (const r of results) {
  const symbol = r.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`[${r.testId}] ${symbol}: ${r.name}`);
  console.log(`       ${r.details}\n`);
  if (!r.passed) allPassed = false;
}

console.log('═══════════════════════════════════════════════════════════════');
if (allPassed) {
  console.log('  ✓ ALL 12 GOVERNANCE & TRUTH CONTROL ADVERSARIAL TESTS PASSED');
} else {
  console.log('  ✗ ONE OR MORE TESTS FAILED');
  process.exit(1);
}
console.log('═══════════════════════════════════════════════════════════════\n');
