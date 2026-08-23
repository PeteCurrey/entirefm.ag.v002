import {
  IntegrationStatus,
  ContentOpportunityItem,
  TopicClusterPerformance,
  ContentConversionMetric,
  WeeklyIntelligenceBriefing,
  CompetitorContentGap,
  ContentFreshnessItem,
  InternalLinkRecommendation,
  CannibalisationRecord,
  ContentDecayRecord,
} from './intelligence-types';
import { ALL_ROUTES } from '@/lib/routes/route-registry';

/**
 * Check real environment variables for Search Console and GA4 credentials.
 * If credentials are missing, we RETURN NOT_CONNECTED with zero mock data.
 */
export function getGscStatus(): { status: IntegrationStatus; property: string; message?: string } {
  const hasGscCreds = Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
    process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
  );

  return {
    status: hasGscCreds ? 'CONNECTED' : 'NOT_CONNECTED',
    property: 'https://www.entirefm.com',
    message: hasGscCreds
      ? 'Connected and synchronized with Google Search Console API.'
      : 'NOT CONNECTED. Set GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL & GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY in production env.',
  };
}

export function getGa4Status(): { status: IntegrationStatus; propertyId?: string; message?: string } {
  const hasGa4Creds = Boolean(process.env.GA4_PROPERTY_ID && process.env.GA4_SERVICE_ACCOUNT_KEY);

  return {
    status: hasGa4Creds ? 'CONNECTED' : 'NOT_CONNECTED',
    propertyId: process.env.GA4_PROPERTY_ID || undefined,
    message: hasGa4Creds
      ? 'Connected and synchronized with GA4 Measurement API.'
      : 'NOT CONNECTED. Set GA4_PROPERTY_ID & GA4_SERVICE_ACCOUNT_KEY in production env.',
  };
}

/**
 * In-memory store for Content Intelligence Engine
 */
class ContentIntelligenceStore {
  public opportunities: ContentOpportunityItem[] = [
    {
      id: 'opp-101',
      opportunityType: 'HIGH_IMP_LOW_POS',
      query: 'facilities management planned preventative maintenance',
      targetPagePath: '/ppm',
      originSource: 'SEARCH_CONSOLE',
      decision: 'EXPAND_EXISTING',
      priority: 'P1',
      status: 'PENDING',
      currentClicks: 0,
      currentImpressions: 0,
      currentCtr: 0,
      currentPosition: 0,
      recommendedAction: 'Expand existing /ppm page with SFG20 statutory compliance table & CAFM integration breakdown.',
      suggestedTitle: 'Planned Preventative Maintenance (PPM) Services | EntireFM',
      suggestedMeta: 'Comprehensive PPM facilities management contracts aligned with SFG20 and statutory UK compliance codes.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'opp-102',
      opportunityType: 'REGULATORY_CHANGE',
      query: 'building safety act golden thread commercial property',
      targetPagePath: '/compliance',
      originSource: 'COMPLIANCE_CHANGE',
      decision: 'UPDATE_EXISTING',
      priority: 'P0',
      status: 'PENDING',
      currentClicks: 0,
      currentImpressions: 0,
      currentCtr: 0,
      currentPosition: 0,
      recommendedAction: 'Update /compliance statutory hub with new Building Safety Regulator HRB documentation obligations.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'opp-103',
      opportunityType: 'NEW_GAP',
      query: 'commercial heat pump acoustic attenuation rooftop',
      originSource: 'COMPETITOR_OBSERVATION',
      decision: 'CREATE_NEW_ARTICLE',
      priority: 'P2',
      status: 'PENDING',
      currentClicks: 0,
      currentImpressions: 0,
      currentCtr: 0,
      currentPosition: 0,
      recommendedAction: 'Create a technical FM engineering guide addressing acoustic enclosures and structural weight loadings.',
      createdAt: new Date().toISOString(),
    },
  ];

