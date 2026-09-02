'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Calculator,
  FileCode2,
  CheckSquare,
  FileSpreadsheet,
  Cpu,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Download,
  Clock,
  ScanLine,
  Sliders,
  Compass,
  FileCheck,
  FileText,
  Plane,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

interface ToolCard {
  id: string;
  title: string;
  category: 'CALCULATE' | 'GENERATE' | 'CHECK' | 'TEMPLATES' | 'AI UTILITIES';
  description: string;
  href: string;
  status: 'ACTIVE' | 'PLANNED';
  outputType: string;
  estTime: string;
  icon: any;
}

export function TemplateLobbyDo() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tools: ToolCard[] = [
    // ── 01. CALCULATE ───────────────────────────────────────────────
    {
      id: 'calc-ppm-estimator',
      title: 'PPM Cost Estimator',
      category: 'CALCULATE',
      description: 'Model statutory and planned preventative maintenance budgets across commercial M&E plant based on SFG20 industry norms.',
      href: '/tools/ppm-cost-estimator',
      status: 'ACTIVE',
      outputType: 'Interactive Cost Schedule',
      estTime: '3 mins',
      icon: Calculator,
    },
    {
      id: 'calc-roi',
      title: 'FM ROI & Delivery Model Calculator',
      category: 'CALCULATE',
      description: 'Compare financial and operational risk parameters between in-house trade delivery and single-source outsourced total FM.',
      href: '/tools/roi-calculator',
      status: 'ACTIVE',
      outputType: 'Comparative Financial Model',
      estTime: '4 mins',
      icon: Sliders,
    },
    {
      id: 'calc-occupancy-utilisation',
      title: 'Space Occupancy & Desk Utilisation Modeler',
      category: 'CALCULATE',
      description: 'Calculate real space occupancy ratios and cleaning/servicing frequency adjustments for hybrid commercial office buildings.',
      href: '#',
      status: 'PLANNED',
      outputType: 'Planned Q4 2026 Engine',
      estTime: 'In Development',
      icon: Compass,
    },

    // ── 02. GENERATE ────────────────────────────────────────────────
    {
      id: 'gen-ppm-builder',
      title: 'PPM Schedule Builder',
      category: 'GENERATE',
      description: 'Generate SFG20-aligned 52-week planned maintenance schedules mapped to plant assets, engineer skill tiers, and statutory duties.',
      href: '/tools/ppm-schedule-builder',
      status: 'ACTIVE',
      outputType: '52-Week Annual Schedule',
      estTime: '5 mins',
      icon: FileSpreadsheet,
    },
    {
      id: 'gen-tender-brief',
      title: 'Tender Brief Generator',
      category: 'GENERATE',
      description: 'Produce structured, professional tender briefs and scope-of-work specifications for commercial FM procurement.',
      href: '/tools/tender-brief-generator',
      status: 'ACTIVE',
      outputType: 'Structured RFP Document',
      estTime: '6 mins',
      icon: FileCode2,
    },
    {
      id: 'gen-drone-inspection',
      title: 'Drone Inspection Scope Planner',
      category: 'GENERATE',
      description: 'Plan CAA-compliant thermal rooftop, facade, and high-level structural drone surveys with flight plan and sensor specs.',
      href: '/tools/drone-inspection-planner',
      status: 'ACTIVE',
      outputType: 'Technical Flight Brief',
      estTime: '3 mins',
      icon: Plane,
    },
    {
      id: 'gen-handover-matrix',
      title: 'Mobilisation & Handover Matrix',
      category: 'GENERATE',
      description: 'Canonical incoming contractor transition checklist capturing 42 statutory handover documents from outgoing suppliers.',
      href: '/lobby/copy-of-commercial-cleaning-tender-brief-generator',
      status: 'ACTIVE',
      outputType: 'Spreadsheet (.xlsx) Download',
      estTime: 'Instant',
      icon: Download,
    },

    // ── 03. CHECK ───────────────────────────────────────────────────
    {
      id: 'chk-asset-scanner',
      title: 'Plant & Asset Scanner (OCR Engine)',
      category: 'CHECK',
      description: 'Extract technical equipment serial numbers, model identifiers, and refrigerant specs from plantplates with automatic SFG20 alignment.',
      href: '/tools/asset-scanner',
      status: 'ACTIVE',
      outputType: 'Golden Thread Asset Record',
      estTime: '1 min',
      icon: ScanLine,
    },
    {
      id: 'chk-statutory-compliance',
      title: 'Statutory Compliance Checker',
      category: 'CHECK',
      description: 'Audit your current estate across 10 statutory disciplines to identify compliance gaps and immediate high-risk liability points.',
      href: '/tools/compliance-checker',
      status: 'ACTIVE',
      outputType: 'Gap Audit & Action Plan',
      estTime: '4 mins',
      icon: ShieldCheck,
    },
    {
      id: 'chk-contractor-compliance',
      title: 'Contractor Compliance Audit',
      category: 'CHECK',
      description: 'Evaluate subcontractor competency, insurance levels, accreditation matrices, and safe systems of work before site access.',
      href: '/contractor-tools/contractor-compliance-check',
      status: 'ACTIVE',
      outputType: 'Readiness Pass/Fail Score',
      estTime: '3 mins',
      icon: CheckSquare,
    },
    {
      id: 'chk-job-readiness',
      title: 'Job Readiness Verification',
      category: 'CHECK',
      description: 'Pre-flight check verifying permits-to-work, isolations, RAMS sign-off, and site access protocols before high-risk works begin.',
      href: '/contractor-tools/job-readiness-check',
      status: 'ACTIVE',
      outputType: 'Pre-Work Safety Clearance',
      estTime: '2 mins',
      icon: FileCheck,
    },

    // ── 04. TEMPLATES ───────────────────────────────────────────────
    {
      id: 'tmpl-rams',
      title: 'Contractor RAMS Master Template',
      category: 'TEMPLATES',
      description: 'Professional Risk Assessment & Method Statement template structured for commercial estates and high-risk M&E engineering works.',
      href: '/contractor-resources/rams-template',
      status: 'ACTIVE',
      outputType: 'Statutory Format Template',
      estTime: 'Instant Access',
      icon: FileText,
    },
    {
      id: 'tmpl-method-statement',
      title: 'Method Statement Specification Template',
      category: 'TEMPLATES',
      description: 'Standardised sequential work sequence template including isolations, plant equipment, emergency procedures, and close-out.',
      href: '/contractor-resources/method-statement-template',
      status: 'ACTIVE',
      outputType: 'Engineering Template',
      estTime: 'Instant Access',
      icon: FileText,
    },
    {
      id: 'tmpl-coshh',
      title: 'COSHH Readiness & Chemical Assessment',
      category: 'TEMPLATES',
      description: 'Assessment register for hazardous cleaning substances, water treatment biocides, and HVAC refrigerants used on site.',
      href: '/contractor-resources/coshh-assessment',
      status: 'ACTIVE',
      outputType: 'COSHH Register Template',
      estTime: 'Instant Access',
      icon: FileText,
    },
    {
      id: 'tmpl-fire-door',
      title: 'Fire Door Visual Inspection Checklist',
      category: 'TEMPLATES',
      description: 'Routine visual audit sheet checking frame gap tolerances, intumescent seals, self-closing devices, and signages.',
      href: '/contractor-resources/fire-door-inspection-checklist',
      status: 'ACTIVE',
      outputType: 'Inspection Logbook Form',
      estTime: 'Instant Access',
      icon: FileText,
    },

    // ── 05. AI UTILITIES ────────────────────────────────────────────
    {
      id: 'ai-work-order-intake',
      title: 'Multimodal AI Work Order Intake',
      category: 'AI UTILITIES',
      description: 'AI-assisted fault triage accepting equipment photos, nameplate images, or voice memos to draft reactive work orders.',
      href: '/log-a-job',
      status: 'ACTIVE',
      outputType: 'CAFM Dispatch Work Order',
      estTime: '45 secs',
      icon: Cpu,
    },
    {
      id: 'ai-ask-the-lobby',
      title: 'Ask The Lobby Research Assistant',
      category: 'AI UTILITIES',
      description: 'Query grounded statutory guidance, British Standards, Building Safety Act requirements, and technical FM questions with source citations.',
      href: '/lobby/ask',
      status: 'ACTIVE',
      outputType: 'Cited Technical Brief',
      estTime: '30 secs',
      icon: Sparkles,
    },
    {
      id: 'ai-doc-extractor',
      title: 'Automated O&M Manual Data Extractor',
      category: 'AI UTILITIES',
      description: 'Planned AI utility to ingest scanned PDF Operation & Maintenance manuals and automatically extract scheduled maintenance intervals.',
      href: '#',
      status: 'PLANNED',
      outputType: 'Planned Q1 2027 Pipeline',
      estTime: 'In Development',
      icon: Cpu,
    },
  ];

  const categories = ['ALL', 'CALCULATE', 'GENERATE', 'CHECK', 'TEMPLATES', 'AI UTILITIES'];

  const filteredTools = tools.filter((t) => {
    const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="do" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS & PURPOSE MASTHEAD ───────────────────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">DO</span>
          </nav>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 lg:p-12 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                03 · THE PRACTICAL FM TOOLBOX
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Get the Work Done.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                Practical, engineering-calibrated utilities designed for everyday facilities operations. Instant calculators, tender brief builders, SFG20 maintenance generators, inspection checklists, and verified templates.
              </p>
            </div>

            {/* Practical Utility Standard Strip */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-900 font-medium">12 Interactive Utilities Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Zero Gimmicks · Engineered for UK Estates Practice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-neutral-400" />
                <span>Exportable Formats (.xlsx, .pdf, .json)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. CATEGORY CONTROLS & SEARCH ───────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200/90 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & templates..."
              className="w-full bg-white border border-neutral-200 rounded-[4px] px-3 py-1.5 pl-8 text-xs font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-electric"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* ── 04. TOOLS & UTILITIES DIRECTORY ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isPlanned = tool.status === 'PLANNED';

            return (
              <div
                key={tool.id}
                className={`bg-white border rounded-[4px] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-6 transition-colors ${
                  isPlanned
                    ? 'border-neutral-200/60 opacity-80'
                    : 'border-neutral-200/90 hover:border-neutral-400'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {tool.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {tool.estTime}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-[4px] bg-neutral-50 border border-neutral-100 text-neutral-700 shrink-0">
                      <Icon className="w-4 h-4 text-brand-electric" />
                    </div>
                    <h3 className="text-lg font-light text-neutral-900 leading-snug">
                      {tool.title}
                    </h3>
                  </div>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-light text-neutral-400">
                    {tool.outputType}
                  </span>

                  {isPlanned ? (
                    <span className="text-xs font-mono uppercase text-neutral-400 bg-neutral-100 px-2 py-1 rounded-[2px]">
                      Planned
                    </span>
                  ) : (
                    <Link
                      href={tool.href}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 hover:text-brand-electric"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 05. CALL TO ACTION: ADVISORY SCOPE ────────────────────────── */}
        <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              CANNOT FIND THE TOOL YOU NEED?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Request a Custom Operational Tool or Bespoke Schedule
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              EntireFM engineers regularly construct tailored asset registers, multi-site PPM frameworks, and tender specifications for complex estates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/contact?subject=Bespoke%20FM%20Tool%20Request"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <span>Consult an Engineering Director</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/lobby/ask"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-electric" />
              <span>Ask The Lobby</span>
            </Link>
          </div>
        </section>

        {/* ── 06. CROSS-LINKING NAVIGATION ─────────────────────────────── */}
        <section className="pt-6 border-t border-neutral-200/90">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-4">
            Navigate The Lobby Knowledge Graph
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link href="/lobby/know" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">01 · INTELLIGENCE</span>
              <span className="text-neutral-900 font-medium">KNOW &rarr;</span>
            </Link>
            <Link href="/lobby/check" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">02 · OBLIGATIONS</span>
              <span className="text-neutral-900 font-medium">CHECK &rarr;</span>
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
