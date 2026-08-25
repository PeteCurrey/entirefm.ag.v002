/**
 * ENTIREFM RELIABILITY — DETERMINISTIC ANOMALY DETECTION (Phase 0L)
 * ==================================================================
 * All anomaly types are deterministic — no mystery scores.
 * Every anomaly is accompanied by structured evidence.
 */

import { dbQuery } from '../db/client';
import { getBaseline, evaluateBaselineDeviation } from './baseline';
import type { AnomalyEvidence, AnomalyRecord, AnomalyType, AnomalySeverity, AnomalyScope } from './types';

const PERSISTENT_DEVIATION_THRESHOLD_MINUTES = 60;
const EXCESS_RUNTIME_HOURS_DAILY = 20;
const SHORT_CYCLING_STARTS_PER_HOUR = 6;
const FLATLINE_SAMPLES = 10;

async function writeAnomalyRecord(
  assetId: string,
  sensorId: string | null,
  metricCode: string | null,
  anomalyType: AnomalyType,
  scope: AnomalyScope,
  severity: AnomalySeverity,
  evidence: AnomalyEvidence,
  startedAt: string,
  sampleCount: number
): Promise<string | null> {
  const { data } = await dbQuery<any[]>('asset_telemetry_anomalies', {
    method: 'POST',
    body: {
      asset_id: assetId,
      sensor_id: sensorId,
      metric_code: metricCode,
      anomaly_type: anomalyType,
      anomaly_scope: scope,
      severity,
      evidence_json: evidence,
      started_at: startedAt,
      sample_count: sampleCount,
      quality: evidence.quality,
      is_active: true,
    },
  });
  return data?.[0]?.id ?? null;
}

export async function detectBaselineDeviation(
  assetId: string,
  metricCode: string
): Promise<AnomalyRecord | null> {
  const baseline = await getBaseline(assetId, metricCode);
  if (baseline.status !== 'ACTIVE') return null;

  const { data: recent } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&quality=in.(VALID,SUSPECT)&order=observed_at.desc&limit=1`
  );
  const obs = recent?.[0];
  if (!obs || obs.normalised_value === null) return null;

  const deviation = evaluateBaselineDeviation(parseFloat(obs.normalised_value), baseline);
  if (!deviation || !deviation.is_anomalous) return null;

  const unit = obs.canonical_unit ?? '';
  const evidence: AnomalyEvidence = {
    anomaly_type: 'BASELINE_DEVIATION',
    observed_value: parseFloat(obs.normalised_value),
    unit,
    baseline_mean: baseline.baseline_mean,
    deviation_absolute: deviation.deviation_absolute,
    deviation_pct: deviation.deviation_pct,
    quality: obs.quality,
    description: `${metricCode}: ${Math.abs(deviation.deviation_absolute).toFixed(2)}${unit} ${deviation.direction.toLowerCase()} ${baseline.training_window_days}-day operating baseline (${deviation.deviation_stddev.toFixed(1)}σ)`,
    scope: 'ASSET',
  };

  const severity: AnomalySeverity =
    deviation.deviation_stddev >= 4 ? 'HIGH' : deviation.deviation_stddev >= 3 ? 'WARNING' : 'INFO';

  await writeAnomalyRecord(assetId, null, metricCode, 'BASELINE_DEVIATION', 'ASSET', severity, evidence, obs.observed_at, 1);
  return null;
}

export async function detectPersistentDeviation(
  assetId: string,
  metricCode: string
): Promise<boolean> {
  const baseline = await getBaseline(assetId, metricCode);
  if (baseline.status !== 'ACTIVE') return false;

  const since = new Date(
    Date.now() - PERSISTENT_DEVIATION_THRESHOLD_MINUTES * 60 * 1000
  ).toISOString();

  const { data: window } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&observed_at=gte.${since}&quality=in.(VALID,SUSPECT)&order=observed_at.asc&limit=1000`
  );

  if (!window || window.length < 5) return false;

  const validValues = window
    .map(o => parseFloat(o.normalised_value))
    .filter(v => !isNaN(v));

  if (validValues.length < 5) return false;

  const allAbove = validValues.every(v => v > (baseline.baseline_mean ?? 0) + (baseline.baseline_stddev ?? 0) * 2.5);
  const allBelow = validValues.every(v => v < (baseline.baseline_mean ?? 0) - (baseline.baseline_stddev ?? 0) * 2.5);

  if (!allAbove && !allBelow) return false;

  const unit = window[0]?.canonical_unit ?? '';
  const direction = allAbove ? 'ABOVE' : 'BELOW';
  const avgValue = validValues.reduce((s, v) => s + v, 0) / validValues.length;
  const deviationAbs = Math.abs(avgValue - (baseline.baseline_mean ?? 0));

  const evidence: AnomalyEvidence = {
    anomaly_type: 'PERSISTENT_DEVIATION',
    observed_value: parseFloat(avgValue.toFixed(3)),
    unit,
    baseline_mean: baseline.baseline_mean,
    deviation_absolute: parseFloat(deviationAbs.toFixed(3)),
    duration_seconds: PERSISTENT_DEVIATION_THRESHOLD_MINUTES * 60,
    sample_count: validValues.length,
    quality: 'VALID',
    description: `${metricCode} persistently ${direction.toLowerCase()} baseline for >${PERSISTENT_DEVIATION_THRESHOLD_MINUTES} minutes. Average deviation: ${deviationAbs.toFixed(2)}${unit}. Duration: ${validValues.length} samples.`,
    scope: 'ASSET',
  };

  await writeAnomalyRecord(
    assetId, null, metricCode,
    'PERSISTENT_DEVIATION', 'ASSET', 'HIGH',
    evidence, window[0].observed_at, validValues.length
  );
  return true;
}

