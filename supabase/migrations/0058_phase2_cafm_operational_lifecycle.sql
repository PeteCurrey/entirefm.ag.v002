-- ============================================================================
-- ENTIREFM MIGRATION 0058: CAFM OPERATIONAL LIFECYCLE LINKAGES & INTEGRITY
-- ============================================================================
-- Purpose:
--   1. Connect sites directly to client_accounts (client_account_id on sites table)
--   2. Add missing estate site columns expected by application code (site_type, access_instructions)
--   3. Connect quotes directly to sites (site_id on quotes table)
--   4. Support bidirectional, idempotent conversion between quotes and work orders
--      (converted_work_order_id on quotes, quote_id on work_orders)
--   5. Ensure lead_engineer_id exists on work_orders with proper foreign key
--   6. Add commercial columns to quotes (contract_id, total_sell_gbp, total_cost_gbp, etc.)
--   7. Add indexes for high-performance tenant-isolated queries and lifecycle joins
--   8. Ensure service_role RLS access across all lifecycle tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTEND sites WITH client_account_id & OPERATIONAL ATTRIBUTES
-- ----------------------------------------------------------------------------

ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS client_account_id uuid REFERENCES public.client_accounts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS site_type text NOT NULL DEFAULT 'COMMERCIAL_OFFICE',
  ADD COLUMN IF NOT EXISTS access_instructions text,
  ADD COLUMN IF NOT EXISTS security_clearance_required boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_sites_client_account_id ON public.sites(client_account_id);

-- ----------------------------------------------------------------------------
-- 2. EXTEND quotes WITH site_id, converted_work_order_id, & commercial fields
-- ----------------------------------------------------------------------------

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS converted_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS total_cost_gbp numeric(10,2),
  ADD COLUMN IF NOT EXISTS total_sell_gbp numeric(10,2),
  ADD COLUMN IF NOT EXISTS margin_gbp numeric(10,2),
  ADD COLUMN IF NOT EXISTS margin_pct numeric(5,2),
  ADD COLUMN IF NOT EXISTS vat_amount_gbp numeric(10,2),
  ADD COLUMN IF NOT EXISTS total_inc_vat_gbp numeric(10,2),
  ADD COLUMN IF NOT EXISTS client_feedback_notes text;

CREATE INDEX IF NOT EXISTS idx_quotes_site_id ON public.quotes(site_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_account_id ON public.quotes(client_account_id);
CREATE INDEX IF NOT EXISTS idx_quotes_converted_work_order_id ON public.quotes(converted_work_order_id);

-- ----------------------------------------------------------------------------
-- 3. EXTEND work_orders WITH quote_id & lead_engineer_id
-- ----------------------------------------------------------------------------

ALTER TABLE public.work_orders
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lead_engineer_id uuid REFERENCES public.persons(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_work_orders_quote_id ON public.work_orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_lead_engineer_id ON public.work_orders(lead_engineer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_site_id ON public.work_orders(site_id);

-- ----------------------------------------------------------------------------
-- 4. ENSURE SERVICE ROLE POLICIES ON LIFECYCLE TABLES
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  -- quotes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'quotes_service_role_all'
  ) THEN
    CREATE POLICY quotes_service_role_all ON public.quotes
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- quote_lines
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'quote_lines' AND policyname = 'quote_lines_service_role_all'
  ) THEN
    CREATE POLICY quote_lines_service_role_all ON public.quote_lines
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- work_orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'work_orders' AND policyname = 'work_orders_service_role_all'
  ) THEN
    CREATE POLICY work_orders_service_role_all ON public.work_orders
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- visits
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visits' AND policyname = 'visits_service_role_all'
  ) THEN
    CREATE POLICY visits_service_role_all ON public.visits
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- work_assignments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'work_assignments' AND policyname = 'work_assignments_service_role_all'
  ) THEN
    CREATE POLICY work_assignments_service_role_all ON public.work_assignments
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- tasks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'tasks_service_role_all'
  ) THEN
    CREATE POLICY tasks_service_role_all ON public.tasks
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- client_invoices
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'client_invoices' AND policyname = 'client_invoices_service_role_all'
  ) THEN
    CREATE POLICY client_invoices_service_role_all ON public.client_invoices
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- client_invoice_lines
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'client_invoice_lines' AND policyname = 'client_invoice_lines_service_role_all'
  ) THEN
    CREATE POLICY client_invoice_lines_service_role_all ON public.client_invoice_lines
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
