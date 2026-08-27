import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listContractorOperatives, getContractorTrainingMatrix, CANONICAL_COMPETENCIES } from '@/server/contractor/workforce-service';
import { ContractorWorkforceClient } from '@/components/contractor/ContractorWorkforceClient';

export const metadata: Metadata = {
  title: 'Workforce & Competency Matrix | EntireFM Contractor Platform',
  description: 'Operative management, verified qualifications, trade compliance, and training matrix.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorWorkforcePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/workforce');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const [operatives, matrixData] = await Promise.all([
    listContractorOperatives(orgId, session),
    getContractorTrainingMatrix(orgId, session),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          SUPPLY CHAIN WORKFORCE INFRASTRUCTURE
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Workforce &amp; Training Matrix
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-xl">
          Manage registered field engineers, verified trade qualifications, statutory refreshers, and work eligibility.
        </p>
      </div>

      <ContractorWorkforceClient
        initialOperatives={operatives}
        initialMatrix={matrixData.matrix}
        competencies={matrixData.competencies}
        orgId={orgId}
      />
    </div>
  );
}
