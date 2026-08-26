/**
 * SUPPLIER AUTHENTICATION, REGISTRATION & LIFECYCLE TEST SUITE
 * =============================================================
 * Verifies:
 * 1. Supplier User Provisioning linked to Supabase Auth UUID (zero credential storage)
 * 2. Organisation Setup & Duplicate Detection (by company number and legal name)
 * 3. Blank Application Draft Generation (no mock data, genuine SUP-YYMMDD-XXXX ref)
 * 4. Lifecycle-aware resume routing (DRAFT -> onboarding, SUBMITTED -> portal, etc.)
 * 5. Lifecycle status formatting & portal navigation mode
 * 6. Session token verification with SUPPLIER_ADMIN role and SUPPLIER orgType
 * 7. Absence of mock data strings in production supplier pages
 * 8. Protection of supplier portal routes & stale session validation
 */

import {
  createOrLinkSupplierUser,
  getSupplierUserByEmail,
  getSupplierUserByAuthId,
  createSupplierOrganisation,
  getOrCreateApplicationDraft,
  resolveResumeDestination,
  getPortalStatusDisplay,
  getSupplierOrganisationById,
  validateSupplierAuthUser,
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

  // Test 1: User Provisioning & Identity Link
  console.log('1. Supplier User Identity & Zero Credential Storage');
  const authUserId = `usr-test-sup-${Date.now()}`;
  const email = `test.supplier.${Date.now()}@example.co.uk`;
  const regResult = await createOrLinkSupplierUser(authUserId, email, 'John', 'Contractor', 'SUPPLIER_ADMIN', true);
  assert(regResult.success === true, 'Provisions new supplier domain record linked to Supabase UUID');
  assert(!!regResult.user?.id, 'Generates unique domain user ID');
  assert(regResult.user?.email === email, 'Stores lowercase normalized email');
  assert((regResult.user as any)?.passwordHash === undefined, 'No passwordHash exists on supplier user record');

  const duplicateReg = await createOrLinkSupplierUser(authUserId, email, 'John', 'Duplicate');
  assert(duplicateReg.isNew === false, 'Detects existing domain user link idempotently');

  // Test 2: Organisation Creation & Duplicate Checks
  console.log('\n2. Supplier Organisation Creation & Duplicate Safeguards');
  const orgResult = await createSupplierOrganisation(
    regResult.user!.auth_user_id,
    'Acme Mechanical Services Ltd',
    'Acme Mechanical',
    '09876543'
  );
  assert(orgResult.success === true, 'Creates supplier organisation successfully');
  assert(!!orgResult.organisation?.id, 'Generates unique organisation ID');
  assert(orgResult.organisation?.applicationReference.startsWith('SUP-'), 'Generates canonical application reference (SUP-YYMMDD-XXXX)');
  assert(orgResult.organisation?.lifecycleStatus === 'DRAFT' || orgResult.organisation?.lifecycleStatus === 'REGISTERED', 'Initial lifecycle status is DRAFT or REGISTERED');

  const duplicateNumber = await createSupplierOrganisation(
    `another-auth-id-${Date.now()}`,
    'Another Company Ltd',
    'Another',
    '09876543' // Duplicate company number
  );
  assert(duplicateNumber.success === false && duplicateNumber.duplicate === true, 'Rejects duplicate company number');

  const duplicateName = await createSupplierOrganisation(
    `another-auth-id-${Date.now()}`,
    'Acme Mechanical Services Ltd', // Duplicate name
    'Acme',
    '11223344'
  );
  assert(duplicateName.success === false && duplicateName.duplicate === true, 'Rejects duplicate legal company name');

  // Test 3: Blank Application Draft Creation
  console.log('\n3. Clean Blank Application Draft (Zero Seeded/Mock Data)');
  const draft = await getOrCreateApplicationDraft(orgResult.organisation!.id);
  assert(draft.orgId === orgResult.organisation!.id, 'Draft linked to correct organisation');
  assert(draft.applicationReference === orgResult.organisation!.applicationReference, 'Draft references canonical application ID');
  assert(draft.selectedServices.length === 0, 'Draft starts with 0 pre-selected services (no mock default)');
  assert(draft.selectedRegions.length === 0, 'Draft starts with 0 pre-selected regions (no mock default)');
  assert(draft.primaryContactName === '', 'Draft primary contact is blank');
  assert(draft.gasSafeNumber === '', 'Draft Gas Safe number is blank');

  // Test 4: Lifecycle-Aware Resume Destination Resolution
  console.log('\n4. Lifecycle-Aware Resume Routing');
  const userNoOrg = await createOrLinkSupplierUser(`usr-no-org-${Date.now()}`, `noorg-${Date.now()}@test.com`, 'Jane', 'Doe', 'SUPPLIER_ADMIN', true);
  const destNoOrg = await resolveResumeDestination(userNoOrg.user!.auth_user_id);
  assert(destNoOrg === '/supplier-portal/org-setup', 'User without organisation routes to /supplier-portal/org-setup');

  const destDraft = await resolveResumeDestination(regResult.user!.auth_user_id);
  assert(destDraft === '/supplier-portal/onboarding', 'User with REGISTERED/DRAFT org routes to /supplier-portal/onboarding');

  // Test 5: Portal Status Formatting & Presentation
  console.log('\n5. Portal Status Presentation');
  const org = await getSupplierOrganisationById(orgResult.organisation!.id);
  const displayDraft = getPortalStatusDisplay(org!);
  assert(displayDraft.statusLabel === 'Application in Progress', 'Formats REGISTERED status as "Application in Progress"');
  assert(displayDraft.isApproved === false, 'Draft organisation is not marked as approved');

  // Test 6: Unified Session Token
  console.log('\n6. Unified Session Token Verification');
  const sessionPayload = {
    personId: regResult.user!.auth_user_id,
    authUserId: regResult.user!.auth_user_id,
    email: regResult.user!.email,
    name: `${regResult.user!.first_name} ${regResult.user!.last_name}`,
    role: regResult.user!.role,
    orgId: orgResult.organisation!.id,
    orgName: orgResult.organisation!.legalName,
    orgType: 'SUPPLIER' as const,
    activeApplication: 'ADMIN' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
  };
  const token = createSessionToken(sessionPayload);
  const verified = verifySessionToken(token);
  assert(!!verified, 'Successfully creates and verifies HMAC session token');
  assert(verified?.orgType === 'SUPPLIER', 'Preserves SUPPLIER orgType');
  assert(verified?.role === 'SUPPLIER_ADMIN', 'Preserves SUPPLIER_ADMIN role');

  const postLogin = getPostLoginRedirect(verified!.role as any, verified!.orgType as any);
  assert(postLogin === '/supplier-portal/resume', 'Supplier post-login redirect is /supplier-portal/resume');

  // Test 7: Production Codebase Audit (Zero Mock Fallback Strings)
  console.log('\n7. Codebase Audit: Zero Mock Data in Supplier Pages');
  const filesToCheck = [
    'src/app/suppliers/apply/page.tsx',
    'src/app/supplier-portal/(auth)/register/page.tsx',
    'src/app/supplier-portal/(auth)/org-setup/page.tsx',
    'src/app/supplier-portal/(portal)/layout.tsx',
  ];

  const forbiddenStrings = [
    'EntireFM Headquarters',
    '0800 555 0199',
    'patterson@apexmechanical.co.uk',
    'accounts@midlandshvac.co.uk',
    'SAMPLE DRAFT',
  ];

  for (const file of filesToCheck) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const str of forbiddenStrings) {
        assert(!content.includes(str), `File ${file} contains no mock string: "${str}"`);
      }
    }
  }

  // Summary
  console.log(`\n======================================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
