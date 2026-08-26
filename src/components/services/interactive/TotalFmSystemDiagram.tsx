'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Headphones, 
  CalendarClock, 
  AlertTriangle, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  ArrowDown,
  MonitorCheck
} from 'lucide-react';

interface DiagramNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keyPoints: string[];
}

const NODES: Record<string, DiagramNode> = {
  estate: {
    id: 'estate',
    title: 'Client Property Portfolio',
    subtitle: 'Single or Multi-Site Commercial Estates',
    description: 'Commercial offices, industrial sites, distribution centres, retail parks, or nationwide portfolios managed under one commercial agreement.',
    icon: Building,
    keyPoints: [
      'Single point of commercial accountability',
      'Unified national SLAs and RICS-aligned reporting',
      'Elimination of contractor management overhead',
    ],
  },
  helpdesk: {
    id: 'helpdesk',
    title: 'EntireFM Central Operations Desk',
    subtitle: '24/7 Direct Triage & Contract Management',
    description: 'Dedicated named account manager and round-the-clock technical dispatchers triaging calls, logging works into EntireCAFM, and deploying engineers.',
    icon: Headphones,
    keyPoints: [
      'Named account manager & defined escalation',
      '24/7/365 UK emergency triage desk',
      'Direct dispatch to regional engineering fleet',
    ],
  },
  planned: {
    id: 'planned',
    title: 'Planned PPM',
    subtitle: '52-Week SFG20 Programme',
    description: 'Scheduled servicing routines formulated from on-site barcoded asset registers preventing plant failure.',
    icon: CalendarClock,
    keyPoints: ['SFG20 maintenance standards', 'Barcoded asset tagging', 'Pre-scheduled calendar visits'],
  },
  reactive: {
    id: 'reactive',
    title: 'Reactive Attendance',
    subtitle: 'Contracted Priority SLAs',
    description: '2hr / 4hr / same-day emergency attendance for power loss, HVAC faults, leaks, or security compromises.',
    icon: AlertTriangle,
    keyPoints: ['Priority response bands per site', 'Equipped first-time fix mobile vans', 'Real-time GPS engineer tracking'],
  },
  compliance: {
    id: 'compliance',
    title: 'Statutory Compliance',
    subtitle: 'Audited Legal Verification',
    description: 'Periodic fixed wire testing, fire alarm checks, water hygiene profiling, and F-Gas regulatory compliance.',
    icon: ShieldCheck,
    keyPoints: ['10 statutory discipline coverage', 'Immediate certificate archiving', 'Insurer & landlord compliance proof'],
  },
  cafm: {
    id: 'cafm',
    title: 'EntireCAFM Portal & Vault',
    subtitle: 'Live Asset & Compliance Visibility',
    description: 'Client-facing digital portal holding every equipment history, pending job ticket, statutory certificate, and spend breakdown.',
    icon: Database,
    keyPoints: [
      '24/7 web & mobile client access',
      'Real-time job progress tracking',
      'Instant statutory certificate download',
    ],
  },
};

