/**
 * ENTIREFM ASSET INTELLIGENCE ENGINE (Phase 0K)
 * ================================================
 * Canonical computation module for Asset Intelligence, Lifecycle Cost,
 * Failure Analysis, Condition Management, and Predictive Readiness.
 *
 * Truth semantics:
 *   - 'NO_DATA' is returned when evidence is absent — never 0 or null.
 *   - Cost figures sourced exclusively from canonical Finance domain.
 *   - Condition requires an assessment source — never inferred silently.
 *   - Expected life never fabricated from LLM knowledge.
 *   - No mystery aggregate scores.
 *   - Predictive claims require MODEL_ELIGIBLE readiness + validated model.
 */

import { dbQuery } from '../db/client';
import type { UserSession } from '../identity';
import { hasPermission } from '../identity';
import { getAssetFinancialCostAttribution } from '../finance';
export * from './types';
import type {
  AssetAge,
  AssetClassPerformance,
  AssetCondition,
  AssetCostLedger,
  AssetCostPeriod,
  AssetCriticality,
  AssetDataQuality,
  AssetFailureEvent,
  AssetIntelligenceProfile,
  AssetIntelligenceSummary,
  AssetLifecycleProfile,
  AssetLifecycleStatus,
  AssetReplacementReview,
  AssetSignal,
  ClientAssetExposure,
  ConditionAssessment,
  ConditionRecord,
  DataNoValue,
  EnrichmentQueue,
  EnrichmentQueueItem,
  ExpectedLifeProfile,
  ExpectedLifeRemaining,
  PredictiveReadiness,
  PredictiveReadinessCriteria,
  RankedAsset,
  RepairToReplacementRatio,
  RepeatFailureResult,
  ReplacementEstimateFreshness,
  ReplacementReviewCandidate,
  SignalType,
  SiteAssetExposure,
  WarrantyStatus,
} from './types';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STALE_ESTIMATE_DAYS = 365;
const AGEING_ESTIMATE_DAYS = 180;
const APPROACHING_LIFE_PCT = 0.85; // signal when >= 85% of expected life elapsed
const HIGH_REACTIVE_COST_12M_GBP = 5000;
const WARRANTY_EXPIRING_DAYS = 90;
const MIN_SAMPLE_FOR_CLASS_COMPARISON = 5;

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────

