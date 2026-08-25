import React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function ComplianceAuditsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Assurance"
        title="Audit Readiness & Immutable Evidence Packs"
        description="Point-in-time statutory compliance snapshots, evidence chain verification, and external auditor documentation packages."
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
        <h3 className="text-sm font-normal text-white">Generate Audit Evidence Pack</h3>
        <p className="text-[12.5px] text-brand-mist/70 leading-relaxed">
          Create a point-in-time statutory evidence package for client portfolios or specific buildings. Generates a structured evidence index with SHA-256 checksums, uncompromised by future updates.
        </p>
      </div>
    </div>
  );
}
