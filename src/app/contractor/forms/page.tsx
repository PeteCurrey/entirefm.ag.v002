import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listSubmittedForms } from '@/server/contractor/digital-forms-engine';
import { DigitalFormsClient } from '@/components/contractor/DigitalFormsClient';

export const metadata: Metadata = {
  title: 'Digital Forms & Field Records | EntireFM Contractor Platform',
  description: 'Digital service reports, variation requests, defect notifications, and pre-use safety inspections.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorFormsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/forms');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const forms = await listSubmittedForms(orgId, session);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10.5px] uppercase tracking-widest text-brand-electric-bright font-bold">
          DIGITAL FORMS &bull; CP-07
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Field Forms &amp; Execution Records
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-2xl">
          Submit digital service reports, request commercial scope variations, log asset defects, and record mandatory plant pre-use inspections.
        </p>
      </div>

      <DigitalFormsClient
        initialForms={forms}
        contractorOrgId={orgId}
      />
    </div>
  );
}
