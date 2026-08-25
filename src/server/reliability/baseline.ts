/**
 * ENTIREFM RELIABILITY — BASELINE ENGINE (Phase 0L)
 * ==================================================
 * Computes statistical baselines from real historical observations.
 */

import { dbQuery } from '../db/client';
import type { BaselineResult, BaselineDeviationResult } from './types';

const MIN_SAMPLES = 168; // 7 × 24
const ANOMALY_THRESHOLD_STDDEV = 2.5;

export async function computeBaseline(
  assetId: string,
  metricCode: string,
  trainingWindowDays: number = 30
): Promise<BaselineResult> {
  const from = new Date(
    Date.now() - trainingWindowDays * 86400 * 1000
  ).toISOString();

  const { data: observations } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&observed_at=gte.${from}&quality=in.(VALID,SUSPECT)&select=normalised_value,quality&order=observed_at.asc&limit=50000`
  );

  const allObs = observations ?? [];
  const validObs = allObs.filter(o => o.normalised_value !== null);
  const sampleCount = validObs.length;

  if (sampleCount < MIN_SAMPLES) {
    await dbQuery('asset_telemetry_baselines', {
      method: 'POST',
      body: {
        asset_id: assetId,
        metric_code: metricCode,
        baseline_type: 'ROLLING_MEAN',
        sample_count: sampleCount,
        training_window_days: trainingWindowDays,
        status: 'INSUFFICIENT_DATA',
        min_samples_required: MIN_SAMPLES,
        method: 'STATISTICAL',
        version: 1,
      },
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    });

    return {
      status: 'INSUFFICIENT_DATA',
      asset_id: assetId,
      metric_code: metricCode,
      sample_count: sampleCount,
      training_window_days: trainingWindowDays,
      insufficient_data_reason: `Only ${sampleCount} valid samples — minimum ${MIN_SAMPLES} required for baseline computation (${trainingWindowDays}-day window)`,
    };
  }

  const values = validObs.map(o => parseFloat(o.normalised_value));
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  const stddev = Math.sqrt(variance);
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const qualityCoverage = sampleCount / Math.max(allObs.length, 1);

  const baselineRow = {
    asset_id: assetId,
    metric_code: metricCode,
    baseline_type: 'ROLLING_MEAN',
    baseline_mean: parseFloat(mean.toFixed(4)),
    baseline_stddev: parseFloat(stddev.toFixed(4)),
    baseline_min: sorted[0],
    baseline_max: sorted[sorted.length - 1],
    baseline_p5: parseFloat(p5.toFixed(4)),
    baseline_p95: parseFloat(p95.toFixed(4)),
    sample_count: sampleCount,
    training_window_days: trainingWindowDays,
    training_from: from,
    training_to: new Date().toISOString(),
    data_quality_coverage: parseFloat(qualityCoverage.toFixed(4)),
    method: 'STATISTICAL',
    version: 1,
    status: 'ACTIVE',
    min_samples_required: MIN_SAMPLES,
    computed_at: new Date().toISOString(),
  };

  await dbQuery('asset_telemetry_baselines', {
    method: 'POST',
    body: baselineRow,
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });

  return {
    status: 'ACTIVE',
    asset_id: assetId,
    metric_code: metricCode,
    baseline_mean: baselineRow.baseline_mean,
    baseline_stddev: baselineRow.baseline_stddev,
    baseline_min: baselineRow.baseline_min,
    baseline_max: baselineRow.baseline_max,
    baseline_p5: baselineRow.baseline_p5,
    baseline_p95: baselineRow.baseline_p95,
    sample_count: sampleCount,
    training_window_days: trainingWindowDays,
    data_quality_coverage: baselineRow.data_quality_coverage,
    version: 1,
    computed_at: baselineRow.computed_at,
  };
}

export async function getBaseline(
  assetId: string,
  metricCode: string
): Promise<BaselineResult> {
  const { data } = await dbQuery<any[]>(
    `asset_telemetry_baselines?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&baseline_type=eq.ROLLING_MEAN&order=version.desc&limit=1`
  );
  const b = data?.[0];
  if (!b) {
    return {
      status: 'NOT_FOUND',
      asset_id: assetId,
      metric_code: metricCode,
      insufficient_data_reason: 'No baseline has been computed for this asset/metric combination',
    };
  }
  return {
    status: b.status,
    asset_id: assetId,
    metric_code: metricCode,
    baseline_mean: b.baseline_mean ?? undefined,
    baseline_stddev: b.baseline_stddev ?? undefined,
    baseline_min: b.baseline_min ?? undefined,
    baseline_max: b.baseline_max ?? undefined,
    baseline_p5: b.baseline_p5 ?? undefined,
    baseline_p95: b.baseline_p95 ?? undefined,
    sample_count: b.sample_count,
    training_window_days: b.training_window_days,
    data_quality_coverage: b.data_quality_coverage ?? undefined,
    version: b.version,
    computed_at: b.computed_at ?? undefined,
    insufficient_data_reason:
      b.status === 'INSUFFICIENT_DATA'
        ? `Only ${b.sample_count} valid samples — minimum ${b.min_samples_required} required`
        : undefined,
  };
}

export function evaluateBaselineDeviation(
  observedValue: number,
  baseline: BaselineResult
): BaselineDeviationResult | null {
  if (
    baseline.status !== 'ACTIVE' ||
    baseline.baseline_mean === undefined ||
    baseline.baseline_stddev === undefined
  ) {
    return null;
  }

  const deviationAbs = observedValue - baseline.baseline_mean;
  const deviationStddev =
    baseline.baseline_stddev > 0
      ? Math.abs(deviationAbs) / baseline.baseline_stddev
      : 0;
  const deviationPct =
    baseline.baseline_mean !== 0
      ? Math.abs((deviationAbs / baseline.baseline_mean) * 100)
      : 0;

  const isAnomalous = deviationStddev >= ANOMALY_THRESHOLD_STDDEV;

  return {
    deviation_absolute: parseFloat(deviationAbs.toFixed(3)),
    deviation_stddev: parseFloat(deviationStddev.toFixed(2)),
    deviation_pct: parseFloat(deviationPct.toFixed(1)),
    direction: deviationAbs >= 0 ? 'ABOVE' : 'BELOW',
    is_anomalous: isAnomalous,
    threshold_stddev: ANOMALY_THRESHOLD_STDDEV,
    description: `${Math.abs(deviationAbs).toFixed(2)} ${deviationAbs >= 0 ? 'above' : 'below'} ${baseline.training_window_days}-day operating baseline`,
  };
}
