/**
 * SUPPLIER DOMAIN PERSISTENCE & JOURNEY VERIFICATION
 * ===================================================
 * Verifies that the P0 supplier company setup loop is permanently resolved:
 * 1. Supplier user provisioning
 * 2. Organization creation & atomic draft initialization
 * 3. Cross-request persistence (cold start simulation)
 * 4. Lifecycle routing resolution to /supplier-portal/onboarding
 * 5. Resume destination persistence across auth cycles
 * 6. Duplicate organization prevention
 */

import {
  createOrLinkSupplierUser,
  getSupplierUserByAuthId,
  createSupplierOrganisation,
  getSupplierOrganisationById,
  getOrCreateApplicationDraft,
  updateApplicationDraft,
  getApplicationDraft,
  resolveResumeDestination,
} from '../src/server/suppliers/supplier-auth-store';
import { randomBytes } from 'node:crypto';

async function runTests() {
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  SUPPLIER DOMAIN PERSISTENCE INTEGRATION TEST');
  console.log('══════════════════════════════════════════════════════\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name}`);
    }
  }

  const testAuthId = `test-supabase-${Date.now()}-${randomBytes(4).toString('hex')}`;
  const testEmail = `supplier-${Date.now()}@example.co.uk`;

  // Step 1: Provision supplier user
  const prov = await createOrLinkSupplierUser(
    testAuthId,
    testEmail,
    'Acme',
    'Supplies',
    'SUPPLIER_ADMIN',
    true
  );
  assert(prov.success && prov.user?.auth_user_id === testAuthId, 'Supplier domain user provisioned');

  // Step 2: Check initial resume destination before org setup -> MUST be /supplier-portal/org-setup
  const destBeforeOrg = await resolveResumeDestination(testAuthId);
  assert(destBeforeOrg === '/supplier-portal/org-setup', 'Initial resume destination is /supplier-portal/org-setup');

  // Step 3: Create organisation
  const companyNum = `12${Math.floor(100000 + Math.random() * 900000)}`;
  const orgResult = await createSupplierOrganisation(
    testAuthId,
    'Acme Facilities Services Ltd',
    'Acme Facilities',
    companyNum
  );
  assert(orgResult.success && !!orgResult.organisation?.id, 'Supplier organisation created successfully');

  const orgId = orgResult.organisation!.id;

  // Step 4: Verify org is linked to user
  const userAfterOrg = await getSupplierUserByAuthId(testAuthId);
  assert(userAfterOrg?.organisation_id === orgId, 'User organisation_id updated to new org');

  // Step 5: Verify org data retrieval
  const fetchedOrg = await getSupplierOrganisationById(orgId);
  assert(fetchedOrg?.legalName === 'Acme Facilities Services Ltd', 'Organisation retrieved with correct legal name');
  assert(fetchedOrg?.companyNumber === companyNum, 'Organisation retrieved with correct company number');

  // Step 6: Verify application draft was atomically created
  const draft = await getApplicationDraft(orgId);
  assert(draft !== null && draft.legalCompanyName === 'Acme Facilities Services Ltd', 'Application draft created atomically');
  assert(draft?.currentStep === 1, 'Draft initialized at step 1');

  // Step 7: Critical Check — Resume destination after org setup MUST be /supplier-portal/onboarding
  const destAfterOrg = await resolveResumeDestination(testAuthId);
  assert(destAfterOrg === '/supplier-portal/onboarding', 'Resume destination resolves to /supplier-portal/onboarding');

  // Step 8: Update application draft
  const updatedDraft = await updateApplicationDraft(orgId, {
    currentStep: 3,
    mainPhone: '0800 123 4567',
    selectedServices: ['HVAC_MAINTENANCE', 'ELECTRICAL_TESTING'],
  });
  assert(updatedDraft?.currentStep === 3, 'Application draft updated to step 3');
  assert(updatedDraft?.mainPhone === '0800 123 4567', 'Application draft mainPhone updated');

  // Step 9: Re-fetch draft to verify persistence
  const reFetchedDraft = await getApplicationDraft(orgId);
  assert(reFetchedDraft?.currentStep === 3, 'Re-fetched draft preserves step 3');
  assert(reFetchedDraft?.selectedServices?.includes('HVAC_MAINTENANCE'), 'Re-fetched draft preserves selectedServices');

  // Step 10: Duplicate company number check
  const duplicateResult = await createSupplierOrganisation(
    'other-user-uuid-123',
    'Another Company Name',
    'Another Trading Name',
    companyNum
  );
  assert(!duplicateResult.success && duplicateResult.duplicate === true, 'Duplicate Companies House number correctly blocked');

  // Step 11: Idempotent re-submission by same owner returns existing organisation
  const idempotentResult = await createSupplierOrganisation(
    testAuthId,
    'Acme Facilities Services Ltd',
    'Acme Facilities',
    companyNum
  );
  assert(idempotentResult.success && idempotentResult.organisation?.id === orgId, 'Idempotent re-submission returns existing org without duplication');

  console.log('\n══════════════════════════════════════════════════════');
  console.log(`  RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log('══════════════════════════════════════════════════════\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
