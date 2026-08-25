'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { ResourceHero } from '@/components/resources/ResourceHero';
import { ResourceSectionNav } from '@/components/resources/ResourceSectionNav';
import { EditorialImageBreak } from '@/components/resources/EditorialImageBreak';
import { ProcessFlow, CafmLayeredArchitecture } from '@/components/resources/TechnicalDiagram';
import { TelemetryChart } from '@/components/resources/TelemetryChart';
import { ComparisonVisual } from '@/components/resources/ComparisonVisual';
import { CapabilityMatrix } from '@/components/resources/CapabilityMatrix';
import { ExecutiveSummary } from '@/components/resources/ExecutiveSummary';
import { AnnotatedTechnicalImage } from '@/components/resources/AnnotatedTechnicalImage';
import { RelatedResourceGrid } from '@/components/resources/RelatedResourceGrid';
import { CheckCircle2, Cpu, Wrench, Shield, ArrowRight, UserCheck, HardHat, FileCheck, Layers } from 'lucide-react';

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

const AI_TECHNOLOGIES_SPECTRUM = [
  {
    name: 'Predictive Analytics & Anomaly Detection',
    maturity: 'Established Practice',
    maturityTier: 'High (Production)',
    category: 'Telemetry & Vibration',
    description: 'Time-series mathematical forecasting and FFT harmonic vibration analysis identifying equipment degradation before failure.',
    application: 'Chiller compressors, AHU supply fans, primary heating pumps, and condenser banks.',
    accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
  },
  {
    name: 'Natural Language Processing (NLP / LLMs)',
    maturity: 'Operational Standard',
    maturityTier: 'High (Production)',
    category: 'Helpdesk & Documents',
    description: 'Extracting structured trade categories, room coordinates, and SLA urgency tags from raw occupant emails and PDF inspection logs.',
    application: 'Helpdesk triage, spatial CAFM mapping, and contractor certificate OCR ingestion.',
    accent: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
  },
  {
    name: 'Computer Vision & Thermography',
    maturity: 'Operational Standard',
    maturityTier: 'Medium-High (Active)',
    category: 'Visual & Radiometric',
    description: 'Convolutional neural networks analyzing drone photogrammetry, facade imagery, and switchgear thermal scans for defect heat spots.',
    application: 'Roof leak mapping, cladding inspections, and electrical distribution hotspot detection.',
    accent: 'border-pink-500/40 bg-pink-950/20 text-pink-300',
  },
  {
    name: 'Autonomous Task Agents',
    maturity: 'Supervised Emerging',
    maturityTier: 'Medium (Human-in-the-Loop)',
    category: 'Workflow Automation',
    description: 'Chained algorithmic agents executing multi-step administrative tasks like contractor insurance chasing and SLA countdown monitoring.',
    application: 'Supply-chain compliance chasing, invoice matching, and PPM schedule auto-levelling.',
    accent: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  {
    name: 'Digital Twins & Dynamic BIM',
    maturity: 'High-Capital Specialist',
    maturityTier: 'Specialist Estates',
    category: 'Spatial & Telemetry',
    description: 'Real-time 3D spatial models unifying static BIM geometry with live IoT sensor telemetry and historical maintenance work orders.',
    application: 'Complex hospital campuses, mission-critical datacentres, and multi-tenant headquarters.',
    accent: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
  },
];

const SUPPORTING_GUIDES = [
  {
    title: 'AI Predictive Maintenance Guide',
    href: '/resources/ai-in-facilities-management/predictive-maintenance',
    category: 'Condition Monitoring',
    description: 'Condition-based monitoring, IoT vibration sensors, BMS telemetry, and PPM optimization across commercial chillers and pumps.',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    readingTime: '9 min read',
  },
  {
    title: 'AI and Next-Gen CAFM Software',
    href: '/resources/ai-in-facilities-management/ai-cafm',
    category: 'Software & Data',
    description: 'Vector asset search, automated scheduling, predictive SLA risk scoring, and EntireCAFM technology.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    readingTime: '10 min read',
  },
  {
    title: 'AI in the FM Helpdesk & Work Orders',
    href: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    category: 'Helpdesk & Triage',
    description: 'Natural language ticket triage, spatial asset mapping, automated dispatch and human safety safeguards.',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-1200w.webp',
    readingTime: '8 min read',
  },
  {
    title: 'Energy Optimisation via AI & BMS',
    href: '/resources/ai-in-facilities-management/energy-optimisation',
    category: 'Energy & Sustainability',
    description: 'Dynamic BMS setpoint tuning, weather degree-day forecasting, and occupancy-driven deadband widening.',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-1200w.webp',
    readingTime: '11 min read',
  },
  {
    title: 'Digital Twins in Building Management',
    href: '/resources/ai-in-facilities-management/digital-twins',
    category: 'Spatial Technology',
    description: 'Spatial hierarchy, real-time telemetry binding, and BIM integration across complex commercial property portfolios.',
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    readingTime: '12 min read',
  },
  {
    title: 'Computer Vision & Thermal Inspections',
    href: '/resources/ai-in-facilities-management/computer-vision',
    category: 'Visual Inspection',
    description: 'Radiometric infrared thermography, drone facade surveys, and automated electrical switchgear defect tagging.',
    imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-1200w.webp',
    readingTime: '9 min read',
  },
  {
    title: 'AI in Statutory Compliance & Auditing',
    href: '/resources/ai-in-facilities-management/ai-compliance',
    category: 'Compliance & Safety',
    description: 'Automated certificate OCR ingestion, EICR C1/C2 defect extraction, and 100% audit-ready digital logbooks.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    readingTime: '10 min read',
  },
  {
    title: 'Is Your FM Data Ready for AI?',
    href: '/resources/ai-in-facilities-management/fm-data-readiness',
    category: 'Data Infrastructure',
    description: 'Asset register standardization, spatial hierarchy taxonomy, and the 5-step AI readiness pathway.',
    imageSrc: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
    readingTime: '8 min read',
  },
  {
    title: 'AI Governance, Security & OT Safeguards',
    href: '/resources/ai-in-facilities-management/ai-governance',
    category: 'Risk & Cybersecurity',
    description: 'Air-gapping life-safety building plant, cryptographic audit logging, and human-in-the-loop permission matrices.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-1200w.webp',
    readingTime: '9 min read',
  },
  {
    title: 'Autonomous AI Agents in FM',
    href: '/resources/ai-in-facilities-management/ai-agents',
    category: 'Automation',
    description: 'Multi-step autonomous agents for contractor accreditation chasing, invoice reconciliation, and schedule leveling.',
    imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
    readingTime: '10 min read',
  },
];

const PAGE_SECTIONS = [
  { id: 'summary', number: '01', label: 'Executive Summary' },
  { id: 'landscape', number: '02', label: 'Technology Landscape' },
  { id: 'telemetry', number: '03', label: 'Plant Telemetry' },
  { id: 'workflow', number: '04', label: 'Work Order Workflow' },
  { id: 'matrix', number: '05', label: 'Discipline Matrix' },
  { id: 'architecture', number: '06', label: 'CAFM Architecture' },
  { id: 'boundary', number: '07', label: 'Human Boundary' },
  { id: 'roadmap', number: '08', label: 'Implementation Steps' },
  { id: 'guides', number: '09', label: 'Specialist Guides' },
];

export function TemplateAiPillar({ route, content }: TemplateAiPillarProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStepData = WORK_ORDER_STEPS.find(s => s.id === activeStep) || WORK_ORDER_STEPS[0];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'AI in Facilities Management', url: '/resources/ai-in-facilities-management' },
  ];

  return (
    <div className="bg-[#080e18] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <Header solid />
      <main id="main" className="flex-grow">
        {/* 1. EDITORIAL RESOURCE HERO */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category="AI &amp; Engineering Intelligence"
          categoryHref="/resources"
          title="AI in Facilities Management: Practical Engineering &amp; Operational Reality"
          intro="A comprehensive, engineering-led examination of artificial intelligence in commercial estate management — moving beyond software vendor hype into real-world plant telemetry, CAFM automation, and statutory compliance."
          readingTime="14 min read"
          technicalTier="Level 3 · Strategy &amp; Engineering"
          audience="Estates Directors, Commercial Landlords &amp; Operations Teams"
          standard="2026 Authoritative Standard"
          visualType="telemetry"
          systemMetrics={[
            { label: 'BMS Telemetry Protocol', value: 'BACnet / Modbus TCP', status: 'normal' },
            { label: 'EntireCAFM Dispatch Bus', value: 'Zero-Latency Event Stream', status: 'active' },
            { label: 'OT Safety Guardrail', value: 'Air-Gapped Life Safety', status: 'normal' },
          ]}
        />

        {/* 2. TRUST & ACCREDITATION STRIP */}
        <TrustBar />

        {/* 3. MAIN CONTENT CONTAINER WITH STICKY NAVIGATION */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex gap-12 items-start">
            {/* Sticky Desktop Navigation Rail */}
            <ResourceSectionNav sections={PAGE_SECTIONS} />

            {/* Main Reading Flow */}
            <div className="flex-1 min-w-0 space-y-16">
              {/* SECTION 01: EXECUTIVE SUMMARY */}
              <section id="summary" className="scroll-mt-32">
                <ExecutiveSummary
                  title="Executive Summary: The Practical State of AI in FM"
                  badge="2026 Briefing"
                  takeaways={[
                    'Artificial intelligence in facilities management is not about replacing mechanical engineers — it is about accelerating triage, extracting signal from sensor telemetry, and eliminating administrative drag.',
                    'Statutory compliance (Gas Safe, LOLER, EICR, Fire Safety) remains an immutable legal responsibility that requires certified, licensed human engineer execution on site.',
                    'The highest financial returns from AI stem from three operational areas: condition-based predictive maintenance on critical chillers/pumps, automated helpdesk triage with spatial CAFM mapping, and BMS deadband energy optimization.',
                    'AI without structured asset data fails. Establishing clean asset hierarchies and SFG20 task coding is the prerequisite for any automated intelligence deployment.',
                  ]}
                  statutoryReference="Building Safety Act 2022 · BS 7671 · ACOP L8 · SFG20 Task Library"
                  operationalOutcome="15–25% reduction in reactive emergency callouts · 12–18% HVAC energy demand reduction"
                />
              </section>

              {/* SECTION 02: TECHNOLOGY LANDSCAPE SPECTRUM */}
              <section id="landscape" className="scroll-mt-32 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
                    Technology Demystification
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-white mb-3">
                    What AI Actually Means in Building Operations
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Software vendors frequently market standard database searches or basic calendar reminders as "AI". To make informed procurement decisions, property leaders must distinguish established mathematical modeling from generative language tools and specialist spatial systems.
                  </p>
                </div>

                {/* Visual Technology Spectrum */}
                <div className="space-y-3 pt-2">
                  {AI_TECHNOLOGIES_SPECTRUM.map((tech, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border ${tech.accent} transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-500" />
                          <h3 className="font-light text-base text-white">{tech.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                            {tech.category}
                          </span>
                          <span className="text-[10px] font-mono font-light text-pink-300">
                            {tech.maturityTier}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                        {tech.description}
                      </p>
                      <div className="text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="text-slate-500">FM Target Assets:</span> <strong className="text-slate-200 font-normal">{tech.application}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 03: REAL-WORLD ENGINEERING VISUAL BREAK */}
              <section id="telemetry" className="scroll-mt-32">
                <AnnotatedTechnicalImage
                  imageSrc="/images/editorial/entirefm-hvac-rooftop-condensers-1920w.webp"
                  imageAlt="EntireFM engineers inspecting commercial rooftop chiller and condenser plant with live telemetry overlay"
                  caption="Primary Commercial Chiller Plant (450kW) — Vibration velocity and thermodynamic delta-T telemetry nodes attached to EntireCAFM event bus."
                />
              </section>

              {/* SECTION 04: FLAGSHIP INTERACTIVE WORK ORDER WALKTHROUGH */}
              <section id="workflow" className="scroll-mt-32 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
                    Flagship Interactive Simulation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-white mb-3">
                    The AI-Enabled Work Order: Request to Resolution
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Step through an end-to-end commercial building fault journey to see how NLP triage, spatial CAFM mapping, BMS telemetry, mandatory human engineering checkpoints, and post-resolution pattern intelligence operate in harmony.
                  </p>
                </div>

                {/* Step Selector Horizontal Strip */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex overflow-x-auto gap-1.5 scrollbar-none">
                  {WORK_ORDER_STEPS.map((step) => {
                    const isSelected = activeStep === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`flex-1 min-w-[130px] p-2.5 rounded-lg text-left transition-all text-xs font-mono ${
                          isSelected
                            ? 'bg-pink-950 text-pink-300 border border-pink-500/50 shadow-md font-light'
                            : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className={`block text-[10px] ${isSelected ? 'text-pink-400' : 'text-slate-500'}`}>
                          Step 0{step.id}
                        </span>
                        <span className="truncate block mt-0.5">{step.actor}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Showcase Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-mono font-light text-pink-400 uppercase tracking-widest block">
                        {currentStepData.stage}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extralight text-white mt-1">
                        {currentStepData.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Executing Actor:</span>
                      <span className={`text-xs font-mono font-light px-2.5 py-1 rounded border uppercase ${
                        currentStepData.actorType === 'ai'
                          ? 'bg-pink-950 text-pink-300 border-pink-700'
                          : currentStepData.actorType === 'checkpoint'
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : currentStepData.actorType === 'human'
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {currentStepData.actor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                      {currentStepData.description}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
                      <strong>Technical Mechanism:</strong> {currentStepData.detail}
                    </p>
                  </div>

                  {currentStepData.checkpoint && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 flex items-start gap-3 text-amber-200 text-xs font-mono">
                      <HardHat className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{currentStepData.checkpoint}</span>
                    </div>
                  )}

                  {currentStepData.systemData && currentStepData.systemData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {currentStepData.systemData.map((d, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                          <span className="text-slate-500 block text-[10px] uppercase">{d.label}</span>
                          <span className="text-pink-300 font-light mt-0.5 block">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                      disabled={activeStep === 1}
                      className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      &larr; Previous Stage
                    </button>
                    <span className="text-xs font-mono text-slate-500">
                      Step {activeStep} of {WORK_ORDER_STEPS.length}
                    </span>
                    <button
                      onClick={() => setActiveStep(Math.min(WORK_ORDER_STEPS.length, activeStep + 1))}
                      disabled={activeStep === WORK_ORDER_STEPS.length}
                      className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-500 text-xs font-mono font-light text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Next Stage &rarr;
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 05: CAPABILITY MATRIX */}
              <section id="matrix" className="scroll-mt-32">
                <CapabilityMatrix />
              </section>

              {/* SECTION 06: CAFM LAYERED ARCHITECTURE */}
              <section id="architecture" className="scroll-mt-32">
                <CafmLayeredArchitecture />
              </section>

              {/* SECTION 07: HUMAN VS AI BOUNDARY */}
              <section id="boundary" className="scroll-mt-32">
                <ComparisonVisual
                  type="ai-vs-human"
                  title="The Operational Division of Responsibility"
                  subtitle="Defining the immutable boundary between algorithmic triage speed and mandatory on-site certified engineering execution."
                />
              </section>

              {/* SECTION 08: 5-STEP IMPLEMENTATION ROADMAP */}
              <section id="roadmap" className="scroll-mt-32 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
                    Pragmatic Deployment Pathway
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-white mb-3">
                    The 5-Step FM AI Readiness Roadmap
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Deploying artificial intelligence in property operations requires sequential foundations. Attempting predictive algorithms on disorganized asset registers yields false alarms and wasted engineer hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { num: '01', title: 'Asset Data Cleanse', desc: 'Standardize asset taxonomy, tag primary plant, and align maintenance tasks to SFG20 specifications.' },
                    { num: '02', title: 'Helpdesk Normalization', desc: 'Implement structured intake forms and train NLP models on historical ticket categories.' },
                    { num: '03', title: 'Targeted IoT Sensors', desc: 'Deploy high-frequency vibration and temperature telemetry on high-criticality primary plant only.' },
                    { num: '04', title: 'Document Digitization', desc: 'Convert legacy PDF certificates (Gas, EICR, LOLER) into structured searchable compliance data.' },
                    { num: '05', title: 'Governance & Audits', desc: 'Establish air-gapped OT controls and define human-in-the-loop sign-off matrices.' },
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-lg font-mono font-light text-pink-400 block mb-2">{step.num}</span>
                        <h4 className="text-xs font-normal text-white mb-2 leading-snug">{step.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 09: SPECIALIST SUPPORTING GUIDES */}
              <section id="guides" className="scroll-mt-32">
                <RelatedResourceGrid
                  eyebrow="Specialist Technical Guides"
                  title="Explore the Complete FM AI Knowledge Series"
                  intro="In-depth architectural guides detailing specific applications of machine learning, condition monitoring, and CAFM engineering."
                  resources={SUPPORTING_GUIDES}
                />
              </section>
            </div>
          </div>
        </div>

        {/* 4. CONVERSION & PROPOSAL SECTION */}
        <ProposalSection
          headline="Discuss an AI-Enabled Maintenance Contract for Your Estate"
          subheadline="Speak directly with our technical operations team about deploying EntireCAFM, condition monitoring, and planned preventative maintenance across your commercial property portfolio."
        />

        {/* 5. NEWSLETTER SIGNUP */}
        <NewsletterSignupSection />
      </main>
      <Footer />
    </div>
  );
}
