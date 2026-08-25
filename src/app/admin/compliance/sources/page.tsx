import React from 'react';
import Link from 'next/link';
import { listComplianceSources } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ComplianceSourcesPage() {
  const sources = await listComplianceSources();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance Governance"
        title="Authoritative Source Registry"
        description="Primary legislation, statutory regulations, approved codes of practice (ACoP), British standards, and manufacturer requirements."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-carbon"
          >
            ← Command Centre
          </Link>
        }
      />

      {sources.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Source Code & Title</th>
                <th className="px-5 py-3">Source Type</th>
                <th className="px-5 py-3">Publishing Body</th>
                <th className="px-5 py-3">Jurisdiction</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {sources.map((s) => (
                <tr key={s.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4">
                    <div className="font-light text-white">{s.name}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">{s.code}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-electric">
                    {s.source_type}
                  </td>
                  <td className="px-5 py-4 text-brand-mist/70">
                    {s.publishing_body}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px]">
                    {s.jurisdiction}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-white">
                    v{s.version || '1.0'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        s.status === 'CURRENT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : s.status === 'LICENSE_REQUIRED' || s.status === 'NOT_CONFIGURED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {s.status || 'CURRENT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Sources Configured"
          description="Authoritative statutory legislation and British standards."
          actionText="Command Centre"
          actionHref="/admin/compliance"
        />
      )}
    </div>
  );
}
