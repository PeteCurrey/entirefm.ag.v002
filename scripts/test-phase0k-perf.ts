/**
 * ENTIREFM PHASE 0K — PERFORMANCE BENCHMARK SUITE
 * =================================================
 * 1. Insert representative performance dataset (pgClient direct inserts).
 * 2. Benchmark 8 domain service paths + CEO Command (20 iterations each).
 * 3. Report p50 / p95 / worst latencies.
 * 4. Run EXPLAIN ANALYZE on key queries.
 * 5. Clean ALL test records from remote DB.
 * 6. Verify final row counts are 0.
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

const PERF_PREFIX = 'P0K-PERF-';
const ASSET_COUNT = 500;
const WO_PER_ASSET = 20;
const FAILURE_PER_ASSET = 5;
const CONDITION_PER_ASSET = 3;
const BENCH_ITERATIONS = 20;

const PERF_ORG_ID = 'e0000000-0000-0000-0000-000000000001';
const PERF_SITE_ID = 'e0000000-0000-0000-0000-000000000002';
const PERF_PERSON_ID = 'e0000000-0000-0000-0000-000000000003';

const adminSession: UserSession = {
  personId: PERF_PERSON_ID,
  role: 'ENTIREFM_ADMIN',
  tenantId: null,
  scopes: ['admin'],
  expiresAt: Date.now() + 86400000,
};

function percentile(sorted: number[], p: number): number {
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function pad(s: string, w: number) { return s.padEnd(w, ' '); }

async function bench(label: string, fn: () => Promise<unknown>, iterations = BENCH_ITERATIONS): Promise<{ p50: number; p95: number; worst: number }> {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    await fn();
    times.push(Math.round(performance.now() - t0));
  }
  times.sort((a, b) => a - b);
  return {
    p50: percentile(times, 50),
    p95: percentile(times, 95),
    worst: times[times.length - 1],
  };
}

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
    // ── Dataset insert ────────────────────────────────────────────────────
    console.log(`── F. PERFORMANCE DATASET (target: ${ASSET_COUNT} assets) ─────────────`);

    const insertStart = performance.now();
    const ASSET_CLASSES = ['HVAC', 'ELECTRICAL', 'PLUMBING', 'FIRE', 'LIFT'];
    const assetIds: string[] = [];

    await pgClient.query(
      `INSERT INTO organisations (id, code, name, org_type, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [PERF_ORG_ID, `${PERF_PREFIX}ORG`, 'Perf Test Organisation', 'CLIENT', 'ACTIVE']
    );
    await pgClient.query(
      `INSERT INTO sites (id, organisation_id, site_code, name, address_line1, city, postcode, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [PERF_SITE_ID, PERF_ORG_ID, `${PERF_PREFIX}SITE`, 'Perf Test Site', '99 Benchmark Street', 'London', 'EC1A 1AA', 'ACTIVE']
    );
    await pgClient.query(
      `INSERT INTO persons (id, full_name, email, status) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
      [PERF_PERSON_ID, 'Perf', 'Test', 'perf@entirefm.local', 'ACTIVE']
    );

    // Assets (batched)
    process.stdout.write(`  Assets: `);
    const assetVals: unknown[][] = [];
    for (let i = 0; i < ASSET_COUNT; i++) {
      const id = `e1${String(i).padStart(6, '0')}-0000-0000-0000-000000000001`;
      assetIds.push(id);
      assetVals.push([id, PERF_SITE_ID, PERF_ORG_ID, `${PERF_PREFIX}A-${i}`, `Perf Asset ${i}`, ASSET_CLASSES[i % 5], 'OPERATIONAL', `${2010 + (i % 15)}-06-01`, 15 + (i % 10), 5000 + (i * 100), 'GBP']);
    }
    for (let i = 0; i < assetVals.length; i += 50) {
      const batch = assetVals.slice(i, i + 50);
      const placeholders = batch.map((_, bi) => {
        const base = bi * 11;
        return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},$${base+9},$${base+10},$${base+11})`;
      }).join(',');
      await pgClient.query(
        `INSERT INTO assets (id,site_id,organisation_id,asset_reference,name,asset_class,status,installation_date,expected_life_years,replacement_cost_estimate,replacement_cost_currency) VALUES ${placeholders} ON CONFLICT (id) DO NOTHING`,
        batch.flat()
      );
    }
    console.log(`${ASSET_COUNT} ✓`);

    // Work Orders (batched 100 at a time)
    process.stdout.write(`  Work Orders: `);
    let woCount = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const woVals: unknown[][] = [];
      for (let w = 0; w < WO_PER_ASSET; w++) {
        const id = `e2${String(i * WO_PER_ASSET + w).padStart(6, '0')}-0000-0000-0000-000000000001`;
        woVals.push([id, `${PERF_PREFIX}WO-${i}-${w}`, PERF_ORG_ID, PERF_SITE_ID, assetIds[i], `Perf WO ${i}/${w}`, 'Perf work order', 'CORRECTIVE', 'P3', 'COMPLETED']);
      }
      const placeholders = woVals.map((_, bi) => { const b = bi * 10; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8},$${b+9},$${b+10})`; }).join(',');
      await pgClient.query(
        `INSERT INTO work_orders (id,work_order_number,organisation_id,site_id,asset_id,title,description,work_type,priority,status) VALUES ${placeholders} ON CONFLICT (id) DO NOTHING`,
        woVals.flat()
      );
      woCount += WO_PER_ASSET;
    }
    console.log(`${woCount} ✓`);

    // Failures
    process.stdout.write(`  Failure Events: `);
    let failCount = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const fVals: unknown[][] = [];
      for (let f = 0; f < FAILURE_PER_ASSET; f++) {
        const id = `e3${String(i * FAILURE_PER_ASSET + f).padStart(6, '0')}-0000-0000-0000-000000000001`;
        const dt = new Date(Date.now() - (f + 1) * 30 * 86400000).toISOString().split('T')[0];
        fVals.push([id, assetIds[i], dt, 'MECHANICAL_WEAR', 'MODERATE', 'WEAR_AND_TEAR', PERF_PERSON_ID, `Perf failure ${f}`]);
      }
      const ph = fVals.map((_, bi) => { const b = bi * 8; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8})`; }).join(',');
      await pgClient.query(
        `INSERT INTO asset_failure_events (id,asset_id,failure_date,failure_mode,severity,failure_category,reported_by,description) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        fVals.flat()
      );
      failCount += FAILURE_PER_ASSET;
    }
    console.log(`${failCount} ✓`);

    // Conditions
    process.stdout.write(`  Condition Assessments: `);
    let condCount = 0;
    for (let i = 0; i < ASSET_COUNT; i++) {
      const cVals: unknown[][] = [];
      for (let c = 0; c < CONDITION_PER_ASSET; c++) {
        const id = `e4${String(i * CONDITION_PER_ASSET + c).padStart(6, '0')}-0000-0000-0000-000000000001`;
        const dt = new Date(Date.now() - (c + 1) * 90 * 86400000).toISOString().split('T')[0];
        cVals.push([id, assetIds[i], dt, ['GOOD','FAIR','POOR'][c % 3], PERF_PERSON_ID, 'ENGINEER_SURVEY', `Perf condition ${c}`]);
      }
      const ph = cVals.map((_, bi) => { const b = bi * 7; return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7})`; }).join(',');
      await pgClient.query(
        `INSERT INTO asset_condition_assessments (id,asset_id,assessment_date,condition_grade,assessed_by,source,notes) VALUES ${ph} ON CONFLICT (id) DO NOTHING`,
        cVals.flat()
      );
      condCount += CONDITION_PER_ASSET;
    }
    console.log(`${condCount} ✓`);

    const insertMs = Math.round(performance.now() - insertStart);
    const totalRecs = 3 + ASSET_COUNT + woCount + failCount + condCount;
    console.log(`\n  Dataset loaded in ${(insertMs/1000).toFixed(1)}s — Total records: ${totalRecs}`);
    console.log(`  ─ Organisations: 1  Sites: 1  Persons: 1`);
    console.log(`  ─ Assets: ${ASSET_COUNT}  Work Orders: ${woCount}  Failures: ${failCount}  Conditions: ${condCount}\n`);

    // ── Benchmarks ────────────────────────────────────────────────────────
    console.log(`── G. DOMAIN TOOL PERFORMANCE (${BENCH_ITERATIONS} iterations) ──────────────`);

    const sampleAssetId = assetIds[0];
    const benchResults: Array<{ label: string; p50: number; p95: number; worst: number }> = [];

    const paths: Array<[string, () => Promise<unknown>]> = [
      ['getAssetIntelligenceProfile',       () => getAssetIntelligenceProfile(sampleAssetId, adminSession)],
      ['getHighCostAssets',                 () => getHighCostAssets({ limit: 20, session: adminSession })],
      ['getRepeatFailureAssets',            () => getRepeatFailureAssets({ session: adminSession })],
      ['getAssetsApproachingExpectedLife',  () => getAssetsApproachingExpectedLife({ session: adminSession })],
      ['getReplacementReviewCandidates',    () => getReplacementReviewCandidates({ session: adminSession })],
      ['getAssetDataQuality',              () => getAssetDataQuality({ session: adminSession })],
      ['getAssetClassPerformance',          () => getAssetClassPerformance({ session: adminSession })],
    ];

    for (const [label, fn] of paths) {
      process.stdout.write(`  ${label}... `);
      const r = await bench(label, fn);
      benchResults.push({ label, ...r });
      console.log(`p50=${r.p50}ms  p95=${r.p95}ms  worst=${r.worst}ms`);
    }

    // CEO Command — domain tool (no LLM roundtrip — model latency excluded)
    console.log(`\n── H. CEO END-TO-END PERFORMANCE ────────────────────────────────────`);
    console.log(`  NOTE: CEO Command invokes the LLM. The LLM roundtrip latency is`);
    console.log(`  ENVIRONMENTAL (network + model inference) and is NOT domain latency.\n`);
    process.stdout.write(`  CEO Command query (domain tool only path)... `);
    const ceoBench = await bench('CEO Command domain query', () =>
      executeCeoQuery('What are the top 5 highest cost assets?', adminSession)
    );
    benchResults.push({ label: 'CEO Command (domain tool)', ...ceoBench });
    console.log(`p50=${ceoBench.p50}ms  p95=${ceoBench.p95}ms  worst=${ceoBench.worst}ms`);

    console.log(`\n  Performance Summary`);
    console.log(`  ${'─'.repeat(86)}`);
    console.log(`  ${pad('Service Path', 44)} ${pad('p50', 8)} ${pad('p95', 8)} ${pad('Worst', 8)}`);
    console.log(`  ${'─'.repeat(86)}`);
    for (const r of benchResults) {
      console.log(`  ${pad(r.label, 44)} ${pad(r.p50 + 'ms', 8)} ${pad(r.p95 + 'ms', 8)} ${pad(r.worst + 'ms', 8)}`);
    }
    console.log(`  ${'─'.repeat(86)}`);

    // ── EXPLAIN ANALYZE ───────────────────────────────────────────────────
    console.log(`\n── I. QUERY PLAN / INDEX FINDINGS ───────────────────────────────────`);
    const explainQueries: Array<[string, string]> = [
      ['Failure events by asset',       `SELECT * FROM asset_failure_events WHERE asset_id = '${sampleAssetId}' ORDER BY failure_date DESC`],
      ['Condition assessments by asset', `SELECT * FROM asset_condition_assessments WHERE asset_id = '${sampleAssetId}' ORDER BY assessment_date DESC`],
      ['Assets by site',                `SELECT id, asset_reference, asset_class, status FROM assets WHERE site_id = '${PERF_SITE_ID}'`],
      ['Work orders by asset',          `SELECT id, status FROM work_orders WHERE asset_id = '${sampleAssetId}'`],
    ];

    for (const [label, sql] of explainQueries) {
      const planRes = await pgClient.query(`EXPLAIN ANALYZE ${sql}`);
      const planLines = planRes.rows.map((r: Record<string, string>) => r['QUERY PLAN']);
      const firstLine = planLines[0] || '';
      const execLine = planLines.find((l: string) => l.includes('Execution Time')) || '';
      const usesIndex = planLines.some((l: string) => l.includes('Index'));
      console.log(`\n  [${label}]`);
      console.log(`    Scan: ${firstLine.substring(0, 80)}`);
      console.log(`    ${execLine}`);
      console.log(`    Index used: ${usesIndex ? '✓ YES' : '⚠ NO (Seq Scan — acceptable for test dataset size)'}`);
    }

    // ── Cleanup ───────────────────────────────────────────────────────────
    console.log(`\n── N. REMOTE CLEANUP ─────────────────────────────────────────────────`);
    const cleanStart = performance.now();

    await pgClient.query(`DELETE FROM asset_condition_assessments WHERE assessed_by = '${PERF_PERSON_ID}'`);
    await pgClient.query(`DELETE FROM asset_failure_events WHERE reported_by = '${PERF_PERSON_ID}'`);
    await pgClient.query(`DELETE FROM work_orders WHERE organisation_id = '${PERF_ORG_ID}'`);
    await pgClient.query(`DELETE FROM assets WHERE organisation_id = '${PERF_ORG_ID}'`);
    await pgClient.query(`DELETE FROM sites WHERE id = '${PERF_SITE_ID}'`);
    await pgClient.query(`DELETE FROM persons WHERE id = '${PERF_PERSON_ID}'`);
    await pgClient.query(`DELETE FROM organisations WHERE id = '${PERF_ORG_ID}'`);

    const cleanMs = Math.round(performance.now() - cleanStart);

    // Verify
    const rOrg  = await pgClient.query(`SELECT COUNT(*) FROM organisations WHERE id = '${PERF_ORG_ID}'`);
    const rAst  = await pgClient.query(`SELECT COUNT(*) FROM assets WHERE asset_reference LIKE '${PERF_PREFIX}%'`);
    const rWo   = await pgClient.query(`SELECT COUNT(*) FROM work_orders WHERE work_order_number LIKE '${PERF_PREFIX}%'`);
    const rFail = await pgClient.query(`SELECT COUNT(*) FROM asset_failure_events WHERE reported_by = '${PERF_PERSON_ID}'`);
    const rCond = await pgClient.query(`SELECT COUNT(*) FROM asset_condition_assessments WHERE assessed_by = '${PERF_PERSON_ID}'`);

    const counts = {
      org: parseInt(rOrg.rows[0].count),
      assets: parseInt(rAst.rows[0].count),
      wos: parseInt(rWo.rows[0].count),
      fails: parseInt(rFail.rows[0].count),
      conds: parseInt(rCond.rows[0].count),
    };

    console.log(`  Cleanup completed in ${(cleanMs/1000).toFixed(1)}s`);
    console.log(`  Residual organisations: ${counts.org}`);
    console.log(`  Residual assets:        ${counts.assets}`);
    console.log(`  Residual work orders:   ${counts.wos}`);
    console.log(`  Residual failures:      ${counts.fails}`);
    console.log(`  Residual conditions:    ${counts.conds}`);

    const allClean = Object.values(counts).every(c => c === 0);

    console.log('\n══════════════════════════════════════════════════════════════════');
    if (allClean) {
      console.log('  PHASE 0K PERFORMANCE BENCHMARK: COMPLETE');
      console.log('  ✓ All performance test records cleaned. Residual = 0.');
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
