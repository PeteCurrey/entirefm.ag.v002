/**
 * ENTIREFM CONTRACTOR SUITABILITY & RANKING ENGINE (Phase 0M)
 * ============================================================
 * Transparent, Explainable Deterministic Ranking for Eligible Providers.
 *
 * Scoring Model (100 Points Total):
 *   - Trade & Skill Match:       25 pts
 *   - Geographic Locality:       25 pts
 *   - Historic SLA Adherence:    20 pts
 *   - Job Acceptance Rate:       15 pts
 *   - Available Capacity:        15 pts
 *
 * Output: Full factor breakdown so helpdesk operators can understand
 * "Why was this contractor selected?" with zero opaque mystery scores.
 */

import { EligibleContractorCandidate, HardEligibilityGate } from './types';
import { TradeCategory, UrgencyLevel } from '../helpdesk/types';

export interface RawCandidateInput {
  supplier_id: string;
  supplier_name: string;
  supplier_code: string;
  contact_email?: string;
  contact_phone?: string;
  trades?: string[];
  distance_miles?: number;
  sla_adherence_pct?: number;
  acceptance_pct?: number;
  current_open_jobs?: number;
  agreed_callout_rate_gbp?: number;
  agreed_hourly_rate_gbp?: number;
  eligibility_gate: HardEligibilityGate;
}

export function rankEligibleContractors(
  candidates: RawCandidateInput[],
  requirement: { trade: TradeCategory; priority: UrgencyLevel; site_city?: string }
): EligibleContractorCandidate[] {
  const ranked: EligibleContractorCandidate[] = [];

  for (const c of candidates) {
    if (!c.eligibility_gate.is_eligible) continue;

    const suppTrades = (c.trades || []).map((t) => t.toUpperCase());
    const reqTrade = requirement.trade.toUpperCase();

    // 1. Trade Match Score (Max 25 pts)
    let tradeScore = 15;
    let tradeExp = `General trade discipline coverage for ${requirement.trade}`;
    if (suppTrades.includes(reqTrade)) {
      tradeScore = 25;
      tradeExp = `Direct trade specialist match for ${requirement.trade}`;
    }

    // 2. Geographic Locality Score (Max 25 pts)
    const dist = c.distance_miles ?? 15;
    let geoScore = 10;
    let geoExp = 'National coverage authorised';
    if (dist <= 10) {
      geoScore = 25;
      geoExp = `Local primary depot (${dist.toFixed(1)} miles from ${requirement.site_city || 'site'})`;
    } else if (dist <= 25) {
      geoScore = 20;
      geoExp = `Regional radius coverage (${dist.toFixed(1)} miles)`;
    } else if (dist <= 50) {
      geoScore = 15;
      geoExp = `Extended regional coverage (${dist.toFixed(1)} miles)`;
    }

    // 3. SLA Performance Score (Max 20 pts)
    const slaRate = c.sla_adherence_pct ?? 95;
    const slaScore = Math.round((slaRate / 100) * 20);
    const slaExp = `Historic on-time SLA adherence: ${slaRate.toFixed(1)}%`;

    // 4. Acceptance Rate Score (Max 15 pts)
    const accRate = c.acceptance_pct ?? 92;
    const accScore = Math.round((accRate / 100) * 15);
    const accExp = `Historic job acceptance rate: ${accRate.toFixed(1)}%`;

    // 5. Workload Capacity Score (Max 15 pts)
    const openJobs = c.current_open_jobs ?? 1;
    let workScore = 15;
    let workExp = `High capacity (${openJobs} active work orders)`;
    if (openJobs >= 6) {
      workScore = 5;
      workExp = `Heavy active workload (${openJobs} active work orders)`;
    } else if (openJobs >= 3) {
      workScore = 10;
      workExp = `Moderate active workload (${openJobs} active work orders)`;
    }

    const totalScore = tradeScore + geoScore + slaScore + accScore + workScore;

    const rateExp = c.agreed_hourly_rate_gbp
      ? `Agreed contract rate: £${c.agreed_hourly_rate_gbp}/hr (Callout: £${c.agreed_callout_rate_gbp || 0})`
      : 'Standard commercial tariff applies';

    ranked.push({
      supplier_id: c.supplier_id,
      supplier_name: c.supplier_name,
      supplier_code: c.supplier_code,
      contact_email: c.contact_email,
      contact_phone: c.contact_phone,
      trade_match_score: tradeScore * 4,
      geographic_distance_miles: dist,
      sla_adherence_rate: slaRate,
      acceptance_rate: accRate,
      current_open_jobs: openJobs,
      agreed_callout_rate_gbp: c.agreed_callout_rate_gbp,
      agreed_hourly_rate_gbp: c.agreed_hourly_rate_gbp,
      total_suitability_score: totalScore,
      scoring_factors: {
        trade_match_explanation: tradeExp,
        location_coverage_explanation: geoExp,
        sla_performance_explanation: slaExp,
        workload_explanation: workExp,
        rate_agreement_explanation: rateExp,
      },
      eligibility_gates: c.eligibility_gate,
    });
  }

  // Sort descending by total suitability score
  ranked.sort((a, b) => b.total_suitability_score - a.total_suitability_score);

  return ranked;
}
