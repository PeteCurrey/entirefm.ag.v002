import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, AlertCircle, Info } from 'lucide-react';
import type { BriefingStripItem } from '@/data/lobby/types';

interface BriefingStripProps {
  items: BriefingStripItem[];
}

export function BriefingStrip({ items }: BriefingStripProps) {
  return (
    <section className="border-y border-brand-edge bg-brand-surface py-8 sm:py-10">
      <div className="container-wide">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-electric" />
            <h3 className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-brand-slate">
              Briefing Wire · Rapid Intelligence
            </h3>
          </div>
          <Link
            href="/fm-intelligence"
            className="inline-flex items-center gap-1 text-xs font-normal text-brand-electric hover:underline"
          >
            <span>FM Intelligence 2026</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className="bg-white border border-brand-edge rounded-sm p-5 sm:p-6 flex flex-col justify-between hover:border-brand-electric/50 transition-all duration-300 shadow-subtle group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-mono font-medium uppercase tracking-wider text-brand-electric">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-brand-silver font-light">{item.timestamp}</span>
                </div>

                <h4 className="text-base sm:text-lg font-light text-brand-graphite leading-snug group-hover:text-brand-electric transition-colors">
                  {item.headline}
                </h4>

                <p className="text-xs sm:text-[13px] font-light text-brand-silver leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-edge flex items-center justify-between text-[11px] font-light text-brand-silver">
                <span>Sector: {item.sector}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-normal uppercase ${
                  item.impactLevel === 'Direct Duty'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : item.impactLevel === 'Operational'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {item.impactLevel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
