import React from 'react';
import { listSites, listClientAccounts } from '@/server/estate';
import { SitesPageClient } from './SitesPageClient';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const [sites, clientAccounts] = await Promise.all([
    listSites(),
    listClientAccounts().catch(() => []),
  ]);
  return <SitesPageClient initialSites={sites} clientAccounts={clientAccounts} />;
}
