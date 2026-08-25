import React from 'react';
import { MapPin, Plus, CheckCircle2, Clock } from 'lucide-react';
import { getSupplierCoverageScope } from '@/server/suppliers/store';

export const metadata = {
  title: 'Geographical Coverage & Bases | EntireFM Supplier Portal',
  description: 'Manage declared operating regions, verified EntireFM coverage authorizations, and operating depots.',
};

export default async function SupplierCoveragePage() {
  const coverage = await getSupplierCoverageScope('sup-test-01');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            GEOGRAPHICAL FOOTPRINT &amp; DISPATCH BOUNDS
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Geographical Coverage &amp; Operating Bases
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Declared coverage indicates mobile engineer range. Approved coverage represents vetted authorization for contract dispatch.
          </p>
        </div>

        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" /> Request Additional Region
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900 text-white font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Region / City Cluster</th>
                <th className="p-3.5">Declared</th>
                <th className="p-3.5">EntireFM Approval</th>
                <th className="p-3.5">Operating Base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {coverage.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-900">{c.region}</td>
                  <td className="p-3.5 font-mono text-[11px]">
                    {c.is_declared ? <span className="text-emerald-700 font-bold">YES</span> : <span className="text-slate-400">NO</span>}
                  </td>
                  <td className="p-3.5">
                    {c.approval_status === 'APPROVED' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        APPROVED
                      </span>
                    )}
                    {c.approval_status === 'UNDER_REVIEW' && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        UNDER REVIEW
                      </span>
                    )}
                    {c.approval_status === 'NOT_REQUESTED' && (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded">
                        NOT REQUESTED
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">
                    {c.operating_bases?.join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operating Bases Panel */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 font-sans text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" /> Declared Operating Bases
          </h2>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Birmingham Head Depot</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">HQ</span>
            </div>
            <p className="text-slate-600 text-[11.5px]">14 Industrial Way, Aston, Birmingham, B6 7RH</p>
            <span className="text-[10.5px] font-mono text-slate-500 block pt-1">Radius: 45 Miles (4-Hour SLA)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
