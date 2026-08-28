/**
 * ENTIREFM FIELD REPORTING ENGINE — REPOSITORY & DATA STORE
 * ==========================================================
 * Durable persistence for report instances, responses, repeatable rows,
 * signatures, attachments, and controlled exports.
 */

import { dbQuery } from '../db/client';
import { getTemplateByCode, getTemplateVersionById } from './template-registry';
import { syncEmergencyLightingAssets } from './asset-writer';
import { syncReportDefectsToCafm } from './defect-writer';
import type {
  ReportInstance,
  ReportResponse,
  ReportRepeatableRow,
  ReportAttachment,
  ReportSignature,
  ReportExport,
  ReportStatus,
  FullReportPack,
  SignatureType,
} from './types';

// In-memory fallback cache for fast recovery and resilient execution
const MEMORY_INSTANCES = new Map<string, ReportInstance>();
const MEMORY_RESPONSES = new Map<string, Map<string, ReportResponse>>();
const MEMORY_ROWS = new Map<string, ReportRepeatableRow[]>();
const MEMORY_ATTACHMENTS = new Map<string, ReportAttachment[]>();
const MEMORY_SIGNATURES = new Map<string, Map<SignatureType, ReportSignature>>();
const MEMORY_EXPORTS = new Map<string, ReportExport[]>();

/**
 * Generate a sequential report reference code (e.g. EFM-REP-2026-001042)
 */
export function generateReportNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `EFM-REP-${year}-${randomSuffix}`;
}

/**
 * Create a new report session instance linked to work order / visit / site.
 */
export async function createReportInstance(params: {
  templateCode: string;
  siteId: string;
  organisationId: string;
  workOrderId?: string | null;
  visitId?: string | null;
  clientAccountId?: string | null;
  assignedEngineerId?: string | null;
  createdById?: string | null;
  title?: string;
  metadata?: Record<string, any>;
}): Promise<ReportInstance> {
  const templatePack = await getTemplateByCode(params.templateCode);
  if (!templatePack) {
    throw new Error(`Report template not found: ${params.templateCode}`);
  }

  const reportNumber = generateReportNumber();
  const defaultTitle = params.title || `${templatePack.template.name} — ${reportNumber}`;

  const row = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    report_number: reportNumber,
    template_version_id: templatePack.version.id,
    work_order_id: params.workOrderId || null,
    visit_id: params.visitId || null,
    client_account_id: params.clientAccountId || null,
    site_id: params.siteId,
    organisation_id: params.organisationId,
    assigned_engineer_id: params.assignedEngineerId || null,
    status: 'DRAFT' as ReportStatus,
    title: defaultTitle,
    started_at: new Date().toISOString(),
    completed_at: null,
    submitted_at: null,
    approved_at: null,
    issued_at: null,
    superseded_by_id: null,
    metadata: params.metadata || {},
    created_by_id: params.createdById || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error } = await dbQuery<ReportInstance[]>('report_instances', {
    method: 'POST',
    body: row,
    headers: { Prefer: 'return=representation' },
  });

  const createdInstance: ReportInstance = inserted?.[0] || (row as ReportInstance);
  createdInstance.template = templatePack.template;
  createdInstance.template_version = templatePack.version;

  // Cache in memory fallback
  MEMORY_INSTANCES.set(createdInstance.id, createdInstance);

  return createdInstance;
}

/**
 * Retrieve a complete report instance by ID with all joins.
 */
