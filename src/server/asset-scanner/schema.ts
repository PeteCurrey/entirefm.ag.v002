/**
 * ENTIREFM ASSET SCANNER — RUNTIME SCHEMA VALIDATION (ZOD)
 * ========================================================
 * Strict schemas for validating incoming requests and database writes.
 */

import { z } from 'zod';

export const RecommendedRegimeSchema = z.object({
  standard: z.enum(['SFG20', 'statutory']),
  taskRef: z.string().min(1, 'taskRef is required'),
  frequency: z.string().min(1, 'frequency is required'),
});

export const EstateDocumentSchema = z.object({
  createdAt: z.string().datetime().or(z.any()),
  updatedAt: z.string().datetime().or(z.any()),
  displayName: z.string().max(100).optional(),
  siteCount: z.number().int().nonnegative().default(0),
});

export const AssetDocumentSchema = z.object({
  createdAt: z.string().datetime().or(z.any()),
  updatedAt: z.string().datetime().or(z.any()),
  sourceUploadId: z.string().min(1, 'sourceUploadId is required'),
  assetType: z.string().nullable().default(null),
  manufacturer: z.string().nullable().default(null),
  model: z.string().nullable().default(null),
  serialNumber: z.string().nullable().default(null),
  extractionConfidence: z.enum(['high', 'medium', 'low', 'failed']),
  recommendedRegime: RecommendedRegimeSchema.nullable().default(null),
  flaggedIssues: z.array(z.string()).default([]),
  addedToPpmScheduleAt: z.string().datetime().nullable().default(null),
  status: z.enum(['processing', 'complete', 'failed', 'needs_review']).default('processing'),
});

export const UploadDocumentSchema = z.object({
  ownerUid: z.string().uuid().nullable(),
  sessionId: z.string().min(16).max(128).nullable().optional(),
  storagePath: z.string().min(1, 'storagePath is required'),
  fileType: z.enum(['image', 'video', 'pdf']),
  uploadedAt: z.string().datetime().or(z.any()),
  retentionExpiresAt: z.string().datetime().nullable(),
  linkedAssetId: z.string().nullable().default(null),
});

/**
 * Storage path builder enforcing the required storage path conventions:
 * - Anonymous: uploads/anon/{sessionId}/{uploadId}/{filename}
 * - Authenticated: uploads/{ownerUid}/{uploadId}/{filename}
 */
export function buildAssetStoragePath(params: {
  ownerUid?: string | null;
  sessionId?: string | null;
  uploadId: string;
  filename: string;
}): string {
  const sanitizedFilename = params.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (params.ownerUid) {
    return `uploads/${params.ownerUid}/${params.uploadId}/${sanitizedFilename}`;
  }
  if (!params.sessionId) {
    throw new Error('Anonymous uploads must specify a valid sessionId');
  }
  return `uploads/anon/${params.sessionId}/${params.uploadId}/${sanitizedFilename}`;
}
