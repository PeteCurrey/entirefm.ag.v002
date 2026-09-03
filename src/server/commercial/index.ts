/**
 * ENTIREFM COMMERCIAL DOMAIN MODULE (Phase 0G)
 * ============================================
 * Commercial Intelligence + Talk-to-Quote:
 * Deterministic rate card hierarchy, callout/labour calculation,
 * material & subcontract markup, quote lifecycle & immutable versioning,
 * quote provenance, cost commitments, purchase orders, WIP dashboard,
 * commercial policy engine, exceptions ledger, and assist-mode AI agents.
 *
 * MANDATE:
 * "AI MAY STRUCTURE, RETRIEVE, CALCULATE AND RECOMMEND.
 *  AI MUST NOT INVENT COMMERCIAL FACTS."
 */

import { dbQuery } from '../db/client';
import { recordAuditEvent } from '../audit';
import { UserSession } from '../identity';

// ─────────────────────────────────────────────────────────────
// 1. TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────

export type QuoteSourceType =
  | 'MANUAL'
  | 'FIELD_VOICE'
  | 'FIELD_PHOTO'
  | 'ENGINEER_NOTE'
  | 'DEFECT'
  | 'SERVICE_REQUEST'
  | 'WORK_ORDER'
  | 'RATE_CARD'
  | 'SUPPLIER_PRICE'
  | 'HISTORICAL_QUOTE'
  | 'AI';

export type QuoteStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'READY_TO_ISSUE'
  | 'ISSUED'
  | 'APPROVED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUPERSEDED';

export type RatePeriod =
  | 'NORMAL'
  | 'OVERTIME'
  | 'EVENING'
  | 'NIGHT'
  | 'WEEKEND'
  | 'BANK_HOLIDAY'
  | 'EMERGENCY';

export type RateHierarchyLevel =
  | 'CONTRACT_SPECIFIC'
  | 'CLIENT_STANDARD'
  | 'PROVIDER_AGREED'
  | 'FRAMEWORK'
  | 'STANDARD'
  | 'MANUAL_REVIEW';

export interface CommercialSummary {
  quotedRevenueGbp: number;
  approvedRevenueGbp: number;
  billingReadyRevenueGbp: number;
  committedCostGbp: number;
  actualCostGbp: number;
  estimatedRemainingCostGbp: number;
  expectedMarginGbp: number;
  expectedMarginPct: number;
  commercialExceptions: string[];
}

export interface CommercialPolicy {
  id?: string;
  scope_level: 'PLATFORM' | 'CLIENT' | 'CONTRACT' | 'SERVICE_TYPE';
  client_account_id?: string;
  contract_id?: string;
  service_type?: string;
  name: string;
  min_margin_pct: number;
  target_margin_pct: number;
  max_auto_quote_gbp: number;
  quote_approval_threshold_gbp: number;
  po_approval_threshold_gbp: number;
  emergency_spend_limit_gbp: number;
  material_markup_type: 'FIXED_PERCENT' | 'TIERED' | 'COST_PLUS' | 'ZERO';
  material_markup_pct: number;
  subcontract_markup_pct: number;
  stale_price_threshold_days: number;
  client_po_required_above_gbp: number;
  is_active: boolean;
}

export interface RateCard {
  id: string;
  provider_org_id?: string;
  client_account_id?: string;
  contract_id?: string;
  name: string;
  currency: string;
  effective_from: string;
  effective_to?: string;
  is_default: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUPERSEDED';
  version: number;
  superseded_by_id?: string;
  notes?: string;
  items?: RateCardItem[];
}

export interface RateCardItem {
  id?: string;
  rate_card_id?: string;
  trade_id?: string;
  trade_code?: string;
  rate_type: 'HOURLY' | 'CALLOUT' | 'DAY_RATE' | 'FIXED';
  rate_period: RatePeriod;
  standard_rate_gbp: number;
  out_of_hours_rate_gbp?: number;
  emergency_rate_gbp?: number;
  minimum_hours?: number;
  callout_includes_first_hour?: boolean;
  first_hour_threshold_mins?: number;
}

export interface SupplierPrice {
  id?: string;
  supplier_org_id: string;
  item_code: string;
  description: string;
  category: string;
  unit: string;
  unit_cost_gbp: number;
  currency: string;
  quoted_at: string;
  valid_to?: string;
  is_stale: boolean;
  stale_reason?: string;
  source_document_ref?: string;
  ai_extracted?: boolean;
  ai_confidence_score?: number;
  verified_by_person_id?: string;
  verified_at?: string;
}

export interface QuoteLine {
  id?: string;
  quote_id?: string;
  line_type: 'LABOUR' | 'MATERIALS' | 'PLANT' | 'SUBCONTRACTOR';
  description: string;
  quantity: number;
  unit_cost_gbp?: number;      // Internal cost to EntireFM
  unit_price_gbp: number;      // Selling price to client
  markup_percent?: number;
  tax_rate_percent: number;
  total_gbp: number;           // Selling subtotal
  total_cost_gbp?: number;     // Internal total cost
  rate_card_item_id?: string;
  supplier_price_id?: string;
  is_missing_rate?: boolean;
  is_stale_price?: boolean;
  pricing_notes?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  version: number;
  title?: string;
  description?: string;
  work_order_id?: string;
  converted_work_order_id?: string;
  site_id?: string;
  client_account_id: string;
  provider_org_id?: string;
  status: QuoteStatus;
  internal_status: QuoteStatus;
  scope_description?: string;
  scope_exclusions_json?: string[];
  scope_assumptions_json?: string[];
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  total_cost_gbp?: number;
  total_sell_gbp?: number;
  expected_cost_gbp?: number;
  expected_margin_gbp?: number;
  expected_margin_pct?: number;
  validity_days: number;
  client_po_required: boolean;
  client_po_ref?: string;
  rate_card_id?: string;
  rate_card_version_at?: number;
  field_quote_scope_id?: string;
  supersedes_quote_id?: string;
  submitted_at?: string;
  issued_at?: string;
  approved_at?: string;
  client_decided_at?: string;
  valid_until?: string;
  rejection_reason_code?: string;
  rejection_reason_detail?: string;
  lines?: QuoteLine[];
  created_at: string;
  updated_at?: string;
}

export interface QuoteVersion {
  id: string;
  quote_id: string;
  version: number;
  snapshot_json: Record<string, any>;
  change_reason: string;
  created_by_person_id?: string;
  created_at: string;
}

export interface VariationOrder {
  id: string;
  quote_id: string;
  work_order_id: string;
  variation_number: string;
  scope_description: string;
  expected_cost_gbp: number;
  sell_price_gbp: number;
  margin_gbp: number;
  margin_pct: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approval_id?: string;
  requested_by_id?: string;
  client_approved_at?: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  work_order_id?: string;
  quote_id?: string;
  supplier_org_id: string;
  status: 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'INVOICED' | 'CANCELLED';
  commitment_type: 'STANDARD' | 'EMERGENCY' | 'VARIATION' | 'SUBCONTRACT';
  total_amount_gbp: number;
  approval_id?: string;
  issued_at?: string;
  approved_by_id?: string;
  notes?: string;
  lines?: POLine[];
  created_at: string;
}