export async function detectSensorFlatline(
  assetId: string,
  sensorId: string,
  metricCode: string
): Promise<boolean> {
  const { data: recent } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&sensor_id=eq.${sensorId}&metric_code=eq.${metricCode}&quality=in.(VALID,SUSPECT)&order=observed_at.desc&limit=${FLATLINE_SAMPLES + 5}`
  );

  if (!recent || recent.length < FLATLINE_SAMPLES) return false;

  const values = recent.map(o => o.normalised_value).filter(v => v !== null);
  if (values.length < FLATLINE_SAMPLES) return false;

  const allSame = values.slice(0, FLATLINE_SAMPLES).every(v => v === values[0]);
  if (!allSame) return false;

  const evidence: AnomalyEvidence = {
    anomaly_type: 'SENSOR_FLATLINE',
    observed_value: values[0],
    unit: recent[0]?.canonical_unit ?? '',
    sample_count: FLATLINE_SAMPLES,
    quality: 'SUSPECT',
    description: `Sensor reporting identical value (${values[0]}) across ${FLATLINE_SAMPLES} consecutive observations — likely sensor fault. This is a SENSOR anomaly, not confirmed as asset failure.`,
    scope: 'SENSOR',
  };

  await writeAnomalyRecord(
    assetId, sensorId, metricCode,
    'SENSOR_FLATLINE', 'SENSOR', 'WARNING',
    evidence, recent[FLATLINE_SAMPLES - 1]?.observed_at ?? new Date().toISOString(),
    FLATLINE_SAMPLES
  );
  return true;
}

export async function detectExcessRuntime(
  assetId: string
): Promise<boolean> {
  const since24h = new Date(Date.now() - 86400000).toISOString();
  const { data: runtimeObs } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.COMPRESSOR_RUN_STATE&observed_at=gte.${since24h}&quality=in.(VALID,SUSPECT)&order=observed_at.asc&limit=10000`
  );

  if (!runtimeObs || runtimeObs.length < 2) return false;

  let runtimeSeconds = 0;
  for (let i = 1; i < runtimeObs.length; i++) {
    if (parseFloat(runtimeObs[i - 1].normalised_value) === 1) {
      const durationMs =
        new Date(runtimeObs[i].observed_at).getTime() -
        new Date(runtimeObs[i - 1].observed_at).getTime();
      runtimeSeconds += durationMs / 1000;
    }
  }

  const runtimeHours = runtimeSeconds / 3600;
  if (runtimeHours <= EXCESS_RUNTIME_HOURS_DAILY) return false;

  const evidence: AnomalyEvidence = {
    anomaly_type: 'EXCESS_RUNTIME',
    observed_value: parseFloat(runtimeHours.toFixed(2)),
    unit: 'h',
    duration_seconds: runtimeSeconds,
    sample_count: runtimeObs.length,
    threshold: EXCESS_RUNTIME_HOURS_DAILY,
    threshold_direction: 'ABOVE',
    quality: 'VALID',
    description: `Asset ran for ${runtimeHours.toFixed(1)}h in the last 24h (threshold: ${EXCESS_RUNTIME_HOURS_DAILY}h). May indicate continuous operation or control fault.`,
    scope: 'ASSET',
  };

  await writeAnomalyRecord(
    assetId, null, 'COMPRESSOR_RUN_STATE',
    'EXCESS_RUNTIME', 'ASSET', 'WARNING',
    evidence, runtimeObs[0].observed_at, runtimeObs.length
  );
  return true;
}

