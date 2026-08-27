import React from 'react';
import { notFound } from 'next/navigation';
import { getClientAccount, listContracts, listSites, listAssets } from '@/server/estate';
import { listWorkOrders } from '@/server/work';
import { listQuotes } from '@/server/commercial';
import { listMaintenancePlans } from '@/server/ppm';
import { ClientHubClient } from './ClientHubClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientAccount(id);

  if (!client) {
    notFound();
  }

  const [contracts, sites, quotes, ppmPlans] = await Promise.all([
    listContracts(client.id),
    listSites({ clientAccountId: client.id }),
    listQuotes().catch(() => []),
    listMaintenancePlans({ clientAccountId: client.id }).catch(() => []),
  ]);

  const siteIds = sites.map((s) => s.id);
  const assets = (
    await Promise.all(siteIds.map((sId) => listAssets({ siteId: sId })))
  ).flat();

  const workOrders = (
    await Promise.all(siteIds.map((sId) => listWorkOrders({ siteId: sId })))
  ).flat();

  const clientQuotes = quotes.filter((q) => q.client_account_id === client.id);

  return (
    <ClientHubClient
      client={client}
      contracts={contracts}
      sites={sites}
      assets={assets}
      workOrders={workOrders}
      quotes={clientQuotes}
      ppmPlans={ppmPlans}
    />
  );
}
