import { NextResponse } from 'next/server';
import { intelligenceStore } from '@/server/intelligence/intelligence-store';
import { opportunityStore } from '@/server/intelligence/opportunity-store';
import { ingestionOrchestrator } from '@/server/intelligence/ingestion-orchestrator';
import type { CanonicalIntelligenceItem, FMTradeCategory } from '@/server/intelligence/types';

const TRADE_LABEL_MAP: Record<string, string> = {
  'building-safety': 'Building Safety',
  'compliance': 'Compliance & Regulation',
  'fire-safety': 'Fire Safety',
  'electrical': 'Electrical (BS 7671)',
  'hvac': 'HVAC & Refrigeration',
  'mechanical': 'Mechanical & Plant',
  'water-hygiene': 'Water Hygiene (ACOP L8)',
  'lifts-access': 'Lifts & Access',
  'asbestos': 'Asbestos Management',
  'energy-sustainability': 'Energy & Decarbonisation',
  'cafm-technology': 'CAFM & Digital Operations',
  'procurement-contracts': 'Procurement & Contracts',
  'people-appointments': 'People & Leadership',
  'workplace-property': 'Property & Estates',
  'cleaning-soft-fm': 'Soft Services & Cleaning',
  'security': 'Security & Guarding',
  'waste-environment': 'Environmental & Waste',
};

function getDisciplineLabel(tradeTags?: FMTradeCategory[]): string {
  if (!tradeTags || tradeTags.length === 0) return 'Facilities Management';
  const first = tradeTags[0];
  return TRADE_LABEL_MAP[first] || 'Commercial FM';
}

function formatTime(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/London',
    }).format(new Date(isoDate));
  } catch {
    return '08:00';
  }
}

