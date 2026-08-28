-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0033 — INTELLIGENCE LAYER HARDENING, LOCKS & TIER 1 GOVERNANCE (CP-09R2)
-- ============================================================================

-- 1. INGESTION LOCKS TABLE (Idempotency & Concurrent Execution Prevention)
CREATE TABLE IF NOT EXISTS public.intelligence_ingestion_locks (
  job_type text PRIMARY KEY, -- 'regulatory', 'tenders', 'company-watch'
  lock_id text NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz NOT NULL,
  started_by text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. TIER 1 GOVERNANCE & OPERATIONAL INTERPRETATION COLUMNS
ALTER TABLE public.intelligence_items
  ADD COLUMN IF NOT EXISTS operational_interpretation text NOT NULL DEFAULT 'PENDING_REVIEW',
  ADD COLUMN IF NOT EXISTS source_authenticity text NOT NULL DEFAULT 'OFFICIAL_SOURCE',
  ADD COLUMN IF NOT EXISTS is_mandatory_action boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requires_human_approval boolean NOT NULL DEFAULT true;

-- 3. TENDER NOTICE BID ELIGIBILITY
ALTER TABLE public.admin_tender_opportunities
  ADD COLUMN IF NOT EXISTS is_bid_eligible boolean NOT NULL DEFAULT true;

-- 4. INGESTION RUNS TRIGGER TYPE & CRON FAMILY
ALTER TABLE public.intelligence_ingestion_runs
  ADD COLUMN IF NOT EXISTS trigger_type text NOT NULL DEFAULT 'MANUAL', -- 'CRON' or 'MANUAL'
  ADD COLUMN IF NOT EXISTS cron_family text; -- 'regulatory', 'tenders', 'company-watch'

-- 5. CONTRACTOR TENANT ISOLATION RLS POLICIES
-- Ensure RLS is active on all intelligence tables
ALTER TABLE public.intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_intelligence_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_watch_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tender_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_ingestion_runs ENABLE ROW LEVEL SECURITY;

-- PostgREST Service Role Policy (Unrestricted for Trusted Server Ingestion)
DROP POLICY IF EXISTS service_role_all ON public.intelligence_ingestion_locks;
CREATE POLICY service_role_all ON public.intelligence_ingestion_locks USING (true) WITH CHECK (true);

-- Contractor Isolation: Actions can only be accessed by the owning contractor organisation
DROP POLICY IF EXISTS contractor_action_isolation ON public.contractor_intelligence_actions;
CREATE POLICY contractor_action_isolation ON public.contractor_intelligence_actions
  FOR ALL
  USING (
    contractor_org_id = current_setting('request.jwt.claim.org_id', true)
    OR current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );

-- Contractor Isolation: Acknowledgements can only be accessed by the owning contractor organisation
DROP POLICY IF EXISTS contractor_ack_isolation ON public.contractor_intelligence_acknowledgements;
CREATE POLICY contractor_ack_isolation ON public.contractor_intelligence_acknowledgements
  FOR ALL
  USING (
    contractor_org_id = current_setting('request.jwt.claim.org_id', true)
    OR current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );

-- Admin Only Isolation: Tender opportunities are completely inaccessible to contractor users
DROP POLICY IF EXISTS admin_tender_isolation ON public.admin_tender_opportunities;
CREATE POLICY admin_tender_isolation ON public.admin_tender_opportunities
  FOR ALL
  USING (
    current_setting('request.jwt.claim.role', true) IN ('SUPER_ADMIN', 'CEO', 'ADMINISTRATOR', 'service_role')
    OR current_setting('request.jwt.claim.sub', true) IS NULL -- Server side execution fallback
  );
