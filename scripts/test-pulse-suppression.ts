/**
 * TEST: PULSE SUPPRESSION UTILITY
 * ================================
 * Runs in-process — no DB connection required.
 * Tests the suppression logic with real edge cases.
 *
 * Run: npx tsx scripts/test-pulse-suppression.ts
 */

import {
  SUPPRESSION_THRESHOLD,
  suppressedCut,
  applySuppressionToDistribution,
  applyCrossTabSuppression,
} from '../src/server/benchmarking/suppression';
import type { BenchmarkingMetricBreakdown, CrossTabCell } from '../src/server/benchmarking/suppression';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓  ${description}`);
    passed++;
  } else {
    console.error(`  ✗  FAILED: ${description}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
console.log('\n── Suppression threshold constant ──────────────────────────────────');

assert(`SUPPRESSION_THRESHOLD is ${SUPPRESSION_THRESHOLD}`, SUPPRESSION_THRESHOLD === 10);

// ---------------------------------------------------------------------------
console.log('\n── suppressedCut() edge cases ──────────────────────────────────────');

assert('count = 0 → suppressed', suppressedCut(0) === true);
assert('count = 1 → suppressed', suppressedCut(1) === true);
assert('count = 9 (just below) → suppressed', suppressedCut(9) === true);
assert('count = 10 (exact threshold) → NOT suppressed', suppressedCut(10) === false);
assert('count = 11 (just above) → NOT suppressed', suppressedCut(11) === false);
assert('count = 1000 → NOT suppressed', suppressedCut(1000) === false);

// ---------------------------------------------------------------------------
console.log('\n── applySuppressionToDistribution() ────────────────────────────────');

// All cells above threshold — none suppressed
const allVisible: BenchmarkingMetricBreakdown[] = [
  { label: 'Commercial Offices', count: 14, percentage: 0 },
  { label: 'Healthcare & NHS', count: 12, percentage: 0 },
  { label: 'Higher Education', count: 10, percentage: 0 },
];
const r1 = applySuppressionToDistribution(allVisible);
assert('all above threshold: visible.length === 3', r1.visible.length === 3);
assert('all above threshold: suppressedCount === 0', r1.suppressedCount === 0);
assert('totalRespondents === 36', r1.totalRespondents === 36);
assert('percentages sum to 100', Math.abs(r1.visible.reduce((s, i) => s + i.percentage, 0) - 100) < 0.5);

// One cell just below threshold
const mixed: BenchmarkingMetricBreakdown[] = [
  { label: 'Commercial Offices', count: 20, percentage: 0 },
  { label: 'Retail & Leisure', count: 9, percentage: 0 }, // below threshold
];
const r2 = applySuppressionToDistribution(mixed);
assert('mixed: visible.length === 1', r2.visible.length === 1);
assert('mixed: suppressedCount === 1', r2.suppressedCount === 1);
assert('mixed: visible[0].label === "Commercial Offices"', r2.visible[0].label === 'Commercial Offices');
assert('mixed: totalRespondents includes suppressed (29)', r2.totalRespondents === 29);
assert('mixed: visible percentage recalculated to 100%', r2.visible[0].percentage === 100);

// All cells below threshold
const allSuppressed: BenchmarkingMetricBreakdown[] = [
  { label: 'A', count: 3, percentage: 0 },
  { label: 'B', count: 5, percentage: 0 },
];
const r3 = applySuppressionToDistribution(allSuppressed);
assert('all below: visible.length === 0', r3.visible.length === 0);
assert('all below: suppressedCount === 2', r3.suppressedCount === 2);
assert('all below: totalRespondents === 8', r3.totalRespondents === 8);

// Empty input
const r4 = applySuppressionToDistribution([]);
assert('empty input: visible.length === 0', r4.visible.length === 0);
assert('empty input: suppressedCount === 0', r4.suppressedCount === 0);
assert('empty input: totalRespondents === 0', r4.totalRespondents === 0);

// ---------------------------------------------------------------------------
console.log('\n── applyCrossTabSuppression() ──────────────────────────────────────');

// Scenario: salary × region cross-tab.
// Each axis alone would clear threshold, but the combination doesn't.
const crossTabCells: CrossTabCell[] = [
  { labelA: '£60,000–£80,000', labelB: 'North', count: 12 },   // passes
  { labelA: '£60,000–£80,000', labelB: 'Midlands', count: 11 }, // passes
  { labelA: '£80,000–£110,000', labelB: 'North', count: 7 },    // suppressed (individually fine axes, but 7 < 10)
  { labelA: '£80,000–£110,000', labelB: 'Midlands', count: 4 }, // suppressed
];

// If we only checked axes:
// £60k-80k total = 23 (passes)  |  £80k-110k total = 11 (passes)
// North total = 19 (passes)     |  Midlands total = 15 (passes)
// But the combinations matter — only the joint count is checked.

const ct1 = applyCrossTabSuppression(crossTabCells);
assert('cross-tab: 2 cells visible (those with count ≥ 10)', ct1.visible.length === 2);
assert('cross-tab: 2 cells suppressed (those with count < 10)', ct1.suppressedCount === 2);
assert('cross-tab: totalRespondents === 34', ct1.totalRespondents === 34);
assert(
  'cross-tab: suppressed cells are the small-count ones',
  ct1.visible.every((c) => c.count >= 10)
);

// All cross-tab cells above threshold
const ctAllVisible: CrossTabCell[] = [
  { labelA: 'A', labelB: 'X', count: 10 },
  { labelA: 'B', labelB: 'Y', count: 25 },
];
const ct2 = applyCrossTabSuppression(ctAllVisible);
assert('cross-tab all visible: suppressedCount === 0', ct2.suppressedCount === 0);
assert('cross-tab all visible: visible.length === 2', ct2.visible.length === 2);

// ---------------------------------------------------------------------------
console.log('\n────────────────────────────────────────────────────────────────────');
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
