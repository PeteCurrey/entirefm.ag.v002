/**
 * ENTIREFM PPM AUTOPILOT & AI ASSET REGISTER — DOMAIN MODULE (Phase 0D)
 * ======================================================================
 * Covers: Asset Import, Asset Candidates, Duplicate Detection, Data Quality,
 *         Maintenance Sources, Maintenance Requirements, Maintenance Plans,
 *         Plan Items, Planned Occurrences, PPM Work Order Generation,
 *         QR Label Management, and PPM Dashboard Metrics.
 *
 * AI GOVERNANCE: All AI agents operate in ASSIST mode.
 * AI agents may NEVER autonomously write authoritative records.
 * Maintenance frequencies are NEVER invented — only derived from approved sources.
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import type { UserSession } from '@/server/identity';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface AssetImportBatch {
  id: string;
  batch_number: string;
  client_account_id: string;
  site_id?: string;
  file_name: string;
  source_format: 'XLSX' | 'CSV' | 'COBIE' | 'DOCUMENT_OCR' | 'MANUAL';
  column_mappings_json: Record<string, string>;
  total_rows: number;
  ready_rows: number;
  review_rows: number;
  duplicate_rows: number;
  imported_rows: number;
  status: 'DRAFT' | 'MAPPED' | 'VALIDATING' | 'READY_FOR_PREVIEW' | 'COMMITTED' | 'ROLLED_BACK' | 'FAILED';
  created_by_person_id?: string;
  committed_at?: string;
  rolled_back_at?: string;
  created_at: string;
}

export interface AssetImportRow {
  id: string;
  batch_id: string;
  row_index: number;
  raw_data_json: Record<string, any>;
  mapped_data_json: Record<string, any>;
  status: 'PENDING' | 'VALID' | 'NEEDS_REVIEW' | 'DUPLICATE' | 'IMPORTED' | 'ERROR';
  validation_issues_json: Array<{ field: string; issue: string }>;
  candidate_asset_id?: string;
  created_asset_id?: string;
  created_at: string;
}

export interface AssetCandidate {
  id: string;
  client_account_id?: string;
  site_id?: string;
  source_type: 'SPREADSHEET_IMPORT' | 'FIELD_DISCOVERY' | 'DOCUMENT_EXTRACTION' | 'COBIE_IMPORT' | 'MANUAL';
  source_reference?: string;
  proposed_name: string;
  proposed_category?: string;
  proposed_manufacturer?: string;
  proposed_model?: string;
  proposed_serial_number?: string;
  proposed_location_json?: Record<string, any>;
  confidence_score: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MERGED';
  reviewed_by_person_id?: string;
  reviewed_at?: string;
  created_asset_id?: string;
  created_at: string;
}

export interface AssetDuplicate {
  id: string;
  primary_asset_id: string;
  candidate_asset_id?: string;
  duplicate_asset_id?: string;
  confidence_score: number;
  match_reasons_json: string[];
  status: 'PENDING' | 'MERGED' | 'DISMISSED_SEPARATE';
  reviewed_by_person_id?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface MaintenanceSource {
  id: string;
  code: string;
  name: string;
  provider: string;
  source_type: 'MANUFACTURER' | 'LEGISLATION' | 'STANDARD' | 'SFG20' | 'CLIENT' | 'CONTRACT' | 'ENTIREFM' | 'RISK_ASSESSMENT' | 'HISTORICAL' | 'MANUAL';
  version: string;
  effective_date: string;
  superseded_date?: string;
  licensing_status: 'ACTIVE' | 'NOT_CONFIGURED' | 'EXPIRED' | 'RESTRICTED';
  is_active: boolean;
  created_at: string;
}

export interface MaintenanceRequirement {
  id: string;
  requirement_code: string;
  asset_class: string;
  title: string;
  description: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SIX_MONTHLY' | 'ANNUAL' | 'BIENNIAL' | 'FIVE_YEARLY' | 'VARIABLE';
  frequency_interval_days: number;
  required_trade: string;
  required_competency?: string;
  statutory_relevance?: string;
  compliance_obligation_id?: string;
  expected_duration_hours: number;
  evidence_requirements_json: string[];
  tasks_template_json: Array<{ title: string; description?: string }>;
  source_id?: string;
  source_version?: string;
  version: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'SUPERSEDED' | 'DEPRECATED';
  created_at: string;
}

export interface MaintenancePlan {
  id: string;
  plan_number: string;
  client_account_id: string;
  contract_id?: string;
  site_id?: string;
  name: string;
  description?: string;
  version: number;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';
  effective_from: string;
  effective_to?: string;
  total_assets_count: number;
  total_requirements_count: number;
  total_annual_visits_est: number;
  total_annual_hours_est: number;
  approved_by_person_id?: string;
  approved_at?: string;
  created_at: string;
}

export interface MaintenancePlanItem {
  id: string;
  plan_id: string;
  asset_id: string;
  requirement_id: string;
  planning_window_days: number;
  estimated_hours: number;
  recurrence_anchor_date?: string;
  preferred_month?: number;
  is_active: boolean;
  created_at: string;
}

export interface MaintenanceOccurrence {
  id: string;
  occurrence_code: string;
  plan_item_id: string;
  plan_id: string;
  asset_id: string;
  requirement_id: string;
  planned_date: string;
  window_start_date: string;
  window_end_date: string;
  work_order_id?: string;
  status: 'PLANNED' | 'GENERATED' | 'SATISFIED' | 'MISSED' | 'NO_ACCESS' | 'CANCELLED';
  satisfied_at?: string;
  missed_reason?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// GENERATORS
// ─────────────────────────────────────────────────────────────

export function generateBatchNumber(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 90000) + 10000);
  return `IMP-${year}-${rand}`;
}

export function generatePlanNumber(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 90000) + 10000);
  return `PPM-${year}-${rand}`;
}

export function generateOccurrenceCode(planNumber: string, assetId: string, dateStr: string): string {
  const pn = planNumber.replace('PPM-', '');
  const aid = assetId.replace(/-/g, '').substring(0, 6).toUpperCase();
  const ds = dateStr.replace(/-/g, '');
  return `OCC-${pn}-${aid}-${ds}`;
}

export function generateQRIdentifier(assetId: string): string {
  return `EFM-A-${assetId.replace(/-/g, '').substring(0, 8).toUpperCase()}`;
}

// ─────────────────────────────────────────────────────────────
// PURE FUNCTIONS (no DB, no AI hallucination)
// ─────────────────────────────────────────────────────────────

/**
 * proposeColumnMappings — ASSET_IMPORT_AGENT (ASSIST mode)
 * Deterministic string-similarity mapping. Never commits autonomously.
 */
