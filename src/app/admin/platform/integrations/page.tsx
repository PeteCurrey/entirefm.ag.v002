import React from 'react';
import { listMaintenanceSources } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

const LICENSING_COLOURS: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  NOT_CONFIGURED: 'bg-amber-50 text-amber-700 border-amber-200',
  EXPIRED: 'bg-red-50 text-red-700 border-red-200',
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
              className="flex flex-col justify-between rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-6 space-y-6"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-light text-[#111111] text-[15px]">{s.name}</h3>
                    <div className="text-[12px] text-[#6D6D68] mt-0.5">Provider: {s.provider}</div>
                  </div>
                  <span className={`rounded px-2.5 py-1 font-normal text-[10.5px] border${LICENSING_COLOURS[s.licensing_status] ?? 'bg-[#F5F5F3] text-[#6D6D68] border-[#E8E8E5]'}`}>
                    {s.licensing_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11.5px] font-normal text-[#6D6D68] border-t border-[#E8E8E5] pt-4">
                  <div>Code: <span className="text-[#111111]">{s.code}</span></div>
                  <div>Version: <span className="text-[#111111]">{s.version}</span></div>
                  <div>Type: <span className="text-[#111111]">{s.source_type}</span></div>
                  <div>Effective: <span className="text-[#111111]">{s.effective_date}</span></div>
                </div>

                {isSFG20 && (
                  <div className="mt-5 rounded bg-[#FAFAF8] p-3.5 text-[11.5px] text-[#6D6D68] space-y-2 border border-[#E8E8E5]">
                    <div className="font-light text-[#111111]">Capabilities & Governance:</div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside text-[#6D6D68]">
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

              <div className="border-t border-[#E8E8E5] pt-4 flex justify-between items-center text-[12px]">
                <span className="text-[#9A9A95] text-[11px]">Lineage ID: {s.id.substring(0, 8)}...</span>
                <button
                  className="rounded bg-[#F5F5F3] px-3 py-1 text-[11.5px] font-normal text-[#111111] hover:bg-[#FAFAF8] hover:text-white transition border border-[#E8E8E5]"
                  disabled
                >
                  Configure Connector
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-[#E8E8E5] bg-[#FAFAF8] p-4 text-[11.5px] text-[#9A9A95]">
        Note: API credentials and licence keys are managed securely at the server environment layer and are never exposed in the platform UI.
      </div>
    </div>
  );
}
