'use client';
import React, { useState } from 'react';
import type { EnterpriseSignal } from '@/server/ceo-command/types';

interface Props { signals: EnterpriseSignal[]; }

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  WARNING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  WATCH: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  INFO: 'bg-brand-mist/10 text-brand-mist/50 border-brand-mist/20',
};

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, WARNING: 1, WATCH: 2, INFO: 3 };

export function NeedsAttentionSignals({ signals }: Props) {
  const [filter, setFilter] = useState<string>('ALL');
  const sorted = [...signals].sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));
  const filtered = filter === 'ALL' ? sorted : sorted.filter(s => s.severity === filter);

  if (signals.length === 0) {
    return (
      <div className="rounded-lg border border-brand-edge-dark/40 bg-brand-void/20 p-4 text-center min-h-[120px] flex flex-col items-center justify-center">
        <div className="text-[11px] font-mono text-emerald-500/50 uppercase">All clear</div>
        <div className="text-[11px] text-brand-mist/25 mt-1">No signals detected</div>
      </div>
    );
  }

  const critCount = signals.filter(s => s.severity === 'CRITICAL').length;
  const warnCount = signals.filter(s => s.severity === 'WARNING').length;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 text-[9px] font-mono">
        {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded border transition-colors ${filter === f ? 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange' : 'border-brand-edge-dark text-brand-mist/40 hover:border-brand-mist/30'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filtered.slice(0, 10).map((sig, i) => (
          <div key={sig.id || i} className={`rounded border p-3 ${SEVERITY_BADGE[sig.severity] || ''} border-opacity-50 bg-brand-void/10`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {sig.href ? (
                  <a href={sig.href} className="text-[12px] font-medium hover:underline line-clamp-2 text-current">
                    {sig.title}
                  </a>
                ) : (
                  <div className="text-[12px] font-medium line-clamp-2">{sig.title}</div>
                )}
                <div className="text-[11px] opacity-70 mt-0.5 line-clamp-2">{sig.description}</div>
              </div>
              <span className={`text-[9px] font-mono shrink-0 border rounded px-1.5 py-0.5 ${SEVERITY_BADGE[sig.severity] || ''}`}>
                {sig.severity}
              </span>
            </div>
            <div className="text-[9px] font-mono opacity-40 mt-1">{sig.domain} · {sig.source_rule.split(':')[0]}</div>
          </div>
        ))}
      </div>
      {critCount + warnCount > 0 && (
        <div className="text-[10px] font-mono text-brand-mist/30 mt-1">
          {critCount} critical · {warnCount} warning · {signals.length} total
        </div>
      )}
    </div>
  );
}
