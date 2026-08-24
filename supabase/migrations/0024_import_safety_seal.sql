-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0024: IMPORT SAFETY SEAL
-- ============================================================================
-- Version: 1.0.0 (Phase 0I-PRE Import Safety Final Seal)

-- 1. EXTEND data_import_rows STATUS CONSTRAINT
ALTER TABLE public.data_import_rows
  DROP CONSTRAINT IF EXISTS data_import_rows_status_check;

ALTER TABLE public.data_import_rows
  ADD CONSTRAINT data_import_rows_status_check
  CHECK (status IN (
    'PENDING', 'VALID', 'INVALID', 'DUPLICATE',
    'UNCHANGED', 'CHANGE_DETECTED', 'POSSIBLE_DUPLICATE', 'CONFLICT',
    'SKIPPED', 'IMPORTED', 'FAILED', 'ROLLED_BACK', 'ROLLBACK_BLOCKED'
  ));

-- 2. ADD PROVENANCE COLUMNS TO data_import_rows
ALTER TABLE public.data_import_rows
  ADD COLUMN IF NOT EXISTS change_diff       jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS conflict_details  jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS matched_entity_id uuid  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS match_reason      text  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS pre_import_snapshot jsonb DEFAULT NULL;

-- 3. DUPLICATE DECISIONS TABLE
CREATE TABLE IF NOT EXISTS public.data_import_duplicate_decisions (
  id                    uuid primary key default gen_random_uuid(),
  batch_id              uuid not null references public.data_import_batches(id) on delete cascade,
  row_id                uuid not null references public.data_import_rows(id) on delete cascade,
  imported_name         text not null,
  candidate_entity_id   uuid,
  candidate_name        text,
  match_reason          text not null,
  decision              text not null check (decision in ('USE_EXISTING', 'CREATE_NEW', 'IGNORE_ROW')),
  decided_by_person_id  uuid references public.persons(id),
  decided_at            timestamptz not null default now(),
  notes                 text,
  created_at            timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_import_dup_decisions_batch ON public.data_import_duplicate_decisions (batch_id);
CREATE INDEX IF NOT EXISTS idx_import_dup_decisions_row  ON public.data_import_duplicate_decisions (row_id);

-- 4. RLS FOR NEW TABLE
ALTER TABLE public.data_import_duplicate_decisions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY import_dup_decisions_admin_all ON public.data_import_duplicate_decisions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.organisation_memberships m
        JOIN public.organisations o ON o.id = m.organisation_id
        WHERE m.person_id = auth.uid() AND o.org_type = 'ENTIREFM'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. EXTEND data_import_batches COUNTERS
ALTER TABLE public.data_import_batches
  ADD COLUMN IF NOT EXISTS unchanged_rows          integer not null default 0,
  ADD COLUMN IF NOT EXISTS change_detected_rows    integer not null default 0,
  ADD COLUMN IF NOT EXISTS possible_duplicate_rows integer not null default 0,
  ADD COLUMN IF NOT EXISTS conflict_rows           integer not null default 0;
