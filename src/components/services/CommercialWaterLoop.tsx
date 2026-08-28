'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Droplets, Flame, Gauge, ShieldCheck, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

interface WaterStage {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  components: string[];
  statutoryMandate: string;
  maintenanceFrequency: string;
}

const WATER_STAGES: WaterStage[] = [
  {
    id: 'mains-intake',
    number: '01',
    name: 'Mains Water Intake & Backflow Prevention',
    category: 'POTABLE INTAKE & COMPLIANCE',
    tagline: 'Isolating incoming municipal supply from contamination hazards.',
    description: 'Incoming commercial water supply entering the estate requires certified RPZ (Reduced Pressure Zone) backflow prevention valves, isolation valves, and upstream strainers to protect the public water main.',
    imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
    imageAlt: 'EntireFM commercial plumber conducting pressure testing on pipework',
    components: [
      'Type BA RPZ Backflow Preventer Valves',
      'WRAS Approved Main Isolation Valves',
      'Dual Y-Strainers & Sediment Filtration',
      'Digital Water Metering & Telemetry Pulse',
    ],
    statutoryMandate: 'Water Supply (Water Fittings) Regulations 1999 & WRAS Standards',
    maintenanceFrequency: 'Annual RPZ recalibration & quarterly strainer flush',
  },
  {
    id: 'booster-sets',
    number: '02',
    name: 'Multi-Stage Pressure Booster Sets',
    category: 'HYDRAULIC PRESSURE & DISTRIBUTION',
    tagline: 'Maintaining constant static head across multi-storey risers.',
    description: 'Twin and triple-pump variable speed inverter booster sets lift potable water to upper floors, ensuring consistent static dynamic pressure even during peak tenant demand periods.',
    imageSrc: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    imageAlt: 'EntireFM commercial plumbing engineer servicing multi-stage booster pump set',
    components: [
      'Inverter-Driven Vertical Multistage Pumps',
      'Pre-Charged Membrane Expansion Vessels',
      'Dry-Run & Low Pressure Safety Cut-Offs',
      'BMS Pressure Transducer Feedback Loop',
    ],
    statutoryMandate: 'BS EN 806 Specifications for Installations Inside Buildings',
    maintenanceFrequency: 'Quarterly mechanical inspection & monthly vessel pressure checks',
  },
  {
    id: 'commercial-heating',
    number: '03',
    name: 'Commercial Boilers & Calorifier Storage',
    category: 'THERMAL GENERATION & HOT WATER',
    tagline: 'High-efficiency condensing gas plant & 60°C thermal pasteurization.',
    description: 'High-output condensing commercial boiler cascades paired with direct/indirect calorifiers maintain hot water generation at a strict 60°C core temperature to suppress microbiological proliferation.',
    imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
    imageAlt: 'EntireFM engineers maintaining commercial plantroom heating pumps and calorifiers',
    components: [
      'Modulating Gas Condensing Boilers (>96% efficiency)',
      'Stainless Steel Indirect Domestic Hot Water (DHW) Calorifiers',
      'Shunt Pumps & Automatic Gas Solenoid Interlocks',
      'Expansion Relief Valves & Flue Dilution Systems',
    ],
    statutoryMandate: 'Gas Safety (Installation and Use) Regulations 1998 & CP12 Certification',
    maintenanceFrequency: 'Annual Gas Safety CP12 overhaul & 6-monthly burner tuning',
  },
  {
    id: 'tmv-mixing',
    number: '04',
    name: 'Secondary Return Loops & TMV Mixing',
    category: 'DISTRIBUTION & SCALD PREVENTION',
    tagline: 'Continuous 50°C return circulation with point-of-use thermostatic blending.',
    description: 'Dedicated secondary return pumps circulate domestic hot water continuously, ensuring return water arrives back at plant at ≥50°C while thermostatic mixing valves (TMVs) deliver safe 41°C user discharge.',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'EntireFM technical engineer testing plumbing circulation valves',
    components: [
      'Bronze Secondary Return Circulators',
      'Thermostatic Mixing Valves (TMV2 / TMV3 Type)',
      'Non-Return Check Valves & Balancing Orifices',
      'Pipework Insulation & Thermal Trace Heating',
    ],
    statutoryMandate: 'NHS Model Engineering Spec D08 & Building Regulations Part G',
    maintenanceFrequency: 'Bi-annual TMV fail-safe testing & temperature audits',
  },
  {
    id: 'l8-hygiene',
    number: '05',
    name: 'L8 Legionella & Sentinel Monitoring',
    category: 'STATUTORY WATER HYGIENE',
    tagline: 'Contemporaneous digital temperature logging and biological sampling.',
    description: 'Systematic monthly sentinel tap testing, quarterly showerhead descaling, bi-annual cold water storage tank inspections, and UKAS-accredited microbiological sampling archived directly in EntireCAFM.',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'EntireFM engineer conducting digital water hygiene temperature logging',
    components: [
      'Calibrated Digital Immersion Probes',
      'Cold Water Storage Tank (CWST) Inspection Hatches',
      'UKAS-Accredited Legionella & TVC Dipslide Kits',
      'EntireCAFM Real-Time Compliance Logbooks',
    ],
    statutoryMandate: 'HSE Approved Code of Practice L8 & HSG274 Technical Guidance',
    maintenanceFrequency: 'Monthly temperature profiling & bi-annual water tank inspections',
  },
];

