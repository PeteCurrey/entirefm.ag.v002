/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — MASTER CANONICAL STORE
 * =============================================================
 * Persistent, database-backed query engine for all canonical intelligence items,
 * statutory updates, consultations, trade news, and ingestion run audits.
 * Strictly enforces zero-fake-data policy (LOBBY_ALLOW_DEMO_DATA=false).
 */

import { DeduplicationEngine } from './deduplication-engine';
import { dbQuery, isDbConfigured } from '../db/client';
import type {
  CanonicalIntelligenceItem,
  IngestionRun,
  RawIntelligenceRecord,
  FMTradeCategory,
  UKJurisdiction,
} from './types';

// ----------------------------------------------------------------------------
// DB <-> Domain Mappers
// ----------------------------------------------------------------------------

function mapDbRowToCanonical(row: any): CanonicalIntelligenceItem {
  return {
    id: row.id,
    canonicalUrl: row.canonical_url,
    sourceContentId: row.source_content_id,
    title: row.title,
    standfirst: row.standfirst,
    editorialSummary: row.editorial_summary || undefined,
    whyItMatters: row.why_it_matters || undefined,
    actionRequired: row.action_required || undefined,
    eventType: row.event_type as any,
    legalStatus: row.legal_status as any,
    authorityTier: row.authority_tier,
    primarySource: typeof row.primary_source === 'string' ? JSON.parse(row.primary_source) : row.primary_source,
    secondarySources: typeof row.secondary_sources === 'string' ? JSON.parse(row.secondary_sources) : (row.secondary_sources || []),
    publishedAt: row.published_at,
    updatedAt: row.updated_at || undefined,
    effectiveFrom: row.effective_from || undefined,
    deadline: row.deadline || undefined,
    jurisdictions: row.jurisdictions || [],
    tradeTags: row.trade_tags || [],
    topics: row.topics || [],
    provenance: typeof row.provenance === 'string' ? JSON.parse(row.provenance) : (row.provenance || {}),
    isStatutory: Boolean(row.is_statutory),
    requiresReview: Boolean(row.requires_review),
    reviewStatus: row.review_status,
    reviewedBy: row.reviewed_by || undefined,
    reviewedAt: row.reviewed_at || undefined,
    contentHash: row.content_hash,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    relatedStatuteCitation: row.related_statute_citation || undefined,
    relatedDiscussionSlug: row.related_discussion_slug || undefined,
    relatedRoomSlug: row.related_room_slug || undefined,
    relatedToolUrl: row.related_tool_url || undefined,
    relatedResourceUrl: row.related_resource_url || undefined,
    consultationData: typeof row.consultation_data === 'string' ? JSON.parse(row.consultation_data) : row.consultation_data || undefined,
    parliamentData: typeof row.parliament_data === 'string' ? JSON.parse(row.parliament_data) : row.parliament_data || undefined,
    prosecutionData: typeof row.prosecution_data === 'string' ? JSON.parse(row.prosecution_data) : row.prosecution_data || undefined,
    fmRelevanceScore: row.fm_relevance_score || undefined,
    fmRelevanceReason: row.fm_relevance_reason || undefined,
    publicationEligibility: row.publication_eligibility || undefined,
    relevantRoles: row.relevant_roles || [],
    relevantSectors: row.relevant_sectors || [],
    isEditoriallyFeatured: Boolean(row.is_editorially_featured),
    editorialSlot: row.editorial_slot || undefined,
  };
}

function mapCanonicalToDbRow(item: CanonicalIntelligenceItem): any {
  return {
    id: item.id,
    canonical_url: item.canonicalUrl,
    source_content_id: item.sourceContentId,
    title: item.title,
    standfirst: item.standfirst,
    editorial_summary: item.editorialSummary || null,
    why_it_matters: item.whyItMatters || null,
    action_required: item.actionRequired || null,
    event_type: item.eventType,
    legal_status: item.legalStatus,
    authority_tier: item.authorityTier,
    primary_source: item.primarySource,
    secondary_sources: item.secondarySources || [],
    published_at: item.publishedAt,
    updated_at: item.updatedAt || null,
    effective_from: item.effectiveFrom || null,
    deadline: item.deadline || null,
    jurisdictions: item.jurisdictions || [],
    trade_tags: item.tradeTags || [],
    topics: item.topics || [],
    provenance: item.provenance || {},
    is_statutory: item.isStatutory,
    requires_review: item.requiresReview,
    review_status: item.reviewStatus,
    reviewed_by: item.reviewedBy || null,
    reviewed_at: item.reviewedAt || null,
    content_hash: item.contentHash,
    first_seen_at: item.firstSeenAt,
    last_seen_at: item.lastSeenAt,
    related_statute_citation: item.relatedStatuteCitation || null,
    related_discussion_slug: item.relatedDiscussionSlug || null,
    related_room_slug: item.relatedRoomSlug || null,
    related_tool_url: item.relatedToolUrl || null,
    related_resource_url: item.relatedResourceUrl || null,
    consultation_data: item.consultationData || null,
    parliament_data: item.parliamentData || null,
    prosecution_data: item.prosecutionData || null,
    fm_relevance_score: item.fmRelevanceScore || null,
    fm_relevance_reason: item.fmRelevanceReason || null,
    publication_eligibility: item.publicationEligibility || null,
    relevant_roles: item.relevantRoles || [],
    relevant_sectors: item.relevantSectors || [],
    is_editorially_featured: item.isEditoriallyFeatured || false,
    editorial_slot: item.editorialSlot || null,
  };
}

