-- ============================================================================
-- ENTIREFM CAFM — FIELD REPORTING ENGINE
-- MIGRATION 0040: FIELD REPORTING ENGINE & REVISION 4.0 CONTROLLED TEMPLATES
-- ============================================================================
-- Version: 4.0.0
-- Architecture: Reusable, versioned field report engine linking canonical entities:
--   - work_orders, visits, sites, client_accounts, organisations, persons
--   - assets (bidirectional creation/linking from surveys)
--   - defects (structured operational creation from failed checks)
--   - documents (immutable PDF export vault)
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. REPORT TEMPLATES (Master Registry)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code   text NOT NULL UNIQUE, -- e.g. ENT-RJR-01, ENT-PPM-01, ENT-FLS-EL
  name            text NOT NULL,
  report_type     text NOT NULL CHECK (report_type IN ('REACTIVE', 'PPM_CHECKLIST', 'ASSET_SCHEDULE', 'SURVEY', 'COMPLIANCE_AUDIT', 'GENERAL')),
  discipline      text NOT NULL, -- e.g. 'General Hard FM', 'Fire Safety', 'Life Safety / Electrical'
  description     text,
  icon            text DEFAULT 'FileText',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. REPORT TEMPLATE VERSIONS (Controlled Document Lifecycle)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_template_versions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_template_id  uuid NOT NULL REFERENCES public.report_templates(id) ON DELETE CASCADE,
  revision            text NOT NULL DEFAULT '4.0', -- e.g. '4.0'
  effective_date      text NOT NULL DEFAULT 'MAR 2026', -- Document system date
  schema_json         jsonb NOT NULL DEFAULT '{}'::jsonb, -- Configured sections, fields, validations
  pdf_renderer_key    text NOT NULL, -- 'rev4/reactive-job', 'rev4/weekly-fire-alarm', 'rev4/emergency-lighting'
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_template_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_report_template_versions_template ON public.report_template_versions(report_template_id);

