'use client';

import React from 'react';
import { Award, Users, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export function SummitPositioningSection() {
  return (
    <section className="bg-[#0B1220] text-white py-20 lg:py-28 relative overflow-hidden border-y border-[#1E2A3A]">
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column / Editorial Summit Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 border border-white/15 backdrop-blur-sm">
              <Award className="h-3.5 w-3.5 text-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFEDD5]">
                ANNUAL FLAGSHIP FOUNDATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
              The EntireFM Partner Network Summit
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              We are establishing the framework for an annual national gathering of approved trade contractors, building technology OEMs, PropTech innovators, and commercial FM property leaders.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-2 shrink-0" />
                <span><strong className="text-white font-semibold">Industry Keynotes:</strong> Regulatory updates, building safety legislation, and national FM supply chain outlooks.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-2 shrink-0" />
                <span><strong className="text-white font-semibold">OEM Technology Pavilions:</strong> Live equipment diagnostics, VR plant simulations, and telemetry exhibits.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-2 shrink-0" />
                <span><strong className="text-white font-semibold">Supplier Excellence Recognition:</strong> Celebrating safety leadership, first-time fix rates, and ESG contributions.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#event-interest"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-[6px] bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-lg shadow-[#EA580C]/20"
              >
                <span>Register Interest in Summit Updates</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column / Summit Core Pillars Card */}
          <div className="lg:col-span-5 bg-white/[0.04] border border-white/10 rounded-[8px] p-6 sm:p-8 backdrop-blur-xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFEDD5] block mb-2">
              Summit Strategic Pillars
            </span>

            <div className="space-y-3">
              <div className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                  <span>Assurance &amp; Governance</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Setting the highest standards for contractor safety, competence verification, and compliance evidence.
                </p>
              </div>

              <div className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#EA580C]" />
                  <span>Engineering &amp; OEM Depth</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Direct collaboration with plant manufacturers to solve complex property efficiency challenges.
                </p>
              </div>

              <div className="p-4 rounded-[6px] bg-white/[0.03] border border-white/10 space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EA580C]" />
                  <span>Commercial Collaboration</span>
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
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
