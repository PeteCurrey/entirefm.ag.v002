'use client';

import React from 'react';
import { ArrowRight, Calendar, Users, History } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export function EventHero() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Events & Forums', url: '/suppliers/events' },
  ];

  return (
    <section className="bg-brand-graphite text-white relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 border-b border-brand-edge-dark">
      {/* Ambient facet pattern */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />
      
      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(11,18,32,0.98) 0%, rgba(17,26,46,0.92) 50%, rgba(11,18,32,0.98) 100%)',
        }}
      />

      <div className="container-custom relative">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              ENTIREFM PARTNER NETWORK &amp; EVENTS HUB
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Better supplier relationships happen face to face.
          </h1>

          <p className="text-base sm:text-xl text-brand-mist/90 font-light leading-relaxed max-w-3xl">
            From technical training and manufacturer days to supplier breakfasts and informal industry evenings, EntireFM has long invested time in building relationships beyond individual work orders. Our Partner Network now gives that engagement a more structured platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#past-events"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#past-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hero-pink text-xs py-3.5 px-6 inline-flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              <span>View Past Events</span>
            </a>

            <a
              href="#upcoming-events"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#upcoming-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost-light text-xs py-3.5 px-6 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Programme</span>
            </a>
          </div>

          {/* Operational Proof Points */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                HISTORICAL COLLABORATION
              </span>
              <span className="text-sm font-light text-white">
                Years of Supplier, OEM &amp; Training Sessions
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                STRUCTURED EVOLUTION
              </span>
              <span className="text-sm font-light text-white">
                Formalised via EntireFM Partner Network
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                REGIONAL HUBS
              </span>
              <span className="text-sm font-light text-white">
                London, Manchester, Yorkshire &amp; Midlands
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
