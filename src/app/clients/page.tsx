/**
 * CANONICAL CLIENT DASHBOARD — /clients
 * ======================================
 * Estate overview: Needs Your Attention, activity summary,
 * property cards, and recent activity. Strictly scoped to
 * client organisation and assigned sites.
 */

import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, MapPin, Building2, FileCheck, CalendarClock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s: any) => s.type === 'SITE').map((s: any) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';
  const siteIdFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const [
    sitesRes,
    openWoRes,
    awaitingClientWoRes,
    ppmUpcomingRes,
    pendingQuotesRes,
    complianceAttentionRes,
    recentCompletedRes,
  ] = await Promise.all([
    // All authorised sites
    dbQuery<any[]>(
      `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city,postcode,address_line1,site_type,status`
    ),
    // All open work orders
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,priority,status,disposition_state,site_id,created_at&order=created_at.desc&limit=50`
    ),
    // Jobs awaiting client action
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&disposition_state=in.(AWAITING_CLIENT_APPROVAL,AWAITING_ACCESS)&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,disposition_state,site_id&limit=10`
    ),
    // Upcoming PPM (next 60 days)
    dbQuery<any[]>(
      `maintenance_occurrences?status=in.(PLANNED,GENERATED)${siteIdFilter}&planned_date=gte.${new Date().toISOString().slice(0,10)}&select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name)&order=planned_date.asc&limit=5`
    ),
    // Quotes awaiting approval
    dbQuery<any[]>(
      `quotes?status=in.(DRAFT,ISSUED,PENDING_APPROVAL)&select=id,quote_number,title,total_price_gbp,status,site_id&limit=10`
    ),
    // Compliance requiring attention (overdue or due soon)
    dbQuery<any[]>(
      `compliance_obligations?status=in.(OVERDUE,DUE_SOON)&select=id,title,status,next_due_at,responsible_party,site:sites(name)&limit=5`
    ),
    // Recent completions
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=in.(COMPLETED,CLOSED)&select=id,work_order_number,title,status,completed_at,site_id&order=completed_at.desc&limit=5`
    ),
  ]);

  const sites = sitesRes.data || [];
  const openWorkOrders = (openWoRes.data || []).filter(
    (wo: any) => siteScopes.length === 0 || siteScopes.includes(wo.site_id)
  );
  const awaitingClientJobs = awaitingClientWoRes.data || [];
  const upcomingPpm = ppmUpcomingRes.data || [];
  const pendingQuotes = pendingQuotesRes.data || [];
  const complianceAttention = complianceAttentionRes.data || [];
  const recentCompleted = recentCompletedRes.data || [];

  // Build attention items list
  const attentionItems: Array<{ type: string; message: string; href: string; urgent?: boolean }> = [];

  pendingQuotes.forEach((q: any) => {
    attentionItems.push({
      type: 'QUOTE',
      message: `Quote ${q.quote_number} — ${q.title || 'Remedial Works'} requires your approval`,
      href: '/clients/quotes',
    });
  });

  awaitingClientJobs.forEach((wo: any) => {
    const label = wo.disposition_state === 'AWAITING_ACCESS'
      ? `${wo.work_order_number} requires access to be arranged`
      : `${wo.work_order_number} requires your approval to proceed`;
    attentionItems.push({
      type: 'JOB',
      message: label,
      href: `/clients/work-orders/${wo.id}`,
    });
  });

  complianceAttention.forEach((ob: any) => {
    if (ob.status === 'OVERDUE') {
      attentionItems.push({
        type: 'COMPLIANCE',
        message: `${ob.title || 'Statutory Obligation'} at ${ob.site?.name || 'your estate'} is overdue`,
        href: '/clients/compliance',
        urgent: true,
      });
    }
  });

  // Build per-site open job counts
  const openJobsBySite: Record<string, number> = {};
  openWorkOrders.forEach((wo: any) => {
    if (wo.site_id) openJobsBySite[wo.site_id] = (openJobsBySite[wo.site_id] || 0) + 1;
  });

  // Upcoming PPM: first date
  const nextPpmDate = upcomingPpm.length > 0 ? upcomingPpm[0].planned_date : null;

  // Hour greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">

      {/* ─── GREETING HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-brand-mist/40 font-normal">
            {greeting}
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight mt-0.5">
            {session.orgName}
          </h1>
          <p className="text-sm text-brand-mist/60 mt-1">
            {sites.length === 0
              ? 'No properties currently managed by EntireFM.'
              : sites.length === 1
              ? 'Showing activity for your managed property.'
              : `Showing activity across ${sites.length} managed properties.`}
          </p>
        </div>
        <Link
          href="/log-a-job"
          className="shrink-0 inline-flex items-center gap-2 rounded-sm border border-brand-electric/50 bg-brand-electric/15 px-5 py-2.5 text-sm font-light tracking-wide text-brand-electric-bright transition-all hover:border-brand-electric hover:bg-brand-electric/25 hover:text-white"
        >
          Log a Job
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ─── NEEDS YOUR ATTENTION ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-edge-dark/60 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-brand-electric-bright" />
          <h2 className="text-sm font-normal text-white">Needs Your Attention</h2>
        </div>
        {attentionItems.length === 0 ? (
          <div className="px-6 py-8 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-normal text-white">You&apos;re all caught up.</p>
              <p className="text-xs text-brand-mist/50 mt-0.5">Nothing currently requires your attention.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-brand-edge-dark/30">
            {attentionItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-brand-void/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.type === 'COMPLIANCE' ? 'bg-rose-400' :
                    item.type === 'QUOTE' ? 'bg-purple-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-sm text-brand-mist/90 truncate">{item.message}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ─── ACTIVITY SUMMARY — 3 TILES ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Open Jobs */}
        <Link
          href="/clients/work-orders"
          className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-brand-mist/50">Open Jobs</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright transition-colors" />
          </div>
          <p className="text-3xl font-light text-white mt-2">{openWorkOrders.length}</p>
          <p className="text-xs text-brand-mist/40 mt-1">Active maintenance requests</p>
        </Link>

        {/* PPM */}
        <Link
          href="/clients/ppm"
          className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-brand-mist/50">Planned Maintenance</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-brand-electric-bright transition-colors" />
          </div>
          <p className="text-3xl font-light text-white mt-2">{upcomingPpm.length}</p>
          <p className="text-xs text-brand-mist/40 mt-1">
            {nextPpmDate
              ? `Next scheduled: ${new Date(nextPpmDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
              : 'No visits currently scheduled'}
          </p>
        </Link>

        {/* Compliance */}
        <Link
          href="/clients/compliance"
          className={`rounded-xl border p-5 hover:border-rose-400/40 transition-colors group ${
            complianceAttention.some((o: any) => o.status === 'OVERDUE')
              ? 'border-rose-500/30 bg-rose-500/5'
              : complianceAttention.length > 0
              ? 'border-amber-500/20 bg-brand-carbon/40'
              : 'border-brand-edge-dark bg-brand-carbon/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-brand-mist/50">Compliance</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-rose-400 transition-colors" />
          </div>
          {complianceAttention.some((o: any) => o.status === 'OVERDUE') ? (
            <>
              <p className="text-3xl font-light text-rose-400 mt-2">
                {complianceAttention.filter((o: any) => o.status === 'OVERDUE').length}
              </p>
              <p className="text-xs text-rose-400/70 mt-1">Obligation{complianceAttention.filter((o: any) => o.status === 'OVERDUE').length !== 1 ? 's' : ''} overdue</p>
            </>
          ) : complianceAttention.length > 0 ? (
            <>
              <p className="text-3xl font-light text-amber-400 mt-2">{complianceAttention.length}</p>
              <p className="text-xs text-amber-400/70 mt-1">Due soon — no action required yet</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-light text-emerald-400 mt-2">All current</p>
              <p className="text-xs text-brand-mist/40 mt-1">No compliance actions required</p>
            </>
          )}
        </Link>
      </div>

      {/* ─── YOUR PROPERTIES ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-normal text-white">Your Properties</h2>
          <Link href="/clients/sites" className="text-xs text-brand-electric hover:underline">
            View all →
          </Link>
        </div>
        {sites.length === 0 ? (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 px-6 py-10 text-center">
            <Building2 className="w-8 h-8 text-brand-mist/30 mx-auto mb-3" />
            <p className="text-sm text-brand-mist/60">No properties have been assigned to your account yet.</p>
            <p className="text-xs text-brand-mist/40 mt-1">Contact your EntireFM account manager to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.slice(0, 6).map((site: any) => {
              const openCount = openJobsBySite[site.id] || 0;
              return (
                <Link
                  key={site.id}
                  href={`/clients/sites/${site.id}`}
                  className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-normal">
                        {site.site_code}
                      </span>
                      <h3 className="text-sm font-normal text-white mt-0.5 truncate">{site.name}</h3>
                      <p className="text-xs text-brand-mist/50 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {[site.city, site.postcode].filter(Boolean).join(' ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-mist/30 group-hover:text-brand-electric-bright shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {openCount > 0 ? (
                      <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                        {openCount} open job{openCount !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                        No open jobs
                      </span>
                    )}
                    <span className="rounded border border-brand-edge-dark px-2 py-0.5 text-[10px] text-brand-mist/50">
                      {site.site_type?.replace(/_/g, ' ') || 'Managed Site'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── RECENT ACTIVITY ──────────────────────────────────────────────── */}
      {recentCompleted.length > 0 && (
        <div>
          <h2 className="text-sm font-normal text-white mb-3">Recent Completions</h2>
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 divide-y divide-brand-edge-dark/30">
            {recentCompleted.map((wo: any) => (
              <Link
                key={wo.id}
                href={`/clients/work-orders/${wo.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-brand-void/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-normal text-white truncate">{wo.title}</p>
                    <p className="text-[11px] text-brand-mist/40 mt-0.5">
                      {wo.work_order_number}
                      {wo.completed_at ? ` · Completed ${new Date(wo.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/30 group-hover:text-white shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
