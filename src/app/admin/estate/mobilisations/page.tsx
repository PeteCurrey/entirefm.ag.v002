import React from 'react';
import { listMaintenancePlans } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const STATUS_COLOURS: Record<string, string> = {
  DRAFT: 'bg-brand-edge-dark text-brand-mist/60',
  UNDER_REVIEW: 'bg-amber-900/40 text-amber-300',
  APPROVED: 'bg-blue-900/40 text-blue-300',
  ACTIVE: 'bg-emerald-900/40 text-emerald-300',
  SUPERSEDED: 'bg-orange-900/40 text-orange-300',
  ARCHIVED: 'bg-brand-edge-dark text-brand-mist/40',
};

export default async function MobilisationsPage() {
  const plans = await listMaintenancePlans().catch(() => []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Mobilisations"
        description="Manage client estate onboarding, asset imports, and PPM plan activation."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo">
            + Create Mobilisation
          </button>
        }
      />

      {plans.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Plan Number</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Effective From</th>
                <th className="px-5 py-3">Assets</th>
                <th className="px-5 py-3">Requirements</th>
                <th className="px-5 py-3">Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {plans.map((plan) => (
                <tr key={plan.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-mono text-[11px] text-white">{plan.plan_number}</td>
                  <td className="px-5 py-4">
                    <div className="font-light text-white">{plan.name}</div>
                    {plan.description && (
                      <div className="text-[11px] text-brand-mist/50 mt-0.5">{plan.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${STATUS_COLOURS[plan.status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">v{plan.version}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">
                    {new Date(plan.effective_from).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-[11px] text-brand-mist/70">
                    {plan.total_assets_count}
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-[11px] text-brand-mist/70">
                    {plan.total_requirements_count}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">
                    {plan.approved_at ? new Date(plan.approved_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Active Mobilisations"
          description="Create a new mobilisation to onboard a client estate, import asset data, and generate the first PPM plan."
        />
      )}
    </div>
  );
}
