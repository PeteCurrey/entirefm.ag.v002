import React from 'react';
import type { Metadata } from 'next';
import { listCommunicationThreads } from '@/server/communications';
import { CommunicationsPageClient } from './CommunicationsPageClient';

export const metadata: Metadata = {
  title: 'Communications & Inbox | EntireFM Admin',
  description: 'Multi-channel customer, contractor, and engineer communications.',
};

export const dynamic = 'force-dynamic';

export default async function CommunicationsPage() {
  const threads = await listCommunicationThreads();

  return <CommunicationsPageClient initialThreads={threads} />;
}
