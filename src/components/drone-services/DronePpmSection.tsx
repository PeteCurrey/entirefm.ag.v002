'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CalendarClock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  Wrench,
  AlertCircle
} from 'lucide-react';

const CADENCES = [
  {
    interval: 'Quarterly',
    badge: 'EVERY 3 MONTHS',
    title: 'Drainage, Gutters & High-Risk Roof Zones',
    description: 'Targeted high-frequency sweeps designed to prevent water pooling, gutter blockages, and plant degradation before seasonal weather changes.',
    focusAssets: [
      'Valley gutters & downpipe hopper heads',
      'High-risk parapet outlets & scupper drains',
      'Rooftop HVAC plant intake louvres',
      'Suspected roof membrane ponding zones',
    ],
    recommendedRisk: 'Buildings with surrounding tree canopies, aged box gutters, or flat roof water-pooling history.',
  },
  {
    interval: 'Biannual',
    badge: 'SPRING & AUTUMN',
    title: 'Roof Condition & High-Level Structures',
    description: 'Comprehensive structural and fabric review conducted pre-winter and post-storm season to catch minor damage before it breaches internal ceilings.',
    focusAssets: [
      'Complete flat and pitched roof waterproofing',
      'Lead flashing, coping stone & parapet seams',
      'Vertical facade alignment & architectural trims',
      'Roof safety eyebolts & plant access pathways',
    ],
    recommendedRisk: 'Standard commercial properties, retail warehouses, industrial units, and multi-tenant offices.',
  },
  {
    interval: 'Annual',
    badge: 'ANNUAL STRATEGIC REVIEW',
    title: 'Full Building Envelope, Thermography & Solar PV',
    description: 'Deep multi-spectrum audit combining ultra-high-resolution optical capture with night-time radiometric thermal imaging and full solar PV string performance scans.',
    focusAssets: [
      '360° building envelope & curtain walling audit',
      'Radiometric thermal moisture & heat loss scan',
      'Complete rooftop solar PV array hotspot review',
      'Estate-wide GIS map & CAFM condition register sync',
    ],
    recommendedRisk: 'All commercial landlords, institutional property funds, and corporate estate managers.',
  },
];

export function DronePpmSection() {
  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200" id="drone-ppm">
      <div className="container-custom space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="font-mono text-xs font-normal uppercase tracking-wider text-brand-pink">
              PLANNED PREVENTATIVE MAINTENANCE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Moving property maintenance from reactive to evidence-led
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-light">
            Drone inspections should not be treated as rare, isolated emergency events. By embedding scheduled aerial surveys directly into your SFG20 Planned Preventative Maintenance (PPM) schedule, facilities managers gain continuous condition tracking that prevents costly emergency interventions.
          </p>
        </div>

        {/* 3 Cadence Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CADENCES.map((cadence, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[14px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-brand-pink hover:shadow-md transition-all group"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light font-mono text-slate-900 group-hover:text-brand-pink transition-colors">
                    {cadence.interval}
                  </span>
                  <span className="font-mono text-[9px] uppercase font-light text-slate-600 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                    {cadence.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-light text-slate-900 leading-snug">
                    {cadence.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {cadence.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-mono uppercase font-light text-slate-500 block">
                    Core Asset Focus:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {cadence.focusAssets.map((asset, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink mt-0.5 shrink-0" />
                        <span>{asset}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="text-[11px] text-slate-500 leading-normal">
                  <strong className="text-slate-800">Application:</strong> {cadence.recommendedRisk}
                </div>

                <Link
                  href="/ppm"
                  className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-pink group-hover:underline"
                >
                  <span>Explore PPM Integration</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Engineering Note */}
        <div className="p-6 rounded-[12px] bg-white border border-slate-200 flex items-start gap-4 shadow-subtle">
          <AlertCircle className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-light block text-sm">
              Customized PPM Scheduling
            </strong>
            <p>
              The cadences illustrated above represent common commercial FM practice. Actual inspection frequencies are agreed following an initial site risk assessment, taking into account roof accessibility, tree density, building age, environmental exposure, and client statutory compliance profiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
