-- ============================================================================
-- MIGRATION 0035: REGISTRATION INTENT PERSISTENCE
-- ============================================================================
-- Adds durable registration provenance to supplier_users and supplier_organisations.
-- Ensures the platform knows WHY an account was created — never infers from email
-- or date alone.
-- ============================================================================

-- 1. Add registration provenance columns to supplier_users
ALTER TABLE public.supplier_users
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING',
  ADD COLUMN IF NOT EXISTS application_type    TEXT DEFAULT 'CONTRACTOR';

-- 2. Add registration provenance to supplier_organisations
ALTER TABLE public.supplier_organisations
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING';

-- 3. Backfill existing genuine registrations
UPDATE public.supplier_users
SET
  registration_source = 'CONTRACTOR_ONBOARDING',
  application_type    = 'CONTRACTOR'
WHERE registration_source IS NULL
   OR registration_source = 'CONTRACTOR_ONBOARDING';

UPDATE public.supplier_organisations
SET registration_source = 'CONTRACTOR_ONBOARDING'
WHERE registration_source IS NULL;

COMMENT ON COLUMN public.supplier_users.registration_source IS
  'Canonical registration path: CONTRACTOR_ONBOARDING | CLIENT_INVITE | ADMIN_CREATED | MANUALLY_CLASSIFIED_BY_ADMIN';

COMMENT ON COLUMN public.supplier_users.application_type IS
  'Intended application type at registration: CONTRACTOR | MANAGED_SERVICE | SPECIALIST';

COMMENT ON COLUMN public.supplier_organisations.registration_source IS
  'Source of organisation creation: CONTRACTOR_ONBOARDING | ADMIN_CREATED | MANUALLY_CLASSIFIED_BY_ADMIN';
