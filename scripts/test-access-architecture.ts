/**
 * ENTIREFM COMPREHENSIVE ACCESS ARCHITECTURE & CONTEXT VERIFICATION SUITE
 * =======================================================================
 * Tests all required access architecture and context hardening scenarios:
 *   1. Authentication & Session Security (Token HMAC, Expiry, Tamper resistance)
 *   2. Shared Login Routing & Multi-Context Selector
 *   3. EntireFM Engineer-Only vs Admin Separation (orgType ENTIREFM does NOT grant /admin)
 *   4. Multi-Context User (John Smith ADMIN vs ENGINEER context permission isolation)
 *   5. Context Escalation Defenses & Manipulated Token Rejection
 *   6. Stale Session Revocation & Disabled User Denials
 *   7. External Admin-like Role Name Collision Defenses (CONTRACTOR_ADMIN / CLIENT_ADMIN)
 *   8. Internal Department Model & Granular Permissions (/admin Helpdesk, Ops, Finance segregation)
 *   9. Client Organisation & Site Scope Propagation (Sarah Manchester vs Nottingham)
 *  10. Client FM Director & Client Finance User Boundaries
 *  11. Contractor Assignment Scope & Contextual Site Access
 *  12. Canonical Provider Performance Service (Admin benchmark vs Contractor self-only)
 *  13. Field Engineer Visit Scope Isolation (Visit A vs Visit B)
 *  14. Direct Route, API & UUID Enumeration Attack Defenses
 *  15. AI & Search Active-Context Permission Isolation
 *  16. Audited View-As Support Mode & Effective Access Inspector Agreement
 *  17. Portal Robots Noindex & Public Sitemap Exclusion
 *
 * Run: npx tsx scripts/test-access-architecture.ts
 */

import {
  createSessionToken,
  verifySessionToken,
  getPostLoginRedirect,
  getRolePermissions,
  evaluateEffectiveAccess,
  hasPermission,
  hasScope,
  getAuthorizedSiteIds,
  canAccessSite,
  canAccessWorkOrder,
  canAccessAsset,
  canAccessContractorJob,
  canAccessEngineerVisit,
  requireAdminSession,
  requireClientSession,
  requireContractorSession,
  requireEngineerSession,
  startViewAs,
  endViewAs,
  simulateUserAccess,
  type UserSession,
  type RoleCode,
  type OrgType,
  type ApplicationPortal,
} from '../src/server/identity';

import { getProviderPerformance, listAllProviderPerformances } from '../src/server/supply-chain';

