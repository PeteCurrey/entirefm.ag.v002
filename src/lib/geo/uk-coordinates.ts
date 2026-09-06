/**
 * CANONICAL UK GEOLOCATION RESOLVER & OUTWARD CODE MAPPINGS
 * =========================================================
 * Provides accurate fallback coordinates for UK cities and postal districts,
 * ensuring facilities are accurately positioned on the operational Google Map
 * even when exact database lat/lng fields are pending geocoding.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ResolvedCoordinates extends LatLng {
  isExact: boolean;
  resolvedBy: 'db' | 'postcode' | 'city' | 'uk_fallback';
}

// Canonical coordinates for major UK cities / metropolitan areas
export const UK_CITY_COORDINATES: Record<string, LatLng> = {
  manchester: { lat: 53.4808, lng: -2.2426 },
  'greater manchester': { lat: 53.4808, lng: -2.2426 },
  salford: { lat: 53.4875, lng: -2.2901 },
  london: { lat: 51.5074, lng: -0.1278 },
  'greater london': { lat: 51.5074, lng: -0.1278 },
  birmingham: { lat: 52.4862, lng: -1.8904 },
  'west midlands': { lat: 52.4862, lng: -1.8904 },
  leeds: { lat: 53.8008, lng: -1.5491 },
  sheffield: { lat: 53.3811, lng: -1.4701 },
  liverpool: { lat: 53.4084, lng: -2.9916 },
  newcastle: { lat: 54.9783, lng: -1.6178 },
  'newcastle upon tyne': { lat: 54.9783, lng: -1.6178 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  nottingham: { lat: 52.9548, lng: -1.1581 },
  leicester: { lat: 52.6369, lng: -1.1398 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
  cardiff: { lat: 51.4816, lng: -3.1791 },
  belfast: { lat: 54.5973, lng: -5.9301 },
  southampton: { lat: 50.9097, lng: -1.4044 },
  reading: { lat: 51.4543, lng: -0.9781 },
  cambridge: { lat: 52.2053, lng: 0.1218 },
  oxford: { lat: 51.752, lng: -1.2577 },
  coventry: { lat: 52.4068, lng: -1.5197 },
  hull: { lat: 53.7457, lng: -0.3367 },
  kingston_upon_hull: { lat: 53.7457, lng: -0.3367 },
  stoke: { lat: 53.0027, lng: -2.1794 },
  'stoke-on-trent': { lat: 53.0027, lng: -2.1794 },
  derby: { lat: 52.9225, lng: -1.4746 },
  plymouth: { lat: 50.3755, lng: -4.1427 },
  wolverhampton: { lat: 52.587, lng: -2.1288 },
  norwich: { lat: 52.6309, lng: 1.2974 },
  milton_keynes: { lat: 52.0406, lng: -0.7594 },
  'milton keynes': { lat: 52.0406, lng: -0.7594 },
  aberdeen: { lat: 57.1497, lng: -2.0943 },
  swansea: { lat: 51.6214, lng: -3.9436 },
  york: { lat: 53.9599, lng: -1.0873 },
  chester: { lat: 53.1905, lng: -2.8915 },
  warrington: { lat: 53.39, lng: -2.597 },
  stockport: { lat: 53.4106, lng: -2.1575 },
  bolton: { lat: 53.578, lng: -2.429 },
  preston: { lat: 53.7632, lng: -2.7031 },
  blackpool: { lat: 53.8175, lng: -3.0357 },
  luton: { lat: 51.8787, lng: -0.42 },
};

// Canonical coordinates for high-density UK outward postal areas
export const UK_POSTCODE_OUTWARD_COORDINATES: Record<string, LatLng> = {
  // Manchester
  M1: { lat: 53.4795, lng: -2.2384 },
  M2: { lat: 53.4815, lng: -2.245 },
  M3: { lat: 53.4835, lng: -2.253 },
  M4: { lat: 53.4855, lng: -2.232 },
  M5: { lat: 53.476, lng: -2.278 },
  M60: { lat: 53.4808, lng: -2.2426 },
  // London Central & City
  EC1: { lat: 51.5235, lng: -0.103 },
  EC2: { lat: 51.5175, lng: -0.088 },
  EC2N: { lat: 51.5152, lng: -0.0846 },
  EC3: { lat: 51.5115, lng: -0.079 },
  EC4: { lat: 51.513, lng: -0.101 },
  WC1: { lat: 51.522, lng: -0.121 },
  WC2: { lat: 51.5125, lng: -0.1235 },
  W1: { lat: 51.515, lng: -0.145 },
  SW1: { lat: 51.499, lng: -0.137 },
  SW1A: { lat: 51.5014, lng: -0.1419 },
  SE1: { lat: 51.501, lng: -0.093 },
  E1: { lat: 51.517, lng: -0.061 },
  E14: { lat: 51.505, lng: -0.02 }, // Canary Wharf
  // West Midlands
  B1: { lat: 52.479, lng: -1.903 },
  B2: { lat: 52.478, lng: -1.897 },
  B3: { lat: 52.483, lng: -1.902 },
  B4: { lat: 52.484, lng: -1.893 },
  // Yorkshire
  LS1: { lat: 53.7997, lng: -1.5492 },
  LS2: { lat: 53.803, lng: -1.543 },
  S1: { lat: 53.3811, lng: -1.4701 },
  S9: { lat: 53.395, lng: -1.415 },
  // North West
  L1: { lat: 53.401, lng: -2.983 },
  L2: { lat: 53.407, lng: -2.991 },
  L3: { lat: 53.411, lng: -2.995 },
  // North East
  NE1: { lat: 54.972, lng: -1.613 },
  // Scotland
  EH1: { lat: 55.952, lng: -3.19 },
  G1: { lat: 55.861, lng: -4.248 },
  G2: { lat: 55.863, lng: -4.261 },
  // South West
  BS1: { lat: 51.453, lng: -2.597 },
};

/**
 * National UK Geographic Center & Default Viewport
 */
