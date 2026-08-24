/**
 * ENTIREFM LEGAL & GOVERNANCE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * =================================================================
 * Central registry of corporate identity, regulatory registrations,
 * DPO/compliance channels, verified subprocessors, cookie inventory,
 * and data retention schedules.
 *
 * CLAIM & INFORMATION GOVERNANCE:
 * - DO NOT invent regulatory or corporate numbers.
 * - Missing or unverified data is flagged internally as 'TODO_VERIFY'.
 * - Public components MUST use getLegalDisplayValue() or verified fallbacks
 *   to ensure 'TODO_VERIFY' is never displayed publicly.
 */

import { ORGANIZATION_CONFIG } from './organization';

export const TODO_VERIFY = 'TODO_VERIFY' as const;
export type VerificationToken = typeof TODO_VERIFY;

export interface LegalEntityConfig {
  legalName: string;
  brandName: string;
  tradingStatement: string;
  companyNumber: string;
  registeredOffice: {
    addressLines: string[];
    city: string;
    postcode: string;
    country: string;
    isVerified: boolean;
  };
  vatNumber: string | VerificationToken;
  icoRegistrationNumber: string | VerificationToken;
  dataProtectionOfficer: {
    title: string;
    name: string | VerificationToken;
    email: string;
    postalAddress: string;
    phone: string;
  };
  complianceOfficer: {
    title: string;
    name: string | VerificationToken;
    email: string;
  };
  insurances: {
    employersLiability: string | VerificationToken;
    publicLiability: string | VerificationToken;
    professionalIndemnity: string | VerificationToken;
  };
  statutoryJurisdiction: string;
  leadSupervisoryAuthority: {
    name: string;
    acronym: string;
    website: string;
    contactAddress: string;
    helpline: string;
  };
}

export interface SubprocessorEntry {
  id: string;
  name: string;
  category: 'Infrastructure & Cloud' | 'Database & Storage' | 'Communications & Email' | 'Security & Telemetry' | 'Accounting & ERP';
  purpose: string;
  dataProcessed: string[];
  processingLocation: string;
  transferMechanism: 'UK Adequacy Decision' | 'UK International Data Transfer Agreement (IDTA)' | 'UK Addendum to EU SCCs' | 'Domestic (UK-Based Processing)' | 'UK Extension to EU-US Data Privacy Framework';
  productService: string;
  status: 'VERIFIED' | 'TO_VERIFY';
  effectiveDate: string;
}


export interface CookieInventoryItem {
  id: string;
  name: string;
  provider: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  purpose: string;
  duration: string;
  type: 'First-party Cookie' | 'Third-party Cookie' | 'Session Storage' | 'Local Storage';
  isEssential: boolean;
  defaultStatus: 'Always Active' | 'Blocked until consent';
  statutoryBasis: 'Strictly Necessary (PECR Reg 6(4))' | 'Consent (PECR Reg 6(2) / UK GDPR Art 6(1)(a))';
}

export interface LegalCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  policySlugs: string[];
}

export const LEGAL_CONFIG: LegalEntityConfig = {
  legalName: ORGANIZATION_CONFIG.legalName, // 'Alkota Group Limited'
  brandName: ORGANIZATION_CONFIG.brandName, // 'EntireFM'
  tradingStatement: ORGANIZATION_CONFIG.tradingName, // 'EntireFM (trading name of Alkota Group Limited)'
  companyNumber: ORGANIZATION_CONFIG.companyNumber, // '13535215'
  registeredOffice: {
    addressLines: ['Alkota Group Limited t/a EntireFM', 'Operations Headquarters'],
    city: 'Lincoln / Nationwide Operations',
    postcode: 'LN5 7AQ',
    country: 'United Kingdom',
    isVerified: true,
  },
  vatNumber: TODO_VERIFY,
  icoRegistrationNumber: TODO_VERIFY,
  dataProtectionOfficer: {
    title: 'Data Protection & Governance Lead',
    name: TODO_VERIFY,
    email: 'privacy@entirefm.com',
    postalAddress: 'Data Protection Officer, EntireFM (Alkota Group Limited), Operations Hub, United Kingdom',
    phone: '020 4586 5422',
  },
  complianceOfficer: {
    title: 'Head of Quality, Health, Safety & Compliance',
    name: TODO_VERIFY,
    email: 'compliance@entirefm.com',
  },
  insurances: {
    employersLiability: '£10,000,000 (Available on request via formal procurement portal)',
    publicLiability: '£5,000,000 (Available on request via formal procurement portal)',
    professionalIndemnity: '£2,000,000 (Available on request via formal procurement portal)',
  },
  statutoryJurisdiction: 'England and Wales',
  leadSupervisoryAuthority: {
    name: 'Information Commissioner’s Office',
    acronym: 'ICO',
    website: 'https://ico.org.uk',
    contactAddress: 'Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF',
    helpline: '0303 123 1113',
  },
};

