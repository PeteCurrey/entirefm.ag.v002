-- ============================================================================
-- ENTIREFM MIGRATION 0053: LOBBY CLIENT LINKS (IDENTITY UNIFICATION)
-- ============================================================================
-- Decouples Lobby membership from Client organisation linkage.
-- A single Supabase auth_user_id can be:
--   1. Lobby member only (0 links)
--   2. Both Lobby member AND linked to 1+ client organisations
-- Opt-in, reversible, explicit human action only (zero automated inference).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lobby_client_links (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_account_id   uuid NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  role_code           text NOT NULL DEFAULT 'CLIENT_USER',
  status              text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'REVOKED')),
  linked_by           text NOT NULL DEFAULT 'ADMIN', -- 'ADMIN' or 'SELF_CONFIRMED'
  linked_at           timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(auth_user_id, client_account_id)
);

CREATE INDEX IF NOT EXISTS idx_lobby_client_links_user ON public.lobby_client_links (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_lobby_client_links_account ON public.lobby_client_links (client_account_id);
CREATE INDEX IF NOT EXISTS idx_lobby_client_links_status ON public.lobby_client_links (status);

-- Enable RLS
ALTER TABLE public.lobby_client_links ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'service_role_lobby_client_links' 
      AND tablename = 'lobby_client_links'
  ) THEN
    CREATE POLICY service_role_lobby_client_links 
      ON public.lobby_client_links 
      FOR ALL TO service_role 
      USING (true) 
      WITH CHECK (true);
  END IF;
END $$;
