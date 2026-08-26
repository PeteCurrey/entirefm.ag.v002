import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listDispatches } from '@/server/allocation/allocation-store';
import { Wrench, Clock, CheckCircle2, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalJobsPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const jobs = orgId ? await listDispatches(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-light uppercase tracking-wider text-slate-400">
            ENTIRECAFM // OPERATIONAL WORK QUEUE
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
            Dispatched Work Orders
          </h1>
        </div>

        <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm self-start sm:self-auto">
          {jobs.length} ACTIVE JOBS
        </span>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 text-xs font-light">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 font-sans text-base">{j.work_order_id} &middot; {j.site_name}</h3>
                  <span className="text-slate-400 text-[11px]">{j.service_name} &middot; {j.site_city}</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 font-bold px-2.5 py-1 rounded text-xs self-start sm:self-auto">
                  {j.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-600 bg-slate-50 p-3 rounded font-sans">
                <div>Assigned Engineer: <strong>{j.assigned_operative_name || 'Unassigned'}</strong> ({j.assigned_operative_phone || '—'})</div>
                <div>Target Attendance SLA: <strong>{j.sla_target_time.substring(0, 16).replace('T', ' ')}</strong></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button className="btn-primary text-xs py-1.5 px-4 font-sans">
                  Job Actions &amp; Upload Evidence &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-sm space-y-2">
          <Wrench className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-800">No active dispatched work orders</p>
          <p className="text-slate-500 text-[11.5px]">When EntireFM allocates reactive or planned maintenance jobs to your organisation, they will appear in this queue.</p>
        </div>
      )}
    </div>
  );
}
