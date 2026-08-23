import React from 'react';
import { listQuotes } from '@/server/commercial';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function QuotesPage() {
  const quotes = await listQuotes();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Quotes & Client Proposals"
        description="Quoted remedial works, capex proposals, client sign-off records, and margin tracking."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo">
            + Draft Quote
          </button>
        }
      />

      {quotes.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Quote Number</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Total (GBP)</th>
                <th className="px-5 py-3">Valid Until</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {quotes.map((q) => (
                <tr key={q.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {q.quote_number}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                    {q.submitted_at ? new Date(q.submitted_at).toLocaleDateString('en-GB') : 'Draft'}
                  </td>
                  <td className="px-5 py-4 font-mono text-[12px] text-white font-medium">
                    £{Number(q.total_amount_gbp).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                    {q.valid_until || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Quotes Issued"
          description="Draft proposals for remedial works, planned replacement projects, and client approvals."
          actionText="Create Initial Quote"
          actionHref="/admin/commercial/quotes"
        />
      )}
    </div>
  );
}