export async function detectStartStopCycling(
  assetId: string
): Promise<boolean> {
  const since1h = new Date(Date.now() - 3600000).toISOString();
  const { data: startObs } = await dbQuery<any[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.START_COUNT&observed_at=gte.${since1h}&quality=in.(VALID,SUSPECT)&order=observed_at.asc&limit=500`
  );

  if (!startObs || startObs.length < 2) return false;

  const firstCount = parseFloat(startObs[0].normalised_value ?? '0');
  const lastCount = parseFloat(startObs[startObs.length - 1].normalised_value ?? '0');
  const startsInWindow = lastCount - firstCount;

  if (startsInWindow <= SHORT_CYCLING_STARTS_PER_HOUR) return false;

  const evidence: AnomalyEvidence = {
    anomaly_type: 'START_STOP_CYCLING',
    observed_value: startsInWindow,
    unit: 'starts/h',
    duration_seconds: 3600,
    sample_count: startObs.length,
    threshold: SHORT_CYCLING_STARTS_PER_HOUR,
    threshold_direction: 'ABOVE',
    quality: 'VALID',
    description: `${startsInWindow} start cycles detected in the last hour (threshold: ${SHORT_CYCLING_STARTS_PER_HOUR}). May indicate short-cycling / controls issue.`,
    scope: 'ASSET',
  };

  await writeAnomalyRecord(
    assetId, null, 'START_COUNT',
    'START_STOP_CYCLING', 'ASSET', 'HIGH',
    evidence, startObs[0].observed_at, startObs.length
  );
  return true;
}

export async function getActiveAnomalies(
  assetId: string
): Promise<AnomalyRecord[]> {
  const { data } = await dbQuery<AnomalyRecord[]>(
    `asset_telemetry_anomalies?asset_id=eq.${assetId}&is_active=eq.true&order=created_at.desc&limit=50`
  );
  return data ?? [];
}

export async function runAnomalyDetection(assetId: string): Promise<{
  checked: number;
  anomalies_detected: number;
  sensor_anomalies: number;
  asset_anomalies: number;
}> {
  let checked = 0;
  let detected = 0;
  let sensorCount = 0;
  let assetCount = 0;

  const { data: sensors } = await dbQuery<any[]>(
    `telemetry_sensors?asset_id=eq.${assetId}&status=eq.ACTIVE&limit=50`
  );

  for (const sensor of sensors ?? []) {
    checked++;
    const flatline = await detectSensorFlatline(assetId, sensor.id, sensor.metric_code);
    if (flatline) { detected++; sensorCount++; }

    await detectBaselineDeviation(assetId, sensor.metric_code);

    const persistent = await detectPersistentDeviation(assetId, sensor.metric_code);
    if (persistent) { detected++; assetCount++; }
  }

  const excessRuntime = await detectExcessRuntime(assetId);
  if (excessRuntime) { detected++; assetCount++; }

  const cycling = await detectStartStopCycling(assetId);
  if (cycling) { detected++; assetCount++; }

  return { checked, anomalies_detected: detected, sensor_anomalies: sensorCount, asset_anomalies: assetCount };
}
