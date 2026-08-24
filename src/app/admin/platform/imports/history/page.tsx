import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listImportBatches } from '@/server/data-import';
import { ImportHistoryTable } from '@/components/admin/imports/ImportHistoryTable';
import { FileUp, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ImportHistoryPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const batches = await listImportBatches(session).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/platform/imports" className="text-[12px] text-[#686866] hover:text-[#101010] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Migration Centre
            </Link>
          </div>
          <h1 className="text-[22px] font-semibold text-[#101010]">Import History & Audit Log</h1>
          <p className="text-[13.5px] text-[#686866] mt-0.5">
            Complete provenance and reconciliation ledger of all past data imports.
          </p>
        </div>
        <Link
          href="/admin/platform/imports/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#E9540F] transition-colors shadow-sm shrink-0"
        >
          <FileUp className="h-4 w-4" />
          New Import
        </Link>
      </div>

      <ImportHistoryTable batches={batches} />
    </div>
  );
}
