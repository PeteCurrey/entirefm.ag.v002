import React from 'react';
import { listSites, Site } from '@/server/estate';
import { Site360Client } from '@/components/admin/site-360/Site360Client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Site360PageProps {
  params: Promise<{ id: string }>;
}

export default async function Site360Page({ params }: Site360PageProps) {
  const { id } = await params;
  const sites = await listSites();

  // Find site in database or generate calibrated prototype data
  let currentSite: Site | undefined = sites.find((s) => s.id === id || s.site_code === id);

  if (!currentSite) {
    currentSite = {
      id: id,
      organisation_id: 'org-1',
      site_code: 'EFM-LON-01',
      name: 'Victoria House Commercial Complex',
      site_type: 'COMMERCIAL_OFFICE',
      address_line1: '37 Camden High Street',
      city: 'London',
      postcode: 'NW1 7JE',
      country: 'GB',
      status: 'ACTIVE',
      security_clearance_required: false,
      created_at: new Date().toISOString(),
    };
  }

  const allSitesList: Site[] = sites.length > 0 ? sites : [
    currentSite,
    {
      id: 'site-man-2',
      organisation_id: 'org-1',
      site_code: 'EFM-MAN-04',
      name: 'Manchester Hub & Tech Central',
      site_type: 'TECH_PARK',
      address_line1: '14 Oxford Road',
      city: 'Manchester',
      postcode: 'M1 5QA',
      country: 'GB',
      status: 'ACTIVE',
      security_clearance_required: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'site-bhx-3',
      organisation_id: 'org-1',
      site_code: 'EFM-BHX-02',
      name: 'Birmingham Logistics Park',
      site_type: 'INDUSTRIAL_LOGISTICS',
      address_line1: 'Gravelly Industrial Park',
      city: 'Birmingham',
      postcode: 'B24 8HZ',
      country: 'GB',
      status: 'ACTIVE',
      security_clearance_required: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'site-lds-4',
      organisation_id: 'org-1',
      site_code: 'EFM-LDS-08',
      name: 'Leeds Sovereign Square',
      site_type: 'HEADQUARTERS',
      address_line1: '1 Sovereign Square',
      city: 'Leeds',
      postcode: 'LS1 4DA',
      country: 'GB',
      status: 'ACTIVE',
      security_clearance_required: false,
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <Site360Client
      currentSite={currentSite}
      allSites={allSitesList}
    />
  );
}
