-- ============================================================================
-- ENTIREFM MIGRATION 0063: XERO ACCOUNTING INTEGRATION (OAUTH 2.0 + SYNC)
-- ============================================================================
-- Purpose:
--   1. Create xero_connections table for multi-tenant OAuth 2.0 encrypted state.
--   2. Create xero_oauth_states table for CSRF state validation.
--   3. Create xero_webhook_events table for durable, replay-protected webhook intake.
--   4. Extend client_accounts with xero_contact_id and sync metadata.
--   5. Extend client_invoices with xero_invoice_id and sync metadata.
--   6. Strict Row Level Security (RLS) policies ensuring tenant isolation.
-- ============================================================================

-- 1. XERO CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.xero_connections (
  id                        uuid primary key default gen_random_uuid(),
  organisation_id           uuid not null references public.organisations(id) on delete cascade,
  xero_tenant_id            text not null,
  xero_tenant_name          text not null,
  status                    text not null default 'CONNECTED'
                            check (status in ('CONNECTED', 'DISCONNECTED', 'ERROR', 'PENDING_AUTH', 'EXPIRED')),
  authorised_by_person_id   uuid references public.persons(id) on delete set null,
  scopes_granted            text[] not null default '{}',
  token_type                text not null default 'Bearer',
  encrypted_access_token    text not null,
  encrypted_refresh_token   text not null,
  token_iv                  text not null,
  token_auth_tag            text not null,
  expires_at                timestamptz not null,
  last_successful_sync_at   timestamptz,
  last_failed_sync_at       timestamptz,
  last_error                text,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint uq_xero_connections_org_tenant unique (organisation_id, xero_tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_xero_connections_org ON public.xero_connections(organisation_id);
CREATE INDEX IF NOT EXISTS idx_xero_connections_tenant ON public.xero_connections(xero_tenant_id);
CREATE INDEX IF NOT EXISTS idx_xero_connections_status ON public.xero_connections(status) WHERE is_active = true;

-- 2. XERO OAUTH STATES (CSRF & SESSION VALIDATION)
CREATE TABLE IF NOT EXISTS public.xero_oauth_states (
  state                     text primary key,
  person_id                 uuid not null references public.persons(id) on delete cascade,
  organisation_id           uuid not null references public.organisations(id) on delete cascade,
  return_url                text not null default '/admin/integrations/xero',
  expires_at                timestamptz not null,
  created_at                timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_xero_oauth_states_expires ON public.xero_oauth_states(expires_at);

-- 3. XERO WEBHOOK EVENTS (DURABLE & REPLAY-PROTECTED)
CREATE TABLE IF NOT EXISTS public.xero_webhook_events (
  id                        uuid primary key default gen_random_uuid(),
  event_signature           text not null,
  xero_tenant_id            text not null,
  event_category            text not null, -- e.g. INVOICE, CONTACT
  event_type                text not null, -- e.g. CREATE, UPDATE
  resource_id               text not null, -- Xero Resource GUID (InvoiceID, ContactID)
  resource_sequence         numeric,
  event_date_utc            timestamptz not null,
  idempotency_key           text not null unique,
  status                    text not null default 'RECEIVED'
                            check (status in ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED')),
  mapped_entity_type        text, -- e.g. CLIENT_INVOICE, CLIENT_ACCOUNT
  mapped_entity_id          uuid,
  error_message             text,
  attempt_count             integer not null default 0,
  raw_payload               jsonb not null default '{}'::jsonb,
  processed_at              timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_xero_webhooks_tenant ON public.xero_webhook_events(xero_tenant_id);
CREATE INDEX IF NOT EXISTS idx_xero_webhooks_status ON public.xero_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_xero_webhooks_resource ON public.xero_webhook_events(resource_id);

-- 4. EXTEND client_accounts WITH XERO COLUMNS
ALTER TABLE public.client_accounts
  ADD COLUMN IF NOT EXISTS xero_contact_id text,
  ADD COLUMN IF NOT EXISTS xero_contact_number text,
  ADD COLUMN IF NOT EXISTS xero_synced_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_client_accounts_xero_contact ON public.client_accounts(xero_contact_id);

-- 5. EXTEND client_invoices WITH XERO COLUMNS
ALTER TABLE public.client_invoices
  ADD COLUMN IF NOT EXISTS xero_invoice_id text,
  ADD COLUMN IF NOT EXISTS xero_invoice_number text,
  ADD COLUMN IF NOT EXISTS xero_synced_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_client_invoices_xero_inv_id ON public.client_invoices(xero_invoice_id);

-- 6. ROW LEVEL SECURITY
ALTER TABLE public.xero_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xero_oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xero_webhook_events ENABLE ROW LEVEL SECURITY;

-- Service Role full access (internal PostgREST client)
DROP POLICY IF EXISTS "service_role_xero_connections" ON public.xero_connections;
CREATE POLICY "service_role_xero_connections" ON public.xero_connections
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_xero_oauth_states" ON public.xero_oauth_states;
CREATE POLICY "service_role_xero_oauth_states" ON public.xero_oauth_states
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_xero_webhook_events" ON public.xero_webhook_events;
CREATE POLICY "service_role_xero_webhook_events" ON public.xero_webhook_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated Read Access for Connected Tenant Members
DROP POLICY IF EXISTS "tenant_read_xero_connections" ON public.xero_connections;
CREATE POLICY "tenant_read_xero_connections" ON public.xero_connections
  FOR SELECT TO authenticated
  USING (
    organisation_id IN (
      SELECT organisation_id FROM public.organisation_memberships
      WHERE person_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Update platform_integration_configs Xero description
UPDATE public.platform_integration_configs
SET note = 'Production OAuth 2.0 integration with granular accounting scopes, contacts, invoices, payments, and attachment synchronisation.',
    updated_at = now()
WHERE name = 'Xero';

-- Notify PostgREST schema reload
NOTIFY pgrst, 'reload schema';
