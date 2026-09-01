import React from 'react';
import { listAuditEvents } from '@/server/audit';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage() {
  const events = await listAuditEvents(100);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Platform"
        title="Immutable Audit Ledger"
        description="Tamper-evident record of all user, system, and AI operations with exact state diffs and correlation IDs."
      />

      {events.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Actor / Source</th>
                <th className="px-5 py-3">Object</th>
                <th className="px-5 py-3">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {events.map((e) => (
                <tr key={e.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/50">
                    {new Date(e.created_at).toLocaleString('en-GB')}
                  </td>
                  <td className="px-5 py-4 font-light text-white">
                    {e.event_type}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-normal text-[11px] text-white">{e.actor_type}</span>
                    <div className="text-[11px] text-brand-mist/50">{e.source}</div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px]">
                    {e.object_type} · {e.object_id}
                  </td>
                  <td className="px-5 py-4 font-normal text-[10px] text-brand-mist/40">
                    {e.correlation_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Audit Ledger Initialized"
          description="Every state change across work orders, assets, quotes, and identity access will be recorded immutably."
        />
      )}
    </div>
  );
}
