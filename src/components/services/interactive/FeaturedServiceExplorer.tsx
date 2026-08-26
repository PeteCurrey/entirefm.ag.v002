'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu, ChevronRight, Layers } from 'lucide-react';
import { CURATED_SERVICES, CuratedService } from '@/config/services-taxonomy';

export function FeaturedServiceExplorer() {
  const explorerServices = CURATED_SERVICES.filter(s => s.featuredInExplorer);
  const [selectedId, setSelectedId] = useState<string>(explorerServices[0]?.id || 'mechanical-electrical');

  const activeService = explorerServices.find(s => s.id === selectedId) || explorerServices[0];

  return (
    <section id="service-explorer" className="relative bg-[#0B1220] text-white py-20 sm:py-28 overflow-hidden">
      {/* Subtle ambient facet pattern */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15 backdrop-blur-sm mb-4">
            <Cpu className="h-3.5 w-3.5 text-brand-pink-light" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              ENGINEERING SPECIFICATION EXPLORER
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.15]">
            Explore the engineering behind the estate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
            Select a core discipline to inspect the technical delivery standards, statutory compliance baselines, and maintainable asset scopes.
          </p>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Discipline Selectors */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block px-2 mb-2">
              Select Discipline ({explorerServices.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {explorerServices.map((service) => {
                const isSelected = service.id === selectedId;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedId(service.id)}
                    className={`group text-left px-5 py-4 rounded-sm transition-all duration-300 flex items-center justify-between border ${
                      isSelected
                        ? 'bg-white/10 border-brand-pink text-white shadow-lg backdrop-blur-md'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs ${isSelected ? 'text-brand-pink-light' : 'text-slate-500'}`}>
                        {service.number}
                      </span>
                      <span className="text-sm font-normal tracking-tight">
                        {service.shortTitle || service.title}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      isSelected ? 'text-brand-pink-light translate-x-1' : 'text-slate-600 group-hover:text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Photographic & Technical Panel */}
          <div className="lg:col-span-8 bg-white/[0.04] border border-white/15 rounded-sm overflow-hidden backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-400">
            {activeService && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                {/* Visual Image Display */}
                <div className="md:col-span-6">
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 group">
                    <Image
                      key={activeService.image}
                      src={activeService.image}
                      alt={activeService.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-center animate-in fade-in zoom-in-95 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase bg-black/60 px-2.5 py-1 rounded-xs text-brand-pink-light border border-white/10 backdrop-blur-xs">
                        {activeService.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical Overview & Capabilities */}
                <div className="md:col-span-6 space-y-5">
                  <div>
                    <span className="text-xs font-mono text-brand-pink-light uppercase tracking-wider block">
                      Discipline Specification
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light text-white mt-1">
                      {activeService.title}
                    </h3>
                  </div>

                  <p className="text-sm text-brand-mist/90 leading-relaxed font-light">
                    {activeService.longDescription}
                  </p>

                  {/* Core Deliverables */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                      Core Maintainable Scope:
                    </span>
                    <div className="space-y-1.5">
                      {activeService.capabilities.slice(0, 3).map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-brand-mist">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink-light shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Baselines */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                      Governing Compliance Baselines:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeService.complianceTags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-[10.5px] font-mono text-white/90 bg-white/10 px-2.5 py-0.5 rounded-xs border border-white/10">
                          <ShieldCheck className="w-3 h-3 text-brand-pink-light" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div className="pt-4">
                    <Link
                      href={activeService.slug}
                      className="btn-hero-pink w-full sm:w-auto text-xs py-3 px-5 inline-flex items-center justify-center gap-2"
                    >
                      <span>Explore {activeService.shortTitle || activeService.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
