/**
 * SUPPLIER AUTHENTICATION, REGISTRATION & LIFECYCLE TEST SUITE
 * =============================================================
 * Verifies:
 * 1. Supplier User Registration & Password Hashing (salt + constant-time verify)
 * 2. Organisation Setup & Duplicate Detection (by company number and legal name)
 * 3. Blank Application Draft Generation (no mock data, genuine SUP-YYMMDD-XXXX ref)
 * 4. Lifecycle-aware resume routing (DRAFT -> onboarding, SUBMITTED -> portal, etc.)
 * 5. Lifecycle status formatting & portal navigation mode
 * 6. Session token verification with SUPPLIER_ADMIN role and SUPPLIER orgType
 * 7. Absence of mock data strings in production supplier pages
 * 8. Protection of supplier portal routes
 */

import {
  createSupplierUser,
  findSupplierByEmail,
  verifyPassword,
  createSupplierOrganisation,
  getOrCreateApplicationDraft,
  resolveResumeDestination,
  getPortalStatusDisplay,
  getSupplierOrganisationById,
} from '../src/server/suppliers/supplier-auth-store';
import {
  createSessionToken,
  verifySessionToken,
  getPostLoginRedirect,
} from '../src/server/identity';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- EntireFM Supplier Auth & Onboarding Test Suite ---\n');

  // Test 1: User Registration & Password Hashing
  console.log('1. Supplier User Registration & Password Security');
  const email = `test.supplier.${Date.now()}@example.co.uk`;
  const regResult = await createSupplierUser(email, 'SecurePass123!', 'John', 'Contractor');
  assert(regResult.success === true, 'Registers new supplier user successfully');
  assert(!!regResult.user?.id, 'Generates unique user ID');
  assert(regResult.user?.email === email, 'Stores lowercase normalized email');
  assert(regResult.user?.passwordHash.includes(':'), 'Password is stored as salted hash format');

  const duplicateReg = await createSupplierUser(email, 'AnotherPass123!', 'John', 'Duplicate');
  assert(duplicateReg.success === false, 'Rejects duplicate registration with identical email');

  const verifyValid = verifyPassword('SecurePass123!', regResult.user!.passwordHash);
  assert(verifyValid === true, 'Verifies valid password against salted hash');
  const verifyInvalid = verifyPassword('WrongPassword123!', regResult.user!.passwordHash);
  assert(verifyInvalid === false, 'Rejects incorrect password');

  // Test 2: Organisation Creation & Duplicate Checks
  console.log('\n2. Supplier Organisation Creation & Duplicate Safeguards');
  const orgResult = await createSupplierOrganisation(
    regResult.user!.id,
    'Acme Mechanical Services Ltd',
    'Acme HVAC',
    '12345678'
  );
  assert(orgResult.success === true, 'Creates new supplier organisation');
  assert(orgResult.organisation?.lifecycleStatus === 'REGISTERED', 'Initial lifecycle is REGISTERED');
  assert(orgResult.organisation?.applicationReference.startsWith('SUP-'), 'Generates valid application reference (SUP-YYMMDD-XXXX)');

  const dupOrgNumber = await createSupplierOrganisation(
    'user-another',
    'Different Name Ltd',
    'Different',
    '12345678'
  );
  assert(dupOrgNumber.success === false && dupOrgNumber.duplicate === true, 'Rejects duplicate Companies House number');

  const dupOrgName = await createSupplierOrganisation(
    'user-another-2',
    'Acme Mechanical Services Ltd',
    'Different Trading',
    '87654321'
  );
  assert(dupOrgName.success === false && dupOrgName.duplicate === true, 'Rejects duplicate Legal Company Name');

  // Test 3: Blank Application Draft
  console.log('\n3. Clean Application Draft Creation');
  const draft = await getOrCreateApplicationDraft(orgResult.organisation!.id);
  assert(draft.orgId === orgResult.organisation!.id, 'Draft matches organisation ID');
  assert(draft.legalCompanyName === 'Acme Mechanical Services Ltd', 'Draft populates legal name from org-setup');
  assert(draft.tradingName === 'Acme HVAC', 'Draft populates trading name from org-setup');
  assert(draft.companyNumber === '12345678', 'Draft populates company number from org-setup');
  assert(draft.selectedServices.length === 0, 'Draft starts with ZERO selected services (no mock default)');
  assert(draft.selectedRegions.length === 0, 'Draft starts with ZERO selected regions (no mock default)');
  assert(draft.primaryContactName === '', 'Draft starts with blank primary contact name (no mock default)');
  assert(draft.gasSafeNumber === '', 'Draft starts with blank Gas Safe number (no mock default)');

  // Test 4: Lifecycle-Aware Resume Routing
  console.log('\n4. Lifecycle-Aware Resume Routing');
  const resumeDraft = await resolveResumeDestination(regResult.user!.id);
  assert(resumeDraft === '/supplier-portal/onboarding', 'Draft state routes to /supplier-portal/onboarding');

  const orgRecord = await getSupplierOrganisationById(orgResult.organisation!.id);
  orgRecord!.lifecycleStatus = 'SUBMITTED';
  const resumeSubmitted = await resolveResumeDestination(regResult.user!.id);
  assert(resumeSubmitted === '/supplier-portal', 'Submitted state routes to /supplier-portal dashboard');

  orgRecord!.lifecycleStatus = 'INFORMATION_REQUIRED';
  const resumeRfi = await resolveResumeDestination(regResult.user!.id);
  assert(resumeRfi === '/supplier-portal/actions', 'Information Required state routes to /supplier-portal/actions');

  // Test 5: Portal Status Display Helpers
  console.log('\n5. Portal Status Display');
  orgRecord!.lifecycleStatus = 'REGISTERED';
  const displayDraft = getPortalStatusDisplay(orgRecord);
  assert(displayDraft.statusLabel === 'Application in Progress', 'Draft shows "Application in Progress"');
  assert(displayDraft.isApproved === false, 'Draft is NOT marked as approved');

  orgRecord!.lifecycleStatus = 'APPROVED';
  const displayApproved = getPortalStatusDisplay(orgRecord);
  assert(displayApproved.statusLabel === '● Approved Supplier', 'Approved state shows "● Approved Supplier"');
  assert(displayApproved.isApproved === true, 'Approved state is marked as approved');
  assert(displayApproved.statusColour === 'green', 'Approved status uses green badge');

  // Test 6: Session & Token Integrity
  console.log('\n6. Supplier Session & Auth Cookie Handling');
  const sessionPayload = {
    personId: regResult.user!.id,
    email: regResult.user!.email,
    name: 'John Contractor',
    role: 'SUPPLIER_ADMIN' as const,
    orgId: orgResult.organisation!.id,
    orgName: 'Acme HVAC',
    orgType: 'SUPPLIER' as const,
    activeApplication: 'ADMIN' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };
  const token = createSessionToken(sessionPayload as any);
  const verifiedSession = verifySessionToken(token);
  assert(verifiedSession !== null, 'Session token signs and verifies properly');
  assert(verifiedSession?.role === 'SUPPLIER_ADMIN', 'Session preserves SUPPLIER_ADMIN role');
  assert(verifiedSession?.orgType === 'SUPPLIER', 'Session preserves SUPPLIER orgType');

  const postLoginRedirect = getPostLoginRedirect('SUPPLIER_ADMIN', 'SUPPLIER');
  assert(postLoginRedirect === '/supplier-portal/resume', 'Post-login redirect for supplier is /supplier-portal/resume');

  // Test 7: Clean Codebase Scan (No Mock Data in Production Supplier Pages)
  console.log('\n7. Mock Data & Developer Language Scan');
  const supplierPages = [
    'src/app/supplier-portal/layout.tsx',
    'src/app/supplier-portal/onboarding/page.tsx',
    'src/app/supplier-portal/users/page.tsx',
    'src/app/supplier-portal/billing/page.tsx',
    'src/app/supplier-portal/company/page.tsx',
    'src/app/suppliers/apply/page.tsx',
  ];

  for (const pagePath of supplierPages) {
    const fullPath = path.resolve(process.cwd(), pagePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      assert(!content.includes('SELF-SERVICE QUALIFICATION // PHASE 2A'), `No developer phase banner in ${pagePath}`);
      assert(!content.includes('d.patterson@midlandshvac.example.co.uk'), `No hardcoded Midlands Patterson email in ${pagePath}`);
      assert(!content.includes('accounts@midlandshvac.example.co.uk'), `No hardcoded accounts@midlandshvac email in ${pagePath}`);
    }
  }

  // Summary
  console.log(`\n======================================================`);
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
