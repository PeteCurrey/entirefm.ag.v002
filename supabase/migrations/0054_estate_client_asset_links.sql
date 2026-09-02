-- ============================================================================
-- ENTIREFM MIGRATION 0054: ESTATE <-> CLIENT ASSET LINKS (EXPLICIT ONLY)
-- ============================================================================
-- Links member-scanned estate assets to authoritative client portfolio assets.
-- Core principles:
-- 1. Client-side records are ALWAYS authoritative over My Estate records.
-- 2. ZERO automated copy, overwrite, or data merge.
-- 3. Explicit human confirmation required.
-- 4. Unlinking deletes ONLY the link reference, never either asset record.
-- 5. Dismissals are recorded so members are not repeatedly nagged.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.estate_client_asset_links (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estate_asset_firestore_id   text NOT NULL,
  client_asset_id             uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  linked_by                   text NOT NULL DEFAULT 'MEMBER',
  linked_at                   timestamptz NOT NULL DEFAULT now(),
  metadata                    jsonb DEFAULT '{}'::jsonb,
  UNIQUE(auth_user_id, estate_asset_firestore_id, client_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_estate_client_links_user ON public.estate_client_asset_links (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_estate_client_links_client_asset ON public.estate_client_asset_links (client_asset_id);
CREATE INDEX IF NOT EXISTS idx_estate_client_links_estate_asset ON public.estate_client_asset_links (estate_asset_firestore_id);

CREATE TABLE IF NOT EXISTS public.estate_client_link_dismissals (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estate_asset_firestore_id   text NOT NULL,
  client_asset_id             uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  dismissed_at                timestamptz NOT NULL DEFAULT now(),
  UNIQUE(auth_user_id, estate_asset_firestore_id, client_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_estate_dismissals_user ON public.estate_client_link_dismissals (auth_user_id);

-- Enable RLS
ALTER TABLE public.estate_client_asset_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_client_link_dismissals ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'service_role_estate_client_asset_links' 
      AND tablename = 'estate_client_asset_links'
  ) THEN
    CREATE POLICY service_role_estate_client_asset_links 
      ON public.estate_client_asset_links 
      FOR ALL TO service_role 
      USING (true) 
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'service_role_estate_client_link_dismissals' 
      AND tablename = 'estate_client_link_dismissals'
  ) THEN
    CREATE POLICY service_role_estate_client_link_dismissals 
      ON public.estate_client_link_dismissals 
      FOR ALL TO service_role 
      USING (true) 
      WITH CHECK (true);
  END IF;
END $$;
