'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  Zap,
  Flame,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Info,
  HardHat,
  Search,
  Building,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ResourceHero } from '@/components/resources/ResourceHero';
import { EditorialImageBreak } from '@/components/resources/EditorialImageBreak';
import { AnnotatedTechnicalImage } from '@/components/resources/AnnotatedTechnicalImage';
import type { TemplateProps } from '../types';

interface WalkthroughItem {
  id: string;
  title: string;
  locationType: string;
  focusArea: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  statutoryStandard: string;
  keyCheckpoints: string[];
  commonDefects: string[];
  recommendedInterval: string;
  fieldAction: string;
}

const WALKTHROUGHS: WalkthroughItem[] = [
  {
    id: 'walk-boilerhouse',
    title: 'The Commercial Boiler House & Gas Safety Walkthrough',
    locationType: 'Basement / Ground Floor Plantrooms',
    focusArea: 'Commercial Gas & Heating Plant',
    summary: 'A step-by-step survey of commercial gas boilers, flue dilution systems, pressurisation units, and gas proving interlocks.',
    imageSrc: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    imageAlt: 'EntireFM engineer inspecting commercial boilerhouse and pressurisation pump set',
    statutoryStandard: 'Gas Safety (Installation & Use) Regs 1998 · Reg 35',
    keyCheckpoints: [
      'Gas proving system and automatic isolation solenoid valve operation',
      'Flue route integrity and mechanical ventilation interlocks',
      'Expansion vessel pre-charge pressure and safety relief valve discharge lines',
      'Circulation pump mechanical seals, anti-vibration bellows, and delta-T balance',
    ],
    commonDefects: [
      'Failed ventilation interlock pressure switches bypassed with temporary electrical jumpers',
      'Waterlogged expansion vessels causing system over-pressurisation and PRV weeping',
      'Corroded flue joints with signs of carbon and acidic condensate staining',
    ],
    recommendedInterval: 'Monthly internal visual / Annual certified service (CP15)',
    fieldAction: 'Log pressure readings to digital asset log; isolate immediately if gas odor or flue spillage is detected.',
  },
  {
    id: 'walk-switchroom',
    title: 'Main LV Switchroom & Distribution Survey',
    locationType: 'Dedicated Electrical Switchrooms',
    focusArea: 'Electrical Infrastructure & Switchgear',
    summary: 'What certified electricians inspect across main incoming panels, sub-distribution boards, busbars, and earth bonding.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM engineers inspecting low-voltage commercial switchgear panel',
    statutoryStandard: 'Electricity at Work Regulations 1989 · BS 7671 (EICR)',
    keyCheckpoints: [
      'Thermal imaging of incoming cable terminations and busbar joints under full load',
      'RCD and RCBO trip testing and earth fault loop impedance verification',
      'Switchroom environmental controls (adequate ventilation, no moisture, zero storage)',
      'Contemporaneous circuit charts and distribution board terminal labelling',
    ],
    commonDefects: [
      'High-resistance thermal hot spots on main incomer lug terminations due to torque relaxation',
      'Unlabelled breakers leading to emergency isolation confusion during incidents',
      'Unauthorized storage of combustible cardboard and cleaning equipment in switchroom aisles',
    ],
    recommendedInterval: 'Quarterly visual / Annual thermographic survey / 5-Yr EICR',
    fieldAction: 'Perform non-contact infrared radiometric scan; flag any terminal exceeding 65°C for urgent retorquing.',
  },
  {
    id: 'walk-rooftop-chillers',
    title: 'Rooftop Plant Deck & Chiller Inspection',
    locationType: 'Commercial Building Roof Decks',
    focusArea: 'HVAC, Chillers & VRF Systems',
    summary: 'Evaluating air-cooled chillers, condenser coils, VRF fan units, ductwork insulation, and rooftop safe access walkways.',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1920w.webp',
    imageAlt: 'Two EntireFM engineers inspecting rooftop chiller condenser coils at dusk',
    statutoryStandard: 'EU/UK F-Gas Regulations 517/2014 · SFG20 Task Guides',
    keyCheckpoints: [
      'Condenser coil condition (free of debris, bird guano, atmospheric corrosion, fin damage)',
      'Refrigerant circuit operating pressures and digital F-Gas logbook verification',
      'Vibration spring mounts, anti-vibration bellows, and secondary structural pipe supports',
      'Roof edge protection, certified latchway systems, and matted walking routes',
    ],
    commonDefects: [
      'Collapsed condenser fins restricting airflow and elevating compressor head pressure',
      'Deteriorated external Armaflex insulation exposing copper pipe to UV degradation',
      'Loose anti-vibration mounts transmitting structural acoustic hum into top-floor offices',
    ],
    recommendedInterval: 'Quarterly engineering inspection / 6-Monthly F-Gas leak checks',
    fieldAction: 'Clean condenser coils with low-pressure chemical wash; verify electronic leak detector calibration.',
  },
  {
    id: 'walk-water-hygiene',
    title: 'Water Services & Legionella Sentinel Check',
    locationType: 'Water Storage Tanks & Sentinel Outlets',
    focusArea: 'Water Hygiene & ACOP L8 Compliance',
    summary: 'Essential checks across cold water storage tanks (CWST), calorifiers, TMVs, and sentinel hot and cold taps.',
    imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
    imageAlt: 'EntireFM engineer checking plumbing and water hygiene pipework pressure in plantroom',
    statutoryStandard: 'ACOP L8 · HSG274 Parts 1-3 · Water Fittings Regulations',
    keyCheckpoints: [
      'Cold water storage tank temperature (< 20°C) and tight-fitting screened insect lids',
      'Calorifier flow (> 60°C) and return (> 50°C) water temperatures',
      'Sentinel tap temperatures measured after 1 minute (cold < 20°C) and 1 minute (hot > 50°C)',
      'Quarterly descaling of showerheads and aerator nozzles across multi-tenant amenities',
    ],
    commonDefects: [
      'Cold water tank thermal gain due to uninsulated supply pipework in warm plantrooms',
      'Calorifier temperature stratification allowing lower zones to fall below 50°C',
      'Little-used outlets forming stagnant dead-legs without weekly flushing regimes',
    ],
    recommendedInterval: 'Monthly temperature logging / 6-Monthly tank inspection / Annual calorifier purge',
    fieldAction: 'Record calibrated digital immersion probe temperatures directly into the CAFM compliance register.',
  },
];

