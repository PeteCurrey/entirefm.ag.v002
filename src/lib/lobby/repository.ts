import { LOBBY_ARTICLES } from './content-store';
import { LOBBY_TOPICS, getTopicBySlug } from './topics';
import {
  LOBBY_HOMEPAGE_CURATION,
  getLobbyHomepageCuration,
  checkCurationStaleness,
  STATIC_LOBBY_HOMEPAGE_CURATION,
} from './curation';
import { LOBBY_DATA } from '@/data/lobby/content';
import type { LobbyArticle, Topic, Franchise } from './types';
import type { BriefingStripItem, ComplianceWatchItem } from '@/data/lobby/types';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';
import { intelligenceStore } from '@/server/intelligence/intelligence-store';
import { dbQuery, isDbConfigured } from '@/server/db/client';

/**
 * LOBBY CONTENT REPOSITORY
 * ========================
 * Single query and access layer for all Lobby articles, topics, and curated feeds.
 * Abstracting this enables migration to CMS/Database without touching UI components.
 */

/** Get all published articles (sorted by publication date descending) */
export function getAllPublishedLobbyArticles(): LobbyArticle[] {
  return LOBBY_ARTICLES.filter((a) => a.status === 'published').sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** Get a single published article by slug */
export function getLobbyArticleBySlug(slug: string): LobbyArticle | undefined {
  const article = LOBBY_ARTICLES.find((a) => a.slug === slug);
  if (!article || article.status !== 'published') return undefined;
  return article;
}

/** Get all published articles for a given topic */
export function getLobbyArticlesByTopic(topicSlug: string): LobbyArticle[] {
  return getAllPublishedLobbyArticles().filter((a) => a.topics.includes(topicSlug));
}

/** Get all published articles for a given franchise */
export function getLobbyArticlesByFranchise(franchise: Franchise): LobbyArticle[] {
  return getAllPublishedLobbyArticles().filter((a) => a.franchise === franchise);
}

/** Get intelligently resolved related articles */
export function getRelatedArticles(currentArticle: LobbyArticle, limit: number = 3): LobbyArticle[] {
  const all = getAllPublishedLobbyArticles().filter((a) => a.id !== currentArticle.id);

  // 1. Check manual explicit relatedContentSlugs
  if (currentArticle.relatedContentSlugs && currentArticle.relatedContentSlugs.length > 0) {
    const manualMatches = all.filter((a) => currentArticle.relatedContentSlugs?.includes(a.slug));
    if (manualMatches.length >= limit) return manualMatches.slice(0, limit);
  }

  // 2. Score by overlapping topics
  const scored = all.map((article) => {
    let score = 0;
    for (const t of article.topics) {
      if (currentArticle.topics.includes(t)) score += 2;
    }
    if (article.franchise === currentArticle.franchise) score += 1;
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.article);
}

/** Get all active topics */
export function getAllLobbyTopics(): Topic[] {
  return LOBBY_TOPICS;
}

export { getTopicBySlug };

/**
 * Resolved Homepage Data Structure
 * Resolves curated slots with automatic fallback to latest published franchise items.
 */
export interface ResolvedLobbyHomepageData {
  curation: typeof LOBBY_HOMEPAGE_CURATION;
  leadStory: LobbyArticle;
  complianceWatch: ComplianceWatchItem | null;
  engineersNote: LobbyArticle;
  usefulThing: LobbyArticle;
  fromTheField: LobbyArticle;
  askEntireFM: LobbyArticle;
  worthAttending: LobbyArticle;
  briefingStrip: BriefingStripItem[];
  toolkit: typeof LOBBY_DATA.toolkit;
  lobbyQuestion: typeof LOBBY_DATA.lobbyQuestion;
  lobbyPulse: typeof LOBBY_DATA.lobbyPulse;
}

// ---------------------------------------------------------------------------
// RELATIVE-TIME FORMATTER
// Computes a human-readable age string from a published_at ISO timestamp.
// Matches the slot labels the BriefingStrip UI renders (e.g. "3h ago",
// "Yesterday", "2 days ago"). Called at request time so timestamps are always
// accurate rather than being committed literals.
// ---------------------------------------------------------------------------
function formatRelativeTime(isoTimestamp: string): string {
  try {
    const published = new Date(isoTimestamp);
    const nowMs = Date.now();
    const diffMs = nowMs - published.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) {
      const time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/London',
      }).format(published);
      return `Today, ${time}`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(published);
  } catch {
    return 'Recently';
  }
}

