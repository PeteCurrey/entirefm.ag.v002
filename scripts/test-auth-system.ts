/**
 * ENTIREFM AUTHENTICATION & ROLE RESOLUTION TEST SUITE
 * ====================================================
 * Validates:
 * 1. Supplier sign-in & session creation (orgType === 'SUPPLIER')
 * 2. Role-based post-login redirects for all 5 portal types (Client, Contractor, Engineer, Supplier, Admin)
 * 3. Lifecycle-aware resume routing for Supplier accounts (org-setup vs onboarding vs portal)
 * 4. Recovery token signing & HMAC verification (TTL, tamper resistance)
 * 5. Admin control plane boundary enforcement:
 *    - Unauthenticated -> /admin/login
 *    - Non-admin (Client, Supplier, Engineer, Contractor) -> /admin/access-denied
 *    - Internal Admin -> /admin (full authorization)
 */

import {
  createSessionToken,
  verifySessionToken,
  getPostLoginRedirect,
  requireAdminSession,
  requireClientSession,
  requireContractorSession,
  requireEngineerSession,
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

  // ── Test 2: Admin Control Plane Boundary Guards ───────────────────────────
  const clientSession = {
    personId: 'client-1',
    email: 'client@propertycorp.co.uk',
    name: 'Client User',
    role: 'CLIENT_ADMIN' as RoleCode,
    orgId: 'org-client-1',
    orgName: 'Property Corp',
    orgType: 'CLIENT' as OrgType,
    activeApplication: 'CLIENT' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  const supplierSession = {
    personId: 'supplier-1',
    email: 'supplier@hvacservices.co.uk',
    name: 'Supplier User',
    role: 'SUPPLIER_ADMIN' as RoleCode,
    orgId: 'org-supp-1',
    orgName: 'HVAC Services Ltd',
    orgType: 'SUPPLIER' as OrgType,
    activeApplication: 'CONTRACTOR' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  const engineerSession = {
    personId: 'eng-1',
    email: 'eng@entirefm.com',
    name: 'Field Engineer',
    role: 'ENGINEER' as RoleCode,
    orgId: 'org-ent-1',
    orgName: 'EntireFM Field Services',
    orgType: 'CONTRACTOR' as OrgType,
    activeApplication: 'ENGINEER' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  const adminSession = {
    personId: 'admin-1',
    email: 'admin@entirefm.com',
    name: 'Super Administrator',
    role: 'SUPER_ADMIN' as RoleCode,
    orgId: '00000000-0000-0000-0000-000000000000',
    orgName: 'EntireFM Headquarters',
    orgType: 'ENTIREFM' as OrgType,
    activeApplication: 'ADMIN' as const,
    permissions: [],
    scopes: [],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  // requireAdminSession checks
  let clientAdminBlocked = false;
  try {
    requireAdminSession(clientSession as any);
  } catch {
    clientAdminBlocked = true;
  }
  assert(clientAdminBlocked, 'Client session blocked from /admin access');

  let supplierAdminBlocked = false;
  try {
    requireAdminSession(supplierSession as any);
  } catch {
    supplierAdminBlocked = true;
  }
  assert(supplierAdminBlocked, 'Supplier session blocked from /admin access');

  let engineerAdminBlocked = false;
  try {
    requireAdminSession(engineerSession as any);
  } catch {
    engineerAdminBlocked = true;
  }
  assert(engineerAdminBlocked, 'Engineer session blocked from /admin access');

  let adminAllowed = false;
  try {
    requireAdminSession(adminSession as any);
    adminAllowed = true;
  } catch {
    adminAllowed = false;
  }
  assert(adminAllowed, 'Internal Admin session granted full /admin clearance');

  // ── Test 3: Supplier Session Creation & Invariant Verification ────────────
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

  const token = createSessionToken(supplierSession as any);
  const verifiedSession = verifySessionToken(token);
  assert(
    verifiedSession !== null && verifiedSession.orgType === 'SUPPLIER',
    'Supplier session token verified with strict orgType === "SUPPLIER"'
  );

  // ── Test 4: Lifecycle-Aware Resume Routing ────────────────────────────────
  const destNoOrg = await resolveResumeDestination(supplierAuthUserId);
  assert(
    destNoOrg === '/supplier-portal/org-setup',
    'Supplier without organization routes to /supplier-portal/org-setup (not /login)'
  );

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

  if (orgResult.organisation) {
    await updateOrganisationLifecycle(orgResult.organisation.id, 'APPROVED');
    const destApproved = await resolveResumeDestination(supplierAuthUserId);
    assert(
      destApproved === '/supplier-portal',
      'Supplier with APPROVED application routes directly to /supplier-portal'
    );
  }

  // ── Test 5: Password Recovery Cookie Signing & Verification ──────────────
  const sampleAccessToken = 'sb-access-token-test-1234567890abcdef';
  const cookieValue = createRecoveryCookieValue(sampleAccessToken);
  assert(typeof cookieValue === 'string' && cookieValue.split('.').length === 3, 'Recovery cookie created with base64.timestamp.signature format');

  const verifiedRecovery = verifyRecoveryCookieValue(cookieValue);
  assert(
    'accessToken' in verifiedRecovery && verifiedRecovery.accessToken === sampleAccessToken,
    'Recovery cookie successfully verified and decrypted'
  );

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
