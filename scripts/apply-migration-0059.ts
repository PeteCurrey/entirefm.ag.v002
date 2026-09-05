import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

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

    const m0059Path = path.join(__dirname, '../supabase/migrations/0059_scheduled_automation_jobs.sql');
    const sql0059 = fs.readFileSync(m0059Path, 'utf8');
    console.log('Applying migration 0059_scheduled_automation_jobs.sql...');
    await client.query(sql0059);
    console.log('✅ Migration 0059 applied successfully.');

    // Verify table
    const tableRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'scheduled_automation_jobs'
    `);
    console.log('Columns in scheduled_automation_jobs:', tableRes.rows.map(r => `${r.column_name} (${r.data_type})`));
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
