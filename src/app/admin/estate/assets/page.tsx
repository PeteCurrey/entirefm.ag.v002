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
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo">
            + Register Asset
          </button>
        }
      />

      {assets.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Asset Ref</th>
                <th className="px-5 py-3">Name / Category</th>
                <th className="px-5 py-3">Site Location</th>
                <th className="px-5 py-3">Condition / Criticality</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {assets.map((a) => (
                <tr key={a.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {a.asset_reference}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{a.name}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      {a.category} · {a.manufacturer || 'OEM'} {a.model || ''}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">{a.site?.name || '—'}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">
                      {a.site?.site_code}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-[11px]">{a.condition}</div>
                    <span className="rounded bg-brand-edge-dark px-1.5 py-0.2 font-mono text-[9px] text-brand-mist/70">
                      {a.criticality}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
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