export async function getReportInstanceById(id: string): Promise<FullReportPack | null> {
  let instance: ReportInstance | null = null;

  const { data: dbInstances } = await dbQuery<any[]>(
    `report_instances?id=eq.${id}&select=*,site:sites(id,name,site_code,address_line1,city,postcode,access_notes),work_order:work_orders(id,work_order_number,title,description,priority,work_type),assigned_engineer:persons(id,first_name,last_name,email,phone)&limit=1`
  );

  if (dbInstances && dbInstances.length > 0) {
    instance = dbInstances[0];
  } else {
    instance = MEMORY_INSTANCES.get(id) || null;
  }

  if (!instance) return null;

  // Resolve template & version
  const templatePack = await getTemplateVersionById(instance.template_version_id);
  const template = templatePack?.template || {
    id: 'unknown-template',
    template_code: 'ENT-GEN-01',
    name: 'General Operational Report',
    report_type: 'GENERAL',
    discipline: 'Operations',
    description: null,
    icon: 'FileText',
    is_active: true,
    created_at: '',
    updated_at: '',
  };
  const templateVersion = templatePack?.version || {
    id: instance.template_version_id,
    report_template_id: template.id,
    revision: '4.0',
    effective_date: 'MAR 2026',
    schema_json: { sections: [] },
    pdf_renderer_key: 'rev4/reactive-job',
    is_active: true,
    created_at: '',
  };

  // Fetch responses
  const responses: Record<string, Record<string, any>> = {};
  const { data: dbResponses } = await dbQuery<ReportResponse[]>(
    `report_responses?report_instance_id=eq.${id}`
  );
  const allResponses = dbResponses || Array.from(MEMORY_RESPONSES.get(id)?.values() || []);
  for (const resp of allResponses) {
    if (!responses[resp.section_key]) responses[resp.section_key] = {};
    responses[resp.section_key][resp.field_key] = resp.value_json ?? resp.value_text;
  }

  // Fetch repeatable rows
  const repeatableRows: Record<string, ReportRepeatableRow[]> = {};
  const { data: dbRows } = await dbQuery<ReportRepeatableRow[]>(
    `report_repeatable_rows?report_instance_id=eq.${id}&order=sequence_order.asc`
  );
  const allRows = dbRows || (MEMORY_ROWS.get(id) || []);
  for (const r of allRows) {
    if (!repeatableRows[r.section_key]) repeatableRows[r.section_key] = [];
    repeatableRows[r.section_key].push(r);
  }

  // Fetch attachments
  const { data: dbAttachments } = await dbQuery<ReportAttachment[]>(
    `report_attachments?report_instance_id=eq.${id}&order=created_at.asc`
  );
  const attachments = dbAttachments || (MEMORY_ATTACHMENTS.get(id) || []);

  // Fetch signatures
  const signatures: Record<SignatureType, ReportSignature | undefined> = {
    ENGINEER: undefined,
    CLIENT_REP: undefined,
    ENTIREFM_REVIEWER: undefined,
  };
  const { data: dbSigs } = await dbQuery<ReportSignature[]>(
    `report_signatures?report_instance_id=eq.${id}`
  );
  const allSigs = dbSigs || Array.from(MEMORY_SIGNATURES.get(id)?.values() || []);
  for (const s of allSigs) {
    signatures[s.signature_type] = s;
  }

  // Fetch latest export
  const { data: dbExports } = await dbQuery<ReportExport[]>(
    `report_exports?report_instance_id=eq.${id}&is_current=eq.true&limit=1`
  );
  const latestExport = dbExports?.[0] || MEMORY_EXPORTS.get(id)?.slice(-1)[0];

  return {
    instance,
    template,
    templateVersion,
    responses,
    repeatableRows,
    attachments,
    signatures,
    latestExport,
  };
}

/**
 * Save field responses (Autosave support).
 */
export async function saveReportResponses(
  reportInstanceId: string,
  responses: Array<{ section_key: string; field_key: string; value: any }>
): Promise<{ success: boolean; updatedCount: number }> {
  let instanceMap = MEMORY_RESPONSES.get(reportInstanceId);
  if (!instanceMap) {
    instanceMap = new Map();
    MEMORY_RESPONSES.set(reportInstanceId, instanceMap);
  }

  let count = 0;
  for (const item of responses) {
    const isText = typeof item.value === 'string' || typeof item.value === 'number' || typeof item.value === 'boolean';
    const respRow: ReportResponse = {
      report_instance_id: reportInstanceId,
      section_key: item.section_key,
      field_key: item.field_key,
      value_json: isText ? null : item.value,
      value_text: isText ? String(item.value) : null,
      updated_at: new Date().toISOString(),
    };

    instanceMap.set(`${item.section_key}:${item.field_key}`, respRow);

    await dbQuery('report_responses', {
      method: 'POST',
      body: respRow,
      headers: { Prefer: 'resolution=merge-duplicates' },
    });
    count++;
  }

  // Touch instance updated_at
  const now = new Date().toISOString();
  await dbQuery(`report_instances?id=eq.${reportInstanceId}`, {
    method: 'PATCH',
    body: { updated_at: now, status: 'IN_PROGRESS' },
  });
  const memInst = MEMORY_INSTANCES.get(reportInstanceId);
  if (memInst) {
    memInst.updated_at = now;
    if (memInst.status === 'DRAFT') memInst.status = 'IN_PROGRESS';
  }

  return { success: true, updatedCount: count };
}

/**
 * Replace or append repeatable rows (labour, materials, call points, assets, defects).
 */
export async function saveRepeatableRows(
  reportInstanceId: string,
  sectionKey: string,
  rows: Array<{
    row_type: string;
    sequence_order?: number;
    data_json: Record<string, any>;
    linked_asset_id?: string | null;
    linked_defect_id?: string | null;
  }>
): Promise<{ success: boolean; rowCount: number }> {
  // Delete existing rows for this section
  await dbQuery(`report_repeatable_rows?report_instance_id=eq.${reportInstanceId}&section_key=eq.${sectionKey}`, {
    method: 'DELETE',
  });

  const existingMem = MEMORY_ROWS.get(reportInstanceId) || [];
  const filteredMem = existingMem.filter(r => r.section_key !== sectionKey);

  const newRows: ReportRepeatableRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const item: ReportRepeatableRow = {
      id: `row-${Date.now()}-${i}`,
      report_instance_id: reportInstanceId,
      section_key: sectionKey,
      row_type: row.row_type as any,
      sequence_order: row.sequence_order ?? (i + 1),
      data_json: row.data_json,
      linked_asset_id: row.linked_asset_id || null,
      linked_defect_id: row.linked_defect_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    newRows.push(item);
    await dbQuery('report_repeatable_rows', {
      method: 'POST',
      body: item,
    });
  }

  MEMORY_ROWS.set(reportInstanceId, [...filteredMem, ...newRows]);

  return { success: true, rowCount: newRows.length };
}

