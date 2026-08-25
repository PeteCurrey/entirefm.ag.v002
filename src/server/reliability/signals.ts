/**
 * ENTIREFM RELIABILITY — SIGNAL ENGINE & RELIABILITY PROFILE (Phase 0L)
 * =======================================================================
 * Generates deterministic reliability signals incorporating full asset context.
 * Telemetry is never interpreted in isolation.
 */

import { dbQuery } from '../db/client';
import type {
  ReliabilitySignal,
  ReliabilitySignalType,
  SignalSeverity,
  AssetContextSnapshot,
  AssetReliabilityProfile,
} from './types';
import { getActiveAnomalies } from './anomaly';

const POLICY_VERSION = '1.0';

export async function buildAssetContext(assetId: string): Promise<AssetContextSnapshot> {
  const { data: assets } = await dbQuery<any[]>(
    `assets?id=eq.${assetId}&select=criticality,condition,lifecycle_status,installation_date,commission_date,expected_life_years`
  );
  const asset = assets?.[0];

  const { data: failures } = await dbQuery<any[]>(
    `asset_failure_events?asset_id=eq.${assetId}&failed_at=gte.${new Date(Date.now() - 90 * 86400000).toISOString()}&select=id,failure_category`
  );
  const failureCount90d = failures?.length ?? 0;

  const categoryMap: Record<string, number> = {};
  for (const f of failures ?? []) {
    categoryMap[f.failure_category] = (categoryMap[f.failure_category] ?? 0) + 1;
  }
  const repeatFailureDetected = Object.values(categoryMap).some(c => c >= 3);

  const { data: ppmVisits } = await dbQuery<any[]>(
    `maintenance_visits?asset_id=eq.${assetId}&status=eq.COMPLETED&order=completed_at.desc&limit=1&select=completed_at`
  );
  const lastPpm = ppmVisits?.[0]?.completed_at;
  const daysSinceLastPpm = lastPpm
    ? Math.floor((Date.now() - new Date(lastPpm).getTime()) / 86400000)
    : null;

  const dateStr = asset?.commission_date ?? asset?.installation_date;
  const assetAgeYears = dateStr
    ? parseFloat(((Date.now() - new Date(dateStr).getTime()) / (365.25 * 86400000)).toFixed(2))
    : null;

  return {
    criticality: asset?.criticality ?? 'UNKNOWN',
    condition: asset?.condition ?? 'UNKNOWN',
    lifecycle_status: asset?.lifecycle_status ?? 'ACTIVE',
    failure_count_90d: failureCount90d,
    repeat_failure_detected: repeatFailureDetected,
    ppm_compliant: daysSinceLastPpm !== null ? daysSinceLastPpm < 365 : null,
    asset_age_years: assetAgeYears,
    expected_life_years: asset?.expected_life_years ?? null,
    days_since_last_ppm: daysSinceLastPpm,
  };
}

async function writeSignal(
  assetId: string,
  signalType: ReliabilitySignalType,
  severity: SignalSeverity,
  title: string,
  description: string,
  context: AssetContextSnapshot,
  evidence: Record<string, unknown>,
  anomalyId?: string
): Promise<string | null> {
  const { data } = await dbQuery<any[]>('asset_reliability_signals', {
    method: 'POST',
    body: {
      asset_id: assetId,
      signal_type: signalType,
      severity,
      title,
      description,
      asset_context_snapshot: context,
      evidence_snapshot: evidence,
      anomaly_id: anomalyId ?? null,
      policy_version: POLICY_VERSION,
      is_active: true,
      generated_at: new Date().toISOString(),
    },
  });
  return data?.[0]?.id ?? null;
}

function escalateSeverity(
  baseSeverity: SignalSeverity,
  context: AssetContextSnapshot
): SignalSeverity {
  const order: SignalSeverity[] = ['INFO', 'WARNING', 'HIGH', 'CRITICAL'];
  let idx = order.indexOf(baseSeverity);

  if (context.criticality === 'CRITICAL') idx = Math.min(idx + 1, 3);
  if (context.condition === 'CRITICAL' || context.condition === 'POOR') idx = Math.min(idx + 1, 3);
  if (context.repeat_failure_detected) idx = Math.min(idx + 1, 3);

  return order[Math.min(idx, 3)];
}

