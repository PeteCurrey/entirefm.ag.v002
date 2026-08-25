import React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function ComplianceEvidencePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance"
        title="Evidence Validation Register"
        description="Forensic document validation, SHA-256 immutability verification, location mismatch detection, and competency checks."
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
        <h3 className="text-sm font-normal text-white">Evidence Validation Engine</h3>
        <p className="text-[12.5px] text-brand-mist/70 leading-relaxed">
          Every compliance document attached to an obligation is verified for: correct site location, competent engineer accreditation, unexpired statutory period, and pass/fail inspection criteria.
        </p>
      </div>
    </div>
  );
}