export const UK_MAP_DEFAULT_CENTER: LatLng = {
  lat: 53.5,
  lng: -2.2,
};

export const UK_MAP_DEFAULT_ZOOM = 6;

/**
 * Normalises a postcode string and extracts its outward district.
 * e.g. "EC2N 4AG" -> "EC2N", "M1 4BT" -> "M1"
 */
export function extractOutwardPostcode(postcode: string): string {
  if (!postcode) return '';
  const clean = postcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, ' ');
  const parts = clean.split(/\s+/).filter(Boolean);
  return parts[0] || '';
}

/**
 * Generates a deterministic micro-offset for collocated facilities.
 * This prevents pins from stacking completely on top of each other.
 */
function getDeterministicOffset(seed: string | number): LatLng {
  let num = 0;
  if (typeof seed === 'number') {
    num = seed;
  } else {
    for (let i = 0; i < seed.length; i++) {
      num = (num << 5) - num + seed.charCodeAt(i);
      num |= 0;
    }
  }
  const angle = (Math.abs(num) % 360) * (Math.PI / 180);
  const radius = 0.0018 + ((Math.abs(num) % 5) * 0.0006); // ~200m - 400m
  return {
    lat: Math.sin(angle) * radius,
    lng: Math.cos(angle) * radius * 1.6, // longitude aspect compensation for UK latitude
  };
}

/**
 * Resolves high-fidelity coordinates for a site with fallbacks.
 */
export function resolveSiteCoordinates(
  site: {
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    postcode?: string | null;
    name?: string | null;
    id?: string;
  },
  index = 0
): ResolvedCoordinates {
  // 1. Direct database coordinates if valid
  if (
    typeof site.latitude === 'number' &&
    typeof site.longitude === 'number' &&
    !isNaN(site.latitude) &&
    !isNaN(site.longitude) &&
    site.latitude > 49 &&
    site.latitude < 61 &&
    site.longitude > -11 &&
    site.longitude < 3
  ) {
    return {
      lat: site.latitude,
      lng: site.longitude,
      isExact: true,
      resolvedBy: 'db',
    };
  }

  // 2. Match via Outward Postcode
  if (site.postcode) {
    const outward = extractOutwardPostcode(site.postcode);
    if (UK_POSTCODE_OUTWARD_COORDINATES[outward]) {
      const base = UK_POSTCODE_OUTWARD_COORDINATES[outward];
      const offset = getDeterministicOffset(site.id || site.name || index);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'postcode',
      };
    }
    // Try broader prefix, e.g. M1 from M14 or EC from EC2
    const letterPrefix = outward.replace(/[0-9].*$/, '');
    if (UK_POSTCODE_OUTWARD_COORDINATES[letterPrefix + '1']) {
      const base = UK_POSTCODE_OUTWARD_COORDINATES[letterPrefix + '1'];
      const offset = getDeterministicOffset(site.id || site.name || index);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'postcode',
      };
    }
  }

  // 3. Match via City Name
  if (site.city) {
    const cityKey = site.city.toLowerCase().trim();
    if (UK_CITY_COORDINATES[cityKey]) {
      const base = UK_CITY_COORDINATES[cityKey];
      const offset = getDeterministicOffset(site.id || site.name || index);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'city',
      };
    }
  }

  // 4. Default UK operational hub fallback
  const baseFallback = UK_MAP_DEFAULT_CENTER;
  const offset = getDeterministicOffset(site.id || site.name || index);
  return {
    lat: baseFallback.lat + offset.lat,
    lng: baseFallback.lng + offset.lng,
    isExact: false,
    resolvedBy: 'uk_fallback',
  };
}
