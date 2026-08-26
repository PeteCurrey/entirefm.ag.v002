'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  ArrowRight,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ComplianceDiscipline {
  id: string;
  name: string;
  status: 'VERIFIED' | 'IN PROGRAMME' | 'CONTROLLED' | 'SCHEDULED' | 'RECORDED' | 'CERTIFIED' | 'EXAMINED';
  standard: string;
  governingBody: string;
  statutoryInterval: string;
  dutyHolderObligation: string;
  evidenceDeliverable: string;
  serviceHref: string;
}

const DISCIPLINES: ComplianceDiscipline[] = [
  {
    id: 'fixed-wire',
    name: 'Fixed Wire Electrical Testing (EICR)',
    status: 'IN PROGRAMME',
    standard: 'BS 7671:2018+A2:2022',
    governingBody: 'Electricity at Work Regulations 1989',
    statutoryInterval: '5-Year (Commercial) / Annual (High-Risk/Industrial)',
    dutyHolderObligation: 'Ensure all electrical installations are safely maintained and certified to prevent fire and electric shock.',
    evidenceDeliverable: 'NICEIC-accredited Electrical Installation Condition Report with schedule of test results and photographic defect coding.',
    serviceHref: '/compliance/fixed-wire-testing-eicr',
  },
  {
    id: 'fire-alarms',
    name: 'Commercial Fire Detection & Life Safety',
    status: 'VERIFIED',
    standard: 'BS 5839-1:2017 & BS 9999',
    governingBody: 'Regulatory Reform (Fire Safety) Order 2005',
    statutoryInterval: 'Weekly User Tests · 6-Monthly / Quarterly Service',
    dutyHolderObligation: 'Maintain operational automatic detection, call points, sounders, and interface relays without exception.',
    evidenceDeliverable: 'BAFE-aligned Certificate of Inspection, sound pressure dB verification, and logbook validation.',
    serviceHref: '/fire-emergency-systems',
  },
  {
    id: 'water-hygiene',
    name: 'Water Hygiene & Legionella Prevention',
    status: 'CONTROLLED',
    standard: 'ACOP L8 & HSG274 Parts 1–3',
    governingBody: 'Health and Safety at Work etc. Act 1974',
    statutoryInterval: 'Monthly Sentinel Points · 2-Year Risk Assessment',
    dutyHolderObligation: 'Maintain water temperatures (Cold <20°C, Hot >50°C), conduct regular flushing, and prevent stagnant conditions.',
    evidenceDeliverable: 'Digital temperature logbook, UKAS accredited lab bacterial test sheets, and remedial action tracking.',
    serviceHref: '/compliance/legionella-water-hygiene',
  },
  {
    id: 'emergency-lighting',
    name: 'Emergency Lighting Duration Testing',
    status: 'SCHEDULED',
    standard: 'BS 5266-1:2016',
    governingBody: 'Building Regulations & Fire Safety Order',
    statutoryInterval: 'Monthly Functional Test · Annual Full 3-Hour Discharge',
    dutyHolderObligation: 'Verify emergency escape routes remain illuminated for designated duration upon total mains electrical failure.',
    evidenceDeliverable: 'Annual Luminaire Discharge Certificate with mapped floorplans and failed battery replacement tracking.',
    serviceHref: '/fire-emergency-systems',
  },
  {
    id: 'fgas',
    name: 'F-Gas & HVAC Refrigerant Management',
    status: 'RECORDED',
    standard: 'EC Regulation 517/2014 & BS EN 378',
    governingBody: 'Environment Agency / Fluorinated Gases Regs',
    statutoryInterval: 'Direct Leak Checks every 3 to 12 Months based on CO₂e',
    dutyHolderObligation: 'Maintain mandatory electronic refrigerant logbooks for systems containing >5 tonnes CO₂ equivalent.',
    evidenceDeliverable: 'Refcom registered digital leak inspection records and refrigerant recovery consignment documentation.',
    serviceHref: '/hvac-contractor',
  },
  {
    id: 'gas-safety',
    name: 'Commercial Gas & Boiler Plant Certification',
    status: 'CERTIFIED',
    standard: 'Gas Safety (Installation and Use) Regs 1998',
    governingBody: 'Health and Safety Executive (HSE)',
    statutoryInterval: 'Annual Statutory Inspection (12 Months)',
    dutyHolderObligation: 'Ensure gas-fired boilers, water heaters, and pipework receive annual commercial inspection by Gas Safe engineers.',
    evidenceDeliverable: 'Non-Domestic Gas Safety Certificate (CP17/CP12), flue gas combustion analysis printouts, and soundness test logs.',
    serviceHref: '/plumbing-gas',
  },
  {
    id: 'loler-access',
    name: 'Lifting Operations & BMU Access (LOLER)',
    status: 'EXAMINED',
    standard: 'LOLER Regulations 1998 & BS 7121',
    governingBody: 'Lifting Operations and Lifting Equipment Regs',
    statutoryInterval: '6-Monthly (Person-Lifting) / 12-Monthly (Plant/Cranes)',
    dutyHolderObligation: 'Thorough examination of BMU cradles, suspension cables, eyebolts, harnesses, and mobile cranes before use.',
    evidenceDeliverable: 'Competent Person Thorough Examination Report with safe working load (SWL) verification.',
    serviceHref: '/working-at-height-rope-access-bmu',
  },
];

