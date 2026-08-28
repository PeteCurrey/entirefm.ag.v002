'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { ResourceHero } from '@/components/resources/ResourceHero';
import { EditorialImageBreak } from '@/components/resources/EditorialImageBreak';
import { ProcessFlow, CafmLayeredArchitecture } from '@/components/resources/TechnicalDiagram';
import { TelemetryChart } from '@/components/resources/TelemetryChart';
import { ComparisonVisual } from '@/components/resources/ComparisonVisual';
import { ExecutiveSummary } from '@/components/resources/ExecutiveSummary';
import { RelatedResourceGrid } from '@/components/resources/RelatedResourceGrid';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';

interface TemplateAiGuideProps {
  route: RouteRecord;
  content: ContentRecord;
}

const ALL_OTHER_GUIDES = [
  {
    pathKey: 'predictive-maintenance',
    title: 'AI Predictive Maintenance Guide',
    href: '/resources/ai-in-facilities-management/predictive-maintenance',
    category: 'Condition Monitoring',
    description: 'Condition-based monitoring, IoT vibration sensors, BMS telemetry, and PPM optimization across commercial chillers and pumps.',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
  },
  {
    pathKey: 'ai-cafm',
    title: 'AI and Next-Gen CAFM Software',
    href: '/resources/ai-in-facilities-management/ai-cafm',
    category: 'Software & Data',
    description: 'Vector asset search, automated scheduling, predictive SLA risk scoring, and EntireCAFM technology.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
  },
  {
    pathKey: 'ai-helpdesk-work-orders',
    title: 'AI in the FM Helpdesk & Work Orders',
    href: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    category: 'Helpdesk & Triage',
    description: 'Natural language ticket triage, spatial asset mapping, automated dispatch and human safety safeguards.',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-1200w.webp',
  },
  {
    pathKey: 'energy-optimisation',
    title: 'Energy Optimisation via AI & BMS',
    href: '/resources/ai-in-facilities-management/energy-optimisation',
    category: 'Energy & Sustainability',
    description: 'Dynamic BMS setpoint tuning, weather degree-day forecasting, and occupancy-driven deadband widening.',
    imageSrc: '/images/editorial/entirefm-hvac-plant-deck-1200w.webp',
  },
  {
    pathKey: 'digital-twins',
    title: 'Digital Twins in Building Management',
    href: '/resources/ai-in-facilities-management/digital-twins',
    category: 'Spatial Technology',
    description: 'Spatial hierarchy, real-time telemetry binding, and BIM integration across commercial estates.',
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
  },
  {
    pathKey: 'computer-vision',
    title: 'Computer Vision & Thermal Inspections',
    href: '/resources/ai-in-facilities-management/computer-vision',
    category: 'Visual Inspection',
    description: 'Radiometric infrared thermography, drone facade surveys, and automated electrical switchgear defect tagging.',
    imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-1200w.webp',
  },
  {
    pathKey: 'ai-compliance',
    title: 'AI in Statutory Compliance & Auditing',
    href: '/resources/ai-in-facilities-management/ai-compliance',
    category: 'Compliance & Safety',
    description: 'Automated certificate OCR ingestion, EICR C1/C2 defect extraction, and 100% audit-ready digital logbooks.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
  },
  {
    pathKey: 'fm-data-readiness',
    title: 'Is Your FM Data Ready for AI?',
    href: '/resources/ai-in-facilities-management/fm-data-readiness',
    category: 'Data Infrastructure',
    description: 'Asset register standardization, spatial hierarchy taxonomy, and the 5-step AI readiness pathway.',
    imageSrc: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
  },
  {
    pathKey: 'ai-governance',
    title: 'AI Governance, Security & OT Safeguards',
    href: '/resources/ai-in-facilities-management/ai-governance',
    category: 'Risk & Cybersecurity',
    description: 'Air-gapping life-safety building plant, cryptographic audit logging, and human-in-the-loop permission matrices.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
  },
  {
    pathKey: 'ai-agents',
    title: 'Autonomous AI Agents in FM',
    href: '/resources/ai-in-facilities-management/ai-agents',
    category: 'Automation',
    description: 'Multi-step autonomous agents for contractor accreditation chasing, invoice reconciliation, and schedule leveling.',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
  },
];