export function TemplateBuildingWalk({ route, content }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<string>('walk-boilerhouse');
  const activeWalk = WALKTHROUGHS.find((w) => w.id === activeTab) || WALKTHROUGHS[0];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Building Walkthroughs', url: '/building-walk' },
  ];

  return (
    <div className="bg-[#080e18] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <Header solid />
      <main id="main" className="flex-grow">
        {/* 1. RESOURCE HERO */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category="Engineering Field Manual"
          categoryHref="/resources"
          title="Building Walk: Visual Plantroom &amp; Estate Inspection Guides"
          intro="Step inside commercial plantrooms, switchrooms, rooftop plant decks, and riser shafts. Learn how certified facilities engineers conduct on-site asset surveys, spot subtle mechanical deterioration, and maintain statutory compliance."
          readingTime="Interactive Field Series"
          technicalTier="Level 2 · Practical Engineering"
          audience="Property Managers, Building Owners &amp; Site Teams"
          standard="SFG20 &amp; CIBSE Maintenance Guides"
        />

        {/* 2. TRUST BAR */}
        <TrustBar />

        {/* 3. MAIN INTERACTIVE FIELD MANUAL */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-2">
                On-Site Engineering Inspection Protocols
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Interactive Plantroom &amp; Asset Survey Manual
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Select a physical building zone below to explore genuine site photography, mandatory statutory checkpoints, and real-world defect patterns identified during professional facilities management audits.
              </p>
            </div>

            {/* Zone Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WALKTHROUGHS.map((w) => {
                const isSelected = activeTab === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setActiveTab(w.id)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-pink-950/70 border-pink-500 text-pink-300 shadow-xl shadow-pink-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1 ${isSelected ? 'text-pink-400 font-bold' : 'text-slate-500'}`}>
                        {w.focusArea}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                        {w.title.replace('The ', '').replace(' Walkthrough', '').replace(' Survey', '')}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-3 block">
                      {w.locationType.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Walk Showcase Card */}
            <div className="p-6 sm:p-10 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-8">
              {/* Card Header & Photo */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700 text-xs font-mono font-bold">
                      {activeWalk.focusArea}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeWalk.locationType}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {activeWalk.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    {activeWalk.summary}
                  </p>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">Statutory Standard:</span>{' '}
                      <strong className="text-pink-300">{activeWalk.statutoryStandard}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Recommended Interval:</span>{' '}
                      <strong className="text-slate-200">{activeWalk.recommendedInterval}</strong>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
                  <Image
                    src={activeWalk.imageSrc}
                    alt={activeWalk.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-950/90 backdrop-blur-md rounded border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                    <span>EntireFM Certified Field Survey</span>
                    <span className="text-pink-400 font-bold">VERIFIED ON SITE</span>
                  </div>
                </div>
              </div>

              {/* Checkpoints & Common Defects Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                {/* Key Inspection Points */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-white">
                      Mandatory Engineer Checkpoints
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {activeWalk.keyCheckpoints.map((cp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Defects Discovered */}
                <div className="p-6 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-white">
                      Common Hidden Defects Found on Site
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {activeWalk.commonDefects.map((df, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span>{df}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Field Action Directive */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs font-mono text-slate-300">
                <HardHat className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-pink-400 font-bold uppercase tracking-wider block mb-0.5">
                    Field Engineering Procedure:
                  </span>
                  <span>{activeWalk.fieldAction}</span>
                </div>
              </div>
            </div>

            {/* Annotated Rooftop Survey Photo Break */}
            <AnnotatedTechnicalImage
              imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-1920w.webp"
              imageAlt="Two EntireFM engineering staff conducting structural and HVAC plant survey on commercial rooftop"
              caption="Commercial Building Envelope & Rooftop Survey — Checking plant anti-vibration mountings, edge protection, and lightning conductors."
            />
          </div>
        </div>

        {/* 4. CONVERSION PROPOSAL SECTION */}
        <ProposalSection
          headline="Schedule a Comprehensive Building Asset Survey"
          subheadline="Book an on-site mechanical, electrical, and statutory compliance walk with our certified engineering surveyors for your commercial property."
        />
      </main>
      <Footer />
    </div>
  );
}
