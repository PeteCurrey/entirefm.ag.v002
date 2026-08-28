'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  History, 
  ArrowRight,
  Database,
  ShieldCheck,
  UserCheck,
  Building,
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CafmNode {
  step: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  recordData: {
    field: string;
    value: string;
  }[];
  description: string;
}

const CAFM_LIFECYCLE_NODES: CafmNode[] = [
  {
    step: '01',
    title: 'Drone Spatial Pin',
    badge: 'AERIAL CAPTURE',
    icon: Camera,
    recordData: [
      { field: 'Sensor', value: '48MP Optical + FLIR 640T' },
      { field: 'Coordinates', value: '53.3811° N · 1.4701° W (RTK)' },
      { field: 'Elevation', value: '+42.5m AGL · Roof Zone B' },
    ],
    description: 'High-resolution aerial optical and thermal survey captures defect location with millimetre RTK positioning.',
  },
  {
    step: '02',
    title: 'Defect Observation',
    badge: 'DIAGNOSTIC RECORD',
    icon: AlertTriangle,
    recordData: [
      { field: 'Ticket ID', value: 'OBS-2026-084' },
      { field: 'Observation', value: 'Delaminated Lap Seam & Water Ingress' },
      { field: 'Severity', value: 'Priority 1 (Critical Leak Risk)' },
    ],
    description: 'FM surveyor diagnoses active waterproofing delamination and generates structured defect observation ticket.',
  },
  {
    step: '03',
    title: 'CAFM Asset Registry',
    badge: 'SPATIAL ASSET SYNC',
    icon: MapPin,
    recordData: [
      { field: 'Asset ID', value: 'AST-ROOF-ZB-04' },
      { field: 'Building', value: 'Logistics Facility 01 · North Wing' },
      { field: 'SFG20 Code', value: 'ROOF-MEM-002 (Waterproofing)' },
    ],
    description: 'Defect is pinned directly against the permanent asset register in EntireCAFM with multi-year condition scoring.',
  },
  {
    step: '04',
    title: 'Work Order Generated',
    badge: 'REMEDIAL DISPATCH',
    icon: Wrench,
    recordData: [
      { field: 'Work Order', value: 'WO-2026-9142' },
      { field: 'Trade', value: 'EntireFM Specialist Roofing / Rope Access' },
      { field: 'SLA Target', value: '48 Hours Response' },
    ],
    description: 'Actionable remedial job issued automatically to EntireFM self-delivering hard services engineers.',
  },
  {
    step: '05',
    title: 'Physical Completion',
    badge: 'ENGINEERING FIX',
    icon: UserCheck,
    recordData: [
      { field: 'Engineer', value: 'Lead Roofing Specialist (EntireFM)' },
      { field: 'Materials', value: 'Sarnafil EPDM + Dowsil Silicone' },
      { field: 'Status', value: 'Work Completed & Signed Off' },
    ],
    description: 'Technician executes hot-air weld repair and uploads on-site completion notes directly to EntireCAFM mobile app.',
  },
  {
    step: '06',
    title: 'Verification Flight',
    badge: 'QA SIGNOFF',
    icon: CheckCircle2,
    recordData: [
      { field: 'Verification', value: 'Post-Work Drone Telephoto Pass' },
      { field: 'Delta-T', value: '0.0°C (Moisture Anomaly Resolved)' },
      { field: 'QA Signoff', value: '100% Weather-Tightness Certified' },
    ],
    description: 'Secondary flight confirms weather-tightness, providing audit-proof photographic evidence for insurers.',
  },
  {
    step: '07',
    title: 'Permanent Asset History',
    badge: 'AUDITABLE LOGBOOK',
    icon: History,
    recordData: [
      { field: 'Warranty', value: '10-Year Seal Guarantee Archived' },
      { field: 'Audit Log', value: 'Immutable Timestamped Dossier' },
      { field: 'Next PPM', value: 'Q4 Autumn Thermographic Scan' },
    ],
    description: 'Complete lifecycle record preserved permanently for client portal access, insurance underwriters, and CapEx planning.',
  },
];

