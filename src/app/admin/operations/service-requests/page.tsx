import React from 'react';
import type { Metadata } from 'next';
import { listServiceRequests } from '@/server/work';
import { ServiceRequestsPageClient } from './ServiceRequestsPageClient';

export const metadata: Metadata = {
  title: 'Service Requests & Helpdesk | EntireFM Operations',
  description: 'Incoming helpdesk requests, fault logging, initial triage, and work order conversion.',
};

export const dynamic = 'force-dynamic';

export default async function ServiceRequestsPage() {
  const requests = await listServiceRequests();

  return <ServiceRequestsPageClient initialRequests={requests} />;
}
