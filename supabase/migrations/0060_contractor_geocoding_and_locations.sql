-- ============================================================================
-- ENTIREFM UNIFIED OPERATIONS PLATFORM
-- MIGRATION 0060 — CONTRACTOR GEOCODING CACHE & DEPOT LOCATION BACKFILL
-- ============================================================================
-- 1. Server-side Geocode Cache (Postcode to Coordinates)
-- 2. Row Level Security & Service Role Policy
-- 3. Initial Depot Locations Seed for Active Provider Organisations
-- ============================================================================

-- 1. GEOCODE CACHE TABLE
CREATE TABLE IF NOT EXISTS public.geocode_cache (
  postcode_normalized TEXT PRIMARY KEY,
  postcode_display    TEXT NOT NULL,
  latitude            NUMERIC(10,7) NOT NULL,
  longitude           NUMERIC(10,7) NOT NULL,
  country_code        TEXT NOT NULL DEFAULT 'GB',
  formatted_address   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for lookup efficiency
CREATE INDEX IF NOT EXISTS idx_geocode_cache_coords
  ON public.geocode_cache (latitude, longitude);

-- 2. ROW LEVEL SECURITY
ALTER TABLE public.geocode_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access to geocode_cache" ON public.geocode_cache;
CREATE POLICY "Service role has full access to geocode_cache"
  ON public.geocode_cache FOR ALL
  USING (true);

-- 3. INITIAL PROVIDER LOCATIONS SEED
-- For any contractor/provider organization that has no linked provider_locations row,
-- create an initial HQ depot using their registered address_json so geolocation matching
-- can immediately resolve depot coordinates.
INSERT INTO public.provider_locations (
  provider_org_id,
  name,
  address_line1,
  city,
  postcode,
  is_hq,
  is_dispatch_point,
  emergency_available,
  created_at
)
SELECT
  o.id,
  COALESCE(o.name || ' - Operating HQ', 'Headquarters'),
  COALESCE(
    NULLIF(o.address_json->>'line1', ''),
    NULLIF(o.address_json->>'address_line1', ''),
    'Head Office'
  ),
  COALESCE(
    NULLIF(o.address_json->>'city', ''),
    'Sheffield'
  ),
  COALESCE(
    NULLIF(o.address_json->>'postcode', ''),
    'S9 2TT'
  ),
  true,
  true,
  true,
  now()
FROM public.provider_organisations po
JOIN public.organisations o ON po.organisation_id = o.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.provider_locations pl WHERE pl.provider_org_id = o.id
);

-- Index for multi-depot distance queries
CREATE INDEX IF NOT EXISTS idx_provider_locations_provider_active
  ON public.provider_locations (provider_org_id, is_dispatch_point, is_hq);
