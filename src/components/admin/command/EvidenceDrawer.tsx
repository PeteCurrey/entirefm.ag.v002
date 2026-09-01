'use client';
import React, { useState } from 'react';
import type { EvidenceItem } from '@/server/ceo-command/types';

interface Props {
  evidence: EvidenceItem[];
  toolRuns?: Array<{ tool_id: string; domain: string; status: string; required_permission: string; permission_granted: boolean; executed_at: string; restriction_reason?: string }>;
  computedAt?: string;
}

const DATA_STATUS_STYLE: Record<string, string> = {
  LIVE: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
  STALE: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
  NO_DATA: 'text-[#6D6D68] bg-[#FAFAF8] border-[#E8E8E5]',
  NOT_CONFIGURED: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]',
  RESTRICTED: 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]',
  ZERO: 'text-[#6D6D68] bg-[#FAFAF8] border-[#E8E8E5]',
};

export function EvidenceDrawer({ evidence, toolRuns, computedAt }: Props) {
  const [open, setOpen] = useState(false);
  if (evidence.length === 0 && (!toolRuns || toolRuns.length === 0)) return null;

  return (
    <div className="mt-3 border-t border-[#E8E8E5] pt-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[11px] font-normal text-[#6D6D68] hover:text-[#111111] transition-colors"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
        <span>{open ? 'Hide Deterministic Evidence' : 'Show Deterministic Evidence'}</span>
        <span className="text-[#9A9A95]">
          ({evidence.length} metric{evidence.length === 1 ? '' : 's'}{toolRuns?.length ? `, ${toolRuns.length} telemetry run${toolRuns.length === 1 ? '' : 's'}` : ''})
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {evidence.length > 0 && (
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3.5 space-y-2">
              <div className="text-[10px] font-medium text-[#6D6D68] uppercase tracking-wider">Evidence Metrics Ledger</div>
              <div className="space-y-2 divide-y divide-[#E8E8E5]">
                {evidence.map((ev, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 text-[12px] pt-2 first:pt-0">
                    <div className="text-[#111111] flex-1 min-w-0">
                      <span className="font-normal">{ev.label}</span>
                      {ev.unit && <span className="text-[#6D6D68] ml-1">({ev.unit})</span>}
                      {ev.source_service && (
                        <div className="text-[10px] font-normal text-[#6D6D68] mt-0.5">{ev.source_service}</div>
                      )}
                      {ev.period && (
                        <div className="text-[10px] font-normal text-[#9A9A95]">{ev.period.label}: {ev.period.from} → {ev.period.to}</div>
                      )}
                      {ev.coverage_pct !== undefined && (
                        <div className={`text-[10px] font-normal${ev.coverage_pct >= 80 ? 'text-[#15803D]' : 'text-[#B45309]'}`}>
                          Data Coverage: {ev.coverage_pct}%
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#111111] font-medium">{typeof ev.value === 'number' ? ev.value.toLocaleString('en-GB') : String(ev.value ?? '—')}</div>
                      <div className={`text-[9.5px] font-normal px-1 py-0.2 rounded border inline-block mt-0.5${DATA_STATUS_STYLE[ev.data_status] || 'text-[#6D6D68]'}`}>
                        {ev.data_status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {toolRuns && toolRuns.length > 0 && (
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3.5 space-y-2">
              <div className="text-[10px] font-medium text-[#6D6D68] uppercase tracking-wider">Telemetry Runs</div>
              <div className="space-y-1.5">
                {toolRuns.map((tr, i) => (
                  <div key={i} className="flex items-center justify-between text-[11.5px] font-normal">
                    <span className="text-[#111111]">{tr.tool_id}</span>
                    <span className={`text-[9.5px] px-1 py-0.2 rounded border ${tr.status === 'OK' ? 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]' : 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]'}`}>
                      {tr.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {computedAt && (
            <div className="text-[10px] font-normal text-[#9A9A95] text-right">
              Computed: {new Date(computedAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
