'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Layers,
  Scale,
  Building,
  Flame,
  Zap,
  Droplets,
  Wind,
  ArrowUpRight,
  Info,
  HelpCircle,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

interface StatutoryDiscipline {
  id: string;
  name: string;
  actTitle: string;
  governingBody: string;
  standardCodes: string;
  primaryFrequency: string;
  mandatoryEvidence: string;
  responsiblePerson: string;
  icon: any;
  practicalGuidanceNote: string;
  toolUrl?: string;
  toolLabel?: string;
}

export function TemplateLobbyCheck() {
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const disciplines: StatutoryDiscipline[] = [
    {
      id: 'fire',
      name: 'Fire & Life Safety',
      actTitle: 'Regulatory Reform (Fire Safety) Order 2005 & Fire Safety Act 2021',
      governingBody: 'Home Office / Local Fire & Rescue Authority',
      standardCodes: 'BS 5839 (Alarms), BS 5266 (Emergency Lighting), BS 9999',
      primaryFrequency: 'Weekly alarm test · 6-Monthly system service · Annual FRA review',
      mandatoryEvidence: 'Written Fire Risk Assessment (FRA), Weekly bell logbook, 3-hour emergency lighting discharge certificate.',
      responsiblePerson: 'Responsible Person (Employer, Owner, or Person with control of premises)',
      icon: Flame,
      practicalGuidanceNote: 'EntireFM Recommendation: Do not rely solely on automated panel logs. Ensure physical visual checks of fire door gap tolerances (≤4mm) and smoke seals on all evacuation routes.',
      toolUrl: '/tools/compliance-calendar',
      toolLabel: 'Open Compliance Calendar',
    },
    {
      id: 'electrical',
      name: 'Electrical Systems',
      actTitle: 'Electricity at Work Regulations 1989 (EAWR)',
      governingBody: 'Health and Safety Executive (HSE) & Local Authority',
      standardCodes: 'BS 7671:2018+A3:2024 (IET Wiring Regulations)',
      primaryFrequency: '5-Yearly EICR (Commercial) · Annual visual inspection · Regular portable appliance testing (PAT)',
      mandatoryEvidence: 'Electrical Installation Condition Report (EICR) with zero unclosed C1/C2 observation codes.',
      responsiblePerson: 'Duty Holder (Commercial Occupier and Landlord)',
      icon: Zap,
      practicalGuidanceNote: 'EntireFM Recommendation: Request thermographic infrared surveys of primary distribution switchgear during peak load alongside statutory 5-year fixed wire tests to detect high-resistance joints early.',
      toolUrl: '/tools/compliance-checker',
      toolLabel: 'Run Electrical Compliance Check',
    },
    {
      id: 'water',
      name: 'Water Hygiene & Legionella',
      actTitle: 'Health and Safety at Work etc. Act 1974 / COSHH Regs 2002',
      governingBody: 'Health and Safety Executive (HSE)',
      standardCodes: 'HSE Approved Code of Practice (ACOP) L8 & HSG274 Parts 1–3',
      primaryFrequency: 'Monthly sentinel temperatures · 6-Monthly tank inspection · Biennial Legionella Risk Assessment',
      mandatoryEvidence: 'Written Scheme of Prevention, Up-to-date Legionella Risk Assessment, Continuous 24-month temperature logs (cold <20°C, hot ≥50°C).',
      responsiblePerson: 'Appointed Statutory Duty Holder and Nominated Competent Person',
      icon: Droplets,
      practicalGuidanceNote: 'EntireFM Recommendation: Any little-used outlet or dead-leg must have documented weekly flushing recorded to maintain legal compliance under HSG274 Part 2.',
      toolUrl: '/tools/compliance-calendar',
      toolLabel: 'Schedule ACOP L8 Tasks',
    },
    {
      id: 'hvac',
      name: 'HVAC, Refrigeration & F-Gas',
      actTitle: 'Ozone-Depleting Substances & F-Gas Regulations 2015',
      governingBody: 'Environment Agency (EA)',
      standardCodes: 'BS EN 378 · Energy Performance of Buildings (Certificates and Inspections) Regs (TM44)',
      primaryFrequency: 'Leak tests every 3, 6, or 12 months based on GWP CO2 equivalent tonnes · 5-Yearly TM44 air con audit',
      mandatoryEvidence: 'F-Gas logbooks recording refrigerant additions/recoveries mapped to engineer REFCOM certificates; valid TM44 report for systems >12kW.',
      responsiblePerson: 'Operator of equipment containing fluorinated greenhouse gases',
      icon: Wind,
      practicalGuidanceNote: 'EntireFM Recommendation: Maintain a centralized digital register matching serial numbers directly to refrigerant charges (kg and CO2e) to eliminate audit vulnerabilities during EA spot-inspections.',
      toolUrl: '/tools/asset-scanner',
      toolLabel: 'Scan Plantplate & GWP Data',
    },
    {
      id: 'building-safety',
      name: 'Building Safety Act (BSA)',
      actTitle: 'Building Safety Act 2022 (Part 4) & Building Safety (Registration) Regs 2023',
      governingBody: 'Building Safety Regulator (BSR, Health and Safety Executive)',
      standardCodes: 'Statutory Instrument 2023/1096 · Golden Thread Digital Standards',
      primaryFrequency: 'Contemporaneous ongoing occurrence logging · Mandatory reporting within 48h · Safety Case review',
      mandatoryEvidence: 'Building Safety Certificate, Resident Engagement Strategy, Mandatory Occurrence Reporting procedure, verified digital Golden Thread asset files.',
      responsiblePerson: 'Principal Accountable Person (PAP) and Accountable Persons (APs)',
      icon: Building,
      practicalGuidanceNote: 'EntireFM Recommendation: Golden thread information must be stored in open, machine-readable formats. Ensure all fire doors, dampers, and smoke control systems have verified manufacturer tags.',
      toolUrl: '/tools/compliance-checker',
      toolLabel: 'Launch BSA Compliance Checker',
    },
    {
      id: 'lifting',
      name: 'Lifting Operations & Access',
      actTitle: 'Lifting Operations and Lifting Equipment Regulations 1998 (LOLER)',
      governingBody: 'Health and Safety Executive (HSE)',
      standardCodes: 'PUWER 1998 · BS 5655 · Work at Height Regulations 2005 (WAHR)',
      primaryFrequency: '6-Monthly thorough examination for passenger lifts · 12-Monthly for goods-only plant · Annual eye-bolt test',
      mandatoryEvidence: 'LOLER Thorough Examination reports by independent competent body (e.g. Zurich, Allianz) and immediate closeout of Section A defects.',
      responsiblePerson: 'Estate Owner or Facilities Manager managing lifting assets',
      icon: Scale,
      practicalGuidanceNote: 'EntireFM Recommendation: Never confuse regular PPM maintenance visits with statutory LOLER thorough examinations. Insist on immediate signed confirmation of any Category A defects.',
      toolUrl: '/tools/compliance-calendar',
      toolLabel: 'Track LOLER Schedules',
    },
  ];

  const filteredDisciplines = disciplines.filter((d) => {
    const matchesFilter = activeDiscipline === 'all' || d.id === activeDiscipline;
    const matchesQuery =
      searchQuery.trim() === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.actTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.standardCodes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="check" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">CHECK</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                02 · THE FM COMPLIANCE CENTRE
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Know What&apos;s Required.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                The authoritative UK facilities statutory compliance registry. Clarifying non-negotiable statutory duties, statutory test frequencies, mandatory proof of evidence, and practical compliance inspection tooling.
              </p>
            </div>

            {/* Statutory Standard & Methodology Strip */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-neutral-900 font-medium">Aligned with SFG20 &amp; HSE Guidance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-neutral-400" />
                <span>UK Primary Legislation &amp; Statutory Instruments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>Duty Holder Proof of Evidence Vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. MANDATORY DISCLAIMER & PROVENANCE STANDARD ───────────── */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-[4px] p-4 sm:p-6 text-xs text-amber-900 flex items-start gap-4">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-800 block">
              Legal &amp; Regulatory Distinctions (Non-Fabrication Policy)
            </span>
            <p className="font-light leading-relaxed text-amber-900/90">
              <strong>Official Legislation &amp; Guidance</strong> references UK Acts of Parliament, Statutory Instruments, and Health &amp; Safety Executive (HSE) Approved Codes of Practice. <strong>EntireFM Practical Guidance</strong> represents our engineering directorate&apos;s practical recommendations and operational methods. EntireFM does not create UK law. Always verify site-specific risk assessments with an appointed competent person.
            </p>
          </div>
        </div>

        {/* ── 04. INTERACTIVE COMPLIANCE SUITE (DIRECT LAUNCH) ─────────── */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-neutral-200/80 pb-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                COMPLIANCE APPLICATIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Statutory Assessment &amp; Calendar Tools
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Instant verification utilities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tool 1: Statutory Compliance Checker */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5 hover:border-neutral-400 transition-colors">
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px] inline-block border border-emerald-200">
                  Fully Interactive Utility
                </span>
                <h3 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                  Statutory Compliance Checker
                </h3>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                  Evaluate commercial estate compliance across 10 statutory categories. Generates an instant gap analysis and prioritized action plan.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href="/tools/compliance-checker"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Launch Compliance Checker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tool 2: Statutory Compliance Calendar */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5 hover:border-neutral-400 transition-colors">
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-[2px] inline-block border border-blue-200">
                  52-Week Schedule Matrix
                </span>
                <h3 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                  Statutory Compliance Calendar
                </h3>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                  Interactive multi-disciplinary testing calendar mapping weekly, monthly, and annual duties to responsible person roles.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href="/tools/compliance-calendar"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Open Compliance Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tool 3: Building Health Check */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5 hover:border-neutral-400 transition-colors">
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-[2px] inline-block border border-purple-200">
                  Estate Diagnostics
                </span>
                <h3 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                  Building Health Check Audit
                </h3>
                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                  Holistic estate diagnostic assessing M&amp;E asset conditions, plantroom longevity, energy leaks, and contractor service coverage.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href="/tools/building-health-check"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Start Health Check</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── 05. STATUTORY DISCIPLINE DIRECTORY & EVIDENCE REQUIREMENTS ─ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline justify-between gap-4 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                STATUTE &amp; EVIDENCE REGISTRY
              </span>
              <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Core Compliance Disciplines &amp; Evidence Requirements
              </h2>
            </div>
            
            <div className="relative sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search regulations..."
                className="w-full bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 pl-8 text-xs font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-6">
            {filteredDisciplines.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  id={item.id}
                  className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-6 scroll-mt-24"
                >
                  {/* Title & Authority Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-[4px] bg-neutral-100 text-neutral-800 shrink-0">
                        <Icon className="w-5 h-5 text-brand-electric" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-light text-neutral-900 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs font-mono text-neutral-500">
                          {item.actTitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right shrink-0 space-y-0.5 text-xs font-light text-neutral-500">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Enforcing Body</span>
                      <span className="text-neutral-800 font-medium">{item.governingBody}</span>
                    </div>
                  </div>

                  {/* 3-Column Requirement Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                        Mandatory Inspection Frequency
                      </span>
                      <p className="text-neutral-800 leading-relaxed font-mono text-[11.5px]">
                        {item.primaryFrequency}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                        Evidence to Retain on File
                      </span>
                      <p className="text-neutral-800 leading-relaxed">
                        {item.mandatoryEvidence}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                        Statutory Duty Holder Role
                      </span>
                      <p className="text-neutral-800 leading-relaxed">
                        {item.responsiblePerson}
                      </p>
                    </div>

                  </div>

                  {/* EntireFM Practical Guidance Note */}
                  <div className="bg-neutral-50 border-l-2 border-brand-electric p-4 text-xs font-light text-neutral-700 leading-relaxed">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-electric block mb-1">
                      EntireFM Practical Guidance
                    </span>
                    <p>{item.practicalGuidanceNote}</p>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-neutral-500 font-light">
                      <span>Related:</span>
                      <Link href="/lobby/know" className="text-brand-electric hover:underline">
                        Regulatory Briefings (KNOW)
                      </Link>
                      <span>·</span>
                      <Link href="/lobby/learn" className="text-brand-electric hover:underline">
                        10-Min Explainer (LEARN)
                      </Link>
                    </div>

                    {item.toolUrl && (
                      <Link
                        href={item.toolUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 hover:text-brand-electric"
                      >
                        <span>{item.toolLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── 06. FUTURE COMPLIANCE ROADMAP (HONEST ARCHITECTURE) ──────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              COMPLIANCE ROADMAP (PLANNED EXTENSIONS)
            </span>
            <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
              Personalised Compliance Calibrations &amp; Gap Audits
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              We are expanding The Lobby CHECK suite to support multi-site estate exportable compliance vaults, automated sub-contractor insurance expiry notifications, and SFG20 task sync.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">Planned Q4 2026</span>
              <h4 className="text-sm font-normal text-neutral-900">Custom Estate Compliance Vault</h4>
              <p className="text-xs font-light text-neutral-500">Save site-specific asset lists and generate tailored compliance calendars.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">Planned Q1 2027</span>
              <h4 className="text-sm font-normal text-neutral-900">Digital Gap Assessment Pack</h4>
              <p className="text-xs font-light text-neutral-500">Downloadable statutory handoff packets for incoming estates directors.</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">Active Feature</span>
              <h4 className="text-sm font-normal text-neutral-900">Contractor Document Audit</h4>
              <p className="text-xs font-light text-neutral-500">Verify sub-contractor competency matrices against statutory requirements.</p>
              <Link href="/contractor-tools/contractor-document-checklist" className="text-xs text-brand-electric hover:underline block pt-1">
                Access Document Checklist &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── 07. CROSS-LINKING NAVIGATION ─────────────────────────────── */}
        <section className="pt-6 border-t border-neutral-200/90">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
            Navigate The Lobby Knowledge Graph
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link href="/lobby/know" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">01 · INTELLIGENCE</span>
              <span className="text-neutral-900 font-medium">KNOW &rarr;</span>
            </Link>
            <Link href="/lobby/do" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">03 · TOOLBOX</span>
              <span className="text-neutral-900 font-medium">DO &rarr;</span>
            </Link>
            <Link href="/lobby/find" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">04 · DIRECTORY</span>
              <span className="text-neutral-900 font-medium">FIND &rarr;</span>
            </Link>
            <Link href="/lobby/learn" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">05 · CPD &amp; BRIEFS</span>
              <span className="text-neutral-900 font-medium">LEARN &rarr;</span>
            </Link>
            <Link href="/lobby/connect" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors col-span-2 sm:col-span-1">
              <span className="text-neutral-400 text-[10px] block">06 · PEER NETWORK</span>
              <span className="text-neutral-900 font-medium">CONNECT &rarr;</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
