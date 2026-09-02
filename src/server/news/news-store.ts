import type { NewsArticle, NewsCategory, NewsCategoryMeta, NewsQueryOptions } from './types';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';

export const NEWS_CATEGORIES: NewsCategoryMeta[] = [
  {
    slug: 'building-safety',
    name: 'Building Safety',
    description: 'Statutory occurrence reporting, Golden Thread compliance, and BSR duty-holder directives.',
    color: 'border-rose-500 text-rose-400',
  },
  {
    slug: 'compliance',
    name: 'Compliance & Regulation',
    description: 'HSE updates, British Standards amendments, ACOP L8 water safety, and legal liability shifts.',
    color: 'border-amber-500 text-amber-400',
  },
  {
    slug: 'engineering',
    name: 'Engineering & M&E',
    description: 'HVAC plant diagnostics, electrical distribution, chiller efficiencies, and asset longevity.',
    color: 'border-brand-electric text-brand-electric',
  },
  {
    slug: 'property-estates',
    name: 'Property & Estates',
    description: 'Commercial leasing shifts, corporate workplace strategies, and estate portfolio transitions.',
    color: 'border-blue-500 text-blue-400',
  },
  {
    slug: 'energy-sustainability',
    name: 'Energy & Sustainability',
    description: 'Heat decarbonisation, BMS optimization, sub-metering mandates, and solar infrastructure.',
    color: 'border-emerald-500 text-emerald-400',
  },
  {
    slug: 'technology-cafm',
    name: 'Technology & CAFM',
    description: 'Asset information models, sensor telemetry, predictive maintenance, and operational software.',
    color: 'border-purple-500 text-purple-400',
  },
  {
    slug: 'contracts-mobilisations',
    name: 'Contracts & Mobilisations',
    description: 'Major UK hard and total facilities management contract awards, tenders, and framework wins.',
    color: 'border-teal-500 text-teal-400',
  },
  {
    slug: 'people-appointments',
    name: 'People & Appointments',
    description: 'Senior FM leadership appointments, director moves, board changes, and industry hires.',
    color: 'border-indigo-500 text-indigo-400',
  },
  {
    slug: 'suppliers-industry',
    name: 'Suppliers & Industry',
    description: 'Supply chain resilience, M&E specialist capability, and contractor trade developments.',
    color: 'border-neutral-400 text-neutral-300',
  },
  {
    slug: 'events-conferences',
    name: 'Events & Conferences',
    description: 'CPD accredited sessions, trade exhibitions, executive roundtables, and technical webinars.',
    color: 'border-orange-500 text-orange-400',
  },
  {
    slug: 'awards-recognition',
    name: 'Awards & Recognition',
    description: 'IWFM, PFM, CIBSE, and national industry award deadlines, shortlists, and ceremony outcomes.',
    color: 'border-yellow-500 text-yellow-400',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  // 1. LEAD STORY — BUILDING SAFETY & OCCURRENCE REPORTING
  {
    id: 'news-001',
    slug: 'mandatory-digital-occurrence-reporting-duty-holder-records',
    title: 'Building Safety Regulator Issues Mandatory Digital Occurrence Reporting Guidance for Commercial Duty Holders',
    standfirst:
      'The Building Safety Regulator has published explicit clarification on mandatory occurrence reporting timelines: commercial landlords and responsible entities must lodge specified safety occurrences within 48 hours.',
    whyItMatters:
      'Estates directors cannot delegate ultimate statutory liability to third-party managing agents without contemporaneous digital audit trails.',
    bodyParagraphs: [
      'The Building Safety Regulator (HSE) has issued formal technical guidance concerning mandatory occurrence reporting (MOR) procedures across multi-tenanted commercial and mixed-use premises.',
      'Under the regulations, structural envelope defects, unrecorded fire compartmentation penetrations, and catastrophic M&E plant failures must be formally logged within 48 hours of initial detection.',
      'Managing agents are required to integrate digital occurrence registers with the building’s persistent Golden Thread repository to maintain valid building insurance and avoid formal improvement notices.',
    ],
    category: 'building-safety',
    topics: ['Building Safety', 'Statutory Compliance', 'Golden Thread', 'HSE'],
    publishedAt: '2026-08-27T08:30:00Z',
    sourceName: 'Building Safety Regulator (HSE)',
    sourceUrl: 'https://www.hse.gov.uk/building-safety',
    provenance: resolveEditorialImage({
      topic: 'building-safety',
      sourcePublisher: 'Building Safety Regulator (HSE)',
      customProvenance: {
        altText: 'Commercial switchroom and building infrastructure survey',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    isLeadStory: true,
    readingTimeMinutes: 4,
    relatedTopicSlug: 'building-safety',
    relatedDiscussionSlug: 'mandatory-digital-occurrence-reporting-duty-holder-records',
  },

  // 2. F-GAS & HVAC STORY
  {
    id: 'news-002',
    slug: 'f-gas-phase-down-quota-reductions-virgin-r410a-pricing',
    title: 'F-Gas Quota Reductions Accelerate Virgin R410A Price Escalations Across Commercial Chiller Fleets',
    standfirst:
      'Virgin hydrofluorocarbon quotas have reduced available virgin R410A allocation by 18% for the upcoming financial quarter, prompting engineering teams to expedite reclaimed refrigerant strategies.',
    whyItMatters:
      'Unplanned emergency refrigerant callouts will face severe material cost premiums; estates should audit system leak histories before autumn planned preventive maintenance cycles.',
    bodyParagraphs: [
      'The latest quota steps under European and UK F-Gas regulatory instruments have tightened virgin refrigerant allocations, with suppliers prioritizing reclaimed and recycled stocks.',
      'Facilities managers operating VRF and commercial chiller systems are advised to verify electronic leak-detection calibrations and ensure refrigerant logbooks are up to date.',
    ],
    category: 'engineering',
    topics: ['HVAC', 'F-Gas', 'Refrigeration', 'PPM'],
    publishedAt: '2026-08-27T07:45:00Z',
    sourceName: 'F-Gas Regulation Directorate',
    provenance: resolveEditorialImage({
      topic: 'hvac',
      sourcePublisher: 'F-Gas Regulation (EU) 2024/573',
      customProvenance: {
        altText: 'Refrigerant pressure gauge manifold on commercial rooftop chiller',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'hvac',
  },

  // 3. ELECTRICAL SAFETY & BS 7671 AMENDMENT
  {
    id: 'news-003',
    slug: 'bs-7671-amendment-3-thermal-imaging-distribution-boards',
    title: 'IET Updates BS 7671 Guidance Note 3 Concerning Thermographic Survey Frequencies on Commercial Distribution Boards',
    standfirst:
      'The Institution of Engineering and Technology has issued revised technical guidance recommending annual thermographic inspections for commercial switchgear carrying continuous loads above 250A.',
    whyItMatters:
      'Insurers are increasingly requesting baseline infrared thermography prior to underwriting high-density office and data center risks.',
    category: 'compliance',
    topics: ['Electrical Safety', 'BS 7671', 'Thermography', 'PPM'],
    publishedAt: '2026-08-26T16:15:00Z',
    sourceName: 'Institution of Engineering and Technology (IET)',
    provenance: resolveEditorialImage({
      topic: 'electrical',
      sourcePublisher: 'IET Wiring Regulations Directorate',
      customProvenance: {
        altText: 'Distribution board electrical verification and compliance testing',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'electrical',
  },

  // 4. CONTRACTS & WINS 1
  {
    id: 'news-004',
    slug: 'crown-commercial-service-awards-120m-hard-fm-framework',
    title: 'Crown Commercial Service Confirms £120m Regional Hard FM Framework Appointments for Public Sector Estates',
    standfirst:
      'The Crown Commercial Service has finalised supplier allocations across Lot 2 (Mechanical & Electrical Services) spanning 450 public sector facilities across the Midlands and North West.',
    whyItMatters:
      'Contract mobilisations will commence from Q4 with rigorous mandatory digital reporting and social value compliance metrics.',
    category: 'contracts-mobilisations',
    topics: ['Contracts', 'Public Sector', 'Procurement', 'Hard FM'],
    publishedAt: '2026-08-26T11:00:00Z',
    sourceName: 'Crown Commercial Service',
    sourceUrl: 'https://www.crowncommercial.gov.uk',
    contractValue: '£120,000,000',
    contractWinner: 'Multi-Supplier Framework Panel',
    contractClient: 'Crown Commercial Service',
    contractTermYears: 4,
    provenance: resolveEditorialImage({
      topic: 'contracts',
      sourcePublisher: 'Crown Commercial Service',
      customProvenance: {
        altText: 'Commercial logistics and public sector estate infrastructure',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'procurement',
  },

  // 5. CONTRACTS & WINS 2
  {
    id: 'news-005',
    slug: 'major-financial-institution-awards-five-year-hard-fm-contract',
    title: 'Tier-1 Financial Institution Awards 5-Year Hard FM Contract for London EC2 Headquarters',
    standfirst:
      'A 380,000 sq ft Grade-A commercial office tower in London has awarded its full mechanical, electrical, and critical plant maintenance agreement to an integrated facilities provider.',
    whyItMatters:
      'Mobilisation involves installing 4,200 asset IoT vibration sensors across dual central chiller plants to establish baseline vibration telemetry and early bearing wear detection on primary cooling plant.',
    category: 'contracts-mobilisations',
    topics: ['Contracts', 'Commercial Offices', 'M&E', 'London'],
    publishedAt: '2026-08-25T14:30:00Z',
    sourceName: 'FM Market Intelligence',
    contractValue: '£18,500,000',
    contractWinner: 'Integrated Engineering Services UK',
    contractClient: 'Global Banking Group',
    contractTermYears: 5,
    provenance: resolveEditorialImage({
      topic: 'property-estates',
      sourcePublisher: 'FM Market Intelligence',
      customProvenance: {
        altText: 'Grade-A commercial office tower exterior in London',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: false,
    readingTimeMinutes: 2,
    relatedTopicSlug: 'commercial-offices',
  },

  // 6. PEOPLE & MOVES 1
  {
    id: 'news-006',
    slug: 'dr-elizabeth-morris-appointed-head-of-statutory-compliance-uk-estates',
    title: 'Dr Elizabeth Morris Appointed Head of Statutory Compliance for 2.4m sq ft Commercial Portfolio',
    standfirst:
      'Former CIBSE Technical Committee Chair Dr Elizabeth Morris has been appointed to lead building safety and environmental asset compliance across a nationwide logistics and commercial office estate.',
    whyItMatters:
      'The appointment signals increasing institutional focus on in-house technical governance ahead of secondary Building Safety Act enforcement.',
    category: 'people-appointments',
    topics: ['People & Moves', 'Leadership', 'Compliance', 'Building Safety'],
    publishedAt: '2026-08-26T09:00:00Z',
    sourceName: 'IWFM Appointments Wire',
    personName: 'Dr Elizabeth Morris, CEng FCIBSE',
    personNewRole: 'Head of Statutory Compliance',
    personPreviousOrg: 'CIBSE Technical Directorate',
    personCompany: 'National Estates Partnership',
    provenance: resolveEditorialImage({
      topic: 'people-appointments',
      sourcePublisher: 'IWFM Appointments Wire',
      customProvenance: {
        altText: 'Corporate facilities management headquarters reception and executive workplace',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    readingTimeMinutes: 2,
    relatedTopicSlug: 'careers',
  },

  // 7. PEOPLE & MOVES 2
  {
    id: 'news-007',
    slug: 'marcus-vance-named-director-of-hard-fm-operations',
    title: 'Marcus Vance Named Director of Hard FM Operations at Regional Healthcare Infrastructure Trust',
    standfirst:
      'With over 20 years of acute hospital engineering experience, Marcus Vance will oversee HTM-compliant mechanical infrastructure across 8 hospital campuses.',
    whyItMatters:
      'Priorities include accelerating thermal insulation upgrades and dual-calorifier replacement cycles.',
    category: 'people-appointments',
    topics: ['People & Moves', 'Healthcare FM', 'Engineering', 'M&E'],
    publishedAt: '2026-08-25T16:00:00Z',
    sourceName: 'Health Estates & Facilities Management Wire',
    personName: 'Marcus Vance, BEng MIWFM',
    personNewRole: 'Director of Hard FM Operations',
    personPreviousOrg: 'NHS Foundation Trust',
    personCompany: 'Midlands Health Estates Trust',
    provenance: resolveEditorialImage({
      topic: 'people-appointments',
      sourcePublisher: 'Health Estates Wire',
      customProvenance: {
        altText: 'Modern commercial hospital and healthcare building environment',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: false,
    readingTimeMinutes: 2,
    relatedTopicSlug: 'healthcare-fm',
  },

  // 8. ENERGY & SUSTAINABILITY
  {
    id: 'news-008',
    slug: 'commercial-heat-pump-retrofit-efficiency-benchmarks-published',
    title: 'CIBSE Publishes Real-World Commercial Heat Pump Seasonal Performance Factor Benchmark Data',
    standfirst:
      'New empirical data from 120 commercial office retrofits reveals that system flow temperature modulation delivered a 24% uplift in actual seasonal efficiency compared to fixed-setpoint systems.',
    whyItMatters:
      'Estates managers planning boiler replacements should require variable hydraulic balancing in contractor commissioning specifications.',
    category: 'energy-sustainability',
    topics: ['Heat Pumps', 'Energy Efficiency', 'CIBSE', 'Decarbonisation'],
    publishedAt: '2026-08-25T10:15:00Z',
    sourceName: 'Chartered Institution of Building Services Engineers (CIBSE)',
    provenance: resolveEditorialImage({
      topic: 'energy-sustainability',
      sourcePublisher: 'CIBSE Journal',
      customProvenance: {
        altText: 'Commercial high-temperature heat pump and thermal plant installation',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: true,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'heat-pumps',
  },

  // 9. WATER HYGIENE & ACOP L8
  {
    id: 'news-009',
    slug: 'hse-acop-l8-water-sampling-protocol-advisory-commercial-cooling-towers',
    title: 'HSE Issues Technical Advisory on Dipslide and Biofilm Monitoring Schedules in Commercial Evaporative Condensers',
    standfirst:
      'Following targeted inspections, the Health and Safety Executive has clarified that automated biocide dosing records must be verified by physical microbiological dipslides every 7 days without exception.',
    whyItMatters:
      'Failure to maintain physical evidence logbooks invalidates third-party water hygiene certificates and risks immediate prohibition notices.',
    category: 'compliance',
    topics: ['Water Hygiene', 'Legionella', 'ACOP L8', 'HSE'],
    publishedAt: '2026-08-24T13:40:00Z',
    sourceName: 'Health and Safety Executive (HSE)',
    provenance: resolveEditorialImage({
      topic: 'water-hygiene',
      sourcePublisher: 'HSE Legionella Advisory',
      customProvenance: {
        altText: 'Cold water booster pump set and pressurized water storage pipework',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: false,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'water-hygiene',
  },

  // 10. CAFM & TECH
  {
    id: 'news-010',
    slug: 'open-asset-data-standards-for-commercial-property-handover',
    title: 'UK BIM Alliance & IWFM Publish Interoperable Asset Data Standard for FM Contractor Transitions',
    standfirst:
      'The new standardized asset schema eliminates proprietary data lock-in by enforcing open IFC/COBie exports for commercial estate maintenance histories and warranty schedules.',
    whyItMatters:
      'Estates teams can transition between hard FM service providers without losing maintenance records or having to re-tag building assets.',
    category: 'technology-cafm',
    topics: ['CAFM', 'COBie', 'BIM', 'Asset Data'],
    publishedAt: '2026-08-24T09:00:00Z',
    sourceName: 'UK BIM Alliance / IWFM',
    provenance: resolveEditorialImage({
      topic: 'technology-cafm',
      sourcePublisher: 'UK BIM Alliance',
      customProvenance: {
        altText: 'Commercial workplace and estate asset management data context',
        credit: 'EntireFM Technical Asset Library',
      },
    }),
    isExternal: false,
    isCurated: true,
    isFeatured: false,
    readingTimeMinutes: 3,
    relatedTopicSlug: 'cafm',
  },
];

class NewsStore {
  private articles: Map<string, NewsArticle> = new Map();

  constructor() {
    for (const article of INITIAL_NEWS_ARTICLES) {
      this.articles.set(article.slug, article);
    }
  }

  public getAll(): NewsArticle[] {
    return Array.from(this.articles.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  public getBySlug(slug: string): NewsArticle | undefined {
    return this.articles.get(slug);
  }

  public getByCategory(category: NewsCategory): NewsArticle[] {
    return this.getAll().filter((a) => a.category === category);
  }

  public getLeadStory(): NewsArticle | undefined {
    return this.getAll().find((a) => a.isLeadStory) || this.getAll()[0];
  }

  public getFeaturedArticles(limit = 4): NewsArticle[] {
    return this.getAll()
      .filter((a) => a.isFeatured && !a.isLeadStory)
      .slice(0, limit);
  }

  public getLatestNewsStream(limit = 5): NewsArticle[] {
    return this.getAll().slice(0, limit);
  }

  public getContractWins(limit = 3): NewsArticle[] {
    return this.getByCategory('contracts-mobilisations').slice(0, limit);
  }

  public getPeopleMoves(limit = 3): NewsArticle[] {
    return this.getByCategory('people-appointments').slice(0, limit);
  }

  public query(options: NewsQueryOptions): { articles: NewsArticle[]; total: number } {
    let list = this.getAll();

    if (options.category && options.category !== 'all') {
      list = list.filter((a) => a.category === options.category);
    }

    if (options.topic) {
      const t = options.topic.toLowerCase();
      list = list.filter((a) => a.topics.some((item) => item.toLowerCase().includes(t)));
    }

    if (options.featuredOnly) {
      list = list.filter((a) => a.isFeatured);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.standfirst.toLowerCase().includes(q) ||
          (a.whyItMatters && a.whyItMatters.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;

    return {
      articles: list.slice(offset, offset + limit),
      total,
    };
  }

  public overrideArticleImage(slug: string, newProvenance: Partial<NewsArticle['provenance']>): boolean {
    const article = this.articles.get(slug);
    if (!article) return false;

    article.provenance = {
      ...article.provenance,
      ...newProvenance,
    };
    return true;
  }
}

export const newsStore = new NewsStore();

export function getNewsArticles(options?: NewsQueryOptions) {
  return newsStore.query(options || {});
}

export function getNewsArticleBySlug(slug: string) {
  return newsStore.getBySlug(slug);
}

export function getLeadNewsStory() {
  return newsStore.getLeadStory();
}

export function getLatestNewsStream(limit = 5) {
  return newsStore.getLatestNewsStream(limit);
}

export function getContractWins(limit = 3) {
  return newsStore.getContractWins(limit);
}

export function getPeopleMoves(limit = 3) {
  return newsStore.getPeopleMoves(limit);
}

export function getNewsCategories() {
  return NEWS_CATEGORIES;
}
