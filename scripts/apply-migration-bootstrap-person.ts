/**
 * apply-migration-bootstrap-person.ts
 * ====================================
 * Upserts the system bootstrap actor person record.
 * audit_events.actor_id and client_invoices.issued_by_id both FK-reference
 * persons(id). The bootstrap actor 00000000-0000-0000-0000-000000000001 must
 * exist. Safe to run multiple times (upsert / on_conflict ignore).
 */
import { dbQuery } from '../src/server/db/client';

async function run() {
  console.log('Seeding bootstrap system actor person...');

  const result = await dbQuery('persons', {
    method: 'POST',
    body: {
      id: '00000000-0000-0000-0000-000000000001',
      first_name: 'EntireFM',
      last_name: 'System',
      email: 'system@entirefm.internal',
      phone: null,
      job_title: 'Automated System Actor',
      status: 'ACTIVE',
      metadata: { system_actor: true },
    },
    headers: {
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
  });

  if (result.error && result.status !== 200 && result.status !== 201) {
    // 409 with ignore-duplicates is fine — means it already exists
    if (result.status !== 409) {
      console.error('Failed to seed bootstrap person:', result.error, result.status);
      process.exit(1);
    }
  }

  const { data } = await dbQuery<any[]>(
    'persons?id=eq.00000000-0000-0000-0000-000000000001&select=id,first_name,last_name,email,status'
  );
  if (data && data.length > 0) {
    console.log('✅ Bootstrap person confirmed:', data[0]);
  } else {
    console.error('❌ Bootstrap person not found after upsert');
    process.exit(1);
  }
}

run().catch((err) => { console.error('Fatal:', err); process.exit(1); });
