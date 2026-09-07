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

    const m0066Path = path.join(__dirname, '../supabase/migrations/0066_workspace_tools_and_site_profiles.sql');
    const sql0066 = fs.readFileSync(m0066Path, 'utf8');
    console.log('Applying migration 0066_workspace_tools_and_site_profiles.sql...');
    await client.query(sql0066);
    console.log('✅ Migration 0066 applied successfully.');

    // Verify tables
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('member_site_profiles', 'member_saved_tool_outputs')
    `);
    console.log('Verified tables:', tablesRes.rows.map((r) => r.table_name));
  } catch (err: any) {
    console.error('Failed to apply migration 0066:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
