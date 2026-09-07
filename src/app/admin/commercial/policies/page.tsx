import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CommercialPoliciesPage() {
  const { data: policies } = await dbQuery<any[]>('commercial_policies?select=*&order=created_at.desc');

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Commercial Policies & Thresholds"
        description="Configure target margin floors, automatic quoting spend limits, approval workflows, and material markup rules."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/exceptions"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-amber-400 border border-amber-500/30 hover:bg-amber-500/10"
            >
              Exceptions Desk →
            </Link>
          </div>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">Active Policy Rules</h3>
        </div>

        {policies && policies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {policies.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded bg-[#F5F5F3] px-2 py-0.5 font-normal text-[10.5px] text-brand-electric-bright">
                      {p.scope_level}
                    </span>
                    <h4 className="mt-2 text-[14px] font-light text-[#111111]">{p.name}</h4>
                  </div>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded border border-[#E8E8E5] bg-[#FAFAF8] p-3 text-[11.5px] font-normal">
                  <div>
                    <span className="text-[#9A9A95] block text-[10px]">Min Margin Floor</span>
                    <span className="text-emerald-400 font-light">{p.min_margin_pct}% (Target {p.target_margin_pct}%)</span>
                  </div>
                  <div>
                    <span className="text-[#9A9A95] block text-[10px]">Quote Approval Threshold</span>
                    <span className="text-[#111111] font-normal">&gt; £{Number(p.quote_approval_threshold_gbp).toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-[#9A9A95] block text-[10px]">Material Markup</span>
                    <span className="text-[#6D6D68] font-normal">+{p.material_markup_pct}% ({p.material_markup_type})</span>
                  </div>
                  <div>
                    <span className="text-[#9A9A95] block text-[10px]">Subcontract Markup</span>
                    <span className="text-[#6D6D68] font-normal">+{p.subcontract_markup_pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Policies Configured"
            description="Create policy records to govern quote approvals and margin protection."
            actionText="Back to Commercial"
            actionHref="/admin/commercial"
          />
        )}
      </div>
    </div>
  );
}
