const SUPABASE_URL = 'https://tyrknahwlodspvzfkdzk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cmtuYWh3bG9kc3B2emZrZHprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQxODQ3OCwiZXhwIjoyMTAyOTk0NDc4fQ.yBVGBP0r4YRHwY1rBhsnZqO-n_alrhwTO-_VmTNfJjM';

async function main() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lobby_members?email=eq.pete%40entirefm.com&select=id,display_name,email,member_status,avatar_url,bio,auth_user_id,joined_at`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  const data = await res.json();
  console.log('Pete lobby_members row:');
  console.log(JSON.stringify(data, null, 2));

  // Also verify Supabase auth confirmation
  const authRes = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?email=pete%40entirefm.com`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );
  const authData = await authRes.json() as any;
  const user = authData.users?.[0];
  console.log('\nSupabase Auth user:');
  console.log(JSON.stringify({
    id: user?.id,
    email: user?.email,
    email_confirmed_at: user?.email_confirmed_at,
    last_sign_in_at: user?.last_sign_in_at,
  }, null, 2));
}

main().catch(console.error);
