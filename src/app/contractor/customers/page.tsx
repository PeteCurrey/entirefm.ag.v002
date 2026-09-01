import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { listContractorClients, listContractorIndependentJobs } from '@/server/contractor/independent-job-service';
import { ContractorCustomersClient } from '@/components/contractor/ContractorCustomersClient';

export const metadata: Metadata = {
  title: 'My Customers & Jobs — Contractor Business Toolkit | EntireFM',
  description: 'Manage independent private customers, sites, and jobs.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ContractorCustomersPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/contractor/customers');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const [clients, jobs] = await Promise.all([
    listContractorClients(session.orgId, session),
    listContractorIndependentJobs(session.orgId, session),
  ]);

  return (
    <ContractorCustomersClient
      initialClients={clients}
      initialJobs={jobs}
      contractorOrgId={session.orgId}
    />
  );
}
