/**
 * ENTIREFM ANNUAL "STATE OF UK FM" BENCHMARKING STORE
 * =====================================================
 * Manages survey intake, computes authentic aggregated benchmarks,
 * and writes/reads pre-computed quarterly snapshots.
 *
 * Privacy guarantee: every aggregate call passes through the suppression
 * utility in suppression.ts. There is no path to a published number that
 * bypasses the minimum-cell-size check.
 *
 * Zero fabricated numbers, zero hardcoded percentages, zero mocked fallbacks.
 * If the DB is unreachable, callers receive an explicit error — not cached data.
 */

import type {
  AnnualSurveyResponse,
  AnnualBenchmarkingReport,
  BenchmarkingMetricBreakdown,
  ReportSection,
  BenchmarkSnapshot,
} from './types';
import { applySuppressionToDistribution } from './suppression';
import { dbQuery } from '@/server/db/client';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Current quarter (1–4) for a given date. Defaults to now. */
function quarterFor(date: Date = new Date()): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/** Human-readable survey period label, e.g. "Q3 2026" */
function surveyPeriodLabel(year: number, quarter: number): string {
  return `Q${quarter} ${year}`;
}

/**
 * Tally raw string values into a distribution array, then apply suppression.
 * Returns a ReportSection — never raw counts below the threshold.
 */
function computeAndSuppress(values: (string | null | undefined)[]): ReportSection {
  const counts: Record<string, number> = {};
  for (const v of values) {
    if (!v) continue;
    counts[v] = (counts[v] || 0) + 1;
  }

  const breakdown: BenchmarkingMetricBreakdown[] = Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percentage: 0, // recalculated inside applySuppressionToDistribution
    }))
    .sort((a, b) => b.count - a.count);

  const suppressed = applySuppressionToDistribution(breakdown);
  return suppressed;
}

// ---------------------------------------------------------------------------
// App launch date — rows created before this are treated as test/seed data
// and excluded from all aggregations.
// ---------------------------------------------------------------------------
const APP_LAUNCH_DATE = '2026-01-01T00:00:00Z';

// ---------------------------------------------------------------------------
// Survey intake
// ---------------------------------------------------------------------------

/**
 * Submit or update a member's annual survey response.
 */
