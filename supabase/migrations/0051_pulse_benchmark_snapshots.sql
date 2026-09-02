-- ============================================================
-- MIGRATION 0051: PULSE BENCHMARK SNAPSHOTS
-- ============================================================
-- Stores pre-computed quarterly benchmarking report snapshots.
-- The report page reads from here rather than computing live on
-- every page load. The cron job writes a new row each quarter.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.pulse_benchmark_snapshots (
  id                TEXT PRIMARY KEY,      -- e.g. '2026-Q3-1725302400000'
  year              INT NOT NULL,
  quarter           INT NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  run_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_responses   INT NOT NULL DEFAULT 0,
  snapshot_json     JSONB NOT NULL,        -- full AnnualBenchmarkingReport JSON
  run_by            TEXT NOT NULL DEFAULT 'cron'  -- 'cron' | 'admin' | 'manual'
);

-- Fast lookup for the report page: latest snapshot for a given year
CREATE INDEX IF NOT EXISTS idx_pulse_snapshots_year_run_at
  ON public.pulse_benchmark_snapshots(year, run_at DESC);

ALTER TABLE public.pulse_benchmark_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_pulse_snapshots" ON public.pulse_benchmark_snapshots;
CREATE POLICY "service_role_pulse_snapshots"
  ON public.pulse_benchmark_snapshots FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- SCHEMA MIGRATIONS RECORD
-- ============================================================
INSERT INTO public._schema_migrations (version, applied_at)
VALUES ('0051_pulse_benchmark_snapshots', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;
