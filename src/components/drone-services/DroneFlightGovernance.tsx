'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Wind, 
  MapPin, 
  HardHat, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FlightPhase {
  number: string;
  name: string;
  status: string;
  statusType: 'valid' | 'checked' | 'issued' | 'optimal';
  tagline: string;
  protocolDetails: string[];
  governanceCompliance: string;
}

const FLIGHT_PHASES: FlightPhase[] = [
  {
    number: '01',
    name: 'Site Evaluation & Geometry',
    status: 'SITE VERIFIED',
    statusType: 'valid',
    tagline: 'Spatial boundary mapping & asset risk assessment',
    protocolDetails: [
      'Site boundary and ground obstacle mapping',
      'High-voltage power line & radio mast clearance check',
      'Emergency alternate landing site allocation',
      'Pedestrian and tenant transit flow profiling',
    ],
    governanceCompliance: 'Site-specific risk matrix aligned with ISO 45001 health and safety management frameworks.',
  },
  {
    number: '02',
    name: 'Airspace & ATC Authorization',
    status: 'AIRSPACE CHECKED',
    statusType: 'checked',
    tagline: 'UK CAA airspace classification & FRZ protocol',
    protocolDetails: [
      'UK Civil Aviation Authority (CAA) framework alignment',
      'Flight Restriction Zone (FRZ) airport coordination',
      'NATS NOTAM (Notice to Airmen) review',
      'Local emergency services non-interference protocol',
    ],
    governanceCompliance: 'All flights operate strictly within applicable UK CAA commercial authorisations and bylaws.',
  },
  {
    number: '03',
    name: 'Weather Threshold Verification',
    status: 'WITHIN LIMITS',
    statusType: 'optimal',
    tagline: 'Wind gust, precipitation & cloud base limits',
    protocolDetails: [
      'Wind speed sustained <20 knots / gusts <25 knots',
      '0% active precipitation (rain, snow, sleet, hail)',
      'Visibility >5km maintaining Visual Line of Sight (VLOS)',
      'Radiometric solar delta-T calibration for thermal scans',
    ],
    governanceCompliance: 'Strict go/no-go abort criteria guaranteed prior to rotor spin-up to prevent flight instability.',
  },
  {
    number: '04',
    name: 'Site-Specific RAMS Execution',
    status: 'RAMS ISSUED',
    statusType: 'issued',
    tagline: 'Risk Assessment & Method Statements',
    protocolDetails: [
      'Dynamic on-site hazard and working-at-height elimination',
      'Controlled ground exclusion zone cordon establishment',
      'Dedicated safety marshals & high-visibility signage',
      'Aviation third-party liability insurance (EC 785/2004)',
    ],
    governanceCompliance: 'Comprehensive RAMS submitted and approved by principal contractor or facilities director prior to flight.',
  },
  {
    number: '05',
    name: 'Autonomous Flight & QA',
    status: 'FLIGHT PLANNED',
    statusType: 'optimal',
    tagline: 'RTK centimeter photogrammetric execution',
    protocolDetails: [
      'Centimetre-level RTK dual-frequency GPS positioning',
      '80% front / 70% side photogrammetric image overlap',
      'Real-time fail-safe Return-to-Launch (RTL) battery monitoring',
      'Live optical & radiometric sensor data telemetry QA',
    ],
    governanceCompliance: 'Redundant dual-IMU commercial UAV platforms with obstacle avoidance sensors.',
  },
  {
    number: '06',
    name: 'Data QA & CAFM Archiving',
    status: 'DELIVERED',
    statusType: 'valid',
    tagline: 'Structured engineering export & work order sync',
    protocolDetails: [
      'Spatial georeferencing against Ordnance Survey datum',
      'RAG defect categorization (Priority 1 / 2 / 3)',
      'Automated CAD, GeoTIFF, LAS point cloud generation',
      'Direct integration with EntireCAFM asset registry',
    ],
    governanceCompliance: 'Immutable digital audit trail meeting institutional landlord and insurer compliance requirements.',
  },
];

