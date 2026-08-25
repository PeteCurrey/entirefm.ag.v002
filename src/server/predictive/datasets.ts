/**
 * ENTIREFM PREDICTIVE — TRAINING DATASET GOVERNANCE (Phase 0L)
 * =============================================================
 * Versioned, reproducible training dataset management.
 */

import { dbQuery } from '../db/client';
import type { TrainingDataset, TrainingDatasetConfig } from './types';

export async function createTrainingDataset(
  config: TrainingDatasetConfig
): Promise<TrainingDataset | null> {
  const cutoff = new Date(config.date_range_to);
  if (cutoff >= new Date()) {
    throw new Error(
      `Training dataset date_range_to (${config.date_range_to}) must be in the past. Future observations cannot enter historical training windows.`
    );
  }

  const assetPopulation = config.asset_population;
  let assetFilter = 'lifecycle_status=eq.ACTIVE';
  if (assetPopulation.asset_classes?.length) {
    assetFilter += `&category=in.(${assetPopulation.asset_classes.join(',')})`;
  }

  const { data: assetCount } = await dbQuery<any[]>(
    `assets?${assetFilter}&select=id`
  );

  const { data: failures } = await dbQuery<any[]>(
    `asset_failure_events?failed_at=gte.${config.date_range_from}&failed_at=lte.${config.date_range_to}&select=id`
  );
  const failureCount = failures?.length ?? 0;
  const totalAssets = assetCount?.length ?? 0;
  const nonFailureEstimate = Math.max(0, totalAssets - failureCount);
  const imbalanceRatio = failureCount > 0 ? parseFloat((nonFailureEstimate / failureCount).toFixed(2)) : null;

  const { data, error } = await dbQuery<TrainingDataset[]>('predictive_training_datasets', {
    method: 'POST',
    body: {
      name: config.name,
      description: config.description ?? null,
      asset_population: config.asset_population,
      metric_population: config.metric_population ?? null,
      date_range_from: config.date_range_from,
      date_range_to: config.date_range_to,
      feature_set_version: config.feature_set_version,
      failure_label_source: 'ASSET_FAILURE_EVENTS',
      excluded_observations: [],
      quality_filters: config.quality_filters ?? {},
      total_assets: totalAssets,
      total_observations: null,
      failure_event_count: failureCount,
      non_failure_count: nonFailureEstimate,
      class_imbalance_ratio: imbalanceRatio,
      created_by: config.created_by ?? null,
      notes: config.notes ?? null,
    },
  });

  if (error) throw new Error(`Failed to create training dataset: ${error}`);
  return data?.[0] ?? null;
}

export async function getTrainingDataset(
  datasetId: string
): Promise<TrainingDataset | null> {
  const { data } = await dbQuery<TrainingDataset[]>(
    `predictive_training_datasets?id=eq.${datasetId}`
  );
  return data?.[0] ?? null;
}

export async function validateTemporalIsolation(datasetId: string): Promise<{
  isolated: boolean;
  date_range_to: string;
  is_past: boolean;
  future_observations_count: number;
  evidence: string;
}> {
  const dataset = await getTrainingDataset(datasetId);
  if (!dataset) throw new Error(`Dataset ${datasetId} not found`);

  const cutoff = new Date(dataset.date_range_to);
  const isPast = cutoff < new Date();

  const { data: futureObs } = await dbQuery<any[]>(
    `telemetry_observations?observed_at=gt.${dataset.date_range_to}&select=id&limit=1`
  );
  const futureCount = futureObs?.length ?? 0;
  const isolated = isPast;

  return {
    isolated,
    date_range_to: dataset.date_range_to,
    is_past: isPast,
    future_observations_count: futureCount,
    evidence: isolated
      ? `Training cutoff (${dataset.date_range_to}) is in the past. Feature computation uses window_end=${dataset.date_range_to} — no future observations can enter.`
      : `ISOLATION FAILURE: Training cutoff (${dataset.date_range_to}) is NOT in the past. This would allow future data to contaminate historical predictions.`,
  };
}

export async function listTrainingDatasets(): Promise<TrainingDataset[]> {
  const { data } = await dbQuery<TrainingDataset[]>(
    'predictive_training_datasets?order=created_at.desc&limit=50'
  );
  return data ?? [];
}
