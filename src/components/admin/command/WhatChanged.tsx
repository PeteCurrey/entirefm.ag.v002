'use client';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface WhatChangedItem {
  type: string;
  description: string;
  occurred_at: string;
  severity: 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
  href?: string;
}

interface Props { items: WhatChangedItem[]; }

const SEVERITY_DOT: Record<string, string> = {
  CRITICAL: 'bg-[#DC2626]',
  WARNING: 'bg-[#D97706]',
  WATCH: 'bg-[#2563EB]',
  INFO: 'bg-[#9A9A95]',
};

export function WhatChanged({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[#E8E8E5] bg-[#FFFFFF] p-6 text-center">
        <div className="text-[11px] font-mono text-[#9A9A95] uppercase">No recent operational changes</div>
        <div className="text-[12px] text-[#6D6D68] mt-1">Changes across work orders, SLAs, and compliance will record here.</div>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] divide-y divide-[#E8E8E5] shadow-xs">
      {items.slice(0, 8).map((item, i) => (
        <div key={i} className="p-3.5 hover:bg-[#FAFAF8] transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${SEVERITY_DOT[item.severity] || 'bg-[#9A9A95]'}`} />
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#6D6D68] truncate">
                  {item.type}
                </span>
              </div>
              {item.href ? (
                <a href={item.href} className="text-[12.5px] font-normal text-[#111111] hover:text-[#EA580C] transition-colors line-clamp-2">
                  {item.description}
                </a>
              ) : (
                <div className="text-[12.5px] font-normal text-[#111111] line-clamp-2">
                  {item.description}
                </div>
              )}
            </div>
            <div className="text-[10.5px] font-mono text-[#9A9A95] shrink-0 pt-0.5">
              {new Date(item.occurred_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

