import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientWorkOrdersPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: wos } = await dbQuery<any[]>(
    `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,work_order_number,title,priority,status,created_at,site:sites(name)&order=created_at.desc&limit=50`
  );

  const list = wos || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Work Orders</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Reactive tickets and maintenance jobs for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">WO Number</th>
              <th className="px-6 py-3">Title / Description</th>
              <th className="px-6 py-3">Site Location</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  No work orders found in authorised scope.
                </td>
              </tr>
            ) : (
              list.map((wo) => (
                <tr key={wo.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-brand-electric-bright">{wo.work_order_number}</td>
                  <td className="px-6 py-3.5 font-medium text-white">{wo.title}</td>
                  <td className="px-6 py-3.5">{wo.site?.name || '—'}</td>
                  <td className="px-6 py-3.5 font-mono text-[11px]">{wo.priority}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                      {wo.status}
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
