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
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#101010] text-white">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              COMMERCIAL POSITION &amp; SPEND
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              Real-time expenditure, WIP ledger, and budget performance
            </p>
          </div>
        </div>
        <Link
          href="/admin/commercial"
          className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          Commercial Hub →
        </Link>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
          <DollarSign className="h-7 w-7 text-[#D0D0CD]" />
          <p className="font-medium text-[#686866] text-[13px]">No financial data available</p>
          <p className="text-[12px] text-[#9B9B97]">
            Work orders with WIP billing status will appear here.
          </p>
          <Link
            href="/admin/operations/work-orders"
            className="mt-1 text-[12px] font-medium text-[#FF6B24] hover:underline"
          >
            View Work Orders →
          </Link>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
              <div className="text-[10px] uppercase text-[#686866]">Unbilled WIP</div>
              <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
                {spendMtd !== null ? `£${(spendMtd / 1000).toFixed(1)}k` : '—'}
              </div>
            </div>
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
              <div className="text-[10px] uppercase text-[#686866]">Committed WIP</div>
              <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
                {committed !== null ? `£${(committed / 1000).toFixed(1)}k` : '—'}
              </div>
            </div>
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
              <div className="text-[10px] uppercase text-[#686866]">Awaiting Approval</div>
              <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
                {awaitingApproval !== null ? `£${(awaitingApproval / 1000).toFixed(1)}k` : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
