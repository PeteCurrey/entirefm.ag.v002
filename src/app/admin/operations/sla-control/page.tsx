import React from 'react';
import { listActiveSLARisks } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SLAPill } from '@/components/admin/SLAPill';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function SLAControlPage() {
  const slaRisks = await listActiveSLARisks();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Operations"
        title="SLA Control & Risk Monitor"
        description="Live operational radar for work orders approaching response, attendance, or resolution breach thresholds."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Active SLA Radar</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{slaRisks.length}</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">At Risk (&lt;60m)</div>
          <div className="mt-1 text-2xl font-light text-amber-300">0</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Breached Today</div>
          <div className="mt-1 text-2xl font-light text-rose-400">0</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">On-Track Compliance</div>
          <div className="mt-1 text-2xl font-light text-emerald-400">100%</div>
        </div>
      </div>

      {slaRisks.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[60rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Work Order</th>
                <th className="px-5 py-3">Client / Site</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Target Due</th>
                <th className="px-5 py-3">SLA Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {slaRisks.map((wo) => (
                <tr key={wo.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="font-normal text-[11px] text-[#111111]">{wo.work_order_number}</div>
                    <div className="text-[12px] font-normal text-[#111111]">{wo.title}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{wo.organisation?.name}</div>
                    <div className="text-[11.5px] text-[#9A9A95]">{wo.site?.name}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-[#F5F5F3] px-2 py-0.5 font-normal text-[10px] text-[#6D6D68]">
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
                    {wo.sla_resolution_due_at
                      ? new Date(wo.sla_resolution_due_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <SLAPill resolutionDueAt={wo.sla_resolution_due_at} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="All SLAs On Track"
          description="There are currently no active work orders breaching or at risk of breaching statutory or contractual SLA targets."
          actionText="View Work Order Queue"
          actionHref="/admin/operations/work-orders"
        />
      )}
    </div>
  );
}
