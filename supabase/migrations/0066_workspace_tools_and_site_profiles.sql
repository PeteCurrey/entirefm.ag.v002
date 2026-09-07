-- ============================================================================
-- 0066: Lobby Member Workspace — Site Profiles & Saved Tool Outputs
-- ============================================================================

-- 1. MEMBER SITE PROFILES
-- Allows members to define their estates/buildings once and reuse them across tools
CREATE TABLE IF NOT EXISTS public.member_site_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id           UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  building_type       TEXT NOT NULL,
  floor_area          TEXT NOT NULL,
  region              TEXT NOT NULL,
  operating_profile   TEXT NOT NULL,
  site_criticality    TEXT NOT NULL,
  portfolio_sites     INTEGER DEFAULT 1,
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_site_profiles_member_id 
  ON public.member_site_profiles (member_id);
CREATE INDEX IF NOT EXISTS idx_member_site_profiles_created_at 
  ON public.member_site_profiles (created_at DESC);

-- 2. MEMBER SAVED TOOL OUTPUTS
-- Unified ledger of all tool outputs, calculations, audits, and asset scans
CREATE TABLE IF NOT EXISTS public.member_saved_tool_outputs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id           UUID NOT NULL REFERENCES public.lobby_members(id) ON DELETE CASCADE,
  site_profile_id     UUID REFERENCES public.member_site_profiles(id) ON DELETE SET NULL,
  tool_name           TEXT NOT NULL,
  title               TEXT,
  inputs_json         JSONB NOT NULL DEFAULT '{}'::jsonb,
  outputs_json        JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary_kpis        JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_reference       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_saved_outputs_member_id 
  ON public.member_saved_tool_outputs (member_id);
CREATE INDEX IF NOT EXISTS idx_member_saved_outputs_site_profile_id 
  ON public.member_saved_tool_outputs (site_profile_id);
CREATE INDEX IF NOT EXISTS idx_member_saved_outputs_tool_name 
  ON public.member_saved_tool_outputs (tool_name);
CREATE INDEX IF NOT EXISTS idx_member_saved_outputs_created_at 
  ON public.member_saved_tool_outputs (created_at DESC);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.member_site_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_saved_tool_outputs ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES: Service Role Full Access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'member_site_profiles' AND policyname = 'service_role_member_site_profiles'
  ) THEN
    CREATE POLICY service_role_member_site_profiles ON public.member_site_profiles
      FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'member_saved_tool_outputs' AND policyname = 'service_role_member_saved_tool_outputs'
  ) THEN
    CREATE POLICY service_role_member_saved_tool_outputs ON public.member_saved_tool_outputs
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. POLICIES: Authenticated Member Access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'member_site_profiles' AND policyname = 'member_manage_own_site_profiles'
  ) THEN
    CREATE POLICY member_manage_own_site_profiles ON public.member_site_profiles
      FOR ALL
      USING (
        member_id IN (
          SELECT id FROM public.lobby_members WHERE auth_user_id = auth.uid()
        )
      )
      WITH CHECK (
        member_id IN (
          SELECT id FROM public.lobby_members WHERE auth_user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'member_saved_tool_outputs' AND policyname = 'member_manage_own_saved_outputs'
  ) THEN
    CREATE POLICY member_manage_own_saved_outputs ON public.member_saved_tool_outputs
      FOR ALL
      USING (
        member_id IN (
          SELECT id FROM public.lobby_members WHERE auth_user_id = auth.uid()
        )
      )
      WITH CHECK (
        member_id IN (
          SELECT id FROM public.lobby_members WHERE auth_user_id = auth.uid()
        )
      );
  END IF;
END $$;

COMMENT ON TABLE public.member_site_profiles IS 'Lobby Member reusable estate profiles';
COMMENT ON TABLE public.member_saved_tool_outputs IS 'Lobby Member saved interactive tool calculations and outputs';
