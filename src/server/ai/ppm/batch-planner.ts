/**
 * ENTIREFM PPM BATCH PLANNING & CONTRACTOR ORCHESTRATION (Phase 0M)
 * =================================================================
 * Groups upcoming planned maintenance occurrences across assets & sites
 * into optimised contractor bundles by geography, trade, and due window.
 *
 * Benefits:
 *   - Eliminates piecemeal single-visit dispatching
 *   - Optimises contractor travel and route efficiency
 *   - Generates consolidated batch Purchase Orders per commercial agreement
 *   - Reduces client billing overhead
 */

import { dbQuery } from '../../db/client';
import { evaluateContractorEligibility } from '../dispatch/eligibility';
import { rankEligibleContractors, RawCandidateInput } from '../dispatch/ranking';
import { AutoPOPolicy } from '../dispatch/types';
import { TradeCategory } from '../helpdesk/types';

export interface PPMOccurrenceCandidate {
  occurrence_id: string;
  occurrence_code: string;
  plan_id: string;
  asset_id: string;
  asset_name: string;
  asset_reference: string;
  site_id: string;
  site_name: string;
  site_city: string;
  required_trade: TradeCategory;
  planned_date: string;
  estimated_hours?: number;
}

export interface PPMBatchCluster {
  batch_id: string;
  batch_title: string;
  geographic_cluster: string; // e.g. "Greater Manchester", "London Central"
  trade: TradeCategory;
  planning_month: string; // e.g. "2026-10"
  occurrences: PPMOccurrenceCandidate[];
  total_sites: number;
  total_assets: number;
  total_estimated_hours: number;
  assigned_supplier_id?: string;
  assigned_supplier_name?: string;
  batch_po_id?: string;
  batch_po_number?: string;
  batch_po_gross_gbp?: number;
  status: 'OPTIMISED' | 'DISPATCHED' | 'AWAITING_REVIEW';
}

export interface PPMBatchPlanResult {
  total_occurrences_processed: number;
  total_batches_formed: number;
  batches: PPMBatchCluster[];
  unallocated_occurrences: PPMOccurrenceCandidate[];
  total_forecast_spend_gbp: number;
}

export async function planPPMContractorBatches(params: {
  occurrences: PPMOccurrenceCandidate[];
  auto_po_policy?: AutoPOPolicy;
  available_suppliers?: any[];
}): Promise<PPMBatchPlanResult> {
  const autoPoPolicy = params.auto_po_policy || 'AUTO_RAISE';
  const rawOccurrences = params.occurrences;

  // 1. Group occurrences by City + Trade + Month
  const groupMap = new Map<string, PPMOccurrenceCandidate[]>();

  for (const occ of rawOccurrences) {
    const month = occ.planned_date.slice(0, 7); // "YYYY-MM"
    const city = occ.site_city || 'Regional';
    const key = `${city}::${occ.required_trade}::${month}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(occ);
  }

  const batches: PPMBatchCluster[] = [];
  const unallocated: PPMOccurrenceCandidate[] = [];
  let totalForecastGbp = 0;

  // Fetch or use provided suppliers
  let suppliers: any[] = params.available_suppliers || [];
  if (suppliers.length === 0) {
    const { data: dbSuppliers } = await dbQuery<any[]>(
      `organisations?org_type=in.(CONTRACTOR,SUPPLIER)&select=*&order=name.asc`
    );
    suppliers = dbSuppliers || [];
  }

  // 2. Form clusters and match eligible contractor
  for (const [key, occs] of groupMap.entries()) {
    const [city, tradeStr, month] = key.split('::');
    const trade = tradeStr as TradeCategory;

    const uniqueSites = new Set(occs.map((o) => o.site_id)).size;
    const totalHours = occs.reduce((sum, o) => sum + (o.estimated_hours || 2.5), 0);

    // Evaluate eligibility for this cluster
    const candidates: RawCandidateInput[] = [];
    for (const s of suppliers) {
      const gate = evaluateContractorEligibility({
        supplier: {
          id: s.id,
          name: s.name,
          code: s.code || 'SUP',
          status: s.status || 'ACTIVE',
          org_type: s.org_type || 'CONTRACTOR',
          trades: s.trades || [trade],
          covered_cities: s.covered_cities || [city],
          is_national: s.is_national ?? true,
          is_suspended: s.is_suspended ?? false,
        },
        requirement: {
          trade,
          site_city: city,
          priority: 'P5_ROUTINE',
        },
      });

      candidates.push({
        supplier_id: s.id,
        supplier_name: s.name,
        supplier_code: s.code || 'SUP',
        contact_email: s.email,
        contact_phone: s.phone,
        trades: s.trades,
        distance_miles: s.distance_miles ?? 10,
        sla_adherence_pct: s.sla_adherence_pct ?? 97,
        acceptance_pct: s.acceptance_pct ?? 95,
        current_open_jobs: s.current_open_jobs ?? 2,
        agreed_hourly_rate_gbp: s.agreed_hourly_rate_gbp ?? 50,
        agreed_callout_rate_gbp: s.agreed_callout_rate_gbp ?? 75,
        eligibility_gate: gate,
      });
    }

    const ranked = rankEligibleContractors(candidates, {
      trade,
      priority: 'P5_ROUTINE',
      site_city: city,
    });

    if (ranked.length === 0) {
      unallocated.push(...occs);
      continue;
    }

    const bestSupplier = ranked[0];
    const hourlyRate = bestSupplier.agreed_hourly_rate_gbp || 50;
    const batchCostNet = totalHours * hourlyRate;
    const batchCostGross = Math.round(batchCostNet * 1.2 * 100) / 100;
    totalForecastGbp += batchCostGross;

    const batchId = crypto.randomUUID();
    let poId: string | undefined;
    let poNum: string | undefined;

    if (autoPoPolicy === 'AUTO_RAISE') {
      poId = crypto.randomUUID();
      poNum = `PO-PPM-BATCH-${Date.now().toString().slice(-6)}`;
    }

    batches.push({
      batch_id: batchId,
      batch_title: `PPM Bundle: ${city} ${trade} (${month}) — ${occs.length} Assets / ${uniqueSites} Sites`,
      geographic_cluster: city,
      trade,
      planning_month: month,
      occurrences: occs,
      total_sites: uniqueSites,
      total_assets: occs.length,
      total_estimated_hours: totalHours,
      assigned_supplier_id: bestSupplier.supplier_id,
      assigned_supplier_name: bestSupplier.supplier_name,
      batch_po_id: poId,
      batch_po_number: poNum,
      batch_po_gross_gbp: batchCostGross,
      status: 'OPTIMISED',
    });
  }

  return {
    total_occurrences_processed: rawOccurrences.length,
    total_batches_formed: batches.length,
    batches,
    unallocated_occurrences: unallocated,
    total_forecast_spend_gbp: Math.round(totalForecastGbp * 100) / 100,
  };
}
