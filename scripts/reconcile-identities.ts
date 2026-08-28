import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { getDbConfig } from '../src/server/db/client';

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

async function reconcile() {
  const cfg = getDbConfig();
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log('Connected to PostgreSQL database.');

  // Drop not-null on person_id in user_identities if present
  await client.query(`ALTER TABLE public.user_identities ALTER COLUMN person_id DROP NOT NULL;`);

  // 1. Backfill existing 9 users into persons, user_identities and operational_identities
  const authRes = await fetch(`${cfg?.url}/auth/v1/admin/users`, {
    headers: {
      apikey: cfg?.key || '',
      Authorization: `Bearer ${cfg?.key}`,
    },
  });
  const authJson = await authRes.json();
  console.log('Processing', authJson?.users?.length || 0, 'existing Supabase Auth users...');

  for (const u of authJson?.users || []) {
    const meta = u.user_metadata || {};
    const firstName = meta.first_name || '';
    const lastName = meta.last_name || '';
    const displayName = `${firstName} ${lastName}`.trim() || u.email;
    const isVerified = Boolean(u.email_confirmed_at);

    // Upsert into persons
    const personRes = await client.query(
      `INSERT INTO public.persons (first_name, last_name, email, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (email) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         status = EXCLUDED.status,
         updated_at = now()
       RETURNING id`,
      [firstName, lastName, u.email, isVerified ? 'ACTIVE' : 'SUSPENDED', u.created_at]
    );
    const personId = personRes.rows[0]?.id;

    // Upsert into user_identities
    await client.query(
      `INSERT INTO public.user_identities (auth_user_id, person_id, email, primary_email_snapshot, display_name, first_name, last_name, status, created_at, updated_at)
       VALUES ($1, $2, $3, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (auth_user_id) DO UPDATE SET
         person_id = EXCLUDED.person_id,
         email = EXCLUDED.email,
         primary_email_snapshot = EXCLUDED.primary_email_snapshot,
         display_name = EXCLUDED.display_name,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         status = EXCLUDED.status,
         updated_at = now()`,
      [u.id, personId, u.email, displayName, firstName, lastName, isVerified ? 'ACTIVE' : 'PENDING_VERIFICATION', u.created_at]
    );

    // Check if contractor / supplier organisation exists
    const orgRes = await client.query('SELECT id, legal_name, lifecycle_status FROM public.supplier_organisations WHERE owner_id = $1', [u.id]);
    const org = orgRes.rows[0];

    // Upsert into operational_identities (exclusivity: 1 operational identity per auth user)
    await client.query(
      `INSERT INTO public.operational_identities (auth_user_id, identity_type, organisation_id, organisation_name, role_code, status, created_at, updated_at)
       VALUES ($1, 'CONTRACTOR', $2, $3, 'CONTRACTOR_ADMIN', $4, $5, now())
       ON CONFLICT (auth_user_id) DO UPDATE SET
         organisation_id = EXCLUDED.organisation_id,
         organisation_name = EXCLUDED.organisation_name,
         status = EXCLUDED.status,
         updated_at = now()`,
      [
        u.id,
        org?.id || null,
        org?.legal_name || 'Contractor Organisation',
        org?.lifecycle_status === 'APPROVED' ? 'ACTIVE' : isVerified ? 'ACTIVE' : 'PENDING',
        u.created_at,
      ]
    );

    // Audit log
    await client.query(
      `INSERT INTO public.user_identity_audit_log (auth_user_id, action, actor_id, details, created_at)
       VALUES ($1, 'ACCOUNT_RECONCILED', 'system_migration_0040', $2, now())`,
      [u.id, JSON.stringify({ email: u.email, role: 'CONTRACTOR', org: org?.legal_name })]
    );
  }

  // 2. Reconcile Pete Currey (pete@entirefm.com)
  console.log('Reconciling Pete Currey (pete@entirefm.com)...');

  let peteAuthId: string | null = null;
  const existingPete = (authJson?.users || []).find((u: any) => u.email?.toLowerCase() === 'pete@entirefm.com');

  if (existingPete) {
    peteAuthId = existingPete.id;
    console.log('Found existing Supabase Auth user for pete@entirefm.com:', peteAuthId);
  } else {
    // Create canonical Supabase Auth user via Admin API
    const createRes = await fetch(`${cfg?.url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: cfg?.key || '',
        Authorization: `Bearer ${cfg?.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'pete@entirefm.com',
        email_confirm: true,
        user_metadata: {
          first_name: 'Pete',
          last_name: 'Currey',
          display_name: 'Pete Currey',
          job_title: 'CEO',
          company: 'EntireFM',
        },
      }),
    });

    const createJson = await createRes.json();
    if (!createRes.ok) {
      console.error('Failed to create Supabase Auth user for pete@entirefm.com:', createJson);
      throw new Error(createJson.message || 'Supabase Auth creation failed');
    }
    peteAuthId = createJson.id || createJson.user?.id;
    console.log('Created canonical Supabase Auth user for pete@entirefm.com:', peteAuthId);
  }

  // Upsert Pete in persons
  const petePersonRes = await client.query(
    `INSERT INTO public.persons (first_name, last_name, email, job_title, status, created_at, updated_at)
     VALUES ('Pete', 'Currey', 'pete@entirefm.com', 'CEO', 'ACTIVE', now(), now())
     ON CONFLICT (email) DO UPDATE SET
       first_name = 'Pete',
       last_name = 'Currey',
       job_title = 'CEO',
       status = 'ACTIVE',
       updated_at = now()
     RETURNING id`
  );
  const petePersonId = petePersonRes.rows[0]?.id;

  // Upsert Pete in user_identities
  await client.query(
    `INSERT INTO public.user_identities (auth_user_id, person_id, email, primary_email_snapshot, display_name, first_name, last_name, status, created_at, updated_at)
     VALUES ($1, $2, 'pete@entirefm.com', 'pete@entirefm.com', 'Pete Currey', 'Pete', 'Currey', 'ACTIVE', now(), now())
     ON CONFLICT (auth_user_id) DO UPDATE SET
       person_id = EXCLUDED.person_id,
       email = 'pete@entirefm.com',
       primary_email_snapshot = 'pete@entirefm.com',
       display_name = 'Pete Currey',
       first_name = 'Pete',
       last_name = 'Currey',
       status = 'ACTIVE',
       updated_at = now()`,
    [peteAuthId, petePersonId]
  );

  // Upsert Pete in lobby_members
  await client.query(
    `INSERT INTO public.lobby_members (
      auth_user_id, email, display_name, first_name, last_name, username,
      headline, bio, company, job_title, location, linkedin_url,
      member_status, profile_visibility, disciplines, sectors, qualifications,
      badges, reputation_score, saved_content_ids, email_preferences, notification_preferences,
      email_verified_at, joined_at, created_at, updated_at
    ) VALUES (
      $1, 'pete@entirefm.com', 'Pete Currey', 'Pete', 'Currey', 'pete-currey',
      'CEO | EntireFM',
      'Chief Executive Officer at EntireFM. Leading UK facilities management operations, statutory compliance governance, and mechanical engineering delivery across commercial estates.',
      'EntireFM', 'CEO', 'London & Nationwide', 'https://linkedin.com/company/entirefm',
      'active', 'public',
      ARRAY['Building Safety', 'HVAC', 'PPM', 'Mobilisation']::text[],
      ARRAY['Commercial Offices', 'Logistics', 'Retail']::text[],
      ARRAY['Hard FM Specialist', 'Executive Leadership']::text[],
      ARRAY['Founding Member', 'Editorial Contributor', 'CEO']::text[],
      250,
      ARRAY['building-safety-act-what-fm-teams-need-to-know-now', 'condenser-airflow-starvation-on-enclosed-rooftops']::text[],
      '{"weeklyBriefing": true, "communityUpdates": true, "directMessages": true, "marketingConsent": true}'::jsonb,
      '{"inApp": true, "emailDigest": true, "mentionAlerts": true}'::jsonb,
      now(), now(), now(), now()
    )
    ON CONFLICT (auth_user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      username = EXCLUDED.username,
      headline = EXCLUDED.headline,
      bio = EXCLUDED.bio,
      company = EXCLUDED.company,
      job_title = EXCLUDED.job_title,
      member_status = 'active',
      email_verified_at = now(),
      updated_at = now()`,
    [peteAuthId]
  );

  // Audit Pete's reconciliation
  await client.query(
    `INSERT INTO public.user_identity_audit_log (auth_user_id, action, actor_id, details, created_at)
     VALUES ($1, 'LOBBY_MEMBER_RECONCILED', 'system_identity_repair', $2, now())`,
    [peteAuthId, JSON.stringify({ email: 'pete@entirefm.com', role: 'LOBBY_MEMBER', badges: ['Founding Member', 'CEO'] })]
  );

  // Check the view again
  const viewRes = await client.query('SELECT * FROM public.admin_user_identity_directory ORDER BY is_lobby_member DESC, auth_created_at DESC');
  console.log('=== ADMIN USER IDENTITY DIRECTORY POST RECONCILIATION ===');
  console.log('Total verified users in directory:', viewRes.rows.length);
  for (const r of viewRes.rows) {
    console.log(r);
  }

  await client.end();
}

reconcile().catch(console.error);
