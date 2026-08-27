/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — OPPORTUNITY & CONTRACT STORE
 * ==================================================================
 * Dedicated query and storage layer for public sector and commercial FM
 * tenders, framework notices, and "Who Won What" contract awards.
 */

import type { ProcurementOpportunity, FMTradeCategory } from './types';

export class OpportunityStore {
  private opportunities: Map<string, ProcurementOpportunity> = new Map();
  private contractAwards: Map<string, ProcurementOpportunity> = new Map();

  constructor() {
    // Initialised clean. Live ingestion populates real data.
  }

  public upsertOpportunity(opp: ProcurementOpportunity): void {
    if (opp.noticeType === 'award') {
      this.contractAwards.set(opp.ocid, opp);
    } else {
      this.opportunities.set(opp.ocid, opp);
    }
  }

  public upsertBatch(opps: ProcurementOpportunity[]): void {
    for (const opp of opps) {
      this.upsertOpportunity(opp);
    }
  }

  /** Get live active tenders */
  public getActiveTenders(options?: {
    category?: FMTradeCategory;
    region?: string;
    closingSoonOnly?: boolean;
    limit?: number;
  }): ProcurementOpportunity[] {
    let list = Array.from(this.opportunities.values()).filter((o) => o.status !== 'cancelled');

    if (options?.category) {
      list = list.filter((o) => o.serviceCategory === options.category);
    }
    if (options?.region) {
      list = list.filter((o) => o.buyerRegion.toLowerCase().includes(options.region!.toLowerCase()));
    }
    if (options?.closingSoonOnly) {
      list = list.filter((o) => o.status === 'closing_soon');
    }

    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return typeof options?.limit === 'number' ? list.slice(0, options.limit) : list;
  }

  /** Get "Who Won What" contract awards */
  public getContractAwards(limit = 20): ProcurementOpportunity[] {
    const list = Array.from(this.contractAwards.values());
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list.slice(0, limit);
  }

  /** Total active opportunities count */
  public getCounts(): { activeTenders: number; contractAwards: number; closingSoon: number } {
    const tenders = Array.from(this.opportunities.values());
    const awards = Array.from(this.contractAwards.values());
    const closingSoon = tenders.filter((t) => t.status === 'closing_soon').length;

    return {
      activeTenders: tenders.length,
      contractAwards: awards.length,
      closingSoon,
    };
  }
}

export const opportunityStore = new OpportunityStore();
