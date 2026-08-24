'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export function ComplianceRadar() {
  const complianceData = {
    overallRate: 98.4,
    compliant: 142,
    dueIn30Days: 18,
    overdue: 2,
    evidenceRejected: 1,
    reviewRequired: 4,
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#15803D] text-white">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              STATUTORY COMPLIANCE RADAR
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              Real-time assurance against UK & SFG20 statutory obligations
            </p>
          </div>
        </div>

        <Link
          href="/admin/compliance/obligations"
          className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          Compliance Ledger →
        </Link>
      </div>

      <div className="p-5 flex flex-col md:flex-row items-center gap-6">
        {/* Precision Radial Gauge Instrument */}
        <div className="relative flex flex-col items-center justify-center shrink-0 w-36 h-36">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#E4E4E1"
              strokeWidth="8"
            />
            {/* Active stroke */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#16A34A"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40 * (complianceData.overallRate / 100)} ${2 * Math.PI * 40}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-light tracking-tight text-[#101010] tabular-nums">
              {complianceData.overallRate}%
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#15803D] font-semibold">
              ASSURED
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1 w-full font-mono text-[12px]">
          <div className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] text-[#686866] uppercase flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-[#15803D]" />
              Compliant
            </div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              {complianceData.compliant}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] text-[#686866] uppercase flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#B45309]" />
              Due in 30 Days
            </div>
            <div className="text-xl font-light text-[#B45309] mt-1 tabular-nums">
              {complianceData.dueIn30Days}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-3">
            <div className="text-[10px] text-[#B91C1C] uppercase flex items-center gap-1 font-semibold">
              <AlertTriangle className="h-3 w-3 text-[#DC2626]" />
              Overdue
            </div>
            <div className="text-xl font-semibold text-[#B91C1C] mt-1 tabular-nums">
              {complianceData.overdue}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] text-[#686866] uppercase flex items-center gap-1">
              <XCircle className="h-3 w-3 text-[#B91C1C]" />
              Rejected Evidence
            </div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              {complianceData.evidenceRejected}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
            <div className="text-[10px] text-[#686866] uppercase flex items-center gap-1">
              <FileText className="h-3 w-3 text-[#1D4ED8]" />
              Desk Review
            </div>
            <div className="text-xl font-light text-[#101010] mt-1 tabular-nums">
              {complianceData.reviewRequired}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#BBF7D0] bg-[#F0FDF4] p-3 flex flex-col justify-center">
            <div className="text-[10px] text-[#15803D] uppercase font-semibold">
              Audit Readiness
            </div>
            <div className="text-[11.5px] font-medium text-[#15803D] mt-0.5">
              100% Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