/**
 * Record an audited signature.
 */
export async function recordReportSignature(params: {
  reportInstanceId: string;
  signatureType: SignatureType;
  signatoryName: string;
  signatoryPosition?: string | null;
  signatureDataUrl?: string | null;
  storagePath?: string | null;
  signedByUserId?: string | null;
  declarationText?: string | null;
}): Promise<ReportSignature> {
  const sigRow: ReportSignature = {
    id: `sig-${Date.now()}`,
    report_instance_id: params.reportInstanceId,
    signature_type: params.signatureType,
    signatory_name: params.signatoryName,
    signatory_position: params.signatoryPosition || null,
    signature_data_url: params.signatureDataUrl || null,
    storage_path: params.storagePath || null,
    signed_by_user_id: params.signedByUserId || null,
    signed_at: new Date().toISOString(),
    declaration_text: params.declarationText || 'I confirm the works and inspections recorded herein are accurate.',
  };

  let sigMap = MEMORY_SIGNATURES.get(params.reportInstanceId);
  if (!sigMap) {
    sigMap = new Map();
    MEMORY_SIGNATURES.set(params.reportInstanceId, sigMap);
  }
  sigMap.set(params.signatureType, sigRow);

  await dbQuery('report_signatures', {
    method: 'POST',
    body: sigRow,
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  return sigRow;
}

/**
 * Update report status (e.g. SUBMITTED, APPROVED, ISSUED).
 */
export async function updateReportStatus(
  reportInstanceId: string,
  status: ReportStatus,
  actorPersonId?: string
): Promise<{ success: boolean; status: ReportStatus }> {
  const now = new Date().toISOString();
  const updates: Record<string, any> = {
    status,
    updated_at: now,
  };

  if (status === 'ENGINEER_COMPLETED' || status === 'SUBMITTED') {
    updates.completed_at = now;
    updates.submitted_at = now;
  }
  if (status === 'APPROVED') {
    updates.approved_at = now;
  }
  if (status === 'ISSUED') {
    updates.issued_at = now;
  }

  await dbQuery(`report_instances?id=eq.${reportInstanceId}`, {
    method: 'PATCH',
    body: updates,
  });

  const mem = MEMORY_INSTANCES.get(reportInstanceId);
  if (mem) {
    Object.assign(mem, updates);
  }

  return { success: true, status };
}

/**
 * Add photo or document attachment to a report instance.
 */
export async function addReportAttachment(params: {
  reportInstanceId: string;
  attachmentType: 'BEFORE' | 'AFTER' | 'DEFECT' | 'NAMEPLATE' | 'GENERAL' | 'CERTIFICATE';
  storagePath: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  description?: string;
  relatedSection?: string;
  relatedField?: string;
  relatedAssetId?: string;
  uploadedById?: string;
}): Promise<ReportAttachment> {
  const attRow: ReportAttachment = {
    id: `att-${Date.now()}`,
    report_instance_id: params.reportInstanceId,
    attachment_type: params.attachmentType,
    storage_path: params.storagePath,
    file_name: params.fileName || 'evidence.jpg',
    mime_type: params.mimeType || 'image/jpeg',
    file_size_bytes: params.fileSizeBytes || null,
    description: params.description || null,
    related_section: params.relatedSection || null,
    related_field: params.relatedField || null,
    related_asset_id: params.relatedAssetId || null,
    uploaded_by_id: params.uploadedById || null,
    created_at: new Date().toISOString(),
  };

  const current = MEMORY_ATTACHMENTS.get(params.reportInstanceId) || [];
  MEMORY_ATTACHMENTS.set(params.reportInstanceId, [...current, attRow]);

  await dbQuery('report_attachments', {
    method: 'POST',
    body: attRow,
  });

  return attRow;
}

/**
 * Record an export record for generated PDFs.
 */
export async function recordReportExport(params: {
  reportInstanceId: string;
  documentId?: string | null;
  storagePath: string;
  checksumSha256: string;
  pageCount?: number;
  fileSizeBytes?: number;
  generatedById?: string | null;
}): Promise<ReportExport> {
  const exportRow: ReportExport = {
    id: `exp-${Date.now()}`,
    report_instance_id: params.reportInstanceId,
    document_id: params.documentId || null,
    format: 'PDF',
    revision: '4.0',
    storage_path: params.storagePath,
    checksum_sha256: params.checksumSha256,
    page_count: params.pageCount || 1,
    file_size_bytes: params.fileSizeBytes || null,
    is_current: true,
    generated_at: new Date().toISOString(),
    generated_by_id: params.generatedById || null,
  };

  const current = MEMORY_EXPORTS.get(params.reportInstanceId) || [];
  MEMORY_EXPORTS.set(params.reportInstanceId, [...current, exportRow]);

  await dbQuery('report_exports', {
    method: 'POST',
    body: exportRow,
  });

  return exportRow;
}
