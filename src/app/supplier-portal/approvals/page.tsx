import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupplierRelationshipOverview, getSupplierServicesScope } from '@/server/suppliers/store';

export const metadata = {
  title: 'Authorised Scope & Restrictions | EntireFM Supplier Portal',
  description: 'View specific trade approvals, regional boundaries, and active operational restrictions.',
};

export default async function SupplierApprovalsPage() {
  const rel = await getSupplierRelationshipOverview('sup-test-01');
  const services = await getSupplierServicesScope('sup-test-01');
  const approvedServices = services.filter((s) => s.approval_status === 'APPROVED');

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          AUTHORISED WORK SCOPE &amp; BOUNDARIES
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          EntireFM Approvals &amp; Restrictions
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Detailed summary of your organisation&apos;s authorized scope for work allocation.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">OVERALL ASSURANCE</span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">APPROVED SUPPLIER</h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2.5 py-1 rounded font-bold self-start sm:self-auto">
            EFFECTIVE {rel.assurance_effective_date}
          </span>
        </div>

        <div className="space-y-4 text-xs font-sans">
          <span className="font-bold text-slate-900 block text-sm">Approved Service Disciplines</span>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded">
            {approvedServices.map((s) => (
              <div key={s.slug} className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                  <span className="text-emerald-700 font-mono font-bold text-[10px]">APPROVED</span>
                </div>
                <span className="text-slate-500 text-[11px] block">
                  Geographies: {s.approved_geographies?.join(', ')}
                </span>
                {s.restrictions && s.restrictions.length > 0 && (
                  <span className="text-amber-800 text-[11px] font-medium block">
                    Restrictions: {s.restrictions.join('; ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
