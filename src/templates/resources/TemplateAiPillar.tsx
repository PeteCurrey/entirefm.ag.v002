'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface TemplateAiPillarProps {
  route: RouteRecord;
  content: ContentRecord;
}

interface WorkOrderStep {
  id: number;
  stage: string;
  title: string;
  actor: 'Tenant' | 'AI Triage Engine' | 'CAFM Database' | 'Engineering Team' | 'Duty Manager' | 'AI Analytics';
  actorType: 'human' | 'ai' | 'system' | 'checkpoint';
  description: string;
  detail: string;
  checkpoint?: string;
  systemData?: { label: string; value: string }[];
}

const WORK_ORDER_STEPS: WorkOrderStep[] = [
  {
    id: 1,
    stage: '01. Tenant Incident Submission',
    title: 'Unstructured Free-Text Issue Logged',
    actor: 'Tenant',
    actorType: 'human',
    description: 'Occupant reports a comfort issue via email or mobile portal: "The 3rd floor client boardroom is roasting hot and the ceiling grille is rattling loudly during meetings."',
    detail: 'Raw incoming unstructured text contains multiple variables: ambient temperature issue, acoustic disturbance, spatial location, and high business importance (client meeting space).'
  },
  {
    id: 2,
    stage: '02. NLP Entity Extraction & Classification',
    title: 'Natural Language Processing & Tagging',
    actor: 'AI Triage Engine',
    actorType: 'ai',
    description: 'Language model parses syntax and extracts structured parameters: Category: HVAC / Climate Control; Location: Floor 3 / Suite 302 / Boardroom; Urgency: Priority 2 (Executive/Client Area); Symptoms: Thermal overheat + mechanical vibration.',
    detail: 'NLP models replace 2-4 minutes of manual dispatcher reading and drop-down selection with instant 98.4% accurate entity tagging.',
    systemData: [
      { label: 'Parsed Trade', value: 'Commercial HVAC / AC' },
      { label: 'Priority SLA', value: '4-Hour Response' },
      { label: 'Confidence Score', value: '99.2%' }
    ]
  },
  {
    id: 3,
    stage: '03. Spatial & Asset Register Correlation',
    title: 'CAFM Asset Identification & BMS Telemetry',
    actor: 'CAFM Database',
    actorType: 'system',
    description: 'The engine queries the building spatial hierarchy, maps "Floor 3 Boardroom" to Fan Coil Unit asset tag FCU-03-04, checks warranty status, and pulls live BACnet BMS sensor data.',
    detail: 'BMS check reveals supply air temperature is 28.4°C against a setpoint of 21.0°C. Chilled water control valve position reads 0% (actuator stuck closed).',
    systemData: [
      { label: 'Target Asset', value: 'FCU-03-04 (Daikin VAV)' },
      { label: 'Live BMS Temp', value: '28.4°C (Target 21.0°C)' },
      { label: 'Valve Actuator', value: '0% Flow / Fault Flagged' }
    ]
  },
  {
    id: 4,
    stage: '04. Human Engineering Checkpoint',
    title: 'Safety & Commercial Threshold Verification',
    actor: 'Duty Manager',
    actorType: 'checkpoint',
    description: 'HUMAN APPROVAL GATE: The system prepares a pre-scoped work order with diagnosed fault notes. The helpdesk duty manager clicks single-click approval to dispatch.',
    detail: 'Critical safety rule: AI assists triage but human coordinators verify scope, confirm site access restrictions, and authorize chargeable commercial thresholds.',
    checkpoint: 'MANDATORY HUMAN APPROVAL — Duty Manager verifies trade scope and client SLA before contractor dispatch.'
  },
  {
    id: 5,
    stage: '05. Automated Engineer Dispatch & Routing',
    title: 'Geolocation & Skill-Matrix Dispatch',
    actor: 'Engineering Team',
    actorType: 'system',
    description: 'System checks on-shift mobile engineering roster for valid F-Gas / Electrical accreditations, vehicle live telemetry, and van stock inventory (replacement 24V valve actuators).',
    detail: 'Dispatches work order directly to nearest qualified mobile engineer mobile tablet with building access codes, plantroom keys location, and historical maintenance log.'
  },
  {
    id: 6,
    stage: '06. Field Resolution & Evidence Capture',
    title: 'Physical Repair & Photographic Sign-Off',
    actor: 'Engineering Team',
    actorType: 'human',
    description: 'Qualified HVAC engineer isolates power, replaces faulty 24V modulating actuator, recalibrates BMS stroke, verifies 12.8°C cooling supply, and logs photo evidence into CAFM.',
    detail: 'Engineer logs time, parts used, commissioning checklist, and obtains digital tenant sign-off on mobile app.',
    systemData: [
      { label: 'Part Replaced', value: 'Belimo 24V Mod Actuator' },
      { label: 'Post-Repair Temp', value: '20.8°C Stable' },
      { label: 'F-Gas Check', value: 'Not Required (Water Side)' }
    ]
  },
  {
    id: 7,
    stage: '07. Post-Resolution Pattern Intelligence',
    title: 'Asset Lifecycle & Recurring Fault Analysis',
    actor: 'AI Analytics',
    actorType: 'ai',
    description: 'Machine learning model aggregates ticket data against historical plant logs across the estate. Flags that 4 out of 12 Belimo actuators on Floor 3 have failed within 90 days.',
    detail: 'AI recommends scheduling a proactive replacement campaign of remaining 8 legacy actuators during upcoming planned PPM visit, preventing future reactive emergency callouts.',
    systemData: [
      { label: 'Batch Risk', value: 'Floor 3 Actuators (2018 Install)' },
      { label: 'Proactive Action', value: 'Bundle into Q3 PPM Visit' },
      { label: 'Est. Savings', value: '£840 in Reactive Callout Fees' }
    ]
  }
];

