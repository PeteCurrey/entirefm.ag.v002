'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ComplianceRadarProps {
  overallRate: number | null;
  compliant: number | null;
  dueIn30Days: number | null;
  overdue: number | null;
  evidenceRejected: number | null;
  reviewRequired: number | null;
}

export function ComplianceRadar({
  overallRate,
  compliant,
  dueIn30Days,
  overdue,
  evidenceRejected,
  reviewRequired,
}: ComplianceRadarProps) {
  const hasData = overallRate !== null;
  const strokeDasharray = hasData ? `${overallRate! * 2.827} 282.7` : '0 282.7';

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#15803D] text-white">
            <ShieldCheck className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
              Statutory Compliance Radar
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              Assurance against UK &amp; SFG20 statutory obligations
            </p>
          </div>
        </div>
        <Link
          href="/admin/compliance/obligations"
          className="text-[11.5px] font-normal text-[#6D6D68] hover:text-[#111111] transition-colors"
        >
          Compliance Ledger →
        </Link>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[#9A9A95]" />
          <p className="font-normal text-[#111111] text-[13px]">No compliance obligations configured</p>
          <p className="text-[12px] text-[#6D6D68]">
            Configure obligations or import site data to see compliance status.
          </p>
          <Link
            href="/admin/compliance/obligations"
            className="mt-2 inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3 py-1.5 text-[11.5px] font-normal text-white hover:bg-[#252525] transition-colors"
          >
            Configure Obligations
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4">
          {/* Radial Gauge */}
          <div className="relative flex flex-col items-center justify-center shrink-0 w-32 h-32">

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E8E8E5" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={overallRate! >= 95 ? '#15803D' : overallRate! >= 80 ? '#D97706' : '#DC2626'}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-[22px] font-light tabular-nums text-[#111111]">
                {overallRate!.toFixed(1)}%
              </div>
              <div className="text-[9.5px] uppercase tracking-wider text-[#6D6D68]">Compliant</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="flex-1 grid grid-cols-2 gap-2 text-[12px] w-full">
            {[
              { label: 'Compliant', value: compliant, icon: CheckCircle2, color: 'text-[#15803D]' },
              { label: 'Due 30 Days', value: dueIn30Days, icon: Clock, color: 'text-[#B45309]' },
              { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-[#DC2626]' },
              { label: 'Review Required', value: reviewRequired, icon: XCircle, color: 'text-[#6D6D68]' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-3 w-3 ${color}`} />
                  <span className="text-[10px] uppercase font-medium text-[#6D6D68]">{label}</span>
                </div>
                <div className={`text-[16px] font-normal tabular-nums ${color}`}>
                  {value !== null ? value : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