-- ─────────────────────────────────────────────────────────────
-- 3. REPORT INSTANCES (Field Session Records)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_instances (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number         text NOT NULL UNIQUE, -- e.g. EFM-REP-2026-000123
  template_version_id   uuid NOT NULL REFERENCES public.report_template_versions(id),
  work_order_id         uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  visit_id              uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  client_account_id     uuid REFERENCES public.client_accounts(id) ON DELETE SET NULL,
  site_id               uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  organisation_id       uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  assigned_engineer_id  uuid REFERENCES public.persons(id) ON DELETE SET NULL,
  status                text NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN (
                            'DRAFT',
                            'IN_PROGRESS',
                            'READY_TO_SIGN',
                            'ENGINEER_COMPLETED',
                            'SUBMITTED',
                            'UNDER_REVIEW',
                            'APPROVED',
                            'ISSUED',
                            'SUPERSEDED'
                          )),
  title                 text NOT NULL,
  started_at            timestamptz DEFAULT now(),
  completed_at          timestamptz,
  submitted_at          timestamptz,
  approved_at           timestamptz,
  issued_at             timestamptz,
  superseded_by_id      uuid REFERENCES public.report_instances(id),
  metadata              jsonb DEFAULT '{}'::jsonb,
  created_by_id         uuid REFERENCES public.persons(id),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_instances_site ON public.report_instances(site_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_work_order ON public.report_instances(work_order_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_visit ON public.report_instances(visit_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_status ON public.report_instances(status);
CREATE INDEX IF NOT EXISTS idx_report_instances_engineer ON public.report_instances(assigned_engineer_id);

-- ─────────────────────────────────────────────────────────────
-- 4. REPORT RESPONSES (Key-Value Field Answers)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_responses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  section_key         text NOT NULL,
  field_key           text NOT NULL,
  value_json          jsonb,
  value_text          text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_instance_id, section_key, field_key)
);

CREATE INDEX IF NOT EXISTS idx_report_responses_instance ON public.report_responses(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 5. REPORT REPEATABLE ROWS (Labour, Materials, Devices, Assets, Defects)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_repeatable_rows (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  section_key         text NOT NULL, -- 'labour', 'materials', 'call_points', 'assets', 'defects'
  row_type            text NOT NULL, -- 'LABOUR_ROW', 'MATERIAL_ROW', 'CHECK_ROW', 'ASSET_ROW', 'DEFECT_ROW'
  sequence_order      integer NOT NULL DEFAULT 1,
  data_json           jsonb NOT NULL DEFAULT '{}'::jsonb,
  linked_asset_id     uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  linked_defect_id    uuid REFERENCES public.defects(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_instance ON public.report_repeatable_rows(report_instance_id, section_key);
CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_asset ON public.report_repeatable_rows(linked_asset_id);
CREATE INDEX IF NOT EXISTS idx_report_repeatable_rows_defect ON public.report_repeatable_rows(linked_defect_id);

-- ─────────────────────────────────────────────────────────────
-- 6. REPORT ATTACHMENTS (Photographic & Document Evidence)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_attachments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  attachment_type     text NOT NULL CHECK (attachment_type IN ('BEFORE', 'AFTER', 'DEFECT', 'NAMEPLATE', 'GENERAL', 'CERTIFICATE')),
  storage_path        text NOT NULL,
  file_name           text,
  mime_type           text,
  file_size_bytes     bigint,
  description         text,
  related_section     text,
  related_field       text,
  related_asset_id    uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  related_row_id      uuid REFERENCES public.report_repeatable_rows(id) ON DELETE SET NULL,
  uploaded_by_id      uuid REFERENCES public.persons(id),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_attachments_instance ON public.report_attachments(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 7. REPORT SIGNATURES (Audited Sign-Offs)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_signatures (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  signature_type      text NOT NULL CHECK (signature_type IN ('ENGINEER', 'CLIENT_REP', 'ENTIREFM_REVIEWER')),
  signatory_name      text NOT NULL,
  signatory_position  text,
  signature_data_url  text, -- SVG / PNG data or storage reference
  storage_path        text,
  signed_by_user_id   uuid REFERENCES public.persons(id),
  signed_at           timestamptz NOT NULL DEFAULT now(),
  declaration_text    text,
  UNIQUE(report_instance_id, signature_type)
);

CREATE INDEX IF NOT EXISTS idx_report_signatures_instance ON public.report_signatures(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 8. REPORT EXPORTS (Immutable Controlled PDFs)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.report_exports (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_instance_id  uuid NOT NULL REFERENCES public.report_instances(id) ON DELETE CASCADE,
  document_id         uuid REFERENCES public.documents(id) ON DELETE SET NULL,
  format              text NOT NULL DEFAULT 'PDF',
  revision            text NOT NULL DEFAULT '4.0',
  storage_path        text NOT NULL,
  checksum_sha256     text NOT NULL,
  page_count          integer DEFAULT 1,
  file_size_bytes     bigint,
  is_current          boolean NOT NULL DEFAULT true,
  generated_at        timestamptz NOT NULL DEFAULT now(),
  generated_by_id     uuid REFERENCES public.persons(id)
);

CREATE INDEX IF NOT EXISTS idx_report_exports_instance ON public.report_exports(report_instance_id);

-- ─────────────────────────────────────────────────────────────
-- 9. SEQUENCES & HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.seq_field_report_num START 1001;

CREATE OR REPLACE FUNCTION public.generate_field_report_reference(prefix text)
RETURNS text AS $$
DECLARE
  current_year text;
  next_val bigint;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT nextval('public.seq_field_report_num') INTO next_val;
  RETURN format('EFM-%s-%s-%s', prefix, current_year, lpad(next_val::text, 6, '0'));
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_repeatable_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;

-- Service role has full unrestricted access
DROP POLICY IF EXISTS service_role_report_templates ON public.report_templates;
CREATE POLICY service_role_report_templates ON public.report_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_template_versions ON public.report_template_versions;
CREATE POLICY service_role_report_template_versions ON public.report_template_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_instances ON public.report_instances;
CREATE POLICY service_role_report_instances ON public.report_instances FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_responses ON public.report_responses;
CREATE POLICY service_role_report_responses ON public.report_responses FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_repeatable_rows ON public.report_repeatable_rows;
CREATE POLICY service_role_report_repeatable_rows ON public.report_repeatable_rows FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_attachments ON public.report_attachments;
CREATE POLICY service_role_report_attachments ON public.report_attachments FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_signatures ON public.report_signatures;
CREATE POLICY service_role_report_signatures ON public.report_signatures FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS service_role_report_exports ON public.report_exports;
CREATE POLICY service_role_report_exports ON public.report_exports FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated Users Read Policies (Controlled by application layer & tenant isolation)
DROP POLICY IF EXISTS authenticated_read_templates ON public.report_templates;
CREATE POLICY authenticated_read_templates ON public.report_templates FOR SELECT TO authenticated USING (is_active = true);
DROP POLICY IF EXISTS authenticated_read_template_versions ON public.report_template_versions;
CREATE POLICY authenticated_read_template_versions ON public.report_template_versions FOR SELECT TO authenticated USING (is_active = true);

-- ─────────────────────────────────────────────────────────────
-- 11. SEED CANONICAL REVISION 4.0 TEMPLATES
-- ─────────────────────────────────────────────────────────────

-- 1. Reactive Job Report
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000001',
  'ENT-RJR-01',
  'Reactive Job Report',
  'REACTIVE',
  'General Hard FM',
  'Formal engineer job sheet capturing fault diagnosis, arrival/departure, labour hours, materials, defect observations, and customer sign-off.',
  'Wrench',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000001',
  '11111111-1111-4000-8000-000000000001',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_issue_reported", "title": "01 Issue Reported", "required": true },
      { "key": "02_attendance", "title": "02 Attendance & Site Conditions", "required": true },
      { "key": "03_diagnosis_works", "title": "03 Diagnosis / Works Carried Out", "required": true },
      { "key": "04_labour", "title": "04 Labour Allocation", "repeatable": true },
      { "key": "05_materials", "title": "05 Materials & Consumables", "repeatable": true },
      { "key": "06_outcome", "title": "06 Job Outcome", "required": true },
      { "key": "07_defects", "title": "07 Defects & Remedial Actions", "repeatable": true },
      { "key": "08_photographs", "title": "08 Photographic Evidence", "attachments": true },
      { "key": "09_engineer_signature", "title": "09 Engineer Declaration & Sign-Off", "required": true },
      { "key": "10_client_signature", "title": "10 Client / Representative Sign-Off", "optional": true },
      { "key": "11_entirefm_closeout", "title": "11 EntireFM Review & Close-Out", "internal_only": true }
    ]
  }'::jsonb,
  'rev4/reactive-job',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;

-- 2. Weekly Fire Alarm Test Record
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000002',
  'ENT-PPM-01',
  'Weekly Fire Alarm Test Record',
  'PPM_CHECKLIST',
  'Fire Safety',
  'Statutory BS 5839-1 weekly manual call point rotational test, panel status inspection, and defect logging.',
  'ShieldCheck',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000002',
  '11111111-1111-4000-8000-000000000002',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_system_details", "title": "01 Fire Alarm System Details", "required": true },
      { "key": "02_panel_inspection", "title": "02 Control Panel State Inspection", "required": true },
      { "key": "03_call_points", "title": "03 Sample Manual Call Point(s) Tested", "repeatable": true, "required": true },
      { "key": "04_ancillaries", "title": "04 Sounders, Signalling & Ancillaries", "required": true },
      { "key": "05_defects", "title": "05 Defect / Rectification Notice", "repeatable": true },
      { "key": "06_photographs", "title": "06 Test Evidence Photos", "attachments": true },
      { "key": "07_engineer_signature", "title": "07 Competent Tester Sign-Off", "required": true }
    ]
  }'::jsonb,
  'rev4/weekly-fire-alarm',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;

-- 3. Emergency Lighting Asset Schedule
INSERT INTO public.report_templates (id, template_code, name, report_type, discipline, description, icon, is_active)
VALUES (
  '11111111-1111-4000-8000-000000000003',
  'ENT-FLS-EL',
  'Emergency Lighting Asset Schedule',
  'ASSET_SCHEDULE',
  'Life Safety / Electrical',
  'Asset inventory and schedule survey for emergency luminaires, exit signage, central battery and self-contained units per BS 5266.',
  'Zap',
  true
) ON CONFLICT (template_code) DO UPDATE SET
  name = EXCLUDED.name,
  report_type = EXCLUDED.report_type,
  discipline = EXCLUDED.discipline,
  description = EXCLUDED.description;

INSERT INTO public.report_template_versions (id, report_template_id, revision, effective_date, schema_json, pdf_renderer_key, is_active)
VALUES (
  '22222222-2222-4000-8000-000000000003',
  '11111111-1111-4000-8000-000000000003',
  '4.0',
  'MAR 2026',
  '{
    "sections": [
      { "key": "01_survey_header", "title": "01 Survey & Building Details", "required": true },
      { "key": "02_assets_schedule", "title": "02 Emergency Luminaire Schedule", "repeatable": true, "required": true, "syncs_to_asset_registry": true },
      { "key": "03_overall_assessment", "title": "03 Estate Assessment & Limitations", "required": true },
      { "key": "04_defects", "title": "04 Immediate Compliance Hazards", "repeatable": true },
      { "key": "05_photographs", "title": "05 Survey Evidence", "attachments": true },
      { "key": "06_surveyor_signature", "title": "06 Surveyor Sign-Off", "required": true }
    ]
  }'::jsonb,
  'rev4/emergency-lighting',
  true
) ON CONFLICT (report_template_id, revision) DO NOTHING;