const AI_TECHNOLOGIES = [
  {
    name: 'Machine Learning (ML)',
    category: 'Statistical Analytics',
    description: 'Supervised and unsupervised algorithms trained on numerical sensor telemetry, run hours, and temperature logs to spot deviation patterns.',
    practicalExample: 'Detecting subtle vibration frequency shifts in a chiller compressor before bearing seizure.',
    readiness: 'High (Production Ready)'
  },
  {
    name: 'Natural Language Processing (NLP / LLMs)',
    category: 'Generative & Language AI',
    description: 'Large language models fine-tuned to parse unstructured text, understand engineering phrasing, and extract technical entities from reports.',
    practicalExample: 'Translating vague occupant complaint emails into structured, asset-mapped work order tickets.',
    readiness: 'High (Production Ready)'
  },
  {
    name: 'Computer Vision',
    category: 'Visual & Radiometric AI',
    description: 'Convolutional neural networks trained to detect anomalies in high-resolution photography, drone photogrammetry, and infrared thermography.',
    practicalExample: 'Automating cladding defect tagging and thermal heat loss identification on multi-storey facades.',
    readiness: 'Medium-High (Operational)'
  },
  {
    name: 'Predictive Analytics',
    category: 'Mathematical Forecasting',
    description: 'Time-series regression models forecasting Mean Time Between Failures (MTBF) and seasonal energy load demand curves.',
    practicalExample: 'Forecasting boiler gas consumption requirements 48 hours in advance based on degree-day weather models.',
    readiness: 'High (Established Practice)'
  },
  {
    name: 'Autonomous AI Agents',
    category: 'Goal-Directed Automation',
    description: 'Multi-step software agents executing chained tasks using APIs, document lookups, and schedule adjustments under human guardrails.',
    practicalExample: 'Agent cross-checking subcontractor accreditation databases and chasing expiring insurance certificates.',
    readiness: 'Emerging (Requires Human Oversight)'
  },
  {
    name: 'Digital Twins',
    category: 'Spatial & Telemetry Integration',
    description: 'Dynamic virtual models unifying 3D BIM spatial data with real-time IoT sensors and historical maintenance records.',
    practicalExample: 'Simulating thermal dispersion and airflow changes prior to reconfiguring server room floor plans.',
    readiness: 'Specialist / High-Capital Estates'
  }
];

