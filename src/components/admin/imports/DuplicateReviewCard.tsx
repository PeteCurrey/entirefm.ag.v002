'use client';

import React from 'react';
import { Copy, AlertTriangle, ArrowRight } from 'lucide-react';
import { DataImportRow } from '@/server/data-import/types';

interface DuplicateReviewCardProps {
  row: DataImportRow;
  existingRecordName?: string;
  onAction?: (action: 'SKIP' | 'UPDATE' | 'IMPORT_AS_NEW') => void;
}

export function DuplicateReviewCard({
  row,
  existingRecordName,
  onAction,
}: DuplicateReviewCardProps) {
  const mapped = row.mapped_data || {};
  const displayName = mapped.name || mapped.company_name || mapped.address_line1 || `Row #${row.row_index}`;
  const extId = row.external_id || mapped.external_id;

  return (
    <div className="rounded-[14px] border border-[#FDE68A] bg-[#FFFBEB] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#D97706] text-white">
            <Copy className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-normal text-[#B45309]">ROW #{row.row_index}</span>
              {extId && (
                <span className="rounded-[4px] bg-[#FEF3C7] border border-[#FDE68A] px-1.5 py-0.5 font-mono text-[10px] text-[#92400E]">
                  ID: {extId}
                </span>
              )}
            </div>
            <h4 className="font-light text-[13.5px] text-[#92400E] mt-0.5">{displayName}</h4>
          </div>
        </div>
        <span className="rounded-[5px] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 font-mono text-[10px] font-normal text-[#92400E]">
          DUPLICATE
        </span>
      </div>

      <div className="rounded-[8px] bg-[#FFFFFF] border border-[#FDE68A] p-3 text-[12px] space-y-1">
        <div className="flex items-center justify-between text-[#686866]">
          <span>Matching Existing Record:</span>
          <span className="font-medium text-[#101010]">{existingRecordName || 'Existing Record with Same External ID'}</span>
        </div>
        <div className="flex items-center justify-between text-[#686866]">
          <span>Action on Commit:</span>
          <span className="font-mono text-[11px] text-[#B45309]">Will be skipped (idempotent protection)</span>
        </div>
      </div>

      {onAction && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onAction('SKIP')}
            className="rounded-[6px] bg-[#FFFFFF] border border-[#E4E4E1] px-3 py-1 text-[11.5px] font-normal text-[#686866] hover:text-[#101010]"
          >
            Keep Skipped
          </button>
        </div>
      )}
    </div>
  );
}
