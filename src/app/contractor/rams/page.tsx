import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listRamsRecords } from '@/server/contractor/rams-service';
import { RamsDashboardClient } from '@/components/contractor/RamsDashboardClient';
import { ContractorDocCrossNav } from '@/components/contractor/ContractorDocCrossNav';

export const metadata: Metadata = {
  title: 'RAMS & Safety Management | EntireFM Contractor Platform',
  description: 'Digital Risk Assessments, Method Statements, and Operative Safety Briefings for Facilities Management.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorRamsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/rams');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const ramsList = await listRamsRecords(orgId, session);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <span className="text-[10.5px] uppercase tracking-widest text-brand-electric-bright font-bold">
          SAFETY OPERATIONS &bull; CP-05
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          RAMS &amp; Risk Assessment Control Centre
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-2xl">
          Create, issue, and manage job-specific Risk Assessments and Method Statements. Pre-populated from EntireFM work orders or built for your independent contracts.
        </p>
      </div>

      {/* Cross-Nav Strip */}
      <ContractorDocCrossNav currentSection="rams" />

      <RamsDashboardClient
        initialRamsList={ramsList}
        contractorOrgId={orgId}
      />
    </div>
  );
}
