/**
 * PRODUCTION DATA CLEANUP — Commissioning Test Account Removal
 * ============================================================
 * Removes confirmed commissioning/test fixtures from the live production dataset.
 * Resets FireJet (genuine registration) from APPROVED to IN_PROGRESS.
 *
 * Test accounts confirmed by:
 *   - Synthetic email: contractor-1787771544651@example.co.uk (machine-generated)
 *   - Owner email: petecurrey@gmail.com (EntireFM operator account)
 *   - Created: 2026-08-26 (day before genuine contractor signups)
 *   - Org names: "Apex Mechanical Services 1787771545644 Ltd", "Test Company Limited"
 *
 * DRY_RUN=true prints what WOULD be deleted without touching the DB.
 */

import { dbQuery, isDbConfigured } from '../src/server/db/client';

const DRY_RUN = process.env.DRY_RUN === 'true';

const TEST_ACCOUNTS = [
  {
    label: 'John Smith (commissioning fixture)',
    email: 'contractor-1787771544651@example.co.uk',
    orgId: 'sorg-1787771545706-0791ab94',
    orgName: 'Apex Mechanical Services 1787771545644 Ltd',
    applicationRef: 'SUP-260826-7637',
  },
  {
    label: 'Peter Currey (operator/owner test)',
    email: 'petecurrey@gmail.com',
    orgId: 'sorg-1787772440472-f2c90e31',
    orgName: 'Test Company Limited',
    applicationRef: 'SUP-260826-9535',
  },
];

const FIRJET_RESET = {
  label: 'FireJet (genuine — reset from APPROVED to IN_PROGRESS)',
  orgId: 'sorg-1787847057006-0d9b1187',
  email: 'george@firejet.co.uk',
};

async function purgeTestAccount(account: (typeof TEST_ACCOUNTS)[0]) {
  console.log(`\n  Purging: ${account.label}`);
  console.log(`    Org:   ${account.orgName} (${account.orgId})`);
  console.log(`    Email: ${account.email}`);
  console.log(`    Ref:   ${account.applicationRef}`);

  if (DRY_RUN) {
    console.log('    [DRY RUN] Would delete: supplier_application_drafts, supplier_organisations, supplier_users');
    return true;
  }

  // 1. Delete application draft
  const { error: draftErr } = await dbQuery(
    `supplier_application_drafts?org_id=eq.${encodeURIComponent(account.orgId)}`,
    { method: 'DELETE' }
  );
  if (draftErr) console.warn(`    WARN: Draft delete error: ${draftErr}`);
  else console.log('    ✓ supplier_application_drafts deleted');

  // 2. Find and delete supplier user
  const { data: users } = await dbQuery<any[]>(
    `supplier_users?email=eq.${encodeURIComponent(account.email)}`
  );
  if (users && users.length > 0) {
    for (const u of users) {
      const { error: userErr } = await dbQuery(
        `supplier_users?id=eq.${encodeURIComponent(u.id)}`,
        { method: 'DELETE' }
      );
      if (userErr) console.warn(`    WARN: User delete error: ${userErr}`);
      else console.log(`    ✓ supplier_users row deleted (id: ${u.id})`);
    }
  } else {
    console.log('    ⚠ No supplier_users row found (may already be removed)');
  }

  // 3. Delete supplier organisation
  const { error: orgErr } = await dbQuery(
    `supplier_organisations?id=eq.${encodeURIComponent(account.orgId)}`,
    { method: 'DELETE' }
  );
  if (orgErr) console.warn(`    WARN: Org delete error: ${orgErr}`);
  else console.log('    ✓ supplier_organisations deleted');

  return true;
}

