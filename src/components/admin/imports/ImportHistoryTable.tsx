'use client';

import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DataImportBatch } from '@/server/data-import/types';

interface ImportHistoryTableProps {
  batches: DataImportBatch[];
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'text-[#15803D]' },
  COMPLETED_WITH_ERRORS: { label: 'Completed w/ Errors', icon: AlertTriangle, color: 'text-[#D97706]' },
  VALIDATION_FAILED: { label: 'Validation Failed', icon: XCircle, color: 'text-[#DC2626]' },
  FAILED: { label: 'Failed', icon: XCircle, color: 'text-[#DC2626]' },
  ROLLED_BACK: { label: 'Rolled Back', icon: RotateCcw, color: 'text-[#686866]' },
  UPLOADED: { label: 'Uploaded', icon: Clock, color: 'text-[#1D4ED8]' },
  MAPPING_REQUIRED: { label: 'Awaiting Mapping', icon: Clock, color: 'text-[#D97706]' },
  READY_FOR_REVIEW: { label: 'Ready to Review', icon: CheckCircle2, color: 'text-[#1D4ED8]' },
  IMPORTING: { label: 'Importing…', icon: Clock, color: 'text-[#1D4ED8]' },
  VALIDATING: { label: 'Validating…', icon: Clock, color: 'text-[#686866]' },
};

export function ImportHistoryTable({ batches }: ImportHistoryTableProps) {
  if (batches.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-10 text-center">
        <Clock className="h-7 w-7 text-[#D0D0CD] mx-auto mb-3" />
        <p className="font-normal text-[#686866]">No imports yet</p>
        <p className="text-[12px] text-[#9B9B97] mt-1">Your import history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <h3 className="text-[11px] font-normal uppercase tracking-wider text-[#101010]">
          IMPORT HISTORY — {batches.length} BATCH{batches.length !== 1 ? 'ES' : ''}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#E4E4E1] bg-[#F9F9F8] font-normal text-[10.5px] uppercase text-[#686866]">
            <tr>
              <th className="px-5 py-3">Reference</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rows</th>
              <th className="px-4 py-3">Imported</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E1]">
            {batches.map((batch) => {
              const sc = statusConfig[batch.status] || statusConfig['UPLOADED'];
              const Icon = sc.icon;
              return (
                <tr key={batch.id} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="px-5 py-3.5 text-[12px] font-normal text-[#101010]">
                    {batch.batch_reference}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-[5px] bg-[#F0F0EE] px-2 py-0.5 font-normal text-[10.5px] text-[#686866]">
                      {batch.entity_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-normal text-[11px] text-[#686866]">
                    {batch.source_system}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className={`flex items-center gap-1.5 ${sc.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[12px] font-normal">{sc.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-normal tabular-nums text-[#686866]">
                    {batch.total_rows}
                  </td>
                  <td className="px-4 py-3.5 font-normal tabular-nums text-[#15803D]">
                    {batch.imported_rows}
                  </td>
                  <td className="px-4 py-3.5 font-normal text-[11px] text-[#9B9B97]">
                    {new Date(batch.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/platform/imports/${batch.id}/result`}
                      className="inline-flex items-center gap-0.5 text-[12px] font-normal text-[#FF6B24] hover:text-[#E9540F] transition-colors"
                    >
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
