import React from 'react';
import { notFound } from 'next/navigation';
import { listSites, listAssets, listBuildings, listSpaces, Site } from '@/server/estate';
import { listWorkOrders } from '@/server/work';
import { listComplianceObligations } from '@/server/compliance';
import { Site360Client } from '@/components/admin/site-360/Site360Client';

export const dynamic = 'force-dynamic';

interface Site360PageProps {
  params: Promise<{ id: string }>;
}

export default async function Site360Page({ params }: Site360PageProps) {
  const { id } = await params;
  const allSites = await listSites();

  const currentSite = allSites.find((s) => s.id === id || s.site_code === id);

  if (!currentSite) {
    notFound();
  }

  const [assets, buildings, spaces, workOrders, compliance] = await Promise.all([
    listAssets({ siteId: currentSite.id }),
    listBuildings(currentSite.id),
    listSpaces(currentSite.id),
    listWorkOrders({ siteId: currentSite.id }),
    listComplianceObligations({ siteId: currentSite.id }),
  ]);

  return (
    <Site360Client
      currentSite={currentSite}
      allSites={allSites}
      assets={assets}
      buildings={buildings}
      spaces={spaces}
      workOrders={workOrders}
      complianceObligations={compliance}
    />
  );
}
