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

    const sqlPath = path.join(__dirname, '../supabase/migrations/0048_lobby_six_growth_features.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying migration 0048_lobby_six_growth_features.sql...');
    await client.query(sql);

    console.log('✅ Migration 0048 applied and recorded successfully!');

    // Verify all created tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN (
        'lobby_job_listings',
        'lobby_job_applications',
        'lobby_saved_jobs',
        'lobby_member_cpd_logs',
        'lobby_event_rsvps',
        'lobby_annual_survey_responses'
      )
      ORDER BY table_name
    `);
    console.log('Verified created tables:', tables.rows.map(r => r.table_name));

    // Verify columns added
    const orgCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'organisations' AND column_name = 'public_performance_visible'`);
    const memCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'lobby_members' AND column_name = 'cpd_hours_logged'`);
    console.log('Verified added columns:', {
      organisations_public_performance_visible: orgCols.rows.length > 0,
      lobby_members_cpd_hours_logged: memCols.rows.length > 0
    });

  } catch (err: any) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
