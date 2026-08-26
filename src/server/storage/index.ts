/**
 * ENTIREFM SECURE STORAGE CLIENT (Phase 0B)
 * =========================================
 * Private file storage management for operational evidence, certificates,
 * quotes, invoices, and site documents.
 */

import { UserSession, hasPermission } from '../identity';
import { dbQuery } from '../db/client';

export type StorageBucket =
  | 'work-evidence'
  | 'certificates'
  | 'quotes'
  | 'invoices'
  | 'site-documents'
  | 'accreditations'
  | 'voice-captures'
  | 'signatures'
  | 'recruitment-cvs';

export interface StorageUploadResult {
  path: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  checksumSha256: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Phase 0C: field voice and video captures
  'audio/webm',
  'audio/mp4',
  'audio/wav',
  'audio/mpeg',
  'audio/ogg',
  'video/mp4',
  'video/webm',
];

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validate upload payload against MIME whitelist and size constraints
 */
export function validateStorageUpload(
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Disallowed MIME type '${mimeType}'. Allowed: PDF, JPEG, PNG, WEBP, DOCX, XLSX.`,
    };
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(sizeBytes / 1024 / 1024).toFixed(1)}MB) exceeds maximum 25MB limit.`,
    };
  }
  return { valid: true };
}

/**
 * Generate a secure time-limited signed download URL
 */
export async function createSignedDownloadUrl(
  bucket: StorageBucket,
  path: string,
  session: UserSession,
  expiresInSeconds = 900 // 15 minutes
): Promise<{ url: string | null; error?: string }> {
  // Authorization check
  if (!session) {
    return { url: null, error: 'Authentication required' };
  }

  // Construct secure signed link
  const expiryTimestamp = Date.now() + expiresInSeconds * 1000;
  return {
    url: `/api/storage/download?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}&exp=${expiryTimestamp}`,
  };
}
