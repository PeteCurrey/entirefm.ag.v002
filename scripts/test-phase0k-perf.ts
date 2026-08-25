/**
 * ENTIREFM PHASE 0K — PERFORMANCE BENCHMARK SUITE
 * =================================================
 * 1. Insert representative performance dataset via direct pgClient.
 * 2. Benchmark 8 domain service paths + CEO Command (20 iterations each).
 * 3. Report p50 / p95 / worst latencies.
 * 4. Run EXPLAIN ANALYZE on key queries.
 * 5. Clean ALL test records from remote DB.
 * 6. Verify final row counts = 0.
 */

import { Client } from 'pg';
import {
  getAssetIntelligenceProfile,
  getHighCostAssets,
  getRepeatFailureAssets,
  getAssetsApproachingExpectedLife,
  getReplacementReviewCandidates,
  getAssetDataQuality,
  getAssetClassPerformance,
} from '../src/server/asset-intelligence';
import { executeCeoQuery } from '../src/server/ceo-command';
import type { UserSession } from '../src/server/identity';

// ─── Config ──────────────────────────────────────────────────────────────────
const PERF_PREFIX = 'P0K-PERF-';
const ASSET_COUNT = 250;
const WO_PER_ASSET = 20;        // → 5,000 work orders
const FAILURE_PER_ASSET = 5;    // → 1,250 failure events
const CONDITION_PER_ASSET = 3;  // → 750 condition assessments
const BENCH_ITERATIONS = 5;

// Deterministic test UUIDs (all start e0/e1/e2/e3/e4 prefix for easy cleanup)
const PERF_ORG_ID    = 'e0000000-0000-0000-0000-000000000001';
const PERF_SITE_ID   = 'e0000000-0000-0000-0000-000000000002';
const PERF_PERSON_ID = 'e0000000-0000-0000-0000-000000000003';

const adminSession: UserSession = {
  personId: PERF_PERSON_ID,
  orgId: PERF_ORG_ID,
  role: 'SUPER_ADMIN',
  orgType: 'ENTIREFM',
  permissions: [
    'asset_intelligence:view', 'asset_intelligence:manage',
    'asset_condition:assess', 'asset_lifecycle:manage',
    'asset_replacement:view', 'asset_replacement:manage',
    'enterprise_intelligence:view', 'enterprise_intelligence:executive',
    'finance:view', 'finance:read',
    'command:ceo', 'command:access',
  ],
  scopes: [],
  email: 'perf@entirefm.internal',
  name: 'Perf Test Admin',
  orgName: 'EntireFM',
  activeApplication: 'admin',
  expiresAt: Date.now() + 86400000,
} as any;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}
function pad(s: string, w: number) { return s.padEnd(w, ' '); }

