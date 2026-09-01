import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, requireAdminSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getCeoCommandDashboard, listEnterpriseMetrics } from '@/server/ceo-command';
import { NeedsAttentionSignals } from '@/components/admin/command/NeedsAttentionSignals';
import { NeedsDecisionQueue } from '@/components/admin/command/NeedsDecisionQueue';
import { WhatChanged } from '@/components/admin/command/WhatChanged';
import { DomainSummaryGrid } from '@/components/admin/command/DomainSummaryGrid';
import { CeoCommandConsole } from '@/components/admin/command/CeoCommandConsole';

export const metadata: Metadata = {
  title: 'CEO Command — EntireFM',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false } },
};

export const dynamic = 'force-dynamic';

export default async function CeoCommandPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login?next=/admin/command');
  try { requireAdminSession(session); } catch { redirect('/admin/access-denied'); }

  if (!hasPermission(session, 'enterprise_intelligence:view' as any)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-8 max-w-md text-center">
          <div className="text-sm font-normal text-red-400 mb-2">ACCESS DENIED</div>
          <div className="text-white font-light mb-1">CEO Command requires enterprise_intelligence:view permission.</div>
          <div className="text-brand-mist/60 text-sm">Contact your administrator to request access.</div>
        </div>
      </div>
    );
  }

  const dashboard = await getCeoCommandDashboard(session).catch(() => null);
  const metrics = listEnterpriseMetrics();
  const hasCanHavePermission = hasPermission(session, 'enterprise_intelligence:brief_generate' as any);

  const zeroData = dashboard?.zero_data_summary;
  const hasOp = zeroData?.has_operational_data ?? false;

  return (
    <div className="space-y-8 pb-16">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between border-b border-brand-edge-dark pb-6">
        <div>
          <div className="text-[10px] font-normal tracking-[0.2em] text-brand-mist/40 uppercase mb-1">
            EntireFM Intelligence
          </div>
          <h1 className="text-[22px] font-light text-white tracking-tight">
            CEO Command
          </h1>
          <p className="text-sm text-brand-mist/50 mt-1 max-w-lg">
            Enterprise operating intelligence — deterministic, evidence-backed, read-only.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-normal text-brand-mist/40">
          <span>READ ONLY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* ── Zero Data Banner ──────────────────────────────── */}
      {!hasOp && (
        <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-5">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <span className="text-amber-400 text-sm font-normal">!</span>
            </div>
            <div>
              <div className="text-sm font-normal text-amber-300 mb-1">No operational data loaded</div>
              <p className="text-[12.5px] text-brand-mist/60 leading-relaxed">
                CEO Command is running correctly with zero operational records.
                Clients: <strong className="text-white">{zeroData?.clients ?? 0}</strong> ·
                Sites: <strong className="text-white">{zeroData?.sites ?? 0}</strong> ·
                Open Work Orders: <strong className="text-white">{zeroData?.open_work_orders ?? 0}</strong>.
                Import your operational data to enable full analytics.
              </p>
              <a href="/admin/estate/imports" className="inline-flex items-center gap-1 mt-3 text-[11.5px] font-normal text-amber-400 hover:text-amber-300 transition-colors">
                Open Migration Centre →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Three-Column Command Grid ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* WHAT CHANGED */}
        <div>
          <div className="text-[9px] font-normal tracking-[0.18em] text-brand-mist/35 uppercase mb-3">
            What Changed
          </div>
          <WhatChanged items={dashboard?.what_changed ?? []} />
        </div>

        {/* NEEDS ATTENTION */}
        <div>
          <div className="text-[9px] font-normal tracking-[0.18em] text-brand-mist/35 uppercase mb-3">
            Needs Attention
          </div>
          <NeedsAttentionSignals signals={dashboard?.signals ?? []} />
        </div>

        {/* NEEDS DECISION */}
        <div>
          <div className="text-[9px] font-normal tracking-[0.18em] text-brand-mist/35 uppercase mb-3">
            Needs Decision
          </div>
          <NeedsDecisionQueue session={session} needsDecisionCount={dashboard?.needs_decision_count ?? 0} />
        </div>
      </div>

      {/* ── Ask EntireFM — CEO Command Console ───────────── */}
      <div>
        <div className="text-[9px] font-normal tracking-[0.18em] text-brand-mist/35 uppercase mb-3">
          Ask EntireFM
        </div>
        <CeoCommandConsole session={session} zeroData={!hasOp} />
      </div>

      {/* ── Domain Intelligence Summary ───────────────────── */}
      {hasOp && (
        <div>
          <div className="text-[9px] font-normal tracking-[0.18em] text-brand-mist/35 uppercase mb-3">
            Domain Intelligence
          </div>
          <DomainSummaryGrid metrics={metrics} session={session} />
        </div>
      )}

    </div>
  );
}
