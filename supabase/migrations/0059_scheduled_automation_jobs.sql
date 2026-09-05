-- 0059_scheduled_automation_jobs.sql
-- Creates durable scheduled automation jobs table for CAFM outbox / chasing engine

CREATE TABLE IF NOT EXISTS public.scheduled_automation_jobs (
    id text PRIMARY KEY,
    job_type text NOT NULL,
    work_order_id text,
    due_at timestamptz NOT NULL,
    attempt integer NOT NULL DEFAULT 0,
    max_attempts integer NOT NULL DEFAULT 2,
    status text NOT NULL DEFAULT 'SCHEDULED',
    idempotency_key text UNIQUE NOT NULL,
    last_result text,
    next_action text,
    payload jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_scheduled_automation_jobs_status_due ON public.scheduled_automation_jobs(status, due_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_automation_jobs_wo ON public.scheduled_automation_jobs(work_order_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_automation_jobs_key ON public.scheduled_automation_jobs(idempotency_key);
