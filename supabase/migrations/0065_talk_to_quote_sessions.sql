-- ============================================================================
-- Migration 0065: Talk-to-Quote Sessions & AI Field Intelligence Audit Trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.talk_to_quote_sessions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engineer_person_id          uuid NOT NULL REFERENCES public.persons(id),
  organisation_id             uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  client_account_id           uuid REFERENCES public.client_accounts(id) ON DELETE SET NULL,
  site_id                     uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  asset_id                    uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  work_order_id               uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  session_context_json        jsonb NOT NULL DEFAULT '{}'::jsonb,
  conversation_turns_json     jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_extraction_json          jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_enrichment_json          jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence_level            text NOT NULL DEFAULT 'REVIEW', -- HIGH, REVIEW, LOW
  confidence_score            numeric(3,2) DEFAULT 0.85,
  flags_json                  jsonb NOT NULL DEFAULT '[]'::jsonb,
  field_quote_scope_id        uuid REFERENCES public.field_quote_scopes(id) ON DELETE SET NULL,
  quote_id                    uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  status                      text NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, QUOTE_CREATED, REVIEW_REQUIRED, COMPLETED, ABANDONED
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ttq_sessions_eng ON public.talk_to_quote_sessions(engineer_person_id);
CREATE INDEX IF NOT EXISTS idx_ttq_sessions_org ON public.talk_to_quote_sessions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_ttq_sessions_site ON public.talk_to_quote_sessions(site_id);
CREATE INDEX IF NOT EXISTS idx_ttq_sessions_quote ON public.talk_to_quote_sessions(quote_id);
CREATE INDEX IF NOT EXISTS idx_ttq_sessions_created ON public.talk_to_quote_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE public.talk_to_quote_sessions ENABLE ROW LEVEL SECURITY;
