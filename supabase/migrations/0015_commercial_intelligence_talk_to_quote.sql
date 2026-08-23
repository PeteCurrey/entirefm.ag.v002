-- ============================================================================
-- Migration 0015: Commercial Intelligence + Talk-to-Quote (Phase 0G)
-- ============================================================================

-- 1. EXTEND EXISTING COMMERCIAL TABLES

-- Extend Quotes
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS internal_status text NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCOPED, PRICED, INTERNAL_REVIEW, READY_TO_ISSUE, ISSUED, ACCEPTED, REJECTED, EXPIRED, SUPERSEDED
  ADD COLUMN IF NOT EXISTS scope_description text,
  ADD COLUMN IF NOT EXISTS scope_exclusions_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS scope_assumptions_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 30,
  ADD COLUMN IF NOT EXISTS expected_cost_gbp numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS expected_margin_gbp numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS expected_margin_pct numeric(5,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS client_po_required boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_po_ref text,
  ADD COLUMN IF NOT EXISTS issued_at timestamptz,
  ADD COLUMN IF NOT EXISTS client_decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason_code text,
  ADD COLUMN IF NOT EXISTS rejection_reason_detail text,
  ADD COLUMN IF NOT EXISTS rate_card_id uuid REFERENCES public.rate_cards(id),
  ADD COLUMN IF NOT EXISTS rate_card_version_at integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS field_quote_scope_id uuid,
  ADD COLUMN IF NOT EXISTS supersedes_quote_id uuid REFERENCES public.quotes(id);

-- Extend Rate Cards
ALTER TABLE public.rate_cards
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id),
  ADD COLUMN IF NOT EXISTS superseded_by_id uuid REFERENCES public.rate_cards(id),
  ADD COLUMN IF NOT EXISTS notes text;

-- Extend Rate Card Items
ALTER TABLE public.rate_card_items
  ADD COLUMN IF NOT EXISTS rate_period text NOT NULL DEFAULT 'NORMAL', -- NORMAL, OVERTIME, EVENING, NIGHT, WEEKEND, BANK_HOLIDAY, EMERGENCY
  ADD COLUMN IF NOT EXISTS callout_includes_first_hour boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_hour_threshold_mins integer DEFAULT 60;

-- Extend Purchase Orders
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS approval_id uuid REFERENCES public.approvals(id),
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id),
  ADD COLUMN IF NOT EXISTS commitment_type text NOT NULL DEFAULT 'STANDARD'; -- STANDARD, EMERGENCY, VARIATION, SUBCONTRACT

-- 2. NEW COMMERCIAL TABLES

-- Commercial Policies (hierarchical: platform -> client -> contract -> service type)
CREATE TABLE IF NOT EXISTS public.commercial_policies (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_level                 text NOT NULL DEFAULT 'PLATFORM', -- PLATFORM, CLIENT, CONTRACT, SERVICE_TYPE
  client_account_id           uuid REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  contract_id                 uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  service_type                text, -- REACTIVE, PPM, PROJECT, QUOTED
  name                        text NOT NULL,
  min_margin_pct              numeric(5,2) NOT NULL DEFAULT 20.00,
  target_margin_pct           numeric(5,2) NOT NULL DEFAULT 35.00,
  max_auto_quote_gbp          numeric(10,2) NOT NULL DEFAULT 500.00,
  quote_approval_threshold_gbp numeric(10,2) NOT NULL DEFAULT 2500.00,
  po_approval_threshold_gbp   numeric(10,2) NOT NULL DEFAULT 1000.00,
  emergency_spend_limit_gbp   numeric(10,2) NOT NULL DEFAULT 1000.00,
  material_markup_type        text NOT NULL DEFAULT 'FIXED_PERCENT', -- FIXED_PERCENT, TIERED, COST_PLUS, ZERO
  material_markup_pct         numeric(5,2) NOT NULL DEFAULT 20.00,
  subcontract_markup_pct      numeric(5,2) NOT NULL DEFAULT 15.00,
  stale_price_threshold_days  integer NOT NULL DEFAULT 30,
  client_po_required_above_gbp numeric(10,2) NOT NULL DEFAULT 500.00,
  is_active                   boolean NOT NULL DEFAULT true,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Supplier Price Catalogue (parts/materials with freshness and verified sources)
CREATE TABLE IF NOT EXISTS public.supplier_price_catalogue (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_org_id             uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  item_code                   text NOT NULL,
  description                 text NOT NULL,
  category                    text NOT NULL DEFAULT 'GENERAL', -- HVAC, ELECTRICAL, PLUMBING, FABRIC, FIRE, GENERAL
  unit                        text NOT NULL DEFAULT 'UNIT', -- UNIT, METRE, LITRE, KG, BOX, PACK
  unit_cost_gbp               numeric(10,2) NOT NULL,
  currency                    text NOT NULL DEFAULT 'GBP',
  quoted_at                   timestamptz NOT NULL DEFAULT now(),
  valid_to                    date,
  is_stale                    boolean NOT NULL DEFAULT false,
  stale_reason                text,
  source_document_ref         text,
  ai_extracted                boolean NOT NULL DEFAULT false,
  ai_confidence_score         numeric(3,2),
  verified_by_person_id       uuid REFERENCES public.persons(id),
  verified_at                 timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(supplier_org_id, item_code)
);

-- Quote Versions (immutable snapshot trail)
CREATE TABLE IF NOT EXISTS public.quote_versions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  version                     integer NOT NULL,
  snapshot_json               jsonb NOT NULL,
  change_reason               text NOT NULL,
  created_by_person_id        uuid REFERENCES public.persons(id),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(quote_id, version)
);

