import React from 'react';
import Link from 'next/link';
import { listQuotes } from '@/server/commercial';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const quotes = await listQuotes(status);

  const tabs = [
    { label: 'All Quotes', value: undefined },
    { label: 'Draft / Scope', value: 'DRAFT' },
    { label: 'Internal Review', value: 'INTERNAL_REVIEW' },
    { label: 'Ready to Issue', value: 'READY_TO_ISSUE' },
    { label: 'Issued to Client', value: 'ISSUED' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Quotes & Authorisations Desk"
        description="Authoritative quoting engine, rate card governance, client approvals, and margin intelligence."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/talk-to-quote"
              className="rounded bg-brand-electric/15 px-3.5 py-1.5 text-[12.5px] font-normal text-brand-electric-bright border border-brand-electric/30 hover:bg-brand-electric/25"
            >
              🎤 Talk-to-Quote Desk
            </Link>
            <Link
              href="/admin/commercial/wip"
              className="rounded bg-brand-carbon px-3.5 py-1.5 text-[12.5px] font-normal text-white border border-brand-edge-dark hover:bg-brand-edge-dark"
            >
              📊 Commercial WIP
            </Link>
          </div>
        }
      />

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-brand-edge-dark pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = status === tab.value || (!status && !tab.value);
          const href = tab.value ? `/admin/commercial/quotes?status=${tab.value}` : '/admin/commercial/quotes';
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded px-3 py-1 text-[12px] font-normal transition-colors ${
                isActive
                  ? 'bg-brand-electric text-white'
                  : 'text-brand-mist/60 hover:text-white hover:bg-brand-carbon/60'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {quotes.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[70rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Quote Ref</th>
                <th className="px-5 py-3">Ver</th>
                <th className="px-5 py-3">Description / Scope</th>
                <th className="px-5 py-3">Total (GBP)</th>
                <th className="px-5 py-3">Expected Margin</th>
                <th className="px-5 py-3">Client PO</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {quotes.map((q) => {
                const marginPct = q.expected_margin_pct ?? 0;
                const isHealthyMargin = marginPct >= 20;

                return (
                  <tr key={q.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 text-[11px] text-white font-light">
                      {q.quote_number}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/50">
                      v{q.version || 1}
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-[12px] text-brand-mist/90">
                      {q.scope_description || 'Standard remedial quote'}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-white font-normal">
                      £{Number(q.total_amount_gbp || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11.5px]">
                      {q.expected_margin_gbp !== undefined ? (
                        <span className={isHealthyMargin ? 'text-emerald-400' : 'text-amber-400'}>
                          £{Number(q.expected_margin_gbp).toFixed(2)} ({marginPct}%)
                        </span>
                      ) : (
                        <span className="text-brand-mist/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11px]">
                      {q.client_po_ref ? (
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-normal">
                          {q.client_po_ref}
                        </span>
                      ) : q.client_po_required ? (
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-400 text-[10px]">
                          PO Required
                        </span>
                      ) : (
                        <span className="text-brand-mist/30">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-normal ${
                          q.status === 'APPROVED' || (q.internal_status as string) === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : q.status === 'REJECTED' || (q.internal_status as string) === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : q.status === 'ISSUED' || (q.internal_status as string) === 'ISSUED'
                            ? 'bg-blue-500/20 text-blue-300'
                            : q.internal_status === 'READY_TO_ISSUE'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-brand-electric/20 text-brand-electric-bright'
                        }`}
                      >
                        {q.internal_status || q.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/commercial/quotes/${q.id}`}
                        className="rounded bg-brand-edge-dark/80 px-2.5 py-1 font-normal text-[11px] text-brand-mist/80 hover:text-white hover:bg-brand-electric"
                      >
                        View & Manage →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Quotes Found"
          description="Create draft proposals from Talk-to-Quote field captures or initiate a new client quote."
          actionText="Open Talk-to-Quote"
          actionHref="/admin/commercial/talk-to-quote"
        />
      )}
    </div>
  );
}
