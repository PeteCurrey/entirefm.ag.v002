'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface ProgrammeQuarter {
  period: string;
  season: string;
  primaryTheme: string;
  headlineFormat: string;
  description: string;
  disciplines: string[];
}

const QUARTERS: ProgrammeQuarter[] = [
  {
    period: 'Q1',
    season: 'JANUARY — MARCH',
    primaryTheme: 'Statutory Compliance & Standards',
    headlineFormat: 'Technical Breakfasts & Regulatory Updates',
    description: 'Focusing on emerging legal duties, British Standard amendments (BS 7671, BS 5839, ACOP L8), and springtime planned maintenance mobilisation.',
    disciplines: ['Electrical Fixed Wire (EICR)', 'Fire Safety Order Updates', 'Water Hygiene & Legionella Control'],
  },
  {
    period: 'Q2',
    season: 'APRIL — JUNE',
    primaryTheme: 'Procurement & Regional Delivery',
    headlineFormat: 'Regional Supplier Forums & Buyer Briefings',
    description: 'Connecting regional suppliers with EntireFM procurement directors in London, Manchester, and Birmingham to review upcoming tender packages.',
    disciplines: ['Meet the Buyer Briefings', 'RAMS & Safety Passport Standards', 'Subcontractor SLA Alignment'],
  },
  {
    period: 'Q3',
    season: 'JULY — SEPTEMBER',
    primaryTheme: 'Plant Technology & Engineering',
    headlineFormat: 'OEM Manufacturer Sessions & Telemetry',
    description: 'Factory-backed engineering seminars with equipment manufacturers exploring chiller efficiency, low-GWP refrigerants, and IoT telemetry.',
    disciplines: ['HVAC Chiller & Heat Pump Tech', 'BMS Controls Optimisation', 'IoT Predictive Maintenance'],
  },
  {
    period: 'Q4',
    season: 'OCTOBER — DECEMBER',
    primaryTheme: 'Innovation & Executive Review',
    headlineFormat: 'Partner Network Review & Summit Foundation',
    description: 'Annual review of supplier performance, supply chain sustainability milestones, PropTech showcases, and previewing the national estate outlook.',
    disciplines: ['PropTech & AI in FM', 'ESG & Carbon Reduction in Supply Chain', 'Annual Partner Network Summit'],
  },
];

export function AnnualProgrammeTimeline() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                INDICATIVE ANNUAL PROGRAMME
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              A structured four-quarter engagement calendar
            </h2>
            <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
              We structure our event formats across four quarterly themes, ensuring continuous technical development and clear commercial visibility throughout the operational year.
            </p>
          </div>

          <div className="text-xs text-[#6D6D68] font-light bg-white px-3.5 py-2 rounded-[4px] border border-[#E8E8E5] shadow-2xs shrink-0 self-start lg:self-auto">
            * 2026/2027 Indicative Rhythm
          </div>
        </div>

        {/* 4-Quarter Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUARTERS.map((q) => (
            <div
              key={q.period}
              className="p-6 bg-white border border-[#E8E8E5] rounded-[8px] shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#EA580C]/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
                  <span className="text-2xl font-bold text-[#EA580C]">
                    {q.period}
                  </span>
                  <span className="text-[10px] font-bold text-[#9A9A95] uppercase tracking-wider">
                    {q.season}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    {q.primaryTheme}
                  </span>
                  <h3 className="text-base font-semibold text-[#111111] leading-snug group-hover:text-[#EA580C] transition-colors">
                    {q.headlineFormat}
                  </h3>
                  <p className="mt-2 text-xs text-[#6D6D68] font-light leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E8E5] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A95] block mb-1">
                  Quarterly Focus Topics:
                </span>
                {q.disciplines.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-[#2D2D2D] font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
