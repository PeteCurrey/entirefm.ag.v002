import React from 'react';
import Link from 'next/link';
import { listSupplierOpportunities } from '@/server/allocation/allocation-store';
import { Send, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesManagerPage() {
  const opps = await listSupplierOpportunities();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            SUPPLIER OPPORTUNITIES &amp; RFQ-LITE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Supplier Opportunities &amp; Quote Requests
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Direct offers, multi-supplier quote requests, and emergency cascades with staged confidentiality.
          </p>
        </div>

        <CsvExportButton
          data={opps.map((o) => ({
            id: o.id,
            title: o.title,
            type: o.opportunity_type,
            status: o.status,
            city: o.site_city,
            priority: o.priority,
            deadline: o.response_deadline,
          }))}
          filename="entirefm-supplier-opportunities.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="divide-y divide-slate-100 font-normal text-xs">
          {opps.map((o) => (
            <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans text-sm">{o.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {o.opportunity_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-slate-600 font-sans">{o.scope_summary}</p>
                <span className="text-slate-400 text-[10.5px]">
                  City: {o.site_city} &middot; Basis: {o.commercial_basis} &middot; NTE: £{o.not_to_exceed_gbp || '—'} &middot; Deadline: {o.response_deadline.substring(0, 16).replace('T', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-800 bg-emerald-100 font-bold px-2.5 py-1 rounded text-xs">
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
