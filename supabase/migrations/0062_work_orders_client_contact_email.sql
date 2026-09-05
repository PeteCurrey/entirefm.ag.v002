-- ============================================================
-- Migration 0062: Add client_contact_email to work_orders
-- ============================================================
-- Enables work_orders to store client contact email for notifications
-- and allows safe query from issueQuoteToClient and chasing-sweep.ts.

ALTER TABLE public.work_orders
  ADD COLUMN IF NOT EXISTS client_contact_email text;

COMMENT ON COLUMN public.work_orders.client_contact_email IS
  'Contact email of client requester or site contact for work order updates and quote notifications.';
