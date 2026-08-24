'use client';

import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, CheckCircle, PieChart } from 'lucide-react';
import Link from 'next/link';

export function CommercialPosition() {
  const financialData = {
    spendMtd: 142600,
    committed: 48200,
    awaitingApproval: 12850,
    reactiveRatio: 32,
    plannedRatio: 68,
    budgetVariancePercent: -4.2, // favorable under budget
  };

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
              COMMERCIAL POSITION & SPEND
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

      <div className="p-5 space-y-4">
        {/* Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] uppercase text-[#686866]">Spend MTD</div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              £{(financialData.spendMtd / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-[#15803D] flex items-center gap-0.5 mt-0.5 font-medium">
              <TrendingDown className="h-3 w-3" />
              {Math.abs(financialData.budgetVariancePercent)}% under budget
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] uppercase text-[#686866]">Committed WIP</div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              £{(financialData.committed / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-[#686866] mt-0.5">PO generated</div>
          </div>

          <div className="rounded-[10px] border border-[#FED7AA] bg-[#FFF7ED] p-3">
            <div className="text-[10px] uppercase text-[#C2410C] font-semibold">Pending Approval</div>
            <div className="text-xl font-light text-[#C2410C] mt-1 tabular-nums">
              £{(financialData.awaitingApproval / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] text-[#C2410C] mt-0.5">3 quotes sign-off</div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] uppercase text-[#686866]">Planned vs Reactive</div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              {financialData.plannedRatio}% : {financialData.reactiveRatio}%
            </div>
            <div className="text-[10px] text-[#15803D] mt-0.5 font-medium">Target &gt;65% Planned</div>
          </div>
        </div>

        {/* Progress bar representing Planned vs Reactive balance */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11.5px] text-[#686866] font-mono">
            <span>Planned Preventive Maintenance ({financialData.plannedRatio}%)</span>
            <span>Reactive Remedials ({financialData.reactiveRatio}%)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#E4E4E1] overflow-hidden flex">
            <div
              style={{ width: `${financialData.plannedRatio}%` }}
              className="bg-[#15803D] h-full"
            />
            <div
              style={{ width: `${financialData.reactiveRatio}%` }}
              className="bg-[#FF6B24] h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
