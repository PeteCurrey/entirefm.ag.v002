'use client';
import React from 'react';

interface WhatChangedItem {
  type: string;
  description: string;
  occurred_at: string;
  severity: 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
  href?: string;
}

interface Props { items: WhatChangedItem[]; }

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'text-rose-400',
  WARNING: 'text-amber-400',
  WATCH: 'text-sky-400',
  INFO: 'text-brand-mist/60',
};

export function WhatChanged({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-brand-edge-dark/40 bg-brand-void/20 p-4 text-center min-h-[120px] flex flex-col items-center justify-center">
        <div className="text-[11px] font-mono text-brand-mist/30 uppercase">No recent changes</div>
        <div className="text-[11px] text-brand-mist/25 mt-1">No operational events detected</div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.slice(0, 8).map((item, i) => (
        <div key={i} className="rounded border border-brand-edge-dark/40 bg-brand-void/20 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-brand-mist/35 truncate">{item.type}</div>
              {item.href ? (
                <a href={item.href} className="text-[12px] text-brand-mist/80 hover:text-white transition-colors line-clamp-2">
                  {item.description}
                </a>
              ) : (
                <div className="text-[12px] text-brand-mist/80 line-clamp-2">{item.description}</div>
              )}
            </div>
            <span className={`text-[9px] font-mono shrink-0 pt-0.5 ${SEVERITY_STYLES[item.severity] || 'text-brand-mist/40'}`}>
              {item.severity}
            </span>
          </div>
          <div className="text-[10px] font-mono text-brand-mist/25 mt-1">
            {new Date(item.occurred_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
}
