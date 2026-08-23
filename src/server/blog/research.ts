import { BlogTopicOpportunity, BlogCategory } from './types';
import { memoryStore } from './store';
import { checkSearchIntentCollision } from './seo';

export interface DiscoveredTopicSeed {
  title: string;
  theme: string;
  categorySlug: string;
  whyNow: string;
  intent: string;
  commercialValue: string;
  sources: Array<{ name: string; url: string; publisher: string }>;
  freshness: number;
}

/**
 * Editorial topic discovery bank reflecting genuine 2026 UK FM trade priorities
 */
const RESEARCH_TOPIC_CANDIDATES: DiscoveredTopicSeed[] = [
  {
    title: 'Golden Thread Compliance in Commercial Facilities: Practical BIM and Asset Data Standards',
    theme: 'Building Safety Act 2022',
    categorySlug: 'compliance-safety',
    whyNow: 'Higher-Risk Buildings (HRB) regulations mandating verified digital operations records for commercial assets.',
    intent: 'golden thread facilities management building safety act digital asset data requirements',
    commercialValue: 'Connects to EntireFM asset registry verification, CAFM implementation, and compliance audits.',
    sources: [
      { name: 'GOV.UK Building Safety Regulator', url: 'https://www.gov.uk/guidance/the-building-safety-regulator', publisher: 'HSE' },
      { name: 'CIBSE Technical Guide: Digital Management', url: 'https://www.cibse.org', publisher: 'CIBSE' },
    ],
    freshness: 96,
  },
  {
    title: 'Commercial Heat Pump Retrofits: Acoustic Attenuation and Rooftop Structural Loadings',
    theme: 'Decarbonisation & M&E',
    categorySlug: 'engineering-me',
    whyNow: 'Planning authorities and acoustic environmental health officers enforcing stricter dBA noise limits on rooftop commercial heat pumps.',
    intent: 'commercial heat pump installation acoustic enclosure rooftop weight bearing facilities',
    commercialValue: 'Showcases EntireFM mechanical engineering, structural site surveys, and chiller replacement.',
    sources: [
      { name: 'BESA Heat Pump Guidance Bulletin', url: 'https://www.thebesa.com', publisher: 'BESA' },
      { name: 'CIBSE AM16 Biomass and Heat Pump Integration', url: 'https://www.cibse.org', publisher: 'CIBSE' },
    ],
    freshness: 92,
  },
  {
    title: 'Sub-Metering Regulations for Commercial Landlords: Tenant Billing and Energy Compliance',
    theme: 'Energy & Sustainability',
    categorySlug: 'energy-sustainability',
    whyNow: 'Heat Network (Metering and Billing) Regulations updates requiring accurate sub-metering in multi-tenant commercial office buildings.',
    intent: 'commercial sub metering regulations tenant billing heat network compliance',
    commercialValue: 'Directly positions EntireFM electrical metering, M&E services, and landlord service charge reporting.',
    sources: [
      { name: 'Office for Product Safety and Standards (OPSS)', url: 'https://www.gov.uk/guidance/heat-networks', publisher: 'Department for Energy Security and Net Zero' },
    ],
    freshness: 89,
  },
  {
    title: 'Water Hygiene and TMV Servicing in Healthcare and Commercial Offices: ACOP L8 Protocols',
    theme: 'Water Hygiene & Compliance',
    categorySlug: 'compliance-safety',
    whyNow: 'HSE targeted inspections on commercial premises with intermittent occupancy and dead-legs in domestic water distribution.',
    intent: 'legionella risk assessment TMV servicing frequency ACOP L8 commercial buildings',
    commercialValue: 'Drives enquiries to EntireFM Legionella water hygiene and monthly temperature logging services.',
    sources: [
      { name: 'HSE ACOP L8 Approved Code of Practice', url: 'https://www.hse.gov.uk/legionnaires/books.htm', publisher: 'Health and Safety Executive' },
      { name: 'Legionella Control Association (LCA)', url: 'https://www.legionellacontrol.org.uk', publisher: 'LCA' },
    ],
    freshness: 91,
  },
  {
    title: 'The Real Cost of Deferred Maintenance: Calculating Asset Depreciation and Emergency Triage Premiums',
    theme: 'FM Strategy & Financial Governance',
    categorySlug: 'fm-strategy',
    whyNow: 'Boardrooms scrutinizing estate capital expenditures amidst rising M&E parts lead times and inflation.',
    intent: 'deferred maintenance cost calculation asset depreciation risk commercial property',
    commercialValue: 'Persuades property managers to switch from reactive break-fix to structured EntireFM PPM contracts.',
    sources: [
      { name: 'RICS Property Maintenance Guidance', url: 'https://www.rics.org', publisher: 'RICS' },
      { name: 'IWFM Business Case for Maintenance', url: 'https://www.iwfm.org.uk', publisher: 'IWFM' },
    ],
    freshness: 88,
  },
];

/**
 * Execute automated FM industry research and topic discovery
 */
export async function runTopicDiscovery(): Promise<BlogTopicOpportunity[]> {
  const existingTopics = memoryStore.topics;
  const existingPosts = Array.from(memoryStore.posts.values());
  const categories = memoryStore.categories;
  const newOpportunities: BlogTopicOpportunity[] = [];

  for (const candidate of RESEARCH_TOPIC_CANDIDATES) {
    // Check if topic already discovered
    const alreadyExists = existingTopics.some(t => t.title.toLowerCase() === candidate.title.toLowerCase());
    if (alreadyExists) continue;

    // Check collision against EntireFM route estate and existing posts
    const { risk, collisions } = checkSearchIntentCollision(candidate.title, candidate.intent);
    
    let collisionStatus: BlogTopicOpportunity['collisionStatus'] = 'NO_COLLISION';
    let collidingUrl: string | undefined = undefined;

    if (risk === 'HIGH') {
      collisionStatus = 'HUMAN_REVIEW';
      collidingUrl = collisions[0]?.path;
    } else if (risk === 'MEDIUM') {
      collisionStatus = 'MERGE_IDEA';
      collidingUrl = collisions[0]?.path;
    }

    const matchedCat = categories.find(c => c.slug === candidate.categorySlug);

    const opp: BlogTopicOpportunity = {
      id: `top-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: candidate.title,
      topicTheme: candidate.theme,
      whyNow: candidate.whyNow,
      categoryId: matchedCat?.id || categories[0].id,
      categoryName: matchedCat?.name || categories[0].name,
      searchIntent: candidate.intent,
      commercialRelevance: candidate.commercialValue,
      supportingSources: candidate.sources,
      collisionStatus,
      collidingUrl,
      freshnessScore: candidate.freshness,
      overallScore: Math.round((candidate.freshness * 0.6) + (risk === 'NONE' ? 35 : 20)),
      status: collisionStatus === 'NO_COLLISION' ? 'OPPORTUNITY' : 'BLOCKED',
      createdAt: new Date().toISOString(),
    };

    memoryStore.topics.push(opp);
    newOpportunities.push(opp);
  }

  return newOpportunities;
}
