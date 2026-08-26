'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileCheck, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Building2,
  Users,
  CreditCard
} from 'lucide-react';

interface OnboardingPhase {
  phase: string;
  title: string;
  targetDuration: string;
  badge: string;
  overview: string;
  steps: {
    title: string;
    description: string;
    responsibleParty: string;
  }[];
  keyDeliverable: string;
  icon: React.ElementType;
}

const PHASES: OnboardingPhase[] = [
  {
    phase: 'PHASE 01',
    title: 'Digital Registration & Profile Scoping',
    targetDuration: '10–15 Minutes (Online Submission)',
    badge: 'STAGE 1 // INITIAL APPLICATION',
    overview: 'Establish your company profile, trade disciplines, geographic operating radiuses, and primary administrative contacts through our streamlined application form.',
    icon: Building2,
    steps: [
      {
        title: 'Company Identity & Companies House Verification',
        description: 'Submit legal name, trading name, company number, and registered address for automated solvency verification.',
        responsibleParty: 'Supplier Applicant',
      },
      {
        title: 'Trade Discipline & Capability Mapping',
        description: 'Select your primary engineering and fabric trades, 24/7 availability SLA, and operating county radius.',
        responsibleParty: 'Supplier Applicant',
      },
      {
        title: 'Contact Roles & Access Provisioning',
        description: 'Designate Primary Account Director, Operations Dispatch Desk, and Finance/Invoicing billing contacts.',
        responsibleParty: 'Supplier Applicant',
      },
    ],
    keyDeliverable: 'Generated Unique Supplier Application Reference (SUP-YYMMDD-XXXX)',
  },
  {
    phase: 'PHASE 02',
    title: 'Document Vault & Technical Desk Review',
    targetDuration: '1–2 Business Days (Desk Review)',
    badge: 'STAGE 2 // EVIDENCE ASSURANCE',
    overview: 'Upload required insurance schedules, trade licensing certificates, and H&S policies to our secure document vault for assessment by specialist EntireFM discipline managers.',
    icon: FileCheck,
    steps: [
      {
        title: 'Insurance Policy Schedule Upload',
        description: 'Submit Public Liability (£5M–£10M), Employers Liability (£10M), and Professional Indemnity schedules.',
        responsibleParty: 'Supplier Compliance Lead',
      },
      {
        title: 'Statutory Licence & Accreditation Validation',
        description: 'Upload active Gas Safe, REFCOM F-Gas, NICEIC, BAFE, or SSIP certificates for digital register verification.',
        responsibleParty: 'Supplier Compliance Lead',
      },
      {
        title: 'Discipline Desk Assessment & Scoped Decision',
        description: 'EntireFM Technical Managers review evidence and issue formal approval for specific trade categories.',
        responsibleParty: 'EntireFM Technical Director',
      },
    ],
    keyDeliverable: 'Formal Scoped Trade & Geographic Approval Matrix',
  },
  {
    phase: 'PHASE 03',
    title: 'Dual-Control Banking & Framework Execution',
    targetDuration: '1 Business Day (Security Sign-Off)',
    badge: 'STAGE 3 // GOVERNANCE & SECURITY',
    overview: 'Execute the master supplier framework agreement, commit to the Code of Conduct, and complete dual-control bank remittance verification.',
    icon: Lock,
    steps: [
      {
        title: 'Digital Master Services Agreement (MSA) Signing',
        description: 'Electronic execution of commercial framework terms, payment terms, and confidentiality covenants.',
        responsibleParty: 'Supplier Director',
      },
      {
        title: 'Supplier Code of Conduct & Ethics Charter',
        description: 'Sign formal commitment to Modern Slavery Act 2015, Anti-Bribery 2010, and safety declarations.',
        responsibleParty: 'Supplier Director',
      },
      {
        title: 'Dual-Control Phone Verification of Bank Remittance',
        description: 'EntireFM Finance conducts independent voice verification of bank account details to eliminate mandate fraud.',
        responsibleParty: 'EntireFM Finance + Supplier Financial Officer',
      },
    ],
    keyDeliverable: 'Fully Executed Supply Chain Framework Agreement & Verified Bank Mandate',
  },
  {
    phase: 'PHASE 04',
    title: 'CAFM Activation & First Work Order Dispatch',
    targetDuration: 'Same Day Activation (Immediate Live Status)',
    badge: 'STAGE 4 // OPERATIONAL MOBILISATION',
    overview: 'Receive full access to the EntireFM Supplier Portal and EntireCAFM dispatch feeds. Your engineers are cleared for site mobilisation and job allocations.',
    icon: Smartphone,
    steps: [
      {
        title: 'Supplier Portal & User Access Handover',
        description: 'Dispatch desk receives live dashboard access for work orders, SLA tracking, and document management.',
        responsibleParty: 'EntireFM Helpdesk Manager',
      },
      {
        title: 'Mobile Engineer App Integration & RAMS Briefing',
        description: 'Attending engineers briefed on site sign-in protocols, photographic proof capture, and electronic worksheets.',
        responsibleParty: 'Supplier Operations Team',
      },
      {
        title: 'First Work Order Dispatch & Milestone Payment Setup',
        description: 'Live job opportunities allocated based on approved trade competence and regional availability.',
        responsibleParty: 'EntireFM Dispatch Desk',
      },
    ],
    keyDeliverable: 'Live Active Partner Status on Nationwide CAFM Dispatch Roster',
  },
];

export function OnboardingPhaseTimeline() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const selected = PHASES[activePhaseIndex];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">END-TO-END ONBOARDING PROTOCOL</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            The 4-Phase Supplier Mobilisation Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            From initial registration to live CAFM job dispatch, our onboarding process is completely transparent, digital, and designed for fast turnaround without compromising statutory safety.
          </p>
        </div>

        {/* 4 Phases Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PHASES.map((p, idx) => {
            const isSelected = idx === activePhaseIndex;
            const PhaseIcon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => setActivePhaseIndex(idx)}
                className={`text-left p-5 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <PhaseIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-[11px] font-extralight ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    {p.phase}
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-light mb-1">{p.title}</h3>
                  <span className="text-[11px] text-slate-500 font-light block">{p.targetDuration.split('(')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Deck */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {selected.badge}
                </span>
                <h3 className="text-2xl font-light text-slate-900">{selected.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-light text-slate-600">Typical Turnaround:</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-medium rounded-sm">
                {selected.targetDuration}
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.overview}
          </p>

          {/* Phase Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {selected.steps.map((step, sIdx) => (
              <div key={sIdx} className="bg-white p-6 rounded-sm border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extralight text-brand-pink">STEP 0{sIdx + 1}</span>
                    <span className="text-[10px] text-slate-400 font-light px-2 py-0.5 bg-slate-100 rounded-sm">
                      {step.responsibleParty}
                    </span>
                  </div>
                  <h4 className="text-sm font-light text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Deliverable Strip */}
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-light text-emerald-900">
                <strong className="font-medium">Phase Outcome:</strong> {selected.keyDeliverable}
              </span>
            </div>

            <Link href="/suppliers/apply" className="btn-primary text-xs py-2 px-4">
              Begin Phase 1 Registration <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
