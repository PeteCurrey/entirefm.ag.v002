/**
 * Purge Mock Work Orders & Harden Foreign Key Constraints
 * -------------------------------------------------------
 * 1. Adjust FK constraints referencing work_orders to ON DELETE SET NULL or CASCADE.
 * 2. Purge all mock work orders except EFM-WO-2026-111123.
 * 3. Verify only EFM-WO-2026-111123 remains.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not found');
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to PostgreSQL.');

  try {
    await client.query('BEGIN');

    // 1. Alter constraints to SET NULL or CASCADE
    const constraintUpdates = [
      {
        table: 'quotes',
        constraint: 'quotes_work_order_id_fkey',
        sql: `
          ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_work_order_id_fkey;
          ALTER TABLE quotes ADD CONSTRAINT quotes_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'purchase_orders',
        constraint: 'purchase_orders_work_order_id_fkey',
        sql: `
          ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_work_order_id_fkey;
          ALTER TABLE purchase_orders ADD CONSTRAINT purchase_orders_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'client_invoice_lines',
        constraint: 'client_invoice_lines_work_order_id_fkey',
        sql: `
          ALTER TABLE client_invoice_lines DROP CONSTRAINT IF EXISTS client_invoice_lines_work_order_id_fkey;
          ALTER TABLE client_invoice_lines ADD CONSTRAINT client_invoice_lines_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'supplier_invoices',
        constraint: 'supplier_invoices_work_order_id_fkey',
        sql: `
          ALTER TABLE supplier_invoices DROP CONSTRAINT IF EXISTS supplier_invoices_work_order_id_fkey;
          ALTER TABLE supplier_invoices ADD CONSTRAINT supplier_invoices_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'supplier_invoices',
        constraint: 'supplier_invoices_matched_work_order_id_fkey',
        sql: `
          ALTER TABLE supplier_invoices DROP CONSTRAINT IF EXISTS supplier_invoices_matched_work_order_id_fkey;
          ALTER TABLE supplier_invoices ADD CONSTRAINT supplier_invoices_matched_work_order_id_fkey FOREIGN KEY (matched_work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'supplier_invoice_lines',
        constraint: 'supplier_invoice_lines_work_order_id_fkey',
        sql: `
          ALTER TABLE supplier_invoice_lines DROP CONSTRAINT IF EXISTS supplier_invoice_lines_work_order_id_fkey;
          ALTER TABLE supplier_invoice_lines ADD CONSTRAINT supplier_invoice_lines_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'maintenance_occurrences',
        constraint: 'maintenance_occurrences_work_order_id_fkey',
        sql: `
          ALTER TABLE maintenance_occurrences DROP CONSTRAINT IF EXISTS maintenance_occurrences_work_order_id_fkey;
          ALTER TABLE maintenance_occurrences ADD CONSTRAINT maintenance_occurrences_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'field_captures',
        constraint: 'field_captures_work_order_id_fkey',
        sql: `
          ALTER TABLE field_captures DROP CONSTRAINT IF EXISTS field_captures_work_order_id_fkey;
          ALTER TABLE field_captures ADD CONSTRAINT field_captures_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE;
        `
      },
      {
        table: 'client_invoice_lines',
        constraint: 'client_invoice_lines_billing_record_id_fkey',
        sql: `
          ALTER TABLE client_invoice_lines DROP CONSTRAINT IF EXISTS client_invoice_lines_billing_record_id_fkey;
          ALTER TABLE client_invoice_lines ADD CONSTRAINT client_invoice_lines_billing_record_id_fkey FOREIGN KEY (billing_record_id) REFERENCES client_billing_records(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'cost_attributions',
        constraint: 'cost_attributions_client_billing_record_id_fkey',
        sql: `
          ALTER TABLE cost_attributions DROP CONSTRAINT IF EXISTS cost_attributions_client_billing_record_id_fkey;
          ALTER TABLE cost_attributions ADD CONSTRAINT cost_attributions_client_billing_record_id_fkey FOREIGN KEY (client_billing_record_id) REFERENCES client_billing_records(id) ON DELETE SET NULL;
        `
      },
      {
        table: 'revenue_exposures',
        constraint: 'revenue_exposures_work_order_id_fkey',
        sql: `
          ALTER TABLE revenue_exposures DROP CONSTRAINT IF EXISTS revenue_exposures_work_order_id_fkey;
          ALTER TABLE revenue_exposures ADD CONSTRAINT revenue_exposures_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE;
        `
      },
      {
        table: 'cost_attributions',
        constraint: 'cost_attributions_work_order_id_fkey',
        sql: `
          ALTER TABLE cost_attributions DROP CONSTRAINT IF EXISTS cost_attributions_work_order_id_fkey;
          ALTER TABLE cost_attributions ADD CONSTRAINT cost_attributions_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE;
        `
      },
    ];

    for (const cu of constraintUpdates) {
      console.log(`Updating FK ${cu.constraint} on ${cu.table}...`);
      await client.query(cu.sql);
    }

    // 2. Identify mock work orders
    const mockWosRes = await client.query(`
      SELECT id, work_order_number, title 
      FROM work_orders 
      WHERE work_order_number != 'EFM-WO-2026-111123';
    `);

    console.log(`Found ${mockWosRes.rows.length} mock work orders to delete:`);
    for (const row of mockWosRes.rows) {
      console.log(` - ${row.work_order_number}: ${row.title} (${row.id})`);
    }

    // Explicitly clean up any unlinked references to mock orders before deletion
    await client.query(`
      UPDATE client_invoice_lines 
      SET billing_record_id = NULL, work_order_id = NULL 
      WHERE work_order_id IN (SELECT id FROM work_orders WHERE work_order_number != 'EFM-WO-2026-111123')
         OR billing_record_id IN (SELECT id FROM client_billing_records WHERE work_order_id IN (SELECT id FROM work_orders WHERE work_order_number != 'EFM-WO-2026-111123'));
    `);

    await client.query(`
      UPDATE cost_attributions
      SET client_billing_record_id = NULL
      WHERE client_billing_record_id IN (SELECT id FROM client_billing_records WHERE work_order_id IN (SELECT id FROM work_orders WHERE work_order_number != 'EFM-WO-2026-111123'));
    `);

    // 3. Delete mock work orders
    const deleteRes = await client.query(`
      DELETE FROM work_orders 
      WHERE work_order_number != 'EFM-WO-2026-111123';
    `);
    console.log(`Deleted ${deleteRes.rowCount} mock work orders.`);

    // 4. Verify remaining work orders
    const remainingRes = await client.query(`
      SELECT id, work_order_number, title, status FROM work_orders;
    `);
    console.log(`Remaining work orders count: ${remainingRes.rows.length}`);
    console.log('Remaining work orders:', remainingRes.rows);

    if (
      remainingRes.rows.length === 1 &&
      remainingRes.rows[0].work_order_number === 'EFM-WO-2026-111123'
    ) {
      await client.query('COMMIT');
      console.log('Transaction committed successfully! Only EFM-WO-2026-111123 remains.');
    } else {
      await client.query('ROLLBACK');
      console.error('Validation failed! Expected only EFM-WO-2026-111123. Rolled back.');
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during purge, rolled back:', err);
    throw err;
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
