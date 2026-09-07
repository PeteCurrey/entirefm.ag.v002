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

export default async function MaintenancePlansPage() {
  const plans = await listMaintenancePlans().catch(() => []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Planned Maintenance"
        title="Maintenance Plans"
        description="Versioned planned preventative maintenance programmes and scheduling rules."
      />

      {plans.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Plan Number</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Effective From</th>
                <th className="px-4 py-3 text-right">Assets</th>
                <th className="px-4 py-3 text-right">Requirements</th>
                <th className="px-5 py-3">Approved At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {plans.map((p) => (
                <tr key={p.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">{p.plan_number}</td>
                  <td className="px-5 py-4 font-light text-white">{p.name}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">v{p.version}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${STATUS_COLOURS[p.status] ?? 'bg-[#F5F5F3] text-[#6D6D68]'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#6D6D68]">
                    {new Date(p.effective_from).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-[#6D6D68]">{p.total_assets_count}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-[#6D6D68]">{p.total_requirements_count}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-[#9A9A95]">
                    {p.approved_at ? new Date(p.approved_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Maintenance Plans Found"
          description="Create a new maintenance plan via estate mobilisation."
        />
      )}
    </div>
  );
}
