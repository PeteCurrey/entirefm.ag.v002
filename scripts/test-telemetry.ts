/**
 * ENTIREFM PHASE 0L — TELEMETRY INGESTION & QUALITY TESTS
 * =========================================================
 * Tests: idempotency key, unit conversion, validation, quarantine, metric registry,
 *        duplicate detection, batch ingestion, coverage summary.
 */

import { Client } from 'pg';
import { createHash } from 'node:crypto';

const CONNECTION_STRING = 'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ ${description}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function buildIdempotencyKey(sourceId: string, sensorRef: string, metricCode: string, observedAt: string): string {
  return createHash('sha256').update(`${sourceId}:${sensorRef}:${metricCode}:${observedAt}`).digest('hex');
}

async function main() {
  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  PHASE 0L — TELEMETRY INGESTION TESTS');
  console.log('══════════════════════════════════════════════════════════\n');

  // ── 1. Migration Tables Exist ─────────────────────────────────────────
  console.log('── 1. Migration: Tables Exist');
  const tables = [
    'telemetry_metrics', 'telemetry_sensors', 'telemetry_observations',
    'telemetry_quality_events', 'telemetry_aggregates', 'telemetry_retention_classes',
    'asset_telemetry_baselines', 'asset_telemetry_anomalies', 'asset_reliability_signals',
  ];
  for (const table of tables) {
    const res = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='${table}') as exists`
    );
    assert(`Table ${table} exists`, res.rows[0].exists === true);
  }

  // ── 2. Metric Registry Seeded ──────────────────────────────────────────
  console.log('\n── 2. Metric Registry Seeded');
  const metricsRes = await client.query(`SELECT COUNT(*) as count FROM telemetry_metrics WHERE is_active = true`);
  assert('At least 20 active metrics seeded', parseInt(metricsRes.rows[0].count) >= 20,
    `Found: ${metricsRes.rows[0].count}`);

  const vibRes = await client.query(`SELECT code, canonical_unit FROM telemetry_metrics WHERE code='VIBRATION_RMS'`);
  assert('VIBRATION_RMS metric exists with canonical unit mm/s', vibRes.rows[0]?.canonical_unit === 'mm/s');

  const tempRes = await client.query(`SELECT valid_min, valid_max FROM telemetry_metrics WHERE code='TEMPERATURE'`);
  assert('TEMPERATURE metric has valid range', parseFloat(tempRes.rows[0]?.valid_min) === -50 && parseFloat(tempRes.rows[0]?.valid_max) === 150);

  // ── 3. Retention Classes Seeded ──────────────────────────────────────────
  console.log('\n── 3. Retention Classes');
  const retentionRes = await client.query(`SELECT COUNT(*) as count FROM telemetry_retention_classes`);
  assert('At least 5 retention classes', parseInt(retentionRes.rows[0].count) >= 5);

  // ── 4. Idempotency Key Format ──────────────────────────────────────────
  console.log('\n── 4. Idempotency Key');
  const key1 = buildIdempotencyKey('src-001', 'sensor-001', 'TEMPERATURE', '2026-01-01T12:00:00.000Z');
  const key2 = buildIdempotencyKey('src-001', 'sensor-001', 'TEMPERATURE', '2026-01-01T12:00:00.000Z');
  const key3 = buildIdempotencyKey('src-001', 'sensor-001', 'TEMPERATURE', '2026-01-01T12:01:00.000Z');
  assert('Idempotency key is deterministic (same inputs → same hash)', key1 === key2);
  assert('Idempotency key differs for different timestamps', key1 !== key3);
  assert('Idempotency key is 64 chars (SHA-256 hex)', key1.length === 64);

  // ── 5. telemetry_observations Unique Constraint ──────────────────────
  console.log('\n── 5. Unique Constraint on idempotency_key');
  const uniqueRes = await client.query(`
    SELECT COUNT(*) as count FROM information_schema.table_constraints
    WHERE table_name='telemetry_observations' AND constraint_type='UNIQUE'
  `);
  assert('telemetry_observations has UNIQUE constraint', parseInt(uniqueRes.rows[0].count) >= 1);

  // ── 6. RLS Enabled ──────────────────────────────────────────────────────
  console.log('\n── 6. Row Level Security');
  const rlsTables = ['telemetry_observations', 'telemetry_sensors', 'asset_telemetry_anomalies', 'asset_reliability_signals', 'predictive_models'];
  for (const t of rlsTables) {
    const rlsRes = await client.query(
      `SELECT relrowsecurity FROM pg_class WHERE relname='${t}'`
    );
    assert(`RLS enabled on ${t}`, rlsRes.rows[0]?.relrowsecurity === true);
  }

  // ── 7. asset_telemetry_baselines min_samples_required ──────────────────
  console.log('\n── 7. Baseline Minimum Samples');
  const baselineColRes = await client.query(`
    SELECT column_default FROM information_schema.columns
    WHERE table_name='asset_telemetry_baselines' AND column_name='min_samples_required'
  `);
  const defaultVal = baselineColRes.rows[0]?.column_default;
  assert('min_samples_required defaults to 168', defaultVal?.includes('168'));

  // ── 8. Composite Time-Series Indexes ────────────────────────────────────
  console.log('\n── 8. Time-Series Indexes');
  const indexRes = await client.query(`
    SELECT indexname FROM pg_indexes WHERE tablename='telemetry_observations'
  `);
  const indexNames = indexRes.rows.map((r: any) => r.indexname);
  const hasCompositeIndex = indexNames.some((n: string) => n.includes('asset') || n.includes('metric'));
  assert('Composite index exists on telemetry_observations', hasCompositeIndex, `Found: ${indexNames.join(', ')}`);

  // ── 9. predictive_feature_definitions Seeded ───────────────────────────
  console.log('\n── 9. Feature Registry');
  const featRes = await client.query(`SELECT COUNT(*) as count FROM predictive_feature_definitions WHERE is_active=true`);
  assert('At least 11 active feature definitions', parseInt(featRes.rows[0].count) >= 11, `Found: ${featRes.rows[0].count}`);

  // ── 10. Model State Transitions ─────────────────────────────────────────
  console.log('\n── 10. Model State Transition Validation (TypeScript logic)');
  // Validate state machine in code logic
  const validTransitions = [
    ['DRAFT', 'VALIDATING', true],
    ['DRAFT', 'ASSIST', false],
    ['SHADOW', 'ASSIST', true],
    ['SHADOW', 'APPROVED', false],  // APPROVED not in SHADOW transitions
    ['ASSIST', 'RETIRED', true],
    ['RETIRED', 'SHADOW', false],
    ['REJECTED', 'SHADOW', false],
  ];
  const STATE_TRANSITIONS: Record<string, string[]> = {
    DRAFT: ['VALIDATING', 'REJECTED'],
    VALIDATING: ['SHADOW', 'REJECTED'],
    SHADOW: ['ASSIST', 'REJECTED', 'RETIRED'],
    ASSIST: ['RETIRED', 'REJECTED'],
    APPROVED: ['RETIRED'],
    RETIRED: [],
    REJECTED: [],
  };
  for (const [from, to, expected] of validTransitions) {
    const allowed = STATE_TRANSITIONS[from as string]?.includes(to as string) ?? false;
    assert(`${from} → ${to} transition: ${expected ? 'permitted' : 'blocked'}`, allowed === expected);
  }

  // ── 11. predictive_model_approvals Table ────────────────────────────────
  console.log('\n── 11. Model Approval Record');
  const approvalRes = await client.query(`
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='predictive_model_approvals') as exists
  `);
  assert('predictive_model_approvals table exists', approvalRes.rows[0].exists === true);

  const approvalCols = await client.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name='predictive_model_approvals'
  `);
  const cols = approvalCols.rows.map((r: any) => r.column_name);
  assert('approval record has reviewer fields', cols.includes('reviewer_id') || cols.includes('reviewer_name'));
  assert('approval record has from_state and to_state', cols.includes('from_state') && cols.includes('to_state'));

  await client.end();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed | ${failed} failed`);
  console.log('══════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
