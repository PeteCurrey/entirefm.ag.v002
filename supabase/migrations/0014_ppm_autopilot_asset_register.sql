-- ============================================================
-- ENTIREFM PHASE 0D — PPM AUTOPILOT & AI ASSET REGISTER SCHEMA
-- Migration: 0014_ppm_autopilot_asset_register.sql
-- Adds: asset_import_batches, asset_import_rows, asset_candidates,
--        asset_duplicates, maintenance_sources, maintenance_requirements,
--        maintenance_plans, maintenance_plan_items, maintenance_occurrences,
--        and seeds PPM AI Agents in ASSIST mode.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ASSET IMPORT BATCHES & PROGRESSIVE LINEAGE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_import_batches (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number              text NOT NULL UNIQUE,
  client_account_id         uuid REFERENCES client_accounts(id) ON DELETE CASCADE,
  contract_id               uuid REFERENCES contracts(id),
  site_id                   uuid REFERENCES sites(id),
  file_name                 text NOT NULL,
  file_storage_path         text NOT NULL,
  source_format             text NOT NULL CHECK (source_format IN ('XLSX', 'CSV', 'COBIE', 'DOCUMENT_OCR', 'MANUAL')),
  column_mappings_json      jsonb DEFAULT '{}'::jsonb,
  total_rows                integer DEFAULT 0,
  ready_rows                integer DEFAULT 0,
  review_rows               integer DEFAULT 0,
  duplicate_rows            integer DEFAULT 0,
  imported_rows             integer DEFAULT 0,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT', 'MAPPED', 'VALIDATING', 'READY_FOR_PREVIEW', 'COMMITTED', 'ROLLED_BACK', 'FAILED')),
  created_by_person_id      uuid REFERENCES persons(id),
  committed_at              timestamptz,
  rolled_back_at            timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_import_batches_client ON asset_import_batches(client_account_id);
CREATE INDEX IF NOT EXISTS idx_asset_import_batches_site ON asset_import_batches(site_id);

CREATE TABLE IF NOT EXISTS asset_import_rows (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id                  uuid NOT NULL REFERENCES asset_import_batches(id) ON DELETE CASCADE,
  row_index                 integer NOT NULL,
  raw_data_json             jsonb NOT NULL,
  mapped_data_json          jsonb DEFAULT '{}'::jsonb,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'VALID', 'NEEDS_REVIEW', 'DUPLICATE', 'IMPORTED', 'ERROR')),
  validation_issues_json    jsonb DEFAULT '[]'::jsonb,
  candidate_asset_id        uuid,
  created_asset_id          uuid REFERENCES assets(id),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_import_rows_batch ON asset_import_rows(batch_id);

