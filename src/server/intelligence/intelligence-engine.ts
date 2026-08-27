/**
 * ENTIREFM CP-09 — INTELLIGENCE ENGINE
 * ======================================
 * Provenance-aware, jurisdiction-aware, personalised intelligence layer.
 *
 * STRICT PRODUCT BOUNDARY:
 * - Regulatory, compliance, safety, technical, CPD intelligence → Contractor Intelligence Centre
 * - External procurement (Contracts Finder, Find a Tender) → Admin Tender Radar ONLY
 *   Contractors CANNOT access tender data through any API or UI surface.
 *
 * Architecture: SOURCE → NORMALISE → CORRELATE → PERSONALISE → GOVERN → ACT → AUDIT
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';
import type { TradeScope } from '@/server/contractor/competency-framework';
import { sourceRegistry } from './source-registry';
import type { UKJurisdiction, FMTradeCategory, AuthorityTier, LegalStatus } from './types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type IntelligenceSeverity =
  | 'INFORMATION'
  | 'TECHNICAL_UPDATE'
  | 'ADVISORY'
  | 'ACTION_MAY_BE_REQUIRED'
  | 'ACTION_REQUIRED'
  | 'CRITICAL';

export type IntelligenceEventType =
  | 'REGULATORY_CHANGE'
  | 'CONSULTATION'
  | 'LEGISLATION_PUBLISHED'
  | 'LEGISLATION_AMENDED'
  | 'HSE_ENFORCEMENT'
  | 'PRODUCT_SAFETY_RECALL'
  | 'TRADE_BODY_GUIDANCE'
  | 'STANDARDS_UPDATE'
  | 'CPD_EVENT'
  | 'PROSECUTION'
  | 'COMPANY_STATUS_CHANGE';

export type IntelligenceAudienceRole = 'CONTRACTOR_ADMIN' | 'OPERATIVE' | 'ENTIREFM_STAFF' | 'ALL_CONTRACTOR_USERS';

export type ReviewStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'AUTO_PUBLISHED' | 'REQUIRES_COMPLIANCE_REVIEW';

export type ActionType =
  | 'MARK_REVIEWED'
  | 'ASSIGN'
  | 'NOT_APPLICABLE'
  | 'UPLOAD_EVIDENCE'
  | 'LINK_REQUIREMENT'
  | 'ADD_NOTE'
  | 'REQUEST_CLARIFICATION'
  | 'ACKNOWLEDGE';

export type CompanyWatchEventType =
  | 'STATUS_CHANGED'
  | 'ACCOUNTS_OVERDUE'
  | 'CONFIRMATION_STATEMENT_OVERDUE'
  | 'REGISTERED_OFFICE_CHANGED'
  | 'INSOLVENCY_CHANGED'
  | 'OFFICER_CHANGED'
  | 'SIGNIFICANT_FILING';

export type CredentialVerificationMethod = 'MANUAL_OFFICIAL_VERIFICATION' | 'API_AUTOMATED' | 'DOCUMENT_UPLOAD';

// Closed registers — never automated, always manual official verification
export const CLOSED_REGISTER_CREDENTIALS = [
  'GAS_SAFE',
  'NICEIC',
  'NAPIT',
  'REFCOM',
  'UKAS',
  'SIA_APPROVED_CONTRACTOR',
] as const;

export type ClosedRegisterCredential = (typeof CLOSED_REGISTER_CREDENTIALS)[number];

// Admin Tender Pipeline Stages — EntireFM internal only
export type TenderBidStage =
  | 'NEW'
  | 'REVIEWING'
  | 'BID_DECISION'
  | 'BID_PLANNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'WON'
  | 'LOST'
  | 'EXPIRED';

// EntireFM core service taxonomy for tender matching
export const ENTIREFM_CORE_SERVICES: { id: string; label: string; tradeTags: FMTradeCategory[]; cpvPrefixes: string[] }[] = [
  { id: 'electrical-me', label: 'Electrical & M&E', tradeTags: ['electrical', 'mechanical'], cpvPrefixes: ['50710', '50711', '45310', '45315'] },
  { id: 'hvac', label: 'HVAC & Building Services', tradeTags: ['hvac', 'mechanical'], cpvPrefixes: ['50720', '50730', '45331'] },
  { id: 'bms-controls', label: 'BMS & Controls', tradeTags: ['cafm-technology'], cpvPrefixes: ['72260'] },
  { id: 'plumbing-gas', label: 'Plumbing & Gas', tradeTags: ['water-hygiene', 'mechanical'], cpvPrefixes: ['50712'] },
  { id: 'water-hygiene', label: 'Water Hygiene', tradeTags: ['water-hygiene'], cpvPrefixes: ['90733'] },
  { id: 'fire', label: 'Fire & Emergency Systems', tradeTags: ['fire-safety', 'building-safety'], cpvPrefixes: ['45343', '50413'] },
  { id: 'fabric', label: 'Fabric & Structure', tradeTags: ['building-safety'], cpvPrefixes: ['45000'] },
  { id: 'cleaning', label: 'Industrial Cleaning & Soft FM', tradeTags: ['cleaning-soft-fm'], cpvPrefixes: ['90910', '90911'] },
  { id: 'security', label: 'Security', tradeTags: ['security'], cpvPrefixes: ['79710'] },
  { id: 'grounds', label: 'Grounds Maintenance', tradeTags: ['cleaning-soft-fm'], cpvPrefixes: ['77314'] },
  { id: 'ifm', label: 'Integrated Facilities Management', tradeTags: ['procurement-contracts'], cpvPrefixes: ['79993'] },
  { id: 'planned', label: 'Planned Maintenance', tradeTags: ['mechanical', 'electrical'], cpvPrefixes: ['50700'] },
  { id: 'reactive', label: 'Reactive Maintenance', tradeTags: ['mechanical', 'electrical'], cpvPrefixes: ['50700'] },
  { id: 'lifts', label: 'Lifts & Conveyances', tradeTags: ['lifts-access'], cpvPrefixes: ['50750', '42416'] },
];

// ─────────────────────────────────────────────────────────────
// CANONICAL INTELLIGENCE ITEM (Contractor-facing)
// ─────────────────────────────────────────────────────────────

export interface NormalisedIntelligenceItem {
  id: string;
  externalId: string;               // Canonical source ID for deduplication
  contentHash: string;              // SHA-256 of normalised content
  version: number;                  // Increments on material source change

  title: string;
  entirefmSummary: string;          // EntireFM-authored plain-English summary (NOT AI-generated legal advice)
  whatChanged?: string;             // Semantic diff from previous version
  suggestedContractorAction?: string; // Proposed contractor action — NOT a legal obligation until reviewed & approved
  whyYoureSeeing: string[];         // Personalisation explanation list

  sourceId: string;
  sourceName: string;
  canonicalUrl: string;
  authorityTier: AuthorityTier;
  legalStatus: LegalStatus;
  eventType: IntelligenceEventType;
  severity: IntelligenceSeverity;

  jurisdictions: UKJurisdiction[];
  tradeTags: FMTradeCategory[];
  credentialTags: string[];         // e.g. ['GAS_SAFE', 'BS7671']
  workTypeTags: string[];

  publishedAt: string;
  updatedAt?: string;
  effectiveFrom?: string;
  deadlineDate?: string;
  supersedes?: string;              // ID of item this replaces

  rightsLicence: string;            // e.g. 'OGL v3.0', 'Trade Body Summary Permitted', 'Full Text Not Reproduced'
  parserVersion: string;
  fetchedAt: string;
  rawSourceHash?: string;

  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;

  linkedComplianceRequirementIds: string[]; // CP-03 requirement IDs
  audienceRoles: IntelligenceAudienceRole[];

  // Secondary sources — corroborating the same underlying event
  secondarySources: {
    sourceName: string;
    authorityTier: AuthorityTier;
    url: string;
    title: string;
    snippet?: string;
  }[];
}

// ─────────────────────────────────────────────────────────────
// CONTRACTOR PERSONALISED INTELLIGENCE
// ─────────────────────────────────────────────────────────────

export interface ContractorIntelligenceFeed {
  contractorOrgId: string;
  contractorName: string;
  tradeProfile: TradeScope[];
  jurisdictions: UKJurisdiction[];
  generatedAt: string;

  forYou: PersonalisedItem[];
  complianceWatch: PersonalisedItem[];
  tradeUpdates: PersonalisedItem[];
  safetyAlerts: PersonalisedItem[];
  technicalStandards: PersonalisedItem[];
  cpdEvents: PersonalisedItem[];
  reviewed: PersonalisedItem[];

  pendingActionCount: number;
  unacknowledgedCriticalCount: number;
}

export interface PersonalisedItem {
  item: NormalisedIntelligenceItem;
  applicabilityScore: number;     // 0–100 deterministic, NOT AI-assigned severity
  matchedTrades: TradeScope[];
  matchedJurisdictions: UKJurisdiction[];
  matchedCredentials: string[];
  whyYoureSeeing: string[];
  actionStatus?: ContractorActionRecord;
  acknowledgement?: AcknowledgementRecord;
  isAcknowledged: boolean;
  isActioned: boolean;
}

// ─────────────────────────────────────────────────────────────
// COMPANY WATCH
// ─────────────────────────────────────────────────────────────

export interface CompanyWatchRecord {
  contractorOrgId: string;
  companyNumber: string;
  companyName: string;
  companyStatus: 'ACTIVE' | 'DISSOLVED' | 'LIQUIDATION' | 'CONVERTED_CLOSED' | 'INSOLVENCY' | 'UNVERIFIED';
  lastCheckedAt: string;
  incorporationDate?: string;
  registeredOfficeAddress?: string;
  sic?: string[];

  accounts: {
    nextDueDate?: string;
    lastMadeUpTo?: string;
    overdue: boolean;
    accountType?: string;
  };
  confirmationStatement: {
    nextDueDate?: string;
    lastMadeUpTo?: string;
    overdue: boolean;
  };
  officers?: {
    name: string;
    role: string;
    appointedOn?: string;
    resignedOn?: string;
  }[];
  insolvency?: {
    caseType: string;
    dates: string[];
    status: string;
  };

  apiAvailable: boolean;                  // false = Companies House API not configured
  degraded: boolean;                      // true = API call failed, serving stale data
  lastSuccessfulFetchAt?: string;
  events: CompanyWatchEvent[];
}

export interface CompanyWatchEvent {
  id: string;
  contractorOrgId: string;
  eventType: CompanyWatchEventType;
  description: string;
  detectedAt: string;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  requiresAdminReview: boolean;
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL WATCH
// ─────────────────────────────────────────────────────────────

export interface CredentialWatchSummary {
  contractorOrgId: string;
  generatedAt: string;
  organisationCredentials: OrgCredentialWatch[];
  operativeCredentials: OperativeCredentialWatch[];
  expiringWithin90DaysCount: number;
  overdueVerificationCount: number;
}

export interface OrgCredentialWatch {
  credentialType: ClosedRegisterCredential | string;
  registrationNumber?: string;
  issuingBody: string;
  verificationMethod: CredentialVerificationMethod;
  scope?: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  status: 'VERIFIED' | 'VERIFICATION_DUE' | 'EXPIRING' | 'EXPIRED' | 'NOT_CONFIGURED';
  lastVerifiedAt?: string;
  verifiedBy?: string;
  officialRegisterUrl?: string;        // Link for manual verification
  verificationNotes?: string;
  nextReviewDate?: string;
  isClosedRegister: boolean;           // true = manual official verification only
}

export interface OperativeCredentialWatch {
  operativeId: string;
  operativeName: string;
  credentials: OrgCredentialWatch[];
}

// ─────────────────────────────────────────────────────────────
// ACTIONS & ACKNOWLEDGEMENTS
// ─────────────────────────────────────────────────────────────

export interface ContractorActionRecord {
  id: string;
  contractorOrgId: string;
  intelligenceItemId: string;
  intelligenceItemVersion: number;
  actionType: ActionType;
  assignedTo?: string;
  dueDate?: string;
  internalNote?: string;
  evidenceDocumentId?: string;
  linkedRequirementId?: string;
  notApplicableReason?: string;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
  isResolved: boolean;
}

export interface AcknowledgementRecord {
  id: string;
  contractorOrgId: string;
  userId: string;
  intelligenceItemId: string;
  intelligenceItemVersion: number;    // Version-specific — invalidated if source changes materially
  acknowledgedAt: string;
  isInvalidated: boolean;             // true if underlying item changed materially after acknowledgement
  invalidatedAt?: string;
  invalidatedReason?: string;
}

// ─────────────────────────────────────────────────────────────
// ADMIN TENDER RADAR — EntireFM Internal Only
// ─────────────────────────────────────────────────────────────

export interface TenderOpportunity {
  id: string;
  ocid: string;                       // OCDS canonical Open Contracting ID
  source: 'Contracts Finder' | 'Find a Tender' | 'Crown Commercial Service';
  noticeType: 'planning' | 'tender' | 'award' | 'contract';
  title: string;
  description: string;
  buyerName: string;
  buyerRegion: string;
  cpvCodes: string[];
  isFramework: boolean;
  isSmeAppropriate?: boolean;
  publishedAt: string;
  closingDate?: string;
  contractStartDate?: string;
  contractDurationMonths?: number;
  estimatedValueGbp?: number;
  estimatedValueFormatted?: string;
  canonicalUrl: string;
  status: 'ACTIVE' | 'CLOSING_SOON' | 'AWARDED' | 'CANCELLED' | 'EXPIRED';
  awardedToSupplier?: string;
  rawPayload?: Record<string, unknown>;
  contentHash: string;
  fetchedAt: string;
  lastSeenAt: string;
}

// EntireFM internal Tender Radar record — strictly admin-only
export interface EntireFMTenderRecord {
  id: string;
  opportunity: TenderOpportunity;
  matchScore: number;                 // 0–100 deterministic relevance
  matchedServices: string[];          // EntireFM service IDs
  matchStrength: 'STRONG' | 'MODERATE' | 'WEAK' | 'NOT_MATCHED';
  matchReasons: string[];
  cpvMatches: string[];

  bidStage: TenderBidStage;
  assignedTo?: string;                // EntireFM internal user (never visible to contractors)
  internalNotes: InternalTenderNote[];
  savedAt?: string;
  bidDecisionAt?: string;
  bidDecisionBy?: string;
  bidSubmittedAt?: string;
  outcome?: 'WON' | 'LOST' | 'WITHDRAWN';
  deadlineUrgency: 'IMMINENT' | 'SOON' | 'NORMAL' | 'EXPIRED';
  firstSeenAt: string;
  updatedAt: string;
}

export interface InternalTenderNote {
  id: string;
  tenderId: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// IN-MEMORY SEED STORE (Supabase fallback pattern from CP-03–08)
// ─────────────────────────────────────────────────────────────

export const SEED_INTELLIGENCE_ITEMS: NormalisedIntelligenceItem[] = [
  {
    id: 'intel-001',
    externalId: 'legislation-uk-2024-si-567',
    contentHash: 'abc123def456',
    version: 1,
    title: 'F-Gas Regulation 2024/573 — Phase-Down Schedule Revised',
    entirefmSummary:
      'The revised F-Gas Regulation accelerates the phase-down of high-GWP refrigerants including R410A across Great Britain. The allocations for virgin refrigerant supply have been significantly reduced. Companies holding F-Gas company certification should review their refrigerant management plans and leak-testing schedules.',
    whatChanged: 'Phase-down quotas reduced by 18% for 2025 allocations compared to the 2023 baseline. Northern Ireland remains subject to separate EU regulatory provisions.',
    suggestedContractorAction:
      'Review your refrigerant stock, update your leak-testing PPM schedules, and confirm current F-Gas company certification scope with REFCOM. Note: this is a suggested review — not a legal obligation issued by EntireFM.',
    whyYoureSeeing: [
      'Your organisation is approved for HVAC and refrigeration work.',
      'Your F-Gas company certification is recorded in your compliance profile.',
    ],
    sourceId: 'src-legislation-uk',
    sourceName: 'legislation.gov.uk',
    canonicalUrl: 'https://www.legislation.gov.uk/uksi/2024/567',
    authorityTier: 1,
    legalStatus: 'REGULATION',
    eventType: 'REGULATORY_CHANGE',
    severity: 'ACTION_MAY_BE_REQUIRED',
    jurisdictions: ['Great Britain', 'England', 'Wales', 'Scotland'],
    tradeTags: ['hvac'],
    credentialTags: ['REFCOM', 'FGAS_COMPANY_CERT'],
    workTypeTags: ['refrigeration', 'hvac-maintenance', 'f-gas'],
    publishedAt: '2024-08-15T09:00:00Z',
    effectiveFrom: '2025-01-01',
    rightsLicence: 'OGL v3.0',
    parserVersion: '1.0.0',
    fetchedAt: new Date().toISOString(),
    reviewStatus: 'PENDING_REVIEW',
    linkedComplianceRequirementIds: [],
    audienceRoles: ['CONTRACTOR_ADMIN'],
    secondarySources: [
      {
        sourceName: 'BESA',
        authorityTier: 2,
        url: 'https://www.thebesa.com/news/f-gas-2024',
        title: 'BESA: What the revised F-Gas regulation means for members',
        snippet: 'BESA trade interpretation of the phase-down schedule — this is trade commentary, not statutory guidance.',
      },
    ],
  },
  {
    id: 'intel-002',
    externalId: 'govuk-content-building-safety-2024',
    contentHash: 'def456ghi789',
    version: 2,
    title: 'Building Safety Act 2022 — Mandatory Occurrence Reporting Requirements',
    entirefmSummary:
      'The Building Safety Regulator has confirmed that duty holders for higher-risk buildings must log specified structural and fire-barrier events digitally within 48 hours. This applies to contractors undertaking work on higher-risk buildings.',
    whatChanged: 'Clarification issued on which M&E contractor activities trigger mandatory occurrence reporting when affecting passive fire protection or structural elements.',
    suggestedContractorAction: 'If you carry out work on buildings defined as higher-risk (18m+ or 7+ storeys), ensure your engineers are briefed on mandatory occurrence logging requirements.',
    whyYoureSeeing: [],
    sourceId: 'src-govuk-content',
    sourceName: 'GOV.UK',
    canonicalUrl: 'https://www.gov.uk/guidance/the-building-safety-act',
    authorityTier: 1,
    legalStatus: 'ACOP_GUIDANCE',
    eventType: 'REGULATORY_CHANGE',
    severity: 'ACTION_MAY_BE_REQUIRED',
    jurisdictions: ['England'],
    tradeTags: ['building-safety', 'fire-safety', 'electrical', 'hvac', 'mechanical'],
    credentialTags: [],
    workTypeTags: ['higher-risk-buildings', 'passive-fire', 'structural'],
    publishedAt: '2024-09-01T10:00:00Z',
    effectiveFrom: '2024-10-01',
    rightsLicence: 'OGL v3.0',
    parserVersion: '1.0.0',
    fetchedAt: new Date().toISOString(),
    reviewStatus: 'APPROVED',
    reviewedBy: 'EntireFM Compliance',
    reviewedAt: '2024-09-05T14:00:00Z',
    linkedComplianceRequirementIds: ['req-hs-policy'],
    audienceRoles: ['CONTRACTOR_ADMIN', 'OPERATIVE'],
    secondarySources: [],
  },
  {
    id: 'intel-003',
    externalId: 'hse-prosecution-2024-001',
    contentHash: 'ghi789jkl012',
    version: 1,
    title: 'HSE: Electrical Contractor Fined £180,000 Following Fatal Shock Incident',
    entirefmSummary:
      'HSE has published details of a successful prosecution following a fatal electric shock during maintenance on an industrial distribution board. The contractor had not issued a permit to work and the supply was not isolated.',
    suggestedContractorAction: 'Review your isolation and permit-to-work procedures for high-voltage and LV distribution work.',
    whyYoureSeeing: [],
    sourceId: 'src-hse-public',
    sourceName: 'Health and Safety Executive',
    canonicalUrl: 'https://press.hse.gov.uk/2024/prosecution-example',
    authorityTier: 1,
    legalStatus: 'NEWS',
    eventType: 'PROSECUTION',
    severity: 'ADVISORY',
    jurisdictions: ['Great Britain'],
    tradeTags: ['electrical'],
    credentialTags: ['ECS_CARD', 'BS7671_18TH'],
    workTypeTags: ['lv-distribution', 'isolation', 'permit-to-work'],
    publishedAt: '2024-07-15T08:00:00Z',
    rightsLicence: 'OGL v3.0',
    parserVersion: '1.0.0',
    fetchedAt: new Date().toISOString(),
    reviewStatus: 'AUTO_PUBLISHED',
    linkedComplianceRequirementIds: [],
    audienceRoles: ['CONTRACTOR_ADMIN', 'OPERATIVE'],
    secondarySources: [
      {
        sourceName: 'ECA',
        authorityTier: 2,
        url: 'https://www.eca.co.uk/news',
        title: 'ECA industry comment on isolation procedures',
        snippet: 'Trade body commentary — not primary statutory source.',
      },
    ],
  },
  {
    id: 'intel-004',
    externalId: 'eca-bs7671-amendment3',
    contentHash: 'jkl012mno345',
    version: 1,
    title: 'ECA: BS 7671 Amendment 3 Update — Thermal Imaging Requirements',
    entirefmSummary:
      'Amendment 3 to the 18th Edition IET Wiring Regulations now formally references thermographic surveys as a recommended additional investigation for high-load distribution boards. Major property insurers have begun requiring annual thermal imaging alongside 5-yearly EICR testing.',
    suggestedContractorAction: 'Update client-facing EICR scoping documentation to include thermal imaging options for high-density switchrooms.',
    whyYoureSeeing: [],
    sourceId: 'src-eca-electrical',
    sourceName: 'ECA',
    canonicalUrl: 'https://www.eca.co.uk/news/bs7671-amendment3',
    authorityTier: 2,
    legalStatus: 'INDUSTRY_GUIDANCE',
    eventType: 'STANDARDS_UPDATE',
    severity: 'TECHNICAL_UPDATE',
    jurisdictions: ['United Kingdom'],
    tradeTags: ['electrical'],
    credentialTags: ['BS7671_18TH', 'CG_2391_INSPECTION'],
    workTypeTags: ['eicr', 'thermal-imaging', 'distribution-board'],
    publishedAt: '2024-08-01T10:00:00Z',
    rightsLicence: 'Trade Body Summary — Summary Only, Link to Source',
    parserVersion: '1.0.0',
    fetchedAt: new Date().toISOString(),
    reviewStatus: 'AUTO_PUBLISHED',
    linkedComplianceRequirementIds: [],
    audienceRoles: ['CONTRACTOR_ADMIN', 'OPERATIVE'],
    secondarySources: [],
  },
  {
    id: 'intel-005',
    externalId: 'sia-licence-renewal-guidance-2024',
    contentHash: 'mno345pqr678',
    version: 1,
    title: 'SIA: Updated Licence Renewal Guidance — Application Timing Requirements',
    entirefmSummary:
      'The Security Industry Authority has updated guidance on licence renewal timing. Applications must be submitted at least 60 days before expiry to ensure continuity, with new biometric check requirements for first-time renewals.',
    suggestedContractorAction: 'Review SIA licence expiry dates for all operatives holding door supervisor or security guard licences. Initiate renewals at least 60 days ahead.',
    whyYoureSeeing: [],
    sourceId: 'src-govuk-search',
    sourceName: 'GOV.UK / SIA',
    canonicalUrl: 'https://www.gov.uk/guidance/sia-licensing',
    authorityTier: 1,
    legalStatus: 'INDUSTRY_GUIDANCE',
    eventType: 'TRADE_BODY_GUIDANCE',
    severity: 'ADVISORY',
    jurisdictions: ['United Kingdom'],
    tradeTags: ['security'],
    credentialTags: ['SIA_DOOR_SUPERVISOR', 'SIA_SECURITY_GUARD'],
    workTypeTags: ['security', 'manned-guarding'],
    publishedAt: '2024-07-01T09:00:00Z',
    rightsLicence: 'OGL v3.0',
    parserVersion: '1.0.0',
    fetchedAt: new Date().toISOString(),
    reviewStatus: 'AUTO_PUBLISHED',
    linkedComplianceRequirementIds: [],
    audienceRoles: ['CONTRACTOR_ADMIN'],
    secondarySources: [],
  },
];

// In-memory stores
const intelligenceStore: Map<string, NormalisedIntelligenceItem> = new Map(
  SEED_INTELLIGENCE_ITEMS.map((i) => [i.id, i])
);
const actionStore: Map<string, ContractorActionRecord> = new Map();
const acknowledgementStore: Map<string, AcknowledgementRecord> = new Map();
const companyWatchCache: Map<string, CompanyWatchRecord> = new Map();
const tenderStore: Map<string, EntireFMTenderRecord> = new Map();

// ─────────────────────────────────────────────────────────────
// TRADE / JURISDICTION MAPPING — TradeScope → FMTradeCategory
// ─────────────────────────────────────────────────────────────

const TRADE_SCOPE_TO_FM_CATEGORY: Partial<Record<TradeScope, FMTradeCategory[]>> = {
  ELECTRICAL: ['electrical'],
  GAS_AND_HEATING: ['mechanical'],
  HVAC_AND_REFRIGERATION: ['hvac', 'mechanical'],
  PLUMBING_AND_DRAINAGE: ['water-hygiene', 'mechanical'],
  WATER_HYGIENE: ['water-hygiene'],
  FIRE_AND_LIFE_SAFETY: ['fire-safety', 'building-safety'],
  BUILDING_FABRIC: ['building-safety'],
  ROPE_ACCESS: ['building-safety'],
  SECURITY_AND_ACCESS: ['security'],
  CLEANING_AND_SOFT_FM: ['cleaning-soft-fm'],
  GROUNDS_AND_LANDSCAPING: ['cleaning-soft-fm'],
  ROOFING: ['building-safety'],
  GENERAL_MAINTENANCE: ['mechanical', 'building-safety'],
};

// ─────────────────────────────────────────────────────────────
// JURISDICTION HELPERS
// ─────────────────────────────────────────────────────────────

/** Validates overlap between contractor's jurisdictions and item's jurisdictions.
 *  Critically separates GB from NI — does NOT conflate them. */
