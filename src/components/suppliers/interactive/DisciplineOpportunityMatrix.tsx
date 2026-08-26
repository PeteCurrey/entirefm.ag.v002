'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Building2, 
  TrendingUp, 
  Users, 
  Award, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Calendar 
} from 'lucide-react';

interface OpportunityCategory {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  volumeProfile: string;
  typicalScope: string[];
  slaAttendance: string;
  paymentTerm: string;
  contractType: string;
  preferredAccreditations: string[];
}

const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  {
    id: 'planned-ppm',
    name: 'Statutory & Planned Maintenance (PPM)',
    badge: 'HIGH VOLUME // PREDICTABLE REVENUE',
    description: 'Contracted SFG20 maintenance visits scheduled across commercial, healthcare, and education property portfolios with 12-month visibility.',
    icon: Calendar,
    volumeProfile: 'High recurring monthly volume across fixed client assets',
    typicalScope: [
      'HVAC, Chiller & Boiler seasonal servicing',
      'Fixed Wire Testing (EICR) & Emergency Lighting',
      'Fire Alarm, Extinguisher & Aspiration maintenance',
      'Water hygiene, L8 sampling & calorifier descaling',
      'Automatic doors, roller shutters & barrier servicing',
    ],
    slaAttendance: 'Planned scheduled slots (typically 5–10 business days window)',
    paymentTerm: 'Pre-validated digital milestone invoicing',
    contractType: '1–3 Year Term Maintenance Agreements',
    preferredAccreditations: ['Gas Safe', 'F-Gas REFCOM', 'NICEIC', 'BAFE', 'L8 Legionella Control'],
  },
  {
    id: 'reactive-dispatch',
    name: 'Critical & Emergency Reactive Repairs',
    badge: 'RAPID DISPATCH // 24/7 NETWORK',
    description: 'Direct CAFM work orders for unscheduled breakdowns, burst pipes, power outages, security breaches, and emergency board-ups.',
    icon: Clock,
    volumeProfile: 'Dynamic daily dispatch based on geographic radius and trade competency',
    typicalScope: [
      '24/7 HVAC heating and chiller emergency breakdown',
      'Electrical failure diagnostics & circuit restoration',
      'Commercial plumbing leaks, drainage & pump failure',
      'Glazing, locksmith & physical security emergency repairs',
      'Roof leak containment & storm damage mitigation',
    ],
    slaAttendance: '2-hour, 4-hour, and same-day emergency SLAs',
    paymentTerm: 'Pre-authorised spend limits + instant variation sign-off',
    contractType: 'Reactive Framework Agreement with agreed callout rate cards',
    preferredAccreditations: ['SafeContractor / CHAS', 'Trade Specific Statutory Licences', 'CSCS / SKILLcard'],
  },
  {
    id: 'specialist-projects',
    name: 'Specialist Quoted Works & Capital Projects',
    badge: 'HIGH VALUE // TECHNICAL COMPLEXITY',
    description: 'Remedial plant replacements, asset upgrades, energy-efficiency retrofits, and statutory compliance corrective actions.',
    icon: Wrench,
    volumeProfile: 'Continuous project pipeline originating from PPM defect identification',
    typicalScope: [
      'End-of-life Chiller & Boiler plantroom replacement',
      'BMS control panel upgrades & sensor integration',
      'Distribution board replacements & surge protection',
      'Roofing renewal, façade restoration & BMU cradles',
      'EV charger installation & renewable retrofits',
    ],
    slaAttendance: 'Structured project milestones with pre-mobilisation meetings',
    paymentTerm: 'Milestone stage valuations against verified completion evidence',
    contractType: 'Standard JCT Minor Works / EntireFM Project Orders',
    preferredAccreditations: ['Principal Contractor H&S (CHAS Elite / Constructionline Gold)', 'ISO 9001 / ISO 45001'],
  },
  {
    id: 'specialist-access',
    name: 'Complex Access & Statutory Building Fabric',
    badge: 'HIGH RISK // CERTIFIED ACCESS',
    description: 'High-level façade inspections, industrial rope access, cradle maintenance, and complex confined-space engineering.',
    icon: ShieldCheck,
    volumeProfile: 'Bespoke recurring and emergency access contracts across high-rise assets',
    typicalScope: [
      'IRATA certified industrial rope access façade maintenance',
      'BMU building maintenance unit cradle statutory testing',
      'Lightning conductor annual testing & surge protection',
      'Confined space interceptor cleaning & culvert survey',
      'Drone thermal imaging & structural condition surveys',
    ],
    slaAttendance: 'Pre-planned access windows with site permit-to-work coordination',
    paymentTerm: 'Electronic sign-off against certified inspection sheets',
    contractType: 'Specialist Framework with strict RAMS approval',
    preferredAccreditations: ['IRATA Level 3 Supervisors', 'LEEA Accreditation', 'ATLAS (Lightning Protection)'],
  },
];

export function DisciplineOpportunityMatrix() {
  const [activeCategory, setActiveCategory] = useState(OPPORTUNITY_CATEGORIES[0].id);

  const selected = OPPORTUNITY_CATEGORIES.find((c) => c.id === activeCategory) || OPPORTUNITY_CATEGORIES[0];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">COMMERCIAL WORKSTREAM OPPORTUNITIES</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Predictable Volume Across Four Operating Streams
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireFM manages diverse national property portfolios. We match your company directly to the commercial streams that fit your operational capacity, trade licenses, and geographical reach.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {OPPORTUNITY_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left p-5 rounded-sm border transition-all ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <CatIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-normal uppercase tracking-wider block opacity-70">
                      {cat.id === 'planned-ppm' ? 'PPM' : cat.id === 'reactive-dispatch' ? 'REACTIVE' : cat.id === 'specialist-projects' ? 'PROJECTS' : 'ACCESS'}
                    </span>
                    <h3 className="text-xs font-light sm:text-[13px] line-clamp-1">{cat.name}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Workstream Detail Deck */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10.5px] font-light uppercase tracking-wider text-brand-pink font-semibold">
                  {selected.badge}
                </span>
                <h3 className="text-2xl font-light text-slate-900 mt-0.5">{selected.name}</h3>
              </div>
            </div>

            <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
              Apply for this workstream <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200/80">
            {/* Typical Scope List */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                TYPICAL WORK SCOPE &amp; DISCIPLINES
              </span>
              <ul className="space-y-2.5">
                {selected.typicalScope.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-light">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commercial Parameters */}
            <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-slate-200 space-y-4">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                COMMERCIAL SPECIFICATIONS
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">SLA Attendance:</span>
                  <span className="font-light text-slate-900">{selected.slaAttendance}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Payment Terms:</span>
                  <span className="font-light text-slate-900">{selected.paymentTerm}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contract Structure:</span>
                  <span className="font-light text-slate-900">{selected.contractType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] mb-1.5">Required Accreditations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.preferredAccreditations.map((acc, j) => (
                      <span key={j} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10.5px] font-light text-slate-700 rounded-sm">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