export function proposeColumnMappings(rawHeaders: string[]): {
  proposals: Array<{ rawColumn: string; proposedField: string | null; confidence: number; requiresReview: boolean }>;
} {
  const canonicalFields: Record<string, string[]> = {
    asset_reference: ['asset no', 'asset ref', 'asset number', 'ref', 'tag', 'plant ref', 'equipment ref', 'id', 'asset id', 'asset_id'],
    name: ['name', 'description', 'plant description', 'equipment', 'asset name', 'asset description', 'equipment name', 'plant name'],
    manufacturer: ['manufacturer', 'make', 'mfr', 'brand', 'mfg'],
    model_number: ['model', 'model no', 'model number', 'model ref', 'type', 'model_number'],
    serial_number: ['serial', 'serial no', 'serial number', 's/n', 'sn', 'serial_number'],
    category: ['category', 'asset type', 'type', 'discipline', 'system', 'class', 'asset_type'],
    site_name: ['site', 'site name', 'location', 'building', 'property'],
    floor_zone: ['floor', 'level', 'zone', 'area', 'floor/zone'],
    space: ['room', 'space', 'room no', 'room number'],
    install_date: ['install date', 'installation date', 'date installed', 'commissioned', 'commission date', 'installed'],
    warranty_expiry_date: ['warranty', 'warranty expiry', 'warranty date', 'warranty expires'],
    criticality: ['criticality', 'priority', 'critical', 'importance', 'risk'],
    notes: ['notes', 'comments', 'remarks', 'additional info', 'additional information'],
    service_frequency: ['frequency', 'service freq', 'maintenance freq', 'ppm freq', 'service interval', 'maint freq'],
    last_service_date: ['last service', 'last maintained', 'last inspection', 'last ppm', 'last serviced'],
  };

  const proposals = rawHeaders.map((raw) => {
    const normalised = raw.toLowerCase().trim().replace(/[_]/g, ' ');
    let bestField: string | null = null;
    let bestScore = 0;

    for (const [field, variants] of Object.entries(canonicalFields)) {
      for (const v of variants) {
        if (normalised === v) {
          bestField = field;
          bestScore = 1.0;
          break;
        }
        if (normalised.includes(v) || v.includes(normalised)) {
          const score = Math.min(normalised.length, v.length) / Math.max(normalised.length, v.length);
          if (score > bestScore) {
            bestScore = score;
            bestField = field;
          }
        }
      }
      if (bestScore === 1.0) break;
    }

    return {
      rawColumn: raw,
      proposedField: bestScore >= 0.5 ? bestField : null,
      confidence: bestScore,
      requiresReview: bestScore < 0.80 || bestField === null,
    };
  });

  return { proposals };
}

/**
 * calculateCompletenessScore — deterministic, no AI.
 * Scores how complete an asset record is based on 10 weighted fields.
 */
export function calculateCompletenessScore(assetData: Record<string, any>): {
  score: number;
  missingFields: string[];
} {
  const fields: Array<{ field: string; label: string; weight: number }> = [
    { field: 'name', label: 'Asset name', weight: 15 },
    { field: 'category', label: 'Category', weight: 10 },
    { field: 'manufacturer', label: 'Manufacturer', weight: 10 },
    { field: 'model_number', label: 'Model number', weight: 10 },
    { field: 'serial_number', label: 'Serial number', weight: 10 },
    { field: 'install_date', label: 'Installation date', weight: 10 },
    { field: 'criticality', label: 'Criticality', weight: 10 },
    { field: 'site_id', label: 'Site location', weight: 15 },
    { field: 'warranty_expiry_date', label: 'Warranty information', weight: 5 },
    { field: 'qr_identifier', label: 'QR identifier', weight: 5 },
  ];

  let achieved = 0;
  const missingFields: string[] = [];

  for (const f of fields) {
    const val = assetData[f.field];
    if (val !== null && val !== undefined && val !== '') {
      achieved += f.weight;
    } else {
      missingFields.push(f.label);
    }
  }

  return { score: achieved / 100, missingFields };
}

// ─────────────────────────────────────────────────────────────
// 1. ASSET IMPORT ENGINE
// ─────────────────────────────────────────────────────────────

