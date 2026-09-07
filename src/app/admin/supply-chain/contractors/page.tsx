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
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo">
            + Onboard Contractor
          </button>
        }
      />

      {providers.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Contractor</th>
                <th className="px-5 py-3">Primary Trade</th>
                <th className="px-5 py-3">Vetting / Tier</th>
                <th className="px-5 py-3">Performance</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {providers.map((p) => (
                <tr key={p.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{p.organisation?.name}</div>
                    <div className="font-normal text-[11px] text-[#9A9A95]">
                      {p.organisation?.code}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px]">
                    {p.primary_trade || 'Multi-discipline'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-normal text-[11px] text-[#111111]">{p.tier}</div>
                    <div className="text-[11px] text-[#9A9A95]">Vetting: {p.vetting_status}</div>
                  </td>
                  <td className="px-5 py-4 text-[11px] text-emerald-400 font-normal">
                    {p.performance_score}% FTF
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
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
