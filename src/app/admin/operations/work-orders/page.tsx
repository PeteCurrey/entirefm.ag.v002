import React from 'react';
import { listWorkOrders } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function WorkOrdersPage() {
  const workOrders = await listWorkOrders({ limit: 100 });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Operations"
        title="Work Orders"
        description="Comprehensive reactive and scheduled job lifecycle management across all client estates."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo">
            + New Work Order
          </button>
        }
      />

      {workOrders.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Title / Site</th>
                <th className="px-5 py-3">Type / Priority</th>
                <th className="px-5 py-3">SLA Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {wo.work_order_number}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-light text-white">{wo.title}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      {wo.site?.name || 'Site unassigned'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-[11px]">{wo.work_type}</div>
                    <span
                      className={`inline-block rounded px-1.5 py-0.2 font-mono text-[9.5px] ${
                        wo.priority === 'P1_CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-brand-edge-dark text-brand-mist/70'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
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
                    <span className="rounded border border-brand-edge-dark bg-brand-void px-2 py-0.5 font-mono text-[10px] text-white">
                      {wo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Work Orders Logged"
          description="Create your first reactive repair or schedule maintenance work order. Every order tracks visits, engineers, tasks, SLAs, and commercial WIP."
          actionText="Create Initial Work Order"
          actionHref="/admin/operations/work-orders"
        />
      )}
    </div>
  );
}
