import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { Wrench, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getSupplierServicesScope } from '@/server/suppliers/store';

export const metadata = {
  title: 'Approved Services & Trade Capabilities | EntireFM Supplier Portal',
  description: 'View your declared services and authorized EntireFM technical approvals.',
};

export default async function SupplierServicesScopePage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? 'no-org';
  const services = await getSupplierServicesScope(orgId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
            SERVICE TAXONOMY &amp; AUTHORISATION SCOPE
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
            Services &amp; Technical Capabilities
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Declared services describe what you can deliver. Approved services represent verified technical authorisation for work dispatch.
          </p>
        </div>

        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" /> Request Additional Service
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Service Discipline</th>
              <th className="p-3.5">Declared</th>
              <th className="p-3.5">EntireFM Approval</th>
              <th className="p-3.5">Approved Regions</th>
              <th className="p-3.5">Restrictions &amp; Accreditations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {services.map((s) => (
              <tr key={s.slug} className="hover:bg-slate-50/50">
                <td className="p-3.5">
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  {s.capability_notes && (
                    <span className="text-[11px] text-slate-500 block mt-0.5">{s.capability_notes}</span>
                  )}
                </td>
                <td className="p-3.5 text-[11px]">
                  {s.is_declared ? (
                    <span className="text-emerald-700 font-bold">YES</span>
                  ) : (
                    <span className="text-slate-400">NO</span>
                  )}
                </td>
                <td className="p-3.5">
                  {s.approval_status === 'APPROVED' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                      APPROVED
                    </span>
                  )}
                  {s.approval_status === 'UNDER_REVIEW' && (
                    <span className="bg-amber-100 text-amber-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                      UNDER REVIEW
                    </span>
                  )}
                  {s.approval_status === 'NOT_REQUESTED' && (
                    <span className="bg-slate-100 text-slate-500 text-[10.5px] font-light px-2 py-0.5 rounded">
                      NOT REQUESTED
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-[11px] text-slate-700">
                  {s.approved_geographies?.join(', ') || '—'}
                </td>
                <td className="p-3.5 text-[11px]">
                  {s.restrictions && s.restrictions.length > 0 ? (
                    <span className="text-amber-800 font-medium block">
                      Restriction: {s.restrictions.join('; ')}
                    </span>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                  {s.required_accreditations && (
                    <span className="text-slate-400 font-light text-[10px] block mt-0.5">
                      Req: {s.required_accreditations.join(', ')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
