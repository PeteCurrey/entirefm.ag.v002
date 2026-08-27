/**
 * CONTRACTOR OPERATIONS DASHBOARD — /contractor (Phase 0M Addendum)
 * =================================================================
 * Action-oriented workspace for approved supplier organisations.
 * Displays real scoped metrics, new jobs to accept, operative schedule, and compliance.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle2, AlertTriangle, Users, Calendar, ArrowRight, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contractor Operations | EntireFM CAFM',
  description: 'Supplier operations workspace for work order dispatch, operative assignment, and field tracking.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const providerOrgId = session.orgId;

  // Query real scoped data for this contractor organization
  const [offersRes, acceptedRes, posRes, operativesRes] = await Promise.all([
    dbQuery<any[]>(
      `work_order_assignments?provider_organisation_id=eq.${encodeURIComponent(providerOrgId)}&status=eq.OFFERED&select=*,work_order:work_orders(id,work_order_number,title,priority,status,site_id)&order=created_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `work_order_assignments?provider_organisation_id=eq.${encodeURIComponent(providerOrgId)}&status=in.(ACCEPTED,SCHEDULED,IN_PROGRESS)&select=*,work_order:work_orders(id,work_order_number,title,priority,status)&order=created_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `purchase_orders?supplier_org_id=eq.${encodeURIComponent(providerOrgId)}&status=in.(ISSUED,PARTIALLY_INVOICED)&select=id,po_number,total_amount_gbp,status&limit=10`
    ),
    dbQuery<any[]>(
      `persons?organisation_id=eq.${encodeURIComponent(providerOrgId)}&status=eq.ACTIVE&select=id,first_name,last_name,job_title&limit=20`
    ),
  ]);

  const newOffers = offersRes.data || [];
  const activeJobs = acceptedRes.data || [];
  const openPOs = posRes.data || [];
  const operatives = operativesRes.data || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
            CONTRACTOR OPERATIONS COMMAND &bull; {session.orgName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Field Operations &amp; Team Dispatch
          </h1>
          <p className="text-sm text-brand-mist/70 max-w-xl">
            Review incoming work order offers, allocate qualified engineers, and manage purchase orders.
          </p>
        </div>

        <Link
          href="/contractor/work"
          className="shrink-0 px-6 py-3.5 rounded-xl bg-brand-electric text-white text-sm font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-2.5 shadow-lg shadow-brand-electric/30 hover:scale-[1.02]"
        >
          View Work Queue ({newOffers.length + activeJobs.length})
        </Link>
      </div>

      {/* Action-Oriented Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">New Offers</span>
          <p className={`text-3xl font-light mt-1 ${newOffers.length > 0 ? 'text-amber-400 font-normal' : 'text-white'}`}>
            {newOffers.length}
          </p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Requires accept/decline</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Active / Attending</span>
          <p className="text-3xl font-light text-brand-electric-bright mt-1">{activeJobs.length}</p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">In progress in field</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Active Purchase Orders</span>
          <p className="text-3xl font-light text-emerald-400 mt-1">{openPOs.length}</p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Issued for billing</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Field Engineers</span>
          <p className="text-3xl font-light text-cyan-400 mt-1">{operatives.length}</p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Registered operatives</span>
        </div>
      </div>

      {/* New Work Offers (Action Required) */}
      {newOffers.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">
                New Work Order Offers ({newOffers.length})
              </h2>
            </div>
            <Link href="/contractor/work" className="text-xs text-amber-400 hover:underline">
              Accept / Decline in Work Queue →
            </Link>
          </div>

          <div className="divide-y divide-brand-edge-dark/40">
            {newOffers.map((offer) => (
              <div key={offer.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-normal text-white">{offer.work_order?.title || 'Maintenance Request'}</div>
                  <div className="text-xs font-mono text-brand-mist/50 mt-0.5">
                    {offer.work_order?.work_order_number || offer.id} &bull; Priority {offer.work_order?.priority || 'P3_MEDIUM'}
                  </div>
                </div>
                <Link
                  href="/contractor/work"
                  className="px-3 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/80 transition-colors"
                >
                  Review Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Accepted &amp; In Progress</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Active fieldwork assignments</p>
            </div>
            <Link href="/contractor/work" className="text-xs text-brand-electric hover:underline">
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {activeJobs.length === 0 ? (
              <div className="py-10 text-center text-xs text-brand-mist/40">
                No active jobs currently in progress.
              </div>
            ) : (
              activeJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-normal text-white">{job.work_order?.title || 'Work Order'}</div>
                    <div className="text-xs font-mono text-brand-mist/50 mt-0.5">
                      {job.work_order?.work_order_number} &bull; {job.status}
                    </div>
                  </div>
                  <span className="rounded bg-brand-electric/10 border border-brand-electric/30 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                    ACTIVE
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registered Engineers */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Engineer Roster</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Operatives &amp; competencies</p>
            </div>
            <Link href="/contractor/engineers" className="text-xs text-brand-electric hover:underline">
              Manage Team →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {operatives.length === 0 ? (
              <div className="py-10 text-center text-xs text-brand-mist/40">
                No engineers currently registered.
              </div>
            ) : (
              operatives.slice(0, 5).map((op) => (
                <div key={op.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-normal text-white">{op.first_name} {op.last_name}</div>
                    <div className="text-xs font-mono text-brand-mist/50 mt-0.5">{op.job_title || 'Field Engineer'}</div>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    AUTHORISED
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
