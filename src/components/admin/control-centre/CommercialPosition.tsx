'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import Link from 'next/link';

interface CommercialPositionProps {
  spendMtd: number | null;
  committed: number | null;
  awaitingApproval: number | null;
}

export function CommercialPosition({ spendMtd, committed, awaitingApproval }: CommercialPositionProps) {
  const hasData = spendMtd !== null || committed !== null;

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <DollarSign className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold text-[#111111] uppercase tracking-wide">
              Commercial Position &amp; Spend
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              Expenditure, WIP ledger, and committed works
            </p>
          </div>
        </div>
        <Link
          href="/admin/commercial"
          className="text-[11.5px] font-medium text-[#6D6D68] hover:text-[#111111] transition-colors"
        >
          Commercial Hub →
        </Link>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
          <DollarSign className="h-6 w-6 text-[#9A9A95]" />
          <p className="font-medium text-[#111111] text-[13px]">No financial data available</p>
          <p className="text-[12px] text-[#6D6D68]">
            Work orders with WIP billing status will appear here.
          </p>
          <Link
            href="/admin/operations/work-orders"
            className="mt-2 inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3 py-1.5 text-[11.5px] font-medium text-white hover:bg-[#252525] transition-colors"
          >
            View Work Orders
          </Link>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3">
              <div className="text-[10px] uppercase font-medium text-[#6D6D68]">Unbilled WIP</div>
              <div className="text-xl font-semibold text-[#111111] mt-1 tabular-nums">
                {spendMtd !== null ? `£${spendMtd.toLocaleString()}` : '£0'}
              </div>
            </div>
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3">
              <div className="text-[10px] uppercase font-medium text-[#6D6D68]">Committed</div>
              <div className="text-xl font-semibold text-[#111111] mt-1 tabular-nums">
                {committed !== null ? `£${committed.toLocaleString()}` : '—'}
              </div>
            </div>
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3 col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-medium text-[#6D6D68]">Awaiting Approval</div>
              <div className="text-xl font-semibold text-[#B45309] mt-1 tabular-nums">
                {awaitingApproval !== null ? `£${awaitingApproval.toLocaleString()}` : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
