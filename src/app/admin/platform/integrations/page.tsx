import React from 'react';
import { listMaintenanceSources } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

const LICENSING_COLOURS: Record<string, string> = {
  ACTIVE: 'bg-emerald-900/40 text-emerald-300 border-emerald-800/40',
  NOT_CONFIGURED: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
  EXPIRED: 'bg-red-900/40 text-red-300 border-red-800/40',
  RESTRICTED: 'bg-orange-900/40 text-orange-300 border-orange-800/40',
};

export default async function PlatformIntegrationsPage() {
  const sources = await listMaintenanceSources().catch(() => []);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        category="Platform"
        title="Integrations & Maintenance Standards"
        description="Configure external maintenance schedule sources, data feeds, and service adapters."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sources.map((s) => {
          const isSFG20 = s.source_type === 'SFG20' || s.code.includes('SFG20');

          return (
            <div
              key={s.id}
              className="flex flex-col justify-between rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-6"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-light text-white text-[15px]">{s.name}</h3>
                    <div className="text-[12px] text-brand-mist/60 mt-0.5">Provider: {s.provider}</div>
                  </div>
                  <span className={`rounded px-2.5 py-1 font-normal text-[10.5px] border${LICENSING_COLOURS[s.licensing_status] ?? 'bg-brand-edge-dark text-brand-mist/60 border-brand-edge-dark'}`}>
                    {s.licensing_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11.5px] font-normal text-brand-mist/70 border-t border-brand-edge-dark/60 pt-4">
                  <div>Code: <span className="text-white">{s.code}</span></div>
                  <div>Version: <span className="text-white">{s.version}</span></div>
                  <div>Type: <span className="text-white">{s.source_type}</span></div>
                  <div>Effective: <span className="text-white">{s.effective_date}</span></div>
                </div>

                {isSFG20 && (
                  <div className="mt-5 rounded bg-brand-void/50 p-3.5 text-[11.5px] text-brand-mist/80 space-y-2 border border-brand-edge-dark">
                    <div className="font-light text-white">Capabilities & Governance:</div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside text-brand-mist/70">
                      <li>Maintenance schedule mapping</li>
                      <li>Source version tracking</li>
                      <li>Task content adapter (requires customer SFG20/Facilities-iQ license)</li>
                    </ul>
                    {s.licensing_status === 'NOT_CONFIGURED' && (
                      <div className="text-amber-300/90 text-[11px] pt-1">
                        ⚠ Proprietary SFG20 schedule content is NOT active. Contact EntireFM to configure the secure API connector.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-brand-edge-dark/60 pt-4 flex justify-between items-center text-[12px]">
                <span className="text-brand-mist/40 text-[11px]">Lineage ID: {s.id.substring(0, 8)}...</span>
                <button
                  className="rounded bg-brand-edge-dark px-3 py-1 text-[11.5px] font-normal text-brand-mist hover:bg-brand-void hover:text-white transition border border-brand-edge-dark"
                  disabled
                >
                  Configure Connector
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-brand-edge-dark/60 bg-brand-void/30 p-4 text-[11.5px] text-brand-mist/50">
        Note: API credentials and licence keys are managed securely at the server environment layer and are never exposed in the platform UI.
      </div>
    </div>
  );
}
