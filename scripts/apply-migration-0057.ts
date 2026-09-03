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

    const m0057Path = path.join(__dirname, '../supabase/migrations/0057_internal_team_and_client_account_schema.sql');
    const sql0057 = fs.readFileSync(m0057Path, 'utf8');
    console.log('Applying migration 0057_internal_team_and_client_account_schema.sql...');
    await client.query(sql0057);
    console.log('✅ Migration 0057 applied successfully.');

    // Notify PostgREST to reload its schema cache
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('✅ Notified PostgREST to reload schema cache.');

    // Verify columns on client_accounts
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'client_accounts'
      ORDER BY ordinal_position;
    `);
    console.log('Verified client_accounts columns:', cols.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Migration 0057 failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