export function DroneFlightGovernance() {
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(0);
  const current = FLIGHT_PHASES[activePhaseIdx];

  return (
    <section 
      id="safety-governance"
      aria-label="Flight Operations and Aviation Safety Governance"
      className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
              AVIATION SAFETY &amp; UK REGULATORY GOVERNANCE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
            Commercial Flight Operations: <br />
            <span className="text-hero-pink font-light">
              Engineered With Absolute Governance
            </span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
            Commercial drone surveys demand the same rigorous risk mitigation, airspace verification, and method statements as heavy engineering operations. We plan every survey with zero compromise on safety.
          </p>
        </div>

        {/* Live Mission Planning Console */}
        <div className="rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden shadow-elevated">
          {/* Top Real-Time Status Telemetry Ticker */}
          <div className="p-6 bg-brand-void/90 border-b border-brand-edge-dark grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
            <div className="space-y-1 border-r border-white/[0.06] pr-2 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CAA STATUS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                VALID AUTHORISATION
              </span>
            </div>

            <div className="space-y-1 border-r border-white/[0.06] pr-2 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">AIRSPACE / FRZ</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                CHECKED &amp; CLEARED
              </span>
            </div>

            <div className="space-y-1 border-r border-white/[0.06] pr-2 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SITE RAMS</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SITE-SPECIFIC ISSUED
              </span>
            </div>

            <div className="space-y-1 border-r border-white/[0.06] pr-2 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">WEATHER LIMIT</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                &lt;20 KTS SUSTAINED
              </span>
            </div>

            <div className="space-y-1 border-r border-white/[0.06] pr-2 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">INSURANCE</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                EC 785/2004 COMPLIANT
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">PILOT CREW</span>
              <span className="text-brand-pink font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                COMMERCIAL QUALIFIED
              </span>
            </div>
          </div>

          {/* 6-Phase Sequence Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-brand-edge-dark">
            {FLIGHT_PHASES.map((phase, idx) => {
              const isSelected = activePhaseIdx === idx;
              return (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => setActivePhaseIdx(idx)}
                  className={`p-4 text-left font-mono text-xs transition-all border-r border-brand-edge-dark last:border-none relative flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-brand-carbon text-white font-medium shadow-inner'
                      : 'bg-brand-carbon/40 text-slate-400 hover:bg-brand-carbon/70 hover:text-slate-200'
                  }`}
                >
                  <div 
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
                      isSelected ? 'bg-gradient-to-r from-brand-pink to-brand-magenta' : 'bg-transparent'
                    }`} 
                  />

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-brand-pink' : 'text-slate-500'}>
                      PHASE {phase.number}
                    </span>
                    <span className="text-emerald-400">{phase.status.split(' ')[0]}</span>
                  </div>

                  <span className="text-xs font-sans font-light line-clamp-1 mt-2">
                    {phase.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive */}
          <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-pink font-mono text-xs uppercase tracking-widest font-semibold">
                  <Radio className="h-4 w-4" />
                  <span>PHASE {current.number} · {current.status}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                  {current.name}
                </h3>

                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {current.tagline}
                </p>
              </div>

              {/* Protocol Checklist */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                  Operational Safety Protocols:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.protocolDetails.map((pt, pIdx) => (
                    <div key={pIdx} className="p-3 rounded-sm bg-brand-void/60 border border-white/[0.04] flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Regulatory Compliance Statement */}
            <div className="lg:col-span-5 p-6 rounded-sm bg-brand-void/80 border border-brand-edge-dark space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Statutory Regulatory Framework</span>
              </div>

              <p className="font-sans text-xs text-slate-300 font-light leading-relaxed">
                {current.governanceCompliance}
              </p>

              <div className="pt-3 border-t border-brand-edge-dark space-y-2 text-[11px] text-slate-400">
                <div>• Qualified Commercial Pilots (CAA Compliant)</div>
                <div>• EC 785/2004 Aviation Liability Insured</div>
                <div>• Zero Scaffolding Risk for Initial Assessment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
