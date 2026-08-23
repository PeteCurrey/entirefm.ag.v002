'use client';

import React from 'react';
import Link from 'next/link';
import {
  Video,
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
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface WalkthroughItem {
  id: string;
  title: string;
  locationType: string;
  focusArea: string;
  summary: string;
  keyCheckpoints: string[];
  commonDefects: string[];
  recommendedInterval: string;
}

const WALKTHROUGHS: WalkthroughItem[] = [
  {
    id: 'walk-boilerhouse',
    title: 'The Commercial Boiler House & Gas Safety Walkthrough',
    locationType: 'Basement / Ground Floor Plantrooms',
    focusArea: 'Commercial Gas & Heating Plant',
    summary: 'A step-by-step survey of commercial gas boilers, flue dilution systems, pressurisation units, and gas proving interlocks.',
    keyCheckpoints: [
      'Gas proving system and automatic isolation valve operation',
      'Flue route integrity and mechanical ventilation interlocks',
      'Expansion vessel pre-charge pressure and safety relief valves',
      'Circulation pump seals, vibration isolators, and flow/return delta T',
    ],
    commonDefects: [
      'Failed ventilation interlock pressure switches bypassed with jumpers',
      'Waterlogged expansion vessels causing system over-pressurisation',
      'Corroded flue joints with signs of carbon/acid staining',
    ],
    recommendedInterval: 'Monthly internal visual / Annual certified service (CP15)',
  },
  {
    id: 'walk-switchroom',
    title: 'Main LV Switchroom & Distribution Survey',
    locationType: 'Dedicated Electrical Switchrooms',
    focusArea: 'Electrical Infrastructure & Switchgear',
    summary: 'What certified electricians inspect across main incoming panels, sub-distribution boards, busbars, and earth bonding.',
    keyCheckpoints: [
      'Thermal imaging of cable terminations and busbar joints under load',
      'RCD and RCBO trip testing and earth fault loop impedance',
      'Switchroom environmental conditions (ventilation, moisture, no storage)',
      'Contemporaneous circuit charts and distribution board labelling',
    ],
    commonDefects: [
      'High-resistance hot spots on main incomer lug terminations',
      'Unlabelled breakers leading to emergency isolation confusion',
      'Unauthorized storage of combustible cardboard in switchroom aisles',
    ],
    recommendedInterval: 'Quarterly visual / Annual thermographic survey / 5-Yr EICR',
  },
  {
    id: 'walk-rooftop-chillers',
    title: 'Rooftop Plant Deck & Chiller Inspection',
    locationType: 'Commercial Building Roof Decks',
    focusArea: 'HVAC, Chillers & VRF Systems',
    summary: 'Evaluating air-cooled chillers, condenser coils, VRF fan units, ductwork insulation, and rooftop safe access walkways.',
    keyCheckpoints: [
      'Condenser coil condition (free of debris, bird guano, fin damage)',
      'Refrigerant circuit pressure checks and F-Gas logbook verification',
      'Vibration spring mounts, anti-vibration bellows, and pipe supports',
      'Roof edge protection, guardrails, and matted walking routes',
    ],
    commonDefects: [
      'Collapsed condenser fins restricting airflow and elevating head pressure',
      'Deteriorated external Armaflex insulation exposing copper pipe to UV degradation',
      'Loose anti-vibration mounts transmitting structural acoustic hum',
    ],
    recommendedInterval: 'Quarterly engineering inspection / 6-Monthly F-Gas leak checks',
  },
  {
    id: 'walk-fire-doors',
    title: 'Multi-Tenant Fire Compartmentation & Escape Walk',
    locationType: 'Common Corridors, Stairwells & Plant Areas',
    focusArea: 'Life Safety & Passive Fire Protection',
    summary: 'Surveying fire resistance integrity along designated escape routes, stairwells, riser cupboards, and self-closing door sets.',
    keyCheckpoints: [
      'Perimeter gaps (2–4mm) around fire door frames and threshold clearances',
      'Intumescent and acoustic smoke seal continuity (no painting over seals)',
      'Overhead self-closer power ensuring latch engagement from any open angle',
      'Service riser penetrations sealed with certified firestopping batt/mastic',
    ],
    commonDefects: [
      'Fire doors propped open with wooden wedges or fire extinguishers',
      'Excessive threshold gaps (>8mm) allowing cold smoke migration',
      'Unsealed cable penetrations through compartment walls after tenant fit-out',
    ],
    recommendedInterval: 'Monthly visual in-house check / 6-Monthly competent inspection',
  },
];

export function TemplateBuildingWalk({ route, content }: TemplateProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'The Building Walk', url: '/building-walk' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20 border-b border-brand-edge-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[30%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-dark inline-block mb-3">On-Site Technical Insights</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                The Building Walk — Engineering Survey Series
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                Step-by-step practical walkthroughs of commercial plantrooms, electrical switchrooms, rooftop chiller decks, and fire compartmentation routes — showing what certified engineers look for on site.
              </p>
            </div>
          </div>
        </section>

        {/* Walkthrough Cards Section */}
        <section className="py-16 bg-brand-carbon">
          <div className="container-custom space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="eyebrow eyebrow-dark">Field Inspections</span>
                <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Plantroom & Building Inspection Guides
                </h2>
              </div>
              <p className="text-xs text-brand-mist/60 max-w-md">
                Learn to spot early mechanical and electrical warning signs before they escalate into catastrophic failures.
              </p>
            </div>

            <div className="grid gap-8">
              {WALKTHROUGHS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-edge-dark pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-brand-electric-bright">
                          {item.locationType}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-[11px] text-brand-mist/60 font-medium">
                          {item.focusArea}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-brand-mist/50 shrink-0">
                      Cycle: {item.recommendedInterval}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-mist/80 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Checkpoints */}
                    <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Key Engineering Checkpoints
                      </h4>
                      <ul className="space-y-1.5 text-xs text-brand-mist/80">
                        {item.keyCheckpoints.map((cp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                            <span>{cp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Defects */}
                    <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2.5 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Common Defects Discovered
                      </h4>
                      <ul className="space-y-1.5 text-xs text-brand-mist/80">
                        {item.commonDefects.map((def, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                            <span>{def}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Request a Site Survey */}
            <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Want an EntireFM Senior Engineer to walk your building?
                </h3>
                <p className="text-xs text-brand-mist/70 mt-1 max-w-xl">
                  We perform structured condition surveys, plantroom health checks, and asset verification walks across commercial estates nationwide.
                </p>
              </div>
              <Link href="/contact-us" className="btn-primary shrink-0 py-2.5 px-4 text-xs">
                Book an Asset Survey Walk
                <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
              </Link>
            </div>
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