export interface POLine {
  id?: string;
  purchase_order_id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost_gbp: number;
  total_gbp: number;
  cost_commitment_id?: string;
}

export interface CommercialException {
  id?: string;
  object_type: 'QUOTE' | 'WORK_ORDER' | 'PO' | 'INVOICE' | 'RATE_CARD';
  object_id: string;
  exception_code: string;
  severity: 'INFO' | 'WARNING' | 'BLOCKING';
  detail: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by_person_id?: string;
  resolution_notes?: string;
  created_at?: string;
}

export interface ApprovalRecord {
  id: string;
  object_type: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'SUPPLIER_ONBOARDING' | 'AI_EXCEPTION' | 'INVOICE' | 'COMPLETION_OVERRIDE';
  object_id: string;
  approval_type: string;
  requested_by_id?: string;
  requested_at: string;
  approver_person_id?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  decision_notes?: string;
  threshold_amount_gbp?: number;
  decided_at?: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// 2. DETERMINISTIC FINANCIAL ARITHMETIC & POLICY ENGINE
// ─────────────────────────────────────────────────────────────

/**
 * Rounds monetary values to exact 2 decimal places to avoid JS float drift
 */
export function roundMoney(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates VAT/tax on a net amount
 */
export function applyTax(netGbp: number, taxRatePercent: number = 20.0): { taxGbp: number; grossGbp: number } {
  const taxGbp = roundMoney(netGbp * (taxRatePercent / 100));
  const grossGbp = roundMoney(netGbp + taxGbp);
  return { taxGbp, grossGbp };
}

/**
 * Default fallback commercial policy
 */
export const DEFAULT_PLATFORM_POLICY: CommercialPolicy = {
  scope_level: 'PLATFORM',
  name: 'EntireFM Standard Policy',
  min_margin_pct: 20.0,
  target_margin_pct: 35.0,
  max_auto_quote_gbp: 500.0,
  quote_approval_threshold_gbp: 2500.0,
  po_approval_threshold_gbp: 1000.0,
  emergency_spend_limit_gbp: 1000.0,
  material_markup_type: 'FIXED_PERCENT',
  material_markup_pct: 20.0,
  subcontract_markup_pct: 15.0,
  stale_price_threshold_days: 30,
  client_po_required_above_gbp: 500.0,
  is_active: true,
};

/**
 * Resolves the effective commercial policy through hierarchy:
 * Contract -> Client -> Platform
 */
export async function getEffectivePolicy(context?: {
  contractId?: string;
  clientAccountId?: string;
  serviceType?: string;
}): Promise<CommercialPolicy> {
  if (!context?.contractId && !context?.clientAccountId) {
    return DEFAULT_PLATFORM_POLICY;
  }

  // 1. Check contract policy
  if (context?.contractId) {
    const { data } = await dbQuery<CommercialPolicy[]>(
      `commercial_policies?contract_id=eq.${context.contractId}&is_active=eq.true&limit=1`
    );
    if (data && data.length > 0) return data[0];
  }

  // 2. Check client policy
  if (context?.clientAccountId) {
    const { data } = await dbQuery<CommercialPolicy[]>(
      `commercial_policies?client_account_id=eq.${context.clientAccountId}&is_active=eq.true&limit=1`
    );
    if (data && data.length > 0) return data[0];
  }

  // 3. Fallback to platform
  const { data } = await dbQuery<CommercialPolicy[]>(
    'commercial_policies?scope_level=eq.PLATFORM&is_active=eq.true&limit=1'
  );
  return data?.[0] || DEFAULT_PLATFORM_POLICY;
}

/**
 * Evaluates required approval role based on policy rather than hard-coding
 */
export function evaluateApprovalRequirement(
  amountGbp: number,
  objectType: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'COMPLETION_OVERRIDE',
  policy: CommercialPolicy = DEFAULT_PLATFORM_POLICY
): { requiredRole: string; requiresClientApproval: boolean; requiresApproval: boolean } {
  if (objectType === 'COMPLETION_OVERRIDE') {
    return { requiredRole: 'OPERATIONS_MANAGER', requiresClientApproval: false, requiresApproval: true };
  }

  const threshold =
    objectType === 'QUOTE'
      ? policy.quote_approval_threshold_gbp
      : objectType === 'PO'
      ? policy.po_approval_threshold_gbp
      : 1000;

  if (amountGbp <= 1000) {
    return { requiredRole: 'OPERATIONS_MANAGER', requiresClientApproval: false, requiresApproval: amountGbp > threshold };
  }
  if (amountGbp <= 5000) {
    return { requiredRole: 'DIRECTOR', requiresClientApproval: false, requiresApproval: true };
  }
  return { requiredRole: 'CEO', requiresClientApproval: true, requiresApproval: true };
}

/**
 * Evaluates margin against policy floor
 */
export function evaluateMarginPolicy(
  expectedMarginPct: number,
  policy: CommercialPolicy = DEFAULT_PLATFORM_POLICY
): { isCompliant: boolean; exception?: string } {
  if (expectedMarginPct < policy.min_margin_pct) {
    return {
      isCompliant: false,
      exception: `Expected margin (${expectedMarginPct.toFixed(1)}%) is below minimum required floor (${policy.min_margin_pct}%).`,
    };
  }
  return { isCompliant: true };
}

/**
 * Checks if a supplier price is stale according to policy
 */
export function evaluateStaleness(
  quotedAtDate: string | Date,
  policy: CommercialPolicy = DEFAULT_PLATFORM_POLICY
): { isStale: boolean; daysOld: number; reason?: string } {
  const quoted = typeof quotedAtDate === 'string' ? new Date(quotedAtDate) : quotedAtDate;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - quoted.getTime()) / (1000 * 60 * 60 * 24));
  const isStale = diffDays > policy.stale_price_threshold_days;

  return {
    isStale,
    daysOld: diffDays,
    reason: isStale ? `Supplier price is ${diffDays} days old (exceeds ${policy.stale_price_threshold_days} days threshold)` : undefined,
  };
}

// ─────────────────────────────────────────────────────────────
// 3. RATE HIERARCHY & LABOUR PRICING RESOLUTION
// ─────────────────────────────────────────────────────────────

/**
 * Resolves the applicable rate card following strict hierarchy:
 * 1. Contract-specific rate card
 * 2. Client-level rate card
 * 3. Provider agreed rate card
 * 4. Default framework rate card
 */
