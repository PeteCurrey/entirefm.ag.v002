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
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Event Type</th>
                <th className="px-5 py-3">Actor / Source</th>
                <th className="px-5 py-3">Object</th>
                <th className="px-5 py-3">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {events.map((e) => (
                <tr key={e.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4 font-normal text-[11px] text-[#9A9A95]">
                    {new Date(e.created_at).toLocaleString('en-GB')}
                  </td>
                  <td className="px-5 py-4 font-light text-white">
                    {e.event_type}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-normal text-[11px] text-[#111111]">{e.actor_type}</span>
                    <div className="text-[11px] text-[#9A9A95]">{e.source}</div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px]">
                    {e.object_type} · {e.object_id}
                  </td>
                  <td className="px-5 py-4 font-normal text-[10px] text-[#9A9A95]">
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
