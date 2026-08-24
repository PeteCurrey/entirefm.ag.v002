/**
 * Remote Supabase Migration Runner
 * =================================
 * Sequentially executes all migrations in supabase/migrations against DATABASE_URL.
 * Tracks applied migrations in _schema_migrations.
 */

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
    console.error('ERROR: DATABASE_URL not defined in environment');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to remote PostgreSQL instance.');

    // Ensure tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _schema_migrations (
        version text PRIMARY KEY,
        applied_at timestamptz DEFAULT now()
      );
    `);

    const appliedRes = await client.query(`SELECT version FROM _schema_migrations`);
    const applied = new Set(appliedRes.rows.map((r: any) => r.version));

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    console.log(`Found ${files.length} migration files.`);

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`⏩ Already applied: ${file}`);
        continue;
      }

      console.log(`⏳ Applying: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO _schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Applied: ${file}`);
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Migration failed on ${file}:`, err.message);
        throw err;
      }
    }

    // Inspect created tables
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name NOT LIKE '_schema_%'
      ORDER BY table_name;
    `);

    console.log('\n══════════════════════════════════════════════════════════════');
    console.log(`🎉 REMOTE MIGRATION COMPLETE! Total tables: ${tablesRes.rows.length}`);
    console.log('══════════════════════════════════════════════════════════════');
    console.log(tablesRes.rows.map((r: any) => r.table_name).join(', '));

    await client.end();
  } catch (err: any) {
    console.error('Fatal migration error:', err);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

run();
