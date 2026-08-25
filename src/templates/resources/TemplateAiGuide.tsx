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
import { CheckCircle2, ArrowRight, ShieldCheck, Cpu, Wrench, HardHat, FileText, Layers, Search, AlertTriangle } from 'lucide-react';

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
    description: 'Condition-based monitoring, IoT vibration sensors, BMS telemetry, and PPM optimization.',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
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
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-1200w.webp',
  },
  {
    pathKey: 'ai-agents',
    title: 'Autonomous AI Agents in FM',
    href: '/resources/ai-in-facilities-management/ai-agents',
    category: 'Automation',
    description: 'Multi-step autonomous agents for contractor accreditation chasing, invoice reconciliation, and schedule leveling.',
    imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
  },
];

export function TemplateAiGuide({ route, content }: TemplateAiGuideProps) {
  const path = route.path;

  // Identify specific guide
  const isPredictive = path.includes('predictive-maintenance');
  const isHelpdesk = path.includes('ai-helpdesk-work-orders');
  const isCafm = path.includes('ai-cafm');
  const isEnergy = path.includes('energy-optimisation');
  const isDigitalTwins = path.includes('digital-twins');
  const isAgents = path.includes('ai-agents');
  const isVision = path.includes('computer-vision');
  const isCompliance = path.includes('ai-compliance');
  const isData = path.includes('fm-data-readiness');
  const isGovernance = path.includes('ai-governance');

  const currentPathSegment = path.split('/').pop() || '';
  const relatedGuides = ALL_OTHER_GUIDES.filter(g => !path.includes(g.pathKey)).slice(0, 3);

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'AI in FM', url: '/resources/ai-in-facilities-management' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="bg-[#080e18] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      <Header solid />
      <main id="main" className="flex-grow">
        {/* 1. RESOURCE HERO WITH EDITORIAL SPLIT */}
        <ResourceHero
          breadcrumbs={breadcrumbs}
          category={content.eyebrow || 'AI &amp; Engineering Intelligence'}
          categoryHref="/resources/ai-in-facilities-management"
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          readingTime="10 min read"
          technicalTier="Level 3 · Engineering &amp; Operations"
          audience="Estates Directors &amp; Operations Leads"
          standard="2026 Authoritative Standard"
        />

        {/* 2. TRUST STRIP */}
        <TrustBar />

        {/* 3. CORE ARTICLE FLOW */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* 3A. EXECUTIVE SUMMARY DIGEST */}
            <ExecutiveSummary
              title={`Key Takeaways: ${content.h1.split('—')[0] || content.h1}`}
              badge="Executive Briefing"
              takeaways={[
                content.heroIntro || 'Core operational methodology and practical engineering implementation.',
                'Implementation must maintain human safety gatekeepers and certified trade sign-off on site.',
                'Integration with EntireCAFM provides continuous digital audit trails for compliance reporting.',
              ]}
              statutoryReference="Building Safety Act 2022 · SFG20 Task Standards · BS 7671"
              operationalOutcome="Enhanced statutory compliance assurance · Measurable reduction in unforecasted reactive expenditure"
            />

            {/* 3B. TOPIC-SPECIFIC TECHNICAL VISUAL INTERRUPTIONS */}

            {/* TOPIC 1: PREDICTIVE MAINTENANCE */}
            {isPredictive && (
              <div className="space-y-12">
                <TelemetryChart
                  type="vibration-waveform"
                  title="Condition Monitoring Telemetry &amp; Anomaly Waveform"
                  subtitle="Illustrative high-frequency bearing vibration FFT trend: baseline normal vs harmonic deviation."
                  assetContext="Primary Rotating Plant: 450kW Water-Cooled Chiller (CH-01) · Piezoelectric Sensor RMS"
                />

                <ComparisonVisual
                  type="custom"
                  title="Preventative (PPM) vs Predictive (PdM) Maintenance"
                  subtitle="How calendar-based statutory maintenance interfaces with condition-based telemetry."
                  leftTitle="Planned Preventative (PPM)"
                  leftBadge="Calendar / Mandatory"
                  leftPoints={[
                    'Fixed calendar inspection intervals (e.g. Monthly, Quarterly, Annual)',
                    'Mandatory under UK statutory health & safety law (LOLER, Gas Safe, EICR)',
                    'Predictable fixed-cost contractual expenditure model',
                    'Maintains manufacturer baseline warranty compliance across all building plant',
                  ]}
                  rightTitle="Predictive Maintenance (PdM)"
                  rightBadge="Condition / Telemetry"
                  rightPoints={[
                    'Triggered by real-time sensor deviation (vibration, delta-T, current harmonic)',
                    'Focuses on high-value, high-consequence critical rotating plant',
                    'Exposes mechanical deterioration weeks before catastrophic failure',
                    'Eliminates unnecessary intrusive teardowns of healthy operating plant',
                  ]}
                />

                <EditorialImageBreak
                  layout="split-60-40"
                  imageSrc="/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp"
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

                {/* Natural Language Vector Search Simulation */}
                <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-pink-400 text-xs font-mono">
                      <Search className="w-4 h-4" />
                      <span>ENTIRECAFM VECTOR SEARCH DEMONSTRATION</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700">
                      LIVE NLP ENGINE
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs font-mono text-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-1">Natural Language Query:</span>
                    "Show all commercial chillers due F-Gas inspection in Q3 with outstanding remedial quotes over £500"
                  </div>

                  <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-mono space-y-2">
                    <span className="text-pink-400 font-light text-[11px] block">Query Execution Graph:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">1. Asset Filter</span>
                        <span className="text-slate-300">Category: HVAC Chiller (18 matched)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">2. Compliance Schedule</span>
                        <span className="text-slate-300">F-Gas Regulation Due: Jul–Sep 2026</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">3. Remedial Cross-Match</span>
                        <span className="text-slate-300">3 quotes flagged &gt; £500 (Total: £2,140)</span>
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
                <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light">
                      Spatial Data Architecture
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      BIM / CAFM HIERARCHY
                    </span>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                    <div className="text-pink-400 font-light">Estate: Commercial Portfolio North</div>
                    <div className="pl-4 text-slate-300">└ Site: Manchester City Tower</div>
                    <div className="pl-8 text-slate-400">└ Building: Block A (Commercial Offices)</div>
                    <div className="pl-12 text-slate-400">└ Level: Floor 04 (Executive Suite)</div>
                    <div className="pl-16 text-slate-400">└ Space: Plantroom L04-North</div>
                    <div className="pl-20 text-emerald-400 font-light">└ Asset: AHU-04-01 (Air Handling Unit)</div>
                    <div className="pl-24 text-slate-500">├ Sub-Component: Supply Fan Motor (7.5kW) [Telemetry: 1.2 mm/s]</div>
                    <div className="pl-24 text-slate-500">├ Sub-Component: Chilled Water Coil [BMS: Valve 45%]</div>
                    <div className="pl-24 text-slate-500">└ Sub-Component: Filter Bank G4 [Diff Pressure: 140 Pa]</div>
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
                  imageSrc="/images/editorial/entirefm-switchgear-inspection-1200w.webp"
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
                  imageSrc="/images/editorial/entirefm-site-arrival-2000w.webp"
                  imageAlt="EntireFM branded service van arriving on commercial site at dusk"
                  eyebrow="Supply Chain Coordination"
                  title="Automating Administrative Drag in Contractor Management"
                  description="Autonomous agents excel at repetitive, rules-based coordination: verifying supplier certifications, checking rate cards against purchase orders, and alerting contract managers to emerging supply chain bottlenecks."
                  technicalCaption="On-Site Contractor Management — Streamlined via automated CAFM compliance checking."
                />
              </div>
            )}

            {/* 3C. CORE ARTICLE EDITORIAL SECTIONS (PRESERVED CONTENT) */}
            <div className="space-y-10 pt-8 border-t border-slate-800">
              {(content.sections || []).map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extralight text-white tracking-tight">
                    {sec.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                    {sec.body}
                  </p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2.5 pt-2">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* 3D. RELATED GUIDES CROSS-LINKING */}
            <RelatedResourceGrid
              eyebrow="Supporting Research"
              title="Related Engineering &amp; Technology Guides"
              intro="Continue exploring EntireFM's technical research and facilities management operational frameworks."
              resources={relatedGuides}
            />
          </div>
        </div>

        {/* 4. CONVERSION PROPOSAL SECTION */}
        <ProposalSection
          headline="Discuss Technical Facilities Management for Your Property Portfolio"
          subheadline="Speak with our engineering and operations team about deploying structured planned maintenance, EntireCAFM software, and statutory compliance management across your buildings."
        />

        {/* 5. NEWSLETTER */}
        <NewsletterSignupSection />
      </main>
      <Footer />
    </div>
  );
}