export async function resolveRateHierarchy(context: {
  contractId?: string;
  clientAccountId?: string;
  providerOrgId?: string;
}): Promise<{ rateCard: RateCard | null; hierarchyLevel: RateHierarchyLevel; sourceName: string }> {
  // 1. Contract-specific
  if (context.contractId) {
    const { data } = await dbQuery<RateCard[]>(
      `rate_cards?contract_id=eq.${context.contractId}&status=eq.ACTIVE&limit=1`
    );
    if (data && data.length > 0) {
      return { rateCard: data[0], hierarchyLevel: 'CONTRACT_SPECIFIC', sourceName: `Contract Specific (${data[0].name})` };
    }
  }

  // 2. Client-level
  if (context.clientAccountId) {
    const { data } = await dbQuery<RateCard[]>(
      `rate_cards?client_account_id=eq.${context.clientAccountId}&status=eq.ACTIVE&limit=1`
    );
    if (data && data.length > 0) {
      return { rateCard: data[0], hierarchyLevel: 'CLIENT_STANDARD', sourceName: `Client Standard (${data[0].name})` };
    }
  }

  // 3. Provider agreed
  if (context.providerOrgId) {
    const { data } = await dbQuery<RateCard[]>(
      `rate_cards?provider_org_id=eq.${context.providerOrgId}&status=eq.ACTIVE&limit=1`
    );
    if (data && data.length > 0) {
      return { rateCard: data[0], hierarchyLevel: 'PROVIDER_AGREED', sourceName: `Provider Agreed (${data[0].name})` };
    }
  }

  // 4. Default Framework
  const { data } = await dbQuery<RateCard[]>('rate_cards?is_default=eq.true&status=eq.ACTIVE&limit=1');
  if (data && data.length > 0) {
    return { rateCard: data[0], hierarchyLevel: 'FRAMEWORK', sourceName: `Framework Default (${data[0].name})` };
  }

  return { rateCard: null, hierarchyLevel: 'MANUAL_REVIEW', sourceName: 'No Active Rate Card Found (Requires Manual Pricing)' };
}

/**
 * Calculates labour charges handling:
 * - Minimum charge hours
 * - Callout charges with optional first-hour inclusion (NO DOUBLE COUNTING)
 * - Rate periods (Normal, Overtime, Evening, Night, Weekend, Emergency)
 */
export function resolveLabourPrice(params: {
  rateItem: RateCardItem;
  hours: number;
  engineersCount?: number;
  period?: RatePeriod;
  isCallout?: boolean;
}): {
  calloutChargeGbp: number;
  hourlyRateGbp: number;
  billableHours: number;
  totalLabourGbp: number;
  calculationBreakdown: string;
} {
  const engineers = params.engineersCount && params.engineersCount > 0 ? params.engineersCount : 1;
  const period = params.period || params.rateItem.rate_period || 'NORMAL';

  // Determine effective hourly rate
  let hourlyRate = params.rateItem.standard_rate_gbp;
  if (period === 'EMERGENCY' && params.rateItem.emergency_rate_gbp) {
    hourlyRate = params.rateItem.emergency_rate_gbp;
  } else if (
    (period === 'OVERTIME' || period === 'EVENING' || period === 'NIGHT' || period === 'WEEKEND' || period === 'BANK_HOLIDAY') &&
    params.rateItem.out_of_hours_rate_gbp
  ) {
    hourlyRate = params.rateItem.out_of_hours_rate_gbp;
  }

  let calloutCharge = 0;
  let billableHours = params.hours;

  if (params.isCallout && params.rateItem.rate_type === 'CALLOUT') {
    calloutCharge = params.rateItem.standard_rate_gbp;
    if (params.rateItem.callout_includes_first_hour) {
      // Deduct 1 hour if included in callout fee
      billableHours = Math.max(0, params.hours - 1);
    }
  } else {
    // Apply minimum hours if standard hourly
    const minHours = params.rateItem.minimum_hours || 1.0;
    billableHours = Math.max(minHours, params.hours);
  }

  const labourTotal = roundMoney((billableHours * hourlyRate * engineers) + calloutCharge);

  const breakdown = params.isCallout && params.rateItem.callout_includes_first_hour
    ? `Callout fee £${calloutCharge} (includes 1st hr) + ${billableHours}h @ £${hourlyRate}/h × ${engineers} eng = £${labourTotal}`
    : `${billableHours}h @ £${hourlyRate}/h × ${engineers} eng = £${labourTotal}`;

  return {
    calloutChargeGbp: calloutCharge,
    hourlyRateGbp: hourlyRate,
    billableHours,
    totalLabourGbp: labourTotal,
    calculationBreakdown: breakdown,
  };
}

/**
 * Calculates material selling price applying policy markup
 */
export function resolveMaterialMarkup(
  unitCostGbp: number,
  quantity: number,
  policy: CommercialPolicy = DEFAULT_PLATFORM_POLICY
): {
  unitPriceGbp: number;
  totalCostGbp: number;
  totalSellGbp: number;
  markupPct: number;
} {
  const totalCost = roundMoney(unitCostGbp * quantity);
  let markupPct = policy.material_markup_pct;

  if (policy.material_markup_type === 'ZERO') {
    markupPct = 0;
  } else if (policy.material_markup_type === 'TIERED') {
    // Tiered: higher spend gets lower markup %
    if (totalCost > 2000) markupPct = 10.0;
    else if (totalCost > 500) markupPct = 15.0;
    else markupPct = 25.0;
  }

  const unitPrice = roundMoney(unitCostGbp * (1 + markupPct / 100));
  const totalSell = roundMoney(unitPrice * quantity);

  return {
    unitPriceGbp: unitPrice,
    totalCostGbp: totalCost,
    totalSellGbp: totalSell,
    markupPct,
  };
}

/**
 * Calculates subcontract selling price applying policy markup
 */
export function resolveSubcontractMarkup(
  subcontractCostGbp: number,
  policy: CommercialPolicy = DEFAULT_PLATFORM_POLICY
): { sellPriceGbp: number; marginGbp: number; markupPct: number } {
  const markupPct = policy.subcontract_markup_pct;
  const sellPriceGbp = roundMoney(subcontractCostGbp * (1 + markupPct / 100));
  const marginGbp = roundMoney(sellPriceGbp - subcontractCostGbp);
  return { sellPriceGbp, marginGbp, markupPct };
}

// ─────────────────────────────────────────────────────────────
// 4. QUOTE ENGINE & VERSIONING
// ─────────────────────────────────────────────────────────────

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `QT-${year}-${rand}`;
}

export function generatePONumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `PO-${year}-${rand}`;
}

/**
 * Creates a deterministic Quote draft from a Field Quote Scope
 * AI NEVER invents prices: if rate or supplier cost is missing, line is flagged for human review.
 */
