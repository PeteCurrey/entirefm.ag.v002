import React from 'react';
import type { Metadata } from 'next';
import { listClientAccounts } from '@/server/estate';
import { listEligibleAccountManagers } from '@/server/estate/account-managers';
import { ClientsPageClient } from './ClientsPageClient';

export const metadata: Metadata = {
  title: 'Client Accounts | EntireFM Estate CAFM',
  description: 'Manage client accounts, organisations, assigned account teams, and multi-site property portfolios.',
};

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const [clients, accountManagers] = await Promise.all([
    listClientAccounts(),
    listEligibleAccountManagers(),
  ]);

  return <ClientsPageClient initialClients={clients} initialAccountManagers={accountManagers} />;
}
