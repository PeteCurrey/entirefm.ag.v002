/**
 * ENTIREFM PULSE BENCHMARKING — SUPPRESSION UTILITY
 * ==================================================
 * Every aggregated statistic in the benchmarking pipeline MUST pass through
 * this module before being surfaced in any report or API response.
 *
 * THRESHOLD: n = 10
 * -----------------
 * We use 10 as the minimum cell size, not the common n=5 floor.
 *
 * Rationale:
 *   - The ICO anonymisation guidance (2012) treats k-anonymity of 5 as an absolute
 *     lower floor, not a safe working threshold.
 *   - The ONS Labour Force Survey suppression policy requires n ≥ 10 for categorical
 *     cross-tabs, specifically because professional-sector survey data can combine with
 *     publicly available information (LinkedIn, Companies House) to re-identify individuals.
 *   - The UK Statistics Authority's data ethics framework for member surveys recommends
 *     n ≥ 10 where responses carry occupational or financial attributes.
 *   - For a survey where `salary_band × primary_sector × team_size` can in combination
 *     identify a small FM team at a specific organisation, n=5 is inadequate.
 *
 * Behaviour when threshold is not met:
 *   - The cut is omitted from the report entirely.
 *   - A `suppressedCount` integer tells the UI how many segments were hidden so it can
 *     display an honest "N segments omitted — insufficient data" message.
 *   - We NEVER silently widen the grouping and label it as the specific cut requested.
 */

import type { BenchmarkingMetricBreakdown } from './types';

/**
 * The minimum number of distinct respondents required for a cell to be published.
 * Changing this constant retroactively affects all reports — do not lower without
 * a documented privacy review.
 */
export const SUPPRESSION_THRESHOLD = 10;

/**
 * Returns true if a cell with this respondent count must be suppressed.
 */
export function suppressedCut(count: number): boolean {
  return count < SUPPRESSION_THRESHOLD;
}

// ---------------------------------------------------------------------------
// Single-field distributions
// ---------------------------------------------------------------------------

export interface SuppressedDistribution {
  /** Cells that meet the suppression threshold and are safe to publish. */
  visible: BenchmarkingMetricBreakdown[];
  /** How many cells were removed because they fell below the threshold. */
  suppressedCount: number;
  /** Total respondents across ALL cells (visible + suppressed). */
  totalRespondents: number;
  /** Threshold used, embedded so callers/UI can surface it honestly. */
  threshold: number;
}

/**
 * Filter a computed distribution through the suppression rule.
 * Any cell with count < SUPPRESSION_THRESHOLD is removed.
 * The returned object includes metadata the UI needs to display honestly.
 */
export function applySuppressionToDistribution(
  items: BenchmarkingMetricBreakdown[]
): SuppressedDistribution {
  const totalRespondents = items.reduce((sum, i) => sum + i.count, 0);
  const visible: BenchmarkingMetricBreakdown[] = [];
  let suppressedCount = 0;

  for (const item of items) {
    if (suppressedCut(item.count)) {
      suppressedCount++;
    } else {
      visible.push(item);
    }
  }

  // Re-derive percentages from visible cells only so they sum correctly.
  const visibleTotal = visible.reduce((sum, i) => sum + i.count, 0);
  const recalculated = visible.map((item) => ({
    ...item,
    percentage:
      visibleTotal > 0 ? Number(((item.count / visibleTotal) * 100).toFixed(1)) : 0,
  }));

  return {
    visible: recalculated,
    suppressedCount,
    totalRespondents,
    threshold: SUPPRESSION_THRESHOLD,
  };
}

// ---------------------------------------------------------------------------
// Cross-tab (two-field) suppression
// ---------------------------------------------------------------------------

export interface CrossTabCell {
  /** Label for dimension A (e.g. salary band) */
  labelA: string;
  /** Label for dimension B (e.g. region) */
  labelB: string;
  /** Number of respondents in this exact combination */
  count: number;
  /** Any derived statistics for this cell (optional) */
  stats?: Record<string, number>;
}

export interface SuppressedCrossTab {
  /** Cells that are safe to publish */
  visible: CrossTabCell[];
  /** Number of cells suppressed */
  suppressedCount: number;
  /** Total respondents across all cells */
  totalRespondents: number;
  threshold: number;
}

/**
 * Apply suppression to a cross-tab result.
 * A cell is suppressed if its count is below the threshold — even if each axis
 * individually would clear the threshold. The combination is what matters.
 */
export function applyCrossTabSuppression(cells: CrossTabCell[]): SuppressedCrossTab {
  const totalRespondents = cells.reduce((sum, c) => sum + c.count, 0);
  const visible: CrossTabCell[] = [];
  let suppressedCount = 0;

  for (const cell of cells) {
    if (suppressedCut(cell.count)) {
      suppressedCount++;
    } else {
      visible.push(cell);
    }
  }

  return { visible, suppressedCount, totalRespondents, threshold: SUPPRESSION_THRESHOLD };
}
