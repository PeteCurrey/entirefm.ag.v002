/**
 * ENTIREFM ANNUAL "STATE OF UK FM" BENCHMARKING STORE
 * =====================================================
 * Manages survey intake and calculates live, authentic statistical
 * aggregate benchmarks directly from PostgreSQL submissions.
 * Zero fabricated numbers or hardcoded percentages.
 */

import { AnnualSurveyResponse, AnnualBenchmarkingReport, BenchmarkingMetricBreakdown } from './types';
import { dbQuery } from '@/server/db/client';

function computeDistribution(items: string[], total: number): BenchmarkingMetricBreakdown[] {
  if (total === 0) return [];
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item) continue;
    counts[item] = (counts[item] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);
}

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
    raw_responses: data.rawResponses || {},
    created_at: now,
    updated_at: now,
  };

  await dbQuery('lobby_annual_survey_responses', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

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
  const { data } = await dbQuery<any[]>(
    `lobby_annual_survey_responses?year=eq.${year}&member_id=eq.${encodeURIComponent(memberId)}&limit=1`
  );
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
    rawResponses: r.raw_responses || {},
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Compute the authentic live State of UK FM benchmarking report for a given year.
 */
export async function getAnnualBenchmarkingReport(year: number = 2026): Promise<AnnualBenchmarkingReport> {
  const { data: rows } = await dbQuery<any[]>(
    `lobby_annual_survey_responses?year=eq.${year}`
  );

  const responses = rows || [];
  const totalResponses = responses.length;

  const isReliableSample = totalResponses >= 30;
  const sampleStatusText = totalResponses === 0
    ? 'Survey is currently open for submissions. Live data updates automatically as practitioners respond.'
    : totalResponses < 30
    ? `Early preliminary cohort (${totalResponses} verified responses). Statistically significant benchmarks published at 30+ respondents.`
    : `Robust sample based on ${totalResponses} verified UK FM practitioners and estate leads.`;

  const salaryDistribution = computeDistribution(responses.map((r) => r.salary_band), totalResponses);
  const teamSizeDistribution = computeDistribution(responses.map((r) => r.team_size), totalResponses);
  const sectorDistribution = computeDistribution(responses.map((r) => r.primary_sector), totalResponses);
  const topChallenges = computeDistribution(responses.map((r) => r.biggest_challenge), totalResponses);
  const technologyAdoption = computeDistribution(responses.map((r) => r.technology_adoption_level), totalResponses);
  const sustainabilityTargets = computeDistribution(responses.map((r) => r.sustainability_target_year), totalResponses);

  return {
    year,
    totalResponses,
    isReliableSample,
    sampleStatusText,
    salaryDistribution,
    teamSizeDistribution,
    sectorDistribution,
    topChallenges,
    technologyAdoption,
    sustainabilityTargets,
  };
}
