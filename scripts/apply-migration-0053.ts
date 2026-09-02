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

    const m0053Path = path.join(__dirname, '../supabase/migrations/0053_lobby_client_links.sql');
    const sql0053 = fs.readFileSync(m0053Path, 'utf8');
    console.log('Applying migration 0053_lobby_client_links.sql...');
    await client.query(sql0053);
    console.log('✅ Migration 0053 applied successfully.');

    // Verify
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'lobby_client_links'
    `);
    console.log('Verified table lobby_client_links exists:', tableCheck.rows.length > 0);

    const cols = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'lobby_client_links'
      ORDER BY ordinal_position
    `);
    console.log('Columns in lobby_client_links:', cols.rows);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
