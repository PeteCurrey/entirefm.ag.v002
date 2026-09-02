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
    console.log('Connected to remote PostgreSQL database.');

    const sqlPath = path.join(__dirname, '../supabase/migrations/0046_lobby_messages_and_intelligence_persistence.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying migration 0046_lobby_messages_and_intelligence_persistence.sql...');
    await client.query(sql);

    // Record in _schema_migrations
    await client.query(
      `INSERT INTO _schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING`,
      ['0046_lobby_messages_and_intelligence_persistence.sql']
    );

    console.log('✅ Migration 0046 applied and recorded successfully!');

    // Verify all 8 created tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN (
        'lobby_conversations', 
        'lobby_conversation_participants', 
        'lobby_direct_messages', 
        'lobby_member_blocks',
        'canonical_intelligence_items',
        'procurement_opportunities',
        'raw_intelligence_records',
        'intelligence_ingestion_runs'
      )
      ORDER BY table_name
    `);
    console.log('Verified created tables:', tables.rows.map(r => r.table_name));
  } catch (err: any) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