function jurisdictionsOverlap(contractorJurisdictions: UKJurisdiction[], itemJurisdictions: UKJurisdiction[]): boolean {
  for (const cj of contractorJurisdictions) {
    for (const ij of itemJurisdictions) {
      if (cj === ij) return true;
      // UK jurisdiction is the superset
      if (ij === 'United Kingdom') return true;
      // Great Britain includes England, Wales, Scotland — but NOT Northern Ireland
      if (ij === 'Great Britain' && (cj === 'England' || cj === 'Wales' || cj === 'Scotland' || cj === 'Great Britain')) return true;
      if (cj === 'Great Britain' && (ij === 'England' || ij === 'Wales' || ij === 'Scotland')) return true;
    }
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// PERSONALISATION ENGINE
// ─────────────────────────────────────────────────────────────

function buildContractorFmCategories(trades: TradeScope[]): FMTradeCategory[] {
  const categories = new Set<FMTradeCategory>();
  for (const t of trades) {
    const cats = TRADE_SCOPE_TO_FM_CATEGORY[t] ?? [];
    cats.forEach((c) => categories.add(c));
  }
  return Array.from(categories);
}

function scorePersonalisedItem(
  item: NormalisedIntelligenceItem,
  contractorFmCategories: FMTradeCategory[],
  contractorJurisdictions: UKJurisdiction[],
  contractorCredentials: string[]
): { score: number; matchedTrades: FMTradeCategory[]; matchedJurisdictions: UKJurisdiction[]; matchedCredentials: string[]; whyYoureSeeing: string[] } {
  let score = 0;
  const matchedTrades: FMTradeCategory[] = [];
  const matchedJurisdictions: UKJurisdiction[] = [];
  const matchedCredentials: string[] = [];
  const whyYoureSeeing: string[] = [];

  // Trade match — most important signal
  for (const tag of item.tradeTags) {
    if (contractorFmCategories.includes(tag)) {
      if (!matchedTrades.includes(tag)) matchedTrades.push(tag);
      score += 40;
    }
  }

  // Jurisdiction match — critical separation (GB ≠ NI)
  const jurisdictionMatch = jurisdictionsOverlap(contractorJurisdictions, item.jurisdictions);
  if (jurisdictionMatch) {
    score += 25;
    const overlapping = item.jurisdictions.filter((ij) =>
      jurisdictionsOverlap(contractorJurisdictions, [ij])
    );
    matchedJurisdictions.push(...overlapping);
  } else {
    // Hard exclusion — item explicitly doesn't apply to contractor's jurisdiction
    return { score: 0, matchedTrades: [], matchedJurisdictions: [], matchedCredentials: [], whyYoureSeeing: [] };
  }

  // Credential match
  for (const cred of item.credentialTags) {
    if (contractorCredentials.includes(cred)) {
      matchedCredentials.push(cred);
      score += 15;
    }
  }

  // Severity bonus
  if (item.severity === 'CRITICAL') score += 20;
  else if (item.severity === 'ACTION_REQUIRED') score += 15;
  else if (item.severity === 'ACTION_MAY_BE_REQUIRED') score += 10;

  // Authority tier bonus
  if (item.authorityTier === 1) score += 10;
  else if (item.authorityTier === 2) score += 5;

  // Generate plain-English "Why you're seeing this" list
  if (matchedTrades.length > 0) {
    whyYoureSeeing.push(`Your organisation is approved for ${matchedTrades.join(', ')} work.`);
  }
  if (matchedJurisdictions.length > 0 && !matchedJurisdictions.includes('United Kingdom')) {
    whyYoureSeeing.push(`This applies in: ${matchedJurisdictions.join(', ')}.`);
  }
  if (matchedCredentials.length > 0) {
    whyYoureSeeing.push(`Your company holds credentials relevant to this update: ${matchedCredentials.join(', ')}.`);
  }
  if (item.authorityTier === 1) {
    whyYoureSeeing.push(`This comes from a statutory or government regulatory source.`);
  }

  return { score: Math.min(score, 100), matchedTrades, matchedJurisdictions, matchedCredentials, whyYoureSeeing };
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API — CONTRACTOR INTELLIGENCE
// ─────────────────────────────────────────────────────────────

export async function getPersonalisedContractorIntelligence(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorIntelligenceFeed> {
  // Load contractor profile from Supabase
  const [orgResult, tradesResult, credentialsResult] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(contractorOrgId)}&select=id,legal_name,operating_jurisdictions,company_number`),
    dbQuery<any[]>(`supplier_organisation_trades?org_id=eq.${encodeURIComponent(contractorOrgId)}&select=trade_scope`),
    dbQuery<any[]>(`supplier_compliance_evidence?org_id=eq.${encodeURIComponent(contractorOrgId)}&select=requirement_code&verification_status=eq.VERIFIED`),
  ]);

  const org = orgResult.data?.[0];
  const trades: TradeScope[] = (tradesResult.data || []).map((r: any) => r.trade_scope).filter(Boolean);
  const credentials: string[] = (credentialsResult.data || []).map((r: any) => r.requirement_code).filter(Boolean);
  const jurisdictions: UKJurisdiction[] = org?.operating_jurisdictions || ['United Kingdom'];

  const contractorFmCategories = buildContractorFmCategories(trades);

  const allItems = Array.from(intelligenceStore.values()).filter(
    (i) => i.reviewStatus === 'APPROVED' || i.reviewStatus === 'AUTO_PUBLISHED'
  );

  const personalisedItems: PersonalisedItem[] = [];

  for (const item of allItems) {
    const { score, matchedTrades, matchedJurisdictions, matchedCredentials, whyYoureSeeing } = scorePersonalisedItem(
      item, contractorFmCategories, jurisdictions, credentials
    );

    if (score === 0) continue; // Not relevant to this contractor

    const actionKey = `${contractorOrgId}::${item.id}`;
    const ackKey = `${contractorOrgId}::${item.id}::${item.version}`;

    personalisedItems.push({
      item,
      applicabilityScore: score,
      matchedTrades: matchedTrades as unknown as TradeScope[],
      matchedJurisdictions,
      matchedCredentials,
      whyYoureSeeing: [...whyYoureSeeing, ...item.whyYoureSeeing],
      actionStatus: actionStore.get(actionKey),
      acknowledgement: acknowledgementStore.get(ackKey),
      isAcknowledged: !!acknowledgementStore.get(ackKey) && !acknowledgementStore.get(ackKey)!.isInvalidated,
      isActioned: !!actionStore.get(actionKey)?.isResolved,
    });
  }

  // Sort: unacknowledged high-severity first
  personalisedItems.sort((a, b) => {
    if (!a.isAcknowledged && b.isAcknowledged) return -1;
    if (a.isAcknowledged && !b.isAcknowledged) return 1;
    return b.applicabilityScore - a.applicabilityScore;
  });

  const pending = personalisedItems.filter((p) => !p.isAcknowledged);
  const reviewed = personalisedItems.filter((p) => p.isAcknowledged);

  return {
    contractorOrgId,
    contractorName: org?.legal_name || session.orgName || contractorOrgId,
    tradeProfile: trades,
    jurisdictions,
    generatedAt: new Date().toISOString(),
    forYou: pending.slice(0, 12),
    complianceWatch: pending.filter((p) =>
      ['REGULATORY_CHANGE', 'LEGISLATION_PUBLISHED', 'LEGISLATION_AMENDED'].includes(p.item.eventType)
    ),
    tradeUpdates: pending.filter((p) =>
      ['TRADE_BODY_GUIDANCE', 'STANDARDS_UPDATE'].includes(p.item.eventType)
    ),
    safetyAlerts: pending.filter((p) =>
      ['HSE_ENFORCEMENT', 'PRODUCT_SAFETY_RECALL', 'PROSECUTION'].includes(p.item.eventType)
    ),
    technicalStandards: pending.filter((p) => p.item.eventType === 'STANDARDS_UPDATE'),
    cpdEvents: pending.filter((p) => p.item.eventType === 'CPD_EVENT'),
    reviewed,
    pendingActionCount: pending.length,
    unacknowledgedCriticalCount: pending.filter((p) =>
      p.item.severity === 'CRITICAL' || p.item.severity === 'ACTION_REQUIRED'
    ).length,
  };
}

// ─────────────────────────────────────────────────────────────
// COMPANY WATCH
// ─────────────────────────────────────────────────────────────

export async function evaluateCompanyWatch(
  contractorOrgId: string,
  _session: UserSession
): Promise<CompanyWatchRecord> {
  // Load company number from contractor profile
  const orgResult = await dbQuery<any[]>(
    `supplier_organisations?id=eq.${encodeURIComponent(contractorOrgId)}&select=id,legal_name,company_number`
  );
  const org = orgResult.data?.[0];
  const companyNumber: string = org?.company_number || '';
  const companyName: string = org?.legal_name || contractorOrgId;

  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  const apiAvailable = !!apiKey && !!companyNumber;

  if (!apiAvailable) {
    return {
      contractorOrgId,
      companyNumber,
      companyName,
      companyStatus: 'UNVERIFIED',
      lastCheckedAt: new Date().toISOString(),
      accounts: { overdue: false },
      confirmationStatement: { overdue: false },
      apiAvailable: false,
      degraded: false,
      events: [],
    };
  }

  // Attempt live Companies House API call
  try {
    const cached = companyWatchCache.get(contractorOrgId);
    // Serve from cache if < 4 hours old
    if (cached && Date.now() - new Date(cached.lastCheckedAt).getTime() < 4 * 60 * 60 * 1000) {
      return cached;
    }

    const response = await fetch(
      `https://api.company-information.service.gov.uk/company/${companyNumber}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      throw new Error(`Companies House API returned ${response.status}`);
    }

    const data: any = await response.json();

    const accountsDueDate = data.accounts?.next_due;
    const csDueDate = data.confirmation_statement?.next_due;
    const today = new Date().toISOString().slice(0, 10);

    const record: CompanyWatchRecord = {
      contractorOrgId,
      companyNumber,
      companyName: data.company_name || companyName,
      companyStatus: mapChStatus(data.company_status),
      lastCheckedAt: new Date().toISOString(),
      lastSuccessfulFetchAt: new Date().toISOString(),
      incorporationDate: data.date_of_creation,
      registeredOfficeAddress: formatChAddress(data.registered_office_address),
      sic: data.sic_codes,
      accounts: {
        nextDueDate: accountsDueDate,
        lastMadeUpTo: data.accounts?.last_accounts?.made_up_to,
        overdue: !!accountsDueDate && accountsDueDate < today,
        accountType: data.accounts?.last_accounts?.type,
      },
      confirmationStatement: {
        nextDueDate: csDueDate,
        lastMadeUpTo: data.confirmation_statement?.last_made_up_to,
        overdue: !!csDueDate && csDueDate < today,
      },
      officers: [], // Would require /company/{id}/officers call — deferred
      insolvency: data.has_insolvency_history ? { caseType: 'Check Official Register', dates: [], status: 'Requires Review' } : undefined,
      apiAvailable: true,
      degraded: false,
      events: [],
    };

    companyWatchCache.set(contractorOrgId, record);
    return record;
  } catch (err) {
    const cached = companyWatchCache.get(contractorOrgId);
    return {
      ...(cached || {
        contractorOrgId, companyNumber, companyName,
        companyStatus: 'UNVERIFIED' as const,
        accounts: { overdue: false },
        confirmationStatement: { overdue: false },
        events: [],
      }),
      lastCheckedAt: new Date().toISOString(),
      apiAvailable: true,
      degraded: true,
    };
  }
}

function mapChStatus(status: string): CompanyWatchRecord['companyStatus'] {
  switch (status) {
    case 'active': return 'ACTIVE';
    case 'dissolved': return 'DISSOLVED';
    case 'liquidation': return 'LIQUIDATION';
    case 'converted-closed': return 'CONVERTED_CLOSED';
    default: return 'UNVERIFIED';
  }
}

function formatChAddress(addr: any): string {
  if (!addr) return '';
  return [addr.address_line_1, addr.address_line_2, addr.locality, addr.postal_code]
    .filter(Boolean)
    .join(', ');
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL WATCH
// ─────────────────────────────────────────────────────────────

export async function evaluateCredentialWatch(
  contractorOrgId: string,
  _session: UserSession
): Promise<CredentialWatchSummary> {
  const [orgCredsResult, operativesResult] = await Promise.all([
    dbQuery<any[]>(`supplier_compliance_evidence?org_id=eq.${encodeURIComponent(contractorOrgId)}&select=*`),
    dbQuery<any[]>(`persons?organisation_id=eq.${encodeURIComponent(contractorOrgId)}&status=eq.ACTIVE&select=id,first_name,last_name`),
  ]);

  const orgCreds = orgCredsResult.data || [];
  const operatives = operativesResult.data || [];
  const today = new Date().toISOString().slice(0, 10);

  const organisationCredentials: OrgCredentialWatch[] = orgCreds.map((cred: any) => {
    const isClosedRegister = CLOSED_REGISTER_CREDENTIALS.includes(cred.requirement_code);
    const expiryDate: string | undefined = cred.expiry_date;
    let daysUntilExpiry: number | undefined;
    let status: OrgCredentialWatch['status'] = 'VERIFIED';

    if (expiryDate) {
      const daysLeft = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
      daysUntilExpiry = daysLeft;
      if (daysLeft < 0) status = 'EXPIRED';
      else if (daysLeft <= 90) status = 'EXPIRING';
    }
    if (!cred.last_verified_at) status = 'VERIFICATION_DUE';

    return {
      credentialType: cred.requirement_code,
      registrationNumber: cred.registration_number,
      issuingBody: cred.insurer_or_body || '',
      verificationMethod: isClosedRegister ? 'MANUAL_OFFICIAL_VERIFICATION' : 'DOCUMENT_UPLOAD',
      scope: cred.scope,
      expiryDate,
      daysUntilExpiry,
      status,
      lastVerifiedAt: cred.last_verified_at,
      verifiedBy: cred.verified_by,
      officialRegisterUrl: getOfficialRegisterUrl(cred.requirement_code),
      verificationNotes: cred.contractor_visible_note,
      nextReviewDate: expiryDate,
      isClosedRegister,
    };
  });

  let expiringWithin90DaysCount = 0;
  let overdueVerificationCount = 0;
  organisationCredentials.forEach((c) => {
    if (c.status === 'EXPIRING') expiringWithin90DaysCount++;
    if (c.status === 'VERIFICATION_DUE' || c.status === 'EXPIRED') overdueVerificationCount++;
  });

  return {
    contractorOrgId,
    generatedAt: new Date().toISOString(),
    organisationCredentials,
    operativeCredentials: operatives.slice(0, 5).map((op: any) => ({
      operativeId: op.id,
      operativeName: `${op.first_name} ${op.last_name}`,
      credentials: [],
    })),
    expiringWithin90DaysCount,
    overdueVerificationCount,
  };
}

function getOfficialRegisterUrl(credentialCode: string): string | undefined {
  const urls: Record<string, string> = {
    GAS_SAFE: 'https://www.gassaferegister.co.uk/find-an-engineer/',
    NICEIC: 'https://www.niceic.com/find-a-contractor',
    NAPIT: 'https://www.napit.org.uk/find-a-member/',
    REFCOM: 'https://www.refcom.org.uk/find-a-contractor/',
    SIA_APPROVED_CONTRACTOR: 'https://www.sia.homeoffice.gov.uk/Pages/ACS-search.aspx',
    UKAS: 'https://www.ukas.com/find-an-organisation/',
  };
  return urls[credentialCode];
}

// ─────────────────────────────────────────────────────────────
// ACTIONS & ACKNOWLEDGEMENTS
// ─────────────────────────────────────────────────────────────

export async function recordIntelligenceAction(
  contractorOrgId: string,
  session: UserSession,
  intelligenceItemId: string,
  action: {
    actionType: ActionType;
    assignedTo?: string;
    dueDate?: string;
    internalNote?: string;
    evidenceDocumentId?: string;
    linkedRequirementId?: string;
    notApplicableReason?: string;
  }
): Promise<ContractorActionRecord> {
  const item = intelligenceStore.get(intelligenceItemId);
  if (!item) throw new Error(`Intelligence item not found: ${intelligenceItemId}`);

  const record: ContractorActionRecord = {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    contractorOrgId,
    intelligenceItemId,
    intelligenceItemVersion: item.version,
    actionType: action.actionType,
    assignedTo: action.assignedTo,
    dueDate: action.dueDate,
    internalNote: action.internalNote,
    evidenceDocumentId: action.evidenceDocumentId,
    linkedRequirementId: action.linkedRequirementId,
    notApplicableReason: action.notApplicableReason,
    createdBy: session.personId,
    createdAt: new Date().toISOString(),
    isResolved: false,
  };

  actionStore.set(`${contractorOrgId}::${intelligenceItemId}`, record);

  await recordAuditEvent({
    event_type: 'INTELLIGENCE_ACTION_RECORDED',
    object_type: 'intelligence_item',
    object_id: intelligenceItemId,
    actor_id: session.personId,
    organisation_id: contractorOrgId,
    after_state: { actionType: action.actionType, notApplicableReason: action.notApplicableReason },
  }).catch(() => {});

  return record;
}

export async function acknowledgeIntelligenceItem(
  contractorOrgId: string,
  session: UserSession,
  intelligenceItemId: string
): Promise<AcknowledgementRecord> {
  const item = intelligenceStore.get(intelligenceItemId);
  if (!item) throw new Error(`Intelligence item not found: ${intelligenceItemId}`);

  const ack: AcknowledgementRecord = {
    id: `ack-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    contractorOrgId,
    userId: session.personId,
    intelligenceItemId,
    intelligenceItemVersion: item.version,
    acknowledgedAt: new Date().toISOString(),
    isInvalidated: false,
  };

  const key = `${contractorOrgId}::${intelligenceItemId}::${item.version}`;
  acknowledgementStore.set(key, ack);

  await recordAuditEvent({
    event_type: 'INTELLIGENCE_ACKNOWLEDGED',
    object_type: 'intelligence_item',
    object_id: intelligenceItemId,
    actor_id: session.personId,
    organisation_id: contractorOrgId,
    after_state: { version: item.version },
  }).catch(() => {});

  return ack;
}

// ─────────────────────────────────────────────────────────────
// ADMIN — INTELLIGENCE REVIEW
// ─────────────────────────────────────────────────────────────

export function getAllIntelligenceItems(): NormalisedIntelligenceItem[] {
  return Array.from(intelligenceStore.values());
}

export function getItemsPendingReview(): NormalisedIntelligenceItem[] {
  return Array.from(intelligenceStore.values()).filter(
    (i) => i.reviewStatus === 'PENDING_REVIEW' || i.reviewStatus === 'REQUIRES_COMPLIANCE_REVIEW'
  );
}

export async function adminReviewIntelligenceItem(
  itemId: string,
  decision: 'APPROVED' | 'REJECTED',
  reviewedBy: string,
  notes?: string
): Promise<NormalisedIntelligenceItem> {
  const item = intelligenceStore.get(itemId);
  if (!item) throw new Error(`Item not found: ${itemId}`);

  const updated: NormalisedIntelligenceItem = {
    ...item,
    reviewStatus: decision,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
  };
  intelligenceStore.set(itemId, updated);

  await recordAuditEvent({
    event_type: `INTELLIGENCE_REVIEW_${decision}`,
    object_type: 'intelligence_item',
    object_id: itemId,
    actor_id: reviewedBy,
    after_state: { notes, reviewStatus: decision },
  }).catch(() => {});

  return updated;
}

// ─────────────────────────────────────────────────────────────
// ADMIN TENDER RADAR — EntireFM Internal Business Development
// NEVER exposed to contractors
// ─────────────────────────────────────────────────────────────

function scoreTenderForEntireFM(opportunity: TenderOpportunity): {
  score: number;
  matchedServices: string[];
  matchStrength: EntireFMTenderRecord['matchStrength'];
  matchReasons: string[];
  cpvMatches: string[];
} {
  let score = 0;
  const matchedServices: string[] = [];
  const matchReasons: string[] = [];
  const cpvMatches: string[] = [];

  for (const service of ENTIREFM_CORE_SERVICES) {
    const cpvHit = opportunity.cpvCodes.some((cpv) =>
      service.cpvPrefixes.some((prefix) => cpv.startsWith(prefix))
    );
    if (cpvHit) {
      score += 30;
      matchedServices.push(service.id);
      matchReasons.push(`${service.label} — CPV code match`);
      opportunity.cpvCodes.forEach((cpv) => {
        if (service.cpvPrefixes.some((p) => cpv.startsWith(p))) cpvMatches.push(cpv);
      });
    }

    // Keyword matching in title/description
    const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const serviceKeywords = [service.label.toLowerCase(), ...service.tradeTags.map((t) => t.toLowerCase().replace(/-/g, ' '))];
    const kwHit = serviceKeywords.some((kw) => text.includes(kw));
    if (kwHit && !cpvHit) {
      score += 15;
      if (!matchedServices.includes(service.id)) matchedServices.push(service.id);
      matchReasons.push(`${service.label} — keyword match in notice text`);
    }
  }

  // UK/regional bonus
  const lowerRegion = (opportunity.buyerRegion || '').toLowerCase();
  if (lowerRegion.includes('england') || lowerRegion.includes('united kingdom') || lowerRegion === '') {
    score += 10;
    matchReasons.push('Within EntireFM operational coverage area');
  }

  // SME indicator
  if (opportunity.isSmeAppropriate) {
    score += 5;
    matchReasons.push('Suitable for SME contractors');
  }

  // Framework bonus
  if (opportunity.isFramework) {
    score += 5;
    matchReasons.push('Framework opportunity — recurring revenue potential');
  }

  const cappedScore = Math.min(score, 100);
  const matchStrength: EntireFMTenderRecord['matchStrength'] =
    cappedScore >= 60 ? 'STRONG' : cappedScore >= 35 ? 'MODERATE' : cappedScore >= 15 ? 'WEAK' : 'NOT_MATCHED';

  return { score: cappedScore, matchedServices, matchStrength, matchReasons, cpvMatches };
}

function computeDeadlineUrgency(closingDate?: string): EntireFMTenderRecord['deadlineUrgency'] {
  if (!closingDate) return 'NORMAL';
  const daysLeft = Math.ceil((new Date(closingDate).getTime() - Date.now()) / 86400000);
  if (daysLeft < 0) return 'EXPIRED';
  if (daysLeft <= 5) return 'IMMINENT';
  if (daysLeft <= 14) return 'SOON';
  return 'NORMAL';
}

export async function getEntireFMTenderRadar(filters?: {
  minScore?: number;
  bidStage?: TenderBidStage;
  service?: string;
  deadlineUrgency?: EntireFMTenderRecord['deadlineUrgency'];
}): Promise<EntireFMTenderRecord[]> {
  let results = Array.from(tenderStore.values());

  if (filters?.minScore !== undefined) {
    results = results.filter((r) => r.matchScore >= filters.minScore!);
  }
  if (filters?.bidStage) {
    results = results.filter((r) => r.bidStage === filters.bidStage);
  }
  if (filters?.service) {
    results = results.filter((r) => r.matchedServices.includes(filters.service!));
  }
  if (filters?.deadlineUrgency) {
    results = results.filter((r) => r.deadlineUrgency === filters.deadlineUrgency);
  }

  return results.sort((a, b) => {
    // Priority: IMMINENT deadlines with strong match first
    if (a.deadlineUrgency === 'IMMINENT' && b.deadlineUrgency !== 'IMMINENT') return -1;
    if (b.deadlineUrgency === 'IMMINENT' && a.deadlineUrgency !== 'IMMINENT') return 1;
    return b.matchScore - a.matchScore;
  });
}

export async function upsertTenderOpportunity(opportunity: TenderOpportunity): Promise<EntireFMTenderRecord> {
  const existing = Array.from(tenderStore.values()).find((r) => r.opportunity.ocid === opportunity.ocid);
  const { score, matchedServices, matchStrength, matchReasons, cpvMatches } = scoreTenderForEntireFM(opportunity);

  if (existing) {
    const updated: EntireFMTenderRecord = {
      ...existing,
      opportunity,
      matchScore: score,
      matchedServices,
      matchStrength,
      matchReasons,
      cpvMatches,
      deadlineUrgency: computeDeadlineUrgency(opportunity.closingDate),
      updatedAt: new Date().toISOString(),
    };
    tenderStore.set(existing.id, updated);
    return updated;
  }

  const record: EntireFMTenderRecord = {
    id: `tender-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    opportunity,
    matchScore: score,
    matchedServices,
    matchStrength,
    matchReasons,
    cpvMatches,
    bidStage: 'NEW',
    internalNotes: [],
    deadlineUrgency: computeDeadlineUrgency(opportunity.closingDate),
    firstSeenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tenderStore.set(record.id, record);
  return record;
}

export async function updateTenderPipeline(
  tenderId: string,
  update: {
    bidStage?: TenderBidStage;
    assignedTo?: string;
    note?: string;
    addedBy?: string;
  }
): Promise<EntireFMTenderRecord> {
  const record = tenderStore.get(tenderId);
  if (!record) throw new Error(`Tender record not found: ${tenderId}`);

  const updated: EntireFMTenderRecord = {
    ...record,
    bidStage: update.bidStage ?? record.bidStage,
    assignedTo: update.assignedTo ?? record.assignedTo,
    updatedAt: new Date().toISOString(),
    internalNotes: update.note
      ? [
          ...record.internalNotes,
          {
            id: `note-${Date.now()}`,
            tenderId,
            note: update.note,
            createdBy: update.addedBy || 'system',
            createdAt: new Date().toISOString(),
          },
        ]
      : record.internalNotes,
  };
  tenderStore.set(tenderId, updated);
  return updated;
}

// ─────────────────────────────────────────────────────────────
// ADMIN SUMMARY
// ─────────────────────────────────────────────────────────────

export function getAdminIntelligenceSummary() {
  const allItems = Array.from(intelligenceStore.values());
  const allTenders = Array.from(tenderStore.values());
  const sources = sourceRegistry.getAllSources();

  return {
    requiresComplianceReview: allItems.filter((i) => i.reviewStatus === 'PENDING_REVIEW' || i.reviewStatus === 'REQUIRES_COMPLIANCE_REVIEW').length,
    newRegulatoryEvents: allItems.filter((i) => i.reviewStatus === 'APPROVED' && i.authorityTier === 1 &&
      Date.now() - new Date(i.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length,
    newTenderMatches: allTenders.filter((t) => t.bidStage === 'NEW' && t.matchStrength !== 'NOT_MATCHED').length,
    imminentTenderDeadlines: allTenders.filter((t) => t.deadlineUrgency === 'IMMINENT' && !['SUBMITTED', 'WON', 'LOST', 'EXPIRED'].includes(t.bidStage)).length,
    sourceHealthIssues: sources.filter((s) => s.healthStatus !== 'LIVE' && s.healthStatus !== 'CREDENTIAL_REQUIRED').length,
    sourceCredentialRequired: sources.filter((s) => s.healthStatus === 'CREDENTIAL_REQUIRED').length,
  };
}