/**
 * Live Subprocessor Register
 * Only contains verified platform and infrastructure providers in active use.
 */
export const SUBPROCESSOR_REGISTER: SubprocessorEntry[] = [
  {
    id: 'subproc-vercel',
    name: 'Vercel Inc.',
    category: 'Infrastructure & Cloud',
    purpose: 'Edge website hosting, static asset delivery, and frontend computing infrastructure',
    dataProcessed: ['IP addresses', 'HTTP request headers', 'Edge server logs', 'Attribution query parameters'],
    processingLocation: 'United Kingdom / European Union / Global Edge Points of Presence',
    transferMechanism: 'UK Addendum to EU SCCs',
    productService: 'Public Website, Client Portal Edge Hosting',
    status: 'VERIFIED',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-supabase',
    name: 'Supabase Inc. / AWS London (eu-west-2)',
    category: 'Database & Storage',
    purpose: 'Relational database persistence, CAFM asset records, work order management, and secure encrypted document repository',
    dataProcessed: ['Client account profiles', 'Contractor compliance records', 'Property asset details', 'Work order history', 'Encrypted portal credentials', 'Compliance certificates'],
    processingLocation: 'London, United Kingdom (AWS eu-west-2)',
    transferMechanism: 'Domestic (UK-Based Processing)',
    productService: 'EntireFM CAFM Platform, Database, Document Vault',
    status: 'VERIFIED',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-resend',
    name: 'Resend Inc.',
    category: 'Communications & Email',
    purpose: 'Transactional service emails, work order notifications, client survey confirmations, and newsletter distribution',
    dataProcessed: ['Email addresses', 'Recipient names', 'Service dispatch references', 'Email interaction telemetry'],
    processingLocation: 'United Kingdom / European Union (EU Data Residency)',
    transferMechanism: 'UK Addendum to EU SCCs',
    productService: 'Helpdesk Notifications, Commercial Enquiries, FM Briefing',
    status: 'VERIFIED',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-google-analytics',
    name: 'Google LLC (Google Analytics 4)',
    category: 'Security & Telemetry',
    purpose: 'Zero-PII aggregated website analytics, user journey conversion analysis (conditional on cookie consent)',
    dataProcessed: ['Anonymized page paths', 'Device categories', 'Aggregated session metrics (no PII or form field data)'],
    processingLocation: 'European Union / United States',
    transferMechanism: 'UK Extension to EU-US Data Privacy Framework',
    productService: 'Public Website Analytics (Optional/Consent-Gated)',
    status: 'VERIFIED',
    effectiveDate: '2026-01-01',
  },
];

/**
 * Live Cookie & Local Storage Inventory
 * Audited from actual codebase implementation.
 */
export const COOKIE_INVENTORY: CookieInventoryItem[] = [
  {
    id: 'cookie-efm-session',
    name: 'efm_session',
    provider: 'EntireFM (First-party)',
    category: 'essential',
    purpose: 'Cryptographically signed HMAC authentication token identifying logged-in clients, contractors, field engineers, and administrators.',
    duration: 'Session / 24 Hours',
    type: 'First-party Cookie',
    isEssential: true,
    defaultStatus: 'Always Active',
    statutoryBasis: 'Strictly Necessary (PECR Reg 6(4))',
  },
  {
    id: 'cookie-efm-consent',
    name: 'efm_consent_prefs',
    provider: 'EntireFM (First-party)',
    category: 'essential',
    purpose: 'Stores your granular cookie and privacy preferences so the site respects your selection on repeat visits.',
    duration: '12 Months',
    type: 'First-party Cookie',
    isEssential: true,
    defaultStatus: 'Always Active',
    statutoryBasis: 'Strictly Necessary (PECR Reg 6(4))',
  },
  {
    id: 'storage-efm-journey',
    name: 'efm_journey_trail',
    provider: 'EntireFM (First-party)',
    category: 'functional',
    purpose: 'Maintains privacy-safe in-session browsing trail (capped at 15 anonymized URLs) to provide accurate quote context when you submit an enquiry.',
    duration: 'Session (cleared on browser close)',
    type: 'Session Storage',
    isEssential: false,
    defaultStatus: 'Always Active',
    statutoryBasis: 'Strictly Necessary (PECR Reg 6(4))',
  },
  {
    id: 'storage-efm-first-touch',
    name: 'efm_first_touch / efm_first_referrer',
    provider: 'EntireFM (First-party)',
    category: 'functional',
    purpose: 'Remembers the landing page and referral source for the active session to attribute commercial enquiry routing.',
    duration: 'Session (cleared on browser close)',
    type: 'Session Storage',
    isEssential: false,
    defaultStatus: 'Always Active',
    statutoryBasis: 'Strictly Necessary (PECR Reg 6(4))',
  },
  {
    id: 'cookie-ga4',
    name: '_ga, _ga_*',
    provider: 'Google Analytics 4',
    category: 'analytics',
    purpose: 'Measures website visitor interactions, popular FM guides, and aggregate conversion flows. NEVER loaded prior to explicit consent.',
    duration: '2 Years',
    type: 'Third-party Cookie',
    isEssential: false,
    defaultStatus: 'Blocked until consent',
    statutoryBasis: 'Consent (PECR Reg 6(2) / UK GDPR Art 6(1)(a))',
  },
];

