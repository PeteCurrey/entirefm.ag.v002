/**
 * ENTIREFM DATA IMPORT & SIMPRO MIGRATION ENGINE (Phase 0I-PRE)
 * =============================================================
 * Enterprise data staging, column mapping, idempotency, duplicate
 * detection, validation, dry-run preview, atomic commit, and rollback.
 */

import { createHash } from 'node:crypto';
import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession, hasPermission } from '../identity';
import type {
  DataImportBatch,
  DataImportFile,
  DataImportRow,
  DataImportRowStatus,
  DataImportMapping,
  DataImportIssue,
  DataImportEntityType,
  DataImportSource,
  DataImportPreviewSummary,
  DataImportCommitResult,
  DataImportRollbackResult,
  DataStatusSummary,
  ImportFieldDiff,
  ImportConflictDetail,
  DuplicateDecisionChoice,
  DataImportDuplicateDecision,
} from './types';

export type * from './types';

// =============================================================================
// 1. CSV PARSING & FORMULA INJECTION SANITISATION
// =============================================================================

/**
 * Sanitises field values to protect against CSV formula injection (DDE / Excel formula injection).
 */
export function sanitizeCellValue(val: string): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

/**
 * Robust CSV parser supporting quotes, multiline values, BOM, CRLF, and custom delimiters.
 */
