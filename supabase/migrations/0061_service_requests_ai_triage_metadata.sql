-- ============================================================
-- Migration 0061: Service Requests AI Triage Metadata Columns
-- ============================================================
-- Adds columns consumed by:
--   • parseHelpdeskIntake() in src/server/ai/helpdesk/intake.ts
--   • GET /api/admin/helpdesk/exceptions in src/app/api/admin/helpdesk/exceptions/route.ts
--
-- Safe to re-run: all statements use IF NOT EXISTS guards.

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS triage_status         text    DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS ai_summary            text,
  ADD COLUMN IF NOT EXISTS ai_model_provider     text,
  ADD COLUMN IF NOT EXISTS ai_model_name         text,
  ADD COLUMN IF NOT EXISTS ai_confidence_score   numeric,
  ADD COLUMN IF NOT EXISTS ai_disagreement_notes text,
  ADD COLUMN IF NOT EXISTS ai_candidate_count    integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS triage_exception_reason text,
  ADD COLUMN IF NOT EXISTS ai_suggested_trade    text,
  ADD COLUMN IF NOT EXISTS ai_suggested_priority text,
  ADD COLUMN IF NOT EXISTS sla_due_at            timestamptz;

-- Index for exceptions query (filters on triage_status)
CREATE INDEX IF NOT EXISTS idx_service_requests_triage_status
  ON public.service_requests (triage_status);

-- Index for SLA due-date ordering
CREATE INDEX IF NOT EXISTS idx_service_requests_sla_due_at
  ON public.service_requests (sla_due_at)
  WHERE sla_due_at IS NOT NULL;

COMMENT ON COLUMN public.service_requests.triage_status IS
  'AI triage state: PENDING | AUTO_TRIAGED | REQUIRES_OPERATOR_TRIAGE | MODEL_DISAGREEMENT | UNRESOLVED_ESTATE | FAILED';
COMMENT ON COLUMN public.service_requests.ai_disagreement_notes IS
  'JSON-stringified string[] from dual-model verification divergence reasons';
COMMENT ON COLUMN public.service_requests.sla_due_at IS
  'Canonical SLA resolution deadline computed by parseHelpdeskIntake()';
