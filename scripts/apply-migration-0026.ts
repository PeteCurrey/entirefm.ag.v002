/**
 * Apply migration 0026_platform_integration_configs_and_budget.sql
 * to the remote Supabase instance.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

const DB_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

async function main() {
  const sql = readFileSync(
    join(__dirname, '../supabase/migrations/0026_platform_integration_configs_and_budget.sql'),
    'utf-8'
  );
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected to remote Supabase. Applying migration 0026...');
  try {
    await client.query(sql);
    // Record in _schema_migrations (idempotent)
    await client.query(`
      INSERT INTO _schema_migrations (version, applied_at)
      VALUES ('0026_platform_integration_configs_and_budget.sql', now())
      ON CONFLICT (version) DO NOTHING
    `).catch(() => {}); // table may not track custom columns
    console.log('✓ Migration 0026 applied successfully.');
  } finally {
    await client.end();
  }
}

main().catch(err => { console.error('Migration 0026 failed:', err.message); process.exit(1); });