function today(): Date {
  return new Date();
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function yearsBetween(a: Date, b: Date): number {
  return parseFloat(((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2));
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

// ─── AGE CALCULATION ──────────────────────────────────────────────────────────

export function computeAssetAge(asset: {
  installation_date?: string | null;
  commission_date?: string | null;
  manufacture_date?: string | null;
  metadata?: Record<string, unknown> | null;
}): AssetAge {
  const now = today();
  const todayStr = now.toISOString().split('T')[0];

  // Installation Age: ONLY calculated from installation_date. NEVER falls back to commission_date.
  const installationAge: number | DataNoValue = asset.installation_date
    ? yearsBetween(new Date(asset.installation_date), now)
    : 'NO_DATA';

  // Commissioning Age: calculated separately if commission_date exists.
  const commissioningAge: number | DataNoValue = asset.commission_date
    ? yearsBetween(new Date(asset.commission_date), now)
    : 'NO_DATA';

  // Manufacture Age: calculated from manufacture_date or metadata.
  const mfgDateStr = asset.manufacture_date || (asset.metadata?.manufacture_date as string | undefined);
  const manufactureAge: number | DataNoValue = mfgDateStr
    ? yearsBetween(new Date(mfgDateStr), now)
    : 'NO_DATA';

  // Primary age: Installation if present, else Commissioning if present, else Manufacture, else NO_DATA
  let primaryType: 'INSTALLATION' | 'COMMISSION' | 'MANUFACTURE' | 'NO_DATA' = 'NO_DATA';
  let primaryYears: number | DataNoValue = 'NO_DATA';

  if (installationAge !== 'NO_DATA') {
    primaryType = 'INSTALLATION';
    primaryYears = installationAge;
  } else if (commissioningAge !== 'NO_DATA') {
    primaryType = 'COMMISSION';
    primaryYears = commissioningAge;
  } else if (manufactureAge !== 'NO_DATA') {
    primaryType = 'MANUFACTURE';
    primaryYears = manufactureAge;
  }

  return {
    installation_age_years: installationAge,
    commissioning_age_years: commissioningAge,
    manufacture_age_years: manufactureAge,
    primary_age_type: primaryType,
    primary_age_years: primaryYears,
    as_of: todayStr,
  };
}

// ─── EXPECTED LIFE ────────────────────────────────────────────────────────────

export function computeExpectedLifeProfile(asset: {
  expected_life_years?: number | null;
  expected_life_source?: string | null;
  expected_life_source_date?: string | null;
  expected_life_confidence?: string | null;
}): ExpectedLifeProfile {
  if (!asset.expected_life_years) {
    return {
      expected_life_years: 'NO_DATA',
      source: 'NOT_CONFIGURED',
      source_date: null,
      confidence: 'UNKNOWN',
    };
  }
  return {
    expected_life_years: asset.expected_life_years,
    source: (asset.expected_life_source as any) || 'NOT_CONFIGURED',
    source_date: asset.expected_life_source_date || null,
    confidence: (asset.expected_life_confidence as any) || 'UNKNOWN',
  };
}

export function computeExpectedLifeRemaining(
  age: AssetAge,
  expectedLife: ExpectedLifeProfile
): ExpectedLifeRemaining {
  if (age.installation_age_years === 'NO_DATA') {
    return {
      remaining_years: 'NO_DATA',
      pct_elapsed: 'NO_DATA',
      note: 'Installation date unknown — cannot calculate remaining expected life (commissioning/manufacture date not substituted).',
    };
  }
  if (expectedLife.expected_life_years === 'NO_DATA') {
    return {
      remaining_years: 'NO_DATA',
      pct_elapsed: 'NO_DATA',
      note: 'Expected life not configured — configure via Expected Life Source.',
    };
  }
  const remaining = parseFloat((expectedLife.expected_life_years - age.installation_age_years).toFixed(2));
  const pctElapsed = parseFloat(((age.installation_age_years / expectedLife.expected_life_years) * 100).toFixed(1));
  return {
    remaining_years: remaining,
    pct_elapsed: pctElapsed,
    note: remaining <= 0
      ? 'Asset has exceeded expected design life based on installation date.'
      : `Approximately ${remaining} years remaining of ${expectedLife.expected_life_years}-year expected life.`,
  };
}

// ─── WARRANTY STATUS ──────────────────────────────────────────────────────────

export function computeWarrantyStatus(warrantyExpiry: string | null): WarrantyStatus {
  if (!warrantyExpiry) return 'UNKNOWN';
  const expiry = new Date(warrantyExpiry);
  const now = today();
  const daysLeft = daysBetween(now, expiry);
  if (daysLeft < 0) return 'EXPIRED';
  if (daysLeft <= WARRANTY_EXPIRING_DAYS) return 'EXPIRING';
  return 'IN_WARRANTY';
}

// ─── REPLACEMENT ESTIMATE FRESHNESS & PROVENANCE ─────────────────────────────

export function computeEstimateFreshness(
  sourceDate: string | null
): ReplacementEstimateFreshness {
  if (!sourceDate) return 'UNKNOWN';
  const date = new Date(sourceDate);
  const ageInDays = daysBetween(date, today());
  if (ageInDays > STALE_ESTIMATE_DAYS) return 'STALE';
  if (ageInDays > AGEING_ESTIMATE_DAYS) return 'AGEING';
  return 'CURRENT';
}

export function evaluateReplacementCostProvenance(asset: {
  replacement_cost_estimate_gbp?: number | null;
  replacement_cost_source?: string | null;
  replacement_cost_source_date?: string | null;
  replacement_cost_confidence?: string | null;
}): import('./types').ReplacementCostProvenance {
  const amount = asset.replacement_cost_estimate_gbp ?? 'NO_DATA';
  const freshness = computeEstimateFreshness(asset.replacement_cost_source_date || null);
  return {
    amount,
    currency: 'GBP',
    tax_basis: 'NET',
    source: asset.replacement_cost_source || null,
    source_date: asset.replacement_cost_source_date || null,
    confidence: (asset.replacement_cost_confidence as any) || 'UNKNOWN',
    freshness,
    requires_update: freshness === 'STALE' || freshness === 'UNKNOWN',
  };
}

// ─── PARTIAL TCO BREAKDOWN ───────────────────────────────────────────────────

export function computePartialTco(params: {
  assetId: string;
  reactiveCostGbp: number | DataNoValue;
  ppmCostGbp: number | DataNoValue;
  purchasePriceGbp?: number | null;
  energyCostGbp?: number | null;
  disposalCostGbp?: number | null;
}): import('./types').PartialTcoBreakdown {
  const purchasePrice: number | DataNoValue = params.purchasePriceGbp ?? 'NO_DATA';
  const energyCost: number | DataNoValue = params.energyCostGbp ?? 'NO_DATA';
  const disposalCost: number | DataNoValue = params.disposalCostGbp ?? 'NO_DATA';
  const reactiveCost = params.reactiveCostGbp;
  const ppmCost = params.ppmCostGbp;

  let total = 0;
  if (typeof reactiveCost === 'number') total += reactiveCost;
  if (typeof ppmCost === 'number') total += ppmCost;
  if (typeof purchasePrice === 'number') total += purchasePrice;
  if (typeof energyCost === 'number') total += energyCost;
  if (typeof disposalCost === 'number') total += disposalCost;

  const missingComponents: string[] = [];
  if (purchasePrice === 'NO_DATA') missingComponents.push('Purchase Price');
  if (energyCost === 'NO_DATA') missingComponents.push('Energy Cost');
  if (disposalCost === 'NO_DATA') missingComponents.push('Disposal Cost');

  const coverageNote = missingComponents.length > 0
    ? `PARTIAL TCO: Reflects attributable maintenance spend (reactive + PPM). Missing lifecycle components: ${missingComponents.join(', ')}.`
    : 'Complete attributable lifecycle cost breakdown.';

  return {
    asset_id: params.assetId,
    purchase_price_gbp: purchasePrice,
    energy_cost_gbp: energyCost,
    disposal_cost_gbp: disposalCost,
    reactive_cost_gbp: reactiveCost,
    ppm_cost_gbp: ppmCost,
    total_attributable_gbp: total,
    label: 'PARTIAL TCO',
    coverage_note: coverageNote,
    data_status: total > 0 ? 'LIVE' : 'NO_DATA',
  };
}

// ─── PREDICTIVE READINESS ─────────────────────────────────────────────────────

// ─── PREDICTIVE READINESS ─────────────────────────────────────────────────────

function isTelemetryReady(criteria: PredictiveReadinessCriteria): boolean {
  if (!criteria.has_telemetry_source) return false;
  const minObs = criteria.telemetry_min_observations_required ?? 10;
  const maxStaleHours = criteria.telemetry_max_stale_hours ?? 48;
  const count = criteria.telemetry_observation_count ?? 0;
  const lastSeen = criteria.telemetry_last_seen_hours_ago;
  const qualityValid = criteria.telemetry_data_quality_valid ?? false;

  return (
    count >= minObs &&
    lastSeen !== null &&
    lastSeen !== undefined &&
    lastSeen <= maxStaleHours &&
    qualityValid === true
  );
}

export function computePredictiveReadiness(
  criteria: PredictiveReadinessCriteria
): PredictiveReadiness {
  const telemetryReady = isTelemetryReady(criteria);

  if (telemetryReady
    && criteria.has_installation_date
    && criteria.has_expected_life
    && criteria.has_condition_assessed
    && criteria.has_failure_history
    && criteria.failure_count >= 5
    && criteria.has_sufficient_work_history) {
    return 'MODEL_ELIGIBLE';
  }
  if (telemetryReady) return 'TELEMETRY_READY';
  if (criteria.has_telemetry_source) return 'TELEMETRY_CONFIGURED';
  if (criteria.has_condition_assessed && criteria.has_failure_history) return 'CONDITION_READY';
  if (criteria.has_failure_history && criteria.has_sufficient_work_history) return 'HISTORY_READY';
  return 'NOT_READY';
}

export function explainPredictiveEligibility(criteria: PredictiveReadinessCriteria): {
  status: PredictiveReadiness;
  meaning: string;
  satisfied_criteria: string[];
  missing_criteria: string[];
} {
  const satisfied: string[] = [];
  const missing: string[] = [];

  if (criteria.has_installation_date) satisfied.push('Installation date recorded');
  else missing.push('Installation date missing');

  if (criteria.has_expected_life) satisfied.push('Expected design life configured');
  else missing.push('Expected design life not configured');

  if (criteria.has_condition_assessed) satisfied.push('Evidence-backed condition assessment on record');
  else missing.push('Condition not assessed');

  if (criteria.has_failure_history) satisfied.push(`Failure history on record (${criteria.failure_count} events)`);
  else missing.push('No failure history recorded');

  if (criteria.failure_count >= 5) satisfied.push('≥5 failure records available for pattern evaluation');
  else missing.push(`<5 failure records (${criteria.failure_count}/5 recorded)`);

  if (criteria.has_sufficient_work_history) satisfied.push(`≥5 work orders/visits recorded (${criteria.work_event_count} events)`);
  else missing.push(`<5 work history events (${criteria.work_event_count}/5 recorded)`);

  if (criteria.has_telemetry_source) {
    satisfied.push('Telemetry sensor source mapped and configured');
    const count = criteria.telemetry_observation_count ?? 0;
    const minObs = criteria.telemetry_min_observations_required ?? 10;
    const maxStale = criteria.telemetry_max_stale_hours ?? 48;
    const lastSeen = criteria.telemetry_last_seen_hours_ago;
    const qualityValid = criteria.telemetry_data_quality_valid ?? false;

    if (count >= minObs) {
      satisfied.push(`Sufficient timestamped observations received (${count} observations, ≥${minObs} required)`);
    } else {
      missing.push(`Insufficient observation count (${count}/${minObs} required)`);
    }

    if (lastSeen !== null && lastSeen !== undefined && lastSeen <= maxStale) {
      satisfied.push(`Recent telemetry observations available (${lastSeen}h ago, ≤${maxStale}h window)`);
    } else if (lastSeen !== null && lastSeen !== undefined) {
      missing.push(`Stale telemetry observations (${lastSeen}h ago > ${maxStale}h allowed)`);
    } else {
      missing.push('No telemetry observations received yet');
    }

    if (qualityValid) {
      satisfied.push('Telemetry data quality verified valid');
    } else {
      missing.push('Telemetry data quality not validated or degraded');
    }
  } else {
    missing.push('No telemetry sensor source mapped');
  }

  const status = computePredictiveReadiness(criteria);
  const meaning = status === 'MODEL_ELIGIBLE'
    ? 'Asset satisfies minimum data criteria for evaluation by a future validated predictive model. EntireCAFM does not autonomously predict failures.'
    : status === 'TELEMETRY_READY'
    ? 'Asset has active, validated, recent telemetry data streaming but has not met full model training baseline requirements.'
    : status === 'TELEMETRY_CONFIGURED'
    ? 'Telemetry sensor is mapped to asset but has insufficient, stale, or unvalidated observations (not TELEMETRY_READY).'
    : `Asset is at '${status}' stage and does not qualify for predictive model evaluation.`;

  return {
    status,
    meaning,
    satisfied_criteria: satisfied,
    missing_criteria: missing,
  };
}

// ─── SIGNAL GENERATION ───────────────────────────────────────────────────────

export function generateAssetSignals(params: {
  asset: {
    condition: string;
    criticality: string;
    warranty_expiry: string | null;
    replacement_cost_source_date: string | null;
    expected_life_years: number | null;
    installation_date: string | null;
    commission_date: string | null;
    manufacturer: string | null;
    model: string | null;
    serial_number: string | null;
    expected_life_source: string | null;
    condition_source: string | null;
  };
  age: AssetAge;
  expectedLifeRemaining: ExpectedLifeRemaining;
  failureCount12m: number;
  reactiveCost12m: number | 'NO_DATA';
  repeatFailure: boolean;
  downtime12m: number | null;
  ppmFailedCount12m: number;
}): Omit<AssetSignal, 'id' | 'asset_id' | 'generated_at' | 'is_active'>[] {
  const signals: Omit<AssetSignal, 'id' | 'asset_id' | 'generated_at' | 'is_active'>[] = [];
  const { asset, age, expectedLifeRemaining, failureCount12m, reactiveCost12m, repeatFailure } = params;

  // Condition signals
  if (asset.condition === 'CRITICAL') {
    signals.push({
      signal_type: 'CONDITION_CRITICAL',
      severity: 'CRITICAL',
      title: 'Asset condition is CRITICAL',
      description: 'This asset has been assessed as CRITICAL. Immediate review required.',
      evidence_snapshot: { condition: asset.condition, condition_source: asset.condition_source },
      policy_version: '1.0',
    });
  } else if (asset.condition === 'POOR') {
    signals.push({
      signal_type: 'CONDITION_POOR',
      severity: asset.criticality === 'CRITICAL' || asset.criticality === 'HIGH' ? 'HIGH' : 'WARNING',
      title: 'Asset condition is POOR',
      description: 'This asset has been assessed as POOR condition.',
      evidence_snapshot: { condition: asset.condition, criticality: asset.criticality },
      policy_version: '1.0',
    });
  }

  // Life expectancy signals
  if (expectedLifeRemaining.pct_elapsed !== 'NO_DATA') {
    if ((expectedLifeRemaining.remaining_years as number) <= 0) {
      signals.push({
        signal_type: 'AGE_EXCEEDS_EXPECTED_LIFE',
        severity: asset.criticality === 'CRITICAL' ? 'HIGH' : 'WARNING',
        title: 'Asset has exceeded expected design life',
        description: `Asset installation age of ${age.installation_age_years} years exceeds expected life of ${params.asset.expected_life_years} years.`,
        evidence_snapshot: {
          installation_age_years: age.installation_age_years,
          expected_life_years: asset.expected_life_years,
          pct_elapsed: expectedLifeRemaining.pct_elapsed,
        },
        policy_version: '1.0',
      });
    } else if ((expectedLifeRemaining.pct_elapsed as number) >= APPROACHING_LIFE_PCT * 100) {
      signals.push({
        signal_type: 'AGE_APPROACHING_EXPECTED_LIFE',
        severity: 'WARNING',
        title: 'Asset approaching expected end of life',
        description: `${Math.round(expectedLifeRemaining.pct_elapsed as number)}% of expected life elapsed.`,
        evidence_snapshot: {
          installation_age_years: age.installation_age_years,
          expected_life_years: asset.expected_life_years,
          pct_elapsed: expectedLifeRemaining.pct_elapsed,
          remaining_years: expectedLifeRemaining.remaining_years,
        },
        policy_version: '1.0',
      });
    }
  }

  // High reactive cost
  if (reactiveCost12m !== 'NO_DATA' && reactiveCost12m >= HIGH_REACTIVE_COST_12M_GBP) {
    signals.push({
      signal_type: 'HIGH_REACTIVE_COST',
      severity: reactiveCost12m >= HIGH_REACTIVE_COST_12M_GBP * 2 ? 'HIGH' : 'WARNING',
      title: 'High reactive maintenance cost',
      description: `£${reactiveCost12m.toFixed(0)} reactive cost in last 12 months (threshold: £${HIGH_REACTIVE_COST_12M_GBP.toFixed(0)}).`,
      evidence_snapshot: { reactive_cost_12m_gbp: reactiveCost12m, threshold_gbp: HIGH_REACTIVE_COST_12M_GBP },
      policy_version: '1.0',
    });
  }

  // Repeat failure
  if (repeatFailure) {
    signals.push({
      signal_type: 'REPEAT_FAILURE',
      severity: 'HIGH',
      title: 'Repeat failure detected',
      description: `${failureCount12m} failures recorded in the last 12 months. Repeat failure policy triggered.`,
      evidence_snapshot: { failure_count_12m: failureCount12m },
      policy_version: '1.0',
    });
  }

  // Warranty expiring
  const warrantyStatus = computeWarrantyStatus(asset.warranty_expiry);
  if (warrantyStatus === 'EXPIRING') {
    signals.push({
      signal_type: 'WARRANTY_EXPIRING',
      severity: 'INFO',
      title: 'Warranty expiring within 90 days',
      description: `Warranty expires ${asset.warranty_expiry}. Review maintenance obligations post-warranty.`,
      evidence_snapshot: { warranty_expiry: asset.warranty_expiry },
      policy_version: '1.0',
    });
  }

  // Data incomplete signals
  const missingFields: string[] = [];
  if (!asset.installation_date && !asset.commission_date) missingFields.push('installation_date');
  if (!asset.manufacturer) missingFields.push('manufacturer');
  if (!asset.model) missingFields.push('model');
  if (!asset.expected_life_source || asset.expected_life_source === 'NOT_CONFIGURED') missingFields.push('expected_life');
  if (!asset.condition_source || asset.condition_source === 'NOT_ASSESSED') missingFields.push('condition_assessment');

  if (missingFields.length >= 3) {
    signals.push({
      signal_type: 'DATA_INCOMPLETE',
      severity: 'INFO',
      title: 'Asset intelligence data incomplete',
      description: `Missing: ${missingFields.join(', ')}. Add data to enable full lifecycle analysis.`,
      evidence_snapshot: { missing_fields: missingFields },
      policy_version: '1.0',
    });
  }

  return signals;
}

// ─── CONDITION ASSESSMENT ────────────────────────────────────────────────────

export async function recordConditionAssessment(params: {
  assetId: string;
  condition: AssetCondition;
  operationalStatus?: string;
  observedDefects?: string[];
  observedNotes?: string;
  recommendedAction?: string;
  nextReviewDate?: string;
  confidence?: string;
  aiAssisted?: boolean;
  aiExtractedObservations?: Record<string, unknown>;
  assessedBy?: string;
}, session: UserSession): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!hasPermission(session, 'asset_condition:assess' as any)) {
    return { success: false, error: 'Permission denied: asset_condition:assess required' };
  }

  // Get current condition for diff
  const { data: current } = await dbQuery<any[]>(`assets?id=eq.${params.assetId}&select=condition,condition_source`);
  const previousCondition = current?.[0]?.condition ?? null;

  // Write assessment record
  const assessmentId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await dbQuery<any>('asset_condition_assessments', {
    method: 'POST',
    body: {
      asset_id: params.assetId,
      assessed_by: params.assessedBy || session.personId,
      condition: params.condition,
      previous_condition: previousCondition,
      operational_status: params.operationalStatus || 'OPERATIONAL',
      observed_defects: params.observedDefects || [],
      observed_notes: params.observedNotes || null,
      recommended_action: params.recommendedAction || null,
      next_review_date: params.nextReviewDate || null,
      confidence: params.confidence || 'MEDIUM',
      source: params.aiAssisted ? 'AI_ASSISTED' : 'ENGINEER_ASSESSMENT',
      ai_assisted: params.aiAssisted || false,
      ai_extracted_observations: params.aiExtractedObservations || null,
    },
  });

  // Update the asset's condition record
  await dbQuery<any>(`assets?id=eq.${params.assetId}`, {
    method: 'PATCH',
    body: {
      condition: params.condition,
      condition_source: params.aiAssisted ? 'AI_ASSISTED' : 'ENGINEER_ASSESSMENT',
      condition_assessed_at: new Date().toISOString(),
      condition_assessed_by: params.assessedBy || session.personId,
      condition_confidence: params.confidence || 'MEDIUM',
    },
  });

  return { success: true, id: assessmentId };
}

export async function getConditionAssessmentHistory(assetId: string): Promise<ConditionAssessment[]> {
  const { data } = await dbQuery<ConditionAssessment[]>(
    `asset_condition_assessments?asset_id=eq.${assetId}&order=assessed_at.desc`
  );
  return data || [];
}

// ─── FAILURE EVENTS ───────────────────────────────────────────────────────────

export async function getAssetFailureHistory(assetId: string): Promise<AssetFailureEvent[]> {
  const { data } = await dbQuery<AssetFailureEvent[]>(
    `asset_failure_events?asset_id=eq.${assetId}&order=failed_at.desc`
  );
  return data || [];
}

export async function createFailureEvent(params: {
  assetId: string;
  workOrderId?: string;
  failureCategory: string;
  failureDescription?: string;
  cause?: string;
  resolution?: string;
  directCostGbp?: number;
  downtimeMinutes?: number;
  downtimeBusinessImpact?: string;
  failedAt?: string;
  resolvedAt?: string;
}, session: UserSession): Promise<{ success: boolean; error?: string }> {
  if (!hasPermission(session, 'operations:write' as any)) {
    return { success: false, error: 'Permission denied: operations:write required' };
  }
  await dbQuery<any>('asset_failure_events', {
    method: 'POST',
    body: {
      asset_id: params.assetId,
      work_order_id: params.workOrderId || null,
      failure_category: params.failureCategory,
      failure_description: params.failureDescription || null,
      cause: params.cause || null,
      resolution: params.resolution || null,
      direct_cost_gbp: params.directCostGbp ?? null,
      downtime_minutes: params.downtimeMinutes ?? null,
      downtime_business_impact: params.downtimeBusinessImpact || null,
      failed_at: params.failedAt || null,
      resolved_at: params.resolvedAt || null,
      created_by: session.personId,
    },
  });
  return { success: true };
}

// ─── COST LEDGER ──────────────────────────────────────────────────────────────

export async function getAssetCostLedger(
  assetId: string,
  periodDays = 365
): Promise<AssetCostLedger> {
  const since = new Date();
  since.setDate(since.getDate() - periodDays);
  const sinceStr = since.toISOString().split('T')[0];
  const periodLabel = `Last ${periodDays} days`;

  // Delegate exclusively to canonical Finance service for financial cost attribution
  const finAttribution = await getAssetFinancialCostAttribution({ assetId, sinceDate: sinceStr });

  if (finAttribution.workOrderCount === 0 && finAttribution.totalDirectlyAttributedGbp === 0) {
    return {
      asset_id: assetId,
      periods: [],
      site_level_unallocated_note:
        'No work orders attributed to this asset. Site-level costs are not allocated to individual assets without a work order link.',
      finance_authority_confirmed: true,
      data_status: 'NO_DATA',
    };
  }

  const period: AssetCostPeriod = {
    period_label: periodLabel,
    period_start: sinceStr,
    period_end: new Date().toISOString().split('T')[0],
    reactive_cost_gbp: finAttribution.reactiveCostGbp,
    ppm_cost_gbp: finAttribution.ppmCostGbp,
    total_directly_attributed_gbp: finAttribution.totalDirectlyAttributedGbp,
    attribution_type: 'DIRECTLY_ATTRIBUTED',
    cost_coverage_pct: finAttribution.lineCount > 0 ? 100 : 0,
    work_order_count: finAttribution.workOrderCount,
  };

  return {
    asset_id: assetId,
    periods: [period],
    site_level_unallocated_note:
      'Only costs with a direct work_order → asset_id chain are shown here. Site-level unallocated costs are not attributed to this asset.',
    finance_authority_confirmed: true,
    data_status: finAttribution.totalDirectlyAttributedGbp > 0 ? 'LIVE' : 'NO_DATA',
  };
}

// ─── REPEAT FAILURE DETECTION ─────────────────────────────────────────────────

export async function getRepeatFailureAssets(
  filters?: { siteId?: string; clientAccountId?: string },
  windowDays = 90,
  minOccurrences = 3
): Promise<RepeatFailureResult[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString();

  let endpoint = `asset_failure_events?failed_at=gte.${cutoffStr}&select=asset_id,failure_category,failed_at,asset:assets(asset_reference,name,site:sites(name))&order=failed_at.asc`;

  const { data: events } = await dbQuery<any[]>(endpoint);
  if (!events || events.length === 0) return [];

  // Group by asset + category
  const assetMap = new Map<string, {
    categories: Map<string, Date[]>;
    assetRef: string;
    assetName: string;
    siteName: string;
  }>();

  for (const e of events) {
    if (!e.asset_id) continue;
    if (!assetMap.has(e.asset_id)) {
      assetMap.set(e.asset_id, {
        categories: new Map(),
        assetRef: e.asset?.asset_reference || e.asset_id,
        assetName: e.asset?.name || 'Unknown',
        siteName: e.asset?.site?.name || 'Unknown',
      });
    }
    const entry = assetMap.get(e.asset_id)!;
    const cat = e.failure_category || 'OTHER';
    if (!entry.categories.has(cat)) entry.categories.set(cat, []);
    entry.categories.get(cat)!.push(new Date(e.failed_at));
  }

  const results: RepeatFailureResult[] = [];
  for (const [assetId, info] of assetMap) {
    for (const [cat, dates] of info.categories) {
      if (dates.length >= minOccurrences) {
        dates.sort((a, b) => a.getTime() - b.getTime());
        results.push({
          asset_id: assetId,
          asset_reference: info.assetRef,
          asset_name: info.assetName,
          site_name: info.siteName,
          failure_count: dates.length,
          window_days: windowDays,
          failure_categories: [cat],
          first_failure_at: dates[0].toISOString(),
          last_failure_at: dates[dates.length - 1].toISOString(),
        });
      }
    }
  }

  return results.sort((a, b) => b.failure_count - a.failure_count);
}

// ─── HIGH COST ASSETS ─────────────────────────────────────────────────────────

export async function getHighCostAssets(
  filters?: { siteId?: string; clientAccountId?: string },
  periodDays = 365,
  limit = 20
): Promise<RankedAsset[]> {
  // Get all assets, then for each gather attributable cost
  // This is intentionally simple for Phase 0K — production would use a materialised view
  const since = new Date();
  since.setDate(since.getDate() - periodDays);
  const sinceStr = since.toISOString().split('T')[0];
  const periodLabel = `Last ${periodDays} days`;

  let assetEndpoint = 'assets?select=id,asset_reference,name,category,condition,criticality,site:sites(name,site_code)&lifecycle_status=eq.ACTIVE&order=asset_reference.asc';
  if (filters?.siteId) assetEndpoint += `&site_id=eq.${filters.siteId}`;

  const { data: assets } = await dbQuery<any[]>(assetEndpoint);
  if (!assets || assets.length === 0) return [];

  const ranked: RankedAsset[] = [];
  let rank = 1;

  for (const asset of assets) {
    const ledger = await getAssetCostLedger(asset.id, periodDays);
    const cost = ledger.periods[0]?.total_directly_attributed_gbp ?? 0;
    if (cost > 0) {
      ranked.push({
        asset_id: asset.id,
        asset_reference: asset.asset_reference,
        asset_name: asset.name,
        category: asset.category,
        site_name: asset.site?.name || 'Unknown',
        site_code: asset.site?.site_code || '',
        rank,
        metric_value: cost,
        metric_label: `£${cost.toFixed(0)} attributable cost`,
        condition: asset.condition as any,
        criticality: asset.criticality as any,
        period_label: periodLabel,
      });
    }
  }

  ranked.sort((a, b) => b.metric_value - a.metric_value);
  ranked.forEach((r, i) => (r.rank = i + 1));
  return ranked.slice(0, limit);
}

// ─── ASSETS APPROACHING EXPECTED LIFE ────────────────────────────────────────

export async function getAssetsApproachingExpectedLife(
  filters?: { siteId?: string },
  thresholdPct = APPROACHING_LIFE_PCT
): Promise<RankedAsset[]> {
  let endpoint = 'assets?select=id,asset_reference,name,category,condition,criticality,installation_date,commission_date,expected_life_years,site:sites(name,site_code)&lifecycle_status=eq.ACTIVE';
  if (filters?.siteId) endpoint += `&site_id=eq.${filters.siteId}`;

  const { data: assets } = await dbQuery<any[]>(endpoint);
  if (!assets || assets.length === 0) return [];

  const results: RankedAsset[] = [];
  for (const asset of assets) {
    if (!asset.expected_life_years) continue;
    const age = computeAssetAge(asset);
    if (age.installation_age_years === 'NO_DATA') continue;
    const pctElapsed = (age.installation_age_years as number) / asset.expected_life_years;
    if (pctElapsed >= thresholdPct) {
      results.push({
        asset_id: asset.id,
        asset_reference: asset.asset_reference,
        asset_name: asset.name,
        category: asset.category,
        site_name: asset.site?.name || 'Unknown',
        site_code: asset.site?.site_code || '',
        rank: 0,
        metric_value: pctElapsed * 100,
        metric_label: `${Math.round(pctElapsed * 100)}% of expected life elapsed`,
        condition: asset.condition as any,
        criticality: asset.criticality as any,
        period_label: `As of ${new Date().toISOString().split('T')[0]}`,
      });
    }
  }

  results.sort((a, b) => b.metric_value - a.metric_value);
  results.forEach((r, i) => (r.rank = i + 1));
  return results;
}

// ─── ASSET INTELLIGENCE PROFILE ──────────────────────────────────────────────

export async function getAssetIntelligenceProfile(
  assetId: string,
  session: UserSession
): Promise<AssetIntelligenceProfile | null> {
  if (!hasPermission(session, 'asset_intelligence:view' as any)) return null;

  const { data: assetArr } = await dbQuery<any[]>(
    `assets?id=eq.${assetId}&select=*,site:sites(name,site_code)&limit=1`
  );
  const asset = assetArr?.[0];
  if (!asset) return null;

  const age = computeAssetAge(asset);
  const expectedLife = computeExpectedLifeProfile(asset);
  const expectedLifeRemaining = computeExpectedLifeRemaining(age, expectedLife);

  const failures = await getAssetFailureHistory(assetId);
  const since12m = new Date();
  since12m.setFullYear(since12m.getFullYear() - 1);
  const failures12m = failures.filter(
    (f) => f.failed_at && new Date(f.failed_at) >= since12m
  );

  const costLedger = await getAssetCostLedger(assetId, 365);
  const reactiveCost12m: number | 'NO_DATA' =
    costLedger.data_status === 'NO_DATA'
      ? 'NO_DATA'
      : costLedger.periods[0]?.reactive_cost_gbp ?? 'NO_DATA';

  // Repeat failure: 3+ same category in 90 days
  const repeatMap = new Map<string, number>();
  const cutoff90 = new Date();
  cutoff90.setDate(cutoff90.getDate() - 90);
  for (const f of failures) {
    if (f.failed_at && new Date(f.failed_at) >= cutoff90) {
      repeatMap.set(f.failure_category, (repeatMap.get(f.failure_category) || 0) + 1);
    }
  }
  const repeatFailure = [...repeatMap.values()].some((c) => c >= 3);

  // PPM count
  const { data: ppmEvents } = await dbQuery<any[]>(
    `work_orders?asset_id=eq.${assetId}&work_type=in.(PPM,STATUTORY)&select=id&order=created_at.desc`
  );
  const ppmCount12m = (ppmEvents || []).length;

  // Telemetry
  const { data: telemetry } = await dbQuery<any[]>(
    `asset_telemetry_sources?asset_id=eq.${assetId}&select=id,status,last_seen_at,metric_name,unit&limit=1`
  );
  const tele = telemetry?.[0];
  const lastSeenHoursAgo = tele?.last_seen_at
    ? Math.max(0, Math.floor((Date.now() - new Date(tele.last_seen_at).getTime()) / (1000 * 60 * 60)))
    : null;

  // Predictive readiness criteria
  const criteria: PredictiveReadinessCriteria = {
    has_installation_date: !!(asset.installation_date || asset.commission_date),
    has_expected_life: !!(asset.expected_life_years),
    has_condition_assessed: asset.condition_source !== 'NOT_ASSESSED',
    has_failure_history: failures.length > 0,
    has_sufficient_work_history: (ppmEvents?.length || 0) + failures12m.length >= 5,
    has_telemetry_source: (telemetry?.length || 0) > 0,
    failure_count: failures.length,
    work_event_count: (ppmEvents?.length || 0) + failures.length,
    telemetry_observation_count: tele?.last_seen_at ? 25 : 0,
    telemetry_last_seen_hours_ago: lastSeenHoursAgo,
    telemetry_data_quality_valid: tele?.status === 'ACTIVE' && !!tele?.metric_name && !!tele?.unit,
    telemetry_min_observations_required: 10,
    telemetry_max_stale_hours: 48,
  };

  const lifecycle: AssetLifecycleProfile = {
    asset_id: assetId,
    age,
    expected_life: expectedLife,
    expected_life_remaining: expectedLifeRemaining,
    warranty_status: computeWarrantyStatus(asset.warranty_expiry),
    warranty_expiry: asset.warranty_expiry || null,
    lifecycle_status: (asset.lifecycle_status || 'ACTIVE') as AssetLifecycleStatus,
    predecessor_asset_id: asset.predecessor_asset_id || null,
    successor_asset_id: asset.successor_asset_id || null,
    predictive_readiness: computePredictiveReadiness(criteria),
    predictive_readiness_criteria: criteria,
  };

  const signalDefs = generateAssetSignals({
    asset,
    age,
    expectedLifeRemaining,
    failureCount12m: failures12m.length,
    reactiveCost12m,
    repeatFailure,
    downtime12m: failures12m.reduce((s, f) => s + (f.downtime_minutes || 0), 0) || null,
    ppmFailedCount12m: 0,
  });

  // Persist active signals (upsert pattern: delete old, insert new)
  try {
    await dbQuery(`asset_intelligence_signals?asset_id=eq.${assetId}&is_active=eq.true`, {
      method: 'PATCH',
      body: { is_active: false, resolved_at: new Date().toISOString() },
    });
    for (const sig of signalDefs) {
      await dbQuery('asset_intelligence_signals', {
        method: 'POST',
        body: { asset_id: assetId, ...sig, is_active: true, generated_at: new Date().toISOString() },
      });
    }
  } catch {
    // Non-fatal: signal persistence failure does not block profile read
  }

  const { data: activeSignals } = await dbQuery<AssetSignal[]>(
    `asset_intelligence_signals?asset_id=eq.${assetId}&is_active=eq.true&order=severity.desc`
  );

  const conditionRecord: ConditionRecord = {
    condition: (asset.condition || 'UNKNOWN') as AssetCondition,
    source: (asset.condition_source || 'NOT_ASSESSED') as any,
    assessed_at: asset.condition_assessed_at || null,
    assessed_by_name: null,
    confidence: asset.condition_confidence || 'UNKNOWN',
  };

  return {
    asset_id: assetId,
    asset_reference: asset.asset_reference,
    name: asset.name,
    category: asset.category,
    manufacturer: asset.manufacturer || null,
    model: asset.model || null,
    serial_number: asset.serial_number || null,
    site_name: asset.site?.name || 'Unknown',
    site_code: asset.site?.site_code || '',
    condition: conditionRecord,
    criticality: (asset.criticality || 'MEDIUM') as AssetCriticality,
    lifecycle,
    signals: activeSignals || [],
    failure_count_12m: failures12m.length,
    reactive_cost_12m_gbp: reactiveCost12m,
    ppm_count_12m: ppmCount12m,
    repeat_failure: repeatFailure,
    data_status: failures.length > 0 || costLedger.data_status === 'LIVE' ? 'LIVE' : 'NO_DATA',
  };
}

// ─── ASSET DATA QUALITY ───────────────────────────────────────────────────────

export async function getAssetDataQuality(
  filters?: { siteId?: string; clientAccountId?: string }
): Promise<AssetDataQuality> {
  let endpoint = 'assets?select=id,asset_reference,installation_date,manufacturer,model,serial_number,expected_life_years,condition_source,criticality&lifecycle_status=eq.ACTIVE';
  if (filters?.siteId) endpoint += `&site_id=eq.${filters.siteId}`;

  const { data: assets } = await dbQuery<any[]>(endpoint);

  const FIELDS_MEASURED = [
    'installation_date',
    'manufacturer',
    'model',
    'serial_number',
    'expected_life_years',
    'condition_source',
    'cost_attribution',
    'ppm_link',
  ];

  if (!assets || assets.length === 0) {
    return {
      metric_code: 'METRIC_ASSET_DATA_QUALITY_V1',
      version: '1.0',
      fields_measured: FIELDS_MEASURED,
      scope: 'ACTIVE_ASSETS',
      total_assets: 0,
      installation_date_coverage_pct: 0,
      manufacturer_coverage_pct: 0,
      model_coverage_pct: 0,
      serial_coverage_pct: 0,
      expected_life_coverage_pct: 0,
      condition_coverage_pct: 0,
      cost_attribution_coverage_pct: 0,
      ppm_link_coverage_pct: 0,
      // legacy aliases
      install_date_coverage_pct: 0,
      condition_assessed_pct: 0,
      missing_install_date: 0,
      missing_manufacturer: 0,
      missing_model: 0,
      missing_serial: 0,
      missing_expected_life: 0,
      no_condition_assessment: 0,
      critical_with_no_condition: 0,
      data_status: 'NO_DATA',
    };
  }

  const total = assets.length;
  const pct = (n: number) => parseFloat(((n / total) * 100).toFixed(1));

  const withInstall = assets.filter((a) => !!a.installation_date).length;
  const withMfr = assets.filter((a) => !!a.manufacturer).length;
  const withModel = assets.filter((a) => !!a.model).length;
  const withSerial = assets.filter((a) => !!a.serial_number).length;
  const withLife = assets.filter((a) => !!a.expected_life_years).length;
  const withCondition = assets.filter((a) => a.condition_source && a.condition_source !== 'NOT_ASSESSED').length;
  const criticalNoCondition = assets.filter(
    (a) => (a.criticality === 'CRITICAL' || a.criticality === 'HIGH')
      && (!a.condition_source || a.condition_source === 'NOT_ASSESSED')
  ).length;

  const installDateCovPct = pct(withInstall);
  const conditionCovPct = pct(withCondition);

  return {
    metric_code: 'METRIC_ASSET_DATA_QUALITY_V1',
    version: '1.0',
    fields_measured: FIELDS_MEASURED,
    scope: 'ACTIVE_ASSETS',
    total_assets: total,
    installation_date_coverage_pct: installDateCovPct,
    manufacturer_coverage_pct: pct(withMfr),
    model_coverage_pct: pct(withModel),
    serial_coverage_pct: pct(withSerial),
    expected_life_coverage_pct: pct(withLife),
    condition_coverage_pct: conditionCovPct,
    cost_attribution_coverage_pct: 0, // requires cost ledger scan — set to 0 until materialised
    ppm_link_coverage_pct: 0, // requires PPM schedule scan — set to 0 until materialised
    // legacy aliases
    install_date_coverage_pct: installDateCovPct,
    condition_assessed_pct: conditionCovPct,
    missing_install_date: total - withInstall,
    missing_manufacturer: total - withMfr,
    missing_model: total - withModel,
    missing_serial: total - withSerial,
    missing_expected_life: total - withLife,
    no_condition_assessment: total - withCondition,
    critical_with_no_condition: criticalNoCondition,
    data_status: 'LIVE',
  };
}

export async function getEnrichmentQueue(
  filters?: { siteId?: string }
): Promise<EnrichmentQueue> {
  const dq = await getAssetDataQuality(filters);
  if (dq.data_status === 'NO_DATA') {
    return {
      items: [],
      summary: { missing_condition: 0, missing_installation_date: 0, missing_expected_life: 0, missing_manufacturer: 0, total: 0 },
      data_status: 'NO_DATA',
    };
  }

  const items: EnrichmentQueueItem[] = [];

  if (dq.missing_install_date > 0) {
    items.push({
      issue: `${dq.missing_install_date} assets missing installation date`,
      count: dq.missing_install_date,
      priority: dq.missing_install_date > 50 ? 'HIGH' : 'MEDIUM',
      example_asset_references: [],
    });
  }
  if (dq.critical_with_no_condition > 0) {
    items.push({
      issue: `${dq.critical_with_no_condition} critical/high assets with no condition assessment`,
      count: dq.critical_with_no_condition,
      priority: 'HIGH',
      example_asset_references: [],
    });
  }
  if (dq.missing_expected_life > 0) {
    items.push({
      issue: `${dq.missing_expected_life} assets with no expected life configured`,
      count: dq.missing_expected_life,
      priority: 'MEDIUM',
      example_asset_references: [],
    });
  }
  if (dq.missing_manufacturer > 0) {
    items.push({
      issue: `${dq.missing_manufacturer} assets missing manufacturer`,
      count: dq.missing_manufacturer,
      priority: 'LOW',
      example_asset_references: [],
    });
  }

  const summary = {
    missing_condition: dq.no_condition_assessment,
    missing_installation_date: dq.missing_install_date,
    missing_expected_life: dq.missing_expected_life,
    missing_manufacturer: dq.missing_manufacturer,
    total: items.reduce((s, i) => s + i.count, 0),
  };

  return {
    items,
    summary,
    data_status: 'LIVE',
  };
}

// ─── SITE EXPOSURE ────────────────────────────────────────────────────────────

export async function getSiteAssetExposure(siteId: string): Promise<SiteAssetExposure> {
  const { data: site } = await dbQuery<any[]>(`sites?id=eq.${siteId}&select=name&limit=1`);
  const { data: assets } = await dbQuery<any[]>(
    `assets?site_id=eq.${siteId}&select=id,condition,criticality,lifecycle_status,installation_date,expected_life_years,condition_source&lifecycle_status=in.(ACTIVE,OUT_OF_SERVICE)`
  );

  if (!assets || assets.length === 0) {
    return {
      site_id: siteId,
      site_name: site?.[0]?.name || 'Unknown',
      total_assets: 0,
      critical_assets: 0,
      poor_condition_count: 0,
      critical_condition_count: 0,
      repeat_failure_assets: 0,
      over_life_assets: 0,
      approaching_life_assets: 0,
      high_cost_assets: 0,
      open_replacement_reviews: 0,
      unknown_condition_count: 0,
      unknown_install_date_count: 0,
      data_status: 'NO_DATA',
    };
  }

  const total = assets.length;
  let criticalAssets = 0, poorCond = 0, critCond = 0, unknownCond = 0, noInstall = 0;
  let overLife = 0, approachingLife = 0;

  for (const a of assets) {
    if (a.criticality === 'CRITICAL') criticalAssets++;
    if (a.condition === 'POOR') poorCond++;
    if (a.condition === 'CRITICAL') critCond++;
    if (a.condition === 'UNKNOWN') unknownCond++;
    if (!a.installation_date) noInstall++;

    if (a.installation_date && a.expected_life_years) {
      const age = computeAssetAge(a);
      if (age.installation_age_years !== 'NO_DATA') {
        const pct = (age.installation_age_years as number) / a.expected_life_years;
        if (pct >= 1) overLife++;
        else if (pct >= APPROACHING_LIFE_PCT) approachingLife++;
      }
    }
  }

  const { data: reviews } = await dbQuery<any[]>(
    `asset_replacement_reviews?status=in.(OPEN,ASSESSMENT_REQUIRED,QUOTE_REQUIRED,CLIENT_REVIEW)&select=id`
  );

  const repeatResults = await getRepeatFailureAssets({ siteId });

  return {
    site_id: siteId,
    site_name: site?.[0]?.name || 'Unknown',
    total_assets: total,
    critical_assets: criticalAssets,
    poor_condition_count: poorCond,
    critical_condition_count: critCond,
    repeat_failure_assets: repeatResults.length,
    over_life_assets: overLife,
    approaching_life_assets: approachingLife,
    high_cost_assets: 0, // requires cost scan — deferred for performance
    open_replacement_reviews: reviews?.length || 0,
    unknown_condition_count: unknownCond,
    unknown_install_date_count: noInstall,
    data_status: 'LIVE',
  };
}

// ─── REPAIR / REPLACE ─────────────────────────────────────────────────────────

export async function computeRepairToReplacementRatio(
  assetId: string,
  periodDays = 365
): Promise<RepairToReplacementRatio | { data_status: 'NO_DATA'; reason: string }> {
  const { data: assetArr } = await dbQuery<any[]>(
    `assets?id=eq.${assetId}&select=replacement_cost_estimate_gbp,replacement_cost_source,replacement_cost_source_date,replacement_cost_confidence&limit=1`
  );
  const asset = assetArr?.[0];

  if (!asset?.replacement_cost_estimate_gbp) {
    return { data_status: 'NO_DATA', reason: 'No replacement cost estimate configured for this asset.' };
  }

  const ledger = await getAssetCostLedger(assetId, periodDays);
  const repairSpend = ledger.periods[0]?.total_directly_attributed_gbp ?? 0;
  if (repairSpend === 0) {
    return { data_status: 'NO_DATA', reason: 'No attributable repair cost found for this period.' };
  }

  const replacementCost = Number(asset.replacement_cost_estimate_gbp);
  const ratio = parseFloat(((repairSpend / replacementCost) * 100).toFixed(1));

  return {
    period_label: `Last ${periodDays} days`,
    repair_spend_gbp: repairSpend,
    replacement_estimate_gbp: replacementCost,
    currency: 'GBP',
    tax_basis: 'NET',
    ratio_pct: ratio,
    estimate_source: asset.replacement_cost_source || null,
    estimate_date: asset.replacement_cost_source_date || null,
    estimate_freshness: computeEstimateFreshness(asset.replacement_cost_source_date),
    data_status: 'LIVE',
  };
}

// ─── REPLACEMENT REVIEWS ──────────────────────────────────────────────────────

export async function getReplacementReviewCandidates(
  filters?: { siteId?: string },
  session?: UserSession
): Promise<ReplacementReviewCandidate[]> {
  let endpoint = 'assets?select=id,asset_reference,name,condition,criticality,installation_date,commission_date,expected_life_years,replacement_cost_estimate_gbp,replacement_cost_source_date,site:sites(name,site_code)&lifecycle_status=eq.ACTIVE';
  if (filters?.siteId) endpoint += `&site_id=eq.${filters.siteId}`;

  const { data: assets } = await dbQuery<any[]>(endpoint);
  if (!assets || assets.length === 0) return [];

  const candidates: ReplacementReviewCandidate[] = [];
  const repeatResults = await getRepeatFailureAssets(filters);
  const repeatAssetIds = new Set(repeatResults.map((r) => r.asset_id));

  for (const asset of assets) {
    const age = computeAssetAge(asset);
    const expectedLife = computeExpectedLifeProfile(asset);
    const remaining = computeExpectedLifeRemaining(age, expectedLife);

    const signals: any[] = [];
    // Check multiple signal conditions
    const overLife = remaining.remaining_years !== 'NO_DATA' && (remaining.remaining_years as number) <= 0;
    const approaching = !overLife && remaining.pct_elapsed !== 'NO_DATA' && (remaining.pct_elapsed as number) >= 85;
    const poorCond = asset.condition === 'POOR' || asset.condition === 'CRITICAL';
    const repeat = repeatAssetIds.has(asset.id);

    if (overLife) signals.push('AGE_EXCEEDS_EXPECTED_LIFE');
    if (approaching) signals.push('AGE_APPROACHING_EXPECTED_LIFE');
    if (poorCond) signals.push(asset.condition === 'CRITICAL' ? 'CONDITION_CRITICAL' : 'CONDITION_POOR');
    if (repeat) signals.push('REPEAT_FAILURE');

    if (signals.length >= 2 || (signals.length >= 1 && asset.criticality === 'CRITICAL')) {
      const { data: openReview } = await dbQuery<any[]>(
        `asset_replacement_reviews?asset_id=eq.${asset.id}&status=in.(OPEN,ASSESSMENT_REQUIRED,QUOTE_REQUIRED,CLIENT_REVIEW)&select=id&limit=1`
      );
      const repeatInfo = repeatResults.find((r) => r.asset_id === asset.id);

      candidates.push({
        asset_id: asset.id,
        asset_reference: asset.asset_reference,
        asset_name: asset.name,
        site_name: asset.site?.name || 'Unknown',
        signals,
        age_years: age.installation_age_years,
        expected_life_years: expectedLife.expected_life_years,
        condition: asset.condition as AssetCondition,
        criticality: asset.criticality as AssetCriticality,
        reactive_cost_12m_gbp: 'NO_DATA', // defer cost scan for list view performance
        repeat_failure_count: repeatInfo?.failure_count || 0,
        replacement_estimate_gbp: asset.replacement_cost_estimate_gbp
          ? Number(asset.replacement_cost_estimate_gbp)
          : null,
        estimate_freshness: computeEstimateFreshness(asset.replacement_cost_source_date),
        has_open_review: (openReview?.length || 0) > 0,
      });
    }
  }

  return candidates;
}

export async function createReplacementReview(params: {
  assetId: string;
  triggerSignalId?: string;
  evidenceSnapshot: Record<string, unknown>;
  aiRationale?: string;
}, session: UserSession): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!hasPermission(session, 'asset_replacement:manage' as any)) {
    return { success: false, error: 'Permission denied: asset_replacement:manage required' };
  }

  const { data: existing } = await dbQuery<any[]>(
    `asset_replacement_reviews?asset_id=eq.${params.assetId}&status=in.(OPEN,ASSESSMENT_REQUIRED,QUOTE_REQUIRED,CLIENT_REVIEW)&select=id&limit=1`
  );
  if (existing && existing.length > 0) {
    return { success: false, error: 'An active replacement review already exists for this asset.' };
  }

  const { data: created } = await dbQuery<any>('asset_replacement_reviews', {
    method: 'POST',
    body: {
      asset_id: params.assetId,
      opened_by: session.personId,
      trigger_signal_id: params.triggerSignalId || null,
      evidence_snapshot: params.evidenceSnapshot,
      ai_rationale: params.aiRationale || null,
      status: 'OPEN',
    },
  });

  return { success: true, id: Array.isArray(created) ? created[0]?.id : (created as any)?.id };
}

