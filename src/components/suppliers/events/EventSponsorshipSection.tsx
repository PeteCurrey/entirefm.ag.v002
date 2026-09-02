'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

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
    <section id="sponsorship" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8E8E5]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              PARTNER WITH AN ENTIREFM EVENT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Sponsorship &amp; manufacturer collaboration
          </h2>
          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            Position your technology, plant equipment, or specialist services directly before commercial property managers, facilities directors, and certified regional engineering contractors.
          </p>
        </div>

        {/* Sponsorship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SPONSORSHIP_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#FAFAF8] border border-[#E8E8E5] rounded-[8px] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#EA580C]/40 hover:bg-[#FFFFFF] transition-all duration-200"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] bg-[#EA580C]/10 border border-[#EA580C]/20 px-2 py-0.5 rounded-[3px] inline-block">
                  {tier.badge}
                </span>
                <h3 className="text-lg font-semibold text-[#111111]">
                  {tier.name}
                </h3>
                <p className="text-xs text-[#6D6D68] font-light leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E8E5] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A95] block mb-1">
                  Key Inclusions:
                </span>
                {tier.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-[#2D2D2D] font-light">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Procurement Independence Statement */}
        <div className="p-5 bg-[#FAFAF8] border border-[#E8E8E5] rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-[#6D6D68] font-light">
          <ShieldAlert className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed flex-1">
            <strong className="font-semibold text-[#111111]">Procurement Independence Notice:</strong> Event sponsorship, participation, and partnership do not influence supplier assurance auditing, tender evaluation, procurement decisions, or work allocation on EntireFM managed commercial estates.
          </p>
          <a
            href="#event-interest"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-[4px] bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors"
          >
            Discuss Sponsorship
          </a>
        </div>
      </div>
    </section>
  );
}
