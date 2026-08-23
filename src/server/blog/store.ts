import {
  BlogPost,
  BlogCategory,
  BlogAuthor,
  BlogSource,
  BlogRevision,
  BlogTopicOpportunity,
  BlogAutomationSettings,
  BlogGenerationJob,
  BlogMediaItem,
} from './types';
import { dbQuery, isDbConfigured } from '@/server/db/client';

/**
 * INITIAL SEED CATEGORIES
 */
export const DEFAULT_CATEGORIES: BlogCategory[] = [
  { id: 'cat-1', name: 'AI & Technology', slug: 'ai-technology', description: 'Artificial intelligence, IoT sensors, digital twins and CAFM integration.', icon: 'Cpu', isActive: true, sortOrder: 1 },
  { id: 'cat-2', name: 'Maintenance & PPM', slug: 'maintenance-ppm', description: 'SFG20 planned preventative maintenance and asset lifecycle management.', icon: 'Wrench', isActive: true, sortOrder: 2 },
  { id: 'cat-3', name: 'Compliance & Safety', slug: 'compliance-safety', description: 'Statutory testing obligations, EICR, fire safety, water hygiene and HSE regulations.', icon: 'ShieldCheck', isActive: true, sortOrder: 3 },
  { id: 'cat-4', name: 'Engineering & M&E', slug: 'engineering-me', description: 'HVAC, commercial boilers, switchgear and mechanical plant engineering.', icon: 'Zap', isActive: true, sortOrder: 4 },
  { id: 'cat-5', name: 'FM Strategy & Workplace', slug: 'fm-strategy', description: 'Procurement models, contract mobilization, managing agent governance and workplace design.', icon: 'Building2', isActive: true, sortOrder: 5 },
  { id: 'cat-6', name: 'Energy & Sustainability', slug: 'energy-sustainability', description: 'Decarbonisation, TM44 energy inspections, building efficiency and net zero.', icon: 'Leaf', isActive: true, sortOrder: 6 },
  { id: 'cat-7', name: 'EntireFM News', slug: 'entirefm-news', description: 'Company milestones, contract awards, accreditations and technical team insights.', icon: 'Newspaper', isActive: true, sortOrder: 7 },
];

/**
 * INITIAL SEED AUTHORS
 */
export const DEFAULT_AUTHORS: BlogAuthor[] = [
  {
    id: 'auth-1',
    name: 'EntireFM Technical Team',
    slug: 'entirefm-technical-team',
    role: 'Engineering & Compliance Advisory',
    bio: 'The EntireFM Technical Team comprises Chartered Building Services Engineers, SFG20 compliance specialists, and senior operations managers overseeing commercial property portfolios across the UK.',
    isTechnicalTeam: true,
    isActive: true,
  },
  {
    id: 'auth-2',
    name: 'EntireFM Operations Desk',
    slug: 'entirefm-operations-desk',
    role: 'Editorial & Industry Intelligence',
    bio: 'Editorial desk covering UK regulatory updates, facilities management procurement frameworks, and modern CAFM automation.',
    isTechnicalTeam: false,
    isActive: true,
  },
];

/**
 * INITIAL VERIFIED INDUSTRY SOURCES
 */