-- Variation Orders (changes to already-approved work without mutating original quote)
CREATE TABLE IF NOT EXISTS public.variation_orders (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  work_order_id               uuid REFERENCES public.work_orders(id) ON DELETE CASCADE,
  variation_number            text NOT NULL UNIQUE,
  scope_description           text NOT NULL,
  expected_cost_gbp           numeric(10,2) NOT NULL DEFAULT 0.00,
  sell_price_gbp              numeric(10,2) NOT NULL DEFAULT 0.00,
  margin_gbp                  numeric(10,2) NOT NULL DEFAULT 0.00,
  margin_pct                  numeric(5,2) NOT NULL DEFAULT 0.00,
  status                      text NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_APPROVAL, APPROVED, REJECTED
  approval_id                 uuid REFERENCES public.approvals(id),
  requested_by_id             uuid REFERENCES public.persons(id),
  client_approved_at          timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Purchase Order Line Items
CREATE TABLE IF NOT EXISTS public.po_lines (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id           uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  description                 text NOT NULL,
  quantity                    numeric(8,2) NOT NULL DEFAULT 1.00,
  unit                        text NOT NULL DEFAULT 'UNIT',
  unit_cost_gbp               numeric(10,2) NOT NULL,
  total_gbp                   numeric(10,2) NOT NULL,
  cost_commitment_id          uuid REFERENCES public.cost_commitments(id),
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- Commercial Exceptions Ledger
CREATE TABLE IF NOT EXISTS public.commercial_exceptions (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type                 text NOT NULL, -- QUOTE, WORK_ORDER, PO, INVOICE, RATE_CARD
  object_id                   uuid NOT NULL,
  exception_code              text NOT NULL, -- MISSING_LABOUR_RATE, STALE_MATERIAL_PRICE, MISSING_MATERIAL_PRICE, MARGIN_BELOW_POLICY, HIGH_VALUE_QUOTE, HIGH_VALUE_PO, MISSING_CLIENT_PO, COST_VARIANCE_EXCEEDED
  severity                    text NOT NULL DEFAULT 'WARNING', -- INFO, WARNING, BLOCKING
  detail                      text NOT NULL,
  is_resolved                 boolean NOT NULL DEFAULT false,
  resolved_at                 timestamptz,
  resolved_by_person_id       uuid REFERENCES public.persons(id),
  resolution_notes            text,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

-- Controlled RFQ Requests
CREATE TABLE IF NOT EXISTS public.supplier_rfq_requests (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id                    uuid REFERENCES public.quotes(id),
  supplier_org_id             uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  part_description            text NOT NULL,
  quantity                    numeric(8,2) NOT NULL DEFAULT 1.00,
  unit                        text NOT NULL DEFAULT 'UNIT',
  required_by                 date,
  status                      text NOT NULL DEFAULT 'SENT', -- DRAFT, SENT, RESPONDED, EXPIRED, DECLINED
  response_unit_cost_gbp      numeric(10,2),
  response_valid_until        date,
  responded_at                timestamptz,
  notes                       text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance & lookups
CREATE INDEX IF NOT EXISTS idx_quotes_wo ON public.quotes(work_order_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON public.quotes(client_account_id);
CREATE INDEX IF NOT EXISTS idx_quotes_internal_status ON public.quotes(internal_status);
CREATE INDEX IF NOT EXISTS idx_quote_versions_quote ON public.quote_versions(quote_id);
CREATE INDEX IF NOT EXISTS idx_supplier_price_supplier ON public.supplier_price_catalogue(supplier_org_id, item_code);
CREATE INDEX IF NOT EXISTS idx_po_lines_po ON public.po_lines(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_commercial_exceptions_obj ON public.commercial_exceptions(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_variation_orders_quote ON public.variation_orders(quote_id);

-- Enable RLS
ALTER TABLE public.commercial_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_price_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variation_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_rfq_requests ENABLE ROW LEVEL SECURITY;

-- 3. SEED AI AGENTS FOR PHASE 0G

INSERT INTO public.ai_agents (code, name, role_description, autonomy_level, max_daily_budget_gbp, confidence_threshold, is_active)
VALUES 
  (
    'TALK_TO_QUOTE_AGENT',
    'Talk-to-Quote Agent',
    'Assists in structuring field scopes, retrieving approved rate cards and supplier catalogue prices, calculating deterministic draft quotes, and presenting commercial recommendations. Cannot invent prices, create unverified line items, or issue quotes to clients autonomously.',
    'ASSIST',
    10.00,
    0.80,
    true
  ),
  (
    'COMMERCIAL_INTELLIGENCE_AGENT',
    'Commercial Intelligence Agent',
    'Analyzes margin health, detects cost variances, monitors WIP staging and unbilled completed work, and flags commercial exceptions against policy. Operates in assist-only advisory capacity.',
    'ASSIST',
    10.00,
    0.80,
    true
  )
ON CONFLICT (code) DO NOTHING;

-- 4. SEED DEFAULT PLATFORM COMMERCIAL POLICY

INSERT INTO public.commercial_policies (
  scope_level,
  name,
  min_margin_pct,
  target_margin_pct,
  max_auto_quote_gbp,
  quote_approval_threshold_gbp,
  po_approval_threshold_gbp,
  emergency_spend_limit_gbp,
  material_markup_type,
  material_markup_pct,
  subcontract_markup_pct,
  stale_price_threshold_days,
  client_po_required_above_gbp,
  is_active
)
VALUES (
  'PLATFORM',
  'EntireFM Default Platform Commercial Policy',
  20.00,
  35.00,
  500.00,
  2500.00,
  1000.00,
  1000.00,
  'FIXED_PERCENT',
  20.00,
  15.00,
  30,
  500.00,
  true
)
ON CONFLICT DO NOTHING;
