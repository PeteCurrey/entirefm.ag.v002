'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
  Filter,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import type { ProcurementOpportunity, FMTradeCategory } from '@/server/intelligence/types';

export function TemplateOpportunities() {
  const [tenders, setTenders] = useState<ProcurementOpportunity[]>([]);
  const [awards, setAwards] = useState<ProcurementOpportunity[]>([]);
  const [counts, setCounts] = useState<{ activeTenders: number; contractAwards: number; closingSoon: number }>({
    activeTenders: 0,
    contractAwards: 0,
    closingSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'closing_soon' | 'awards'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch(`/api/lobby/intelligence/opportunities?view=${activeTab}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTenders(json.tenders || []);
          setAwards(json.awards || []);
          if (json.counts) setCounts(json.counts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Services' },
    { key: 'mechanical', label: 'M&E Maintenance' },
    { key: 'hvac', label: 'HVAC & Refrigeration' },
    { key: 'electrical', label: 'Electrical & Fixed Wire' },
    { key: 'fire-safety', label: 'Fire & Life Safety' },
    { key: 'cleaning-soft-fm', label: 'Cleaning & Soft FM' },
    { key: 'security', label: 'Security & Access' },
    { key: 'water-hygiene', label: 'Water Hygiene & L8' },
  ];

  const displayList = activeTab === 'awards' ? awards : tenders;
  const filteredList =
    selectedCategory === 'all'
      ? displayList
      : displayList.filter((item) => item.serviceCategory === selectedCategory);

  return (
    <main className="min-h-screen bg-[#07090E] text-white pt-24 pb-20">
      {/* ─── MASTHEAD ─── */}
      <section className="container-wide border-b border-white/10 pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-semibold">
                PROCUREMENT INTELLIGENCE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/40 font-mono">Contracts Finder & Find a Tender (OCDS)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
              Public & Commercial FM Opportunities
            </h1>
            <p className="text-sm font-light text-white/60 mt-2 max-w-2xl">
              Live UK public sector procurement notices, tender documents, framework mini-competitions, and &ldquo;Who Won What&rdquo; verified contract award intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'all'
                  ? 'bg-brand-electric text-white font-semibold'
                  : 'border border-white/15 text-white/60 hover:text-white'
              }`}
            >
              Active Tenders ({counts.activeTenders})
            </button>
            <button
              onClick={() => setActiveTab('closing_soon')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'closing_soon'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'border border-white/15 text-white/60 hover:text-white'
              }`}
            >
              Closing Soon ({counts.closingSoon})
            </button>
            <button
              onClick={() => setActiveTab('awards')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'awards'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'border border-white/15 text-white/60 hover:text-white'
              }`}
            >
              Who Won What ({counts.contractAwards})
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-white/5 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-white/40 shrink-0 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`text-xs px-3 py-1 rounded-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── MAIN FEED ─── */}
      <section className="container-wide">
        {loading ? (
          <div className="py-20 text-center text-white/40 font-mono text-sm">
            Ingesting live procurement notices from official Crown Commercial repositories...
          </div>
        ) : filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map((opp) => (
              <article
                key={opp.id}
                className="group bg-white/[0.02] border border-white/10 hover:border-white/25 rounded-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric bg-brand-electric/10 px-2 py-0.5 border border-brand-electric/20">
                      {opp.serviceCategory.replace('-', ' ')}
                    </span>
                    {opp.status === 'closing_soon' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                        Closing Soon
                      </span>
                    )}
                    {opp.noticeType === 'award' && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                        Contract Awarded
                      </span>
                    )}
                    <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {opp.buyerRegion}
                    </span>
                  </div>

                  <h2 className="text-lg font-light text-white leading-snug group-hover:text-brand-electric transition-colors">
                    <a href={opp.officialNoticeUrl} target="_blank" rel="noopener noreferrer">
                      {opp.title}
                    </a>
                  </h2>

                  <p className="text-xs font-light text-white/60 line-clamp-2 max-w-3xl">
                    {opp.description}
                  </p>

                  {opp.noticeType === 'award' && opp.awardDetails && (
                    <div className="pt-2 text-xs text-emerald-300 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Awarded to <strong className="text-white">{opp.awardDetails.supplierName}</strong> for{' '}
                        <strong className="text-white">{opp.awardDetails.awardedValue}</strong>
                      </span>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-white/40 flex items-center gap-4 font-mono">
                    <span>Buyer: {opp.buyerName}</span>
                    <span>Source: {opp.source}</span>
                    {opp.closingDate && (
                      <span>Deadline: {new Date(opp.closingDate).toLocaleDateString('en-GB')}</span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-white/40">Estimated Value</div>
                    <div className="text-base font-medium text-white font-mono">
                      {opp.estimatedValue?.isFormatted || 'Value on Application'}
                    </div>
                  </div>

                  <a
                    href={opp.officialNoticeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-electric hover:text-white border border-brand-electric/40 px-3 py-1.5 rounded-sm hover:border-brand-electric transition-colors"
                  >
                    <span>Official Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-sm text-white/40 font-mono text-sm">
            No live procurement records matching this category filter.
          </div>
        )}
      </section>
    </main>
  );
}
