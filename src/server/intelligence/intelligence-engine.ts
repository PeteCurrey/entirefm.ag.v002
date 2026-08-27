/**
 * ENTIREFM CP-09R — PERSISTENT INTELLIGENCE ENGINE & LIVE INGESTION
 * =================================================================
 * Fully database-backed intelligence engine with Supabase persistence.
 * Zero in-memory stores in production paths.
 * Real live external connectors with content hashing, provenance, and audit trails.
 *
 * STRICT PRODUCT BOUNDARY:
 * - Regulatory, safety, compliance, trade intelligence → Contractor Intelligence Centre
 * - Procurement notices (Contracts Finder / Find a Tender) → Admin Tender Radar ONLY
 *   Contractors CANNOT access tender data through any API or UI surface.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';
import type { TradeScope } from '@/server/contractor/competency-framework';
import { sourceRegistry } from './source-registry';
import type { UKJurisdiction, FMTradeCategory, AuthorityTier, LegalStatus } from './types';
import {
  fetchGovUkSearch,
  fetchGovUkContent,
  fetchLegislationUkFeed,
  fetchHseMediaWire,
  fetchOpssProductSafety,
  fetchContractsFinderOcds,
  fetchFindATenderOcds,
} from './connectors';

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

export const CLOSED_REGISTER_CREDENTIALS = [
  'GAS_SAFE',
  'NICEIC',
  'NAPIT',
  'REFCOM',
  'UKAS',
  'SIA_APPROVED_CONTRACTOR',
] as const;

export type ClosedRegisterCredential = (typeof CLOSED_REGISTER_CREDENTIALS)[number];

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
// CANONICAL INTELLIGENCE ITEM
// ─────────────────────────────────────────────────────────────

export interface NormalisedIntelligenceItem {
  id: string;
  externalId: string;
  contentHash: string;
  version: number;
  title: string;
  entirefmSummary: string;
  whatChanged?: string;
  suggestedContractorAction?: string;
  whyYoureSeeing: string[];
  sourceId: string;
  sourceName: string;
  canonicalUrl: string;
  authorityTier: AuthorityTier;
  legalStatus: LegalStatus;
  eventType: IntelligenceEventType;
  severity: IntelligenceSeverity;
  jurisdictions: UKJurisdiction[];
  tradeTags: FMTradeCategory[];
  credentialTags: string[];
  workTypeTags: string[];
  publishedAt: string;
  updatedAt?: string;
  effectiveFrom?: string;
  deadlineDate?: string;
  supersedes?: string;
  rightsLicence: string;
  parserVersion: string;
  fetchedAt: string;
  rawSourceHash?: string;
  rawPayload?: Record<string, unknown>;
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  linkedComplianceRequirementIds: string[];
  audienceRoles: IntelligenceAudienceRole[];
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
  applicabilityScore: number;
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
  apiAvailable: boolean;
  degraded: boolean;
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
  officialRegisterUrl?: string;
  verificationNotes?: string;
  nextReviewDate?: string;
  isClosedRegister: boolean;
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
  intelligenceItemVersion: number;
  acknowledgedAt: string;
  isInvalidated: boolean;
  invalidatedAt?: string;
  invalidatedReason?: string;
}

// ─────────────────────────────────────────────────────────────
// ADMIN TENDER RADAR — EntireFM Internal Only
// ─────────────────────────────────────────────────────────────

export interface TenderOpportunity {
  id: string;
  ocid: string;
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

export interface EntireFMTenderRecord {
  id: string;
  opportunity: TenderOpportunity;
  matchScore: number;
  matchedServices: string[];
  matchStrength: 'STRONG' | 'MODERATE' | 'WEAK' | 'NOT_MATCHED';
  matchReasons: string[];
  cpvMatches: string[];
  bidStage: TenderBidStage;
  assignedTo?: string;
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
// TRADE / JURISDICTION MAPPING
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

function jurisdictionsOverlap(contractorJurisdictions: UKJurisdiction[], itemJurisdictions: UKJurisdiction[]): boolean {
  for (const cj of contractorJurisdictions) {
    for (const ij of itemJurisdictions) {
      if (cj === ij) return true;
      if (ij === 'United Kingdom') return true;
      if (ij === 'Great Britain' && (cj === 'England' || cj === 'Wales' || cj === 'Scotland' || cj === 'Great Britain')) return true;
      if (cj === 'Great Britain' && (ij === 'England' || ij === 'Wales' || ij === 'Scotland')) return true;
    }
  }
  return false;
}

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

  for (const tag of item.tradeTags) {
    if (contractorFmCategories.includes(tag)) {
      if (!matchedTrades.includes(tag)) matchedTrades.push(tag);
      score += 40;
    }
  }

  const jurisdictionMatch = jurisdictionsOverlap(contractorJurisdictions, item.jurisdictions);
  if (jurisdictionMatch) {
    score += 25;
    const overlapping = item.jurisdictions.filter((ij) =>
      jurisdictionsOverlap(contractorJurisdictions, [ij])
    );
    matchedJurisdictions.push(...overlapping);
  } else {
    return { score: 0, matchedTrades: [], matchedJurisdictions: [], matchedCredentials: [], whyYoureSeeing: [] };
  }

  for (const cred of item.credentialTags) {
    if (contractorCredentials.includes(cred)) {
      matchedCredentials.push(cred);
      score += 15;
    }
  }

  if (item.severity === 'CRITICAL') score += 20;
  else if (item.severity === 'ACTION_REQUIRED') score += 15;
  else if (item.severity === 'ACTION_MAY_BE_REQUIRED') score += 10;

  if (item.authorityTier === 1) score += 10;
  else if (item.authorityTier === 2) score += 5;

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
// PUBLIC API — CONTRACTOR INTELLIGENCE (Persisted in Supabase)
// ─────────────────────────────────────────────────────────────

export async function getPersonalisedContractorIntelligence(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorIntelligenceFeed> {
  const [orgResult, tradesResult, credentialsResult, itemsResult, actionsResult, acksResult] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(contractorOrgId)}&select=id,legal_name,company_number`),
    dbQuery<any[]>(`supplier_organisation_trades?org_id=eq.${encodeURIComponent(contractorOrgId)}&select=trade_scope`),
    dbQuery<any[]>(`supplier_compliance_evidence?org_id=eq.${encodeURIComponent(contractorOrgId)}&select=requirement_code&verification_status=eq.VERIFIED`),
    dbQuery<any[]>(`intelligence_items?review_status=in.(APPROVED,AUTO_PUBLISHED)&order=published_at.desc&limit=50`),
    dbQuery<any[]>(`contractor_intelligence_actions?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}`),
    dbQuery<any[]>(`contractor_intelligence_acknowledgements?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}`),
  ]);

  const org = orgResult.data?.[0];
  const trades: TradeScope[] = (tradesResult.data || []).map((r: any) => r.trade_scope).filter(Boolean);
  const credentials: string[] = (credentialsResult.data || []).map((r: any) => r.requirement_code).filter(Boolean);
  const jurisdictions: UKJurisdiction[] = ['United Kingdom'];

  const contractorFmCategories = buildContractorFmCategories(trades);
  const rawItems = itemsResult.data || [];

  const actionsMap = new Map<string, ContractorActionRecord>(
    (actionsResult.data || []).map((a: any) => [
      a.intelligence_item_id,
      {
        id: a.id,
        contractorOrgId: a.contractor_org_id,
        intelligenceItemId: a.intelligence_item_id,
        intelligenceItemVersion: a.intelligence_item_version,
        actionType: a.action_type,
        assignedTo: a.assigned_to,
        dueDate: a.due_date,
        internalNote: a.internal_note,
        evidenceDocumentId: a.evidence_document_id,
        linkedRequirementId: a.linked_requirement_id,
        notApplicableReason: a.not_applicable_reason,
        createdBy: a.created_by,
        createdAt: a.created_at,
        resolvedAt: a.resolved_at,
        isResolved: a.is_resolved,
      },
    ])
  );

  const acksMap = new Map<string, AcknowledgementRecord>(
    (acksResult.data || []).map((ack: any) => [
      `${ack.intelligence_item_id}::${ack.intelligence_item_version}`,
      {
        id: ack.id,
        contractorOrgId: ack.contractor_org_id,
        userId: ack.user_id,
        intelligenceItemId: ack.intelligence_item_id,
        intelligenceItemVersion: ack.intelligence_item_version,
        acknowledgedAt: ack.acknowledged_at,
        isInvalidated: ack.is_invalidated,
        invalidatedAt: ack.invalidated_at,
        invalidatedReason: ack.invalidated_reason,
      },
    ])
  );

  const personalisedItems: PersonalisedItem[] = [];

  for (const raw of rawItems) {
    const item: NormalisedIntelligenceItem = {
      id: raw.id,
      externalId: raw.external_id,
      contentHash: raw.content_hash,
      version: raw.version || 1,
      title: raw.title,
      entirefmSummary: raw.entirefm_summary,
      whatChanged: raw.what_changed,
      suggestedContractorAction: raw.suggested_contractor_action,
      whyYoureSeeing: raw.why_youre_seeing || [],
      sourceId: raw.source_id,
      sourceName: raw.source_name,
      canonicalUrl: raw.canonical_url,
      authorityTier: raw.authority_tier,
      legalStatus: raw.legal_status,
      eventType: raw.event_type,
      severity: raw.severity,
      jurisdictions: raw.jurisdictions || ['United Kingdom'],
      tradeTags: raw.trade_tags || [],
      credentialTags: raw.credential_tags || [],
      workTypeTags: raw.work_type_tags || [],
      publishedAt: raw.published_at,
      updatedAt: raw.updated_at,
      effectiveFrom: raw.effective_from,
      deadlineDate: raw.deadline_date,
      supersedes: raw.supersedes_id,
      rightsLicence: raw.rights_licence || 'OGL v3.0',
      parserVersion: raw.parser_version || '1.0.0',
      fetchedAt: raw.fetched_at || raw.created_at,
      rawSourceHash: raw.raw_source_hash,
      reviewStatus: raw.review_status,
      reviewedBy: raw.reviewed_by,
      reviewedAt: raw.reviewed_at,
      linkedComplianceRequirementIds: raw.linked_compliance_requirement_ids || [],
      audienceRoles: raw.audience_roles || ['CONTRACTOR_ADMIN'],
      secondarySources: raw.secondary_sources || [],
    };

    const { score, matchedTrades, matchedJurisdictions, matchedCredentials, whyYoureSeeing } = scorePersonalisedItem(
      item, contractorFmCategories, jurisdictions, credentials
    );

    if (score === 0) continue;

    const action = actionsMap.get(item.id);
    const ackKey = `${item.id}::${item.version}`;
    const ack = acksMap.get(ackKey);

    personalisedItems.push({
      item,
      applicabilityScore: score,
      matchedTrades: matchedTrades as unknown as TradeScope[],
      matchedJurisdictions,
      matchedCredentials,
      whyYoureSeeing: [...whyYoureSeeing, ...item.whyYoureSeeing],
      actionStatus: action,
      acknowledgement: ack,
      isAcknowledged: !!ack && !ack.isInvalidated,
      isActioned: !!action?.isResolved,
    });
  }

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
    forYou: pending.slice(0, 15),
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
// COMPANY WATCH (Persisted in Supabase)
// ─────────────────────────────────────────────────────────────

export async function evaluateCompanyWatch(
  contractorOrgId: string,
  _session: UserSession
): Promise<CompanyWatchRecord> {
  const [orgResult, existingWatchResult] = await Promise.all([
    dbQuery<any[]>(`supplier_organisations?id=eq.${encodeURIComponent(contractorOrgId)}&select=id,legal_name,company_number`),
    dbQuery<any[]>(`company_watch_records?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&limit=1`),
  ]);

  const org = orgResult.data?.[0];
  const companyNumber: string = org?.company_number || '';
  const companyName: string = org?.legal_name || contractorOrgId;
  const existingRecord = existingWatchResult.data?.[0];

  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  const apiAvailable = !!apiKey && !!companyNumber;

  if (!apiAvailable) {
    return {
      contractorOrgId,
      companyNumber,
      companyName,
      companyStatus: existingRecord?.company_status || 'UNVERIFIED',
      lastCheckedAt: existingRecord?.last_checked_at || new Date().toISOString(),
      accounts: {
        nextDueDate: existingRecord?.accounts_next_due_date,
        lastMadeUpTo: existingRecord?.accounts_last_made_up_to,
        overdue: existingRecord?.accounts_overdue || false,
      },
      confirmationStatement: {
        nextDueDate: existingRecord?.confirmation_statement_next_due_date,
        lastMadeUpTo: existingRecord?.confirmation_statement_last_made_up_to,
        overdue: existingRecord?.confirmation_statement_overdue || false,
      },
      apiAvailable: false,
      degraded: false,
      events: existingRecord?.events || [],
    };
  }

  // Check if we have a fresh persisted record (< 4 hours)
  if (existingRecord && Date.now() - new Date(existingRecord.last_checked_at).getTime() < 4 * 60 * 60 * 1000) {
    return {
      contractorOrgId,
      companyNumber,
      companyName: existingRecord.company_name,
      companyStatus: existingRecord.company_status,
      lastCheckedAt: existingRecord.last_checked_at,
      lastSuccessfulFetchAt: existingRecord.last_successful_fetch_at,
      incorporationDate: existingRecord.incorporation_date,
      registeredOfficeAddress: existingRecord.registered_office_address,
      sic: existingRecord.sic_codes,
      accounts: {
        nextDueDate: existingRecord.accounts_next_due_date,
        lastMadeUpTo: existingRecord.accounts_last_made_up_to,
        overdue: existingRecord.accounts_overdue,
        accountType: existingRecord.accounts_type,
      },
      confirmationStatement: {
        nextDueDate: existingRecord.confirmation_statement_next_due_date,
        lastMadeUpTo: existingRecord.confirmation_statement_last_made_up_to,
        overdue: existingRecord.confirmation_statement_overdue,
      },
      officers: existingRecord.officers_summary || [],
      insolvency: existingRecord.insolvency_details,
      apiAvailable: true,
      degraded: existingRecord.degraded || false,
      events: existingRecord.events || [],
    };
  }

  // Live Companies House call & persist
  try {
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
    const status = mapChStatus(data.company_status);

    const record: CompanyWatchRecord = {
      contractorOrgId,
      companyNumber,
      companyName: data.company_name || companyName,
      companyStatus: status,
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
      officers: [],
      insolvency: data.has_insolvency_history ? { caseType: 'Check Official Register', dates: [], status: 'Requires Review' } : undefined,
      apiAvailable: true,
      degraded: false,
      events: [],
    };

    // Persist to Supabase
    await dbQuery(`company_watch_records`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: {
        id: `cw-${contractorOrgId}`,
        contractor_org_id: contractorOrgId,
        company_number: companyNumber,
        company_name: record.companyName,
        company_status: record.companyStatus,
        incorporation_date: record.incorporationDate,
        registered_office_address: record.registeredOfficeAddress,
        sic_codes: record.sic,
        accounts_next_due_date: record.accounts.nextDueDate,
        accounts_last_made_up_to: record.accounts.lastMadeUpTo,
        accounts_overdue: record.accounts.overdue,
        accounts_type: record.accounts.accountType,
        confirmation_statement_next_due_date: record.confirmationStatement.nextDueDate,
        confirmation_statement_last_made_up_to: record.confirmationStatement.lastMadeUpTo,
        confirmation_statement_overdue: record.confirmationStatement.overdue,
        insolvency_details: record.insolvency,
        officers_summary: record.officers,
        api_available: true,
        degraded: false,
        last_checked_at: record.lastCheckedAt,
        last_successful_fetch_at: record.lastSuccessfulFetchAt,
        events: record.events,
        updated_at: new Date().toISOString(),
      },
    }).catch(() => {});

    return record;
  } catch (err: any) {
    return {
      contractorOrgId,
      companyNumber,
      companyName,
      companyStatus: existingRecord?.company_status || 'UNVERIFIED',
      lastCheckedAt: new Date().toISOString(),
      accounts: { overdue: false },
      confirmationStatement: { overdue: false },
      apiAvailable: true,
      degraded: true,
      events: [],
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
// ACTIONS & ACKNOWLEDGEMENTS (Persisted in Supabase)
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
  const itemResult = await dbQuery<any[]>(`intelligence_items?id=eq.${encodeURIComponent(intelligenceItemId)}&select=id,version&limit=1`);
  const item = itemResult.data?.[0];
  const version = item?.version || 1;

  const record: ContractorActionRecord = {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    contractorOrgId,
    intelligenceItemId,
    intelligenceItemVersion: version,
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

  // Persist to Supabase
  await dbQuery(`contractor_intelligence_actions`, {
    method: 'POST',
    body: {
      id: record.id,
      contractor_org_id: contractorOrgId,
      intelligence_item_id: intelligenceItemId,
      intelligence_item_version: version,
      action_type: action.actionType,
      assigned_to: action.assignedTo,
      due_date: action.dueDate,
      internal_note: action.internalNote,
      evidence_document_id: action.evidenceDocumentId,
      linked_requirement_id: action.linkedRequirementId,
      not_applicable_reason: action.notApplicableReason,
      created_by: session.personId,
      created_at: record.createdAt,
      is_resolved: false,
    },
  });

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
  const itemResult = await dbQuery<any[]>(`intelligence_items?id=eq.${encodeURIComponent(intelligenceItemId)}&select=id,version&limit=1`);
  const item = itemResult.data?.[0];
  const version = item?.version || 1;

  const ack: AcknowledgementRecord = {
    id: `ack-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    contractorOrgId,
    userId: session.personId,
    intelligenceItemId,
    intelligenceItemVersion: version,
    acknowledgedAt: new Date().toISOString(),
    isInvalidated: false,
  };

  // Persist to Supabase with upsert
  await dbQuery(`contractor_intelligence_acknowledgements?on_conflict=contractor_org_id,intelligence_item_id,intelligence_item_version`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: {
      id: ack.id,
      contractor_org_id: contractorOrgId,
      user_id: session.personId,
      intelligence_item_id: intelligenceItemId,
      intelligence_item_version: version,
      acknowledged_at: ack.acknowledgedAt,
      is_invalidated: false,
    },
  });

  await recordAuditEvent({
    event_type: 'INTELLIGENCE_ACKNOWLEDGED',
    object_type: 'intelligence_item',
    object_id: intelligenceItemId,
    actor_id: session.personId,
    organisation_id: contractorOrgId,
    after_state: { version },
  }).catch(() => {});

  return ack;
}

// ─────────────────────────────────────────────────────────────
// ADMIN — INTELLIGENCE REVIEW (Persisted in Supabase)
// ─────────────────────────────────────────────────────────────

export async function getAllIntelligenceItems(): Promise<NormalisedIntelligenceItem[]> {
  const res = await dbQuery<any[]>(`intelligence_items?order=published_at.desc&limit=100`);
  return (res.data || []).map(mapDbItemToNormalised);
}

export async function getItemsPendingReview(): Promise<NormalisedIntelligenceItem[]> {
  const res = await dbQuery<any[]>(`intelligence_items?review_status=in.(PENDING_REVIEW,REQUIRES_COMPLIANCE_REVIEW)&order=published_at.desc`);
  return (res.data || []).map(mapDbItemToNormalised);
}

export async function adminReviewIntelligenceItem(
  itemId: string,
  decision: 'APPROVED' | 'REJECTED',
  reviewedBy: string,
  notes?: string
): Promise<NormalisedIntelligenceItem> {
  const updatedRes = await dbQuery<any[]>(`intelligence_items?id=eq.${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: {
      review_status: decision,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  const updated = updatedRes.data?.[0];

  await recordAuditEvent({
    event_type: `INTELLIGENCE_REVIEW_${decision}`,
    object_type: 'intelligence_item',
    object_id: itemId,
    actor_id: reviewedBy,
    after_state: { notes, reviewStatus: decision },
  }).catch(() => {});

  return mapDbItemToNormalised(updated || { id: itemId, review_status: decision, reviewed_by: reviewedBy });
}

function mapDbItemToNormalised(raw: any): NormalisedIntelligenceItem {
  return {
    id: raw.id,
    externalId: raw.external_id || raw.id,
    contentHash: raw.content_hash || '',
    version: raw.version || 1,
    title: raw.title,
    entirefmSummary: raw.entirefm_summary,
    whatChanged: raw.what_changed,
    suggestedContractorAction: raw.suggested_contractor_action,
    whyYoureSeeing: raw.why_youre_seeing || [],
    sourceId: raw.source_id,
    sourceName: raw.source_name,
    canonicalUrl: raw.canonical_url,
    authorityTier: raw.authority_tier || 1,
    legalStatus: raw.legal_status || 'NEWS',
    eventType: raw.event_type || 'REGULATORY_CHANGE',
    severity: raw.severity || 'INFORMATION',
    jurisdictions: raw.jurisdictions || ['United Kingdom'],
    tradeTags: raw.trade_tags || [],
    credentialTags: raw.credential_tags || [],
    workTypeTags: raw.work_type_tags || [],
    publishedAt: raw.published_at || raw.created_at,
    updatedAt: raw.updated_at,
    effectiveFrom: raw.effective_from,
    deadlineDate: raw.deadline_date,
    supersedes: raw.supersedes_id,
    rightsLicence: raw.rights_licence || 'OGL v3.0',
    parserVersion: raw.parser_version || '1.0.0',
    fetchedAt: raw.fetched_at || raw.created_at,
    rawSourceHash: raw.raw_source_hash,
    reviewStatus: raw.review_status,
    reviewedBy: raw.reviewed_by,
    reviewedAt: raw.reviewed_at,
    linkedComplianceRequirementIds: raw.linked_compliance_requirement_ids || [],
    audienceRoles: raw.audience_roles || ['CONTRACTOR_ADMIN'],
    secondarySources: raw.secondary_sources || [],
  };
}

// ─────────────────────────────────────────────────────────────
// ADMIN TENDER RADAR — EntireFM Internal Business Development
// Persisted in `public.admin_tender_opportunities`
// STRICT PRODUCT BOUNDARY: NEVER exposed to contractors
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

    const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const serviceKeywords = [service.label.toLowerCase(), ...service.tradeTags.map((t) => t.toLowerCase().replace(/-/g, ' '))];
    const kwHit = serviceKeywords.some((kw) => text.includes(kw));
    if (kwHit && !cpvHit) {
      score += 15;
      if (!matchedServices.includes(service.id)) matchedServices.push(service.id);
      matchReasons.push(`${service.label} — keyword match in notice text`);
    }
  }

  const lowerRegion = (opportunity.buyerRegion || '').toLowerCase();
  if (lowerRegion.includes('england') || lowerRegion.includes('united kingdom') || lowerRegion === '') {
    score += 10;
    matchReasons.push('Within EntireFM operational coverage area');
  }

  if (opportunity.isSmeAppropriate) {
    score += 5;
    matchReasons.push('Suitable for SME contractors');
  }

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
  let endpoint = `admin_tender_opportunities?order=match_score.desc&limit=100`;

  if (filters?.minScore !== undefined) {
    endpoint += `&match_score=gte.${filters.minScore}`;
  }
  if (filters?.bidStage) {
    endpoint += `&bid_stage=eq.${encodeURIComponent(filters.bidStage)}`;
  }

  const res = await dbQuery<any[]>(endpoint);
  let records = (res.data || []).map((r: any) => ({
    id: r.id,
    opportunity: {
      id: r.id,
      ocid: r.ocid,
      source: r.source,
      noticeType: r.notice_type,
      title: r.title,
      description: r.description,
      buyerName: r.buyer_name,
      buyerRegion: r.buyer_region,
      cpvCodes: r.cpv_codes || [],
      isFramework: r.is_framework,
      isSmeAppropriate: r.is_sme_appropriate,
      publishedAt: r.published_at,
      closingDate: r.closing_date,
      contractStartDate: r.contract_start_date,
      contractDurationMonths: r.contract_duration_months,
      estimatedValueGbp: r.estimated_value_gbp,
      estimatedValueFormatted: r.estimated_value_formatted,
      canonicalUrl: r.canonical_url,
      status: r.status,
      awardedToSupplier: r.awarded_to_supplier,
      contentHash: r.content_hash,
      fetchedAt: r.first_seen_at,
      lastSeenAt: r.updated_at,
    },
    matchScore: r.match_score,
    matchedServices: r.matched_services || [],
    matchStrength: r.match_strength,
    matchReasons: r.match_reasons || [],
    cpvMatches: r.cpv_matches || [],
    bidStage: r.bid_stage,
    assignedTo: r.assigned_to,
    internalNotes: r.internal_notes || [],
    deadlineUrgency: computeDeadlineUrgency(r.closing_date),
    firstSeenAt: r.first_seen_at,
    updatedAt: r.updated_at,
  }));

  if (filters?.service) {
    records = records.filter((r) => r.matchedServices.includes(filters.service!));
  }

  return records;
}

export async function upsertTenderOpportunity(opportunity: TenderOpportunity): Promise<EntireFMTenderRecord> {
  const { score, matchedServices, matchStrength, matchReasons, cpvMatches } = scoreTenderForEntireFM(opportunity);
  const deadlineUrgency = computeDeadlineUrgency(opportunity.closingDate);

  const row = {
    id: opportunity.id,
    ocid: opportunity.ocid,
    source: opportunity.source,
    notice_type: opportunity.noticeType,
    title: opportunity.title,
    description: opportunity.description,
    buyer_name: opportunity.buyerName,
    buyer_region: opportunity.buyerRegion,
    cpv_codes: opportunity.cpvCodes,
    is_framework: opportunity.isFramework,
    is_sme_appropriate: opportunity.isSmeAppropriate || false,
    published_at: opportunity.publishedAt,
    closing_date: opportunity.closingDate,
    contract_start_date: opportunity.contractStartDate,
    contract_duration_months: opportunity.contractDurationMonths,
    estimated_value_gbp: opportunity.estimatedValueGbp,
    estimated_value_formatted: opportunity.estimatedValueFormatted,
    canonical_url: opportunity.canonicalUrl,
    status: opportunity.status,
    awarded_to_supplier: opportunity.awardedToSupplier,
    match_score: score,
    matched_services: matchedServices,
    match_strength: matchStrength,
    match_reasons: matchReasons,
    cpv_matches: cpvMatches,
    deadline_urgency: deadlineUrgency,
    content_hash: opportunity.contentHash,
    raw_payload: opportunity.rawPayload,
    updated_at: new Date().toISOString(),
  };

  await dbQuery(`admin_tender_opportunities`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: row,
  });

  return {
    id: opportunity.id,
    opportunity,
    matchScore: score,
    matchedServices,
    matchStrength,
    matchReasons,
    cpvMatches,
    bidStage: 'NEW',
    internalNotes: [],
    deadlineUrgency,
    firstSeenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
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
  const existingRes = await dbQuery<any[]>(`admin_tender_opportunities?id=eq.${encodeURIComponent(tenderId)}&limit=1`);
  const existing = existingRes.data?.[0];
  if (!existing) throw new Error(`Tender record not found: ${tenderId}`);

  const existingNotes: InternalTenderNote[] = existing.internal_notes || [];
  const updatedNotes = update.note
    ? [
        ...existingNotes,
        {
          id: `note-${Date.now()}`,
          tenderId,
          note: update.note,
          createdBy: update.addedBy || 'EntireFM Team',
          createdAt: new Date().toISOString(),
        },
      ]
    : existingNotes;

  const patchBody: any = {
    updated_at: new Date().toISOString(),
    internal_notes: updatedNotes,
  };
  if (update.bidStage) patchBody.bid_stage = update.bidStage;
  if (update.assignedTo !== undefined) patchBody.assigned_to = update.assignedTo;

  await dbQuery(`admin_tender_opportunities?id=eq.${encodeURIComponent(tenderId)}`, {
    method: 'PATCH',
    body: patchBody,
  });

  return {
    id: tenderId,
    opportunity: {
      id: existing.id,
      ocid: existing.ocid,
      source: existing.source,
      noticeType: existing.notice_type,
      title: existing.title,
      description: existing.description,
      buyerName: existing.buyer_name,
      buyerRegion: existing.buyer_region,
      cpvCodes: existing.cpv_codes || [],
      isFramework: existing.is_framework,
      publishedAt: existing.published_at,
      closingDate: existing.closing_date,
      canonicalUrl: existing.canonical_url,
      status: existing.status,
      contentHash: existing.content_hash,
      fetchedAt: existing.first_seen_at,
      lastSeenAt: new Date().toISOString(),
    },
    matchScore: existing.match_score,
    matchedServices: existing.matched_services || [],
    matchStrength: existing.match_strength,
    matchReasons: existing.match_reasons || [],
    cpvMatches: existing.cpv_matches || [],
    bidStage: update.bidStage || existing.bid_stage,
    assignedTo: update.assignedTo !== undefined ? update.assignedTo : existing.assigned_to,
    internalNotes: updatedNotes,
    deadlineUrgency: computeDeadlineUrgency(existing.closing_date),
    firstSeenAt: existing.first_seen_at,
    updatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// LIVE INGESTION PIPELINE (Persists real external data)
// ─────────────────────────────────────────────────────────────

export interface IngestionSummaryReport {
  timestamp: string;
  sourcesProcessed: number;
  totalItemsFetched: number;
  totalItemsCreated: number;
  totalTendersFetched: number;
  totalTendersCreated: number;
  errors: string[];
}

export async function runLiveIngestion(sourceId?: string): Promise<IngestionSummaryReport> {
  const report: IngestionSummaryReport = {
    timestamp: new Date().toISOString(),
    sourcesProcessed: 0,
    totalItemsFetched: 0,
    totalItemsCreated: 0,
    totalTendersFetched: 0,
    totalTendersCreated: 0,
    errors: [],
  };

  // 1. GOV.UK Search Ingestion
  if (!sourceId || sourceId === 'src-govuk-search') {
    const started = Date.now();
    try {
      const { items } = await fetchGovUkSearch(['building safety', 'fire safety', 'f-gas', 'asbestos', 'electrical safety']);
      report.sourcesProcessed++;
      report.totalItemsFetched += items.length;

      for (const item of items) {
        const row = {
          id: item.id,
          external_id: item.externalId,
          content_hash: item.contentHash,
          version: item.version,
          title: item.title,
          entirefm_summary: item.entirefmSummary,
          suggested_contractor_action: item.suggestedContractorAction,
          source_id: item.sourceId,
          source_name: item.sourceName,
          canonical_url: item.canonicalUrl,
          authority_tier: item.authorityTier,
          legal_status: item.legalStatus,
          event_type: item.eventType,
          severity: item.severity,
          jurisdictions: item.jurisdictions,
          trade_tags: item.tradeTags,
          credential_tags: item.credentialTags,
          work_type_tags: item.workTypeTags,
          published_at: item.publishedAt,
          rights_licence: item.rightsLicence,
          parser_version: item.parserVersion,
          fetched_at: item.fetchedAt,
          raw_source_hash: item.rawSourceHash,
          review_status: item.reviewStatus,
          audience_roles: item.audienceRoles,
        };

        await dbQuery(`intelligence_items`, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: row,
        });
        report.totalItemsCreated++;
      }

      await logIngestionRun('src-govuk-search', 'GOV.UK Search', started, 'success', items.length, items.length);
    } catch (e: any) {
      report.errors.push(`GOV.UK Search: ${e.message}`);
      await logIngestionRun('src-govuk-search', 'GOV.UK Search', started, 'failed', 0, 0, e.message);
    }
  }

  // 2. legislation.gov.uk Feed
  if (!sourceId || sourceId === 'src-legislation-uk') {
    const started = Date.now();
    try {
      const items = await fetchLegislationUkFeed();
      report.sourcesProcessed++;
      report.totalItemsFetched += items.length;

      for (const item of items) {
        const row = {
          id: item.id,
          external_id: item.externalId,
          content_hash: item.contentHash,
          version: item.version,
          title: item.title,
          entirefm_summary: item.entirefmSummary,
          suggested_contractor_action: item.suggestedContractorAction,
          source_id: item.sourceId,
          source_name: item.sourceName,
          canonical_url: item.canonicalUrl,
          authority_tier: item.authorityTier,
          legal_status: item.legalStatus,
          event_type: item.eventType,
          severity: item.severity,
          jurisdictions: item.jurisdictions,
          trade_tags: item.tradeTags,
          published_at: item.publishedAt,
          rights_licence: item.rightsLicence,
          parser_version: item.parserVersion,
          fetched_at: item.fetchedAt,
          raw_source_hash: item.rawSourceHash,
          review_status: item.reviewStatus,
          audience_roles: item.audienceRoles,
        };

        await dbQuery(`intelligence_items`, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: row,
        });
        report.totalItemsCreated++;
      }

      await logIngestionRun('src-legislation-uk', 'legislation.gov.uk', started, 'success', items.length, items.length);
    } catch (e: any) {
      report.errors.push(`legislation.gov.uk: ${e.message}`);
      await logIngestionRun('src-legislation-uk', 'legislation.gov.uk', started, 'failed', 0, 0, e.message);
    }
  }

  // 3. HSE Press Wire
  if (!sourceId || sourceId === 'src-hse-public') {
    const started = Date.now();
    try {
      const items = await fetchHseMediaWire();
      report.sourcesProcessed++;
      report.totalItemsFetched += items.length;

      for (const item of items) {
        const row = {
          id: item.id,
          external_id: item.externalId,
          content_hash: item.contentHash,
          version: item.version,
          title: item.title,
          entirefm_summary: item.entirefmSummary,
          suggested_contractor_action: item.suggestedContractorAction,
          source_id: item.sourceId,
          source_name: item.sourceName,
          canonical_url: item.canonicalUrl,
          authority_tier: item.authorityTier,
          legal_status: item.legalStatus,
          event_type: item.eventType,
          severity: item.severity,
          jurisdictions: item.jurisdictions,
          trade_tags: item.tradeTags,
          published_at: item.publishedAt,
          rights_licence: item.rightsLicence,
          parser_version: item.parserVersion,
          fetched_at: item.fetchedAt,
          raw_source_hash: item.rawSourceHash,
          review_status: item.reviewStatus,
          audience_roles: item.audienceRoles,
        };

        await dbQuery(`intelligence_items`, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: row,
        });
        report.totalItemsCreated++;
      }

      await logIngestionRun('src-hse-public', 'HSE Public Press Wire', started, 'success', items.length, items.length);
    } catch (e: any) {
      report.errors.push(`HSE Press Wire: ${e.message}`);
      await logIngestionRun('src-hse-public', 'HSE Public Press Wire', started, 'failed', 0, 0, e.message);
    }
  }

  // 4. OPSS Product Safety
  if (!sourceId || sourceId === 'src-opss-public') {
    const started = Date.now();
    try {
      const items = await fetchOpssProductSafety();
      report.sourcesProcessed++;
      report.totalItemsFetched += items.length;

      for (const item of items) {
        const row = {
          id: item.id,
          external_id: item.externalId,
          content_hash: item.contentHash,
          version: item.version,
          title: item.title,
          entirefm_summary: item.entirefmSummary,
          suggested_contractor_action: item.suggestedContractorAction,
          source_id: item.sourceId,
          source_name: item.sourceName,
          canonical_url: item.canonicalUrl,
          authority_tier: item.authorityTier,
          legal_status: item.legalStatus,
          event_type: item.eventType,
          severity: item.severity,
          jurisdictions: item.jurisdictions,
          trade_tags: item.tradeTags,
          published_at: item.publishedAt,
          rights_licence: item.rightsLicence,
          parser_version: item.parserVersion,
          fetched_at: item.fetchedAt,
          raw_source_hash: item.rawSourceHash,
          review_status: item.reviewStatus,
          audience_roles: item.audienceRoles,
        };

        await dbQuery(`intelligence_items`, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: row,
        });
        report.totalItemsCreated++;
      }

      await logIngestionRun('src-opss-public', 'OPSS Product Safety', started, 'success', items.length, items.length);
    } catch (e: any) {
      report.errors.push(`OPSS Product Safety: ${e.message}`);
      await logIngestionRun('src-opss-public', 'OPSS Product Safety', started, 'failed', 0, 0, e.message);
    }
  }

  // 5. Contracts Finder OCDS — Admin Only
  if (!sourceId || sourceId === 'src-contracts-finder') {
    const started = Date.now();
    try {
      const tenders = await fetchContractsFinderOcds();
      report.sourcesProcessed++;
      report.totalTendersFetched += tenders.length;

      for (const t of tenders) {
        await upsertTenderOpportunity(t);
        report.totalTendersCreated++;
      }

      await logIngestionRun('src-contracts-finder', 'Contracts Finder OCDS', started, 'success', tenders.length, tenders.length);
    } catch (e: any) {
      report.errors.push(`Contracts Finder: ${e.message}`);
      await logIngestionRun('src-contracts-finder', 'Contracts Finder OCDS', started, 'failed', 0, 0, e.message);
    }
  }

  // 6. Find a Tender OCDS — Admin Only
  if (!sourceId || sourceId === 'src-find-a-tender') {
    const started = Date.now();
    try {
      const tenders = await fetchFindATenderOcds();
      report.sourcesProcessed++;
      report.totalTendersFetched += tenders.length;

      for (const t of tenders) {
        await upsertTenderOpportunity(t);
        report.totalTendersCreated++;
      }

      await logIngestionRun('src-find-a-tender', 'Find a Tender OCDS', started, 'success', tenders.length, tenders.length);
    } catch (e: any) {
      report.errors.push(`Find a Tender: ${e.message}`);
      await logIngestionRun('src-find-a-tender', 'Find a Tender OCDS', started, 'failed', 0, 0, e.message);
    }
  }

  return report;
}

async function logIngestionRun(
  sourceId: string,
  sourceName: string,
  startedAtMs: number,
  status: 'success' | 'failed' | 'partial',
  recordsFetched: number,
  recordsCreated: number,
  error?: string
) {
  const durationMs = Date.now() - startedAtMs;
  await dbQuery(`intelligence_ingestion_runs`, {
    method: 'POST',
    body: {
      id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source_id: sourceId,
      source_name: sourceName,
      started_at: new Date(startedAtMs).toISOString(),
      completed_at: new Date().toISOString(),
      duration_ms: durationMs,
      status,
      records_fetched: recordsFetched,
      records_created: recordsCreated,
      error,
      parser_version: '1.0.0',
    },
  }).catch(() => {});
}

// ─────────────────────────────────────────────────────────────
// ADMIN SUMMARY (Computed from real Supabase data)
// ─────────────────────────────────────────────────────────────

export async function getAdminIntelligenceSummary() {
  const [itemsPendingRes, newEventsRes, tendersRes, sources] = await Promise.all([
    dbQuery<any[]>(`intelligence_items?review_status=in.(PENDING_REVIEW,REQUIRES_COMPLIANCE_REVIEW)&select=id`),
    dbQuery<any[]>(`intelligence_items?review_status=eq.APPROVED&authority_tier=eq.1&published_at=gte.${new Date(Date.now() - 7 * 86400000).toISOString()}&select=id`),
    dbQuery<any[]>(`admin_tender_opportunities?bid_stage=eq.NEW&select=id,deadline_urgency`),
    sourceRegistry.getAllSources(),
  ]);

  const pendingCount = itemsPendingRes.data?.length || 0;
  const newEventsCount = newEventsRes.data?.length || 0;
  const newTenders = tendersRes.data || [];
  const imminentTenders = newTenders.filter((t: any) => t.deadline_urgency === 'IMMINENT').length;

  return {
    requiresComplianceReview: pendingCount,
    newRegulatoryEvents: newEventsCount,
    newTenderMatches: newTenders.length,
    imminentTenderDeadlines: imminentTenders,
    sourceHealthIssues: sources.filter((s) => s.healthStatus === 'FAILED' || s.healthStatus === 'DEGRADED').length,
    sourceCredentialRequired: sources.filter((s) => s.healthStatus === 'CREDENTIAL_REQUIRED').length,
  };
}
