-- ============================================================
-- Migration 0025: CEO Command + Enterprise Intelligence (Phase 0I)
-- ============================================================
-- Precondition: 0024_import_safety_seal.sql must already be applied
-- Access: Restricted to EntireFM org + ADMIN context + required permission
-- All tables: RLS enabled, NOINDEX routes enforced in Next.js layout
-- ============================================================

-- Enterprise Metric Definitions
-- Canonical catalogue of executive-facing metrics.
-- References canonical domain services; does NOT copy formulas.
CREATE TABLE IF NOT EXISTS enterprise_metric_definitions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_code      TEXT NOT NULL UNIQUE,
  metric_name      TEXT NOT NULL,
  domain           TEXT NOT NULL,
  description      TEXT NOT NULL,
  required_permission TEXT NOT NULL,
  canonical_service   TEXT NOT NULL,
  formula_description TEXT,
  freshness_max_minutes INTEGER,
  metric_version   TEXT NOT NULL DEFAULT '1.0',
  data_coverage_note TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enterprise Signals
-- Deterministic signals evaluated from real-time operational data.
-- Severity is NEVER assigned by LLM — only by deterministic rules.
CREATE TABLE IF NOT EXISTS enterprise_signals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type     TEXT NOT NULL,
  domain          TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('INFO', 'WATCH', 'WARNING', 'CRITICAL')),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  client_id       UUID REFERENCES client_accounts(id) ON DELETE SET NULL,
  contract_id     UUID,
  site_id         UUID REFERENCES sites(id) ON DELETE SET NULL,
  provider_id     UUID,
  detected_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metric_code     TEXT,
  source_rule     TEXT NOT NULL,
  state           TEXT NOT NULL DEFAULT 'OPEN' CHECK (state IN ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
  owner           TEXT,
  resolved_at     TIMESTAMPTZ,
  evidence_json   JSONB,
  href            TEXT,
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Query Sessions
-- Audit trail of executive interrogation sessions.
CREATE TABLE IF NOT EXISTS ceo_query_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id       UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  context_entities_json JSONB,
  context_date_range_json JSONB,
  context_filters_json  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Query Messages
-- Individual turns within an executive interrogation session.
CREATE TABLE IF NOT EXISTS ceo_query_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES ceo_query_sessions(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
  content             TEXT NOT NULL,
  intent_category     TEXT,
  resolved_date_range_json JSONB,
  answer_json         JSONB,
  data_status         TEXT,
  organisation_id     UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Tool Runs
-- Audited ledger of every canonical tool executed by CEO Command.
-- Permission checks recorded before execution.
CREATE TABLE IF NOT EXISTS ceo_tool_runs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id          UUID REFERENCES ceo_query_messages(id) ON DELETE CASCADE,
  tool_id             TEXT NOT NULL,
  domain              TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('SUCCESS', 'RESTRICTED', 'ERROR', 'EMPTY', 'LICENSE_REQUIRED')),
  required_permission TEXT NOT NULL,
  permission_granted  BOOLEAN NOT NULL,
  executed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms         INTEGER,
  result_summary      TEXT,
  restriction_reason  TEXT,
  organisation_id     UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Executive Briefs
-- On-demand brief snapshots generated for an executive user.
CREATE TABLE IF NOT EXISTS executive_briefs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id       UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_label    TEXT NOT NULL DEFAULT 'Current State',
  sections_json   JSONB NOT NULL,
  signal_count    INTEGER NOT NULL DEFAULT 0,
  critical_signal_count INTEGER NOT NULL DEFAULT 0,
  overall_status  TEXT NOT NULL CHECK (overall_status IN ('GREEN', 'AMBER', 'RED', 'NO_DATA')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- All CEO Command tables: EntireFM org + admin application only.
-- Client, Contractor, Engineer org types: NO ACCESS.
-- ============================================================

ALTER TABLE enterprise_metric_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_query_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_query_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_tool_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_briefs ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for server-side API operations)
DROP POLICY IF EXISTS "service_role_bypass_enterprise_metrics" ON enterprise_metric_definitions;
CREATE POLICY "service_role_bypass_enterprise_metrics" ON enterprise_metric_definitions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_enterprise_signals" ON enterprise_signals;
CREATE POLICY "service_role_bypass_enterprise_signals" ON enterprise_signals FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_sessions" ON ceo_query_sessions;
CREATE POLICY "service_role_bypass_ceo_sessions" ON ceo_query_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_messages" ON ceo_query_messages;
CREATE POLICY "service_role_bypass_ceo_messages" ON ceo_query_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ceo_tool_runs" ON ceo_tool_runs;
CREATE POLICY "service_role_bypass_ceo_tool_runs" ON ceo_tool_runs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_executive_briefs" ON executive_briefs;
CREATE POLICY "service_role_bypass_executive_briefs" ON executive_briefs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_enterprise_signals_severity ON enterprise_signals(severity, state);
CREATE INDEX IF NOT EXISTS idx_enterprise_signals_domain ON enterprise_signals(domain);
CREATE INDEX IF NOT EXISTS idx_ceo_query_sessions_person ON ceo_query_sessions(person_id);
CREATE INDEX IF NOT EXISTS idx_ceo_query_messages_session ON ceo_query_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tool_runs_message ON ceo_tool_runs(message_id);
CREATE INDEX IF NOT EXISTS idx_executive_briefs_person ON executive_briefs(person_id);

-- ============================================================
-- AI AGENT REGISTRATION: CEO_COMMAND_AGENT
-- ============================================================
INSERT INTO ai_agents (
  code, name, description, role_description, autonomy_level,
  is_active, max_daily_budget_gbp, confidence_threshold
) VALUES (
  'CEO_COMMAND_AGENT',
  'CEO Command Intelligence Agent',
  'Executive intelligence agent for EntireFM CEO Command. Reads operational data via canonical tool registry. Never writes or mutates.',
  'Answers executive questions about operations, finance, compliance, PPM, supply chain, and commercial performance using deterministic canonical services. Autonomy: ASSIST. Authority: READ ONLY.',
  'ASSIST',
  true,
  0.00,  -- Zero budget: read-only agent has no monetary authority
  0.95
) ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  role_description = EXCLUDED.role_description,
  autonomy_level = EXCLUDED.autonomy_level,
  is_active = EXCLUDED.is_active,
  max_daily_budget_gbp = EXCLUDED.max_daily_budget_gbp,
  confidence_threshold = EXCLUDED.confidence_threshold;

-- ============================================================
-- SEED: CANONICAL ENTERPRISE METRIC DEFINITIONS
-- ============================================================
INSERT INTO enterprise_metric_definitions (metric_code, metric_name, domain, description, required_permission, canonical_service, formula_description, freshness_max_minutes, metric_version, data_coverage_note) VALUES
  ('ACTUAL_GROSS_MARGIN', 'Actual Gross Margin', 'FINANCE', 'Invoiced Revenue minus Approved Supplier Cost. Attribution coverage reported.', 'finance:read', 'server/finance.getFinanceKPISummary + detectBillingLeakage', 'No formula copied — references finance authority only.', 30, '1.0', 'Requires ≥80% cost attribution for reliable margin figure.'),
  ('UNBILLED_WIP', 'Unbilled Work-in-Progress', 'FINANCE', 'Completed billable work orders with no billing record.', 'finance:read', 'server/finance.detectBillingLeakage', 'No formula copied.', 30, '1.0', NULL),
  ('SLA_ATTENDANCE_AT_RISK', 'SLA Attendance At Risk', 'OPERATIONS', 'Work orders approaching or breaching attendance SLA threshold.', 'operations:read', 'server/work.listActiveSLARisks', 'No formula copied.', 5, '1.0', NULL),
  ('PPM_DUE_30_DAYS', 'PPM Due Next 30 Days', 'PPM', 'Maintenance occurrences scheduled in next 30 calendar days.', 'ppm:manage', 'server/db.maintenance_occurrences', 'No formula copied.', 15, '1.0', NULL),
  ('PPM_OVERDUE', 'PPM Overdue', 'PPM', 'Maintenance occurrences past scheduled date.', 'ppm:manage', 'server/db.maintenance_occurrences', 'No formula copied.', 15, '1.0', NULL),
  ('COMPLIANCE_OVERDUE_OBLIGATIONS', 'Overdue Compliance Obligations', 'COMPLIANCE', 'Obligations past due date from Phase 0J Compliance Intelligence.', 'compliance:read', 'server/compliance.getOverdueObligations', 'No formula copied.', 30, '1.0', NULL),
  ('PROVIDER_ATTENDANCE_SLA_PCT', 'Provider Attendance SLA %', 'SUPPLY_CHAIN', 'Attendance SLA compliance % per provider.', 'supply_chain:read', 'server/supply-chain.listAllProviderPerformances', 'No formula copied.', 30, '1.0', 'Calculated from canonical assignment data.'),
  ('BILLING_LEAKAGE_COUNT', 'Billing Leakage Count', 'FINANCE', 'Completed billable work orders not yet invoiced.', 'finance:read', 'server/finance.detectBillingLeakage', 'No formula copied.', 30, '1.0', NULL),
  ('SFG20_STATUS', 'SFG20 Maintenance Schedule Status', 'COMPLIANCE', 'SFG20 schedules require a valid BESA SFG20 licence.', 'compliance:read', 'LICENSE_REQUIRED', 'LICENSE_REQUIRED — no formula.', NULL, '1.0', 'LICENSE_REQUIRED: SFG20 is a licensed commercial standard. Requires active per-client or platform licence from BESA.')
ON CONFLICT (metric_code) DO UPDATE SET
  metric_name = EXCLUDED.metric_name,
  description = EXCLUDED.description,
  canonical_service = EXCLUDED.canonical_service,
  updated_at = now();
