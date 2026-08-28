/**
 * ENTIREFM — THE LOBBY DAILY PUBLISHING SYSTEM
 * ============================================
 * Canonical TypeScript definitions for The Lobby Daily morning briefing.
 * Positioning: "What changed. Why it matters. What to do next."
 */

export type EditionStatus =
  | 'DRAFT'
  | 'AWAITING_APPROVAL'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'PAUSED'
  | 'FAILED'
  | 'CANCELLED';

export type ImageRightsStatus =
  | 'OWNED'
  | 'LICENSED'
  | 'PRESS_ASSET_APPROVED'
  | 'OPEN_ATTRIBUTION'
  | 'MANUALLY_APPROVED'
  | 'RESTRICTED'
  | 'UNKNOWN';

export type SubscriptionFrequency =
  | 'DAILY_LOBBY'
  | 'WEEKLY_BRIEFING'
  | 'COMPLIANCE_ALERTS'
  | 'CONTRACTS_OPPORTUNITIES';

export interface ImageProvenanceRecord {
  imageUrl: string;
  imageAlt: string;
  imageRightsStatus: ImageRightsStatus;
  imageRightsBasis?: string;
  imageCredit?: string;
  originalSourceImageUrl?: string;
  isCuratedFallback?: boolean;
}

export interface MastheadData {
  editionNumber: number;
  ukDateFormatted: string; // e.g. "Friday 28 August 2026"
  estimatedReadingMinutes: number;
  browserViewUrl: string;
  publicationName: string; // "THE LOBBY DAILY"
  publisherName: string;   // "EntireFM"
}

export interface LeadStory {
  id: string;
  categoryLabel: string;
  headline: string;
  summary: string; // 60–90 words
  whyItMatters: string; // Operational takeaway
  sourceName: string;
  sourceUrl: string;
  image: ImageProvenanceRecord;
  ctaText?: string;
  ctaUrl?: string;
}

export interface MorningBriefItem {
  id: string;
  headline: string;
  oneSentenceSummary: string;
  sourceName: string;
  sourceUrl: string;
  category?: string;
}

export interface WhatChangedStory {
  id: string;
  category: string;
  headline: string;
  summary: string; // 35–60 words
  sourceName: string;
  sourceUrl: string;
  image: ImageProvenanceRecord;
  ctaText?: string;
  ctaUrl?: string;
}

export interface ComplianceWatchItem {
  id: string;
  regulationOrStandard: string;
  effectiveOrPublishedDate: string;
  whoItAffects: string;
  requiredOperationalAction: string;
  authoritativeSource: string;
  authoritativeUrl: string;
}

export interface ContractStory {
  id: string;
  headline: string;
  buyerAuthority?: string;
  supplierWinner?: string;
  contractValue?: string; // Only populated if officially confirmed
  termOrScope?: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
}

export interface EngineersNote {
  title: string;
  observation: string; // Technically credible, specific M&E/plant observation
  authorName: string;
  authorRole: string;
}

export interface HorizonEvent {
  title: string;
  dateOrDeadline: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
}

export interface UsefulResource {
  title: string;
  description: string;
  resourceType: 'TOOL' | 'CHECKLIST' | 'GUIDE' | 'CALCULATOR' | 'LOBBY_ROOM';
  linkUrl: string;
  linkText: string;
}

export interface SponsorBlock {
  enabled: boolean;
  sponsorName: string;
  headline: string;
  body: string;
  destinationUrl: string;
  sponsorLogoUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  disclaimer: string; // "Sponsored"
}

export interface FooterDetails {
  unsubscribeUrl: string;
  preferencesUrl: string;
  privacyNoticeUrl: string;
  legalEntity: string; // "EntireFM Ltd, Registered in England & Wales"
  registeredAddress: string;
  contactEmail: string;
  recipientEmail: string;
  receiveReason: string; // "You are receiving this because you subscribed to The Lobby Daily."
}

export interface LobbyDailyEdition {
  id: string;
  editionNumber: number;
  editionDate: string; // YYYY-MM-DD
  slug: string;
  status: EditionStatus;
  
  subjectLine: string;
  preheader: string;
  readingTimeMinutes: number;
  
  // 10 Structured Editorial Sections
  masthead: MastheadData;
  leadStory: LeadStory;
  morningBrief: MorningBriefItem[];
  whatChangedToday: WhatChangedStory[];
  complianceWatch?: ComplianceWatchItem | null; // Omitted if no verified item
  contractsMobilisations: ContractStory[];      // Up to 2 verified stories
  engineersNote: EngineersNote;
  onTheHorizon?: HorizonEvent | null;           // Omitted if no milestone
  oneUsefulThing: UsefulResource;
  sponsorBlock?: SponsorBlock | null;          // Disabled by default
  footer: FooterDetails;
  
  validationPassed: boolean;
  validationReport: {
    errors: string[];
    warnings: string[];
    verifiedLinks: Array<{ url: string; status: number; valid: boolean }>;
  };
  
  approvedByAdminId?: string;
  approvedAt?: string;
  scheduledSendAt?: string;
  sentAt?: string;
  editorialAuditTrail: Array<{
    action: string;
    adminId: string;
    timestamp: string;
    details?: string;
  }>;
  
  utmCampaign: string;
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
  totalBounced: number;
  totalComplaints: number;
  storyClickMetrics: Record<string, number>;
  
  isIndexableWebEdition: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface CandidateStory {
  id: string;
  sourceId: string;
  publisherName: string;
  authorityTier: number;
  sourceUrl: string;
  canonicalUrl: string;
  normalizedHeadline: string;
  originalHeadline: string;
  publishedAt: string;
  ingestedAt: string;
  category: string;
  summary?: string;
  operationalTakeaway?: string;
  originalImageUrl?: string;
  resolvedImageUrl: string;
  imageRightsStatus: ImageRightsStatus;
  imageRightsBasis?: string;
  imageCredit?: string;
  imageAlt?: string;
  sourceConfidence: number;
  isDuplicate: boolean;
  duplicateOfId?: string;
  rejectionReason?: string;
  usedInEditionId?: string;
  assignedSection?: 'LEAD' | 'MORNING_BRIEF' | 'WHAT_CHANGED' | 'COMPLIANCE' | 'CONTRACTS';
  isManuallyExcluded: boolean;
  contractValue?: string;
  buyerAuthority?: string;
  supplierWinner?: string;
  createdAt: string;
}

export interface LobbyDailySettings {
  id: string;
  sendScheduleType: 'WEEKDAYS_ONLY' | 'EVERYDAY';
  sendTimeLondon: string; // "06:45"
  timezone: string; // "Europe/London"
  minStoriesPerEdition: number;
  maxStoriesPerEdition: number;
  autoSendEnabled: boolean;
  manualApprovalRequired: boolean;
  emergencyKillSwitch: boolean;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  sponsorEnabled: boolean;
  sponsorConfig: Partial<SponsorBlock>;
  sourceAllowlist: string[];
  sourceBlocklist: string[];
  updatedByAdminId?: string;
  updatedAt: string;
}
