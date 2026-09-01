'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Flame, ShieldAlert, Lightbulb, Bell, FileCheck, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface FireDiscipline {
  id: string;
  number: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  testedElements: string[];
  statutoryStandard: string;
  testingInterval: string;
}

const FIRE_DISCIPLINES: FireDiscipline[] = [
  {
    id: 'alarm-detection',
    number: '01',
    name: 'Addressable Fire Alarm & Detection Networks',
    category: 'ACTIVE DETECTION & ALERTING',
    headline: 'Multi-sensor detection, manual call points, and networked control panels.',
    description: 'Quarterly and annual inspection of optical smoke sensors, rate-of-rise heat detectors, aspirating smoke detection (VESDA), sounder beacon circuits, and auxiliary cause-and-effect interfaces.',
    imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
    imageAlt: 'EntireFM engineer commissioning commercial addressable fire alarm panel and control wiring',
    testedElements: [
      'Addressable Loop Impedance & Voltage Verification',
      'Aspirating Smoke Detection (VESDA) Pipework Transit Time',
      'Optical & Thermal Smoke Sensor Sensitivity Testing',
      'Auxiliary Interface Relays (Gas shut-off, lift grounding, access unlock)',
    ],
    statutoryStandard: 'BS 5839-1:2017 Fire Detection and Fire Alarm Systems for Buildings',
    testingInterval: 'Weekly bell test + Quarterly inspection & 100% annual device test',
  },
  {
    id: 'emergency-lighting',
    number: '02',
    name: 'Emergency Lighting 3-Hour Discharge Testing',
    category: 'EGRESS ILLUMINATION & LIFE SAFETY',
    headline: 'Statutory 3-hour annual battery discharge audits and illuminated exit routes.',
    description: 'Comprehensive monthly functional flick tests and full statutory 3-hour battery discharge audits. Luminaire replacement, lux level verification along designated escape corridors, and digital logbook certification.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM engineer testing commercial emergency lighting battery circuits',
    testedElements: [
      '3-Hour Full Duration Battery Discharge Test',
      'Maintained & Non-Maintained LED Luminaire Lux Levels',
      'Illuminated Exit Signage & Directional Photometrics',
      'Central Battery Inverter (CBU) Electrolyte & Voltage Audits',
    ],
    statutoryStandard: 'BS 5266-1:2016 Code of Practice for the Emergency Lighting of Premises',
    testingInterval: 'Monthly functional flash test + Annual full 3-hour discharge audit',
  },
  {
    id: 'dampers-compartmentation',
    number: '03',
    name: 'Fire Damper Drop Testing & Compartmentation',
    category: 'PASSIVE FIRE CONTAINMENT',
    headline: 'Fusible link drop tests, motorized dampers, and structural barrier integrity.',
    description: 'Physical inspection and drop testing of HVAC fire and smoke dampers located in compartment walls, verifying spring return actuation, microswitch feedback to BMS, and cleaning of accumulated debris.',
    imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    imageAlt: 'EntireFM technician inspecting commercial ventilation ductwork and motorized fire damper',
    testedElements: [
      'Spring-Loaded & Motorized Fire Damper Release Verification',
      'Thermal Fusible Link Condition & Replacement',
      'Access Hatch Clearances & Internal Duct Cleaning',
      'BMS Status Telemetry & Remote Reset Testing',
    ],
    statutoryStandard: 'BS 9999:2017 Code of Practice for Fire Safety in the Design & Management of Buildings',
    testingInterval: 'Annual physical drop test and visual inspection on 100% of dampers',
  },
  {
    id: 'suppression-risers',
    number: '04',
    name: 'Dry/Wet Risers & Gaseous Suppression Plant',
    category: 'FIRE SUPPRESSION & BRIGADE ACCESS',
    headline: 'Hydraulic riser pressurisation, server room gas suppression, and sprinkler valve checks.',
    description: 'Hydrostatic pressure testing of dry risers to 12 bar, flow rate audits on wet riser pumps, and weight verification of gaseous fire suppression cylinders (FM-200, Novec 1230, IG-55) in critical server and archive rooms.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineers inspecting critical plant suppression and distribution infrastructure',
    testedElements: [
      'Hydrostatic 12-Bar Pressure Testing of Dry Riser Inlets & Landing Valves',
      'Clean Agent Suppression Cylinder Weight & Pressure Checks',
      'Room Integrity Fan Testing for Gaseous Enclosures',
      'Sprinkler Flow Switch & Alarm Valve Operational Verification',
    ],
    statutoryStandard: 'BS 9990:2015 Non-Automatic Fire-Fighting Systems in Buildings & BS EN 15004',
    testingInterval: '6-Monthly visual inspection + Annual hydrostatic pressure test',
  },
  {
    id: 'digital-logbook',
    number: '05',
    name: 'EntireCAFM Fire Safety Register & Golden Thread',
    category: 'STATUTORY COMPLIANCE ARCHIVE',
    headline: 'Auditable digital fire safety registers aligning with the Building Safety Act.',
    description: 'Every test result, engineer certificate, defect remedial, and fire risk assessment (FRA) action item is timestamped and archived digitally in EntireCAFM, providing instant proof of duty-holder compliance.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM compliance manager reviewing digital fire safety logbook with commercial client',
    testedElements: [
      'Digital Certificate Vault with Timestamped Engineer Sign-Off',
      'Fire Risk Assessment (FRA) Action Plan Tracking',
      'Mandatory Occurrence Reporting (MOR) Escalation Pathway',
      'Real-Time Client Dashboard for Insurers and Enforcing Authorities',
    ],
    statutoryStandard: 'Regulatory Reform (Fire Safety) Order 2005 & Building Safety Act 2022',
    testingInterval: 'Continuous real-time digital sync on all completed works',
  },
];

