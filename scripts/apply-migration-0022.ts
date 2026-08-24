/**
 * Apply migration 0022 to remote Supabase via pg (node-postgres).
 * Run with: node_modules/.bin/tsx scratch/apply_migration_0022.ts
 */
import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

const sql = readFileSync(
  '/Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/supabase/migrations/0022_compliance_intelligence_audit_readiness.sql',
  'utf8'
);

async function run() {
  const client = new Client({
    connectionString:
      'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to remote Supabase.');

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✓ Migration 0022 applied successfully.');
  } catch (err: unknown) {
    await client.query('ROLLBACK');
    console.error('✗ Migration failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
