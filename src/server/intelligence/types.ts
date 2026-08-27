/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — TYPE DEFINITIONS
 * =======================================================
 * Canonical data structures for multi-source ingestion, authority tiers,
 * legal status, devolved UK jurisdictions, event deduplication,
 * procurement intelligence, company entities, and source health.
 */

import type { ImageProvenance } from '@/lib/lobby/image-resolver';

/** Authority Tiers (1 = Statutory/Regulator, 2 = Official Technical/Professional, 3 = Trade Press, 4 = Aggregator/Discovery) */
export type AuthorityTier = 1 | 2 | 3 | 4;

export const AUTHORITY_TIER_LABELS: Record<AuthorityTier, string> = {
  1: 'Tier 1 · Statutory / Regulatory Authority',
  2: 'Tier 2 · Official Technical / Professional Body',
  3: 'Tier 3 · Industry Trade Press',
  4: 'Tier 4 · Discovery Aggregator',
};

/** Devolved UK Jurisdictions */
export type UKJurisdiction =
  | 'England'
  | 'Wales'
  | 'Scotland'
  | 'Northern Ireland'
  | 'Great Britain'
  | 'United Kingdom';

/** Legal & Regulatory Status */
export type LegalStatus =
  | 'LAW'
  | 'REGULATION'
  | 'STATUTORY_INSTRUMENT'
  | 'APPROVED_DOCUMENT'
  | 'ACOP_GUIDANCE'
  | 'CONSULTATION'
  | 'PROPOSED_LEGISLATION'
  | 'STANDARD'
  | 'INDUSTRY_GUIDANCE'
  | 'TECHNICAL_COMMENTARY'
  | 'NEWS';

/** FM Service Taxonomy Categories */
export type FMTradeCategory =
  | 'building-safety'
  | 'compliance'
  | 'fire-safety'
  | 'electrical'
  | 'hvac'
  | 'mechanical'
  | 'water-hygiene'
  | 'lifts-access'
  | 'asbestos'
  | 'energy-sustainability'
  | 'cafm-technology'
  | 'procurement-contracts'
  | 'people-appointments'
  | 'workplace-property'
  | 'cleaning-soft-fm'
  | 'security'
  | 'waste-environment';

/** Source Health Status */
export type SourceHealthStatus =
  | 'LIVE'
  | 'DEGRADED'
  | 'FAILED'
  | 'DISABLED'
  | 'CREDENTIAL_REQUIRED';

/** Source Definition */
export interface IntelligenceSource {
  id: string;
  name: string;
  slug: string;
  sourceType: 'api' | 'rss' | 'ocds' | 'changedetection' | 'scraper' | 'feed';
  authorityTier: AuthorityTier;
  accessType: 'open_no_key' | 'api_key' | 'oauth' | 'partnership_pending';
  baseDomain: string;
  baseUrl: string;
  enabled: boolean;
  pollIntervalMinutes: number;
  jurisdictions: UKJurisdiction[];
  primaryTrades: FMTradeCategory[];
  requiresHumanReview: boolean;
  credentialEnvKey?: string;
  lastSuccessfulFetch?: string;
  lastError?: string;
  healthStatus: SourceHealthStatus;
  recordsIngested24h: number;
  duplicateRatePercentage: number;
  description: string;
  docUrl?: string;
}

/** Ingestion Run Audit Record */
export interface IngestionRun {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: 'success' | 'partial' | 'failed';
  recordsFetched: number;
  recordsCreated: number;
  recordsUpdated: number;
  duplicatesDetected: number;
  error?: string;
  parserVersion: string;
}

/** Immutable Raw Ingested Record */
export interface RawIntelligenceRecord {
  id: string;
  sourceId: string;
  sourceContentId: string;
  canonicalUrl: string;
  fetchedAt: string;
  contentHash: string;
  parserVersion: string;
  rawPayload: Record<string, unknown>;
}

/** Secondary Source Reference for Event Clustering */
export interface SecondarySourceReference {
  sourceName: string;
  sourceUrl: string;
  authorityTier: AuthorityTier;
  title: string;
  publishedAt: string;
  summarySnippet?: string;
}

