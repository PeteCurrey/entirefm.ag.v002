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

    const m0058Path = path.join(__dirname, '../supabase/migrations/0058_phase2_cafm_operational_lifecycle.sql');
    const sql0058 = fs.readFileSync(m0058Path, 'utf8');
    console.log('Applying migration 0058_phase2_cafm_operational_lifecycle.sql...');
    await client.query(sql0058);
    console.log('✅ Migration 0058 applied successfully.');

    // Verify columns
    const quoteCols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'quotes' 
        AND column_name IN ('site_id', 'converted_work_order_id')
    `);
    console.log('Verified quotes columns:', quoteCols.rows.map(r => r.column_name));

    const woCols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'work_orders' 
        AND column_name IN ('quote_id', 'lead_engineer_id')
    `);
    console.log('Verified work_orders columns:', woCols.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
