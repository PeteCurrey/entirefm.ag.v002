-- ============================================================================
-- ENTIREFM MIGRATION 0058: CAFM OPERATIONAL LIFECYCLE LINKAGES & INTEGRITY
-- ============================================================================
-- Purpose:
--   1. Connect quotes directly to sites (site_id on quotes table)
--   2. Support bidirectional, idempotent conversion between quotes and work orders
--      (converted_work_order_id on quotes, quote_id on work_orders)
--   3. Ensure lead_engineer_id exists on work_orders with proper foreign key
--   4. Add indexes for high-performance tenant-isolated queries and lifecycle joins
--   5. Ensure service_role RLS access across all lifecycle tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTEND quotes WITH site_id & converted_work_order_id
-- ----------------------------------------------------------------------------

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES public.sites(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS converted_work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_quotes_site_id ON public.quotes(site_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_account_id ON public.quotes(client_account_id);
CREATE INDEX IF NOT EXISTS idx_quotes_converted_work_order_id ON public.quotes(converted_work_order_id);

-- ----------------------------------------------------------------------------
-- 2. EXTEND work_orders WITH quote_id & lead_engineer_id
-- ----------------------------------------------------------------------------

ALTER TABLE public.work_orders
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lead_engineer_id uuid REFERENCES public.persons(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_work_orders_quote_id ON public.work_orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_lead_engineer_id ON public.work_orders(lead_engineer_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_site_id ON public.work_orders(site_id);

-- ----------------------------------------------------------------------------
-- 3. ENSURE SERVICE ROLE POLICIES ON LIFECYCLE TABLES
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
