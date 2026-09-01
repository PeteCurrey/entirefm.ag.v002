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
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
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
            <tbody className="divide-y divide-brand-edge-dark/60">
              {plans.map((p) => (
                <tr key={p.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">{p.plan_number}</td>
                  <td className="px-5 py-4 font-light text-white">{p.name}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/70">v{p.version}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${STATUS_COLOURS[p.status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/70">
                    {new Date(p.effective_from).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-brand-mist/80">{p.total_assets_count}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-brand-mist/80">{p.total_requirements_count}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/50">
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