const USE_CASE_AREAS = [
  {
    title: 'Asset Engineering & Maintenance',
    icon: 'wrench',
    points: [
      'Condition-based vibration and thermal monitoring on critical primary plant',
      'Automated mean-time-between-failure (MTBF) tracking across asset classes',
      'Predictive wear calculations balancing run hours against manufacturer thresholds',
      'Correlation of weather extremes with chiller and boiler thermal strain'
    ],
    link: '/resources/ai-in-facilities-management/predictive-maintenance',
    linkText: 'Predictive Maintenance Guide →'
  },
  {
    title: 'Helpdesk & Service Desk',
    icon: 'headset',
    points: [
      'Instant parsing and entity extraction from free-text emails and portal tickets',
      'Automated spatial mapping matching reported room names to exact CAFM asset tags',
      'Cluster deduplication merging multiple occupant reports of the same building event',
      'Skill and accreditation matching for rapid mobile engineer dispatch'
    ],
    link: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    linkText: 'AI Helpdesk & Work Orders →'
  },
  {
    title: 'Energy & Environmental Controls',
    icon: 'bolt',
    points: [
      'Multi-variable regression tuning BMS setpoints against ambient weather forecasts',
      'Automated detection of simultaneous heating and cooling valve conflicts',
      'Dynamic occupancy-driven deadband adjustments across vacant office floor plates',
      'Peak electricity tariff load shedding and thermal pre-cooling cycles'
    ],
    link: '/resources/ai-in-facilities-management/energy-optimisation',
    linkText: 'Energy Optimisation Guide →'
  },
  {
    title: 'Statutory Compliance & Auditing',
    icon: 'shield',
    points: [
      'Automated extraction of inspection dates, re-test due dates, and accreditation numbers from PDF certificates',
      'EICR defect code parsing pulling C1/C2 items immediately into remedial job queues',
      'Portfolio-wide statutory gap analysis identifying missing water hygiene or gas records',
      'Verification of contractor competency and accreditation badge validity'
    ],
    link: '/resources/ai-in-facilities-management/ai-compliance',
    linkText: 'AI & Compliance Guide →'
  },
  {
    title: 'Software & CAFM Architecture',
    icon: 'server',
    points: [
      'Natural-language vector search querying thousands of asset records in plain English',
      'Predictive SLA risk scoring flagging work orders before contract breach occurs',
      'Automated OCR reconciliation matching contractor invoices against approved rates',
      'Automated client KPI reporting compiling monthly executive summaries'
    ],
    link: '/resources/ai-in-facilities-management/ai-cafm',
    linkText: 'AI & CAFM Systems →'
  },
  {
    title: 'Governance, Privacy & Risk',
    icon: 'lock',
    points: [
      'Air-gapped OT network controls preventing cloud AI from modifying life-safety plant',
      'Cryptographic audit logging recording every algorithmic recommendation and override',
      'GDPR compliance anonymising occupancy sensor data and computer vision feeds',
      'Supplier risk evaluation for third-party AI software vendors'
    ],
    link: '/resources/ai-in-facilities-management/ai-governance',
    linkText: 'AI Governance & Security →'
  }
];

