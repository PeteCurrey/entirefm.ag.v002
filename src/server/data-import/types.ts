/**
 * ENTIREFM DATA IMPORT & EXTERNAL PROVENANCE TYPES (Phase 0I-PRE)
 * =============================================================
 */

export type DataImportEntityType =
  | 'CLIENT'
  | 'SITE'
  | 'CONTRACTOR'
  | 'ASSET'
  | 'PPM_SCHEDULE'
  | 'WORK_ORDER'
  | 'GENERIC';

export type DataImportSource =
  | 'SIMPRO'
  | 'BIGCHANGE'
  | 'JOBLOGIC'
  | 'CSV'
  | 'GENERIC_CSV'
  | 'API';

export type DataImportBatchStatus =
  | 'UPLOADED'
  | 'MAPPING_REQUIRED'
  | 'VALIDATING'
  | 'VALIDATION_FAILED'
  | 'READY_FOR_REVIEW'
  | 'IMPORTING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'ROLLED_BACK';

export type DataImportRowStatus =
  | 'PENDING'
  | 'VALID'
  | 'INVALID'
  | 'UNCHANGED'
  | 'CHANGE_DETECTED'
  | 'POSSIBLE_DUPLICATE'
  | 'CONFLICT'
  | 'DUPLICATE'
  | 'SKIPPED'
  | 'IMPORTED'
  | 'FAILED'
  | 'ROLLED_BACK'
  | 'ROLLBACK_BLOCKED';

/** Decision recorded by a human reviewer when a row is POSSIBLE_DUPLICATE */
export type DuplicateDecisionChoice = 'USE_EXISTING' | 'CREATE_NEW' | 'IGNORE_ROW';

export interface DataImportDuplicateDecision {
  id: string;
  batch_id: string;
  row_id: string;
  imported_name: string;
  candidate_entity_id?: string;
  candidate_name?: string;
  match_reason: string;
  decision: DuplicateDecisionChoice;
  decided_by_person_id?: string;
  decided_at: string;
  notes?: string;
}

/** One changed field in a CHANGE_DETECTED row */
export interface ImportFieldDiff {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

/** Conflict provenance when an EntireFM user has enriched a field after last import */
export interface ImportConflictDetail {
  field: string;
  lastImportedValue: string | null;
  currentCafmValue: string | null;
  incomingValue: string | null;
  cafmModifiedAt?: string;
}

export type DataImportIssueSeverity = 'ERROR' | 'WARNING' | 'INFO';

export type DataImportIssueResolution =
  | 'UNRESOLVED'
  | 'IGNORED'
  | 'OVERRIDDEN'
  | 'CORRECTED';

export interface DataImportBatch {
  id: string;
  batch_reference: string;
  entity_type: DataImportEntityType;
  source_system: DataImportSource;
  status: DataImportBatchStatus;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  duplicate_rows: number;
  imported_rows: number;
  rolled_back_rows: number;
  mapping_config: Record<string, string>;
  summary: Record<string, any>;
  created_by_person_id?: string;
  committed_by_person_id?: string;
  rolled_back_by_person_id?: string;
  created_at: string;
  updated_at: string;
  committed_at?: string;
  rolled_back_at?: string;
}

export interface DataImportFile {
  id: string;
  batch_id: string;
  filename: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path?: string;
  file_checksum: string;
  raw_headers: string[];
  encoding: string;
  delimiter: string;
  created_at: string;
}

export interface DataImportRow {
  id: string;
  batch_id: string;
  row_index: number;
  raw_data: Record<string, any>;
  mapped_data: Record<string, any>;
  row_hash: string;
  status: DataImportRowStatus;
  target_entity_id?: string;
  external_id?: string;
  matched_entity_id?: string;
  match_reason?: string;
  change_diff?: ImportFieldDiff[];
  conflict_details?: ImportConflictDetail[];
  pre_import_snapshot?: Record<string, any>;
  error_messages: string[];
  warning_messages: string[];
  created_at: string;
  updated_at: string;
}

export interface DataImportMapping {
  id: string;
  name: string;
  entity_type: DataImportEntityType;
  source_system: DataImportSource;
  is_system_preset: boolean;
  column_mappings: Record<string, string>;
  transform_rules?: Record<string, any>;
  created_by_person_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DataImportIssue {
  id: string;
  batch_id: string;
  row_id?: string;
  row_index: number;
  severity: DataImportIssueSeverity;
  field_name?: string;
  issue_code: string;
  message: string;
  raw_value?: string;
  resolution?: DataImportIssueResolution;
  created_at: string;
}

export interface DataImportPreviewSummary {
  batchId: string;
  batchReference: string;
  entityType: DataImportEntityType;
  sourceSystem: DataImportSource;
  totalRows: number;
  validRows: number;
  errorRows: number;
  duplicateRows: number;
  unchangedRows: number;
  changeDetectedRows: number;
  possibleDuplicateRows: number;
  conflictRows: number;
  newRows: number;
  matchedExistingRows: number;
  blockedRows: number;
  issues: DataImportIssue[];
  sampleMappedRows: Array<{
    rowIndex: number;
    status: DataImportRowStatus;
    externalId?: string;
    displayName: string;
    details: string;
    issues: string[];
    changeDiff?: ImportFieldDiff[];
  }>;
}

export interface DataImportCommitResult {
  success: boolean;
  batchId: string;
  batchReference: string;
  importedCount: number;
  skippedCount: number;
  updatedCount: number;
  blockedCount: number;
  errorCount: number;
  createdEntityIds: string[];
  updatedEntityIds: string[];
  blockedRows: Array<{ rowIndex: number; reason: string }>;
  errors: string[];
}

export interface DataImportRollbackResult {
  success: boolean;
  batchId: string;
  batchReference: string;
  rolledBackCount: number;
  blockedCount: number;
  reasons: string[];
  blockedReasons: Array<{ entityId: string; entityType: string; reason: string }>;
}

export interface DataStatusSummary {
  clientsCount: number;
  sitesCount: number;
  contractorsCount: number;
  assetsCount: number;
  mockRecordsCount: number;
  totalImportBatches: number;
  completedBatches: number;
  pendingBatches: number;
  lastImportedAt?: string;
}
