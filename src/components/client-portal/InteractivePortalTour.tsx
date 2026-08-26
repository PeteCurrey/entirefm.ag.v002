'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Activity,
  Layers,
  AlertTriangle,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  ChevronRight,
  Info,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface Hotspot {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  operationalImpact: string;
  top: number; // percentage
  left: number; // percentage
  icon: React.ElementType;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'estate-pulse',
    title: 'Estate Pulse Real-Time Strip',
    category: 'Portfolio Telemetry',
    badge: '42 Managed Sites',
    description:
      'Continuous operational telemetry aggregating in-service assets (3,846), active open jobs (127), live SLA performance (96.2%), statutory compliance (98.4%), and committed WIP across all UK facilities.',
    operationalImpact:
      'Replaces delayed monthly PDF summaries with minute-by-minute portfolio performance verification.',
    top: 24,
    left: 45,
    icon: Activity,
  },
  {
    id: 'live-workspace',
    title: 'Live Estate Workspace',
    category: 'Spatial & Facility Grid',
    badge: 'Visual Site Cards',
    description:
      'Direct navigation from portfolio metrics to individual property assets. Visual site cards show current operational posture (P1 Critical, Nominal, Attention) and real-time engineer presence.',
    operationalImpact:
      'Eliminates disconnected site spreadsheets — instant jump from national overview to property-level operating state.',
    top: 48,
    left: 28,
    icon: Building2,
  },
  {
    id: 'action-required',
    title: 'Action Required Decision Queue',
    category: 'Triage & SLA Control',
    badge: '4 Active Interventions',
    description:
      'Surfaces critical boiler primary pump trips, overdue 3-hour emergency lighting discharge tests, 4th-floor water ingress SLA risk windows, and commercial quote approval gates.',
    operationalImpact:
      'Prioritises operational risk proactively rather than requiring FM directors to hunt through raw job logs.',
    top: 45,
    left: 78,
    icon: AlertTriangle,
  },
  {
    id: 'operations-timeline',
    title: "Today's Operations Timeline",
    category: 'Field Execution',
    badge: 'Live Dispatch Feed',
    description:
      'Chronological sequence of engineer check-ins, security clearances, permit issuances, quarterly chiller AHU filter replacements, and SLA resolution target windows.',
    operationalImpact:
      'Full visibility of field service delivery and contractor attendance as it occurs throughout the working day.',
    top: 80,
    left: 36,
    icon: Clock,
  },
  {
    id: 'entire-intelligence',
    title: 'Operational Reasoning & Synthesis',
    category: 'Asset Intelligence',
    badge: 'AI Governance Ledger',
    description:
      'Surfaces repeat reactive ingress patterns at Manchester Hub, correlating primary HVAC condensate trays with roof gulley junctions, verified against canonical FM records.',
    operationalImpact:
      'Interrogates structural data patterns and suggests root causes while maintaining strict audit traceability.',
    top: 80,
    left: 82,
    icon: Sparkles,
  },
];

export function InteractivePortalTour() {
  const [activeHotspotId, setActiveHotspotId] = useState<string>(HOTSPOTS[0].id);
  const activeHotspot = HOTSPOTS.find((h) => h.id === activeHotspotId) || HOTSPOTS[0];
  const Icon = activeHotspot.icon;

  return (
    <section id="interactive-tour" className="py-24 bg-white border-b border-slate-200 scroll-mt-24">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 border-b border-slate-200 mb-10">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-light">LIVE PLATFORM ARCHITECTURE</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
              One portal. The complete operational picture.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Explore the five core functional zones of the live EntireCAFM console. Click on any module to inspect its real-world role in facilities management delivery.
            </p>
          </div>

          {/* Module Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {HOTSPOTS.map((h) => {
              const isSelected = h.id === activeHotspotId;
              const HIcon = h.icon;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspotId(h.id)}
                  className={`inline-flex items-center gap-2 rounded-sm px-3.5 py-2 text-xs font-light tracking-wide transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white font-normal shadow-sm border border-slate-900'
                      : 'bg-[#FAF9FB] text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <HIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-brand-pink' : 'text-slate-500'}`} />
                  <span>{h.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Screenshot Canvas with Interactive Hotspot Markers */}
          <div className="lg:col-span-8 relative rounded-sm border border-slate-200 bg-slate-900 overflow-hidden shadow-md aspect-[16/10]">
            <Image
              src="/images/client-portal/entirecafm-dashboard-live.png"
              alt="EntireCAFM Live Production Platform Dashboard"
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover object-top"
            />

            {/* Pulsing Hotspots */}
            {HOTSPOTS.map((h) => {
              const isSelected = h.id === activeHotspotId;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspotId(h.id)}
                  style={{ top: `${h.top}%`, left: `${h.left}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                  aria-label={`Inspect ${h.title}`}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                        isSelected ? 'bg-brand-pink' : 'bg-white'
                      }`}
                    />
                    <span
                      className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-normal shadow-lg transition-transform ${
                        isSelected
                          ? 'bg-brand-pink scale-110 ring-2 ring-white'
                          : 'bg-slate-900/90 border border-white/40 hover:scale-105'
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Hotspot Explanation */}
          <div className="lg:col-span-4 bg-[#FAF9FB] border border-slate-200 rounded-sm p-7 space-y-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {activeHotspot.category}
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-[10.5px] text-slate-700 font-light">
                  {activeHotspot.badge}
                </span>
              </div>
              <h3 className="text-xl font-light text-slate-900">
                {activeHotspot.title}
              </h3>
            </div>

            <p className="text-xs text-slate-700 font-light leading-relaxed">
              {activeHotspot.description}
            </p>

            <div className="bg-white p-4 rounded-sm border border-slate-200 space-y-1.5">
              <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                OPERATIONAL IMPACT
              </span>
              <p className="text-xs text-slate-900 font-light leading-relaxed">
                {activeHotspot.operationalImpact}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
                className="btn-primary w-full justify-center text-xs py-3"
              >
                Schedule Live Platform Walkthrough <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
