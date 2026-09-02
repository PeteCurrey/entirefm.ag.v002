import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { getLiveTriageWorkOrders } from '@/server/work/triage-service';
import { LiveWorkOrderTriageClient } from '@/components/work-orders/LiveWorkOrderTriageClient';

export const metadata: Metadata = {
  title: 'Jobs & Maintenance Requests — EntireFM Client Portal',
  description: 'Track reactive maintenance requests, scheduled attendances, and job completion across your managed properties.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientWorkOrdersPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const workOrders = await getLiveTriageWorkOrders(session);

  return (
    <LiveWorkOrderTriageClient
      initialWorkOrders={workOrders}
      orgName={session.orgName}
    />
  );
}
