import React from 'react';
import Link from 'next/link';
import { listComplianceRules } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ComplianceRulesPage() {
  const rules = await listComplianceRules();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance Governance"
        title="Compliance Rule Catalog & Version History"
        description="Immutable versioned operational inspection rules derived from statutory sources."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-white"
          >
            ← Command Centre
          </Link>
        }
      />

      {rules.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Rule Code & Title</th>
                <th className="px-5 py-3">Rule Family</th>
                <th className="px-5 py-3">Source Reference</th>
                <th className="px-5 py-3">Statutory Level</th>
                <th className="px-5 py-3">Default Responsibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {rules.map((r) => (
                <tr key={r.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{r.title}</div>
                    <div className="font-normal text-[11px] text-[#9A9A95]">{r.code}</div>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-electric">
                    {r.rule_family || r.category}
                  </td>
                  <td className="px-5 py-4 text-[#6D6D68]">
                    {r.source?.name || 'Statutory Source'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-rose-500/10 px-2 py-0.5 font-normal text-[10px] text-rose-300">
                      {r.statutory_level}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-white">
                    {r.default_responsibility || 'ENTIREFM'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Rules Configured"
          description="Compliance rules define operational frequencies and evidence standards."
          actionText="Command Centre"
          actionHref="/admin/compliance"
        />
      )}
    </div>
  );
}
