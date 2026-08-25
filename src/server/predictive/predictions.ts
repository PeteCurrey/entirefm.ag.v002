/**
 * ENTIREFM PREDICTIVE — PREDICTION ENGINE (Phase 0L)
 * ===================================================
 * Creates and evaluates SHADOW/ASSIST predictions.
 */

import { dbQuery } from '../db/client';
import type {
  Prediction,
  PredictionOutcome,
  RiskLevel,
  EvaluationResult,
  ValidationMetrics,
} from './types';
import { getModelVersion } from './models';

export async function createPrediction(config: {
  model_version_id: string;
  asset_id: string;
  risk_level: RiskLevel;
  risk_score?: number;
  feature_snapshot: Record<string, unknown>;
  prediction_window_days: number;
  data_quality?: 'VALID' | 'PARTIAL' | 'INSUFFICIENT';
  data_freshness_hours?: number;
}): Promise<Prediction | null> {
  const version = await getModelVersion(config.model_version_id);
  if (!version) throw new Error(`Model version ${config.model_version_id} not found`);

  if (version.status !== 'SHADOW' && version.status !== 'ASSIST') {
    throw new Error(
      `Model version status is ${version.status}. Only SHADOW and ASSIST models may create predictions.`
    );
  }

  const { data } = await dbQuery<Prediction[]>('predictive_predictions', {
    method: 'POST',
    body: {
      model_version_id: config.model_version_id,
      asset_id: config.asset_id,
      prediction_window_days: config.prediction_window_days,
      risk_level: config.risk_level,
      risk_score: config.risk_score ?? null,
      feature_snapshot: config.feature_snapshot,
      data_quality: config.data_quality ?? 'VALID',
      data_freshness_hours: config.data_freshness_hours ?? null,
      model_status_at_time: version.status,
    },
  });

  return data?.[0] ?? null;
}

export async function getPredictionHistory(
  assetId: string,
  limit = 50
): Promise<Prediction[]> {
  const { data } = await dbQuery<Prediction[]>(
    `predictive_predictions?asset_id=eq.${assetId}&order=prediction_at.desc&limit=${limit}`
  );
  return data ?? [];
}

export async function getLatestPrediction(
  assetId: string
): Promise<Prediction | null> {
  const { data } = await dbQuery<Prediction[]>(
    `predictive_predictions?asset_id=eq.${assetId}&order=prediction_at.desc&limit=1`
  );
  return data?.[0] ?? null;
}

export async function recordPredictionOutcome(config: {
  prediction_id: string;
  asset_id: string;
  actual_outcome: string;
  outcome_at?: string;
  failure_event_id?: string;
  evaluation_result: EvaluationResult;
  confirmed_by?: string;
  notes?: string;
}): Promise<PredictionOutcome | null> {
  const { data } = await dbQuery<PredictionOutcome[]>('predictive_prediction_outcomes', {
    method: 'POST',
    body: {
      prediction_id: config.prediction_id,
      asset_id: config.asset_id,
      actual_outcome: config.actual_outcome,
      outcome_at: config.outcome_at ?? new Date().toISOString(),
      failure_event_id: config.failure_event_id ?? null,
      evaluation_result: config.evaluation_result,
      confirmed_by: config.confirmed_by ?? null,
      notes: config.notes ?? null,
    },
  });
  return data?.[0] ?? null;
}

export async function evaluatePredictionPerformance(
  versionId: string
): Promise<ValidationMetrics | null> {
  const [predsRes, outcomesRes] = await Promise.all([
    dbQuery<any[]>(
      `predictive_predictions?model_version_id=eq.${versionId}&select=id,risk_level,prediction_at`
    ),
    dbQuery<any[]>(
      `predictive_prediction_outcomes?select=prediction_id,evaluation_result,confirmed_at`
    ),
  ]);

  const predictions = predsRes.data ?? [];
  const outcomes = outcomesRes.data ?? [];

  const predIds = new Set(predictions.map((p: any) => p.id));
  const relevantOutcomes = outcomes.filter((o: any) => predIds.has(o.prediction_id));

  if (relevantOutcomes.length === 0) return null;

  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (const o of relevantOutcomes) {
    if (o.evaluation_result === 'TRUE_POSITIVE') tp++;
    else if (o.evaluation_result === 'FALSE_POSITIVE') fp++;
    else if (o.evaluation_result === 'TRUE_NEGATIVE') tn++;
    else if (o.evaluation_result === 'FALSE_NEGATIVE') fn++;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const fpr = fp + tn > 0 ? fp / (fp + tn) : 0;
  const fnr = fn + tp > 0 ? fn / (fn + tp) : 0;

  const totalPos = tp + fn;
  const totalNeg = fp + tn;
  const imbalanceRatio = totalPos > 0 ? parseFloat((totalNeg / totalPos).toFixed(2)) : 0;

  const result: ValidationMetrics = {
    precision: parseFloat(precision.toFixed(4)),
    recall: parseFloat(recall.toFixed(4)),
    f1: parseFloat(f1.toFixed(4)),
    fpr: parseFloat(fpr.toFixed(4)),
    fnr: parseFloat(fnr.toFixed(4)),
    class_imbalance_ratio: imbalanceRatio,
    failure_count: totalPos,
    non_failure_count: totalNeg,
    note: imbalanceRatio > 10
      ? `Class imbalance ${imbalanceRatio.toFixed(0)}:1 — accuracy alone is misleading. Use precision, recall, and PR-AUC.`
      : 'Report all metrics. Do not rely on accuracy alone for rare-event prediction.',
  };

  return result;
}

export async function getElevatedRiskPredictions(
  limit = 20
): Promise<Array<Prediction & { model_status_label: string }>> {
  const { data } = await dbQuery<any[]>(
    `predictive_predictions?risk_level=eq.ELEVATED&order=prediction_at.desc&limit=${limit}`
  );
  return (data ?? []).map((p: any) => ({
    ...p,
    model_status_label:
      p.model_status_at_time === 'SHADOW'
        ? 'SHADOW — NOT OPERATIONALLY APPROVED'
        : p.model_status_at_time === 'ASSIST'
        ? 'ASSIST — REQUIRES HUMAN REVIEW'
        : p.model_status_at_time,
  }));
}
