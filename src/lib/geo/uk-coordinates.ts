/**
 * CANONICAL UK GEOLOCATION RESOLVER & OUTWARD CODE MAPPINGS
 * =========================================================
 * Provides accurate coordinates for UK cities and postal districts,
 * ensuring all estate facilities across the UK are accurately positioned
 * on operational and estate directory Google Maps.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ResolvedCoordinates extends LatLng {
  isExact: boolean;
  resolvedBy: 'db' | 'postcode_district' | 'postcode_area' | 'city' | 'uk_fallback';
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
  chesterfield: { lat: 53.235, lng: -1.428 },
  doncaster: { lat: 53.5228, lng: -1.1311 },
  mexborough: { lat: 53.493, lng: -1.282 },
  liverpool: { lat: 53.4084, lng: -2.9916 },
  prenton: { lat: 53.376, lng: -3.048 },
  wirral: { lat: 53.35, lng: -3.05 },
  newcastle: { lat: 54.9783, lng: -1.6178 },
  'newcastle upon tyne': { lat: 54.9783, lng: -1.6178 },
  'newcastle under-lyme': { lat: 53.011, lng: -2.227 },
  'newcastle-under-lyme': { lat: 53.011, lng: -2.227 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  portishead: { lat: 51.485, lng: -2.766 },
  nottingham: { lat: 52.9548, lng: -1.1581 },
  leicester: { lat: 52.6369, lng: -1.1398 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
  cardiff: { lat: 51.4816, lng: -3.1791 },
  belfast: { lat: 54.5973, lng: -5.9301 },
  southampton: { lat: 50.9097, lng: -1.4044 },
  portsmouth: { lat: 50.8198, lng: -1.088 },
  fareham: { lat: 50.852, lng: -1.178 },
  reading: { lat: 51.4543, lng: -0.9781 },
  cambridge: { lat: 52.2053, lng: 0.1218 },
  oxford: { lat: 51.752, lng: -1.2577 },
  banbury: { lat: 52.062, lng: -1.339 },
  coventry: { lat: 52.4068, lng: -1.5197 },
  hull: { lat: 53.7457, lng: -0.3367 },
  kingston_upon_hull: { lat: 53.7457, lng: -0.3367 },
  stoke: { lat: 53.0027, lng: -2.1794 },
  'stoke-on-trent': { lat: 53.0027, lng: -2.1794 },
  derby: { lat: 52.9225, lng: -1.4746 },
  alfreton: { lat: 53.097, lng: -1.385 },
  bakewell: { lat: 53.213, lng: -1.675 },
  bolsover: { lat: 53.23, lng: -1.288 },
  'hope valley': { lat: 53.35, lng: -1.74 },
  plymouth: { lat: 50.3755, lng: -4.1427 },
  wolverhampton: { lat: 52.587, lng: -2.1288 },
  willenhall: { lat: 52.585, lng: -2.057 },
  solihull: { lat: 52.413, lng: -1.778 },
  redditch: { lat: 52.306, lng: -1.943 },
  norwich: { lat: 52.6309, lng: 1.2974 },
  lincoln: { lat: 53.2344, lng: -0.5386 },
  skegness: { lat: 53.143, lng: 0.342 },
  boston: { lat: 52.977, lng: -0.026 },
  spalding: { lat: 52.787, lng: -0.153 },
  grimsby: { lat: 53.567, lng: -0.081 },
  cleethorpes: { lat: 53.553, lng: -0.023 },
  harrogate: { lat: 53.9921, lng: -1.5372 },
  ilford: { lat: 51.5588, lng: 0.0718 },
  chigwell: { lat: 51.621, lng: 0.074 },
  croydon: { lat: 51.3762, lng: -0.0982 },
  durham: { lat: 54.7761, lng: -1.5733 },
  preston: { lat: 53.7632, lng: -2.7031 },
  chorley: { lat: 53.653, lng: -2.632 },
  bolton: { lat: 53.578, lng: -2.429 },
  huddersfield: { lat: 53.6458, lng: -1.785 },
  ormskirk: { lat: 53.566, lng: -2.887 },
  middlewich: { lat: 53.193, lng: -2.443 },
  crawley: { lat: 51.113, lng: -0.1831 },
  gravesend: { lat: 51.441, lng: 0.368 },
  maidstone: { lat: 51.272, lng: 0.522 },
  rochester: { lat: 51.388, lng: 0.505 },
  'st albans': { lat: 51.7527, lng: -0.3394 },
  scarborough: { lat: 54.283, lng: -0.404 },
  shrewsbury: { lat: 52.7073, lng: -2.7553 },
  shewsbury: { lat: 52.7073, lng: -2.7553 },
  'langley mill': { lat: 53.018, lng: -1.332 },
  gloucestershire: { lat: 51.8642, lng: -2.2381 },
  lancashire: { lat: 53.7632, lng: -2.7031 },
};

// Canonical coordinates for high-density UK outward postal districts
export const UK_POSTCODE_OUTWARD_COORDINATES: Record<string, LatLng> = {
  // Manchester
  M1: { lat: 53.4795, lng: -2.2384 },
  M2: { lat: 53.4815, lng: -2.245 },
  M3: { lat: 53.4835, lng: -2.253 },
  M4: { lat: 53.4855, lng: -2.232 },
  M5: { lat: 53.476, lng: -2.278 },
  M14: { lat: 53.451, lng: -2.222 },
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
  SW1Y: { lat: 51.507, lng: -0.134 },
  SW1A: { lat: 51.5014, lng: -0.1419 },
  SE1: { lat: 51.501, lng: -0.093 },
  E1: { lat: 51.517, lng: -0.061 },
  E14: { lat: 51.505, lng: -0.02 },
  IG3: { lat: 51.565, lng: 0.106 },
  IG7: { lat: 51.621, lng: 0.074 },
  CR0: { lat: 51.376, lng: -0.098 },
  // West Midlands
  B1: { lat: 52.479, lng: -1.903 },
  B2: { lat: 52.478, lng: -1.897 },
  B3: { lat: 52.483, lng: -1.902 },
  B4: { lat: 52.484, lng: -1.893 },
  B91: { lat: 52.413, lng: -1.778 },
  B97: { lat: 52.306, lng: -1.943 },
  WV13: { lat: 52.585, lng: -2.057 },
  // Yorkshire & Humber
  LS1: { lat: 53.7997, lng: -1.5492 },
  LS2: { lat: 53.803, lng: -1.543 },
  S1: { lat: 53.3811, lng: -1.4701 },
  S2: { lat: 53.372, lng: -1.455 },
  S4: { lat: 53.395, lng: -1.445 },
  S9: { lat: 53.395, lng: -1.415 },
  S35: { lat: 53.46, lng: -1.49 },
  S41: { lat: 53.255, lng: -1.432 },
  S44: { lat: 53.23, lng: -1.288 },
  S64: { lat: 53.493, lng: -1.282 },
  DN4: { lat: 53.505, lng: -1.125 },
  DN31: { lat: 53.567, lng: -0.081 },
  DN35: { lat: 53.553, lng: -0.023 },
  HG1: { lat: 53.9921, lng: -1.5372 },
  HD1: { lat: 53.6458, lng: -1.785 },
  YO11: { lat: 54.283, lng: -0.404 },
  // East Midlands
  LN1: { lat: 53.2344, lng: -0.5386 },
  PE21: { lat: 52.977, lng: -0.026 },
  PE25: { lat: 53.143, lng: 0.342 },
  PE11: { lat: 52.787, lng: -0.153 },
  NG1: { lat: 52.9548, lng: -1.1581 },
  NG16: { lat: 53.018, lng: -1.332 },
  DE1: { lat: 52.9225, lng: -1.4746 },
  DE55: { lat: 53.097, lng: -1.385 },
  DE45: { lat: 53.213, lng: -1.675 },
  // North West & Wirral
  CH43: { lat: 53.385, lng: -3.055 },
  L1: { lat: 53.401, lng: -2.983 },
  L2: { lat: 53.407, lng: -2.991 },
  L39: { lat: 53.566, lng: -2.887 },
  PR1: { lat: 53.7632, lng: -2.7031 },
  PR7: { lat: 53.653, lng: -2.632 },
  BL1: { lat: 53.578, lng: -2.429 },
  CW10: { lat: 53.193, lng: -2.443 },
  // South West & Wales
  BS1: { lat: 51.453, lng: -2.597 },
  BS20: { lat: 51.485, lng: -2.766 },
  CF10: { lat: 51.4816, lng: -3.1791 },
  // South East
  PO1: { lat: 50.798, lng: -1.096 },
  PO16: { lat: 50.852, lng: -1.178 },
  ME1: { lat: 51.388, lng: 0.505 },
  ME14: { lat: 51.272, lng: 0.522 },
  DA11: { lat: 51.441, lng: 0.368 },
  AL1: { lat: 51.7527, lng: -0.3394 },
  RH10: { lat: 51.113, lng: -0.1831 },
};

// Broad UK Postcode Area prefixes mapping (e.g. S, DN, PE, CH, B, M)
export const UK_POSTCODE_AREA_COORDINATES: Record<string, LatLng> = {
  S: { lat: 53.3811, lng: -1.4701 }, // Sheffield / Chesterfield
  DN: { lat: 53.5228, lng: -1.1311 }, // Doncaster
  LN: { lat: 53.2344, lng: -0.5386 }, // Lincoln
  PE: { lat: 52.7, lng: 0.05 }, // Peterborough / Lincolnshire coast
  CH: { lat: 53.35, lng: -3.05 }, // Chester / Wirral
  HG: { lat: 53.9921, lng: -1.5372 }, // Harrogate
  IG: { lat: 51.56, lng: 0.08 }, // Ilford
  BS: { lat: 51.4545, lng: -2.5879 }, // Bristol
  PO: { lat: 50.82, lng: -1.12 }, // Portsmouth / Hampshire
  CR: { lat: 51.3762, lng: -0.0982 }, // Croydon
  NG: { lat: 52.9548, lng: -1.1581 }, // Nottingham
  CV: { lat: 52.4068, lng: -1.5197 }, // Coventry
  DE: { lat: 52.95, lng: -1.45 }, // Derby / Derbyshire
  L: { lat: 53.4084, lng: -2.9916 }, // Liverpool
  M: { lat: 53.4808, lng: -2.2426 }, // Manchester
  B: { lat: 52.4862, lng: -1.8904 }, // Birmingham
  LS: { lat: 53.8008, lng: -1.5491 }, // Leeds
  ST: { lat: 53.0027, lng: -2.1794 }, // Stoke-on-Trent
  DH: { lat: 54.7761, lng: -1.5733 }, // Durham
  NE: { lat: 54.9783, lng: -1.6178 }, // Newcastle
  PR: { lat: 53.7632, lng: -2.7031 }, // Preston
  GL: { lat: 51.8642, lng: -2.2381 }, // Gloucestershire
  AL: { lat: 51.7527, lng: -0.3394 }, // St Albans
  ME: { lat: 51.33, lng: 0.51 }, // Medway / Kent
  HD: { lat: 53.6458, lng: -1.785 }, // Huddersfield
  BL: { lat: 53.578, lng: -2.429 }, // Bolton
  SY: { lat: 52.7073, lng: -2.7553 }, // Shrewsbury
  OX: { lat: 51.752, lng: -1.2577 }, // Oxford
  WV: { lat: 52.587, lng: -2.1288 }, // Wolverhampton
  CW: { lat: 53.0987, lng: -2.4406 }, // Crewe / Cheshire
  RH: { lat: 51.113, lng: -0.1831 }, // Redhill / Crawley
  CF: { lat: 51.4816, lng: -3.1791 }, // Cardiff
  YO: { lat: 53.9599, lng: -1.0873 }, // York
  DA: { lat: 51.4463, lng: 0.2206 }, // Dartford
  SW: { lat: 51.47, lng: -0.15 }, // London SW
  SE: { lat: 51.47, lng: -0.06 }, // London SE
  NW: { lat: 51.54, lng: -0.19 }, // London NW
  N: { lat: 51.56, lng: -0.11 }, // London N
  W: { lat: 51.51, lng: -0.18 }, // London W
  E: { lat: 51.53, lng: -0.02 }, // London E
  EC: { lat: 51.52, lng: -0.09 }, // London EC
  WC: { lat: 51.52, lng: -0.12 }, // London WC
  EH: { lat: 55.9533, lng: -3.1883 }, // Edinburgh
  G: { lat: 55.8642, lng: -4.2518 }, // Glasgow
  BT: { lat: 54.5973, lng: -5.9301 }, // Belfast
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
 * e.g. "EC2N 4AG" -> "EC2N", "M1 4BT" -> "M1", "S417JD" -> "S41"
 */
