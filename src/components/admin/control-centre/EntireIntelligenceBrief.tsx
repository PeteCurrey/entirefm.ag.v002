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
      title: 'Repeat Reactive Ingress at Manchester Hub',
      insight: 'Manchester Office Hub recorded two water-related reactive call-outs within 48 hours in Floor 4 East.',
      recommendation: 'Correlated root cause: Inspect primary HVAC condensate drain tray and roof gulley junction.',
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

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    // Dispatch global command palette event or redirect to AI control
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#7C3AED] text-white">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              ENTIRE INTELLIGENCE · OPERATIONAL SYNTHESIS
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              3 autonomous estate observations verified against canonical records
            </p>
          </div>
        </div>

        <Link
          href="/admin/ai/control"
          className="text-[11.5px] font-medium text-[#7C3AED] hover:underline"
        >
          AI Governance Ledger →
        </Link>
      </div>

      {/* Synthesis Items */}
      <div className="p-5 space-y-3.5">
        {insights.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-[12px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 hover:border-[#DDD6FE] hover:bg-[#FFFFFF] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] font-mono text-[10px] font-bold">
                  {idx + 1}
                </span>
                <h3 className="font-medium text-[13.5px] text-[#101010]">
                  {item.title}
                </h3>
              </div>
              <span className="rounded-[4px] bg-[#F5F3FF] border border-[#DDD6FE] px-1.5 py-0.5 font-mono text-[9px] text-[#7C3AED] uppercase font-semibold">
                {item.category.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="mt-2 text-[12.5px] text-[#101010] leading-relaxed">
              {item.insight}
            </p>

            <div className="mt-2 rounded-[8px] bg-[#FFFFFF] border border-[#E4E4E1] p-2.5 text-[12px] text-[#686866] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium text-[#101010] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] shrink-0" />
                {item.recommendation}
              </span>
              <Link
                href={item.evidenceHref}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#7C3AED] hover:underline shrink-0"
              >
                <span>{item.evidenceLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}

        {/* Ask EntireFM Conversational Intelligence Bar */}
        <form
          onSubmit={handleAskSubmit}
          className="mt-4 flex items-center gap-2 rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-1.5 focus-within:border-[#7C3AED] focus-within:bg-[#FFFFFF] transition-all"
        >
          <div className="pl-2 flex items-center text-[#7C3AED]">
            <MessageSquare className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder="Ask EntireFM: &ldquo;Which sites have recurring boiler faults this month?&rdquo; (⌘K)"
            className="flex-1 bg-transparent px-2 py-1.5 text-[13px] text-[#101010] placeholder-[#9B9B97] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-[7px] bg-[#101010] hover:bg-[#7C3AED] px-3 py-1.5 font-mono text-[11px] text-white transition-colors"
          >
            <span>Query Engine</span>
            <CornerDownLeft className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
