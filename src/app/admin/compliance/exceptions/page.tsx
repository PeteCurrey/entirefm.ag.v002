import React from 'react';
import Link from 'next/link';
import { listComplianceExceptions } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ComplianceExceptionsPage() {
  const exceptions = await listComplianceExceptions();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance"
        title="Compliance Exceptions & Remediation Queue"
        description="First-class tracking of statutory breaches, failed inspections, missing evidence, and authorized risk acceptances."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-brand-carbon"
          >
            ← Command Centre
          </Link>
        }
      />

      {exceptions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Site / Scope</th>
                <th className="px-5 py-3">Exception Type & Reason</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">State</th>
                <th className="px-5 py-3">Remediation Due</th>
                <th className="px-5 py-3">Opened At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {exceptions.map((exc) => (
                <tr key={exc.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{exc.site?.name || 'Site'}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      {exc.asset?.name || 'System Level Exception'}
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-medium text-white">{exc.exception_type}</div>
                    <div className="text-[11.5px] text-brand-mist/60 line-clamp-2">{exc.reason}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        exc.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300'
                          : exc.severity === 'MAJOR'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {exc.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-electric">
                    {exc.state || 'OPEN'}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    {exc.remediation_due_date || 'TBD'}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                    {new Date(exc.opened_at || exc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Open Compliance Exceptions"
          description="All statutory duties and inspection requirements have satisfactory evidence."
          actionText="Command Centre"
          actionHref="/admin/compliance"
        />
      )}
    </div>
  );
}