export async function createImportBatch(
  data: {
    clientAccountId: string;
    siteId?: string;
    fileName: string;
    fileStoragePath: string;
    sourceFormat: 'XLSX' | 'CSV' | 'COBIE' | 'DOCUMENT_OCR' | 'MANUAL';
  },
  session: UserSession
): Promise<{ id: string | null; batchNumber: string | null; error?: string }> {
  if (!session) return { id: null, batchNumber: null, error: 'Authentication required' };
  const batchNumber = generateBatchNumber();
  const record = {
    batch_number: batchNumber,
    client_account_id: data.clientAccountId,
    site_id: data.siteId || null,
    file_name: data.fileName,
    file_storage_path: data.fileStoragePath,
    source_format: data.sourceFormat,
    status: 'DRAFT',
    created_by_person_id: session.personId,
  };
  const { data: result, error } = await dbQuery<AssetImportBatch[]>('asset_import_batches?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, batchNumber: null, error: String(error) };
  const id = result?.[0]?.id ?? `batch-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'ASSET_IMPORT_STARTED',
    object_type: 'asset_import_batches',
    object_id: id,
    actor_id: session.personId,
    after_state: { batchNumber, fileName: data.fileName, format: data.sourceFormat },
  });
  return { id, batchNumber };
}

export async function validateAndStageRows(
  batchId: string,
  rows: Array<{ rowIndex: number; rawData: Record<string, any>; mappedData: Record<string, any> }>,
  session: UserSession
): Promise<{ totalRows: number; readyRows: number; reviewRows: number; duplicateRows: number; error?: string }> {
  if (!session) return { totalRows: 0, readyRows: 0, reviewRows: 0, duplicateRows: 0, error: 'Authentication required' };

  let readyRows = 0;
  let reviewRows = 0;
  let duplicateRows = 0;

  // Get batch info for client scope
  const { data: batchArr } = await dbQuery<AssetImportBatch[]>(`asset_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchArr?.[0];
  if (!batch) return { totalRows: 0, readyRows: 0, reviewRows: 0, duplicateRows: 0, error: 'Batch not found' };

  for (const row of rows) {
    const issues: Array<{ field: string; issue: string }> = [];
    const mapped = row.mappedData;
    let status: AssetImportRow['status'] = 'VALID';

    // Required field check
    if (!mapped.name && !mapped.asset_reference) {
      issues.push({ field: 'name', issue: 'Asset name or reference is required' });
      status = 'ERROR';
    }

    // Date validation
    for (const df of ['install_date', 'warranty_expiry_date', 'last_service_date']) {
      if (mapped[df]) {
        const parsed = Date.parse(mapped[df]);
        if (isNaN(parsed)) {
          issues.push({ field: df, issue: `Invalid date format: ${mapped[df]}` });
          status = 'NEEDS_REVIEW';
        }
      }
    }

    // Duplicate check (by serial or asset_reference within same client)
    if (status !== 'ERROR' && (mapped.serial_number || mapped.asset_reference)) {
      let dupQuery = `assets?client_account_id=eq.${batch.client_account_id}&select=id`;
      if (mapped.serial_number) dupQuery += `&serial_number=eq.${encodeURIComponent(mapped.serial_number)}`;
      else dupQuery += `&asset_reference=eq.${encodeURIComponent(mapped.asset_reference)}`;

      const { data: existing } = await dbQuery<any[]>(dupQuery);
      if (existing && existing.length > 0) {
        issues.push({ field: 'serial_number', issue: 'Possible duplicate: asset with same serial/reference exists' });
        status = 'DUPLICATE';
        duplicateRows++;
      }
    }

    if (status === 'VALID') readyRows++;
    else if (status === 'NEEDS_REVIEW') reviewRows++;

    // Insert row
    await dbQuery<any>('asset_import_rows', {
      method: 'POST',
      body: JSON.stringify({
        batch_id: batchId,
        row_index: row.rowIndex,
        raw_data_json: row.rawData,
        mapped_data_json: mapped,
        status,
        validation_issues_json: issues,
      }),
    });
  }

  const totalRows = rows.length;
  // Update batch totals
  await dbQuery<any>(`asset_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      total_rows: totalRows,
      ready_rows: readyRows,
      review_rows: reviewRows,
      duplicate_rows: duplicateRows,
      status: 'READY_FOR_PREVIEW',
      updated_at: new Date().toISOString(),
    }),
  });

  return { totalRows, readyRows, reviewRows, duplicateRows };
}

export async function commitImportBatch(
  batchId: string,
  session: UserSession
): Promise<{ importedCount: number; skippedCount: number; error?: string }> {
  if (!session) return { importedCount: 0, skippedCount: 0, error: 'Authentication required' };

  const { data: batchArr } = await dbQuery<AssetImportBatch[]>(`asset_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchArr?.[0];
  if (!batch) return { importedCount: 0, skippedCount: 0, error: 'Batch not found' };

  const { data: rows } = await dbQuery<AssetImportRow[]>(`asset_import_rows?batch_id=eq.${batchId}&status=eq.VALID&select=*`);
  if (!rows || rows.length === 0) return { importedCount: 0, skippedCount: 0 };

  let importedCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    // Skip already imported
    if (row.created_asset_id) { skippedCount++; continue; }

    const mapped = row.mapped_data_json;
    const { score } = calculateCompletenessScore({ ...mapped, site_id: batch.site_id });

    const assetRecord = {
      site_id: batch.site_id || null,
      client_account_id: batch.client_account_id,
      asset_reference: mapped.asset_reference || `IMP-${batch.batch_number}-${row.row_index}`,
      name: mapped.name || mapped.description || 'Unknown Asset',
      category: mapped.category || 'UNCLASSIFIED',
      manufacturer: mapped.manufacturer || null,
      model_number: mapped.model_number || null,
      serial_number: mapped.serial_number || null,
      install_date: mapped.install_date || null,
      warranty_expiry_date: mapped.warranty_expiry_date || null,
      criticality: mapped.criticality || 'MEDIUM',
      condition: 'GOOD',
      status: 'IN_SERVICE',
      statutory_compliance_required: false,
      data_quality_status: 'UNVERIFIED',
      completeness_score: score,
      import_batch_id: batchId,
      provenance_json: {
        source: 'SPREADSHEET_IMPORT',
        batch_id: batchId,
        batch_number: batch.batch_number,
        row_index: row.row_index,
        file_name: batch.file_name,
        imported_at: new Date().toISOString(),
      },
    };

    const { data: assetResult, error: assetErr } = await dbQuery<any[]>('assets?select=id', {
      method: 'POST',
      body: JSON.stringify(assetRecord),
    });

    if (assetErr) { skippedCount++; continue; }

    const assetId = assetResult?.[0]?.id ?? `asset-${Date.now()}-${row.row_index}`;

    // Update import row
    await dbQuery<any>(`asset_import_rows?id=eq.${row.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'IMPORTED', created_asset_id: assetId }),
    });

    importedCount++;
  }

  // Update batch status
  await dbQuery<any>(`asset_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'COMMITTED', imported_rows: importedCount, committed_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  });

  await recordAuditEvent({
    event_type: 'ASSET_IMPORT_COMPLETED',
    object_type: 'asset_import_batches',
    object_id: batchId,
    actor_id: session.personId,
    after_state: { importedCount, skippedCount, batchNumber: batch.batch_number },
  });

  return { importedCount, skippedCount };
}

export async function rollbackImportBatch(
  batchId: string,
  reason: string,
  session: UserSession
): Promise<{ archivedCount: number; error?: string }> {
  if (!session) return { archivedCount: 0, error: 'Authentication required' };

  const { data: rows } = await dbQuery<AssetImportRow[]>(
    `asset_import_rows?batch_id=eq.${batchId}&status=eq.IMPORTED&select=*`
  );

  let archivedCount = 0;
  for (const row of rows || []) {
    if (!row.created_asset_id) continue;
    await dbQuery<any>(`assets?id=eq.${row.created_asset_id}`, {
      method: 'PATCH',
      body: JSON.stringify({ data_quality_status: 'ARCHIVED', updated_at: new Date().toISOString() }),
    });
    archivedCount++;
  }

  await dbQuery<any>(`asset_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ROLLED_BACK', rolled_back_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  });

  await recordAuditEvent({
    event_type: 'ASSET_IMPORT_ROLLED_BACK',
    object_type: 'asset_import_batches',
    object_id: batchId,
    actor_id: session.personId,
    after_state: { archivedCount, reason },
  });

  return { archivedCount };
}

export async function listImportBatches(clientAccountId?: string, _session?: UserSession): Promise<AssetImportBatch[]> {
  let endpoint = 'asset_import_batches?select=*&order=created_at.desc';
  if (clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(clientAccountId)}`;
  const { data } = await dbQuery<AssetImportBatch[]>(endpoint);
  return data || [];
}

export async function getImportBatch(batchId: string, _session: UserSession): Promise<AssetImportBatch | null> {
  const { data } = await dbQuery<AssetImportBatch[]>(`asset_import_batches?id=eq.${batchId}&select=*`);
  return data?.[0] ?? null;
}

export async function listImportRows(batchId: string, statusFilter?: string): Promise<AssetImportRow[]> {
  let endpoint = `asset_import_rows?batch_id=eq.${batchId}&select=*&order=row_index.asc`;
  if (statusFilter) endpoint += `&status=eq.${encodeURIComponent(statusFilter)}`;
  const { data } = await dbQuery<AssetImportRow[]>(endpoint);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 2. ASSET CANDIDATES & DUPLICATE MANAGEMENT
// ─────────────────────────────────────────────────────────────

export async function createAssetCandidate(
  data: {
    clientAccountId: string;
    siteId?: string;
    sourceType: AssetCandidate['source_type'];
    sourceReference?: string;
    proposedName: string;
    proposedCategory?: string;
    proposedManufacturer?: string;
    proposedModel?: string;
    proposedSerialNumber?: string;
    proposedLocationJson?: Record<string, any>;
    confidenceScore?: number;
  },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const record = {
    client_account_id: data.clientAccountId,
    site_id: data.siteId || null,
    source_type: data.sourceType,
    source_reference: data.sourceReference || null,
    proposed_name: data.proposedName,
    proposed_category: data.proposedCategory || null,
    proposed_manufacturer: data.proposedManufacturer || null,
    proposed_model: data.proposedModel || null,
    proposed_serial_number: data.proposedSerialNumber || null,
    proposed_location_json: data.proposedLocationJson || {},
    confidence_score: data.confidenceScore ?? 0.85,
    status: 'PENDING',
  };
  const { data: result, error } = await dbQuery<AssetCandidate[]>('asset_candidates?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, error: String(error) };
  const id = result?.[0]?.id ?? `cand-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'ASSET_CANDIDATE_CREATED',
    object_type: 'asset_candidates',
    object_id: id,
    actor_id: session.personId,
    after_state: { proposedName: data.proposedName, sourceType: data.sourceType },
  });
  return { id };
}

export async function verifyAssetCandidate(
  candidateId: string,
  overrides: Partial<Record<string, any>>,
  session: UserSession
): Promise<{ assetId: string | null; error?: string }> {
  if (!session) return { assetId: null, error: 'Authentication required' };
  const { data: candArr } = await dbQuery<AssetCandidate[]>(`asset_candidates?id=eq.${candidateId}&select=*`);
  const cand = candArr?.[0];
  if (!cand) return { assetId: null, error: 'Candidate not found' };

  const { score } = calculateCompletenessScore({
    name: cand.proposed_name,
    category: cand.proposed_category,
    manufacturer: cand.proposed_manufacturer,
    model_number: cand.proposed_model,
    serial_number: cand.proposed_serial_number,
    site_id: cand.site_id,
    ...overrides,
  });

  const assetRecord = {
    site_id: cand.site_id || null,
    client_account_id: cand.client_account_id,
    asset_reference: overrides.asset_reference || `CAND-${Date.now()}`,
    name: overrides.name || cand.proposed_name,
    category: overrides.category || cand.proposed_category || 'UNCLASSIFIED',
    manufacturer: overrides.manufacturer || cand.proposed_manufacturer || null,
    model_number: overrides.model_number || cand.proposed_model || null,
    serial_number: overrides.serial_number || cand.proposed_serial_number || null,
    criticality: overrides.criticality || 'MEDIUM',
    condition: 'GOOD',
    status: 'IN_SERVICE',
    statutory_compliance_required: false,
    data_quality_status: 'VERIFIED',
    completeness_score: score,
    provenance_json: {
      source: cand.source_type,
      candidate_id: candidateId,
      verified_by: session.personId,
      verified_at: new Date().toISOString(),
    },
  };

  const { data: assetResult, error } = await dbQuery<any[]>('assets?select=id', {
    method: 'POST',
    body: JSON.stringify(assetRecord),
  });
  if (error) return { assetId: null, error: String(error) };

  const assetId = assetResult?.[0]?.id ?? null;
  if (assetId) {
    await dbQuery<any>(`asset_candidates?id=eq.${candidateId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'VERIFIED', reviewed_by_person_id: session.personId, reviewed_at: new Date().toISOString(), created_asset_id: assetId }),
    });
    await recordAuditEvent({
      event_type: 'ASSET_CONFIRMED',
      object_type: 'assets',
      object_id: assetId,
      actor_id: session.personId,
      after_state: { candidateId, sourceType: cand.source_type },
    });
  }
  return { assetId };
}

