import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function RateCardsPage() {
  const { data: rateCards } = await dbQuery<any[]>('rate_cards?select=*&order=created_at.desc');
  const { data: items } = await dbQuery<any[]>('rate_card_items?select=*');

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Rate Cards & Pricing Governance"
        description="Hierarchical rate card resolution (Contract → Client → Provider Agreed → Framework) and out-of-hours labour models."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/policies"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] border border-[#E8E8E5] hover:text-white"
            >
              Commercial Policies →
            </Link>
          </div>
        }
      />

      {/* Rate Hierarchy Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">Tier 1: Contract-Specific</div>
          <div className="mt-1 text-[14px] font-normal text-brand-electric-bright">Overrides all rates</div>
          <p className="mt-1 text-[11px] text-[#9A9A95]">Bound to specific client contracts</p>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">Tier 2: Client Standard</div>
          <div className="mt-1 text-[14px] font-normal text-[#111111]">Client-wide agreement</div>
          <p className="mt-1 text-[11px] text-[#9A9A95]">Applies across all client estates</p>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">Tier 3: Provider Agreed</div>
          <div className="mt-1 text-[14px] font-normal text-[#111111]">Subcontractor rates</div>
          <p className="mt-1 text-[11px] text-[#9A9A95]">Pre-negotiated supplier prices</p>
        </div>

        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">Tier 4: Framework Default</div>
          <div className="mt-1 text-[14px] font-normal text-emerald-400">Baseline fall-back</div>
          <p className="mt-1 text-[11px] text-[#9A9A95]">Default standard EntireFM schedule</p>
        </div>
      </div>

      {/* Rate Cards Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">Configured Rate Schedules</h3>
        </div>

        {rateCards && rateCards.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
            <table className="w-full min-w-[60rem] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                  <th className="px-5 py-3">Schedule Name</th>
                  <th className="px-5 py-3">Scope Level</th>
                  <th className="px-5 py-3">Version</th>
                  <th className="px-5 py-3">Effective From</th>
                  <th className="px-5 py-3">Currency</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Items Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {rateCards.map((rc) => {
                  const cardItems = (items || []).filter((i) => i.rate_card_id === rc.id);
                  return (
                    <tr key={rc.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                      <td className="px-5 py-4 text-[12px] text-white font-normal">
                        {rc.name}
                      </td>
                      <td className="px-5 py-4 font-normal text-[11px]">
                        {rc.contract_id ? (
                          <span className="text-purple-400">Contract</span>
                        ) : rc.client_account_id ? (
                          <span className="text-blue-400">Client</span>
                        ) : rc.provider_org_id ? (
                          <span className="text-amber-400">Provider</span>
                        ) : (
                          <span className="text-emerald-400">Framework</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
                        v{rc.version || 1}
                      </td>
                      <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
                        {rc.effective_from ? new Date(rc.effective_from).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-5 py-4 font-normal text-[11px] text-white">
                        {rc.currency || 'GBP'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                          {rc.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-normal text-[12px] text-[#6D6D68]">
                        {cardItems.length} lines
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Rate Cards Configured"
            description="Create framework rate cards or contract-specific schedules to automate quote pricing."
            actionText="Back to Commercial"
            actionHref="/admin/commercial"
          />
        )}
      </div>
    </div>
  );
}
