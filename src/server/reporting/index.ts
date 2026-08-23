/**
 * ENTIREFM REPORTING & METRICS MODULE
 * ===================================
 * Aggregated operational, SLA, compliance, PPM, and financial KPIs.
 * Pulls from real database tables.
 */

import { dbQuery } from '../db/client';

export interface OperationalMetrics {
  activeWorkOrders: number;
  criticalIncidents: number;
  slaBreachRiskCount: number;
  statutoryDueCount: number;
  pendingApprovalsCount: number;
  activeContractorsCount: number;
  totalAssetsCount: number;
  unbilledWipAmountGbp: number;
}

export async function getOperationalMetrics(): Promise<OperationalMetrics> {
  // Query live counts in parallel
  const [
    workOrdersRes,
    criticalRes,
    slaRiskRes,
    complianceRes,
    approvalsRes,
    contractorsRes,
    assetsRes,
    wipRes,
  ] = await Promise.all([
    dbQuery<any[]>('work_orders?status=not.in.(COMPLETED,CANCELLED)&select=id'),
    dbQuery<any[]>('work_orders?status=not.in.(COMPLETED,CANCELLED)&priority=eq.P1_CRITICAL&select=id'),
    dbQuery<any[]>('work_orders?status=not.in.(COMPLETED,CANCELLED)&sla_resolution_due_at=not.is.null&select=id'),
    dbQuery<any[]>('compliance_obligations?status=in.(DUE_SOON,OVERDUE)&select=id'),
    dbQuery<any[]>('quotes?status=eq.SUBMITTED&select=id'),
    dbQuery<any[]>('provider_organisations?is_active=eq.true&select=id'),
    dbQuery<any[]>('assets?status=eq.IN_SERVICE&select=id'),
    dbQuery<any[]>('work_orders?billing_status=eq.WIP&select=total_cost_gbp'),
  ]);

  const activeWorkOrders = workOrdersRes.data?.length ?? 0;
  const criticalIncidents = criticalRes.data?.length ?? 0;
  const slaBreachRiskCount = slaRiskRes.data?.length ?? 0;
  const statutoryDueCount = complianceRes.data?.length ?? 0;
  const pendingApprovalsCount = approvalsRes.data?.length ?? 0;
  const activeContractorsCount = contractorsRes.data?.length ?? 0;
  const totalAssetsCount = assetsRes.data?.length ?? 0;
  const unbilledWipAmountGbp = wipRes.data?.reduce((sum, item) => sum + (Number(item.total_cost_gbp) || 0), 0) ?? 0;

  return {
    activeWorkOrders,
    criticalIncidents,
    slaBreachRiskCount,
    statutoryDueCount,
    pendingApprovalsCount,
    activeContractorsCount,
    totalAssetsCount,
    unbilledWipAmountGbp,
  };
}
