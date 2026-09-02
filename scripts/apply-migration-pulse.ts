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

    // 1. Migration 0051
    const m0051Path = path.join(__dirname, '../supabase/migrations/0051_pulse_benchmark_snapshots.sql');
    const sql0051 = fs.readFileSync(m0051Path, 'utf8');
    console.log('Applying migration 0051_pulse_benchmark_snapshots.sql...');
    await client.query(sql0051);
    console.log('✅ Migration 0051 applied successfully.');

    // 2. Migration 0052
    const m0052Path = path.join(__dirname, '../supabase/migrations/0052_pulse_survey_region_field.sql');
    const sql0052 = fs.readFileSync(m0052Path, 'utf8');
    console.log('Applying migration 0052_pulse_survey_region_field.sql...');
    await client.query(sql0052);
    console.log('✅ Migration 0052 applied successfully.');

    // Verify
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'pulse_benchmark_snapshots'
    `);
    console.log('Verified table pulse_benchmark_snapshots:', tableCheck.rows.length > 0);

    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'lobby_annual_survey_responses' AND column_name = 'region'
    `);
    console.log('Verified column region in lobby_annual_survey_responses:', colCheck.rows.length > 0);

  } catch (err: any) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
