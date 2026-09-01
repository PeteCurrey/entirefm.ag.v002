import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getContractorPerformanceMetrics } from '@/server/contractor/performance-service';
import { ContractorPerformanceClient } from '@/components/contractor/ContractorPerformanceClient';

export const metadata: Metadata = {
  title: 'Business & Network Performance | EntireFM Contractor Business Toolkit',
  description: 'EntireFM Network SLA KPIs and independent My Business revenue analytics for contractor operators.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ContractorPerformancePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/performance');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const metrics = await getContractorPerformanceMetrics(session.orgId, session);

  return <ContractorPerformanceClient metrics={metrics} />;
}
