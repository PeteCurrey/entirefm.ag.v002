-- ============================================================================
-- ENTIREFM MIGRATION 0042: ALLOCATION ENGINE & STRIPE IDEMPOTENCY TABLES
-- ============================================================================
-- Replaces ephemeral in-memory storage for allocation store and stripe webhooks.
-- Dual-Identity Support for Supplier References:
--   - supplier_org_id (text -> public.supplier_organisations(id))
--   - organisation_id (uuid -> public.organisations(id))
--   - Enforced by CHECK constraint per row.
-- ============================================================================

-- 1. STRIPE WEBHOOK IDEMPOTENCY TABLE
CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  event_id                    text PRIMARY KEY,
  event_type                  text,
  processed_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processed_stripe_events_processed_at ON public.processed_stripe_events(processed_at);

-- 2. WORK ALLOCATION REQUIREMENTS
CREATE TABLE IF NOT EXISTS public.work_allocation_requirements (
  id                          text PRIMARY KEY,
  source_type                 text NOT NULL,
  source_id                   text NOT NULL,
  client_id                   text NOT NULL,
  client_name                 text NOT NULL,
  site_id                     text NOT NULL,
  site_name                   text NOT NULL,
  site_city                   text NOT NULL,
  site_postcode               text NOT NULL,
  service_slug                text NOT NULL,
  service_name                text NOT NULL,
  sub_service                 text,
  asset_name                  text,
  oem_manufacturer            text,
  priority                    text NOT NULL DEFAULT 'P3_STANDARD',
  sla_attendance_target_hours numeric(5, 2) NOT NULL DEFAULT 4.0,
  scope_summary               text NOT NULL,
  detailed_scope              text,
  work_risk_level             text NOT NULL DEFAULT 'MEDIUM',
  estimated_value_gbp         numeric(12, 2),
  not_to_exceed_gbp           numeric(12, 2),
  out_of_hours_required       boolean NOT NULL DEFAULT false,
  mandatory_accreditations    text[] DEFAULT '{}',
  client_mandated_supplier_id text,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_alloc_req_source ON public.work_allocation_requirements(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_work_alloc_req_service ON public.work_allocation_requirements(service_slug);
CREATE INDEX IF NOT EXISTS idx_work_alloc_req_city ON public.work_allocation_requirements(site_city);

-- 3. SUPPLIER OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.supplier_opportunities (
  id                          text PRIMARY KEY,
  requirement_id              text NOT NULL REFERENCES public.work_allocation_requirements(id) ON DELETE CASCADE,
  opportunity_type            text NOT NULL DEFAULT 'DIRECT_OFFER',
  status                      text NOT NULL DEFAULT 'ISSUED',
  invited_supplier_ids        text[] NOT NULL DEFAULT '{}',
  response_deadline           timestamptz NOT NULL,
  title                       text NOT NULL,
  scope_summary               text NOT NULL,
  service_slug                text NOT NULL,
  site_city                   text NOT NULL,
  priority                    text NOT NULL,
  commercial_basis            text NOT NULL DEFAULT 'CONTRACT_RATE',
  not_to_exceed_gbp           numeric(12, 2),
  issued_at                   timestamptz NOT NULL DEFAULT now(),
  issued_by                   text NOT NULL,
  awarded_supplier_id         text,
  awarded_at                  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_opportunities_requirement_id ON public.supplier_opportunities(requirement_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.supplier_opportunities(status);

-- 4. SUPPLIER OPPORTUNITY RESPONSES
CREATE TABLE IF NOT EXISTS public.supplier_opportunity_responses (
  id                          text PRIMARY KEY,
  opportunity_id              text NOT NULL REFERENCES public.supplier_opportunities(id) ON DELETE CASCADE,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  decision                    text NOT NULL,
  decline_reason              text,
  quoted_price_gbp            numeric(12, 2),
  quoted_lead_time_hours      numeric(5, 2),
  planned_attendance_date     timestamptz,
  clarification_question      text,
  clarification_response      text,
  notes                       text,
  responded_at                timestamptz NOT NULL DEFAULT now(),
  responded_by                text NOT NULL,
  CONSTRAINT chk_opp_responses_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_opp_responses_opportunity_id ON public.supplier_opportunity_responses(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_responses_supplier_org_id ON public.supplier_opportunity_responses(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_opp_responses_organisation_id ON public.supplier_opportunity_responses(organisation_id);

-- 5. FORMAL AWARD DECISION RECORDS
CREATE TABLE IF NOT EXISTS public.supplier_award_decisions (
  id                          text PRIMARY KEY,
  opportunity_id              text NOT NULL REFERENCES public.supplier_opportunities(id) ON DELETE CASCADE,
  requirement_id              text NOT NULL REFERENCES public.work_allocation_requirements(id) ON DELETE CASCADE,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  selected_supplier_name      text NOT NULL,
  candidate_ids_evaluated     text[] DEFAULT '{}',
  award_reason                text NOT NULL,
  commercial_basis            text NOT NULL DEFAULT 'CONTRACT_RATE',
  agreed_value_gbp            numeric(12, 2),
  not_to_exceed_gbp           numeric(12, 2),
  is_override                 boolean NOT NULL DEFAULT false,
  override_rationale          text,
  awarded_by                  text NOT NULL,
  awarded_at                  timestamptz NOT NULL DEFAULT now(),
  pre_dispatch_revalidation_passed boolean NOT NULL DEFAULT true,
  CONSTRAINT chk_award_decisions_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_award_decisions_opportunity_id ON public.supplier_award_decisions(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_award_decisions_supplier_org_id ON public.supplier_award_decisions(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_award_decisions_organisation_id ON public.supplier_award_decisions(organisation_id);

-- 6. WORK ORDER DISPATCH RECORDS
CREATE TABLE IF NOT EXISTS public.work_order_dispatches (
  id                          text PRIMARY KEY,
  work_order_id               text NOT NULL,
  opportunity_id              text NOT NULL,
  award_id                    text NOT NULL,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  supplier_name               text NOT NULL,
  service_name                text NOT NULL,
  site_name                   text NOT NULL,
  site_city                   text NOT NULL,
  priority                    text NOT NULL,
  sla_target_time             timestamptz NOT NULL,
  status                      text NOT NULL DEFAULT 'AWAITING_ACKNOWLEDGEMENT',
  assigned_operative_name     text,
  assigned_operative_phone    text,
  scheduled_attendance_start  timestamptz,
  acknowledged_at             timestamptz,
  acknowledged_by             text,
  rams_submitted              boolean NOT NULL DEFAULT false,
  dispatched_at               timestamptz NOT NULL DEFAULT now(),
  dispatched_by               text NOT NULL,
  CONSTRAINT chk_wo_dispatches_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_wo_dispatches_work_order_id ON public.work_order_dispatches(work_order_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_supplier_org_id ON public.work_order_dispatches(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_organisation_id ON public.work_order_dispatches(organisation_id);
CREATE INDEX IF NOT EXISTS idx_wo_dispatches_status ON public.work_order_dispatches(status);

-- 7. SUPPLIER AVAILABILITY
CREATE TABLE IF NOT EXISTS public.supplier_availability (
  id                          text PRIMARY KEY,
  supplier_org_id             text REFERENCES public.supplier_organisations(id) ON DELETE CASCADE,
  organisation_id             uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  status                      text NOT NULL DEFAULT 'AVAILABLE',
  daily_reactive_slots        int NOT NULL DEFAULT 5,
  available_engineers_count   int NOT NULL DEFAULT 1,
  emergency_out_of_hours      boolean NOT NULL DEFAULT false,
  unavailable_from            timestamptz,
  unavailable_until           timestamptz,
  reason                      text,
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_supplier_avail_owner CHECK (
    (supplier_org_id IS NOT NULL)::int + (organisation_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX IF NOT EXISTS idx_supplier_avail_supplier_org_id ON public.supplier_availability(supplier_org_id);
CREATE INDEX IF NOT EXISTS idx_supplier_avail_organisation_id ON public.supplier_availability(organisation_id);
