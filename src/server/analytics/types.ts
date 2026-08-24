export type AnalyticsPeriod =
  | 'today'
  | 'yesterday'
  | '7d'
  | '30d'
  | '90d'
  | 'this_month'
  | 'prev_month'
  | 'this_year'
  | 'custom';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  prevStartDate: string;
  prevEndDate: string;
  label: string;
}

export interface IntegrationStatus {
  ga4: {
    connected: boolean;
    propertyId?: string;
    message?: string;
  };
  searchConsole: {
    connected: boolean;
    siteUrl?: string;
    message?: string;
  };
  database: {
    connected: boolean;
    message?: string;
  };
  vercelAnalytics: {
    connected: boolean;
    message?: string;
  };
}

export interface MetricDelta {
  current: number;
  previous: number;
  changePct: number | null; // percentage change, e.g. +18.4
  trend: 'up' | 'down' | 'flat';
}

export interface TimeSeriesPoint {
  date: string;
  users?: number;
  sessions?: number;
  pageViews?: number;
  enquiries?: number;
  organicClicks?: number;
  organicImpressions?: number;
}

export interface TrafficSourceItem {
  channel: string;
  sessions: number;
  users: number;
  sharePct: number;
  enquiries: number;
  conversionRate: number | null;
}

export interface ReferringSiteItem {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  enquiries: number;
}

export interface PagePerformanceItem {
  path: string;
  pageType: 'service' | 'location' | 'sector' | 'tool' | 'resource' | 'blog' | 'portal' | 'general';
  title?: string;
  views: number;
  users: number;
  sessions: number;
  avgEngagementTimeSecs: number;
  enquiries: number;
  conversionRate: number | null;
}

export interface ServicePerformanceItem {
  serviceName: string;
  canonicalPath: string;
  sessions: number;
  enquiries: number;
  conversionRate: number | null;
  qualifiedLeads: number;
}

export interface LocationPerformanceItem {
  locationName: string;
  canonicalPath: string;
  organicClicks: number;
  organicImpressions: number;
  sessions: number;
  enquiries: number;
  conversionRate: number | null;
}

export interface SearchQueryItem {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // percentage
  position: number;
}

export interface SearchPageItem {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  sessions?: number;
  enquiries?: number;
  conversionRate?: number | null;
}

export interface SeoOpportunity {
  id: string;
  type:
    | 'HIGH_IMPRESSIONS_LOW_CTR'
    | 'RANKING_POSITION_4_15'
    | 'HIGH_TRAFFIC_LOW_CONVERSION'
    | 'HIGH_CONVERSION_LOW_TRAFFIC'
    | 'DECLINING_PAGE';
  title: string;
  target: string;
  reason: string;
  recommendation: string;
  impact: 'HIGH' | 'MEDIUM' | 'QUICK_WIN';
  metrics: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    position?: number;
    sessions?: number;
    enquiries?: number;
    conversionRate?: number;
  };
}

export interface ToolPerformanceItem {
  toolId: string;
  toolName: string;
  path: string;
  views: number;
  starts: number;
  completions: number;
  completionRate: number | null;
  enquiries: number;
  conversionRate: number | null;
}

export interface AnalyticsSummary {
  period: AnalyticsPeriod;
  dateRange: DateRange;
  integrations: IntegrationStatus;
  lastUpdated: string;
  kpis: {
    users: MetricDelta;
    sessions: MetricDelta;
    pageViews: MetricDelta;
    engagementRate: MetricDelta;
    enquiries: MetricDelta;
    qualifiedLeads: MetricDelta;
    conversionRate: MetricDelta;
    organicClicks: MetricDelta;
    organicImpressions: MetricDelta;
    avgCtr: MetricDelta;
    avgPosition: MetricDelta;
  };
  timeSeries: TimeSeriesPoint[];
  trafficSources: TrafficSourceItem[];
  referringSites: ReferringSiteItem[];
  topPages: PagePerformanceItem[];
  servicePerformance: ServicePerformanceItem[];
  locationPerformance: LocationPerformanceItem[];
  searchQueries: SearchQueryItem[];
  searchLandingPages: SearchPageItem[];
  seoOpportunities: SeoOpportunity[];
  toolPerformance: ToolPerformanceItem[];
  deviceBreakdown: {
    desktopPct: number;
    mobilePct: number;
    tabletPct: number;
  };
  geographicBreakdown: Array<{
    country: string;
    city?: string;
    users: number;
    sessions: number;
  }>;
}
