import React from 'react';
import { listAssets } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const assets = await listAssets();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Asset Registry"
        description="Canonical asset database tracking mechanical, electrical, and statutory systems with QR/NFC identifiers."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/admin/estate/assets/intelligence"
              className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-[#6D6D68] hover:bg-white hover:text-white"
            >
              Asset Intelligence & Lifecycle
            </a>
            <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo">
              + Register Asset
            </button>
          </div>
        }
      />

      {assets.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Asset Ref</th>
                <th className="px-5 py-3">Name / Category</th>
                <th className="px-5 py-3">Site Location</th>
                <th className="px-5 py-3">Condition / Criticality</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {assets.map((a) => (
                <tr key={a.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">
                    {a.asset_reference}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{a.name}</div>
                    <div className="text-[11.5px] text-[#9A9A95]">
                      {a.category} · {a.manufacturer || 'OEM'} {a.model_number || ''}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-normal text-[#111111]">{a.site?.name || '—'}</div>
                    <div className="font-normal text-[11px] text-[#9A9A95]">
                      {a.site?.site_code}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-normal text-[11px]">{a.condition}</div>
                    <span className="rounded bg-[#F5F5F3] px-1.5 py-0.2 font-normal text-[9px] text-[#6D6D68]">
                      {a.criticality}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Asset Registry Empty"
          description="Register building plant, boilers, chillers, distribution boards, and statutory fire/water equipment to manage lifecycle and planned maintenance."
          actionText="Register First Asset"
          actionHref="/admin/estate/assets"
        />
      )}
    </div>
  );
}
