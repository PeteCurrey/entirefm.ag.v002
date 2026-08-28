/**
 * Apply schema migrations to live Supabase via PostgREST Management API.
 * Uses the SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env.
 */
import { dbQuery } from '../src/server/db/client';

async function applyDDL(description: string, endpoint: string, body: object) {
  // We can't run DDL via PostgREST data API, but we can verify and track
  console.log(`  Checking: ${description}`);
}

async function checkAndReportMissing() {
  const missing: string[] = [];

  // Check supplier_users.registration_source
  const { error: e1 } = await dbQuery<any[]>('supplier_users?select=registration_source&limit=1');
  if (e1) missing.push('supplier_users.registration_source + application_type columns');

  // Check supplier_organisations.registration_source
  const { error: e2 } = await dbQuery<any[]>('supplier_organisations?select=registration_source&limit=1');
  if (e2) missing.push('supplier_organisations.registration_source column');

  // Check supplier_registration_intents table
  const { error: e3 } = await dbQuery<any[]>('supplier_registration_intents?select=auth_user_id&limit=1');
  if (e3) missing.push('supplier_registration_intents table');

  return missing;
}

async function main() {
  console.log('\n=== Schema Migration Status Check ===\n');
  const missing = await checkAndReportMissing();

  if (missing.length === 0) {
    console.log('✅ All schema migrations already applied.\n');
    process.exit(0);
  }

  console.log('The following schema changes need to be applied via Supabase SQL Editor:');
  console.log('(Dashboard → SQL Editor → New Query → Paste → Run)\n');
  console.log('URL: https://supabase.com/dashboard/project/tyrknahwlodspvzfkdzk/sql/new\n');

  if (missing.some(m => m.includes('supplier_users'))) {
    console.log(`-- 1. Registration Intent Columns
ALTER TABLE public.supplier_users
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING',
  ADD COLUMN IF NOT EXISTS application_type    TEXT DEFAULT 'CONTRACTOR';

ALTER TABLE public.supplier_organisations
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING';

UPDATE public.supplier_users SET registration_source = 'CONTRACTOR_ONBOARDING', application_type = 'CONTRACTOR' WHERE registration_source IS NULL;
UPDATE public.supplier_organisations SET registration_source = 'CONTRACTOR_ONBOARDING' WHERE registration_source IS NULL;
`);
  }

  if (missing.some(m => m.includes('supplier_registration_intents'))) {
    console.log(`-- 2. Registration Intents (Orphan Detection) Table
CREATE TABLE IF NOT EXISTS public.supplier_registration_intents (
  auth_user_id        TEXT        PRIMARY KEY,
  email               TEXT        NOT NULL,
  first_name          TEXT        NOT NULL DEFAULT '',
  last_name           TEXT        NOT NULL DEFAULT '',
  status              TEXT        NOT NULL DEFAULT 'PENDING_ORG_SETUP',
  application_type    TEXT        NOT NULL DEFAULT 'CONTRACTOR',
  registration_source TEXT        NOT NULL DEFAULT 'CONTRACTOR_ONBOARDING',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_created_at      TIMESTAMPTZ,
  draft_created_at    TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  failure_reason      TEXT,
  classified_by       TEXT,
  classified_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_registration_intents_status ON public.supplier_registration_intents (status);
CREATE INDEX IF NOT EXISTS idx_registration_intents_email ON public.supplier_registration_intents (lower(email));
ALTER TABLE public.supplier_registration_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_registration_intents ON public.supplier_registration_intents FOR ALL TO service_role USING (true) WITH CHECK (true);
`);
  }

  console.log('After applying: re-run this script to confirm all migrations are active.\n');
  process.exit(1);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
