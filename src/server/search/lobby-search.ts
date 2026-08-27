import { LOBBY_ARTICLES } from '@/lib/lobby/content-store';
import { getDiscussions } from '../community/community-store';
import { getAllRooms } from '../rooms/room-store';
import { AUTHORITIES, STANDARDS } from '../knowledge-graph/graph';
import { getAllMembers } from '../member/member-store';

export type SearchGroup =
  | 'BEST_MATCH'
  | 'COMPLIANCE'
  | 'COMMUNITY'
  | 'TOOLS_RESOURCES'
  | 'GUIDES'
  | 'LEARNING'
  | 'EVENTS'
  | 'PEOPLE';

export interface LobbySearchResult {
  id: string;
  group: SearchGroup;
  title: string;
  snippet: string;
  href: string;
  badge: string;
  badgeType?: 'compliance' | 'verified' | 'solved' | 'tool' | 'room' | 'official';
  publishedAt?: string;
  authorName?: string;
  score: number;
}

export interface UnifiedSearchResponse {
  query: string;
  totalResults: number;
  resultsByGroup: Record<SearchGroup, LobbySearchResult[]>;
  isZeroResult: boolean;
  suggestedAction?: {
    text: string;
    actionUrl: string;
    label: string;
  };
}

// In-memory knowledge gap log
interface KnowledgeGap {
  query: string;
  count: number;
  firstSearchedAt: string;
  lastSearchedAt: string;
  status: 'open' | 'planned' | 'resolved';
}
const KNOWLEDGE_GAPS: Map<string, KnowledgeGap> = new Map();

export function getKnowledgeGaps(): KnowledgeGap[] {
  return Array.from(KNOWLEDGE_GAPS.values()).sort((a, b) => b.count - a.count);
}

// Pre-defined FM Tools index
const FM_TOOLS_INDEX = [
  {
    title: 'Asset Register Builder',
    snippet: 'Generate an SFG20-aligned statutory asset schedule with full nameplate data capture.',
    href: '/tools/asset-register-builder',
    badge: 'FM Tool',
    keywords: ['asset register', 'sfg20', 'mobilisation', 'asset data', 'maintenance inventory'],
  },
  {
    title: 'PPM Frequency & Runtime Calculator',
    snippet: 'Calculate duty cycle, SFG20 benchmark intervals, and optimal runtime maintenance triggers.',
    href: '/tools/ppm-frequency-calculator',
    badge: 'Calculator',
    keywords: ['ppm frequency', 'runtime', 'maintenance frequency', 'ahu', 'chiller', 'pumps'],
  },
  {
    title: 'Statutory Compliance Matrix',
    snippet: 'Master reference matrix of all 42 UK statutory building maintenance obligations.',
    href: '/resources/commercial-fm-statutory-compliance-matrix',
    badge: 'Checklist',
    keywords: ['compliance matrix', 'statutory', 'fire doors', 'legionella', 'gas', 'electrical'],
  },
  {
    title: 'Water Hygiene Audit Checklist',
    snippet: 'Comprehensive ACOP L8 & HSG274 contractor audit and sampling verification checklist.',
    href: '/resources/water-hygiene-audit-checklist',
    badge: 'Checklist',
    keywords: ['water hygiene', 'legionella', 'acop l8', 'calorifier', 'sampling'],
  },
];

