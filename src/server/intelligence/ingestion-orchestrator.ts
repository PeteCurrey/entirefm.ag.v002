/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — INGESTION ORCHESTRATOR
 * =============================================================
 * Schedules and coordinates background ingestion across all primary,
 * technical, trade, and procurement intelligence sources.
 */

import { sourceRegistry } from './source-registry';
import { intelligenceStore } from './intelligence-store';
import { opportunityStore } from './opportunity-store';
import { GovUkConnector } from './connectors/govuk-connector';
import { LegislationConnector } from './connectors/legislation-connector';
import { ParliamentConnector } from './connectors/parliament-connector';
import { ProcurementConnector } from './connectors/procurement-connector';
import { gnewsConnector } from './connectors/gnews-connector';
import { rssTradeConnector } from './connectors/rss-trade-connector';
import type { IngestionRun } from './types';

export class IngestionOrchestrator {
  private isRunning = false;
  private govUkConnector = new GovUkConnector();
  private legislationConnector = new LegislationConnector();
  private parliamentConnector = new ParliamentConnector();
  private procurementConnector = new ProcurementConnector();

  /** Run full ingestion cycle across all active sources */
  public async runFullIngestion(): Promise<{
    runs: IngestionRun[];
    totalIngested: number;
  }> {
    if (this.isRunning) {
      return { runs: [], totalIngested: 0 };
    }

    this.isRunning = true;
    const runs: IngestionRun[] = [];
    let totalIngested = 0;

    try {
      // 1. GOV.UK Search & Statutory Guidance
      const govStart = Date.now();
      try {
        const { canonicalItems, rawRecords } = await this.govUkConnector.fetchRecentItems(4);
        const run = intelligenceStore.ingestBatch(canonicalItems, rawRecords, {
          sourceId: 'src-govuk-search',
          sourceName: 'GOV.UK Search API',
          startedAt: new Date(govStart).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: Date.now() - govStart,
          status: 'success',
          recordsFetched: rawRecords.length,
          recordsCreated: canonicalItems.length,
          recordsUpdated: 0,
          duplicatesDetected: 0,
          parserVersion: 'govuk-v1',
        });
        sourceRegistry.updateSourceHealth('src-govuk-search', 'LIVE', undefined, canonicalItems.length);
        runs.push(run);
        totalIngested += canonicalItems.length;
      } catch (err: unknown) {
        sourceRegistry.updateSourceHealth('src-govuk-search', 'DEGRADED', (err as Error).message);
      }

      // 2. legislation.gov.uk Statutory Instruments
      const legStart = Date.now();
      try {
        const { canonicalItems, rawRecords } = await this.legislationConnector.fetchRecentStatutes(8);
        const run = intelligenceStore.ingestBatch(canonicalItems, rawRecords, {
          sourceId: 'src-legislation-uk',
          sourceName: 'legislation.gov.uk Feed',
          startedAt: new Date(legStart).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: Date.now() - legStart,
          status: 'success',
          recordsFetched: rawRecords.length,
          recordsCreated: canonicalItems.length,
          recordsUpdated: 0,
          duplicatesDetected: 0,
          parserVersion: 'legislation-atom-v1',
        });
        sourceRegistry.updateSourceHealth('src-legislation-uk', 'LIVE', undefined, canonicalItems.length);
        runs.push(run);
        totalIngested += canonicalItems.length;
      } catch (err: unknown) {
        sourceRegistry.updateSourceHealth('src-legislation-uk', 'DEGRADED', (err as Error).message);
      }

      // 3. UK Parliament Bills (Parliament Watch)
      const parlStart = Date.now();
      try {
        const { canonicalItems, rawRecords } = await this.parliamentConnector.fetchRelevantBills(6);
        const run = intelligenceStore.ingestBatch(canonicalItems, rawRecords, {
          sourceId: 'src-uk-parliament-bills',
          sourceName: 'UK Parliament Bills API',
          startedAt: new Date(parlStart).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: Date.now() - parlStart,
          status: 'success',
          recordsFetched: rawRecords.length,
          recordsCreated: canonicalItems.length,
          recordsUpdated: 0,
          duplicatesDetected: 0,
          parserVersion: 'parliament-api-v1',
        });
        sourceRegistry.updateSourceHealth('src-uk-parliament-bills', 'LIVE', undefined, canonicalItems.length);
        runs.push(run);
        totalIngested += canonicalItems.length;
      } catch (err: unknown) {
        sourceRegistry.updateSourceHealth('src-uk-parliament-bills', 'DEGRADED', (err as Error).message);
      }

      // 4. Procurement Opportunities & Who Won What (Contracts Finder OCDS)
      try {
        const { opportunities, contractAwards } = await this.procurementConnector.fetchOpportunities(15);
        opportunityStore.upsertBatch([...opportunities, ...contractAwards]);
        sourceRegistry.updateSourceHealth('src-contracts-finder', 'LIVE', undefined, opportunities.length + contractAwards.length);
        totalIngested += opportunities.length + contractAwards.length;
      } catch (err: unknown) {
        sourceRegistry.updateSourceHealth('src-contracts-finder', 'DEGRADED', (err as Error).message);
      }

      // 5. Official Trade Bodies & OPSS Product Safety
      const tradeStart = Date.now();
      try {
        const { canonicalItems, rawRecords } = await rssTradeConnector.fetchAllTradeFeeds();
        const run = intelligenceStore.ingestBatch(canonicalItems, rawRecords, {
          sourceId: 'src-trade-rss',
          sourceName: 'Trade Bodies & OPSS Feed Cluster',
          startedAt: new Date(tradeStart).toISOString(),
          completedAt: new Date().toISOString(),
          durationMs: Date.now() - tradeStart,
          status: 'success',
          recordsFetched: rawRecords.length,
          recordsCreated: canonicalItems.length,
          recordsUpdated: 0,
          duplicatesDetected: 0,
          parserVersion: 'trade-rss-v1',
        });
        runs.push(run);
        totalIngested += canonicalItems.length;
      } catch (err: unknown) {
        sourceRegistry.updateSourceHealth('src-cibse-news', 'DEGRADED', (err as Error).message);
      }

      // 6. GNews Discovery (Only if GNEWS_API_KEY is configured)
      if (gnewsConnector.isAvailable()) {
        const gnewsStart = Date.now();
        try {
          const { canonicalItems, rawRecords } = await gnewsConnector.discoverArticles(8);
          const run = intelligenceStore.ingestBatch(canonicalItems, rawRecords, {
            sourceId: 'src-gnews-fm',
            sourceName: 'GNews Discovery Engine',
            startedAt: new Date(gnewsStart).toISOString(),
            completedAt: new Date().toISOString(),
            durationMs: Date.now() - gnewsStart,
            status: 'success',
            recordsFetched: rawRecords.length,
            recordsCreated: canonicalItems.length,
            recordsUpdated: 0,
            duplicatesDetected: 0,
            parserVersion: 'gnews-v4',
          });
          sourceRegistry.updateSourceHealth('src-gnews-fm', 'LIVE', undefined, canonicalItems.length);
          runs.push(run);
          totalIngested += canonicalItems.length;
        } catch (err: unknown) {
          sourceRegistry.updateSourceHealth('src-gnews-fm', 'DEGRADED', (err as Error).message);
        }
      }
    } finally {
      this.isRunning = false;
    }

    return { runs, totalIngested };
  }
}

export const ingestionOrchestrator = new IngestionOrchestrator();