export function DroneCafmPlatform() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(3);
  const current = CAFM_LIFECYCLE_NODES[activeStepIdx];
  const CurrentIcon = current.icon;

  return (
    <section 
      id="entirecafm"
      aria-label="EntireCAFM Integrated Aerial Asset Intelligence"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Database className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                CONNECTED DIGITAL OPERATING PLATFORM
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              The Flight Doesn’t End With the Photos. <br />
              <span className="text-hero-pink font-light">
                It Begins with EntireCAFM.
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Aerial findings become live maintenance actions inside EntireFM’s operating environment. We bridge the gap between drone capture and physical facilities engineering.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/client-portal"
              className="inline-flex items-center gap-2 rounded-sm border border-brand-pink bg-brand-pink/10 px-5 py-2.5 text-xs font-mono text-white hover:bg-brand-pink hover:text-white transition-colors"
            >
              <span>Explore EntireCAFM Portal</span>
              <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
            </Link>
          </div>
        </div>

        {/* 7-Step Horizontal Digital Lifecycle Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {CAFM_LIFECYCLE_NODES.map((node, idx) => {
            const isSelected = activeStepIdx === idx;
            const Icon = node.icon;
            return (
              <button
                key={node.step}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`p-3.5 rounded-sm text-left transition-all duration-300 relative border flex flex-col justify-between min-h-[110px] group ${
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
                    STEP {node.step}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-brand-pink' : 'text-slate-500'}`} />
                </div>

                <div>
                  <h3 className={`text-xs font-light leading-snug ${isSelected ? 'text-white font-normal' : 'text-slate-300'}`}>
                    {node.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulated EntireCAFM Live Interface Workspace */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Simulated EntireCAFM Operating System Window */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-brand-void/90 border-r border-brand-edge-dark space-y-6">
            {/* Top CAFM App Bar */}
            <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-white font-semibold">EntireCAFM</span>
                <span className="text-slate-600">/</span>
                <span className="text-brand-pink">Asset Operations</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">WO-2026-9142</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10.5px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">LIVE OPERATIONAL SYNC</span>
              </div>
            </div>

            {/* Active Step Showcase UI */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-brand-pink/15 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                  <CurrentIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-brand-pink uppercase tracking-widest block font-bold">
                    LIFECYCLE STAGE {current.step} OF 07 · {current.badge}
                  </span>
                  <h3 className="text-xl font-light text-white">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {current.description}
              </p>

              {/* Data Record Grid in CAFM */}
              <div className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-2 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
                  EntireCAFM Structured Record Fields
                </span>
                <div className="space-y-2">
                  {current.recordData.map((d, dIdx) => (
                    <div key={dIdx} className="flex justify-between items-center py-1 border-b border-white/[0.04] last:border-none">
                      <span className="text-slate-400">{d.field}:</span>
                      <span className="text-white font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CAFM Action Trigger */}
            <div className="pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Connected Trade: <strong className="text-white font-normal">EntireFM Hard Services &amp; Rope Access</strong></span>
              <span className="text-brand-pink">Audit Timestamp: ISO 8601 Valid</span>
            </div>
          </div>

          {/* Right Column: Key Commercial FM Advantage */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-brand-carbon flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs text-brand-pink font-semibold uppercase tracking-wider block">
                The Single Accountable Provider
              </span>

              <h4 className="text-lg font-light text-white leading-snug">
                Zero friction between drone data and physical engineering execution.
              </h4>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Standard drone companies leave property managers with a ZIP file of images and no way to execute repairs. EntireFM captures, scopes, fixes, verifies and archives within one continuous service framework.
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>No separate contractor procurement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Integrated SFG20 Planned Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Full statutory compliance archiving</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-edge-dark">
              <Link
                href="/client-portal"
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink to-brand-magenta py-3 px-4 text-xs font-medium text-white shadow-elevated hover:shadow-glow-pink transition-all group"
              >
                <span>Request EntireCAFM Access</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
