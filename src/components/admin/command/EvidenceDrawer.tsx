'use client';
import React, { useState } from 'react';
import type { EvidenceItem } from '@/server/ceo-command/types';

interface Props {
  evidence: EvidenceItem[];
  toolRuns?: Array<{ tool_id: string; domain: string; status: string; required_permission: string; permission_granted: boolean; executed_at: string; restriction_reason?: string }>;
  computedAt?: string;
}

const DATA_STATUS_STYLE: Record<string, string> = {
  LIVE: 'text-emerald-400',
  STALE: 'text-amber-400',
  NO_DATA: 'text-brand-mist/40',
  NOT_CONFIGURED: 'text-sky-400/60',
  RESTRICTED: 'text-rose-400',
  ZERO: 'text-brand-mist/40',
  LICENSE_REQUIRED: 'text-amber-300',
};

export function EvidenceDrawer({ evidence, toolRuns, computedAt }: Props) {
  const [open, setOpen] = useState(false);
  if (evidence.length === 0 && (!toolRuns || toolRuns.length === 0)) return null;

  return (
    <div className="mt-3 border-t border-brand-edge-dark/30 pt-3">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-[10px] font-mono text-brand-mist/40 hover:text-brand-mist/60 transition-colors">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-mist/20" />
        {open ? 'Hide Evidence' : 'Show Evidence'} ({evidence.length} metric{evidence.length === 1 ? '' : 's'}{toolRuns?.length ? `, ${toolRuns.length} tool run${toolRuns.length === 1 ? '' : 's'}` : ''})
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {evidence.length > 0 && (
            <div className="rounded border border-brand-edge-dark/30 bg-brand-void/10 p-3">
              <div className="text-[9px] font-mono text-brand-mist/30 uppercase mb-2">Evidence Metrics</div>
              <div className="space-y-1.5">
                {evidence.map((ev, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 text-[11.5px]">
                    <div className="text-brand-mist/70 flex-1 min-w-0">
                      <span>{ev.label}</span>
                      {ev.unit && <span className="text-brand-mist/40 ml-1">({ev.unit})</span>}
                      {ev.source_service && (
                        <div className="text-[9px] font-mono text-brand-mist/30 mt-0.5">{ev.source_service}</div>
                      )}
                      {ev.period && (
                        <div className="text-[9px] font-mono text-brand-mist/25">{ev.period.label}: {ev.period.from} → {ev.period.to}</div>
                      )}
                      {ev.coverage_pct !== undefined && (
                        <div className={`text-[9px] font-mono ${ev.coverage_pct >= 80 ? 'text-emerald-400/60' : 'text-amber-400/60'}`}>
                          Coverage: {ev.coverage_pct}%
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-mono">{typeof ev.value === 'number' ? ev.value.toLocaleString('en-GB') : String(ev.value ?? '—')}</div>
                      <div className={`text-[9px] font-mono ${DATA_STATUS_STYLE[ev.data_status] || 'text-brand-mist/40'}`}>{ev.data_status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {toolRuns && toolRuns.length > 0 && (
            <div className="rounded border border-brand-edge-dark/30 bg-brand-void/10 p-3">
              <div className="text-[9px] font-mono text-brand-mist/30 uppercase mb-2">Tool Runs</div>
              <div className="space-y-1.5">
                {toolRuns.map((run, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 text-[11px]">
                    <div className="font-mono text-brand-mist/60 flex-1 min-w-0 truncate">
                      {run.tool_id}
                      <span className="text-brand-mist/30 ml-2">[{run.domain}]</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-mono text-brand-mist/30">{run.required_permission}</span>
                      <span className={`text-[9px] font-mono ${run.status === 'SUCCESS' ? 'text-emerald-400' : run.status === 'RESTRICTED' ? 'text-rose-400' : run.status === 'EMPTY' ? 'text-brand-mist/40' : 'text-amber-400'}`}>
                        {run.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {computedAt && (
            <div className="text-[9px] font-mono text-brand-mist/25">
              Computed: {new Date(computedAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
