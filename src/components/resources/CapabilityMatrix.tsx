'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, Headset, Bolt, ShieldCheck, Server, Lock } from 'lucide-react';

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
    relatedGuideTitle: 'Explore Predictive Maintenance Guide →',
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
    relatedGuideTitle: 'Explore AI Helpdesk & Dispatch Guide →',
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
    relatedGuideTitle: 'Explore Energy Optimization Guide →',
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
    relatedGuideTitle: 'Explore AI Compliance Guide →',
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
    relatedGuideTitle: 'Explore EntireCAFM Technology Guide →',
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
    relatedGuideTitle: 'Explore AI Governance Guide →',
    systemIntegration: 'OT Firewall / Cryptographic Ledger / ISO 27001',
  },
];

export function CapabilityMatrix() {
  const [activeTab, setActiveTab] = useState<string>('assets');
  const activeCategory = MATRIX_DATA.find((c) => c.id === activeTab) || MATRIX_DATA[0];

  const renderIcon = (name: string) => {
    switch (name) {
      case 'wrench': return <Wrench className="w-4 h-4" />;
      case 'headset': return <Headset className="w-4 h-4" />;
      case 'bolt': return <Bolt className="w-4 h-4" />;
      case 'shield': return <ShieldCheck className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'lock': return <Lock className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  return (
    <div className="my-16 p-6 sm:p-10 bg-slate-950 border border-slate-800 rounded-2xl text-white">
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
          Estate Capability Explorer
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          AI &amp; Automation Discipline Matrix
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Select a facilities management discipline below to inspect specific technical capabilities, system integrations, and verified operational outcomes.
        </p>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
        {MATRIX_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === cat.id
                ? 'bg-pink-950 text-pink-300 border border-pink-500/50 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
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
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold block mb-1">
              {activeCategory.name}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {activeCategory.headline}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {activeCategory.overview}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
              Specific Engineering Capabilities
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeCategory.technicalCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Operational Outcome & CTA Card */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
              Verified Commercial Impact
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
              {activeCategory.operationalImpact}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">
              Core Protocol &amp; Integrations
            </span>
            <span className="text-pink-300 font-semibold">{activeCategory.systemIntegration}</span>
          </div>

          <div className="pt-2">
            <Link
              href={activeCategory.relatedGuideUrl}
              className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
            >
              {activeCategory.relatedGuideTitle}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
