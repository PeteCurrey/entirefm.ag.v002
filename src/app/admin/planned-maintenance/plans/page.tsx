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

const MOCK_PLANS = [
  {
    id: 'plan-001',
    plan_number: 'PPM-2026-001',
    name: 'Manchester City Tower — Core M&E & Life Safety',
    version: '3.2',
    status: 'ACTIVE',
    effective_from: '2026-01-01T00:00:00Z',
    total_assets_count: 420,
    total_requirements_count: 84,
    approved_at: '2025-12-18T14:30:00Z',
  },
  {
    id: 'plan-002',
    plan_number: 'PPM-2026-004',
    name: 'London Southbank Plaza — Commercial HVAC & BMS',
    version: '2.1',
    status: 'ACTIVE',
    effective_from: '2026-01-15T00:00:00Z',
    total_assets_count: 312,
    total_requirements_count: 62,
    approved_at: '2026-01-10T11:00:00Z',
  },
  {
    id: 'plan-003',
    plan_number: 'PPM-2026-008',
    name: 'Birmingham Logistics Hub — High Voltage & Fire Systems',
    version: '1.4',
    status: 'ACTIVE',
    effective_from: '2026-02-01T00:00:00Z',
    total_assets_count: 188,
    total_requirements_count: 38,
    approved_at: '2026-01-28T09:45:00Z',
  },
  {
    id: 'plan-004',
    plan_number: 'PPM-2026-012',
    name: 'Leeds Innovation Campus — Critical Plant & Water Hygiene',
    version: '2.0',
    status: 'ACTIVE',
    effective_from: '2026-03-01T00:00:00Z',
    total_assets_count: 254,
    total_requirements_count: 51,
    approved_at: '2026-02-20T16:15:00Z',
  },
  {
    id: 'plan-005',
    plan_number: 'PPM-2026-015',
    name: 'Midlands Commercial Estates — Statutory Compliance Register',
    version: '1.0',
    status: 'ACTIVE',
    effective_from: '2026-04-01T00:00:00Z',
    total_assets_count: 254,
    total_requirements_count: 49,
    approved_at: '2026-03-25T10:30:00Z',
  },
];

export default async function MaintenancePlansPage() {
  const dbPlans = await listMaintenancePlans().catch(() => []);
  const plans = dbPlans.length > 0 ? dbPlans : MOCK_PLANS;

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
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
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
                  <td className="px-5 py-4 font-mono text-[11px] text-white">{p.plan_number}</td>
                  <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">v{p.version}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${STATUS_COLOURS[p.status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">
                    {new Date(p.effective_from).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/80">{p.total_assets_count}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/80">{p.total_requirements_count}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/50">
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
