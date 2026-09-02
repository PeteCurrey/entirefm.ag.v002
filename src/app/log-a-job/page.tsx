/**
 * OPERATIONAL LOG A JOB — /log-a-job
 * ===============================================
 * Institutional facilities maintenance work-order intake.
 * Accessible to clients, site managers, commercial tenants, and authorised staff.
 * If authenticated, automatically enriches with client organization & site assets.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AiLogAJobClient from '@/app/clients/log-a-job/AiLogAJobClient';

export const metadata: Metadata = {
  title: 'Log a Job | Facilities Operations Desk — EntireFM',
  description:
    'Log reactive maintenance work orders, equipment repairs, and facility requests directly into EntireFM Operations Desk.',
};

export const dynamic = 'force-dynamic';

export default async function PublicLogAJobPage() {
  const session = await getCurrentSession();
  const isClient = !!(session && (session.orgType === 'CLIENT' || session.orgType === 'ENTIREFM'));

  let initialSites: any[] = [];
  let initialAssets: any[] = [];

  if (isClient && session) {
    // Authenticated client context
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
    const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

    const { data: sites } = await dbQuery<any[]>(
      `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city,postcode,address_line1&order=name.asc`
    );

    initialSites = (sites || []).map((s) => ({
      id: s.id,
      name: s.name,
      site_code: s.site_code || '',
      city: s.city || '',
      postcode: s.postcode || '',
    }));

    const siteIds = initialSites.map((s) => s.id);
    if (siteIds.length > 0) {
      const { data: assets } = await dbQuery<any[]>(
        `assets?site_id=in.(${siteIds.map(encodeURIComponent).join(',')})&status=neq.DECOMMISSIONED&select=id,name,asset_reference,category,sub_category,location,site_id,manufacturer,model,serial_number&limit=200`
      );
      initialAssets = assets || [];
    }
  } else {
    // Public user context: representative equipment assets
    const { data: publicAssets } = await dbQuery<any[]>(
      `assets?status=neq.DECOMMISSIONED&select=id,name,asset_reference,category,sub_category,location,site_id,manufacturer,model,serial_number&limit=50`
    );
    initialAssets = publicAssets || [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans">
      <Header lightOnTransparent={true} />
      <main className="flex-grow pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AiLogAJobClient
          clientName={session?.orgName || 'Commercial Client'}
          userName={session?.name || ''}
          initialSites={initialSites}
          initialAssets={initialAssets}
          isPublic={!isClient}
        />
      </main>
      <Footer />
    </div>
  );
}