/**
 * 7 Legal Category Groupings
 */
export const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: 'using-entirefm',
    slug: 'using-entirefm',
    title: 'Using EntireFM',
    description: 'Terms governing use of the EntireFM public website, digital tools, acceptable portal use, and digital accessibility commitments.',
    iconName: 'Globe',
    policySlugs: ['terms-of-use', 'acceptable-use', 'accessibility'],
  },
  {
    id: 'privacy-data',
    slug: 'privacy-data',
    title: 'Privacy & Data Protection',
    description: 'How EntireFM processes personal data, manages B2B contact intelligence, cookies, client data processing (Article 28 DPA), and data subject rights.',
    iconName: 'ShieldCheck',
    policySlugs: [
      'privacy',
      'cookies',
      'data-protection',
      'data-protection-complaints',
      'data-processing',
      'subprocessors',
      'security',
    ],
  },
  {
    id: 'ai-technology',
    slug: 'ai-technology',
    title: 'Artificial Intelligence & Technology',
    description: 'Governance of AI-assisted CAFM workflows, predictive maintenance models, human-in-the-loop oversight, and automated processing disclosures.',
    iconName: 'Cpu',
    policySlugs: ['ai', 'disclosures'],
  },
  {
    id: 'clients',
    slug: 'clients',
    title: 'Clients & Commercial Terms',
    description: 'Commercial facilities management service terms, SLAs, billing schedules, quote agreements, and formal complaints procedures.',
    iconName: 'Building2',
    policySlugs: ['terms-of-business', 'complaints'],
  },
  {
    id: 'contractors-suppliers',
    slug: 'contractors-suppliers',
    title: 'Contractors & Supply Chain',
    description: 'Framework agreements, work order execution terms, trade contractor compliance standards, and ethical supplier codes of practice.',
    iconName: 'Truck',
    policySlugs: ['contractor-terms', 'work-order-terms', 'contractor-code', 'supplier-code'],
  },
  {
    id: 'governance-ethics',
    slug: 'governance-ethics',
    title: 'Governance, Ethics & Conduct',
    description: 'Corporate ethics, Modern Slavery transparency, anti-bribery standards, public interest whistleblowing, and equality commitments.',
    iconName: 'Scale',
    policySlugs: ['modern-slavery', 'anti-bribery', 'whistleblowing', 'equality'],
  },
  {
    id: 'safety-sustainability',
    slug: 'safety-sustainability',
    title: 'Safety & Sustainability',
    description: 'Statutory health and safety management (HASAWA 1974 / CDM 2015), environmental stewardship, carbon reduction, and waste compliance.',
    iconName: 'Leaf',
    policySlugs: ['health-safety', 'environment'],
  },
];

/**
 * Helper to get clean public display value for legal config
 */
export function getLegalDisplayValue(
  value: string | VerificationToken | undefined | null,
  fallback = 'Available upon request to contracted counterparties'
): string {
  if (!value || value === TODO_VERIFY) {
    return fallback;
  }
  return value;
}

/**
 * Check if a legal field is verified
 */
export function isLegalFieldVerified(value: string | VerificationToken | undefined | null): boolean {
  return typeof value === 'string' && value !== TODO_VERIFY && value.trim().length > 0;
}
