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
} from 'lucide-react';

interface Hotspot {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  operationalImpact: string;
  // Position as percentage from top-left
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
    title: 'Entire Intelligence Synthesis',
    category: 'Operational Reasoning',
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

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-4 sm:p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#F0F0EE] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 font-mono text-[10px] font-bold text-[#C2410C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
              INTERACTIVE TOUR
            </span>
            <span className="font-mono text-[11px] text-[#686866]">
              Explore Live EntireCAFM Architecture
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#101010] tracking-tight">
            One portal. The complete operational picture.
          </h3>
          <p className="text-[13px] text-[#686866] mt-1 max-w-2xl">
            Select an operational layer below to see how EntireCAFM connects high-level portfolio governance to plantroom execution.
          </p>
        </div>

        {/* Layer Selector Chips */}
        <div className="flex flex-wrap gap-1.5">
          {HOTSPOTS.map((h) => {
            const isSelected = h.id === activeHotspotId;
            return (
              <button
                key={h.id}
                onClick={() => setActiveHotspotId(h.id)}
                className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-all ${
                  isSelected
                    ? 'bg-[#101010] text-white shadow-sm'
                    : 'bg-[#F5F5F3] text-[#686866] hover:bg-[#E4E4E1] hover:text-[#101010]'
                }`}
              >
                <h.icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#EA580C]' : 'text-[#9B9B97]'}`} />
                <span>{h.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Presentation */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Screenshot Canvas with Pulsing Hotspot Markers */}
        <div className="lg:col-span-8 relative rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] overflow-hidden shadow-inner aspect-[16/10]">
          <Image
            src="/images/client-portal/entirecafm-dashboard-live.png"
            alt="EntireCAFM Estate-Wide Live Control Dashboard"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />

          {/* Render Interactive Hotspot Pins */}
          {HOTSPOTS.map((h) => {
            const isSelected = h.id === activeHotspotId;
            return (
              <button
                key={h.id}
                onClick={() => setActiveHotspotId(h.id)}
                style={{ top: `${h.top}%`, left: `${h.left}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10 transition-transform ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                title={h.title}
                aria-label={`Inspect ${h.title}`}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                      isSelected ? 'bg-[#EA580C]' : 'bg-[#2563EB]'
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg border-2 border-white ${
                      isSelected ? 'bg-[#EA580C]' : 'bg-[#101010]'
                    }`}
                  >
                    <h.icon className="h-3 w-3" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Card */}
        <div className="lg:col-span-4 rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E1] pb-3 mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
                {activeHotspot.category}
              </span>
              <span className="rounded-[4px] border border-[#E4E4E1] bg-white px-2 py-0.5 font-mono text-[10px] text-[#686866]">
                {activeHotspot.badge}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-8 w-8 rounded-[6px] bg-[#101010] text-white flex items-center justify-center shrink-0">
                <activeHotspot.icon className="h-4 w-4 text-[#EA580C]" />
              </div>
              <h4 className="text-[16px] font-semibold text-[#101010] leading-snug">
                {activeHotspot.title}
              </h4>
            </div>

            <p className="text-[12.5px] text-[#4B5563] leading-relaxed mt-2.5">
              {activeHotspot.description}
            </p>

            <div className="mt-4 rounded-[8px] border border-[#FED7AA] bg-[#FFF7ED] p-3">
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-[#C2410C] mb-1">
                <Info className="h-3 w-3 shrink-0" />
                <span>OPERATIONAL ADVANTAGE</span>
              </div>
              <p className="text-[11.5px] text-[#7C2D12] leading-normal">
                {activeHotspot.operationalImpact}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4E4E1] mt-4 flex items-center justify-between text-[11px] font-mono text-[#9B9B97]">
            <span>Layer {HOTSPOTS.findIndex((h) => h.id === activeHotspotId) + 1} of {HOTSPOTS.length}</span>
            <div className="flex items-center gap-1">
              {HOTSPOTS.map((h) => (
                <span
                  key={h.id}
                  className={`h-1.5 rounded-full transition-all ${
                    h.id === activeHotspotId ? 'w-4 bg-[#EA580C]' : 'w-1.5 bg-[#D1D1CD]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
