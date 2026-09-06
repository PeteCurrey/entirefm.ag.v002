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
    const dist = c.distance_miles;
    let geoScore = 0;
    let geoExp = 'No verified depot distance available (unranked proximity tier)';
    if (dist != null) {
      if (dist <= 10) {
        geoScore = 25;
        geoExp = `Local primary depot (${dist.toFixed(1)} miles from ${requirement.site_city || 'site'})`;
      } else if (dist <= 25) {
        geoScore = 20;
        geoExp = `Regional radius coverage (${dist.toFixed(1)} miles)`;
      } else if (dist <= 50) {
        geoScore = 15;
        geoExp = `Extended regional coverage (${dist.toFixed(1)} miles)`;
      } else {
        geoScore = 5;
        geoExp = `Extended transit distance (${dist.toFixed(1)} miles)`;
      }
    } else {
      geoScore = 0;
      geoExp = 'No verified depot distance available (unranked proximity tier)';
    }

    // 3. SLA Performance Score (Max 20 pts)
    const isSlaRated = c.sla_adherence_pct != null;
    let slaScore = 10; // Documented neutral baseline for unrated contractors (50% of 20 pts)
    let slaRate: number | undefined = undefined;
    let slaExp = 'No historic SLA track record (UNRATED — neutral baseline: 10/20 pts)';

    if (isSlaRated && c.sla_adherence_pct != null) {
      slaRate = Math.max(0, Math.min(100, c.sla_adherence_pct));
      slaScore = Math.round((slaRate / 100) * 20);
      slaExp = `Historic on-time SLA adherence: ${slaRate.toFixed(1)}% (RATED)`;
    }

    // 4. Acceptance Rate Score (Max 15 pts)
    const isAccRated = c.acceptance_pct != null;
    let accScore = 7; // Documented neutral baseline for unrated contractors (~50% of 15 pts)
    let accRate: number | undefined = undefined;
    let accExp = 'No historic acceptance track record (UNRATED — neutral baseline: 7/15 pts)';

    if (isAccRated && c.acceptance_pct != null) {
      accRate = Math.max(0, Math.min(100, c.acceptance_pct));
      accScore = Math.round((accRate / 100) * 15);
      accExp = `Historic job acceptance rate: ${accRate.toFixed(1)}% (RATED)`;
    }

    const performanceRatingStatus: 'RATED' | 'UNRATED' = isSlaRated || isAccRated ? 'RATED' : 'UNRATED';

    // 5. Workload Capacity Score (Max 15 pts)
    const openJobs = c.current_open_jobs ?? 0;
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

    const rateExp =
      c.agreed_hourly_rate_gbp != null && c.agreed_callout_rate_gbp != null
        ? `Agreed contract rate: £${c.agreed_hourly_rate_gbp}/hr (Callout: £${c.agreed_callout_rate_gbp})`
        : 'No agreed commercial rates on file (COMMERCIAL_RATE_UNVERIFIED)';

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
      performance_rating_status: performanceRatingStatus,
      is_sla_rated: isSlaRated,
      is_acceptance_rated: isAccRated,
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
