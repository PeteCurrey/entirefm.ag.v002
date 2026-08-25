import React from 'react';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { LandscapeMatrixView } from '@/components/admin/suppliers/LandscapeMatrixView';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function SupplierLandscapePage() {
  const suppliers = await listSupplierOrganisations();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            MULTI-DIMENSIONAL STRATEGY MATRIX
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            The EntireFM Partnership Landscape
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Cross-discipline visibility of all approved contractors, regional SMEs, OEMs, and technology partners.
          </p>
        </div>

        <CsvExportButton
          data={suppliers.map((s) => ({
            id: s.id,
            legal_name: s.legal_name,
            trading_name: s.trading_name || '',
            relationship_level: s.relationship_level,
            compliance_status: s.compliance_status,
            city: s.headquarters_city,
            is_national: s.is_national,
            emergency_24_7: s.emergency_24_7,
            services: s.services.map((x) => x.service_name).join('; '),
          }))}
          filename="entirefm-supplier-landscape.csv"
          label="Export Landscape CSV"
        />
      </div>

      <LandscapeMatrixView suppliers={suppliers} />
    </div>
  );
}
