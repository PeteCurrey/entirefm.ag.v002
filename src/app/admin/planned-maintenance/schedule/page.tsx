import React from 'react';
import { listOccurrences } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const OCC_STATUS_COLOURS: Record<string, string> = {
  PLANNED: 'bg-blue-900/40 text-blue-300',
  GENERATED: 'bg-purple-900/40 text-purple-300',
  SATISFIED: 'bg-emerald-900/40 text-emerald-300',
  MISSED: 'bg-red-900/40 text-red-300',
  NO_ACCESS: 'bg-orange-900/40 text-orange-300',
  CANCELLED: 'bg-brand-edge-dark text-brand-mist/40',
};

export default async function PPMSchedulePage() {
  const occurrences = await listOccurrences().catch(() => []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Planned Maintenance"
        title="PPM Schedule"
        description="Planned maintenance occurrences and execution windows across all active plans."
      />

      {occurrences.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Occurrence Code</th>
                <th className="px-5 py-3">Planned Date</th>
                <th className="px-5 py-3">Execution Window</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Work Order</th>
                <th className="px-5 py-3">Satisfied At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {occurrences.map((o) => (
                <tr key={o.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">{o.occurrence_code}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-white">
                    {new Date(o.planned_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/60">
                    {new Date(o.window_start_date).toLocaleDateString('en-GB')} → {new Date(o.window_end_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${OCC_STATUS_COLOURS[o.status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/70">
                    {o.work_order_id ? (
                      <span className="text-purple-400">WO Linked ({o.work_order_id})</span>
                    ) : (
                      <span className="text-brand-mist/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/50">
                    {o.satisfied_at ? new Date(o.satisfied_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Scheduled Occurrences"
          description="Generate occurrences from an active maintenance plan to populate the schedule."
        />
      )}
    </div>
  );
}