export const DEFAULT_SOURCES: BlogSource[] = [
  { id: 'src-1', name: 'Health and Safety Executive (HSE)', url: 'https://www.hse.gov.uk', publisher: 'UK Government', sourceType: 'REGULATORY', trustLevel: 'OFFICIAL_GOV', dateAccessed: '2026-08-23' },
  { id: 'src-2', name: 'Building Engineering Services Association (BESA / SFG20)', url: 'https://www.thebesa.com', publisher: 'BESA', sourceType: 'STANDARD', trustLevel: 'INDUSTRY_STANDARD', dateAccessed: '2026-08-23' },
  { id: 'src-3', name: 'Chartered Institution of Building Services Engineers (CIBSE)', url: 'https://www.cibse.org', publisher: 'CIBSE', sourceType: 'STANDARD', trustLevel: 'INDUSTRY_STANDARD', dateAccessed: '2026-08-23' },
  { id: 'src-4', name: 'Institute of Workplace and Facilities Management (IWFM)', url: 'https://www.iwfm.org.uk', publisher: 'IWFM', sourceType: 'TRADE_BODY', trustLevel: 'INDUSTRY_STANDARD', dateAccessed: '2026-08-23' },
  { id: 'src-5', name: 'Facilities Management Journal (FMJ)', url: 'https://www.fmj.co.uk', publisher: 'kpm media', sourceType: 'TRADE_PUBLICATION', trustLevel: 'TRADE_PUBLICATION', dateAccessed: '2026-08-23' },
];

/**
 * INITIAL SEED MEDIA
 */
