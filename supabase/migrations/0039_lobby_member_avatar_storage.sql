-- ============================================================================
-- ENTIREFM MIGRATION 0039: LOBBY MEMBER AVATAR & STORAGE INFRASTRUCTURE
-- ============================================================================
-- Description:
--   1. Ensures storage bucket 'profile-avatars' is created and publicly readable
--   2. Configures strict Storage RLS policies for member-owned avatar management
--   3. Guarantees avatar_url column existence and indexing on physical persons & member profiles
--   4. Preserves 100% backward compatibility and CAFM isolation
-- ============================================================================

-- 1. Ensure avatar_url column exists on public.persons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'persons' 
      AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.persons ADD COLUMN avatar_url text;
  END IF;
END $$;

-- 2. Ensure lobby_members table exists in Postgres for long-term member profile persistence
CREATE TABLE IF NOT EXISTS public.lobby_members (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id            uuid UNIQUE,
  email                   text NOT NULL UNIQUE,
  display_name            text NOT NULL,
  first_name              text NOT NULL,
  last_name               text NOT NULL,
  username                text NOT NULL UNIQUE,
  avatar_url              text,
  headline                text,
  bio                     text,
  company                 text,
  job_title               text,
  location                text,
  website                 text,
  linkedin_url            text,
  member_status           text NOT NULL DEFAULT 'active',
  profile_visibility      text NOT NULL DEFAULT 'public',
  disciplines             text[] DEFAULT '{}',
  sectors                 text[] DEFAULT '{}',
  qualifications          text[] DEFAULT '{}',
  badges                  text[] DEFAULT '{ "Lobby Member" }',
  reputation_score        integer NOT NULL DEFAULT 10,
  saved_content_ids       text[] DEFAULT '{}',
  email_preferences       jsonb DEFAULT '{"weeklyBriefing": true, "communityUpdates": true, "directMessages": true}'::jsonb,
  notification_preferences jsonb DEFAULT '{"inApp": true, "emailDigest": true, "mentionAlerts": true}'::jsonb,
  policy_consents         jsonb DEFAULT '[]'::jsonb,
  email_verified_at       timestamptz,
  last_active_at          timestamptz DEFAULT now(),
  joined_at               timestamptz DEFAULT now(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by username, email, and auth_user_id
CREATE INDEX IF NOT EXISTS idx_lobby_members_username ON public.lobby_members (username);
CREATE INDEX IF NOT EXISTS idx_lobby_members_email ON public.lobby_members (email);
CREATE INDEX IF NOT EXISTS idx_lobby_members_auth_user_id ON public.lobby_members (auth_user_id);
CREATE INDEX IF NOT EXISTS idx_lobby_members_status ON public.lobby_members (member_status);

-- Enable RLS on lobby_members
ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for active and public member profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'public_view_lobby_members' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS public_view_lobby_members ON public.lobby_members;
CREATE POLICY public_view_lobby_members ON public.lobby_members
      FOR SELECT
      USING (member_status = 'active' AND profile_visibility IN ('public', 'members_only'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_lobby_members' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS service_role_lobby_members ON public.lobby_members;
CREATE POLICY service_role_lobby_members ON public.lobby_members
      FOR ALL TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'members_manage_own_profile' AND tablename = 'lobby_members'
  ) THEN
    DROP POLICY IF EXISTS members_manage_own_profile ON public.lobby_members;
CREATE POLICY members_manage_own_profile ON public.lobby_members
      FOR ALL
      TO authenticated
      USING (auth.uid() = auth_user_id)
      WITH CHECK (auth.uid() = auth_user_id);
  END IF;
END $$;

-- ============================================================================
-- 3. SUPABASE STORAGE BUCKET: profile-avatars
-- ============================================================================

-- Insert bucket if storage schema is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'profile-avatars',
      'profile-avatars',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE SET
      public = true,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

    -- Policies on storage.objects
    DROP POLICY IF EXISTS profile_avatars_public_read ON storage.objects;
    CREATE POLICY profile_avatars_public_read ON storage.objects
      FOR SELECT
      USING (bucket_id = 'profile-avatars');

    DROP POLICY IF EXISTS profile_avatars_owner_insert ON storage.objects;
    CREATE POLICY profile_avatars_owner_insert ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_owner_update ON storage.objects;
    CREATE POLICY profile_avatars_owner_update ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      )
      WITH CHECK (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_owner_delete ON storage.objects;
    CREATE POLICY profile_avatars_owner_delete ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'profile-avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );

    DROP POLICY IF EXISTS profile_avatars_service_role_all ON storage.objects;
    CREATE POLICY profile_avatars_service_role_all ON storage.objects
      FOR ALL
      TO service_role
      USING (bucket_id = 'profile-avatars')
      WITH CHECK (bucket_id = 'profile-avatars');
  END IF;
END $$;

COMMENT ON TABLE public.lobby_members IS
  'Verified member identities for The Lobby, containing professional credentials, avatars, and community contributions.';