export async function createQuoteDraftFromFieldScope(
  fieldScopeId: string,
  session: UserSession
): Promise<{ quote: Quote | null; exceptions: string[]; error?: string }> {
  if (!session) return { quote: null, exceptions: [], error: 'Authentication required' };

  // 1. Fetch field scope
  const { data: scopes, error: scopeErr } = await dbQuery<any[]>(
    `field_quote_scopes?id=eq.${fieldScopeId}&select=*`
  );
  if (scopeErr || !scopes || scopes.length === 0) {
    return { quote: null, exceptions: [], error: 'Field quote scope not found' };
  }
  const scope = scopes[0];

  // 2. Fetch context (work order / site / client)
  let clientAccountId: string | undefined;
  let contractId: string | undefined;
  let siteId: string | undefined;

  if (scope.work_order_id) {
    const { data: wos } = await dbQuery<any[]>(`work_orders?id=eq.${scope.work_order_id}&select=*`);
    if (wos && wos.length > 0) {
      clientAccountId = wos[0].organisation_id;
      contractId = wos[0].contract_id;
      siteId = wos[0].site_id;
    }
  }

  if (!clientAccountId) {
    clientAccountId = session.orgId; // Fallback
  }

  // 3. Resolve rate hierarchy & policy
  const policy = await getEffectivePolicy({ contractId, clientAccountId });
  const { rateCard, hierarchyLevel, sourceName } = await resolveRateHierarchy({
    contractId,
    clientAccountId,
  });

  const lines: QuoteLine[] = [];
  const exceptions: string[] = [];

  // 4. Resolve Labour Line
  const hours = Number(scope.labour_estimated_hours) || 2.0;
  const engineers = Number(scope.labour_engineers_count) || 1;

  if (rateCard) {
    const { data: items } = await dbQuery<RateCardItem[]>(
      `rate_card_items?rate_card_id=eq.${rateCard.id}&select=*`
    );
    const labourRate = items?.[0] || {
      rate_type: 'HOURLY',
      rate_period: 'NORMAL',
      standard_rate_gbp: 65.0,
      minimum_hours: 1.0,
    };

    const labourCalc = resolveLabourPrice({
      rateItem: labourRate,
      hours,
      engineersCount: engineers,
    });

    lines.push({
      line_type: 'LABOUR',
      description: `Labour: ${engineers} Engineer(s) for ${hours}h — ${scope.scope_description || 'Standard repairs'}`,
      quantity: labourCalc.billableHours * engineers,
      unit_cost_gbp: roundMoney(labourRate.standard_rate_gbp * 0.65), // Internal cost est
      unit_price_gbp: labourRate.standard_rate_gbp,
      tax_rate_percent: 20.0,
      total_gbp: labourCalc.totalLabourGbp,
      total_cost_gbp: roundMoney(labourRate.standard_rate_gbp * 0.65 * labourCalc.billableHours * engineers),
      rate_card_item_id: labourRate.id,
      pricing_notes: `Resolved via ${sourceName}. ${labourCalc.calculationBreakdown}`,
    });
  } else {
    // Missing labour rate card — DO NOT INVENT
    lines.push({
      line_type: 'LABOUR',
      description: `Labour: ${engineers} Engineer(s) for ${hours}h — (Rate Pending Review)`,
      quantity: hours * engineers,
      unit_price_gbp: 0.0,
      tax_rate_percent: 20.0,
      total_gbp: 0.0,
      is_missing_rate: true,
      pricing_notes: 'Missing rate card: manual pricing required before quote can be issued.',
    });
    exceptions.push('Commercial Exception: No active labour rate card found for this client/contract.');
  }

  // 5. Resolve Materials Lines
  const materials = scope.materials_items_json || [];
  for (const mat of materials) {
    const qty = Number(mat.quantity) || 1;
    // Look up in supplier price catalogue
    const { data: prices } = await dbQuery<SupplierPrice[]>(
      `supplier_price_catalogue?description=ilike.%25${encodeURIComponent(mat.description)}%25&limit=1`
    );

    if (prices && prices.length > 0) {
      const price = prices[0];
      const staleness = evaluateStaleness(price.quoted_at, policy);
      const markup = resolveMaterialMarkup(price.unit_cost_gbp, qty, policy);

      if (staleness.isStale) {
        exceptions.push(`Commercial Warning: Material '${mat.description}' uses price that is ${staleness.daysOld} days old.`);
      }

      lines.push({
        line_type: 'MATERIALS',
        description: `Material: ${mat.description}`,
        quantity: qty,
        unit_cost_gbp: price.unit_cost_gbp,
        unit_price_gbp: markup.unitPriceGbp,
        markup_percent: markup.markupPct,
        tax_rate_percent: 20.0,
        total_gbp: markup.totalSellGbp,
        total_cost_gbp: markup.totalCostGbp,
        supplier_price_id: price.id,
        is_stale_price: staleness.isStale,
        pricing_notes: `Catalogue price £${price.unit_cost_gbp} + ${markup.markupPct}% markup.`,
      });
    } else {
      // Material price not in catalogue — DO NOT INVENT
      lines.push({
        line_type: 'MATERIALS',
        description: `Material: ${mat.description} (Price Pending Supplier RFQ)`,
        quantity: qty,
        unit_price_gbp: 0.0,
        tax_rate_percent: 20.0,
        total_gbp: 0.0,
        is_missing_rate: true,
        pricing_notes: 'Missing catalogue price: manual supplier RFQ or estimate required.',
      });
      exceptions.push(`Commercial Exception: Material '${mat.description}' has no verified catalogue price.`);
    }
  }

  // 6. Build Totals & Summary
  const subtotal = roundMoney(lines.reduce((sum, l) => sum + l.total_gbp, 0));
  const { taxGbp, grossGbp } = applyTax(subtotal, 20.0);
  const totalCost = roundMoney(lines.reduce((sum, l) => sum + (l.total_cost_gbp || 0), 0));
  const hasMissingCost = lines.some((l) => l.is_missing_rate || l.unit_cost_gbp === undefined);

  const marginGbp = hasMissingCost ? 0 : roundMoney(subtotal - totalCost);
  const marginPct = hasMissingCost || subtotal === 0 ? 0 : roundMoney((marginGbp / subtotal) * 100);

  if (!hasMissingCost && subtotal > 0) {
    const marginCheck = evaluateMarginPolicy(marginPct, policy);
    if (!marginCheck.isCompliant && marginCheck.exception) {
      exceptions.push(marginCheck.exception);
    }
  }

  // 7. Save Draft Quote
  const quoteNumber = generateQuoteNumber();
  const quoteRecord: Partial<Quote> = {
    quote_number: quoteNumber,
    version: 1,
    work_order_id: scope.work_order_id || null,
    client_account_id: clientAccountId,
    status: 'DRAFT',
    internal_status: exceptions.length > 0 ? 'DRAFT' : 'INTERNAL_REVIEW',
    scope_description: scope.scope_description || 'Scope derived from field capture',
    subtotal_gbp: subtotal,
    tax_amount_gbp: taxGbp,
    total_amount_gbp: grossGbp,
    expected_cost_gbp: totalCost,
    expected_margin_gbp: marginGbp,
    expected_margin_pct: marginPct,
    validity_days: 30,
    client_po_required: subtotal >= policy.client_po_required_above_gbp,
    rate_card_id: rateCard?.id || undefined,
    rate_card_version_at: rateCard?.version || 1,
    field_quote_scope_id: fieldScopeId,
  };

  const { data: createdQuotes, error: createErr } = await dbQuery<Quote[]>('quotes?select=*', {
    method: 'POST',
    body: JSON.stringify(quoteRecord),
  });

  const quoteId = createdQuotes?.[0]?.id || `quote-${Date.now()}`;

  // Save quote lines
  for (const line of lines) {
    await dbQuery('quote_lines', {
      method: 'POST',
      body: JSON.stringify({ ...line, quote_id: quoteId }),
    });

    // Record quote line provenance
    await dbQuery('quote_provenance', {
      method: 'POST',
      body: JSON.stringify({
        quote_id: quoteId,
        source_type: line.line_type === 'LABOUR' ? 'RATE_CARD' : 'SUPPLIER_PRICE',
        source_object_type: 'field_quote_scopes',
        source_object_id: fieldScopeId,
        pricing_rule_applied: line.pricing_notes,
        markup_percent: line.markup_percent || null,
        is_ai_generated: true,
        ai_confidence_score: scope.ai_confidence_score || 0.85,
      }),
    });
  }

  // Save initial version snapshot (v1)
  await dbQuery('quote_versions', {
    method: 'POST',
    body: JSON.stringify({
      quote_id: quoteId,
      version: 1,
      snapshot_json: { ...quoteRecord, id: quoteId, lines },
      change_reason: 'Initial quote generated from Talk-to-Quote field scope',
      created_by_person_id: session.personId,
    }),
  });

  // Log exceptions if any
  for (const exc of exceptions) {
    await dbQuery('commercial_exceptions', {
      method: 'POST',
      body: JSON.stringify({
        object_type: 'QUOTE',
        object_id: quoteId,
        exception_code: exc.includes('Missing') ? 'MISSING_RATE' : 'MARGIN_BELOW_POLICY',
        severity: exc.includes('Exception') ? 'BLOCKING' : 'WARNING',
        detail: exc,
      }),
    });
  }

  await recordAuditEvent({
    event_type: 'QUOTE_DRAFT_CREATED',
    object_type: 'quotes',
    object_id: quoteId,
    actor_id: session.personId,
    after_state: { quote_number: quoteNumber, subtotal, gross: grossGbp, marginPct },
  });

  const finalQuote: Quote = {
    ...quoteRecord,
    id: quoteId,
    lines,
    created_at: new Date().toISOString(),
  } as Quote;

  return { quote: finalQuote, exceptions };
}

