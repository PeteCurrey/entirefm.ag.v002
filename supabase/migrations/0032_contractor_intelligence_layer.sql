-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0032 — CONTRACTOR INTELLIGENCE LAYER & LIVE DATA PERSISTENCE (CP-09R)
-- ============================================================================
-- Canonical database tables for:
-- 1. Intelligence Sources & Connector Health
-- 2. Normalised Intelligence Items & Regulatory Events
-- 3. Contractor Actions & Versioned Acknowledgements
-- 4. Company Watch Records (Companies House UK Public Data)
-- 5. Admin Tender Opportunities (Contracts Finder & Find a Tender OCDS)
-- 6. Ingestion Runs & Provenance Ledger
-- ============================================================================

-- 1. INTELLIGENCE SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS public.intelligence_sources (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  source_type text NOT NULL, -- api, rss, ocds, changedetection, feed
  authority_tier integer NOT NULL DEFAULT 1,
  access_type text NOT NULL DEFAULT 'open_no_key',
  base_domain text NOT NULL,
  base_url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  poll_interval_minutes integer NOT NULL DEFAULT 1440,
  jurisdictions text[] NOT NULL DEFAULT ARRAY['United Kingdom']::text[],
  primary_trades text[] NOT NULL DEFAULT ARRAY[]::text[],
  requires_human_review boolean NOT NULL DEFAULT false,
  credential_env_key text,
  last_attempt_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  health_status text NOT NULL DEFAULT 'NOT_CONFIGURED', -- LIVE, DEGRADED, FAILED, DISABLED, NOT_CONFIGURED
  records_ingested_total integer NOT NULL DEFAULT 0,
  consecutive_failures integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  doc_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. NORMALISED INTELLIGENCE ITEMS (Provenance & Regulatory Truth)
CREATE TABLE IF NOT EXISTS public.intelligence_items (
  id text PRIMARY KEY,
  external_id text NOT NULL,
  content_hash text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  entirefm_summary text NOT NULL,
  what_changed text,
  suggested_contractor_action text,
  why_youre_seeing text[] DEFAULT ARRAY[]::text[],
  source_id text NOT NULL,
  source_name text NOT NULL,
  canonical_url text NOT NULL,
  authority_tier integer NOT NULL DEFAULT 1,
  legal_status text NOT NULL DEFAULT 'NEWS',
  event_type text NOT NULL DEFAULT 'REGULATORY_CHANGE',
  severity text NOT NULL DEFAULT 'INFORMATION',
  jurisdictions text[] NOT NULL DEFAULT ARRAY['United Kingdom']::text[],
  trade_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  credential_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  work_type_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  effective_from date,
  deadline_date date,
  supersedes_id text,
  rights_licence text NOT NULL DEFAULT 'OGL v3.0',
  parser_version text NOT NULL DEFAULT '1.0.0',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  raw_source_hash text,
  raw_payload jsonb,
  review_status text NOT NULL DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, APPROVED, REJECTED, AUTO_PUBLISHED, REQUIRES_COMPLIANCE_REVIEW
  reviewed_by text,
  reviewed_at timestamptz,
  linked_compliance_requirement_ids text[] DEFAULT ARRAY[]::text[],
  audience_roles text[] DEFAULT ARRAY['CONTRACTOR_ADMIN']::text[],
  secondary_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intel_items_external ON public.intelligence_items(external_id);
CREATE INDEX IF NOT EXISTS idx_intel_items_source ON public.intelligence_items(source_id);
CREATE INDEX IF NOT EXISTS idx_intel_items_review ON public.intelligence_items(review_status);
CREATE INDEX IF NOT EXISTS idx_intel_items_severity ON public.intelligence_items(severity);
CREATE INDEX IF NOT EXISTS idx_intel_items_published ON public.intelligence_items(published_at DESC);

-- 3. CONTRACTOR INTELLIGENCE ACTIONS
CREATE TABLE IF NOT EXISTS public.contractor_intelligence_actions (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL,
  intelligence_item_id text NOT NULL REFERENCES public.intelligence_items(id) ON DELETE CASCADE,
  intelligence_item_version integer NOT NULL DEFAULT 1,
  action_type text NOT NULL, -- MARK_REVIEWED, ASSIGN, NOT_APPLICABLE, UPLOAD_EVIDENCE, LINK_REQUIREMENT, ADD_NOTE, REQUEST_CLARIFICATION, ACKNOWLEDGE
  assigned_to text,
  due_date date,
  internal_note text,
  evidence_document_id text,
  linked_requirement_id text,
  not_applicable_reason text,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  is_resolved boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_contractor_actions_org ON public.contractor_intelligence_actions(contractor_org_id);
CREATE INDEX IF NOT EXISTS idx_contractor_actions_item ON public.contractor_intelligence_actions(intelligence_item_id);

-- 4. CONTRACTOR INTELLIGENCE ACKNOWLEDGEMENTS (Version-Specific)
CREATE TABLE IF NOT EXISTS public.contractor_intelligence_acknowledgements (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL,
  user_id text NOT NULL,
  intelligence_item_id text NOT NULL REFERENCES public.intelligence_items(id) ON DELETE CASCADE,
  intelligence_item_version integer NOT NULL DEFAULT 1,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  is_invalidated boolean NOT NULL DEFAULT false,
  invalidated_at timestamptz,
  invalidated_reason text
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ack_unique ON public.contractor_intelligence_acknowledgements(contractor_org_id, intelligence_item_id, intelligence_item_version);
CREATE INDEX IF NOT EXISTS idx_ack_org ON public.contractor_intelligence_acknowledgements(contractor_org_id);

-- 5. COMPANY WATCH RECORDS (Companies House UK Public Data)
CREATE TABLE IF NOT EXISTS public.company_watch_records (
  id text PRIMARY KEY,
  contractor_org_id text NOT NULL UNIQUE,
  company_number text NOT NULL,
  company_name text NOT NULL,
  company_status text NOT NULL DEFAULT 'UNVERIFIED', -- ACTIVE, DISSOLVED, LIQUIDATION, CONVERTED_CLOSED, INSOLVENCY, UNVERIFIED
  incorporation_date date,
  registered_office_address text,
  sic_codes text[] DEFAULT ARRAY[]::text[],
  accounts_next_due_date date,
  accounts_last_made_up_to date,
  accounts_overdue boolean NOT NULL DEFAULT false,
  accounts_type text,
  confirmation_statement_next_due_date date,
  confirmation_statement_last_made_up_to date,
  confirmation_statement_overdue boolean NOT NULL DEFAULT false,
  insolvency_details jsonb,
  officers_summary jsonb DEFAULT '[]'::jsonb,
  api_available boolean NOT NULL DEFAULT false,
  degraded boolean NOT NULL DEFAULT false,
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  last_successful_fetch_at timestamptz,
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_watch_number ON public.company_watch_records(company_number);
CREATE INDEX IF NOT EXISTS idx_company_watch_status ON public.company_watch_records(company_status);

-- 6. ADMIN TENDER OPPORTUNITIES (EntireFM Internal BD — Strictly Non-Contractor)
CREATE TABLE IF NOT EXISTS public.admin_tender_opportunities (
  id text PRIMARY KEY,
  ocid text NOT NULL UNIQUE,
  source text NOT NULL, -- Contracts Finder, Find a Tender, Crown Commercial Service
  notice_type text NOT NULL DEFAULT 'tender', -- planning, tender, award, contract
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  buyer_name text NOT NULL DEFAULT '',
  buyer_region text NOT NULL DEFAULT '',
  cpv_codes text[] DEFAULT ARRAY[]::text[],
  is_framework boolean NOT NULL DEFAULT false,
  is_sme_appropriate boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  closing_date timestamptz,
  contract_start_date date,
  contract_duration_months integer,
  estimated_value_gbp numeric,
  estimated_value_formatted text,
  canonical_url text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CLOSING_SOON, AWARDED, CANCELLED, EXPIRED
  awarded_to_supplier text,
  match_score integer NOT NULL DEFAULT 0,
  matched_services text[] DEFAULT ARRAY[]::text[],
  match_strength text NOT NULL DEFAULT 'NOT_MATCHED', -- STRONG, MODERATE, WEAK, NOT_MATCHED
  match_reasons text[] DEFAULT ARRAY[]::text[],
  cpv_matches text[] DEFAULT ARRAY[]::text[],
  bid_stage text NOT NULL DEFAULT 'NEW', -- NEW, REVIEWING, BID_DECISION, BID_PLANNED, IN_PROGRESS, SUBMITTED, WON, LOST, EXPIRED
  assigned_to text,
  internal_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  deadline_urgency text NOT NULL DEFAULT 'NORMAL', -- IMMINENT, SOON, NORMAL, EXPIRED
  content_hash text NOT NULL,
  raw_payload jsonb,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_tenders_ocid ON public.admin_tender_opportunities(ocid);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_bid_stage ON public.admin_tender_opportunities(bid_stage);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_match_score ON public.admin_tender_opportunities(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_admin_tenders_closing ON public.admin_tender_opportunities(closing_date);

-- 7. INGESTION RUNS (Connector Audit Ledger)
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_runs (
  id text PRIMARY KEY,
  source_id text NOT NULL,
  source_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- success, partial, failed, pending
  records_fetched integer NOT NULL DEFAULT 0,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  duplicates_detected integer NOT NULL DEFAULT 0,
  error text,
  parser_version text NOT NULL DEFAULT '1.0.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_runs_source ON public.intelligence_ingestion_runs(source_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_started ON public.intelligence_ingestion_runs(started_at DESC);

-- Enable RLS
ALTER TABLE public.intelligence_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_watch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tender_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_runs ENABLE ROW LEVEL SECURITY;

-- PostgREST Service Role bypass policy for server operations
DROP POLICY IF EXISTS service_role_all ON public.intelligence_sources;
CREATE POLICY service_role_all ON public.intelligence_sources USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.intelligence_items;
CREATE POLICY service_role_all ON public.intelligence_items USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.contractor_intelligence_actions;
CREATE POLICY service_role_all ON public.contractor_intelligence_actions USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.contractor_intelligence_acknowledgements;
CREATE POLICY service_role_all ON public.contractor_intelligence_acknowledgements USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.company_watch_records;
CREATE POLICY service_role_all ON public.company_watch_records USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.admin_tender_opportunities;
CREATE POLICY service_role_all ON public.admin_tender_opportunities USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all ON public.intelligence_ingestion_runs;
CREATE POLICY service_role_all ON public.intelligence_ingestion_runs USING (true) WITH CHECK (true);
