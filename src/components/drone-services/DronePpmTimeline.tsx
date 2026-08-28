'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarClock, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  Activity,
  Calendar,
  Layers,
  Flame,
  Building2,
  AlertCircle
} from 'lucide-react';

interface TimelineEvent {
  season: string;
  month: string;
  cadenceType: 'Quarterly' | 'Biannual' | 'Annual';
  title: string;
  focusScope: string;
  deliverableItem: string;
  conditionImpact: string;
  assetHealthScore: number; // 0-100
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    season: 'WINTER REVIEW',
    month: 'JANUARY',
    cadenceType: 'Quarterly',
    title: 'Post-Frost Drainage & Freeze-Thaw Sweep',
    focusScope: 'Rapid optical inspection of parapet scuppers, valley gutter ice buildup, and freeze-thaw damage around roof plant plinths.',
    deliverableItem: 'Immediate drainage flow signoff & localized freeze-thaw defect log.',
    conditionImpact: 'Identifies ice-expanded seam cracks before thaw causes internal leaks.',
    assetHealthScore: 82,
  },
  {
    season: 'SPRING STRATEGIC',
    month: 'APRIL',
    cadenceType: 'Biannual',
    title: 'Pre-Summer Building Envelope & Waterproofing Audit',
    focusScope: 'Complete 360° vertical façade elevation scan, mastic expansion joint survey, and flat roof waterproofing condition mapping.',
    deliverableItem: 'Full 2D orthomosaic roof map, façade CAD anomaly grid & repair schedule.',
    conditionImpact: 'Pins structural silicone gaps and schedules rope access before storm season.',
    assetHealthScore: 88,
  },
  {
    season: 'SUMMER YIELD',
    month: 'JULY',
    cadenceType: 'Quarterly',
    title: 'Solar PV Array Yield & Gutter Silt Review',
    focusScope: 'Thermographic solar panel scanning under peak irradiance, alongside summer vegetation and moss inspection in primary gutters.',
    deliverableItem: 'IEC 62446-3 solar hotspot report & vacuum clearance work orders.',
    conditionImpact: 'Restores 8–12% lost PV string yield and clears dried debris from gutters.',
    assetHealthScore: 92,
  },
  {
    season: 'AUTUMN STRATEGIC',
    month: 'OCTOBER',
    cadenceType: 'Annual',
    title: 'Full Envelope Thermography & Pre-Winter Baseline',
    focusScope: 'Deep FLIR radiometric moisture scan of all roof insulation, building heat loss audit, and multi-asset condition sync in EntireCAFM.',
    deliverableItem: 'Calibrated Delta-T radiometric dossier & 5-year CapEx condition forecast.',
    conditionImpact: 'Prevents catastrophic winter ceiling breaches and validates statutory compliance.',
    assetHealthScore: 97,
  },
];

export function DronePpmTimeline() {
  const [selectedEventIdx, setSelectedEventIdx] = useState<number>(3);
  const current = TIMELINE_EVENTS[selectedEventIdx];

  return (
    <section 
      id="drone-ppm"
      aria-label="Annual Drone PPM and Asset Condition History"
      className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <CalendarClock className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                PREVENTATIVE MAINTENANCE CYCLES
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              One Flight is a Survey. <br />
              <span className="text-hero-pink font-light">
                Repeat Flights Become Intelligence.
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Drone inspection achieves its highest financial return when embedded into your SFG20 Planned Preventative Maintenance schedule. Rather than commissioning one-off reactive flights, scheduled seasonal sweeps build longitudinal asset condition trends inside EntireCAFM.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tools/ppm-schedule-builder"
              className="inline-flex items-center gap-2 rounded-sm border border-brand-electric bg-brand-electric/10 px-5 py-2.5 text-xs font-mono text-white hover:bg-brand-electric/25 transition-colors"
            >
              <span>Launch PPM Schedule Builder</span>
              <ArrowRight className="h-3.5 w-3.5 text-brand-electric-bright" />
            </Link>
          </div>
        </div>

        {/* Visual Annual Maintenance Timeline */}
        <div className="space-y-8">
          {/* 4-Season Timeline Progression Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isSelected = selectedEventIdx === idx;
              return (
                <button
                  key={event.month}
                  type="button"
                  onClick={() => setSelectedEventIdx(idx)}
                  className={`p-5 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[140px] group ${
                    isSelected
                      ? 'bg-brand-carbon border-brand-pink shadow-glow-pink'
                      : 'bg-brand-carbon/40 border-brand-edge-dark hover:border-white/25 hover:bg-brand-carbon/80'
                  }`}
                >
                  <div 
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
                      isSelected ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : 'bg-transparent'
                    }`} 
                  />

                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-semibold ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                      {event.month}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-slate-300">
                      {event.cadenceType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      {event.season}
                    </span>
                    <h3 className={`text-sm font-light leading-snug mt-1 ${isSelected ? 'text-white font-normal' : 'text-slate-300 group-hover:text-white'}`}>
                      {event.title}
                    </h3>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Health Trend:</span>
                    <span className="text-emerald-400 font-bold">{event.assetHealthScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Season Detail & Condition Accumulation Dossier */}
          <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark p-8 lg:p-12 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Seasonal Scope & Direct FM Impact */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-pink font-mono text-xs uppercase tracking-widest font-semibold">
                  <Calendar className="h-4 w-4" />
                  <span>{current.season} · {current.cadenceType.toUpperCase()} PPM SWEEP</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  {current.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {current.focusScope}
                </p>
              </div>

              <div className="p-4 rounded-sm bg-brand-void/80 border border-brand-edge-dark space-y-2 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">PPM Output Deliverable:</span>
                    <span className="text-white font-sans text-xs">{current.deliverableItem}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Preventative Asset Impact:</span>
                    <span className="text-slate-200 font-sans text-xs font-light">{current.conditionImpact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Longitudinal Health Accumulator Visualization */}
            <div className="lg:col-span-5 p-6 rounded-sm bg-brand-void/90 border border-brand-edge-dark space-y-5">
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
                <span className="font-mono text-xs text-brand-pink font-semibold uppercase tracking-wider">
                  ENTIRECAFM ASSET TREND
                </span>
                <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +15% RISK MITIGATION
                </span>
              </div>

              {/* Progress Bar & Trend History */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Cumulative Estate Condition Index</span>
                    <span className="text-white font-bold">{current.assetHealthScore} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-carbon overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-electric via-brand-pink to-emerald-400 transition-all duration-700"
                      style={{ width: `${current.assetHealthScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-brand-carbon/60 border border-white/[0.04] space-y-1 text-[11px]">
                  <span className="text-slate-400 block">Longitudinal Intelligence Benefit:</span>
                  <p className="font-sans text-xs text-slate-200 font-light leading-relaxed">
                    Over 24–36 months, repeat flights identify structural wear acceleration curves, allowing CapEx re-roofing projects to be budgeted years in advance.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-brand-pink">
                <span>Direct Sync to EntireCAFM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
