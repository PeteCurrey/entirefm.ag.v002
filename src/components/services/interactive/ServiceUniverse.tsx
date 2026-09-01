'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2, Shield, Wrench, Sparkles } from 'lucide-react';
import { SERVICE_FAMILIES, CURATED_SERVICES, ServiceFamilyId } from '@/config/services-taxonomy';

export function ServiceUniverse() {
  const [activeTab, setActiveTab] = useState<ServiceFamilyId>('hard-fm');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Smooth scroll to selected family
  const scrollToFamily = (id: ServiceFamilyId) => {
    setActiveTab(id);
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -90; // offset for sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Observe active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const family of SERVICE_FAMILIES) {
        const el = sectionRefs.current[family.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(family.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="service-universe" className="relative bg-white py-20 sm:py-28">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              CAPABILITIES &amp; SERVICE DISCIPLINES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            Everything a building needs.
            <span className="block text-slate-500 font-light mt-1">One accountable FM partner.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            EntireFM holds the entire building services scope under one operational contract. Explore our five core capability divisions below.
          </p>
        </div>

        {/* Sticky Category Header Navigation (Desktop & Tablet) */}
        <div className="sticky top-[var(--header-h,72px)] z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 py-3 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10 mb-16 shadow-2xs">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {SERVICE_FAMILIES.map((family) => {
              const isActive = activeTab === family.id;
              return (
                <button
                  key={family.id}
                  onClick={() => scrollToFamily(family.id)}
                  className={`group relative whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-normal rounded-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`font-normal text-[11px]${isActive ? 'text-brand-pink' : 'text-slate-400'}`}>
                    {family.number}
                  </span>
                  <span>{family.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The 5 Service Family Worlds */}
        <div className="space-y-24 sm:space-y-32">
          {SERVICE_FAMILIES.map((family, idx) => {
            const familyServices = CURATED_SERVICES.filter(s => s.family === family.id);
            const isReversed = idx % 2 === 1;

            return (
              <article
                key={family.id}
                id={family.id}
                ref={(el) => { sectionRefs.current[family.id] = el; }}
                className="scroll-mt-32 pt-6 border-t border-slate-200 first:border-t-0 first:pt-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  {/* Visual Photographic Panel */}
                  <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden border border-slate-200 group shadow-sm">
                      <Image
                        src={family.heroImage}
                        alt={family.heroAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      {/* Operational Proof Badge Overlay */}
                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                        <div>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-brand-pink block">
                            {family.statLabel}
                          </span>
                          <span className="text-sm sm:text-base font-light tracking-tight text-white">
                            {family.statValue}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-light text-white/40">
                            {family.number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Content & Links */}
                  <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-brand-pink font-normal">
                          FAMILY {family.number}
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs font-normal uppercase text-slate-400">
                          {family.tagline}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-900 tracking-tight">
                        {family.name}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                      {family.description}
                    </p>

                    {/* Featured Capabilities List */}
                    <div className="pt-2">
                      <span className="text-xs uppercase tracking-wider text-slate-400 block font-light mb-3">
                        Core Service Capabilities:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {family.featuredCapabilities.map((cap, capIdx) => (
                          <div key={capIdx} className="flex items-center gap-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Curated Service Links */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-light">
                        Explore Specialized Service Lines:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {familyServices.map((svc) => (
                          <Link
                            key={svc.id}
                            href={svc.slug}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#FAF9FB] border border-slate-200 text-xs text-slate-800 hover:border-brand-pink hover:bg-white hover:text-brand-pink transition-all shadow-2xs group"
                          >
                            <span>{svc.shortTitle || svc.title}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
