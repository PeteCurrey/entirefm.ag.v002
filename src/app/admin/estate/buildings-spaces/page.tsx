import React from 'react';
import type { Metadata } from 'next';
import { listBuildings, listSpaces } from '@/server/estate';
import { BuildingsSpacesPageClient } from './BuildingsSpacesPageClient';

export const metadata: Metadata = {
  title: 'Buildings & Spaces | EntireFM Estate CAFM',
  description: 'Physical facilities structure, floor zones, plant rooms, and rentable spaces.',
};

export const dynamic = 'force-dynamic';

export default async function BuildingsSpacesPage() {
  const [buildings, spaces] = await Promise.all([listBuildings(), listSpaces()]);

  return <BuildingsSpacesPageClient initialBuildings={buildings} initialSpaces={spaces} />;
}
