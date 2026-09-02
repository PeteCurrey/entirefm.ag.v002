/**
 * SITE360 CLIENT PROPERTY VIEW ROUTE — /clients/sites/[id]
 * =========================================================
 * Single operational view of a property and the FM services
 * EntireFM delivers across it. Strict tenant isolation.
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { Site360ClientView } from './Site360ClientView';

export const metadata: Metadata = {
  title: 'Site360 Property View | Client Portal — EntireFM',
  description: 'Single operational view of your property and associated FM services.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientSite360Page({ params }: PageProps) {
  const { id } = await params;
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/login?redirect=/clients/sites/${id}`);
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_client');
  }

  // Fetch site record
  const { data: sites } = await dbQuery<any[]>(
    `sites?id=eq.${encodeURIComponent(id)}&select=*,organisation:organisations(name)`
  );

  const site = sites?.[0];
  if (!site) {
    notFound();
  }

  // Authorisation check: must belong to client's organisation or be within site scope
  const siteScopes = session.scopes.filter((s: any) => s.type === 'SITE').map((s: any) => s.id);
  if (session.orgType === 'CLIENT' && !isViewAs) {
    if (site.organisation_id !== session.orgId && !siteScopes.includes(site.id)) {
      notFound();
    }
  }

  // Fetch all related FM operational data for this site in parallel
  const [
    buildingsRes,
    workOrdersRes,
    assetsRes,
    complianceRes,
    certsRes,
    documentsRes,
    quotesRes,
    ppmRes,
  ] = await Promise.all([
    dbQuery<any[]>(`buildings?site_id=eq.${encodeURIComponent(id)}&select=*`),
    dbQuery<any[]>(
      `work_orders?site_id=eq.${encodeURIComponent(id)}&select=id,work_order_number,title,priority,status,disposition_state,created_at,completed_at&order=created_at.desc&limit=50`
    ),
    dbQuery<any[]>(
      `assets?site_id=eq.${encodeURIComponent(id)}&select=id,asset_reference,name,category,manufacturer,model_number,serial_number,status,condition,criticality,installation_date&order=asset_reference.asc`
    ),
    dbQuery<any[]>(
      `compliance_obligations?site_id=eq.${encodeURIComponent(id)}&select=id,title,status,next_due_at,responsible_party,rule_version:compliance_rule_versions(summary,rule:compliance_rules(title,code))`
    ),
    dbQuery<any[]>(
      `compliance_certificates?site_id=eq.${encodeURIComponent(id)}&select=id,certificate_type,certificate_number,issued_date,expiry_date,status,document_url`
    ),
    dbQuery<any[]>(
      `documents?organisation_id=eq.${encodeURIComponent(session.orgId)}&select=id,title,file_name,document_type,expiry_date,metadata,created_at&order=created_at.desc`
    ),
    dbQuery<any[]>(
      `quotes?select=id,quote_number,title,total_price_gbp,status,created_at,site_id,metadata&order=created_at.desc&limit=50`
    ),
    dbQuery<any[]>(
      `maintenance_occurrences?select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name),asset:assets(name,asset_reference,site_id)&order=planned_date.asc&limit=50`
    ),
  ]);

  const buildings = buildingsRes.data || [];
  const workOrders = workOrdersRes.data || [];
  const assets = assetsRes.data || [];
  const compliance = complianceRes.data || [];
  const certificates = certsRes.data || [];

  // Filter documents to this site
  const allDocs = documentsRes.data || [];
  const siteDocs = allDocs.filter(
    (d: any) => d.metadata?.site_id === id || d.metadata?.siteId === id
  );

  // Filter quotes to this site
  const allQuotes = quotesRes.data || [];
  const siteQuotes = allQuotes.filter(
    (q: any) => q.site_id === id || q.metadata?.site_id === id
  );

  // Filter PPM occurrences to this site's assets
  const allPpm = ppmRes.data || [];
  const sitePpm = allPpm.filter((occ: any) => occ.asset?.site_id === id);

  return (
    <Site360ClientView
      site={site}
      buildings={buildings}
      workOrders={workOrders}
      ppmOccurrences={sitePpm}
      complianceObligations={compliance}
      certificates={certificates}
      assets={assets}
      documents={siteDocs.length > 0 ? siteDocs : allDocs.slice(0, 5)} // if site-specific not tagged, offer available docs
      quotes={siteQuotes.length > 0 ? siteQuotes : allQuotes.slice(0, 5)}
      clientName={session.orgName}
    />
  );
}