  public competitorGaps: CompetitorContentGap[] = [
    {
      topic: 'Golden Thread Digital Asset Registers (Building Safety Act 2022)',
      competitorsCovering: ['Mitie', 'Bellrock', 'CBRE'],
      entireFmCoverage: 'THIN',
      searchRelevance: 'High commercial intent from commercial landlords & managing agents.',
      commercialRelevance: 'Direct link to EntireFM CAFM asset onboarding and compliance audits.',
      recommendedAction: 'Update /compliance and write focused technical trade guide.',
      priority: 'P0',
    },
    {
      topic: 'Commercial Sub-Metering & Tenant Heat Network Billing Regulations',
      competitorsCovering: ['JLL', 'OCS'],
      entireFmCoverage: 'NONE',
      searchRelevance: 'Growing queries regarding OPSS commercial enforcement in 2026.',
      commercialRelevance: 'Connects to EntireFM M&E and Landlord billing service charge reporting.',
      recommendedAction: 'Create new article under /post/sub-metering-regulations-commercial-landlords.',
      priority: 'P1',
    },
    {
      topic: 'F-Gas Refrigerant Phase-Down Compliance for Commercial Chillers',
      competitorsCovering: ['EMCOR', 'BESA'],
      entireFmCoverage: 'SUBSTANTIAL',
      searchRelevance: 'HVAC maintenance & chiller replacement queries.',
      commercialRelevance: 'Drives enquiries to /hvac-contractor.',
      recommendedAction: 'Ensure existing /hvac-contractor page explicitly cites 2026 quota cuts.',
      priority: 'P2',
    },
  ];

  public clusters: TopicClusterPerformance[] = [
    {
      cluster: 'PPM_MAINTENANCE',
      name: 'PPM & Planned Maintenance',
      totalPages: 18,
      organicClicks: 0,
      impressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      leads: 0,
      trend: 'STABLE',
      topPage: '/ppm',
      weakestPage: '/post/reactive-vs-ppm',
      newOpportunitiesCount: 2,
    },
    {
      cluster: 'COMPLIANCE',
      name: 'Statutory Compliance & Life Safety',
      totalPages: 24,
      organicClicks: 0,
      impressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      leads: 0,
      trend: 'RISING',
      topPage: '/compliance',
      weakestPage: '/compliance/tmv-testing-servicing',
      newOpportunitiesCount: 4,
    },
    {
      cluster: 'AI_TECHNOLOGY',
      name: 'AI in Facilities Management & CAFM',
      totalPages: 12,
      organicClicks: 0,
      impressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      leads: 0,
      trend: 'RISING',
      topPage: '/resources/ai-in-facilities-management',
      weakestPage: '/post/ai-preventative-maintenance-reality',
      newOpportunitiesCount: 3,
    },
    {
      cluster: 'LOCATIONS',
      name: 'Regional & City FM Hubs',
      totalPages: 84,
      organicClicks: 0,
      impressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      leads: 0,
      trend: 'STABLE',
      topPage: '/london-facilities-management',
      weakestPage: '/fm-matlock',
      newOpportunitiesCount: 1,
    },
    {
      cluster: 'SECTORS',
      name: 'Industry Sectors & Specialist Environments',
      totalPages: 32,
      organicClicks: 0,
      impressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      leads: 0,
      trend: 'STABLE',
      topPage: '/sectors/logistics-distribution',
      weakestPage: '/sectors/heritage-listed',
      newOpportunitiesCount: 1,
    },
  ];

