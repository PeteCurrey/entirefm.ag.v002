import React from 'react';
import Link from 'next/link';
import { listExtendedLeads } from '@/server/growth/store';
import { UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InboundApplicationsPage() {
  const leadsRes = await listExtendedLeads({});
  const applications = (leadsRes?.leads || []).filter(
    (l: any) => l.pageType === 'supplier-application' || l.source === 'SUPPLIER_APPLICATION'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          PUBLIC INTAKE QUEUE
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Qualification Applications
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Inbound submissions from the public `/suppliers/apply` portal, queued for Stage 1 due diligence review.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-light">
            No active supplier qualification applications in queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {applications.map((app) => (
              <div key={app.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10.5px] font-mono text-brand-pink font-bold">
                      {app.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.company || app.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-white font-medium self-start sm:self-auto">
                    STATUS: {app.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {app.service}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Contact: {app.name} ({app.email})</span>
                    <span>Location: {app.location || 'UK'}</span>
                  </div>
                  <button className="btn-primary text-xs py-1.5 px-3">
                    Convert to Active Supplier Profile &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
