/**
 * ENTIREFM CANONICAL SERVER-SIDE GEOCODING & HAVERSINE ENGINE
 * ==========================================================
 * Strict, server-only geocoding utility using Google Maps Geocoding API.
 * Never exposed to client-side bundles.
 *
 * Capabilities:
 *   1. Normalised UK postcode resolution
 *   2. Persistent Supabase caching via `geocode_cache` to minimise external API calls
 *   3. Great-circle Haversine spherical distance calculation (in miles)
 *   4. Fail-closed safety: if an address/postcode cannot be geocoded, returns null
 *      instead of fabricating distances or coordinates.
 */

import { dbQuery, isDbConfigured } from '../db/client';

export interface LatLngCoords {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

/**
 * Normalises a UK postcode for deterministic cache lookup.
 * e.g. "  sw1a  1aa " -> "SW1A1AA"
 */
export function normaliseUkPostcode(postcode: string): string {
  if (!postcode) return '';
  return postcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Formats a normalised UK postcode into standard display format with a single space.
 * e.g. "SW1A1AA" -> "SW1A 1AA", "M14BT" -> "M1 4BT"
 */
export function formatDisplayPostcode(postcode: string): string {
  const norm = normaliseUkPostcode(postcode);
  if (!norm || norm.length < 5) return postcode.trim().toUpperCase();
  const inward = norm.slice(-3);
  const outward = norm.slice(0, -3);
  return `${outward} ${inward}`;
}

/**
 * Calculates great-circle distance between two decimal degree points using Haversine formula.
 * Returns distance in statute miles rounded to 1 decimal place.
 */
export function haversineDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    throw new Error('haversineDistanceMiles requires valid non-null coordinates');
  }

  const EARTH_RADIUS_MILES = 3958.8; // Mean spherical radius of Earth in statute miles

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_MILES * c * 10) / 10;
}

/**
 * Looks up a postcode from the persistent Supabase `geocode_cache` table.
 */
async function getCachedGeocode(postcodeNorm: string): Promise<LatLngCoords | null> {
  if (!isDbConfigured() || !postcodeNorm) return null;

  try {
    const { data, error } = await dbQuery<any[]>(
      `geocode_cache?postcode_normalized=eq.${encodeURIComponent(postcodeNorm)}&limit=1`
    );

    if (error || !data || data.length === 0) {
      return null;
    }

    const row = data[0];
    const lat = Number(row.latitude);
    const lon = Number(row.longitude);

    if (isNaN(lat) || isNaN(lon)) return null;

    return {
      latitude: lat,
      longitude: lon,
      formatted_address: row.formatted_address || undefined,
    };
  } catch (err: any) {
    // Non-blocking cache lookup warning
    return null;
  }
}

/**
 * Persists a resolved geocode coordinate into Supabase `geocode_cache`.
 */
async function saveCachedGeocode(params: {
  postcodeNorm: string;
  postcodeDisplay: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
  formattedAddress?: string;
}): Promise<void> {
  if (!isDbConfigured() || !params.postcodeNorm) return;

  try {
    await dbQuery('geocode_cache', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates',
      },
      body: {
        postcode_normalized: params.postcodeNorm,
        postcode_display: params.postcodeDisplay,
        latitude: params.latitude,
        longitude: params.longitude,
        country_code: params.countryCode || 'GB',
        formatted_address: params.formattedAddress || null,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    // Non-blocking cache write warning
  }
}

/**
 * Geocodes a postcode using Google Maps Geocoding API with caching and error handling.
 *
 * @param postcode UK postal code (e.g. "S9 2TT", "M1 4BT", "SW1A 1AA")
 * @param country ISO 3166-1 country code component filter (default 'GB')
 * @returns LatLngCoords or null on geocoding failure / missing key
 */
export async function geocodePostcode(
  postcode: string,
  country = 'GB'
): Promise<LatLngCoords | null> {
  if (!postcode || typeof postcode !== 'string') return null;

  const postcodeNorm = normaliseUkPostcode(postcode);
  if (!postcodeNorm || postcodeNorm.length < 3) return null;

  // 1. Check persistent DB cache first
  const cached = await getCachedGeocode(postcodeNorm);
  if (cached) {
    return cached;
  }

  // 2. Validate Google Maps API Key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn(
      `[GEOCODING_WARNING] GOOGLE_MAPS_API_KEY is not set. Cannot geocode postcode: '${postcode}'`
    );
    return null;
  }

  // 3. Call Google Geocoding API server-side
  const queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    postcode
  )}&components=country:${encodeURIComponent(country)}&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(
        `[GEOCODING_WARNING] Google Geocoding HTTP ${res.status} for postcode: '${postcode}'`
      );
      return null;
    }

    const data = (await res.json()) as any;

    if (data.status !== 'OK' || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn(
        `[GEOCODING_WARNING] Geocoding API status '${data.status}' for postcode '${postcode}': ${
          data.error_message || 'No results returned'
        }`
      );
      return null;
    }

    const firstResult = data.results[0];
    const location = firstResult.geometry?.location;
    const lat = location?.lat;
    const lng = location?.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      console.warn(`[GEOCODING_WARNING] Invalid coordinates received for postcode '${postcode}'`);
      return null;
    }

    const coords: LatLngCoords = {
      latitude: lat,
      longitude: lng,
      formatted_address: firstResult.formatted_address || undefined,
    };

    // 4. Save to cache asynchronously (fire-and-forget)
    saveCachedGeocode({
      postcodeNorm,
      postcodeDisplay: formatDisplayPostcode(postcode),
      latitude: lat,
      longitude: lng,
      countryCode: country,
      formattedAddress: firstResult.formatted_address,
    }).catch(() => {});

    return coords;
  } catch (err: any) {
    console.warn(`[GEOCODING_EXCEPTION] Failed to geocode postcode '${postcode}':`, err?.message);
    return null;
  }
}

/**
 * Resolves coordinates for a location object.
 * If coordinates are already present, returns them directly;
 * otherwise attempts to geocode using the postcode.
 */
export async function resolveLocationCoordinates(location: {
  latitude?: number | null;
  longitude?: number | null;
  postcode?: string | null;
  country?: string;
}): Promise<LatLngCoords | null> {
  const lat = location.latitude != null ? Number(location.latitude) : null;
  const lon = location.longitude != null ? Number(location.longitude) : null;

  if (lat != null && lon != null && !isNaN(lat) && !isNaN(lon)) {
    return { latitude: lat, longitude: lon };
  }

  if (location.postcode) {
    return geocodePostcode(location.postcode, location.country || 'GB');
  }

  return null;
}
