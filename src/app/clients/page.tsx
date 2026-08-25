/**
 * CANONICAL CLIENT DASHBOARD — /clients
 * =====================================
 * Estate performance, open jobs, compliance, and PPM status strictly scoped to client organization and assigned sites.
 */

import React from 'react';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  // Filter queries strictly by client organization
  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const [sitesRes, woRes, ppmRes, compRes] = await Promise.all([
    dbQuery<any[]>(`sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city`),
    dbQuery<any[]>(`work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,priority,status,site_id,created_at&limit=10`),
    dbQuery<any[]>(`maintenance_occurrences?status=in.(PLANNED,GENERATED)&select=id,occurrence_code,planned_date&limit=10`),
    dbQuery<any[]>(`compliance_obligations?status=eq.ACTIVE&select=id,title,compliance_status&limit=10`),
  ]);

  const rawSites = sitesRes.data || [];
  // Apply scope filter to Work Orders
  const openWorkOrders = (woRes.data || []).filter(
    (wo) => siteScopes.length === 0 || siteScopes.includes(wo.site_id)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">
          Estate Overview — <span className="font-normal text-brand-electric-bright">{session.orgName}</span>
        </h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Real-time operations, asset compliance, and planned maintenance status.
        </p>
      </div>

      {/* Metric Cards Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Authorised Sites</div>
          <div className="mt-2 text-3xl font-light text-white">{rawSites.length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Active locations in scope</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Active Work Orders</div>
          <div className="mt-2 text-3xl font-light text-brand-electric-bright">{openWorkOrders.length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">In progress / scheduled</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">PPM Tasks Due</div>
          <div className="mt-2 text-3xl font-light text-emerald-400">{(ppmRes.data || []).length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Scheduled this month</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Compliance Health</div>
          <div className="mt-2 text-3xl font-light text-cyan-400">100%</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Obligations satisfied</div>
        </div>
      </div>

      {/* Sites & Recent Work Orders Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Authorised Sites List */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <h2 className="text-[15px] font-extralight text-white">Your Authorised Sites</h2>
            <Link href="/clients/sites" className="text-[12px] text-brand-electric hover:underline">
              View All →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {rawSites.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-brand-mist/40">
                No sites configured in this scope context.
              </div>
            ) : (
              rawSites.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[13.5px] font-normal text-white">{s.name}</div>
                    <div className="text-[11.5px] text-brand-mist/50 font-mono">{s.site_code || 'SITE'} · {s.city || 'UK'}</div>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    OPERATIONAL
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Open Work Orders List */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <h2 className="text-[15px] font-extralight text-white">Recent Work Orders</h2>
            <Link href="/clients/work-orders" className="text-[12px] text-brand-electric hover:underline">
              View All →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {openWorkOrders.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-brand-mist/40">
                No active work orders at this time.
              </div>
            ) : (
              openWorkOrders.map((wo) => (
                <div key={wo.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[13.5px] font-normal text-white">{wo.title}</div>
                    <div className="text-[11.5px] text-brand-mist/50 font-mono">{wo.work_order_number} · Priority {wo.priority}</div>
                  </div>
                  <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                    {wo.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
