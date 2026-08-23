import React from 'react';
import { listProviders } from '@/server/supply-chain';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ContractorsPage() {
  const providers = await listProviders();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Supply Chain"
        title="Contractor & Supplier Network"
        description="Approved contractor registry, vetting audits, public liability insurance tracking, and performance scores."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo">
            + Onboard Contractor
          </button>
        }
      />

      {providers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Contractor</th>
                <th className="px-5 py-3">Primary Trade</th>
                <th className="px-5 py-3">Vetting / Tier</th>
                <th className="px-5 py-3">Performance</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {providers.map((p) => (
                <tr key={p.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{p.organisation?.name}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">
                      {p.organisation?.code}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px]">
                    {p.primary_trade || 'Multi-discipline'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-[11px] text-white">{p.tier}</div>
                    <div className="text-[11px] text-brand-mist/50">Vetting: {p.vetting_status}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-emerald-400 font-medium">
                    {p.performance_score}% FTF
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Contractors Onboarded"
          description="Vetted subcontractors, specialist trade partners, and engineering firms will populate here."
          actionText="Onboard First Contractor"
          actionHref="/admin/supply-chain/contractors"
        />
      )}
    </div>
  );
}
