import React from 'react';
import Link from 'next/link';
import { Wrench, Calendar, Calculator, FileSpreadsheet, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import type { CuratedResourceItem } from '@/data/lobby/types';

interface LobbyToolkitProps {
  items: CuratedResourceItem[];
}

export function LobbyToolkit({ items }: LobbyToolkitProps) {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {items.map((tool, idx) => (
          <div
            key={tool.id}
            className="border border-brand-edge bg-white rounded-sm p-6 sm:p-7 flex flex-col justify-between hover:border-brand-electric hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-brand-electric">
                  {tool.category}
                </span>
                {tool.statsBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-normal bg-brand-surface text-brand-slate border border-brand-edge">
                    {tool.statsBadge}
                  </span>
                )}
              </div>

              <h4 className="text-xl font-light text-brand-graphite leading-snug group-hover:text-brand-electric transition-colors">
                {tool.title}
              </h4>

              <p className="text-xs sm:text-[13px] font-light text-brand-silver leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-edge flex items-center justify-between">
              <span className="text-[11px] font-light text-brand-silver">Free · Ungated</span>
              <Link
                href={tool.url}
                className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-electric group-hover:translate-x-0.5 transition-transform"
              >
                <span>{tool.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Gateway to complete Resources suite */}
      <div className="border border-brand-edge bg-brand-surface rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-normal text-brand-graphite">
            Looking for other calculators, statutory calendars, or downloadable templates?
          </p>
          <p className="text-xs font-light text-brand-silver">
            Explore the complete EntireFM Resource Hub and compliance documentation suites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="btn-outline text-xs py-2.5 px-4"
          >
            All 8 FM Tools
          </Link>
          <Link
            href="/resources"
            className="btn-primary text-xs py-2.5 px-4"
          >
            View All Resources
            <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}
