import React from 'react';
import Link from 'next/link';
import { listSupplierOpportunities } from '@/server/allocation/allocation-store';
import { Send, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { OpportunitiesAdminTable } from '@/components/admin/allocation/OpportunitiesAdminTable';
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
        <OpportunitiesAdminTable initialOpportunities={opps} />
      </div>
    </div>
  );
}
