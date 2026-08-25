/**
 * ENTIREFM PREDICTIVE — MODEL REGISTRY & STATE MACHINE (Phase 0L)
 * ================================================================
 * Canonical model registry with enforced state machine.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type {
  PredictiveModel,
  PredictiveModelVersion,
  ModelState,
  ModelApprovalRecord,
  ValidationMetrics,
  DriftEvent,
  DriftType,
} from './types';
import { MODEL_STATE_TRANSITIONS } from './types';

export async function registerModel(config: {
  name: string;
  asset_class?: string;
  target: string;
  algorithm?: string;
  description?: string;
  owner_id?: string;
}): Promise<PredictiveModel | null> {
  const { data, error } = await dbQuery<PredictiveModel[]>('predictive_models', {
    method: 'POST',
    body: {
      name: config.name,
      asset_class: config.asset_class ?? null,
      target: config.target,
      algorithm: config.algorithm ?? null,
      description: config.description ?? null,
      owner: config.owner_id ?? null,
      is_active: true,
    },
  });
  if (error) throw new Error(`Failed to register model: ${error}`);
  return data?.[0] ?? null;
}

export async function getModelRegistry(): Promise<PredictiveModel[]> {
  const { data } = await dbQuery<PredictiveModel[]>(
    'predictive_models?is_active=eq.true&order=created_at.desc'
  );
  return data ?? [];
}

export async function createModelVersion(config: {
  model_id: string;
  version: number;
  training_dataset_id?: string;
  feature_set_version?: number;
  validation_window_days?: number;
  notes?: string;
}): Promise<PredictiveModelVersion | null> {
  const { data, error } = await dbQuery<PredictiveModelVersion[]>('predictive_model_versions', {
    method: 'POST',
    body: {
      model_id: config.model_id,
      version: config.version,
      status: 'DRAFT',
      training_dataset_id: config.training_dataset_id ?? null,
      feature_set_version: config.feature_set_version ?? 1,
      validation_window_days: config.validation_window_days ?? null,
      notes: config.notes ?? null,
    },
  });
  if (error) throw new Error(`Failed to create model version: ${error}`);
  return data?.[0] ?? null;
}

export async function getModelVersion(
  versionId: string
): Promise<PredictiveModelVersion | null> {
  const { data } = await dbQuery<PredictiveModelVersion[]>(
    `predictive_model_versions?id=eq.${versionId}`
  );
  return data?.[0] ?? null;
}

export async function getModelVersionsByModel(
  modelId: string
): Promise<PredictiveModelVersion[]> {
  const { data } = await dbQuery<PredictiveModelVersion[]>(
    `predictive_model_versions?model_id=eq.${modelId}&order=version.desc`
  );
  return data ?? [];
}

export function validateModelPromotion(
  fromState: ModelState,
  toState: ModelState
): { permitted: boolean; reason?: string } {
  const permitted = MODEL_STATE_TRANSITIONS[fromState]?.includes(toState) ?? false;

  if (!permitted) {
    return {
      permitted: false,
      reason: `Transition ${fromState} → ${toState} is not permitted. Allowed transitions from ${fromState}: ${MODEL_STATE_TRANSITIONS[fromState]?.join(', ') ?? 'none'}`,
    };
  }

  if (fromState === 'ASSIST' && toState === 'APPROVED') {
    return {
      permitted: false,
      reason: 'ASSIST → APPROVED is blocked in Phase 0L. No CONTROLLED_AUTO predictive maintenance in this phase.',
    };
  }

  return { permitted: true };
}

export async function promoteModelVersion(
  versionId: string,
  toState: ModelState,
  approver: { id?: string; name?: string },
  notes?: string,
  validationEvidenceRef?: string
): Promise<{ success: boolean; reason?: string; version?: PredictiveModelVersion }> {
  const version = await getModelVersion(versionId);
  if (!version) return { success: false, reason: 'Model version not found' };

  const fromState = version.status;
  const validation = validateModelPromotion(fromState, toState);
  if (!validation.permitted) {
    return { success: false, reason: validation.reason };
  }

  if (fromState === 'SHADOW' && toState === 'ASSIST') {
    const approval: ModelApprovalRecord = {
      model_version_id: versionId,
      from_state: fromState,
      to_state: toState,
      decision: 'APPROVED',
      reviewer_id: approver.id,
      reviewer_name: approver.name ?? 'Unknown',
      validation_evidence_ref: validationEvidenceRef,
      notes,
    };
    const { error: approvalError } = await dbQuery('predictive_model_approvals', {
      method: 'POST',
      body: approval,
    });
    if (approvalError) {
      return { success: false, reason: `Failed to record approval: ${approvalError}` };
    }
  }

  const updateBody: Record<string, unknown> = { status: toState };
  if (toState === 'SHADOW') updateBody.shadow_started_at = new Date().toISOString();
  if (toState === 'ASSIST') updateBody.assist_started_at = new Date().toISOString();

  const { data, error } = await dbQuery<PredictiveModelVersion[]>(
    `predictive_model_versions?id=eq.${versionId}`,
    { method: 'PATCH', body: updateBody }
  );

  if (error) return { success: false, reason: error };

  await recordAuditEvent({
    event_type: 'PREDICTIVE_MODEL_PROMOTED',
    actor_id: approver.id,
    actor_type: 'HUMAN',
    object_type: 'predictive_model_version',
    object_id: versionId,
    before_state: { status: fromState },
    after_state: { status: toState },
    reason: notes ?? `Promoted ${fromState} → ${toState}`,
    source: 'PREDICTIVE_MODEL_REGISTRY',
  });

  return { success: true, version: data?.[0] ?? undefined };
}

export async function rejectModelVersion(
  versionId: string,
  reason: string,
  reviewer: { id?: string; name?: string }
): Promise<boolean> {
  const version = await getModelVersion(versionId);
  if (!version) return false;

  await dbQuery(`predictive_model_versions?id=eq.${versionId}`, {
    method: 'PATCH',
    body: { status: 'REJECTED', notes: reason },
  });

  await dbQuery('predictive_model_approvals', {
    method: 'POST',
    body: {
      model_version_id: versionId,
      from_state: version.status,
      to_state: 'REJECTED',
      decision: 'REJECTED',
      reviewer_id: reviewer.id ?? null,
      reviewer_name: reviewer.name ?? 'Unknown',
      notes: reason,
    },
  });

  await recordAuditEvent({
    event_type: 'PREDICTIVE_MODEL_REJECTED',
    actor_id: reviewer.id,
    actor_type: 'HUMAN',
    object_type: 'predictive_model_version',
    object_id: versionId,
    reason,
  });

  return true;
}

export async function recordDriftEvent(
  versionId: string,
  driftType: DriftType,
  evidence: Record<string, unknown>,
  severity: string = 'WARNING'
): Promise<DriftEvent | null> {
  const { data } = await dbQuery<DriftEvent[]>('predictive_model_drift_events', {
    method: 'POST',
    body: {
      model_version_id: versionId,
      drift_type: driftType,
      severity,
      evidence_json: evidence,
      triggered_review: true,
      detected_at: new Date().toISOString(),
    },
  });

  await dbQuery(`predictive_model_versions?id=eq.${versionId}`, {
    method: 'PATCH',
    body: { notes: `REVIEW_REQUIRED: ${driftType} drift detected at ${new Date().toISOString()}` },
  });

  return data?.[0] ?? null;
}

export async function setValidationMetrics(
  versionId: string,
  metrics: ValidationMetrics
): Promise<boolean> {
  const { error } = await dbQuery(`predictive_model_versions?id=eq.${versionId}`, {
    method: 'PATCH',
    body: {
      validation_metrics: metrics,
      class_imbalance_report: {
        failure_count: metrics.failure_count,
        non_failure_count: metrics.non_failure_count,
        ratio: metrics.class_imbalance_ratio,
        method: 'reported',
      },
    },
  });
  return !error;
}
