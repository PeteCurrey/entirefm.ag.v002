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

    const m0054Path = path.join(__dirname, '../supabase/migrations/0054_estate_client_asset_links.sql');
    const sql0054 = fs.readFileSync(m0054Path, 'utf8');
    console.log('Applying migration 0054_estate_client_asset_links.sql...');
    await client.query(sql0054);
    console.log('✅ Migration 0054 applied successfully.');

    // Verify
    const tableCheck1 = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'estate_client_asset_links'
    `);
    const tableCheck2 = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'estate_client_link_dismissals'
    `);
    console.log('Verified estate_client_asset_links:', tableCheck1.rows.length > 0);
    console.log('Verified estate_client_link_dismissals:', tableCheck2.rows.length > 0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