export async function generateReliabilitySignals(
  assetId: string
): Promise<{ signals_generated: number; signal_types: ReliabilitySignalType[] }> {
  const [context, anomalies] = await Promise.all([
    buildAssetContext(assetId),
    getActiveAnomalies(assetId),
  ]);

  const generated: ReliabilitySignalType[] = [];

  const assetAnomalies = anomalies.filter(a => a.anomaly_scope === 'ASSET');
  if (assetAnomalies.length > 0) {
    const worst = assetAnomalies[0];
    const severity = escalateSeverity(worst.severity as SignalSeverity, context);
    await writeSignal(
      assetId, 'TELEMETRY_ANOMALY', severity,
      'Telemetry Anomaly Detected',
      `${assetAnomalies.length} active telemetry anomaly${assetAnomalies.length > 1 ? 'ies' : ''} detected. Highest severity: ${worst.severity}.`,
      context,
      { anomaly_count: assetAnomalies.length, highest_severity: worst.severity, types: assetAnomalies.map(a => a.anomaly_type) },
      worst.id
    );
    generated.push('TELEMETRY_ANOMALY');
  }

  const persistent = assetAnomalies.filter(a => a.anomaly_type === 'PERSISTENT_DEVIATION');
  if (persistent.length > 0) {
    const severity = escalateSeverity('HIGH', context);
    await writeSignal(
      assetId, 'PERSISTENT_ANOMALY', severity,
      'Persistent Operating Anomaly',
      `Asset has shown persistent deviation from baseline for an extended period. Criticality: ${context.criticality}.`,
      context,
      { persistent_anomaly_count: persistent.length }
    );
    generated.push('PERSISTENT_ANOMALY');
  }

  const sensorAnomalies = anomalies.filter(a => a.anomaly_scope === 'SENSOR');
  if (sensorAnomalies.length > 0) {
    await writeSignal(
      assetId, 'SENSOR_FAILURE', 'WARNING',
      'Sensor Anomaly Detected',
      `${sensorAnomalies.length} sensor anomaly${sensorAnomalies.length > 1 ? 'ies' : ''} detected (${sensorAnomalies.map(a => a.anomaly_type).join(', ')}). Sensor fault — not confirmed as asset failure.`,
      context,
      { sensor_anomaly_count: sensorAnomalies.length, sensor_types: sensorAnomalies.map(a => a.anomaly_type) }
    );
    generated.push('SENSOR_FAILURE');
  }

  const excessRuntime = assetAnomalies.filter(a => a.anomaly_type === 'EXCESS_RUNTIME');
  if (excessRuntime.length > 0) {
    await writeSignal(
      assetId, 'EXCESS_RUNTIME', 'WARNING',
      'Excess Runtime Detected',
      'Asset runtime exceeds configured daily threshold. May indicate continuous operation or controls fault.',
      context, { anomaly_count: excessRuntime.length }
    );
    generated.push('EXCESS_RUNTIME');
  }

  const cycling = assetAnomalies.filter(a => a.anomaly_type === 'START_STOP_CYCLING');
  if (cycling.length > 0) {
    await writeSignal(
      assetId, 'SHORT_CYCLING', 'HIGH',
      'Short Cycling Detected',
      'Excessive start/stop cycling detected. Indicates potential controls, sizing or refrigerant issue.',
      context, { anomaly_count: cycling.length }
    );
    generated.push('SHORT_CYCLING');
  }

  if (context.repeat_failure_detected && assetAnomalies.length > 0) {
    await writeSignal(
      assetId, 'REPEAT_FAILURE_PLUS_ANOMALY', 'HIGH',
      'Repeat Failures with Active Anomaly',
      `Asset has repeat failures in the same category AND active telemetry anomalies. Failure count (90d): ${context.failure_count_90d}.`,
      context,
      { failure_count_90d: context.failure_count_90d, anomaly_count: assetAnomalies.length }
    );
    generated.push('REPEAT_FAILURE_PLUS_ANOMALY');
  }

  if (
    (context.criticality === 'CRITICAL' || context.criticality === 'HIGH') &&
    (context.condition === 'POOR' || context.condition === 'CRITICAL') &&
    assetAnomalies.length > 0
  ) {
    await writeSignal(
      assetId, 'HIGH_RISK_CRITICAL_ASSET', 'CRITICAL',
      'Critical Asset at High Risk',
      `CRITICAL/HIGH priority asset with POOR/CRITICAL condition and active telemetry anomalies. Immediate review recommended.`,
      context,
      { criticality: context.criticality, condition: context.condition, anomaly_count: assetAnomalies.length }
    );
    generated.push('HIGH_RISK_CRITICAL_ASSET');
  }

  return { signals_generated: generated.length, signal_types: generated };
}