export async function submitSurveyResponse(data: {
  year?: number;
  memberId: string;
  salaryBand: string;
  teamSize: string;
  primarySector: string;
  biggestChallenge: string;
  technologyAdoptionLevel: string;
  sustainabilityTargetYear: string;
  region?: string | null;
  rawResponses?: Record<string, any>;
}): Promise<AnnualSurveyResponse> {
  const year = data.year || new Date().getFullYear();
  const id = `surv-${year}-${data.memberId}`;
  const now = new Date().toISOString();

  const row = {
    id,
    year,
    member_id: data.memberId,
    salary_band: data.salaryBand,
    team_size: data.teamSize,
    primary_sector: data.primarySector,
    biggest_challenge: data.biggestChallenge,
    technology_adoption_level: data.technologyAdoptionLevel,
    sustainability_target_year: data.sustainabilityTargetYear,
    region: data.region ?? null,
    raw_responses: data.rawResponses || {},
    created_at: now,
    updated_at: now,
  };

  const result = await dbQuery('lobby_annual_survey_responses', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  if (result.error) {
    throw new Error(`Failed to record survey response: ${result.error}`);
  }

  return {
    id,
    year,
    memberId: data.memberId,
    salaryBand: data.salaryBand,
    teamSize: data.teamSize,
    primarySector: data.primarySector,
    biggestChallenge: data.biggestChallenge,
    technologyAdoptionLevel: data.technologyAdoptionLevel,
    sustainabilityTargetYear: data.sustainabilityTargetYear,
    region: data.region ?? null,
    rawResponses: row.raw_responses,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get a member's own survey submission for a specific year.
 */
export async function getMemberSurveyResponse(
  year: number,
  memberId: string
): Promise<AnnualSurveyResponse | null> {
  const { data, error } = await dbQuery<any[]>(
    `lobby_annual_survey_responses?year=eq.${year}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
  if (error) throw new Error(`Failed to fetch survey response: ${error}`);
  if (!data || data.length === 0) return null;
  const r = data[0];
  return {
    id: r.id,
    year: r.year,
    memberId: r.member_id,
    salaryBand: r.salary_band,
    teamSize: r.team_size,
    primarySector: r.primary_sector,
    biggestChallenge: r.biggest_challenge,
    technologyAdoptionLevel: r.technology_adoption_level,
    sustainabilityTargetYear: r.sustainability_target_year,
    region: r.region ?? null,
    rawResponses: r.raw_responses || {},
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Live aggregation (used by the snapshot job — not called on page load)
// ---------------------------------------------------------------------------

/**
 * Fetch raw survey rows for a given year, filtering out test/seed data.
 * Logs a warning if suspicious rows are detected.
 */
async function fetchVerifiedRows(year: number): Promise<any[]> {
  // Fetch all rows for this year created on or after the app launch date.
  // PostgREST syntax: gte filter on created_at.
  const launchEncoded = encodeURIComponent(APP_LAUNCH_DATE);
  const { data, error } = await dbQuery<any[]>(
    `lobby_annual_survey_responses?year=eq.${year}&created_at=gte.${launchEncoded}&order=created_at.asc`
  );

  if (error) throw new Error(`DB error fetching survey rows: ${error}`);
  const rows = data || [];

  // Audit: warn if any rows look like seed/test data that slipped through.
  const suspicious = rows.filter(
    (r) =>
      !r.member_id ||
      String(r.id).startsWith('test-') ||
      String(r.id).startsWith('seed-') ||
      String(r.member_id).startsWith('00000000')
  );
  if (suspicious.length > 0) {
    console.warn(
      `[PULSE_SUPPRESSION] WARNING: ${suspicious.length} suspicious row(s) detected in survey data for year ${year}. ` +
        `IDs: ${suspicious.map((r) => r.id).join(', ')}. ` +
        `These rows are EXCLUDED from all aggregations. Review and delete if confirmed test data.`
    );
  }

  // Return only rows that pass the audit (not suspicious)
  return rows.filter(
    (r) =>
      r.member_id &&
      !String(r.id).startsWith('test-') &&
      !String(r.id).startsWith('seed-') &&
      !String(r.member_id).startsWith('00000000')
  );
}

/**
 * Compute an authentic AnnualBenchmarkingReport from live DB rows.
 * Every distribution is passed through the suppression utility.
 */
export async function computeLiveReport(year: number = new Date().getFullYear()): Promise<AnnualBenchmarkingReport> {
  const rows = await fetchVerifiedRows(year);
  const totalResponses = rows.length;
  const quarter = quarterFor();
  const surveyPeriod = surveyPeriodLabel(year, quarter);

  const isReliableSample = totalResponses >= 30;
  const sampleStatusText =
    totalResponses === 0
      ? 'Survey is currently open for submissions. Live data updates automatically as practitioners respond.'
      : totalResponses < 30
      ? `Early cohort (${totalResponses} verified responses). Benchmarks with statistical weight published at 30+ respondents.`
      : `Robust sample based on ${totalResponses} verified UK FM practitioners and estate leads.`;

  return {
    year,
    quarter,
    surveyPeriod,
    totalResponses,
    isReliableSample,
    sampleStatusText,
    salaryDistribution: computeAndSuppress(rows.map((r) => r.salary_band)),
    teamSizeDistribution: computeAndSuppress(rows.map((r) => r.team_size)),
    sectorDistribution: computeAndSuppress(rows.map((r) => r.primary_sector)),
    topChallenges: computeAndSuppress(rows.map((r) => r.biggest_challenge)),
    technologyAdoption: computeAndSuppress(rows.map((r) => r.technology_adoption_level)),
    sustainabilityTargets: computeAndSuppress(rows.map((r) => r.sustainability_target_year)),
  };
}

// ---------------------------------------------------------------------------
// Snapshots — read/write the pre-computed quarterly report
// ---------------------------------------------------------------------------

/**
 * Compute a fresh report and persist it as a snapshot in pulse_benchmark_snapshots.
 * Called by the quarterly cron job (and the admin "Run Now" button).
 */
export async function computeAndSnapshotReport(
  year: number = new Date().getFullYear(),
  runBy: string = 'cron'
): Promise<BenchmarkSnapshot> {
  const quarter = quarterFor();
  const id = `${year}-Q${quarter}-${Date.now()}`;
  const runAt = new Date().toISOString();

  const report = await computeLiveReport(year);

  const row = {
    id,
    year,
    quarter,
    run_at: runAt,
    total_responses: report.totalResponses,
    snapshot_json: report,
    run_by: runBy,
  };

  const { error } = await dbQuery('pulse_benchmark_snapshots', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=minimal' },
  });

  if (error) throw new Error(`Failed to write benchmark snapshot: ${error}`);

  console.log(
    `[PULSE_SNAPSHOT] Snapshot ${id} written. Year=${year} Q${quarter} totalResponses=${report.totalResponses} runBy=${runBy}`
  );

  return {
    id,
    year,
    quarter,
    runAt,
    totalResponses: report.totalResponses,
    snapshotJson: report,
    runBy,
  };
}

/**
 * Read the most recent snapshot for a given year (defaults to current year).
 * Returns null if no snapshot exists yet — callers should handle this explicitly.
 */
export async function getLatestSnapshot(year: number = new Date().getFullYear()): Promise<BenchmarkSnapshot | null> {
  const { data, error } = await dbQuery<any[]>(
    `pulse_benchmark_snapshots?year=eq.${year}&order=run_at.desc&limit=1`
  );

  if (error) throw new Error(`Failed to fetch benchmark snapshot: ${error}`);
  if (!data || data.length === 0) return null;

  const r = data[0];
  return {
    id: r.id,
    year: r.year,
    quarter: r.quarter,
    runAt: r.run_at,
    totalResponses: r.total_responses,
    snapshotJson: r.snapshot_json as AnnualBenchmarkingReport,
    runBy: r.run_by,
  };
}

/**
 * Get all snapshots for a year (useful for the admin view — shows run history).
 */
export async function getSnapshotHistory(year: number = new Date().getFullYear()): Promise<BenchmarkSnapshot[]> {
  const { data, error } = await dbQuery<any[]>(
    `pulse_benchmark_snapshots?year=eq.${year}&order=run_at.desc&limit=20`
  );

  if (error) throw new Error(`Failed to fetch snapshot history: ${error}`);
  const rows = data || [];

  return rows.map((r) => ({
    id: r.id,
    year: r.year,
    quarter: r.quarter,
    runAt: r.run_at,
    totalResponses: r.total_responses,
    snapshotJson: r.snapshot_json as AnnualBenchmarkingReport,
    runBy: r.run_by,
  }));
}

/**
 * Fetch per-cut raw response counts for the admin count view (Prompt 4).
 * Returns counts only — no percentages, no aggregated stats.
 * This is how whoever manages Pulse can see which topics are near threshold.
 */
export async function getAdminCutCounts(year: number = new Date().getFullYear()): Promise<{
  year: number;
  totalRows: number;
  suspiciousRowCount: number;
  salaryBand: { label: string; count: number }[];
  teamSize: { label: string; count: number }[];
  primarySector: { label: string; count: number }[];
  biggestChallenge: { label: string; count: number }[];
  technologyAdoptionLevel: { label: string; count: number }[];
  sustainabilityTargetYear: { label: string; count: number }[];
  region: { label: string; count: number }[];
}> {
  const launchEncoded = encodeURIComponent(APP_LAUNCH_DATE);
  const { data, error } = await dbQuery<any[]>(
    `lobby_annual_survey_responses?year=eq.${year}&created_at=gte.${launchEncoded}&order=created_at.asc`
  );

  if (error) throw new Error(`DB error fetching admin cut counts: ${error}`);
  const rows = data || [];

  const suspicious = rows.filter(
    (r) =>
      !r.member_id ||
      String(r.id).startsWith('test-') ||
      String(r.id).startsWith('seed-') ||
      String(r.member_id).startsWith('00000000')
  );
  const clean = rows.filter(
    (r) =>
      r.member_id &&
      !String(r.id).startsWith('test-') &&
      !String(r.id).startsWith('seed-') &&
      !String(r.member_id).startsWith('00000000')
  );

  function tally(values: (string | null | undefined)[]): { label: string; count: number }[] {
    const counts: Record<string, number> = {};
    for (const v of values) {
      if (!v) continue;
      counts[v] = (counts[v] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  return {
    year,
    totalRows: clean.length,
    suspiciousRowCount: suspicious.length,
    salaryBand: tally(clean.map((r) => r.salary_band)),
    teamSize: tally(clean.map((r) => r.team_size)),
    primarySector: tally(clean.map((r) => r.primary_sector)),
    biggestChallenge: tally(clean.map((r) => r.biggest_challenge)),
    technologyAdoptionLevel: tally(clean.map((r) => r.technology_adoption_level)),
    sustainabilityTargetYear: tally(clean.map((r) => r.sustainability_target_year)),
    region: tally(clean.map((r) => r.region)),
  };
}

/**
 * Legacy: kept for backwards compatibility with any existing callers.
 * @deprecated Use getLatestSnapshot() for page rendering,
 *             computeLiveReport() only inside computeAndSnapshotReport().
 */
export async function getAnnualBenchmarkingReport(year: number = 2026): Promise<AnnualBenchmarkingReport> {
  const snapshot = await getLatestSnapshot(year);
  if (snapshot) return snapshot.snapshotJson;
  // Fall back to live computation if no snapshot exists yet, but warn loudly.
  console.warn(
    `[PULSE_SNAPSHOT] No snapshot found for year ${year}. Falling back to live computation. ` +
      `Run /api/admin/pulse/snapshot (POST) to create the first snapshot.`
  );
  return computeLiveReport(year);
}
