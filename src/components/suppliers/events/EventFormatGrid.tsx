'use client';

import React from 'react';
import { 
  Users, 
  Cpu, 
  Briefcase, 
  Coffee, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  MessagesSquare,
  ArrowRight
} from 'lucide-react';

interface EventFormat {
  id: string;
  title: string;
  discipline: string;
  description: string;
  typicalAudience: string;
  exampleTopic: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FORMATS: EventFormat[] = [
  {
    id: 'meet-the-supplier',
    title: 'Meet the Supplier',
    discipline: 'REGIONAL SHOWCASE',
    description: 'Regional sessions introducing specialist contractors, niche trade experts, EntireFM operations managers, and relevant commercial property professionals.',
    typicalAudience: 'Contractors, specialists, facilities managers, property directors',
    exampleTopic: 'Specialist high-level access & rope access innovations in commercial FM',
    icon: Users,
  },
  {
    id: 'meet-the-manufacturer',
    title: 'Meet the Manufacturer',
    discipline: 'OEM & FACTORY SESSIONS',
    description: 'Factory-backed technical briefings with major building systems OEMs covering plant efficiency, refrigerant transitions, BMS controls, and lifecycle maintenance.',
    typicalAudience: 'HVAC & M&E contractors, plant engineers, sustainability managers',
    exampleTopic: 'Next-generation low-GWP refrigerants & heat pump controls in commercial plant',
    icon: Cpu,
  },
  {
    id: 'meet-the-buyer',
    title: 'Meet the Buyer',
    discipline: 'PROCUREMENT CLARITY',
    description: 'Structured commercial briefings on property portfolio requirements, tender evaluation standards, work allocation frameworks, and prompt payment commitments.',
    typicalAudience: 'Approved suppliers, new applicants, trade contractors',
    exampleTopic: 'EntireFM 2026/2027 regional work packages & RICS compliance benchmarks',
    icon: Briefcase,
  },
  {
    id: 'technical-breakfasts',
    title: 'Technical Breakfasts',
    discipline: 'MORNING BRIEFINGS',
    description: 'Focused morning sessions covering regulatory changes, British Standard updates, and practical engineering challenges in occupied commercial estates.',
    typicalAudience: 'Certified electricians, gas engineers, fire specialists, compliance leads',
    exampleTopic: 'BS 5839 Fire Life Safety & BS 7671 Fixed Wire statutory updates',
    icon: Coffee,
  },
  {
    id: 'fm-innovation',
    title: 'FM Innovation Sessions',
    discipline: 'TECHNOLOGY & TELEMETRY',
    description: 'Exploring IoT sensor deployment, vibration telemetry, predictive maintenance algorithms, drone aerial surveys, and practical AI applications within modern FM.',
    typicalAudience: 'PropTech founders, technology partners, asset directors, forward-thinking contractors',
    exampleTopic: 'Continuous IoT chiller vibration monitoring & automated CAFM work orders',
    icon: Sparkles,
  },
  {
    id: 'supplier-forums',
    title: 'Supplier Forums',
    discipline: 'OPERATIONAL COLLABORATION',
    description: 'Interactive discussions addressing site safety standards, digital worksheet quality, first-time fix rates, and improving the supplier-client feedback loop.',
    typicalAudience: 'Contract managers, lead technicians, EntireFM contract directors',
    exampleTopic: 'Eliminating job sheet ambiguity & accelerating certificate sign-off in CAFM',
    icon: MessagesSquare,
  },
  {
    id: 'supplier-academy',
    title: 'Supplier Academy',
    discipline: 'DEVELOPMENT & TRAINING',
    description: 'Hands-on development sessions covering EntireFM RAMS requirements, dynamic risk assessments, EntireCAFM mobile app workflows, and customer service standards.',
    typicalAudience: 'Front-line engineers, subcontractor supervisors, administrative teams',
    exampleTopic: 'Mastering the EntireCAFM mobile workflow & digital compliance evidence',
    icon: GraduationCap,
  },
  {
    id: 'industry-roundtables',
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
    <section id="event-formats" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              PROGRAMME FORMATS &amp; ENGAGEMENT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            Eight structured ways we bring the supply chain together
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Our events are designed around practical engineering value, regulatory updates, and commercial transparency rather than generic sales pitches.
          </p>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FORMATS.map((format) => (
            <div
              key={format.id}
              className="p-6 bg-[#FAF9FB] border border-slate-200/90 rounded-sm flex flex-col justify-between hover:border-brand-pink hover:shadow-md transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xs bg-white text-slate-900 border border-slate-200/80 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                    <format.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-light">
                    {format.discipline}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-slate-900 group-hover:text-brand-pink transition-colors">
                    {format.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 font-light leading-relaxed">
                    {format.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2 text-[11.5px]">
                <div>
                  <span className="font-mono uppercase text-[10px] text-slate-400 block">Typical Audience:</span>
                  <span className="text-slate-700 font-light">{format.typicalAudience}</span>
                </div>
                <div>
                  <span className="font-mono uppercase text-[10px] text-brand-pink block">Example Topic:</span>
                  <span className="text-slate-800 font-normal italic">&quot;{format.exampleTopic}&quot;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
