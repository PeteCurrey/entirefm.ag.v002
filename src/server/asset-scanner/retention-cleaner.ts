/**
 * ENTIREFM ASSET SCANNER — ANONYMOUS RETENTION CLEANER
 * ====================================================
 * Scheduled retention runner for anonymous uploads.
 * - Anonymous uploads expire in 24 hours (retentionExpiresAt <= now).
 * - Member uploads persist indefinitely (retentionExpiresAt is null).
 * - Cloud Storage bucket enforces automatic 24-hour deletion via storage.lifecycle.json.
 * - This utility purges expired metadata records from Firestore.
 */

import { UploadDocument } from '../../types/asset-scanner';

export interface RetentionCleanupResult {
  purgedUploadCount: number;
  evaluatedAt: string;
  purgedUploadIds: string[];
}

/**
 * Filters and identifies anonymous upload records that have exceeded their 24h retention TTL.
 */
export function identifyExpiredAnonymousUploads(
  uploads: (UploadDocument & { id: string })[],
  referenceTime: Date = new Date()
): (UploadDocument & { id: string })[] {
  const refTimeMs = referenceTime.getTime();

  return uploads.filter((doc) => {
    // Only anonymous uploads have a retention expiration
    if (doc.ownerUid !== null) return false;
    if (!doc.retentionExpiresAt) return false;

    const expiresAtMs = new Date(doc.retentionExpiresAt).getTime();
    return expiresAtMs <= refTimeMs;
  });
}