export function extractOutwardPostcode(postcode: string): string {
  if (!postcode) return '';
  const clean = postcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  // If no space, outward code is everything up to the last 3 chars (which is the inward code)
  if (clean.length > 3) {
    return clean.slice(0, clean.length - 3);
  }
  return clean;
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
  const radius = 0.0025 + ((Math.abs(num) % 7) * 0.0008); // ~250m - 800m
  return {
    lat: Math.sin(angle) * radius,
    lng: Math.cos(angle) * radius * 1.6, // longitude aspect compensation for UK latitude
  };
}

/**
 * Resolves high-fidelity coordinates for a site with multiple levels of fallbacks.
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
  const seed = site.id || site.name || index;

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

  // 2. Match via Outward Postcode District (e.g. S41, M1, EC2N)
  if (site.postcode) {
    const outward = extractOutwardPostcode(site.postcode);
    if (UK_POSTCODE_OUTWARD_COORDINATES[outward]) {
      const base = UK_POSTCODE_OUTWARD_COORDINATES[outward];
      const offset = getDeterministicOffset(seed);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'postcode_district',
      };
    }

    // 3. Match via Postcode Area (e.g. S, DN, PE, CH, B, M, BS)
    const areaLetter = outward.replace(/[0-9].*$/, '');
    if (UK_POSTCODE_AREA_COORDINATES[areaLetter]) {
      const base = UK_POSTCODE_AREA_COORDINATES[areaLetter];
      const offset = getDeterministicOffset(seed);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'postcode_area',
      };
    }
  }

  // 4. Match via City Name
  if (site.city) {
    const cityKey = site.city.toLowerCase().trim();
    if (UK_CITY_COORDINATES[cityKey]) {
      const base = UK_CITY_COORDINATES[cityKey];
      const offset = getDeterministicOffset(seed);
      return {
        lat: base.lat + offset.lat,
        lng: base.lng + offset.lng,
        isExact: false,
        resolvedBy: 'city',
      };
    }
  }

  // 5. Default UK operational hub fallback with dispersion
  const baseFallback = UK_MAP_DEFAULT_CENTER;
  const offset = getDeterministicOffset(seed);
  return {
    lat: baseFallback.lat + offset.lat,
    lng: baseFallback.lng + offset.lng,
    isExact: false,
    resolvedBy: 'uk_fallback',
  };
}
