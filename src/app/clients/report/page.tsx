/**
 * REPORT AN ISSUE — /clients/report (Phase 0M Addendum)
 * ====================================================
 * Client Helpdesk conversational and standard issue intake page.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import ClientHelpdeskConversationalClient from './ClientHelpdeskConversationalClient';

export const metadata: Metadata = {
  title: 'Report an Issue | Client Helpdesk — EntireFM',
  description: 'Log maintenance and facilities issues directly with the EntireFM Helpdesk.',
};

export const dynamic = 'force-dynamic';

export default async function ClientReportIssuePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/clients/report');

  // Fetch Authorised Sites for this Client Organisation
  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: sites } = await dbQuery<any[]>(
    `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city&order=name.asc`
  );

  const initialSites = (sites || []).map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
  }));

  return (
    <ClientHelpdeskConversationalClient
      clientName={session.orgName}
      initialSites={initialSites}
    />
  );
}
