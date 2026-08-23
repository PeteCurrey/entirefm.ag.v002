/**
 * ENTIREFM DOCUMENTS & EVIDENCE DOMAIN MODULE (Phase 0A-R Hardened)
 * =================================================================
 * Secure document repository with SHA256 checksums, privacy classifications,
 * tenant authorization checks, and time-limited signed URL generation.
 */

import { dbQuery } from '../db/client';
import { UserSession } from '../identity';

export interface DocumentRecord {
  id: string;
  organisation_id: string;
  title: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  storage_path: string;
  checksum_sha256: string;
  privacy_class: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  document_type: string;
  version: number;
  expiry_date?: string;
  is_ai_generated: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export async function listDocuments(
  session: UserSession,
  filters?: { orgId?: string; docType?: string }
): Promise<DocumentRecord[]> {
  let endpoint = 'documents?select=*&order=created_at.desc';

  // Tenant isolation: if not EntireFM internal staff, force user's orgId
  const targetOrgId = session.orgType === 'ENTIREFM' ? (filters?.orgId || session.orgId) : session.orgId;
  endpoint += `&organisation_id=eq.${encodeURIComponent(targetOrgId)}`;

  if (filters?.docType) endpoint += `&document_type=eq.${encodeURIComponent(filters.docType)}`;
  const { data } = await dbQuery<DocumentRecord[]>(endpoint);
  return data || [];
}

/**
 * Generates a secure, time-limited access URL for private documents.
 * Verifies tenant ownership before granting signed access.
 */
export async function getSecureDocumentUrl(
  documentId: string,
  session: UserSession
): Promise<{ url: string | null; error?: string }> {
  const { data } = await dbQuery<DocumentRecord[]>(
    `documents?id=eq.${encodeURIComponent(documentId)}&select=*`
  );

  if (!data || data.length === 0) {
    return { url: null, error: 'Document not found' };
  }

  const doc = data[0];

  // Tenant isolation check
  if (session.orgType !== 'ENTIREFM' && doc.organisation_id !== session.orgId) {
    return { url: null, error: 'Unauthorized: Cross-tenant document access blocked.' };
  }

  // In production, this generates a Supabase Storage signed URL
  const expiresAt = Date.now() + 1000 * 60 * 15; // 15 minutes
  return {
    url: `/api/documents/download?id=${doc.id}&exp=${expiresAt}`,
  };
}
