/**
 * ENTIREFM UNIFIED OPERATIONS PLATFORM
 * MIGRATION 0037 — CONTRACTOR MEMBERSHIP FEES & INVITATION CODES
 * ============================================================================
 * Additive schema for:
 * 1. public.entirefm_invitation_codes — Controlled invitation code ledger
 * 2. public.entirefm_invitation_redemptions — Immutable audit trail of fee waivers
 * 3. Extended columns on public.supplier_application_drafts for tier selection
 *    and commercial audit trail.
 *
 * NON-NEGOTIABLE SAFETY GUARANTEES:
 * - Purely additive. No DROPs, TRUNCATEs, or destructive alterations.
 * - All new columns DEFAULT NULL or DEFAULT 0 to prevent retroactively
 *   demanding payment from grandfathered contractors or past drafts.
 */

-- ============================================================================
-- 1. ENTIREFM INVITATION CODES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.entirefm_invitation_codes (
  id                    text        PRIMARY KEY,
  code                  text        NOT NULL UNIQUE,  -- e.g. EFM-7K4P-X9Q2 (case-insensitive indexed)
  tier_eligibility      text        NOT NULL DEFAULT 'ANY', -- 'TIER_1' | 'TIER_2' | 'ANY'
  fee_treatment         text        NOT NULL DEFAULT 'FULL_WAIVER', -- 'FULL_WAIVER'
  max_redemptions       integer     NOT NULL DEFAULT 1,
  redemptions_count     integer     NOT NULL DEFAULT 0,
  bound_email           text,       -- Optional: restrict redemption to specific contact email
  bound_org_id          text,       -- Optional: restrict redemption to specific contractor org
  expires_at            timestamptz NOT NULL,
  internal_reason       text,
  created_by_admin_id   text        NOT NULL,
  is_revoked            boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON public.entirefm_invitation_codes (lower(code));
CREATE INDEX IF NOT EXISTS idx_invitation_codes_bound_email ON public.entirefm_invitation_codes (lower(bound_email));
CREATE INDEX IF NOT EXISTS idx_invitation_codes_is_revoked ON public.entirefm_invitation_codes (is_revoked);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_expires_at ON public.entirefm_invitation_codes (expires_at);

-- RLS
ALTER TABLE public.entirefm_invitation_codes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'service_role_invitation_codes'
      AND tablename  = 'entirefm_invitation_codes'
  ) THEN
    DROP POLICY IF EXISTS service_role_invitation_codes
      ON public.entirefm_invitation_codes;
CREATE POLICY service_role_invitation_codes
      ON public.entirefm_invitation_codes
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 2. ENTIREFM INVITATION REDEMPTIONS TABLE (AUDIT LEDGER)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.entirefm_invitation_redemptions (
  id                          text          PRIMARY KEY,
  invitation_code_id          text          NOT NULL REFERENCES public.entirefm_invitation_codes(id),
  supplier_org_id             text          NOT NULL,
  redeemed_by_auth_user_id    text          NOT NULL,
  redeemed_at                 timestamptz   NOT NULL DEFAULT now(),
  membership_tier             text          NOT NULL,
  standard_amount_gbp         numeric(10,2) NOT NULL,
  waived_amount_gbp           numeric(10,2) NOT NULL,
  final_amount_gbp            numeric(10,2) NOT NULL DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_invitation_id ON public.entirefm_invitation_redemptions (invitation_code_id);
CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_org_id ON public.entirefm_invitation_redemptions (supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_invitation_redemptions_user_id ON public.entirefm_invitation_redemptions (redeemed_by_auth_user_id);

-- RLS
ALTER TABLE public.entirefm_invitation_redemptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'service_role_invitation_redemptions'
      AND tablename  = 'entirefm_invitation_redemptions'
  ) THEN
    DROP POLICY IF EXISTS service_role_invitation_redemptions
      ON public.entirefm_invitation_redemptions;
CREATE POLICY service_role_invitation_redemptions
      ON public.entirefm_invitation_redemptions
      FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 3. EXTEND SUPPLIER APPLICATION DRAFTS WITH MEMBERSHIP COLUMNS
-- ============================================================================

ALTER TABLE public.supplier_application_drafts
  ADD COLUMN IF NOT EXISTS selected_membership_tier        text,
  ADD COLUMN IF NOT EXISTS membership_standard_amount_gbp  numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS membership_waived_amount_gbp    numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS membership_final_amount_gbp     numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS invitation_code_id              text,
  ADD COLUMN IF NOT EXISTS membership_payment_status       text DEFAULT 'UNPAID',
  ADD COLUMN IF NOT EXISTS membership_payment_intent_id    text,
  ADD COLUMN IF NOT EXISTS membership_paid_at              timestamptz;

-- Add comments for DB documentation
COMMENT ON TABLE public.entirefm_invitation_codes IS
  'Controlled EntireFM Invitation Codes waiving contractor membership fees to £0 for invited partners.';

COMMENT ON TABLE public.entirefm_invitation_redemptions IS
  'Immutable audit log recording every invitation redemption, standard price, waived amount, and actor.';
