'use client';
import React, { useState } from 'react';
import type { EnterpriseSignal } from '@/server/ceo-command/types';
import { ArrowRight } from 'lucide-react';
import { StatusDot } from '@/components/admin/DataTable';

interface Props { signals: EnterpriseSignal[]; }

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, WARNING: 1, WATCH: 2, INFO: 3 };

export function NeedsAttentionSignals({ signals }: Props) {
  const [filter, setFilter] = useState<string>('ALL');
  const sorted = [...signals].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));
  const filtered = filter === 'ALL' ? sorted : sorted.filter(s => s.severity === filter);

  if (signals.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[#E8E8E5] bg-[#FFFFFF] p-6 text-center">
        <div className="text-[11px] font-normal text-[#15803D] uppercase">● All clear</div>
        <div className="text-[12px] text-[#6D6D68] mt-1">No critical operational exceptions currently detected across the estate.</div>
      </div>
    );
  }

  const critCount = signals.filter(s => s.severity === 'CRITICAL').length;
  const warnCount = signals.filter(s => s.severity === 'WARNING').length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-[11px]">
          {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded-[4px] border font-normal text-[10px] transition-colors ${
                filter === f
                  ? 'bg-[#FFFFFF] border-[#E8E8E5] text-[#111111] font-medium shadow-xs'
                  : 'border-transparent text-[#6D6D68] hover:bg-[#FAFAF8] hover:text-[#111111]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="font-normal text-[10.5px] text-[#9A9A95]">
          {critCount > 0 && <span className="text-[#B91C1C] mr-1.5">{critCount} critical</span>}
          {signals.length} total
        </span>
      </div>

      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] divide-y divide-[#E8E8E5] shadow-xs max-h-[420px] overflow-y-auto">
        {filtered.slice(0, 10).map((sig, i) => {
          const statusType = sig.severity === 'CRITICAL' ? 'critical' : sig.severity === 'WARNING' ? 'warning' : 'neutral';
          const indexRank = String(i + 1).padStart(2, '0');

          return (
            <div key={sig.id || i} className="p-3.5 hover:bg-[#FAFAF8] transition-colors flex items-start gap-3">
              <span className="font-normal text-[11.5px] text-[#9A9A95] pt-0.5 shrink-0">
                {indexRank}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={statusType} />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#6D6D68]">
                      {sig.domain}
                    </span>
                  </div>
                  <span className={`text-[9.5px] font-normal px-1.5 py-0.2 rounded border ${
                    sig.severity === 'CRITICAL'
                      ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                      : sig.severity === 'WARNING'
                      ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                      : 'bg-[#FAFAF8] text-[#6D6D68] border-[#E8E8E5]'
                  }`}>
                    {sig.severity}
                  </span>
                </div>

                <div className="text-[12.5px] font-normal text-[#111111] mt-1">
                  {sig.title}
                </div>
                <div className="text-[11.5px] text-[#6D6D68] mt-0.5 line-clamp-2 leading-relaxed">
                  {sig.description}
                </div>

                {sig.href && (
                  <a
                    href={sig.href}
                    className="inline-flex items-center gap-1 text-[11.5px] text-[#EA580C] hover:text-[#C2410C] hover:underline mt-1.5 font-normal"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

