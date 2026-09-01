import React from 'react';
import Link from 'next/link';
import { listSupplierTargets } from '@/server/suppliers/store';
import { UserPlus, ArrowUpRight } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function TargetPartnersPage() {
  const targets = await listSupplierTargets();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
            PROACTIVE PROCUREMENT RECRUITMENT
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Target Partners Board
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Track high-calibre specialist contractors, regional SMEs, and OEMs EntireFM is actively recruiting into the network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CsvExportButton
            data={targets.map((t) => ({
              id: t.id,
              company_name: t.company_name,
              priority: t.priority,
              status: t.target_status,
              services: t.services.join('; '),
              geography: t.geography.join('; '),
              rationale: t.strategic_rationale.join('; '),
              owner: t.owner,
              next_action: t.next_action || '',
            }))}
            filename="entirefm-target-partners.csv"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-normal uppercase text-[10.5px]">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Target Company</th>
                <th className="py-3 px-4">Services</th>
                <th className="py-3 px-4">Geography</th>
                <th className="py-3 px-4">Strategic Rationale</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {targets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-light px-2 py-0.5 rounded ${
                      t.priority === 'CRITICAL' ? 'bg-rose-600 text-white' : t.priority === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-light text-slate-900">{t.company_name}</div>
                    {t.website_url && (
                      <a href={t.website_url} target="_blank" rel="noopener noreferrer" className="text-[10.5px] font-normal text-slate-400 hover:text-brand-pink underline inline-flex items-center gap-0.5">
                        {t.website_url.replace(/^https?:\/\//, '')} <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-4 font-normal text-slate-700">
                    {t.services.join(', ')}
                  </td>
                  <td className="py-3 px-4 font-normal text-slate-700">
                    {t.geography.join(', ')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {t.strategic_rationale.map((r, idx) => (
                        <span key={idx} className="text-[9.5px] font-normal bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {r.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-[10.5px] font-light px-2 py-0.5 rounded bg-slate-900 text-white">
                      {t.target_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-normal text-slate-600">
                    {t.owner}
                  </td>
                  <td className="py-3 px-4 text-slate-600 italic max-w-xs">
                    {t.next_action || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
