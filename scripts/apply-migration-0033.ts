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

async function applyMigration() {
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
    console.log('Connected to remote PostgreSQL instance.');

    const sqlPath = path.join(__dirname, '../supabase/migrations/0033_intelligence_hardening_and_locks.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying migration 0033_intelligence_hardening_and_locks.sql...');
    await client.query(sql);

    // Record in _schema_migrations
    await client.query(
      `INSERT INTO _schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING`,
      ['0033_intelligence_hardening_and_locks.sql']
    );

    console.log('Migration 0033 applied and recorded successfully!');
  } catch (err: any) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
