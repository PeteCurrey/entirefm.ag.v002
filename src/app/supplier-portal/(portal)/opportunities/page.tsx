import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listSupplierOpportunities } from '@/server/allocation/allocation-store';
import { Send, Clock, MapPin, Building2, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalOpportunitiesPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const opps = orgId ? await listSupplierOpportunities(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
            ENTIRECAFM // WORK OPPORTUNITIES
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Live Work Opportunities
          </h1>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-900 text-white rounded-sm self-start sm:self-auto">
          {opps.length} ACTIVE OPPORTUNITIES
        </span>
      </div>

      {opps.length > 0 ? (
        <div className="space-y-4">
          {opps.map((o) => (
            <div key={o.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 font-sans text-base">{o.title}</h3>
                  <span className="text-slate-400 text-[11px]">Type: {o.opportunity_type.replace(/_/g, ' ')} &middot; Priority: {o.priority}</span>
                </div>
                <span className="text-emerald-800 bg-emerald-100 font-bold px-2.5 py-1 rounded text-xs self-start sm:self-auto">
                  {o.status}
                </span>
              </div>

              <p className="text-slate-700 font-sans text-xs leading-relaxed">{o.scope_summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 bg-slate-50 p-3 rounded">
                <div>Location: <strong>{o.site_city}</strong></div>
                <div>Commercial Basis: <strong>{o.commercial_basis}</strong></div>
                <div>NTE Value: <strong>£{o.not_to_exceed_gbp || '—'}</strong></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button className="btn-primary text-xs py-1.5 px-4 font-sans">
                  View Scope &amp; Respond &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-sm space-y-2">
          <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-800">No open project opportunities</p>
          <p className="text-slate-500 text-[11.5px]">Regional subcontract tenders, scheduled PPM renewals, and quoted work requests will appear here for your review and bidding.</p>
        </div>
      )}
    </div>
  );
}
