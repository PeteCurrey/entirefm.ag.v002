'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShieldCheck,
  Calendar,
  FileCheck2,
  AlertTriangle,
  Scale,
  Flame,
  Zap,
  Droplets,
  Wind,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  Building,
  HelpCircle,
  FileText,
  AlertCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import {
  COMPLIANCE_DISCIPLINES,
  COMPLIANCE_TOPICS,
  INSPECTION_FREQUENCIES_LIBRARY,
  EVIDENCE_REGISTER,
  LEGISLATION_DIRECTORY,
  type ComplianceDisciplineMeta,
  type ComplianceTopic,
  type FrequencyRecord,
} from '@/data/lobby/compliance-data';

export function TemplateLobbyCheck() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [frequencySearch, setFrequencySearch] = useState('');

  // Guided Assessment State ("What do I need to check?")
  const [selectedBuildingType, setSelectedBuildingType] = useState('Commercial Office');
  const [selectedRole, setSelectedRole] = useState('Facilities Manager');
  const [selectedSystems, setSelectedSystems] = useState<string[]>([
    'Fire Alarm & Detection',
    'Emergency Lighting',
    'Fire Doors',
    'Fixed Electrical (EICR)',
    'Water Hygiene & Legionella',
    'HVAC & Air Conditioning',
    'Passenger Lifts',
  ]);
  const [assessmentGenerated, setAssessmentGenerated] = useState(false);

  // Calendar View State
  const [calendarView, setCalendarView] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  // Quick Topic Pills
  const quickPills = [
    { label: 'Fire doors', query: 'fire doors' },
    { label: 'Legionella', query: 'legionella' },
    { label: 'EICR', query: 'eicr' },
    { label: 'Emergency lighting', query: 'emergency lighting' },
    { label: 'Lifts', query: 'lifts' },
    { label: 'Asbestos', query: 'asbestos' },
    { label: 'F-Gas', query: 'f-gas' },
    { label: 'Gas safety', query: 'gas safety' },
    { label: 'Water hygiene', query: 'water hygiene' },
    { label: 'Building safety', query: 'building safety' },
  ];

  const buildingTypes = [
    'Commercial Office',
    'Retail Unit / Centre',
    'Industrial & Manufacturing',
    'Logistics Warehouse',
    'Multi-Occupancy Residential',
    'Mixed Use Development',
    'Education Campus',
    'Healthcare Facility',
  ];

  const roles = [
    'Facilities Manager',
    'Property Manager',
    'Estates Manager',
    'Building Manager',
    'Landlord / Building Owner',
    'Managing Agent',
    'Employer',
    'Contractor',
  ];

  const systemOptions = [
    'Fire Alarm & Detection',
    'Emergency Lighting',
    'Fire Doors',
    'Sprinklers & Riser Mains',
    'Fixed Electrical (EICR)',
    'Water Hygiene & Legionella',
    'HVAC & Air Conditioning',
    'Refrigerant / F-Gas Systems',
    'Passenger Lifts',
    'Commercial Gas Boilers',
    'Pressure Vessels & Compressors',
    'Asbestos-Containing Materials',
    'Fall Arrest & Roof Mansafe',
  ];

  const toggleSystem = (sys: string) => {
    setSelectedSystems((prev) =>
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys]
    );
  };

  // Filtered Topics
  const filteredTopics = useMemo(() => {
    return COMPLIANCE_TOPICS.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.whatIsIt.toLowerCase().includes(q) ||
        t.evidenceRequired.some((e) => e.toLowerCase().includes(q));

      const matchesDiscipline =
        selectedDiscipline === 'all' || t.categorySlug === selectedDiscipline;

      return matchesSearch && matchesDiscipline;
    });
  }, [searchQuery, selectedDiscipline]);

  // Filtered Frequencies Table
  const filteredFrequencies = useMemo(() => {
    return INSPECTION_FREQUENCIES_LIBRARY.filter((f) => {
      const q = frequencySearch.toLowerCase().trim();
      return (
        q === '' ||
        f.system.toLowerCase().includes(q) ||
        f.activity.toLowerCase().includes(q) ||
        f.frequency.toLowerCase().includes(q) ||
        f.sourceStandard.toLowerCase().includes(q)
      );
    });
  }, [frequencySearch]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. GLOBAL LOBBY SUB-NAVIGATION ──────────────────────────── */}
      <LobbySubNav currentSection="check" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24 w-full space-y-16">
        
        {/* ── 02. HERO (AUTHORITATIVE COMPLIANCE CONTROL CENTRE) ────────── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
              The Lobby
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">CHECK</span>
          </nav>

          <div className="bg-neutral-950 text-white rounded-[4px] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden border border-neutral-800">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-900/60 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-electric/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                  THE LOBBY · CHECK
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight leading-tight text-white">
                  Know what&apos;s required.
                </h1>
                <p className="text-sm sm:text-base font-light text-neutral-400 leading-relaxed max-w-3xl">
                  A practical guide to FM compliance, statutory obligations, inspections, testing, records and evidence — with authoritative sources clearly identified.
                </p>
              </div>

              {/* Primary Compliance Search */}
              <div className="pt-2 space-y-3">
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search compliance, legislation, inspections or standards..."
                    className="w-full bg-neutral-900/90 border border-neutral-700 hover:border-neutral-500 focus:border-white rounded-[4px] py-3.5 pl-11 pr-4 text-xs sm:text-sm font-light text-white placeholder:text-neutral-500 focus:outline-none transition-colors shadow-inner"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-4" />
                </div>

                <div className="text-xs text-neutral-500 font-light">
                  Search by topic, building system, regulation or responsibility.
                </div>

                {/* Quick Topic Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mr-1">
                    Quick Filter:
                  </span>
                  {quickPills.map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery(pill.query);
                        const el = document.getElementById('topic-library');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-[2px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors text-xs border border-neutral-700/60"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Freshness Footnote */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-light text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-neutral-300">Reviewed for UK Legislation 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sourced from Primary Legislation &amp; British Standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. "WHAT DO I NEED TO CHECK?" GUIDED ASSESSMENT ─────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                FLAGSHIP GUIDED UTILITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                What do I need to check?
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Start with your building, systems and responsibilities
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Building & Role Profile */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-800 uppercase tracking-wider block">
                  1. Building Type
                </label>
                <select
                  value={selectedBuildingType}
                  onChange={(e) => setSelectedBuildingType(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {buildingTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-800 uppercase tracking-wider block">
                  2. Your Responsibility / Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[4px] p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 text-xs font-light text-neutral-600 space-y-2">
                <div className="font-medium text-neutral-900">Assessment Scope</div>
                <p>
                  Generates an indicative baseline of statutory regimes, testing cadences, and mandatory documents tailored to your estate profile.
                </p>
              </div>
            </div>

            {/* Column 2: Building Systems in Scope */}
            <div className="lg:col-span-2 space-y-3">
              <label className="text-xs font-medium text-neutral-800 uppercase tracking-wider block">
                3. Building Systems Present on Site
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {systemOptions.map((sys) => {
                  const isChecked = selectedSystems.includes(sys);
                  return (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => toggleSystem(sys)}
                      className={`p-3 rounded-[4px] border text-left text-xs transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-neutral-900 border-neutral-900 text-white font-medium shadow-2xs'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-light'
                      }`}
                    >
                      <span>{sys}</span>
                      {isChecked ? (
                        <Check className="w-3.5 h-3.5 text-brand-electric" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500">
                  {selectedSystems.length} systems selected
                </span>
                <button
                  type="button"
                  onClick={() => setAssessmentGenerated(true)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs font-medium"
                >
                  <span>Generate Indicative Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Generated Indicative Checklist Output */}
          {assessmentGenerated && (
            <div className="mt-8 pt-8 border-t border-neutral-200/90 space-y-6 animate-fadeIn">
              <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-[4px] text-xs text-amber-950 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold uppercase tracking-wider text-[10px]">
                    Indicative FM Compliance Checklist
                  </div>
                  <p className="font-light text-amber-900/90">
                    Always verify requirements against the applicable legislation, official guidance and competent professional advice for the specific building and circumstances.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light text-neutral-900">
                    Statutory Checklist for {selectedBuildingType} ({selectedRole})
                  </h3>
                  <span className="text-xs font-mono text-neutral-500">
                    {selectedSystems.length} Regimes in Scope
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSystems.map((sys, idx) => (
                    <div
                      key={sys}
                      className="p-5 rounded-[4px] border border-neutral-200 bg-neutral-50/60 space-y-2.5"
                    >
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-neutral-900">
                          {idx + 1}. {sys}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-neutral-200 text-neutral-700">
                          STATUTORY
                        </span>
                      </div>
                      <p className="text-xs font-light text-neutral-600">
                        Mandatory inspection and competent evidence required under applicable UK safety regulations.
                      </p>
                      <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 font-light">
                          Role: {selectedRole}
                        </span>
                        <Link
                          href="/tools/compliance-checker"
                          className="text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span>Screen Full Duty</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 04. COMPLIANCE QUICK ACCESS (10 CORE CATEGORIES) ─────────── */}
        <section className="space-y-6">
          <div className="border-b border-neutral-200/90 pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              STATUTORY DISCIPLINES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
              10 Core Compliance Regimes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {COMPLIANCE_DISCIPLINES.map((disc) => (
              <button
                key={disc.id}
                type="button"
                onClick={() => {
                  setSelectedDiscipline(disc.id);
                  const el = document.getElementById('topic-library');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-4 rounded-[4px] border text-left flex flex-col justify-between space-y-3 transition-colors ${
                  selectedDiscipline === disc.id
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-2xs'
                    : 'bg-white border-neutral-200/90 hover:border-neutral-400 text-neutral-900'
                }`}
              >
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono tracking-wider block ${selectedDiscipline === disc.id ? 'text-brand-electric' : 'text-neutral-400'}`}>
                    {disc.shortCode}
                  </span>
                  <h3 className="text-sm font-normal leading-snug">
                    {disc.name}
                  </h3>
                </div>
                <div className="text-[11px] font-light text-neutral-500 truncate">
                  {disc.enforcingBody}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── 05. STATUTORY COMPLIANCE CHECKER HERO CTA ───────────────── */}
        <section className="bg-neutral-950 text-white border border-neutral-800 rounded-[4px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-black pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                  INTERACTIVE COMPLIANCE ENGINE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
                Statutory Compliance Checker
              </h2>
              <p className="text-xs sm:text-sm font-light text-neutral-400 leading-relaxed">
                Execute an indicative compliance screening across 10 UK statutory regimes. Identify potential documentation gaps, determine responsible persons, and download an action plan.
              </p>
              <div className="flex items-center gap-6 text-xs text-neutral-400 font-light pt-2">
                <span>10 Regimes Evaluated</span>
                <span>·</span>
                <span>Instant PDF / CSV Export</span>
                <span>·</span>
                <span>Zero Fake Compliance Scores</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools/compliance-checker"
                className="px-6 py-3.5 bg-brand-electric hover:bg-brand-electric/90 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 font-medium shadow-md"
              >
                <span>Launch Compliance Checker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/compliance-calendar"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>52-Week Calendar</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 06. "WHAT EVIDENCE SHOULD I HOLD?" EVIDENCE CENTRE ──────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                DOCUMENTARY GOVERNANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                What evidence should I hold?
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Typical evidence · Requirements vary by building, system, risk &amp; statute
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVIDENCE_REGISTER.map((ev, i) => (
              <div
                key={ev.evidenceType}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span className="text-brand-electric font-semibold uppercase">{ev.system}</span>
                    <span>{ev.retentionPeriod}</span>
                  </div>

                  <h3 className="text-base font-normal text-neutral-900 leading-snug">
                    {ev.evidenceType}
                  </h3>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-[11px] font-light text-neutral-500">
                  <strong>Statutory Basis:</strong> {ev.statutoryBasis}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 07. "HOW OFTEN?" LIBRARY (INSPECTION FREQUENCIES) ────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                TESTING FREQUENCY MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Inspection &amp; Testing Frequencies
              </h2>
            </div>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={frequencySearch}
                onChange={(e) => setFrequencySearch(e.target.value)}
                placeholder="Filter frequencies..."
                className="w-full bg-white border border-neutral-300 rounded-[4px] py-1.5 pl-8 pr-3 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-[4px] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">System</th>
                    <th className="py-3 px-4">Requirement / Activity</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Authoritative Source</th>
                    <th className="py-3 px-4">Duty Holder &amp; Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-light text-neutral-800">
                  {filteredFrequencies.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-neutral-900 whitespace-nowrap">
                        {row.system}
                      </td>
                      <td className="py-3.5 px-4">{row.activity}</td>
                      <td className="py-3.5 px-4 font-mono text-neutral-900 font-normal whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-[2px] bg-neutral-100 border border-neutral-200 text-[11px]">
                          {row.frequency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {row.sourceStandard}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 max-w-xs text-[11px] leading-relaxed">
                        <strong className="text-neutral-700">{row.dutyHolder}:</strong> {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-50/60 border-t border-neutral-200 text-[11px] text-neutral-500 font-light flex items-center justify-between">
              <span>Frequencies can vary based on risk assessment, equipment age, manufacturer recommendations, and building use.</span>
              <Link href="/tools/compliance-calendar" className="text-brand-electric font-medium hover:underline">
                Open 52-Week Statutory Calendar &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── 08. COMPLIANCE GAP REVIEW (OBJECTIVE EVIDENCE STATUS) ────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                AUDIT ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Compliance Gap Review
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Clear evidence classifications · Zero arbitrary percentage scores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { status: 'KNOWN', color: 'bg-emerald-500', desc: 'Documented, valid & evidenced' },
              { status: 'DUE', color: 'bg-amber-500', desc: 'Approaching statutory re-inspection' },
              { status: 'MISSING', color: 'bg-rose-500', desc: 'No record on file' },
              { status: 'EXPIRED', color: 'bg-purple-500', desc: 'Superseded or lapsed interval' },
              { status: 'UNKNOWN', color: 'bg-neutral-400', desc: 'Duty boundary unestablished' },
            ].map((st) => (
              <div
                key={st.status}
                className="p-4 rounded-[4px] border border-neutral-200 bg-neutral-50 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.color}`} />
                  <span className="text-xs font-mono font-bold text-neutral-800 tracking-wider">
                    {st.status}
                  </span>
                </div>
                <p className="text-[11px] font-light text-neutral-500 leading-snug">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs font-light text-neutral-600 leading-relaxed">
            Statutory compliance cannot be reduced to a subjective percentage such as &quot;84% compliant&quot; because a single missing fire door inspection or overdue Legionella risk assessment creates criminal liability regardless of other documented regimes. We evaluate estates on absolute documentary evidence.
          </p>
        </section>

        {/* ── 09. RECENT REGULATORY CHANGES (CONNECTED TO KNOW) ────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                INTELLIGENCE SYNC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Recent Regulatory Changes
              </h2>
            </div>
            <Link href="/lobby/know" className="text-xs text-brand-electric hover:underline font-light">
              View Full KNOW Intelligence Feed &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                topic: 'Building Safety Act 2022',
                change: 'Mandatory Occurrence Reporting in force for Higher-Risk Buildings (HRBs). 10-day notice window to BSR.',
                date: 'In Force 2026',
                source: 'Building Safety Regulator',
                href: '/lobby/know',
              },
              {
                topic: 'F-Gas Phase-Down (EU 2024/573 & UK)',
                change: 'Accelerated quota reductions for HFCs with GWP >2500. New mandatory servicing log criteria.',
                date: 'Updated 2026',
                source: 'DEFRA / Environment Agency',
                href: '/lobby/know',
              },
              {
                topic: 'Fire Safety (England) Regulations',
                change: 'Quarterly communal fire door checks & annual flat entrance door checks in residential blocks >11m.',
                date: 'Statutory Obligation',
                source: 'Home Office Guidance',
                href: '/lobby/check/fire-doors',
              },
            ].map((item) => (
              <div
                key={item.topic}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span className="text-brand-electric font-semibold uppercase">{item.topic}</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-xs font-light text-neutral-700 leading-relaxed">
                    {item.change}
                  </p>
                  <div className="text-[11px] font-mono text-neutral-400 pt-1">
                    Source: {item.source}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <Link href={item.href} className="text-xs text-brand-electric hover:underline font-medium inline-flex items-center gap-1">
                    <span>CHECK THE REQUIREMENT</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. LEGISLATION & OFFICIAL GUIDANCE DIRECTORY ─────────────── */}
        <section className="space-y-6">
          <div className="border-b border-neutral-200/90 pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              PRIMARY STATUTORY REPOSITORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
              Legislation &amp; Official Guidance
            </h2>
          </div>

          <div className="space-y-3">
            {LEGISLATION_DIRECTORY.map((leg) => (
              <div
                key={leg.id}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 hover:border-neutral-400 transition-colors"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-brand-electric font-semibold">{leg.topic}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500">{leg.issuingBody} ({leg.inForceYear})</span>
                    <span className="text-neutral-400">·</span>
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-700">
                      {leg.status}
                    </span>
                  </div>

                  <h3 className="text-base font-normal text-neutral-900">
                    {leg.title}
                  </h3>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {leg.summary}
                  </p>
                </div>

                <a
                  href={leg.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-brand-electric hover:underline inline-flex items-center gap-1 font-medium self-start sm:self-center"
                >
                  <span>legislation.gov.uk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── 11. COMPLIANCE TOPIC LIBRARY (DETAILED TOPIC CARDS) ──────── */}
        <section id="topic-library" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                DEEP-DIVE GUIDES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                Compliance Topic Library
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-light">Discipline Filter:</span>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="bg-white border border-neutral-300 rounded-[2px] px-2 py-1 text-xs text-neutral-800 focus:outline-none"
              >
                <option value="all">All Disciplines</option>
                <option value="fire">Fire &amp; Life Safety</option>
                <option value="electrical">Electrical Systems</option>
                <option value="water">Water Hygiene</option>
                <option value="hvac">HVAC &amp; Refrigerant</option>
                <option value="lifting">Lifting &amp; Access</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTopics.map((topic) => (
              <div
                key={topic.slug}
                className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-5 hover:border-neutral-400 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-brand-electric uppercase font-semibold">
                      {topic.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {topic.statusContext}
                    </span>
                  </div>

                  <h3 className="text-xl font-light text-neutral-900 leading-snug">
                    {topic.title}
                  </h3>

                  <p className="text-xs font-light text-neutral-600 leading-relaxed">
                    {topic.whatIsIt}
                  </p>

                  <div className="space-y-2 text-xs font-light text-neutral-600 pt-1">
                    <div>
                      <strong className="text-neutral-800">Responsible Person:</strong> {topic.whoIsResponsible}
                    </div>
                    <div>
                      <strong className="text-neutral-800">Frequency:</strong> {topic.howOften}
                    </div>
                    <div>
                      <strong className="text-neutral-800">Required Evidence:</strong>{' '}
                      {topic.evidenceRequired.slice(0, 2).join('; ')}...
                    </div>
                  </div>

                  {/* EntireFM Practical Interpretation Box */}
                  <div className="p-3.5 bg-neutral-50 rounded-[4px] border border-neutral-200 text-xs text-neutral-600 space-y-1">
                    <span className="text-[9.5px] uppercase font-mono tracking-wider text-neutral-500 font-semibold block">
                      EntireFM Practical Guidance
                    </span>
                    <p className="font-light leading-relaxed">
                      {topic.entireFmGuidance}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] font-mono text-neutral-400">
                    Reviewed: {topic.lastReviewedDate}
                  </div>
                  <div className="flex items-center gap-3">
                    {topic.relatedDoToolUrl && (
                      <Link
                        href={topic.relatedDoToolUrl}
                        className="text-neutral-600 hover:text-neutral-900 font-medium text-[11px]"
                      >
                        DO Tool &rarr;
                      </Link>
                    )}
                    <Link
                      href={`/lobby/check/${topic.slug}`}
                      className="text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>Full Statutory Specification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 12. PROFESSIONAL DISCLAIMER / TRUST LAYER ────────────────── */}
        <section className="bg-neutral-100/80 border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 text-xs text-neutral-600 space-y-2">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold uppercase tracking-wider text-[10px]">
            <Info className="w-4 h-4 text-neutral-700" />
            <span>Professional Statutory Disclaimer &amp; Competent Person Notice</span>
          </div>
          <p className="font-light leading-relaxed">
            EntireFM provides practical compliance information, inspection schedules, and documentary tools intended to assist facilities managers and property professionals in organizing statutory duties. Requirements vary depending on building classification, occupancy, equipment specification, contractual lease obligations, and site-specific risk assessments. The content on this platform does not constitute formal legal counsel or statutory sign-off. Statutory examinations (e.g. LOLER, PSSR, EICR, Gas Safety) must always be executed by formally qualified competent persons and certified accredited bodies.
          </p>
        </section>

        {/* ── 13. KNOWLEDGE GRAPH NAVIGATION (CROSS-LINKING 6 WORLDS) ──── */}
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
              <span className="text-neutral-400 text-[10px] block">03 · WORKBENCH</span>
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
