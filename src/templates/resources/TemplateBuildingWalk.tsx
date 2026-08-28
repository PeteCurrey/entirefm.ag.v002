'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ResourceHero } from '@/components/resources/ResourceHero';
import { AnnotatedTechnicalImage } from '@/components/resources/AnnotatedTechnicalImage';
import { CheckCircle2, AlertTriangle, HardHat, ShieldCheck, ArrowRight } from 'lucide-react';
import type { TemplateProps } from '../types';

interface WalkthroughItem {
  id: string;
  title: string;
  focusArea: string;
  locationType: string;
  imageSrc: string;
  imageAlt: string;
  summary: string;
  keyCheckpoints: string[];
  commonDefects: string[];
  statutoryStandard: string;
  recommendedInterval: string;
  fieldAction: string;
}

const WALKTHROUGHS: WalkthroughItem[] = [
  {
    id: 'chiller-plantroom',
    title: 'The Commercial Chiller & Cooling Plant Walkthrough',
    focusArea: 'HVAC & Refrigeration',
    locationType: 'Rooftop Plant Deck / Basement Plantroom',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
    imageAlt: 'Two EntireFM HVAC technicians carrying out diagnostic inspection on rooftop commercial chiller condenser bank',
    summary: 'A structured engineering walk inspecting primary chillers, condenser coil banks, compressor oil levels, and refrigerant sight glasses.',
    keyCheckpoints: [
      'Visual check of compressor vibration damping springs and mounting integrity',
      'Inspection of condenser coil fins for airborne debris or corrosion',
      'Refrigerant sight glass moisture indicator verification (F-Gas compliance)',
      'Chilled water flow/return temperature differential (Delta-T verification)',
    ],
    commonDefects: [
      'Micro-fractures in flexible braided pipe connections causing minor weeping',
      'Corrosion on condenser coil casing leading to reduced thermodynamic heat transfer',
      'Excessive compressor harmonic vibration indicating early bearing fatigue',
    ],
    statutoryStandard: 'UK F-Gas Regulations · BS EN 378 · SFG20 Task Schedule',
    recommendedInterval: 'Monthly inspection + 6-Monthly statutory F-Gas leak testing',
    fieldAction: 'Log suction pressure, discharge pressure, and compressor current draw directly into EntireCAFM mobile app with timestamped photo of gauge cluster.',
  },
  {
    id: 'switchgear-inspection',
    title: 'The Main Electrical Switchroom & Distribution Survey',
    focusArea: 'Electrical & Life Safety',
    locationType: 'Sub-Basement LV Switchroom',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM certified electrical engineers in high-visibility PPE surveying commercial switchboard panel meters',
    summary: 'A non-intrusive thermal and visual survey of the main low-voltage (LV) switchboard, sub-distribution panels, and emergency changeover switches.',
    keyCheckpoints: [
      'Infrared thermography scan for loose busbar connections or unbalanced phases',
      'Verification of rubber insulation matting and emergency resuscitation signage',
      'RCD / RCBO test button trip verification and circuit breaker labelling clarity',
      'Inspection of cable entry glands for vermin ingress or physical chafing',
    ],
    commonDefects: [
      'Phase imbalance causing elevated neutral conductor thermal buildup',
      'Unlabelled or incorrectly marked circuit breakers preventing rapid emergency isolation',
      'Missing or expired calibration seals on analogue metering instruments',
    ],
    statutoryStandard: 'Electricity at Work Regulations 1989 · BS 7671 (18th Edition)',
    recommendedInterval: 'Annual thermographic survey + 5-Year periodic EICR testing',
    fieldAction: 'Record maximum phase temperature delta (>15°C delta requires immediate priority investigation). Upload thermal scan radiometric files to CAFM vault.',
  },
  {
    id: 'boiler-plantroom',
    title: 'The Commercial Heating & Boiler House Inspection',
    focusArea: 'Heating & Gas Safety',
    locationType: 'Central Heating Plantroom',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM senior gas engineer reviewing commercial heating system operating pressures and expansion vessel charge',
    summary: 'Systematic safety survey covering commercial gas boilers, flue dilution systems, expansion vessels, pressurisation units, and primary circulating pumps.',
    keyCheckpoints: [
      'Gas safety slam-shut solenoid valve interlock test with fire alarm system',
      'Pressurisation unit vessel pre-charge verification and cold-fill pressure check',
      'Flue integrity, draft stabilizer operation, and ventilation air intake louver clearance',
      'Primary pump seal condition, coupling alignment, and bearing acoustic check',
    ],
    commonDefects: [
      'Waterlogged expansion vessels causing cyclic pressure relief discharge',
      'Faulty mechanical air vents allowing micro-bubbles to accelerate internal pipe corrosion',
      'Obstructed combustion air intake louvers restricting burner air-fuel ratio',
    ],
    statutoryStandard: 'Gas Safety (Installation & Use) Regulations · CIBSE Guide B',
    recommendedInterval: 'Annual CP15 commercial gas safety certification + quarterly servicing',
    fieldAction: 'Verify gas booster safety interlocks, record boiler modulation setpoints, and confirm automatic purge cycle prior to burner ignition.',
  },
  {
    id: 'riser-shaft-water',
    title: 'The Vertical Services Riser & Water Hygiene Survey',
    focusArea: 'Water Hygiene & Building Fabric',
    locationType: 'Floor-by-Floor Mechanical Risers',
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    imageAlt: 'EntireFM building surveyor inspecting fire stopping collars and pipe insulation inside vertical service riser',
    summary: 'Multi-discipline walk inspecting domestic water supply risers, drainage stacks, fire-stopping intumescent collars, and pipe insulation thermal integrity.',
    keyCheckpoints: [
      'Intumescent fire collar and acoustic batt fire-stopping integrity at floor slab penetrations',
      'Trace heating operation on exposed cold water supply pipes (frost protection)',
      'Dead-leg identification on disused branch pipework (Legionella risk prevention)',
      'Thermal insulation integrity on chilled water and domestic hot water pipework',
    ],
    commonDefects: [
      'Damaged fire stopping following tenant fit-out contractors running data cabling',
      'Uninsulated cold water pipework causing condensation dripping onto lower electrical trays',
      'Stagnant dead-legs created after removal of kitchen tea points during layout reconfigurations',
    ],
    statutoryStandard: 'ACOP L8 / HSG274 · Building Safety Act (Fire Separation)',
    recommendedInterval: '6-Monthly fire barrier inspection + monthly water hygiene temperature checks',
    fieldAction: 'Photograph any non-compliant compartmentation breaches and log urgent remedial work order under Building Safety Act compliance records.',
  },
];