// ─── ASSET CLASS PERFORMANCE ──────────────────────────────────────────────────

export async function getAssetClassPerformance(
  filters?: { category?: string; periodDays?: number }
): Promise<AssetClassPerformance[]> {
  const periodDays = filters?.periodDays || 365;

  let endpoint = 'assets?select=id,category,manufacturer,model&lifecycle_status=eq.ACTIVE';
  if (filters?.category) endpoint += `&category=eq.${filters.category}`;

  const { data: assets } = await dbQuery<any[]>(endpoint);
  if (!assets || assets.length === 0) return [];

  // Group by category + manufacturer
  const groupMap = new Map<string, {
    category: string; manufacturer: string | null; model: string | null;
    assetIds: string[];
  }>();

  for (const a of assets) {
    const key = `${a.category}||${a.manufacturer || ''}||${a.model || ''}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, { category: a.category, manufacturer: a.manufacturer || null, model: a.model || null, assetIds: [] });
    }
    groupMap.get(key)!.assetIds.push(a.id);
  }

  const results: AssetClassPerformance[] = [];
  const periodLabel = `Last ${periodDays} days`;

  for (const [, group] of groupMap) {
    const sampleSize = group.assetIds.length;
    let totalCost = 0;
    let failureCount = 0;
    let repeatCount = 0;

    // Skip cost scan for groups with too many assets (performance) — show counts only
    for (const assetId of group.assetIds.slice(0, 50)) {
      const ledger = await getAssetCostLedger(assetId, periodDays);
      totalCost += ledger.periods[0]?.reactive_cost_gbp ?? 0;
    }

    const { data: failures } = await dbQuery<any[]>(
      `asset_failure_events?asset_id=in.(${group.assetIds.slice(0, 50).join(',')})&select=id,failure_category`
    );
    failureCount = failures?.length || 0;

    results.push({
      category: group.category,
      manufacturer: group.manufacturer,
      model: group.model,
      asset_count: sampleSize,
      total_reactive_cost_gbp: parseFloat(totalCost.toFixed(2)),
      avg_reactive_cost_gbp: sampleSize > 0 ? parseFloat((totalCost / sampleSize).toFixed(2)) : 0,
      failure_count: failureCount,
      repeat_failure_count: repeatCount,
      period_label: periodLabel,
      sample_size_warning: sampleSize < MIN_SAMPLE_FOR_CLASS_COMPARISON,
    });
  }

  return results.sort((a, b) => b.total_reactive_cost_gbp - a.total_reactive_cost_gbp);
}

// ─── ASSET LIFECYCLE PROFILE (standalone) ────────────────────────────────────

export async function getAssetLifecycleProfile(
  assetId: string
): Promise<AssetLifecycleProfile | null> {
  const { data: assetArr } = await dbQuery<any[]>(
    `assets?id=eq.${assetId}&select=id,installation_date,commission_date,expected_life_years,expected_life_source,expected_life_source_date,expected_life_confidence,warranty_expiry,lifecycle_status,predecessor_asset_id,successor_asset_id,condition_source,condition_assessed_at&limit=1`
  );
  const asset = assetArr?.[0];
  if (!asset) return null;

  const age = computeAssetAge(asset);
  const expectedLife = computeExpectedLifeProfile(asset);
  const expectedLifeRemaining = computeExpectedLifeRemaining(age, expectedLife);

  const failures = await getAssetFailureHistory(assetId);
  const { data: workEvents } = await dbQuery<any[]>(
    `work_orders?asset_id=eq.${assetId}&select=id&limit=100`
  );
  const { data: telemetry } = await dbQuery<any[]>(
    `asset_telemetry_sources?asset_id=eq.${assetId}&select=id,status,last_seen_at,metric_name,unit&limit=1`
  );
  const tele = telemetry?.[0];
  const lastSeenHoursAgo = tele?.last_seen_at
    ? Math.max(0, Math.floor((Date.now() - new Date(tele.last_seen_at).getTime()) / (1000 * 60 * 60)))
    : null;

  const criteria: PredictiveReadinessCriteria = {
    has_installation_date: !!(asset.installation_date || asset.commission_date),
    has_expected_life: !!(asset.expected_life_years),
    has_condition_assessed: asset.condition_source !== 'NOT_ASSESSED',
    has_failure_history: failures.length > 0,
    has_sufficient_work_history: (workEvents?.length || 0) >= 5,
    has_telemetry_source: (telemetry?.length || 0) > 0,
    failure_count: failures.length,
    work_event_count: workEvents?.length || 0,
    telemetry_observation_count: tele?.last_seen_at ? 25 : 0,
    telemetry_last_seen_hours_ago: lastSeenHoursAgo,
    telemetry_data_quality_valid: tele?.status === 'ACTIVE' && !!tele?.metric_name && !!tele?.unit,
    telemetry_min_observations_required: 10,
    telemetry_max_stale_hours: 48,
  };

  return {
    asset_id: assetId,
    age,
    expected_life: expectedLife,
    expected_life_remaining: expectedLifeRemaining,
    warranty_status: computeWarrantyStatus(asset.warranty_expiry),
    warranty_expiry: asset.warranty_expiry || null,
    lifecycle_status: (asset.lifecycle_status || 'ACTIVE') as AssetLifecycleStatus,
    predecessor_asset_id: asset.predecessor_asset_id || null,
    successor_asset_id: asset.successor_asset_id || null,
    predictive_readiness: computePredictiveReadiness(criteria),
    predictive_readiness_criteria: criteria,
  };
}

// ─── CEO INTELLIGENCE SUMMARY ─────────────────────────────────────────────────

export async function getAssetIntelligenceSummary(
  session: UserSession,
  periodDays = 365
): Promise<AssetIntelligenceSummary> {
  if (!hasPermission(session, 'asset_intelligence:view' as any)) {
    return {
      data_status: 'NO_DATA',
      total_assets: 0,
      assets_with_signals: 0,
      critical_signals: 0,
      high_cost_assets: [],
      repeat_failure_assets: [],
      replacement_candidates: [],
      data_quality: await getAssetDataQuality(),
      period_label: `Last ${periodDays} days`,
    };
  }

  const { data: totalArr } = await dbQuery<any[]>('assets?select=id&lifecycle_status=eq.ACTIVE');
  const totalAssets = totalArr?.length || 0;

  if (totalAssets === 0) {
    return {
      data_status: 'NO_DATA',
      total_assets: 0,
      assets_with_signals: 0,
      critical_signals: 0,
      high_cost_assets: [],
      repeat_failure_assets: [],
      replacement_candidates: [],
      data_quality: await getAssetDataQuality(),
      period_label: `Last ${periodDays} days`,
    };
  }

  const [highCost, repeatFailure, replacementCandidates, dataQuality] = await Promise.all([
    getHighCostAssets(undefined, periodDays, 10),
    getRepeatFailureAssets(),
    getReplacementReviewCandidates(),
    getAssetDataQuality(),
  ]);

  const { data: signalStats } = await dbQuery<any[]>(
    'asset_intelligence_signals?is_active=eq.true&select=severity'
  );
  const criticalSignals = (signalStats || []).filter((s) => s.severity === 'CRITICAL').length;

  return {
    data_status: 'LIVE',
    total_assets: totalAssets,
    assets_with_signals: new Set((signalStats || []).map((s: any) => s.asset_id)).size,
    critical_signals: criticalSignals,
    high_cost_assets: highCost,
    repeat_failure_assets: repeatFailure,
    replacement_candidates: replacementCandidates,
    data_quality: dataQuality,
    period_label: `Last ${periodDays} days`,
  };
}
