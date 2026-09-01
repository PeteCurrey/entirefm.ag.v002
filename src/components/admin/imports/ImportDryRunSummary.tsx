'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Copy } from 'lucide-react';
import { DataImportPreviewSummary } from '@/server/data-import/types';

interface ImportDryRunSummaryProps {
  preview: DataImportPreviewSummary;
}

export function ImportDryRunSummary({ preview }: ImportDryRunSummaryProps) {
  const canProceed = preview.validRows > 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-normal">
        {[
          { label: 'Total Rows', value: preview.totalRows, color: 'text-[#101010]' },
          { label: 'Valid → Import', value: preview.validRows, color: 'text-[#15803D]' },
          { label: 'Errors (Blocked)', value: preview.errorRows, color: preview.errorRows > 0 ? 'text-[#DC2626]' : 'text-[#9B9B97]' },
          { label: 'Duplicates', value: preview.duplicateRows, color: preview.duplicateRows > 0 ? 'text-[#D97706]' : 'text-[#9B9B97]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-3.5 text-center">
            <div className={`text-[24px] font-light tabular-nums ${color}`}>{value}</div>
            <div className="text-[10.5px] uppercase text-[#9B9B97] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Readiness Status */}
      <div className={`flex items-start gap-3 rounded-[12px] border p-4 ${
        canProceed
          ? 'border-[#BBF7D0] bg-[#F0FDF4]'
          : 'border-[#FECACA] bg-[#FEF2F2]'
      }`}>
        {canProceed ? (
          <CheckCircle2 className="h-5 w-5 text-[#15803D] shrink-0 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" />
        )}
        <div>
          <p className={`font-light text-[13px] ${canProceed ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
            {canProceed
              ? `Ready to import ${preview.validRows} records`
              : 'Import blocked — resolve all errors before proceeding'}
          </p>
          {preview.errorRows > 0 && (
            <p className="text-[12px] text-[#9B9B97] mt-0.5">
              {preview.errorRows} rows contain critical errors and will be skipped.
            </p>
          )}
          {preview.duplicateRows > 0 && (
            <p className="text-[12px] text-[#9B9B97] mt-0.5">
              {preview.duplicateRows} rows match existing records (will be skipped by default).
            </p>
          )}
        </div>
      </div>

      {/* Sample Preview Table */}
      {preview.sampleMappedRows.length > 0 && (
        <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
            <h4 className="text-[11px] font-normal uppercase tracking-wider text-[#101010]">
              IMPORT PREVIEW — FIRST {preview.sampleMappedRows.length} ROWS
            </h4>
          </div>
          <div className="divide-y divide-[#E4E4E1]">
            {preview.sampleMappedRows.map((row) => (
              <div key={row.rowIndex} className="flex items-start gap-3 px-5 py-3.5">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-normal ${
                  row.status === 'VALID' ? 'bg-[#F0FDF4] text-[#15803D]' :
                  row.status === 'INVALID' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                  row.status === 'DUPLICATE' ? 'bg-[#FFFBEB] text-[#D97706]' :
                  'bg-[#F0F0EE] text-[#686866]'
                }`}>
                  {row.rowIndex}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-normal text-[13px] text-[#101010] truncate">{row.displayName}</p>
                    <span className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[10px] font-normal ${
                      row.status === 'VALID' ? 'bg-[#F0FDF4] text-[#15803D]' :
                      row.status === 'INVALID' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                      row.status === 'DUPLICATE' ? 'bg-[#FFFBEB] text-[#D97706]' :
                      'bg-[#F0F0EE] text-[#686866]'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#686866] mt-0.5">{row.details}</p>
                  {row.issues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {row.issues.map((iss, i) => (
                        <span key={i} className="text-[10.5px] text-[#DC2626] bg-[#FEF2F2] rounded-[4px] px-1.5 py-0.5 border border-[#FECACA]">
                          {iss}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