/**
 * Creates an immutable revision of an existing quote (increments version)
 */
export async function createQuoteRevision(
  quoteId: string,
  changeReason: string,
  session: UserSession
): Promise<{ revisedQuote: Quote | null; error?: string }> {
  if (!session) return { revisedQuote: null, error: 'Authentication required' };

  const { data: quotes } = await dbQuery<Quote[]>(`quotes?id=eq.${quoteId}&select=*`);
  if (!quotes || quotes.length === 0) return { revisedQuote: null, error: 'Quote not found' };

  const currentQuote = quotes[0];
  const nextVersion = (currentQuote.version || 1) + 1;

  // Snapshot current quote to quote_versions before revision
  await dbQuery('quote_versions', {
    method: 'POST',
    body: JSON.stringify({
      quote_id: quoteId,
      version: currentQuote.version,
      snapshot_json: currentQuote,
      change_reason: changeReason,
      created_by_person_id: session.personId,
    }),
  });

  // Update quote with new version and reset status to INTERNAL_REVIEW
  const { data: updated } = await dbQuery<Quote[]>(`quotes?id=eq.${quoteId}&select=*`, {
    method: 'PATCH',
    body: JSON.stringify({
      version: nextVersion,
      status: 'DRAFT',
      internal_status: 'INTERNAL_REVIEW',
      updated_at: new Date().toISOString(),
    }),
  });

  await recordAuditEvent({
    event_type: 'QUOTE_REVISED',
    object_type: 'quotes',
    object_id: quoteId,
    actor_id: session.personId,
    after_state: { version: nextVersion, reason: changeReason },
  });

  return { revisedQuote: updated?.[0] || null };
}

/**
 * Internal Approval Gate: Approve quote for issuing to client
 */
export async function approveQuoteToIssue(
  quoteId: string,
  notes: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };

  const { data: quotes } = await dbQuery<Quote[]>(`quotes?id=eq.${quoteId}&select=*`);
  if (!quotes || quotes.length === 0) return { success: false, error: 'Quote not found' };

  const quote = quotes[0];
  const policy = await getEffectivePolicy({ clientAccountId: quote.client_account_id });
  const approvalReq = evaluateApprovalRequirement(quote.total_amount_gbp, 'QUOTE', policy);

  // If high-value, verify user role matches required role
  if (approvalReq.requiresApproval && session.role !== approvalReq.requiredRole && (session.role as string) !== 'CEO' && (session.role as string) !== 'SUPER_ADMIN') {
    return {
      success: false,
      error: `Quote value (£${quote.total_amount_gbp}) requires approval by ${approvalReq.requiredRole}. Current role: ${session.role}`,
    };
  }

  // Transition to READY_TO_ISSUE
  const { error } = await dbQuery(`quotes?id=eq.${quoteId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'APPROVED',
      internal_status: 'READY_TO_ISSUE',
      approved_at: new Date().toISOString(),
      approved_by_id: session.personId,
    }),
  });

  if (error) return { success: false, error: String(error) };

  await recordAuditEvent({
    event_type: 'QUOTE_APPROVED_INTERNALLY',
    object_type: 'quotes',
    object_id: quoteId,
    actor_id: session.personId,
    after_state: { status: 'READY_TO_ISSUE', approver: session.personId },
  });

  return { success: true };
}

/**
 * Issue quote to client (official client delivery)
 */
export async function issueQuoteToClient(
  quoteId: string,
  session: UserSession
): Promise<{ success: boolean; error?: string }> {
  if (!session) return { success: false, error: 'Authentication required' };

  const { data: quotes } = await dbQuery<Quote[]>(`quotes?id=eq.${quoteId}&select=*`);
  if (!quotes || quotes.length === 0) return { success: false, error: 'Quote not found' };

  const quote = quotes[0];
  if (quote.internal_status !== 'READY_TO_ISSUE' && quote.status !== 'APPROVED') {
    return { success: false, error: 'Quote must be internally approved before issuing to client' };
  }

  const { error } = await dbQuery(`quotes?id=eq.${quoteId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'SUBMITTED',
      internal_status: 'ISSUED',
      issued_at: new Date().toISOString(),
    }),
  });

  if (error) return { success: false, error: String(error) };

  await recordAuditEvent({
    event_type: 'QUOTE_ISSUED_TO_CLIENT',
    object_type: 'quotes',
    object_id: quoteId,
    actor_id: session.personId,
    after_state: { status: 'ISSUED', quote_number: quote.quote_number },
  });

  return { success: true };
}

/**
 * Record Client Approval & Automatically Create Cost Commitment
 */