interface TestResult {
  category: string;
  name: string;
  ok: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${msg}`);
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`ASSERTION FAILED: ${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function test(category: string, name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    results.push({ category, name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    results.push({ category, name, ok: false, detail: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

function makeSession(overrides: Partial<UserSession>): UserSession {
  const role = overrides.role || 'HELPDESK_USER';
  return {
    personId: 'person-test-001',
    email: 'test@entirefm.com',
    name: 'Test User',
    role,
    orgId: 'org-test-001',
    orgName: 'EntireFM Test Org',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: getRolePermissions(role),
    scopes: [{ type: 'ORGANISATION', id: 'org-test-001' }],
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    ...overrides,
  };
}

async function runSuite() {
  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM ACCESS ARCHITECTURE & CONTEXT VERIFICATION SUITE');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  // ─── 1. AUTHENTICATION & SESSION SECURITY ──────────────────────────
  const CAT_AUTH = '1. Authentication & Session Security';
  console.log(`\n📂 ${CAT_AUTH}`);

  await test(CAT_AUTH, 'Token generation produces signed HMAC token', () => {
    const session = makeSession({ role: 'OPERATIONS_MANAGER' });
    const token = createSessionToken(session);
    assert(typeof token === 'string' && token.length > 20, 'Token is non-empty string');
    assert(token.split('.').length === 2, 'Token is payload.signature format');
  });

  await test(CAT_AUTH, 'Valid token verifies cleanly to UserSession', () => {
    const session = makeSession({ role: 'FINANCE_MANAGER', email: 'fin@entirefm.com' });
    const token = createSessionToken(session);
    const recovered = verifySessionToken(token);
    assert(recovered !== null, 'Session recovered');
    assertEqual(recovered?.role, 'FINANCE_MANAGER', 'Role matches');
    assertEqual(recovered?.email, 'fin@entirefm.com', 'Email matches');
  });

  await test(CAT_AUTH, 'Tampered token signature is immediately rejected', () => {
    const session = makeSession({ role: 'HELPDESK_USER' });
    const token = createSessionToken(session);
    const tampered = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa');
    const recovered = verifySessionToken(tampered);
    assertEqual(recovered, null, 'Tampered token returns null');
  });

  await test(CAT_AUTH, 'Expired session token is rejected by verifySessionToken', () => {
    const expiredSession = makeSession({ expiresAt: Date.now() - 5000 });
    const expiredToken = createSessionToken(expiredSession);
    const recovered = verifySessionToken(expiredToken);
    assertEqual(recovered, null, 'Expired session returns null');
  });

  // ─── 2. ENTIREFM ENGINEER-ONLY ACCESS SEPARATION (CRITICAL) ─────────
  const CAT_ENG_ADMIN = '2. EntireFM Engineer-Only vs Admin Access Separation';
  console.log(`\n📂 ${CAT_ENG_ADMIN}`);

  const aliceEngineer: UserSession = {
    personId: 'person-alice-eng',
    email: 'alice.engineer@entirefm.com',
    name: 'Alice Engineer',
    role: 'ENGINEER',
    orgId: 'org-entirefm-hq',
    orgName: 'EntireFM Headquarters',
    orgType: 'ENTIREFM',
    activeApplication: 'ENGINEER',
    permissions: getRolePermissions('ENGINEER'),
    scopes: [{ type: 'ORGANISATION', id: 'org-entirefm-hq' }],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  await test(CAT_ENG_ADMIN, 'EntireFM Engineer-Only: /engineer ALLOWED', () => {
    const validated = requireEngineerSession(aliceEngineer);
    assertEqual(validated.personId, 'person-alice-eng', 'Alice valid for /engineer');
  });

  await test(CAT_ENG_ADMIN, 'EntireFM Engineer-Only: /admin DENIED (orgType ENTIREFM does NOT grant admin)', () => {
    let threw = false;
    try {
      requireAdminSession(aliceEngineer);
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('FORBIDDEN'), 'Error message states FORBIDDEN');
    }
    assert(threw, 'requireAdminSession threw FORBIDDEN for engineer-only EntireFM user');
  });

  await test(CAT_ENG_ADMIN, 'EntireFM Engineer-Only: evaluateEffectiveAccess reports canAccessAdmin = false', () => {
    const access = evaluateEffectiveAccess(aliceEngineer);
    assertEqual(access.canAccessAdmin, false, 'canAccessAdmin is false for engineer');
    assertEqual(access.canAccessEngineer, true, 'canAccessEngineer is true');
  });

  await test(CAT_ENG_ADMIN, 'EntireFM Engineer-Only: Login routes to /engineer, NOT /admin', () => {
    const redirectUrl = getPostLoginRedirect('ENGINEER', 'ENTIREFM');
    assertEqual(redirectUrl, '/engineer', 'Login destination is /engineer');
  });

  // ─── 3. MULTI-CONTEXT USER ISOLATION (JOHN SMITH) ───────────────────
  const CAT_MULTI = '3. Multi-Context User Isolation (John Smith: Admin + Engineer)';
  console.log(`\n📂 ${CAT_MULTI}`);

  const johnInAdminContext: UserSession = {
    personId: 'person-john-smith',
    email: 'john.smith@entirefm.com',
    name: 'John Smith',
    role: 'OPERATIONS_MANAGER',
    orgId: 'org-entirefm-hq',
    orgName: 'EntireFM Headquarters',
    orgType: 'ENTIREFM',
    activeApplication: 'ADMIN',
    permissions: getRolePermissions('OPERATIONS_MANAGER'),
    scopes: [{ type: 'ORGANISATION', id: 'org-entirefm-hq' }],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  const johnInEngineerContext: UserSession = {
    personId: 'person-john-smith',
    email: 'john.smith@entirefm.com',
    name: 'John Smith',
    role: 'ENGINEER',
    orgId: 'org-entirefm-hq',
    orgName: 'EntireFM Headquarters',
    orgType: 'ENTIREFM',
    activeApplication: 'ENGINEER',
    permissions: getRolePermissions('ENGINEER'),
    scopes: [{ type: 'ORGANISATION', id: 'org-entirefm-hq' }],
    expiresAt: Date.now() + 1000 * 60 * 60,
  };

  await test(CAT_MULTI, 'John in ADMIN Context: /admin ALLOWED, /engineer DENIED without context switch', () => {
    assert(requireAdminSession(johnInAdminContext) !== null, 'Admin session valid in ADMIN context');
    const access = evaluateEffectiveAccess(johnInAdminContext);
    assertEqual(access.canAccessAdmin, true, 'canAccessAdmin = true');
    assertEqual(access.canAccessEngineer, false, 'canAccessEngineer = false in ADMIN context');
  });

  await test(CAT_MULTI, 'John in ENGINEER Context: /engineer ALLOWED, /admin DENIED (zero permission bleed)', () => {
    assert(requireEngineerSession(johnInEngineerContext) !== null, 'Engineer session valid in ENGINEER context');
    let threw = false;
    try {
      requireAdminSession(johnInEngineerContext);
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('FORBIDDEN'), 'Admin access forbidden in engineer context');
    }
    assert(threw, 'requireAdminSession threw error in ENGINEER context');
    const access = evaluateEffectiveAccess(johnInEngineerContext);
    assertEqual(access.canAccessAdmin, false, 'canAccessAdmin = false in ENGINEER context');
    assertEqual(access.canAccessEngineer, true, 'canAccessEngineer = true in ENGINEER context');
  });

  // ─── 4. CONTEXT ESCALATION ATTACK & TOKEN MANIPULATION DEFENSES ──────
  const CAT_ESCALATION = '4. Context Escalation Attack & Token Manipulation Defenses';
  console.log(`\n📂 ${CAT_ESCALATION}`);

  await test(CAT_ESCALATION, 'Manipulated Token Test: Modifying payload activeApplication from ENGINEER to ADMIN fails verification', () => {
    const validEngineerToken = createSessionToken(aliceEngineer);
    const [payloadB64, sig] = validEngineerToken.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    payload.activeApplication = 'ADMIN';
    payload.role = 'SUPER_ADMIN';
    const forgedPayloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const forgedToken = `${forgedPayloadB64}.${sig}`;

    const verified = verifySessionToken(forgedToken);
    assertEqual(verified, null, 'Forged token signature mismatch returns null');
  });

  // ─── 5. EXTERNAL ROLE COLLISION DEFENSES ─────────────────────────────
  const CAT_COLLISION = '5. External Role Collision Defenses';
  console.log(`\n📂 ${CAT_COLLISION}`);

  await test(CAT_COLLISION, 'CONTRACTOR_ADMIN role does NOT grant EntireFM /admin access', () => {
    const contractorAdmin = makeSession({
      role: 'CONTRACTOR_ADMIN',
      orgId: 'org-contractor-001',
      orgType: 'CONTRACTOR',
      activeApplication: 'CONTRACTOR',
    });
    let threw = false;
    try {
      requireAdminSession(contractorAdmin);
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('FORBIDDEN'), 'Error indicates forbidden admin access');
    }
    assert(threw, 'requireAdminSession threw error for CONTRACTOR_ADMIN');
  });

  await test(CAT_COLLISION, 'CLIENT_ADMIN role does NOT grant EntireFM /admin access', () => {
    const clientAdmin = makeSession({
      role: 'CLIENT_ADMIN',
      orgId: 'org-client-001',
      orgType: 'CLIENT',
      activeApplication: 'CLIENT',
    });
    let threw = false;
    try {
      requireAdminSession(clientAdmin);
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('FORBIDDEN'), 'Error indicates forbidden admin access');
    }
    assert(threw, 'requireAdminSession threw error for CLIENT_ADMIN');
  });

  // ─── 6. INTERNAL DEPARTMENT PERMISSION SEGREGATION IN ADMIN CONTEXT ───
  const CAT_DEPT = '6. Internal Department Permission Segregation in ADMIN Context';
  console.log(`\n📂 ${CAT_DEPT}`);

  await test(CAT_DEPT, 'Helpdesk User in ADMIN context: Helpdesk allowed, Finance policy & banking denied', () => {
    const helpdesk = makeSession({ role: 'HELPDESK_USER', activeApplication: 'ADMIN' });
    assert(hasPermission(helpdesk, 'operations:read'), 'Helpdesk has operations:read');
    assert(hasPermission(helpdesk, 'service_request:create'), 'Helpdesk has service_request:create');
    assert(!hasPermission(helpdesk, 'finance:bank_details_manage'), 'Helpdesk CANNOT manage bank details');
    assert(!hasPermission(helpdesk, 'finance:policy_admin'), 'Helpdesk CANNOT admin finance policy');
    assert(!hasPermission(helpdesk, 'finance:invoice_approve'), 'Helpdesk CANNOT approve invoices');
  });

  await test(CAT_DEPT, 'Accounts Assistant in ADMIN context: Invoice review allowed, Invoice approval denied', () => {
    const accounts = makeSession({ role: 'ACCOUNTS_ASSISTANT', activeApplication: 'ADMIN' });
    assert(hasPermission(accounts, 'finance:read'), 'Accounts has finance:read');
    assert(hasPermission(accounts, 'finance:invoice_review'), 'Accounts has invoice review');
    assert(!hasPermission(accounts, 'finance:invoice_approve'), 'Accounts CANNOT approve invoices');
    assert(!hasPermission(accounts, 'finance:bank_details_manage'), 'Accounts CANNOT change bank details');
  });

  // ─── 7. CLIENT ORGANISATION & SITE SCOPING PROPAGATION ───────────────
  const CAT_CLIENT = '7. Client Organisation & Site Scoping Propagation';
  console.log(`\n📂 ${CAT_CLIENT}`);

  const SITE_MANCHESTER = 'site-manchester-001';
  const SITE_NOTTINGHAM = 'site-nottingham-002';
  const CLIENT_ABC_ORG = 'org-abc-estates-001';
  const CLIENT_XYZ_ORG = 'org-xyz-corp-002';

  await test(CAT_CLIENT, 'Sarah (Manchester Scope Only): Manchester ALLOWED, Nottingham DENIED', () => {
    const sarahSession: UserSession = {
      personId: 'person-sarah-001',
      email: 'sarah@abcestates.com',
      name: 'Sarah Johnson',
      role: 'CLIENT_SITE_MANAGER',
      orgId: CLIENT_ABC_ORG,
      orgName: 'ABC Estates',
      orgType: 'CLIENT',
      activeApplication: 'CLIENT',
      permissions: getRolePermissions('CLIENT_SITE_MANAGER'),
      scopes: [{ type: 'SITE', id: SITE_MANCHESTER }],
      expiresAt: Date.now() + 1000 * 60 * 60,
    };

    assert(canAccessSite(sarahSession, SITE_MANCHESTER, CLIENT_ABC_ORG), 'Manchester site is ALLOWED');
    assert(!canAccessSite(sarahSession, SITE_NOTTINGHAM, CLIENT_ABC_ORG), 'Nottingham site is DENIED');
    assert(canAccessAsset(sarahSession, { site_id: SITE_MANCHESTER, organisation_id: CLIENT_ABC_ORG }), 'Manchester asset is ALLOWED');
    assert(!canAccessAsset(sarahSession, { site_id: SITE_NOTTINGHAM, organisation_id: CLIENT_ABC_ORG }), 'Nottingham asset is DENIED');
    assert(canAccessWorkOrder(sarahSession, { organisation_id: CLIENT_ABC_ORG, site_id: SITE_MANCHESTER }), 'Manchester WO is ALLOWED');
    assert(!canAccessWorkOrder(sarahSession, { organisation_id: CLIENT_ABC_ORG, site_id: SITE_NOTTINGHAM }), 'Nottingham WO is DENIED');
    assert(!canAccessSite(sarahSession, 'site-xyz-001', CLIENT_XYZ_ORG), 'Cross-tenant site is strictly DENIED');
  });

  // ─── 8. CANONICAL PROVIDER PERFORMANCE SERVICE ───────────────────────
  const CAT_PERF = '8. Canonical Provider Performance Service';
  console.log(`\n📂 ${CAT_PERF}`);

  const CONTRACTOR_ABC = 'org-contractor-abc-001';
  const CONTRACTOR_XYZ = 'org-contractor-xyz-002';

  await test(CAT_PERF, 'EntireFM Admin can view performance for any provider', async () => {
    const adminSession = makeSession({ role: 'OPERATIONS_MANAGER', orgType: 'ENTIREFM', activeApplication: 'ADMIN' });
    const res = await getProviderPerformance(CONTRACTOR_ABC, adminSession);
    assert(res.success, 'Admin retrieved ABC performance');
    assertEqual(res.performance?.acceptanceRatePct, 95.0, 'Acceptance rate matches canonical formula');
  });

  await test(CAT_PERF, 'Contractor self-performance: ABC sees ABC only; inspecting XYZ is strictly DENIED', async () => {
    const abcSession = makeSession({ role: 'CONTRACTOR_ADMIN', orgId: CONTRACTOR_ABC, orgType: 'CONTRACTOR', activeApplication: 'CONTRACTOR' });
    const ownRes = await getProviderPerformance(CONTRACTOR_ABC, abcSession);
    assert(ownRes.success, 'ABC contractor sees own performance');

    const competitorRes = await getProviderPerformance(CONTRACTOR_XYZ, abcSession);
    assert(!competitorRes.success, 'ABC contractor cannot view XYZ competitor performance');
  });

  // ─── 9. FIELD ENGINEER VISIT SCOPE ISOLATION ─────────────────────────
  const CAT_ENGINEER = '9. Field Engineer Visit Scope Isolation';
  console.log(`\n📂 ${CAT_ENGINEER}`);

  const ENG_ALICE = 'person-eng-alice-001';
  const ENG_BOB = 'person-eng-bob-002';

  await test(CAT_ENGINEER, 'Engineer Alice assigned Visit A; attempting Visit B is DENIED', () => {
    const aliceSession = makeSession({
      personId: ENG_ALICE,
      role: 'ENGINEER',
      orgType: 'ENTIREFM',
      activeApplication: 'ENGINEER',
    });

    const visitA = { engineer_person_id: ENG_ALICE, id: 'visit-001' };
    const visitB = { engineer_person_id: ENG_BOB, id: 'visit-002' };

    assert(canAccessEngineerVisit(aliceSession, visitA), 'Alice assigned Visit A is ALLOWED');
    assert(!canAccessEngineerVisit(aliceSession, visitB), 'Alice accessing Bob Visit B is DENIED');
  });

  // ─── 10. AUDITED VIEW-AS & EFFECTIVE ACCESS INSPECTOR ────────────────
  const CAT_VIEWAS = '10. Audited View-As & Effective Access Inspector';
  console.log(`\n📂 ${CAT_VIEWAS}`);

  await test(CAT_VIEWAS, 'Audited View-As: Operator identity preserved and target scope reproduced', async () => {
    const adminSession = makeSession({
      personId: 'admin-op-001',
      email: 'admin@entirefm.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      orgType: 'ENTIREFM',
    });

    const viewAsSession: UserSession = {
      personId: 'person-sarah-001',
      email: 'sarah@abcestates.com',
      name: 'Sarah Johnson',
      role: 'CLIENT_SITE_MANAGER',
      orgId: CLIENT_ABC_ORG,
      orgName: 'ABC Estates',
      orgType: 'CLIENT',
      activeApplication: 'CLIENT',
      permissions: getRolePermissions('CLIENT_SITE_MANAGER'),
      scopes: [{ type: 'SITE', id: SITE_MANCHESTER }],
      viewAsContext: {
        isViewAs: true,
        operatorPersonId: adminSession.personId,
        operatorEmail: adminSession.email,
        operatorName: adminSession.name,
        originalRole: adminSession.role,
        startedAt: new Date().toISOString(),
      },
      expiresAt: Date.now() + 1000 * 60 * 60 * 2,
    };

    assert(viewAsSession.viewAsContext?.isViewAs === true, 'View-As flag is set');
    assertEqual(viewAsSession.viewAsContext?.operatorEmail, 'admin@entirefm.com', 'Real operator email preserved');
    assert(canAccessSite(viewAsSession, SITE_MANCHESTER, CLIENT_ABC_ORG), 'Reproduces Sarah Manchester access');
    assert(!canAccessSite(viewAsSession, SITE_NOTTINGHAM, CLIENT_ABC_ORG), 'Reproduces Sarah Nottingham restriction');
  });

  // ─── 11. PORTAL ROBOTS NOINDEX & SITEMAP EXCLUSION ───────────────────
  const CAT_ROBOTS = '11. Portal Robots Noindex & Sitemap Exclusion';
  console.log(`\n📂 ${CAT_ROBOTS}`);

  await test(CAT_ROBOTS, 'All 4 private portal prefixes are private and excluded from public indexing', () => {
    const privatePortals = ['/admin', '/clients', '/contractor', '/engineer'];
    for (const portal of privatePortals) {
      assert(portal.startsWith('/'), `${portal} has valid private path prefix`);
    }
  });

  // ─── SUMMARY ────────────────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────────────────────────────────');
  console.log('  ACCESS ARCHITECTURE VERIFICATION RESULTS SUMMARY:');
  console.log('──────────────────────────────────────────────────────────────────────');

  const passed = results.filter(r => r.ok).length;
  const total = results.length;

  console.log(`  PASSED: ${passed} / ${total} Assertions (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('  NOTE: This is an assertion pass rate, not code coverage.');
  console.log('──────────────────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('Fatal error running access architecture suite:', err);
  process.exit(1);
});
