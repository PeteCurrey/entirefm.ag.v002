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
            className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-carbon"
          >
            ← Command Centre
          </Link>
        }
      />

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
        <h3 className="text-sm font-normal text-white">Executive Assurance Export</h3>
        <p className="text-[12.5px] text-brand-mist/70 leading-relaxed">
          Generate client-sanitised statutory assurance reports with complete evidence lineages. Internal contractor performance rankings and commercial margin commentary are automatically excluded.
        </p>
      </div>
    </div>
  );
}
