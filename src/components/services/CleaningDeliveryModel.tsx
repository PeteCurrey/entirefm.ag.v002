'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Clock, CheckCircle2, ShieldCheck, Sun, Moon, Wrench, FileCheck, Layers } from 'lucide-react';

interface CleaningShift {
  id: string;
  shift: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  deliverables: string[];
  auditingStandard: string;
  operationalHours: string;
}

const CLEANING_SHIFTS: CleaningShift[] = [
  {
    id: 'daytime-janitorial',
    shift: 'PHASE 01',
    name: 'Daytime Janitorial & High-Touchpoint Care',
    category: 'ACTIVE ESTATE OCCUPANCY',
    tagline: 'Discreet, responsive day presence maintaining continuous workplace hygiene.',
    description: 'Trained, uniformed day janitors maintain spotless public washrooms, restock hygiene consumables, sanitise high-frequency door handles and lift buttons, and respond instantly to accidental spills without disrupting business trading.',
    imageSrc: '/images/locations/sheffield/facilities-management-sheffield-winter-garden-1600w.webp',
    imageAlt: 'EntireFM commercial cleaning operative maintaining high-specification glass atrium',
    deliverables: [
      'Hourly Washroom Inspection & Consumable Replenishment',
      'High-Contact Touchpoint Sanitisation (Lifts, Railings, Handles)',
      'Fast-Response Spill & Breakage Triage Desk',
      'Reception, Atrium & Meeting Suite Turnaround Cleans',
    ],
    auditingStandard: 'BICSc Colour-Coded Cross-Contamination Standards',
    operationalHours: '07:00 – 17:00 Daily Occupancy Coverage',
  },
  {
    id: 'evening-corporate',
    shift: 'PHASE 02',
    name: 'Evening Corporate Deep Clean & Floor Care',
    category: 'OUT-OF-HOURS REPAIR & RESET',
    tagline: 'Complete floor-by-floor sanitisation and workspace reset for day-one presentation.',
    description: 'Post-close commercial cleaning crews perform full floor vacuums with hospital-grade HEPA filters, microfibre workstation sanitisation, bin decanting with zero-to-landfill waste segregation, and secure lock-up protocols.',
    imageSrc: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp',
    imageAlt: 'EntireFM commercial contract cleaning in Grade-A corporate office building',
    deliverables: [
      'HEPA-Filtrated Carpet & Hard Floor Debris Extraction',
      'Anti-Static Workstation & Keyboard Surface Disinfection',
      'Kitchenette & Tea-Point Appliance Descaling & Degreasing',
      'Confidential Waste & Multi-Stream Recycling Segregation',
    ],
    auditingStandard: 'ISO 14001 Environmental Waste Compliance',
    operationalHours: '18:00 – 22:00 Evening Shift Execution',
  },
  {
    id: 'periodic-specialist',
    shift: 'PHASE 03',
    name: 'Periodic Machine Scrubbing & Restoration',
    category: 'HARD ASSET RESTORATION',
    tagline: 'High-reach carbon pole window washing, diamond floor polishing & carpet extraction.',
    description: 'Dedicated mobile specialist cleaning teams deploy heavy machinery for hot-water extraction carpet restoration, rotary diamond floor scrubbing, 60ft carbon-fibre reach window washing, and high-pressure steam cleaning of exterior realm.',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    imageAlt: 'EntireFM industrial specialist cleaning team with heavy extraction equipment',
    deliverables: [
      'Diamond Pad Hard Floor Scrubbing & Protective Seal Application',
      'Industrial Hot-Water Extraction (HWE) Carpet Deep Cleans',
      'High-Level Internal Façade, Truss & Atrium Vacuuming',
      'External Cladding, Paving & Carpark Jet Washing',
    ],
    auditingStandard: 'PAS 86 Professional Carpet & Hard Floor Standard',
    operationalHours: 'Scheduled Weekend / Low-Footfall Execution',
  },
  {
    id: 'clinical-infection',
    shift: 'PHASE 04',
    name: 'Clinical & Infection Control Sanitisation',
    category: 'HEALTHCARE & SENSITIVE ENVIRONMENTS',
    tagline: 'Ultra-low volume (ULV) bio-misting and hospital-grade decontamination.',
    description: 'Strict hospital-grade disinfection protocols tailored for medical centres, laboratory cleanrooms, and food processing facilities. Utilising broad-spectrum virucidal disinfectants and electrostatic aerosol fogging.',
    imageSrc: '/images/locations/liverpool/facilities-management-liverpool-waterfront-plant-room-1600w.webp',
    imageAlt: 'EntireFM medical and clinical sanitisation operations in specialist facility',
    deliverables: [
      'Electrostatic ULV Antimicrobial Fogging & Surface Bonding',
      'Clinical Waste Bagging & Approved Disposal Pathways',
      'Strict 4-Colour Microfibre Isolation Protocol',
      'Laboratory Cleanroom Surface Decontamination',
    ],
    auditingStandard: 'NHS National Standards of Healthcare Cleanliness 2021',
    operationalHours: 'Dedicated Clean-Window Protocols',
  },
  {
    id: 'digital-audit',
    shift: 'PHASE 05',
    name: 'EntireCAFM Quality Audits & ATP Verification',
    category: 'QUALITY GOVERNANCE & PROOF',
    tagline: 'Photographic proof, supervisor scoring, and ATP bioluminescence hygiene logging.',
    description: 'Supervisors conduct structured digital audits directly inside EntireCAFM using ATP bioluminescence swab tests on critical surfaces. Instant client access to cleaning scorecards, shift sign-offs, and compliance logs.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM operations supervisor presenting digital cleaning quality scores to client',
    deliverables: [
      'ATP Bioluminescence Swab Testing on High-Risk Touchpoints',
      'Before & After Photographic Proof Uploaded to Client CAFM',
      'Monthly KPI Service Level Agreement (SLA) Scoring Reports',
      'Automated COSHH Data Sheet Safety Vault Access',
    ],
    auditingStandard: 'ISO 9001 Quality Management & BICSc Audit Scoring',
    operationalHours: 'Automated Real-Time Shift Reporting',
  },
];

