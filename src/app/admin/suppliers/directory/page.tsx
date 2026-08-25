import React from 'react';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { LandscapeMatrixView } from '@/components/admin/suppliers/LandscapeMatrixView';

export const dynamic = 'force-dynamic';

export default async function SupplierDirectoryPage() {
  const suppliers = await listSupplierOrganisations();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          AUTHORISED SUPPLY CHAIN DIRECTORY
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Supplier &amp; Contractor Directory
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Full directory listing across all verified contractors, regional SMEs, and national providers.
        </p>
      </div>

      <LandscapeMatrixView suppliers={suppliers} />
    </div>
  );
}
