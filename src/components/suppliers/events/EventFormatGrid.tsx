'use client';

import React from 'react';
import {
  Users,
  Cpu,
  Briefcase,
  Coffee,
  Sparkles,
  MessagesSquare,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

interface EventFormat {
  number: string;
  title: string;
  discipline: string;
  description: string;
  typicalAudience: string;
  exampleTopic: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FORMATS: EventFormat[] = [
  {
    number: '01',
    title: 'Meet the Supplier',
    discipline: 'REGIONAL SHOWCASE',
    description: 'Regional sessions introducing specialist contractors, niche trade experts, EntireFM operations managers, and relevant commercial property professionals.',
    typicalAudience: 'Contractors, specialists, facilities managers, property directors',
    exampleTopic: 'Specialist high-level access & rope access innovations in commercial FM',
    icon: Users,
  },
  {
    number: '02',
    title: 'Meet the Manufacturer',
    discipline: 'OEM & FACTORY SESSIONS',
    description: 'Factory-backed technical briefings with major building systems OEMs covering plant efficiency, refrigerant transitions, BMS controls, and lifecycle maintenance.',
    typicalAudience: 'HVAC & M&E contractors, plant engineers, sustainability managers',
    exampleTopic: 'Low-GWP refrigerants & heat pump controls in commercial plant',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Meet the Buyer',
    discipline: 'PROCUREMENT CLARITY',
    description: 'Structured commercial briefings on property portfolio requirements, tender evaluation standards, work allocation frameworks, and prompt payment commitments.',
    typicalAudience: 'Approved suppliers, new applicants, trade contractors',
    exampleTopic: 'EntireFM 2026/2027 regional work packages & RICS compliance benchmarks',
    icon: Briefcase,
  },
  {
    number: '04',
    title: 'Technical Breakfasts',
    discipline: 'MORNING BRIEFINGS',
    description: 'Focused morning sessions covering regulatory changes, British Standard updates, and practical engineering challenges in occupied commercial estates.',
    typicalAudience: 'Certified electricians, gas engineers, fire specialists, compliance leads',
    exampleTopic: 'BS 5839 Fire Life Safety & BS 7671 Fixed Wire statutory updates',
    icon: Coffee,
  },
  {
    number: '05',
    title: 'FM Innovation Sessions',
    discipline: 'TECHNOLOGY & TELEMETRY',
    description: 'Exploring IoT sensor deployment, vibration telemetry, predictive maintenance algorithms, drone aerial surveys, and practical AI applications within modern FM.',
    typicalAudience: 'PropTech founders, technology partners, asset directors, forward-thinking contractors',
    exampleTopic: 'Continuous IoT chiller vibration monitoring & automated CAFM work orders',
    icon: Sparkles,
  },
  {
    number: '06',
    title: 'Supplier Forums',
    discipline: 'OPERATIONAL COLLABORATION',
    description: 'Interactive discussions addressing site safety standards, digital worksheet quality, first-time fix rates, and improving the supplier-client feedback loop.',
    typicalAudience: 'Contract managers, lead technicians, EntireFM contract directors',
    exampleTopic: 'Eliminating job sheet ambiguity & accelerating certificate sign-off in CAFM',
    icon: MessagesSquare,
  },
  {
    number: '07',
    title: 'Supplier Academy',
    discipline: 'DEVELOPMENT & TRAINING',
    description: 'Hands-on development sessions covering EntireFM RAMS requirements, dynamic risk assessments, EntireCAFM mobile app workflows, and customer service standards.',
    typicalAudience: 'Front-line engineers, subcontractor supervisors, administrative teams',
    exampleTopic: 'Mastering the EntireCAFM mobile workflow & digital compliance evidence',
    icon: GraduationCap,
  },
  {
    number: '08',
    title: 'Industry Roundtables',
    discipline: 'EXECUTIVE DIALOGUE',
    description: 'Invitation-led discussions bringing together property owners, asset managers, tier-1 suppliers, and EntireFM executive directors around high-level challenges.',
    typicalAudience: 'Commercial property owners, managing agents, ESG leads, supply chain heads',
    exampleTopic: 'Decarbonising commercial plant & navigating building safety act obligations',
    icon: ShieldCheck,
  },
];

export function EventFormatGrid() {
  return (
    <section id="event-formats" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8E8E5]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              PROGRAMME FORMATS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Eight structured ways we bring the supply chain together.
          </h2>
          <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
            Each event format is designed around a specific type of value — technical knowledge, commercial clarity, relationship-building, or professional development. Every session has a defined structure and outcome.
          </p>
        </div>

        {/* 2×4 Format Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FORMATS.map((format) => {
            const Icon = format.icon;
            return (
              <div
                key={format.number}
                className="group relative p-6 rounded-[8px] bg-[#FAFAF8] border border-[#E8E8E5] hover:border-[#EA580C]/30 hover:bg-[#FFFFFF] transition-all duration-300 flex flex-col gap-4"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] group-hover:bg-[#EA580C]/10 group-hover:border-[#EA580C]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#6D6D68] group-hover:text-[#EA580C] transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums tracking-widest text-[#CCCCCC] group-hover:text-[#EA580C] transition-colors">
                    {format.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                    {format.discipline}
                  </span>
                  <h3 className="text-sm font-semibold text-[#111111] leading-snug">
                    {format.title}
                  </h3>
                  <p className="text-xs text-[#6D6D68] font-light leading-relaxed">
                    {format.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-[#E8E8E5] space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#AAAAAA] block mb-0.5">
                      Audience
                    </span>
                    <span className="text-[11px] text-[#6D6D68] font-light leading-snug">
                      {format.typicalAudience}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]/70 block mb-0.5">
                      Example Topic
                    </span>
                    <span className="text-[11px] text-[#111111] font-normal italic leading-snug">
                      &ldquo;{format.exampleTopic}&rdquo;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
