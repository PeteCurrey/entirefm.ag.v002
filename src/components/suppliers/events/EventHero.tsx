'use client';

import React from 'react';
import { Calendar, Users, ShieldCheck, MapPin, ArrowRight, Phone } from 'lucide-react';
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
              ENTIREFM PARTNER NETWORK PROGRAMME
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Better supplier relationships don’t happen through email alone.
          </h1>

          <p className="text-base sm:text-xl text-brand-mist/90 font-light leading-relaxed max-w-3xl">
            The EntireFM Partner Network is built around direct engagement, technical discussion, supplier development and practical collaboration between contractors, OEMs, facilities leaders, and our central operations team.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#event-interest"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hero-pink text-xs py-3.5 px-6 inline-flex items-center gap-2"
            >
              <span>Register Interest in Partner Events</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#event-programme"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#event-programme')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost-light text-xs py-3.5 px-6"
            >
              Explore 2026/2027 Programme
            </a>
          </div>

          {/* Operational Proof Points */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-mono uppercase text-brand-pink-light block mb-1">
                8 EVENT FORMATS
              </span>
              <span className="text-sm font-light text-white">
                Technical Breakfasts to OEM Sessions
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-mono uppercase text-brand-pink-light block mb-1">
                REGIONAL PROGRAMME
              </span>
              <span className="text-sm font-light text-white">
                London, Manchester, Midlands &amp; Yorkshire
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-mono uppercase text-brand-pink-light block mb-1">
                PROCUREMENT INDEPENDENCE
              </span>
              <span className="text-sm font-light text-white">
                100% Assurance &amp; Fair Allocation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