export function CommercialWaterLoop() {
  const [activeStageId, setActiveStageId] = useState<string>('booster-sets');
  const activeStage = WATER_STAGES.find((s) => s.id === activeStageId) || WATER_STAGES[1];

  return (
    <section className="py-20 lg:py-28 bg-[#060C16] text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-electric/10 border border-brand-electric/30 mb-4">
            <Droplets className="w-3.5 h-3.5 text-brand-electric-bright" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-brand-electric-bright">
              ENGINEERED WATER & HEATING INFRASTRUCTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            The Commercial Water & Heating Loop
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-mist/75 font-light leading-relaxed">
            Commercial building water systems demand precise hydraulic balancing, statutory temperature control (L8), and continuous preventative maintenance. Explore the multi-stage infrastructure our engineers maintain.
          </p>
        </div>

        {/* 5-Step Interactive Process Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {WATER_STAGES.map((stage) => {
            const isActive = stage.id === activeStage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-3.5 sm:p-4 rounded-md transition-all duration-300 flex flex-col justify-between relative border ${
                  isActive
                    ? 'bg-white/[0.08] border-brand-electric/60 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-mono ${isActive ? 'text-brand-electric-bright' : 'text-brand-mist/40'}`}>
                    {stage.number}
                  </span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-electric-bright animate-pulse" />}
                </div>
                <span className={`text-xs sm:text-sm font-light leading-snug line-clamp-2 ${isActive ? 'text-white font-normal' : 'text-brand-mist/70'}`}>
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel (60/40 Split) */}
        <div className="bg-[#09111F] border border-white/[0.08] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Photographic Proof & Live Status */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
              <Image
                src={activeStage.imageSrc}
                alt={activeStage.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09111F] via-[#09111F]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#09111F]" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 flex items-center justify-between">
                <span className="text-[10.5px] font-mono text-brand-electric-bright uppercase tracking-wider">
                  {activeStage.category}
                </span>
                <span className="text-[10px] font-light text-brand-mist/70">
                  EntireFM Engineering Standard
                </span>
              </div>
            </div>

            {/* Right: Technical Engineering Specifications */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand-electric-bright px-2 py-0.5 rounded-xs bg-brand-electric/15 border border-brand-electric/30">
                    STAGE {activeStage.number}
                  </span>
                  <span className="text-xs font-light text-brand-mist/50 uppercase tracking-wider">
                    {activeStage.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white leading-snug">
                  {activeStage.name}
                </h3>

                <p className="text-sm sm:text-base font-light text-brand-mist/85 leading-relaxed">
                  {activeStage.description}
                </p>
              </div>

              {/* Key Maintained Components */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                  Critical Maintained Plant & Assets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeStage.components.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs font-light text-white/90 leading-tight">
                        {comp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Framework & Compliance Strip */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-brand-mist/50 uppercase tracking-wider block">
                    Statutory Framework
                  </span>
                  <p className="text-xs font-normal text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {activeStage.statutoryMandate}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-brand-mist/50 uppercase tracking-wider block">
                    Recommended PPM Frequency
                  </span>
                  <p className="text-xs font-normal text-brand-mist/90 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                    {activeStage.maintenanceFrequency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
