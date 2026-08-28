/**
 * ENTIREFM FIELD REPORTING ENGINE — CANONICAL TYPES
 * ===================================================
 * Revision 4.0 Controlled Document System Architecture.
 * Bridges field operations, asset registry, defect management,
 * and immutable document vault.
 */

// ─── CONTROLLED STATUS VOCABULARY ───────────────────────────
export type ReportStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'READY_TO_SIGN'
  | 'ENGINEER_COMPLETED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ISSUED'
  | 'SUPERSEDED';

export type ReportType =
  | 'REACTIVE'
  | 'PPM_CHECKLIST'
  | 'ASSET_SCHEDULE'
  | 'SURVEY'
  | 'COMPLIANCE_AUDIT'
  | 'GENERAL';

export type SignatureType = 'ENGINEER' | 'CLIENT_REP' | 'ENTIREFM_REVIEWER';

export type AttachmentType =
  | 'BEFORE'
  | 'AFTER'
  | 'DEFECT'
  | 'NAMEPLATE'
  | 'GENERAL'
  | 'CERTIFICATE';

export type RowType =
  | 'LABOUR_ROW'
  | 'MATERIAL_ROW'
  | 'CHECK_ROW'
  | 'ASSET_ROW'
  | 'DEFECT_ROW'
  | 'CUSTOM_ROW';

// ─── ENTITY INTERFACES ──────────────────────────────────────
export interface ReportTemplate {
  id: string;
  template_code: string; // e.g. 'ENT-RJR-01'
  name: string;
  report_type: ReportType;
  discipline: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplateVersion {
  id: string;
  report_template_id: string;
  revision: string; // '4.0'
  effective_date: string; // 'MAR 2026'
  schema_json: {
    sections: Array<{
      key: string;
      title: string;
      required?: boolean;
      optional?: boolean;
      repeatable?: boolean;
      attachments?: boolean;
      internal_only?: boolean;
      syncs_to_asset_registry?: boolean;
    }>;
  };
  pdf_renderer_key: string;
  is_active: boolean;
  created_at: string;
}

export interface ReportInstance {
  id: string;
  report_number: string; // 'EFM-REP-2026-001001'
  template_version_id: string;
  work_order_id: string | null;
  visit_id: string | null;
  client_account_id: string | null;
  site_id: string;
  organisation_id: string;
  assigned_engineer_id: string | null;
  status: ReportStatus;
  title: string;
  started_at: string;
  completed_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  issued_at: string | null;
  superseded_by_id: string | null;
  metadata: Record<string, any>;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;

