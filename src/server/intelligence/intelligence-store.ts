/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — MASTER CANONICAL STORE
 * =============================================================
 * Single persistence & query engine for all canonical intelligence items,
 * statutory updates, consultations, trade news, and ingestion run audits.
 * Strictly enforces zero-fake-data policy (LOBBY_ALLOW_DEMO_DATA=false).
 */

import { DeduplicationEngine } from './deduplication-engine';
import type {
  CanonicalIntelligenceItem,
  IngestionRun,
  RawIntelligenceRecord,
  FMTradeCategory,
  UKJurisdiction,
} from './types';

export class IntelligenceStore {
  private items: Map<string, CanonicalIntelligenceItem> = new Map();
  private rawRecords: Map<string, RawIntelligenceRecord> = new Map();
  private ingestionRuns: IngestionRun[] = [];

  constructor() {
    // Initialised clean. Live ingestion orchestrator populates genuine external records.
  }

  /** Ingest batch of items and apply event-level deduplication */
  public ingestBatch(
    newItems: CanonicalIntelligenceItem[],
    raws: RawIntelligenceRecord[],
    runInfo: Omit<IngestionRun, 'id'>
  ): IngestionRun {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullRun: IngestionRun = { id: runId, ...runInfo };
    this.ingestionRuns.unshift(fullRun);

    // Save raw records
    for (const raw of raws) {
      this.rawRecords.set(raw.id, raw);
    }

    // Apply deduplication clustering against existing items
    const existing = Array.from(this.items.values());
    const combined = DeduplicationEngine.clusterEvents([...newItems, ...existing]);

    this.items.clear();
    for (const item of combined) {
      this.items.set(item.id, item);
    }

    return fullRun;
  }

  /** Query published intelligence items */
  public query(options?: {
    trade?: FMTradeCategory;
    jurisdiction?: UKJurisdiction;
    eventType?: CanonicalIntelligenceItem['eventType'];
    statutoryOnly?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): { items: CanonicalIntelligenceItem[]; total: number } {
    let list = Array.from(this.items.values()).filter(
      (item) => item.reviewStatus === 'approved' || item.reviewStatus === 'auto_published'
    );

    if (options?.trade) {
      list = list.filter((item) => item.tradeTags.includes(options.trade!));
    }
    if (options?.jurisdiction) {
      list = list.filter(
        (item) =>
          item.jurisdictions.includes(options.jurisdiction!) ||
          item.jurisdictions.includes('United Kingdom')
      );
    }
    if (options?.eventType) {
      list = list.filter((item) => item.eventType === options.eventType);
    }
    if (options?.statutoryOnly) {
      list = list.filter((item) => item.isStatutory);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.standfirst.toLowerCase().includes(q) ||
          item.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = list.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 20;

    return {
      items: list.slice(offset, offset + limit),
      total,
    };
  }

  /** Get items pending human review in /admin/intelligence/review */
  public getPendingReviewItems(): CanonicalIntelligenceItem[] {
    return Array.from(this.items.values()).filter((i) => i.reviewStatus === 'pending');
  }

  /** Approve or reject an item in the editorial review queue */
  public setReviewStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    editorialNotes?: { whyItMatters?: string; actionRequired?: string }
  ): boolean {
    const item = this.items.get(id);
    if (!item) return false;

    item.reviewStatus = status;
    item.reviewedBy = reviewedBy;
    item.reviewedAt = new Date().toISOString();
    if (editorialNotes?.whyItMatters) item.whyItMatters = editorialNotes.whyItMatters;
    if (editorialNotes?.actionRequired) item.actionRequired = editorialNotes.actionRequired;

    this.items.set(id, item);
    return true;
  }

  /** Get recent ingestion run audit history */
  public getIngestionRuns(limit = 20): IngestionRun[] {
    return this.ingestionRuns.slice(0, limit);
  }

  /** Get total counts */
  public getCounts(): {
    totalItems: number;
    statutoryItems: number;
    pendingReview: number;
    totalRuns: number;
  } {
    const all = Array.from(this.items.values());
    return {
      totalItems: all.length,
      statutoryItems: all.filter((i) => i.isStatutory).length,
      pendingReview: all.filter((i) => i.reviewStatus === 'pending').length,
      totalRuns: this.ingestionRuns.length,
    };
  }
}

export const intelligenceStore = new IntelligenceStore();
