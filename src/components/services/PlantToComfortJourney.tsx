'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wind, Snowflake, Flame, Cpu, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JourneyStep {
  step: string;
  title: string;
  stage: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: typeof Wind;
  technicalDetails: string[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: '01',
    stage: 'AIR INTAKE & FILTRATION',
    title: 'Outside Air Intake & Advanced Filtration',
    description: 'Fresh ambient air is drawn through acoustic weather louvres and passed through multi-stage pre-filters and fine bag filters to eliminate particulate matter before reaching mechanical plant.',
    imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    imageAlt: 'EntireFM engineer conducting a thermal survey on air handling filtration',
    icon: Wind,
    technicalDetails: ['G4 Pre-filter & F7 Bag Filter Replacement', 'Differential Pressure Gauge Audits', 'Acoustic Attenuation & Damper Checks'],
  },
  {
    step: '02',
    stage: 'THERMAL CONDITIONING',
    title: 'Thermal Conditioning & Refrigerant Exchange',
    description: 'The air stream is heated or cooled via chilled water coils, DX evaporators, or condensing boiler heating matrices, regulated by precise refrigerant pressure circuits.',
    imageSrc: '/images/editorial/entirefm-hvac-refrigerant-check-2000w.webp',
    imageAlt: 'EntireFM engineers testing HVAC refrigerant pressures',
    icon: Snowflake,
    technicalDetails: ['Refrigerant Leak Testing to F-Gas Intervals', 'Chiller Compressor Oil & Vibration Analysis', 'Heating Matrix Descaling & Balancing'],
  },
  {
    step: '03',
    stage: 'AIR DISTRIBUTION',
    title: 'High-Efficiency Air Handling & Fan Delivery',
    description: 'High-efficiency EC plug fans and variable speed drives (VFDs) modulate static pressure to deliver volume-controlled air throughout supply ductwork networks.',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    imageAlt: 'EntireFM engineers inspecting rooftop air handling unit fans and motors',
    icon: Wind,
    technicalDetails: ['VFD Frequency Inverter Calibration', 'Fan Motor Bearing Lubrication & Alignment', 'Duct Static Pressure Balance Verification'],
  },
  {
    step: '04',
    stage: 'BMS ENVIRONMENTAL CONTROL',
    title: 'BMS Automation & Environmental Zoning',
    description: 'Modulating motorized dampers and 2-port/3-port control valves adjust flow rates based on real-time room temperature setpoints and CO2 demand profiles.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM engineer reviewing HVAC building management system telemetry',
    icon: Cpu,
    technicalDetails: ['Motorized Actuator & Damper Testing', 'Zone Thermostat Sensor Calibration', 'Time Schedule & Deadband Optimization'],
  },
  {
    step: '05',
    stage: 'OCCUPANT COMFORT',
    title: 'Occupant Comfort & Indoor Air Quality (IAQ)',
    description: 'Conditioned, filtered air enters occupied office spaces, clinical suites, or retail floors via ceiling swirl diffusers and fan coil units, maintaining quiet, stable temperatures.',
    imageSrc: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
    imageAlt: 'EntireFM engineer servicing a ceiling cassette air conditioning unit',
    icon: Users,
    technicalDetails: ['Condensate Pump & Tray Chemical Cleansing', 'Supply/Extract Air Balancing', 'Indoor Air Quality (IAQ) Compliance Checks'],
  },
];

export function PlantToComfortJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-pink">
              SYSTEM ARCHITECTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            From Plant Deck to Occupant Comfort
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            Understanding the complete lifecycle of climate engineering — how EntireFM manages every stage from rooftop chillers and AHUs to terminal indoor air quality.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {JOURNEY_STEPS.map((s, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-brand-pink text-white shadow-elevated'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span
                  className={`text-xs font-mono font-medium block mb-1 ${
                    isActive ? 'text-brand-pink' : 'text-slate-400'
                  }`}
                >
                  STAGE {s.step}
                </span>
                <strong className="text-xs font-medium block leading-snug truncate">
                  {s.stage}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Active Stage Feature Card */}
        <div className="bg-slate-900 text-white rounded-sm border border-slate-800 overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Stage Visual */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-auto min-h-[22rem]">
            <Image
              src={activeStep.imageSrc}
              alt={activeStep.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/40" />
            <div className="absolute top-4 left-4 bg-slate-900/90 text-brand-pink-light border border-white/15 px-3 py-1 text-xs font-mono font-medium rounded-sm backdrop-blur-md">
              STAGE {activeStep.step}: {activeStep.stage}
            </div>
          </div>

          {/* Right Column: Stage Description & Technical Checks */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-pink block mb-2">
                ENGINEERING EXECUTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-4">
                {activeStep.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
                {activeStep.description}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Key Planned Maintenance Routines
                </span>
                {activeStep.technicalDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Statutory Compliance: F-Gas & TM44</span>
              <button
                type="button"
                onClick={() => setActiveStepIndex((activeStepIndex + 1) % JOURNEY_STEPS.length)}
                className="text-brand-pink hover:text-brand-pink-light font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
