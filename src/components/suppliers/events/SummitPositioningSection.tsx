'use client';

import React from 'react';
import { Award, Sparkles, Users, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export function SummitPositioningSection() {
  return (
    <section className="bg-brand-graphite text-white py-20 sm:py-28 relative overflow-hidden border-y border-brand-edge-dark">
      {/* Ambient facet lines */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column / Editorial Summit Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15 backdrop-blur-sm">
              <Award className="h-3.5 w-3.5 text-brand-pink-light" />
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
                ANNUAL FLAGSHIP FOUNDATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.15]">
              The EntireFM Partner Network Summit
            </h2>

            <p className="text-base sm:text-lg text-brand-mist/90 font-light leading-relaxed">
              We are laying the foundation for an annual national gathering of approved trade contractors, building technology OEMs, PropTech innovators, and commercial property leaders.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                <span><strong>Industry Keynotes:</strong> Regulatory updates, building safety legislation, and national FM outlooks.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                <span><strong>OEM Technology Pavilions:</strong> Live equipment diagnostics, VR plant simulations, and telemetry exhibits.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-brand-mist font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                <span><strong>Supplier Excellence Recognition:</strong> Celebrating safety leadership, first-time fix rates, and ESG contributions.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#event-interest"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-hero-pink text-xs py-3 px-5 inline-flex items-center gap-2"
              >
                <span>Register Interest in Summit Updates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column / Summit Core Pillars Card */}
          <div className="lg:col-span-5 bg-white/[0.04] border border-white/15 rounded-sm p-6 sm:p-8 backdrop-blur-xl space-y-5">
            <span className="text-[11px] font-light uppercase tracking-wider text-slate-400 tracking-wider block">
              Summit Strategic Pillars
            </span>

            <div className="space-y-4">
              <div className="p-4 rounded-sm bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-pink-light" />
                  <span>Assurance &amp; Governance</span>
                </div>
                <p className="text-xs text-brand-mist/70 font-light leading-relaxed">
                  Setting the highest standards for contractor safety, competence verification, and compliance evidence.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-pink-light" />
                  <span>Engineering &amp; OEM Depth</span>
                </div>
                <p className="text-xs text-brand-mist/70 font-light leading-relaxed">
                  Direct collaboration with plant manufacturers to solve complex property efficiency challenges.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-pink-light" />
                  <span>Commercial Collaboration</span>
                </div>
                <p className="text-xs text-brand-mist/70 font-light leading-relaxed">
                  Transparent procurement pathways, prompt payment principles, and multi-year contract stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
