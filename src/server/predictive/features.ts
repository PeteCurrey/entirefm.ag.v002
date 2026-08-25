/**
 * ENTIREFM PREDICTIVE — FEATURE REGISTRY & COMPUTATION (Phase 0L)
 * ================================================================
 * Versioned feature definitions. AI may NOT invent production features.
 * Production features require explicit deterministic definitions here.
 */

import { dbQuery } from '../db/client';
import type { FeatureDefinition, FeatureSnapshot } from './types';

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  { code: 'mean_temperature_24h',    version: 1, formula: 'MEAN(TEMPERATURE normalised_value, last 24h, quality VALID/SUSPECT)', unit: '°C',      window_days: 1,  source: 'TELEMETRY',       description: 'Mean temperature over last 24 hours',                   is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'temperature_delta_7d',    version: 1, formula: 'MEAN_last_24h minus MEAN_7d_ago_24h for TEMPERATURE',                  unit: '°C',      window_days: 7,  source: 'TELEMETRY',       description: 'Temperature change versus 7 days ago',                 is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'vibration_rms_mean_24h',  version: 1, formula: 'MEAN(VIBRATION_RMS, last 24h, quality VALID)',                          unit: 'mm/s',    window_days: 1,  source: 'TELEMETRY',       description: 'Mean vibration RMS over last 24 hours',                is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'vibration_rms_slope_7d',  version: 1, formula: 'LINEAR_SLOPE(DAILY_MEAN(VIBRATION_RMS)) OVER 7d',                       unit: 'mm/s/day',window_days: 7,  source: 'TELEMETRY',       description: 'Linear trend of vibration RMS over 7 days',            is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'starts_24h',             version: 1, formula: 'COUNT(START_COUNT transitions 0→1, last 24h)',                          unit: 'count',   window_days: 1,  source: 'TELEMETRY',       description: 'Number of start cycles in last 24 hours',             is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'runtime_hours_7d',       version: 1, formula: 'SUM(COMPRESSOR_RUN_STATE=1 seconds / 3600, last 7d)',                   unit: 'h',       window_days: 7,  source: 'TELEMETRY',       description: 'Cumulative runtime hours over 7 days',                is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'energy_per_runtime_hour',version: 1, formula: 'SUM(ENERGY_kWh_24h) / (runtime_hours_7d / 7)',                          unit: 'kWh/h',   window_days: 7,  source: 'TELEMETRY',       description: 'Energy consumption per hour of runtime',             is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'failure_count_90d',      version: 1, formula: 'COUNT(asset_failure_events WHERE asset_id=X AND failed_at>=NOW()-90d)', unit: 'count',   window_days: 90, source: 'FAILURE_EVENTS',  description: 'Number of failure events in last 90 days',            is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'condition_state',        version: 1, formula: 'assets.condition WHERE asset_id=X',                                     unit: 'enum',    window_days: null, source: 'ASSET_REGISTER', description: 'Current condition assessment',                       is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'asset_age',              version: 1, formula: 'YEARS_BETWEEN(commission_date OR installation_date, window_end)',        unit: 'years',   window_days: null, source: 'ASSET_REGISTER', description: 'Asset age in years at computation time',             is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { code: 'days_since_last_ppm',    version: 1, formula: 'DAYS_BETWEEN(MAX(maintenance_visits.completed_at), window_end)',        unit: 'days',    window_days: null, source: 'PPM',            description: 'Days since last completed PPM visit at window_end',  is_active: true, created_at: '2026-01-01T00:00:00Z' },
];

export function getFeatureByCode(
  code: string,
  version: number = 1
): FeatureDefinition | undefined {
  return FEATURE_REGISTRY.find(f => f.code === code && f.version === version && f.is_active);
}

export function getActiveFeatures(): FeatureDefinition[] {
  return FEATURE_REGISTRY.filter(f => f.is_active);
}

