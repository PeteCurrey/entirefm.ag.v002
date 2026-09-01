import React from 'react';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { CoverageHeatmap } from '@/components/admin/suppliers/CoverageHeatmap';

export const dynamic = 'force-dynamic';

export default async function CoverageMatrixPage() {
  const suppliers = await listSupplierOrganisations();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          GEOGRAPHIC &amp; SERVICE CAPABILITY MATRIX
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Supply Chain Coverage &amp; Depth Radar
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Compare verified approved supplier depth against minimum commercial targets across EntireFM core operating cities.
        </p>
      </div>

      <CoverageHeatmap suppliers={suppliers} />
    </div>
  );
}
