import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function VariationOrdersPage() {
  const { data: variations } = await dbQuery<any[]>(
    'variation_orders?select=*&order=created_at.desc'
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title="Variation Orders Desk"
        description="Scope variations and extra works approved after initial quotation, preserving baseline quote integrity."
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/quotes"
              className="rounded bg-white px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] border border-[#E8E8E5] hover:text-white"
            >
              ← Back to Quotes
            </Link>
          </div>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#6D6D68]">
            Recorded Variation Orders ({variations?.length || 0})
          </h3>
        </div>

        {variations && variations.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
            <table className="w-full min-w-[60rem] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                  <th className="px-5 py-3">Variation Ref</th>
                  <th className="px-5 py-3">Scope Description</th>
                  <th className="px-5 py-3">Expected Cost</th>
                  <th className="px-5 py-3">Sell Price</th>
                  <th className="px-5 py-3">Margin</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {variations.map((v) => (
                  <tr key={v.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4 text-[11px] text-white font-light">
                      {v.variation_number}
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-[12.5px] text-[#6D6D68]">
                      {v.scope_description}
                    </td>
                    <td className="px-5 py-4 font-normal text-[12px] text-[#6D6D68]">
                      £{Number(v.expected_cost_gbp || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-white font-normal">
                      £{Number(v.sell_price_gbp || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11.5px] text-emerald-400">
                      £{Number(v.margin_gbp || 0).toFixed(2)} ({v.margin_pct}%)
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-brand-electric/15 px-2 py-0.5 font-normal text-[10px] text-brand-electric-bright">
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-normal text-[11px] text-[#9A9A95]">
                      {new Date(v.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Variations Recorded"
            description="When additional works or scope changes are required on active jobs, variations are tracked here."
            actionText="View Active Quotes"
            actionHref="/admin/commercial/quotes"
          />
        )}
      </div>
    </div>
  );
}