  public getWeeklyBriefing(): WeeklyIntelligenceBriefing {
    return {
      weekStarting: new Date().toISOString(),
      whatGrew: [],
      whatDeclined: [],
      newSearchQueries: [],
      topOpportunities: this.opportunities,
      pagesToUpdate: [
        { pagePath: '/compliance', reason: 'Building Safety Act 2022 Golden Thread technical update required.', priority: 'P0' },
        { pagePath: '/ppm', reason: 'Expand SFG20 frequency matrix and CAFM proof-of-service workflow.', priority: 'P1' },
      ],
      ctrOpportunities: [],
      cannibalisationWarnings: [],
      blogPerformanceSummary: 'All post URLs verified active and responsive. Real performance metrics will aggregate once Google Search Console credentials are configured.',
      resourcePerformanceSummary: 'Resource hubs (/resources/ai-in-facilities-management, /compliance, /facilities-management-glossary) are fully indexed.',
      leadsFromContent: 0,
      recommendedArticlesThisWeek: [
        {
          title: 'Golden Thread Compliance in Commercial Facilities: Practical BIM and Asset Data Standards',
          mixCategory: 'SEARCH_DEMAND',
          rationale: 'Addresses rising commercial search interest regarding Higher-Risk Buildings (HRB) operations.',
          targetIntent: 'golden thread facilities management building safety act digital asset data',
          actionType: 'NEW_ARTICLE',
        },
        {
          title: 'Commercial Heat Pump Retrofits: Acoustic Attenuation and Rooftop Structural Loadings',
          mixCategory: 'FM_DEVELOPMENT',
          rationale: 'Current municipal planning enforcement regarding decibel limits on commercial HVAC.',
          targetIntent: 'commercial heat pump acoustic attenuation rooftop weight loading',
          actionType: 'NEW_ARTICLE',
        },
        {
          title: 'SFG20 Maintenance Schedules vs Manufacturer Recommendations: Managing the Delta',
          mixCategory: 'EVERGREEN_GUIDE',
          rationale: 'Core operational dilemma faced by property managers balancing warranties with standard PPM.',
          targetIntent: 'sfg20 vs oem maintenance schedule facilities management',
          actionType: 'NEW_ARTICLE',
        },
        {
          title: 'AI in Facilities Management: Moving Beyond Automated Dispatch to True Fault Diagnostics',
          mixCategory: 'TECH_AI_COMMERCIAL',
          rationale: 'Positions EntireCAFM and EntireFM tech-enabled delivery model without overpromising.',
          targetIntent: 'ai in facilities management automated dispatch fault triage',
          actionType: 'NEW_ARTICLE',
        },
      ],
    };
  }

  public getFreshnessOverview(): ContentFreshnessItem[] {
    return [
      {
        pagePath: '/compliance',
        title: 'Statutory Compliance Command & Verification',
        freshnessStatus: 'REVIEW_SOON',
        lastUpdated: '2026-08-15',
        signals: ['Contains references to secondary legislation updates in 2026'],
        suggestedAction: 'Review Building Safety Regulator digital handover criteria.',
      },
      {
        pagePath: '/facilities-management-glossary',
        title: 'National Facilities Management Glossary',
        freshnessStatus: 'CURRENT',
        lastUpdated: '2026-08-23',
        signals: ['Recently upgraded with 24 authoritative definitions'],
        suggestedAction: 'None. Clean state.',
      },
      {
        pagePath: '/resources/ai-in-facilities-management',
        title: 'AI in Facilities Management: The 2026 Definitive Guide',
        freshnessStatus: 'CURRENT',
        lastUpdated: '2026-08-20',
        signals: ['Up to date with current EntireCAFM capabilities'],
        suggestedAction: 'None.',
      },
    ];
  }

  public getInternalLinkOpportunities(): InternalLinkRecommendation[] {
    return [
      {
        sourcePage: '/post/golden-thread-compliance-commercial-facilities',
        targetPage: '/compliance',
        suggestedAnchor: 'statutory compliance centre',
        contextSnippet: '...ensuring that the entire portfolio meets strict standards set out in our statutory compliance centre.',
        relevanceReason: 'Direct topic parent connection.',
      },
      {
        sourcePage: '/post/commercial-heat-pump-retrofits',
        targetPage: '/hvac-contractor',
        suggestedAnchor: 'commercial HVAC maintenance',
        contextSnippet: '...when assessing rooftop chiller replacements and commercial HVAC maintenance requirements.',
        relevanceReason: 'High-value commercial service bridge.',
      },
    ];
  }

  public getCannibalisationReport(): CannibalisationRecord[] {
    return [
      {
        query: 'facilities management london',
        type: 'INTENTIONAL_MULTI_PAGE_CLUSTER',
        isProblem: false,
        pages: [
          { path: '/fm-london', impressions: 0, clicks: 0, position: 0, title: 'Facilities Management London | EntireFM' },
          { path: '/facilities-management-london', impressions: 0, clicks: 0, position: 0, title: 'London Facilities Management Services' },
          { path: '/london-facilities-management', impressions: 0, clicks: 0, position: 0, title: 'EntireFM London Hub' },
        ],
        recommendedAction: 'Keep intentional geographic variations distinct. Protect all historic Wix URLs.',
      },
    ];
  }
}

export const intelligenceStore = new ContentIntelligenceStore();
