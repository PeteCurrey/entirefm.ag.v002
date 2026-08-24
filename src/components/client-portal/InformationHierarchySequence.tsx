'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Building2,
  SlidersHorizontal,
  Box,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const HIERARCHY_STEPS = [
  {
    step: '01',
    level: 'Portfolio Level',
    title: 'Estate Overview',
    scope: '42 Managed UK Facilities',
    description:
      'National visibility across 3,846 registered assets, real-time SLA metrics (96.2%), statutory compliance (98.4%), and aggregated works WIP (£185k).',
    image: '/images/client-portal/entirecafm-dashboard-live.png',
    caption: 'Estate Pulse & Live Workspace — National Portfolio View',
    pill: '42 Sites · 3,846 Assets',
  },
  {
    step: '02',
    level: 'Facility Level',
    title: 'Site Drawer & Profile',
    scope: 'Victoria House · London NW1 7JE',
    description:
      'Instantly slide out specific property telemetry without losing portfolio context: active incidents, 2 on-site engineers, access protocols, and SLA countdowns.',
    image: '/images/client-portal/entirecafm-site-drawer.png',
    caption: 'Victoria House Commercial Complex — Quick Inspection Drawer',
    pill: '3 Open Jobs · 2 Active Engineers',
  },
  {
    step: '03',
    level: 'Physical Canvas',
    title: 'Site 360 Workspace',
    scope: 'Building Digital Operating Picture',
    description:
      'Photographic reality layer with real-time sensor overlays (48 online), floor plans / CAD views, spatial access rules, and full physical asset hierarchy.',
    image: '/images/client-portal/entirecafm-site-360-workspace.png',
    caption: 'Site 360 Physical Asset Canvas with Live Sensor & Asset Nodes',
    pill: '8,450 m² GIA · 48 Live Sensors',
  },
  {
    step: '04',
    level: 'Maintenance Engine',
    title: 'PPM Autopilot Control',
    scope: 'Autonomous Statutory Orchestration',
    description:
      'Statutory maintenance schedules (99.7% compliance), auto-dispatched SFG20 occurrences, vibration anomaly triage, and certified mobile engineer capacity.',
    image: '/images/client-portal/entirecafm-ppm-autopilot.png',
    caption: 'PPM Autopilot Control Desk — Asset-Led Maintenance Engine',
    pill: '1,428 Active Plan Items · 94.2% Auto-Dispatch',
  },
];

export function InformationHierarchySequence() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = HIERARCHY_STEPS[activeStepIndex];

  return (
    <div className="space-y-6">
      {/* Step Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {HIERARCHY_STEPS.map((step, idx) => {
          const isSelected = idx === activeStepIndex;
          return (
            <button
              key={step.step}
              onClick={() => setActiveStepIndex(idx)}
              className={`text-left rounded-[10px] border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-[#EA580C] bg-white shadow-[0_4px_16px_rgba(234,88,12,0.1)] ring-1 ring-[#EA580C]'
                  : 'border-[#E4E4E1] bg-[#FBFBFA] hover:bg-white hover:border-[#D1D1CD]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`font-mono text-[11px] font-bold ${
                    isSelected ? 'text-[#EA580C]' : 'text-[#9B9B97]'
                  }`}
                >
                  STEP {step.step}
                </span>
                <span className="rounded bg-[#F0F0EE] px-1.5 py-0.5 font-mono text-[9.5px] text-[#686866]">
                  {step.level}
                </span>
              </div>
              <h4 className="text-[14px] font-semibold text-[#101010]">
                {step.title}
              </h4>
              <p className="text-[11.5px] text-[#686866] mt-0.5 truncate">
                {step.scope}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Display Pane */}
      <div className="rounded-[14px] border border-[#E4E4E1] bg-white p-4 sm:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Explanatory Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 font-mono text-[10px] font-bold text-[#C2410C]">
                {activeStep.level.toUpperCase()}
              </span>
              <span className="font-mono text-[11px] text-[#059669] font-medium">
                {activeStep.pill}
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-[#101010] tracking-tight">
              {activeStep.title}
            </h3>

            <p className="text-[13.5px] text-[#4B5563] leading-relaxed">
              {activeStep.description}
            </p>

            <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-3.5 space-y-2">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9B9B97]">
                Why this matters in FM
              </p>
              <p className="text-[12px] text-[#374151]">
                Clients don&apos;t have to log out or export CSV files to inspect a defect. You drill straight from an estate metric down into the plantroom asset and the engineer holding the tool.
              </p>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="rounded-[8px] border border-[#E4E4E1] px-3 py-1.5 text-[12px] font-medium text-[#686866] hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                ← Previous Layer
              </button>
              <button
                disabled={activeStepIndex === HIERARCHY_STEPS.length - 1}
                onClick={() =>
                  setActiveStepIndex((prev) =>
                    Math.min(HIERARCHY_STEPS.length - 1, prev + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-[8px] bg-[#101010] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#252525] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Next Layer →
              </button>
            </div>
          </div>

          {/* Right: High-Res Frame */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] overflow-hidden shadow-md aspect-[16/10]">
              <Image
                src={activeStep.image}
                alt={activeStep.caption}
                fill
                className="object-cover object-top transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            <p className="mt-2 text-center font-mono text-[11px] text-[#9B9B97]">
              {activeStep.caption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
