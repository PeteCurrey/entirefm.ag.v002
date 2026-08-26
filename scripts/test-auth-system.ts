/**
 * ENTIREFM AUTHENTICATION & ROLE RESOLUTION TEST SUITE
 * ====================================================
 * Validates:
 * 1. Supplier sign-in & session creation (orgType === 'SUPPLIER')
 * 2. Role-based post-login redirects for all 5 portal types (Client, Contractor, Engineer, Supplier, Admin)
 * 3. Lifecycle-aware resume routing for Supplier accounts (org-setup vs onboarding vs portal)
 * 4. Recovery token signing & HMAC verification (TTL, tamper resistance)
 * 5. Onboarding status separation from authentication status
 */

import {
  createSessionToken,
  verifySessionToken,
  getPostLoginRedirect,
  RoleCode,
  OrgType,
} from '../src/server/identity';
import {
  createRecoveryCookieValue,
  verifyRecoveryCookieValue,
} from '../src/server/auth/recovery-cookie';
import {
  createOrLinkSupplierUser,
  createSupplierOrganisation,
  updateOrganisationLifecycle,
  resolveResumeDestination,
} from '../src/server/suppliers/supplier-auth-store';

async function runAuthTests() {
  console.log('══════════════════════════════════════════════════════');
  console.log('  ENTIREFM AUTHENTICATION & IDENTITY TEST SUITE       ');
  console.log('══════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
    }
  }

  // ── Test 1: Role-Based Post-Login Redirection ─────────────────────────────
  assert(
    getPostLoginRedirect('SUPPLIER_ADMIN', 'SUPPLIER') === '/supplier-portal/resume',
    'Supplier role correctly routes to /supplier-portal/resume'
  );
  assert(
    getPostLoginRedirect('CLIENT_ADMIN', 'CLIENT') === '/clients',
    'Client role correctly routes to /clients'
  );
  assert(
    getPostLoginRedirect('ENGINEER', 'CONTRACTOR') === '/engineer',
    'Engineer role correctly routes to /engineer'
  );
  assert(
    getPostLoginRedirect('CONTRACTOR_ADMIN', 'CONTRACTOR') === '/contractor',
    'Contractor role correctly routes to /contractor'
  );
  assert(
    getPostLoginRedirect('SUPER_ADMIN', 'ENTIREFM') === '/admin',
    'Admin role correctly routes to /admin'
  );

  // ── Test 2: Supplier Session Creation & Invariant Verification ────────────
  const supplierAuthUserId = `auth-user-${Date.now()}`;
  const provResult = await createOrLinkSupplierUser(
    supplierAuthUserId,
    'test.supplier@example.co.uk',
    'Alex',
    'Turner',
    'SUPPLIER_ADMIN',
    true
  );
  assert(
    provResult.success && provResult.user?.role === 'SUPPLIER_ADMIN',
    'Supplier domain user created and linked to Supabase auth user UUID'
  );

  const supplierSession = {
    personId: supplierAuthUserId,
    authUserId: supplierAuthUserId,
    email: 'test.supplier@example.co.uk',
    name: 'Alex Turner',
    role: 'SUPPLIER_ADMIN' as RoleCode,
    orgId: supplierAuthUserId,
    orgName: 'Turner Maintenance Ltd',
    orgType: 'SUPPLIER' as OrgType,
    activeApplication: 'CONTRACTOR' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };

  const token = createSessionToken(supplierSession as any);
  const verifiedSession = verifySessionToken(token);
  assert(
    verifiedSession !== null && verifiedSession.orgType === 'SUPPLIER',
    'Supplier session token verified with strict orgType === "SUPPLIER"'
  );

  // ── Test 3: Lifecycle-Aware Resume Routing ────────────────────────────────
  // Step 3a: User with no organization -> /supplier-portal/org-setup
  const destNoOrg = await resolveResumeDestination(supplierAuthUserId);
  assert(
    destNoOrg === '/supplier-portal/org-setup',
    'Supplier without organization routes to /supplier-portal/org-setup (not /login)'
  );

  // Step 3b: User with draft application -> /supplier-portal/onboarding
  const orgResult = await createSupplierOrganisation(
    supplierAuthUserId,
    'Turner Maintenance Ltd',
    'Turner Maintenance',
    '12345678'
  );
  assert(orgResult.success && !!orgResult.organisation, 'Supplier organisation created');

  const destDraft = await resolveResumeDestination(supplierAuthUserId);
  assert(
    destDraft === '/supplier-portal/onboarding',
    'Supplier with DRAFT application routes to /supplier-portal/onboarding'
  );

  // Step 3c: User with approved application -> /supplier-portal
  if (orgResult.organisation) {
    await updateOrganisationLifecycle(orgResult.organisation.id, 'APPROVED');
    const destApproved = await resolveResumeDestination(supplierAuthUserId);
    assert(
      destApproved === '/supplier-portal',
      'Supplier with APPROVED application routes directly to /supplier-portal'
    );
  }

  // ── Test 4: Password Recovery Cookie Signing & Verification ──────────────
  const sampleAccessToken = 'sb-access-token-test-1234567890abcdef';
  const cookieValue = createRecoveryCookieValue(sampleAccessToken);
  assert(typeof cookieValue === 'string' && cookieValue.split('.').length === 3, 'Recovery cookie created with base64.timestamp.signature format');

  const verifiedRecovery = verifyRecoveryCookieValue(cookieValue);
  assert(
    'accessToken' in verifiedRecovery && verifiedRecovery.accessToken === sampleAccessToken,
    'Recovery cookie successfully verified and decrypted'
  );

  // Test 4b: Tampered cookie rejection
  const tamperedCookie = cookieValue.slice(0, -5) + 'xxxxx';
  const tamperedResult = verifyRecoveryCookieValue(tamperedCookie);
  assert(
    'error' in tamperedResult && tamperedResult.error === 'invalid',
    'Tampered recovery cookie correctly rejected with invalid signature'
  );

  console.log('\n══════════════════════════════════════════════════════');
  console.log(`  RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log('══════════════════════════════════════════════════════\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
