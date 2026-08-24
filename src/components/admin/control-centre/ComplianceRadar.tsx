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
              Real-time assurance against UK &amp; SFG20 statutory obligations
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

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
          <ShieldCheck className="h-7 w-7 text-[#D0D0CD]" />
          <p className="font-medium text-[#686866] text-[13px]">No compliance obligations configured</p>
          <p className="text-[12px] text-[#9B9B97]">
            Configure obligations or import site data to see compliance status.
          </p>
          <Link
            href="/admin/compliance/obligations"
            className="mt-1 text-[12px] font-medium text-[#FF6B24] hover:underline"
          >
            Configure Obligations →
          </Link>
        </div>
      ) : (
        <div className="p-5 flex flex-col md:flex-row items-center gap-6">
          {/* Radial Gauge */}
          <div className="relative flex flex-col items-center justify-center shrink-0 w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E4E4E1" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={overallRate! >= 95 ? '#15803D' : overallRate! >= 80 ? '#D97706' : '#DC2626'}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className="font-mono text-[22px] font-light tabular-nums text-[#101010]">
                {overallRate!.toFixed(1)}%
              </div>
              <div className="text-[9.5px] font-mono uppercase tracking-wider text-[#686866]">Compliant</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="flex-1 grid grid-cols-2 gap-2 font-mono text-[12px] w-full">
            {[
              { label: 'Compliant', value: compliant, icon: CheckCircle2, color: 'text-[#15803D]' },
              { label: 'Due 30 Days', value: dueIn30Days, icon: Clock, color: 'text-[#D97706]' },
              { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-[#DC2626]' },
              { label: 'Review Required', value: reviewRequired, icon: XCircle, color: 'text-[#686866]' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`h-3 w-3 ${color}`} />
                  <span className="text-[10px] uppercase text-[#686866]">{label}</span>
                </div>
                <div className={`text-[18px] font-light tabular-nums ${color}`}>
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
