'use client';

import React, { useState, useMemo } from 'react';
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
  Wrench,
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Filter,
  Flame,
  Zap,
  Droplets,
  Wind,
  Bookmark,
  FolderOpen,
  Info,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';

import {
  FM_TOOLBOX_DATA,
  TASK_LIST,
  ROLE_LIST,
  type ToolCategory,
  type FmTool,
} from '@/data/lobby/toolbox-data';

export function getToolIcon(name: string) {
  switch (name) {
    case 'FileSpreadsheet':
      return FileSpreadsheet;
    case 'FileCode2':
      return FileCode2;
    case 'ScanLine':
      return ScanLine;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'Calculator':
      return Calculator;
    case 'Sliders':
      return Sliders;
    case 'Compass':
      return Compass;
    case 'Plane':
      return Plane;
    case 'Calendar':
      return Calendar;
    case 'Download':
      return Download;
    case 'CheckSquare':
      return CheckSquare;
    case 'FileCheck':
      return FileCheck;
    case 'CheckCircle2':
      return CheckCircle2;
    case 'FileText':
      return FileText;
    case 'Cpu':
      return Cpu;
    case 'Sparkles':
      return Sparkles;
    default:
      return Wrench;
  }
}

export function TemplateLobbyDo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('ALL');
  const [selectedTask, setSelectedTask] = useState<string>('All Tasks');
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');

  const categories: ToolCategory[] = ['ALL', 'CALCULATE', 'GENERATE', 'CHECK', 'PLAN', 'TEMPLATES', 'AI FOR FM'];

  // Filter tools based on category, task, role, and search query
  const filteredTools = useMemo(() => {
    return FM_TOOLBOX_DATA.filter((tool) => {
      const matchesCategory = activeCategory === 'ALL' || tool.category === activeCategory;
      const matchesTask = selectedTask === 'All Tasks' || tool.tasks.includes(selectedTask);
      const matchesRole = selectedRole === 'All Roles' || tool.targetRoles.includes(selectedRole);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        q === '' ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.outputDescription.toLowerCase().includes(q);

      return matchesCategory && matchesTask && matchesRole && matchesQuery;
    });
  }, [activeCategory, selectedTask, selectedRole, searchQuery]);

  const featuredTools = useMemo(() => {
    return FM_TOOLBOX_DATA.filter((t) => t.isFeatured && t.status === 'ACTIVE');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="do" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24 w-full space-y-16">
        
        {/* ── 02. EDITORIAL HERO (FUNCTIONAL WORKBENCH MASTHEAD) ───────── */}
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
                THE LOBBY · DO
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
                Get the work done.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                Practical FM tools, calculators, generators, checklists and AI utilities designed to make everyday facilities and property management work faster and easier.
              </p>
            </div>

            {/* Workbench Principles Bar */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-light text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-900 font-medium">15 Operational Tools &amp; Templates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>SFG20 &amp; Statutory Aligned Outputs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                <span>Task-Driven Workflow Desk</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 03. PRIMARY TASK SEARCH & SUGGESTED ACTION SHORTCUTS ─────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need to do? (e.g. Build a PPM schedule, calculate costs, check contractor...)"
              className="w-full bg-neutral-50 border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-[4px] py-3 pl-11 pr-4 text-xs sm:text-sm font-light text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-light text-neutral-500">
            <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 mr-1">
              Suggested:
            </span>
            {[
              'Build a PPM schedule',
              'Create a tender brief',
              'Check contractor documents',
              'Calculate FM costs',
              'Create a checklist',
              'Prepare for mobilisation',
            ].map((shortcut) => (
              <button
                key={shortcut}
                type="button"
                onClick={() => setSearchQuery(shortcut)}
                className="px-2.5 py-1 rounded-[2px] bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700 transition-colors text-xs"
              >
                {shortcut}
              </button>
            ))}
          </div>
        </section>

        {/* ── 04. START WITH A TASK (WHAT ARE YOU TRYING TO DO?) ───────── */}
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                INTENT-DRIVEN NAVIGATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                What are you trying to do?
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500 hidden sm:inline">
              Select your goal to filter relevant tools
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {TASK_LIST.filter((t) => t !== 'All Tasks').map((task) => {
              const isSelected = selectedTask === task;
              return (
                <button
                  key={task}
                  type="button"
                  onClick={() => {
                    setSelectedTask(isSelected ? 'All Tasks' : task);
                  }}
                  className={`p-4 rounded-[4px] border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span className="font-normal text-xs leading-snug">{task}</span>
                  <span className={`text-[10px] font-mono mt-2 inline-flex items-center gap-1 ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                    <span>Filter tools</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </button>
              );
            })}
          </div>

          {selectedTask !== 'All Tasks' && (
            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span>Filtering by task: <strong>{selectedTask}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedTask('All Tasks')}
                className="text-brand-electric hover:underline"
              >
                Reset task filter
              </button>
            </div>
          )}
        </section>

        {/* ── 05. ROLE SELECTOR (LIGHTWEIGHT PERSONALISATION) ──────────── */}
        <section className="bg-neutral-50 border border-neutral-200/80 rounded-[4px] p-5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-medium text-neutral-800">
              Filter by Your Professional Role:
            </span>
            {selectedRole !== 'All Roles' && (
              <button
                type="button"
                onClick={() => setSelectedRole('All Roles')}
                className="text-xs text-brand-electric hover:underline text-left sm:text-right"
              >
                Clear role filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {ROLE_LIST.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                      : 'bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 font-light'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 06. FEATURED HIGH-VALUE TOOLS (SURFACED PROMINENTLY) ──────── */}
        {activeCategory === 'ALL' && selectedTask === 'All Tasks' && searchQuery === '' && (
          <section className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-neutral-200/90 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                  FLAGSHIP WORKBENCH
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                  Featured Tools
                </h2>
              </div>
              <span className="text-xs font-light text-neutral-500 hidden sm:inline">
                Most utilized operational generators &amp; diagnostic checkers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool) => {
                const Icon = getToolIcon(tool.iconName);
                return (
                  <div
                    key={tool.id}
                    className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[4px] p-6 shadow-2xs flex flex-col justify-between space-y-5 transition-all group"
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
                          <Icon className="w-5 h-5 text-brand-electric" />
                        </div>
                        <h3 className="text-base font-medium text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                          {tool.name}
                        </h3>
                      </div>

                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="p-2.5 bg-neutral-50 rounded-[2px] border border-neutral-100 text-[11px] text-neutral-500 font-light">
                        <strong className="text-neutral-700 font-medium">Output:</strong> {tool.outputDescription}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={tool.launchUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 group-hover:text-brand-electric"
                      >
                        <span>USE TOOL</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 07. MASTER TOOL DIRECTORY (FILTERABLE CATEGORIES) ─────────── */}
        <section className="space-y-6">
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

            <span className="text-xs font-mono text-neutral-500 shrink-0">
              Showing {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = getToolIcon(tool.iconName);
              const isComingSoon = tool.status === 'COMING_SOON';

              return (
                <div
                  key={tool.id}
                  className={`bg-white border rounded-[4px] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-6 transition-all ${
                    isComingSoon
                      ? 'border-neutral-200/60 opacity-75'
                      : 'border-neutral-200/90 hover:border-neutral-400 group'
                  }`}
                >
                  <div className="space-y-3.5">
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
                      <h3 className="text-base sm:text-lg font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">
                        {tool.name}
                      </h3>
                    </div>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="p-2.5 bg-neutral-50/80 rounded-[2px] border border-neutral-100 text-[11px] text-neutral-500 font-light space-y-1">
                      <div><strong className="text-neutral-700 font-medium">Output:</strong> {tool.outputDescription}</div>
                      {tool.limitationNote && (
                        <div className="text-[10.5px] text-neutral-400 italic">
                          Note: {tool.limitationNote}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    {isComingSoon ? (
                      <span className="text-xs font-mono uppercase text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-[2px]">
                        Coming Soon (Roadmap)
                      </span>
                    ) : (
                      <Link
                        href={tool.launchUrl}
                        className="inline-flex items-center gap-1.5 font-medium text-neutral-900 group-hover:text-brand-electric"
                      >
                        <span>USE TOOL</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}

                    <div className="flex items-center gap-2 text-neutral-400 font-light">
                      <Link href="/lobby/check" className="hover:text-brand-electric text-[11px]">
                        CHECK &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 08. AI FOR FM (OPERATIONAL UTILITIES) ────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-electric bg-brand-electric/10 px-2.5 py-0.5 rounded-[2px]">
                  AI FOR FM
                </span>
                <span className="text-xs text-neutral-400 font-light">· Applied Practical Utilities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
                Artificial Intelligence Grounded in UK Building Operations
              </h2>
            </div>

            <span className="text-xs font-light text-neutral-500 max-w-sm">
              AI assists professionals — it does not replace competent-person assessment, statutory testing, or engineering sign-off.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Utility 1: Multimodal Intake */}
            <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-[4px] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Fully Operational Engine</span>
                </div>
                <h3 className="text-lg font-light text-neutral-900">
                  Multimodal Work Order Intake (Vision Triage)
                </h3>
                <p className="text-xs font-light text-neutral-600 leading-relaxed">
                  Upload plantroom photographs, plantplates, or audio notes. The engine parses equipment serial numbers, identifies fault codes, and drafts a structured work order with trade routing.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/70">
                <Link
                  href="/log-a-job"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Launch Multimodal Intake</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* AI Utility 2: Ask The Lobby */}
            <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-[4px] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Grounded Research Desk</span>
                </div>
                <h3 className="text-lg font-light text-neutral-900">
                  Ask The Lobby Statutory &amp; Technical Desk
                </h3>
                <p className="text-xs font-light text-neutral-600 leading-relaxed">
                  Query UK statutory instruments, Approved Codes of Practice, and CIBSE guidelines with verified citations. Produces cited technical memos for property stakeholders.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/70">
                <Link
                  href="/lobby/ask"
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs"
                >
                  <span>Open Research Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── 09. FM WORKFLOWS (MULTI-STEP TASK JOURNEYS) ─────────────── */}
        <section id="workflows" className="space-y-6 scroll-mt-20">
          <div className="border-b border-neutral-200/90 pb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              END-TO-END OPERATIONAL ROADMAPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight mt-0.5">
              FM Workflows
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 mt-1 max-w-3xl">
              Structured multi-step task journeys guiding facilities teams through complex estate handovers, contractor audits, and mobilisation cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Workflow 1: Building Handover */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-electric block font-semibold">
                  7-STEP WORKFLOW
                </span>
                <h3 className="text-lg font-light text-neutral-900">Building Handover</h3>
                <p className="text-xs font-light text-neutral-600">Taking over management of an incoming commercial building.</p>
              </div>

              <ol className="space-y-2 text-xs font-light text-neutral-700 border-t border-neutral-100 pt-3">
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">01</span>
                  <span>Gather building O&amp;M documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">02</span>
                  <span>Extract plantplate asset serials (Asset Scanner)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">03</span>
                  <span>Verify statutory compliance evidence (CHECK)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">04</span>
                  <span>Draft missing certificate snagging deed</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">05</span>
                  <span>Construct 52-week maintenance model (DO)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">06</span>
                  <span>Audit sub-contractor competency matrices</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">07</span>
                  <span>Final mobilisation sign-off</span>
                </li>
              </ol>

              <div className="pt-2 border-t border-neutral-100">
                <Link
                  href="/tools/asset-scanner"
                  className="text-xs font-medium text-brand-electric hover:underline inline-flex items-center gap-1"
                >
                  <span>Start Step 02: Scan Assets &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Workflow 2: Contractor Onboarding */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-electric block font-semibold">
                  9-STEP WORKFLOW
                </span>
                <h3 className="text-lg font-light text-neutral-900">Contractor Onboarding</h3>
                <p className="text-xs font-light text-neutral-600">Vetting third-party trade partners prior to site permit clearance.</p>
              </div>

              <ol className="space-y-2 text-xs font-light text-neutral-700 border-t border-neutral-100 pt-3">
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">01</span>
                  <span>Collect company registration &amp; bank details</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">02</span>
                  <span>Verify £10M / £5M liability insurance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">03</span>
                  <span>Check SSIP accreditation status</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">04</span>
                  <span>Review task-specific RAMS document</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">05</span>
                  <span>Audit engineer CSCS / Gas Safe / REFCOM cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">06</span>
                  <span>Complete building safety induction</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">07</span>
                  <span>Verify waste carrier license where applicable</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">08</span>
                  <span>Issue authorised permit-to-work</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">09</span>
                  <span>Annual re-vetting trigger</span>
                </li>
              </ol>

              <div className="pt-2 border-t border-neutral-100">
                <Link
                  href="/contractor-tools/contractor-compliance-check"
                  className="text-xs font-medium text-brand-electric hover:underline inline-flex items-center gap-1"
                >
                  <span>Audit Contractor (DO) &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Workflow 3: FM Mobilisation */}
            <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-brand-electric block font-semibold">
                  10-STEP WORKFLOW
                </span>
                <h3 className="text-lg font-light text-neutral-900">FM Contract Mobilisation</h3>
                <p className="text-xs font-light text-neutral-600">Executing a seamless 90-day transition for Hard and Total FM.</p>
              </div>

              <ol className="space-y-2 text-xs font-light text-neutral-700 border-t border-neutral-100 pt-3">
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">01</span>
                  <span>Execute contract agreement &amp; SLAs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">02</span>
                  <span>Establish CAFM client portal &amp; site hierarchy</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">03</span>
                  <span>Complete physical plantroom asset validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">04</span>
                  <span>Load 52-week SFG20 maintenance schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">05</span>
                  <span>Validate statutory certificates &amp; logbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">06</span>
                  <span>Integrate supply chain SLA attendance windows</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">07</span>
                  <span>TUPE staff transfer consultation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">08</span>
                  <span>Configure client reporting dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">09</span>
                  <span>Deliver tenant mobilisation briefing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400 text-[10px]">10</span>
                  <span>Operational Go-Live</span>
                </li>
              </ol>

              <div className="pt-2 border-t border-neutral-100">
                <Link
                  href="/tools/tender-brief"
                  className="text-xs font-medium text-brand-electric hover:underline inline-flex items-center gap-1"
                >
                  <span>Build Mobilisation Brief &rarr;</span>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── 10. MY WORK (SAVED WORK & TOOL HISTORY ARCHITECTURE) ─────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
                PERSONAL WORKBENCH VAULT
              </span>
              <h2 className="text-2xl font-extralight text-neutral-900 tracking-tight mt-0.5">
                My Work
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-500">
              Generated schedules, tender drafts, and saved audits
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Status: Active Session</span>
              <h4 className="text-sm font-normal text-neutral-900">Recent Tools</h4>
              <p className="text-[11px] text-neutral-500 font-light">
                Quick-resume tools used during your current browser session.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Status: Member Vault</span>
              <h4 className="text-sm font-normal text-neutral-900">Saved Drafts</h4>
              <p className="text-[11px] text-neutral-500 font-light">
                Tender specifications and PPM matrix configurations saved to your account.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Status: Export Ready</span>
              <h4 className="text-sm font-normal text-neutral-900">Completed Outputs</h4>
              <p className="text-[11px] text-neutral-500 font-light">
                Downloaded spreadsheets, PDF briefs, and scanned asset registers.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200/70 space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Member Access</span>
                <h4 className="text-sm font-normal text-neutral-900">Cloud Sync</h4>
                <p className="text-[11px] text-neutral-500 font-light">
                  Access saved work across desktop and field devices.
                </p>
              </div>
              <Link href="/lobby/me" className="text-brand-electric font-medium hover:underline pt-2">
                Open Workspace &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── 11. "FROM QUESTION TO OUTPUT" (WORKFLOW DEMONSTRATION) ───── */}
        <section className="bg-stone-100/80 border border-stone-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              THE INTERCONNECTED WORKBENCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              From Question to Output
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              EntireFM is not a collection of isolated tools. It is an interconnected operational engine that converts business tasks into structured documentation and verified outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-xs">
            <div className="p-4 bg-white rounded-[4px] border border-neutral-200 space-y-1">
              <span className="text-neutral-400 font-mono text-[10px]">STEP 01 · TASK</span>
              <h4 className="text-sm font-medium text-neutral-900">Task Arrives</h4>
              <p className="text-[11px] text-neutral-500 font-light">&quot;I need to tender an M&amp;E maintenance contract.&quot;</p>
            </div>

            <div className="p-4 bg-white rounded-[4px] border border-neutral-200 space-y-1">
              <span className="text-neutral-400 font-mono text-[10px]">STEP 02 · DO</span>
              <h4 className="text-sm font-medium text-neutral-900">Launch Tool</h4>
              <p className="text-[11px] text-neutral-500 font-light">Tender Brief Generator &amp; PPM Builder model scopes.</p>
            </div>

            <div className="p-4 bg-white rounded-[4px] border border-neutral-200 space-y-1">
              <span className="text-neutral-400 font-mono text-[10px]">STEP 03 · OUTPUT</span>
              <h4 className="text-sm font-medium text-neutral-900">Structured Brief</h4>
              <p className="text-[11px] text-neutral-500 font-light">Produces neutral technical specification document.</p>
            </div>

            <div className="p-4 bg-white rounded-[4px] border border-neutral-200 space-y-1">
              <span className="text-neutral-400 font-mono text-[10px]">STEP 04 · FIND</span>
              <h4 className="text-sm font-medium text-neutral-900">Source Suppliers</h4>
              <p className="text-[11px] text-neutral-500 font-light">Invite verified trade contractors directly via FIND.</p>
            </div>

            <div className="p-4 bg-white rounded-[4px] border border-neutral-200 space-y-1">
              <span className="text-neutral-400 font-mono text-[10px]">STEP 05 · CHECK</span>
              <h4 className="text-sm font-medium text-neutral-900">Verify Vetting</h4>
              <p className="text-[11px] text-neutral-500 font-light">Audit bidder insurance and statutory accreditations.</p>
            </div>
          </div>
        </section>

        {/* ── 12. CROSS-LINKING TO REMAINING 5 LOBBY AREAS ─────────────── */}
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

        {/* ── 13. RESTRAINED FOOTER CTA ────────────────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-8 sm:p-12 shadow-2xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
              STAY AHEAD OF FM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 tracking-tight">
              Get the work done, without administrative friction.
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
              EntireFM builds practical operational tooling so property teams can focus on running safer, more compliant, and more efficient commercial buildings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/lobby"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors inline-flex items-center gap-2 shadow-2xs"
            >
              <span>Explore The Lobby</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/lobby/check"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>View Compliance Centre (CHECK)</span>
            </Link>

            <Link
              href="/lobby/find"
              className="px-5 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs rounded-[4px] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Opportunities (FIND)</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