  // Populated joins
  template?: ReportTemplate;
  template_version?: ReportTemplateVersion;
  site?: {
    id: string;
    name: string;
    site_code: string;
    address_line1: string;
    city: string;
    postcode: string;
    access_notes?: string;
  };
  work_order?: {
    id: string;
    work_order_number: string;
    title: string;
    description: string;
    priority: string;
    work_type: string;
  };
  assigned_engineer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export interface ReportResponse {
  id?: string;
  report_instance_id: string;
  section_key: string;
  field_key: string;
  value_json: any;
  value_text: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReportRepeatableRow {
  id?: string;
  report_instance_id: string;
  section_key: string;
  row_type: RowType;
  sequence_order: number;
  data_json: Record<string, any>;
  linked_asset_id?: string | null;
  linked_defect_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReportAttachment {
  id?: string;
  report_instance_id: string;
  attachment_type: AttachmentType;
  storage_path: string;
  file_name: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  description: string | null;
  related_section: string | null;
  related_field: string | null;
  related_asset_id?: string | null;
  related_row_id?: string | null;
  uploaded_by_id?: string | null;
  created_at?: string;
}

export interface ReportSignature {
  id?: string;
  report_instance_id: string;
  signature_type: SignatureType;
  signatory_name: string;
  signatory_position: string | null;
  signature_data_url?: string | null;
  storage_path?: string | null;
  signed_by_user_id?: string | null;
  signed_at: string;
  declaration_text: string | null;
}

export interface ReportExport {
  id?: string;
  report_instance_id: string;
  document_id: string | null;
  format: string; // 'PDF'
  revision: string; // '4.0'
  storage_path: string;
  checksum_sha256: string;
  page_count: number;
  file_size_bytes: number | null;
  is_current: boolean;
  generated_at: string;
  generated_by_id: string | null;
}

// ─── PILOT SPECIFIC STRUCTURED TYPES ────────────────────────

// 1. Reactive Job Report
export interface LabourRowData {
  id?: string;
  operative_name: string;
  trade: string;
  arrival_time: string;
  departure_time: string;
  hours_total: number;
  is_overtime: boolean;
  notes?: string;
}

export interface MaterialRowData {
  id?: string;
  description: string;
  part_number?: string;
  quantity: number;
  unit: string; // 'EA', 'M', 'PACK', etc.
  supplier?: string;
  cost_code?: string;
  is_chargeable: boolean;
  unit_cost_estimate?: number;
}

export type ReactiveJobOutcome =
  | 'COMPLETED'
  | 'TEMPORARY_REPAIR'
  | 'FOLLOW_ON_REQUIRED'
  | 'QUOTATION_REQUIRED'
  | 'PARTS_REQUIRED'
  | 'SPECIALIST_SUBCONTRACTOR_REQUIRED';

export interface ReportDefectRowData {
  id?: string;
  title: string;
  description: string;
  location: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  action_taken: string;
  further_action_required: string;
  target_remedial_date?: string;
  linked_asset_reference?: string;
  linked_asset_id?: string;
  linked_defect_id?: string;
  photo_path?: string;
}

// 2. Weekly Fire Alarm Test Record
export type CheckResult = 'PASS' | 'FAIL' | 'NA';

export interface CallPointTestRowData {
  id?: string;
  call_point_ref: string; // e.g. 'MCP-012'
  zone_loop: string;      // e.g. 'Zone 2 / Loop 1'
  floor_area: string;      // e.g. 'Ground Floor North'
  exact_location: string;  // e.g. 'Adjacent to Exit Door G.04'
  test_result: CheckResult;
  operating_key_type?: string;
  notes?: string;
  linked_asset_id?: string;
}

// 3. Emergency Lighting Asset Schedule
export type LuminaireType = 'MAINTAINED' | 'NON_MAINTAINED' | 'COMBINED' | 'CENTRAL_BATTERY' | 'EXIT_SIGN';
export type LuminaireCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DEFECTIVE';

export interface LuminaireAssetRowData {
  id?: string;
  asset_reference: string; // e.g. 'EL-001'
  floor_level: string;     // e.g. 'Ground Floor'
  zone_area: string;       // e.g. 'Zone 1 - Reception'
  exact_location: string;  // e.g. 'Above main entrance revolving door'
  fitting_type: string;    // e.g. 'LED Bulkhead 3W', 'Recessed Downlight', 'Exit Box'
  maintained_type: LuminaireType;
  test_facility: string;   // e.g. 'Key Switch KS-01', 'Fish Key', 'Central Auto'
  duration_hours: number;  // 3
  condition: LuminaireCondition;
  is_operational: boolean;
  access_limitation?: string;
  comments?: string;
  linked_asset_id?: string;
}

// ─── FULL REPORT PACK (For PDF & Display) ───────────────────
export interface FullReportPack {
  instance: ReportInstance;
  template: ReportTemplate;
  templateVersion: ReportTemplateVersion;
  responses: Record<string, Record<string, any>>;
  repeatableRows: Record<string, ReportRepeatableRow[]>;
  attachments: ReportAttachment[];
  signatures: Record<SignatureType, ReportSignature | undefined>;
  latestExport?: ReportExport;
}
