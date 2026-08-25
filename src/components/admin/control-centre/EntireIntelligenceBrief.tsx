'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, CornerDownLeft, ShieldAlert, ArrowUpRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export interface IntelligenceItem {
  id: string;
  category: 'ANOMALY' | 'RESOURCE_GAP' | 'SPEND_SPIKE';
  title: string;
  insight: string;
  recommendation: string;
  evidenceHref: string;
  evidenceLabel: string;
}

export function EntireIntelligenceBrief() {
  const [askQuery, setAskQuery] = useState('');

  const insights: IntelligenceItem[] = [
    {
      id: 'ai-1',
      category: 'ANOMALY',
      title: 'Repeat Reactive Ingress — Manchester Hub',
      insight: 'Manchester Office Hub recorded two water-related reactive call-outs within 48 hours in Floor 4 East.',
      recommendation: 'Inspect primary HVAC condensate drain tray and roof gulley junction.',
      evidenceHref: '/admin/operations/work-orders?site=site-2',
      evidenceLabel: 'View 2 Linked Work Orders',
    },
    {
      id: 'ai-2',
      category: 'RESOURCE_GAP',
      title: 'Passenger Lift Statutory Inspection Due (Unassigned)',
      insight: 'Victoria House passenger lift LOLER inspection is due within 7 days but no accredited contractor is dispatched.',
      recommendation: 'Auto-match available supply chain contractor (KONE or Stannah accredited tech on standby).',
      evidenceHref: '/admin/planned-maintenance/schedule',
      evidenceLabel: 'Dispatch Contractor',
    },
    {
      id: 'ai-3',
      category: 'SPEND_SPIKE',
      title: 'Birmingham Reactive Spend 18% Above Rolling Baseline',
      insight: 'Reactive plumbing and electrical call-outs in Birmingham Distribution Centre exceeded 3-month rolling average.',
      recommendation: 'Trigger Asset Health Review on legacy boiler plant and distribution board 4B.',
      evidenceHref: '/admin/commercial/wip',
      evidenceLabel: 'Inspect Cost Ledger',
    },
  ];

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Bot className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
              Entire Intelligence
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              Operational synthesis · 3 verified observations
            </p>
          </div>
        </div>

        <Link
          href="/admin/ai/control"
          className="text-[11.5px] font-normal text-[#EA580C] hover:underline"
        >
          Governance Ledger →
        </Link>
      </div>

      {/* Synthesis Items */}
      <div className="p-4 space-y-3">
        {insights.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] p-3.5 hover:border-[#D4D4D0] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAFAF8] border border-[#E8E8E5] text-[#111111] text-[10px] font-normal">
                  {idx + 1}
                </span>
                <h3 className="font-light text-[13px] text-[#111111]">
                  {item.title}
                </h3>
              </div>
            </div>

            <p className="text-[12px] text-[#6D6D68] mt-2 leading-relaxed">
              {item.insight}
            </p>

            <div className="mt-2.5 rounded-[4px] bg-[#FAFAF8] border border-[#E8E8E5] p-2.5">
              <span className="text-[10.5px] font-normal text-[#111111] uppercase tracking-wide block mb-0.5">
                Recommended Action
              </span>
              <p className="text-[12px] text-[#111111]">
                {item.recommendation}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E8E8E5] text-[11.5px]">
              <Link
                href={item.evidenceHref}
                className="inline-flex items-center gap-1 font-normal text-[#EA580C] hover:underline"
              >
                <span>{item.evidenceLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
