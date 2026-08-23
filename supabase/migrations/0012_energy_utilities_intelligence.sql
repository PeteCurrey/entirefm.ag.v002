-- ============================================================================
-- ENTIREFM PHASE 9: ENERGY, UTILITIES & BUILDING PERFORMANCE INTELLIGENCE
-- Migration: 0012_energy_utilities_intelligence.sql
-- ============================================================================

-- 1. Meters Registry (Electricity, Gas, Water, Heat, Chilled Water)
create table if not exists public.meters (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  building_id uuid references public.buildings(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  parent_meter_id uuid references public.meters(id) on delete set null,
  
  meter_reference text not null,
  name text not null,
  utility_type text not null, -- 'ELECTRICITY', 'GAS', 'WATER', 'HEAT', 'CHILLED_WATER', 'EXPORT'
  meter_hierarchy text not null default 'MAIN_METER', -- 'MAIN_METER', 'SUB_METER', 'ASSET_METER', 'TENANT_METER', 'LANDLORD_METER'
  unit_of_measure text not null default 'KWH', -- 'KWH', 'M3', 'LITRES', 'MJ'
  
  multiplier numeric default 1.0,
  interval_minutes integer default 30,
  is_automated boolean default false,
  feed_status text not null default 'ACTIVE', -- 'ACTIVE', 'STALE', 'OFFLINE', 'COMMISSIONING'
  last_reading_at timestamptz default null,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meters_site_idx on public.meters (site_id);
create index if not exists meters_util_idx on public.meters (utility_type);

-- 2. Meter Readings (Interval Time-Series)
create table if not exists public.meter_readings (
  id uuid primary key default gen_random_uuid(),
  meter_id uuid references public.meters(id) on delete cascade,
  reading_timestamp timestamptz not null,
  value numeric not null,
  unit text not null default 'KWH',
  data_quality text not null default 'ACTUAL', -- 'ACTUAL', 'ESTIMATED', 'INTERPOLATED', 'FAULTY', 'FLATLINE'
  source text not null default 'API_CONNECTOR', -- 'MANUAL', 'CSV_IMPORT', 'API_CONNECTOR', 'BMS', 'SMART_METER'
  created_at timestamptz not null default now()
);

create index if not exists meter_reads_ts_idx on public.meter_readings (meter_id, reading_timestamp desc);

-- 3. Utility Tariffs
create table if not exists public.utility_tariffs (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  utility_type text not null,
  tariff_name text not null,
  standing_charge_daily_gbp numeric default 0,
  unit_rate_gbp_per_kwh numeric not null,
  effective_from date not null,
  effective_to date default null,
  created_at timestamptz not null default now()
);

-- 4. Energy Projects & M&V Tracking
create table if not exists public.energy_projects (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  
  project_name text not null,
  category text not null default 'HVAC_CONTROLS', -- 'HVAC_CONTROLS', 'LED_LIGHTING', 'PLANT_REPLACEMENT', 'BMS_OPTIMISATION', 'BUILDING_FABRIC'
  scope_description text default '',
  
  baseline_period_start date not null,
  baseline_period_end date not null,
  baseline_annual_kwh numeric not null,
  
  target_annual_saving_kwh numeric default null,
  target_annual_saving_gbp numeric default null,
  
  implementation_date date not null,
  verification_status text not null default 'MEASUREMENT_PERIOD', -- 'BASELINE_DEFINED', 'IMPLEMENTED', 'MEASUREMENT_PERIOD', 'VERIFIED', 'INCONCLUSIVE'
  verified_saving_kwh numeric default null,
  verified_saving_gbp numeric default null,
  
  owner text not null default 'Energy & Sustainability Lead',
  created_at timestamptz not null default now()
);

-- 5. Official Carbon Conversion Factors
create table if not exists public.carbon_factors (
  id uuid primary key default gen_random_uuid(),
  fuel_type text not null, -- 'ELECTRICITY_GRID', 'NATURAL_GAS', 'WATER_SUPPLY', 'WATER_TREATMENT'
  region text not null default 'UK',
  reporting_year integer not null default 2026,
  kg_co2e_per_unit numeric not null,
  unit text not null default 'KWH',
  source text not null default 'UK DESNZ GHG Conversion Factors',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.meters enable row level security;
alter table public.meter_readings enable row level security;
alter table public.utility_tariffs enable row level security;
alter table public.energy_projects enable row level security;
alter table public.carbon_factors enable row level security;
