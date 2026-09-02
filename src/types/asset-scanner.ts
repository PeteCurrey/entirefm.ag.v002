/**
 * ENTIREFM ASSET SCANNER — DATA MODEL & TYPES
 * ============================================
 * Strong typing for Firestore documents and Cloud Storage conventions.
 * All member-owned documents are keyed strictly by Supabase auth.uid.
 */

export type AssetScannerExtractionConfidence = 'high' | 'medium' | 'low' | 'failed';

export type AssetScannerStatus = 'processing' | 'complete' | 'failed' | 'needs_review';

export type AssetScannerFileType = 'image' | 'video' | 'pdf';

export interface RecommendedRegime {
  standard: 'SFG20' | 'statutory';
  taskRef: string;
  frequency: string;
}

/**
 * /estates/{supabaseUid}
 * Top-level estate workspace document keyed on Supabase auth.uid.
 */
export interface EstateDocument {
  createdAt: string; // ISO 8601 string or Firestore Timestamp
  updatedAt: string;
  displayName?: string;
  siteCount: number;
}

/**
 * /estates/{supabaseUid}/assets/{assetId}
 * Digital asset register document.
 * Note: extractionConfidence, recommendedRegime, and assetType are SERVER-WRITE-ONLY.
 */
export interface AssetDocument {
  id?: string;
  createdAt: string;
  updatedAt: string;
  sourceUploadId: string;
  assetType: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  /** The canonical SFG20 asset ID from asset-taxonomy.ts. Stored at extraction time
   *  so bulk PPM handoff can resolve the correct taxonomy entry without re-matching. */
  sfg20AssetId: string | null;
  /** Set to 'manual' for manually-added assets; high/medium/low/failed for AI-extracted. */
  extractionConfidence: AssetScannerExtractionConfidence | 'manual';
  recommendedRegime: RecommendedRegime | null;
  flaggedIssues: string[];
  addedToPpmScheduleAt: string | null;
  status: AssetScannerStatus;
  /** Array of field names the member has edited post-extraction.
   *  Preserves audit trail so extraction accuracy can be assessed later. */
  manuallyEditedFields?: string[];
}

/**
 * /uploads/{uploadId}
 * Upload metadata for scans ingested via Cloud Storage.
 */
export interface UploadDocument {
  id?: string;
  ownerUid: string | null; // null for anonymous visitors
  sessionId?: string | null; // unique session token for anonymous rate limiting
  storagePath: string; // uploads/{ownerUidOrAnon}/{uploadId}/{filename}
  fileType: AssetScannerFileType;
  uploadedAt: string;
  retentionExpiresAt: string | null; // Set to +24 hours for anonymous uploads, null for members
  linkedAssetId: string | null; // Set once the /estates/{supabaseUid}/assets document is created
}

/**
 * Server-side creation and mutation payloads
 */
export interface CreateAssetInput {
  sourceUploadId: string;
  status?: AssetScannerStatus;
  displayName?: string;
}

export interface ServerExtractedAssetUpdate {
  assetType: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  sfg20AssetId: string | null;
  extractionConfidence: AssetScannerExtractionConfidence;
  recommendedRegime: RecommendedRegime | null;
  flaggedIssues: string[];
  status: AssetScannerStatus;
  updatedAt: string;
}