async function computeSingleFeature(
  assetId: string,
  code: string,
  windowEnd: Date
): Promise<number | string | null> {
  const windowEndIso = windowEnd.toISOString();

  switch (code) {
    case 'mean_temperature_24h': {
      const from = new Date(windowEnd.getTime() - 86400000).toISOString();
      const { data } = await dbQuery<any[]>(
        `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.TEMPERATURE&observed_at=gte.${from}&observed_at=lte.${windowEndIso}&quality=in.(VALID,SUSPECT)&select=normalised_value`
      );
      const vals = (data ?? []).map((o: any) => parseFloat(o.normalised_value)).filter((v: number) => !isNaN(v));
      return vals.length > 0 ? parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3)) : null;
    }

    case 'vibration_rms_mean_24h': {
      const from = new Date(windowEnd.getTime() - 86400000).toISOString();
      const { data } = await dbQuery<any[]>(
        `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.VIBRATION_RMS&observed_at=gte.${from}&observed_at=lte.${windowEndIso}&quality=eq.VALID&select=normalised_value`
      );
      const vals = (data ?? []).map((o: any) => parseFloat(o.normalised_value)).filter((v: number) => !isNaN(v));
      return vals.length > 0 ? parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3)) : null;
    }

    case 'starts_24h': {
      const from = new Date(windowEnd.getTime() - 86400000).toISOString();
      const { data } = await dbQuery<any[]>(
        `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.START_COUNT&observed_at=gte.${from}&observed_at=lte.${windowEndIso}&quality=in.(VALID,SUSPECT)&order=observed_at.asc&select=normalised_value`
      );
      if (!data || data.length < 2) return null;
      const first = parseFloat(data[0].normalised_value);
      const last = parseFloat(data[data.length - 1].normalised_value);
      return isNaN(first) || isNaN(last) ? null : Math.max(0, last - first);
    }

    case 'failure_count_90d': {
      const from = new Date(windowEnd.getTime() - 90 * 86400000).toISOString();
      const { data } = await dbQuery<any[]>(
        `asset_failure_events?asset_id=eq.${assetId}&failed_at=gte.${from}&failed_at=lte.${windowEndIso}&select=id`
      );
      return (data ?? []).length;
    }

    case 'condition_state': {
      const { data } = await dbQuery<any[]>(
        `asset_condition_assessments?asset_id=eq.${assetId}&assessed_at=lte.${windowEndIso}&order=assessed_at.desc&limit=1&select=condition`
      );
      return data?.[0]?.condition ?? null;
    }

    case 'asset_age': {
      const { data } = await dbQuery<any[]>(
        `assets?id=eq.${assetId}&select=commission_date,installation_date`
      );
      const dateStr = data?.[0]?.commission_date ?? data?.[0]?.installation_date;
      if (!dateStr) return null;
      const ageMs = windowEnd.getTime() - new Date(dateStr).getTime();
      return parseFloat((ageMs / (365.25 * 86400000)).toFixed(2));
    }

    case 'days_since_last_ppm': {
      const { data } = await dbQuery<any[]>(
        `maintenance_visits?asset_id=eq.${assetId}&status=eq.COMPLETED&completed_at=lte.${windowEndIso}&order=completed_at.desc&limit=1&select=completed_at`
      );
      const lastPpm = data?.[0]?.completed_at;
      if (!lastPpm) return null;
      return Math.floor((windowEnd.getTime() - new Date(lastPpm).getTime()) / 86400000);
    }

    default:
      return null;
  }
}

export async function computeFeatureSnapshot(
  assetId: string,
  featureCodes: string[],
  windowEnd: Date,
  featureVersion: number = 1
): Promise<FeatureSnapshot> {
  const windowEndIso = windowEnd.toISOString();
  const features: Record<string, number | string | null> = {};
  const missingFeatures: string[] = [];

  for (const code of featureCodes) {
    const def = getFeatureByCode(code, featureVersion);
    if (!def) {
      missingFeatures.push(code);
      features[code] = null;
      continue;
    }

    try {
      const value = await computeSingleFeature(assetId, code, windowEnd);
      features[code] = value;
      if (value === null) missingFeatures.push(code);
    } catch {
      features[code] = null;
      missingFeatures.push(code);
    }
  }

  const totalFeatures = featureCodes.length;
  const missingCount = missingFeatures.length;
  const dataQuality: 'VALID' | 'PARTIAL' | 'INSUFFICIENT' =
    missingCount === 0 ? 'VALID'
    : missingCount < totalFeatures / 2 ? 'PARTIAL'
    : 'INSUFFICIENT';

  return {
    asset_id: assetId,
    computed_at: new Date().toISOString(),
    window_end: windowEndIso,
    features,
    feature_version: featureVersion,
    data_quality: dataQuality,
    missing_features: missingFeatures,
  };
}
