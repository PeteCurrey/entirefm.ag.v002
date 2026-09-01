import React from 'react';
import { listMaintenanceSources, listMaintenanceRequirements } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const LICENSING_COLOURS: Record<string, string> = {
  ACTIVE: 'bg-emerald-900/40 text-emerald-300',
  NOT_CONFIGURED: 'bg-amber-900/40 text-amber-300',
  EXPIRED: 'bg-red-900/40 text-red-300',
  RESTRICTED: 'bg-orange-900/40 text-orange-300',
};

const FREQ_COLOURS: Record<string, string> = {
  WEEKLY: 'bg-red-900/40 text-red-300',
  MONTHLY: 'bg-orange-900/40 text-orange-300',
  QUARTERLY: 'bg-amber-900/40 text-amber-300',
  SIX_MONTHLY: 'bg-blue-900/40 text-blue-300',
  ANNUAL: 'bg-emerald-900/40 text-emerald-300',
  BIENNIAL: 'bg-brand-edge-dark text-brand-mist/60',
  FIVE_YEARLY: 'bg-brand-edge-dark text-brand-mist/60',
  VARIABLE: 'bg-purple-900/40 text-purple-300',
};

export default async function MaintenanceRequirementsPage() {
  const [sources, requirements] = await Promise.all([
    listMaintenanceSources().catch(() => []),
    listMaintenanceRequirements().catch(() => []),
  ]);

  const hasUnconfigured = sources.some((s) => s.licensing_status === 'NOT_CONFIGURED');

  return (
    <div className="space-y-10">
      <AdminPageHeader
        category="Planned Maintenance"
        title="Maintenance Requirements & Sources"
        description="Approved maintenance libraries, statutory obligations, and schedule standards."
      />

      {/* Warning banner for unconfigured sources */}
      {hasUnconfigured && (
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-[12.5px] text-amber-300">
          <span className="font-light">Notice:</span> One or more maintenance knowledge sources (such as SFG20) are not configured. Requirements from these sources cannot be mapped or scheduled automatically. Configure integrations in{' '}
          <a href="/admin/platform/integrations" className="underline hover:text-white">
            Platform Integrations
          </a>.
        </div>
      )}

      {/* Knowledge Sources Section */}
      <div>
        <h2 className="mb-4 font-medium text-[11px] uppercase tracking-widest text-brand-mist/40">
          Maintenance Knowledge Sources
        </h2>
        {sources.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Source Name</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Version</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {sources.map((s) => (
                  <tr key={s.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-normal text-[11px] text-white">{s.code}</td>
                    <td className="px-5 py-4 font-light text-white">{s.name}</td>
                    <td className="px-5 py-4 text-brand-mist/70">{s.provider}</td>
                    <td className="px-5 py-4 font-normal text-[10px] text-brand-mist/50">{s.source_type}</td>
                    <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/70">{s.version}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-0.5 font-normal text-[10px]${LICENSING_COLOURS[s.licensing_status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                        {s.licensing_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No Knowledge Sources" description="No maintenance sources registered." />
        )}
      </div>

      {/* Maintenance Requirements Section */}
      <div>
        <h2 className="mb-4 font-medium text-[11px] uppercase tracking-widest text-brand-mist/40">
          Standard Maintenance Requirements
        </h2>
        {requirements.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
            <table className="w-full min-w-[56rem] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Asset Class</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Frequency</th>
                  <th className="px-5 py-3">Trade</th>
                  <th className="px-4 py-3 text-right">Est. Hours</th>
                  <th className="px-5 py-3">Statutory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/60">
                {requirements.map((r) => (
                  <tr key={r.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4 font-normal text-[11px] text-white">{r.requirement_code}</td>
                    <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/60">{r.asset_class}</td>
                    <td className="px-5 py-4 font-light text-white">{r.title}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-0.5 font-normal text-[10px]${FREQ_COLOURS[r.frequency] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                        {r.frequency.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-brand-mist/70">{r.required_trade}</td>
                    <td className="px-4 py-4 text-right font-normal text-[11px] text-brand-mist/70">{r.expected_duration_hours}h</td>
                    <td className="px-5 py-4">
                      {r.statutory_relevance ? (
                        <span className="rounded bg-red-950/40 px-1.5 py-0.5 font-normal text-[10px] text-red-300 border border-red-900/40">
                          {r.statutory_relevance}
                        </span>
                      ) : (
                        <span className="text-brand-mist/30 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Requirements Registered"
            description="Approved maintenance requirements will appear here once loaded."
          />
        )}
      </div>
    </div>
  );
}
