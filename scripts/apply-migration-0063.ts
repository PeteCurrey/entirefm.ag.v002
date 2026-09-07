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

    const m0063Path = path.join(__dirname, '../supabase/migrations/0063_xero_accounting_integration.sql');
    const sql0063 = fs.readFileSync(m0063Path, 'utf8');
    console.log('Applying migration 0063_xero_accounting_integration.sql...');
    await client.query(sql0063);
    console.log('✅ Migration 0063 applied successfully.');

    // Verify tables
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('xero_connections', 'xero_oauth_states', 'xero_webhook_events')
    `);
    console.log('Verified tables:', tablesRes.rows.map(r => r.table_name));

    // Verify columns on client_accounts
    const caCols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'client_accounts' 
        AND column_name IN ('xero_contact_id', 'xero_contact_number', 'xero_synced_at')
    `);
    console.log('Verified client_accounts columns:', caCols.rows.map(r => r.column_name));

    // Verify columns on client_invoices
    const ciCols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'client_invoices' 
        AND column_name IN ('xero_invoice_id', 'xero_invoice_number', 'xero_synced_at')
    `);
    console.log('Verified client_invoices columns:', ciCols.rows.map(r => r.column_name));

  } catch (err: any) {
    console.error('Failed to apply migration 0063:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
