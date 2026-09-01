import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientSitesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: sites } = await dbQuery<any[]>(
    `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,address_line1,city,postcode,status`
  );

  const list = sites || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Estate Sites</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Showing authorised properties for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Site Code</th>
              <th className="px-6 py-3">Site Name</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">City / Postcode</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  No sites found within current scope.
                </td>
              </tr>
            ) : (
              list.map((s) => (
                <tr key={s.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-normal text-brand-electric-bright">{s.site_code || '—'}</td>
                  <td className="px-6 py-3.5 font-normal text-white">{s.name}</td>
                  <td className="px-6 py-3.5">{s.address_line1 || '—'}</td>
                  <td className="px-6 py-3.5">{s.city || ''} {s.postcode || ''}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                      {s.status || 'ACTIVE'}
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
