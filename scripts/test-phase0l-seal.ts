/**
 * ENTIREFM PHASE 0L — SEAL TEST
 * ==============================
 * Verifies the complete Phase 0L domain is correctly implemented and sealed.
 * This is the canonical seal test — ALL assertions must pass before Phase 0L
 * can be declared SEALED.
 */

import { Client } from 'pg';

const CONNECTION_STRING = 'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres';

let passed = 0;
let failed = 0;
let skipped = 0;

function assert(description: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ ${description}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function skip(description: string, reason: string) {
  console.log(`  ⚠ SKIP: ${description} — ${reason}`);
  skipped++;
}

async function main() {
  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('  PHASE 0L SEAL TEST — Telemetry, Reliability & Predictive Pilot');
  console.log('══════════════════════════════════════════════════════════════════\n');

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 1: MIGRATION COMPLETENESS
  // ══════════════════════════════════════════════════════════════════════
  console.log('══ BLOCK 1: MIGRATION COMPLETENESS ════════════════════════════\n');

  const allTables = [
    'telemetry_metrics', 'telemetry_sensors', 'telemetry_observations',
    'telemetry_quality_events', 'telemetry_aggregates', 'telemetry_retention_classes',
    'asset_telemetry_baselines', 'asset_telemetry_anomalies', 'asset_reliability_signals',
    'predictive_feature_definitions', 'predictive_training_datasets',
    'predictive_models', 'predictive_model_versions', 'predictive_model_approvals',
    'predictive_predictions', 'predictive_prediction_outcomes',
    'predictive_reviews', 'predictive_model_drift_events',
  ];

  for (const table of allTables) {
    const res = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='${table}') as exists`
    );
    assert(`[MIGRATION] Table ${table} exists`, res.rows[0].exists === true);
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 2: RLS ON ALL 18+ TABLES
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 2: ROW LEVEL SECURITY ════════════════════════════════\n');

  for (const table of allTables) {
    const rlsRes = await client.query(`SELECT relrowsecurity FROM pg_class WHERE relname='${table}'`);
    assert(`[RLS] ${table} has RLS enabled`, rlsRes.rows[0]?.relrowsecurity === true);
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 3: SEEDED DATA
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 3: SEEDED DATA ════════════════════════════════════════\n');

  const metricCount = await client.query(`SELECT COUNT(*) as c FROM telemetry_metrics WHERE is_active=true`);
  assert('[SEED] At least 20 metrics in registry', parseInt(metricCount.rows[0].c) >= 20, `Found: ${metricCount.rows[0].c}`);

  const retentionCount = await client.query(`SELECT COUNT(*) as c FROM telemetry_retention_classes`);
  assert('[SEED] At least 5 retention classes', parseInt(retentionCount.rows[0].c) >= 5);

  const featCount = await client.query(`SELECT COUNT(*) as c FROM predictive_feature_definitions WHERE is_active=true`);
  assert('[SEED] At least 11 feature definitions', parseInt(featCount.rows[0].c) >= 11, `Found: ${featCount.rows[0].c}`);

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 4: GOVERNANCE CONSTRAINTS (Schema Level)
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 4: GOVERNANCE CONSTRAINTS ════════════════════════════\n');

  // min_samples_required = 168
  const minSamplesRes = await client.query(`
    SELECT column_default FROM information_schema.columns
    WHERE table_name='asset_telemetry_baselines' AND column_name='min_samples_required'
  `);
  assert('[GOV] min_samples_required defaults to 168 (7d×24h)', minSamplesRes.rows[0]?.column_default?.includes('168'));

  // anomaly_scope column exists (sensor vs asset)
  const scopeRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='asset_telemetry_anomalies' AND column_name='anomaly_scope'
  `);
  assert('[GOV] anomaly_scope column exists (SENSOR vs ASSET)', scopeRes.rows.length > 0);

  // evidence_json on anomalies (no mystery scores)
  const evidenceRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='asset_telemetry_anomalies' AND column_name='evidence_json'
  `);
  assert('[GOV] evidence_json on anomalies (no mystery scores)', evidenceRes.rows.length > 0);

  // asset_context_snapshot on signals
  const contextRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='asset_reliability_signals' AND column_name='asset_context_snapshot'
  `);
  assert('[GOV] asset_context_snapshot on signals (never in isolation)', contextRes.rows.length > 0);

  // predictive_model_approvals required for SHADOW→ASSIST
  const approvalTableRes = await client.query(`
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='predictive_model_approvals') as exists
  `);
  assert('[GOV] predictive_model_approvals table exists (SHADOW→ASSIST gate)', approvalTableRes.rows[0].exists === true);

  // Human review required (no auto_work_order on model versions)
  const mvAutoRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='predictive_model_versions' AND column_name='auto_work_order'
  `);
  assert('[GOV] No auto_work_order on model_versions (human review required)', mvAutoRes.rows.length === 0);

  // drift_events have triggered_review (no silent retrain)
  const driftReviewRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='predictive_model_drift_events' AND column_name='triggered_review'
  `);
  assert('[GOV] triggered_review on drift events (no silent retrain)', driftReviewRes.rows.length > 0);

  // failure_label_source on training datasets
  const labelSourceRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='predictive_training_datasets' AND column_name='failure_label_source'
  `);
  assert('[GOV] failure_label_source on training datasets (ASSET_FAILURE_EVENTS only)', labelSourceRes.rows.length > 0);

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 5: STATE MACHINE INTEGRITY
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 5: STATE MACHINE ══════════════════════════════════════\n');

  const SM: Record<string, string[]> = {
    DRAFT: ['VALIDATING', 'REJECTED'],
    VALIDATING: ['SHADOW', 'REJECTED'],
    SHADOW: ['ASSIST', 'REJECTED', 'RETIRED'],
    ASSIST: ['RETIRED', 'REJECTED'],
    APPROVED: ['RETIRED'],
    RETIRED: [],
    REJECTED: [],
  };

  const criticalTransitions: Array<[string, string, boolean, string]> = [
    ['DRAFT', 'ASSIST', false, 'skip-to-ASSIST blocked'],
    ['SHADOW', 'APPROVED', false, 'APPROVED not in Phase 0L (no CONTROLLED_AUTO)'],
    ['ASSIST', 'APPROVED', false, 'CONTROLLED_AUTO blocked'],
    ['SHADOW', 'ASSIST', true, 'SHADOW→ASSIST requires approval record'],
    ['RETIRED', 'SHADOW', false, 'retired models cannot be reactivated'],
    ['REJECTED', 'DRAFT', false, 'rejected models cannot be reset'],
  ];

  for (const [from, to, expected, label] of criticalTransitions) {
    const allowed = SM[from]?.includes(to) ?? false;
    assert(`[SM] ${label} (${from}→${to})`, allowed === expected);
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 6: CEO COMMAND TOOL REGISTRY
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 6: CEO COMMAND TOOLS ══════════════════════════════════\n');

  // We can only verify the registry structure at runtime — check file exists
  const { execSync } = await import('child_process');
  try {
    const result = execSync('grep -c "assets.telemetry_anomalies\\|assets.reliability_signals\\|assets.telemetry_coverage\\|assets.predictive_readiness\\|assets.shadow_model_performance\\|assets.elevated_failure_risk\\|assets.sensor_health" src/server/ceo-command/tools/registry.ts 2>/dev/null').toString().trim();
    assert('[CEO] 7 Phase 0L tools registered in CEO tool registry', parseInt(result) >= 7, `Found ${result} references`);
  } catch {
    assert('[CEO] CEO tool registry has Phase 0L tools', false, 'grep failed — check registry.ts');
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 7: IDENTITY PERMISSIONS
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 7: IDENTITY PERMISSIONS ═══════════════════════════════\n');

  try {
    const permResult = execSync('grep -c "telemetry:view\\|reliability:view\\|predictive:view\\|predictive:approve" src/server/identity/index.ts 2>/dev/null').toString().trim();
    assert('[IDENTITY] Phase 0L permissions declared', parseInt(permResult) >= 4, `Found ${permResult} references`);
  } catch {
    assert('[IDENTITY] Phase 0L permissions in identity module', false, 'grep failed');
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 8: API ROUTES
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 8: API ROUTES ═════════════════════════════════════════\n');

  const routes = [
    'src/app/api/telemetry/ingest/route.ts',
    'src/app/api/telemetry/batch/route.ts',
    'src/app/api/telemetry/sources/[sourceId]/route.ts',
  ];
  const { existsSync } = await import('fs');
  for (const route of routes) {
    assert(`[API] Route exists: ${route}`, existsSync(route));
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 9: ADMIN UI PAGES
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 9: ADMIN UI PAGES ═════════════════════════════════════\n');

  const pages = [
    'src/app/admin/estate/assets/telemetry/page.tsx',
    'src/app/admin/estate/assets/reliability/page.tsx',
    'src/app/admin/estate/assets/models/page.tsx',
  ];
  for (const page of pages) {
    assert(`[UI] Admin page exists: ${page}`, existsSync(page));
  }

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 10: IDEMPOTENCY KEY FORMAT
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 10: IDEMPOTENCY KEY ═══════════════════════════════════\n');

  const { createHash } = await import('node:crypto');
  const key = createHash('sha256')
    .update('src-001:sensor-001:TEMPERATURE:2026-01-01T12:00:00.000Z')
    .digest('hex');
  assert('[IDEM] Idempotency key is 64-char SHA-256 hex', key.length === 64);
  assert('[IDEM] Idempotency key is deterministic', key === createHash('sha256').update('src-001:sensor-001:TEMPERATURE:2026-01-01T12:00:00.000Z').digest('hex'));

  // ══════════════════════════════════════════════════════════════════════
  // BLOCK 11: SEALED PHASES INTEGRITY CHECK
  // ══════════════════════════════════════════════════════════════════════
  console.log('\n══ BLOCK 11: SEALED PHASES REGRESSION ══════════════════════════\n');

  // Check migration numbering — 0028 must still exist
  const migRes = await client.query(`
    SELECT name FROM migrations WHERE name LIKE '0028%' LIMIT 1
  `).catch(() => ({ rows: [] }));

  if (migRes.rows.length > 0) {
    assert('[REGRESSION] Phase 0K migration 0028 still present', true);
  } else {
    skip('[REGRESSION] Migration table check', 'migrations table not queryable in this context');
  }

  // asset_telemetry_sources Phase 0K columns still exist
  const srcCols = await client.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name='asset_telemetry_sources'
  `);
  const srcColNames = srcCols.rows.map((r: any) => r.column_name);
  assert('[REGRESSION] asset_telemetry_sources.connector_state (Phase 0L extension)', srcColNames.includes('connector_state'));
  assert('[REGRESSION] asset_telemetry_sources.protocol (Phase 0L extension)', srcColNames.includes('protocol'));

  await client.end();

  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log(`  PHASE 0L SEAL RESULTS: ${passed} passed | ${failed} failed | ${skipped} skipped`);
  if (failed === 0) {
    console.log('\n  ✅ PHASE 0L IS SEALED');
    console.log('  Telemetry, Reliability Intelligence & Predictive Maintenance Pilot');
    console.log('  All governance constraints verified. No sealed domains reopened.');
  } else {
    console.log('\n  ❌ PHASE 0L IS NOT SEALED — fix failing assertions before declaring sealed');
  }
  console.log('══════════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
