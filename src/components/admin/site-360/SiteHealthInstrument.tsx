'use client';

import React from 'react';
import { ShieldCheck, Activity, Clock, Wrench, Zap, Flame } from 'lucide-react';

export function SiteHealthInstrument() {
  const dimensions = [
    { label: 'Compliance Assurance', value: 98.4, status: 'NOMINAL', color: 'bg-[#15803D]' },
    { label: 'Asset Reliability (MTBF)', value: 96.0, status: 'NOMINAL', color: 'bg-[#15803D]' },
    { label: 'SLA Achievement', value: 94.5, status: 'WARNING', color: 'bg-[#B45309]' },
    { label: 'PPM On-Time Completion', value: 99.2, status: 'NOMINAL', color: 'bg-[#15803D]' },
    { label: 'Reactive Volume Load', value: 78.0, status: 'ELEVATED', color: 'bg-[#FF6B24]' },
    { label: 'Energy Baseload Index', value: 91.5, status: 'NOMINAL', color: 'bg-[#15803D]' },
  ];

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
            SITE HEALTH TELEMETRY MATRIX
          </h3>
          <p className="text-[11.5px] text-[#686866]">
            Independent multi-dimensional performance telemetry
          </p>
        </div>
        <span className="font-mono text-[10px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] px-2 py-0.5 rounded-[4px] font-semibold">
          96.3 AGGREGATE
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] text-[#686866] uppercase">
              <span className="truncate pr-1">{dim.label}</span>
              <span className="font-semibold text-[#101010]">{dim.value}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#E4E4E1] overflow-hidden">
              <div
                style={{ width: `${dim.value}%` }}
                className={`h-full ${dim.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