export function TemplateBuildingWalk({ route, content }: TemplateProps) {
  const [activeTab, setActiveTab] = useState<string>('chiller-plantroom');
  const activeWalk = WALKTHROUGHS.find((w) => w.id === activeTab) || WALKTHROUGHS[0];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Building Walk', url: '/building-walk' },
  ];

  return (
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. RESOURCE HERO (85svh)                                                 */}
        {/* ========================================================================= */}
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
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
        />

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. MAIN INTERACTIVE FIELD MANUAL                                          */}
        {/* ========================================================================= */}
        <div className="container-custom py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* Header intro */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                  On-Site Inspection Protocols
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
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
                    className={`p-5 rounded-sm text-left border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                      isSelected
                        ? 'bg-brand-carbon border-brand-pink text-white shadow-elevated'
                        : 'bg-brand-carbon/60 border-brand-edge-dark text-slate-400 hover:bg-brand-carbon hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className={`text-[10px] uppercase font-medium tracking-wider block ${isSelected ? 'text-brand-pink' : 'text-slate-500'}`}>
                        {w.focusArea}
                      </span>
                      <h3 className="text-xs sm:text-sm font-light text-white leading-snug line-clamp-2">
                        {w.title.replace('The ', '').replace(' Walkthrough', '').replace(' Survey', '')}
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-light block">
                      {w.locationType.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Walk Showcase Card */}
            <div className="p-8 sm:p-12 rounded-sm bg-brand-carbon border border-brand-edge-dark shadow-elevated space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30 text-xs font-medium uppercase tracking-wider">
                      {activeWalk.focusArea}
                    </span>
                    <span className="text-xs text-slate-400 font-light">
                      {activeWalk.locationType}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-light text-white leading-tight">
                    {activeWalk.title}
                  </h3>

                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    {activeWalk.summary}
                  </p>

                  <div className="p-4 bg-black/40 rounded-sm border border-brand-edge-dark text-xs text-slate-300 space-y-1.5 font-light">
                    <div>
                      <span className="text-slate-400 font-medium">Statutory Standard: </span>
                      <span className="text-brand-pink">{activeWalk.statutoryStandard}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Recommended Interval: </span>
                      <span className="text-white">{activeWalk.recommendedInterval}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative aspect-[16/10] rounded-sm overflow-hidden border border-brand-edge-dark bg-slate-950 shadow-elevated">
                  <Image
                    src={activeWalk.imageSrc}
                    alt={activeWalk.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-2 bg-black/80 backdrop-blur-md rounded-sm border border-white/10 text-[11px] text-slate-300 flex items-center justify-between font-light">
                    <span>EntireFM Certified Field Survey</span>
                    <span className="text-brand-pink font-medium uppercase tracking-wider">Verified On Site</span>
                  </div>
                </div>
              </div>

              {/* Checkpoints & Common Defects Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-edge-dark">
                {/* Key Inspection Points */}
                <div className="p-6 rounded-sm bg-black/30 border border-brand-edge-dark space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="font-medium text-xs uppercase tracking-wider text-white">
                      Mandatory Engineer Checkpoints
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {activeWalk.keyCheckpoints.map((cp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Defects Discovered */}
                <div className="p-6 rounded-sm bg-black/30 border border-brand-edge-dark space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="font-medium text-xs uppercase tracking-wider text-white">
                      Common Defects Found on Site
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {activeWalk.commonDefects.map((df, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span>{df}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Field Action Directive */}
              <div className="p-4 rounded-sm bg-black/40 border border-brand-edge-dark flex items-start gap-3 text-xs text-slate-300 font-light">
                <HardHat className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-pink font-medium uppercase tracking-wider block mb-0.5">
                    Field Engineering Protocol:
                  </span>
                  <span>{activeWalk.fieldAction}</span>
                </div>
              </div>
            </div>

            {/* Annotated Technical Image Break */}
            <AnnotatedTechnicalImage
              imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-1920w.webp"
              imageAlt="Two EntireFM engineering staff conducting structural and HVAC plant survey on commercial rooftop"
              caption="Commercial Building Envelope & Rooftop Survey — Checking plant anti-vibration mountings, edge protection, and lightning conductors."
            />
          </div>
        </div>

        {/* 3. CONVERSION PROPOSAL SECTION */}
        <ProposalSection
          headline="Schedule a Comprehensive Building Asset Survey"
          subheadline="Book an on-site mechanical, electrical, and statutory compliance walk with our certified engineering surveyors for your commercial property."
        />
      </main>

      <Footer />
    </div>
  );
}
