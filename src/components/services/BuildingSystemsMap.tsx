'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Zap, Wind, Lightbulb, Flame, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';

interface BuildingSystem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: typeof Zap;
  keyComponents: string[];
  statutoryStandard: string;
}

const SYSTEMS: BuildingSystem[] = [
  {
    id: 'electrical',
    name: 'Electrical Distribution & HV/LV Switchgear',
    category: 'POWER INFRASTRUCTURE',
    description: 'Centralised main switchboards, distribution panels, busbars, power factor correction, and sub-circuit monitoring ensuring uninterrupted electrical supply.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineer testing a commercial switchgear board',
    icon: Zap,
    keyComponents: ['Main LV Switchboards', 'Distribution Boards (DBs)', 'Thermal Imaging Inspection', 'Sub-metering Systems'],
    statutoryStandard: 'BS 7671 IET Wiring Regulations & Periodic EICR Auditing',
  },
  {
    id: 'hvac',
    name: 'Commercial HVAC, Cooling & Ventilation',
    category: 'CLIMATE & AIR QUALITY',
    description: 'Chillers, air handling units (AHUs), VRV/VRF air conditioning, extract fans, and ductwork networks maintaining thermal comfort and fresh air volume.',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'EntireFM engineers inspecting rooftop air handling units',
    icon: Wind,
    keyComponents: ['Rooftop Chiller Plant', 'Air Handling Units (AHUs)', 'VRV/VRF Cassettes', 'Extract & LEV Systems'],
    statutoryStandard: 'F-Gas Fluorinated Greenhouse Gas Regulations & TM44 Energy Inspections',
  },
  {
    id: 'lighting',
    name: 'Lighting & Emergency Discharge Systems',
    category: 'ILLUMINATION & COMPLIANCE',
    description: 'Automated architectural lighting, DALI control interfaces, and dedicated battery-backed emergency luminaire networks with automated discharge testing.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM engineer testing emergency lighting circuits',
    icon: Lightbulb,
    keyComponents: ['DALI & PIR Controls', '3-Hour Emergency Luminaires', 'Central Battery Units', 'Exit Signage Arrays'],
    statutoryStandard: 'BS 5266-1 Code of Practice for Emergency Lighting of Premises',
  },
  {
    id: 'plumbing',
    name: 'Commercial Boilers, Plantroom & Water Services',
    category: 'HEATING & WATER HYGIENE',
    description: 'Commercial gas boiler plant, pressurisation booster sets, calorifiers, circulation pumps, and water hygiene infrastructure.',
    imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
    imageAlt: 'EntireFM engineers servicing plant room pumps and pipework',
    icon: Flame,
    keyComponents: ['Commercial Condensing Boilers', 'Pressurisation Booster Pumps', 'Expansion Vessels', 'Calorifiers & TMVs'],
    statutoryStandard: 'L8 ACoP Legionella Control & Commercial Gas Safety Regulations',
  },
  {
    id: 'access',
    name: 'Access Control, Barriers & Automation',
    category: 'SECURITY & BUILDING ACCESS',
    description: 'Integrated keycard access control, automated pedestrian speedlanes, vehicle barrier gates, and BMS system automation interfaces.',
    imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
    imageAlt: 'EntireFM engineer installing commercial access control equipment',
    icon: KeyRound,
    keyComponents: ['Contactless Card Readers', 'Automated Rising Barriers', 'Turnstile Speedlanes', 'Intercom & Maglocks'],
    statutoryStandard: 'BS EN 60839 Electronic Access Control Systems Standards',
  },
  {
    id: 'lifesafety',
    name: 'Fire Detection & Life-Safety Infrastructure',
    category: 'CRITICAL ASSET PROTECTION',
    description: 'Addressable smoke detection networks, manual call points, automatic opening vents (AOV), dry riser testing, and fire damper drop tests.',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'EntireFM engineers inspecting critical building life safety interfaces',
    icon: ShieldAlert,
    keyComponents: ['Addressable Fire Panels', 'AOV Smoke Ventilation', 'Dry Riser Inlets', 'Fire Damper Drops'],
    statutoryStandard: 'BS 5839 Fire Detection and Alarm Systems for Buildings',
  },
];

export function BuildingSystemsMap() {
  const [activeSystemId, setActiveSystemId] = useState<string>('electrical');
  const activeSystem = SYSTEMS.find(s => s.id === activeSystemId) || SYSTEMS[0];

  return (
    <section className="py-20 sm:py-28 bg-brand-graphite text-white relative overflow-hidden border-b border-brand-edge-dark">
      {/* Background blueprint grid */}
      <div
        aria-hidden="true"
        className="facet-rule pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink-light">
              M&E TECHNICAL ARCHITECTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Commercial Building Systems Map
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Commercial buildings rely on deeply interconnected mechanical, electrical, and public health systems. EntireFM delivers single-contract management across the complete building ecosystem.
          </p>
        </div>

        {/* Interactive Systems Map UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Systems Navigation Tabs */}
          <div className="lg:col-span-5 space-y-2.5">
            {SYSTEMS.map((system) => {
              const Icon = system.icon;
              const isActive = system.id === activeSystemId;

              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => setActiveSystemId(system.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-sm border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                    isActive
                      ? 'bg-brand-carbon border-brand-pink shadow-glow text-white'
                      : 'bg-brand-graphite/80 border-brand-edge-dark text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-brand-pink text-white shadow-subtle'
                          : 'bg-brand-carbon border border-brand-edge-dark text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-pink-light block">
                        {system.category}
                      </span>
                      <strong className="text-sm font-bold block truncate mt-0.5">
                        {system.name}
                      </strong>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-brand-pink translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active System Visual Breakdown */}
          <div className="lg:col-span-7 bg-brand-carbon border border-brand-edge-dark rounded-sm overflow-hidden flex flex-col justify-between shadow-elevated">
            {/* Photographic Header */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src={activeSystem.imageSrc}
                alt={activeSystem.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon via-brand-carbon/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-brand-graphite/90 border border-brand-edge-dark px-3 py-1 text-xs font-mono text-brand-pink-light rounded-sm backdrop-blur-md">
                {activeSystem.category}
              </div>
            </div>

            {/* System Specs & Component Architecture */}
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {activeSystem.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {activeSystem.description}
                </p>

                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Key Infrastructure Components Maintained
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSystem.keyComponents.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 bg-brand-graphite/80 border border-brand-edge-dark rounded-sm text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400">
                <span>Statutory Governance:</span>
                <span className="text-brand-pink-light font-mono font-semibold text-right">
                  {activeSystem.statutoryStandard}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
