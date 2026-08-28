/**
 * Apply DDL via Supabase Management API (accepts raw SQL).
 * https://api.supabase.com/v1/projects/{ref}/database/query
 */
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Extract project ref from URL e.g. https://tyrknahwlodspvzfkdzk.supabase.co
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

async function runSQL(sql: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const json = await res.json() as any;
  if (!res.ok) return { ok: false, error: json?.message || JSON.stringify(json) };
  return { ok: true };
}

async function main() {
  console.log(`Project: ${PROJECT_REF}\n`);

  const statements = [
    {
      label: 'Add supplier_users.registration_source',
      sql: `ALTER TABLE public.supplier_users ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING'`,
    },
    {
      label: 'Add supplier_users.application_type',
      sql: `ALTER TABLE public.supplier_users ADD COLUMN IF NOT EXISTS application_type TEXT DEFAULT 'CONTRACTOR'`,
    },
    {
      label: 'Add supplier_organisations.registration_source',
      sql: `ALTER TABLE public.supplier_organisations ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'CONTRACTOR_ONBOARDING'`,
    },
    {
      label: 'Create supplier_registration_intents table',
      sql: `CREATE TABLE IF NOT EXISTS public.supplier_registration_intents (
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
)`,
    },
    {
      label: 'Index: registration_intents_status',
      sql: `CREATE INDEX IF NOT EXISTS idx_registration_intents_status ON public.supplier_registration_intents (status)`,
    },
    {
      label: 'Index: registration_intents_email',
      sql: `CREATE INDEX IF NOT EXISTS idx_registration_intents_email ON public.supplier_registration_intents (lower(email))`,
    },
    {
      label: 'RLS: supplier_registration_intents',
      sql: `ALTER TABLE public.supplier_registration_intents ENABLE ROW LEVEL SECURITY`,
    },
    {
      label: 'RLS policy: service_role_registration_intents',
      sql: `DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='service_role_registration_intents' AND tablename='supplier_registration_intents') THEN
    CREATE POLICY service_role_registration_intents ON public.supplier_registration_intents FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$`,
    },
  ];

  for (const { label, sql } of statements) {
    const { ok, error } = await runSQL(sql);
    if (ok) {
      console.log(`  ✅ ${label}`);
    } else {
      console.error(`  ❌ ${label}: ${error}`);
    }
  }
  console.log('\nDone.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
