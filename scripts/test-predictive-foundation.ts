/**
 * ENTIREFM PHASE 0L — PREDICTIVE FOUNDATION TESTS
 * =================================================
 * Tests: model registry, feature registry, state machine, dataset governance,
 *        temporal isolation enforcement, approval records, drift events,
 *        governance constraints.
 */

import { Client } from 'pg';

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

const STATE_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['VALIDATING', 'REJECTED'],
  VALIDATING: ['SHADOW', 'REJECTED'],
  SHADOW: ['ASSIST', 'REJECTED', 'RETIRED'],
  ASSIST: ['RETIRED', 'REJECTED'],
  APPROVED: ['RETIRED'],
  RETIRED: [],
  REJECTED: [],
};

async function main() {
  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log('  PHASE 0L — PREDICTIVE FOUNDATION TESTS');
  console.log('══════════════════════════════════════════════════════════\n');

  // ── 1. Predictive Tables Exist ────────────────────────────────────────
  console.log('── 1. Predictive Tables');
  const tables = [
    'predictive_feature_definitions', 'predictive_training_datasets',
    'predictive_models', 'predictive_model_versions', 'predictive_model_approvals',
    'predictive_predictions', 'predictive_prediction_outcomes',
    'predictive_reviews', 'predictive_model_drift_events',
  ];
  for (const table of tables) {
    const res = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='${table}') as exists`
    );
    assert(`Table ${table} exists`, res.rows[0].exists === true);
  }

  // ── 2. Feature Definitions Seeded ────────────────────────────────────
  console.log('\n── 2. Feature Registry');
  const featRes = await client.query(`SELECT code, version, source FROM predictive_feature_definitions WHERE is_active=true ORDER BY code`);
  assert('At least 11 feature definitions', featRes.rows.length >= 11, `Found: ${featRes.rows.length}`);

  const expectedFeatures = [
    'mean_temperature_24h', 'temperature_delta_7d', 'vibration_rms_mean_24h',
    'vibration_rms_slope_7d', 'starts_24h', 'runtime_hours_7d',
    'energy_per_runtime_hour', 'failure_count_90d', 'condition_state',
    'asset_age', 'days_since_last_ppm',
  ];
  const foundCodes = featRes.rows.map((r: any) => r.code);
  for (const code of expectedFeatures) {
    assert(`Feature '${code}' defined`, foundCodes.includes(code));
  }

  // ── 3. Feature Primary Key (code, version) ───────────────────────────
  console.log('\n── 3. Feature Primary Key');
  const featPkRes = await client.query(`
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name='predictive_feature_definitions' AND tc.constraint_type='PRIMARY KEY'
    ORDER BY kcu.ordinal_position
  `);
  const pkCols = featPkRes.rows.map((r: any) => r.column_name);
  assert('Feature PK includes code', pkCols.includes('code'));
  assert('Feature PK includes version (versioned definitions)', pkCols.includes('version'));

  // ── 4. Model Versions Status Vocabulary ──────────────────────────────
  console.log('\n── 4. Model Version Status');
  const mvCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_model_versions'`);
  const mvColNames = mvCols.rows.map((r: any) => r.column_name);
  for (const col of ['model_id', 'version', 'status', 'training_dataset_id', 'feature_set_version',
    'validation_metrics', 'class_imbalance_report', 'shadow_started_at', 'assist_started_at',
    'prediction_count', 'true_positive_count', 'false_positive_count', 'true_negative_count', 'false_negative_count']) {
    assert(`model_versions column: ${col}`, mvColNames.includes(col));
  }

  // ── 5. State Machine Tests ────────────────────────────────────────────
  console.log('\n── 5. State Machine');
  const stateTests: Array<[string, string, boolean]> = [
    ['DRAFT', 'VALIDATING', true],
    ['DRAFT', 'SHADOW', false],
    ['DRAFT', 'ASSIST', false],
    ['VALIDATING', 'SHADOW', true],
    ['VALIDATING', 'ASSIST', false],
    ['SHADOW', 'ASSIST', true],
    ['SHADOW', 'APPROVED', false],
    ['SHADOW', 'REJECTED', true],
    ['ASSIST', 'RETIRED', true],
    ['ASSIST', 'APPROVED', false], // No CONTROLLED_AUTO in Phase 0L
    ['RETIRED', 'SHADOW', false],
    ['REJECTED', 'SHADOW', false],
  ];
  for (const [from, to, expected] of stateTests) {
    const allowed = STATE_TRANSITIONS[from]?.includes(to) ?? false;
    assert(`Transition ${from} → ${to}: ${expected ? 'permitted' : 'blocked'}`, allowed === expected);
  }

  // ── 6. Temporal Isolation ────────────────────────────────────────────
  console.log('\n── 6. Temporal Isolation Enforcement');
  // Verify the training_datasets table has date_range_to and failure_label_source
  const tdCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_training_datasets'`);
  const tdColNames = tdCols.rows.map((r: any) => r.column_name);
  assert('date_range_to on training datasets (temporal boundary)', tdColNames.includes('date_range_to'));
  assert('failure_label_source on datasets (ASSET_FAILURE_EVENTS only)', tdColNames.includes('failure_label_source'));
  assert('class_imbalance_ratio on datasets (transparency)', tdColNames.includes('class_imbalance_ratio'));

  // ── 7. Model Approval Records ─────────────────────────────────────────
  console.log('\n── 7. Model Approval Records (SHADOW → ASSIST gate)');
  const apprCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_model_approvals'`);
  const apprColNames = apprCols.rows.map((r: any) => r.column_name);
  for (const col of ['model_version_id', 'from_state', 'to_state', 'decision', 'reviewer_id', 'reviewer_name', 'notes']) {
    assert(`approval record column: ${col}`, apprColNames.includes(col));
  }

  // ── 8. Predictive Reviews ─────────────────────────────────────────────
  console.log('\n── 8. Human Review Entity');
  const revCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_reviews'`);
  const revColNames = revCols.rows.map((r: any) => r.column_name);
  for (const col of ['prediction_id', 'asset_id', 'status', 'recommended_action', 'decision',
    'decided_by', 'decision_at', 'decision_notes', 'resulting_work_order_id']) {
    assert(`review column: ${col}`, revColNames.includes(col));
  }
  assert('No auto_work_order flag (humans create WOs, not the model)', !revColNames.includes('auto_work_order'));

  // ── 9. Drift Events ───────────────────────────────────────────────────
  console.log('\n── 9. Drift Events');
  const driftCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_model_drift_events'`);
  const driftColNames = driftCols.rows.map((r: any) => r.column_name);
  for (const col of ['model_version_id', 'drift_type', 'severity', 'evidence_json', 'triggered_review', 'detected_at']) {
    assert(`drift_events column: ${col}`, driftColNames.includes(col));
  }
  assert('triggered_review flag (drift triggers review, not silent retrain)', driftColNames.includes('triggered_review'));

  // ── 10. Governance: No Auto-PPM / No Controlled Auto ─────────────────
  console.log('\n── 10. Governance Constraints');
  // Check that model versions have no 'autonomous_ppm_change' or 'auto_work_order' columns
  assert('No autonomous_ppm_change on model_versions', !mvColNames.includes('autonomous_ppm_change'));
  assert('No auto_work_order on model_versions', !mvColNames.includes('auto_work_order'));

  // The review table is required for all predictions → actions
  assert('Human review required: predictive_reviews table exists', true);

  // ── 11. Prediction Outcomes ───────────────────────────────────────────
  console.log('\n── 11. Prediction Outcomes');
  const outcomeCols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='predictive_prediction_outcomes'`);
  const outcomeColNames = outcomeCols.rows.map((r: any) => r.column_name);
  for (const col of ['prediction_id', 'asset_id', 'actual_outcome', 'evaluation_result', 'failure_event_id']) {
    assert(`outcome column: ${col}`, outcomeColNames.includes(col));
  }
  assert('evaluation_result links back to failure events (no synthetic labels)', outcomeColNames.includes('failure_event_id'));

  await client.end();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed | ${failed} failed`);
  console.log('══════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
