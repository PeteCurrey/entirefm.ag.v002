-- ============================================================
-- Migration 0026: Canonical Platform Integration Config + AI Budget Semantics
-- ============================================================
-- Precondition: 0025_ceo_command_enterprise_intelligence.sql applied
--
-- Purpose:
--   1. Create platform_integration_configs table — canonical source
--      for all external integration states.
--   2. Seed accounting connectors with INTERFACE_ONLY state.
--   3. Document and enforce AI agent budget semantics.
--   4. Update CEO_COMMAND_AGENT budget to £2.00/day (dev cap).
-- ============================================================

-- Platform Integration Configs
-- Single canonical table for all external integration states.
-- CEO Command, executive briefs, admin UI — all read from here.
CREATE TABLE IF NOT EXISTS platform_integration_configs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  type         TEXT NOT NULL CHECK (type IN ('ACCOUNTING','CRM','ERP','FIELD','PAYMENT','COMMS')),
  state        TEXT NOT NULL CHECK (state IN ('LIVE','TEST','INTERFACE_ONLY','NOT_CONFIGURED','DEGRADED','FAILED','DISABLED')),
  note         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  configured_by TEXT,
  last_checked_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_integration_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_bypass_platform_integration_configs"
  ON platform_integration_configs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed canonical accounting connector states
INSERT INTO platform_integration_configs (name, type, state, note, is_active) VALUES
  ('Xero',        'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('QuickBooks',  'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('Sage',        'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true),
  ('NetSuite',    'ACCOUNTING', 'INTERFACE_ONLY', 'Pending per-client activation. Interface built; no active data connections.', true)
ON CONFLICT (name) DO UPDATE SET
  state = EXCLUDED.state,
  note = EXCLUDED.note,
  updated_at = now();

-- ============================================================
-- AI AGENT BUDGET SEMANTICS
-- ============================================================
-- Budget policy for max_daily_budget_gbp:
--   NULL      → NO BUDGET CONFIGURED (unmanaged; not recommended for production)
--   0.00      → MODEL CALLS DISABLED (zero spend allowed; agent runs deterministically only)
--   > 0       → CAPPED BUDGET (max GBP spend per calendar day; enforced by AI Control Plane)
--
-- CEO_COMMAND_AGENT uses a governed model for explanation generation.
-- Development cap: £2.00/day (approximately 400,000 tokens @ £0.005/1K tokens).
-- ============================================================
ALTER TABLE ai_agents
  ADD COLUMN IF NOT EXISTS budget_policy TEXT
    CHECK (budget_policy IN ('ZERO_DISABLES','CAPPED','UNLIMITED'))
    DEFAULT 'CAPPED';

COMMENT ON COLUMN ai_agents.budget_policy IS
  'ZERO_DISABLES: max_daily_budget_gbp=0 disables model calls. '
  'CAPPED: enforced daily spend limit. '
  'UNLIMITED: no spend limit (production not recommended without monitoring).';

COMMENT ON COLUMN ai_agents.max_daily_budget_gbp IS
  'Daily budget cap in GBP. NULL=not configured. 0.00=model calls disabled. >0=capped.';

UPDATE ai_agents SET
  max_daily_budget_gbp = 2.00,
  budget_policy = 'CAPPED'
WHERE code = 'CEO_COMMAND_AGENT';

-- ============================================================
-- INDEX
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_platform_integration_configs_state
  ON platform_integration_configs(state);
