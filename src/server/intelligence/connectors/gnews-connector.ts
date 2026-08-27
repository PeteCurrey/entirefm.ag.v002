/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — GNEWS CONNECTOR
 * ======================================================
 * Server-only discovery engine for UK Facilities Management media.
 * Uses GNEWS_API_KEY.
 * Captures source image URLs and preserves publisher provenance.
 * Tier 4 discovery: never outranks Tier 1 statutory authorities.
 */

import { FMTaxonomyClassifier } from '../fm-classifier';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';
import type { CanonicalIntelligenceItem, RawIntelligenceRecord } from '../types';

export interface GNewsArticlePayload {
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export class GNewsConnector {
  private baseUrl = 'https://gnews.io/api/v4/search';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GNEWS_API_KEY;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /** Run targeted UK FM discovery query */
  public async discoverArticles(limit = 10): Promise<{
    canonicalItems: CanonicalIntelligenceItem[];
    rawRecords: RawIntelligenceRecord[];
  }> {
    const canonicalItems: CanonicalIntelligenceItem[] = [];
    const rawRecords: RawIntelligenceRecord[] = [];

    if (!this.isAvailable()) {
      return { canonicalItems, rawRecords };
    }

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.set('q', '"facilities management" OR "building safety" OR "commercial property" OR "M&E"');
      url.searchParams.set('country', 'gb');
      url.searchParams.set('lang', 'en');
      url.searchParams.set('max', limit.toString());
      url.searchParams.set('apikey', this.apiKey!);

      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'EntireFM-GNews-Discovery-Bot/1.0 (+https://entirefm.com/lobby)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) {
        return { canonicalItems, rawRecords };
      }

      const data = await res.json();
      const articles: GNewsArticlePayload[] = data.articles || [];

      for (const art of articles) {
        const fullText = `${art.title} ${art.description || ''}`;
        const classification = FMTaxonomyClassifier.classifyText(fullText);
        const jurisdictions = FMTaxonomyClassifier.inferJurisdictions(fullText);

        const contentId = `gnews-${Buffer.from(art.url).toString('base64').substring(0, 16)}`;
        const publisher = art.source?.name || 'FM Trade Media';

        const provenance = resolveEditorialImage({
          sourceImage: art.image,
          sourceImageAlt: art.title,
          sourcePublisher: publisher,
          sourceUrl: art.url,
          topic: classification.primaryCategory,
        });

        rawRecords.push({
          id: `raw-${contentId}`,
          sourceId: 'src-gnews-fm',
          sourceContentId: contentId,
          canonicalUrl: art.url,
          fetchedAt: new Date().toISOString(),
          contentHash: Buffer.from(`${art.title}-${art.publishedAt}`).toString('hex'),
          parserVersion: 'gnews-v4',
          rawPayload: art as unknown as Record<string, unknown>,
        });

        canonicalItems.push({
          id: `intel-${contentId}`,
          canonicalUrl: art.url,
          sourceContentId: contentId,
          title: art.title,
          standfirst: art.description || 'UK facilities management industry reporting and news development.',
          whyItMatters: `Industry development monitored across UK trade channels covering ${classification.primaryCategory}.`,
          eventType: 'trade_news',
          legalStatus: 'NEWS',
          authorityTier: 4,
          primarySource: {
            name: publisher,
            url: art.url,
            authorityTier: 3,
            publisher,
          },
          secondarySources: [],
          publishedAt: art.publishedAt || new Date().toISOString(),
          jurisdictions,
          tradeTags: [classification.primaryCategory, ...classification.secondaryCategories],
          topics: [publisher, classification.primaryCategory],
          provenance,
          isStatutory: false,
          requiresReview: false,
          reviewStatus: 'auto_published',
          contentHash: Buffer.from(`${art.title}-${art.publishedAt}`).toString('hex'),
          firstSeenAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
        });
      }
    } catch {
      // Graceful timeout
    }

    return { canonicalItems, rawRecords };
  }
}

export const gnewsConnector = new GNewsConnector();
