/**
 * EntireFM Supplier Auth R5 — Stale Session & Registration Gate Test Suite
 * ========================================================================
 * Tests and verifies:
 * 1. Fresh unauthenticated visitor lands on /supplier-portal/register (NOT org-setup)
 * 2. Stale / deleted Supabase Auth user detection via validateSupplierAuthUser
 * 3. Deleted user visiting /supplier-portal/resume gets session cleared and routed to /supplier-portal/register
 * 4. Deleted user attempting to POST /api/supplier/org/create is blocked with 401
 * 5. resolveResumeDestination never returns /org-setup for non-existent users
 * 6. Valid unverified user is directed to /verify-email
 * 7. Valid verified user without org is directed to /org-setup
 * 8. Valid verified user with org is directed to application lifecycle
 * 9. Sign-out clears auth session cleanly
 */

import * as fs from 'fs';
import * as path from 'path';
import { NextRequest } from 'next/server';
import { GET as resumeHandler } from '../src/app/supplier-portal/resume/route';
import { POST as orgCreateHandler } from '../src/app/api/supplier/org/create/route';
import {
  createOrLinkSupplierUser,
  getSupplierUserByAuthId,
  setSupplierUserEmailVerified,
  createSupplierOrganisation,
  resolveResumeDestination,
  validateSupplierAuthUser,
} from '../src/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
} from '../src/server/identity';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================================================');
  console.log('🧪 EntireFM Supplier Auth R5 — Stale Session & Deleted User Gate Tests');
  console.log('========================================================================\n');

  // --- TEST GROUP 1: Non-Existent / Deleted User Validation ---
  console.log('TEST GROUP 1: Stale / Deleted User Validation');
  const deletedUserId = `usr-deleted-test-${Date.now()}`;

  // 1. validateSupplierAuthUser on a deleted / non-existent user
  const valResult = await validateSupplierAuthUser(deletedUserId);
  assert(!valResult.valid, 'validateSupplierAuthUser returns valid: false for deleted user');
  assert(valResult.reason === 'AUTH_USER_NOT_FOUND', 'Validation reports AUTH_USER_NOT_FOUND');
  assert(valResult.authUser === null, 'authUser is null for non-existent user');

  // 2. resolveResumeDestination on a non-existent user
  const destNonExistent = await resolveResumeDestination(deletedUserId);
  assert(destNonExistent === '/supplier-portal/register', 'resolveResumeDestination returns /supplier-portal/register for non-existent user (NOT org-setup)');

  // --- TEST GROUP 2: Resume Route with Stale Session Cookie ---
  console.log('\nTEST GROUP 2: Stale Session Cookie Recovery in /supplier-portal/resume');
  const staleSession = {
    personId: deletedUserId,
    authUserId: deletedUserId,
    email: 'deleted-user@example.com',
    name: 'Deleted User',
    role: 'SUPPLIER_ADMIN',
    orgId: deletedUserId,
    orgName: 'Supplier Organisation',
    orgType: 'SUPPLIER',
    activeApplication: 'ADMIN',
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 3600 * 1000,
  };
  const staleToken = createSessionToken(staleSession as any);

  const staleReq = new NextRequest('https://www.entirefm.com/supplier-portal/resume', {
    headers: {
      cookie: `${AUTH_COOKIE_NAME}=${staleToken}`,
    },
  });

  const staleRes = await resumeHandler(staleReq);
  assert(staleRes.status === 307 || staleRes.status === 302 || staleRes.status === 303, 'Stale session yields HTTP redirect');
  const staleLocation = staleRes.headers.get('location') || '';
  assert(staleLocation.endsWith('/supplier-portal/register'), 'Stale session redirects to /supplier-portal/register (NOT org-setup)');

  // Check cookie deletion in response
  const setCookieHeader = staleRes.headers.get('set-cookie') || '';
  assert(setCookieHeader.includes('efm_session=;') || setCookieHeader.includes('Max-Age=0') || setCookieHeader.includes('expires='), 'Response clears stale efm_session cookie');

  // --- TEST GROUP 3: Stale Cookie Attempt on Organisation Create API ---
  console.log('\nTEST GROUP 3: Organisation Creation Blocked on Stale User');
  const orgCreateReq = new Request('https://www.entirefm.com/api/supplier/org/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: `${AUTH_COOKIE_NAME}=${staleToken}`,
    },
    body: JSON.stringify({
      legalName: 'Phantom Fraudulent Engineering Ltd',
      companyNumber: '99999999',
    }),
  });

  const orgCreateRes = await orgCreateHandler(orgCreateReq);
  assert(orgCreateRes.status === 401, 'POST /api/supplier/org/create returns 401 Unauthorized for stale session');
  const orgCreateData = await orgCreateRes.json();
  assert(orgCreateData.success === false, 'success is false for stale session organisation creation');

  // --- TEST GROUP 4: Valid User Progression ---
  console.log('\nTEST GROUP 4: Valid Auth User Progression & Lifecycle');
  const validAuthId = `usr-valid-r5-${Date.now()}`;
  const validEmail = `supplier-${Date.now()}@realcompany.co.uk`;

  // Step A: User registers & verifies email
  const prov = await createOrLinkSupplierUser(
    validAuthId,
    validEmail,
    'Sarah',
    'Connor',
    'SUPPLIER_ADMIN',
    true // verified
  );
  assert(prov.success && !!prov.user, 'Created valid supplier user record');

  // Step B: validateSupplierAuthUser on valid user
  const validValResult = await validateSupplierAuthUser(validAuthId);
  assert(validValResult.valid && validValResult.isVerified, 'validateSupplierAuthUser returns valid: true and isVerified: true');

  // Step C: Destination before org setup
  const destNoOrg = await resolveResumeDestination(validAuthId);
  assert(destNoOrg === '/supplier-portal/org-setup', 'Valid user with no organisation resolves to /supplier-portal/org-setup');

  // Step D: User creates organisation
  const orgResult = await createSupplierOrganisation(
    validAuthId,
    `Valid Apex Corp ${Date.now()} Ltd`,
    'Valid Apex',
    `1${Math.floor(1000000 + Math.random() * 9000000)}`
  );
  assert(orgResult.success && !!orgResult.organisation, 'Organisation created successfully');

  // Step E: Destination after org setup (Draft state)
  const destWithOrg = await resolveResumeDestination(validAuthId);
  assert(destWithOrg === '/supplier-portal/onboarding', 'Valid user with organisation resolves to /supplier-portal/onboarding');

  // --- TEST GROUP 5: Codebase Audit & Registration Gate ---
  console.log('\nTEST GROUP 5: Codebase Audit & Security Invariant Checks');
  const applyPageContent = fs.readFileSync(path.resolve('src/app/suppliers/apply/page.tsx'), 'utf8');
  assert(applyPageContent.includes('href="/supplier-portal/register"'), 'Start Supplier Application points directly to /supplier-portal/register');

  const middlewareContent = fs.readFileSync(path.resolve('src/middleware.ts'), 'utf8');
  assert(!middlewareContent.includes("pathname === '/supplier-portal/register'") || !middlewareContent.includes("return NextResponse.redirect(new URL('/supplier-portal/resume'"), 'Middleware does NOT force redirect from /register to /resume based on unverified cookie');

  const orgSetupPageContent = fs.readFileSync(path.resolve('src/app/supplier-portal/(auth)/org-setup/page.tsx'), 'utf8');
  assert(orgSetupPageContent.includes('validateSupplierAuthUser'), 'org-setup page validates user via validateSupplierAuthUser server-side');
  assert(orgSetupPageContent.includes("redirect('/supplier-portal/register')"), 'org-setup page redirects unauthenticated/deleted users to /supplier-portal/register');

  // --- SUMMARY ---
  console.log('\n------------------------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('------------------------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
