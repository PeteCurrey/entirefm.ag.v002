/**
 * EntireFM Supplier Portal Shell Isolation & Security Verification Suite
 * ======================================================================
 * Tests and verifies:
 * 1. Public vs Protected route group classification
 * 2. Unauthenticated fail-closed session guarding
 * 3. Shell isolation (auth shell has zero sidebar; portal shell requires authenticated session)
 * 4. Zero mock data in production runtime
 * 5. Lifecycle-aware portal navigation
 */

import {
  getSupplierRelationshipOverview,
  getSupplierComplianceRadar,
  getSupplierServicesScope,
  getSupplierCoverageScope,
  listSupplierVaultDocuments,
} from '../src/server/suppliers/store';
import {
  createSupplierOrganisation,
  getSupplierOrganisationById,
  getPortalStatusDisplay,
} from '../src/server/suppliers/supplier-auth-store';
import * as fs from 'fs';
import * as path from 'path';

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
  console.log('\n======================================================');
  console.log('🧪 EntireFM Supplier Portal Shell & Auth Isolation Test Suite');
  console.log('======================================================\n');

  // --- TEST GROUP 1: Route Group Structure & Layout Separation ---
  console.log('TEST GROUP 1: Route Group Structure & Layout Files');
  const basePortalDir = path.resolve('src/app/supplier-portal');
  const authDir = path.join(basePortalDir, '(auth)');
  const portalDir = path.join(basePortalDir, '(portal)');

  assert(fs.existsSync(path.join(authDir, 'layout.tsx')), '(auth)/layout.tsx exists');
  assert(fs.existsSync(path.join(portalDir, 'layout.tsx')), '(portal)/layout.tsx exists');
  assert(fs.existsSync(path.join(basePortalDir, 'layout.tsx')), 'Root passthrough layout.tsx exists');

  // Verify auth layout does NOT contain <aside> sidebar or portal nav
  const authLayoutContent = fs.readFileSync(path.join(authDir, 'layout.tsx'), 'utf8');
  assert(!authLayoutContent.includes('<aside'), '(auth)/layout.tsx contains no <aside> sidebar');
  assert(!authLayoutContent.includes('Document Vault'), '(auth)/layout.tsx contains no portal navigation items');

  // Verify portal layout contains server-side auth guard and lifecycle sidebar
  const portalLayoutContent = fs.readFileSync(path.join(portalDir, 'layout.tsx'), 'utf8');
  assert(portalLayoutContent.includes('getCurrentSession'), '(portal)/layout.tsx resolves session server-side');
  assert(portalLayoutContent.includes("redirect('/supplier-portal/sign-in')"), '(portal)/layout.tsx redirects unauthenticated users to /supplier-portal/sign-in');
  assert(portalLayoutContent.includes("redirect('/supplier-portal/org-setup')"), '(portal)/layout.tsx redirects users without org to /supplier-portal/org-setup');
  assert(portalLayoutContent.includes('<aside'), '(portal)/layout.tsx renders authenticated sidebar');

  // --- TEST GROUP 2: Auth Route Presence in (auth) ---
  console.log('\nTEST GROUP 2: Auth Routes Inside (auth) Group');
  const authPages = ['register', 'sign-in', 'verify-email', 'forgot-password', 'reset-password', 'org-setup'];
  for (const page of authPages) {
    const pagePath = path.join(authDir, page, 'page.tsx');
    assert(fs.existsSync(pagePath), `(auth)/${page}/page.tsx exists`);
  }

  // --- TEST GROUP 3: Protected Portal Pages in (portal) ---
  console.log('\nTEST GROUP 3: Protected Portal Pages Inside (portal) Group');
  const portalPages = [
    'page.tsx',
    'onboarding/page.tsx',
    'company/page.tsx',
    'documents/page.tsx',
    'actions/page.tsx',
    'billing/page.tsx',
    'membership/page.tsx',
    'compliance/page.tsx',
    'approvals/page.tsx',
    'coverage/page.tsx',
    'services/page.tsx',
    'relationship/page.tsx',
    'events/page.tsx',
    'resources/page.tsx',
    'users/page.tsx',
    'support/page.tsx',
  ];
  for (const page of portalPages) {
    const pagePath = path.join(portalDir, page);
    assert(fs.existsSync(pagePath), `(portal)/${page} exists`);
  }

  // --- TEST GROUP 4: Zero Mock Seed Data in Store Runtime ---
  console.log('\nTEST GROUP 4: Zero Mock Data in Runtime Stores');
  const testNewOrgId = `org-test-zero-mock-${Date.now()}`;

  // 1. getSupplierRelationshipOverview for a brand new applicant
  const relOverview = await getSupplierRelationshipOverview(testNewOrgId);
  assert(relOverview.legal_name === 'Your Company', 'Un-onboarded supplier defaults to generic clean placeholder');
  assert(relOverview.legal_name !== 'Midlands Mechanical & HVAC Services Ltd', 'Zero Midlands Mechanical mock name in relationship overview');
  assert(relOverview.trading_name !== 'Midlands HVAC Pro', 'Zero Midlands HVAC Pro mock name in relationship overview');
  assert(relOverview.relationship_tier === 'REGISTERED', 'Un-onboarded supplier tier is REGISTERED, not APPROVED_SUPPLIER');
  assert(relOverview.assurance_status === 'PENDING', 'Un-onboarded supplier assurance is PENDING, not APPROVED');

  // 2. getSupplierComplianceRadar for a new applicant
  const radar = await getSupplierComplianceRadar(testNewOrgId);
  assert(Array.isArray(radar) && radar.length === 0, 'New supplier compliance radar is empty array (0 mock items)');

  // 3. getSupplierServicesScope for a new applicant
  const services = await getSupplierServicesScope(testNewOrgId);
  assert(Array.isArray(services) && services.length === 0, 'New supplier services scope is empty array (0 mock items)');

  // 4. getSupplierCoverageScope for a new applicant
  const coverage = await getSupplierCoverageScope(testNewOrgId);
  assert(Array.isArray(coverage) && coverage.length === 0, 'New supplier coverage scope is empty array (0 mock items)');

  // 5. listSupplierVaultDocuments for a new applicant
  const vaultDocs = await listSupplierVaultDocuments(testNewOrgId);
  assert(Array.isArray(vaultDocs) && vaultDocs.length === 0, 'New supplier document vault is empty array (0 mock items)');

  // --- TEST GROUP 5: Dynamic Organisation Data Binding ---
  console.log('\nTEST GROUP 5: Dynamic Organisation Data Binding');
  const testLegalName = `Apex Thermal Engineering ${Date.now()} Ltd`;
  const orgResult = await createSupplierOrganisation(
    'usr-real-test-01',
    testLegalName,
    'Apex Climate',
    `9${Math.floor(1000000 + Math.random() * 9000000)}`
  );
  assert(orgResult.success && !!orgResult.organisation, 'Created real supplier organisation');
  const createdOrg = orgResult.organisation!;
  assert(createdOrg.id.startsWith('sorg-'), 'Organisation ID starts with sorg- prefix');

  const dynRelOverview = await getSupplierRelationshipOverview(createdOrg.id);
  assert(dynRelOverview.legal_name === testLegalName, 'Relationship overview binds real legal company name');
  assert(dynRelOverview.trading_name === 'Apex Climate', 'Relationship overview binds real trading name');
  assert(dynRelOverview.relationship_tier === 'REGISTERED', 'New organisation starts as REGISTERED');

  const statusDisplay = getPortalStatusDisplay(createdOrg);
  assert(statusDisplay.statusLabel === 'Application in Progress', 'Lifecycle status label correctly reports Application in Progress');
  assert(!statusDisplay.isApproved, 'isApproved is false for new applicant');

  // --- TEST GROUP 6: Codebase Mock String & Contact Audit ---
  console.log('\nTEST GROUP 6: Codebase Mock String & Contact Audit');
  const filesToAudit = [
    'src/server/suppliers/store.ts',
    'src/app/supplier-portal/(portal)/page.tsx',
    'src/app/supplier-portal/(portal)/company/page.tsx',
    'src/app/supplier-portal/(portal)/coverage/page.tsx',
    'src/app/supplier-portal/(portal)/documents/page.tsx',
    'src/app/supplier-portal/(portal)/billing/page.tsx',
    'src/app/supplier-portal/(portal)/membership/page.tsx',
    'src/app/supplier-portal/(portal)/approvals/page.tsx',
    'src/app/supplier-portal/(portal)/support/page.tsx',
    'src/app/supplier-portal/(portal)/relationship/page.tsx',
  ];

  for (const relFile of filesToAudit) {
    const fullPath = path.resolve(relFile);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(!content.includes('Midlands Mechanical'), `${relFile} does NOT contain 'Midlands Mechanical'`);
    assert(!content.includes('Midlands HVAC Pro'), `${relFile} does NOT contain 'Midlands HVAC Pro'`);
    assert(!content.includes('14 Industrial Way'), `${relFile} does NOT contain hardcoded '14 Industrial Way'`);
    assert(!content.includes('Aviva_PL_10M_2026.pdf'), `${relFile} does NOT contain hardcoded mock documents`);
    assert(!content.includes('0800 555 0199'), `${relFile} does NOT contain fake number '0800 555 0199'`);
    assert(!content.includes('0800 000 0000'), `${relFile} does NOT contain fake number '0800 000 0000'`);
  }

  // --- TEST GROUP 7: Supplier Application Entry CTAs ---
  console.log('\nTEST GROUP 7: Supplier Application Entry CTAs (/suppliers/apply)');
  const applyPagePath = path.resolve('src/app/suppliers/apply/page.tsx');
  const applyPageContent = fs.readFileSync(applyPagePath, 'utf8');
  assert(applyPageContent.includes('href="/supplier-portal/register"'), "Start Supplier Application links to /supplier-portal/register");
  assert(applyPageContent.includes('href="/supplier-portal/sign-in"'), "Continue Existing Application links to /supplier-portal/sign-in");
  assert(!applyPageContent.includes('href="/supplier-portal"'), "Continue Existing Application does NOT link directly to /supplier-portal");

  // --- TEST GROUP 8: Assigned Team & Contact Truth ---
  console.log('\nTEST GROUP 8: Assigned Team & Contact Truth');
  assert(Array.isArray(relOverview.assigned_entirefm_team) && relOverview.assigned_entirefm_team.length === 0, 'New unassigned relationship overview returns 0 fake assigned team members');

  // --- SUMMARY ---
  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
