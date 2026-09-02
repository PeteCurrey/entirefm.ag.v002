/**
 * CLIENT SITES & PROPERTIES — /clients/sites
 * ===========================================
 * Shows all properties managed by EntireFM for the authenticated client.
 * Each property card provides key status metrics and links to the
 * comprehensive Site360 operational property overview.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import { Building2, MapPin, ArrowRight, Wrench, ShieldCheck, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sites & Properties | Client Portal — EntireFM',
  description: 'Authorised property portfolio managed by EntireFM.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientSitesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s: any) => s.type === 'SITE').map((s: any) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const [sitesRes, openWoRes] = await Promise.all([
    dbQuery<any[]>(
      `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,site_type,address_line1,city,postcode,status&order=name.asc`
    ),
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,site_id`
    ),
  ]);

  const sites = sitesRes.data || [];
  const openWos = openWoRes.data || [];

  const openCountBySite: Record<string, number> = {};
  openWos.forEach((wo: any) => {
    if (wo.site_id) {
      openCountBySite[wo.site_id] = (openCountBySite[wo.site_id] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">Sites &amp; Properties</h1>
          <p className="mt-1 text-[13px] text-brand-mist/60">
            Authorised properties managed by EntireFM for {session.orgName}. Select a property to view its Site360 operational record.
          </p>
        </div>
        <Link
          href="/log-a-job"
          className="inline-flex items-center gap-1.5 rounded-sm border border-brand-electric/50 bg-brand-electric/15 px-4 py-2 text-xs font-light text-brand-electric-bright hover:bg-brand-electric/25 hover:text-white transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Log a Job
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 px-6 py-16 text-center">
          <Building2 className="w-10 h-10 text-brand-mist/30 mx-auto mb-3" />
          <h2 className="text-base font-normal text-white">No properties assigned</h2>
          <p className="text-sm text-brand-mist/60 mt-1 max-w-md mx-auto">
            No properties have been assigned to your account yet. When EntireFM begins managing your sites, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sites.map((site) => {
            const openJobs = openCountBySite[site.id] || 0;
            return (
              <Link
                key={site.id}
                href={`/clients/sites/${site.id}`}
                className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-brand-electric-bright">
                      {site.site_code || 'SITE'}
                    </span>
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                      {site.status || 'ACTIVE'}
                    </span>
                  </div>
                  <h3 className="text-base font-light text-white mt-1 group-hover:text-brand-electric-bright transition-colors">
                    {site.name}
                  </h3>
                  <p className="text-xs text-brand-mist/60 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-brand-mist/40 shrink-0" />
                    {[site.address_line1, site.city, site.postcode].filter(Boolean).join(', ')}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-brand-edge-dark/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {openJobs > 0 ? (
                      <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                        {openJobs} open job{openJobs !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                        All jobs up to date
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-brand-mist/60 group-hover:text-white inline-flex items-center gap-1 font-light transition-colors">
                    Site360 View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
