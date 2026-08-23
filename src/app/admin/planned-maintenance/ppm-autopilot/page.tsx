import React from 'react';
import Link from 'next/link';
import { getPPMDashboardMetrics, listMaintenancePlans } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function PPMAutopilotPage() {
  const [metrics, activePlans] = await Promise.all([
    getPPMDashboardMetrics(),
    listMaintenancePlans({ status: 'ACTIVE' }).catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        category="Planned Maintenance"
        title="PPM Autopilot"
        description="Intelligent maintenance planning engine — from asset register to scheduled field visits."
        action={
          <Link
            href="/admin/estate/mobilisations"
            className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow hover:bg-brand-indigo inline-block"
          >
            + Create / Mobilise Plan
          </Link>
        }
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className="font-mono text-2xl font-bold text-white">{metrics.activePlanItems}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Active Plan Items</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className="font-mono text-2xl font-bold text-blue-400">{metrics.dueThisWeek}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Due This Week</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className="font-mono text-2xl font-bold text-indigo-400">{metrics.dueThisMonth}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Due This Month</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className={`font-mono text-2xl font-bold ${metrics.overdue > 0 ? 'text-red-400' : 'text-brand-mist/40'}`}>
            {metrics.overdue}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Overdue (Missed)</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className="font-mono text-2xl font-bold text-emerald-400">{metrics.satisfied}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Satisfied</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4 text-center">
          <div className={`font-mono text-2xl font-bold ${metrics.exceptions > 0 ? 'text-amber-400' : 'text-brand-mist/40'}`}>
            {metrics.exceptions}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-mist/50">Exceptions</div>
        </div>
      </div>

      {/* Active Plans Section */}
      <div>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-brand-mist/40">
          Active Maintenance Programmes
        </h2>
        {activePlans.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full min-w-[56rem] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Plan Number</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Version</th>
                  <th className="px-5 py-3">Effective Date</th>
                  <th className="px-4 py-3 text-right">Assets</th>
                  <th className="px-4 py-3 text-right">Requirements</th>
                  <th className="px-4 py-3 text-right">Annual Visits (est)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {activePlans.map((p) => (
                  <tr key={p.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-mono text-[11px] text-white">{p.plan_number}</td>
                    <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/60">v{p.version}</td>
                    <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/60">
                      {new Date(p.effective_from).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/80">{p.total_assets_count}</td>
                    <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/80">{p.total_requirements_count}</td>
                    <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/80">{p.total_annual_visits_est}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Active PPM Plans"
            description="Create a mobilisation to begin building your planned maintenance programme."
            actionText="Create Mobilisation"
            actionHref="/admin/estate/mobilisations"
          />
        )}
      </div>

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/estate/mobilisations"
          className="group rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric">
            Estate Mobilisations →
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Import spreadsheets, run AI column mapping, and verify asset candidates.
          </div>
        </Link>
        <Link
          href="/admin/planned-maintenance/requirements"
          className="group rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric">
            Maintenance Requirements & Sources →
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Review approved statutory and standard maintenance schedules and adapters.
          </div>
        </Link>
        <Link
          href="/admin/planned-maintenance/exceptions"
          className="group rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric">
            PPM Exceptions Desk →
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Review missed occurrences, no-access visits, and unmapped assets.
          </div>
        </Link>
      </div>
    </div>
  );
}
