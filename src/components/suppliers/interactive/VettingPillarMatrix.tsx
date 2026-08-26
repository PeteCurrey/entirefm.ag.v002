'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  FileCheck, 
  Users, 
  Lock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText,
  Clock,
  Layers
} from 'lucide-react';

interface VettingPillar {
  num: string;
  title: string;
  shortDescription: string;
  icon: React.ElementType;
  fullRationale: string;
  mandatoryEvidence: string[];
  verificationMethod: string;
  riskApplicability: 'ALL' | 'MEDIUM_HIGH' | 'HIGH_CRITICAL';
  renewalFrequency: string;
}

const PILLARS: VettingPillar[] = [
  {
    num: '01',
    title: 'Statutory & Corporate Standing',
    shortDescription: 'Active Companies House registration, verified registered address, and director identity checks.',
    icon: Scale,
    fullRationale: 'We verify that every contracting entity is legally registered, solvent, and actively trading. We verify director identities, Companies House accounts filing status, and credit rating health to ensure supply chain resilience.',
    mandatoryEvidence: [
      'Companies House Registration Number & Certificate of Incorporation',
      'Registered Office Address and Principal Trading Address verification',
      'Director identification & Persons with Significant Control (PSC) check',
      'Satisfactory CreditSafe / Experian commercial solvency rating',
    ],
    verificationMethod: 'Automated Companies House API check + commercial credit agency assessment.',
    riskApplicability: 'ALL',
    renewalFrequency: 'Annual automated review + continuous credit monitoring',
  },
  {
    num: '02',
    title: 'Insurance Adequacy & Indemnity',
    shortDescription: 'Minimum £5M–£10M Public Liability, Employers Liability, and trade-specific Professional Indemnity.',
    icon: ShieldCheck,
    fullRationale: 'Adequate insurance coverage protects property owners, tenants, and the contractor against unexpected liabilities. We verify policy schedules directly with brokers or insurers, ensuring no unapproved exclusions for hot works or working at height.',
    mandatoryEvidence: [
      'Public Liability Insurance Schedule (Minimum £5M, £10M for high-risk trades)',
      'Employers Liability Insurance (Minimum £10M statutory requirement)',
      'Professional Indemnity Insurance (Minimum £1M–£5M for design & technical advisory trades)',
      'Specific endorsements for Hot Works, Depth, Height, or High-Voltage if applicable',
    ],
    verificationMethod: 'Independent broker verification and automated 90/60/30-day proactive expiry tracking.',
    riskApplicability: 'ALL',
    renewalFrequency: 'Annually upon policy renewal date',
  },
  {
    num: '03',
    title: 'Technical Accreditations & Trade Licences',
    shortDescription: 'Mandatory statutory licences (Gas Safe, F-Gas REFCOM, NICEIC, BAFE, SafeContractor, CHAS).',
    icon: Award,
    fullRationale: 'Certain building engineering trades carry statutory licensing requirements by law. We verify active registration on official bodies and confirm that the scope of accreditation covers commercial premises and industrial equipment.',
    mandatoryEvidence: [
      'Gas Safe Register commercial registration with relevant appliance categories',
      'REFCOM / Bureau Veritas F-Gas Company Certificate (Stationary Refrigeration & Air Con)',
      'NICEIC / ECA / NAPIT Approved Contractor certification for commercial electrical works',
      'BAFE / FIA certification for fire detection, alarm, and extinguishing systems',
      'LEEA / SAFed accreditation for lifting equipment and pressure systems',
    ],
    verificationMethod: 'Live online register lookup against official governing body databases.',
    riskApplicability: 'MEDIUM_HIGH',
    renewalFrequency: 'Annual certificate validation + registration check',
  },
  {
    num: '04',
    title: 'Health, Safety & Environmental Management',
    shortDescription: 'Audited H&S Policy, dynamic site-specific RAMS, COSHH registers, and waste carrier licences.',
    icon: FileCheck,
    fullRationale: 'Safety is non-negotiable. Contractors must demonstrate a structured approach to risk management, operative safety training, hazardous substance containment, and incident reporting under RIDDOR regulations.',
    mandatoryEvidence: [
      'Signed Company Health & Safety Policy statement (< 5 employees exempt from written doc, verbal briefing required)',
      'Sample site-specific Risk Assessment & Method Statement (RAMS) for core trade',
      'Valid SSIP member accreditation (CHAS, SafeContractor, Constructionline, Alcumus)',
      'Environment Agency Upper Tier Waste Carrier Licence (for trades handling waste)',
      '3-Year RIDDOR incident history & enforcement notice disclosure',
    ],
    verificationMethod: 'H&S compliance desk review by qualified EntireFM NEBOSH safety officers.',
    riskApplicability: 'ALL',
    renewalFrequency: 'Annual policy review + per-job RAMS submission',
  },
  {
    num: '05',
    title: 'Workforce Competency & Operative Verification',
    shortDescription: 'Trade cards (CSCS, SKILLcard, JIB), right-to-work screening, and asbestos awareness training.',
    icon: Users,
    fullRationale: 'A supplier company is only as safe and competent as the individual engineers dispatched to site. We verify that operatives carry valid industry skills cards and mandatory safety awareness credentials.',
    mandatoryEvidence: [
      'CSCS / SKILLcard / JIB Gold Card verification for attending engineering personnel',
      'UK Right-to-Work verification records in compliance with Home Office guidelines',
      'UKATA / IATP accredited Category A Asbestos Awareness training (< 12 months)',
      'Emergency First Aid at Work (EFAW) & Work at Height certified training for relevant trades',
      'Enhanced DBS checks for sensitive healthcare, education, and banking environments',
    ],
    verificationMethod: 'Digital card verification + random on-site audit checks by EntireFM supervisors.',
    riskApplicability: 'ALL',
    renewalFrequency: 'Annual skills matrix submission + individual card expiries',
  },
  {
    num: '06',
    title: 'Information Security & Ethical Governance',
    shortDescription: 'UK GDPR compliance, anti-bribery declaration, modern slavery pledge, and CAFM credential safety.',
    icon: Lock,
    fullRationale: 'Suppliers access sensitive commercial premises, building blueprints, security codes, and client information. We enforce strict data governance and zero-tolerance commitments to ethical labour standards.',
    mandatoryEvidence: [
      'Signed EntireFM Supplier Code of Conduct & Ethics Charter',
      'Anti-Bribery & Corruption Policy declaration in accordance with Bribery Act 2010',
      'Modern Slavery Act 2015 statement and fair wage commitment',
      'UK GDPR / Data Protection compliance statement for building access data',
      'Secure CAFM credential management and zero-sharing protocol',
    ],
    verificationMethod: 'Annual compliance declaration and audited framework agreement execution.',
    riskApplicability: 'ALL',
    renewalFrequency: 'Annual declaration upon agreement anniversary',
  },
];

