import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientAssetsPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: assets } = await dbQuery<any[]>(
    `assets?select=id,asset_reference,name,category,manufacturer,model_number,status,site:sites(name,site_code)${siteFilter}&limit=50`
  );

  const list = assets || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Asset Register</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Maintained plant, equipment, and building systems for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Asset Ref</th>
              <th className="px-6 py-3">Asset Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Site Location</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  No assets found in authorised scope.
                </td>
              </tr>
            ) : (
              list.map((a) => (
                <tr key={a.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-brand-electric-bright">{a.asset_reference || '—'}</td>
                  <td className="px-6 py-3.5 font-normal text-white">{a.name}</td>
                  <td className="px-6 py-3.5">{a.category || 'General'}</td>
                  <td className="px-6 py-3.5">{a.site?.name || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      {a.status || 'OPERATIONAL'}
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
