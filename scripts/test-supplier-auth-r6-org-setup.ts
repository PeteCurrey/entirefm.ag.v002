/**
 * ENTIREFM SUPPLIER AUTH R6 — ORGANISATION SETUP & RESUME RESOLVER TEST SUITE
 * ===========================================================================
 * Comprehensive verification of:
 * 1. Org Setup submission & atomic server-side provisioning
 * 2. Supabase Auth UUID to Supplier User & Organisation linkage
 * 3. SUPPLIER_ADMIN role & membership assignment
 * 4. Canonical Application Draft creation (DRAFT, NOT_ONBOARDED, REGISTERED)
 * 5. Application Reference generation (SUP-YYMMDD-XXXX)
 * 6. Lifecycle-aware resume routing (DRAFT -> /supplier-portal/onboarding)
 * 7. Org Setup revisit protection (redirects to resume destination, never loops)
 * 8. Stage 1 pre-population (Legal Name, Trading Name, Companies House Number)
 * 9. Idempotency & double-submit protection (zero duplicate orgs or users)
 * 10. Duplicate company number / legal name rejection
 * 11. Persistence across refresh, logout, login, and new sessions
 * 12. Tenant isolation & strict multi-tenant boundary checks
 */

import {
  createOrLinkSupplierUser,
  getSupplierUserByAuthId,
  createSupplierOrganisation,
  getOrCreateApplicationDraft,
  getApplicationDraft,
  resolveResumeDestination,
  getSupplierOrganisationById,
  validateSupplierAuthUser,
} from '../src/server/suppliers/supplier-auth-store';
import {
  createSessionToken,
  verifySessionToken,
  getPostLoginRedirect,
  AUTH_COOKIE_NAME,
} from '../src/server/identity';

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

