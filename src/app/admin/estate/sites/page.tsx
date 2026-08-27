import React from 'react';
import { listSites } from '@/server/estate';
import { SitesPageClient } from './SitesPageClient';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const sites = await listSites();
  return <SitesPageClient initialSites={sites} />;
}
