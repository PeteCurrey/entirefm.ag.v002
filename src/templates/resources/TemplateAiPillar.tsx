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
import { ProcessFlow, CafmLayeredArchitecture } from '@/components/resources/TechnicalDiagram';
import { ComparisonVisual } from '@/components/resources/ComparisonVisual';
import { CapabilityMatrix } from '@/components/resources/CapabilityMatrix';
import { ExecutiveSummary } from '@/components/resources/ExecutiveSummary';
import { AnnotatedTechnicalImage } from '@/components/resources/AnnotatedTechnicalImage';
import { RelatedResourceGrid } from '@/components/resources/RelatedResourceGrid';
import { ArrowRight, HardHat, ShieldCheck } from 'lucide-react';

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
    maturityTier: 'High (Production)',
    category: 'Telemetry & Vibration',
    description: 'Time-series mathematical forecasting and FFT harmonic vibration analysis identifying equipment degradation before physical failure occurs.',
    application: 'Chiller compressors, AHU supply fans, primary heating pumps, and condenser banks.',
    accent: 'border-emerald-500/40 bg-brand-carbon text-emerald-300',
  },
  {
    name: 'Natural Language Processing (NLP / LLMs)',
    maturityTier: 'High (Production)',
    category: 'Helpdesk & Documents',
    description: 'Extracting structured trade categories, room coordinates, and SLA urgency tags from raw occupant emails and PDF inspection logs.',
    application: 'Helpdesk triage, spatial CAFM mapping, and contractor certificate OCR ingestion.',
    accent: 'border-blue-500/40 bg-brand-carbon text-blue-300',
  },
  {
    name: 'Computer Vision & Thermography',
    maturityTier: 'Active Operational',
    category: 'Visual & Radiometric',
    description: 'Convolutional neural networks analyzing drone photogrammetry, facade imagery, and switchgear thermal scans for defect hotspots.',
    application: 'Roof leak mapping, cladding inspections, and electrical distribution hotspot detection.',
    accent: 'border-brand-pink/40 bg-brand-carbon text-brand-pink',
  },
  {
    name: 'Autonomous Task Agents',
    maturityTier: 'Human-in-the-Loop Supervised',
    category: 'Workflow Automation',
    description: 'Chained algorithmic agents executing multi-step administrative tasks like contractor insurance chasing and SLA countdown monitoring.',
    application: 'Supply-chain compliance chasing, invoice matching, and PPM schedule auto-levelling.',
    accent: 'border-amber-500/40 bg-brand-carbon text-amber-300',
  },
  {
    name: 'Digital Twins & Dynamic BIM',
    maturityTier: 'Specialist Capital Estates',
    category: 'Spatial & Telemetry',
    description: 'Real-time 3D spatial models unifying static BIM geometry with live IoT sensor telemetry and historical maintenance work orders.',
    application: 'Complex hospital campuses, mission-critical datacentres, and multi-tenant headquarters.',
    accent: 'border-purple-500/40 bg-brand-carbon text-purple-300',
  },
];

