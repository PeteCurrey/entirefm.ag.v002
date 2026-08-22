/**
 * ORGANIZATION ENTITY DATA — SINGLE SOURCE OF TRUTH
 * ==================================================
 * Authoritative business entity metadata for schema.org,
 * metadata generation, legal footers, and contact hubs.
 * Contains only VERIFIED business claims.
 */

export const ORGANIZATION_CONFIG = {
  legalName: 'Entire Facilities Management Ltd',
  brandName: 'EntireFM',
  tagline: 'Total Facilities Management & Specialist Engineering',
  foundingYear: 2009,
  canonicalDomain: 'https://www.entirefm.com',
  productionHost: 'www.entirefm.com',
  
  headquarters: {
    country: 'United Kingdom',
    region: 'East Midlands',
    operationalBase: 'Lincoln Operational Centre',
    description: 'National Facilities Management Provider with direct regional operating depots.',
  },

  contact: {
    enquiryEmail: 'enquiries@entirefm.com',
    helpdeskEmail: 'helpdesk@entirefm.com',
    portalEmail: 'portal@entirefm.com',
    mainPhoneDisplay: '0800 093 1128',
    mainPhoneTel: 'tel:08000931128',
    helpdeskPhoneDisplay: '24/7 Digital Helpdesk',
    londonPhoneDisplay: 'London Operations Desk',
  },

  serviceRegions: [
    'Greater London (Zones 1-6 & M25)',
    'Midlands & East Midlands (Lincoln, Nottingham, Derby, Chesterfield)',
    'Yorkshire & Humber (Sheffield, Leeds, Bradford, Doncaster, Rotherham, Grimsby)',
    'North West (Manchester, Liverpool, Preston, Wigan, Bolton, Bury)',
    'West Midlands (Birmingham, Telford)',
    'South & Thames Valley (Oxford)',
    'UK Nationwide Coverage',
  ],

  sectors: [
    'Industrial & Manufacturing',
    'Commercial & Corporate Real Estate',
    'Logistics & Warehousing',
    'Retail Parks & Shopping Centres',
    'Education & University Campuses',
    'Healthcare & Clinical Environments',
    'Hospitality & Leisure',
    'Public Sector & Infrastructure',
  ],

  complianceStandards: [
    'SFG20 Maintenance Scheduling',
    'NICEIC Electrical Safety Standards',
    'Gas Safe Register Compliance',
    'CIBSE Building Services Guidance',
    'BS 5839 Fire Detection Systems',
    'BS 5266 Emergency Lighting Compliance',
    'L8 Legionella Water Hygiene Control',
    'COSHH Safety Regulations',
  ],
} as const;
