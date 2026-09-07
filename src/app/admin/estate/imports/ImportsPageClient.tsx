'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, FileSpreadsheet, Building2, Users, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { BulkUploadModal } from '@/components/admin/estate/BulkUploadModal';

const FORMAT_COLOURS: Record<string, string> = {
  XLSX: 'bg-indigo-900/40 text-indigo-300',
  CSV: 'bg-blue-900/40 text-blue-300',
  COBIE: 'bg-purple-900/40 text-purple-300',
  DOCUMENT_OCR: 'bg-amber-900/40 text-amber-300',
  MANUAL: 'bg-[#F5F5F3] text-[#6D6D68]',
};

const STATUS_COLOURS: Record<string, string> = {
  DRAFT: 'bg-[#F5F5F3] text-[#6D6D68]',
  MAPPED: 'bg-amber-900/40 text-amber-300',
  VALIDATING: 'bg-blue-900/40 text-blue-300',
  READY_FOR_PREVIEW: 'bg-cyan-900/40 text-cyan-300',
  COMMITTED: 'bg-emerald-900/40 text-emerald-300',
  ROLLED_BACK: 'bg-red-900/40 text-red-300',
  FAILED: 'bg-red-900/40 text-red-400',
};

interface ImportsPageClientProps {
  initialBatches: any[];
}

export function ImportsPageClient({ initialBatches }: ImportsPageClientProps) {
  const [batches, setBatches] = useState(initialBatches);
  const [uploadType, setUploadType] = useState<'clients' | 'sites' | null>(null);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate"
        title="Estate & Asset Ingestion Hub"
        description="Unified bulk upload and ingestion engine for Clients, Managed Sites, and Equipment Registers with validation and automatic linkage."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Users className="h-3.5 w-3.5" />}
              onClick={() => setUploadType('clients')}
            >
              Bulk Upload Clients
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Building2 className="h-3.5 w-3.5" />}
              onClick={() => setUploadType('sites')}
            >
              Bulk Upload Sites
            </Button>
          </div>
        }
      />

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FF6B24] font-semibold text-[13.5px]">
              <Users className="h-4 w-4" />
              Client Ingestion Engine
            </div>
            <p className="text-[12.5px] text-[#686866] mt-2">
              Import customer accounts, commercial agreements, tiers, phone numbers, and emails directly from CSV spreadsheets.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E1] flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="h-3.5 w-3.5" />}
              onClick={() => setUploadType('clients')}
            >
              Upload Clients CSV
            </Button>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FF6B24] font-semibold text-[13.5px]">
              <Building2 className="h-4 w-4" />
              Facility & Site Ingestion Engine
            </div>
            <p className="text-[12.5px] text-[#686866] mt-2">
              Import property facilities, addresses, postal codes, and automatically link them to existing client accounts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E4E4E1] flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={<Upload className="h-3.5 w-3.5" />}
              onClick={() => setUploadType('sites')}
            >
              Upload Sites CSV
            </Button>
          </div>
        </div>
      </div>

      {batches.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E4E4E1] bg-[#FFFFFF]">
          <table className="w-full min-w-[80rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E4E1] bg-[#F9F9F8] font-medium text-[10.5px] uppercase tracking-wider text-[#686866]">
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
            <tbody className="divide-y divide-[#E4E4E1]">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-[#F9F9F8]">
                  <td className="px-5 py-4 font-mono text-[11px] text-[#101010]">{b.batch_number}</td>
                  <td className="px-5 py-4 text-[#101010]">{b.file_name}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-medium text-[10px] ${FORMAT_COLOURS[b.source_format] ?? 'bg-[#F0F0EE] text-[#686866]'}`}>
                      {b.source_format}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded px-2 py-0.5 font-medium text-[10px] ${STATUS_COLOURS[b.status] ?? 'bg-[#F0F0EE] text-[#686866]'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-[#686866]">{b.total_rows}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-emerald-600">{b.ready_rows}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-amber-600">{b.review_rows}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-orange-600">{b.duplicate_rows}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-blue-600">{b.imported_rows}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-[#686866]">
                    {new Date(b.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Asset Import Batches"
          description="Use the buttons above to bulk upload client organisations or managed sites."
        />
      )}

      {/* Bulk Upload Modal */}
      {uploadType && (
        <BulkUploadModal
          isOpen={true}
          onClose={() => setUploadType(null)}
          type={uploadType}
        />
      )}
    </div>
  );
}
