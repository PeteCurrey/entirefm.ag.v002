/**
 * ENTIREFM TELEMETRY — INGESTION ENGINE (Phase 0L)
 * =================================================
 * Canonical telemetry ingestion, validation, normalisation,
 * quality enforcement, and sensor health monitoring.
 */

import { createHash } from 'node:crypto';
import { dbQuery } from '../db/client';
import { METRIC_REGISTRY, findConversion, getMetricByCode } from './metrics';
import type {
  IngestionPayload,
  IngestionResult,
  BatchIngestionResult,
  ObservationValidationResult,
  TelemetryObservation,
  TelemetryAggregate,
  TelemetrySensor,
  TelemetrySource,
  SensorHealthSignal,
  MetricCode,
  ObservationQuality,
  AggregateWindowType,
  ConnectorState,
} from './types';

export * from './types';
export * from './metrics';

const STALE_THRESHOLD_SECONDS = 24 * 60 * 60; // 24 hours
const FUTURE_TOLERANCE_SECONDS = 300; // 5 minutes
export const MIN_BASELINE_SAMPLES = 168; // 7 days × 24 hourly readings
const FLATLINE_MIN_SAMPLES = 10;
const OFFLINE_INTERVAL_MULTIPLIER = 3;
const DEFAULT_OFFLINE_THRESHOLD_SECONDS = 3600;

export function buildIdempotencyKey(
  sourceId: string,
  sensorRef: string,
  metricCode: string,
  observedAt: string
): string {
  const raw = `${sourceId}:${sensorRef}:${metricCode}:${observedAt}`;
  return createHash('sha256').update(raw).digest('hex');
}

export function normaliseUnit(
  value: number,
  fromUnit: string,
  targetUnit: string
): { normalised_value: number; canonical_unit: string } | { error: string } {
  if (fromUnit === targetUnit) {
    return { normalised_value: value, canonical_unit: targetUnit };
  }
  const conversion = findConversion(fromUnit, targetUnit);
  if (!conversion) {
    return { error: `No conversion available: ${fromUnit} → ${targetUnit}` };
  }
  return {
    normalised_value: conversion.convert(value),
    canonical_unit: targetUnit,
  };
}

export function validateObservation(
  payload: IngestionPayload
): ObservationValidationResult {
  const idempotencyKey = buildIdempotencyKey(
    payload.source_id,
    payload.sensor_id ?? payload.sensor_reference ?? 'unknown',
    payload.metric_code,
    payload.observed_at
  );

  let observedAt: Date;
  try {
    observedAt = new Date(payload.observed_at);
    if (isNaN(observedAt.getTime())) throw new Error('Invalid date');
  } catch {
    return { valid: false, quality: 'INVALID', reason: 'Invalid or malformed observed_at timestamp', idempotency_key: idempotencyKey };
  }

  const nowMs = Date.now();
  const observedMs = observedAt.getTime();

  if (observedMs > nowMs + FUTURE_TOLERANCE_SECONDS * 1000) {
    return { valid: false, quality: 'INVALID', reason: `Future timestamp: ${payload.observed_at}`, idempotency_key: idempotencyKey };
  }

  if (nowMs - observedMs > STALE_THRESHOLD_SECONDS * 1000) {
    return { valid: false, quality: 'STALE', reason: `Stale observation: ${Math.round((nowMs - observedMs) / 3600000)}h old`, idempotency_key: idempotencyKey };
  }

  const metric = getMetricByCode(payload.metric_code);
  if (!metric) {
    return { valid: false, quality: 'INVALID', reason: `Unknown metric code: ${payload.metric_code}`, idempotency_key: idempotencyKey };
  }

  const numericValue = typeof payload.value === 'string' ? parseFloat(payload.value) : payload.value;
  if (metric.canonical_unit !== 'code' && (isNaN(numericValue) || !isFinite(numericValue))) {
    return { valid: false, quality: 'INVALID', reason: 'Non-numeric value for numeric metric', idempotency_key: idempotencyKey };
  }

  if (metric.canonical_unit !== 'code' && !isNaN(numericValue)) {
    const normResult = normaliseUnit(numericValue, payload.unit, metric.canonical_unit);
    if ('error' in normResult) {
      return { valid: false, quality: 'INVALID', reason: `Unit incompatible: ${normResult.error}`, idempotency_key: idempotencyKey };
    }

    if (metric.valid_min !== null && normResult.normalised_value < metric.valid_min) {
      return {
        valid: true,
        quality: 'OUT_OF_RANGE',
        reason: `Value ${normResult.normalised_value}${metric.canonical_unit} below minimum ${metric.valid_min}${metric.canonical_unit}`,
        normalised_value: normResult.normalised_value,
        canonical_unit: normResult.canonical_unit,
        idempotency_key: idempotencyKey,
      };
    }
    if (metric.valid_max !== null && normResult.normalised_value > metric.valid_max) {
      return {
        valid: true,
        quality: 'OUT_OF_RANGE',
        reason: `Value ${normResult.normalised_value}${metric.canonical_unit} above maximum ${metric.valid_max}${metric.canonical_unit}`,
        normalised_value: normResult.normalised_value,
        canonical_unit: normResult.canonical_unit,
        idempotency_key: idempotencyKey,
      };
    }

    return {
      valid: true,
      quality: 'VALID',
      normalised_value: normResult.normalised_value,
      canonical_unit: normResult.canonical_unit,
      idempotency_key: idempotencyKey,
    };
  }

  return { valid: true, quality: 'VALID', idempotency_key: idempotencyKey };
}

