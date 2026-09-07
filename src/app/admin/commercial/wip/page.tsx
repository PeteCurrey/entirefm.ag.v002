import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { calculateCommercialWip, listUnbilledCompletedWork } from '@/server/commercial';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function CommercialWIPPage() {
  const { data: quotes } = await dbQuery<any[]>('quotes?status=eq.APPROVED&select=*');
  const { data: commitments } = await dbQuery<any[]>('cost_commitments?select=*');
  const unbilled = await listUnbilledCompletedWork();

  const approvedRevenue = (quotes || []).reduce((sum, q) => sum + (Number(q.subtotal_gbp) || 0), 0);
  const committedCost = (commitments || []).reduce((sum, c) => sum + (Number(c.committed_amount_gbp) || 0), 0);
  const actualCost = (commitments || []).reduce((sum, c) => sum + (Number(c.actual_invoiced_gbp) || 0), 0);

  const summary = calculateCommercialWip({
    approvedRevenue,
    committedCost,
    actualCost,
    hasClientPo: true,
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Commercial WIP & Margin Dashboard"
        description="Live work-in-progress valuation, cost commitment tracking, unbilled completed jobs, and true margin realization."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/exceptions"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-amber-400 border border-amber-500/30 hover:bg-amber-500/10"
            >
              ⚠️ View Commercial Exceptions
            </Link>
          </div>
        }
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-[#9A9A95]">Approved WIP Revenue</div>
          <div className="mt-1 text-[22px] font-normal text-[#111111]">
            £{summary.approvedRevenueGbp.toFixed(2)}
          </div>
          <div className="mt-1 font-normal text-[11px] text-[#6D6D68]">
            Across {quotes?.length || 0} active approved quotes
          </div>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-[#9A9A95]">Committed Direct Cost</div>
          <div className="mt-1 text-[22px] font-normal text-[#6D6D68]">
            £{summary.committedCostGbp.toFixed(2)}
          </div>
          <div className="mt-1 font-normal text-[11px] text-[#9A9A95]">
            Actual Invoiced: £{summary.actualCostGbp.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-[#9A9A95]">Expected WIP Margin</div>
          <div className="mt-1 text-[22px] font-normal text-emerald-400">
            £{summary.expectedMarginGbp.toFixed(2)} ({summary.expectedMarginPct}%)
          </div>
          <div className="mt-1 font-normal text-[11px] text-emerald-400/60">
            Remaining Cost: £{summary.estimatedRemainingCostGbp.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-[#9A9A95]">Unbilled Completed Work</div>
          <div className="mt-1 text-[22px] font-normal text-amber-400">
            {unbilled.length} Jobs
          </div>
          <div className="mt-1 font-normal text-[11px] text-amber-400/60">
            Ready for client sales invoice staging
          </div>
        </div>
      </div>

      {/* Unbilled Completed Jobs Desk */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">
            Completed Work Orders Pending Invoicing ({unbilled.length})
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[60rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">WO Number</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Completed On</th>
                <th className="px-5 py-3">Cost (GBP)</th>
                <th className="px-5 py-3">Revenue (GBP)</th>
                <th className="px-5 py-3">Billing Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {unbilled.length > 0 ? (
                unbilled.map((w) => (
                  <tr key={w.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4 text-[11px] text-white font-light">
                      {w.work_order_number}
                    </td>
                    <td className="px-5 py-4 text-[12.5px] text-[#6D6D68] max-w-xs truncate">
                      {w.title}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11px] text-[#9A9A95]">
                      {w.actual_completion_at ? new Date(w.actual_completion_at).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="px-5 py-4 font-normal text-[12px] text-[#6D6D68]">
                      £{Number(w.total_cost_gbp || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-emerald-400 font-normal">
                      £{Number(w.total_revenue_gbp || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-light">
                        {w.billing_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="rounded bg-[#F5F5F3] px-2.5 py-1 font-normal text-[11px] text-white hover:bg-brand-electric">
                        Stage to Invoice →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-[#9A9A95]">
                    All completed work orders have been billed or staged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
