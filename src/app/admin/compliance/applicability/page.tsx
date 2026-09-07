import React from 'react';
import Link from 'next/link';
import { listApplicabilityAssessments } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function ComplianceApplicabilityPage() {
  const assessments = await listApplicabilityAssessments();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance Engine"
        title="Estate Applicability Assessments"
        description="Deterministic evaluation of which statutory rules apply to specific sites, buildings, and systems with full audit provenance."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-white"
          >
            ← Command Centre
          </Link>
        }
      />

      <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-normal text-[#111111]">Applicability Logic & Provenance</h3>
        <p className="text-[12.5px] text-[#6D6D68] leading-relaxed">
          The Applicability Engine evaluates building usage, jurisdiction, installed systems, and statutory duty holders. If facts are missing, the assessment outputs <span className="font-normal text-amber-300">REVIEW_REQUIRED</span> rather than assuming compliance.
        </p>
      </div>
    </div>
  );
}