export function FireSafetyMatrix() {
  const [activeId, setActiveId] = useState<string>('alarm-detection');
  const active = FIRE_DISCIPLINES.find((d) => d.id === activeId) || FIRE_DISCIPLINES[0];

  return (
    <section className="py-20 lg:py-28 bg-[#09111F] text-white relative overflow-hidden border-t border-white/[0.06]">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/30 mb-4">
            <Flame className="w-3.5 h-3.5 text-hero-pink" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-brand-pink-light">
              LIFE SAFETY & STATUTORY REGIMES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            The Fire Safety & Life-Safety Matrix
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-mist/75 font-light leading-relaxed">
            Statutory fire compliance is zero-tolerance. From addressable sensor arrays and 3-hour emergency lighting discharge tests to damper drops and digital golden thread archives, explore how EntireFM protects your estate and duty holders.
          </p>
        </div>

        {/* 5-Discipline Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {FIRE_DISCIPLINES.map((discipline) => {
            const isSelected = discipline.id === active.id;
            return (
              <button
                key={discipline.id}
                onClick={() => setActiveId(discipline.id)}
                className={`text-left p-3.5 sm:p-4 rounded-md transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white/[0.08] border-brand-pink/60 shadow-[0_0_20px_rgba(237,56,153,0.18)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-normal${isSelected ? 'text-hero-pink' : 'text-brand-mist/40'}`}>
                    {discipline.number}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />}
                </div>
                <span className={`text-xs sm:text-sm font-light leading-snug line-clamp-2 ${isSelected ? 'text-white font-normal' : 'text-brand-mist/70'}`}>
                  {discipline.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Discipline Card */}
        <div className="bg-[#060C16] border border-white/[0.08] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#060C16] via-[#060C16]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#060C16]" />

              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 flex items-center justify-between">
                <span className="text-[10.5px] font-medium text-hero-pink uppercase tracking-wider">
                  {active.category}
                </span>
                <span className="text-[10px] font-light text-brand-mist/70">
                  BAFE & FIA Aligned
                </span>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-hero-pink px-2 py-0.5 rounded-xs bg-brand-pink/15 border border-brand-pink/30">
                    REGIME {active.number}
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

              {/* Tested Elements */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-mist/50 block">
                  Mandatory Inspection & Verification Protocols:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {active.testedElements.map((elem, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-hero-pink shrink-0 mt-0.5" />
                      <span className="text-xs font-light text-white/90 leading-tight">
                        {elem}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory & Interval Strip */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Statutory Standard
                  </span>
                  <p className="text-xs font-normal text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {active.statutoryStandard}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-brand-mist/50 uppercase tracking-wider block">
                    Testing Interval
                  </span>
                  <p className="text-xs font-normal text-brand-mist/90 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-hero-pink shrink-0" />
                    {active.testingInterval}
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