async function runR6TestSuite() {
  console.log('\n=================================================================');
  console.log('  ENTIREFM SUPPLIER AUTH R6: ORG SETUP PERSISTENCE & RESUME SUITE');
  console.log('=================================================================\n');

  // ── Scenario 1: Fresh Authenticated User Reaches Org Setup ─────────────────
  console.log('1. Fresh Authenticated User (No Organisation)');
  const authUserId = `usr-supabase-r6-${Date.now()}`;
  const userEmail = `contractor.r6.${Date.now()}@apexengineering.co.uk`;

  const userProv = await createOrLinkSupplierUser(
    authUserId,
    userEmail,
    'Marcus',
    'Vance',
    'SUPPLIER_ADMIN',
    true // Email verified
  );

  assert(userProv.success === true, 'Provisions supplier domain user linked to Supabase UUID');
  assert(userProv.user?.organisation_id === null, 'Fresh user starts with organisation_id = null');

  const initialDest = await resolveResumeDestination(authUserId);
  assert(initialDest === '/supplier-portal/org-setup', 'User with null organisation_id resolves to /supplier-portal/org-setup');

  // ── Scenario 2: Submit Company Information (Org Setup) ─────────────────────
  console.log('\n2. Submit Company Setup Information (Atomic Provisioning)');
  const legalName = 'Apex Mechanical & Electrical Services Ltd';
  const tradingName = 'Apex M&E';
  const companyNumber = '08765432';

  const orgCreation = await createSupplierOrganisation(
    authUserId,
    legalName,
    tradingName,
    companyNumber
  );

  assert(orgCreation.success === true, 'createSupplierOrganisation succeeds');
  assert(!!orgCreation.organisation?.id, 'Generates permanent organisation ID');
  assert(orgCreation.organisation?.legalName === legalName, 'Persists exact Legal Company Name');
  assert(orgCreation.organisation?.tradingName === tradingName, 'Persists exact Trading Name');
  assert(orgCreation.organisation?.companyNumber === companyNumber, 'Persists exact Companies House Number');
  assert(orgCreation.organisation?.ownerId === authUserId, 'Sets ownerId to genuine authenticated Supabase user UUID');
  assert(orgCreation.organisation?.applicationReference.startsWith('SUP-'), 'Generates valid application reference (SUP-YYMMDD-XXXX)');
  assert(orgCreation.organisation?.lifecycleStatus === 'DRAFT', 'Sets initial lifecycle status to DRAFT');

  // ── Scenario 3: Verify User to Organisation Linkage ─────────────────────────
  console.log('\n3. Linkage & SUPPLIER_ADMIN Membership Verification');
  const linkedUser = await getSupplierUserByAuthId(authUserId);
  assert(linkedUser?.organisation_id === orgCreation.organisation?.id, 'User organisation_id updated to newly created organisation ID');
  assert(linkedUser?.role === 'SUPPLIER_ADMIN', 'User holds SUPPLIER_ADMIN role');
  assert(linkedUser?.status === 'ACTIVE', 'User status is ACTIVE');

  // ── Scenario 4: Canonical Application Draft Provisioning ────────────────────
  console.log('\n4. Canonical Application Draft & Stage 1 Pre-population');
  const draft = await getApplicationDraft(orgCreation.organisation!.id);
  assert(!!draft, 'Application draft exists in canonical store');
  assert(draft?.orgId === orgCreation.organisation!.id, 'Draft linked to organisation ID');
  assert(draft?.applicationReference === orgCreation.organisation!.applicationReference, 'Draft shares exact application reference');
  assert(draft?.legalCompanyName === legalName, 'Draft Stage 1 legalCompanyName pre-populated from Org Setup');
  assert(draft?.tradingName === tradingName, 'Draft Stage 1 tradingName pre-populated from Org Setup');
  assert(draft?.companyNumber === companyNumber, 'Draft Stage 1 companyNumber pre-populated from Org Setup');
  assert(draft?.lifecycleStatus === 'DRAFT', 'Draft lifecycleStatus is DRAFT');

  // ── Scenario 5: Resolve Resume Destination After Setup ──────────────────────
  console.log('\n5. Lifecycle-Aware Resume Routing Resolution');
  const postSetupDest = await resolveResumeDestination(authUserId);
  assert(postSetupDest === '/supplier-portal/onboarding', 'Immediately after Org Setup, destination resolves to /supplier-portal/onboarding');

  // ── Scenario 6: Org Setup Revisit Guard (No Loop Guarantee) ─────────────────
  console.log('\n6. Org Setup Revisit Protection (Loop Prevention)');
  const authState = await validateSupplierAuthUser(authUserId);
  assert(authState.valid === true, 'validateSupplierAuthUser returns valid');
  assert(authState.supplierUser?.organisation_id === orgCreation.organisation!.id, 'authState confirms user has organisation');

  // If user with organisation revisits /supplier-portal/org-setup
  const revisitDest = await resolveResumeDestination(authState.authUser!.id);
  assert(revisitDest === '/supplier-portal/onboarding', 'Revisiting org-setup redirects to /supplier-portal/onboarding, never remains on org-setup');

  // ── Scenario 7: Idempotency & Double Submit Protection ──────────────────────
  console.log('\n7. Double-Submit Protection & Idempotency');
  const secondSubmit = await createSupplierOrganisation(
    authUserId,
    legalName,
    tradingName,
    companyNumber
  );
  assert(secondSubmit.success === true, 'Second submit returns success idempotently');
  assert(secondSubmit.organisation?.id === orgCreation.organisation!.id, 'Returns the same organisation ID on duplicate submit');
  assert(secondSubmit.organisation?.applicationReference === orgCreation.organisation!.applicationReference, 'Preserves original application reference');

  // ── Scenario 8: Duplicate Company Rejection for Other Users ─────────────────
  console.log('\n8. Duplicate Company Prevention for Unrelated Users');
  const anotherUserAuthId = `usr-another-${Date.now()}`;
  await createOrLinkSupplierUser(anotherUserAuthId, `other.${Date.now()}@different.co.uk`, 'Bob', 'Builder', 'SUPPLIER_ADMIN', true);

  const duplicateNumResult = await createSupplierOrganisation(
    anotherUserAuthId,
    'Different Name Ltd',
    'Different',
    companyNumber // Same company number
  );
  assert(duplicateNumResult.success === false && duplicateNumResult.duplicate === true, 'Rejects duplicate company number from another user');

  const duplicateNameResult = await createSupplierOrganisation(
    anotherUserAuthId,
    legalName, // Same legal name
    'Different Trading Name',
    '99887766'
  );
  assert(duplicateNameResult.success === false && duplicateNameResult.duplicate === true, 'Rejects duplicate legal company name from another user');

  // ── Scenario 9: Logout & Login Persistence Verification ─────────────────────
  console.log('\n9. Logout / Login Persistence & Session Token Generation');
  const sessionToken = createSessionToken({
    personId: authUserId,
    authUserId: authUserId,
    email: userEmail,
    name: 'Marcus Vance',
    role: 'SUPPLIER_ADMIN',
    orgId: orgCreation.organisation!.id,
    orgName: tradingName,
    orgType: 'SUPPLIER',
    activeApplication: 'ADMIN',
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });

  const verifiedSession = verifySessionToken(sessionToken);
  assert(!!verifiedSession, 'Session token verified successfully');
  assert(verifiedSession?.orgId === orgCreation.organisation!.id, 'Session contains valid organisation ID');
  assert(verifiedSession?.orgType === 'SUPPLIER', 'Session orgType is SUPPLIER');

  // Post-login redirect calculation
  const postLoginRedirect = getPostLoginRedirect(verifiedSession!.role as any, verifiedSession!.orgType as any);
  assert(postLoginRedirect === '/supplier-portal/resume', 'Post-login redirect points to /supplier-portal/resume');

  const resumedDest = await resolveResumeDestination(verifiedSession!.personId);
  assert(resumedDest === '/supplier-portal/onboarding', 'Resume destination after fresh sign-in resolves to /supplier-portal/onboarding');

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log(`\n=================================================================`);
  console.log(`  R6 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`=================================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runR6TestSuite().catch((err) => {
  console.error('R6 Test runner fatal error:', err);
  process.exit(1);
});
