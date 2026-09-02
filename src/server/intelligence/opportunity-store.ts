/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — OPPORTUNITY & CONTRACT STORE
 * ==================================================================
 * Dedicated query and storage layer for public sector and commercial FM
 * tenders, framework notices, and "Who Won What" contract awards.
 * Backed by Supabase PostgreSQL public.procurement_opportunities.
 */

import type { ProcurementOpportunity, FMTradeCategory } from './types';
import { dbQuery, isDbConfigured } from '../db/client';

// ----------------------------------------------------------------------------
// DB <-> Domain Mappers
// ----------------------------------------------------------------------------

function mapDbRowToOpportunity(row: any): ProcurementOpportunity {
  return {
    id: row.id,
    ocid: row.ocid,
    source: row.source,
    noticeType: row.notice_type as any,
    title: row.title,
    description: row.description,
    whyItMattersForFM: row.why_it_matters_for_fm || undefined,
    buyerName: row.buyer_name,
    buyerRegion: row.buyer_region,
    cpvCodes: row.cpv_codes || [],
    serviceCategory: row.service_category as FMTradeCategory,
    estimatedValue: typeof row.estimated_value === 'string' ? JSON.parse(row.estimated_value) : row.estimated_value || undefined,
    publishedAt: row.published_at,
    closingDate: row.closing_date || undefined,
    contractStartDate: row.contract_start_date || undefined,
    contractDurationMonths: row.contract_duration_months || undefined,
    status: row.status as any,
    officialNoticeUrl: row.official_notice_url,
    awardDetails: typeof row.award_details === 'string' ? JSON.parse(row.award_details) : row.award_details || undefined,
    fmRelevanceScore: row.fm_relevance_score || undefined,
    fmRelevanceReason: row.fm_relevance_reason || undefined,
    isHighValueAward: Boolean(row.is_high_value_award),
    isEditoriallyFeatured: Boolean(row.is_editorially_featured),
  };
}

function mapOpportunityToDbRow(opp: ProcurementOpportunity): any {
  return {
    id: opp.id,
    ocid: opp.ocid,
    source: opp.source,
    notice_type: opp.noticeType,
    title: opp.title,
    description: opp.description,
    why_it_matters_for_fm: opp.whyItMattersForFM || null,
    buyer_name: opp.buyerName,
    buyer_region: opp.buyerRegion,
    cpv_codes: opp.cpvCodes || [],
    service_category: opp.serviceCategory,
    estimated_value: opp.estimatedValue || null,
    published_at: opp.publishedAt,
    closing_date: opp.closingDate || null,
    contract_start_date: opp.contractStartDate || null,
    contract_duration_months: opp.contractDurationMonths || null,
    status: opp.status,
    official_notice_url: opp.officialNoticeUrl,
    award_details: opp.awardDetails || null,
    fm_relevance_score: opp.fmRelevanceScore || null,
    fm_relevance_reason: opp.fmRelevanceReason || null,
    is_high_value_award: opp.isHighValueAward || false,
    is_editorially_featured: opp.isEditoriallyFeatured || false,
    updated_at: new Date().toISOString(),
  };
}

export class OpportunityStore {
  private memoryOpportunities: Map<string, ProcurementOpportunity> = new Map();
  private memoryContractAwards: Map<string, ProcurementOpportunity> = new Map();

  constructor() {
    // Initialised clean. Live ingestion orchestrator populates genuine verified records.
  }

  public async upsertOpportunity(opp: ProcurementOpportunity): Promise<void> {
    if (opp.noticeType === 'award') {
      this.memoryContractAwards.set(opp.ocid, opp);
    } else {
      this.memoryOpportunities.set(opp.ocid, opp);
    }

    if (isDbConfigured()) {
      await dbQuery('procurement_opportunities', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: mapOpportunityToDbRow(opp),
      });
    }
  }

  public async upsertBatch(opps: ProcurementOpportunity[]): Promise<void> {
    for (const opp of opps) {
      if (opp.noticeType === 'award') {
        this.memoryContractAwards.set(opp.ocid, opp);
      } else {
        this.memoryOpportunities.set(opp.ocid, opp);
      }
    }

    if (isDbConfigured()) {
      for (const opp of opps) {
        await dbQuery('procurement_opportunities', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: mapOpportunityToDbRow(opp),
        });
      }
    }
  }

  /** Get live active tenders */
  public async getActiveTenders(options?: {
    category?: FMTradeCategory;
    region?: string;
    closingSoonOnly?: boolean;
    limit?: number;
  }): Promise<ProcurementOpportunity[]> {
    if (!isDbConfigured()) {
      let list = Array.from(this.memoryOpportunities.values()).filter((o) => o.status !== 'cancelled');

      if (options?.category) {
        list = list.filter((o) => o.serviceCategory === options.category);
      }
      if (options?.region && options.region !== 'all') {
        list = list.filter((o) => o.buyerRegion.toLowerCase().includes(options.region!.toLowerCase()));
      }
      if (options?.closingSoonOnly) {
        list = list.filter((o) => o.status === 'closing_soon');
      }

      list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return typeof options?.limit === 'number' ? list.slice(0, options.limit) : list;
    }

    const params: string[] = ['notice_type=neq.award', 'status=neq.cancelled'];
    if (options?.category) {
      params.push(`service_category=eq.${encodeURIComponent(options.category)}`);
    }
    if (options?.closingSoonOnly) {
      params.push('status=eq.closing_soon');
    }
    if (typeof options?.limit === 'number') {
      params.push(`limit=${options.limit}`);
    }
    params.push('order=published_at.desc');

    const { data: rows } = await dbQuery<any[]>(`procurement_opportunities?${params.join('&')}`);
    let list = (rows || []).map(mapDbRowToOpportunity);

    if (options?.region && options.region !== 'all') {
      list = list.filter((o) => o.buyerRegion.toLowerCase().includes(options.region!.toLowerCase()));
    }

    return list;
  }

  /** Get "Who Won What" contract awards */
  public async getContractAwards(limit = 20): Promise<ProcurementOpportunity[]> {
    if (!isDbConfigured()) {
      const list = Array.from(this.memoryContractAwards.values());
      list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return list.slice(0, limit);
    }

    const { data: rows } = await dbQuery<any[]>(
      `procurement_opportunities?notice_type=eq.award&order=published_at.desc&limit=${limit}`
    );

    return (rows || []).map(mapDbRowToOpportunity);
  }

  /** Total active opportunities count */
  public async getCounts(): Promise<{ activeTenders: number; contractAwards: number; closingSoon: number }> {
    if (!isDbConfigured()) {
      const tenders = Array.from(this.memoryOpportunities.values());
      const awards = Array.from(this.memoryContractAwards.values());
      const closingSoon = tenders.filter((t) => t.status === 'closing_soon').length;

      return {
        activeTenders: tenders.length,
        contractAwards: awards.length,
        closingSoon,
      };
    }

    const { data: rows } = await dbQuery<any[]>('procurement_opportunities?select=notice_type,status');
    const all = rows || [];
    const tenders = all.filter((r) => r.notice_type !== 'award' && r.status !== 'cancelled');
    const awards = all.filter((r) => r.notice_type === 'award');
    const closingSoon = tenders.filter((r) => r.status === 'closing_soon').length;

    return {
      activeTenders: tenders.length,
      contractAwards: awards.length,
      closingSoon,
    };
  }
}

export const opportunityStore = new OpportunityStore();
