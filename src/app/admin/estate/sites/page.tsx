import React from 'react';
import { listSites } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const sites = await listSites();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Managed Sites"
        description="Comprehensive property and facility portfolio registry with geographical coordinates and access protocols."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo">
            + Add New Site
          </button>
        }
      />

      {sites.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Site Code</th>
                <th className="px-5 py-3">Name / Organisation</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {sites.map((s) => (
                <tr key={s.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {s.site_code}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      {s.organisation?.name || 'EntireFM Core'}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-mist/70">
                    {s.address_line1}, {s.city} {s.postcode}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Sites Created"
          description="Create client sites to anchor buildings, floor zones, spaces, assets, and service contracts."
          actionText="Add First Site"
          actionHref="/admin/estate/sites"
        />
      )}
    </div>
  );
}
