import React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function ComplianceReportsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance Analytics"
        title="Compliance & Statutory Assurance Reports"
        description="Formal compliance position summaries, expiry forecasts, contractor accreditation status, and exception resolution velocity."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-white"
          >
            ← Command Centre
          </Link>
        }
      />

      <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-normal text-[#111111]">Executive Assurance Export</h3>
        <p className="text-[12.5px] text-[#6D6D68] leading-relaxed">
          Generate client-sanitised statutory assurance reports with complete evidence lineages. Internal contractor performance rankings and commercial margin commentary are automatically excluded.
        </p>
      </div>
    </div>
  );
}
