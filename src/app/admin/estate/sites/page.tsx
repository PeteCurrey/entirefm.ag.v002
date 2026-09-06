import React from 'react';
import { listSites, listClientAccounts } from '@/server/estate';
import { SitesPageClient } from './SitesPageClient';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const [sites, clientAccounts] = await Promise.all([
    listSites(),
    listClientAccounts().catch(() => []),
  ]);

  const googleMapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    '';

  return (
    <SitesPageClient
      initialSites={sites}
      clientAccounts={clientAccounts}
      googleMapsApiKey={googleMapsApiKey}
    />
  );
}
