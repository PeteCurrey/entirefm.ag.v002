/**
 * ENTIREFM DOCUMENTS & EVIDENCE DOMAIN MODULE
 * ===========================================
 * Secure document repository with SHA256 checksums, privacy classifications,
 * and multi-entity attachment links.
 */

import { dbQuery } from '../db/client';

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

export async function listDocuments(filters?: { orgId?: string; docType?: string }): Promise<DocumentRecord[]> {
  let endpoint = 'documents?select=*&order=created_at.desc';
  if (filters?.orgId) endpoint += `&organisation_id=eq.${encodeURIComponent(filters.orgId)}`;
  if (filters?.docType) endpoint += `&document_type=eq.${encodeURIComponent(filters.docType)}`;
  const { data } = await dbQuery<DocumentRecord[]>(endpoint);
  return data || [];
}
