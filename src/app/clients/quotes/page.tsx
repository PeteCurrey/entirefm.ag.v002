import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientQuotesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: quotes } = await dbQuery<any[]>(
    `quotes?select=id,quote_number,title,total_price_gbp,status,created_at&order=created_at.desc&limit=50`
  );

  const list = quotes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Quotes & Approvals</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Proposals, extra works authorizations, and rate approvals for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Quote Ref</th>
              <th className="px-6 py-3">Title / Scope</th>
              <th className="px-6 py-3">Total Value</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-mist/40">
                  No active quotations awaiting action.
                </td>
              </tr>
            ) : (
              list.map((q) => (
                <tr key={q.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-brand-electric-bright">{q.quote_number}</td>
                  <td className="px-6 py-3.5 font-medium text-white">{q.title}</td>
                  <td className="px-6 py-3.5 font-mono">£{Number(q.total_price_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
