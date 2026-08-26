import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { MapPin, Plus, CheckCircle2, Clock } from 'lucide-react';
import { getSupplierCoverageScope } from '@/server/suppliers/store';
import { getApplicationDraft } from '@/server/suppliers/supplier-auth-store';
import Link from 'next/link';

export const metadata = {
  title: 'Geographical Coverage & Bases | EntireFM Supplier Portal',
  description: 'Manage declared operating regions, verified EntireFM coverage authorizations, and operating depots.',
};

export default async function SupplierCoveragePage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const coverage = orgId ? await getSupplierCoverageScope(orgId) : [];
  const draft = orgId ? await getApplicationDraft(orgId) : null;

  const declaredRegions = draft?.selectedRegions || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
            GEOGRAPHICAL FOOTPRINT &amp; DISPATCH BOUNDS
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
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
          {coverage.length > 0 ? (
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Region / Area</th>
                  <th className="p-3.5">Declared</th>
                  <th className="p-3.5">EntireFM Approval</th>
                  <th className="p-3.5">Operating Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {coverage.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{c.region}</td>
                    <td className="p-3.5 text-[11px]">
                      {c.is_declared ? <span className="text-emerald-700 font-bold">YES</span> : <span className="text-slate-400">NO</span>}
                    </td>
                    <td className="p-3.5">
                      {c.approval_status === 'APPROVED' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                          APPROVED
                        </span>
                      )}
                      {c.approval_status === 'UNDER_REVIEW' && (
                        <span className="bg-amber-100 text-amber-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                          UNDER REVIEW
                        </span>
                      )}
                      {c.approval_status === 'NOT_REQUESTED' && (
                        <span className="bg-slate-100 text-slate-500 text-[10.5px] font-light px-2 py-0.5 rounded">
                          NOT REQUESTED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-600">
                      {c.operating_bases?.join(', ') || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : declaredRegions.length > 0 ? (
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Declared in Application:</span>
              <div className="flex flex-wrap gap-2">
                {declaredRegions.map((r, i) => (
                  <span key={i} className="bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-light rounded text-slate-700">
                    {r} (Pending Review)
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <MapPin className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No geographical coverage regions declared yet.</p>
              <Link href="/supplier-portal/onboarding" className="text-xs text-brand-pink font-bold hover:underline inline-block">
                Declare operating coverage in application &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Operating Bases Panel */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-4">
          <h2 className="font-light text-slate-900 font-sans text-sm pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" /> Declared Operating Address
          </h2>

          {draft?.tradingAddress ? (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1 text-xs">
              <span className="font-bold text-slate-900 block">Operating Depot / Office</span>
              <p className="text-slate-600 text-[11.5px]">{draft.tradingAddress}</p>
              <span className="text-[10.5px] font-light text-slate-500 block pt-1">
                Emergency SLA: {draft.emergencySlaHours || '4'} Hours
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              Address will be displayed once declared in your application.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
