/**
 * ENTIREFM UNIFIED EXPIRY ENGINE (CP-03)
 * =====================================
 * Proactive expiry monitoring service for contractor insurance, accreditations,
 * engineer qualifications, and policy reviews.
 *
 * Supported Alert Thresholds:
 * - EXPIRED: < 0 days (immediate operational block if critical)
 * - 7 DAYS: <= 7 days (Urgent high-priority action)
 * - 14 DAYS: <= 14 days (High-priority action)
 * - 30 DAYS: <= 30 days (Proactive renewal notice)
 * - 60 DAYS: <= 60 days (Advance planning window)
 * - 90 DAYS: <= 90 days (Long-range horizon)
 */

export interface ExpiryEvaluation {
  id: string;
  entityType: 'ORGANISATION_DOCUMENT' | 'OPERATIVE_QUALIFICATION' | 'POLICY_REVIEW';
  entityId: string;
  title: string;
  category: string;
  ownerName: string;
  issueDate?: string;
  expiryDate: string;
  daysRemaining: number;
  threshold: 'EXPIRED' | '7_DAYS' | '14_DAYS' | '30_DAYS' | '60_DAYS' | '90_DAYS' | 'CURRENT';
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  isCriticalRequirement: boolean;
  resolutionCta: string;
}

export function evaluateExpiryDate(
  expiryDateStr: string,
  options?: {
    id?: string;
    title?: string;
    category?: string;
    ownerName?: string;
    issueDate?: string;
    isCriticalRequirement?: boolean;
    entityType?: ExpiryEvaluation['entityType'];
    now?: Date;
  }
): ExpiryEvaluation | null {
  if (!expiryDateStr) return null;

  const now = options?.now || new Date();
  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) return null;

  const diffMs = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let threshold: ExpiryEvaluation['threshold'] = 'CURRENT';
  let urgency: ExpiryEvaluation['urgency'] = 'NONE';
  let resolutionCta = 'Review Document';

  const isCritical = options?.isCriticalRequirement ?? false;

  if (daysRemaining < 0) {
    threshold = 'EXPIRED';
    urgency = isCritical ? 'CRITICAL' : 'HIGH';
    resolutionCta = 'Upload Renewal Certificate Immediately';
  } else if (daysRemaining <= 7) {
    threshold = '7_DAYS';
    urgency = isCritical ? 'CRITICAL' : 'HIGH';
    resolutionCta = 'Upload Replacement Before Expiry';
  } else if (daysRemaining <= 14) {
    threshold = '14_DAYS';
    urgency = 'HIGH';
    resolutionCta = 'Prepare Renewal Documentation';
  } else if (daysRemaining <= 30) {
    threshold = '30_DAYS';
    urgency = 'MEDIUM';
    resolutionCta = 'Submit Renewal';
  } else if (daysRemaining <= 60) {
    threshold = '60_DAYS';
    urgency = 'LOW';
    resolutionCta = 'Schedule Renewal';
  } else if (daysRemaining <= 90) {
    threshold = '90_DAYS';
    urgency = 'LOW';
    resolutionCta = 'Advance Notification';
  }

  return {
    id: options?.id || `exp-${Date.now()}`,
    entityType: options?.entityType || 'ORGANISATION_DOCUMENT',
    entityId: options?.id || 'doc-unknown',
    title: options?.title || 'Compliance Document',
    category: options?.category || 'General',
    ownerName: options?.ownerName || 'Contractor Organisation',
    issueDate: options?.issueDate,
    expiryDate: expiryDateStr,
    daysRemaining,
    threshold,
    urgency,
    isCriticalRequirement: isCritical,
    resolutionCta,
  };
}

export function groupExpiriesByHorizon(evaluations: ExpiryEvaluation[]): {
  expired: ExpiryEvaluation[];
  next30Days: ExpiryEvaluation[];
  days31To60: ExpiryEvaluation[];
  days61To90: ExpiryEvaluation[];
} {
  return {
    expired: evaluations.filter((e) => e.daysRemaining < 0),
    next30Days: evaluations.filter((e) => e.daysRemaining >= 0 && e.daysRemaining <= 30),
    days31To60: evaluations.filter((e) => e.daysRemaining > 30 && e.daysRemaining <= 60),
    days61To90: evaluations.filter((e) => e.daysRemaining > 60 && e.daysRemaining <= 90),
  };
}
