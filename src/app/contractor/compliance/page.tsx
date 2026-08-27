import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { evaluateContractorCompliance } from '@/server/contractor/compliance-engine';
import { ComplianceCentreClient } from '@/components/contractor/ComplianceCentreClient';

export const metadata: Metadata = {
  title: 'Compliance Control Centre | EntireFM Contractor Platform',
  description: 'Proactive statutory compliance monitoring, document verification, and operational eligibility controls.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorCompliancePage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/contractor/compliance');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const complianceSummary = await evaluateContractorCompliance(orgId, session);

  return (
    <div className="space-y-6">
      <ComplianceCentreClient initialSummary={complianceSummary} orgId={orgId} />
    </div>
  );
}
