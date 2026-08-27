/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — RSS TRADE & OPSS CONNECTOR
 * ================================================================
 * Ingests live news, technical standards, events, and product recalls
 * from official trade bodies (CIBSE, BESA, IWFM, FIA, ECA) and OPSS.
 */

import { FMTaxonomyClassifier } from '../fm-classifier';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';
import type { CanonicalIntelligenceItem, RawIntelligenceRecord } from '../types';

interface TradeFeedConfig {
  sourceId: string;
  sourceName: string;
  url: string;
  authorityTier: 1 | 2 | 3;
  defaultTrade: string;
}

export class RssTradeConnector {
  private static FEEDS: TradeFeedConfig[] = [
    {
      sourceId: 'src-opss-recalls',
      sourceName: 'Office for Product Safety and Standards (OPSS)',
      url: 'https://www.gov.uk/product-safety-alerts-reports-recalls.atom',
      authorityTier: 1,
      defaultTrade: 'electrical',
    },
    {
      sourceId: 'src-cibse-news',
      sourceName: 'CIBSE Technical Directorate',
      url: 'https://www.cibse.org/rss/news',
      authorityTier: 2,
      defaultTrade: 'hvac',
    },
    {
      sourceId: 'src-besa-wire',
      sourceName: 'Building Engineering Services Association (BESA)',
      url: 'https://www.thebesa.com/news/rss',
      authorityTier: 2,
      defaultTrade: 'mechanical',
    },
    {
      sourceId: 'src-iwfm-insights',
      sourceName: 'Institute of Workplace and Facilities Management (IWFM)',
      url: 'https://www.iwfm.org.uk/news.rss',
      authorityTier: 2,
      defaultTrade: 'compliance',
    },
    {
      sourceId: 'src-fia-fire',
      sourceName: 'Fire Industry Association (FIA)',
      url: 'https://www.fia.uk.com/news/rss.xml',
      authorityTier: 2,
      defaultTrade: 'fire-safety',
    },
  ];

  /** Ingest all trade RSS feeds */
  public async fetchAllTradeFeeds(): Promise<{
    canonicalItems: CanonicalIntelligenceItem[];
    rawRecords: RawIntelligenceRecord[];
  }> {
    const canonicalItems: CanonicalIntelligenceItem[] = [];
    const rawRecords: RawIntelligenceRecord[] = [];

    for (const feed of RssTradeConnector.FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: {
            'User-Agent': 'EntireFM-TradeFeed-Bot/1.0 (+https://entirefm.com/lobby)',
            Accept: 'application/rss+xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) continue;

        const text = await res.text();
        const items = this.parseRssOrAtom(text);

        for (const item of items.slice(0, 5)) {
          const fullText = `${item.title} ${item.description}`;
          const classification = FMTaxonomyClassifier.classifyText(fullText);
          const jurisdictions = FMTaxonomyClassifier.inferJurisdictions(fullText);

          const contentId = `trade-${Buffer.from(item.link).toString('base64').substring(0, 16)}`;
          const publishedAt = item.pubDate || new Date().toISOString();

          const isRecall = feed.sourceId === 'src-opss-recalls';

          const provenance = resolveEditorialImage({
            topic: classification.primaryCategory,
            sourcePublisher: feed.sourceName,
            sourceUrl: item.link,
            customProvenance: {
              credit: `Official ${feed.sourceName} Publication`,
            },
          });

          rawRecords.push({
            id: `raw-${contentId}`,
            sourceId: feed.sourceId,
            sourceContentId: contentId,
            canonicalUrl: item.link,
            fetchedAt: new Date().toISOString(),
            contentHash: Buffer.from(`${item.title}-${publishedAt}`).toString('hex'),
            parserVersion: 'trade-rss-v1',
            rawPayload: item as unknown as Record<string, unknown>,
          });

          canonicalItems.push({
            id: `intel-${contentId}`,
            canonicalUrl: item.link,
            sourceContentId: contentId,
            title: isRecall ? `Product Safety Alert: ${item.title}` : item.title,
            standfirst: item.description || `Official technical notice published by ${feed.sourceName}.`,
            whyItMatters: isRecall
              ? `Estates managers must inspect asset logs for this product to prevent fire or electrical hazards.`
              : `Technical guidance issued by ${feed.sourceName} setting best practice standards for FM teams.`,
            eventType: isRecall ? 'safety_alert' : 'trade_news',
            legalStatus: isRecall ? 'APPROVED_DOCUMENT' : 'INDUSTRY_GUIDANCE',
            authorityTier: feed.authorityTier,
            primarySource: {
              name: feed.sourceName,
              url: item.link,
              authorityTier: feed.authorityTier,
              publisher: feed.sourceName,
            },
            secondarySources: [],
            publishedAt,
            jurisdictions,
            tradeTags: [classification.primaryCategory, ...classification.secondaryCategories],
            topics: [feed.sourceName, classification.primaryCategory],
            provenance,
            isStatutory: isRecall,
            requiresReview: false,
            reviewStatus: 'auto_published',
            contentHash: Buffer.from(`${item.title}-${publishedAt}`).toString('hex'),
            firstSeenAt: new Date().toISOString(),
            lastSeenAt: new Date().toISOString(),
          });
        }
      } catch {
        // Feed network backoff
      }
    }

    return { canonicalItems, rawRecords };
  }

  /** Generic robust XML parser for RSS and Atom */
  private parseRssOrAtom(xml: string): { title: string; link: string; description: string; pubDate: string }[] {
    const results: { title: string; link: string; description: string; pubDate: string }[] = [];

    // RSS <item> blocks
    if (xml.includes('<item>')) {
      const items = xml.split('<item>');
      for (let i = 1; i < items.length; i++) {
        const block = items[i].split('</item>')[0];
        const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/);
        const descMatch = block.match(/<description[^>]*>([\s\S]*?)<\/description>/);
        const dateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/);

        if (titleMatch && linkMatch) {
          results.push({
            title: this.cleanXml(titleMatch[1]),
            link: this.cleanXml(linkMatch[1]),
            description: descMatch ? this.cleanXml(descMatch[1]) : '',
            pubDate: dateMatch ? this.cleanXml(dateMatch[1]) : '',
          });
        }
      }
    } else if (xml.includes('<entry>')) {
      // Atom <entry> blocks
      const entries = xml.split('<entry>');
      for (let i = 1; i < entries.length; i++) {
        const block = entries[i].split('</entry>')[0];
        const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/);
        const summaryMatch = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
        const dateMatch = block.match(/<updated>([\s\S]*?)<\/updated>/);

        if (titleMatch && linkMatch) {
          results.push({
            title: this.cleanXml(titleMatch[1]),
            link: linkMatch[1].trim(),
            description: summaryMatch ? this.cleanXml(summaryMatch[1]) : '',
            pubDate: dateMatch ? dateMatch[1].trim() : '',
          });
        }
      }
    }

    return results;
  }

  private cleanXml(str: string): string {
    return str
      .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

export const rssTradeConnector = new RssTradeConnector();
