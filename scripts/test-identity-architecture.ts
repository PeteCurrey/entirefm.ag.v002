import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { getDbConfig, dbQuery } from '../src/server/db/client';
import { getMemberById, getMemberByEmail, getPublicMemberProfile } from '../src/server/member/member-store';

const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function runTests() {
  console.log('══════════════════════════════════════════════════════');
  console.log('  ENTIREFM CANONICAL IDENTITY SUITE TEST');
  console.log('══════════════════════════════════════════════════════');

  // Test 1: Verify Pete Currey profile in PostgreSQL and Supabase Auth
  console.log('\n[TEST 1] Verifying Pete Currey (pete@entirefm.com)...');
  const peteMember = await getMemberByEmail('pete@entirefm.com');
  if (!peteMember) throw new Error('FAIL: Pete Currey not found in lobby_members!');
  console.log('✓ Found Lobby Member:', {
    id: peteMember.id,
    auth_user_id: peteMember.auth_user_id,
    email: peteMember.email,
    username: peteMember.username,
    display_name: peteMember.display_name,
    headline: peteMember.headline,
    member_status: peteMember.member_status,
  });

  if (!peteMember.auth_user_id) throw new Error('FAIL: Pete Currey has no auth_user_id!');

  // Test 2: Verify Pete Public Profile
  const petePublic = await getPublicMemberProfile('pete-currey');
  if (!petePublic) throw new Error('FAIL: Pete Currey public profile lookup failed!');
  console.log('✓ Public Profile:', {
    username: petePublic.username,
    display_name: petePublic.display_name,
    badges: petePublic.badges,
    reputation: petePublic.reputation_score,
  });

  // Test 3: Verify Admin User Identity Directory View
  console.log('\n[TEST 2] Verifying admin_user_identity_directory view...');
  const { data: directory, error: dirErr } = await dbQuery<any[]>('admin_user_identity_directory?select=*');
  if (dirErr || !directory) throw new Error(`FAIL: admin_user_identity_directory error: ${dirErr}`);
  console.log(`✓ Directory returned ${directory.length} canonical records:`);

  for (const u of directory) {
    console.log(`  • [${u.email}] verified: ${u.email_verified} | Lobby: ${u.is_lobby_member ? `Member (${u.lobby_member_status})` : 'No'} | Operational: ${u.operational_identity_type} (${u.organisation_name || 'None'})`);
  }

  // Test 4: Verify Database Exclusivity Constraint on operational_identities
  console.log('\n[TEST 3] Verifying Operational Exclusivity Constraint...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Try to insert a second operational identity for an existing auth_user_id
  const testUserId = peteMember.auth_user_id;
  try {
    await client.query(
      `INSERT INTO public.operational_identities (auth_user_id, identity_type, role_code, status)
       VALUES ($1, 'CLIENT', 'CLIENT_ADMIN', 'ACTIVE')`,
      [testUserId]
    );
    console.log('  • Inserted initial operational identity for test');

    // Attempt conflict insert
    let conflictCaught = false;
    try {
      await client.query(
        `INSERT INTO public.operational_identities (auth_user_id, identity_type, role_code, status)
         VALUES ($1, 'ENGINEER', 'ENGINEER', 'ACTIVE')`,
        [testUserId]
      );
    } catch (e: any) {
      if (e.code === '23505') { // unique violation
        conflictCaught = true;
        console.log('✓ SUCCESS: Database strictly rejected duplicate operational identity (Unique Violation 23505)');
      }
    }

    if (!conflictCaught) {
      throw new Error('FAIL: Database allowed dual operational identity on same auth_user_id!');
    }

    // Clean up test operational identity for Pete (leaving him Lobby only)
    await client.query('DELETE FROM public.operational_identities WHERE auth_user_id = $1', [testUserId]);
    console.log('  • Cleaned up test record, Pete restored to Lobby Only');
  } finally {
    await client.end();
  }

  console.log('\n══════════════════════════════════════════════════════');
  console.log('  ✓ ALL IDENTITY ARCHITECTURE TESTS PASSED');
  console.log('══════════════════════════════════════════════════════\n');
}

runTests().catch((e) => {
  console.error('\n❌ TEST FAILED:', e);
  process.exit(1);
});
