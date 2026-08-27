import { LOBBY_ARTICLES } from './content-store';
import { LOBBY_TOPICS, getTopicBySlug } from './topics';
import { LOBBY_HOMEPAGE_CURATION } from './curation';
import { LOBBY_DATA } from '@/data/lobby/content';
import type { LobbyArticle, Topic, Franchise } from './types';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

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
  complianceWatch: LobbyArticle;
  engineersNote: LobbyArticle;
  usefulThing: LobbyArticle;
  fromTheField: LobbyArticle;
  askEntireFM: LobbyArticle;
  worthAttending: LobbyArticle;
  briefingStrip: typeof LOBBY_DATA.briefingStrip;
  toolkit: typeof LOBBY_DATA.toolkit;
  lobbyQuestion: typeof LOBBY_DATA.lobbyQuestion;
  lobbyPulse: typeof LOBBY_DATA.lobbyPulse;
}

export function getLobbyHomepageData(): ResolvedLobbyHomepageData {
  const all = getAllPublishedLobbyArticles();

  // Helper to resolve slot or fallback to latest matching franchise
  const resolveSlot = (slug: string, franchise: Franchise): LobbyArticle => {
    const matched = all.find((a) => a.slug === slug);
    if (matched) return matched;
    const fallback = all.find((a) => a.franchise === franchise);
    if (fallback) return fallback;
    return all[0];
  };

  const leadStory = resolveSlot(LOBBY_HOMEPAGE_CURATION.leadStorySlug, 'week-that-matters');
  const complianceWatch = resolveSlot(LOBBY_HOMEPAGE_CURATION.complianceWatchSlug, 'compliance-watch');
  const engineersNote = resolveSlot(LOBBY_HOMEPAGE_CURATION.engineersNoteSlug, 'engineers-note');
  const usefulThing = resolveSlot(LOBBY_HOMEPAGE_CURATION.usefulThingSlug, 'useful-thing');
  const fromTheField = resolveSlot(LOBBY_HOMEPAGE_CURATION.fromTheFieldSlug, 'from-the-field');
  const askEntireFM = resolveSlot(LOBBY_HOMEPAGE_CURATION.askEntireFMSlug, 'ask-entirefm');
  const worthAttending = resolveSlot(LOBBY_HOMEPAGE_CURATION.worthAttendingSlug, 'worth-attending');

  return {
    curation: LOBBY_HOMEPAGE_CURATION,
    leadStory,
    complianceWatch,
    engineersNote,
    usefulThing,
    fromTheField,
    askEntireFM,
    worthAttending,
    briefingStrip: LOBBY_DATA.briefingStrip,
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
