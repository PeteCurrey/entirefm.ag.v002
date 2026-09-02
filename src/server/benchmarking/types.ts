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
  rawResponses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkingMetricBreakdown {
  label: string;
  count: number;
  percentage: number;
}

export interface AnnualBenchmarkingReport {
  year: number;
  totalResponses: number;
  isReliableSample: boolean;
  sampleStatusText: string;
  salaryDistribution: BenchmarkingMetricBreakdown[];
  teamSizeDistribution: BenchmarkingMetricBreakdown[];
  sectorDistribution: BenchmarkingMetricBreakdown[];
  topChallenges: BenchmarkingMetricBreakdown[];
  technologyAdoption: BenchmarkingMetricBreakdown[];
  sustainabilityTargets: BenchmarkingMetricBreakdown[];
}
