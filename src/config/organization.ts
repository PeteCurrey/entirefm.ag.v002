/**
 * ORGANIZATION ENTITY DATA — SINGLE SOURCE OF TRUTH
 * ==================================================
 * Authoritative business entity metadata for schema.org,
 * metadata generation, legal footers, and contact hubs.
 *
 * CLAIM GOVERNANCE (Phase 09R.3):
 * Only factual, non-contested business data lives here.
 * Accreditations, certifications, and operational SLA claims
 * are governed by /config/verified-claims.json.
 * Nothing here may assert a claim that is TO_VERIFY in that registry.
 */

export const ORGANIZATION_CONFIG = {
  legalName: 'Alkota Group Limited',
  brandName: 'EntireFM',
  tradingName: 'EntireFM (trading name of Alkota Group Limited)',
  companyNumber: '13535215',
  tagline: 'Total Facilities Management & Specialist Engineering',
  foundingYear: 2009,
  canonicalDomain: 'https://www.entirefm.com',
  productionHost: 'www.entirefm.com',
  sameAs: [
    'https://www.linkedin.com/company/entirefm',
    'https://find-and-update.company-information.service.gov.uk/company/13535215',
  ],

  headquarters: {
    country: 'United Kingdom',
    region: 'East Midlands',
    // Specific operational centre names and depot claims are subject to
    // verification — see /config/verified-claims.json before asserting publicly.
    description: 'National facilities management and specialist engineering provider.',
  },

  contact: {
    enquiryEmail: 'enquiries@entirefm.com',
    helpdeskEmail: 'helpdesk@entirefm.com',
    portalEmail: 'portal@entirefm.com',
    // Phone number confirmed in use for EntireFM.
    // See /config/verified-contact.json for verification record.
    mainPhoneDisplay: '020 4617 0228',
    mainPhoneTel: 'tel:02046170228',
  },

  serviceRegions: [
    'Greater London (Zones 1–6 & M25)',
    'East Midlands (Lincoln, Nottingham, Derby)',
    'Yorkshire & Humber (Sheffield, Leeds, Doncaster)',
    'North West (Manchester, Liverpool)',
    'West Midlands (Birmingham)',
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

  // Compliance standards and accreditations are NOT listed here.
  // Use getVerifiedAccreditations() from src/config/verified-claims.ts
  // to obtain only currently verified items for public rendering.
} as const;
