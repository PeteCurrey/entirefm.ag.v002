import React from 'react';
import type { Metadata } from 'next';
import { listContracts } from '@/server/estate';
import { ContractsPageClient } from './ContractsPageClient';

export const metadata: Metadata = {
  title: 'Contracts & SLA Agreements | EntireFM Estate CAFM',
  description: 'Active commercial agreements, maintenance scopes, and SLAs across client accounts.',
};

export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
  const contracts = await listContracts();

  return <ContractsPageClient initialContracts={contracts} />;
}
