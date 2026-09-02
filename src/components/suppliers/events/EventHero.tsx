'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export function EventHero() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Events & Forums', url: '/suppliers/events' },
  ];

  return (
    <section className="bg-[#0B1220] text-white relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 border-b border-slate-800 isolate">
      {/* Background Hero Image */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/suppliers/supplier-events-hero.jpg"
          alt="UK facilities management and engineering contractors collaborating during a technical industry briefing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-right filter brightness-[0.85]"
        />
      </div>

      {/* Cinematic Gradient Scrim for crisp text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(98deg, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.90) 45%, rgba(11,18,32,0.65) 75%, rgba(11,18,32,0.40) 100%)',
        }}
      />

      {/* Bottom Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32"
        style={{ background: 'linear-gradient(to top, rgba(11,18,32,0.98), transparent)' }}
      />

      <div className="container-custom relative">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 border border-white/15 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FFEDD5]">
              ENTIREFM PARTNER NETWORK
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.12]">
            Meet the people shaping modern FM.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
            Technical briefings. Supplier breakfasts. Manufacturer sessions. Practical training. Industry roundtables. EntireFM events are designed to give contractors more than another networking evening — they are places to learn, build relationships and understand where commercial FM is heading.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/suppliers/membership"
              className="px-6 py-3.5 rounded-[6px] bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#EA580C]/20"
            >
              <span>Explore Membership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#upcoming-events"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#upcoming-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-[6px] bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-slate-300" />
              <span>View Upcoming Events</span>
            </a>
          </div>

          {/* Operational Proof Points */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[6px] bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#FFEDD5] block mb-1">
                KNOWLEDGE &amp; STANDARDS
              </span>
              <span className="text-xs font-normal text-slate-200">
                Direct insight into changing UK compliance &amp; engineering standards
              </span>
            </div>

            <div className="p-4 rounded-[6px] bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#FFEDD5] block mb-1">
                MANUFACTURER ACCESS
              </span>
              <span className="text-xs font-normal text-slate-200">
                Direct engagement with leading equipment OEMs &amp; technology partners
              </span>
            </div>

            <div className="p-4 rounded-[6px] bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#FFEDD5] block mb-1">
                REGIONAL HUBS
              </span>
              <span className="text-xs font-normal text-slate-200">
                Active programmes across London, Manchester, Midlands &amp; Yorkshire
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
