'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Briefcase, Users, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export function CareersHero() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Careers', url: '/careers' },
  ];

  return (
    <section className="bg-brand-graphite text-white relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 border-b border-brand-edge-dark isolate">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/locations/london/facilities-management-london-engineers-st-pauls-1600w.webp"
          alt="EntireFM commercial engineering team surveying rooftop plant across city skyline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[center_35%]"
        />
      </div>

      {/* Cinematic Gradient Scrim for crisp text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(98deg, rgba(6,10,20,0.96) 0%, rgba(6,10,20,0.90) 45%, rgba(6,10,20,0.65) 75%, rgba(6,10,20,0.45) 100%)',
        }}
      />

      {/* Bottom Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32"
        style={{ background: 'linear-gradient(to top, rgba(6,10,20,0.98), transparent)' }}
      />

      {/* Ambient facet pattern */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-20" />

      <div className="container-custom relative">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              CAREERS AT ENTIREFM // NATIONWIDE OPERATIONAL &amp; ENGINEERING ROLES
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            Build what keeps business moving.
          </h1>

          <p className="text-base sm:text-xl text-brand-mist/90 font-light leading-relaxed max-w-2xl">
            EntireFM is a technology-enabled facilities management business where engineering expertise, operational excellence, commercial precision, and digital innovation come together.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#opportunities"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#opportunities')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-hero-pink text-xs py-3.5 px-6 inline-flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>View Open Roles</span>
            </a>

            <a
              href="#talent-network"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#talent-network')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost-light text-xs py-3.5 px-6 inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-brand-electric-bright" />
              <span>Join Our Talent Network</span>
            </a>
          </div>

          {/* Operational Proof Points */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                TECHNOLOGY-LED OPERATOR
              </span>
              <span className="text-sm font-light text-white">
                EntireCAFM Mobile Dispatch &amp; Digital Workflows
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                FUNDED ACCREDITATIONS
              </span>
              <span className="text-sm font-light text-white">
                Continuous CPD, SFG20, C&amp;G &amp; Specialist Training
              </span>
            </div>

            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink-light block mb-1">
                NATIONAL PLATFORM
              </span>
              <span className="text-sm font-light text-white">
                Regional Hubs Across London, Manchester &amp; Midlands
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