/** Canonical Intelligence Item */
export interface CanonicalIntelligenceItem {
  id: string;
  canonicalUrl: string;
  sourceContentId: string;
  title: string;
  standfirst: string;
  editorialSummary?: string;
  whyItMatters?: string;
  actionRequired?: string;
  
  eventType: 'statutory_change' | 'consultation' | 'parliament_stage' | 'prosecution' | 'safety_alert' | 'trade_news' | 'contract_win' | 'appointment' | 'event' | 'award';
  legalStatus: LegalStatus;
  authorityTier: AuthorityTier;
  
  primarySource: {
    name: string;
    url: string;
    authorityTier: AuthorityTier;
    publisher?: string;
  };
  
  secondarySources: SecondarySourceReference[];
  
  publishedAt: string;
  updatedAt?: string;
  effectiveFrom?: string;
  deadline?: string;
  
  jurisdictions: UKJurisdiction[];
  tradeTags: FMTradeCategory[];
  topics: string[];
  
  provenance: ImageProvenance;
  
  isStatutory: boolean;
  requiresReview: boolean;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'auto_published';
  reviewedBy?: string;
  reviewedAt?: string;
  
  contentHash: string;
  firstSeenAt: string;
  lastSeenAt: string;
  
  // Relations
  relatedStatuteCitation?: string;
  relatedDiscussionSlug?: string;
  relatedRoomSlug?: string;
  relatedToolUrl?: string;
  relatedResourceUrl?: string;
  
  // High-impact data
  consultationData?: {
    closingDate: string;
    organisingBody: string;
    responseUrl?: string;
    status: 'open' | 'closed' | 'response_published';
  };
  
  parliamentData?: {
    billTitle: string;
    currentStage: string;
    house: 'Commons' | 'Lords';
    nextStageDate?: string;
    session: string;
  };
  
  prosecutionData?: {
    defendant: string;
    breachedAct: string;
    penalty: string;
    enforcingAuthority: string;
    lessonLearned: string;
  };
}

/** Procurement / Tender Opportunity (OCDS Aligned) */
export interface ProcurementOpportunity {
  id: string;
  ocid: string; // Open Contracting ID for lifecycle deduplication
  source: 'Contracts Finder' | 'Find a Tender' | 'Crown Commercial Service';
  noticeType: 'planning' | 'tender' | 'award' | 'contract';
  title: string;
  description: string;
  whyItMattersForFM: string;
  buyerName: string;
  buyerRegion: string;
  cpvCodes: string[];
  serviceCategory: FMTradeCategory;
  
  estimatedValue?: {
    amount: number;
    currency: 'GBP';
    isFormatted: string;
  };
  
  publishedAt: string;
  closingDate?: string;
  contractStartDate?: string;
  contractDurationMonths?: number;
  
  status: 'active' | 'closing_soon' | 'awarded' | 'cancelled';
  officialNoticeUrl: string;
  
  // Who Won What (For Awards)
  awardDetails?: {
    supplierName: string;
    supplierCompanyNumber?: string;
    awardedValue?: string;
    awardedDate: string;
    contractPeriodYears?: number;
    subcontractingPermitted?: boolean;
  };
}

/** Canonical Company / Supplier Entity */
export interface CompanyEntity {
  id: string;
  companyNumber?: string; // Companies House number
  companyName: string;
  tradingNames?: string[];
  status: 'active' | 'dissolved' | 'liquidation' | 'unverified';
  incorporationDate?: string;
  registeredOfficeAddress?: string;
  sicCodes?: string[];
  accountsDueDate?: string;
  confirmationStatementDueDate?: string;
  isVerified: boolean;
  contractWinsCount: number;
  totalPublicContractValue: string;
  recentAwards: {
    title: string;
    buyer: string;
    value: string;
    date: string;
    noticeUrl: string;
  }[];
}

/** Member Interest Preferences */
export interface MemberIntelligenceProfile {
  memberId: string;
  followedTopics: FMTradeCategory[];
  followedRegions: string[];
  followedAuthorities: string[];
  followedOrganisations: string[];
  notifyOnCompliance: boolean;
  notifyOnConsultationClosing: boolean;
  notifyOnTenders: boolean;
  dailyBriefingDigest: boolean;
}
