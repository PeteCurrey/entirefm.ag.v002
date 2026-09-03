/**
 * ENTIREFM GROWTH & CONVERSION INTELLIGENCE TYPES
 * ===============================================
 */

export type QualificationStatus =
  | 'NEW'
  | 'REVIEWING'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'UNQUALIFIED'
  | 'OPPORTUNITY'
  | 'PROPOSAL'
  | 'WON'
  | 'LOST'
  | 'SPAM'
  | 'DUPLICATE'
  | 'TEST';

export type MarketingChannel =
  | 'ORGANIC_SEARCH'
  | 'PAID_SEARCH'
  | 'DIRECT'
  | 'EMAIL'
  | 'REFERRAL'
  | 'SOCIAL'
  | 'NEWSLETTER'
  | 'INTERNAL_TOOL'
  | 'OTHER'
  | 'UNKNOWN';

export interface JourneyStep {
  path: string;
  pageType?: string;
  timestamp: string;
  sourceContext?: string;
}

export interface ExtendedLead {
  id: string;
  enquiry_id: string;
  received_at: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  location?: string;
  message: string;
  
  // Attribution & Origin
  landing_page?: string;
  conversion_page?: string;
  page_type?: string;
  first_touch_url?: string;
  last_touch_url?: string;
  first_touch_referrer?: string;
  last_touch_referrer?: string;
  form_id?: string;
  form_page?: string;
  journey_trail?: JourneyStep[];
  assisted_pages?: string[];
  
  // Marketing & UTM
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  msclkid?: string;
  session_id?: string;
  marketing_channel?: MarketingChannel;
  lead_source?: string;
  
  // Commercial Handling & Status
  status: string;
  qualification_status: QualificationStatus;
  lead_priority?: 'HIGH' | 'MEDIUM' | 'STANDARD';
  drone_brief?: any;
  assigned_to?: string;
  notes?: string;
  estimated_value_gbp?: number;
  sector_interest?: string;
  location_interest?: string;
  is_test?: boolean;
  is_spam?: boolean;
  spam_score?: number;
  spam_flags?: string[];
  spam_status?: 'CLEAN' | 'NEEDS_REVIEW' | 'SPAM_SUSPECTED' | 'CONFIRMED_SPAM' | 'CONFIRMED_GENUINE';
  submission_ip?: string | null;
  submission_duration_ms?: number | null;
  turnstile_verified?: boolean;
  duplicate_of?: string | null;
  notification_dispatched?: boolean;
}

export interface CommercialOpportunity {
  id: string;
  lead_id?: string;
  company: string;
  service: string;
  location: string;
  estimated_value_gbp: number | null;
  stage: 'QUALIFIED' | 'PROPOSAL_PREPARATION' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';
  probability_pct: number;
  expected_close_date?: string;
  owner?: string;
  won_lost_reason?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface GrowthOverviewMetrics {
  period: string;
  totalEnquiries: number;
  qualifiedLeads: number;
  organicLeads: number;
  qualificationRatePct: number;
  conversionRatePct: number;
  contactFormStarts: number;
  contactFormSubmits: number;
  toolCompletions: number;
  newsletterSubscribers: number;
  commercialCtaClicks: number;
  assistedConversions: number;
  openOpportunitiesCount: number;
  wonOpportunitiesCount: number;
  pipelineValueGbp: number;
  wonRevenueGbp: number;
  hasRealRevenueData: boolean;
}

export interface PageCommercialPerformance {
  path: string;
  pageType: string;
  title?: string;
  sessions: number;
  organicSessions: number;
  searchImpressions?: number;
  avgPosition?: number;
  ctaClicks: number;
  formStarts: number;
  leadsCount: number;
  qualifiedLeadsCount: number;
  assistedLeadsCount: number;
  conversionRatePct: number;
  pipelineValueGbp: number;
}

export interface DimensionPerformance {
  key: string;
  label: string;
  sessions: number;
  organicSessions: number;
  ctaClicks: number;
  formStarts: number;
  leadsCount: number;
  qualifiedLeadsCount: number;
  conversionRatePct: number;
  assistedCount: number;
  pipelineValueGbp: number;
}

export interface FunnelStage {
  stageNumber: number;
  name: string;
  visitors: number;
  dropOffCount: number;
  conversionRatePct: number;
}

export interface FunnelData {
  id: string;
  name: string;
  description: string;
  stages: FunnelStage[];
  overallConversionRatePct: number;
}

export interface CommercialRecommendation {
  id: string;
  type:
    | 'SEO_IMPROVEMENT'
    | 'CTA_IMPROVEMENT'
    | 'FORM_IMPROVEMENT'
    | 'INTERNAL_LINK'
    | 'CONTENT_EXPANSION'
    | 'TOOL_PROMOTION'
    | 'SERVICE_PAGE_IMPROVEMENT'
    | 'GEO_PAGE_IMPROVEMENT'
    | 'PAID_SEARCH_CANDIDATE'
    | 'NO_ACTION';
  priority: 'P1' | 'P2' | 'P3';
  pagePath: string;
  title: string;
  observation: string;
  recommendation: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'APPLIED';
}
