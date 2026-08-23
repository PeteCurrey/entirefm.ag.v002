export type IntegrationStatus = 'CONNECTED' | 'NOT_CONNECTED' | 'SYNCING' | 'ERROR';

export type OpportunityDecision =
  | 'UPDATE_EXISTING'
  | 'EXPAND_EXISTING'
  | 'IMPROVE_METADATA'
  | 'IMPROVE_INTERNAL_LINKING'
  | 'ADD_FAQ'
  | 'ADD_VISUAL_CONTENT'
  | 'CREATE_NEW_RESOURCE'
  | 'CREATE_NEW_ARTICLE'
  | 'CREATE_TOOL'
  | 'NO_ACTION'
  | 'HUMAN_REVIEW';

export type OpportunityPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type OpportunityOrigin =
  | 'SEARCH_CONSOLE'
  | 'ANALYTICS'
  | 'CONTENT_DECAY'
  | 'CONTENT_GAP'
  | 'EDITOR_IDEA'
  | 'COMPETITOR_OBSERVATION'
  | 'COMPLIANCE_CHANGE'
  | 'MANUAL_IDEA';

export type TopicCluster =
  | 'AI_TECHNOLOGY'
  | 'PPM_MAINTENANCE'
  | 'COMPLIANCE'
  | 'ME_ENGINEERING'
  | 'HVAC'
  | 'CLEANING'
  | 'FM_PROCUREMENT'
  | 'FM_FUNDAMENTALS'
  | 'SECTORS'
  | 'LOCATIONS'
  | 'ENTIRECAFM';

export type ContentFreshness =
  | 'CURRENT'
  | 'REVIEW_SOON'
  | 'STALE'
  | 'UPDATE_REQUIRED'
  | 'EVERGREEN';

export interface SeoQueryPerformanceRecord {
  query: string;
  pagePath: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  periodStart: string;
  periodEnd: string;
  country?: string;
  device?: string;
}

export interface ContentDecayRecord {
  pagePath: string;
  topic: string;
  currentClicks: number;
  previousClicks: number;
  currentImpressions: number;
  previousImpressions: number;
  currentPosition: number;
  previousPosition: number;
  changeDescription: string;
  lastUpdated: string;
  recommendedAction: string;
  priority: OpportunityPriority;
}

export interface CannibalisationRecord {
  query: string;
  type: 'INTENTIONAL_MULTI_PAGE_CLUSTER' | 'ACCIDENTAL_CANNIBALISATION';
  pages: Array<{ path: string; impressions: number; clicks: number; position: number; title: string }>;
  recommendedAction: string;
  isProblem: boolean;
}

export interface ContentOpportunityItem {
  id: string;
  opportunityType: 'HIGH_IMP_LOW_POS' | 'HIGH_IMP_LOW_CTR' | 'CONTENT_DECAY' | 'NEW_GAP' | 'CANNIBALISATION' | 'REGULATORY_CHANGE';
  query?: string;
  targetPagePath?: string;
  originSource: OpportunityOrigin;
  decision: OpportunityDecision;
  priority: OpportunityPriority;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED' | 'SNOOZED';
  currentClicks?: number;
  currentImpressions?: number;
  currentCtr?: number;
  currentPosition?: number;
  recommendedAction: string;
  suggestedTitle?: string;
  suggestedMeta?: string;
  suggestedFaqJson?: Array<{ question: string; answer: string }>;
  createdAt: string;
}

export interface TopicClusterPerformance {
  cluster: TopicCluster;
  name: string;
  totalPages: number;
  organicClicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
  leads: number;
  trend: 'RISING' | 'STABLE' | 'DECLINING';
  topPage: string;
  weakestPage: string;
  newOpportunitiesCount: number;
}

export interface ContentConversionMetric {
  pagePath: string;
  title: string;
  contentType: string;
  organicEntrances: number;
  serviceClicks: number;
  toolClicks: number;
  ctaClicks: number;
  contactStarts: number;
  leadSubmissions: number;
  assistedLeads: number;
  lastCalculatedAt: string;
}

export interface WeeklyIntelligenceBriefing {
  weekStarting: string;
  whatGrew: Array<{ pageOrQuery: string; change: string }>;
  whatDeclined: Array<{ pageOrQuery: string; change: string }>;
  newSearchQueries: Array<{ query: string; impressions: number; bestPage: string }>;
  topOpportunities: ContentOpportunityItem[];
  pagesToUpdate: Array<{ pagePath: string; reason: string; priority: OpportunityPriority }>;
  ctrOpportunities: Array<{ pagePath: string; currentCtr: number; suggestedTitle: string }>;
  cannibalisationWarnings: CannibalisationRecord[];
  blogPerformanceSummary: string;
  resourcePerformanceSummary: string;
  leadsFromContent: number;
  recommendedArticlesThisWeek: Array<{
    title: string;
    mixCategory: 'SEARCH_DEMAND' | 'FM_DEVELOPMENT' | 'EVERGREEN_GUIDE' | 'TECH_AI_COMMERCIAL' | 'SPECIALIST_SECTOR';
    rationale: string;
    targetIntent: string;
    actionType: 'NEW_ARTICLE' | 'UPDATE_EXISTING';
    existingUrl?: string;
  }>;
}

export interface CompetitorContentGap {
  topic: string;
  competitorsCovering: string[];
  entireFmCoverage: 'NONE' | 'THIN' | 'SUBSTANTIAL';
  searchRelevance: string;
  commercialRelevance: string;
  recommendedAction: string;
  priority: OpportunityPriority;
}

export interface ContentFreshnessItem {
  pagePath: string;
  title: string;
  freshnessStatus: ContentFreshness;
  lastUpdated: string;
  signals: string[];
  suggestedAction: string;
}

export interface InternalLinkRecommendation {
  sourcePage: string;
  targetPage: string;
  suggestedAnchor: string;
  contextSnippet: string;
  relevanceReason: string;
}