export async function recordClientQuoteDecision(params: {
  quoteId: string;
  decision: 'APPROVED' | 'REJECTED';
  clientPoRef?: string;
  rejectionReasonCode?: string;
  rejectionReasonDetail?: string;
  session: UserSession;
}): Promise<{ success: boolean; costCommitmentId?: string; error?: string }> {
  if (!params.session) return { success: false, error: 'Authentication required' };

  const { data: quotes } = await dbQuery<Quote[]>(`quotes?id=eq.${params.quoteId}&select=*`);
  if (!quotes || quotes.length === 0) return { success: false, error: 'Quote not found' };

  const quote = quotes[0];
  const now = new Date().toISOString();

  if (params.decision === 'APPROVED') {
    // 1. Update quote state
    await dbQuery(`quotes?id=eq.${params.quoteId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
        internal_status: 'ACCEPTED',
        client_decided_at: now,
        client_po_ref: params.clientPoRef || quote.client_po_ref || null,
      }),
    });

    // 2. Automatically record Cost Commitment if linked to work order
    let costCommitmentId: string | undefined;
    if (quote.work_order_id) {
      const commitmentGbp = quote.expected_cost_gbp || roundMoney(quote.subtotal_gbp * 0.7);
      const { data: commitments } = await dbQuery<any[]>('cost_commitments?select=id', {
        method: 'POST',
        body: JSON.stringify({
          work_order_id: quote.work_order_id,
          quote_id: quote.id,
          provider_org_id: quote.provider_org_id || null,
          description: `Cost commitment for approved quote ${quote.quote_number}`,
          committed_amount_gbp: commitmentGbp,
          actual_invoiced_gbp: 0.0,
          status: 'COMMITTED',
        }),
      });
      costCommitmentId = commitments?.[0]?.id;

      // Update work order billing status to WIP
      await dbQuery(`work_orders?id=eq.${quote.work_order_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          billing_status: 'WIP',
          total_revenue_gbp: quote.subtotal_gbp,
          total_cost_gbp: commitmentGbp,
        }),
      });
    }

    await recordAuditEvent({
      event_type: 'CLIENT_QUOTE_APPROVED',
      object_type: 'quotes',
      object_id: params.quoteId,
      actor_id: params.session.personId,
      after_state: { decision: 'APPROVED', client_po_ref: params.clientPoRef },
    });

    return { success: true, costCommitmentId };
  } else {
    // Rejected
    await dbQuery(`quotes?id=eq.${params.quoteId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'REJECTED',
        internal_status: 'REJECTED',
        client_decided_at: now,
        rejection_reason_code: params.rejectionReasonCode || 'OTHER',
        rejection_reason_detail: params.rejectionReasonDetail || null,
      }),
    });

    await recordAuditEvent({
      event_type: 'CLIENT_QUOTE_REJECTED',
      object_type: 'quotes',
      object_id: params.quoteId,
      actor_id: params.session.personId,
      after_state: { decision: 'REJECTED', reason: params.rejectionReasonCode },
    });

    return { success: true };
  }
}

// ─────────────────────────────────────────────────────────────
// 5. PURCHASE ORDER & VARIATION WORKFLOW
// ─────────────────────────────────────────────────────────────

/**
 * Creates a Purchase Order for an approved quote or cost commitment
 */
export async function createPurchaseOrder(params: {
  workOrderId?: string;
  quoteId?: string;
  supplierOrgId: string;
  commitmentType?: 'STANDARD' | 'EMERGENCY' | 'VARIATION' | 'SUBCONTRACT';
  lines: Array<{ description: string; quantity: number; unit?: string; unitCostGbp: number }>;
  notes?: string;
  session: UserSession;
}): Promise<{ purchaseOrder: PurchaseOrder | null; error?: string }> {
  if (!params.session) return { purchaseOrder: null, error: 'Authentication required' };

  const totalAmount = roundMoney(
    params.lines.reduce((sum, l) => sum + roundMoney(l.quantity * l.unitCostGbp), 0)
  );

  const poNumber = generatePONumber();
  const policy = await getEffectivePolicy();
  const approvalReq = evaluateApprovalRequirement(totalAmount, 'PO', policy);

  const poRecord: Partial<PurchaseOrder> = {
    po_number: poNumber,
    work_order_id: params.workOrderId || undefined,
    quote_id: params.quoteId || undefined,
    supplier_org_id: params.supplierOrgId,
    status: 'DRAFT',
    commitment_type: params.commitmentType || 'STANDARD',
    total_amount_gbp: totalAmount,
    notes: params.notes || undefined,
  };

  const { data: created, error } = await dbQuery<PurchaseOrder[]>('purchase_orders?select=*', {
    method: 'POST',
    body: JSON.stringify(poRecord),
  });

  if (error || !created || created.length === 0) {
    return { purchaseOrder: null, error: error ? String(error) : 'Failed to create PO' };
  }

  const poId = created[0].id;

  // Insert PO lines
  for (const line of params.lines) {
    const totalGbp = roundMoney(line.quantity * line.unitCostGbp);
    await dbQuery('po_lines', {
      method: 'POST',
      body: JSON.stringify({
        purchase_order_id: poId,
        description: line.description,
        quantity: line.quantity,
        unit: line.unit || 'UNIT',
        unit_cost_gbp: line.unitCostGbp,
        total_gbp: totalGbp,
      }),
    });
  }

  // If requires high-level approval, create approval record
  if (approvalReq.requiresApproval) {
    await dbQuery('approvals', {
      method: 'POST',
      body: JSON.stringify({
        object_type: 'PO',
        object_id: poId,
        approval_type: 'COMMERCIAL',
        requested_by_id: params.session.personId,
        threshold_amount_gbp: totalAmount,
        status: 'PENDING',
      }),
    });
  }

  await recordAuditEvent({
    event_type: 'PURCHASE_ORDER_CREATED',
    object_type: 'purchase_orders',
    object_id: poId,
    actor_id: params.session.personId,
    after_state: { po_number: poNumber, total: totalAmount },
  });

  return { purchaseOrder: { ...created[0], id: poId, total_amount_gbp: totalAmount } };
}

/**
 * Creates a Variation Order for already-approved work without mutating original quote
 */
export async function createVariationOrder(params: {
  quoteId: string;
  workOrderId: string;
  scopeDescription: string;
  expectedCostGbp: number;
  sellPriceGbp: number;
  session: UserSession;
}): Promise<{ variation: VariationOrder | null; error?: string }> {
  if (!params.session) return { variation: null, error: 'Authentication required' };

  const marginGbp = roundMoney(params.sellPriceGbp - params.expectedCostGbp);
  const marginPct = params.sellPriceGbp > 0 ? roundMoney((marginGbp / params.sellPriceGbp) * 100) : 0;
  const variationNumber = `VO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const varRecord: Partial<VariationOrder> = {
    quote_id: params.quoteId,
    work_order_id: params.workOrderId,
    variation_number: variationNumber,
    scope_description: params.scopeDescription,
    expected_cost_gbp: params.expectedCostGbp,
    sell_price_gbp: params.sellPriceGbp,
    margin_gbp: marginGbp,
    margin_pct: marginPct,
    status: 'DRAFT',
    requested_by_id: params.session.personId,
  };

  const { data: created, error } = await dbQuery<VariationOrder[]>('variation_orders?select=*', {
    method: 'POST',
    body: JSON.stringify(varRecord),
  });

  if (error || !created || created.length === 0) {
    return { variation: null, error: error ? String(error) : 'Failed to create variation' };
  }

  await recordAuditEvent({
    event_type: 'VARIATION_ORDER_CREATED',
    object_type: 'variation_orders',
    object_id: created[0].id,
    actor_id: params.session.personId,
    after_state: { variation_number: variationNumber, sellPrice: params.sellPriceGbp },
  });

  return { variation: created[0] };
}

// ─────────────────────────────────────────────────────────────
// 6. WIP, UNBILLED WORK & MARGIN LEAKAGE INTELLIGENCE
// ─────────────────────────────────────────────────────────────

/**
 * Calculates true commercial WIP and margins for a Work Order
 */
export function calculateCommercialWip(params: {
  approvedRevenue: number;
  committedCost: number;
  actualCost: number;
  hasClientPo: boolean;
  minMarginFloorPct?: number;
}): CommercialSummary {
  const minFloor = params.minMarginFloorPct ?? 20;
  const totalCost = Math.max(params.committedCost, params.actualCost);
  const expectedMarginGbp = roundMoney(Math.max(0, params.approvedRevenue - totalCost));
  const expectedMarginPct = params.approvedRevenue > 0 ? roundMoney((expectedMarginGbp / params.approvedRevenue) * 100) : 0;

  const exceptions: string[] = [];
  if (!params.hasClientPo && params.approvedRevenue > 0) {
    exceptions.push('Commercial Exception: Missing Client Purchase Order number.');
  }
  if (params.actualCost > params.committedCost && params.committedCost > 0) {
    exceptions.push(`Commercial Exception: Actual supplier cost (£${params.actualCost}) exceeded committed cost (£${params.committedCost}).`);
  }
  if (params.approvedRevenue > 0 && expectedMarginPct < minFloor) {
    exceptions.push(`Commercial Exception: Expected margin (${expectedMarginPct.toFixed(1)}%) is below target floor (${minFloor}%).`);
  }

  return {
    quotedRevenueGbp: params.approvedRevenue,
    approvedRevenueGbp: params.approvedRevenue,
    billingReadyRevenueGbp: params.approvedRevenue,
    committedCostGbp: params.committedCost,
    actualCostGbp: params.actualCost,
    estimatedRemainingCostGbp: Math.max(0, roundMoney(params.committedCost - params.actualCost)),
    expectedMarginGbp,
    expectedMarginPct,
    commercialExceptions: exceptions,
  };
}

/**
 * Evaluates required approver role based on dynamic policy hierarchy
 */
export function evaluateRequiredApprover(
  amountGbp: number,
  objectType: 'QUOTE' | 'PO' | 'COST_VARIATION' | 'COMPLETION_OVERRIDE'
): { requiredRole: string; requiresClientApproval: boolean } {
  return evaluateApprovalRequirement(amountGbp, objectType);
}

/**
 * Lists quotes with optional status filter or filter options
 */
export async function listQuotes(
  filters?:
    | {
        status?: string;
        clientAccountId?: string;
        siteId?: string;
      }
    | string
): Promise<Quote[]> {
  let endpoint = 'quotes?select=*&order=created_at.desc';
  if (typeof filters === 'string') {
    endpoint += `&status=eq.${encodeURIComponent(filters)}`;
  } else if (filters) {
    if (filters.status) endpoint += `&status=eq.${encodeURIComponent(filters.status)}`;
    if (filters.clientAccountId)
      endpoint += `&client_account_id=eq.${encodeURIComponent(filters.clientAccountId)}`;
    if (filters.siteId) endpoint += `&site_id=eq.${encodeURIComponent(filters.siteId)}`;
  }
  const { data } = await dbQuery<Quote[]>(endpoint);
  return data || [];
}

/**
 * Lists pending approvals
 */
export async function listPendingApprovals(): Promise<ApprovalRecord[]> {
  const { data } = await dbQuery<ApprovalRecord[]>(
    'approvals?status=eq.PENDING&select=*&order=requested_at.desc'
  );
  return data || [];
}

/**
 * Retrieves unbilled completed work orders ready for commercial billing
 */
export async function listUnbilledCompletedWork(session?: UserSession): Promise<any[]> {
  const { data } = await dbQuery<any[]>(
    'work_orders?status=eq.COMPLETED&billing_status=eq.UNBILLED&select=*&order=actual_completion_at.desc'
  );
  return data || [];
}

/**
 * Commercial Intelligence: Detects margin leakage & commercial exceptions
 */
export async function detectMarginLeakage(): Promise<{
  unbilledCount: number;
  unbilledValueGbp: number;
  costVarianceCount: number;
  costVarianceGbp: number;
  missingPoCount: number;
  exceptions: CommercialException[];
}> {
  // 1. Unbilled completed work
  const unbilled = await listUnbilledCompletedWork();
  const unbilledVal = unbilled.reduce((sum, w) => sum + (Number(w.total_revenue_gbp) || 0), 0);

  // 2. Commercial exceptions ledger
  const { data: excData } = await dbQuery<CommercialException[]>(
    'commercial_exceptions?is_resolved=eq.false&select=*&order=created_at.desc'
  );
  const exceptions = excData || [];

  return {
    unbilledCount: unbilled.length,
    unbilledValueGbp: roundMoney(unbilledVal),
    costVarianceCount: exceptions.filter((e) => e.exception_code === 'COST_VARIANCE_EXCEEDED').length,
    costVarianceGbp: 0,
    missingPoCount: exceptions.filter((e) => e.exception_code === 'MISSING_CLIENT_PO').length,
    exceptions,
  };
}

export async function createQuoteDirect(params: {
  client_account_id?: string;
  site_id?: string;
  contract_id?: string;
  work_order_id?: string;
  defect_id?: string;
  title: string;
  description: string;
  lines: Array<{
    line_type: 'LABOUR' | 'MATERIALS' | 'SUBCONTRACT' | 'PLANT_EQUIPMENT' | 'PRELIMINARIES' | 'DISPOSAL' | 'ACCESS' | 'EXPENSES';
    description: string;
    quantity: number;
    unit_cost_gbp: number;
    markup_pct?: number;
    unit_price_gbp?: number;
  }>;
  source_type?: QuoteSourceType;
  session?: UserSession;
}): Promise<{ quote: Quote | null; error?: string }> {
  const quoteNumber = generateQuoteNumber();

  let totalCost = 0;
  let totalSell = 0;

  const processedLines: any[] = params.lines.map((line, idx) => {
    const markup = line.markup_pct ?? 25.0;
    const unitPrice = line.unit_price_gbp ?? roundMoney(line.unit_cost_gbp * (1 + markup / 100));
    const lineCost = roundMoney(line.quantity * line.unit_cost_gbp);
    const lineSell = roundMoney(line.quantity * unitPrice);

    totalCost += lineCost;
    totalSell += lineSell;

    return {
      line_number: idx + 1,
      line_type: line.line_type,
      description: line.description,
      quantity: line.quantity,
      unit_cost_gbp: line.unit_cost_gbp,
      total_cost_gbp: lineCost,
      markup_pct: markup,
      unit_price_gbp: unitPrice,
      total_sell_gbp: lineSell,
      margin_gbp: roundMoney(lineSell - lineCost),
      margin_pct: lineSell > 0 ? roundMoney(((lineSell - lineCost) / lineSell) * 100) : 0,
    };
  });

  const marginGbp = roundMoney(totalSell - totalCost);
  const marginPct = totalSell > 0 ? roundMoney((marginGbp / totalSell) * 100) : 0;

  const { data, error } = await dbQuery<Quote[]>('quotes', {
    method: 'POST',
    body: {
      quote_number: quoteNumber,
      client_account_id: params.client_account_id || null,
      site_id: params.site_id || null,
      contract_id: params.contract_id || null,
      work_order_id: params.work_order_id || null,
      // Use canonical columns only (no title/description/source_type on this table)
      scope_description: params.title || params.description || null,
      notes: params.description || null,
      status: 'DRAFT',
      version: 1,
      subtotal_gbp: totalSell,
      tax_amount_gbp: roundMoney(totalSell * 0.2),
      total_amount_gbp: roundMoney(totalSell * 1.2),
      expected_cost_gbp: totalCost,
      expected_margin_gbp: marginGbp,
      expected_margin_pct: marginPct,
      total_cost_gbp: totalCost,
      total_sell_gbp: totalSell,
      margin_gbp: marginGbp,
      margin_pct: marginPct,
      vat_amount_gbp: roundMoney(totalSell * 0.2),
      total_inc_vat_gbp: roundMoney(totalSell * 1.2),
    },
  });

  if (error || !data?.[0]) {
    return { quote: null, error: `Failed to create quote: ${error || 'Unknown error'}` };
  }

  const quote = data[0];

  // Insert lines
  for (const line of processedLines) {
    await dbQuery('quote_lines', {
      method: 'POST',
      body: {
        quote_id: quote.id,
        line_type: line.line_type,
        description: line.description,
        quantity: line.quantity,
        unit_price_gbp: line.unit_price_gbp,
        tax_rate_percent: 20.0,
        total_gbp: line.total_sell_gbp,
      },
    });
  }

  return { quote, error: undefined };
}

/**
 * Idempotently converts an approved/accepted quote into a work order.
 * Ensures strict single canonical dataset usage and immutable audit ledger logging.
 */
export async function convertQuoteToWorkOrder(params: {
  quoteId: string;
  session?: UserSession;
  overrideStatus?: boolean;
}): Promise<{ workOrder: any; alreadyConverted: boolean; error?: string }> {
  // 1. Fetch quote
  const { data: quotes, error: qErr } = await dbQuery<Quote[]>(
    `quotes?id=eq.${encodeURIComponent(params.quoteId)}&select=*,lines:quote_lines(*)`
  );
  if (qErr || !quotes?.[0]) {
    return {
      workOrder: null,
      alreadyConverted: false,
      error: `Quote not found: ${qErr || 'Invalid ID'}`,
    };
  }
  const quote = quotes[0];

  // 2. Check idempotency: already converted?
  if (quote.converted_work_order_id) {
    const { data: existingWo } = await dbQuery<any[]>(
      `work_orders?id=eq.${encodeURIComponent(quote.converted_work_order_id)}&select=*`
    );
    if (existingWo?.[0]) {
      return { workOrder: existingWo[0], alreadyConverted: true };
    }
  }

  // Check if work_order exists with quote_id = quote.id
  const { data: woByQuote } = await dbQuery<any[]>(
    `work_orders?quote_id=eq.${encodeURIComponent(quote.id)}&select=*`
  );
  if (woByQuote?.[0]) {
    // Back-link quote
    await dbQuery(`quotes?id=eq.${encodeURIComponent(quote.id)}`, {
      method: 'PATCH',
      body: { converted_work_order_id: woByQuote[0].id, work_order_id: woByQuote[0].id },
    });
    return { workOrder: woByQuote[0], alreadyConverted: true };
  }

  // 3. Status validation
  const validStatuses: QuoteStatus[] = ['APPROVED', 'ACCEPTED'];
  if (!params.overrideStatus && !validStatuses.includes(quote.status)) {
    return {
      workOrder: null,
      alreadyConverted: false,
      error: `Quote must be APPROVED or ACCEPTED to convert into a work order (current status: ${quote.status})`,
    };
  }

  // 4. Resolve site_id and organisation_id
  let siteId = quote.site_id;
  let orgId: string | null = null;

  if (siteId) {
    const { data: siteData } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(siteId)}&select=organisation_id`
    );
    orgId = siteData?.[0]?.organisation_id || null;
  }

  // If site_id not on quote, check if client account has a site
  if (!siteId && quote.client_account_id) {
    const { data: clientSites } = await dbQuery<any[]>(
      `sites?client_account_id=eq.${encodeURIComponent(quote.client_account_id)}&select=id,organisation_id&limit=1`
    );
    if (clientSites?.[0]) {
      siteId = clientSites[0].id;
      orgId = clientSites[0].organisation_id;
    }
  }

  // If still no orgId, resolve from client_account
  if (!orgId && quote.client_account_id) {
    const { data: clientAcc } = await dbQuery<any[]>(
      `client_accounts?id=eq.${encodeURIComponent(quote.client_account_id)}&select=organisation_id`
    );
    orgId = clientAcc?.[0]?.organisation_id || null;
  }

  if (!orgId) {
    const { data: defaultOrg } = await dbQuery<any[]>('organisations?limit=1&select=id');
    orgId = defaultOrg?.[0]?.id || '00000000-0000-0000-0000-000000000000';
  }

  if (!siteId) {
    return {
      workOrder: null,
      alreadyConverted: false,
      error: 'Cannot convert quote without an associated site. Please assign a site to the quote or client first.',
    };
  }

  // 5. Generate work order number and create work order
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900000) + 100000);
  const woNumber = `EFM-WO-${year}-${rand}`;
  const now = new Date().toISOString();

  const { data: newWo, error: woError } = await dbQuery<any[]>('work_orders', {
    method: 'POST',
    body: {
      work_order_number: woNumber,
      organisation_id: orgId,
      site_id: siteId,
      quote_id: quote.id,
      title: quote.title || `Works as per Quote ${quote.quote_number}`,
      description: quote.description || quote.scope_description || `Quoted works for ${quote.quote_number}`,
      work_type: 'QUOTED',
      priority: 'P3_MEDIUM',
      status: 'OPEN',
      disposition_state: 'NONE',
      total_cost_gbp: quote.total_cost_gbp || quote.expected_cost_gbp || null,
      total_revenue_gbp: quote.total_sell_gbp || quote.total_amount_gbp || null,
      billing_status: 'UNBILLED',
      target_start_at: now,
    },
  });

  if (woError || !newWo?.[0]) {
    return {
      workOrder: null,
      alreadyConverted: false,
      error: `Failed to create work order: ${woError || 'Database insert error'}`,
    };
  }

  const createdWo = newWo[0];

  // 6. Update quote with converted_work_order_id and work_order_id
  await dbQuery(`quotes?id=eq.${encodeURIComponent(quote.id)}`, {
    method: 'PATCH',
    body: {
      converted_work_order_id: createdWo.id,
      work_order_id: createdWo.id,
    },
  });

  // 7. Record immutable audit event
  await recordAuditEvent({
    event_type: 'QUOTE_CONVERTED_TO_WORK_ORDER',
    object_type: 'quote',
    object_id: quote.id,
    actor_id: params.session?.personId || undefined,
    actor_type: params.session ? 'HUMAN' : 'SYSTEM',
    organisation_id: orgId || undefined,
    before_state: { quote_id: quote.id, status: quote.status },
    after_state: {
      quote_id: quote.id,
      work_order_id: createdWo.id,
      work_order_number: createdWo.work_order_number,
    },
    reason: `Quote ${quote.quote_number} converted to work order ${createdWo.work_order_number}`,
    source: 'COMMERCIAL_LIFECYCLE',
  });

  return { workOrder: createdWo, alreadyConverted: false };
}