export async function getReliabilityProfile(
  assetId: string
): Promise<AssetReliabilityProfile | null> {
  const [assetRes, anomaliesRes, signalsRes, sourcesRes, obs24hRes] = await Promise.all([
    dbQuery<any[]>(`assets?id=eq.${assetId}&select=id,reference,name,criticality,condition,lifecycle_status,installation_date,commission_date,expected_life_years`),
    dbQuery<any[]>(`asset_telemetry_anomalies?asset_id=eq.${assetId}&is_active=eq.true&select=id,anomaly_scope,severity`),
    dbQuery<any[]>(`asset_reliability_signals?asset_id=eq.${assetId}&is_active=eq.true&select=id,signal_type,severity`),
    dbQuery<any[]>(`asset_telemetry_sources?asset_id=eq.${assetId}&select=id,connector_state`),
    dbQuery<any[]>(`telemetry_observations?asset_id=eq.${assetId}&observed_at=gte.${new Date(Date.now() - 86400000).toISOString()}&select=id`),
  ]);

  const asset = assetRes.data?.[0];
  if (!asset) return null;

  const anomalies = anomaliesRes.data ?? [];
  const signals = signalsRes.data ?? [];
  const sources = sourcesRes.data ?? [];
  const obs24h = obs24hRes.data?.length ?? 0;

  const context = await buildAssetContext(assetId);

  const severityOrder = ['INFO', 'WARNING', 'HIGH', 'CRITICAL'];
  const highestAnomalySeverity = anomalies.reduce((best: string | null, a) => {
    if (!best) return a.severity;
    return severityOrder.indexOf(a.severity) > severityOrder.indexOf(best) ? a.severity : best;
  }, null) as any;

  const highestSignalSeverity = signals.reduce((best: string | null, s) => {
    if (!best) return s.severity;
    return severityOrder.indexOf(s.severity) > severityOrder.indexOf(best) ? s.severity : best;
  }, null) as any;

  const dateStr = asset.commission_date ?? asset.installation_date;
  const assetAgeYears = dateStr
    ? parseFloat(((Date.now() - new Date(dateStr).getTime()) / (365.25 * 86400000)).toFixed(2))
    : null;
  const lifeElapsedPct =
    assetAgeYears !== null && asset.expected_life_years
      ? parseFloat(((assetAgeYears / asset.expected_life_years) * 100).toFixed(1))
      : null;

  const liveSources = sources.filter((s: any) => s.connector_state === 'LIVE').length;
  const dataStatus =
    obs24h > 0 ? 'ACTIVE'
    : sources.length > 0 ? 'PARTIAL'
    : anomalies.length > 0 || signals.length > 0 ? 'NO_TELEMETRY'
    : 'NO_DATA';

  return {
    asset_id: assetId,
    asset_reference: asset.reference ?? asset.id,
    asset_name: asset.name,
    criticality: asset.criticality ?? 'UNKNOWN',
    condition: asset.condition ?? 'UNKNOWN',
    lifecycle_status: asset.lifecycle_status ?? 'ACTIVE',
    known_failure_count: context.failure_count_90d,
    repeat_failure_detected: context.repeat_failure_detected,
    repeat_failure_window_days: 90,
    telemetry_source_count: sources.length,
    active_sensor_count: 0,
    live_source_count: liveSources,
    observations_last_24h: obs24h,
    active_anomaly_count: anomalies.length,
    active_asset_anomaly_count: anomalies.filter((a: any) => a.anomaly_scope === 'ASSET').length,
    active_sensor_anomaly_count: anomalies.filter((a: any) => a.anomaly_scope === 'SENSOR').length,
    highest_anomaly_severity: highestAnomalySeverity,
    active_signal_count: signals.length,
    highest_signal_severity: highestSignalSeverity,
    days_since_last_ppm: context.days_since_last_ppm,
    asset_age_years: assetAgeYears,
    expected_life_years: asset.expected_life_years ?? null,
    life_elapsed_pct: lifeElapsedPct,
    profile_generated_at: new Date().toISOString(),
    data_status: dataStatus,
  };
}

export async function getActiveReliabilitySignals(
  limit = 50
): Promise<ReliabilitySignal[]> {
  const { data } = await dbQuery<ReliabilitySignal[]>(
    `asset_reliability_signals?is_active=eq.true&order=generated_at.desc&limit=${limit}`
  );
  return data ?? [];
}
