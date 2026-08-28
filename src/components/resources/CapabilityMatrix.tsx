'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Headset, Zap, ShieldCheck, Database, Lock } from 'lucide-react';

interface UseCaseCategory {
  id: string;
  name: string;
  shortName: string;
  iconName: 'wrench' | 'headset' | 'bolt' | 'shield' | 'server' | 'lock';
  headline: string;
  overview: string;
  technicalCapabilities: string[];
  operationalImpact: string;
  relatedGuideUrl: string;
  relatedGuideTitle: string;
  systemIntegration: string;
}

const MATRIX_DATA: UseCaseCategory[] = [
  {
    id: 'assets',
    name: 'Asset Engineering & Predictive Care',
    shortName: 'Assets & Plant',
    iconName: 'wrench',
    headline: 'Condition-Based Monitoring & Pre-Failure Intervention',
    overview: 'Transitioning primary mechanical, electrical, and HVAC assets from fixed calendar maintenance to dynamic telemetry-driven condition monitoring.',
    technicalCapabilities: [
      'High-frequency IoT vibration analysis on critical rotating chiller and pump bearings',
      'Continuous thermal delta (ΔT) tracking across heat exchangers and condenser banks',
      'Automated MTBF regression forecasting wear rates against ambient degree-days',
      'Early acoustic cavitation detection on primary booster sets and circulation loops',
    ],
    operationalImpact: 'Prevents catastrophic unforecasted plant shutdowns, mitigates out-of-hours emergency premium fees, and extends capital equipment operating lifespan by 15–25%.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/predictive-maintenance',
    relatedGuideTitle: 'Explore Predictive Maintenance Guide',
    systemIntegration: 'BACnet IP / MQTT / SFG20 Task Library',
  },
  {
    id: 'helpdesk',
    name: 'Helpdesk & Work-Order Orchestration',
    shortName: 'Helpdesk & Triage',
    iconName: 'headset',
    headline: 'Zero-Latency Intake, Entity Extraction & Geolocation Dispatch',
    overview: 'Automating the intake of unstructured emails and portal tickets into structured work orders matched to spatial hierarchies and certified engineer skill matrices.',
    technicalCapabilities: [
      'Natural-language parsing extracting trade category, urgency, and specific spatial room names',
      'Automated cluster deduplication merging multiple occupant reports of identical building events',
      'Real-time contractor accreditation checking (F-Gas, Gas Safe, NICEIC) prior to dispatch',
      'Dynamic SLA countdown tracking with predictive warning alerts prior to contract breach',
    ],
    operationalImpact: 'Reduces helpdesk ticket triage time from 4 minutes to under 8 seconds while eliminating misallocated contractor callout fees.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    relatedGuideTitle: 'Explore AI Helpdesk & Dispatch Guide',
    systemIntegration: 'REST Webhooks / WhatsApp API / CAFM Dispatch',
  },
  {
    id: 'energy',
    name: 'Energy & Environmental Optimization',
    shortName: 'Energy & BMS',
    iconName: 'bolt',
    headline: 'Dynamic BMS Deadband Tuning & Occupancy-Driven HVAC Control',
    overview: 'Continuous multi-variable optimization of building management systems, balancing occupancy sensors, external weather forecasts, and electricity tariff peaks.',
    technicalCapabilities: [
      'Automated detection of simultaneous heating and cooling valve conflicts across AHU zones',
      'Dynamic static-pressure and fan-speed optimization across VAV ventilation networks',
      'Degree-day forecasting pre-cooling or pre-heating buildings ahead of peak tariff windows',
      'Occupancy-driven deadband widening for vacant meeting suites and tenant floors',
    ],
    operationalImpact: 'Yields 12–18% verifiable HVAC electrical and gas consumption savings without compromising tenant comfort bounds.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/energy-optimisation',
    relatedGuideTitle: 'Explore Energy Optimization Guide',
    systemIntegration: 'Trend / Tridium Niagara / Modbus TCP',
  },
  {
    id: 'compliance',
    name: 'Statutory Compliance & Document Intelligence',
    shortName: 'Compliance & Auditing',
    iconName: 'shield',
    headline: 'Automated Certificate Ingestion & Defect Code Remediation',
    overview: 'Eliminating manual certificate filing through automated document intelligence that extracts statutory test dates, accreditation numbers, and C1/C2 electrical defects.',
    technicalCapabilities: [
      'OCR extraction parsing inspection dates, re-test expirations, and certifying engineer IDs',
      'Automatic generation of remedial work-order quotes from EICR C1/C2 defect schedules',
      'Continuous portfolio-wide statutory gap monitoring (Gas, LOLER, Fire, Water Hygiene)',
      'Digital evidence audit trails prepared instantly for insurer and local authority review',
    ],
    operationalImpact: 'Guarantees 100% compliance audit readiness and eliminates the risk of missed annual statutory inspection deadlines.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/ai-compliance',
    relatedGuideTitle: 'Explore AI Compliance Guide',
    systemIntegration: 'PDF Document OCR / Statutory Register / SFG20',
  },
  {
    id: 'cafm',
    name: 'CAFM Software & Operational Intelligence',
    shortName: 'EntireCAFM Layer',
    iconName: 'server',
    headline: 'Vector Search, Invoice Reconciliation & Executive KPI Reporting',
    overview: 'Transforming CAFM from a passive static database into an active operational copilot that assists estate directors and mobile technicians in real time.',
    technicalCapabilities: [
      'Natural-language vector search answering complex estate queries in plain English',
      'Predictive SLA risk scoring prioritizing work orders before contractual failure occurs',
      'Automated line-item OCR reconciliation matching supplier invoices to agreed rate cards',
      'Automated client monthly KPI reporting summarizing statutory maintenance health',
    ],
    operationalImpact: 'Cuts commercial administrative overhead by over 30% and gives property owners instant clarity on asset health and expenditure.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/ai-cafm',
    relatedGuideTitle: 'Explore EntireCAFM Technology Guide',
    systemIntegration: 'EntireCAFM Core / Vector Embeddings / PostgreSQL',
  },
  {
    id: 'governance',
    name: 'AI Governance, Security & OT Safeguards',
    shortName: 'Governance & Risk',
    iconName: 'lock',
    headline: 'Air-Gapped Safety Controls, Permission Layers & Cryptographic Audits',
    overview: 'Rigorous cybersecurity and operational safety frameworks ensuring AI systems operate under immutable human guardrails and zero unmonitored plant modification risk.',
    technicalCapabilities: [
      'Strict air-gapping isolating primary fire alarms, gas solenoids, and life-safety systems',
      'Mandatory human approval gates on all high-criticality dispatch and financial actions',
      'Cryptographic immutable logging recording every algorithmic suggestion and engineer override',
      'Zero-retention data privacy guarantees protecting tenant occupancy and commercial data',
    ],
    operationalImpact: 'Protects building infrastructure from cyber vulnerabilities and guarantees compliance with UK GDPR and Building Safety Act standards.',
    relatedGuideUrl: '/resources/ai-in-facilities-management/ai-governance',
    relatedGuideTitle: 'Explore AI Governance Guide',
    systemIntegration: 'OT Firewall / Cryptographic Ledger / ISO 27001',
  },
];

