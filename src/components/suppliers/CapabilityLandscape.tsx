'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CAPABILITY_DISCIPLINES, DisciplineCategory } from '@/config/supplier-data';

export type { DisciplineCategory };
export { CAPABILITY_DISCIPLINES };

export function CapabilityLandscape() {
  const [selectedCategory, setSelectedCategory] = useState<string>('engineering');
  const active = CAPABILITY_DISCIPLINES.find((c) => c.id === selectedCategory) || CAPABILITY_DISCIPLINES[0];

  return (
    <section className="py-24 bg-brand-carbon text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-wide relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-brand-edge-dark">
          <div>
            <span className="eyebrow eyebrow-dark">SUPPLY CHAIN SCOPE</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
              Capability Landscape &amp; Specialist Disciplines
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-mist/70 font-light max-w-2xl">
              EntireFM integrates national Tier 1 contractors, specialist regional SMEs, OEM engineers, and technology innovators across eight structured operating disciplines.
            </p>
          </div>
          <Link
            href="/suppliers/partner-with-entirefm"
            className="inline-flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-brand-electric-bright hover:text-white transition-colors"
          >
            Explore Supplier Opportunities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-white/10">
          {CAPABILITY_DISCIPLINES.map((item) => {
            const isSelected = item.id === selectedCategory;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-sm text-xs font-normal transition-all text-left flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 font-light shadow-sm'
                    : 'text-brand-mist/70 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-brand-pink' : 'bg-transparent'}`} />
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Category Detail Showcase */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[400px] rounded-sm overflow-hidden border border-brand-edge-dark">
            <Image
              src={active.imageSrc}
              alt={active.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite via-brand-graphite/60 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6">
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright">
                {active.eyebrow}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white mt-1">
                {active.title}
              </h3>
              <p className="mt-2 text-xs text-brand-mist/80 leading-relaxed font-light">
                {active.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-brand-graphite/70 border border-brand-edge-dark p-6 sm:p-8 rounded-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50 mb-3">
                  APPROVED TRADE DISCIPLINES &amp; SPECIALISMS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {active.trades.map((trade, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-white/[0.03] border border-white/5 rounded-sm hover:border-brand-electric/30 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs text-brand-mist/90 leading-snug">{trade}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50 mb-3">
                  GOVERNING COMPLIANCE &amp; ACCREDITATION BENCHMARKS
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.standards.map((std, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-[11px] font-mono bg-white/[0.06] text-brand-mist/90 px-3 py-1 rounded-sm border border-white/10"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/suppliers/apply"
                className="btn-primary text-xs py-2.5 px-5"
              >
                Apply as a Specialist Contractor <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/suppliers/standards"
                className="text-xs text-brand-mist/70 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                Review Operating Standards <ArrowUpRight className="h-3.5 w-3.5 text-brand-electric-bright" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
