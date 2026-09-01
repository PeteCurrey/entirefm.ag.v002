/**
 * LOG A JOB — /clients/log-a-job (Phase 01)
 * =========================================
 * AI-Powered Multimodal Log a Job experience for EntireFM Client Portal.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import AiLogAJobClient from './AiLogAJobClient';

export const metadata: Metadata = {
  title: 'Log a Job | AI Helpdesk — EntireFM',
  description: 'Submit maintenance requests with AI-assisted multimodal image, video, and document analysis.',
};

export const dynamic = 'force-dynamic';

export default async function ClientLogAJobPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/clients/log-a-job');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_client');
  }

  // Fetch Authorised Sites for this Client Organisation
  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: sites } = await dbQuery<any[]>(
    `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city,postcode,address_line1&order=name.asc`
  );

  const initialSites = (sites || []).map((s) => ({
    id: s.id,
    name: s.name,
    site_code: s.site_code || '',
    city: s.city || '',
    postcode: s.postcode || '',
  }));

  // Fetch initial assets across accessible sites
  let siteIds = initialSites.map((s) => s.id);
  let initialAssets: any[] = [];
  if (siteIds.length > 0) {
    const { data: assets } = await dbQuery<any[]>(
      `assets?site_id=in.(${siteIds.map(encodeURIComponent).join(',')})&status=neq.DECOMMISSIONED&select=id,name,asset_reference,category,sub_category,location,site_id,manufacturer,model,serial_number&limit=200`
    );
    initialAssets = assets || [];
  }

  return (
    <AiLogAJobClient
      clientName={session.orgName}
      initialSites={initialSites}
      initialAssets={initialAssets}
      userName={session.name}
    />
  );
}