export async function searchLobby(query: string, options?: { filterGroup?: string }): Promise<UnifiedSearchResponse> {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      query: '',
      totalResults: 0,
      resultsByGroup: {
        BEST_MATCH: [],
        COMPLIANCE: [],
        COMMUNITY: [],
        TOOLS_RESOURCES: [],
        GUIDES: [],
        LEARNING: [],
        EVENTS: [],
        PEOPLE: [],
      },
      isZeroResult: false,
    };
  }

  const results: LobbySearchResult[] = [];

  // 1. Search Lobby Editorial & Compliance Articles
  for (const article of LOBBY_ARTICLES) {
    const titleMatch = article.title.toLowerCase().includes(q);
    const standfirstMatch = article.standfirst.toLowerCase().includes(q);
    const bodyMatch = (article.bodyBlocks || []).some((b: any) =>
      b.content ? b.content.toLowerCase().includes(q) : false
    );
    const topicMatch = article.topics.some((t: string) => t.toLowerCase().includes(q));

    if (titleMatch || standfirstMatch || bodyMatch || topicMatch) {
      let score = 0;
      if (titleMatch) score += 50;
      if (topicMatch) score += 30;
      if (standfirstMatch) score += 20;
      if (bodyMatch) score += 10;

      const isCompliance = article.franchise === 'compliance-watch';

      results.push({
        id: article.id,
        group: isCompliance ? 'COMPLIANCE' : 'GUIDES',
        title: article.title,
        snippet: article.standfirst,
        href: `/lobby/${article.slug}`,
        badge: isCompliance ? 'Compliance Watch' : article.franchise.replace('-', ' ').toUpperCase(),
        badgeType: isCompliance ? 'compliance' : 'official',
        publishedAt: article.publishedAt,
        authorName: article.author.name,
        score,
      });
    }
  }

  // 1b. Search News Articles
  const { getNewsArticles } = await import('../news/news-store');
  const { articles: newsItems } = getNewsArticles({ search: q, limit: 10 });
  for (const news of newsItems) {
    results.push({
      id: news.id,
      group: 'GUIDES',
      title: news.title,
      snippet: news.standfirst,
      href: `/lobby/news/article/${news.slug}`,
      badge: `News · ${news.sourceName}`,
      badgeType: 'official',
      publishedAt: news.publishedAt,
      score: 40,
    });
  }

  // 1c. Search Industry Awards
  const { getIndustryAwards } = await import('../awards/awards-store');
  const { awards: awardItems } = getIndustryAwards({ search: q, limit: 5 });
  for (const award of awardItems) {
    results.push({
      id: award.id,
      group: 'EVENTS',
      title: award.name,
      snippet: award.description,
      href: `/lobby/awards/${award.slug}`,
      badge: `Award · ${award.organiser}`,
      badgeType: 'official',
      score: 35,
    });
  }

  // 2. Search Community Discussions
  const { discussions } = getDiscussions({ query: q, limit: 10 });
  for (const disc of discussions) {
    let score = 30;
    if (disc.solved) score += 25;
    if (disc.featured) score += 15;
    score += disc.helpfulCount * 2;

    results.push({
      id: disc.id,
      group: 'COMMUNITY',
      title: disc.title,
      snippet: disc.body.slice(0, 140) + '...',
      href: `/lobby/community/discussion/${disc.slug}`,
      badge: disc.solved ? 'Solved Discussion' : `${disc.replyCount} replies`,
      badgeType: disc.solved ? 'solved' : undefined,
      publishedAt: disc.createdAt,
      authorName: disc.authorName,
      score,
    });
  }

  // 3. Search FM Tools & Resources
  for (const tool of FM_TOOLS_INDEX) {
    const match =
      tool.title.toLowerCase().includes(q) ||
      tool.snippet.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.includes(q) || q.includes(k));

    if (match) {
      results.push({
        id: tool.href,
        group: 'TOOLS_RESOURCES',
        title: tool.title,
        snippet: tool.snippet,
        href: tool.href,
        badge: tool.badge,
        badgeType: 'tool',
        score: 45,
      });
    }
  }

  // 4. Search Realtime Rooms
  const rooms = getAllRooms();
  for (const room of rooms) {
    if (
      room.name.toLowerCase().includes(q) ||
      room.description.toLowerCase().includes(q) ||
      room.topic.toLowerCase().includes(q)
    ) {
      results.push({
        id: room.id,
        group: 'COMMUNITY',
        title: room.name,
        snippet: room.description,
        href: `/lobby/rooms/${room.slug}`,
        badge: `Live Room (${room.activePresenceCount} active)`,
        badgeType: 'room',
        score: 35,
      });
    }
  }

  // 5. Search Public Members
  const publicMembers = await getAllMembers();
  for (const mem of publicMembers) {
    if (mem.profile_visibility === 'public') {
      const match =
        mem.display_name.toLowerCase().includes(q) ||
        (mem.headline && mem.headline.toLowerCase().includes(q)) ||
        (mem.disciplines && mem.disciplines.some((d: string) => d.toLowerCase().includes(q)));

      if (match) {
        results.push({
          id: mem.id,
          group: 'PEOPLE',
          title: mem.display_name,
          snippet: mem.headline || `${mem.company || 'EntireFM Member'} · ${mem.disciplines.join(', ')}`,
          href: `/member/profile?id=${mem.id}`,
          badge: mem.badges[0] || 'Member',
          badgeType: 'verified',
          score: 25,
        });
      }
    }
  }

  // Group and sort results
  results.sort((a, b) => b.score - a.score);

  const resultsByGroup: Record<SearchGroup, LobbySearchResult[]> = {
    BEST_MATCH: [],
    COMPLIANCE: [],
    COMMUNITY: [],
    TOOLS_RESOURCES: [],
    GUIDES: [],
    LEARNING: [],
    EVENTS: [],
    PEOPLE: [],
  };

  if (results.length > 0) {
    // Top result becomes BEST_MATCH
    resultsByGroup.BEST_MATCH = [results[0]];
    for (let i = 1; i < results.length; i++) {
      const item = results[i];
      resultsByGroup[item.group].push(item);
    }
  } else {
    // Log zero-result knowledge gap
    const gapKey = q.toLowerCase();
    const existing = KNOWLEDGE_GAPS.get(gapKey);
    if (existing) {
      existing.count += 1;
      existing.lastSearchedAt = new Date().toISOString();
    } else {
      KNOWLEDGE_GAPS.set(gapKey, {
        query: q,
        count: 1,
        firstSearchedAt: new Date().toISOString(),
        lastSearchedAt: new Date().toISOString(),
        status: 'open',
      });
    }
  }

  return {
    query,
    totalResults: results.length,
    resultsByGroup,
    isZeroResult: results.length === 0,
    suggestedAction:
      results.length === 0
        ? {
            text: 'We don’t have a published guide or discussion covering this exact query yet.',
            actionUrl: `/lobby/community/new?title=${encodeURIComponent(query)}`,
            label: 'Ask the Community',
          }
        : undefined,
  };
}