export async function quarantineObservation(
  payload: IngestionPayload,
  qualityState: string,
  reason: string,
  idempotencyKey: string
): Promise<void> {
  await dbQuery('telemetry_quality_events', {
    method: 'POST',
    body: {
      asset_id: payload.asset_id || null,
      source_id: payload.source_id || null,
      sensor_id: payload.sensor_id || null,
      metric_code: payload.metric_code || null,
      raw_payload: payload,
      quality_state: qualityState,
      rejection_reason: reason,
      idempotency_key: idempotencyKey,
      observed_at: payload.observed_at || null,
    },
  });
}

export async function ingestObservation(
  payload: IngestionPayload
): Promise<IngestionResult> {
  const validation = validateObservation(payload);

  if (!validation.valid) {
    await quarantineObservation(payload, validation.quality, validation.reason ?? 'Validation failed', validation.idempotency_key);
    return {
      accepted: false,
      idempotency_key: validation.idempotency_key,
      duplicate: false,
      quality: validation.quality,
      rejection_reason: validation.reason,
    };
  }

  const metric = getMetricByCode(payload.metric_code)!;
  const numericRaw = typeof payload.value === 'string' ? parseFloat(payload.value) : payload.value;

  const row: Record<string, unknown> = {
    idempotency_key: validation.idempotency_key,
    asset_id: payload.asset_id,
    source_id: payload.source_id,
    sensor_id: payload.sensor_id ?? null,
    metric_code: payload.metric_code,
    raw_value: isNaN(numericRaw) ? null : numericRaw,
    raw_unit: payload.unit,
    raw_string_value: typeof payload.value === 'string' ? payload.value : String(payload.value),
    normalised_value: validation.normalised_value ?? null,
    canonical_unit: validation.canonical_unit ?? metric.canonical_unit,
    quality: validation.quality,
    quality_reason: validation.reason ?? null,
    observed_at: payload.observed_at,
    source_system: payload.source_system ?? null,
    source_message_id: payload.source_message_id ?? null,
  };

  const { data, error, status } = await dbQuery<TelemetryObservation[]>('telemetry_observations', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation,resolution=ignore-duplicates' },
  });

  const isDuplicate = status === 409 || (status === 200 && (!data || data.length === 0));

  if (isDuplicate) {
    return {
      accepted: false,
      idempotency_key: validation.idempotency_key,
      duplicate: true,
      quality: validation.quality,
    };
  }

  if (error) {
    await quarantineObservation(payload, 'SOURCE_ERROR', `DB write error: ${error}`, validation.idempotency_key);
    return {
      accepted: false,
      idempotency_key: validation.idempotency_key,
      duplicate: false,
      quality: 'SOURCE_ERROR',
      rejection_reason: error,
    };
  }

  if (payload.sensor_id) {
    await dbQuery(`telemetry_sensors?id=eq.${payload.sensor_id}`, {
      method: 'PATCH',
      body: { last_observation_at: payload.observed_at, last_known_quality: validation.quality },
    });
  }

  return {
    accepted: true,
    idempotency_key: validation.idempotency_key,
    duplicate: false,
    observation_id: data?.[0]?.id,
    quality: validation.quality,
    normalised_value: validation.normalised_value,
    canonical_unit: validation.canonical_unit,
  };
}

