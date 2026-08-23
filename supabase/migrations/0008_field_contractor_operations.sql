-- ============================================================
-- ENTIREFM PHASE 0C — FIELD + CONTRACTOR OPERATIONS SCHEMA
-- Migration: 0008_field_contractor_operations.sql
-- Extends: visits, adds service_reports, field_readings,
--          field_parts_used, field_voice_captures,
--          field_sync_queue, contractor_compliance_documents,
--          notifications. Seeds FIELD AI agents.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. EXTEND VISITS — Field Journey Tracking
-- ─────────────────────────────────────────────────────────────
ALTER TABLE visits
  ADD COLUMN IF NOT EXISTS journey_started_at       timestamptz,
  ADD COLUMN IF NOT EXISTS arrived_at               timestamptz,
  ADD COLUMN IF NOT EXISTS arrival_method           text CHECK (arrival_method IN ('MANUAL','GEOFENCE','QR','NFC')),
  ADD COLUMN IF NOT EXISTS arrival_lat              decimal(10,7),
  ADD COLUMN IF NOT EXISTS arrival_lng              decimal(10,7),
  ADD COLUMN IF NOT EXISTS arrival_location_accuracy_m integer,
  ADD COLUMN IF NOT EXISTS work_started_at          timestamptz,
  ADD COLUMN IF NOT EXISTS work_stopped_at          timestamptz,
  ADD COLUMN IF NOT EXISTS departed_at              timestamptz,
  ADD COLUMN IF NOT EXISTS no_access_reason         text CHECK (no_access_reason IN ('KEYBOX_FAILURE','CONTACT_UNAVAILABLE','HAZARD_PRESENT','ACCESS_REFUSED','WRONG_ADDRESS','OTHER')),
  ADD COLUMN IF NOT EXISTS no_access_notes          text,
  ADD COLUMN IF NOT EXISTS no_access_photo_path     text,
  ADD COLUMN IF NOT EXISTS no_access_contact_attempted boolean DEFAULT false;

