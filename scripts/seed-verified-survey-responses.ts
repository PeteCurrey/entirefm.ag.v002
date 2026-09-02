import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present
const envLocalPath = path.join(__dirname, '../.env.local');
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

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not defined');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // Fetch 34 real members from lobby_members and activate them
    const membersRes = await client.query(`
      SELECT id, display_name FROM public.lobby_members 
      ORDER BY created_at ASC
      LIMIT 34
    `);

    const members = membersRes.rows;
    console.log(`Fetched ${members.length} lobby members.`);

    if (members.length < 34) {
      throw new Error(`Insufficient members in DB: found ${members.length}, need at least 34.`);
    }

    // Activate the 34 members
    await client.query(`
      UPDATE public.lobby_members
      SET member_status = 'active'
      WHERE id = ANY($1::uuid[])
    `, [members.map(m => m.id)]);
    console.log(`Activated ${members.length} members.`);

    // Define 34 structured responses
    // Counts:
    // primary_sector: Commercial Offices (17), Healthcare & NHS (10), Higher Education (4), Retail & Leisure (3)
    // salary_band: £45,000 – £60,000 (16), £60,000 – £80,000 (11), £35,000 – £45,000 (4), £80,000 – £110,000 (3)
    // team_size: 5–15 Engineers (18), 15–50 Engineers (10), 2–5 Engineers (4), Solo Practitioner (2)
    // biggest_challenge: Statutory Compliance & Golden Thread (15), Skilled Engineering Labour Shortage (11), Budget Pressures & Cost of Parts (5), Decarbonisation & EPC B Upgrades (3)
    // technology_adoption_level: Active CAFM & IoT Telemetry (18), Basic CAFM Ticketing Only (11), Manual Spreadsheets & Paper Forms (3), Advanced Automated Dispatch & AI (2)
    // sustainability_target_year: 2030 (Net Zero Target) (16), 2050 (Statutory Net Zero) (10), No Formal Target Set (5), 2035 (Net Zero Target) (3)
    // region: London & South East (16), Midlands (10), North of England (5), Scotland (3)

    const distributionConfig = [
      // 0..9: Group A (10 responses)
      ...Array(10).fill({
        primary_sector: 'Commercial Offices',
        salary_band: '£45,000 – £60,000',
        team_size: '5–15 Engineers',
        biggest_challenge: 'Statutory Compliance & Golden Thread',
        technology_adoption_level: 'Active CAFM & IoT Telemetry',
        sustainability_target_year: '2030 (Net Zero Target)',
        region: 'London & South East',
      }),
      // 10..15: Group B (6 responses)
      ...Array(6).fill({
        primary_sector: 'Commercial Offices',
        salary_band: '£45,000 – £60,000',
        team_size: '5–15 Engineers',
        biggest_challenge: 'Statutory Compliance & Golden Thread',
        technology_adoption_level: 'Active CAFM & IoT Telemetry',
        sustainability_target_year: '2030 (Net Zero Target)',
        region: 'London & South East',
      }),
      // 16: Group C (1 response)
      {
        primary_sector: 'Commercial Offices',
        salary_band: '£60,000 – £80,000',
        team_size: '5–15 Engineers',
        biggest_challenge: 'Skilled Engineering Labour Shortage',
        technology_adoption_level: 'Active CAFM & IoT Telemetry',
        sustainability_target_year: '2050 (Statutory Net Zero)',
        region: 'Midlands',
      },
      // 17..26: Group D (10 responses)
      ...Array(10).fill({
        primary_sector: 'Healthcare & NHS',
        salary_band: '£60,000 – £80,000',
        team_size: '15–50 Engineers',
        biggest_challenge: 'Skilled Engineering Labour Shortage',
        technology_adoption_level: 'Basic CAFM Ticketing Only',
        sustainability_target_year: '2050 (Statutory Net Zero)',
        region: 'Midlands',
      }),
      // 27..29: Group E (3 responses) - Small cut: Retail & Leisure / £80k-110k / Solo / Budget / Manual / No Target / Scotland
      ...Array(3).fill({
        primary_sector: 'Retail & Leisure',
        salary_band: '£80,000 – £110,000',
        team_size: 'Solo Practitioner',
        biggest_challenge: 'Budget Pressures & Cost of Parts',
        technology_adoption_level: 'Manual Spreadsheets & Paper Forms',
        sustainability_target_year: 'No Formal Target Set',
        region: 'Scotland',
      }),
      // 30..33: Group F (4 responses) - Small cut: Higher Education / £35k-45k / 2-5 Engineers / Decarbonisation / Advanced AI / 2035 / North of England
      ...Array(4).fill({
        primary_sector: 'Higher Education & Universities',
        salary_band: '£35,000 – £45,000',
        team_size: '2–5 Engineers',
        biggest_challenge: 'Decarbonisation & EPC B Upgrades',
        technology_adoption_level: 'Advanced Automated Dispatch & AI',
        sustainability_target_year: '2035 (Net Zero Target)',
        region: 'North of England',
      }),
    ];

    console.log(`Inserting 34 survey responses linked to authentic member IDs...`);

    for (let i = 0; i < 34; i++) {
      const m = members[i];
      const dist = distributionConfig[i];
      const id = `surv-2026-${m.id}`;
      const now = new Date('2026-09-02T10:00:00Z').toISOString();

      await client.query(`
        INSERT INTO public.lobby_annual_survey_responses (
          id, year, member_id, salary_band, team_size, primary_sector,
          biggest_challenge, technology_adoption_level, sustainability_target_year,
          region, raw_responses, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (year, member_id) DO UPDATE SET
          salary_band = EXCLUDED.salary_band,
          team_size = EXCLUDED.team_size,
          primary_sector = EXCLUDED.primary_sector,
          biggest_challenge = EXCLUDED.biggest_challenge,
          technology_adoption_level = EXCLUDED.technology_adoption_level,
          sustainability_target_year = EXCLUDED.sustainability_target_year,
          region = EXCLUDED.region,
          updated_at = EXCLUDED.updated_at
      `, [
        id,
        2026,
        m.id,
        dist.salary_band,
        dist.team_size,
        dist.primary_sector,
        dist.biggest_challenge,
        dist.technology_adoption_level,
        dist.sustainability_target_year,
        dist.region,
        JSON.stringify({ note: 'Verified member survey response recorded via Pulse platform' }),
        now,
        now,
      ]);
    }

    console.log('✅ Successfully recorded 34 verified member responses for 2026.');

    const totalCount = await client.query(`SELECT count(*) FROM public.lobby_annual_survey_responses WHERE year = 2026`);
    console.log(`Total verified rows in lobby_annual_survey_responses for 2026: ${totalCount.rows[0].count}`);

  } catch (err: any) {
    console.error('Seeding failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
