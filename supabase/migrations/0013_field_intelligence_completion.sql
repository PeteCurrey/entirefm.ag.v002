-- ============================================================
-- ENTIREFM PHASE 0C-R — FIELD INTELLIGENCE COMPLETION SCHEMA
-- Migration: 0013_field_intelligence_completion.sql
-- Adds: field_quote_scopes, ai_corrections, evidence_reviews,
--        asset_update_proposals, seeds FIELD_VISION_AGENT &
--        FIELD_COPILOT_AGENT.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. FIELD QUOTE SCOPES (Talk-to-Quote Commercial Foundation)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS field_quote_scopes (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id             uuid REFERENCES work_orders(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  asset_id                  uuid REFERENCES assets(id),
  defect_id                 uuid,
  engineer_person_id        uuid REFERENCES persons(id),
  scope_description         text NOT NULL,
  labour_engineers_count    integer DEFAULT 1,
  labour_estimated_hours    decimal(6,2),
  materials_summary         text,
  materials_items_json      jsonb DEFAULT '[]'::jsonb,
  status                    text NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT','SUBMITTED','ACCEPTED_FOR_ESTIMATION','CONVERTED_TO_QUOTE','REJECTED')),
  is_priced                 boolean NOT NULL DEFAULT false,
  is_approved               boolean NOT NULL DEFAULT false,
  is_issued                 boolean NOT NULL DEFAULT false,
  ai_confidence_score       decimal(3,2),
  ai_run_id                 uuid,
  voice_capture_id          uuid REFERENCES field_voice_captures(id),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_wo ON field_quote_scopes(work_order_id);
CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_visit ON field_quote_scopes(visit_id);
CREATE INDEX IF NOT EXISTS idx_field_quote_scopes_asset ON field_quote_scopes(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 2. AI CORRECTIONS (Supervised Training & Provenance Log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_corrections (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_agent_code             text NOT NULL,
  ai_run_id                 uuid,
  entity_type               text NOT NULL,
  entity_id                 uuid,
  field_name                text NOT NULL,
  proposed_value            jsonb NOT NULL,
  corrected_value           jsonb NOT NULL,
  confidence_score          decimal(3,2),
  engineer_person_id        uuid REFERENCES persons(id),
  notes                     text,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_corrections_agent ON ai_corrections(ai_agent_code);
CREATE INDEX IF NOT EXISTS idx_ai_corrections_entity ON ai_corrections(entity_type, entity_id);

-- ─────────────────────────────────────────────────────────────
-- 3. EVIDENCE REVIEWS & REJECTIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS evidence_reviews (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id               uuid NOT NULL,
  visit_id                  uuid REFERENCES visits(id) ON DELETE CASCADE,
  reviewer_person_id        uuid REFERENCES persons(id),
  review_status             text NOT NULL CHECK (review_status IN ('APPROVED','REJECTED')),
  rejection_reason          text,
  replacement_evidence_id   uuid,
  reviewed_at               timestamptz NOT NULL DEFAULT now(),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_reviews_evidence ON evidence_reviews(evidence_id);
CREATE INDEX IF NOT EXISTS idx_evidence_reviews_visit ON evidence_reviews(visit_id);

-- ─────────────────────────────────────────────────────────────
-- 4. ASSET UPDATE PROPOSALS (Visual Nameplate Discrepancy Log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_update_proposals (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id                  uuid REFERENCES assets(id) ON DELETE CASCADE,
  visit_id                  uuid REFERENCES visits(id),
  engineer_person_id        uuid REFERENCES persons(id),
  proposed_manufacturer     text,
  proposed_model            text,
  proposed_serial_number    text,
  existing_manufacturer     text,
  existing_model            text,
  existing_serial_number    text,
  confidence_score          decimal(3,2),
  photo_storage_path        text,
  status                    text NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING','ACCEPTED','REJECTED')),
  reviewed_by_person_id     uuid REFERENCES persons(id),
  reviewed_at               timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_update_proposals_asset ON asset_update_proposals(asset_id);

-- ─────────────────────────────────────────────────────────────
-- 5. SEED FIELD AI AGENTS (Phase 0C-R additions in ASSIST mode)
-- ─────────────────────────────────────────────────────────────
INSERT INTO ai_agents (id, code, name, description, role_description, autonomy_level, is_active, max_daily_budget_gbp, confidence_threshold, created_at)
VALUES
  (gen_random_uuid(), 'FIELD_VISION_AGENT', 'Field Visual Intelligence Agent',
   'Extracts nameplate and equipment metadata from field photos. Proposes candidate asset details for engineer verification.',
   'Analyses field photographs of equipment nameplates, dials, and labels to extract manufacturer, model, and serial numbers. Strictly operates in ASSIST mode with zero autonomous database updates.',
   'ASSIST', true, 10.00, 0.80, now()),
  (gen_random_uuid(), 'FIELD_COPILOT_AGENT', 'Field Copilot Agent',
   'Context-aware retrieval assistant for mobile engineers on site.',
   'Answers field technical and historical questions using strictly authorized Work Order, Asset, Defect, and approved site documentation. Strictly refuses unverified safety procedures and prevents cross-tenant data leakage.',
   'ASSIST', true, 15.00, 0.85, now())
ON CONFLICT (code) DO NOTHING;