-- ─────────────────────────────────────────────────────────────
-- 2. ASSET CANDIDATES & DUPLICATE INTELLIGENCE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_candidates (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id         uuid REFERENCES client_accounts(id),
  site_id                   uuid REFERENCES sites(id),
  source_type               text NOT NULL CHECK (source_type IN ('SPREADSHEET_IMPORT', 'FIELD_DISCOVERY', 'DOCUMENT_EXTRACTION', 'COBIE_IMPORT', 'MANUAL')),
  source_reference          text,
  proposed_reference        text,
  proposed_name             text NOT NULL,
  proposed_category         text,
  proposed_manufacturer     text,
  proposed_model            text,
  proposed_serial_number    text,
  proposed_location_json    jsonb DEFAULT '{}'::jsonb,
  confidence_score          decimal(3,2) DEFAULT 0.85,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MERGED')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_asset_id          uuid REFERENCES assets(id),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_candidates_client ON asset_candidates(client_account_id);
CREATE INDEX IF NOT EXISTS idx_asset_candidates_site ON asset_candidates(site_id);

CREATE TABLE IF NOT EXISTS asset_duplicates (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_asset_id          uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  candidate_asset_id        uuid REFERENCES asset_candidates(id) ON DELETE CASCADE,
  duplicate_asset_id        uuid REFERENCES assets(id) ON DELETE CASCADE,
  confidence_score          decimal(3,2) NOT NULL,
  match_reasons_json        jsonb NOT NULL,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING', 'MERGED', 'DISMISSED_SEPARATE')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_duplicates_primary ON asset_duplicates(primary_asset_id);

-- ─────────────────────────────────────────────────────────────
-- 3. ASSET EXTENSIONS (Data Quality & Lifecycle)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS completeness_score decimal(3,2) DEFAULT 0.50,
  ADD COLUMN IF NOT EXISTS data_quality_status text DEFAULT 'UNVERIFIED'
    CHECK (data_quality_status IN ('UNVERIFIED', 'PARTIAL', 'VERIFIED', 'NEEDS_REVIEW', 'CONFLICT', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS provenance_json jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS replaced_by_asset_id uuid REFERENCES assets(id),
  ADD COLUMN IF NOT EXISTS import_batch_id uuid REFERENCES asset_import_batches(id),
  ADD COLUMN IF NOT EXISTS is_statutory boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS qr_identifier text UNIQUE;

-- ─────────────────────────────────────────────────────────────
-- 4. MAINTENANCE KNOWLEDGE SOURCES & REQUIREMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_sources (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                      text NOT NULL UNIQUE,
  name                      text NOT NULL,
  provider                  text NOT NULL,
  source_type               text NOT NULL
                              CHECK (source_type IN ('MANUFACTURER', 'LEGISLATION', 'STANDARD', 'SFG20', 'CLIENT', 'CONTRACT', 'ENTIREFM', 'RISK_ASSESSMENT', 'HISTORICAL', 'MANUAL')),
  version                   text NOT NULL,
  effective_date            date NOT NULL,
  superseded_date           date,
  licensing_status          text NOT NULL DEFAULT 'ACTIVE'
                              CHECK (licensing_status IN ('ACTIVE', 'NOT_CONFIGURED', 'EXPIRED', 'RESTRICTED')),
  source_url                text,
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_requirements (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_code          text NOT NULL UNIQUE,
  asset_class               text NOT NULL,
  title                     text NOT NULL,
  description               text NOT NULL,
  frequency                 text NOT NULL
                              CHECK (frequency IN ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'SIX_MONTHLY', 'ANNUAL', 'BIENNIAL', 'FIVE_YEARLY', 'VARIABLE')),
  frequency_interval_days   integer NOT NULL,
  required_trade            text NOT NULL,
  required_competency       text,
  statutory_relevance       text,
  compliance_obligation_id  uuid,
  expected_duration_hours   decimal(5,2) DEFAULT 1.0,
  evidence_requirements_json jsonb DEFAULT '["BEFORE_PHOTO", "AFTER_PHOTO", "READING"]'::jsonb,
  tasks_template_json       jsonb DEFAULT '[]'::jsonb,
  source_id                 uuid REFERENCES maintenance_sources(id),
  source_version            text,
  version                   integer NOT NULL DEFAULT 1,
  status                    text NOT NULL DEFAULT 'ACTIVE'
                              CHECK (status IN ('ACTIVE', 'UNDER_REVIEW', 'SUPERSEDED', 'DEPRECATED')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_requirements_class ON maintenance_requirements(asset_class);
CREATE INDEX IF NOT EXISTS idx_maintenance_requirements_freq ON maintenance_requirements(frequency);

-- ─────────────────────────────────────────────────────────────
-- 5. MAINTENANCE PLANS & INTELLIGENT OCCURRENCES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maintenance_plans (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_number               text NOT NULL UNIQUE,
  client_account_id         uuid NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  contract_id               uuid REFERENCES contracts(id),
  site_id                   uuid REFERENCES sites(id),
  name                      text NOT NULL,
  description               text,
  version                   integer NOT NULL DEFAULT 1,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE', 'SUPERSEDED', 'ARCHIVED')),
  effective_from            date NOT NULL,
  effective_to              date,
  total_assets_count        integer DEFAULT 0,
  total_requirements_count  integer DEFAULT 0,
  total_annual_visits_est   integer DEFAULT 0,
  total_annual_hours_est    decimal(8,2) DEFAULT 0,
  approved_by_person_id     uuid REFERENCES persons(id),
  approved_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_plans_client ON maintenance_plans(client_account_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_plans_site ON maintenance_plans(site_id);

CREATE TABLE IF NOT EXISTS maintenance_plan_items (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id                   uuid NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  asset_id                  uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  requirement_id            uuid NOT NULL REFERENCES maintenance_requirements(id),
  planning_window_days      integer DEFAULT 14,
  preferred_month           integer, -- 1-12
  estimated_hours           decimal(5,2) DEFAULT 1.0,
  recurrence_anchor_date    date,
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_items_plan ON maintenance_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_asset ON maintenance_plan_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_req ON maintenance_plan_items(requirement_id);

CREATE TABLE IF NOT EXISTS maintenance_occurrences (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_code           text NOT NULL UNIQUE,
  plan_item_id              uuid NOT NULL REFERENCES maintenance_plan_items(id) ON DELETE CASCADE,
  plan_id                   uuid NOT NULL REFERENCES maintenance_plans(id) ON DELETE CASCADE,
  asset_id                  uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  requirement_id            uuid NOT NULL REFERENCES maintenance_requirements(id),
  planned_date              date NOT NULL,
  window_start_date         date NOT NULL,
  window_end_date           date NOT NULL,
  work_order_id             uuid REFERENCES work_orders(id),
  status                    text NOT NULL DEFAULT 'PLANNED'
                              CHECK (status IN ('PLANNED', 'GENERATED', 'SATISFIED', 'MISSED', 'NO_ACCESS', 'CANCELLED')),
  satisfaction_evidence_id  uuid,
  satisfied_at              timestamptz,
  missed_reason             text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_occurrences_plan ON maintenance_occurrences(plan_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_asset ON maintenance_occurrences(asset_id);
CREATE INDEX IF NOT EXISTS idx_occurrences_planned_date ON maintenance_occurrences(planned_date);
CREATE INDEX IF NOT EXISTS idx_occurrences_wo ON maintenance_occurrences(work_order_id);

-- ─────────────────────────────────────────────────────────────
-- 6. SEED PPM AI AGENTS IN ASSIST MODE
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'ASSET_IMPORT_AGENT', 'Asset Import & Normalisation Agent',
   'Analyses customer equipment spreadsheets, inspects workbook headers, and proposes canonical field mappings and duplicate detection flags.',
   'Proposes column mappings between client asset spreadsheets and canonical EntireFM fields. Identifies probable duplicate assets and highlights missing data. Operates strictly in ASSIST mode with zero autonomous database mutations.',
   'ASSIST', true, 10.00, 0.80, now()),
  (gen_random_uuid(), 'ASSET_CLASSIFICATION_AGENT', 'Asset Classification Agent',
   'Proposes canonical asset taxonomies, categories, and systems from equipment descriptions and rating plates.',
   'Classifies assets into standard EntireFM HVAC, Electrical, Plumbing, and Statutory hierarchies based on make, model, and plant descriptions. Requires human confirmation for low-confidence classifications.',
   'ASSIST', true, 10.00, 0.85, now()),
  (gen_random_uuid(), 'MAINTENANCE_MAPPING_AGENT', 'Maintenance Requirement Mapping Agent',
   'Matches classified assets to approved statutory, manufacturer, and client maintenance requirements without fabricating unverified frequencies.',
   'Proposes relevant maintenance schedules and tasks from authorised knowledge sources. Explicitly flags assets with unsupported frequencies for human engineering review.',
   'ASSIST', true, 15.00, 0.85, now()),
  (gen_random_uuid(), 'PPM_SCHEDULING_AGENT', 'PPM Scheduling & Visit Optimisation Agent',
   'Proposes efficient multi-asset visit groupings by site, trade, and maintenance windows to balance engineering workload.',
   'Groups compatible maintenance items into streamlined visit schedules to minimise site disruptions and travel overhead. Strictly requires planner approval before activating schedules.',
   'ASSIST', true, 15.00, 0.80, now())
ON CONFLICT (code) DO NOTHING;

-- Seed default EntireFM Standard Maintenance Source
INSERT INTO maintenance_sources (id, code, name, provider, source_type, version, effective_date, licensing_status, is_active, created_at)
VALUES
  (gen_random_uuid(), 'SRC-EFM-STD-2026', 'EntireFM Standard Maintenance Specification 2026', 'EntireFM', 'ENTIREFM', '2026.1', '2026-01-01', 'ACTIVE', true, now()),
  (gen_random_uuid(), 'SRC-SFG20-INTEG', 'SFG20 / Facilities-iQ Adapter Specification', 'BESA / SFG20', 'SFG20', '2026.2', '2026-01-01', 'NOT_CONFIGURED', true, now())
ON CONFLICT (code) DO NOTHING;
