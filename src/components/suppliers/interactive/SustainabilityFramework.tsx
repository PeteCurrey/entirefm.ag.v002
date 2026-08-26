'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  Truck, 
  Recycle, 
  Users, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown,
  Sun
} from 'lucide-react';

interface SustainabilityPillar {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  keyInitiatives: string[];
  metricsTarget: string;
  reportingRequirement: string;
}

const PILLARS: SustainabilityPillar[] = [
  {
    id: 'carbon-logistics',
    name: 'Scope 3 Carbon & Fleet Decarbonisation',
    badge: 'EMISSION REDUCTION // ROUTE LOGISTICS',
    tagline: 'Optimising engineer dispatch radiuses and transitioning to electric service fleets.',
    description: 'Up to 70% of supply chain carbon emissions stem from vehicle transit. EntireFM prioritises regional dispatch within 30 miles to eliminate unnecessary travel mileage and champions EV fleet adoption.',
    icon: Truck,
    keyInitiatives: [
      'Intelligent CAFM geospatial clustering to eliminate cross-county travel',
      'EV charging infrastructure installed across key client hub estates',
      'Fleet emission telemetry tracking for high-volume Tier-1 contractors',
      'Remote digital first-look diagnostics to reduce abortive callouts',
    ],
    metricsTarget: '50% EV / Hybrid supply chain fleet adoption across core regions by 2028',
    reportingRequirement: 'Annual fleet composition & total business travel mileage reporting',
  },
  {
    id: 'circular-economy',
    name: 'Circular Materials & F-Gas Reclamation',
    badge: 'ZERO WASTE // REFRIGERANT RECOVERY',
    tagline: '100% certified refrigerant recovery, scrap metal recycling, and parts remanufacturing.',
    description: 'We require absolute statutory adherence to hazardous waste containment, F-Gas logbook reconciliation, and certified recycling of replaced chillers, boilers, cables, and lighting fixtures.',
    icon: Recycle,
    keyInitiatives: [
      'Strict F-Gas cylinder reconciliation and certified reclamation logs',
      'Scrap metal, copper, and aluminium recycling with licensed audit trails',
      'WEEE electronic equipment certified disposal under Environment Agency rules',
      'Promotion of remanufactured compressors, pumps, and circuit boards where warranted',
    ],
    metricsTarget: 'Zero commercial maintenance waste sent to landfill by 2030',
    reportingRequirement: 'Hazardous waste transfer notes & F-Gas recovery certificates uploaded to CAFM',
  },
  {
    id: 'social-value',
    name: 'Social Value, Living Wage & Apprenticeships',
    badge: 'LOCAL COMMUNITIES // SKILLS INVESTMENT',
    tagline: 'Investing in local trade craft, real Living Wage rates, and youth apprenticeships.',
    description: 'We believe sustainable property management builds local community resilience. We champion regional independent SMEs, fair living wages, and structured training for the next generation of engineers.',
    icon: Users,
    keyInitiatives: [
      'Over 60% of regional supply chain spend ringfenced for local independent SMEs',
      'Commitment to the real Living Wage for all direct and subcontracted personnel',
      'Structured technical mentorship for apprentices across HVAC, Gas, and Electrical',
      'Equal opportunity workplace policies and dignified site welfare standards',
    ],
    metricsTarget: '1 apprentice or trainee supported for every 10 active contractor engineers',
    reportingRequirement: 'Annual social value declaration and apprentice count submission',
  },
  {
    id: 'energy-efficiency',
    name: 'Asset Energy Efficiency & Optimization',
    badge: 'BUILDING PERFORMANCE // BMS OPTIMISATION',
    tagline: 'Tuning building plant to minimize kWh consumption and carbon intensity.',
    description: 'Suppliers are EntireFM’s front-line energy champions. Our maintenance regimes focus on heat exchanger efficiency, VFD inverter optimization, and BMS setpoint tuning.',
    icon: Sun,
    keyInitiatives: [
      'SFG20 seasonal chiller condenser descaling and boiler burner tuning',
      'Variable Speed Drive (VFD) installation recommendations on aging pumps',
      'LED lighting retrofit surveys conducted alongside statutory EICR testing',
      'BMS deadband optimization to prevent simultaneous heating and cooling',
    ],
    metricsTarget: 'Average 12% energy reduction on plantrooms following EntireFM planned maintenance',
    reportingRequirement: 'Energy defect and optimization opportunities logged directly in CAFM worksheets',
  },
];

export function SustainabilityFramework() {
  const [activePillarId, setActivePillarId] = useState(PILLARS[0].id);

  const selected = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">ESG &amp; SUSTAINABLE SUPPLY CHAIN</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Our Four Pillars of Sustainable Partner Delivery
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireFM is committed to driving Scope 3 carbon reduction, circular engineering, and measurable social value across all UK managed client estates.
          </p>
        </div>

        {/* Pillar Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PILLARS.map((pillar) => {
            const isSelected = pillar.id === activePillarId;
            const PillarIcon = pillar.icon;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`text-left p-5 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <PillarIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-normal uppercase tracking-wider ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    ESG PILLAR
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-light mb-1 line-clamp-1">{pillar.name}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Content */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {selected.badge}
                </span>
                <h3 className="text-2xl font-light text-slate-900">{selected.name}</h3>
              </div>
            </div>

            <span className="text-xs font-light text-slate-700 italic max-w-md text-right hidden lg:block">
              &ldquo;{selected.tagline}&rdquo;
            </span>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200">
            {/* Initiatives List */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                CORE SUPPLY CHAIN INITIATIVES
              </span>
              <ul className="space-y-2.5">
                {selected.keyInitiatives.map((init, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light bg-white p-3 rounded-sm border border-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{init}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target & Reporting Specs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-emerald-700 block font-medium">
                  KEY SUSTAINABILITY TARGET
                </span>
                <p className="text-xs text-slate-900 font-light leading-relaxed">
                  {selected.metricsTarget}
                </p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                  REPORTING &amp; EVIDENCE REQUIREMENT
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.reportingRequirement}
                </p>
              </div>

              <div className="pt-2">
                <Link href="/suppliers/apply" className="btn-primary w-full justify-center text-xs py-3">
                  Partner with our Sustainable Supply Chain <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