// ---------------------------------------------------------------------------
// TRADE TAG → FM CATEGORY LABEL
// Maps intelligence_items trade_tags to human-readable category strings for
// the BriefingStrip category badge (e.g. "hvac" → "HVAC & Refrigeration").
// ---------------------------------------------------------------------------
const TRADE_TAG_LABEL: Record<string, string> = {
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
};

function tradeLabelFromTags(tradeTags?: string[]): string {
  if (!tradeTags || tradeTags.length === 0) return 'Facilities Management';
  return TRADE_TAG_LABEL[tradeTags[0]] || 'Commercial FM';
}

// ---------------------------------------------------------------------------
// IMPACT LEVEL MAPPING
// Maps intelligence item authority tiers to the BriefingStripItem impactLevel
// enum that the component expects.
// ---------------------------------------------------------------------------
function impactLevelFromTier(authorityTier?: number, isStatutory?: boolean): BriefingStripItem['impactLevel'] {
  if (isStatutory || authorityTier === 1) return 'Direct Duty';
  if (authorityTier === 2) return 'Operational';
  return 'Market Shift';
}

// ---------------------------------------------------------------------------
// DEFAULT FALLBACK IMAGES
// Used when an intelligence item has no provenance.imageUrl, so the UI never
// renders a broken image. A console.warn is emitted to flag backfill need.
// ---------------------------------------------------------------------------
const FALLBACK_IMAGES = [
  '/images/editorial/entirefm-hvac-refrigerant-check-1200w.webp',
  '/images/editorial/entirefm-plumbing-booster-set-1200w.webp',
  '/images/editorial/entirefm-switchgear-inspection-1200w.webp',
];

/**
 * Fetch the live Briefing Wire strip from `canonical_intelligence_items`.
 *
 * Returns up to `limit` items mapped to BriefingStripItem shape.
 * If the DB is not configured, returns an empty array (caller will use
 * LOBBY_DATA.briefingStrip as a local-dev seed).
 * If the DB returns zero approved items, returns an empty array so the
 * FEED_OFFLINE empty-state in BriefingStrip renders instead of stale data.
 */
export async function getHomepageBriefingStrip(limit = 3): Promise<BriefingStripItem[]> {
  if (!isDbConfigured()) {
    // Local dev without DB: use committed seed data — never in production
    console.warn('[BriefingStrip] DB not configured — falling back to LOBBY_DATA.briefingStrip seed');
    return LOBBY_DATA.briefingStrip;
  }

  const { items } = await intelligenceStore.query({ limit });

  if (items.length === 0) {
    // Production: live query returned nothing → render FEED_OFFLINE state
    return [];
  }

  return items.map((item, idx): BriefingStripItem => {
    const provenanceImage = (item.provenance as any)?.imageUrl as string | undefined;
    if (!provenanceImage) {
      console.warn(
        `[BriefingStrip] intelligence item "${item.id}" has no provenance.imageUrl — using fallback. Backfill needed.`
      );
    }

    return {
      id: item.id,
      category: tradeLabelFromTags(item.tradeTags),
      headline: item.title,
      summary: item.standfirst || item.whyItMatters || item.title,
      sector: item.relevantSectors?.[0] || item.jurisdictions?.[0] || 'Commercial FM',
      impactLevel: impactLevelFromTier((item as any).authorityTier, (item as any).isStatutory),
      timestamp: formatRelativeTime(item.publishedAt),
      topicImage: provenanceImage || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
      topicImageAlt: (item.provenance as any)?.altText || item.title,
      sourcePublisher: item.primarySource?.name,
      url: item.canonicalUrl?.startsWith('http') ? item.canonicalUrl : '/lobby/compliance',
    };
  });
}