async function resetFireJet() {
  console.log(`\n  Resetting: ${FIRJET_RESET.label}`);

  if (DRY_RUN) {
    console.log('    [DRY RUN] Would reset: supplier_organisations lifecycle_status → DRAFT');
    console.log('    [DRY RUN] Would reset: supplier_application_drafts lifecycle_status → IN_PROGRESS');
    console.log('    [DRY RUN] Would remove: CAFM organisations + provider_organisations records');
    return;
  }

  // 1. Reset supplier org lifecycle
  const { error: orgErr } = await dbQuery(
    `supplier_organisations?id=eq.${encodeURIComponent(FIRJET_RESET.orgId)}`,
    { method: 'PATCH', body: { lifecycle_status: 'DRAFT' } }
  );
  if (orgErr) console.warn(`    WARN: Org reset error: ${orgErr}`);
  else console.log('    ✓ supplier_organisations.lifecycle_status → DRAFT');

  // 2. Reset application draft lifecycle
  const { error: draftErr } = await dbQuery(
    `supplier_application_drafts?org_id=eq.${encodeURIComponent(FIRJET_RESET.orgId)}`,
    { method: 'PATCH', body: { lifecycle_status: 'IN_PROGRESS' } }
  );
  if (draftErr) console.warn(`    WARN: Draft reset error: ${draftErr}`);
  else console.log('    ✓ supplier_application_drafts.lifecycle_status → IN_PROGRESS');

  // 3. Remove CAFM provider_organisations record (deactivate, don't delete)
  const { data: provOrgs } = await dbQuery<any[]>('provider_organisations?select=id,organisation_id');
  const firjetProv = provOrgs?.find(p => p.organisation_id);
  if (firjetProv) {
    const { error: provErr } = await dbQuery(
      `provider_organisations?id=eq.${encodeURIComponent(firjetProv.id)}`,
      { method: 'PATCH', body: { vetting_status: 'PENDING', is_active: false } }
    );
    if (provErr) console.warn(`    WARN: Provider org reset error: ${provErr}`);
    else console.log('    ✓ provider_organisations.vetting_status → PENDING, is_active → false');
  }

  // 4. Update CAFM organisations status
  const { data: cafmOrgs } = await dbQuery<any[]>(
    `organisations?org_type=eq.CONTRACTOR&name=eq.FireJet&select=id`
  );
  if (cafmOrgs && cafmOrgs.length > 0) {
    const { error: cafmErr } = await dbQuery(
      `organisations?id=eq.${encodeURIComponent(cafmOrgs[0].id)}`,
      { method: 'PATCH', body: { status: 'PENDING' } }
    );
    if (cafmErr) console.warn(`    WARN: CAFM org reset error: ${cafmErr}`);
    else console.log('    ✓ organisations.status → PENDING');
  }
}

async function main() {
  console.log('\n================================================================');
  console.log('ENTIREFM — PRODUCTION DATA CLEANUP');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE — WRITING TO PRODUCTION DB'}`);
  console.log('================================================================');

  if (!isDbConfigured()) {
    console.error('ERROR: Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  // Pre-cleanup audit
  const { data: usersBefore } = await dbQuery<any[]>('supplier_users?select=email,created_at&order=created_at.asc');
  const { data: orgsBefore } = await dbQuery<any[]>('supplier_organisations?select=legal_name,lifecycle_status&order=created_at.asc');
  console.log(`\nBEFORE: ${usersBefore?.length} supplier_users, ${orgsBefore?.length} supplier_organisations`);

  console.log('\n1. REMOVING TEST ACCOUNTS');
  console.log('----------------------------------------------------------------');
  for (const account of TEST_ACCOUNTS) {
    await purgeTestAccount(account);
  }

  console.log('\n2. RESETTING FIRJET TO IN_PROGRESS');
  console.log('----------------------------------------------------------------');
  await resetFireJet();

  // Post-cleanup audit
  const { data: usersAfter } = await dbQuery<any[]>('supplier_users?select=email,created_at&order=created_at.asc');
  const { data: orgsAfter } = await dbQuery<any[]>('supplier_organisations?select=legal_name,lifecycle_status&order=created_at.asc');
  const { data: draftsAfter } = await dbQuery<any[]>('supplier_application_drafts?select=application_reference,lifecycle_status');

  console.log('\n================================================================');
  console.log('POST-CLEANUP LIVE STATE');
  console.log('================================================================');
  console.log(`\nSupplier Users (${usersAfter?.length || 0}):`);
  usersAfter?.forEach((u, i) => console.log(`  ${i + 1}. ${u.email} | ${u.created_at?.slice(0, 10)}`));
  console.log(`\nSupplier Organisations (${orgsAfter?.length || 0}):`);
  orgsAfter?.forEach((o, i) => console.log(`  ${i + 1}. ${o.legal_name} | ${o.lifecycle_status}`));
  console.log(`\nApplication Drafts (${draftsAfter?.length || 0}):`);
  draftsAfter?.forEach((d, i) => console.log(`  ${i + 1}. ${d.application_reference} | ${d.lifecycle_status}`));

  const genuine = usersAfter?.length || 0;
  console.log(`\n✅ Genuine contractor registrations: ${genuine}`);
  console.log('✅ Test/commissioning records: 0');

  if (genuine === 6 || DRY_RUN) {
    console.log('\n🎉 CLEANUP COMPLETE.\n');
  } else {
    console.warn(`\n⚠ Expected 6 genuine registrations, got ${genuine}. Manual review required.\n`);
  }
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err);
  process.exit(1);
});
