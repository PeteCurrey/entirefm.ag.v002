-- Migration 0028: Asset Intelligence Performance Indexes
-- ========================================================
-- Addresses Phase 0K performance closeout.
-- Root cause: work_orders.asset_id and supplier_invoice_lines.work_order_id
-- had no indexes — every per-asset cost lookup was a full sequential scan.

-- Critical 1: work_orders.asset_id
create index if not exists idx_work_orders_asset_id
  on public.work_orders (asset_id)
  where asset_id is not null;

-- Critical 2: supplier_invoice_lines.work_order_id
-- Guard: column added by 0016 via ALTER TABLE; ensure it exists before indexing
alter table public.supplier_invoice_lines
  add column if not exists work_order_id uuid references public.work_orders(id);

create index if not exists idx_supplier_invoice_lines_work_order_id
  on public.supplier_invoice_lines (work_order_id)
  where work_order_id is not null;

-- Composite: asset cost type filtering (asset_id + work_type)
create index if not exists idx_work_orders_asset_work_type
  on public.work_orders (asset_id, work_type)
  where asset_id is not null;

-- Composite: asset failure events — asset + time window
create index if not exists idx_asset_failure_events_asset_failed_at
  on public.asset_failure_events (asset_id, failed_at desc)
  where asset_id is not null;

-- Composite: assets category + lifecycle_status for class performance grouping
create index if not exists idx_assets_category_lifecycle
  on public.assets (category, lifecycle_status);