export function TemplateAiGuide({ route, content }: TemplateAiGuideProps) {
  const path = route.path;
  const currentSlug = path.split('/').pop() || '';

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
    { name: content.title, url: route.path },
  ];

  const relatedGuides = ALL_OTHER_GUIDES.filter((g) => g.pathKey !== currentSlug).slice(0, 3);

  // Topic specific flags
  const isPredictive = currentSlug === 'predictive-maintenance';
  const isCafm = currentSlug === 'ai-cafm';
  const isHelpdesk = currentSlug === 'ai-helpdesk-work-orders';
  const isEnergy = currentSlug === 'energy-optimisation';
  const isDigitalTwins = currentSlug === 'digital-twins';
  const isVision = currentSlug === 'computer-vision';
  const isCompliance = currentSlug === 'ai-compliance';
  const isData = currentSlug === 'fm-data-readiness';
  const isGovernance = currentSlug === 'ai-governance';
  const isAgents = currentSlug === 'ai-agents';

  return (
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. RESOURCE HERO (85svh) */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category="AI in Facilities Management Series"
          categoryHref="/resources/ai-in-facilities-management"
          title={content.h1 || content.title}
          intro={content.heroIntro || content.metaDescription}
          readingTime="10 min read"
          technicalTier="Level 3 · Practical Engineering"
          audience="Property Directors, Facilities Managers &amp; Engineers"
          standard="UK Statutory &amp; SFG20 Standards"
          imageSrc={
            isPredictive
              ? '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp'
              : isDigitalTwins
              ? '/images/editorial/entirefm-switchroom-survey-2000w.webp'
              : '/images/editorial/entirefm-client-review-2000w.webp'
          }
        />

        <TrustBar />

        {/* 2. MAIN TECHNICAL BODY */}
        <div className="container-custom py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* TOPIC 1: PREDICTIVE MAINTENANCE */}
            {isPredictive && (
              <div className="space-y-12">
                <TelemetryChart
                  type="vibration-waveform"
                  title="Vibration Harmonic Analysis &amp; Bearing Wear Telemetry"
                  subtitle="How continuous high-frequency vibration tracking identifies mechanical degradation 4–6 weeks prior to thermal breakdown."
                  assetContext="Target Asset: Primary Rooftop Water Chiller (450kW) · Bearing Velocity RMS"
                />

                <ComparisonVisual
                  type="ppm-vs-pdm"
                  title="Calendar Planned Maintenance vs Predictive Condition Monitoring"
                  subtitle="Why combining statutory PPM compliance with real-time condition monitoring eliminates unexpected catastrophic plant failures."
                  leftTitle="Calendar PPM Only (SFG20 Base)"
                  leftBadge="Statutory Baseline"
                  leftPoints={[
                    'Fixed quarterly or bi-annual mechanical inspection intervals',
                    'Cannot detect sudden mechanical fatigue between service dates',
                    'Often replaces functional components prematurely based strictly on hours',
                    'Zero telemetry warning before sudden motor bearing seizure occurs',
                  ]}
                  rightTitle="PPM + Predictive Telemetry"
                  rightBadge="Condition Monitoring"
                  rightPoints={[
                    'Continuous 24/7 vibration, temperature, and current draw monitoring',
                    'Dynamic automated work-order generation when vibration exceeds ISO limits',
                    'Exposes mechanical deterioration weeks before catastrophic failure',
                    'Eliminates unnecessary intrusive teardowns of healthy operating plant',
                  ]}
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
                  imageAlt="EntireFM HVAC engineers inspecting commercial rooftop condenser and chiller plant"
                  eyebrow="Plant Criticality Framework"
                  title="Where Predictive Maintenance Makes Financial Sense"
                  description="Deploying IoT vibration sensors across low-cost run-to-failure assets (e.g. standard extraction fans) wastes capital. Condition-based monitoring should be strictly focused on primary chillers, main boiler circulation pumps, and high-occupancy AHUs where unforecasted downtime paralyzes operations."
                  technicalCaption="Rooftop Chiller Bank — Monitored via BACnet IP and vibration transducers."
                  assetId="ASSET: CH-01-ROOF"
                  telemetryTags={[
                    { label: 'Delta-T', value: '5.2°C Nominal' },
                    { label: 'Vibration', value: '1.1 mm/s' },
                  ]}
                />
              </div>
            )}

            {/* TOPIC 2: AI & CAFM */}
            {isCafm && (
              <div className="space-y-12">
                <CafmLayeredArchitecture />

                {/* Natural Language Vector Search Demonstration */}
                <div className="p-8 sm:p-10 bg-brand-carbon border border-brand-edge-dark rounded-sm space-y-4 font-sans">
                  <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
                    <div className="flex items-center gap-2 text-brand-pink text-xs uppercase tracking-wider font-medium">
                      <Search className="w-4 h-4" />
                      <span>EntireCAFM Natural Language Vector Search Engine</span>
                    </div>
                    <span className="text-[10px] uppercase font-medium px-2.5 py-1 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30">
                      Live NLP Query
                    </span>
                  </div>

                  <div className="p-4 bg-black/40 rounded-sm border border-white/10 text-sm text-slate-200 font-light">
                    <span className="text-slate-400 block text-xs uppercase font-medium mb-1">Natural Language Query:</span>
                    "Show all commercial chillers due F-Gas inspection in Q3 with outstanding remedial quotes over £500"
                  </div>

                  <div className="p-4 bg-black/30 rounded-sm border border-brand-edge-dark text-xs space-y-3 font-light">
                    <span className="text-brand-pink font-medium text-xs block uppercase tracking-wider">Query Execution Pipeline:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                        <span className="text-slate-400 block text-[10px] uppercase font-medium">1. Asset Filter</span>
                        <span className="text-slate-200">Category: HVAC Chiller (18 matched)</span>
                      </div>
                      <div className="p-3 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                        <span className="text-slate-400 block text-[10px] uppercase font-medium">2. Compliance Schedule</span>
                        <span className="text-slate-200">F-Gas Regulation Due: Jul–Sep 2026</span>
                      </div>
                      <div className="p-3 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                        <span className="text-slate-400 block text-[10px] uppercase font-medium">3. Remedial Cross-Match</span>
                        <span className="text-slate-200">3 quotes flagged &gt; £500 (Total: £2,140)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <EditorialImageBreak
                  layout="split-40-60"
                  imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
                  imageAlt="EntireFM operations manager reviewing EntireCAFM live KPI dashboards with commercial property client"
                  eyebrow="Commercial Transparency"
                  title="Transforming CAFM from Database to Copilot"
                  description="Legacy CAFM systems acted as passive data graveyards requiring hours of manual spreadsheet exports. EntireCAFM unifies live job dispatch, SLA countdowns, and automated compliance into an active operational intelligence hub."
                  technicalCaption="Client Operations Review — Real-time CAFM performance dashboard."
                />
              </div>
            )}

            {/* TOPIC 3: AI HELPDESK & WORK ORDERS */}
            {isHelpdesk && (
              <div className="space-y-12">
                <ProcessFlow
                  eyebrow="Helpdesk Evolution"
                  title="Traditional vs AI-Enabled Ticket Triage"
                  intro="How natural-language understanding and spatial asset correlation eliminate 4 minutes of dispatcher delay per work order."
                  steps={[
                    { number: '01', title: 'Tenant Intake', actor: 'Occupant', role: 'Tenant / Client', description: 'Free-text portal submission or email describing comfort issue.' },
                    { number: '02', title: 'NLP Extraction', actor: 'AI Model', role: 'AI / Model', description: 'Parses room, trade discipline, and SLA urgency in 200ms.', outputTag: 'HVAC / Priority 2' },
                    { number: '03', title: 'Asset Match', actor: 'CAFM DB', role: 'System / CAFM', description: 'Maps location to Fan Coil Unit tag and checks warranty.', outputTag: 'Asset: FCU-03-04' },
                    { number: '04', title: 'Human Gate', actor: 'Duty Mgr', role: 'Duty Manager', description: 'Coordinator verifies scope and authorizes dispatch.', checkpoint: true },
                  ]}
                />

                <TelemetryChart
                  type="sla-response-timeline"
                  title="Emergency Reactive Callout SLA Timeline"
                  subtitle="Minute-by-minute progression from tenant ticket logging to qualified engineer arrival on site."
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-engineers-office-testing-1200w.webp"
                  imageAlt="EntireFM certified mobile engineers equipped with digital CAFM tablets in commercial office"
                  eyebrow="Field Mobile Execution"
                  title="Direct Tablet Dispatch to Mobile Fleet"
                  description="Once scoped and approved, work orders route instantly to mobile technicians within the regional cluster. Technicians receive plant asset histories, building access codes, and digital sign-off protocols directly on their mobile devices."
                  technicalCaption="Mobile Engineering Team — Rapid response commercial dispatch."
                />
              </div>
            )}

            {/* TOPIC 4: ENERGY OPTIMISATION */}
            {isEnergy && (
              <div className="space-y-12">
                <TelemetryChart
                  type="bms-hvac-demand"
                  title="Dynamic BMS Multi-Variable Demand Analysis"
                  subtitle="Continuous tuning balancing ambient weather forecasts, floor occupancy, and chilled water valve demand."
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-hvac-plant-deck-1200w.webp"
                  imageAlt="Two EntireFM HVAC engineers walking a commercial rooftop plant deck between air handling units"
                  eyebrow="HVAC Mechanical Realities"
                  title="Eliminating Simultaneous Heating and Cooling"
                  description="One of the largest sources of energy waste in commercial buildings occurs when BMS controllers inadvertently call for perimeter heating while central AHUs are delivering maximum chilled cooling. AI pattern recognition detects and resolves valve conflicts automatically."
                  technicalCaption="Commercial Air Handling Units — Modulating damper and coil optimization."
                />
              </div>
            )}

            {/* TOPIC 5: DIGITAL TWINS */}
            {isDigitalTwins && (
              <div className="space-y-12">
                {/* Spatial Hierarchy Blueprint */}
                <div className="p-8 sm:p-10 bg-brand-carbon border border-brand-edge-dark rounded-sm space-y-4 font-sans">
                  <div className="flex items-center justify-between border-b border-brand-edge-dark pb-4">
                    <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                      Spatial Data Architecture
                    </span>
                    <span className="text-[10px] uppercase font-medium px-2.5 py-1 rounded-sm bg-black/40 border border-white/10 text-slate-300">
                      BIM / CAFM Spatial Hierarchy
                    </span>
                  </div>

                  <div className="p-6 bg-black/40 rounded-sm border border-brand-edge-dark text-xs sm:text-sm text-slate-300 space-y-2 font-light">
                    <div className="text-brand-pink font-medium">Estate: Commercial Portfolio North</div>
                    <div className="pl-4 text-slate-200">└ Site: Manchester City Tower</div>
                    <div className="pl-8 text-slate-300">└ Building: Block A (Commercial Offices)</div>
                    <div className="pl-12 text-slate-300">└ Level: Floor 04 (Executive Suite)</div>
                    <div className="pl-16 text-slate-400">└ Space: Plantroom L04-North</div>
                    <div className="pl-20 text-emerald-400 font-medium">└ Asset: AHU-04-01 (Air Handling Unit)</div>
                    <div className="pl-24 text-slate-400">├ Sub-Component: Supply Fan Motor (7.5kW) [Telemetry: 1.2 mm/s]</div>
                    <div className="pl-24 text-slate-400">├ Sub-Component: Chilled Water Coil [BMS: Valve 45%]</div>
                    <div className="pl-24 text-slate-400">└ Sub-Component: Filter Bank G4 [Diff Pressure: 140 Pa]</div>
                  </div>
                </div>

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
                  imageAlt="Two EntireFM engineers surveying plantroom switchgear and asset hierarchy tags"
                  eyebrow="Asset Ground Truth"
                  title="Why Spatial Accuracy Precedes Digital Twins"
                  description="A digital twin is only as useful as the underlying physical asset register. EntireFM conducts comprehensive on-site building surveys to barcode, tag, and spatially verify every primary and secondary asset before attaching live telemetry feeds."
                  technicalCaption="Plantroom Asset Tagging — Grounding digital twins in verified engineering reality."
                />
              </div>
            )}

            {/* TOPIC 6: COMPUTER VISION */}
            {isVision && (
              <div className="space-y-12">
                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-hvac-thermal-survey-1200w.webp"
                  imageAlt="EntireFM technician carrying out infrared thermography scan on commercial electrical switchgear and ductwork"
                  eyebrow="Radiometric Inspection"
                  title="Automated Defect Tagging via Computer Vision"
                  description="Infrared thermography scans of high-voltage distribution boards and ductwork expose thermal hotspots caused by loose electrical terminations or failing bearings. Convolutional neural networks automate anomaly detection across thousands of survey images."
                  technicalCaption="Thermal Imaging Survey — Switchgear and ductwork temperature delta inspection."
                  assetId="SURVEY: EICR-THERM-01"
                  telemetryTags={[
                    { label: 'Phase A Temp', value: '42.1°C' },
                    { label: 'Phase B Hotspot', value: '68.4°C (Anomaly)' },
                  ]}
                />
              </div>
            )}

            {/* TOPIC 7: AI COMPLIANCE */}
            {isCompliance && (
              <div className="space-y-12">
                <ProcessFlow
                  eyebrow="Document Intelligence"
                  title="Automated Statutory Certificate Ingestion"
                  intro="How PDF inspection reports convert into searchable compliance databases and automated remedial quotes."
                  steps={[
                    { number: '01', title: 'Certificate Upload', actor: 'Contractor', role: 'Human Engineer', description: 'Engineer uploads signed PDF inspection certificate (EICR, Gas, LOLER).' },
                    { number: '02', title: 'OCR Extraction', actor: 'AI OCR', role: 'AI / Model', description: 'Extracts inspection dates, re-test due dates, engineer accreditations, and defect codes.' },
                    { number: '03', title: 'Defect Parsing', actor: 'CAFM DB', role: 'System / CAFM', description: 'EICR C1/C2 defects auto-populate remedial work-order queue for quote generation.' },
                    { number: '04', title: 'Audit Seal', actor: 'Duty Mgr', role: 'Duty Manager', description: 'Verified record logged to immutable digital building logbook.', checkpoint: true },
                  ]}
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-distribution-board-testing-1200w.webp"
                  imageAlt="EntireFM certified electrical engineer conducting fixed wire testing on commercial distribution board"
                  eyebrow="100% Audit Readiness"
                  title="Eliminating Missed Statutory Deadlines"
                  description="Under the Building Safety Act 2022 and Health and Safety at Work Act 1974, commercial duty holders must demonstrate continuous compliance records. Automated document intelligence ensures expirations trigger proactive scheduling 60 days in advance."
                  technicalCaption="Fixed Wire Testing (EICR) — Statutory commercial electrical inspection."
                />
              </div>
            )}

            {/* TOPIC 8: FM DATA READINESS */}
            {isData && (
              <div className="space-y-12">
                <ComparisonVisual
                  type="custom"
                  title="Unstructured Legacy Data vs Standardised Hierarchy"
                  subtitle="Why clean taxonomy is the prerequisite for AI-enabled facilities management."
                  leftTitle="Unstructured Legacy Data (Fails AI)"
                  leftBadge="High Error Rate"
                  leftPoints={[
                    'Inconsistent naming: "AHU-1", "Main Air Handler", "Unit 01 North"',
                    'Vague spatial tags: "Floor 3 near toilets" without room codes',
                    'Missing manufacturer serials, model numbers, and commissioning dates',
                    'Reactive tickets filed with arbitrary free-text categories',
                  ]}
                  rightTitle="Standardised Asset Hierarchy (AI Ready)"
                  rightBadge="100% Deterministic"
                  rightPoints={[
                    'Structured taxonomy: SITE-MAN-01 / BLDG-A / L03 / AHU-001',
                    'Exact spatial coordinates linked to digital floorplans and room IDs',
                    'Complete asset attributes including electrical phase, refrigerant, and run-hours',
                    'Standardised SFG20 maintenance task codes attached to each asset',
                  ]}
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-corporate-corridor-1200w.webp"
                  imageAlt="Modern commercial corporate corridor with clear asset directory signage"
                  eyebrow="Data Foundations"
                  title="The 5-Step Asset Data Cleansing Protocol"
                  description="Before deploying predictive algorithms or automated dispatch, EntireFM executes an asset survey to audit physical plant, apply QR asset labels, and verify serial nameplates against single line diagrams."
                  technicalCaption="Asset Directory & Spatial Tagging — Foundations for automated CAFM workflows."
                />
              </div>
            )}

            {/* TOPIC 9: AI GOVERNANCE & SECURITY */}
            {isGovernance && (
              <div className="space-y-12">
                <ComparisonVisual
                  type="ai-vs-human"
                  title="Safety-Critical Control Boundaries"
                  subtitle="Air-gapping life-safety building plant while allowing algorithmic triage in non-critical workflows."
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-switchgear-inspection-2000w.webp"
                  imageAlt="Two EntireFM certified engineers inspecting high-voltage switchgear plant room"
                  eyebrow="Operational Safety"
                  title="Air-Gapping Life-Safety Infrastructure"
                  description="Primary fire detection, gas safety shut-off solenoids, emergency lighting circuits, and high-voltage switchgear must never be exposed to direct autonomous cloud control. Human certified engineers retain absolute physical gatekeeper authority."
                  technicalCaption="Commercial Plant Room Switchgear — Critical infrastructure protected by strict OT air-gaps."
                />
              </div>
            )}

            {/* TOPIC 10: AUTONOMOUS AI AGENTS */}
            {isAgents && (
              <div className="space-y-12">
                <ProcessFlow
                  eyebrow="Agentic Architecture"
                  title="Autonomous Multi-Step Execution Loop"
                  intro="How goal-directed software agents execute complex administrative tasks under human supervision."
                  steps={[
                    { number: '01', title: 'Goal Intake', actor: 'System', role: 'System / CAFM', description: 'Goal defined: Verify subcontractor insurance for Q3 work.' },
                    { number: '02', title: 'Database Check', actor: 'AI Agent', role: 'AI / Model', description: 'Agent inspects registry; flags 3 expiring public liability certs.' },
                    { number: '03', title: 'Supplier Chase', actor: 'AI Agent', role: 'AI / Model', description: 'Automated email chase with secure upload portal link sent.' },
                    { number: '04', title: 'Human Approval', actor: 'Compliance Lead', role: 'Duty Manager', description: 'Coordinator confirms renewed policy and unlocks contractor roster.', checkpoint: true },
                  ]}
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-external-distribution-dusk-2000w.webp"
                  imageAlt="EntireFM branded service van arriving on commercial site at dusk"
                  eyebrow="Supply Chain Coordination"
                  title="Automating Administrative Drag in Contractor Management"
                  description="Autonomous agents excel at repetitive, rules-based coordination: verifying supplier certifications, checking rate cards against purchase orders, and alerting contract managers to emerging supply chain bottlenecks."
                  technicalCaption="On-Site Contractor Management — Streamlined via automated CAFM compliance checking."
                />
              </div>
            )}

            {/* CORE ARTICLE EDITORIAL SECTIONS (PRESERVED CONTENT) */}
            <div className="space-y-12 pt-12 border-t border-brand-edge-dark">
              {(content.sections || []).map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                    Section 0{idx + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                    {sec.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                    {sec.body}
                  </p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2.5 pt-2">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* RELATED GUIDES CROSS-LINKING */}
            <RelatedResourceGrid
              eyebrow="Supporting Research"
              title="Related Engineering &amp; Technology Guides"
              intro="Continue exploring EntireFM's technical research and facilities management operational frameworks."
              resources={relatedGuides}
            />
          </div>
        </div>

        {/* CONVERSION PROPOSAL SECTION */}
        <ProposalSection
          headline="Discuss Technical Facilities Management for Your Property Portfolio"
          subheadline="Speak with our engineering and operations team about deploying structured planned maintenance, EntireCAFM software, and statutory compliance management across your buildings."
        />
        <NewsletterSignupSection />
      </main>

      <Footer />
    </div>
  );
}
