/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — LEGISLATION.GOV.UK CONNECTOR
 * ===================================================================
 * Ingests live statutory instruments, acts, and commencement regulations
 * from the canonical UK statutory repository (Tier 1 Authority).
 */

import { FMTaxonomyClassifier } from '../fm-classifier';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';
import type { CanonicalIntelligenceItem, RawIntelligenceRecord, UKJurisdiction } from '../types';

interface LegislationFeedEntry {
  id: string;
  title: string;
  updated: string;
  published: string;
  summary: string;
  link: string;
  category?: string;
}

export class LegislationConnector {
  private feedUrl = 'https://www.legislation.gov.uk/new/data.feed';

  /** Ingest latest UK legislation items */
  public async fetchRecentStatutes(limit = 10): Promise<{
    canonicalItems: CanonicalIntelligenceItem[];
    rawRecords: RawIntelligenceRecord[];
  }> {
    const canonicalItems: CanonicalIntelligenceItem[] = [];
    const rawRecords: RawIntelligenceRecord[] = [];

    try {
      const res = await fetch(this.feedUrl, {
        headers: {
          'User-Agent': 'EntireFM-Intelligence-Statutory-Bot/1.0 (+https://entirefm.com/lobby)',
          Accept: 'application/atom+xml, text/xml;q=0.9, */*;q=0.8',
        },
        signal: AbortSignal.timeout(7000),
      });

      if (!res.ok) {
        return { canonicalItems, rawRecords };
      }

      const xmlText = await res.text();
      const entries = this.parseAtomFeed(xmlText).slice(0, limit);

      for (const entry of entries) {
        const fullText = `${entry.title} ${entry.summary}`;
        const classification = FMTaxonomyClassifier.classifyText(fullText);
        
        // Filter: only ingest items relevant to built environment / FM
        const isFmRelevant =
          classification.confidence >= 0.7 ||
          this.isKeywordsMatched(fullText, [
            'building',
            'safety',
            'energy',
            'housing',
            'fire',
            'environmental',
            'electricity',
            'water',
            'construction',
            'planning',
            'workplace',
            'health and safety',
          ]);

        if (!isFmRelevant) continue;

        const legalStatus = FMTaxonomyClassifier.determineLegalStatus(entry.title, 'legislation');
        const jurisdictions: UKJurisdiction[] = entry.title.includes('(Scotland)')
          ? ['Scotland']
          : entry.title.includes('(Wales)')
          ? ['Wales']
          : entry.title.includes('(Northern Ireland)')
          ? ['Northern Ireland']
          : ['United Kingdom', 'England'];

        const contentId = `leg-${Buffer.from(entry.id || entry.link).toString('base64').substring(0, 16)}`;
        const publishedAt = entry.published || entry.updated || new Date().toISOString();

        const provenance = resolveEditorialImage({
          topic: classification.primaryCategory,
          sourcePublisher: 'legislation.gov.uk',
          customProvenance: {
            credit: 'The National Archives / legislation.gov.uk',
          },
        });

        rawRecords.push({
          id: `raw-${contentId}`,
          sourceId: 'src-legislation-uk',
          sourceContentId: contentId,
          canonicalUrl: entry.link,
          fetchedAt: new Date().toISOString(),
          contentHash: Buffer.from(`${entry.title}-${publishedAt}`).toString('hex'),
          parserVersion: 'legislation-atom-v1',
          rawPayload: entry as unknown as Record<string, unknown>,
        });

        canonicalItems.push({
          id: `intel-${contentId}`,
          canonicalUrl: entry.link,
          sourceContentId: contentId,
          title: entry.title,
          standfirst: entry.summary || 'Statutory instrument enacted under UK Parliamentary or devolved authority.',
          whyItMatters: `Legal duty holders operating commercial estates in ${jurisdictions.join(' & ')} must review operational compliance with this statutory instrument.`,
          eventType: 'statutory_change',
          legalStatus,
          authorityTier: 1,
          primarySource: {
            name: 'The National Archives / legislation.gov.uk',
            url: entry.link,
            authorityTier: 1,
            publisher: 'His Majesty’s Stationery Office',
          },
          secondarySources: [],
          publishedAt,
          jurisdictions,
          tradeTags: [classification.primaryCategory, ...classification.secondaryCategories],
          topics: ['Statute', classification.primaryCategory, legalStatus],
          provenance,
          isStatutory: true,
          requiresReview: true,
          reviewStatus: 'pending',
          contentHash: Buffer.from(`${entry.title}-${publishedAt}`).toString('hex'),
          firstSeenAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          relatedStatuteCitation: entry.title,
        });
      }
    } catch {
      // Source failure caught gracefully
    }

    return { canonicalItems, rawRecords };
  }

  private isKeywordsMatched(text: string, keywords: string[]): boolean {
    const lower = text.toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
  }

  /** Lightweight robust Atom XML parser */
  private parseAtomFeed(xml: string): LegislationFeedEntry[] {
    const entries: LegislationFeedEntry[] = [];
    const entryBlocks = xml.split('<entry>');

    for (let i = 1; i < entryBlocks.length; i++) {
      const block = entryBlocks[i].split('</entry>')[0];
      const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const linkMatch = block.match(/<link[^>]*href=["']([^"']+)["']/);
      const summaryMatch = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
      const publishedMatch = block.match(/<published>([\s\S]*?)<\/published>/);
      const updatedMatch = block.match(/<updated>([\s\S]*?)<\/updated>/);
      const idMatch = block.match(/<id>([\s\S]*?)<\/id>/);

      if (titleMatch && linkMatch) {
        entries.push({
          id: idMatch ? idMatch[1].trim() : linkMatch[1],
          title: this.cleanXml(titleMatch[1]),
          link: linkMatch[1].trim(),
          summary: summaryMatch ? this.cleanXml(summaryMatch[1]) : '',
          published: publishedMatch ? publishedMatch[1].trim() : '',
          updated: updatedMatch ? updatedMatch[1].trim() : '',
        });
      }
    }

    return entries;
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
