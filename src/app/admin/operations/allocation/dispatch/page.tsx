import React from 'react';
import { listDispatches } from '@/server/allocation/allocation-store';
import { Send, Clock, CheckCircle2 } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function DispatchQueuePage() {
  const dispatches = await listDispatches();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            OPERATIONAL MOBILISATION
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Work Order Dispatch Queue &amp; Acknowledgement
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Tracking digital dispatch acknowledgements, scheduled arrival windows, and engineer assignments.
          </p>
        </div>

        <CsvExportButton
          data={dispatches.map((d) => ({
            id: d.id,
            wo: d.work_order_id,
            supplier: d.supplier_name,
            service: d.service_name,
            status: d.status,
            engineer: d.assigned_operative_name || '—',
          }))}
          filename="entirefm-dispatch-queue.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-mono text-xs">
          {dispatches.map((d) => (
            <div key={d.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans text-sm">{d.work_order_id} &middot; {d.site_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {d.service_name}
                  </span>
                </div>
                <p className="text-slate-600 font-sans">
                  Assigned Supplier: <strong className="text-slate-900">{d.supplier_name}</strong> &middot; Engineer: {d.assigned_operative_name || 'Unassigned'} ({d.assigned_operative_phone || '—'})
                </p>
                <span className="text-slate-400 text-[10.5px]">
                  Dispatched: {d.dispatched_at.substring(0, 16).replace('T', ' ')} &middot; Target SLA: {d.sla_target_time.substring(0, 16).replace('T', ' ')}
                </span>
              </div>

              <span className={`font-bold px-2.5 py-1 rounded text-xs self-start sm:self-auto ${
                d.status === 'ACKNOWLEDGED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {d.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
