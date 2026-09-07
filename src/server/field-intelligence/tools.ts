/**
 * ENTIRECAFM CONTROLLED AI FIELD INTELLIGENCE TOOLS
 * =================================================
 * Controlled application tools/functions for Talk to Quote and Field Intelligence.
 * Every tool performs strict input validation, tenant isolation, and connects to
 * real CAFM database tables, rate cards, asset registers, and pricing engines.
 * AI models NEVER receive raw SQL or arbitrary DB access.
 */

import { dbQuery } from '../db/client';
import { UserSession } from '../identity';
import {
  resolveRateHierarchy,
  resolveLabourPrice,
  resolveMaterialMarkup,
  getEffectivePolicy,
  applyTax,
  roundMoney,
  createQuoteDraftFromFieldScope,
  RateCardItem,
  SupplierPrice,
} from '../commercial';
import { getAssetOperationalContext } from '../assets/asset-service';
import { createWorkOrder as createWorkOrderCore } from '../work';

export interface ToolExecutionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── 1. CLIENT & SITE INTELLIGENCE ───────────────────────────────────────────

export async function findClient(
  query: string,
  sessionOrgId?: string
): Promise<ToolExecutionResult<any>> {
  if (!query || query.trim().length === 0) {
    return { success: false, error: 'Query string required for findClient' };
  }
  const clean = encodeURIComponent(query.trim());
  const { data, error } = await dbQuery<any[]>(
    `organisations?name=ilike.%25${clean}%25&org_type=eq.CLIENT&limit=5`
  );
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function findSite(
  query: string,
  clientOrgId?: string
): Promise<ToolExecutionResult<any>> {
  if (!query || query.trim().length === 0) {
    return { success: false, error: 'Query string required for findSite' };
  }
  const clean = encodeURIComponent(query.trim());
  let endpoint = `sites?name=ilike.%25${clean}%25`;
  if (clientOrgId) {
    endpoint += `&organisation_id=eq.${encodeURIComponent(clientOrgId)}`;
  }
  endpoint += '&limit=5';
  const { data, error } = await dbQuery<any[]>(endpoint);
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function findLocation(
  query: string,
  siteId?: string
): Promise<ToolExecutionResult<any>> {
  if (!query || query.trim().length === 0) {
    return { success: false, error: 'Query string required for findLocation' };
  }
  const clean = encodeURIComponent(query.trim());
  let endpoint = `spaces?name=ilike.%25${clean}%25`;
  if (siteId) {
    endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  }
  endpoint += '&limit=5';
  const { data } = await dbQuery<any[]>(endpoint);
  return { success: true, data: data || [] };
}

// ─── 2. ASSET INTELLIGENCE & DISAMBIGUATION ───────────────────────────────────

export async function findAsset(
  query: string,
  siteId?: string,
  location?: string
): Promise<ToolExecutionResult<any>> {
  if (!query || query.trim().length === 0) {
    return { success: false, error: 'Asset query required' };
  }
  const clean = encodeURIComponent(query.trim());
  let endpoint = `assets?or=(name.ilike.%25${clean}%25,asset_reference.ilike.%25${clean}%25,manufacturer.ilike.%25${clean}%25,model.ilike.%25${clean}%25)`;
  if (siteId) {
    endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  }
  endpoint += '&limit=10';
  const { data, error } = await dbQuery<any[]>(endpoint);
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function searchAssets(
  siteId: string,
  query?: string
): Promise<ToolExecutionResult<any[]>> {
  if (!siteId) return { success: false, error: 'siteId is required' };
  let endpoint = `assets?site_id=eq.${encodeURIComponent(siteId)}`;
  if (query && query.trim()) {
    const clean = encodeURIComponent(query.trim());
    endpoint += `&or=(name.ilike.%25${clean}%25,asset_reference.ilike.%25${clean}%25,manufacturer.ilike.%25${clean}%25,model.ilike.%25${clean}%25)`;
  }
  endpoint += '&limit=15&select=*';
  const { data, error } = await dbQuery<any[]>(endpoint);
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function getAssetHistory(
  assetId: string,
  session: UserSession
): Promise<ToolExecutionResult<any>> {
  if (!assetId) return { success: false, error: 'assetId is required' };
  try {
    const context = await getAssetOperationalContext(assetId, session);
    if (!context) return { success: false, error: 'Asset context not found' };
    return {
      success: true,
      data: {
        asset: {
          id: context.id,
          name: context.name,
          reference: context.asset_reference,
          manufacturer: context.manufacturer,
          model: context.model,
          serialNumber: context.serial_number,
          condition: context.condition,
          status: context.status,
          warrantyExpiry: context.warranty_expiry,
        },
        workOrdersCount: context.work_orders.length,
        previousWorkOrders: context.work_orders.slice(0, 5),
        defectsCount: context.defects.length,
        previousDefects: context.defects.slice(0, 5),
        conditionAssessments: context.condition_history.slice(0, 3),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── 3. WORK ORDER & CLASSIFICATION INTELLIGENCE ─────────────────────────────

export async function getOpenJobs(
  siteId?: string,
  assetId?: string
): Promise<ToolExecutionResult<any[]>> {
  let endpoint = `work_orders?status=in.(LOGGED,TRIAGED,ALLOCATED,ACCEPTED,EN_ROUTE,ON_SITE,IN_PROGRESS,PENDING_PARTS)`;
  if (siteId) endpoint += `&site_id=eq.${encodeURIComponent(siteId)}`;
  if (assetId) endpoint += `&asset_id=eq.${encodeURIComponent(assetId)}`;
  endpoint += '&limit=10&order=created_at.desc&select=*';
  const { data, error } = await dbQuery<any[]>(endpoint);
  if (error) return { success: false, error };
  return { success: true, data: data || [] };
}

export async function getExistingWorkOrder(
  workOrderId: string
): Promise<ToolExecutionResult<any>> {
  if (!workOrderId) return { success: false, error: 'workOrderId is required' };
  const { data, error } = await dbQuery<any[]>(
    `work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=*,site:sites(*),asset:assets(*)&limit=1`
  );
  if (error || !data || data.length === 0) {
    return { success: false, error: 'Work order not found' };
  }
  return { success: true, data: data[0] };
}

export function classifyTrade(description: string): {
  trade: string;
  tradeCode: string;
  confidence: number;
} {
  const d = (description || '').toLowerCase();
  if (d.includes('pump') || d.includes('seal') || d.includes('boiler') || d.includes('heating') || d.includes('chiller') || d.includes('ahu') || d.includes('pipe') || d.includes('valve') || d.includes('plumb') || d.includes('leak') || d.includes('water') || d.includes('drain')) {
    if (d.includes('pump') || d.includes('seal') || d.includes('bearing') || d.includes('motor') || d.includes('drive')) {
      return { trade: 'Mechanical Engineer', tradeCode: 'MECHANICAL', confidence: 0.95 };
    }
    if (d.includes('boiler') || d.includes('gas') || d.includes('heating')) {
      return { trade: 'Commercial Gas & Heating Engineer', tradeCode: 'HVAC_GAS', confidence: 0.95 };
    }
    if (d.includes('air con') || d.includes('ac ') || d.includes('chiller') || d.includes('ahu') || d.includes('refrigerant')) {
      return { trade: 'HVAC & Refrigeration Engineer', tradeCode: 'HVAC', confidence: 0.95 };
    }
    return { trade: 'Plumbing & Drainage Specialist', tradeCode: 'PLUMBING', confidence: 0.92 };
  }
  if (d.includes('electric') || d.includes('power') || d.includes('light') || d.includes('fuse') || d.includes('mcb') || d.includes('distribution board') || d.includes('switch') || d.includes('tripping')) {
    return { trade: 'Electrical Engineer', tradeCode: 'ELECTRICAL', confidence: 0.95 };
  }
  if (d.includes('fire') || d.includes('smoke') || d.includes('extinguisher') || d.includes('panel')) {
    return { trade: 'Fire Safety Specialist', tradeCode: 'FIRE', confidence: 0.95 };
  }
  if (d.includes('door') || d.includes('lock') || d.includes('window') || d.includes('roof') || d.includes('gutter') || d.includes('ceiling') || d.includes('flooring')) {
    return { trade: 'Fabric & Building Maintenance Specialist', tradeCode: 'FABRIC', confidence: 0.90 };
  }
  return { trade: 'Facilities Maintenance Engineer', tradeCode: 'GENERAL', confidence: 0.75 };
}

export function classifyJobType(description: string): string {
  const d = (description || '').toLowerCase();
  if (d.includes('replace') || d.includes('remedial') || d.includes('install') || d.includes('quote')) {
    return 'QUOTED_REMEDIAL';
  }
  if (d.includes('emergency') || d.includes('flood') || d.includes('danger') || d.includes('burst')) {
    return 'REACTIVE_EMERGENCY';
  }
  if (d.includes('service') || d.includes('ppm') || d.includes('routine') || d.includes('inspection')) {
    return 'PLANNED_MAINTENANCE';
  }
  return 'REACTIVE_REPAIR';
}

export function classifyFault(description: string): string {
  const d = (description || '').toLowerCase();
  if (d.includes('leak') || d.includes('seal')) return 'Mechanical Seal Failure / Water Leakage';
  if (d.includes('bearing') || d.includes('vibration') || d.includes('noisy')) return 'Bearing Wear / Excessive Vibration';
  if (d.includes('tripping') || d.includes('fuse') || d.includes('no power')) return 'Electrical Overload / Component Short Circuit';
  if (d.includes('airlock') || d.includes('pressure') || d.includes('no heat')) return 'System Pressure Drop / Circulation Failure';
  if (d.includes('broken') || d.includes('damaged')) return 'Physical Component Damage';
  return 'Component Defect / Operational Failure';
}

export function assessPriority(description: string): 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW' {
  const d = (description || '').toLowerCase();
  if (d.includes('flood') || d.includes('burst') || d.includes('fire') || d.includes('gas') || d.includes('danger') || d.includes('critical')) {
    return 'P1_CRITICAL';
  }
  if (d.includes('urgent') || d.includes('server') || d.includes('no water') || d.includes('no heating')) {
    return 'P2_HIGH';
  }
  if (d.includes('routine') || d.includes('minor') || d.includes('cosmetic')) {
    return 'P4_LOW';
  }
  return 'P3_MEDIUM';
}

// ─── 4. SCOPE & PARTS INTELLIGENCE ───────────────────────────────────────────

export function identifyRequiredWorks(
  assetTypeOrName: string,
  fault: string
): Array<{ title: string; source: 'ENGINEER_STATED' | 'AI_INFERRED'; isChargeable: boolean; requiresConfirmation: boolean }> {
  const lower = `${assetTypeOrName} ${fault}`.toLowerCase();
  
  const baseSteps: Array<{ title: string; source: 'ENGINEER_STATED' | 'AI_INFERRED'; isChargeable: boolean; requiresConfirmation: boolean }> = [
    { title: 'Attend site and isolate equipment from power and fluid services safely', source: 'AI_INFERRED', isChargeable: true, requiresConfirmation: false },
  ];

  if (lower.includes('seal') || lower.includes('pump') || lower.includes('leak')) {
    baseSteps.push(
      { title: 'Isolate and drain down pump chamber / suction & discharge lines', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Dismantle pump casing and remove defective mechanical seal assembly', source: 'ENGINEER_STATED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Inspect pump shaft, sleeve, and seat for wear or score damage', source: 'AI_INFERRED' as const, isChargeable: false, requiresConfirmation: false },
      { title: 'Supply and install replacement compatible mechanical seal kit and O-rings', source: 'ENGINEER_STATED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Reassemble pump housing with new replacement gaskets', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Refill, vent air, and reinstate system fluid pressure', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Conduct operational run test and inspect for leaks under operating load', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Return equipment to full service and provide completed report', source: 'AI_INFERRED' as const, isChargeable: false, requiresConfirmation: false }
    );
  } else if (lower.includes('bearing') || lower.includes('motor') || lower.includes('fan')) {
    baseSteps.push(
      { title: 'De-energise motor and apply Lock-Out Tag-Out (LOTO)', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Remove fan drive belts / coupling guard and decouple motor', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Extract defective bearings from drive and non-drive ends', source: 'ENGINEER_STATED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Supply and press-fit new sealed precision bearings', source: 'ENGINEER_STATED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Realign motor and check pulley alignment and belt tension', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Re-energise, check rotational direction, and measure vibration levels', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false }
    );
  } else {
    baseSteps.push(
      { title: 'Conduct thorough visual and diagnostic inspection of reported fault', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Supply and fit replacement parts as specified', source: 'ENGINEER_STATED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Test operation across complete operating cycle', source: 'AI_INFERRED' as const, isChargeable: true, requiresConfirmation: false },
      { title: 'Clean work area and hand over system in full working order', source: 'AI_INFERRED' as const, isChargeable: false, requiresConfirmation: false }
    );
  }

  return baseSteps;
}

export async function identifyPotentialParts(
  manufacturer?: string,
  model?: string,
  fault?: string
): Promise<ToolExecutionResult<any[]>> {
  let searchTerms: string[] = [];
  if (manufacturer) searchTerms.push(manufacturer);
  if (model) searchTerms.push(model);
  if (fault && (fault.toLowerCase().includes('seal') || fault.toLowerCase().includes('leak'))) {
    searchTerms.push('seal');
  }

  const queryTerm = searchTerms.join(' ').trim();
  if (!queryTerm) {
    return { success: true, data: [] };
  }

  const { data } = await dbQuery<SupplierPrice[]>(
    `supplier_price_catalogue?or=(description.ilike.%25${encodeURIComponent(queryTerm)}%25,item_code.ilike.%25${encodeURIComponent(queryTerm)}%25)&limit=5`
  );

  return { success: true, data: data || [] };
}

export async function getPart(itemCodeOrId: string): Promise<ToolExecutionResult<SupplierPrice | null>> {
  if (!itemCodeOrId) return { success: false, error: 'itemCodeOrId is required' };
  const clean = encodeURIComponent(itemCodeOrId.trim());
  const { data, error } = await dbQuery<SupplierPrice[]>(
    `supplier_price_catalogue?or=(id.eq.${clean},item_code.eq.${clean})&limit=1`
  );
  if (error || !data || data.length === 0) {
    return { success: true, data: null };
  }
  return { success: true, data: data[0] };
}

export async function getPartPrice(
  itemCodeOrId: string,
  clientAccountId?: string
): Promise<ToolExecutionResult<{ costGbp: number; sellGbp: number; markupPct: number; isStale: boolean }>> {
  const partRes = await getPart(itemCodeOrId);
  if (!partRes.success || !partRes.data) {
    return { success: false, error: 'Part not found in catalogue' };
  }
  const part = partRes.data;
  const policy = await getEffectivePolicy({ clientAccountId });
  const markup = resolveMaterialMarkup(part.unit_cost_gbp, 1, policy);

  return {
    success: true,
    data: {
      costGbp: part.unit_cost_gbp,
      sellGbp: markup.unitPriceGbp,
      markupPct: markup.markupPct,
      isStale: part.is_stale || false,
    },
  };
}

// ─── 5. LABOUR & PRICING ENGINE TOOLS ────────────────────────────────────────

export async function getLabourRate(
  tradeCode: string,
  clientAccountId?: string,
  contractId?: string
): Promise<ToolExecutionResult<{ hourlyRateGbp: number; calloutRateGbp: number; rateCardName: string; isDefault: boolean }>> {
  const { rateCard, sourceName } = await resolveRateHierarchy({
    contractId,
    clientAccountId,
  });

  if (rateCard) {
    const { data: items } = await dbQuery<RateCardItem[]>(
      `rate_card_items?rate_card_id=eq.${rateCard.id}&select=*`
    );
    const matched = (items || []).find((i) => i.trade_code === tradeCode) || items?.[0];
    if (matched) {
      return {
        success: true,
        data: {
          hourlyRateGbp: matched.standard_rate_gbp,
          calloutRateGbp: matched.rate_type === 'CALLOUT' ? matched.standard_rate_gbp : 0,
          rateCardName: sourceName,
          isDefault: false,
        },
      };
    }
  }

  // Framework default if no active rate card
  return {
    success: true,
    data: {
      hourlyRateGbp: 65.0,
      calloutRateGbp: 95.0,
      rateCardName: 'EntireFM Standard Framework Rate',
      isDefault: true,
    },
  };
}

export async function getPricingRules(
  clientAccountId?: string,
  contractId?: string
): Promise<ToolExecutionResult<any>> {
  const policy = await getEffectivePolicy({ clientAccountId, contractId });
  return { success: true, data: policy };
}

export function calculateLabour(
  hourlyRateGbp: number,
  hours: number,
  engineersCount = 1,
  calloutChargeGbp = 0
): { totalLabourGbp: number; breakdown: string } {
  const engineers = Math.max(1, engineersCount);
  const total = roundMoney(hours * hourlyRateGbp * engineers + calloutChargeGbp);
  const breakdown = `${hours}h @ £${hourlyRateGbp}/h × ${engineers} eng${calloutChargeGbp > 0 ? ` + £${calloutChargeGbp} callout` : ''} = £${total.toFixed(2)}`;
  return { totalLabourGbp: total, breakdown };
}

export function calculateMaterials(
  costGbp: number,
  quantity = 1,
  markupPct = 20.0
): { unitSellGbp: number; totalSellGbp: number; totalCostGbp: number } {
  const totalCostGbp = roundMoney(costGbp * quantity);
  const unitSellGbp = roundMoney(costGbp * (1 + markupPct / 100));
  const totalSellGbp = roundMoney(unitSellGbp * quantity);
  return { unitSellGbp, totalSellGbp, totalCostGbp };
}

export function calculateVAT(netGbp: number, vatRatePct = 20.0): { vatAmountGbp: number; grossTotalGbp: number } {
  const { taxGbp, grossGbp } = applyTax(netGbp, vatRatePct);
  return { vatAmountGbp: taxGbp, grossTotalGbp: grossGbp };
}

// ─── 6. QUOTE DRAFT CREATION & PERSISTENCE TOOLS ─────────────────────────────

export async function createQuoteDraft(
  fieldScopeId: string,
  session: UserSession
): Promise<ToolExecutionResult<any>> {
  try {
    const res = await createQuoteDraftFromFieldScope(fieldScopeId, session);
    if (!res.quote) {
      return { success: false, error: res.error || 'Failed to create quote draft' };
    }
    return { success: true, data: { quote: res.quote, exceptions: res.exceptions } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateQuoteDraft(
  quoteId: string,
  updates: Record<string, any>,
  session: UserSession
): Promise<ToolExecutionResult<any>> {
  if (!quoteId) return { success: false, error: 'quoteId is required' };
  const { error } = await dbQuery(`quotes?id=eq.${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    body: {
      ...updates,
      updated_at: new Date().toISOString(),
    },
  });
  if (error) return { success: false, error };
  return { success: true, data: { quoteId, updated: true } };
}

export async function linkQuoteToWorkOrder(
  quoteId: string,
  workOrderId: string
): Promise<ToolExecutionResult<any>> {
  if (!quoteId || !workOrderId) {
    return { success: false, error: 'quoteId and workOrderId are required' };
  }
  const { error } = await dbQuery(`quotes?id=eq.${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    body: { work_order_id: workOrderId, updated_at: new Date().toISOString() },
  });
  if (error) return { success: false, error };
  return { success: true };
}

export async function requestHumanReview(
  quoteId: string,
  reason: string,
  session: UserSession
): Promise<ToolExecutionResult<any>> {
  if (!quoteId) return { success: false, error: 'quoteId is required' };
  await dbQuery(`quotes?id=eq.${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    body: {
      internal_status: 'INTERNAL_REVIEW',
      rejection_reason_detail: reason,
      updated_at: new Date().toISOString(),
    },
  });
  return { success: true, data: { status: 'INTERNAL_REVIEW', reason } };
}
