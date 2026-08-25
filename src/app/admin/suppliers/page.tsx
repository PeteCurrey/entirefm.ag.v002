import React from 'react';
import Link from 'next/link';
import { getExecutiveSupplyChainMetrics, listSupplierOrganisations, listSupplierTargets, getLiveSupplyChainGaps } from '@/server/suppliers/store';
import { SupplierMetricCards } from '@/components/admin/suppliers/SupplierMetricCards';
import { LandscapeMatrixView } from '@/components/admin/suppliers/LandscapeMatrixView';
import { GapAlertTable } from '@/components/admin/suppliers/GapAlertTable';
import { listExtendedLeads } from '@/server/growth/store';
import { ShieldCheck, Award, AlertTriangle, ArrowRight, UserPlus, FileCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierControlCentrePage() {
  const [metrics, suppliers, targets, gaps, leadsRes] = await Promise.all([
    getExecutiveSupplyChainMetrics(),
    listSupplierOrganisations(),
    listSupplierTargets(),
    getLiveSupplyChainGaps(),
    listExtendedLeads({}),
  ]);

  const supplierApplications = (leadsRes?.leads || []).filter(
    (l: any) => l.pageType === 'supplier-application' || l.source === 'SUPPLIER_APPLICATION'
  );
  metrics.activeApplications = supplierApplications.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            SUPPLY CHAIN INTELLIGENCE &amp; PROCUREMENT PLANNING
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier &amp; Partner Network Control Centre
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Strategic visibility across capability depth, geographic coverage, OEM partnerships, and recruitment requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/suppliers/targets" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> Target Partner Board
          </Link>
          <Link href="/admin/suppliers/commercial" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-light rounded transition-colors">
            Commercial Hub
          </Link>
        </div>
      </div>

      {/* Real Metrics Cards */}
      <SupplierMetricCards metrics={metrics} />

      {/* Strategic Funnel Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Active Gaps */}
          <GapAlertTable gaps={gaps.slice(0, 5)} />

          {/* Quick Matrix Overview */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                Active Supplier Landscape Snapshot
              </h3>
              <Link href="/admin/suppliers/landscape" className="text-xs font-mono text-brand-pink font-light underline">
                Open Full Matrix
              </Link>
            </div>
            <LandscapeMatrixView suppliers={suppliers} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Inbound Applications Intake Queue */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                Inbound Applications
              </h3>
              <span className="text-xs font-mono font-light px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {supplierApplications.length} New
              </span>
            </div>

            {supplierApplications.length === 0 ? (
              <p className="text-xs text-slate-500 font-light py-4 text-center">
                No new inbound applications awaiting review.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {supplierApplications.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-normal text-slate-900">{app.company || app.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{app.location || 'UK'}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 line-clamp-1">{app.service}</p>
                    <Link
                      href={`/admin/suppliers/applications`}
                      className="text-[11px] font-mono text-brand-pink font-light hover:underline inline-block pt-1"
                    >
                      Review &amp; Convert &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/admin/suppliers/applications"
                className="text-xs font-mono text-slate-700 hover:text-slate-900 underline block text-center"
              >
                View all applications ({supplierApplications.length})
              </Link>
            </div>
          </div>

          {/* Proactive Recruitment Targets */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                Priority Targets
              </h3>
              <span className="text-xs font-mono font-light px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                {targets.length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {targets.slice(0, 3).map((t) => (
                <div key={t.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-normal text-slate-900">{t.company_name}</span>
                    <span className="text-[10px] font-mono font-light px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {t.services.join(', ')} &middot; {t.geography.join(', ')}
                  </p>
                  <p className="text-xs text-slate-600 font-light italic">
                    Next: {t.next_action || 'Outreach required'}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/admin/suppliers/targets"
                className="text-xs font-mono text-slate-700 hover:text-slate-900 underline block text-center"
              >
                Open Target Recruitment Board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
