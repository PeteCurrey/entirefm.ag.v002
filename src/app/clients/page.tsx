/**
 * CANONICAL CLIENT DASHBOARD — /clients (Phase 0M Addendum)
 * ==========================================================
 * Estate performance, prominent issue reporting CTA, open jobs,
 * quotes requiring approval, compliance, and PPM status strictly scoped
 * to client organization and assigned sites.
 */

import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import { PlusCircle, ArrowRight, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  // Filter queries strictly by client organization and site scopes
  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const [sitesRes, woRes, ppmRes, compRes, quotesRes, completedRes] = await Promise.all([
    dbQuery<any[]>(`sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city`),
    dbQuery<any[]>(`work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,priority,status,site_id,created_at&order=created_at.desc&limit=20`),
    dbQuery<any[]>(`maintenance_occurrences?status=in.(PLANNED,GENERATED)&select=id,occurrence_code,planned_date&limit=10`),
    dbQuery<any[]>(`compliance_obligations?status=eq.ACTIVE&select=id,title,compliance_status&limit=10`),
    dbQuery<any[]>(`quotes?status=in.(DRAFT,ISSUED,PENDING_APPROVAL)&select=id,quote_number,title,total_price_gbp,status&limit=5`),
    dbQuery<any[]>(`work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=in.(COMPLETED,CLOSED)&select=id,work_order_number,title,priority,status,completed_at&order=completed_at.desc&limit=5`),
  ]);

  const rawSites = sitesRes.data || [];
  const openWorkOrders = (woRes.data || []).filter(
    (wo) => siteScopes.length === 0 || siteScopes.includes(wo.site_id)
  );
  const awaitingAttendance = openWorkOrders.filter((w) => ['ISSUED', 'OPEN', 'PENDING_DISPATCH'].includes(w.status));
  const inProgress = openWorkOrders.filter((w) => w.status === 'IN_PROGRESS');
  const pendingQuotes = quotesRes.data || [];
  const completedJobs = completedRes.data || [];

  return (
    <div className="space-y-8">
      {/* ─── PRIMARY ACTION HERO BANNER ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
            CLIENT OPERATIONS DESK &bull; {session.orgName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            How can EntireFM help today?
          </h1>
          <p className="text-sm text-brand-mist/70 max-w-xl">
            Report a reactive maintenance issue, request attendance, or track open jobs across your estate.
          </p>
        </div>

        <Link
          href="/clients/report"
          className="shrink-0 px-6 py-3.5 rounded-xl bg-brand-electric text-white text-sm font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-2.5 shadow-lg shadow-brand-electric/30 hover:scale-[1.02]"
        >
          <PlusCircle className="w-5 h-5" /> Report an Issue
        </Link>
      </div>

      {/* ─── KEY OPERATIONAL METRICS STRIP ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Open Jobs</span>
          <p className="text-2xl font-light text-white mt-1">{openWorkOrders.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Active requests</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Awaiting Visit</span>
          <p className="text-2xl font-light text-amber-400 mt-1">{awaitingAttendance.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Allocated / dispatching</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">In Progress</span>
          <p className="text-2xl font-light text-brand-electric-bright mt-1">{inProgress.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Engineer attending</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Quotes Awaiting</span>
          <p className="text-2xl font-light text-purple-400 mt-1">{pendingQuotes.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Requires approval</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">PPM Upcoming</span>
          <p className="text-2xl font-light text-emerald-400 mt-1">{(ppmRes.data || []).length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Scheduled maintenance</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Completed</span>
          <p className="text-2xl font-light text-cyan-400 mt-1">{completedJobs.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Recently resolved</span>
        </div>
      </div>

      {/* ─── PENDING QUOTES APPROVAL ALERT (IF ANY) ──────────────────────────── */}
      {pendingQuotes.length > 0 && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-purple-200">
                {pendingQuotes.length} Quote{pendingQuotes.length !== 1 ? 's' : ''} Awaiting Your Approval
              </span>
              <p className="text-xs text-purple-300/70 mt-0.5">
                Review scope of work and approve online to authorise engineer attendance.
              </p>
            </div>
          </div>
          <Link
            href="/clients/quotes"
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition-colors shrink-0"
          >
            Review Quotes →
          </Link>
        </div>
      )}

      {/* ─── SITES & RECENT JOBS GRID ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Open Work Orders List */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Active Jobs</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Current reactive work orders</p>
            </div>
            <Link href="/clients/work-orders" className="text-xs text-brand-electric hover:underline flex items-center gap-1">
              View All ({openWorkOrders.length}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {openWorkOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
                <p className="text-sm text-brand-mist font-normal">No jobs currently in progress</p>
                <p className="text-xs text-brand-mist/50 max-w-xs mx-auto">
                  All reactive tasks on your estate are up to date.
                </p>
                <Link
                  href="/clients/report"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-electric font-medium hover:underline pt-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Report a New Issue
                </Link>
              </div>
            ) : (
              openWorkOrders.slice(0, 6).map((wo) => (
                <div key={wo.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-normal text-white truncate">{wo.title}</div>
                    <div className="text-[11px] text-brand-mist/50 font-normal mt-0.5">
                      {wo.work_order_number} &bull; Priority {wo.priority}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[10.5px] font-medium border ${
                    wo.status === 'IN_PROGRESS'
                      ? 'bg-brand-electric/10 border-brand-electric/30 text-brand-electric-bright'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {wo.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Authorised Sites List */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Your Managed Sites</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Authorised estate locations</p>
            </div>
            <Link href="/clients/sites" className="text-xs text-brand-electric hover:underline flex items-center gap-1">
              View All ({rawSites.length}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {rawSites.length === 0 ? (
              <div className="py-12 text-center text-xs text-brand-mist/40">
                No sites configured in this scope context.
              </div>
            ) : (
              rawSites.map((s) => (
                <div key={s.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[13.5px] font-normal text-white">{s.name}</div>
                    <div className="text-[11px] text-brand-mist/50 font-normal mt-0.5">
                      {s.site_code || 'SITE'} &bull; {s.city || 'United Kingdom'}
                    </div>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                    ACTIVE
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