export async function ingestBatch(
  payloads: IngestionPayload[]
): Promise<BatchIngestionResult> {
  const results: IngestionResult[] = [];
  for (const payload of payloads) {
    results.push(await ingestObservation(payload));
  }
  return {
    total: results.length,
    accepted: results.filter(r => r.accepted).length,
    duplicate: results.filter(r => r.duplicate).length,
    rejected: results.filter(r => !r.accepted && !r.duplicate).length,
    results,
  };
}

export async function getLatestReadings(
  assetId: string
): Promise<Record<MetricCode, TelemetryObservation | null>> {
  const { data } = await dbQuery<TelemetryObservation[]>(
    `telemetry_observations?asset_id=eq.${assetId}&quality=in.(VALID,SUSPECT,OUT_OF_RANGE)&order=observed_at.desc&limit=100`
  );

  const latest: Record<string, TelemetryObservation | null> = {};
  for (const obs of data ?? []) {
    if (!latest[obs.metric_code]) {
      latest[obs.metric_code] = obs;
    }
  }
  return latest;
}

export async function getTrend(
  assetId: string,
  metricCode: MetricCode,
  windowDays: number
): Promise<TelemetryObservation[]> {
  const from = new Date(Date.now() - windowDays * 86400 * 1000).toISOString();
  const { data } = await dbQuery<TelemetryObservation[]>(
    `telemetry_observations?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&observed_at=gte.${from}&quality=in.(VALID,SUSPECT)&order=observed_at.asc&limit=5000`
  );
  return data ?? [];
}

export async function getAggregate(
  assetId: string,
  metricCode: MetricCode,
  windowType: AggregateWindowType
): Promise<TelemetryAggregate[]> {
  const { data } = await dbQuery<TelemetryAggregate[]>(
    `telemetry_aggregates?asset_id=eq.${assetId}&metric_code=eq.${metricCode}&window_type=eq.${windowType}&order=window_start.desc&limit=90`
  );
  return data ?? [];
}

export async function checkSensorHealth(
  sourceId: string,
  sensorId: string
): Promise<SensorHealthSignal | null> {
  const { data: sensors } = await dbQuery<TelemetrySensor[]>(
    `telemetry_sensors?id=eq.${sensorId}&source_id=eq.${sourceId}`
  );
  const sensor = sensors?.[0];
  if (!sensor) return null;

  const intervalSeconds =
    sensor.expected_reporting_interval_seconds ??
    DEFAULT_OFFLINE_THRESHOLD_SECONDS;
  const offlineThresholdSeconds = intervalSeconds * OFFLINE_INTERVAL_MULTIPLIER;

  const since = new Date(
    Date.now() - offlineThresholdSeconds * 1000
  ).toISOString();
  const { data: recent } = await dbQuery<TelemetryObservation[]>(
    `telemetry_observations?sensor_id=eq.${sensorId}&observed_at=gte.${since}&quality=neq.INVALID&order=observed_at.desc&limit=20`
  );

  if (!recent || recent.length === 0) {
    return {
      sensor_id: sensorId,
      asset_id: sensor.asset_id,
      source_id: sourceId,
      signal_type: 'SENSOR_OFFLINE',
      scope: 'SENSOR',
      description: `Sensor has not reported for >${Math.round(offlineThresholdSeconds / 60)} minutes (expected interval: ${intervalSeconds}s)`,
      evidence: {
        last_observation_at: sensor.last_observation_at,
        offline_threshold_seconds: offlineThresholdSeconds,
        expected_interval_seconds: intervalSeconds,
      },
      detected_at: new Date().toISOString(),
    };
  }

  if (recent.length >= FLATLINE_MIN_SAMPLES) {
    const values = recent
      .map(o => o.normalised_value)
      .filter(v => v !== null) as number[];
    if (values.length >= FLATLINE_MIN_SAMPLES) {
      const allIdentical = values.every(v => v === values[0]);
      if (allIdentical) {
        return {
          sensor_id: sensorId,
          asset_id: sensor.asset_id,
          source_id: sourceId,
          signal_type: 'SENSOR_FLATLINE',
          scope: 'SENSOR',
          description: `Sensor is reporting identical value (${values[0]}) across ${values.length} consecutive observations — possible sensor fault`,
          evidence: {
            flatline_value: values[0],
            sample_count: values.length,
            note: 'This is a SENSOR anomaly — not confirmed as an ASSET anomaly',
          },
          detected_at: new Date().toISOString(),
        };
      }
    }
  }

  const lastObs = recent[0];
  const lastObsMs = new Date(lastObs.observed_at).getTime();
  if (Date.now() - lastObsMs > STALE_THRESHOLD_SECONDS * 1000) {
    return {
      sensor_id: sensorId,
      asset_id: sensor.asset_id,
      source_id: sourceId,
      signal_type: 'SENSOR_STALE',
      scope: 'SENSOR',
      description: `Last observation is ${Math.round((Date.now() - lastObsMs) / 3600000)}h old — may indicate sensor or connectivity issue`,
      evidence: { last_observation_at: lastObs.observed_at },
      detected_at: new Date().toISOString(),
    };
  }

  return null;
}

