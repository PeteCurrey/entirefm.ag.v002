/**
 * ENTIREFM BILLING READINESS EVALUATOR (Phase 0M Addendum)
 * =========================================================
 * Evaluates whether a completed Work Order is commercially ready for client invoicing.
 *
 * Core Principle:
 *   COMPLETED ≠ BILLABLE.
 *   Operational completion only triggers billing evaluation.
 *   Billing readiness requires verified evidence, supplier cost reconciliation,
 *   commercial authority, and satisfied client billing rules.
 */

import { BillingReadinessResult, BillingState, CompletionGateResult } from './types';

export interface BillingEvaluationContext {
  workOrder: {
    id: string;
    work_order_number: string;
    client_id?: string;
    site_id?: string;
    status: string;
    work_type?: string;
    total_revenue_gbp?: number;
    total_cost_gbp?: number;
    billing_status?: string;
    completed_at?: string;
  };
  completionGate: CompletionGateResult;
  purchaseOrder?: {
    id: string;
    po_number: string;
    status: string;
    total_amount_gbp?: number;
  };
  supplierInvoice?: {
    id: string;
    invoice_number: string;
    status: string;
    net_amount_gbp?: number;
    is_matched?: boolean;
    has_variance?: boolean;
  };
  contractBillingRule?: 'PER_WORK_ORDER' | 'MONTHLY_CONTRACT' | 'INCLUSIVE_PPM' | 'QUOTED_MILESTONE';
  commercialHold?: {
    is_held: boolean;
    hold_reason?: string;
  };
}

export function evaluateBillingReadiness(
  context: BillingEvaluationContext
): BillingReadinessResult {
  const { workOrder, completionGate, purchaseOrder, supplierInvoice, commercialHold } = context;
  const billingRule = context.contractBillingRule || 'PER_WORK_ORDER';
  const exceptions: string[] = [];

  // If already billed
  if (workOrder.billing_status === 'BILLED') {
    return {
      billing_state: 'BILLED',
      is_ready_for_billing: false,
      work_order_id: workOrder.id,
      client_id: workOrder.client_id,
      site_id: workOrder.site_id,
      completion_date: workOrder.completed_at,
      client_price_net_gbp: workOrder.total_revenue_gbp,
      client_price_gross_gbp: workOrder.total_revenue_gbp ? Math.round(workOrder.total_revenue_gbp * 1.2 * 100) / 100 : undefined,
      known_supplier_cost_net_gbp: workOrder.total_cost_gbp,
      purchase_order_id: purchaseOrder?.id,
      po_number: purchaseOrder?.po_number,
      supplier_invoice_id: supplierInvoice?.id,
      billing_rule: billingRule,
      exceptions: [],
    };
  }

  // 1. Completion Gate Prerequisite
  if (!completionGate.operational_work_complete) {
    return {
      billing_state: 'AWAITING_COMPLETION',
      is_ready_for_billing: false,
      work_order_id: workOrder.id,
      billing_rule: billingRule,
      exceptions: ['Operational fieldwork is not completed'],
    };
  }

  if (!completionGate.is_verified) {
    return {
      billing_state: 'AWAITING_EVIDENCE',
      is_ready_for_billing: false,
      work_order_id: workOrder.id,
      billing_rule: billingRule,
      exceptions: completionGate.blocking_reasons,
    };
  }

  // 2. Commercial Hold Check
  if (commercialHold?.is_held) {
    exceptions.push(`Commercial hold active: ${commercialHold.hold_reason || 'Management review required'}`);
  }

  // 3. Subcontractor Supplier Cost & PO Check (for reactive subcontracted work)
  let knownCost = workOrder.total_cost_gbp;

  if (purchaseOrder) {
    if (supplierInvoice) {
      if (supplierInvoice.has_variance) {
        exceptions.push('Supplier invoice variance exceeds PO tolerance — 3-way match unresolved');
      } else {
        knownCost = supplierInvoice.net_amount_gbp || purchaseOrder.total_amount_gbp;
      }
    } else {
      // PO exists but supplier invoice not yet received
      if (workOrder.work_type === 'REACTIVE' && !workOrder.total_cost_gbp) {
        exceptions.push('Awaiting supplier invoice submission or cost posting');
      }
    }
  }

  // 4. Client Pricing Check
  const clientNet = workOrder.total_revenue_gbp || (knownCost ? Math.round(knownCost * 1.35 * 100) / 100 : undefined);
  if (!clientNet || clientNet <= 0) {
    exceptions.push('Client billing price / charge rate not defined');
  }

  const clientGross = clientNet ? Math.round(clientNet * 1.2 * 100) / 100 : undefined;
  const marginPct = clientNet && knownCost && clientNet > 0
    ? Math.round(((clientNet - knownCost) / clientNet) * 1000) / 10
    : undefined;

  // Determine Final Billing State
  let billingState: BillingState = 'READY_FOR_BILLING';
  if (exceptions.length > 0) {
    if (exceptions.some((e) => e.includes('Awaiting supplier invoice'))) {
      billingState = 'AWAITING_SUPPLIER_COST';
    } else {
      billingState = 'BILLING_EXCEPTION';
    }
  }

  const isReady = billingState === 'READY_FOR_BILLING' && exceptions.length === 0;

  return {
    billing_state: billingState,
    is_ready_for_billing: isReady,
    work_order_id: workOrder.id,
    client_id: workOrder.client_id,
    site_id: workOrder.site_id,
    completion_date: workOrder.completed_at || new Date().toISOString(),
    client_price_net_gbp: clientNet,
    client_price_gross_gbp: clientGross,
    known_supplier_cost_net_gbp: knownCost,
    expected_margin_pct: marginPct,
    purchase_order_id: purchaseOrder?.id,
    po_number: purchaseOrder?.po_number,
    supplier_invoice_id: supplierInvoice?.id,
    billing_rule: billingRule,
    exceptions,
  };
}
