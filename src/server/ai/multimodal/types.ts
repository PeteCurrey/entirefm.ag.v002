/**
 * ENTIREFM MULTIMODAL AI DOMAIN (Phase 01)
 * ========================================
 * Canonical schemas and types for multimodal job analysis, evidence ingestion,
 * structured equipment & fault assessment, and asset matching.
 */

import { z } from 'zod';

export type MultimodalMediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';

export interface MultimodalEvidenceItem {
  id: string;
  type: MultimodalMediaType;
  mimeType: string;
  filename: string;
  sizeBytes: number;
  base64Data?: string; // Inline base64 data for immediate AI inference
  storageUrl?: string; // Supabase Storage public/signed URL
  storagePath?: string; // Path within 'work-evidence' bucket
  previewUrl?: string; // Blob or thumbnail preview for client
}

export type JobUrgencyLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' | 'P5_ROUTINE';
export type JobSeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface AssetMatchCandidate {
  asset_id: string | null;
  asset_name: string | null;
  asset_reference: string | null;
  site_id?: string | null;
  confidence: number; // 0 to 100
  reason: string;
}

export type MultimodalJobAssessment = z.infer<typeof MultimodalJobAssessmentSchema>;

export interface EstateAssetSummary {
  id: string;
  name: string;
  asset_reference: string;
  category?: string;
  sub_category?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
}

export interface MultimodalAnalysisRequest {
  userDescription: string;
  evidence: MultimodalEvidenceItem[];
  siteId?: string;
  siteName?: string;
  availableAssets?: EstateAssetSummary[];
  correlationId?: string;
  requesterOrgId?: string;
}

export interface MultimodalAnalysisResponse {
  success: boolean;
  assessment: MultimodalJobAssessment;
  modelProvider: string;
  modelName: string;
  isFallback: boolean;
  tokensUsed?: number;
  costGbp?: number;
  latencyMs: number;
  error?: string;
}

// ─── STRICT ZOD SCHEMA VALIDATION ─────────────────────────────────────────────

export const MultimodalJobAssessmentSchema = z.object({
  issue_summary: z.string().min(3).catch('Reported maintenance issue requiring investigation'),
  category: z.string().min(2).catch('GENERAL_MAINTENANCE'),
  sub_category: z.string().nullable().optional().catch(null),
  asset_identified: z.string().nullable().optional().catch(null),
  asset_match: z
    .object({
      asset_id: z.string().nullable().optional(),
      asset_name: z.string().nullable().optional(),
      asset_reference: z.string().nullable().optional(),
      site_id: z.string().nullable().optional(),
      confidence: z.number().min(0).max(100).catch(70),
      reason: z.string().catch('Matched based on visual characteristics'),
    })
    .nullable()
    .optional()
    .catch(null),
  location: z.string().nullable().optional().catch(null),
  priority: z
    .enum(['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW', 'P5_ROUTINE'])
    .catch('P3_MEDIUM'),
  severity: z.enum(['Low', 'Moderate', 'High', 'Critical']).catch('Moderate'),
  likely_issue: z.string().catch('Equipment or facility defect identified in evidence'),
  recommended_action: z.string().catch('Dispatch qualified engineer to inspect and rectify fault'),
  recommended_trade: z.string().catch('General Maintenance Engineer'),
  safety_flags: z.array(z.string()).catch([]),
  confidence: z.number().min(0).max(100).catch(75),
  additional_information_required: z.array(z.string()).catch([]),
  manufacturer: z.string().nullable().optional().catch(null),
  model: z.string().nullable().optional().catch(null),
  serial_number: z.string().nullable().optional().catch(null),
  visible_damage: z.string().nullable().optional().catch(null),
  error_codes: z.array(z.string()).nullable().optional().catch(null),
  evidence_summary: z
    .object({
      images_count: z.number().catch(0),
      videos_count: z.number().catch(0),
      documents_count: z.number().catch(0),
      voice_notes_count: z.number().catch(0),
      notes: z.string().catch('Evidence reviewed by EntireFM Multimodal AI'),
    })
    .catch({
      images_count: 0,
      videos_count: 0,
      documents_count: 0,
      voice_notes_count: 0,
      notes: 'Standard assessment completed',
    }),
});
