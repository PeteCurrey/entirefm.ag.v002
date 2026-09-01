import React from 'react';
import { getLiveSupplyChainGaps } from '@/server/suppliers/store';
import { GapAlertTable } from '@/components/admin/suppliers/GapAlertTable';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function SupplyChainGapsPage() {
  const gaps = await getLiveSupplyChainGaps();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
            RESILIENCE &amp; DEFICIT ANALYSIS
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supply Chain Gap Analysis Radar
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Deterministic deficit detection identifying cities with single-supplier concentration risks or zero approved contractors.
          </p>
        </div>

        <CsvExportButton
          data={gaps.map((g) => ({
            id: g.id,
            severity: g.severity,
            gap_type: g.gap_type,
            service: g.service_name,
            location: g.location,
            approved_count: g.approved_count,
            target_approved: g.target_approved,
            description: g.description,
          }))}
          filename="entirefm-supply-chain-gaps.csv"
        />
      </div>

      <GapAlertTable gaps={gaps} />
    </div>
  );
}
