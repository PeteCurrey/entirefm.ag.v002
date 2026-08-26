'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldAlert, Cpu, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SponsorshipTier {
  name: string;
  badge: string;
  description: string;
  deliverables: string[];
}

const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    name: 'Headline Programme Partner',
    badge: 'ANNUAL LEADERSHIP',
    description: 'Prominent co-branding across all quarterly technical breakfasts, regional supplier forums, and the annual summit review.',
    deliverables: [
      'Keynote presentation slot at annual summit',
      'Prominent branding across all event communications',
      'Dedicated exhibition space at all regional sessions',
    ],
  },
  {
    name: 'Technical / OEM Partner',
    badge: 'ENGINEERING DEPTH',
    description: 'Lead dedicated factory-backed technical sessions exploring building systems innovation, efficiency, and engineering best practices.',
    deliverables: [
      'Dedicated technical presentation & demo session',
      'Direct engagement with certified M&E contractors',
      'Inclusion in technical whitepapers & takeaways',
    ],
  },
  {
    name: 'Session / Breakfast Partner',
    badge: 'DISCIPLINE FOCUS',
    description: 'Sponsor an individual regional technical breakfast or innovation briefing covering a specific trade or regulatory discipline.',
    deliverables: [
      'Session opening address & banner presence',
      'Literature & sample distribution to attendees',
      'Targeted networking with regional specialists',
    ],
  },
];

export function EventSponsorshipSection() {
  return (
    <section id="sponsorship" className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              PARTNER WITH AN ENTIREFM EVENT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            Sponsorship &amp; manufacturer collaboration
          </h2>
          <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
            Position your technology, plant equipment, or specialist services directly before commercial property managers, facilities directors, and certified regional engineering contractors.
          </p>
        </div>

        {/* Sponsorship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SPONSORSHIP_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-slate-200/90 rounded-sm shadow-xs flex flex-col justify-between space-y-6 hover:border-brand-pink transition-all duration-200"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink bg-brand-pink/10 border border-brand-pink/20 px-2 py-0.5 rounded-xs inline-block">
                  {tier.badge}
                </span>
                <h3 className="text-xl font-normal text-slate-900">
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10.5px] font-mono uppercase text-slate-400 block font-light">
                  Key Inclusions:
                </span>
                {tier.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 font-light">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Procurement Independence Statement */}
        <div className="p-5 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-600 font-light">
          <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="font-normal text-slate-900">Procurement Independence Notice:</strong> Event sponsorship, participation, and partnership do not influence supplier assurance auditing, tender evaluation, procurement decisions, or work allocation on EntireFM managed commercial estates.
          </p>
          <a
            href="#event-interest"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-outline text-xs py-2 px-4 whitespace-nowrap shrink-0"
          >
            Discuss Sponsorship
          </a>
        </div>
      </div>
    </section>
  );
}