export function TemplateAiPillar({ route, content }: TemplateAiPillarProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStepData = WORK_ORDER_STEPS.find(s => s.id === activeStep) || WORK_ORDER_STEPS[0];

  return (
    <div className="bg-[#0b1320] text-slate-100 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-[#060c16] via-[#0b1320] to-[#0f172a] border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Breadcrumbs items={content.breadcrumbs || []} />
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Technical & Operational Whitepaper • 2026 Edition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              AI in Facilities Management
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-light leading-relaxed mb-8">
              A practical, engineering-led examination of artificial intelligence in commercial estate operations, building maintenance, and CAFM workflows.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800/80 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Focus:</span>
                <span className="text-white font-medium">Commercial Estates & FM Teams</span>
              </div>
              <div className="w-px h-5 bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Methodology:</span>
                <span className="text-white font-medium">Operational & Technical Reality</span>
              </div>
              <div className="w-px h-5 bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Published:</span>
                <span className="text-white font-medium">2026 Authoritative Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT AI ACTUALLY MEANS — DEFINITIONS MATRIX */}
      <section className="py-20 bg-[#0f172a] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
              Technology Demystification
            </h2>
            <p className="text-3xl font-bold text-white mb-4">
              What AI Actually Means in Building Management
            </p>
            <p className="text-slate-400 leading-relaxed">
              Software vendors often label standard rules-based automation and basic database queries as "AI". To make informed procurement decisions, facilities leaders must distinguish genuine machine learning capabilities from conventional software features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_TECHNOLOGIES.map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 hover:border-pink-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-pink-300 border border-slate-700">
                      {tech.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {tech.readiness}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    FM Application:
                  </span>
                  <p className="text-xs text-slate-300 italic">
                    "{tech.practicalExample}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLAGSHIP INTERACTIVE MODULE: THE AI-ENABLED WORK ORDER */}
      <section className="py-24 bg-[#060c16] border-b border-slate-800 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Interactive Operational Walkthrough
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The AI-Enabled Work Order: Request to Resolution
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Explore how artificial intelligence, IoT telemetry, and human engineering checkpoints work in harmony to triage, scope, and resolve commercial building faults.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-10">
            {WORK_ORDER_STEPS.map((step) => {
              const isSelected = step.id === activeStep;
              const isPast = step.id < activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500 text-white shadow-lg shadow-pink-950/30'
                      : isPast
                      ? 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-mono block font-bold text-pink-400 mb-1">
                    STEP {step.id}
                  </span>
                  <span className="text-xs font-semibold block truncate leading-tight">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest block mb-1">
                  {currentStepData.stage}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {currentStepData.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Primary Actor:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentStepData.actorType === 'checkpoint'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : currentStepData.actorType === 'ai'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : currentStepData.actorType === 'human'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {currentStepData.actor}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Operational Description
                  </h4>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Underlying Engineering Detail
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentStepData.detail}
                  </p>
                </div>

                {currentStepData.checkpoint && (
                  <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-amber-400 text-lg">⚠️</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                        Critical Compliance Safeguard
                      </span>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {currentStepData.checkpoint}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-4 flex items-center justify-between">
                  <span>System Telemetry & Metadata</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>

                {currentStepData.systemData ? (
                  <div className="space-y-4">
                    {currentStepData.systemData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                        <span className="text-xs text-slate-400">{item.label}</span>
                        <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-4">
                    Standard human interaction step. No algorithmic telemetry logged for this stage.
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                    disabled={activeStep === 1}
                    className="px-3 py-1.5 rounded bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Previous Step
                  </button>
                  <span className="text-slate-400 font-mono">
                    {activeStep} of {WORK_ORDER_STEPS.length}
                  </span>
                  <button
                    onClick={() => setActiveStep(prev => Math.min(WORK_ORDER_STEPS.length, prev + 1))}
                    disabled={activeStep === WORK_ORDER_STEPS.length}
                    className="px-3 py-1.5 rounded bg-pink-600 text-white font-semibold hover:bg-pink-500 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI USE CASE MAP */}
      <section className="py-20 bg-[#0f172a] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Estate-Wide Capabilities
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI Use-Case Matrix across Estate Functions
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Explore in-depth technical guides for each major domain of commercial building management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASE_AREAS.map((area) => (
              <div
                key={area.title}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-pink-500/40 transition-all group"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">
                    {area.title}
                  </h3>
                  <ul className="space-y-2.5 mb-6">
                    {area.points.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-pink-400 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <Link
                    href={area.link}
                    className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center justify-between"
                  >
                    <span>Read Technical Guide</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHITE EDITORIAL SECTION: WHAT AI CANNOT DO WELL */}
      <section className="py-20 bg-slate-100 text-slate-900 border-b border-slate-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-700 mb-2 block">
              Commercial & Operational Balance
            </span>
            <h2 className="text-3xl font-bold text-slate-950 mb-4">
              What AI Cannot Do Well in Facilities Management
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Successful FM technology strategy requires understanding the hard boundaries of machine learning. The following tasks require human craftsmanship, legal accreditation, and physical presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <span className="text-2xl mb-3 block">⚖️</span>
              <h3 className="text-base font-bold text-slate-950 mb-2">
                Statutory Certification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                UK law requires a human Competent Person (e.g. Gas Safe, NICEIC, BAFE) to inspect and sign off safety certificates. AI algorithms cannot legally certify compliance.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <span className="text-2xl mb-3 block">🔧</span>
              <h3 className="text-base font-bold text-slate-950 mb-2">
                Physical Craftsmanship
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Software can detect a pump bearing fault, but it cannot strip the casing, replace the mechanical seal, or align the coupling. Hands-on engineering remains essential.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <span className="text-2xl mb-3 block">🚨</span>
              <h3 className="text-base font-bold text-slate-950 mb-2">
                Emergency Judgement
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In building emergencies (gas leaks, major water ingress, structural movement), automated rules fail. Human duty managers must evaluate site risk and coordinate emergency services.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <span className="text-2xl mb-3 block">🤝</span>
              <h3 className="text-base font-bold text-slate-950 mb-2">
                Tenant Relationship Care
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                De-escalating frustrated commercial tenants, resolving complex lease boundary disputes, and negotiating contractor rates requires human empathy and commercial tact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI READINESS CHECKLIST */}
      <section className="py-20 bg-[#0b1320] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Prerequisites & Strategy
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              The 5-Step AI Readiness Pathway for Estates
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Before investing in AI software or predictive sensors, estates directors should follow a structured readiness sequence to avoid costly failed implementations.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">Phase 1</span>
                <h3 className="text-base font-bold text-white">Clean & Standardise the Asset Register</h3>
                <p className="text-xs text-slate-300 mt-1">Audit serial numbers, map parent-child spatial hierarchies, and adopt SFG20 asset codes.</p>
              </div>
              <Link href="/resources/ai-in-facilities-management/fm-data-readiness" className="text-xs font-bold text-pink-400 hover:text-pink-300 shrink-0">
                Data Readiness Guide →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">Phase 2</span>
                <h3 className="text-base font-bold text-white">Consolidate Helpdesk & CAFM Workflow</h3>
                <p className="text-xs text-slate-300 mt-1">Enforce standardised failure cause codes rather than free-text notes across all engineer mobile apps.</p>
              </div>
              <Link href="/resources/ai-in-facilities-management/ai-cafm" className="text-xs font-bold text-pink-400 hover:text-pink-300 shrink-0">
                CAFM Guide →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">Phase 3</span>
                <h3 className="text-base font-bold text-white">Deploy Pilot IoT on Critical Assets Only</h3>
                <p className="text-xs text-slate-300 mt-1">Install vibration and temperature sensors on top-criticality plant (chillers, main pumps, primary AHUs).</p>
              </div>
              <Link href="/resources/ai-in-facilities-management/predictive-maintenance" className="text-xs font-bold text-pink-400 hover:text-pink-300 shrink-0">
                Predictive Maintenance →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">Phase 4</span>
                <h3 className="text-base font-bold text-white">Implement Automated Document Intelligence</h3>
                <p className="text-xs text-slate-300 mt-1">Use document AI to parse historical compliance certificates, extract remedials, and verify contractor accreditations.</p>
              </div>
              <Link href="/resources/ai-in-facilities-management/ai-compliance" className="text-xs font-bold text-pink-400 hover:text-pink-300 shrink-0">
                Compliance AI Guide →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-pink-400 uppercase">Phase 5</span>
                <h3 className="text-base font-bold text-white">Establish Cybersecurity & Governance Guardrails</h3>
                <p className="text-xs text-slate-300 mt-1">Air-gap building OT networks and audit third-party AI software vendors with standard security questionnaires.</p>
              </div>
              <Link href="/resources/ai-in-facilities-management/ai-governance" className="text-xs font-bold text-pink-400 hover:text-pink-300 shrink-0">
                Governance Framework →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ALL 10 SUB-GUIDE DIRECTORY */}
      <section className="py-20 bg-[#0f172a] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Complete Knowledge Cluster
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore the 10 Supporting AI in FM Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'Predictive Maintenance', path: '/resources/ai-in-facilities-management/predictive-maintenance', tag: 'Plant Reliability' },
              { title: 'Helpdesk & Work Orders', path: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders', tag: 'Service Desk' },
              { title: 'AI + CAFM Software', path: '/resources/ai-in-facilities-management/ai-cafm', tag: 'Technology' },
              { title: 'Energy Optimisation', path: '/resources/ai-in-facilities-management/energy-optimisation', tag: 'Sustainability' },
              { title: 'Digital Twins', path: '/resources/ai-in-facilities-management/digital-twins', tag: 'Spatial Data' },
              { title: 'AI Agents in FM', path: '/resources/ai-in-facilities-management/ai-agents', tag: 'Workflows' },
              { title: 'Computer Vision', path: '/resources/ai-in-facilities-management/computer-vision', tag: 'Visual Surveys' },
              { title: 'AI & Compliance', path: '/resources/ai-in-facilities-management/ai-compliance', tag: 'Statutory Safety' },
              { title: 'FM Data Readiness', path: '/resources/ai-in-facilities-management/fm-data-readiness', tag: 'Asset Registers' },
              { title: 'AI Governance & Risk', path: '/resources/ai-in-facilities-management/ai-governance', tag: 'Cybersecurity' },
            ].map((guide) => (
              <Link
                key={guide.path}
                href={guide.path}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-pink-500/60 hover:bg-slate-800/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-semibold text-pink-400 uppercase tracking-wider block mb-2">
                    {guide.tag}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    {guide.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 mt-4 block group-hover:text-pink-400">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-20 bg-[#0b1320] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Common Questions
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions on FM Artificial Intelligence
            </h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {(content.faqs || []).map((faq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTEXTUAL COMMERCIAL CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-950/40 via-slate-900 to-slate-900 border-t border-pink-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 block">
              Commercial Partnership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Looking for a Technology-Enabled Facilities Partner?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              EntireFM combines self-delivered multi-skilled engineering with modern CAFM software, transparent client reporting, and structured statutory compliance management across UK commercial property.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="px-8 py-4 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 transition-all shadow-lg shadow-pink-600/30"
              >
                Discuss Your Estate Requirements
              </Link>
              <Link
                href="/tools/ppm-schedule-builder"
                className="px-8 py-4 rounded-xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 border border-slate-700 transition-all"
              >
                Build a PPM Schedule Online
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