export class IntelligenceStore {
  // In-memory cache for fast local querying and mock harness
  private memoryItems: Map<string, CanonicalIntelligenceItem> = new Map();
  private memoryRawRecords: Map<string, RawIntelligenceRecord> = new Map();
  private memoryIngestionRuns: IngestionRun[] = [];

  constructor() {
    // Zero-fake data policy: initialized clean
  }

  /** Ingest batch of items, apply event deduplication clustering, and persist */
  public async ingestBatch(
    newItems: CanonicalIntelligenceItem[],
    raws: RawIntelligenceRecord[],
    runInfo: Omit<IngestionRun, 'id'>
  ): Promise<IngestionRun> {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullRun: IngestionRun = { id: runId, ...runInfo };
    this.memoryIngestionRuns.unshift(fullRun);

    // Save in memory
    for (const raw of raws) {
      this.memoryRawRecords.set(raw.id, raw);
    }

    // Apply deduplication clustering against existing items
    const existing = Array.from(this.memoryItems.values());
    const combined = DeduplicationEngine.clusterEvents([...newItems, ...existing]);

    this.memoryItems.clear();
    for (const item of combined) {
      this.memoryItems.set(item.id, item);
    }

    if (isDbConfigured()) {
      try {
        // 1. Persist raw records
        for (const raw of raws) {
          await dbQuery('raw_intelligence_records', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates' },
            body: {
              id: raw.id,
              source_id: raw.sourceId,
              source_content_id: raw.sourceContentId,
              canonical_url: raw.canonicalUrl,
              fetched_at: raw.fetchedAt,
              content_hash: raw.contentHash,
              parser_version: raw.parserVersion,
              raw_payload: raw.rawPayload,
            },
          });
        }

        // 2. Persist canonical items
        for (const item of combined) {
          await dbQuery('canonical_intelligence_items', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates' },
            body: mapCanonicalToDbRow(item),
          });
        }

        // 3. Persist run audit record
        await dbQuery('intelligence_ingestion_runs', {
          method: 'POST',
          body: {
            id: fullRun.id,
            source_id: fullRun.sourceId,
            source_name: fullRun.sourceName,
            started_at: fullRun.startedAt,
            completed_at: fullRun.completedAt,
            duration_ms: fullRun.durationMs,
            status: fullRun.status,
            records_fetched: fullRun.recordsFetched,
            records_created: fullRun.recordsCreated,
            records_updated: fullRun.recordsUpdated,
            duplicates_detected: fullRun.duplicatesDetected,
            error: fullRun.error || null,
            parser_version: fullRun.parserVersion,
          },
        });
      } catch (err) {
        console.error('[IntelligenceStore] Error persisting ingestion batch to database:', err);
      }
    }

    return fullRun;
  }

  /** Query published intelligence items */
  public async query(options?: {
    trade?: FMTradeCategory;
    jurisdiction?: UKJurisdiction;
    eventType?: CanonicalIntelligenceItem['eventType'];
    statutoryOnly?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: CanonicalIntelligenceItem[]; total: number }> {
    if (!isDbConfigured()) {
      let list = Array.from(this.memoryItems.values()).filter(
        (item) => item.reviewStatus === 'approved' || item.reviewStatus === 'auto_published'
      );

      if (options?.trade) {
        list = list.filter((item) => item.tradeTags.includes(options.trade!));
      }
      if (options?.jurisdiction) {
        list = list.filter(
          (item) =>
            item.jurisdictions.includes(options.jurisdiction!) ||
            item.jurisdictions.includes('United Kingdom') ||
            options.jurisdiction === 'United Kingdom'
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
        list = list.filter((item) => {
          const full = `${item.title} ${item.standfirst} ${item.topics.join(' ')}`.toLowerCase();
          return full.includes(q);
        });
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

    // Database query
    const params: string[] = ['review_status=in.(approved,auto_published)'];

    if (options?.trade) {
      params.push(`trade_tags=cs.{${encodeURIComponent(options.trade)}}`);
    }
    if (options?.eventType) {
      params.push(`event_type=eq.${encodeURIComponent(options.eventType)}`);
    }
    if (options?.statutoryOnly) {
      params.push('is_statutory=eq.true');
    }

    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    params.push(`order=published_at.desc`);
    params.push(`limit=${limit}`);
    params.push(`offset=${offset}`);

    const queryString = params.join('&');
    const { data: rows } = await dbQuery<any[]>(`canonical_intelligence_items?${queryString}`);

    let items = (rows || []).map(mapDbRowToCanonical);

    // Apply in-memory filters for search and jurisdiction if needed
    if (options?.jurisdiction && options.jurisdiction !== 'United Kingdom') {
      items = items.filter(
        (i) => i.jurisdictions.includes(options.jurisdiction!) || i.jurisdictions.includes('United Kingdom')
      );
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter((item) => {
        const full = `${item.title} ${item.standfirst} ${item.topics.join(' ')}`.toLowerCase();
        return full.includes(q);
      });
    }

    return {
      items,
      total: items.length,
    };
  }

  /** Get items pending human review in /admin/intelligence/review */
  public async getPendingReviewItems(): Promise<CanonicalIntelligenceItem[]> {
    if (!isDbConfigured()) {
      return Array.from(this.memoryItems.values()).filter((i) => i.reviewStatus === 'pending');
    }

    const { data: rows } = await dbQuery<any[]>(
      'canonical_intelligence_items?review_status=eq.pending&order=published_at.desc'
    );
    return (rows || []).map(mapDbRowToCanonical);
  }

  /** Approve or reject an item in the editorial review queue */
  public async setReviewStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    editorialNotes?: { whyItMatters?: string; actionRequired?: string }
  ): Promise<boolean> {
    const now = new Date().toISOString();

    const memItem = this.memoryItems.get(id);
    if (memItem) {
      memItem.reviewStatus = status;
      memItem.reviewedBy = reviewedBy;
      memItem.reviewedAt = now;
      if (editorialNotes?.whyItMatters) memItem.whyItMatters = editorialNotes.whyItMatters;
      if (editorialNotes?.actionRequired) memItem.actionRequired = editorialNotes.actionRequired;
    }

    if (!isDbConfigured()) return Boolean(memItem);

    const updatePayload: any = {
      review_status: status,
      reviewed_by: reviewedBy,
      reviewed_at: now,
    };
    if (editorialNotes?.whyItMatters) updatePayload.why_it_matters = editorialNotes.whyItMatters;
    if (editorialNotes?.actionRequired) updatePayload.action_required = editorialNotes.actionRequired;

    const { status: httpStatus } = await dbQuery(
      `canonical_intelligence_items?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: updatePayload,
      }
    );

    return httpStatus === 200 || httpStatus === 204;
  }

  /** Get recent ingestion run audit history */
  public async getIngestionRuns(limit = 20): Promise<IngestionRun[]> {
    if (!isDbConfigured()) {
      return this.memoryIngestionRuns.slice(0, limit);
    }

    const { data: rows } = await dbQuery<any[]>(
      `intelligence_ingestion_runs?order=started_at.desc&limit=${limit}`
    );

    return (rows || []).map((r) => ({
      id: r.id,
      sourceId: r.source_id,
      sourceName: r.source_name,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      durationMs: r.duration_ms,
      status: r.status,
      recordsFetched: r.records_fetched,
      recordsCreated: r.records_created,
      recordsUpdated: r.records_updated,
      duplicatesDetected: r.duplicates_detected,
      error: r.error || undefined,
      parserVersion: r.parser_version,
    }));
  }

  /** Get total counts */
  public async getCounts(): Promise<{
    totalItems: number;
    statutoryItems: number;
    pendingReview: number;
    totalRuns: number;
  }> {
    if (!isDbConfigured()) {
      const all = Array.from(this.memoryItems.values());
      return {
        totalItems: all.length,
        statutoryItems: all.filter((i) => i.isStatutory).length,
        pendingReview: all.filter((i) => i.reviewStatus === 'pending').length,
        totalRuns: this.memoryIngestionRuns.length,
      };
    }

    const { data: totalRows } = await dbQuery<any[]>('canonical_intelligence_items?select=id,is_statutory,review_status');
    const { data: runRows } = await dbQuery<any[]>('intelligence_ingestion_runs?select=id');

    const all = totalRows || [];
    return {
      totalItems: all.length,
      statutoryItems: all.filter((i) => i.is_statutory).length,
      pendingReview: all.filter((i) => i.review_status === 'pending').length,
      totalRuns: (runRows || []).length,
    };
  }
}

export const intelligenceStore = new IntelligenceStore();