const SUPPORTING_GUIDES = [
  {
    title: 'AI Predictive Maintenance Guide',
    href: '/resources/ai-in-facilities-management/predictive-maintenance',
    category: 'Condition Monitoring',
    description: 'Condition-based monitoring, IoT vibration sensors, BMS telemetry, and PPM optimization across commercial chillers and pumps.',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
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
    description: 'Automated certificate OCR ingestion, EICR C1/C2 defect extraction, and contemporaneous digital statutory logbooks.',
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
    category: 'Cybersecurity & OT',
    description: 'Operational risk assessment, building automation firewalling, and human-in-the-loop controls.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    readingTime: '11 min read',
  },
  {
    title: 'Autonomous AI Agents in FM',
    href: '/resources/ai-in-facilities-management/ai-agents',
    category: 'Automation',
    description: 'Multi-step autonomous agents for contractor accreditation chasing, invoice reconciliation, and schedule leveling.',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
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
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. EDITORIAL RESOURCE HERO (85svh) */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category="AI &amp; Engineering Intelligence"
          categoryHref="/resources"
          title="AI in Facilities Management: Practical Engineering &amp; Operational Reality"
          intro="A comprehensive, engineering-led examination of artificial intelligence in commercial estate management — moving beyond software vendor hype into real-world plant telemetry, CAFM automation, and statutory compliance."
          readingTime="14 min read"
          technicalTier="Level 3 · Strategic Intelligence"
          audience="Estates Directors, Commercial Landlords &amp; Operations Teams"
          standard="UK Statutory &amp; SFG20 Standards"
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
        />

        <TrustBar />

        {/* 2. MAIN CONTENT WITH STICKY NAVIGATION */}
        <div className="container-custom py-20">
          <div className="flex gap-12 items-start">
            {/* Sticky Navigation */}
            <ResourceSectionNav sections={PAGE_SECTIONS} />

            {/* Main Column */}
            <div className="flex-1 min-w-0 space-y-20">
              
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
                  operationalOutcome="Targeted reduction in reactive emergency callouts through early bearing wear detection and optimized HVAC deadbands"
                />
              </section>

              {/* SECTION 02: TECHNOLOGY LANDSCAPE */}
              <section id="landscape" className="scroll-mt-32 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-pink" />
                    <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                      Technology Demystification
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                    What AI Actually Means in Building Operations
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Software vendors frequently market standard database searches or basic calendar reminders as "AI". To make informed procurement decisions, property leaders must distinguish established mathematical modeling from generative language tools and specialist spatial systems.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {AI_TECHNOLOGIES_SPECTRUM.map((tech, idx) => (
                    <div
                      key={idx}
                      className={`p-6 sm:p-8 rounded-sm border ${tech.accent} space-y-3 shadow-sm`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-brand-pink" />
                          <h3 className="font-light text-lg text-white">{tech.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-medium px-2.5 py-0.5 rounded-sm bg-black/40 border border-white/10 text-slate-300">
                            {tech.category}
                          </span>
                          <span className="text-[10px] uppercase font-medium px-2.5 py-0.5 rounded-sm bg-brand-pink/10 border border-brand-pink/30 text-brand-pink">
                            {tech.maturityTier}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {tech.description}
                      </p>
                      <div className="text-xs text-slate-400 pt-3 border-t border-brand-edge-dark font-light">
                        <span className="text-slate-400 font-medium">Target Assets: </span>
                        <span className="text-slate-200">{tech.application}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 03: PLANT TELEMETRY OVERLAY */}
              <section id="telemetry" className="scroll-mt-32">
                <AnnotatedTechnicalImage
                  imageSrc="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
                  imageAlt="EntireFM engineers inspecting commercial rooftop chiller and condenser plant with live telemetry overlay"
                  caption="Primary Commercial Chiller Plant (450kW) — Vibration velocity and thermodynamic delta-T telemetry nodes attached to EntireCAFM event bus."
                />
              </section>

              {/* SECTION 04: WORK ORDER WORKFLOW */}
              <section id="workflow" className="scroll-mt-32 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-pink" />
                    <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                      Operational Architecture
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                    The AI-Enabled Work Order: Request to Resolution
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Step through an end-to-end commercial building fault journey to see how NLP triage, spatial CAFM mapping, BMS telemetry, mandatory human engineering checkpoints, and post-resolution pattern intelligence operate in harmony.
                  </p>
                </div>

                {/* Step Selector Horizontal Strip */}
                <div className="p-2 rounded-sm bg-brand-carbon border border-brand-edge-dark flex overflow-x-auto gap-2 scrollbar-none">
                  {WORK_ORDER_STEPS.map((step) => {
                    const isSelected = activeStep === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`flex-1 min-w-[140px] p-3 rounded-sm text-left transition-all text-xs ${
                          isSelected
                            ? 'bg-brand-pink text-white font-medium shadow-elevated'
                            : 'bg-black/30 text-slate-300 hover:bg-white/10 hover:text-white font-light'
                        }`}
                      >
                        <span className={`block text-[10px] uppercase ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          Step 0{step.id}
                        </span>
                        <span className="truncate block mt-0.5">{step.actor}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Card */}
                <div className="p-8 sm:p-10 rounded-sm bg-brand-carbon border border-brand-edge-dark shadow-elevated space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-edge-dark pb-6">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-brand-pink uppercase tracking-widest block">
                        {currentStepData.stage}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white">
                        {currentStepData.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-light">Actor:</span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-sm border uppercase tracking-wider ${
                        currentStepData.actorType === 'ai'
                          ? 'bg-brand-pink/10 text-brand-pink border-brand-pink/30'
                          : currentStepData.actorType === 'checkpoint'
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : currentStepData.actorType === 'human'
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : 'bg-white/10 text-slate-300 border-white/15'
                      }`}>
                        {currentStepData.actor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-base text-slate-200 leading-relaxed font-light">
                      {currentStepData.description}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/40 p-4 rounded-sm border border-brand-edge-dark font-light">
                      <strong className="text-white font-medium">Technical Mechanism: </strong>{currentStepData.detail}
                    </p>
                  </div>

                  {currentStepData.checkpoint && (
                    <div className="p-4 rounded-sm bg-amber-950/30 border border-amber-500/50 flex items-start gap-3 text-amber-200 text-xs font-light">
                      <HardHat className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{currentStepData.checkpoint}</span>
                    </div>
                  )}

                  {currentStepData.systemData && currentStepData.systemData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {currentStepData.systemData.map((d, idx) => (
                        <div key={idx} className="p-3.5 rounded-sm bg-black/40 border border-brand-edge-dark text-xs">
                          <span className="text-slate-400 block text-[10px] uppercase font-medium">{d.label}</span>
                          <span className="text-brand-pink font-light mt-0.5 block">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-brand-edge-dark text-xs">
                    <button
                      onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                      disabled={activeStep === 1}
                      className="px-4 py-2.5 rounded-sm bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none font-medium"
                    >
                      &larr; Previous Stage
                    </button>
                    <span className="text-slate-400 font-light">
                      Step {activeStep} of {WORK_ORDER_STEPS.length}
                    </span>
                    <button
                      onClick={() => setActiveStep(Math.min(WORK_ORDER_STEPS.length, activeStep + 1))}
                      disabled={activeStep === WORK_ORDER_STEPS.length}
                      className="px-4 py-2.5 rounded-sm bg-brand-pink hover:bg-brand-pink/90 text-white font-medium disabled:opacity-30 disabled:pointer-events-none"
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

              {/* SECTION 06: CAFM ARCHITECTURE */}
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

              {/* SECTION 08: IMPLEMENTATION ROADMAP */}
              <section id="roadmap" className="scroll-mt-32 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-pink" />
                    <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                      Pragmatic Deployment Pathway
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                    The 5-Step FM AI Readiness Roadmap
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    Deploying artificial intelligence in property operations requires sequential foundations. Attempting predictive algorithms on disorganized asset registers yields false alarms and wasted engineer hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { num: '01', title: 'Asset Data Cleanse', desc: 'Standardize asset taxonomy, tag primary plant, and align maintenance tasks to SFG20 specifications.' },
                    { num: '02', title: 'Helpdesk Normalization', desc: 'Implement structured intake forms and train NLP models on historical ticket categories.' },
                    { num: '03', title: 'Targeted IoT Sensors', desc: 'Deploy high-frequency vibration and temperature telemetry on high-criticality primary plant only.' },
                    { num: '04', title: 'Document Digitization', desc: 'Convert legacy PDF certificates (Gas, EICR, LOLER) into structured searchable compliance data.' },
                    { num: '05', title: 'Governance & Audits', desc: 'Establish air-gapped OT controls and define human-in-the-loop sign-off matrices.' },
                  ].map((step, idx) => (
                    <div key={idx} className="p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xl font-extralight text-brand-pink block mb-2">{step.num}</span>
                        <h4 className="text-base font-light text-white mb-2 leading-snug">{step.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 09: SPECIALIST GUIDES */}
              <section id="guides" className="scroll-mt-32">
                <RelatedResourceGrid
                  eyebrow="Specialist Technical Series"
                  title="Explore the Complete FM AI Knowledge Series"
                  intro="In-depth architectural guides detailing specific applications of machine learning, condition monitoring, and CAFM engineering."
                  resources={SUPPORTING_GUIDES}
                />
              </section>

            </div>
          </div>
        </div>

        <ProposalSection
          headline="Discuss an AI-Enabled Maintenance Contract for Your Estate"
          subheadline="Speak directly with our technical operations team about deploying EntireCAFM, condition monitoring, and planned preventative maintenance across your commercial property portfolio."
        />
        <NewsletterSignupSection />
      </main>

      <Footer />
    </div>
  );
}
