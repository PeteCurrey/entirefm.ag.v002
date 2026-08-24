/**
 * POSTCODE COVERAGE ENGINE & DIRECTORY
 * =====================================
 * Structured UK postcode area mapping to EntireFM regional operational corridors,
 * primary city hubs, and relevant local service routes.
 */

export interface PostcodeAreaMatch {
  areaCode: string;
  name: string;
  region: string;
  citySlug: string;
  cityName: string;
  primaryRoute: string;
  ppmRoute: string;
  commercialRoute: string;
  cleaningRoute?: string;
  servicesAvailable: string[];
}

export const POSTCODE_REGIONS: Record<string, PostcodeAreaMatch> = {
  // London & M25
  E: { areaCode: 'E', name: 'East London & Docklands', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  EC: { areaCode: 'EC', name: 'City of London & Finsbury', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  N: { areaCode: 'N', name: 'North London & Islington', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  NW: { areaCode: 'NW', name: 'North West London & Park Royal', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Industrial Cleaning'] },
  SE: { areaCode: 'SE', name: 'South East London & Southwark', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  SW: { areaCode: 'SW', name: 'South West London & Westminster', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  W: { areaCode: 'W', name: 'West London & Mayfair', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  WC: { areaCode: 'WC', name: 'Western Central London & Holborn', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  CR: { areaCode: 'CR', name: 'Croydon & South London', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', cleaningRoute: '/commercial-cleaning-london', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  BR: { areaCode: 'BR', name: 'Bromley & Kent Border', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes'] },
  DA: { areaCode: 'DA', name: 'Dartford & Thames Gateway', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'Industrial Cleaning', 'PPM Regimes'] },
  EN: { areaCode: 'EN', name: 'Enfield & North M25', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Industrial Cleaning', 'PPM Regimes'] },
  HA: { areaCode: 'HA', name: 'Harrow & Wembley', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Offices', 'PPM Regimes'] },
  IG: { areaCode: 'IG', name: 'Ilford & East M25', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Retail FM', 'PPM Regimes'] },
  KT: { areaCode: 'KT', name: 'Kingston upon Thames & Surrey Border', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Offices', 'PPM Regimes'] },
  RM: { areaCode: 'RM', name: 'Romford & Thames Gateway', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'Industrial Cleaning'] },
  SM: { areaCode: 'SM', name: 'Sutton & South M25', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Offices', 'PPM Regimes'] },
  TW: { areaCode: 'TW', name: 'Twickenham & Heathrow Corridor', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Airport FM', 'PPM Regimes'] },
  UB: { areaCode: 'UB', name: 'Uxbridge & Stockley Park', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'Commercial Offices'] },
  WD: { areaCode: 'WD', name: 'Watford & Hertfordshire Border', region: 'Greater London', citySlug: 'london', cityName: 'London', primaryRoute: '/facilities-management-london', ppmRoute: '/facilities-management-london', commercialRoute: '/london-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Offices', 'PPM Regimes'] },

  // Oxford & Thames Valley
  OX: { areaCode: 'OX', name: 'Oxford & Oxfordshire', region: 'Thames Valley', citySlug: 'oxford', cityName: 'Oxford', primaryRoute: '/facilities-management-oxford', ppmRoute: '/facilities-management-oxford', commercialRoute: '/oxford-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Life Sciences FM', 'M&E Engineering', 'PPM Regimes'] },

  // Greater Manchester & North West
  M: { areaCode: 'M', name: 'Manchester & Salford', region: 'Greater Manchester', citySlug: 'manchester', cityName: 'Manchester', primaryRoute: '/facilities-management-manchester', ppmRoute: '/facilities-management-manchester', commercialRoute: '/manchester-facilities-management', cleaningRoute: '/commercial-cleaning-manchester', servicesAvailable: ['Hard & Soft FM', 'M&E Engineering', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning', 'Industrial Cleaning'] },
  BL: { areaCode: 'BL', name: 'Bolton & Bury', region: 'Greater Manchester North', citySlug: 'bolton', cityName: 'Bolton', primaryRoute: '/facilities-management-bolton', ppmRoute: '/facilities-management-bolton', commercialRoute: '/bolton-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Industrial Cleaning', 'PPM Regimes', 'Retail Park FM'] },
  WN: { areaCode: 'WN', name: 'Wigan & Leigh', region: 'Greater Manchester West', citySlug: 'wigan', cityName: 'Wigan', primaryRoute: '/facilities-management-wigan', ppmRoute: '/facilities-management-wigan', commercialRoute: '/wigan-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'Food Processing FM', 'PPM Regimes'] },
  SK: { areaCode: 'SK', name: 'Stockport & Cheshire East', region: 'Greater Manchester South', citySlug: 'manchester', cityName: 'Manchester', primaryRoute: '/facilities-management-manchester', ppmRoute: '/facilities-management-manchester', commercialRoute: '/manchester-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Offices', 'M&E Engineering', 'PPM Regimes'] },
  OL: { areaCode: 'OL', name: 'Oldham & Rochdale', region: 'Greater Manchester East', citySlug: 'manchester', cityName: 'Manchester', primaryRoute: '/facilities-management-manchester', ppmRoute: '/facilities-management-manchester', commercialRoute: '/manchester-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Manufacturing FM', 'PPM Regimes'] },
  WA: { areaCode: 'WA', name: 'Warrington & Runcorn', region: 'North West', citySlug: 'manchester', cityName: 'Manchester', primaryRoute: '/facilities-management-manchester', ppmRoute: '/facilities-management-manchester', commercialRoute: '/manchester-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics & Warehousing FM', 'PPM Regimes'] },
  L: { areaCode: 'L', name: 'Liverpool & Merseyside', region: 'Merseyside', citySlug: 'liverpool', cityName: 'Liverpool', primaryRoute: '/facilities-management-liverpool', ppmRoute: '/facilities-management-liverpool', commercialRoute: '/liverpool-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Port Logistics FM', 'Commercial Offices', 'PPM Regimes'] },
  PR: { areaCode: 'PR', name: 'Preston & Central Lancashire', region: 'Lancashire', citySlug: 'preston', cityName: 'Preston', primaryRoute: '/facilities-management-preston', ppmRoute: '/facilities-management-preston', commercialRoute: '/preston-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Aerospace Engineering FM', 'Higher Education FM', 'PPM Regimes'] },
  CH: { areaCode: 'CH', name: 'Chester & Wirral', region: 'Cheshire & Merseyside', citySlug: 'liverpool', cityName: 'Liverpool', primaryRoute: '/facilities-management-liverpool', ppmRoute: '/facilities-management-liverpool', commercialRoute: '/liverpool-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial Estates', 'PPM Regimes'] },

  // Yorkshire & Humber
  S: { areaCode: 'S', name: 'Sheffield, Rotherham & Chesterfield', region: 'South Yorkshire', citySlug: 'sheffield', cityName: 'Sheffield', primaryRoute: '/facilities-management-sheffield', ppmRoute: '/facilities-management-sheffield', commercialRoute: '/sheffield-facilities-management', cleaningRoute: '/commercial-cleaning-sheffield', servicesAvailable: ['Hard & Soft FM', 'Advanced Manufacturing FM', 'M&E Engineering', 'PPM Regimes', 'Industrial Cleaning'] },
  LS: { areaCode: 'LS', name: 'Leeds & Aire Valley', region: 'West Yorkshire', citySlug: 'leeds', cityName: 'Leeds', primaryRoute: '/facilities-management-leeds', ppmRoute: '/facilities-management-leeds', commercialRoute: '/leeds-facilities-management', cleaningRoute: '/commercial-cleaning-leeds', servicesAvailable: ['Hard & Soft FM', 'Financial Offices FM', 'Commercial HVAC', 'PPM Regimes', 'Commercial Cleaning'] },
  BD: { areaCode: 'BD', name: 'Bradford & Aire Valley', region: 'West Yorkshire', citySlug: 'bradford', cityName: 'Bradford', primaryRoute: '/facilities-management-bradford', ppmRoute: '/facilities-management-bradford', commercialRoute: '/bradford-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Manufacturing FM', 'PPM Regimes'] },
  DN: { areaCode: 'DN', name: 'Doncaster & Grimsby', region: 'South Yorkshire & Humber', citySlug: 'doncaster', cityName: 'Doncaster', primaryRoute: '/facilities-management-doncaster', ppmRoute: '/facilities-management-doncaster', commercialRoute: '/doncaster-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Rail Freight FM', 'Cold Storage FM', 'PPM Regimes'] },
  WF: { areaCode: 'WF', name: 'Wakefield & Castleford', region: 'West Yorkshire', citySlug: 'leeds', cityName: 'Leeds', primaryRoute: '/facilities-management-leeds', ppmRoute: '/facilities-management-leeds', commercialRoute: '/leeds-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'PPM Regimes'] },
  HD: { areaCode: 'HD', name: 'Huddersfield & Calderdale', region: 'West Yorkshire', citySlug: 'leeds', cityName: 'Leeds', primaryRoute: '/facilities-management-leeds', ppmRoute: '/facilities-management-leeds', commercialRoute: '/leeds-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Manufacturing FM', 'PPM Regimes'] },
  HX: { areaCode: 'HX', name: 'Halifax & Calderdale', region: 'West Yorkshire', citySlug: 'leeds', cityName: 'Leeds', primaryRoute: '/facilities-management-leeds', ppmRoute: '/facilities-management-leeds', commercialRoute: '/leeds-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Commercial FM', 'PPM Regimes'] },

  // West & East Midlands
  B: { areaCode: 'B', name: 'Birmingham & Solihull', region: 'West Midlands', citySlug: 'birmingham', cityName: 'Birmingham', primaryRoute: '/facilities-management-birmingham', ppmRoute: '/facilities-management-birmingham', commercialRoute: '/birmingham-facilities-management', cleaningRoute: '/commercial-cleaning-birmingham', servicesAvailable: ['Hard & Soft FM', 'Corporate Offices', 'Automotive FM', 'PPM Regimes', 'Commercial Cleaning'] },
  DE: { areaCode: 'DE', name: 'Derby, Matlock & Derbyshire', region: 'East Midlands', citySlug: 'derby', cityName: 'Derby', primaryRoute: '/facilities-management-derby', ppmRoute: '/facilities-management-derby', commercialRoute: '/derby-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Aerospace Engineering FM', 'Rail FM', 'PPM Regimes'] },
  NG: { areaCode: 'NG', name: 'Nottingham & Mansfield', region: 'East Midlands', citySlug: 'nottingham', cityName: 'Nottingham', primaryRoute: '/facilities-management-nottingham', ppmRoute: '/facilities-management-nottingham', commercialRoute: '/nottingham-facilities-management', cleaningRoute: '/commercial-cleaning-nottingham', servicesAvailable: ['Hard & Soft FM', 'Life Sciences FM', 'Higher Education FM', 'PPM Regimes'] },
  LN: { areaCode: 'LN', name: 'Lincoln & Lincolnshire', region: 'Lincolnshire', citySlug: 'lincoln', cityName: 'Lincoln', primaryRoute: '/facilities-management-lincoln', ppmRoute: '/facilities-management-lincoln', commercialRoute: '/lincoln-facilities-management', cleaningRoute: '/commercial-cleaning-lincoln', servicesAvailable: ['Hard & Soft FM', 'Food Production FM', 'Agricultural FM', 'PPM Regimes'] },
  TF: { areaCode: 'TF', name: 'Telford & Shropshire', region: 'West Midlands West', citySlug: 'telford', cityName: 'Telford', primaryRoute: '/facilities-management-telford', ppmRoute: '/facilities-management-telford', commercialRoute: '/telford-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Automotive Supply FM', 'Plastics FM', 'PPM Regimes'] },
  WS: { areaCode: 'WS', name: 'Walsall & Cannock', region: 'West Midlands', citySlug: 'birmingham', cityName: 'Birmingham', primaryRoute: '/facilities-management-birmingham', ppmRoute: '/facilities-management-birmingham', commercialRoute: '/birmingham-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Industrial FM', 'PPM Regimes'] },
  WV: { areaCode: 'WV', name: 'Wolverhampton & Black Country', region: 'West Midlands', citySlug: 'birmingham', cityName: 'Birmingham', primaryRoute: '/facilities-management-birmingham', ppmRoute: '/facilities-management-birmingham', commercialRoute: '/birmingham-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Manufacturing FM', 'PPM Regimes'] },
  DY: { areaCode: 'DY', name: 'Dudley & Stourbridge', region: 'West Midlands', citySlug: 'birmingham', cityName: 'Birmingham', primaryRoute: '/facilities-management-birmingham', ppmRoute: '/facilities-management-birmingham', commercialRoute: '/birmingham-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Industrial Trade FM', 'PPM Regimes'] },
  CV: { areaCode: 'CV', name: 'Coventry & Warwickshire', region: 'West Midlands', citySlug: 'birmingham', cityName: 'Birmingham', primaryRoute: '/facilities-management-birmingham', ppmRoute: '/facilities-management-birmingham', commercialRoute: '/birmingham-facilities-management', servicesAvailable: ['Hard & Soft FM', 'Automotive FM', 'Logistics FM', 'PPM Regimes'] },
  LE: { areaCode: 'LE', name: 'Leicester & Loughborough', region: 'East Midlands', citySlug: 'midlands', cityName: 'Midlands', primaryRoute: '/facilities-management-midlands', ppmRoute: '/facilities-management-midlands', commercialRoute: '/facilities-management-in-the-midlands', servicesAvailable: ['Hard & Soft FM', 'Logistics FM', 'Manufacturing FM', 'PPM Regimes'] },
  ST: { areaCode: 'ST', name: 'Stoke-on-Trent & Staffordshire', region: 'Midlands & North West Corridor', citySlug: 'midlands', cityName: 'Midlands', primaryRoute: '/facilities-management-midlands', ppmRoute: '/facilities-management-midlands', commercialRoute: '/facilities-management-in-the-midlands', servicesAvailable: ['Hard & Soft FM', 'Distribution FM', 'Industrial Cleaning', 'PPM Regimes'] },
};

/**
 * Look up postcode coverage match from raw user input string.
 */
export function lookupPostcodeCoverage(rawPostcode: string): PostcodeAreaMatch | null {
  if (!rawPostcode || typeof rawPostcode !== 'string') return null;
  const clean = rawPostcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length < 1) return null;

  // Extract letters prefix (e.g. "EC1A" -> "EC", "M1" -> "M", "S10" -> "S", "DE24" -> "DE")
  const match = clean.match(/^([A-Z]{1,2})/);
  if (!match) return null;

  const prefix = match[1];
  if (POSTCODE_REGIONS[prefix]) {
    return POSTCODE_REGIONS[prefix];
  }

  // Fallback if 2-letter not found, check 1-letter
  const singleLetter = prefix.slice(0, 1);
  if (POSTCODE_REGIONS[singleLetter]) {
    return POSTCODE_REGIONS[singleLetter];
  }

  return null;
}
