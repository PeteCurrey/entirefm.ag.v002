-- ============================================================================
-- MIGRATION 0064: SEED ROOT ORGANISATION RECORD
-- ============================================================================
-- Purpose:
--   Insert the canonical "root" EntireFM organisation row with the well-known
--   UUID 00000000-0000-0000-0000-000000000000.
--
--   This UUID is used throughout the codebase as the orgId for system/admin
--   sessions that are not scoped to a specific client organisation (e.g. the
--   legacy ADMIN_PASSWORD session, super-admin CLI actors, and the Xero
--   OAuth flow initiated by an admin user).
--
--   Without this row the xero_oauth_states FK constraint rejects state
--   insertions for admin sessions, causing a 500 on /api/integrations/xero/connect.
--
-- Safe to apply multiple times: ON CONFLICT DO NOTHING.
-- ============================================================================

INSERT INTO public.organisations (
  id,
  code,
  name,
  legal_name,
  org_type,
  status,
  tier,
  source_system
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ENTIREFM-ROOT',
  'EntireFM Root Operations',
  'EntireFM Ltd',
  'ENTIREFM',
  'ACTIVE',
  'STANDARD',
  'ENTIREFM'
)
ON CONFLICT (id) DO NOTHING;
