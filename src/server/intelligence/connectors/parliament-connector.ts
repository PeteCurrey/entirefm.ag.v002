/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — UK PARLIAMENT CONNECTOR
 * =============================================================
 * Ingests live parliamentary Bills and legislative stages from
 * the official UK Parliament Bills API (Tier 1 Authority).
 * Never represents a proposed Bill as current law.
 */

import { FMTaxonomyClassifier } from '../fm-classifier';
import { resolveEditorialImage } from '@/lib/lobby/image-resolver';
import type { CanonicalIntelligenceItem, RawIntelligenceRecord } from '../types';

interface ParliamentBillItem {
  billId: number;
  shortTitle: string;
  currentHouse: string;
  originatingHouse: string;
  lastUpdate: string;
  billStage: {
    stageId: number;
    name: string;
  };
  summary?: string;
  billType?: {
    name: string;
  };
}

export class ParliamentConnector {
  private billsBaseUrl = 'https://bills-api.parliament.uk/api/v1/Bills';

  /** Fetch active Bills relevant to property, safety, environment, energy */
  public async fetchRelevantBills(limit = 10): Promise<{
    canonicalItems: CanonicalIntelligenceItem[];
    rawRecords: RawIntelligenceRecord[];
  }> {
    const canonicalItems: CanonicalIntelligenceItem[] = [];
    const rawRecords: RawIntelligenceRecord[] = [];

    try {
      const url = new URL(this.billsBaseUrl);
      url.searchParams.set('Take', (limit * 3).toString());
      url.searchParams.set('SortOrder', 'DateUpdatedDescending');

      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'EntireFM-ParliamentWatch-Bot/1.0 (+https://entirefm.com/lobby)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) {
        return { canonicalItems, rawRecords };
      }

      const data = await res.json();
      const items: ParliamentBillItem[] = data.items || [];

      for (const bill of items) {
        const title = bill.shortTitle || '';
        const summary = bill.summary || `Bill progressing through UK Parliament (Current Stage: ${bill.billStage?.name || 'In Progress'}).`;
        const fullText = `${title} ${summary}`;

        const classification = FMTaxonomyClassifier.classifyText(fullText);
        const isFmRelevant =
          this.isKeywordsMatched(fullText, [
            'building',
            'safety',
            'energy',
            'leasehold',
            'renters',
            'employment',
            'fire',
            'infrastructure',
            'procurement',
            'environment',
            'planning',
            'climate',
          ]);

        if (!isFmRelevant) continue;

        const contentId = `bill-${bill.billId}`;
        const canonicalUrl = `https://bills.parliament.uk/bills/${bill.billId}`;
        const publishedAt = bill.lastUpdate || new Date().toISOString();

        const provenance = resolveEditorialImage({
          topic: classification.primaryCategory,
          sourcePublisher: 'UK Parliament',
          customProvenance: {
            credit: 'Official UK Parliamentary Record',
          },
        });

        rawRecords.push({
          id: `raw-${contentId}`,
          sourceId: 'src-uk-parliament-bills',
          sourceContentId: contentId,
          canonicalUrl,
          fetchedAt: new Date().toISOString(),
          contentHash: Buffer.from(`${title}-${publishedAt}`).toString('hex'),
          parserVersion: 'parliament-api-v1',
          rawPayload: bill as unknown as Record<string, unknown>,
        });

        canonicalItems.push({
          id: `intel-${contentId}`,
          canonicalUrl,
          sourceContentId: contentId,
          title: `Parliament Watch: ${title} (${bill.billStage?.name || 'In Committee'})`,
          standfirst: `Proposed UK Parliamentary legislation currently in the ${bill.currentHouse || 'House of Commons'}.`,
          whyItMatters: `FM directors should monitor this Bill stage to anticipate prospective statutory duties before enactment.`,
          eventType: 'parliament_stage',
          legalStatus: 'PROPOSED_LEGISLATION',
          authorityTier: 1,
          primarySource: {
            name: 'UK Parliament Bills Office',
            url: canonicalUrl,
            authorityTier: 1,
            publisher: 'UK Parliament',
          },
          secondarySources: [],
          publishedAt,
          jurisdictions: ['United Kingdom', 'Great Britain'],
          tradeTags: [classification.primaryCategory, ...classification.secondaryCategories],
          topics: ['In Parliament', bill.currentHouse, classification.primaryCategory],
          provenance,
          isStatutory: false,
          requiresReview: false,
          reviewStatus: 'auto_published',
          contentHash: Buffer.from(`${title}-${publishedAt}`).toString('hex'),
          firstSeenAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          parliamentData: {
            billTitle: title,
            currentStage: bill.billStage?.name || 'Active Consideration',
            house: bill.currentHouse === 'Lords' ? 'Lords' : 'Commons',
            session: 'Current Parliamentary Session',
          },
        });

        if (canonicalItems.length >= limit) break;
      }
    } catch {
      // Graceful timeout
    }

    return { canonicalItems, rawRecords };
  }

  private isKeywordsMatched(text: string, keywords: string[]): boolean {
    const lower = text.toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
  }
}
