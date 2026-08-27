import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listJobPacks } from '@/server/contractor/job-pack-engine';
import { JobPacksDashboardClient } from '@/components/contractor/JobPacksDashboardClient';

export const metadata: Metadata = {
  title: 'Job Packs & Work Readiness | EntireFM Contractor Platform',
  description: 'Pre-attendance safety governance, verified operative competency, RAMS, and site instructions.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorJobPacksPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/job-packs');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const jobPacks = await listJobPacks(orgId, session);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          OPERATIONAL READINESS &bull; CP-06
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Job Packs &amp; Work-Ready Control Centre
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-2xl">
          Unified pre-attendance packs combining work order details, verified operative competencies, approved RAMS, site instructions, and digital briefings.
        </p>
      </div>

      <JobPacksDashboardClient
        initialJobPacks={jobPacks}
        contractorOrgId={orgId}
      />
    </div>
  );
}