export async function rejectAssetCandidate(
  candidateId: string,
  reason: string,
  session: UserSession
): Promise<{ success: boolean }> {
  if (!session) return { success: false };
  await dbQuery<any>(`asset_candidates?id=eq.${candidateId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'REJECTED', reviewed_by_person_id: session.personId, reviewed_at: new Date().toISOString() }),
  });
  await recordAuditEvent({
    event_type: 'ASSET_CANDIDATE_REJECTED',
    object_type: 'asset_candidates',
    object_id: candidateId,
    actor_id: session.personId,
    after_state: { reason },
  });
  return { success: true };
}

export async function resolveAssetDuplicate(
  duplicateId: string,
  resolution: 'MERGED' | 'DISMISSED_SEPARATE',
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const { data: dupArr } = await dbQuery<AssetDuplicate[]>(`asset_duplicates?id=eq.${duplicateId}&select=*`);
  const dup = dupArr?.[0];
  if (!dup) return { success: false, error: 'Duplicate record not found' };

  if (resolution === 'MERGED' && dup.duplicate_asset_id) {
    await dbQuery<any>(`assets?id=eq.${dup.duplicate_asset_id}`, {
      method: 'PATCH',
      body: JSON.stringify({ data_quality_status: 'ARCHIVED', updated_at: new Date().toISOString() }),
    });
    await recordAuditEvent({
      event_type: 'ASSET_MERGED',
      object_type: 'assets',
      object_id: dup.primary_asset_id,
      actor_id: session.personId,
      after_state: { mergedAssetId: dup.duplicate_asset_id, duplicateId },
    });
  }

  await dbQuery<any>(`asset_duplicates?id=eq.${duplicateId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: resolution === 'MERGED' ? 'MERGED' : 'DISMISSED_SEPARATE', reviewed_by_person_id: session.personId, reviewed_at: new Date().toISOString() }),
  });

  return { success: true };
}

