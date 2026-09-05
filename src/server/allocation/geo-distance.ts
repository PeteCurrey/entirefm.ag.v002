/**
 * GEOLOCATION & HAVERSINE DISTANCE UTILITY
 * ========================================
 * Accurate spherical distance calculation (Haversine formula) and UK outcode centroid
 * resolution for truthful contractor-to-site proximity dispatch without fabricated distances.
 */

// Approximate latitude and longitude centroids for UK postal areas
const UK_OUTCODE_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  // Greater Manchester & North West
  M: { lat: 53.4808, lon: -2.2426 },
  BL: { lat: 53.5769, lon: -2.4282 }, // Bolton
  SK: { lat: 53.4106, lon: -2.1575 }, // Stockport
  OL: { lat: 53.5409, lon: -2.1114 }, // Oldham
  WN: { lat: 53.5451, lon: -2.6325 }, // Wigan
  WA: { lat: 53.3900, lon: -2.5970 }, // Warrington
  L: { lat: 53.4084, lon: -2.9916 },  // Liverpool
  PR: { lat: 53.7632, lon: -2.7031 }, // Preston
  BB: { lat: 53.7480, lon: -2.4820 }, // Blackburn
  FY: { lat: 53.8175, lon: -3.0357 }, // Blackpool

  // Yorkshire & Humber
  LS: { lat: 53.8008, lon: -1.5491 }, // Leeds
  BD: { lat: 53.7960, lon: -1.7594 }, // Bradford
  S: { lat: 53.3811, lon: -1.4701 },  // Sheffield
  WF: { lat: 53.6833, lon: -1.4990 }, // Wakefield
  HD: { lat: 53.6458, lon: -1.7850 }, // Huddersfield
  HX: { lat: 53.7268, lon: -1.8632 }, // Halifax
  HU: { lat: 53.7457, lon: -0.3367 }, // Hull
  YO: { lat: 53.9590, lon: -1.0815 }, // York
  DN: { lat: 53.5228, lon: -1.1312 }, // Doncaster

  // Midlands
  B: { lat: 52.4862, lon: -1.8904 },  // Birmingham
  CV: { lat: 52.4068, lon: -1.5197 }, // Coventry
  DE: { lat: 52.9225, lon: -1.4746 }, // Derby
  LE: { lat: 52.6369, lon: -1.1398 }, // Leicester
  NG: { lat: 52.9548, lon: -1.1581 }, // Nottingham
  ST: { lat: 53.0027, lon: -2.1794 }, // Stoke-on-Trent
  WS: { lat: 52.5862, lon: -1.9829 }, // Walsall
  WV: { lat: 52.5862, lon: -2.1288 }, // Wolverhampton
  LN: { lat: 53.2307, lon: -0.5406 }, // Lincoln
  NN: { lat: 52.2405, lon: -0.9027 }, // Northampton

  // London & South East
  EC: { lat: 51.5174, lon: -0.0890 }, // London City
  WC: { lat: 51.5170, lon: -0.1200 }, // London West Central
  E: { lat: 51.5300, lon: -0.0200 },  // London East
  W: { lat: 51.5100, lon: -0.2000 },  // London West
  N: { lat: 51.5600, lon: -0.1100 },  // London North
  NW: { lat: 51.5400, lon: -0.1800 }, // London North West
  SE: { lat: 51.4800, lon: -0.0600 }, // London South East
  SW: { lat: 51.4600, lon: -0.1600 }, // London South West
  CR: { lat: 51.3762, lon: -0.0982 }, // Croydon
  BR: { lat: 51.4039, lon: 0.0198 },  // Bromley
  RM: { lat: 51.5758, lon: 0.1837 },  // Romford
  IG: { lat: 51.5590, lon: 0.0740 },  // Ilford
  EN: { lat: 51.6521, lon: -0.0818 }, // Enfield
  HA: { lat: 51.5806, lon: -0.3420 }, // Harrow
  UB: { lat: 51.5425, lon: -0.4480 }, // Uxbridge
  TW: { lat: 51.4442, lon: -0.3361 }, // Twickenham
  KT: { lat: 51.4085, lon: -0.3064 }, // Kingston
  SM: { lat: 51.3614, lon: -0.1945 }, // Sutton

  // South & South West
  BS: { lat: 51.4545, lon: -2.5879 }, // Bristol
  BA: { lat: 51.3811, lon: -2.3590 }, // Bath
  SO: { lat: 50.9097, lon: -1.4044 }, // Southampton
  PO: { lat: 50.8198, lon: -1.0880 }, // Portsmouth
  BN: { lat: 50.8225, lon: -0.1372 }, // Brighton
  RG: { lat: 51.4543, lon: -0.9781 }, // Reading
  OX: { lat: 51.7520, lon: -1.2577 }, // Oxford
  CB: { lat: 52.2053, lon: 0.1218 },  // Cambridge
  EX: { lat: 50.7184, lon: -3.5339 }, // Exeter
  PL: { lat: 50.3755, lon: -4.1427 }, // Plymouth

  // North East & Cumbria
  NE: { lat: 54.9783, lon: -1.6178 }, // Newcastle
  SR: { lat: 54.9069, lon: -1.3838 }, // Sunderland
  DH: { lat: 54.7761, lon: -1.5733 }, // Durham
  TS: { lat: 54.5742, lon: -1.2350 }, // Teesside / Middlesbrough
  CA: { lat: 54.8925, lon: -2.9329 }, // Carlisle

  // Scotland & Wales
  EH: { lat: 55.9533, lon: -3.1883 }, // Edinburgh
  G: { lat: 55.8642, lon: -4.2518 },  // Glasgow
  AB: { lat: 57.1497, lon: -2.0943 }, // Aberdeen
  CF: { lat: 51.4816, lon: -3.1791 }, // Cardiff
  SA: { lat: 51.6214, lon: -3.9436 }, // Swansea
  LL: { lat: 53.3000, lon: -3.8300 }, // Llandudno
};

