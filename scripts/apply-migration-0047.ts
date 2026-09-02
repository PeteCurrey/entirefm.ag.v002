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

async function applyMigration() {
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
    console.log('Connected to remote PostgreSQL database.');

    const sqlPath = path.join(__dirname, '../supabase/migrations/0047_lobby_community_rooms_awards_research_persistence.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying migration 0047_lobby_community_rooms_awards_research_persistence.sql...');
    await client.query(sql);

    console.log('✅ Migration 0047 applied and recorded successfully!');

    // Verify all created tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN (
        'community_discussions',
        'community_discussion_replies',
        'community_helpful_reactions',
        'community_moderation_cases',
        'community_reputation_events',
        'community_polls',
        'community_poll_votes',
        'community_challenges',
        'community_challenge_responses',
        'community_ask_entirefm_submissions',
        'lobby_rooms',
        'lobby_room_messages',
        'lobby_industry_awards',
        'lobby_saved_research'
      )
      ORDER BY table_name
    `);
    console.log('Verified created tables:', tables.rows.map(r => r.table_name));

    // Check awards seed
    const awards = await client.query(`SELECT slug, name FROM public.lobby_industry_awards ORDER BY entry_deadline`);
    console.log('Seeded awards:', awards.rows);

    // Check rooms seed
    const rooms = await client.query(`SELECT slug, name FROM public.lobby_rooms ORDER BY id`);
    console.log('Seeded rooms:', rooms.rows);

  } catch (err: any) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
