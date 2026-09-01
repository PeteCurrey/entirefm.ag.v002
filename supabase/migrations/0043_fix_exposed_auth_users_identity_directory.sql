-- ============================================================================
-- ENTIREFM MIGRATION 0043: RESOLVE EXPOSED AUTH.USERS IN ADMIN IDENTITY DIRECTORY
-- ============================================================================
-- Resolves Supabase Security Advisor Linter: 0002_auth_users_exposed
-- Replaces direct auth.users selection in public.admin_user_identity_directory
-- with public.user_identities (a dedicated profiles table with strict RLS and trigger sync).
-- ============================================================================

-- 1. HARDEN & EXTEND public.user_identities CONSTRAINTS & COLUMNS
DO $$
BEGIN
  -- Make person_id nullable if it was previously NOT NULL
  ALTER TABLE public.user_identities ALTER COLUMN person_id DROP NOT NULL;

  -- Drop legacy unique constraint on email (auth_user_id is the canonical unique key)
  ALTER TABLE public.user_identities DROP CONSTRAINT IF EXISTS user_identities_email_key;

  -- Add email_verified column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN email_verified boolean NOT NULL DEFAULT false;
  END IF;

  -- Add last_sign_in_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'last_sign_in_at'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN last_sign_in_at timestamptz;
  END IF;

  -- Add primary_email_snapshot column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_identities' AND column_name = 'primary_email_snapshot'
  ) THEN
    ALTER TABLE public.user_identities ADD COLUMN primary_email_snapshot text;
  END IF;
END $$;

-- 2. LINK EXISTING UNLINKED user_identities ROWS BY EMAIL FIRST
UPDATE public.user_identities ui
SET auth_user_id = u.id,
    email_verified = (u.email_confirmed_at IS NOT NULL),
    last_sign_in_at = u.last_sign_in_at
FROM auth.users u
WHERE ui.auth_user_id IS NULL 
  AND lower(ui.email) = lower(u.email);

-- 3. BACKFILL / UPSERT ALL auth.users INTO public.user_identities
INSERT INTO public.user_identities (
  auth_user_id,
  email,
  primary_email_snapshot,
  email_verified,
  first_name,
  last_name,
  display_name,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  u.id,
  u.email,
  u.email,
  (u.email_confirmed_at IS NOT NULL),
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(
    NULLIF(TRIM(CONCAT(COALESCE(u.raw_user_meta_data->>'first_name', ''), ' ', COALESCE(u.raw_user_meta_data->>'last_name', ''))), ''),
    u.email
  ),
  u.last_sign_in_at,
  u.created_at,
  now()
FROM auth.users u
ON CONFLICT (auth_user_id) DO UPDATE SET
  email = EXCLUDED.email,
  primary_email_snapshot = COALESCE(public.user_identities.primary_email_snapshot, EXCLUDED.email),
  email_verified = EXCLUDED.email_verified,
  first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), public.user_identities.first_name),
  last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), public.user_identities.last_name),
  display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), public.user_identities.display_name),
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  updated_at = now();

-- 4. CREATE AUTOMATIC SYNC TRIGGER FROM auth.users TO public.user_identities
CREATE OR REPLACE FUNCTION public.handle_auth_user_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_identities (
    auth_user_id,
    email,
    primary_email_snapshot,
    email_verified,
    first_name,
    last_name,
    display_name,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email,
    (NEW.email_confirmed_at IS NOT NULL),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      NULLIF(TRIM(CONCAT(COALESCE(NEW.raw_user_meta_data->>'first_name', ''), ' ', COALESCE(NEW.raw_user_meta_data->>'last_name', ''))), ''),
      NEW.email
    ),
    NEW.last_sign_in_at,
    COALESCE(NEW.created_at, now()),
    now()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    email_verified = EXCLUDED.email_verified,
    first_name = CASE 
      WHEN EXCLUDED.first_name <> '' THEN EXCLUDED.first_name 
      ELSE public.user_identities.first_name 
    END,
    last_name = CASE 
      WHEN EXCLUDED.last_name <> '' THEN EXCLUDED.last_name 
      ELSE public.user_identities.last_name 
    END,
    display_name = CASE 
      WHEN EXCLUDED.display_name <> '' THEN EXCLUDED.display_name 
      ELSE public.user_identities.display_name 
    END,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;
CREATE TRIGGER on_auth_user_sync
  AFTER INSERT OR UPDATE OF email, email_confirmed_at, raw_user_meta_data, last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_sync();

-- 5. RECREATE SECURE ADMIN DIRECTORY VIEW WITHOUT auth.users
DROP VIEW IF EXISTS public.admin_user_identity_directory CASCADE;

CREATE OR REPLACE VIEW public.admin_user_identity_directory
WITH (security_invoker = true) AS
SELECT
  ui.auth_user_id,
  ui.email,
  COALESCE(ui.email_verified, false) AS email_verified,
  COALESCE(
    lm.display_name,
    ui.display_name,
    NULLIF(TRIM(CONCAT(COALESCE(ui.first_name, ''), ' ', COALESCE(ui.last_name, ''))), ''),
    ui.email
  ) AS display_name,
  COALESCE(lm.first_name, ui.first_name) AS first_name,
  COALESCE(lm.last_name, ui.last_name) AS last_name,
  (lm.id IS NOT NULL) AS is_lobby_member,
  COALESCE(lm.member_status, 'none') AS lobby_member_status,
  lm.username AS lobby_username,
  lm.joined_at AS lobby_joined_at,
  COALESCE(oi.identity_type, 'NONE') AS operational_identity_type,
  COALESCE(oi.status, 'NONE') AS operational_status,
  COALESCE(oi.organisation_id, so.id) AS organisation_id,
  COALESCE(oi.organisation_name, so.legal_name) AS organisation_name,
  COALESCE(oi.role_code, 'NONE') AS operational_role_code,
  ui.created_at AS auth_created_at,
  ui.last_sign_in_at AS last_sign_in_at
FROM public.user_identities ui
LEFT JOIN public.lobby_members lm ON lm.auth_user_id = ui.auth_user_id
LEFT JOIN public.operational_identities oi ON oi.auth_user_id = ui.auth_user_id
LEFT JOIN public.supplier_organisations so ON so.owner_id = ui.auth_user_id;

-- 6. SECURE PRIVILEGES: Revoke public/anon/authenticated access to directory view
REVOKE ALL ON public.admin_user_identity_directory FROM anon, authenticated, public;
GRANT SELECT ON public.admin_user_identity_directory TO service_role;

-- 7. STRICT ROW LEVEL SECURITY ON public.user_identities
ALTER TABLE public.user_identities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_self_select'
  ) THEN
    CREATE POLICY user_identities_self_select ON public.user_identities
      FOR SELECT USING (auth.uid() = auth_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_self_update'
  ) THEN
    CREATE POLICY user_identities_self_update ON public.user_identities
      FOR UPDATE USING (auth.uid() = auth_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_identities' AND policyname = 'user_identities_service_role'
  ) THEN
    CREATE POLICY user_identities_service_role ON public.user_identities
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
