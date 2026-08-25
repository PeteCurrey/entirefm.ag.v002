/**
 * ENTIREFM PREDICTIVE — HUMAN REVIEW GOVERNANCE (Phase 0L)
 * =========================================================
 * The human review entity is the mandatory gateway between prediction and action.
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import type { PredictiveReview, ReviewDecision, ReviewStatus } from './types';

export async function createPredictiveReview(config: {
  prediction_id?: string;
  asset_id: string;
  reliability_signal_id?: string;
  recommended_action: ReviewDecision;
  evidence_snapshot?: Record<string, unknown>;
  opened_by?: string;
}): Promise<PredictiveReview | null> {
  const { data } = await dbQuery<PredictiveReview[]>('predictive_reviews', {
    method: 'POST',
    body: {
      prediction_id: config.prediction_id ?? null,
      asset_id: config.asset_id,
      reliability_signal_id: config.reliability_signal_id ?? null,
      opened_by: config.opened_by ?? null,
      status: 'OPEN',
      recommended_action: config.recommended_action,
      evidence_snapshot: config.evidence_snapshot ?? {},
    },
  });
  return data?.[0] ?? null;
}

export async function decideReview(config: {
  review_id: string;
  decision: ReviewDecision;
  decided_by: string;
  notes?: string;
}): Promise<PredictiveReview | null> {
  const { data } = await dbQuery<PredictiveReview[]>(
    `predictive_reviews?id=eq.${config.review_id}`,
    {
      method: 'PATCH',
      body: {
        decision: config.decision,
        decided_by: config.decided_by,
        decision_at: new Date().toISOString(),
        decision_notes: config.notes ?? null,
        status: 'DECIDED',
        updated_at: new Date().toISOString(),
      },
    }
  );

  await recordAuditEvent({
    event_type: 'PREDICTIVE_REVIEW_DECIDED',
    actor_id: config.decided_by,
    actor_type: 'HUMAN',
    object_type: 'predictive_review',
    object_id: config.review_id,
    after_state: { decision: config.decision },
    reason: config.notes,
    source: 'PREDICTIVE_REVIEW',
  });

  return data?.[0] ?? null;
}

export async function linkWorkOrderToReview(
  reviewId: string,
  workOrderId: string
): Promise<boolean> {
  const { error } = await dbQuery(`predictive_reviews?id=eq.${reviewId}`, {
    method: 'PATCH',
    body: {
      resulting_work_order_id: workOrderId,
      status: 'CLOSED' as ReviewStatus,
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  return !error;
}

export async function getOpenReviews(limit = 50): Promise<PredictiveReview[]> {
  const { data } = await dbQuery<PredictiveReview[]>(
    `predictive_reviews?status=eq.OPEN&order=opened_at.desc&limit=${limit}`
  );
  return data ?? [];
}

export async function getReviewById(
  reviewId: string
): Promise<PredictiveReview | null> {
  const { data } = await dbQuery<PredictiveReview[]>(
    `predictive_reviews?id=eq.${reviewId}`
  );
  return data?.[0] ?? null;
}

export async function getReviewsByAsset(
  assetId: string,
  limit = 20
): Promise<PredictiveReview[]> {
  const { data } = await dbQuery<PredictiveReview[]>(
    `predictive_reviews?asset_id=eq.${assetId}&order=opened_at.desc&limit=${limit}`
  );
  return data ?? [];
}