export async function getConnectorState(
  sourceId: string
): Promise<{ state: ConnectorState; last_error: string | null; last_connected_at: string | null }> {
  const { data } = await dbQuery<any[]>(
    `asset_telemetry_sources?id=eq.${sourceId}&select=connector_state,last_error,last_connected_at`
  );
  const source = data?.[0];
  if (!source) {
    return { state: 'NOT_CONFIGURED', last_error: null, last_connected_at: null };
  }
  return {
    state: (source.connector_state as ConnectorState) ?? 'NOT_CONFIGURED',
    last_error: source.last_error ?? null,
    last_connected_at: source.last_connected_at ?? null,
  };
}

export interface TelemetryCoverageSummary {
  total_sources: number;
  live_sources: number;
  interface_only_sources: number;
  not_configured_sources: number;
  degraded_or_failed_sources: number;
  assets_with_any_telemetry: number;
  total_observations_24h: number;
  data_status: 'NO_DATA' | 'PARTIAL' | 'ACTIVE';
  zero_data_message?: string;
}

export async function getTelemetryCoverage(): Promise<TelemetryCoverageSummary> {
  const [sourcesRes, obsRes] = await Promise.all([
    dbQuery<any[]>('asset_telemetry_sources?select=connector_state,asset_id'),
    dbQuery<{ count: string }[]>(
      `telemetry_observations?select=count&observed_at=gte.${new Date(Date.now() - 86400000).toISOString()}`
    ),
  ]);

  const sources = sourcesRes.data ?? [];
  const live = sources.filter(s => s.connector_state === 'LIVE').length;
  const interfaceOnly = sources.filter(s => s.connector_state === 'INTERFACE_ONLY').length;
  const notConfigured = sources.filter(s => s.connector_state === 'NOT_CONFIGURED').length;
  const degradedFailed = sources.filter(s => ['DEGRADED', 'FAILED'].includes(s.connector_state)).length;
  const assetsWithTelemetry = new Set(sources.map((s: any) => s.asset_id)).size;

  const obs24h = parseInt(obsRes.data?.[0]?.count ?? '0', 10);

  let dataStatus: 'NO_DATA' | 'PARTIAL' | 'ACTIVE' = 'NO_DATA';
  if (live > 0 && obs24h > 0) dataStatus = 'ACTIVE';
  else if (sources.length > 0) dataStatus = 'PARTIAL';

  return {
    total_sources: sources.length,
    live_sources: live,
    interface_only_sources: interfaceOnly,
    not_configured_sources: notConfigured,
    degraded_or_failed_sources: degradedFailed,
    assets_with_any_telemetry: assetsWithTelemetry,
    total_observations_24h: obs24h,
    data_status: dataStatus,
    zero_data_message:
      dataStatus === 'NO_DATA'
        ? 'No telemetry sources are currently reporting. Connect a BMS, sensor platform or supported data source to begin telemetry analysis.'
        : undefined,
  };
}
