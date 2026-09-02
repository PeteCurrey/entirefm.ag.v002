/**
 * ENTIREFM ANNUAL "STATE OF UK FM" BENCHMARKING DATA MODELS
 * ==========================================================
 */

export interface AnnualSurveyResponse {
  id: string;
  year: number;
  memberId: string;
  salaryBand: string;
  teamSize: string;
  primarySector: string;
  biggestChallenge: string;
  technologyAdoptionLevel: string;
  sustainabilityTargetYear: string;
  region: string | null;
  rawResponses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkingMetricBreakdown {
  label: string;
  count: number;
  percentage: number;
}

// Re-export suppression types so report consumers have one import surface
export type {
  SuppressedDistribution,
  CrossTabCell,
  SuppressedCrossTab,
} from './suppression';

export interface ReportSection {
  /** Cells that cleared the suppression threshold */
  visible: BenchmarkingMetricBreakdown[];
  /** Number of segments removed for insufficient respondent count */
  suppressedCount: number;
  /** Total respondents who answered this question (visible + suppressed) */
  totalRespondents: number;
  /** The minimum count threshold used — always 10 */
  threshold: number;
}

export interface AnnualBenchmarkingReport {
  year: number;
  quarter: number;
  /** Human-readable survey period, e.g. "Q3 2026" */
  surveyPeriod: string;
  totalResponses: number;
  /** Whether the overall sample is large enough for the report to be meaningful */
  isReliableSample: boolean;
  sampleStatusText: string;
  salaryDistribution: ReportSection;
  teamSizeDistribution: ReportSection;
  sectorDistribution: ReportSection;
  topChallenges: ReportSection;
  technologyAdoption: ReportSection;
  sustainabilityTargets: ReportSection;
}

/** A persisted snapshot row from pulse_benchmark_snapshots */
export interface BenchmarkSnapshot {
  id: string;
  year: number;
  quarter: number;
  runAt: string;
  totalResponses: number;
  snapshotJson: AnnualBenchmarkingReport;
  runBy: string;
}