export function CapabilityMatrix() {
  const [activeTab, setActiveTab] = useState<string>('assets');
  const activeCategory = MATRIX_DATA.find((c) => c.id === activeTab) || MATRIX_DATA[0];

  const renderIcon = (name: string) => {
    switch (name) {
      case 'wrench': return <Wrench className="w-3.5 h-3.5" />;
      case 'headset': return <Headset className="w-3.5 h-3.5" />;
      case 'bolt': return <Zap className="w-3.5 h-3.5" />;
      case 'shield': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'server': return <Database className="w-3.5 h-3.5" />;
      case 'lock': return <Lock className="w-3.5 h-3.5" />;
      default: return <Wrench className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="my-16 p-8 sm:p-12 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm text-white font-sans">
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-pink" />
          <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
            Estate Capability Matrix
          </span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-extralight text-white tracking-tight">
          Operational Technology &amp; Automation Architecture
        </h3>
        <p className="text-sm text-slate-300 font-light leading-relaxed">
          Select a facilities management discipline below to inspect specific technical capabilities, system integrations, and verified operational outcomes.
        </p>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex flex-wrap gap-2 border-b border-brand-edge-dark pb-4 mb-8">
        {MATRIX_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-medium transition-all ${
              activeTab === cat.id
                ? 'bg-brand-pink text-white shadow-elevated'
                : 'bg-brand-carbon text-slate-300 border border-brand-edge-dark hover:bg-white/10 hover:text-white'
            }`}
          >
            {renderIcon(cat.iconName)}
            <span>{cat.shortName}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Capabilities and Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
              {activeCategory.name}
            </span>
            <h4 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
              {activeCategory.headline}
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light pt-1">
              {activeCategory.overview}
            </p>
          </div>

          <div className="pt-2">
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-3">
              Engineering Capabilities
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCategory.technicalCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark text-xs sm:text-[13px] text-slate-200 leading-relaxed flex items-start gap-2.5 font-light"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Operational Outcome & CTA Card */}
        <div className="lg:col-span-5 p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
              Verified Commercial Impact
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              {activeCategory.operationalImpact}
            </p>
          </div>

          <div className="pt-4 border-t border-brand-edge-dark space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">
              Core Protocol &amp; Integrations
            </span>
            <span className="text-brand-pink font-light text-xs sm:text-sm block">{activeCategory.systemIntegration}</span>
          </div>

          <div className="pt-2">
            <Link
              href={activeCategory.relatedGuideUrl}
              className="inline-flex items-center gap-2 text-xs font-medium text-brand-pink hover:text-white transition-colors"
            >
              <span>{activeCategory.relatedGuideTitle}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
