/**
 * Repair script — restore petecurrey@gmail.com supplier org record
 * =================================================================
 * The cleanup script deleted sorg-1787905292503-3abb21a8 from supplier_organisations
 * but left the supplier_users row intact with that org_id reference.
 * This script re-creates the org and a DRAFT application draft.
 */

import { dbQuery } from '../src/server/db/client';

const AUTH_USER_ID = 'b52f9645-2252-43e9-a93f-80cd77c53c15';
const EMAIL = 'petecurrey@gmail.com';
const ORG_ID = 'sorg-1787905292503-3abb21a8';
const NOW = new Date().toISOString();

function generateRef() {
  const now = new Date();
  const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SUP-${yymmdd}-${rand}`;
}

async function main() {
  console.log('\n=== REPAIR: petecurrey@gmail.com ===\n');

  // 1. Check if org already exists
  const { data: existing } = await dbQuery<any[]>(
    `supplier_organisations?id=eq.${encodeURIComponent(ORG_ID)}&limit=1`
  );
  if (existing && existing.length > 0) {
    console.log('✅ Org already exists:', JSON.stringify(existing[0], null, 2));
  } else {
    console.log('⚠️  Org missing — creating...');
    const appRef = generateRef();
    const org = {
      id: ORG_ID,
      legal_name: 'Test Company Limited',
      trading_name: 'Test Co',
      company_number: '12341234',
      vat_number: null,
      owner_id: AUTH_USER_ID,
      application_reference: appRef,
      lifecycle_status: 'DRAFT',
      created_at: NOW,
      updated_at: NOW,
    };
    const { error: orgErr } = await dbQuery('supplier_organisations', {
      method: 'POST',
      body: org,
    });
    if (orgErr) {
      console.error('❌ Failed to create org:', orgErr);
      process.exit(1);
    }
    console.log(`✅ supplier_organisations created: ${ORG_ID} | ref=${appRef}`);
  }

  // 2. Check if draft exists
  const { data: existingDraft } = await dbQuery<any[]>(
    `supplier_application_drafts?org_id=eq.${encodeURIComponent(ORG_ID)}&limit=1`
  );
  if (existingDraft && existingDraft.length > 0) {
    console.log('✅ Draft already exists:', JSON.stringify(existingDraft[0], null, 2));
  } else {
    console.log('⚠️  Draft missing — creating...');

    // Get the org we just created/confirmed
    const { data: orgRows } = await dbQuery<any[]>(
      `supplier_organisations?id=eq.${encodeURIComponent(ORG_ID)}&limit=1`
    );
    const appRef = orgRows?.[0]?.application_reference || generateRef();

    const draft = {
      org_id: ORG_ID,
      application_reference: appRef,
      current_step: 1,
      lifecycle_status: 'DRAFT',
      legal_company_name: 'Test Company Limited',
      trading_name: 'Test Co',
      company_number: '12341234',
      vat_number: '',
      website_url: '',
      year_established: '',
      employee_count: '',
      trading_address: '',
      main_phone: '',
      general_email: '',
      business_type: '',
      company_summary: '',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      ops_contact_name: '',
      ops_contact_email: '',
      selected_services: [],
      selected_regions: [],
      has_247: false,
      emergency_sla_hours: '',
      has_subcontractors: false,
      direct_engineers: '',
      pl_insurer: '',
      pl_policy_number: '',
      pl_cover_limit: '',
      pl_expiry_date: '',
      selected_accreditations: [],
      accreditation_numbers: {},
      gas_safe_number: '',
      gas_safe_expiry: '',
      f_gas_number: '',
      f_gas_expiry: '',
      has_hs_policy: false,
      has_rams: false,
      has_incident_history: false,
      anti_bribery: false,
      modern_slavery: false,
      code_of_conduct: false,
      truthfulness_declaration: false,
      payment_method: 'CARD',
      waiver_reason: '',
      created_at: NOW,
      updated_at: NOW,
    };
    const { error: draftErr } = await dbQuery('supplier_application_drafts', {
      method: 'POST',
      body: draft,
    });
    if (draftErr) {
      console.error('❌ Failed to create draft:', draftErr);
      process.exit(1);
    }
    console.log(`✅ supplier_application_drafts created for org ${ORG_ID}`);
  }

  // 3. Confirm supplier_users still has correct org linkage
  const { data: userRows } = await dbQuery<any[]>(
    `supplier_users?auth_user_id=eq.${encodeURIComponent(AUTH_USER_ID)}&limit=1`
  );
  if (userRows && userRows.length > 0) {
    const u = userRows[0];
    if (u.organisation_id !== ORG_ID) {
      console.log(`⚠️  supplier_users.organisation_id mismatch (${u.organisation_id}) — patching...`);
      const { error: patchErr } = await dbQuery(
        `supplier_users?auth_user_id=eq.${encodeURIComponent(AUTH_USER_ID)}`,
        { method: 'PATCH', body: { organisation_id: ORG_ID, updated_at: NOW } }
      );
      if (patchErr) console.error('❌ Patch failed:', patchErr);
      else console.log(`✅ supplier_users.organisation_id corrected to ${ORG_ID}`);
    } else {
      console.log(`✅ supplier_users.organisation_id correctly linked: ${ORG_ID}`);
    }
  }

  // 4. Verify final state
  console.log('\n--- Final State ---');
  const { data: finalOrg } = await dbQuery<any[]>(
    `supplier_organisations?id=eq.${encodeURIComponent(ORG_ID)}&select=id,legal_name,lifecycle_status,owner_id`
  );
  console.log('Org:', JSON.stringify(finalOrg?.[0]));
  const { data: finalDraft } = await dbQuery<any[]>(
    `supplier_application_drafts?org_id=eq.${encodeURIComponent(ORG_ID)}&select=org_id,lifecycle_status,current_step`
  );
  console.log('Draft:', JSON.stringify(finalDraft?.[0]));
  const { data: finalUser } = await dbQuery<any[]>(
    `supplier_users?email=eq.${encodeURIComponent(EMAIL)}&select=auth_user_id,email,organisation_id,status`
  );
  console.log('User:', JSON.stringify(finalUser?.[0]));

  console.log('\n✅ REPAIR COMPLETE — petecurrey@gmail.com should now sign in → /supplier-portal/onboarding\n');
}

main().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