export function parseCSV(
  content: string,
  delimiter: string = ','
): { headers: string[]; rows: Record<string, string>[] } {
  if (!content || !content.trim()) {
    throw new Error('Empty CSV: The provided CSV file is empty.');
  }

  // Strip BOM if present
  const cleanContent = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  const rawRows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i];
    const nextChar = cleanContent[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(sanitizeCellValue(currentCell));
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      currentRow.push(sanitizeCellValue(currentCell));
      currentCell = '';
      if (currentRow.some((c) => c.length > 0)) {
        rawRows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(sanitizeCellValue(currentCell));
    if (currentRow.some((c) => c.length > 0)) {
      rawRows.push(currentRow);
    }
  }

  if (rawRows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rawRows[0].map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let r = 1; r < rawRows.length; r++) {
    const rowObj: Record<string, string> = {};
    const values = rawRows[r];
    for (let c = 0; c < headers.length; c++) {
      const headerName = headers[c] || `Column_${c + 1}`;
      rowObj[headerName] = values[c] !== undefined ? values[c] : '';
    }
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Calculates SHA-256 hash of a string or object.
 */
export function calculateHash(data: string | object): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

/**
 * Generates an import batch reference: EFM-IMP-YYYY-NNNNNN
 */
export function generateBatchReference(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `EFM-IMP-${year}-${randomSuffix}`;
}

// =============================================================================
// 2. PRESET MAPPINGS & MAPPING DETECTION
// =============================================================================

export const SYSTEM_PRESET_MAPPINGS: Record<
  string,
  { name: string; entityType: DataImportEntityType; sourceSystem: DataImportSource; mappings: Record<string, string> }
> = {
  SIMPRO_CLIENTS: {
    name: 'SimPRO Default Client Customer Export',
    entityType: 'CLIENT',
    sourceSystem: 'SIMPRO',
    mappings: {
      CustomerID: 'external_id',
      CustomerName: 'name',
      CompanyName: 'company_name',
      AccountNo: 'account_number',
      Email: 'email',
      Phone: 'phone',
      Address: 'address_line1',
      City: 'city',
      State: 'county',
      PostalCode: 'postcode',
      Country: 'country',
      PaymentTerms: 'payment_terms_days',
      CreditLimit: 'credit_limit_gbp',
    },
  },
  SIMPRO_SITES: {
    name: 'SimPRO Default Site Export',
    entityType: 'SITE',
    sourceSystem: 'SIMPRO',
    mappings: {
      SiteID: 'external_id',
      CustomerID: 'parent_client_external_id',
      CustomerName: 'parent_client_name',
      SiteName: 'name',
      SiteCode: 'site_code',
      Address: 'address_line1',
      Street2: 'address_line2',
      City: 'city',
      State: 'county',
      PostalCode: 'postcode',
      Country: 'country',
      SiteType: 'site_type',
    },
  },
  SIMPRO_CONTRACTORS: {
    name: 'SimPRO Default Contractor / Supplier Export',
    entityType: 'CONTRACTOR',
    sourceSystem: 'SIMPRO',
    mappings: {
      SupplierID: 'external_id',
      SupplierName: 'name',
      Trade: 'primary_trade',
      Email: 'email',
      Phone: 'phone',
      Address: 'address_line1',
      City: 'city',
      PostalCode: 'postcode',
      CompanyNumber: 'company_number',
      VATNumber: 'vat_number',
    },
  },
};

/**
 * Automatically suggests column mapping based on headers and entity type.
 */
export function detectMappingPreset(
  headers: string[],
  entityType: DataImportEntityType,
  sourceSystem: DataImportSource = 'SIMPRO'
): Record<string, string> {
  const suggested: Record<string, string> = {};
  const lowerHeaders = headers.map((h) => ({ original: h, normalized: h.toLowerCase().replace(/[^a-z0-9]/g, '') }));

  const targetDict: Record<string, string[]> =
    entityType === 'CLIENT'
      ? {
          external_id: ['customerid', 'clientid', 'accountid', 'id', 'customerno', 'accountno', 'ref'],
          name: ['customername', 'clientname', 'name', 'accountname', 'companyname'],
          company_name: ['companyname', 'tradingname', 'legalname', 'organisationname', 'organisation'],
          account_number: ['accountno', 'accountnumber', 'accno', 'accnumber'],
          email: ['email', 'emailaddress', 'contactemail', 'primaryemail'],
          phone: ['phone', 'telephone', 'phonenumber', 'contactphone', 'mobile'],
          address_line1: ['address', 'addressline1', 'street', 'streetaddress', 'address1'],
          city: ['city', 'town'],
          county: ['state', 'county', 'region'],
          postcode: ['postalcode', 'postcode', 'zip', 'zipcode'],
          country: ['country'],
          payment_terms_days: ['paymentterms', 'terms', 'termsdays'],
          credit_limit_gbp: ['creditlimit', 'limit', 'credit'],
        }
      : entityType === 'SITE'
      ? {
          external_id: ['siteid', 'id', 'ref', 'siteref', 'locationid'],
          parent_client_external_id: ['customerid', 'clientid', 'accountid', 'parentid', 'customerno'],
          parent_client_name: ['customername', 'clientname', 'parentname'],
          name: ['sitename', 'name', 'locationname', 'buildingname', 'site'],
          site_code: ['sitecode', 'code', 'ref', 'sitereference'],
          address_line1: ['address', 'addressline1', 'street', 'streetaddress', 'address1'],
          address_line2: ['street2', 'addressline2', 'address2', 'locality'],
          city: ['city', 'town'],
          county: ['state', 'county', 'region'],
          postcode: ['postalcode', 'postcode', 'zip', 'zipcode'],
          country: ['country'],
          site_type: ['sitetype', 'type', 'category', 'propertytype'],
        }
      : {
          external_id: ['supplierid', 'contractorid', 'vendorid', 'id', 'ref'],
          name: ['suppliername', 'contractorname', 'name', 'companyname', 'vendorname'],
          primary_trade: ['trade', 'primarytrade', 'specialism', 'discipline', 'category'],
          email: ['email', 'emailaddress', 'contactemail'],
          phone: ['phone', 'telephone', 'phonenumber', 'mobile'],
          address_line1: ['address', 'addressline1', 'street', 'streetaddress'],
          city: ['city', 'town'],
          postcode: ['postalcode', 'postcode', 'zip'],
          company_number: ['companynumber', 'companyno', 'crn'],
          vat_number: ['vatnumber', 'vatno', 'vat'],
        };

  for (const item of lowerHeaders) {
    for (const [targetField, aliases] of Object.entries(targetDict)) {
      if (aliases.includes(item.normalized) && !Object.values(suggested).includes(targetField)) {
        suggested[item.original] = targetField;
        break;
      }
    }
  }

  return suggested;
}

// =============================================================================
// 3. ROW VALIDATION & ISSUE EXTRACTION
// =============================================================================

export interface ValidationContext {
  existingClientMap?: Map<string, { id: string; name: string }>;
  existingSiteExtIds?: Set<string>;
  existingContractorExtIds?: Set<string>;
}

export function validateMappedRow(
  rowIndex: number,
  mappedData: Record<string, any>,
  entityType: DataImportEntityType,
  context: ValidationContext = {}
): { status: DataImportRowStatus; issues: DataImportIssue[] } {
  const issues: DataImportIssue[] = [];

  if (entityType === 'CLIENT') {
    const name = (mappedData.name || mappedData.company_name || '').trim();
    if (!name || name.length < 2) {
      issues.push({
        id: `iss-${rowIndex}-name`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'ERROR',
        field_name: 'name',
        issue_code: 'MISSING_CLIENT_NAME',
        message: 'Client or Company Name is required (minimum 2 characters).',
        raw_value: name,
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    }

    if (mappedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mappedData.email)) {
      issues.push({
        id: `iss-${rowIndex}-email`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'WARNING',
        field_name: 'email',
        issue_code: 'INVALID_EMAIL_FORMAT',
        message: `Email '${mappedData.email}' appears malformed.`,
        raw_value: mappedData.email,
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    }

    const hasError = issues.some((i) => i.severity === 'ERROR');
    return { status: hasError ? 'INVALID' : 'VALID', issues };
  }

  if (entityType === 'SITE') {
    const siteName = (mappedData.name || mappedData.address_line1 || '').trim();
    if (!siteName) {
      issues.push({
        id: `iss-${rowIndex}-site-name`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'ERROR',
        field_name: 'name',
        issue_code: 'MISSING_SITE_NAME',
        message: 'Site Name or Address Line 1 is required.',
        raw_value: siteName,
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    }

    const parentExtId = mappedData.parent_client_external_id;
    const parentName = mappedData.parent_client_name;

    if (!parentExtId && !parentName && !mappedData.client_account_id) {
      issues.push({
        id: `iss-${rowIndex}-parent`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'ERROR',
        field_name: 'parent_client_external_id',
        issue_code: 'MISSING_PARENT_CLIENT',
        message: 'Site must be linked to a Parent Client (Customer ID or Customer Name required).',
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    } else if (context.existingClientMap && parentExtId && !context.existingClientMap.has(parentExtId)) {
      issues.push({
        id: `iss-${rowIndex}-parent-unresolved`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'ERROR',
        field_name: 'parent_client_external_id',
        issue_code: 'UNRESOLVED_PARENT_CLIENT',
        message: `Parent client external ID '${parentExtId}' does not exist in EntireCAFM. Please import clients first.`,
        raw_value: parentExtId,
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    }

    const hasError = issues.some((i) => i.severity === 'ERROR');
    return { status: hasError ? 'INVALID' : 'VALID', issues };
  }

  if (entityType === 'CONTRACTOR') {
    const name = (mappedData.name || '').trim();
    if (!name || name.length < 2) {
      issues.push({
        id: `iss-${rowIndex}-contractor-name`,
        batch_id: '',
        row_index: rowIndex,
        severity: 'ERROR',
        field_name: 'name',
        issue_code: 'MISSING_CONTRACTOR_NAME',
        message: 'Contractor Name is required.',
        raw_value: name,
        resolution: 'UNRESOLVED',
        created_at: new Date().toISOString(),
      });
    }

    const hasError = issues.some((i) => i.severity === 'ERROR');
    return { status: hasError ? 'INVALID' : 'VALID', issues };
  }

  return { status: 'VALID', issues: [] };
}

// =============================================================================
// 3b. FUZZY DUPLICATE DETECTION & FIELD DIFF HELPERS
// =============================================================================

const IGNORED_DIFF_FIELDS = new Set([
  'import_batch_id',
  'imported_at',
  'source_hash',
  'source_record_reference',
  'id',
  'parent_client_external_id',
  'parent_client_name',
  'customer_id',
  'customer_name',
  'client_account_id',
  'created_at',
  'updated_at',
  'account_number',
  'payment_terms_days',
  'credit_limit_gbp',
]);

/**
 * Simple token-overlap fuzzy match for organisation names.
 */
export function isFuzzyNameMatch(a: string, b: string): boolean {
  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length >= 3 && !['ltd', 'llp', 'plc', 'inc', 'and', 'the'].includes(t));

  const tokA = tokenize(a);
  const tokB = tokenize(b);
  if (tokA.length === 0 || tokB.length === 0) return false;
  const [shorter, longer] = tokA.length <= tokB.length ? [tokA, tokB] : [tokB, tokA];
  return shorter.every((t) => longer.includes(t));
}

/**
 * Compute field-level diff between two flat record objects.
 */
export function computeFieldDiff(
  existing: Record<string, any>,
  incoming: Record<string, any>
): ImportFieldDiff[] {
  const diffFields: ImportFieldDiff[] = [];
  for (const [field, newVal] of Object.entries(incoming)) {
    if (IGNORED_DIFF_FIELDS.has(field)) continue;
    if (!(field in existing)) continue; // only compare fields present on the existing entity
    const oldVal = existing[field] ?? null;
    const newValStr = newVal == null ? null : String(newVal).trim();
    const oldValStr = oldVal == null ? null : String(oldVal).trim();
    if (oldValStr !== newValStr) {
      diffFields.push({ field, oldValue: oldValStr, newValue: newValStr });
    }
  }
  return diffFields;
}

// =============================================================================
// 4. BATCH CREATION, UPLOAD & STAGING
// =============================================================================

export async function createImportBatch(
  input: {
    entityType: DataImportEntityType;
    sourceSystem?: DataImportSource;
    filename: string;
    fileContent: string;
  },
  session: UserSession
): Promise<{
  batch: DataImportBatch;
  file: DataImportFile;
  suggestedMapping: Record<string, string>;
  sampleHeaders: string[];
  sampleRows: Record<string, string>[];
}> {
  if (!hasPermission(session, 'data_import:create') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:create required to upload import files.');
  }

  const { entityType, sourceSystem = 'SIMPRO', filename, fileContent } = input;
  const batchRef = generateBatchReference();
  const fileChecksum = calculateHash(fileContent);
  const { headers, rows } = parseCSV(fileContent);

  if (headers.length === 0 || rows.length === 0) {
    throw new Error('The uploaded CSV file is empty or contains only headers.');
  }

  const suggestedMapping = detectMappingPreset(headers, entityType, sourceSystem);

  // Insert batch
  const batchRes = await dbQuery<DataImportBatch[]>(
    'data_import_batches',
    {
      method: 'POST',
      body: {
        batch_reference: batchRef,
        entity_type: entityType,
        source_system: sourceSystem,
        status: Object.keys(suggestedMapping).length > 0 ? 'MAPPING_REQUIRED' : 'UPLOADED',
        total_rows: rows.length,
        mapping_config: suggestedMapping,
        created_by_person_id: session.personId,
      },
      headers: { Prefer: 'return=representation' },
    }
  );

  if (!batchRes.data?.[0]) {
    throw new Error(`Failed to create import batch: ${batchRes.error || 'Unknown database error'}`);
  }
  const batch = batchRes.data[0];

  // Insert file record (TRANSIENT: storage_path is null)
  const fileRes = await dbQuery<DataImportFile[]>(
    'data_import_files',
    {
      method: 'POST',
      body: {
        batch_id: batch.id,
        filename,
        file_size_bytes: Buffer.byteLength(fileContent, 'utf8'),
        file_checksum: fileChecksum,
        raw_headers: headers,
        storage_path: null,
      },
      headers: { Prefer: 'return=representation' },
    }
  );

  const file = fileRes.data?.[0] || {
    id: `file-${Date.now()}`,
    batch_id: batch.id,
    filename,
    file_size_bytes: Buffer.byteLength(fileContent, 'utf8'),
    mime_type: 'text/csv',
    file_checksum: fileChecksum,
    raw_headers: headers,
    encoding: 'utf-8',
    delimiter: ',',
    created_at: new Date().toISOString(),
  };

  // Stage raw rows
  const rowInserts = rows.map((rawRow, idx) => ({
    batch_id: batch.id,
    row_index: idx + 1,
    raw_data: rawRow,
    row_hash: calculateHash(rawRow),
    status: 'PENDING',
  }));

  // Batch insert in chunks of 500
  for (let i = 0; i < rowInserts.length; i += 500) {
    const chunk = rowInserts.slice(i, i + 500);
    await dbQuery('data_import_rows', {
      method: 'POST',
      body: chunk,
    });
  }

  await recordAuditEvent({
    event_type: 'DATA_IMPORT_BATCH_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    object_type: 'data_import_batch',
    object_id: batch.id,
    after_state: { batch_reference: batchRef, entity_type: entityType, total_rows: rows.length },
    reason: `Uploaded ${filename} for ${entityType} import`,
  });

  return {
    batch,
    file,
    suggestedMapping,
    sampleHeaders: headers,
    sampleRows: rows.slice(0, 5),
  };
}

// =============================================================================
// 5. COLUMN MAPPING & DRY-RUN VALIDATION (SEMANTICS-AWARE)
// =============================================================================

export async function applyMappingAndValidate(
  batchId: string,
  mapping: Record<string, string>,
  session: UserSession
): Promise<DataImportPreviewSummary> {
  if (!hasPermission(session, 'data_import:map') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:map required to configure import mapping.');
  }

  const batchRes = await dbQuery<DataImportBatch[]>(`data_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchRes.data?.[0];
  if (!batch) throw new Error(`Import batch '${batchId}' not found.`);

  await dbQuery(`data_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: { status: 'VALIDATING', mapping_config: mapping, updated_at: new Date().toISOString() },
  });

  const rowsRes = await dbQuery<DataImportRow[]>(`data_import_rows?batch_id=eq.${batchId}&select=*&order=row_index.asc`);
  const stagedRows = rowsRes.data || [];

  // Build validation context
  const validationCtx: ValidationContext = {};
  if (batch.entity_type === 'SITE') {
    const clientsRes = await dbQuery<any[]>('client_accounts?select=id,organisation_id,external_id');
    const orgsRes = await dbQuery<any[]>('organisations?select=id,name,external_id');
    const clientMap = new Map<string, { id: string; name: string }>();
    const orgMap = new Map<string, string>();
    for (const o of orgsRes.data || []) {
      if (o.id && o.name) orgMap.set(o.id, o.name);
      if (o.name) clientMap.set(o.name.toLowerCase(), { id: o.id, name: o.name });
      if (o.external_id) clientMap.set(o.external_id, { id: o.id, name: o.name });
    }
    for (const c of clientsRes.data || []) {
      const name = orgMap.get(c.organisation_id) || 'Client';
      if (c.external_id) clientMap.set(c.external_id, { id: c.id, name });
      if (c.id) clientMap.set(c.id, { id: c.id, name });
    }
    validationCtx.existingClientMap = clientMap;
  }

  // Fetch existing records for hash-level and fuzzy dedup
  const existingByExtId = new Map<string, { id: string; source_hash: string; record: Record<string, any> }>();
  const existingNames: Array<{ id: string; name: string }> = [];

  if (batch.entity_type === 'CLIENT') {
    const orgRes = await dbQuery<any[]>(`organisations?org_type=eq.CLIENT&select=id,name,external_id,source_hash,email,phone,created_at,updated_at,imported_at`);
    for (const o of orgRes.data || []) {
      if (o.external_id) existingByExtId.set(o.external_id, { id: o.id, source_hash: o.source_hash || '', record: o });
      if (o.name) existingNames.push({ id: o.id, name: o.name });
    }
  } else if (batch.entity_type === 'SITE') {
    const extRes = await dbQuery<any[]>(
      `sites?source_system=eq.${batch.source_system}&external_id=not.is.null&select=id,external_id,source_hash,name,postcode,address_line1,city,source_record_reference,created_at,updated_at,imported_at`
    );
    for (const s of extRes.data || []) {
      if (s.external_id) existingByExtId.set(s.external_id, { id: s.id, source_hash: s.source_hash || '', record: s });
      if (s.name) existingNames.push({ id: s.id, name: s.name });
    }
  } else if (batch.entity_type === 'CONTRACTOR') {
    const orgRes = await dbQuery<any[]>(`organisations?org_type=eq.CONTRACTOR&select=id,name,external_id,source_hash,created_at,updated_at,imported_at`);
    for (const o of orgRes.data || []) {
      if (o.external_id) existingByExtId.set(o.external_id, { id: o.id, source_hash: o.source_hash || '', record: o });
      if (o.name) existingNames.push({ id: o.id, name: o.name });
    }
  }

  let validCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  let unchangedCount = 0;
  let changeDetectedCount = 0;
  let possibleDuplicateCount = 0;
  let conflictCount = 0;
  const allIssues: DataImportIssue[] = [];
  const sampleMappedRows: DataImportPreviewSummary['sampleMappedRows'] = [];

  await dbQuery(`data_import_issues?batch_id=eq.${batchId}`, { method: 'DELETE' });

  for (const row of stagedRows) {
    const mapped: Record<string, any> = {};
    for (const [sourceCol, targetField] of Object.entries(mapping)) {
      if (targetField && row.raw_data[sourceCol] !== undefined) {
        mapped[targetField] = row.raw_data[sourceCol];
      }
    }

    const { status: validStatus, issues } = validateMappedRow(row.row_index, mapped, batch.entity_type, validationCtx);
    const rowIssuesWithBatch = issues.map((iss) => ({ ...iss, batch_id: batchId, row_id: row.id }));

    let rowStatus: DataImportRowStatus = validStatus;
    let changeDiff: ImportFieldDiff[] | undefined;
    let conflictDetails: ImportConflictDetail[] | undefined;
    let matchedEntityId: string | undefined;
    let matchReason: string | undefined;
    let preImportSnapshot: Record<string, any> | undefined;

    if (validStatus === 'VALID') {
      const extId = mapped.external_id as string | undefined;

      if (extId && existingByExtId.has(extId)) {
        const existing = existingByExtId.get(extId)!;
        matchedEntityId = existing.id;
        matchReason = `Exact external_id match: ${extId}`;
        preImportSnapshot = existing.record;

        // Compare field values
        const diff = computeFieldDiff(existing.record, mapped);

        if (diff.length === 0) {
          rowStatus = 'UNCHANGED';
          unchangedCount++;
        } else {
          changeDiff = diff;
          const existingRec = existing.record as any;
          const hasLocalEnrichment =
            existingRec.updated_at &&
            existingRec.imported_at &&
            new Date(existingRec.updated_at).getTime() > new Date(existingRec.imported_at).getTime() + 1000;

          if (hasLocalEnrichment) {
            rowStatus = 'CONFLICT';
            conflictDetails = diff.map((d) => ({
              field: d.field,
              lastImportedValue: existing.source_hash ? d.oldValue : null,
              currentCafmValue: d.oldValue,
              incomingValue: d.newValue,
              cafmModifiedAt: existingRec.updated_at,
            }));
            conflictCount++;
          } else {
            rowStatus = 'CHANGE_DETECTED';
            changeDetectedCount++;
          }
        }
      } else if (!extId) {
        const incomingName = (mapped.name || mapped.company_name || '').trim();
        if (incomingName) {
          const fuzzyMatch = existingNames.find((e) => isFuzzyNameMatch(incomingName, e.name));
          if (fuzzyMatch) {
            rowStatus = 'POSSIBLE_DUPLICATE';
            matchedEntityId = fuzzyMatch.id;
            matchReason = `Fuzzy name match: "${incomingName}" ≈ "${fuzzyMatch.name}"`;
            possibleDuplicateCount++;
          } else {
            rowStatus = 'VALID';
            validCount++;
          }
        } else {
          rowStatus = 'VALID';
          validCount++;
        }
      } else {
        rowStatus = 'VALID';
        validCount++;
      }
    } else {
      errorCount++;
    }

    allIssues.push(...rowIssuesWithBatch);

    await dbQuery(`data_import_rows?id=eq.${row.id}`, {
      method: 'PATCH',
      body: {
        mapped_data: mapped,
        external_id: mapped.external_id || null,
        status: rowStatus,
        matched_entity_id: matchedEntityId || null,
        match_reason: matchReason || null,
        change_diff: changeDiff ? JSON.stringify(changeDiff) : null,
        conflict_details: conflictDetails ? JSON.stringify(conflictDetails) : null,
        pre_import_snapshot: preImportSnapshot ? JSON.stringify(preImportSnapshot) : null,
        error_messages: issues.filter((i) => i.severity === 'ERROR').map((i) => i.message),
        warning_messages: issues.filter((i) => i.severity === 'WARNING').map((i) => i.message),
        updated_at: new Date().toISOString(),
      },
    });

    if (sampleMappedRows.length < 10) {
      const displayName = mapped.name || mapped.company_name || mapped.address_line1 || `Row #${row.row_index}`;
      const details =
        batch.entity_type === 'SITE'
          ? `${mapped.city || ''} ${mapped.postcode || ''} (Client: ${mapped.parent_client_external_id || mapped.parent_client_name || 'None'})`
          : `${mapped.email || ''} · ${mapped.phone || ''}`;

      sampleMappedRows.push({
        rowIndex: row.row_index,
        status: rowStatus,
        externalId: mapped.external_id,
        displayName,
        details,
        issues: issues.map((i) => `[${i.severity}] ${i.message}`),
        changeDiff,
      });
    }
  }

  if (allIssues.length > 0) {
    for (let i = 0; i < allIssues.length; i += 200) {
      const chunk = allIssues.slice(i, i + 200);
      await dbQuery('data_import_issues', {
        method: 'POST',
        body: chunk.map((iss) => ({
          batch_id: batchId,
          row_id: iss.row_id,
          row_index: iss.row_index,
          severity: iss.severity,
          field_name: iss.field_name,
          issue_code: iss.issue_code,
          message: iss.message,
          raw_value: iss.raw_value,
        })),
      });
    }
  }

  const finalStatus = errorCount > 0 && validCount === 0 && unchangedCount === 0 && changeDetectedCount === 0 ? 'VALIDATION_FAILED' : 'READY_FOR_REVIEW';

  await dbQuery(`data_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: {
      status: finalStatus,
      valid_rows: validCount,
      error_rows: errorCount,
      duplicate_rows: duplicateCount,
      unchanged_rows: unchangedCount,
      change_detected_rows: changeDetectedCount,
      possible_duplicate_rows: possibleDuplicateCount,
      conflict_rows: conflictCount,
      updated_at: new Date().toISOString(),
    },
  });

  return {
    batchId,
    batchReference: batch.batch_reference,
    entityType: batch.entity_type,
    sourceSystem: batch.source_system,
    totalRows: stagedRows.length,
    validRows: validCount,
    errorRows: errorCount,
    duplicateRows: duplicateCount,
    unchangedRows: unchangedCount,
    changeDetectedRows: changeDetectedCount,
    possibleDuplicateRows: possibleDuplicateCount,
    conflictRows: conflictCount,
    newRows: validCount,
    matchedExistingRows: unchangedCount + changeDetectedCount + duplicateCount,
    blockedRows: errorCount + possibleDuplicateCount + conflictCount,
    issues: allIssues,
    sampleMappedRows,
  };
}

// =============================================================================
// 6. COMMIT IMPORT (CANONICAL RECORD GENERATION)
// =============================================================================

export async function commitImport(
  batchId: string,
  session: UserSession
): Promise<DataImportCommitResult> {
  if (!hasPermission(session, 'data_import:commit') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:commit required to commit imported records.');
  }

  const batchRes = await dbQuery<DataImportBatch[]>(`data_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchRes.data?.[0];
  if (!batch) throw new Error(`Import batch '${batchId}' not found.`);

  if (batch.status !== 'READY_FOR_REVIEW' && batch.status !== 'VALIDATING') {
    throw new Error(`Batch status '${batch.status}' cannot be committed. Must be READY_FOR_REVIEW.`);
  }

  // Pre-commit gate: block if POSSIBLE_DUPLICATE or CONFLICT rows lack decisions
  const unresolvedRes = await dbQuery<DataImportRow[]>(
    `data_import_rows?batch_id=eq.${batchId}&status=in.(POSSIBLE_DUPLICATE,CONFLICT)&select=id,row_index,status`
  );
  const unresolvedRows = unresolvedRes.data || [];

  if (unresolvedRows.length > 0) {
    const decisionRes = await dbQuery<any[]>(
      `data_import_duplicate_decisions?batch_id=eq.${batchId}&select=row_id`
    );
    const decidedRowIds = new Set((decisionRes.data || []).map((d) => d.row_id));
    const stillBlocked = unresolvedRows.filter((r) => !decidedRowIds.has(r.id));

    if (stillBlocked.length > 0) {
      throw new Error(
        `Cannot commit: ${stillBlocked.length} row(s) require human review before commit ` +
          `(POSSIBLE_DUPLICATE or CONFLICT). Rows: ${stillBlocked.map((r) => r.row_index).join(', ')}. ` +
          `Use resolveImportDuplicate() to record a decision for each row.`
      );
    }
  }

  await dbQuery(`data_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: { status: 'IMPORTING', updated_at: new Date().toISOString() },
  });

  const rowsRes = await dbQuery<DataImportRow[]>(
    `data_import_rows?batch_id=eq.${batchId}&status=in.(VALID,DUPLICATE,UNCHANGED,CHANGE_DETECTED,POSSIBLE_DUPLICATE,CONFLICT)&select=*&order=row_index.asc`
  );
  const rows = rowsRes.data || [];

  const allDecisionsRes = await dbQuery<any[]>(
    `data_import_duplicate_decisions?batch_id=eq.${batchId}&select=row_id,decision,candidate_entity_id`
  );
  const decisionByRowId = new Map<string, { decision: string; candidateEntityId?: string }>(
    (allDecisionsRes.data || []).map((d) => [d.row_id, { decision: d.decision, candidateEntityId: d.candidate_entity_id }])
  );

  const createdEntityIds: string[] = [];
  const updatedEntityIds: string[] = [];
  const errors: string[] = [];
  const blockedRowsResult: Array<{ rowIndex: number; reason: string }> = [];
  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let blockedCount = 0;

  for (const row of rows) {
    try {
      const mapped = row.mapped_data;
      const rowHash = row.row_hash;
      const extId = row.external_id || mapped?.external_id;

      // UNCHANGED: zero writes
      if (row.status === 'UNCHANGED') {
        skippedCount++;
        await dbQuery(`data_import_rows?id=eq.${row.id}`, {
          method: 'PATCH',
          body: { status: 'SKIPPED' },
        });
        continue;
      }

      // DUPLICATE: skip
      if (row.status === 'DUPLICATE') {
        skippedCount++;
        continue;
      }

      // POSSIBLE_DUPLICATE / CONFLICT: act on decision
      if (row.status === 'POSSIBLE_DUPLICATE' || row.status === 'CONFLICT') {
        const dec = decisionByRowId.get(row.id);
        if (!dec) {
          blockedCount++;
          blockedRowsResult.push({ rowIndex: row.row_index, reason: `No decision recorded for ${row.status} row` });
          await dbQuery(`data_import_rows?id=eq.${row.id}`, {
            method: 'PATCH',
            body: { status: 'ROLLBACK_BLOCKED' },
          });
          continue;
        }
        if (dec.decision === 'IGNORE_ROW' || dec.decision === 'USE_EXISTING') {
          skippedCount++;
          await dbQuery(`data_import_rows?id=eq.${row.id}`, { method: 'PATCH', body: { status: 'SKIPPED' } });
          continue;
        }
        // CREATE_NEW falls through to normal create
      }

      // CHANGE_DETECTED: update existing record field by field
      if (row.status === 'CHANGE_DETECTED' && row.matched_entity_id) {
        let diff: ImportFieldDiff[] = [];
        if (row.change_diff) {
          diff = typeof row.change_diff === 'string' ? JSON.parse(row.change_diff) : row.change_diff;
        }
        if (diff.length > 0) {
          const patchBody: Record<string, any> = { updated_at: new Date().toISOString(), source_hash: rowHash };
          for (const d of diff) {
            patchBody[d.field] = d.newValue;
          }

          if (batch.entity_type === 'CLIENT') {
            await dbQuery(`organisations?id=eq.${row.matched_entity_id}`, { method: 'PATCH', body: patchBody });
          } else if (batch.entity_type === 'SITE') {
            await dbQuery(`sites?id=eq.${row.matched_entity_id}`, { method: 'PATCH', body: patchBody });
          } else if (batch.entity_type === 'CONTRACTOR') {
            await dbQuery(`organisations?id=eq.${row.matched_entity_id}`, { method: 'PATCH', body: patchBody });
          }

          updatedEntityIds.push(row.matched_entity_id);
          updatedCount++;
          await dbQuery(`data_import_rows?id=eq.${row.id}`, {
            method: 'PATCH',
            body: { status: 'IMPORTED', target_entity_id: row.matched_entity_id },
          });
        } else {
          skippedCount++;
          await dbQuery(`data_import_rows?id=eq.${row.id}`, { method: 'PATCH', body: { status: 'SKIPPED' } });
        }
        continue;
      }

      // VALID (new record creation)
      if (batch.entity_type === 'CLIENT') {
        const orgRes = await dbQuery<any[]>('organisations', {
          method: 'POST',
          body: {
            name: mapped.name || mapped.company_name,
            legal_name: mapped.company_name || mapped.name,
            code: `CLI-${extId || Math.floor(1000 + Math.random() * 9000)}`,
            org_type: 'CLIENT',
            status: 'ACTIVE',
            email: mapped.email || null,
            phone: mapped.phone || null,
            source_system: batch.source_system,
            external_id: extId || null,
            import_batch_id: batchId,
            imported_at: new Date().toISOString(),
            source_record_reference: `${batch.source_system} Customer #${extId || row.row_index}`,
            source_hash: rowHash,
          },
          headers: { Prefer: 'return=representation' },
        });

        const orgId = orgRes.data?.[0]?.id || `org-${Date.now()}`;
        const clientRes = await dbQuery<any[]>('client_accounts', {
          method: 'POST',
          body: {
            organisation_id: orgId,
            account_code: mapped.account_number || `ACC-${extId || row.row_index}`,
            payment_terms_days: mapped.payment_terms_days ? Number(mapped.payment_terms_days) : 30,
            billing_currency: 'GBP',
            status: 'ACTIVE',
            source_system: batch.source_system,
            external_id: extId || null,
            import_batch_id: batchId,
            imported_at: new Date().toISOString(),
            source_record_reference: `${batch.source_system} Customer #${extId || row.row_index}`,
            source_hash: rowHash,
          },
          headers: { Prefer: 'return=representation' },
        });

        const targetId = clientRes.data?.[0]?.id || orgId;
        createdEntityIds.push(targetId);
        await dbQuery(`data_import_rows?id=eq.${row.id}`, {
          method: 'PATCH',
          body: { status: 'IMPORTED', target_entity_id: targetId },
        });
        importedCount++;

      } else if (batch.entity_type === 'SITE') {
        let clientOrgId = session.orgId;
        let clientAccountId: string | null = mapped.client_account_id || null;
        if (!clientAccountId && mapped.parent_client_external_id) {
          const clientFind = await dbQuery<any[]>(
            `client_accounts?source_system=eq.${batch.source_system}&external_id=eq.${mapped.parent_client_external_id}&select=id,organisation_id`
          );
          clientAccountId = clientFind.data?.[0]?.id || null;
          clientOrgId = clientFind.data?.[0]?.organisation_id || session.orgId;
        }
        if (!clientAccountId && mapped.parent_client_name) {
          const clientFindByName = await dbQuery<any[]>(`organisations?name=ilike.%${mapped.parent_client_name}%&select=id`);
          if (clientFindByName.data?.[0]?.id) {
            clientOrgId = clientFindByName.data[0].id;
            const caRes = await dbQuery<any[]>(`client_accounts?organisation_id=eq.${clientOrgId}&select=id`);
            clientAccountId = caRes.data?.[0]?.id || null;
          }
        }

        const siteCode = mapped.site_code || `STE-${extId || Math.floor(1000 + Math.random() * 9000)}`;
        const siteRes = await dbQuery<any[]>('sites', {
          method: 'POST',
          body: {
            organisation_id: clientOrgId,
            site_code: siteCode,
            name: mapped.name || mapped.address_line1,
            address_line1: mapped.address_line1 || 'Address on file',
            address_line2: mapped.address_line2 || null,
            city: mapped.city || 'United Kingdom',
            county: mapped.county || null,
            postcode: mapped.postcode || 'SW1A 1AA',
            country: mapped.country || 'GB',
            status: 'ACTIVE',
            source_system: batch.source_system,
            external_id: extId || null,
            import_batch_id: batchId,
            imported_at: new Date().toISOString(),
            source_record_reference: `${batch.source_system} Site #${extId || row.row_index}`,
            source_hash: rowHash,
          },
          headers: { Prefer: 'return=representation' },
        });

        const targetId = siteRes.data?.[0]?.id || `site-${Date.now()}`;
        createdEntityIds.push(targetId);
        await dbQuery(`data_import_rows?id=eq.${row.id}`, {
          method: 'PATCH',
          body: { status: 'IMPORTED', target_entity_id: targetId },
        });
        importedCount++;

      } else if (batch.entity_type === 'CONTRACTOR') {
        const orgRes = await dbQuery<any[]>('organisations', {
          method: 'POST',
          body: {
            name: mapped.name || mapped.company_name,
            legal_name: mapped.company_name || mapped.name,
            code: `PRV-${extId || Math.floor(1000 + Math.random() * 9000)}`,
            org_type: 'CONTRACTOR',
            status: 'ACTIVE',
            email: mapped.email || null,
            phone: mapped.phone || null,
            company_number: mapped.company_number || null,
            vat_number: mapped.vat_number || null,
            source_system: batch.source_system,
            external_id: extId || null,
            import_batch_id: batchId,
            imported_at: new Date().toISOString(),
            source_record_reference: `${batch.source_system} Supplier #${extId || row.row_index}`,
            source_hash: rowHash,
          },
          headers: { Prefer: 'return=representation' },
        });

        const orgId = orgRes.data?.[0]?.id || `org-${Date.now()}`;
        const provRes = await dbQuery<any[]>('provider_organisations', {
          method: 'POST',
          body: {
            organisation_id: orgId,
            primary_trade: mapped.primary_trade || 'GENERAL_MAINTENANCE',
            vetting_status: 'PENDING',
            is_active: false,
            source_system: batch.source_system,
            external_id: extId || null,
            import_batch_id: batchId,
            imported_at: new Date().toISOString(),
            source_record_reference: `${batch.source_system} Supplier #${extId || row.row_index}`,
            source_hash: rowHash,
          },
          headers: { Prefer: 'return=representation' },
        });

        const targetId = provRes.data?.[0]?.id || orgId;
        createdEntityIds.push(targetId);
        await dbQuery(`data_import_rows?id=eq.${row.id}`, {
          method: 'PATCH',
          body: { status: 'IMPORTED', target_entity_id: targetId },
        });
        importedCount++;
      }
    } catch (err: any) {
      errors.push(`Row ${row.row_index}: ${err.message || String(err)}`);
      await dbQuery(`data_import_rows?id=eq.${row.id}`, {
        method: 'PATCH',
        body: { status: 'FAILED', error_messages: [err.message || String(err)] },
      });
    }
  }

  const finalStatus = errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED';

  await dbQuery(`data_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: {
      status: finalStatus,
      imported_rows: importedCount,
      committed_by_person_id: session.personId,
      committed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  await recordAuditEvent({
    event_type: 'DATA_IMPORT_BATCH_COMMITTED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    object_type: 'data_import_batch',
    object_id: batchId,
    after_state: {
      batch_reference: batch.batch_reference,
      imported_count: importedCount,
      updated_count: updatedCount,
      skipped_count: skippedCount,
      blocked_count: blockedCount,
      error_count: errors.length,
    },
    reason: `Committed ${importedCount} records, updated ${updatedCount} for ${batch.entity_type} import`,
  });

  return {
    success: errors.length === 0 && blockedCount === 0,
    batchId,
    batchReference: batch.batch_reference,
    importedCount,
    updatedCount,
    skippedCount,
    blockedCount,
    errorCount: errors.length,
    createdEntityIds,
    updatedEntityIds,
    blockedRows: blockedRowsResult,
    errors,
  };
}

// =============================================================================
// 7. ROLLBACK IMPORT (DEPENDENCY-AWARE)
// =============================================================================

export async function rollbackImport(
  batchId: string,
  session: UserSession
): Promise<DataImportRollbackResult> {
  if (!hasPermission(session, 'data_import:rollback') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:rollback required to rollback an import batch.');
  }

  const batchRes = await dbQuery<DataImportBatch[]>(`data_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchRes.data?.[0];
  if (!batch) throw new Error(`Import batch '${batchId}' not found.`);

  if (batch.status === 'ROLLED_BACK') {
    return {
      success: true,
      batchId,
      batchReference: batch.batch_reference,
      rolledBackCount: batch.rolled_back_rows,
      blockedCount: 0,
      reasons: ['Batch was already rolled back.'],
      blockedReasons: [],
    };
  }

  const importedRowsRes = await dbQuery<DataImportRow[]>(
    `data_import_rows?batch_id=eq.${batchId}&status=eq.IMPORTED&select=*`
  );
  const importedRows = importedRowsRes.data || [];

  let rolledBackCount = 0;
  let blockedCount = 0;
  const reasons: string[] = [];
  const blockedReasons: Array<{ entityId: string; entityType: string; reason: string }> = [];

  for (const row of importedRows) {
    const entityId = row.target_entity_id;
    if (!entityId) continue;

    let dependencyReason: string | null = null;

    if (batch.entity_type === 'SITE') {
      const woRes = await dbQuery<any[]>(`work_orders?site_id=eq.${entityId}&select=id&limit=1`);
      if ((woRes.data || []).length > 0) {
        dependencyReason = `Site has downstream Work Orders. Cannot automatically remove.`;
      }
      if (!dependencyReason) {
        const assetRes = await dbQuery<any[]>(`assets?site_id=eq.${entityId}&select=id&limit=1`);
        if ((assetRes.data || []).length > 0) {
          dependencyReason = `Site has downstream Assets. Cannot automatically remove.`;
        }
      }
    } else if (batch.entity_type === 'CLIENT') {
      const siteRes = await dbQuery<any[]>(`sites?organisation_id=eq.${entityId}&select=id&limit=1`);
      if ((siteRes.data || []).length > 0) {
        dependencyReason = `Client org has dependent Sites. Cannot automatically remove.`;
      }
    }

    if (!dependencyReason) {
      let currentRecord: any = null;
      if (batch.entity_type === 'SITE') {
        const recRes = await dbQuery<any[]>(`sites?id=eq.${entityId}&select=updated_at,imported_at,source_hash`);
        currentRecord = recRes.data?.[0];
      } else if (batch.entity_type === 'CLIENT' || batch.entity_type === 'CONTRACTOR') {
        const recRes = await dbQuery<any[]>(`organisations?id=eq.${entityId}&select=updated_at,imported_at,source_hash`);
        currentRecord = recRes.data?.[0];
      }

      if (currentRecord?.updated_at && currentRecord?.imported_at &&
          new Date(currentRecord.updated_at).getTime() > new Date(currentRecord.imported_at).getTime() + 1000) {
        dependencyReason = `Record was manually edited after import (updated_at: ${currentRecord.updated_at}). Rollback would destroy post-import enrichment.`;
      }
    }

    if (dependencyReason) {
      blockedCount++;
      blockedReasons.push({ entityId, entityType: batch.entity_type, reason: dependencyReason });
      await dbQuery(`data_import_rows?id=eq.${row.id}`, {
        method: 'PATCH',
        body: { status: 'ROLLBACK_BLOCKED' },
      });
      reasons.push(`Row ${row.row_index}: BLOCKED — ${dependencyReason}`);
    } else {
      if (batch.entity_type === 'SITE') {
        await dbQuery(`sites?id=eq.${entityId}`, { method: 'DELETE' });
      } else if (batch.entity_type === 'CLIENT') {
        await dbQuery(`client_accounts?import_batch_id=eq.${batchId}`, { method: 'DELETE' });
        await dbQuery(`organisations?id=eq.${entityId}`, { method: 'DELETE' });
      } else if (batch.entity_type === 'CONTRACTOR') {
        await dbQuery(`provider_organisations?import_batch_id=eq.${batchId}`, { method: 'DELETE' });
        await dbQuery(`organisations?id=eq.${entityId}`, { method: 'DELETE' });
      }
      rolledBackCount++;
      await dbQuery(`data_import_rows?id=eq.${row.id}`, {
        method: 'PATCH',
        body: { status: 'ROLLED_BACK' },
      });
    }
  }

  const newBatchStatus = blockedCount > 0 ? (rolledBackCount > 0 ? 'COMPLETED_WITH_ERRORS' : 'FAILED') : 'ROLLED_BACK';

  await dbQuery(`data_import_batches?id=eq.${batchId}`, {
    method: 'PATCH',
    body: {
      status: newBatchStatus,
      rolled_back_rows: rolledBackCount,
      rolled_back_by_person_id: session.personId,
      rolled_back_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  await recordAuditEvent({
    event_type: 'DATA_IMPORT_BATCH_ROLLED_BACK',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    object_type: 'data_import_batch',
    object_id: batchId,
    after_state: {
      batch_reference: batch.batch_reference,
      rolled_back_count: rolledBackCount,
      blocked_count: blockedCount,
    },
    reason: `Rolled back import batch ${batch.batch_reference}: ${rolledBackCount} removed, ${blockedCount} blocked`,
  });

  return {
    success: blockedCount === 0,
    batchId,
    batchReference: batch.batch_reference,
    rolledBackCount,
    blockedCount,
    reasons,
    blockedReasons,
  };
}

// =============================================================================
// 7b. DUPLICATE RESOLUTION, ROW DIFF & ROLLBACK SAFETY PRE-FLIGHT
// =============================================================================

/**
 * Records human reviewer decision for a POSSIBLE_DUPLICATE or CONFLICT import row.
 */
export async function resolveImportDuplicate(
  input: {
    batchId: string;
    rowId: string;
    decision: DuplicateDecisionChoice;
    candidateEntityId?: string;
    notes?: string;
  },
  session: UserSession
): Promise<{ success: boolean; decisionId: string }> {
  if (!hasPermission(session, 'data_import:map') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:map required to resolve import duplicates.');
  }

  const { batchId, rowId, decision, candidateEntityId, notes } = input;

  const rowRes = await dbQuery<DataImportRow[]>(`data_import_rows?id=eq.${rowId}&select=*`);
  const row = rowRes.data?.[0];
  if (!row) throw new Error(`Import row '${rowId}' not found.`);

  const importedName = row.mapped_data?.name || row.mapped_data?.company_name || `Row #${row.row_index}`;
  const matchReason = row.match_reason || 'Manual review resolution';

  let candidateName = '';
  if (candidateEntityId) {
    const orgRes = await dbQuery<any[]>(`organisations?id=eq.${candidateEntityId}&select=name`);
    if (orgRes.data?.[0]?.name) {
      candidateName = orgRes.data[0].name;
    } else {
      const siteRes = await dbQuery<any[]>(`sites?id=eq.${candidateEntityId}&select=name`);
      candidateName = siteRes.data?.[0]?.name || '';
    }
  }

  const decRes = await dbQuery<DataImportDuplicateDecision[]>('data_import_duplicate_decisions', {
    method: 'POST',
    body: {
      batch_id: batchId,
      row_id: rowId,
      imported_name: importedName,
      candidate_entity_id: candidateEntityId || row.matched_entity_id || null,
      candidate_name: candidateName || null,
      match_reason: matchReason,
      decision,
      decided_by_person_id: session.personId,
      notes: notes || null,
    },
    headers: { Prefer: 'return=representation' },
  });

  const decisionId = decRes.data?.[0]?.id || `dec-${Date.now()}`;

  await recordAuditEvent({
    event_type: 'DATA_IMPORT_DUPLICATE_DECISION_RECORDED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    object_type: 'data_import_duplicate_decision',
    object_id: decisionId,
    after_state: {
      batch_id: batchId,
      row_id: rowId,
      decision,
      imported_name: importedName,
      candidate_entity_id: candidateEntityId,
    },
    reason: `Resolved duplicate for row #${row.row_index} (${importedName}) with decision: ${decision}`,
  });

  return { success: true, decisionId };
}

/**
 * Retrieves the field-level change diff and conflict details for an import row.
 */
export async function getImportRowDiff(
  batchId: string,
  rowId: string,
  session: UserSession
): Promise<{
  rowId: string;
  rowIndex: number;
  status: DataImportRowStatus;
  externalId?: string;
  matchedEntityId?: string;
  matchReason?: string;
  changeDiff: ImportFieldDiff[];
  conflictDetails: ImportConflictDetail[];
  preImportSnapshot?: Record<string, any>;
}> {
  if (!hasPermission(session, 'data_import:view') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:view required.');
  }

  const rowRes = await dbQuery<DataImportRow[]>(`data_import_rows?id=eq.${rowId}&batch_id=eq.${batchId}&select=*`);
  const row = rowRes.data?.[0];
  if (!row) throw new Error(`Import row '${rowId}' not found.`);

  let changeDiff: ImportFieldDiff[] = [];
  if (row.change_diff) {
    changeDiff = typeof row.change_diff === 'string' ? JSON.parse(row.change_diff) : row.change_diff;
  }
  let conflictDetails: ImportConflictDetail[] = [];
  if (row.conflict_details) {
    conflictDetails = typeof row.conflict_details === 'string' ? JSON.parse(row.conflict_details) : row.conflict_details;
  }
  let preImportSnapshot: Record<string, any> | undefined;
  if (row.pre_import_snapshot) {
    preImportSnapshot = typeof row.pre_import_snapshot === 'string' ? JSON.parse(row.pre_import_snapshot) : row.pre_import_snapshot;
  }

  return {
    rowId: row.id,
    rowIndex: row.row_index,
    status: row.status,
    externalId: row.external_id,
    matchedEntityId: row.matched_entity_id,
    matchReason: row.match_reason,
    changeDiff: changeDiff || [],
    conflictDetails: conflictDetails || [],
    preImportSnapshot,
  };
}

/**
 * Pre-flight check: evaluates whether an import batch can be safely rolled back.
 */
export async function checkRollbackSafety(
  batchId: string,
  session: UserSession
): Promise<{
  canSafelyRollback: boolean;
  importedCount: number;
  safeCount: number;
  blockedCount: number;
  blockedReasons: Array<{ entityId: string; entityType: string; reason: string }>;
}> {
  if (!hasPermission(session, 'data_import:view') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:view required.');
  }

  const batchRes = await dbQuery<DataImportBatch[]>(`data_import_batches?id=eq.${batchId}&select=*`);
  const batch = batchRes.data?.[0];
  if (!batch) throw new Error(`Import batch '${batchId}' not found.`);

  const importedRowsRes = await dbQuery<DataImportRow[]>(
    `data_import_rows?batch_id=eq.${batchId}&status=eq.IMPORTED&select=*`
  );
  const importedRows = importedRowsRes.data || [];

  let safeCount = 0;
  let blockedCount = 0;
  const blockedReasons: Array<{ entityId: string; entityType: string; reason: string }> = [];

  for (const row of importedRows) {
    const entityId = row.target_entity_id;
    if (!entityId) continue;

    let dependencyReason: string | null = null;

    if (batch.entity_type === 'SITE') {
      const woRes = await dbQuery<any[]>(`work_orders?site_id=eq.${entityId}&select=id&limit=1`);
      if ((woRes.data || []).length > 0) {
        dependencyReason = `Site has downstream Work Orders. Cannot automatically remove.`;
      }
      if (!dependencyReason) {
        const assetRes = await dbQuery<any[]>(`assets?site_id=eq.${entityId}&select=id&limit=1`);
        if ((assetRes.data || []).length > 0) {
          dependencyReason = `Site has downstream Assets. Cannot automatically remove.`;
        }
      }
    } else if (batch.entity_type === 'CLIENT') {
      const siteRes = await dbQuery<any[]>(`sites?organisation_id=eq.${entityId}&select=id&limit=1`);
      if ((siteRes.data || []).length > 0) {
        dependencyReason = `Client org has dependent Sites. Cannot automatically remove.`;
      }
    }

    if (!dependencyReason) {
      let currentRecord: any = null;
      if (batch.entity_type === 'SITE') {
        const recRes = await dbQuery<any[]>(`sites?id=eq.${entityId}&select=updated_at,imported_at`);
        currentRecord = recRes.data?.[0];
      } else if (batch.entity_type === 'CLIENT' || batch.entity_type === 'CONTRACTOR') {
        const recRes = await dbQuery<any[]>(`organisations?id=eq.${entityId}&select=updated_at,imported_at`);
        currentRecord = recRes.data?.[0];
      }

      if (currentRecord?.updated_at && currentRecord?.imported_at &&
          new Date(currentRecord.updated_at).getTime() > new Date(currentRecord.imported_at).getTime() + 1000) {
        dependencyReason = `Record was manually edited after import (updated_at: ${currentRecord.updated_at}).`;
      }
    }

    if (dependencyReason) {
      blockedCount++;
      blockedReasons.push({ entityId, entityType: batch.entity_type, reason: dependencyReason });
    } else {
      safeCount++;
    }
  }

  return {
    canSafelyRollback: blockedCount === 0,
    importedCount: importedRows.length,
    safeCount,
    blockedCount,
    blockedReasons,
  };
}

// =============================================================================
// 8. QUERY & HISTORY FUNCTIONS
// =============================================================================

export async function getImportBatch(
  batchId: string,
  session: UserSession
): Promise<{ batch: DataImportBatch; file?: DataImportFile; issues: DataImportIssue[]; rows: DataImportRow[] } | null> {
  if (!hasPermission(session, 'data_import:view') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:view required.');
  }

  const [batchRes, fileRes, issuesRes, rowsRes] = await Promise.all([
    dbQuery<DataImportBatch[]>(`data_import_batches?id=eq.${batchId}&select=*`),
    dbQuery<DataImportFile[]>(`data_import_files?batch_id=eq.${batchId}&select=*`),
    dbQuery<DataImportIssue[]>(`data_import_issues?batch_id=eq.${batchId}&select=*&order=row_index.asc`),
    dbQuery<DataImportRow[]>(`data_import_rows?batch_id=eq.${batchId}&select=*&order=row_index.asc&limit=100`),
  ]);

  const batch = batchRes.data?.[0];
  if (!batch) return null;

  return {
    batch,
    file: fileRes.data?.[0],
    issues: issuesRes.data || [],
    rows: rowsRes.data || [],
  };
}

export async function listImportBatches(session: UserSession): Promise<DataImportBatch[]> {
  if (!hasPermission(session, 'data_import:view') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:view required.');
  }

  const res = await dbQuery<DataImportBatch[]>('data_import_batches?select=*&order=created_at.desc');
  return res.data || [];
}

export async function generateIssueCSV(batchId: string, session: UserSession): Promise<string> {
  if (!hasPermission(session, 'data_import:view') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:view required.');
  }

  const issuesRes = await dbQuery<DataImportIssue[]>(`data_import_issues?batch_id=eq.${batchId}&select=*&order=row_index.asc`);
  const issues = issuesRes.data || [];

  const headers = ['Row', 'Severity', 'Field', 'IssueCode', 'Message', 'RawValue'];
  const csvLines = [headers.join(',')];

  for (const iss of issues) {
    const line = [
      iss.row_index,
      `"${iss.severity}"`,
      `"${iss.field_name || ''}"`,
      `"${iss.issue_code}"`,
      `"${(iss.message || '').replace(/"/g, '""')}"`,
      `"${(iss.raw_value || '').replace(/"/g, '""')}"`,
    ];
    csvLines.push(line.join(','));
  }

  return csvLines.join('\n');
}

export async function getDataStatus(_session: UserSession): Promise<DataStatusSummary> {
  const [clientsRes, sitesRes, contractorsRes, assetsRes, batchesRes] = await Promise.all([
    dbQuery<any[]>('client_accounts?select=id'),
    dbQuery<any[]>('sites?select=id'),
    dbQuery<any[]>('provider_organisations?select=id'),
    dbQuery<any[]>('assets?select=id'),
    dbQuery<any[]>('data_import_batches?select=id,status,created_at'),
  ]);

  const batches = batchesRes.data || [];
  const completed = batches.filter((b) => b.status === 'COMPLETED' || b.status === 'COMPLETED_WITH_ERRORS').length;
  const pending = batches.filter((b) => b.status === 'UPLOADED' || b.status === 'MAPPING_REQUIRED' || b.status === 'READY_FOR_REVIEW').length;

  return {
    clientsCount: clientsRes.data?.length || 0,
    sitesCount: sitesRes.data?.length || 0,
    contractorsCount: contractorsRes.data?.length || 0,
    assetsCount: assetsRes.data?.length || 0,
    mockRecordsCount: 0,
    totalImportBatches: batches.length,
    completedBatches: completed,
    pendingBatches: pending,
    lastImportedAt: batches[0]?.created_at,
  };
}

export async function saveMappingTemplate(
  data: {
    name: string;
    entityType: DataImportEntityType;
    sourceSystem: DataImportSource;
    columnMappings: Record<string, string>;
  },
  session: UserSession
): Promise<{ id: string }> {
  if (!hasPermission(session, 'data_import:map') && !hasPermission(session, 'data_import:admin')) {
    throw new Error('Permission denied: data_import:map required.');
  }

  const res = await dbQuery<DataImportMapping[]>('data_import_mappings', {
    method: 'POST',
    body: {
      name: data.name,
      entity_type: data.entityType,
      source_system: data.sourceSystem,
      is_system_preset: false,
      column_mappings: data.columnMappings,
      created_by_person_id: session.personId,
    },
    headers: { Prefer: 'return=representation' },
  });

  return { id: res.data?.[0]?.id || `map-${Date.now()}` };
}

export async function listMappingTemplates(
  entityType?: DataImportEntityType,
  _session?: UserSession
): Promise<DataImportMapping[]> {
  const query = entityType
    ? `data_import_mappings?entity_type=eq.${entityType}&select=*&order=created_at.desc`
    : 'data_import_mappings?select=*&order=created_at.desc';

  const res = await dbQuery<DataImportMapping[]>(query);
  return res.data || [];
}
