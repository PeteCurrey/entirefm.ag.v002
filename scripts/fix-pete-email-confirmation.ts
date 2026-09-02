/**
 * Fix Pete's email confirmation in Supabase Auth admin API
 * Confirms email for pete@entirefm.com and activates lobby_member record
 */

const SUPABASE_URL = 'https://tyrknahwlodspvzfkdzk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cmtuYWh3bG9kc3B2emZrZHprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQxODQ3OCwiZXhwIjoyMTAyOTk0NDc4fQ.yBVGBP0r4YRHwY1rBhsnZqO-n_alrhwTO-_VmTNfJjM';
const TARGET_EMAIL = 'pete@entirefm.com';

async function main() {
  console.log(`[1] Looking up Supabase Auth user: ${TARGET_EMAIL}`);

  // Fetch auth user by email via admin API
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(TARGET_EMAIL)}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  if (!listRes.ok) {
    const errText = await listRes.text();
    throw new Error(`Failed to list users: ${listRes.status} ${errText}`);
  }

  const listData = await listRes.json() as any;
  const users: any[] = listData.users || [];
  
  const authUser = users.find((u: any) => u.email?.toLowerCase() === TARGET_EMAIL.toLowerCase());
  
  if (!authUser) {
    throw new Error(`No Supabase Auth user found with email ${TARGET_EMAIL}`);
  }
  
  console.log(`[2] Found auth user: ${authUser.id} | email_confirmed_at: ${authUser.email_confirmed_at || 'NULL'}`);

  // Confirm the email via admin update
  const now = new Date().toISOString();
  const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${authUser.id}`, {
    method: 'PUT',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_confirm: true,
      user_metadata: authUser.user_metadata,
    }),
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to confirm email: ${updateRes.status} ${errText}`);
  }

  const updated = await updateRes.json() as any;
  console.log(`[3] ✅ Email confirmed: ${updated.email_confirmed_at}`);

  // Now update lobby_members to active status if pending_verification
  console.log(`[4] Checking lobby_members record...`);
  const memberRes = await fetch(
    `${SUPABASE_URL}/rest/v1/lobby_members?or=(auth_user_id.eq.${authUser.id},email.eq.${encodeURIComponent(TARGET_EMAIL)})&select=*&limit=5`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!memberRes.ok) {
    const errText = await memberRes.text();
    throw new Error(`Failed to fetch lobby_member: ${memberRes.status} ${errText}`);
  }

  const members: any[] = await memberRes.json();
  console.log(`[5] Found ${members.length} lobby_member record(s)`);

  for (const member of members) {
    console.log(`    Member: ${member.id} | status: ${member.member_status} | email: ${member.email} | auth_user_id: ${member.auth_user_id}`);

    const needsActivation = member.member_status === 'pending_verification' || member.member_status === 'pending';
    const needsLinking = !member.auth_user_id || member.auth_user_id !== authUser.id;

    if (needsActivation || needsLinking) {
      const patchBody: any = { updated_at: now };
      if (needsActivation) {
        patchBody.member_status = 'active';
        patchBody.email_verified_at = now;
      }
      if (needsLinking) {
        patchBody.auth_user_id = authUser.id;
      }

      const patchRes = await fetch(
        `${SUPABASE_URL}/rest/v1/lobby_members?id=eq.${member.id}`,
        {
          method: 'PATCH',
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify(patchBody),
        }
      );

      if (!patchRes.ok) {
        const errText = await patchRes.text();
        console.error(`    ❌ Failed to patch member: ${patchRes.status} ${errText}`);
      } else {
        const patched = await patchRes.json() as any[];
        const p = patched[0] || {};
        console.log(`    ✅ Updated: status=${p.member_status}, auth_user_id=${p.auth_user_id}`);
      }
    } else {
      console.log(`    ✅ Member already active and linked — no changes needed`);
    }
  }

  if (members.length === 0) {
    console.warn(`[WARN] No lobby_members row found for ${TARGET_EMAIL}. You may need to create one.`);
  }

  console.log('\n✅ Done. Pete can now sign in at /join or /lobby with pete@entirefm.com');
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
