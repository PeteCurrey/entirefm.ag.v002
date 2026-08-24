/**
 * Apply migration 0025_ceo_command_enterprise_intelligence.sql
 * to the remote Supabase instance.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

const DB_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

async function main() {
  const sql = readFileSync(
    join(__dirname, '../supabase/migrations/0025_ceo_command_enterprise_intelligence.sql'),
    'utf-8'
  );
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to remote Supabase. Applying migration 0025...');
  try {
    await client.query(sql);
    console.log('✓ Migration 0025 applied successfully.');
  } finally {
    await client.end();
  }
}

main().catch(err => { console.error('Migration 0025 failed:', err.message); process.exit(1); });
