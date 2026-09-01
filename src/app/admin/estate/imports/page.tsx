import React from 'react';
import { listImportBatches } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

const FORMAT_COLOURS: Record<string, string> = {
  XLSX: 'bg-indigo-900/40 text-indigo-300',
  CSV: 'bg-blue-900/40 text-blue-300',
  COBIE: 'bg-purple-900/40 text-purple-300',
  DOCUMENT_OCR: 'bg-amber-900/40 text-amber-300',
  MANUAL: 'bg-brand-edge-dark text-brand-mist/60',
};

const STATUS_COLOURS: Record<string, string> = {
  DRAFT: 'bg-brand-edge-dark text-brand-mist/60',
  MAPPED: 'bg-amber-900/40 text-amber-300',
  VALIDATING: 'bg-blue-900/40 text-blue-300',
  READY_FOR_PREVIEW: 'bg-cyan-900/40 text-cyan-300',
  COMMITTED: 'bg-emerald-900/40 text-emerald-300',
  ROLLED_BACK: 'bg-red-900/40 text-red-300',
  FAILED: 'bg-red-900/40 text-red-400',
};

export default async function ImportsPage() {
  const batches = await listImportBatches().catch(() => []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Asset Imports"
        description="Manage XLSX, CSV, and COBie import batches with full lineage and rollback support."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo">
            + New Import
          </button>
        }
      />

      {batches.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[80rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">File Name</th>
                <th className="px-5 py-3">Format</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Ready</th>
                <th className="px-4 py-3 text-right">Review</th>
                <th className="px-4 py-3 text-right">Duplicate</th>
                <th className="px-4 py-3 text-right">Imported</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {batches.map((b) => (
                <tr key={b.id} className="text-brand-mist/80 hover:bg-brand-void/40">
                  <td className="px-5 py-4 font-normal text-[11px] text-white">{b.batch_number}</td>
                  <td className="px-5 py-4 text-brand-mist/80">{b.file_name}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${FORMAT_COLOURS[b.source_format] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {b.source_format}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${STATUS_COLOURS[b.status] ?? 'bg-brand-edge-dark text-brand-mist/60'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-brand-mist/70">{b.total_rows}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-emerald-400">{b.ready_rows}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-amber-400">{b.review_rows}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-orange-400">{b.duplicate_rows}</td>
                  <td className="px-4 py-4 text-right font-normal text-[11px] text-blue-400">{b.imported_rows}</td>
                  <td className="px-5 py-4 font-normal text-[11px] text-brand-mist/50">
                    {new Date(b.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Import Batches"
          description="Upload a client asset spreadsheet (XLSX or CSV) to begin AI-assisted estate onboarding."
        />
      )}
    </div>
  );
}