export async function GET() {
  const counts = await intelligenceStore.getCounts();
  // Trigger non-blocking live ingestion sync if database is empty
  if (counts.totalItems === 0) {
    ingestionOrchestrator.runFullIngestion().catch(() => {});
  }

  // Format today's date in London timezone
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(now);

  const timeFormatted = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(now);

  // 1. Fetch live canonical intelligence items
  const { items: allItems } = await intelligenceStore.query({ limit: 40 });

  // 2. Lead & Secondary Curation (Three Things That Matter)
  // Ranked by Authority Tier (Tier 1 Statutory first) and recency
  const sortedItems = [...allItems].sort((a, b) => {
    if (a.authorityTier !== b.authorityTier) {
      return a.authorityTier - b.authorityTier;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const threeThingsThatMatter: {
    lead?: any;
    secondary1?: any;
    secondary2?: any;
  } = {};

  if (sortedItems.length > 0) {
    const lead = sortedItems[0];
    threeThingsThatMatter.lead = {
      id: lead.id,
      title: lead.title,
      standfirst: lead.standfirst,
      whyItMatters: lead.whyItMatters || lead.standfirst,
      discipline: getDisciplineLabel(lead.tradeTags),
      authority: lead.primarySource?.name || 'Statutory Authority',
      jurisdiction: lead.jurisdictions?.[0] || 'United Kingdom',
      time: formatTime(lead.publishedAt),
      heroImage: lead.provenance?.imageUrl || '/images/editorial/entirefm-rooftop-plant-night-1200w.webp',
      heroImageAlt: lead.provenance?.altText || lead.title,
      url: lead.canonicalUrl?.startsWith('http') ? lead.canonicalUrl : '/lobby/compliance',
      sourceUrl: lead.primarySource?.url || lead.canonicalUrl || 'https://www.gov.uk',
    };
  }

  if (sortedItems.length > 1) {
    const s1 = sortedItems[1];
    threeThingsThatMatter.secondary1 = {
      id: s1.id,
      title: s1.title,
      standfirst: s1.standfirst,
      whyItMatters: s1.whyItMatters || s1.standfirst,
      discipline: getDisciplineLabel(s1.tradeTags),
      authority: s1.primarySource?.name || 'Official Body',
      jurisdiction: s1.jurisdictions?.[0] || 'United Kingdom',
      time: formatTime(s1.publishedAt),
      url: s1.canonicalUrl?.startsWith('http') ? s1.canonicalUrl : '/lobby/compliance',
      sourceUrl: s1.primarySource?.url || s1.canonicalUrl || 'https://www.gov.uk',
    };
  }

  if (sortedItems.length > 2) {
    const s2 = sortedItems[2];
    threeThingsThatMatter.secondary2 = {
      id: s2.id,
      title: s2.title,
      standfirst: s2.standfirst,
      whyItMatters: s2.whyItMatters || s2.standfirst,
      discipline: getDisciplineLabel(s2.tradeTags),
      authority: s2.primarySource?.name || 'Official Body',
      jurisdiction: s2.jurisdictions?.[0] || 'United Kingdom',
      time: formatTime(s2.publishedAt),
      url: s2.canonicalUrl?.startsWith('http') ? s2.canonicalUrl : '/lobby/compliance',
      sourceUrl: s2.primarySource?.url || s2.canonicalUrl || 'https://www.gov.uk',
    };
  }

  // 3. What Changed (Statutory & Regulatory updates)
  const statutoryItems = allItems.filter(
    (i) => i.isStatutory || i.eventType === 'statutory_change' || i.authorityTier === 1
  );
  const whatChangedSource = statutoryItems.length > 0 ? statutoryItems : allItems;
  const whatChanged = whatChangedSource.slice(0, 4).map((item) => ({
    id: item.id,
    time: formatTime(item.publishedAt),
    discipline: getDisciplineLabel(item.tradeTags),
    title: item.title,
    summary: item.standfirst,
    authority: item.primarySource?.name || 'Statutory Authority',
    jurisdiction: item.jurisdictions?.[0] || 'United Kingdom',
    url: item.canonicalUrl?.startsWith('http') ? item.canonicalUrl : '/lobby/compliance',
  }));

  // 4. Who Won What (Real Contract Awards from OpportunityStore)
  const liveAwards = await opportunityStore.getContractAwards(4);
  let whoWonWhat: any = null;

  if (liveAwards.length > 0) {
    const feat = liveAwards[0];
    whoWonWhat = {
      featuredAward: {
        supplier: feat.awardDetails?.supplierName || feat.buyerName,
        title: feat.title,
        buyer: feat.buyerName,
        service: getDisciplineLabel([feat.serviceCategory]),
        region: feat.buyerRegion,
        term: feat.awardDetails?.contractPeriodYears
          ? `${feat.awardDetails.contractPeriodYears} Years`
          : 'Commercial Framework',
        publishedAt: new Date(feat.publishedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
      recentAwards: liveAwards.slice(1, 4).map((a) => ({
        id: a.id,
        supplier: a.awardDetails?.supplierName || a.buyerName,
        title: a.title,
        buyer: a.buyerName,
        term: a.awardDetails?.contractPeriodYears
          ? `${a.awardDetails.contractPeriodYears} Years`
          : 'Framework',
        region: a.buyerRegion,
      })),
    };
  }

  // 5. On The Horizon (Future statutory deadlines & consultations)
  const horizonCandidates = allItems.filter(
    (i) => i.deadline || i.effectiveFrom || i.consultationData?.closingDate
  );
  const onTheHorizon = horizonCandidates.slice(0, 4).map((item) => {
    const targetDateStr = item.deadline || item.effectiveFrom || item.consultationData?.closingDate!;
    const targetDate = new Date(targetDateStr);
    const day = targetDate.toLocaleDateString('en-GB', { day: '2-digit' });
    const monthShort = targetDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const monthFull = targetDate.toLocaleDateString('en-GB', { month: 'long' }).toUpperCase();

    return {
      id: item.id,
      dateStr: `${day} ${monthShort}`,
      month: monthFull,
      year: targetDate.getFullYear(),
      title: item.title,
      type: item.eventType === 'consultation' ? 'Consultation Closes' : 'Statutory Deadline',
      discipline: getDisciplineLabel(item.tradeTags),
      jurisdiction: item.jurisdictions?.[0] || 'United Kingdom',
    };
  });

  // 6. From The Industry (Trade news, technical updates, appointments)
  const industryItems = allItems.filter(
    (i) => i.authorityTier >= 2 || i.eventType === 'trade_news' || i.eventType === 'appointment'
  );
  const fromTheIndustry = industryItems.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.standfirst,
    category: getDisciplineLabel(item.tradeTags),
    date: new Date(item.publishedAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    url: item.canonicalUrl?.startsWith('http') ? item.canonicalUrl : '/lobby',
  }));

  // 7. The Conversation
  const theConversation = {
    title: 'How much asset data do you insist on before mobilisation sign-off?',
    author: 'David Henderson',
    role: 'Director of Estates & Facilities',
    repliesCount: 14,
    url: '/lobby/community/discussion/how-much-asset-data-do-you-insist-on-before-mobilisation-sign-off',
    summary:
      'Discussion on the minimum statutory data attributes required in the asset register before accepting handover from the outgoing managing agent.',
  };

  // 8. One Useful Thing
  const oneUsefulThing = {
    title: 'Asset Register Builder',
    category: 'ONE USEFUL THING',
    whyItMatters: 'Standardise M&E plant hierarchies and verify mandatory statutory attributes for Golden Thread compliance.',
    format: 'Interactive Tool (.xlsx Export)',
    url: '/tools/asset-register-builder',
    image: '/images/editorial/entirefm-site-arrival-1200w.webp',
  };

  return NextResponse.json(
    {
      success: true,
      data: {
        dateFormatted,
        timeFormatted,
        threeThingsThatMatter,
        whatChanged,
        whoWonWhat,
        onTheHorizon,
        fromTheIndustry,
        theConversation,
        oneUsefulThing,
      },
      generatedAt: now.toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
