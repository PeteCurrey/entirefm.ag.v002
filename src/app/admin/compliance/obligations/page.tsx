import React from 'react';
import { listComplianceObligations } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ComplianceObligationsPage() {
  const obligations = await listComplianceObligations();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance"
        title="Statutory Obligations & PPM Duties"
        description="Versioned legal standards, recurring inspection duties, water hygiene, fire alarm, gas safety, and electrical testing schedules."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo">
            + Add Obligation
          </button>
        }
      />

      {obligations.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Site / Asset</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Last Performed</th>
                <th className="px-5 py-3">Next Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {obligations.map((ob) => (
                <tr key={ob.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{ob.site?.name}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      Asset: {ob.asset?.name || 'Site-wide duty'}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px]">
                    Every {ob.frequency_days} days
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                    {ob.last_performed_at || 'Never'}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {ob.next_due_at}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        ob.status === 'COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {ob.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Compliance Obligations Configured"
          description="Link statutory guidance and inspection frequencies (Gas Safety, Legionella, EICR, Fire Alarm testing) to estates."
          actionText="Configure Initial Statutory Duty"
          actionHref="/admin/compliance/obligations"
        />
      )}
    </div>
  );
}
