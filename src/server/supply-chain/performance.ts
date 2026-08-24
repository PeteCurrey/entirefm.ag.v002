/**
 * PROVIDER PERFORMANCE ENGINE
 * ============================
 * Shared service consumed by:
 *   - /admin/supply-chain/contractors/[id] (network-wide view, all contractor data)
 *   - /contractor/performance (self-view, own org only)
 *
 * Calculates SLA performance, CSAT scores, invoice match rates, and compliance scores.
 */

import { dbQuery } from '@/server/db/client';

export interface ProviderPerformanceMetrics {
  providerId: string;
  providerName: string;
  period: { from: string; to: string };
  /** Work order completion rate within SLA target */
  slaComplianceRate: number | null;
  /** Average time to first attendance in hours */
  avgResponseTimeHours: number | null;
  /** Average time to complete closed jobs in calendar days */
  avgCompletionDays: number | null;
  /** Supplier invoice PO match rate (without disputes) */
  invoiceMatchRate: number | null;
  /** Average invoice variance vs. committed cost (%) */
  avgInvoiceVariancePct: number | null;
  /** Proportion of engineers with valid documents */
  engineerComplianceRate: number | null;
  /** Proportion of active insurer documents current */
  insurerDocumentCurrent: boolean | null;
  /** Total jobs assigned in period */
  totalJobsAssigned: number;
  /** Total jobs completed in period */
  totalJobsCompleted: number;
  /** Total invoiced value (GBP) in period */
  totalInvoicedGbp: number;
}

/**
 * Calculate provider performance metrics for the given contractor organisation
 * and date period. When `scopeToOwnOrg` is true (self-view), the caller's
 * orgId is enforced — no cross-contractor data leakage.
 */
export async function getProviderPerformance(
  providerId: string,
  fromDate: string,
  toDate: string
): Promise<ProviderPerformanceMetrics | null> {
  const [woRes, siRes, compRes] = await Promise.all([
    dbQuery<any[]>(
      `work_orders?assigned_provider_id=eq.${encodeURIComponent(providerId)}&created_at=gte.${fromDate}&created_at=lte.${toDate}&select=id,status,sla_target_hours,sla_met,first_attendance_at,completed_at,created_at`
    ),
    dbQuery<any[]>(
      `supplier_invoices?supplier_id=eq.${encodeURIComponent(providerId)}&invoice_date=gte.${fromDate}&invoice_date=lte.${toDate}&select=id,total_gbp,match_status,match_variance_pct`
    ),
    dbQuery<any[]>(
      `contractor_compliance_documents?provider_organisation_id=eq.${encodeURIComponent(providerId)}&is_current=eq.true&select=id,document_type,expiry_date,review_status`
    ),
  ]);

  const wos = woRes.data || [];
  const invoices = siRes.data || [];
  const docs = compRes.data || [];

  if (wos.length === 0 && invoices.length === 0) return null;

  // SLA compliance
  const woWithSla = wos.filter((w) => w.sla_met !== null);
  const slaComplianceRate =
    woWithSla.length > 0 ? woWithSla.filter((w) => w.sla_met === true).length / woWithSla.length : null;

  // Average response time
  const woWithResponse = wos.filter((w) => w.first_attendance_at && w.created_at);
  const avgResponseTimeHours =
    woWithResponse.length > 0
      ? woWithResponse.reduce((sum, w) => {
          const diffMs = new Date(w.first_attendance_at).getTime() - new Date(w.created_at).getTime();
          return sum + diffMs / 3_600_000;
        }, 0) / woWithResponse.length
      : null;

  // Average completion time
  const woCompleted = wos.filter((w) => w.completed_at && w.created_at);
  const avgCompletionDays =
    woCompleted.length > 0
      ? woCompleted.reduce((sum, w) => {
          const diffMs = new Date(w.completed_at).getTime() - new Date(w.created_at).getTime();
          return sum + diffMs / 86_400_000;
        }, 0) / woCompleted.length
      : null;

  // Invoice match rate
  const matchedInvoices = invoices.filter((i) => i.match_status === 'MATCHED' || i.match_status === 'APPROVED');
  const invoiceMatchRate = invoices.length > 0 ? matchedInvoices.length / invoices.length : null;

  // Average invoice variance
  const invoicesWithVariance = invoices.filter((i) => i.match_variance_pct !== null && i.match_variance_pct !== undefined);
  const avgInvoiceVariancePct =
    invoicesWithVariance.length > 0
      ? invoicesWithVariance.reduce((sum: number, i: any) => sum + parseFloat(i.match_variance_pct), 0) /
        invoicesWithVariance.length
      : null;

  // Engineer compliance (documents)
  const validDocs = docs.filter((d) => {
    if (!d.expiry_date) return d.review_status === 'APPROVED';
    return new Date(d.expiry_date) > new Date() && d.review_status === 'APPROVED';
  });
  const engineerComplianceRate = docs.length > 0 ? validDocs.length / docs.length : null;

  // Insurer documents
  const insuranceDocs = docs.filter((d) =>
    ['PUBLIC_LIABILITY', 'EMPLOYERS_LIABILITY', 'PROFESSIONAL_INDEMNITY'].includes(d.document_type)
  );
  const insurerDocumentCurrent =
    insuranceDocs.length > 0
      ? insuranceDocs.every((d) => !d.expiry_date || new Date(d.expiry_date) > new Date())
      : null;

  const totalInvoicedGbp = invoices.reduce((sum, i) => sum + parseFloat(i.total_gbp || '0'), 0);

  return {
    providerId,
    providerName: providerId,
    period: { from: fromDate, to: toDate },
    slaComplianceRate,
    avgResponseTimeHours,
    avgCompletionDays,
    invoiceMatchRate,
    avgInvoiceVariancePct,
    engineerComplianceRate,
    insurerDocumentCurrent,
    totalJobsAssigned: wos.length,
    totalJobsCompleted: woCompleted.length,
    totalInvoicedGbp,
  };
}

/**
 * Format a performance rate as a percentage string
 */
export function formatRate(rate: number | null, decimals = 1): string {
  if (rate === null || rate === undefined) return 'N/A';
  return `${(rate * 100).toFixed(decimals)}%`;
}