// ---------------------------------------------------------------------------
// HTML ENTITY DECODER
// Cleans up numeric/named HTML entities from ingested titles and summaries.
// ---------------------------------------------------------------------------
function cleanHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#38;|&amp;/g, '&')
    .replace(/&#8211;|–/g, '–')
    .replace(/&#8217;|'/g, "'")
    .replace(/&#8220;|“/g, '"')
    .replace(/&#8221;|”/g, '"')
    .replace(/\[&#8230;\]|\[\.\.\.\]|\.\.\./g, '...')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// ---------------------------------------------------------------------------
// COMPLIANCE WATCH RESOLVER & MAPPERS
// Maps an article or an intelligence_items row to the ComplianceWatchItem shape.
// Editorial pins in lobby_homepage_curation are respected if not stale.
// If stale or unpinned, the live query against intelligence_items provides the
// highest-urgency, most recent verified regulatory directive.
// Zero-fake-data: returns null on empty so FEED_OFFLINE state renders.
// ---------------------------------------------------------------------------
function mapArticleToComplianceWatch(article: LobbyArticle): ComplianceWatchItem {
  return {
    id: article.id,
    statute: article.complianceData?.statute || 'Statutory Compliance',
    regulationTitle: article.title,
    urgency: (article.complianceData?.urgency as any) || 'HIGH',
    effectiveDate: article.complianceData?.effectiveDate || 'Active Standard',
    whatChanged: cleanHtmlEntities(article.complianceData?.whatChanged || article.standfirst),
    whoItAffects:
      article.complianceData?.whoItAffects ||
      'Commercial landlords, estates directors, corporate facilities heads, and responsible persons.',
    whatYouNeedToDo: cleanHtmlEntities(
      article.complianceData?.whatYouNeedToDo ||
        'Audit your current CAFM asset change-log and verify contractor accreditations.'
    ),
    whenItMatters:
      article.complianceData?.whenItMatters ||
      'Immediate action required for active PPM cycles and planned remedial works.',
    governingBody: article.complianceData?.governingBody || 'Building Safety Regulator (HSE)',
    sourceDocUrl: `/lobby/${article.slug}`,
    imageUrl: article.heroImage || '/images/editorial/commercial-switchgear-compliance.jpg',
    imageAlt: article.heroImageAlt || article.title,
  };
}

function mapIntelligenceItemToComplianceWatch(row: any): ComplianceWatchItem {
  const severityToUrgency: Record<string, ComplianceWatchItem['urgency']> = {
    CRITICAL: 'HIGH',
    ACTION_REQUIRED: 'HIGH',
    ACTION_MAY_BE_REQUIRED: 'MEDIUM',
    ADVISORY: 'MEDIUM',
    TECHNICAL_UPDATE: 'MONITORING',
    INFORMATION: 'MONITORING',
  };

  const formattedDate = row.published_at
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(row.published_at)
      )
    : 'Active';

  const effectiveDate = row.effective_from
    ? `Effective ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(row.effective_from))}`
    : row.deadline_date
    ? `Deadline ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(row.deadline_date))}`
    : `Published ${formattedDate}`;

  const statute = row.legal_status
    ? row.legal_status.replace(/_/g, ' ')
    : row.source_name || 'Statutory Notice';

  return {
    id: row.id,
    statute: cleanHtmlEntities(statute),
    regulationTitle: cleanHtmlEntities(row.title),
    urgency: severityToUrgency[row.severity] || 'HIGH',
    effectiveDate,
    whatChanged: cleanHtmlEntities(row.what_changed || row.entirefm_summary || row.title),
    whoItAffects:
      'Duty holders, facilities managers, and responsible persons managing commercial and mixed-use property portfolios.',
    whatYouNeedToDo: cleanHtmlEntities(
      row.suggested_contractor_action ||
        'Audit your current statutory registers and update CAFM compliance logs to reflect this change.'
    ),
    whenItMatters:
      row.severity === 'CRITICAL' || row.severity === 'ACTION_REQUIRED'
        ? 'Immediate action required for active PPM cycles and risk assessments.'
        : 'Review during scheduled maintenance compliance reviews.',
    governingBody: row.source_name || 'Health and Safety Executive',
    sourceDocUrl: row.canonical_url?.startsWith('http') ? row.canonical_url : '/lobby/compliance',
    imageUrl: '/images/editorial/commercial-switchgear-compliance.jpg',
    imageAlt: cleanHtmlEntities(row.title),
  };
}

export async function getHomepageComplianceWatch(
  curation: typeof LOBBY_HOMEPAGE_CURATION
): Promise<ComplianceWatchItem | null> {
  // 1. Check if an editorial pin is set and not stale
  const { isStale } = checkCurationStaleness(curation.updatedAt);
  if (!isStale && curation.complianceWatchSlug && curation.complianceWatchSlug !== STATIC_LOBBY_HOMEPAGE_CURATION.complianceWatchSlug) {
    if (isDbConfigured()) {
      const { data } = await dbQuery<any[]>(
        `intelligence_items?id=eq.${encodeURIComponent(curation.complianceWatchSlug)}&review_status=in.(APPROVED,AUTO_PUBLISHED)&limit=1`
      );
      if (data && data.length > 0) {
        return mapIntelligenceItemToComplianceWatch(data[0]);
      }
    }

    const article = getAllPublishedLobbyArticles().find((a) => a.slug === curation.complianceWatchSlug);
    if (article && article.complianceData) {
      return mapArticleToComplianceWatch(article);
    }
  }

  // 2. Query live intelligence_items for compliance-relevant items
  if (!isDbConfigured()) {
    // Local dev without DB: fallback to static seed
    return LOBBY_DATA.complianceWatch;
  }

  const { data: rows } = await dbQuery<any[]>(
    'intelligence_items?review_status=in.(APPROVED,AUTO_PUBLISHED)&order=published_at.desc&limit=50'
  );

  const items = rows || [];
  const complianceItems = items.filter((i: any) => {
    const hasTrade =
      Array.isArray(i.trade_tags) &&
      i.trade_tags.some((t: string) =>
        ['compliance', 'building-safety', 'fire-safety', 'water-hygiene', 'electrical', 'hvac', 'asbestos'].includes(t)
      );
    const isStatutoryEvent = [
      'REGULATORY_CHANGE',
      'LEGISLATION_PUBLISHED',
      'LEGISLATION_AMENDED',
      'HSE_ENFORCEMENT',
      'PRODUCT_SAFETY_RECALL',
      'PROSECUTION',
      'STANDARDS_UPDATE',
    ].includes(i.event_type);
    const isStatutoryTier = i.authority_tier === 1;
    return hasTrade || isStatutoryEvent || isStatutoryTier;
  });

  if (complianceItems.length === 0) {
    // Zero-fake-data policy: return null so FEED_OFFLINE renders
    return null;
  }

  const severityRank: Record<string, number> = {
    CRITICAL: 1,
    ACTION_REQUIRED: 2,
    ACTION_MAY_BE_REQUIRED: 3,
    ADVISORY: 4,
    TECHNICAL_UPDATE: 5,
    INFORMATION: 6,
  };

  complianceItems.sort((a: any, b: any) => {
    const rankA = severityRank[a.severity] || 99;
    const rankB = severityRank[b.severity] || 99;
    if (rankA !== rankB) return rankA - rankB;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  return mapIntelligenceItemToComplianceWatch(complianceItems[0]);
}

export async function getLobbyHomepageData(): Promise<ResolvedLobbyHomepageData> {
  const curation = await getLobbyHomepageCuration();
  const all = getAllPublishedLobbyArticles();

  // Helper to resolve slot or fallback to latest matching franchise
  const resolveSlot = (slug: string, franchise: Franchise): LobbyArticle => {
    const matched = all.find((a) => a.slug === slug);
    if (matched) return matched;
    const fallback = all.find((a) => a.franchise === franchise);
    if (fallback) return fallback;
    return all[0];
  };

  const leadStory = resolveSlot(curation.leadStorySlug, 'week-that-matters');
  const engineersNote = resolveSlot(curation.engineersNoteSlug, 'engineers-note');
  const usefulThing = resolveSlot(curation.usefulThingSlug, 'useful-thing');
  const fromTheField = resolveSlot(curation.fromTheFieldSlug, 'from-the-field');
  const askEntireFM = resolveSlot(curation.askEntireFMSlug, 'ask-entirefm');
  const worthAttending = resolveSlot(curation.worthAttendingSlug, 'worth-attending');

  // Lightweight staleness guardrail for curated editorial modules:
  // Checks each resolved article's publishedAt against the current date.
  // Emits a server-side console.warn so staleness is observable in Vercel
  // logs without hiding content or breaking the page.
  const checkArticleStaleness = (slotName: string, article: LobbyArticle, maxDays = 7) => {
    if (!article?.publishedAt) return;
    const publishedTime = new Date(article.publishedAt).getTime();
    const ageInDays = Math.floor((Date.now() - publishedTime) / (1000 * 60 * 60 * 24));
    if (ageInDays > maxDays) {
      console.warn(`[Lobby] ${slotName} is ${ageInDays} days stale: ${article.slug}`);
    }
  };

  checkArticleStaleness('Lead story', leadStory, 7);
  checkArticleStaleness("Engineer's note", engineersNote, 7);
  checkArticleStaleness('Useful thing', usefulThing, 7);
  checkArticleStaleness('From the field', fromTheField, 7);
  checkArticleStaleness('Ask EntireFM', askEntireFM, 7);

  // Fetch live briefing wire and live compliance watch concurrently.
  // Both adhere to zero-fake-data: returns [] or null on empty/offline.
  const [briefingStrip, complianceWatch] = await Promise.all([
    getHomepageBriefingStrip(3),
    getHomepageComplianceWatch(curation),
  ]);

  return {
    curation,
    leadStory,
    complianceWatch,
    engineersNote,
    usefulThing,
    fromTheField,
    askEntireFM,
    worthAttending,
    briefingStrip,
    toolkit: LOBBY_DATA.toolkit,
    lobbyQuestion: LOBBY_DATA.lobbyQuestion,
    lobbyPulse: LOBBY_DATA.lobbyPulse,
  };
}

/** Generate standard RSS 2.0 XML for The Lobby */
export function generateLobbyRssXml(): string {
  const articles = getAllPublishedLobbyArticles();
  const siteUrl = PRODUCTION_CANONICAL_HOST;

  const itemsXml = articles
    .map((a) => {
      const link = `${siteUrl}/lobby/${a.slug}`;
      const pubDate = new Date(a.publishedAt).toUTCString();
      return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${a.standfirst}]]></description>
      <author>${a.author.name}</author>
      <pubDate>${pubDate}</pubDate>
      <category>${a.franchise}</category>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Lobby | EntireFM Facilities Intelligence</title>
    <link>${siteUrl}/lobby</link>
    <description>The daily briefing room for UK facilities management professionals: regulatory updates, engineering diagnostics, and compliance analysis.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/lobby/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;
}