export function TotalFmSystemDiagram() {
  const [selectedNode, setSelectedNode] = useState<string>('helpdesk');

  const active = NODES[selectedNode] || NODES.helpdesk;

  return (
    <section id="total-fm" className="relative bg-[#060A14] text-white py-20 sm:py-28 border-y border-white/10 overflow-hidden">
      {/* Background ambient facet pattern */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-15" />

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15 backdrop-blur-sm mb-4">
            <Layers className="h-3.5 w-3.5 text-brand-pink-light" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
              TOTAL FACILITIES MANAGEMENT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.15]">
            One estate. One operating picture.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
            Fragmented supply chains cause compliance gaps and escalating reactive costs. EntireFM unifies technical engineering, statutory compliance, and workplace hygiene under single-source accountability.
          </p>
        </div>

        {/* Interactive Diagram & Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left / Diagram Architecture Map */}
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-sm p-6 sm:p-8 backdrop-blur-md space-y-5">
            {/* Top Node: Client / Estate */}
            <button
              onClick={() => setSelectedNode('estate')}
              className={`w-full text-center p-4 rounded-sm border transition-all duration-300 ${
                selectedNode === 'estate'
                  ? 'bg-white/15 border-brand-pink text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                COMMERCIAL CLIENT
              </span>
              <div className="text-base sm:text-lg font-light text-white flex items-center justify-center gap-2">
                <Building className="w-4 h-4 text-brand-pink-light" />
                <span>Client Estate / Property Portfolio</span>
              </div>
            </button>

            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-brand-pink-light animate-bounce" />
            </div>

            {/* Central Node: EntireFM Operations */}
            <button
              onClick={() => setSelectedNode('helpdesk')}
              className={`w-full text-center p-4 sm:p-5 rounded-sm border transition-all duration-300 ${
                selectedNode === 'helpdesk'
                  ? 'bg-brand-pink/20 border-brand-pink text-white shadow-glow'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink-light block mb-1">
                SINGLE POINT OF CONTACT
              </span>
              <div className="text-base sm:text-lg font-light text-white flex items-center justify-center gap-2">
                <Headphones className="w-5 h-5 text-brand-pink-light" />
                <span>EntireFM Central Operations Desk (24/7)</span>
              </div>
            </button>

            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-brand-pink-light" />
            </div>

            {/* Tri-Stream Nodes: Planned / Reactive / Compliance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedNode('planned')}
                className={`p-3.5 rounded-sm border text-left transition-all duration-300 ${
                  selectedNode === 'planned'
                    ? 'bg-white/15 border-brand-pink text-white shadow-md'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-[9.5px] font-mono uppercase text-brand-pink-light block mb-0.5">
                  PLANNED
                </span>
                <span className="text-xs font-normal block text-white">52-Week PPM</span>
              </button>

              <button
                onClick={() => setSelectedNode('reactive')}
                className={`p-3.5 rounded-sm border text-left transition-all duration-300 ${
                  selectedNode === 'reactive'
                    ? 'bg-white/15 border-brand-pink text-white shadow-md'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-[9.5px] font-mono uppercase text-brand-pink-light block mb-0.5">
                  REACTIVE
                </span>
                <span className="text-xs font-normal block text-white">24/7 SLA Callout</span>
              </button>

              <button
                onClick={() => setSelectedNode('compliance')}
                className={`p-3.5 rounded-sm border text-left transition-all duration-300 ${
                  selectedNode === 'compliance'
                    ? 'bg-white/15 border-brand-pink text-white shadow-md'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-[9.5px] font-mono uppercase text-brand-pink-light block mb-0.5">
                  STATUTORY
                </span>
                <span className="text-xs font-normal block text-white">Compliance Vault</span>
              </button>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-brand-pink-light" />
            </div>

            {/* Bottom Node: EntireCAFM */}
            <button
              onClick={() => setSelectedNode('cafm')}
              className={`w-full text-center p-4 rounded-sm border transition-all duration-300 ${
                selectedNode === 'cafm'
                  ? 'bg-white/15 border-brand-pink text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                DIGITAL OPERATING PLATFORM
              </span>
              <div className="text-base sm:text-lg font-light text-white flex items-center justify-center gap-2">
                <Database className="w-4 h-4 text-brand-pink-light" />
                <span>EntireCAFM Client Portal &amp; Compliance Vault</span>
              </div>
            </button>
          </div>

          {/* Right / Node Details Inspector */}
          <div className="lg:col-span-5 bg-white/[0.05] border border-white/15 rounded-sm p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xs bg-brand-pink/20 text-brand-pink-light border border-brand-pink/30">
                <active.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-pink-light block">
                  SYSTEM COMPONENT
                </span>
                <h3 className="text-xl sm:text-2xl font-light text-white">
                  {active.title}
                </h3>
              </div>
            </div>

            <div className="text-xs font-mono uppercase text-slate-400 border-b border-white/10 pb-2">
              {active.subtitle}
            </div>

            <p className="text-sm text-brand-mist leading-relaxed font-light">
              {active.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                Operational Guarantees:
              </span>
              <div className="space-y-2">
                {active.keyPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-brand-mist">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink-light shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/hard-services"
                className="btn-hero-pink text-xs py-2.5 px-4 justify-center"
              >
                <span>Explore Total FM</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link
                href="/client-portal"
                className="btn-ghost-light text-xs py-2.5 px-4 justify-center"
              >
                <MonitorCheck className="w-3.5 h-3.5 mr-1 text-brand-pink-light" />
                <span>See Client Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
