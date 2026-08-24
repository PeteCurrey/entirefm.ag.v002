import React from 'react';
import Link from 'next/link';
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
        title="Statutory Obligations & Duty Register"
        description="Versioned legal standards, recurring inspection duties, water hygiene, fire alarm, gas safety, and electrical testing schedules."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-brand-carbon"
          >
            ← Command Centre
          </Link>
        }
      />

      {obligations.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Site / Scope</th>
                <th className="px-5 py-3">Statutory Rule / Version</th>
                <th className="px-5 py-3">Responsible Party</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Next Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {obligations.map((ob) => (
                <tr key={ob.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{ob.site?.name || 'Site'}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      Asset: {ob.asset?.name || 'System / Building wide duty'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">{ob.rule_version?.rule?.title || 'Statutory Standard'}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">
                      {ob.rule_version?.rule?.code || 'RULE-001'} (v{ob.rule_version?.version_number || '1'})
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-[11.5px] text-brand-electric">
                      {ob.responsible_party || 'ENTIREFM'}
                    </span>
                    <div className="text-[10.5px] text-brand-mist/40">
                      {ob.entirefm_contracted ? 'EntireFM Contracted' : 'Client Retained'}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px]">
                    Every {ob.frequency_days} days
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {ob.next_due_at}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        ob.status === 'COMPLIANT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ob.status === 'OVERDUE'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
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
          description="Statutory duties and recurring inspection schedules are established via applicability assessments."
          actionText="Run Applicability Assessment"
          actionHref="/admin/compliance/applicability"
        />
      )}
    </div>
  );
}