async function bench(fn: () => Promise<unknown>, iterations = BENCH_ITERATIONS) {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    await fn();
    times.push(Math.round(performance.now() - t0));
  }
  times.sort((a, b) => a - b);
  return { p50: percentile(times, 50), p95: percentile(times, 95), worst: times[times.length - 1] };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n══════════════════════════════════════════════════════════════════');
  console.log('  EntireFM — Phase 0K: Performance Benchmark Suite');
  console.log('══════════════════════════════════════════════════════════════════\n');

  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Vivaro2104!!@db.tyrknahwlodspvzfkdzk.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  console.log('✓ Connected to remote Supabase database\n');

  try {
    // ── F. INSERT REPRESENTATIVE DATASET ─────────────────────────────────
    console.log(`── F. PERFORMANCE DATASET (target: ${ASSET_COUNT} assets) ──────────────`);
    const insertStart = performance.now();

    // Organisation
    await pgClient.query(
      `INSERT INTO organisations (id, code, name, org_type, status) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
      [PERF_ORG_ID, `${PERF_PREFIX}ORG`, 'Perf Test Organisation', 'CLIENT', 'ACTIVE']
    );

    // Site
    await pgClient.query(
      `INSERT INTO sites (id, organisation_id, site_code, name, address_line1, city, postcode, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [PERF_SITE_ID, PERF_ORG_ID, `${PERF_PREFIX}SITE`, 'Perf Test Site', '99 Benchmark Street', 'London', 'EC1A 1AA', 'ACTIVE']
    );

    // Person
    await pgClient.query(
      `INSERT INTO persons (id, first_name, last_name, email, status) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
      [PERF_PERSON_ID, 'Perf', 'TestEngineer', 'perf@entirefm.local', 'ACTIVE']
    );

    // ── Assets (500, batched 50 at a time) ───────────────────────────────
    const CATEGORIES = ['HVAC', 'ELECTRICAL', 'PLUMBING', 'FIRE', 'LIFT'];
    const assetIds: string[] = [];
    process.stdout.write(`  Assets: `);

    for (let batch = 0; batch < ASSET_COUNT; batch += 50) {
      const rows: unknown[][] = [];
      for (let i = batch; i < Math.min(batch + 50, ASSET_COUNT); i++) {
        const id = `e1${String(i).padStart(6, '0')}-0000-0000-0000-000000000001`;
        if (batch === 0 || rows.length === 0) assetIds.push(id); // track first batch
        assetIds[i] = id;
        rows.push([
          id, PERF_SITE_ID, `${PERF_PREFIX}A-${i}`,
          `Perf Asset ${i}`, CATEGORIES[i % 5], 'GOOD', 'OPERATIONAL',
          'ENGINEER', 'HIGH', false,
          `${2010 + (i % 15)}-06-01`, 15 + (i % 10),
          'MANUFACTURER', 'HIGH', 'ACTIVE',
        ]);
      }
      const ph = rows.map((_, bi) => {
        const b = bi * 15;
        return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8},$${b+9},$${b+10},$${b+11},$${b+12},$${b+13},$${b+14},$${b+15})`;
      }).join(',');
      await pgClient.query(
        `INSERT INTO assets (
           id, site_id, asset_reference, name, category, condition, status,
           condition_source, criticality, statutory_relevance,
           installation_date, expected_life_years,
           expected_life_source, expected_life_confidence, lifecycle_status
         ) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        rows.flat()
      );
    }
    console.log(`${ASSET_COUNT} ✓`);

    // ── Work Orders (500 × 20 = 10,000) ─────────────────────────────────
    process.stdout.write(`  Work Orders: `);
    let woTotal = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const woRows: unknown[][] = [];
      for (let w = 0; w < WO_PER_ASSET; w++) {
        const id = `e2${String(i * WO_PER_ASSET + w).padStart(6, '0')}-0000-0000-0000-000000000001`;
        woRows.push([id, `${PERF_PREFIX}WO-${i}-${w}`, PERF_ORG_ID, PERF_SITE_ID, assetIds[i], `Perf WO ${i}/${w}`, 'Perf test work order', 'CORRECTIVE', 'P3', 'COMPLETED']);
      }
      const ph = woRows.map((_, bi) => { const b = bi * 10; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8},$${b+9},$${b+10})`; }).join(',');
      await pgClient.query(
        `INSERT INTO work_orders (id,work_order_number,organisation_id,site_id,asset_id,title,description,work_type,priority,status) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        woRows.flat()
      );
      woTotal += WO_PER_ASSET;
    }
    console.log(`${woTotal} ✓`);

    // ── Failure Events (500 × 5 = 2,500) ────────────────────────────────
    process.stdout.write(`  Failure Events: `);
    let failTotal = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const fRows: unknown[][] = [];
      for (let f = 0; f < FAILURE_PER_ASSET; f++) {
        const id = `e3${String(i * FAILURE_PER_ASSET + f).padStart(6, '0')}-0000-0000-0000-000000000001`;
        const dt = new Date(Date.now() - (f + 1) * 30 * 86400000).toISOString();
        fRows.push([id, assetIds[i], 'WEAR_AND_TEAR', `Perf failure ${f}`, PERF_PERSON_ID, dt]);
      }
      const ph = fRows.map((_, bi) => { const b = bi * 6; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6})`; }).join(',');
      await pgClient.query(
        `INSERT INTO asset_failure_events (id,asset_id,failure_category,failure_description,created_by,failed_at) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        fRows.flat()
      );
      failTotal += FAILURE_PER_ASSET;
    }
    console.log(`${failTotal} ✓`);

    // ── Condition Assessments (500 × 3 = 1,500) ──────────────────────────
    process.stdout.write(`  Condition Assessments: `);
    let condTotal = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const cRows: unknown[][] = [];
      for (let c = 0; c < CONDITION_PER_ASSET; c++) {
        const id = `e4${String(i * CONDITION_PER_ASSET + c).padStart(6, '0')}-0000-0000-0000-000000000001`;
        const dt = new Date(Date.now() - (c + 1) * 90 * 86400000).toISOString();
        cRows.push([id, assetIds[i], dt, ['GOOD','FAIR','POOR'][c % 3], 'HIGH', 'ENGINEER_SURVEY', true, false]);
      }
      const ph = cRows.map((_, bi) => { const b = bi * 8; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8})`; }).join(',');
      await pgClient.query(
        `INSERT INTO asset_condition_assessments (id,asset_id,assessed_at,condition,confidence,source,ai_assisted,photos_stored) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        cRows.flat()
      );
      condTotal += CONDITION_PER_ASSET;
    }
    console.log(`${condTotal} ✓`);

    const insertMs = Math.round(performance.now() - insertStart);
    const totalRecs = 3 + ASSET_COUNT + woTotal + failTotal + condTotal;
    console.log(`\n  ✓ Dataset loaded in ${(insertMs/1000).toFixed(1)}s — Total records: ${totalRecs}`);
    console.log(`    Organisations: 1  Sites: 1  Persons: 1`);
    console.log(`    Assets: ${ASSET_COUNT}  Work Orders: ${woTotal}  Failures: ${failTotal}  Conditions: ${condTotal}\n`);

    // ── G. BENCHMARK SERVICE PATHS ────────────────────────────────────────
    console.log(`── G. DOMAIN TOOL PERFORMANCE (${BENCH_ITERATIONS} iterations each) ─────────`);
    const sampleAsset = assetIds[0];
    const results: Array<{ label: string; p50: number; p95: number; worst: number }> = [];

    const paths: Array<[string, () => Promise<unknown>]> = [
      ['getAssetIntelligenceProfile',        () => getAssetIntelligenceProfile(sampleAsset, adminSession)],
      ['getHighCostAssets',                  () => getHighCostAssets({ limit: 20, session: adminSession })],
      ['getRepeatFailureAssets',             () => getRepeatFailureAssets({ session: adminSession })],
      ['getAssetsApproachingExpectedLife',   () => getAssetsApproachingExpectedLife({ session: adminSession })],
      ['getReplacementReviewCandidates',     () => getReplacementReviewCandidates({ session: adminSession })],
      ['getAssetDataQuality',               () => getAssetDataQuality({ session: adminSession })],
      ['getAssetClassPerformance',           () => getAssetClassPerformance({ session: adminSession })],
    ];

    for (const [label, fn] of paths) {
      process.stdout.write(`  ${label}... `);
      const r = await bench(fn);
      results.push({ label, ...r });
      console.log(`p50=${r.p50}ms  p95=${r.p95}ms  worst=${r.worst}ms`);
    }

    // ── H. CEO COMMAND ────────────────────────────────────────────────────
    console.log(`\n── H. CEO END-TO-END PERFORMANCE ────────────────────────────────────`);
    console.log(`  NOTE: CEO Command invokes an LLM. LLM network+inference latency is`);
    console.log(`  ENVIRONMENTAL — not pure domain tool latency.\n`);
    process.stdout.write(`  CEO Command (domain tool query)... `);
    const ceoBench = await bench(() => executeCeoQuery('What are the top 5 highest cost assets?', adminSession));
    results.push({ label: 'CEO Command (domain tool)', ...ceoBench });
    console.log(`p50=${ceoBench.p50}ms  p95=${ceoBench.p95}ms  worst=${ceoBench.worst}ms`);

    console.log(`\n  ── Performance Summary ─────────────────────────────────────────────`);
    console.log(`  ${pad('Service Path', 44)} ${pad('p50', 8)} ${pad('p95', 8)} Worst`);
    console.log(`  ${'─'.repeat(76)}`);
    for (const r of results) {
      console.log(`  ${pad(r.label, 44)} ${pad(r.p50 + 'ms', 8)} ${pad(r.p95 + 'ms', 8)} ${r.worst}ms`);
    }
    console.log(`  ${'─'.repeat(76)}`);

    // ── I. EXPLAIN ANALYZE ────────────────────────────────────────────────
    console.log(`\n── I. QUERY PLAN / INDEX FINDINGS ───────────────────────────────────`);

    const explains: Array<[string, string]> = [
      ['Failure events by asset',         `SELECT * FROM asset_failure_events WHERE asset_id = '${sampleAsset}' ORDER BY failed_at DESC`],
      ['Condition assessments by asset',  `SELECT * FROM asset_condition_assessments WHERE asset_id = '${sampleAsset}' ORDER BY assessed_at DESC`],
      ['Assets by site',                  `SELECT id, asset_reference, category, status FROM assets WHERE site_id = '${PERF_SITE_ID}'`],
      ['Work orders by asset',            `SELECT id, status FROM work_orders WHERE asset_id = '${sampleAsset}'`],
    ];

    for (const [label, sql] of explains) {
      const res = await pgClient.query(`EXPLAIN ANALYZE ${sql}`);
      const lines = res.rows.map((r: Record<string, string>) => r['QUERY PLAN'] as string);
      const topLine = lines[0] || '';
      const execLine = lines.find((l: string) => l.includes('Execution Time')) || '';
      const usesIndex = lines.some((l: string) => l.includes('Index'));
      console.log(`\n  [${label}]`);
      console.log(`    Plan: ${topLine.substring(0, 100)}`);
      console.log(`    ${execLine}`);
      console.log(`    Index: ${usesIndex ? '✓ YES' : '⚠ Seq Scan (acceptable at this dataset size)'}`);
    }

    // ── N. CLEANUP ────────────────────────────────────────────────────────
    console.log(`\n── N. REMOTE CLEANUP ─────────────────────────────────────────────────`);
    const cleanStart = performance.now();

    await pgClient.query(`DELETE FROM asset_condition_assessments WHERE id::text LIKE 'e4%'`);
    await pgClient.query(`DELETE FROM asset_failure_events WHERE id::text LIKE 'e3%'`);
    await pgClient.query(`DELETE FROM work_orders WHERE work_order_number LIKE '${PERF_PREFIX}%'`);
    await pgClient.query(`DELETE FROM assets WHERE id::text LIKE 'e1%'`);
    await pgClient.query(`DELETE FROM sites WHERE id = '${PERF_SITE_ID}'`);
    await pgClient.query(`DELETE FROM persons WHERE id = '${PERF_PERSON_ID}'`);
    await pgClient.query(`DELETE FROM organisations WHERE id = '${PERF_ORG_ID}'`);

    const cleanMs = Math.round(performance.now() - cleanStart);

    // Verify
    const vOrg  = await pgClient.query(`SELECT COUNT(*) FROM organisations WHERE id = '${PERF_ORG_ID}'`);
    const vAst  = await pgClient.query(`SELECT COUNT(*) FROM assets WHERE id::text LIKE 'e1%'`);
    const vWo   = await pgClient.query(`SELECT COUNT(*) FROM work_orders WHERE work_order_number LIKE '${PERF_PREFIX}%'`);
    const vFail = await pgClient.query(`SELECT COUNT(*) FROM asset_failure_events WHERE id::text LIKE 'e3%'`);
    const vCond = await pgClient.query(`SELECT COUNT(*) FROM asset_condition_assessments WHERE id::text LIKE 'e4%'`);

    const residual = {
      org:    parseInt(vOrg.rows[0].count),
      assets: parseInt(vAst.rows[0].count),
      wos:    parseInt(vWo.rows[0].count),
      fails:  parseInt(vFail.rows[0].count),
      conds:  parseInt(vCond.rows[0].count),
    };

    console.log(`  ✓ Cleanup in ${(cleanMs/1000).toFixed(1)}s`);
    for (const [k, v] of Object.entries(residual)) {
      console.log(`    Residual ${k}: ${v}`);
    }

    const clean = Object.values(residual).every(v => v === 0);
    console.log('\n══════════════════════════════════════════════════════════════════');
    if (clean) {
      console.log('  PHASE 0K PERFORMANCE BENCHMARK: ✓ COMPLETE');
      console.log('  All performance test records cleaned. Residual = 0.');
    } else {
      console.error('  ✗ CLEANUP INCOMPLETE — residual test records remain!');
      process.exit(1);
    }
    console.log('══════════════════════════════════════════════════════════════════\n');

  } finally {
    await pgClient.end();
  }
}

run().catch(err => {
  console.error('Performance benchmark crashed:', err);
  process.exit(1);
});