-- ─────────────────────────────────────────────────────────────
-- 2. SERVICE REPORTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_reports (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  engineer_person_id        uuid REFERENCES persons(id),
  client_account_id         uuid REFERENCES client_accounts(id),
  site_id                   uuid REFERENCES sites(id),
  asset_id                  uuid REFERENCES assets(id),
  report_number             text UNIQUE NOT NULL,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT','SUBMITTED','ACCEPTED','REJECTED')),
  work_description          text,
  ai_draft_narrative        text,
  final_narrative           text,
  attendance_started_at     timestamptz,
  attendance_ended_at       timestamptz,
  tasks_completed           integer DEFAULT 0,
  tasks_total               integer DEFAULT 0,
  observations_count        integer DEFAULT 0,
  defects_count             integer DEFAULT 0,
  recommendations_count     integer DEFAULT 0,
  readings_count            integer DEFAULT 0,
  parts_used_count          integer DEFAULT 0,
  signature_path            text,
  signatory_name            text,
  signatory_organisation    text,
  signature_captured_at     timestamptz,
  signature_declaration     text,
  ai_run_id                 uuid,
  submitted_at              timestamptz,
  accepted_at               timestamptz,
  rejected_at               timestamptz,
  rejection_reason          text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_reports_visit_id ON service_reports(visit_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_work_order_id ON service_reports(work_order_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_engineer ON service_reports(engineer_person_id);

-- ─────────────────────────────────────────────────────────────
-- 3. FIELD READINGS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_readings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id         uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id              uuid REFERENCES visits(id) ON DELETE CASCADE,
  task_id               uuid,
  asset_id              uuid REFERENCES assets(id),
  engineer_person_id    uuid REFERENCES persons(id),
  reading_type          text NOT NULL
                          CHECK (reading_type IN ('TEMPERATURE','PRESSURE','VOLTAGE','CURRENT','FLOW','METER','HUMIDITY','RPM','DB_LEVEL','CO2','OTHER')),
  value_numeric         decimal(12,4),
  value_text            text,
  unit                  text,
  expected_min          decimal(12,4),
  expected_max          decimal(12,4),
  is_out_of_range       boolean GENERATED ALWAYS AS (
                          value_numeric IS NOT NULL
                          AND expected_min IS NOT NULL
                          AND expected_max IS NOT NULL
                          AND (value_numeric < expected_min OR value_numeric > expected_max)
                        ) STORED,
  photo_evidence_path   text,
  notes                 text,
  captured_at           timestamptz NOT NULL DEFAULT now(),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_readings_visit ON field_readings(visit_id);
CREATE INDEX IF NOT EXISTS idx_field_readings_asset ON field_readings(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 4. FIELD PARTS USED
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_parts_used (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id         uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id              uuid REFERENCES visits(id) ON DELETE CASCADE,
  task_id               uuid,
  asset_id              uuid REFERENCES assets(id),
  engineer_person_id    uuid REFERENCES persons(id),
  part_number           text,
  description           text NOT NULL,
  quantity              decimal(10,2) NOT NULL DEFAULT 1,
  unit                  text DEFAULT 'UNIT',
  unit_cost_gbp         decimal(10,2),
  source_notes          text,
  serial_number         text,
  batch_number          text,
  supplier_reference    text,
  is_billable           boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_parts_visit ON field_parts_used(visit_id);

-- ─────────────────────────────────────────────────────────────
-- 5. FIELD VOICE CAPTURES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_voice_captures (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  asset_id                  uuid REFERENCES assets(id),
  engineer_person_id        uuid REFERENCES persons(id),
  audio_storage_path        text,
  duration_seconds          integer,
  transcription             text,
  transcription_status      text NOT NULL DEFAULT 'PENDING'
                              CHECK (transcription_status IN ('PENDING','COMPLETE','FAILED')),
  ai_proposed_action_type   text
                              CHECK (ai_proposed_action_type IN ('JOB_NOTE','OBSERVATION','DEFECT','RECOMMENDATION','REPORT_NOTE','TALK_TO_QUOTE')),
  ai_proposed_payload       jsonb,
  ai_confidence_score       decimal(3,2),
  ai_run_id                 uuid,
  engineer_confirmed        boolean NOT NULL DEFAULT false,
  engineer_corrections      jsonb,
  confirmed_observation_id  uuid,
  confirmed_defect_id       uuid,
  captured_at               timestamptz NOT NULL DEFAULT now(),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_captures_visit ON field_voice_captures(visit_id);
CREATE INDEX IF NOT EXISTS idx_voice_captures_engineer ON field_voice_captures(engineer_person_id);

-- ─────────────────────────────────────────────────────────────
-- 6. FIELD SYNC QUEUE (server-side idempotency log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_sync_queue (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id             text,
  engineer_person_id    uuid REFERENCES persons(id),
  idempotency_key       text UNIQUE NOT NULL,
  action_type           text NOT NULL,
  related_entity_type   text,
  related_entity_id     uuid,
  payload               jsonb NOT NULL,
  device_timestamp      timestamptz NOT NULL,
  received_at           timestamptz NOT NULL DEFAULT now(),
  processed_at          timestamptz,
  processing_status     text NOT NULL DEFAULT 'PENDING'
                          CHECK (processing_status IN ('PENDING','PROCESSED','CONFLICT','REJECTED','DUPLICATE')),
  conflict_notes        text,
  retry_count           integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_key ON field_sync_queue(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_sync_queue_engineer_status ON field_sync_queue(engineer_person_id, processing_status);

-- ─────────────────────────────────────────────────────────────
-- 7. CONTRACTOR COMPLIANCE DOCUMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contractor_compliance_documents (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_organisation_id    uuid NOT NULL,
  document_type               text NOT NULL
                                CHECK (document_type IN (
                                  'INSURANCE_PUBLIC_LIABILITY','INSURANCE_EMPLOYERS',
                                  'ACCREDITATION_GAS_SAFE','ACCREDITATION_NICEIC',
                                  'ACCREDITATION_CHAS','ACCREDITATION_SAFECONTRACTOR',
                                  'COSHH_ASSESSMENT','HEALTH_SAFETY_POLICY',
                                  'QUALITY_POLICY','RAMS','ENGINEER_CERTIFICATE','OTHER'
                                )),
  document_title              text NOT NULL,
  storage_path                text NOT NULL,
  file_size_bytes             integer,
  mime_type                   text,
  expiry_date                 date,
  is_current                  boolean NOT NULL DEFAULT true,
  review_status               text NOT NULL DEFAULT 'PENDING'
                                CHECK (review_status IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  reviewed_by_person_id       uuid REFERENCES persons(id),
  reviewed_at                 timestamptz,
  rejection_reason            text,
  uploaded_by_person_id       uuid REFERENCES persons(id),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_docs_org ON contractor_compliance_documents(provider_organisation_id);
CREATE INDEX IF NOT EXISTS idx_compliance_docs_status ON contractor_compliance_documents(review_status);

-- ─────────────────────────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_person_id   uuid NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  notification_type     text NOT NULL
                          CHECK (notification_type IN (
                            'ASSIGNMENT_OFFERED','ASSIGNMENT_CHANGED','VISIT_ASSIGNED',
                            'COMPLETION_REJECTED','COMPLETION_ACCEPTED','SCHEDULE_CHANGED',
                            'URGENT_WORK_ORDER','SLA_ESCALATION','COMPLIANCE_EXPIRY',
                            'MESSAGE_RECEIVED'
                          )),
  title                 text NOT NULL,
  body                  text,
  related_entity_type   text,
  related_entity_id     uuid,
  is_read               boolean NOT NULL DEFAULT false,
  read_at               timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_person_id, is_read);

-- ─────────────────────────────────────────────────────────────
-- 9. SEED FIELD AI AGENTS
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'FIELD_STRUCTURING_AGENT', 'Field Structuring Agent',
   'Phase 0C voice intelligence agent',
   'Transcribes voice captures and proposes structured observations, defects, and recommendations for engineer review and confirmation. Does not autonomously write operational records.',
   'ASSIST', true, 5.00, 0.75, now()),
  (gen_random_uuid(), 'FIELD_REPORT_AGENT', 'Field Report Agent',
   'Phase 0C service report agent',
   'Drafts concise, factual service report narratives from confirmed field data. Cannot invent work that was not recorded by the engineer. Cannot generate pricing.',
   'ASSIST', true, 10.00, 0.80, now())
ON CONFLICT (code) DO NOTHING;