const STATUS_COLOR_MAP: Record<string, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'IN PROGRAMME': 'bg-blue-100 text-blue-800 border-blue-300',
  CONTROLLED: 'bg-teal-100 text-teal-800 border-teal-300',
  SCHEDULED: 'bg-purple-100 text-purple-800 border-purple-300',
  RECORDED: 'bg-sky-100 text-sky-800 border-sky-300',
  CERTIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  EXAMINED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

export function ComplianceCommandSection() {
  const [selectedId, setSelectedId] = useState<string>('fixed-wire');
  const active = DISCIPLINES.find(d => d.id === selectedId) || DISCIPLINES[0];

  return (
    <section id="compliance-command" className="relative bg-white py-20 sm:py-28 border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/20 mb-4">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-pink" />
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink">
                COMPLIANCE BUILT INTO DELIVERY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
              Work completed. Evidence retained.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Statutory testing is never an afterthought or a separate consultant's report. We build legal verification directly into every scheduled engineering visit.
            </p>
          </div>

          <Link
            href="/compliance"
            className="btn-outline self-start lg:self-auto text-xs py-3 px-5 inline-flex items-center gap-2"
          >
            <span>Explore Compliance Centre</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-pink" />
          </Link>
        </div>

        {/* Operational Compliance Register Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Register Table */}
          <div className="lg:col-span-7 bg-[#FAF9FB] border border-slate-200 rounded-sm overflow-hidden shadow-xs">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
              <span>Statutory Testing Discipline</span>
              <span>Operating Status</span>
            </div>

            <div className="divide-y divide-slate-200">
              {DISCIPLINES.map((d) => {
                const isSelected = d.id === selectedId;
                const badgeStyle = STATUS_COLOR_MAP[d.status] || 'bg-slate-100 text-slate-800 border-slate-300';

                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    className={`w-full text-left p-4 sm:px-5 sm:py-4 transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white shadow-xs border-l-4 border-l-brand-pink'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-slate-900 group-hover:text-brand-pink transition-colors">
                        {d.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {d.standard}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-xs border uppercase ${badgeStyle}`}>
                        {d.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-brand-pink translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right / Discipline Legal Inspector Drawer */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-pink">
                  LEGAL SPECIFICATION
                </span>
                <span className={`text-[10.5px] font-mono font-medium px-2 py-0.5 rounded-xs border uppercase ${STATUS_COLOR_MAP[active.status]}`}>
                  {active.status}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-slate-900">
                {active.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                  Governing Legislation
                </span>
                <p className="text-slate-800 font-normal mt-0.5">
                  {active.governingBody} ({active.standard})
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                  Statutory Test Frequency
                </span>
                <p className="text-slate-800 font-normal mt-0.5">
                  {active.statutoryInterval}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                  Dutyholder Obligation
                </span>
                <p className="text-slate-600 font-light mt-0.5 leading-relaxed">
                  {active.dutyHolderObligation}
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF9FB] border border-slate-200 rounded-xs space-y-1">
                <span className="text-[10.5px] font-mono uppercase text-brand-pink block">
                  EntireCAFM Evidence Deliverable:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {active.evidenceDeliverable}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <Link
                href={active.serviceHref}
                className="w-full btn-primary text-xs py-3 text-center justify-center inline-flex items-center gap-1.5"
              >
                <span>View {active.name.split(' ')[0]} Service Specification</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