export function CleaningDeliveryModel() {
  const [activeId, setActiveId] = useState<string>('evening-corporate');
  const active = CLEANING_SHIFTS.find((s) => s.id === activeId) || CLEANING_SHIFTS[1];

  return (
    <section className="py-20 lg:py-28 bg-[#060C16] text-white relative overflow-hidden border-t border-white/[0.06]">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-electric/10 border border-brand-electric/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-electric-bright" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-brand-electric-bright">
              STRUCTURED COMMERCIAL DELIVERY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            The Day/Night Commercial Cleaning Delivery Model
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-mist/75 font-light leading-relaxed">
            High-specification corporate workspaces, retail parks, and industrial sites require a structured multi-shift delivery framework. Discover how EntireFM balances daytime responsiveness with out-of-hours deep sanitisation.
          </p>
        </div>

        {/* 5-Phase Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {CLEANING_SHIFTS.map((item) => {
            const isSelected = item.id === active.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`text-left p-3.5 sm:p-4 rounded-md transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white/[0.08] border-brand-electric/60 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-normal${isSelected ? 'text-brand-electric-bright' : 'text-brand-mist/40'}`}>
                    {item.shift}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-electric-bright animate-pulse" />}
                </div>
                <span className={`text-xs sm:text-sm font-light leading-snug line-clamp-2 ${isSelected ? 'text-white font-normal' : 'text-brand-mist/70'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Card */}
        <div className="bg-[#09111F] border border-white/[0.08] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden">
              <Image
                src={active.imageSrc}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09111F] via-[#09111F]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#09111F]" />

              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 flex items-center justify-between">
                <span className="text-[10.5px] font-medium text-brand-electric-bright uppercase tracking-wider">
                  {active.category}
                </span>
                <span className="text-[10px] font-light text-brand-mist/70">
                  BICSc Certified Delivery
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-brand-electric-bright px-2 py-0.5 rounded-xs bg-brand-electric/15 border border-brand-electric/30">
                    {active.shift}
                  </span>
                  <span className="text-xs font-light text-brand-mist/50 uppercase tracking-wider">
                    {active.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white leading-snug">
                  {active.name}
                </h3>

                <p className="text-sm sm:text-base font-light text-brand-mist/85 leading-relaxed">
                  {active.description}
                </p>
              </div>

              {/* Deliverables List */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                  Core Operational Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {active.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs font-light text-white/90 leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards and Window */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Quality Standard
                  </span>
                  <p className="text-xs font-normal text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {active.auditingStandard}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Operational Shift
                  </span>
                  <p className="text-xs font-normal text-brand-mist/90 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
                    {active.operationalHours}
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