/**
 * Clean and extract outcode from a UK postcode (e.g., 'M1 4BT' -> 'M', 'LS1 2AB' -> 'LS').
 */
export function extractPostalArea(postcode?: string | null): string | null {
  if (!postcode) return null;
  const cleaned = postcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleaned) return null;

  // Extract letters at the start of the postcode
  const match = cleaned.match(/^([A-Z]{1,2})/);
  return match ? match[1] : null;
}

/**
 * Resolve coordinates for a UK postcode or outcode.
 */
export function getCoordinatesForPostcode(postcode?: string | null): { lat: number; lon: number } | null {
  const area = extractPostalArea(postcode);
  if (!area) return null;
  return UK_OUTCODE_CENTROIDS[area] || null;
}

/**
 * Calculates the great-circle distance between two points in miles using the Haversine formula.
 */
export function calculateHaversineDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_MILES = 3958.8; // Mean radius of the Earth in miles

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
 * Calculates truthful distance in miles between two locations.
 * Returns null if coordinates cannot be determined, avoiding fabricated defaults.
 */
export function calculateLocationDistanceMiles(
  origin: { postcode?: string | null; latitude?: number | null; longitude?: number | null },
  destination: { postcode?: string | null; latitude?: number | null; longitude?: number | null }
): number | null {
  let lat1 = origin.latitude;
  let lon1 = origin.longitude;

  if (lat1 == null || lon1 == null) {
    const coords = getCoordinatesForPostcode(origin.postcode);
    if (coords) {
      lat1 = coords.lat;
      lon1 = coords.lon;
    }
  }

  let lat2 = destination.latitude;
  let lon2 = destination.longitude;

  if (lat2 == null || lon2 == null) {
    const coords = getCoordinatesForPostcode(destination.postcode);
    if (coords) {
      lat2 = coords.lat;
      lon2 = coords.lon;
    }
  }

  if (lat1 != null && lon1 != null && lat2 != null && lon2 != null) {
    return calculateHaversineDistanceMiles(lat1, lon1, lat2, lon2);
  }

  return null;
}
