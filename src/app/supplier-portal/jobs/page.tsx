import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { listDispatches } from '@/server/allocation/allocation-store';
import { Wrench, Clock, CheckCircle2, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalJobsPage() {
  const jobs = await listDispatches('sup-01');

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // OPERATIONAL WORK QUEUE
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Dispatched Work Orders
              </h1>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm">
              {jobs.length} ACTIVE JOBS
            </span>
          </div>

          <div className="space-y-4">
            {jobs.map((j) => (
              <div key={j.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 font-mono text-xs">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