export const DEFAULT_MEDIA: BlogMediaItem[] = [
  { id: 'med-1', title: 'Commercial Switchgear Testing', url: '/images/editorial/entirefm-switchgear-inspection-2000w.webp', altText: 'EntireFM electrical engineer inspecting commercial switchgear', sourceType: 'PHOTOGRAPHY', licenseInfo: 'EntireFM Proprietary', tags: ['Electrical', 'Engineering'], usageCount: 4, createdAt: '2026-08-20T10:00:00Z' },
  { id: 'med-2', title: 'Rooftop HVAC Plant Maintenance', url: '/images/editorial/entirefm-rooftop-plant-night-2000w.webp', altText: 'Commercial rooftop chiller and condenser plant maintained out of hours', sourceType: 'PHOTOGRAPHY', licenseInfo: 'EntireFM Proprietary', tags: ['HVAC', 'Plant'], usageCount: 6, createdAt: '2026-08-20T10:00:00Z' },
  { id: 'med-3', title: 'Commercial Office Corridor & Directory', url: '/images/editorial/entirefm-corporate-corridor-2000w.webp', altText: 'Modern commercial office corridor and facilities management signage', sourceType: 'PHOTOGRAPHY', licenseInfo: 'EntireFM Proprietary', tags: ['Offices', 'Workplace'], usageCount: 3, createdAt: '2026-08-20T10:00:00Z' },
  { id: 'med-4', title: 'Logistics Distribution Centre at Dusk', url: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp', altText: 'EntireFM facilities management exterior at commercial logistics depot', sourceType: 'PHOTOGRAPHY', licenseInfo: 'EntireFM Proprietary', tags: ['Logistics', 'Warehousing'], usageCount: 5, createdAt: '2026-08-20T10:00:00Z' },
  { id: 'med-5', title: 'Booster Pump & Pressurisation Set', url: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp', altText: 'Plumbing booster set and water pump station inspection', sourceType: 'PHOTOGRAPHY', licenseInfo: 'EntireFM Proprietary', tags: ['Plumbing', 'Water'], usageCount: 2, createdAt: '2026-08-20T10:00:00Z' },
];

/**
 * DEFAULT AUTOMATION SETTINGS
 */
export const DEFAULT_AUTOMATION_SETTINGS: BlogAutomationSettings = {
  automationEnabled: true,
  autoResearchEnabled: true,
  autoDraftEnabled: true,
  autoPublishEnabled: false, // Default: human review required before live
  emergencyHold: false,
  minPostsPerWeek: 3,
  targetPostsPerWeek: 4,
  maxPostsPerWeek: 5,
  allowedPublishDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  preferredPublishTimes: ['09:00'],
  minQualityScore: 80,
  minSourceConfidence: 75,
  minSeoScore: 85,
  maxSimilarityThreshold: 30,
  imageGenerationEnabled: false,
  updatedAt: new Date().toISOString(),
};

/**
 * IN-MEMORY PERSISTENCE STORE FOR DEVELOPMENT / FALLBACK
 */
class MemoryBlogStore {
  public categories: BlogCategory[] = [...DEFAULT_CATEGORIES];
  public authors: BlogAuthor[] = [...DEFAULT_AUTHORS];
  public sources: BlogSource[] = [...DEFAULT_SOURCES];
  public media: BlogMediaItem[] = [...DEFAULT_MEDIA];
  public settings: BlogAutomationSettings = { ...DEFAULT_AUTOMATION_SETTINGS };
  public posts: Map<string, BlogPost> = new Map();
  public revisions: BlogRevision[] = [];
  public topics: BlogTopicOpportunity[] = [];
  public jobs: BlogGenerationJob[] = [];

  constructor() {
    this.seedInitialPosts();
    this.seedInitialTopics();
  }

  private seedInitialPosts() {
    const p1: BlogPost = {
      id: 'post-seed-1',
      slug: 'what-is-facilities-management',
      title: 'What is Facilities Management? Definitions, Scope and Operating Models',
      subtitle: 'A practical guide for property owners and estates directors navigating Hard and Soft FM boundaries.',
      excerpt: 'A plain-English definition of facilities management, what facilities managers actually do, and where the boundary sits between hard services, soft services and statutory compliance.',
      content: `Facilities management is the organisational function that integrates people, place and process within the built environment. In modern commercial property operations, facilities management is not a disconnected collection of individual trade callouts — it is the coordinated engineering discipline that ensures a building supports operational productivity rather than interrupting it.\n\n## The Core Boundary: Hard FM vs Soft FM\n\nHard FM encompasses the physical, statutory and mechanical infrastructure of a commercial property: commercial HVAC, boiler plant, high-voltage and low-voltage electrical distribution, emergency lighting, fire suppression, and building fabric. Soft FM encompasses workplace services including contract cleaning, security, grounds maintenance, and waste management.\n\n## Why Asset Register Precision Matters\n\nEvery effective planned preventative maintenance (PPM) contract begins with an immutable asset register. Without exact make, model, serial numbers, and condition ratings, maintenance schedules remain guesswork.`,
      categoryId: 'cat-5',
      authorId: 'auth-1',
      featuredImage: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
      featuredImageAlt: 'EntireFM building services engineer conducting asset condition audit in electrical switchroom',
      status: 'PUBLISHED',
      generationMode: 'manual',
      publishedAt: '2026-08-20T09:00:00Z',
      createdAt: '2026-08-15T10:00:00Z',
      updatedAt: '2026-08-23T12:00:00Z',
      primaryKeyword: 'what is facilities management',
      secondaryKeywords: ['facilities management scope', 'hard vs soft fm', 'fm asset register'],
      seoTitle: 'What is Facilities Management? Scope, Hard & Soft FM | EntireFM',
      metaDescription: 'A plain-English guide to facilities management scope, hard vs soft FM engineering, asset registers, and statutory compliance frameworks.',
      canonicalUrl: 'https://www.entirefm.com/post/what-is-facilities-management',
      robotsIndex: true,
      robotsFollow: true,
      sitemapInclude: true,
      schemaType: 'Article',
      readingTime: 6,
      reviewStatus: 'PASSED',
      factCheckStatus: 'PASSED',
      seoStatus: 'PASSED',
      imageStatus: 'PASSED',
      contentScore: 94,
      seoScore: 96,
      primaryServiceHref: '/hard-services',
      primaryServiceCta: 'Explore Total Facilities Management',
      internalLinks: [
        { anchorText: 'Hard FM engineering', targetUrl: '/hard-services', targetType: 'service' },
        { anchorText: 'Planned Preventative Maintenance (PPM)', targetUrl: '/ppm', targetType: 'service' },
        { anchorText: 'statutory compliance obligations', targetUrl: '/compliance', targetType: 'compliance' },
      ],
      createdBy: 'system',
      updatedBy: 'system',
    };

    const p2: BlogPost = {
      id: 'post-seed-2',
      slug: 'ai-in-facilities-management-practical-applications',
      title: 'AI in Facilities Management: Real Operational Value vs Trade Hype',
      subtitle: 'Where machine learning delivers genuine predictive maintenance value — and where it fails without clean asset data.',
      excerpt: 'An editorial analysis examining where artificial intelligence genuinely optimizes commercial building maintenance, predictive HVAC diagnostics, and CAFM scheduling.',
      content: `Artificial intelligence is frequently marketed as an autonomous replacement for building engineering teams. In practical facilities operations, AI is an analytical amplifier for high-quality operational asset data — not a substitute for qualified engineers.\n\n## Predictive Maintenance vs Traditional PPM\n\nPredictive maintenance relies on IoT vibration, acoustic, and thermal telemetry to forecast bearing wear or chiller refrigerant leakage before catastrophic breakdown occurs. However, predictive maintenance does not eliminate statutory planned preventative maintenance (SFG20). Periodic fixed-wire testing (EICR) and emergency lighting duration tests remain legally mandated regardless of AI monitoring.\n\n## Data Readiness: The Core Prerequisite\n\nA CAFM system with dirty asset registers and missing maintenance logs cannot be saved by AI algorithms. Before deploying machine learning models, property managers must establish disciplined asset taxonomy and digital work-order tracking.`,
      categoryId: 'cat-1',
      authorId: 'auth-1',
      featuredImage: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
      featuredImageAlt: 'EntireFM engineer analyzing building sensor telemetry and electrical switchgear diagnostics',
      status: 'PUBLISHED',
      generationMode: 'ai_assisted',
      publishedAt: '2026-08-22T09:00:00Z',
      createdAt: '2026-08-18T14:00:00Z',
      updatedAt: '2026-08-23T14:00:00Z',
      primaryKeyword: 'AI in facilities management',
      secondaryKeywords: ['predictive maintenance vs ppm', 'CAFM artificial intelligence', 'smart building data'],
      seoTitle: 'AI in Facilities Management: Predictive Maintenance & CAFM | EntireFM',
      metaDescription: 'Discover where AI and machine learning genuinely enhance commercial facilities management, predictive maintenance, and CAFM operations.',
      canonicalUrl: 'https://www.entirefm.com/post/ai-in-facilities-management-practical-applications',
      robotsIndex: true,
      robotsFollow: true,
      sitemapInclude: true,
      schemaType: 'Article',
      readingTime: 7,
      reviewStatus: 'PASSED',
      factCheckStatus: 'PASSED',
      seoStatus: 'PASSED',
      imageStatus: 'PASSED',
      contentScore: 92,
      seoScore: 95,
      primaryServiceHref: '/ppm',
      primaryServiceCta: 'Review Your Predictive Maintenance Plan',
      internalLinks: [
        { anchorText: 'SFG20 planned maintenance', targetUrl: '/ppm', targetType: 'service' },
        { anchorText: 'commercial HVAC maintenance', targetUrl: '/hvac-contractor', targetType: 'service' },
        { anchorText: 'FM glossary definitions', targetUrl: '/facilities-management-glossary', targetType: 'glossary' },
      ],
      createdBy: 'ai_engine',
      updatedBy: 'editorial_desk',
    };

    const p3: BlogPost = {
      id: 'post-seed-3',
      slug: 'sfg20-compliance-guide-commercial-estates',
      title: 'SFG20 Maintenance Schedules: How to Eliminate Compliance Gaps',
      subtitle: 'Understanding the industry standard for building maintenance tasks and audit-proof statutory registers.',
      excerpt: 'A comprehensive technical overview of SFG20 maintenance specifications, differentiating statutory legal mandates from routine manufacturer recommendations.',
      content: `The Building Engineering Services Association (BESA) publishes SFG20 as the definitive standard for building maintenance task schedules. For commercial landlords and managing agents, aligning contracts with SFG20 prevents both over-maintaining non-critical plant and missing mandatory statutory testing.\n\n## The Three Task Classifications\n\n1. **Statutory**: Legally mandated tasks (e.g. annual gas safety inspections, 5-yearly EICRs, monthly emergency lighting flick tests).\n2. **Mandatory / Business-Critical**: Maintenance required to preserve insurance warranties or prevent catastrophic operational shutdown (e.g. chiller oil changes, high-voltage switchgear servicing).\n3. **Discretionary / Good Practice**: Cosmetic and non-urgent fabric preservation tasks that can be dialed back during budget constraints.\n\n## CAFM Integration\n\nWhen SFG20 task definitions are integrated directly into CAFM work orders, engineers receive precise checklists on their mobile devices, ensuring consistent testing procedures across multi-site estates.`,
      categoryId: 'cat-2',
      authorId: 'auth-1',
      featuredImage: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
      featuredImageAlt: 'Rooftop plant deck with HVAC chillers maintained to SFG20 standards',
      status: 'SCHEDULED',
      generationMode: 'ai_assisted',
      scheduledAt: '2026-08-25T09:00:00Z',
      createdAt: '2026-08-21T11:00:00Z',
      updatedAt: '2026-08-23T15:00:00Z',
      primaryKeyword: 'SFG20 maintenance standard',
      secondaryKeywords: ['SFG20 compliance', 'statutory maintenance tasks', 'commercial PPM schedule'],
      seoTitle: 'SFG20 Maintenance Standard Guide for Commercial Estates | EntireFM',
      metaDescription: 'A clear guide to SFG20 maintenance specifications, statutory compliance intervals, and building maintenance budgeting.',
      canonicalUrl: 'https://www.entirefm.com/post/sfg20-compliance-guide-commercial-estates',
      robotsIndex: true,
      robotsFollow: true,
      sitemapInclude: true,
      schemaType: 'Article',
      readingTime: 6,
      reviewStatus: 'PASSED',
      factCheckStatus: 'PASSED',
      seoStatus: 'PASSED',
      imageStatus: 'PASSED',
      contentScore: 90,
      seoScore: 94,
      primaryServiceHref: '/ppm',
      primaryServiceCta: 'Request an SFG20 Maintenance Review',
      internalLinks: [
        { anchorText: 'Fixed wire testing (EICR)', targetUrl: '/compliance/fixed-wire-testing-eicr', targetType: 'compliance' },
        { anchorText: 'commercial HVAC maintenance', targetUrl: '/hvac-contractor', targetType: 'service' },
        { anchorText: 'SFG20 glossary term', targetUrl: '/facilities-management-glossary#sfg20', targetType: 'glossary' },
      ],
      createdBy: 'editorial_desk',
      updatedBy: 'editorial_desk',
    };

    this.posts.set(p1.id, p1);
    this.posts.set(p2.id, p2);
    this.posts.set(p3.id, p3);
  }

  private seedInitialTopics() {
    this.topics = [
      {
        id: 'top-1',
        title: 'Building Safety Act 2022: Secondary Legislation Impact on Commercial Landlords',
        topicTheme: 'Building Safety & Compliance',
        whyNow: 'New enforcement guidelines published for golden thread digital information handover in mixed-use commercial developments.',
        categoryId: 'cat-3',
        categoryName: 'Compliance & Safety',
        searchIntent: 'Building Safety Act commercial property compliance golden thread requirements',
        commercialRelevance: 'Directly supports EntireFM compliance auditing, CAFM digital logbooks, and managing agent contracts.',
        supportingSources: [
          { name: 'GOV.UK Building Safety Regulator', url: 'https://www.gov.uk/guidance/the-building-safety-regulator', publisher: 'Health and Safety Executive' },
          { name: 'CIBSE Building Safety Guidance', url: 'https://www.cibse.org', publisher: 'CIBSE' },
        ],
        collisionStatus: 'NO_COLLISION',
        freshnessScore: 95,
        overallScore: 92,
        status: 'QUEUED',
        recommendedPublishDate: '2026-08-26',
        createdAt: '2026-08-23T08:00:00Z',
      },
      {
        id: 'top-2',
        title: 'F-Gas Phase-Down 2026: Servicing Chillers and Heat Pumps Under New Quotas',
        topicTheme: 'HVAC & Environmental Regulations',
        whyNow: 'Stricter EU/UK refrigerant quota cuts take effect, increasing virgin R410A/R404A prices and mandating reclaimed gas protocols.',
        categoryId: 'cat-4',
        categoryName: 'Engineering & M&E',
        searchIntent: 'F-gas regulation changes commercial chiller maintenance refrigerant quotas',
        commercialRelevance: 'Positions EntireFM HVAC engineering and leak detection capabilities to commercial estate owners.',
        supportingSources: [
          { name: 'Environment Agency F-Gas Guidance', url: 'https://www.gov.uk/guidance/fluorinated-greenhouse-gases-f-gas-guidance-for-businesses', publisher: 'Environment Agency' },
          { name: 'REFCOM Technical Bulletin', url: 'https://www.refcom.org.uk', publisher: 'BESA REFCOM' },
        ],
        collisionStatus: 'NO_COLLISION',
        freshnessScore: 90,
        overallScore: 89,
        status: 'APPROVED',
        recommendedPublishDate: '2026-08-27',
        createdAt: '2026-08-23T08:30:00Z',
      },
      {
        id: 'top-3',
        title: 'Why Most FM Mobilisations Fail in the First 90 Days (And How to Fix It)',
        topicTheme: 'FM Strategy & Procurement',
        whyNow: 'High rate of commercial contract churn caused by poor asset condition auditing during supplier handover.',
        categoryId: 'cat-5',
        categoryName: 'FM Strategy & Workplace',
        searchIntent: 'facilities management contract mobilization handover process asset register survey',
        commercialRelevance: 'Highlights EntireFM structured 30-to-90-day onboarding, TUPE experience, and initial asset surveys.',
        supportingSources: [
          { name: 'IWFM Good Practice Guide to Procurement', url: 'https://www.iwfm.org.uk', publisher: 'IWFM' },
        ],
        collisionStatus: 'NO_COLLISION',
        freshnessScore: 85,
        overallScore: 88,
        status: 'OPPORTUNITY',
        recommendedPublishDate: '2026-08-28',
        createdAt: '2026-08-23T09:00:00Z',
      },
      {
        id: 'top-4',
        title: 'Commercial EV Charging Hubs: Managing Substation Load and 3-Phase Power Demands',
        topicTheme: 'Energy & Infrastructure',
        whyNow: 'Corporate workplace fleet electrification requiring infrastructure upgrades and load-balancing switchboards.',
        categoryId: 'cat-6',
        categoryName: 'Energy & Sustainability',
        searchIntent: 'commercial EV charging installation electrical distribution capacity load balancing',
        commercialRelevance: 'Connects to EntireFM M&E electrical engineering and EV infrastructure capabilities.',
        supportingSources: [
          { name: 'Ofgem EV Infrastructure Regulations', url: 'https://www.ofgem.gov.uk', publisher: 'Ofgem' },
          { name: 'IET Code of Practice for EV Charging', url: 'https://theiet.org', publisher: 'IET' },
        ],
        collisionStatus: 'NO_COLLISION',
        freshnessScore: 88,
        overallScore: 87,
        status: 'OPPORTUNITY',
        recommendedPublishDate: '2026-08-29',
        createdAt: '2026-08-23T09:15:00Z',
      },
    ];
  }
}

// Global in-memory singleton
const globalStore = (global as any).__entirefm_blog_store || new MemoryBlogStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__entirefm_blog_store = globalStore;
}

export const memoryStore: MemoryBlogStore = globalStore;
