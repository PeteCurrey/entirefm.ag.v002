import React from 'react';
import { listMaintenancePlans } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const STATUS_COLOURS: Record<string, string> = {
  DRAFT: 'bg-[#F5F5F3] text-[#6D6D68]',
  UNDER_REVIEW: 'bg-amber-900/40 text-amber-300',
  APPROVED: 'bg-blue-900/40 text-blue-300',
  ACTIVE: 'bg-emerald-900/40 text-emerald-300',
  SUPERSEDED: 'bg-orange-900/40 text-orange-300',
  ARCHIVED: 'bg-[#F5F5F3] text-[#9A9A95]',
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
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
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
            <tbody className="divide-y divide-[#E8E8E5]">
              {plans.map((plan) => (
                <tr key={plan.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">{plan.plan_number}</td>
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{plan.name}</div>
                    {plan.description && (
                      <div className="text-[11px] text-[#9A9A95] mt-0.5">{plan.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${STATUS_COLOURS[plan.status] ?? 'bg-[#F5F5F3] text-[#6D6D68]'}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">v{plan.version}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
                    {new Date(plan.effective_from).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-4 text-center font-normal text-[11px] text-[#6D6D68]">
                    {plan.total_assets_count}
                  </td>
                  <td className="px-5 py-4 text-center font-normal text-[11px] text-[#6D6D68]">
                    {plan.total_requirements_count}
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
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