export function VettingPillarMatrix() {
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const selected = PILLARS[activePillarIndex];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">GOVERNANCE &amp; ASSURANCE FRAMEWORK</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            The 6-Pillar Proportional Vetting Standard
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Every contractor, specialist SME, and service provider undergoing onboarding is evaluated across six rigorous assurance pillars. Requirements are strictly proportional to the risk profile of your trade and site environment.
          </p>
        </div>

        {/* 6 Pillars Interactive Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {PILLARS.map((pillar, idx) => {
            const isSelected = idx === activePillarIndex;
            const PillarIcon = pillar.icon;
            return (
              <button
                key={idx}
                onClick={() => setActivePillarIndex(idx)}
                className={`text-left p-5 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <PillarIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-[11px] font-extralight ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    PILLAR {pillar.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-[13.5px] font-light mb-1">{pillar.title}</h3>
                  <p className={`text-[11.5px] font-light leading-snug line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pillar.shortDescription}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Pillar Inspection Container */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  PILLAR {selected.num} ASSURANCE SPECIFICATION
                </span>
                <h3 className="text-2xl font-light text-slate-900">{selected.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-light text-slate-500">Risk Tier:</span>
              <span className="px-2.5 py-1 bg-slate-200/80 text-slate-800 text-[11px] font-normal rounded-sm">
                {selected.riskApplicability === 'ALL' ? 'All Suppliers (Universal)' : selected.riskApplicability === 'MEDIUM_HIGH' ? 'Medium & High Risk Trades' : 'High Risk & Critical Works'}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block mb-1.5">
                ASSURANCE RATIONALE &amp; IMPORTANCE
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
                {selected.fullRationale}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              {/* Evidence Checklist */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                  MANDATORY EVIDENCE CHECKLIST (DOCUMENT VAULT)
                </span>
                <ul className="space-y-2.5">
                  {selected.mandatoryEvidence.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light bg-white p-3 rounded-sm border border-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verification & Renewal Specifications */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                  <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                    ENTIREFM VERIFICATION METHOD
                  </span>
                  <p className="text-xs text-slate-700 font-light leading-relaxed">
                    {selected.verificationMethod}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                  <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                    RE-ASSESSMENT &amp; MONITORING CADENCE
                  </span>
                  <p className="text-xs text-slate-700 font-light leading-relaxed">
                    {selected.renewalFrequency}
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/suppliers/apply" className="btn-primary w-full justify-center text-xs py-3">
                    Start Pre-Qualification for Pillar {selected.num} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
