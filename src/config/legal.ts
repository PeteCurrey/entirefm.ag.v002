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
 * - Public components MUST NOT render unverified claims or misleading fallbacks.
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

export type SubprocessorVerificationStatus =
  | 'DETECTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED_ACTIVE'
  | 'INACTIVE'
  | 'REMOVED';

export interface SubprocessorEntry {
  id: string;
  name: string;
  contractualEntity: string;
  role: 'PROCESSOR' | 'SUBPROCESSOR' | 'CONTROLLER';
  category: 'Infrastructure & Cloud' | 'Database & Storage' | 'Communications & Email' | 'Security & Telemetry' | 'Accounting & ERP';
  purpose: string;
  dataProcessed: string[];
  primaryHostingRegion: string;
  internationalTransferAssessment: string;
  transferSafeguard: string;
  dpaInPlace: boolean;
  productService: string;
  status: SubprocessorVerificationStatus;
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
    postalAddress: 'Data Protection Officer, EntireFM (Alkota Group Limited), United Kingdom',
    phone: '020 4617 0228',
  },
  complianceOfficer: {
    title: 'Head of Quality, Health, Safety & Compliance',
    name: TODO_VERIFY,
    email: 'compliance@entirefm.com',
  },
  insurances: {
    employersLiability: TODO_VERIFY,
    publicLiability: TODO_VERIFY,
    professionalIndemnity: TODO_VERIFY,
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
 * Complete Subprocessor Register
 * Separates DETECTED technologies from VERIFIED_ACTIVE production processors.
 */
export const SUBPROCESSOR_REGISTER: SubprocessorEntry[] = [
  {
    id: 'subproc-vercel',
    name: 'Vercel Inc.',
    contractualEntity: 'Vercel Inc. (Delaware, USA)',
    role: 'PROCESSOR',
    category: 'Infrastructure & Cloud',
    purpose: 'Edge website hosting, static asset delivery, and serverless edge compute infrastructure.',
    dataProcessed: ['IP addresses', 'HTTP request headers', 'Edge server logs', 'Attribution query parameters'],
    primaryHostingRegion: 'UK / EU / Global Edge POPs',
    internationalTransferAssessment: 'Edge processing routes through nearest European/UK point of presence; configuration logging subject to US edge parent entity.',
    transferSafeguard: 'UK Addendum to EU Standard Contractual Clauses (SCCs) & Data Processing Addendum',
    dpaInPlace: true,
    productService: 'Public Website & Client Portal Edge Hosting',
    status: 'VERIFIED_ACTIVE',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-supabase',
    name: 'Supabase Inc. / AWS London (eu-west-2)',
    contractualEntity: 'Supabase Inc. (Delaware, USA) utilising AWS Infrastructure',
    role: 'PROCESSOR',
    category: 'Database & Storage',
    purpose: 'Relational database persistence, CAFM asset records, work order dispatch, and encrypted document vault.',
    dataProcessed: ['Client account profiles', 'Contractor compliance records', 'Property asset details', 'Work order history', 'Encrypted portal credentials', 'Compliance certificates'],
    primaryHostingRegion: 'London, United Kingdom (AWS eu-west-2)',
    internationalTransferAssessment: 'Primary database cluster hosted in AWS London (eu-west-2). Provider support and operational management subject to US parent entity access controls.',
    transferSafeguard: 'UK Addendum to EU SCCs & Supabase Enterprise Data Processing Agreement',
    dpaInPlace: true,
    productService: 'EntireFM CAFM Platform, Database, Document Vault',
    status: 'VERIFIED_ACTIVE',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-resend',
    name: 'Resend Inc.',
    contractualEntity: 'Resend Inc. (Delaware, USA)',
    role: 'PROCESSOR',
    category: 'Communications & Email',
    purpose: 'Transactional service emails, work order notifications, client survey confirmations, and newsletter distribution.',
    dataProcessed: ['Email addresses', 'Recipient names', 'Service dispatch references', 'Email interaction telemetry'],
    primaryHostingRegion: 'EU (Frankfurt / Ireland)',
    internationalTransferAssessment: 'Transactional mail relays hosted in EU data residency region; administrative controls governed under US entity DPA.',
    transferSafeguard: 'UK Addendum to EU SCCs & Data Processing Agreement',
    dpaInPlace: true,
    productService: 'Helpdesk Notifications, Commercial Enquiries, FM Briefing',
    status: 'VERIFIED_ACTIVE',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-google-analytics',
    name: 'Google LLC (Google Analytics 4)',
    contractualEntity: 'Google Ireland Limited / Google LLC',
    role: 'PROCESSOR',
    category: 'Security & Telemetry',
    purpose: 'Aggregated website traffic analysis and user journey telemetry (strictly conditional upon explicit user cookie consent).',
    dataProcessed: ['Anonymized page paths', 'Device categories', 'Aggregated session metrics (no PII or form field data)'],
    primaryHostingRegion: 'European Union / United States',
    internationalTransferAssessment: 'Data transfer relies on the UK Extension to the EU-US Data Privacy Framework and Google Data Processing Terms.',
    transferSafeguard: 'UK Extension to EU-US Data Privacy Framework / Standard Contractual Clauses',
    dpaInPlace: true,
    productService: 'Public Website Analytics (Optional / Consent-Gated)',
    status: 'VERIFIED_ACTIVE',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'subproc-openai-detected',
    name: 'OpenAI, L.L.C.',
    contractualEntity: 'OpenAI, L.L.C. (California, USA)',
    role: 'PROCESSOR',
    category: 'Infrastructure & Cloud',
    purpose: 'Potential generative triage and summarisation experimentation.',
    dataProcessed: ['Anonymized service request descriptions'],
    primaryHostingRegion: 'United States',
    internationalTransferAssessment: 'Under review; not active in live production data path without enterprise DPA.',
    transferSafeguard: 'Under Review',
    dpaInPlace: false,
    productService: 'Internal R&D / Experimental Copilot',
    status: 'DETECTED',
    effectiveDate: '2026-08-24',
  },
];

/**
 * Filtered public register: only VERIFIED_ACTIVE entries appear publicly
 */
export const PUBLIC_SUBPROCESSOR_REGISTER = SUBPROCESSOR_REGISTER.filter(
  (s) => s.status === 'VERIFIED_ACTIVE'
);

/**
 * Live Cookie & Local Storage Inventory
 */
export const COOKIE_INVENTORY: CookieInventoryItem[] = [
  {
    id: 'cookie-efm-session',
    name: 'efm_session',
    provider: 'EntireFM (First-party)',
    category: 'essential',
    purpose: 'Cryptographically signed session cookie identifying authenticated clients, contractors, and staff.',
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
    purpose: 'Stores your granular cookie preferences so the site respects your choices on return visits.',
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
    purpose: 'Maintains privacy-safe in-session browsing trail (capped at 15 anonymized URLs) for service context.',
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
    purpose: 'Measures website visitor interactions and aggregate conversion flows. NEVER loaded prior to explicit consent.',
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
      'data-rights',
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
    description: 'Commercial facilities management service terms, billing schedules, quote agreements, and formal complaints procedures.',
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
  {
    id: 'community',
    slug: 'community',
    title: 'The Lobby Community',
    description: 'Participation standards, moderation principles and acceptable use rules governing EntireFM\'s professional FM intelligence community.',
    iconName: 'Users',
    policySlugs: ['community-guidelines', 'acceptable-use'],
  },
];

/**
 * Helper to get clean public display value for legal config.
 * If unverified, returns null so public components can omit the field entirely.
 */
export function getLegalDisplayValue(
  value: string | VerificationToken | undefined | null
): string | null {
  if (!value || value === TODO_VERIFY) {
    return null;
  }
  return value;
}

/**
 * Check if a legal field is verified
 */
export function isLegalFieldVerified(value: string | VerificationToken | undefined | null): boolean {
  return typeof value === 'string' && value !== TODO_VERIFY && value.trim().length > 0;
}
