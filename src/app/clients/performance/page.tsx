import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { getEstatePerformanceAnalytics } from '@/server/analytics/estate-performance-service';
import { EstatePerformanceClient } from '@/components/analytics/EstatePerformanceClient';

export const metadata: Metadata = {
  title: 'Estate Performance & Monthly Analytics — EntireFM Client Portal',
  description: 'Executive monthly estate performance reporting, SLA compliance, and spend analytics.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientPerformancePage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/clients/performance');
  }

  const report = await getEstatePerformanceAnalytics(session, 'THIS_MONTH');

  return (
    <EstatePerformanceClient
      initialReport={report}
      sessionUser={{
        id: session.personId || '',
        name: session.name,
        role: session.role,
        orgName: session.orgName,
      }}
    />
  );
}