export async function listAssetCandidates(filters?: {
  clientAccountId?: string;
  siteId?: string;
  status?: string;
}): Promise<AssetCandidate[]> {
  let endpoint = 'asset_candidates?select=*&order=created_at.desc';
  if (filters?.clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<AssetCandidate[]>(endpoint);
  return data || [];
}

export async function listAssetDuplicates(filters?: { status?: string }): Promise<AssetDuplicate[]> {
  let endpoint = 'asset_duplicates?select=*&order=created_at.desc';
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<AssetDuplicate[]>(endpoint);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 3. MAINTENANCE SOURCES & REQUIREMENTS
// ─────────────────────────────────────────────────────────────

export async function listMaintenanceSources(): Promise<MaintenanceSource[]> {
  const { data } = await dbQuery<MaintenanceSource[]>('maintenance_sources?select=*&order=name.asc');
  return data || [];
}

export async function getMaintenanceSource(sourceId: string): Promise<MaintenanceSource | null> {
  const { data } = await dbQuery<MaintenanceSource[]>(`maintenance_sources?id=eq.${sourceId}&select=*`);
  return data?.[0] ?? null;
}

/**
 * proposeMaintenanceRequirements — MAINTENANCE_MAPPING_AGENT (ASSIST mode)
 * NEVER invents frequency. If no approved source exists, returns needsReview=true.
 */
export async function proposeMaintenanceRequirements(
  assetId: string,
  assetClass: string,
  _session: UserSession
): Promise<{
  proposals: Array<{
    requirement: MaintenanceRequirement;
    source: MaintenanceSource | null;
    confidence: number;
    rationale: string;
  }>;
  needsReview: boolean;
  reviewReason?: string;
}> {
  // Fetch active requirements for this asset class
  const { data: requirements } = await dbQuery<MaintenanceRequirement[]>(
    `maintenance_requirements?asset_class=eq.${encodeURIComponent(assetClass)}&status=eq.ACTIVE&select=*`
  );

  if (!requirements || requirements.length === 0) {
    return {
      proposals: [],
      needsReview: true,
      reviewReason: `No approved maintenance requirements found for asset class "${assetClass}". Manual engineering review required — maintenance frequency must not be assumed.`,
    };
  }

  const proposals: Array<{
    requirement: MaintenanceRequirement;
    source: MaintenanceSource | null;
    confidence: number;
    rationale: string;
  }> = [];

  let hasUnconfiguredSource = false;

  for (const req of requirements) {
    let source: MaintenanceSource | null = null;
    if (req.source_id) {
      source = await getMaintenanceSource(req.source_id);
    }

    // Do not propose requirements from unconfigured sources (e.g. SFG20 not licensed)
    if (source && source.licensing_status === 'NOT_CONFIGURED') {
      hasUnconfiguredSource = true;
      continue;
    }

    proposals.push({
      requirement: req,
      source,
      confidence: 0.95,
      rationale: `Asset classified as "${assetClass}". Matched requirement ${req.requirement_code} from ${source ? `source ${source.code} v${source.version}` : 'EntireFM standard'}. Human approval required before activation.`,
    });
  }

  const needsReview = proposals.length === 0;
  const reviewReason = needsReview
    ? hasUnconfiguredSource
      ? 'All matching maintenance requirements reference sources that are not configured (e.g. SFG20). Configure at /admin/platform/integrations.'
      : `No active requirements found for "${assetClass}". Manual review required.`
    : undefined;

  return { proposals, needsReview, reviewReason };
}

export async function listMaintenanceRequirements(filters?: {
  assetClass?: string;
  status?: string;
}): Promise<MaintenanceRequirement[]> {
  let endpoint = 'maintenance_requirements?select=*&order=asset_class.asc,title.asc';
  if (filters?.assetClass) endpoint += `&asset_class=eq.${encodeURIComponent(filters.assetClass)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<MaintenanceRequirement[]>(endpoint);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 4. MAINTENANCE PLANS
// ─────────────────────────────────────────────────────────────

export async function createMaintenancePlan(
  data: {
    clientAccountId: string;
    contractId?: string;
    siteId?: string;
    name: string;
    effectiveFrom: string;
  },
  session: UserSession
): Promise<{ id: string | null; planNumber: string | null; error?: string }> {
  if (!session) return { id: null, planNumber: null, error: 'Authentication required' };
  const planNumber = generatePlanNumber();
  const record = {
    plan_number: planNumber,
    client_account_id: data.clientAccountId,
    contract_id: data.contractId || null,
    site_id: data.siteId || null,
    name: data.name,
    version: 1,
    status: 'DRAFT',
    effective_from: data.effectiveFrom,
  };
  const { data: result, error } = await dbQuery<MaintenancePlan[]>('maintenance_plans?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, planNumber: null, error: String(error) };
  const id = result?.[0]?.id ?? `plan-${Date.now()}`;
  await recordAuditEvent({
    event_type: 'PPM_PLAN_CREATED',
    object_type: 'maintenance_plans',
    object_id: id,
    actor_id: session.personId,
    after_state: { planNumber, name: data.name, status: 'DRAFT' },
  });
  return { id, planNumber };
}

export async function addPlanItem(
  planId: string,
  data: {
    assetId: string;
    requirementId: string;
    estimatedHours?: number;
    planningWindowDays?: number;
    preferredMonth?: number;
    recurrenceAnchorDate?: string;
  },
  session: UserSession
): Promise<{ id: string | null; error?: string }> {
  if (!session) return { id: null, error: 'Authentication required' };
  const record = {
    plan_id: planId,
    asset_id: data.assetId,
    requirement_id: data.requirementId,
    planning_window_days: data.planningWindowDays ?? 14,
    estimated_hours: data.estimatedHours ?? 1.0,
    preferred_month: data.preferredMonth || null,
    recurrence_anchor_date: data.recurrenceAnchorDate || null,
    is_active: true,
  };
  const { data: result, error } = await dbQuery<MaintenancePlanItem[]>('maintenance_plan_items?select=id', {
    method: 'POST',
    body: JSON.stringify(record),
  });
  if (error) return { id: null, error: String(error) };
  return { id: result?.[0]?.id ?? null };
}

export async function approvePlan(
  planId: string,
  notes: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };
  const { error } = await dbQuery<any>(`maintenance_plans?id=eq.${planId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'APPROVED',
      approved_by_person_id: session.personId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (error) return { success: false, error: String(error) };
  await recordAuditEvent({
    event_type: 'PPM_PLAN_APPROVED',
    object_type: 'maintenance_plans',
    object_id: planId,
    actor_id: session.personId,
    after_state: { status: 'APPROVED', notes },
  });
  return { success: true };
}

export async function activatePlan(
  planId: string,
  session: UserSession
): Promise<{ success: boolean; supersededPlanId?: string; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };

  // Get plan details
  const { data: planArr } = await dbQuery<MaintenancePlan[]>(`maintenance_plans?id=eq.${planId}&select=*`);
  const plan = planArr?.[0];
  if (!plan) return { success: false, error: 'Plan not found' };

  // Find and supersede any existing ACTIVE plan for same client/site
  let supersededPlanId: string | undefined;
  let supersedQuery = `maintenance_plans?status=eq.ACTIVE&client_account_id=eq.${plan.client_account_id}&id=neq.${planId}&select=id`;
  if (plan.site_id) supersedQuery += `&site_id=eq.${plan.site_id}`;
  const { data: activePlans } = await dbQuery<MaintenancePlan[]>(supersedQuery);
  if (activePlans && activePlans.length > 0) {
    supersededPlanId = activePlans[0].id;
    await dbQuery<any>(`maintenance_plans?id=eq.${supersededPlanId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SUPERSEDED', updated_at: new Date().toISOString() }),
    });
  }

  // Activate the plan
  const { error } = await dbQuery<any>(`maintenance_plans?id=eq.${planId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ACTIVE', updated_at: new Date().toISOString() }),
  });
  if (error) return { success: false, error: String(error) };

  await recordAuditEvent({
    event_type: 'PPM_PLAN_ACTIVATED',
    object_type: 'maintenance_plans',
    object_id: planId,
    actor_id: session.personId,
    after_state: { status: 'ACTIVE', supersededPlanId },
  });
  return { success: true, supersededPlanId };
}

export async function listMaintenancePlans(filters?: {
  clientAccountId?: string;
  siteId?: string;
  status?: string;
}): Promise<MaintenancePlan[]> {
  let endpoint = 'maintenance_plans?select=*&order=created_at.desc';
  if (filters?.clientAccountId) endpoint += `&client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}`;
  if (filters?.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  const { data } = await dbQuery<MaintenancePlan[]>(endpoint);
  return data || [];
}

export async function getMaintenancePlan(planId: string): Promise<MaintenancePlan | null> {
  const { data } = await dbQuery<MaintenancePlan[]>(`maintenance_plans?id=eq.${planId}&select=*`);
  return data?.[0] ?? null;
}

export async function listPlanItems(planId: string): Promise<MaintenancePlanItem[]> {
  const { data } = await dbQuery<MaintenancePlanItem[]>(
    `maintenance_plan_items?plan_id=eq.${planId}&is_active=eq.true&select=*&order=created_at.asc`
  );
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 5. DETERMINISTIC RECURRENCE & OCCURRENCE GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * generateOccurrences — Deterministic. Idempotent.
 * Generates planned occurrences for an ACTIVE plan over a controlled horizon.
 */
export async function generateOccurrences(
  planId: string,
  horizonMonths: number = 12,
  session: UserSession
): Promise<{ created: number; skipped: number; error?: string }> {
  if (!session) return { created: 0, skipped: 0, error: 'Authentication required' };

  const plan = await getMaintenancePlan(planId);
  if (!plan) return { created: 0, skipped: 0, error: 'Plan not found' };
  if (plan.status !== 'ACTIVE' && plan.status !== 'APPROVED') {
    return { created: 0, skipped: 0, error: 'Plan must be ACTIVE or APPROVED to generate occurrences' };
  }

  const items = await listPlanItems(planId);
  if (items.length === 0) return { created: 0, skipped: 0 };

  const horizonEnd = new Date();
  horizonEnd.setMonth(horizonEnd.getMonth() + horizonMonths);

  let created = 0;
  let skipped = 0;

  for (const item of items) {
    // Fetch requirement for interval
    const { data: reqArr } = await dbQuery<MaintenanceRequirement[]>(
      `maintenance_requirements?id=eq.${item.requirement_id}&select=frequency_interval_days`
    );
    const intervalDays = reqArr?.[0]?.frequency_interval_days;
    if (!intervalDays || intervalDays <= 0) { skipped++; continue; }

    // Determine anchor
    const anchorStr = item.recurrence_anchor_date || plan.effective_from;
    let anchor = new Date(anchorStr);
    if (isNaN(anchor.getTime())) { skipped++; continue; }

    // Walk forward from anchor
    let current = new Date(anchor);
    while (current <= horizonEnd) {
      const plannedDate = current.toISOString().split('T')[0];

      // Idempotency check
      const { data: existing } = await dbQuery<MaintenanceOccurrence[]>(
        `maintenance_occurrences?plan_item_id=eq.${item.id}&planned_date=eq.${plannedDate}&select=id`
      );
      if (existing && existing.length > 0) {
        skipped++;
      } else {
        // Compute window
        const windowStart = new Date(current);
        windowStart.setDate(windowStart.getDate() - item.planning_window_days);
        const windowEnd = new Date(current);
        windowEnd.setDate(windowEnd.getDate() + item.planning_window_days);

        // Fetch asset reference for occurrence code
        const { data: assetArr } = await dbQuery<any[]>(`assets?id=eq.${item.asset_id}&select=asset_reference`);
        const assetRef = assetArr?.[0]?.asset_reference || item.asset_id.substring(0, 8);

        const occCode = generateOccurrenceCode(plan.plan_number, assetRef, plannedDate);

        await dbQuery<any>('maintenance_occurrences', {
          method: 'POST',
          body: JSON.stringify({
            occurrence_code: occCode,
            plan_item_id: item.id,
            plan_id: planId,
            asset_id: item.asset_id,
            requirement_id: item.requirement_id,
            planned_date: plannedDate,
            window_start_date: windowStart.toISOString().split('T')[0],
            window_end_date: windowEnd.toISOString().split('T')[0],
            status: 'PLANNED',
          }),
        });
        created++;
      }

      // Advance by interval
      current = new Date(current);
      current.setDate(current.getDate() + intervalDays);
    }
  }

  await recordAuditEvent({
    event_type: 'MAINTENANCE_OCCURRENCE_CREATED',
    object_type: 'maintenance_plans',
    object_id: planId,
    actor_id: session.personId,
    after_state: { created, skipped, horizonMonths },
  });

  return { created, skipped };
}

/**
 * generatePPMWorkOrders — Deterministic. Idempotent.
 * Finds occurrences entering their lead window and creates PPM Work Orders.
 */
export async function generatePPMWorkOrders(
  leadDays: number = 30,
  session: UserSession
): Promise<{ generated: number; skipped: number; errors: string[] }> {
  if (!session) return { generated: 0, skipped: 0, errors: ['Authentication required'] };

  const leadDate = new Date();
  leadDate.setDate(leadDate.getDate() + leadDays);
  const leadDateStr = leadDate.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // Find PLANNED occurrences where window_start_date <= today+leadDays and no work_order yet
  const { data: occurrences } = await dbQuery<MaintenanceOccurrence[]>(
    `maintenance_occurrences?status=eq.PLANNED&window_start_date=lte.${leadDateStr}&select=*`
  );

  let generated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const occ of occurrences || []) {
    if (occ.work_order_id) { skipped++; continue; }

    // Validate asset is serviceable
    const { data: assetArr } = await dbQuery<any[]>(`assets?id=eq.${occ.asset_id}&select=status,name,asset_reference,site_id`);
    const asset = assetArr?.[0];
    if (!asset || asset.status === 'DISPOSED' || asset.status === 'DECOMMISSIONED') {
      skipped++;
      continue;
    }

    // Fetch requirement for description
    const { data: reqArr } = await dbQuery<MaintenanceRequirement[]>(
      `maintenance_requirements?id=eq.${occ.requirement_id}&select=title,required_trade,expected_duration_hours`
    );
    const req = reqArr?.[0];

    const woRecord = {
      site_id: asset.site_id,
      asset_id: occ.asset_id,
      title: req ? `PPM: ${req.title}` : `PPM: ${asset.name || 'Asset'}`,
      description: `Planned preventative maintenance generated from occurrence ${occ.occurrence_code}.`,
      work_order_type: 'PPM',
      priority: 'P3',
      status: 'ISSUED',
      required_trade: req?.required_trade || 'GENERAL',
      target_response_date: occ.planned_date,
      source: 'PPM_AUTOPILOT',
      occurrence_id: occ.id,
      created_at: new Date().toISOString(),
    };

    const { data: woResult, error: woErr } = await dbQuery<any[]>('work_orders?select=id', {
      method: 'POST',
      body: JSON.stringify(woRecord),
    });
    if (woErr) {
      errors.push(`Failed to create WO for occurrence ${occ.occurrence_code}: ${woErr}`);
      continue;
    }

    const workOrderId = woResult?.[0]?.id;
    if (workOrderId) {
      await dbQuery<any>(`maintenance_occurrences?id=eq.${occ.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ work_order_id: workOrderId, status: 'GENERATED', updated_at: new Date().toISOString() }),
      });
      await recordAuditEvent({
        event_type: 'PPM_WORK_ORDER_GENERATED',
        object_type: 'maintenance_occurrences',
        object_id: occ.id,
        actor_id: session.personId,
        actor_type: 'SYSTEM',
        after_state: { workOrderId, occurrenceCode: occ.occurrence_code },
      });
      generated++;
    }
  }

  return { generated, skipped, errors };
}

export async function evaluateOccurrenceSatisfaction(
  occurrenceId: string,
  visitStatus: string,
  session: UserSession
): Promise<{ satisfied: boolean; reason: string }> {
  if (!session) return { satisfied: false, reason: 'Authentication required' };

  if (visitStatus === 'COMPLETED') {
    await dbQuery<any>(`maintenance_occurrences?id=eq.${occurrenceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SATISFIED', satisfied_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
    });
    await recordAuditEvent({
      event_type: 'PPM_OCCURRENCE_SATISFIED',
      object_type: 'maintenance_occurrences',
      object_id: occurrenceId,
      actor_id: session.personId,
      after_state: { status: 'SATISFIED', visitStatus },
    });
    return { satisfied: true, reason: 'Visit completed — occurrence marked SATISFIED.' };
  }

  if (visitStatus === 'NO_ACCESS') {
    await dbQuery<any>(`maintenance_occurrences?id=eq.${occurrenceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'NO_ACCESS', updated_at: new Date().toISOString() }),
    });
    await recordAuditEvent({
      event_type: 'PPM_EXCEPTION_CREATED',
      object_type: 'maintenance_occurrences',
      object_id: occurrenceId,
      actor_id: session.personId,
      after_state: { status: 'NO_ACCESS', visitStatus },
    });
    return { satisfied: false, reason: 'No access — occurrence not satisfied. Follow-up required.' };
  }

  return { satisfied: false, reason: `Visit status "${visitStatus}" does not satisfy occurrence.` };
}

export async function checkMissedOccurrences(
  session: UserSession
): Promise<{ missedCount: number }> {
  if (!session) return { missedCount: 0 };
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: overdue } = await dbQuery<MaintenanceOccurrence[]>(
    `maintenance_occurrences?window_end_date=lt.${todayStr}&status=in.(PLANNED,GENERATED)&select=id`
  );

  let missedCount = 0;
  for (const occ of overdue || []) {
    await dbQuery<any>(`maintenance_occurrences?id=eq.${occ.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'MISSED', missed_reason: 'Window passed without completion', updated_at: new Date().toISOString() }),
    });
    await recordAuditEvent({
      event_type: 'PPM_EXCEPTION_CREATED',
      object_type: 'maintenance_occurrences',
      object_id: occ.id,
      actor_id: session.personId,
      actor_type: 'SYSTEM',
      after_state: { status: 'MISSED', reason: 'Window passed without completion' },
    });
    missedCount++;
  }

  return { missedCount };
}

export async function listOccurrences(filters?: {
  planId?: string;
  assetId?: string;
  status?: string;
  dueBefore?: string;
  dueAfter?: string;
}): Promise<MaintenanceOccurrence[]> {
  let endpoint = 'maintenance_occurrences?select=*&order=planned_date.asc';
  if (filters?.planId) endpoint += `&plan_id=eq.${encodeURIComponent(filters.planId)}`;
  if (filters?.assetId) endpoint += `&asset_id=eq.${encodeURIComponent(filters.assetId)}`;
  if (filters?.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
  if (filters?.dueBefore) endpoint += `&planned_date=lte.${encodeURIComponent(filters.dueBefore)}`;
  if (filters?.dueAfter) endpoint += `&planned_date=gte.${encodeURIComponent(filters.dueAfter)}`;
  const { data } = await dbQuery<MaintenanceOccurrence[]>(endpoint);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// 6. QR LABEL MANAGEMENT
// ─────────────────────────────────────────────────────────────

export async function assignQRIdentifier(
  assetId: string,
  session: UserSession
): Promise<{ qrIdentifier: string | null; error?: string }> {
  if (!session) return { qrIdentifier: null, error: 'Authentication required' };
  const qrIdentifier = generateQRIdentifier(assetId);
  const { error } = await dbQuery<any>(`assets?id=eq.${assetId}`, {
    method: 'PATCH',
    body: JSON.stringify({ qr_identifier: qrIdentifier, updated_at: new Date().toISOString() }),
  });
  if (error) return { qrIdentifier: null, error: String(error) };
  return { qrIdentifier };
}

export async function bulkAssignQRIdentifiers(
  siteId: string,
  session: UserSession
): Promise<{ assigned: number; alreadyHad: number; error?: string }> {
  if (!session) return { assigned: 0, alreadyHad: 0, error: 'Authentication required' };

  const { data: assets } = await dbQuery<any[]>(`assets?site_id=eq.${siteId}&select=id,qr_identifier`);
  let assigned = 0;
  let alreadyHad = 0;

  for (const asset of assets || []) {
    if (asset.qr_identifier) { alreadyHad++; continue; }
    const result = await assignQRIdentifier(asset.id, session);
    if (!result.error) assigned++;
  }

  return { assigned, alreadyHad };
}

// ─────────────────────────────────────────────────────────────
// 7. PPM DASHBOARD & METRICS
// ─────────────────────────────────────────────────────────────

export async function getPPMDashboardMetrics(filters?: {
  clientAccountId?: string;
  siteId?: string;
}): Promise<{
  activePlanItems: number;
  dueThisWeek: number;
  dueThisMonth: number;
  overdue: number;
  satisfied: number;
  exceptions: number;
  unmappedAssets: number;
}> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(); nextMonth.setDate(nextMonth.getDate() + 30);
    const weekStr = nextWeek.toISOString().split('T')[0];
    const monthStr = nextMonth.toISOString().split('T')[0];

    const [itemsRes, weekRes, monthRes, overdueRes, satisfiedRes, candidatesRes] = await Promise.all([
      dbQuery<any[]>('maintenance_plan_items?is_active=eq.true&select=id'),
      dbQuery<any[]>(`maintenance_occurrences?planned_date=gte.${todayStr}&planned_date=lte.${weekStr}&status=in.(PLANNED,GENERATED)&select=id`),
      dbQuery<any[]>(`maintenance_occurrences?planned_date=gte.${todayStr}&planned_date=lte.${monthStr}&status=in.(PLANNED,GENERATED)&select=id`),
      dbQuery<any[]>('maintenance_occurrences?status=eq.MISSED&select=id'),
      dbQuery<any[]>('maintenance_occurrences?status=eq.SATISFIED&select=id'),
      dbQuery<any[]>('asset_candidates?status=eq.PENDING&select=id'),
    ]);

    return {
      activePlanItems: itemsRes.data?.length ?? 0,
      dueThisWeek: weekRes.data?.length ?? 0,
      dueThisMonth: monthRes.data?.length ?? 0,
      overdue: overdueRes.data?.length ?? 0,
      satisfied: satisfiedRes.data?.length ?? 0,
      exceptions: (overdueRes.data?.length ?? 0) + (candidatesRes.data?.length ?? 0),
      unmappedAssets: 0, // Would require LEFT JOIN — return 0 in offline mode
    };
  } catch {
    return { activePlanItems: 0, dueThisWeek: 0, dueThisMonth: 0, overdue: 0, satisfied: 0, exceptions: 0, unmappedAssets: 0 };
  }
}

export async function getMobilisationStatus(planId: string): Promise<{
  planNumber: string;
  status: string;
  totalAssets: number;
  assetsVerified: number;
  assetsNeedingReview: number;
  requirementsMapped: number;
  requirementsNeedingReview: number;
  occurrencesGenerated: number;
  workOrdersGenerated: number;
}> {
  const plan = await getMaintenancePlan(planId);
  if (!plan) {
    return { planNumber: '', status: 'NOT_FOUND', totalAssets: 0, assetsVerified: 0, assetsNeedingReview: 0, requirementsMapped: 0, requirementsNeedingReview: 0, occurrencesGenerated: 0, workOrdersGenerated: 0 };
  }

  const [itemsRes, occRes, woRes] = await Promise.all([
    dbQuery<any[]>(`maintenance_plan_items?plan_id=eq.${planId}&is_active=eq.true&select=id`),
    dbQuery<any[]>(`maintenance_occurrences?plan_id=eq.${planId}&select=id`),
    dbQuery<any[]>(`maintenance_occurrences?plan_id=eq.${planId}&status=eq.GENERATED&select=id`),
  ]);

  return {
    planNumber: plan.plan_number,
    status: plan.status,
    totalAssets: plan.total_assets_count,
    assetsVerified: 0,
    assetsNeedingReview: 0,
    requirementsMapped: itemsRes.data?.length ?? 0,
    requirementsNeedingReview: 0,
    occurrencesGenerated: occRes.data?.length ?? 0,
    workOrdersGenerated: woRes.data?.length ?? 0,
  };
}
