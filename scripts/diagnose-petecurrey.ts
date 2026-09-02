/**
 * Production Diagnostic — petecurrey@gmail.com account state
 */

import { dbQuery } from '../src/server/db/client';

const EMAIL = 'petecurrey@gmail.com';
const ORG_NAME = 'Test Company Limited';

async function main() {
  console.log('\n=== ENTIREFM PRODUCTION DIAGNOSTIC ===');
  console.log(`Email: ${EMAIL}`);
  console.log('=====================================\n');

  // 1. supplier_users by email
  console.log('1. supplier_users WHERE email = petecurrey@gmail.com');
  const { data: users, error: usersErr } = await dbQuery<any[]>(
    `supplier_users?email=eq.${encodeURIComponent(EMAIL)}&select=id,auth_user_id,email,organisation_id,role,status,email_verified,created_at`
  );
  if (usersErr) console.error('   ERROR:', usersErr);
  else if (!users || users.length === 0) console.log('   ⚠️  NO ROWS FOUND');
  else users.forEach(u => console.log('   ROW:', JSON.stringify(u, null, 2)));

  const authUserIds = users?.map(u => u.auth_user_id) || [];

  // 2. supplier_organisations by legal_name
  console.log('\n2. supplier_organisations WHERE legal_name ILIKE Test Company Limited');
  const { data: orgsByName, error: orgsNameErr } = await dbQuery<any[]>(
    `supplier_organisations?legal_name=ilike.${encodeURIComponent(ORG_NAME)}&select=id,legal_name,trading_name,company_number,owner_id,lifecycle_status,created_at`
  );
  if (orgsNameErr) console.error('   ERROR:', orgsNameErr);
  else if (!orgsByName || orgsByName.length === 0) console.log('   ⚠️  NO ROWS FOUND');
  else orgsByName.forEach(o => console.log('   ROW:', JSON.stringify(o, null, 2)));

  // 3. supplier_organisations by owner_id
  if (authUserIds.length > 0) {
    for (const authId of authUserIds) {
      console.log(`\n3. supplier_organisations WHERE owner_id = ${authId}`);
      const { data: orgsByOwner, error: orgsOwnerErr } = await dbQuery<any[]>(
        `supplier_organisations?owner_id=eq.${encodeURIComponent(authId)}&select=id,legal_name,trading_name,company_number,owner_id,lifecycle_status,created_at`
      );
      if (orgsOwnerErr) console.error('   ERROR:', orgsOwnerErr);
      else if (!orgsByOwner || orgsByOwner.length === 0) console.log('   ⚠️  NO ROWS FOUND');
      else orgsByOwner.forEach(o => console.log('   ROW:', JSON.stringify(o, null, 2)));
    }
  } else {
    console.log('\n3. (skipped — no auth_user_ids found in supplier_users)');
  }

  // 4. All supplier_organisations — full list
  console.log('\n4. ALL supplier_organisations (most recent 20)');
  const { data: allOrgs } = await dbQuery<any[]>(
    `supplier_organisations?select=id,legal_name,owner_id,lifecycle_status,created_at&order=created_at.desc&limit=20`
  );
  if (!allOrgs || allOrgs.length === 0) console.log('   ⚠️  NO ROWS FOUND');
  else allOrgs.forEach(o => console.log(`   ${o.id} | ${o.legal_name} | owner=${o.owner_id} | status=${o.lifecycle_status} | ${o.created_at?.slice(0, 10)}`));

  // 5. All supplier_users — full list
  console.log('\n5. ALL supplier_users');
  const { data: allUsers } = await dbQuery<any[]>(
    `supplier_users?select=id,auth_user_id,email,organisation_id,status,created_at&order=created_at.desc&limit=20`
  );
  if (!allUsers || allUsers.length === 0) console.log('   ⚠️  NO ROWS FOUND');
  else allUsers.forEach(u => console.log(`   ${u.auth_user_id} | ${u.email} | org=${u.organisation_id || 'NULL'} | status=${u.status} | ${u.created_at?.slice(0, 10)}`));

  // 6. application_drafts for orgsByName
  const allOrgIds = orgsByName?.map(o => o.id) || [];
  if (allOrgIds.length > 0) {
    console.log('\n6. supplier_application_drafts for found orgs');
    for (const orgId of allOrgIds) {
      const { data: drafts } = await dbQuery<any[]>(
        `supplier_application_drafts?org_id=eq.${encodeURIComponent(orgId)}&select=org_id,application_reference,lifecycle_status,current_step,created_at`
      );
      if (!drafts || drafts.length === 0) console.log(`   org ${orgId}: ⚠️  NO DRAFT FOUND`);
      else drafts.forEach(d => console.log(`   org ${orgId}:`, JSON.stringify(d)));
    }
  }

  console.log('\n=== DIAGNOSIS COMPLETE ===\n');
}

main().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
