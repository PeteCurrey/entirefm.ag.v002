'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Wrench,
  Compass,
  Download,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import type { FmTool } from '@/data/lobby/toolbox-data';
import { getToolIcon } from './TemplateLobbyDo';

export interface ToolDetailData extends FmTool {
  whatItDoes: string[];
  whenToUseIt: string[];
  inputsRequired: string[];
  outputDetails: string[];
  methodologyNotes: string;
  relatedCheckUrl?: string;
  relatedKnowUrl?: string;
  relatedFindUrl?: string;
  relatedLearnUrl?: string;
  relatedConnectUrl?: string;
}

interface TemplateLobbyDoToolDetailProps {
  tool: ToolDetailData;
}

export function TemplateLobbyDoToolDetail({ tool }: TemplateLobbyDoToolDetailProps) {
  const Icon = getToolIcon(tool.iconName);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      
      {/* ── 01. SECONDARY SUB-NAVIGATION BAR ─────────────────────────── */}
      <LobbySubNav currentSection="do" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">
        
        {/* ── 02. BREADCRUMBS ─────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
            The Lobby
          </Link>
          <span>/</span>
          <Link href="/lobby/do" className="hover:text-neutral-900 transition-colors">
            DO
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{tool.name}</span>
        </nav>

        {/* ── 03. TOOL SPECIFICATION HEADER ───────────────────────────── */}
        <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-[2px] bg-neutral-100 text-[10px] font-mono uppercase text-neutral-700 border border-neutral-200">
                  {tool.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Est. Completion: {tool.estTime}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-[4px] bg-neutral-50 border border-neutral-100 text-brand-electric shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
                  {tool.name}
                </h1>
              </div>

              <p className="text-sm sm:text-base font-light text-neutral-600 leading-relaxed max-w-3xl">
                {tool.description}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0 pt-2 sm:pt-0">
              <Link
                href={tool.launchUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs font-medium"
              >
                <span>START TOOL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Target Audience Pills */}
          <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs font-light text-neutral-500">
            <span className="text-[10px] uppercase font-mono text-neutral-400 mr-1">Recommended for:</span>
            {tool.targetRoles.map((role) => (
              <span key={role} className="px-2.5 py-0.5 rounded-[2px] bg-neutral-50 border border-neutral-200 text-neutral-700">
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* ── 04. WHAT IT DOES & WHEN TO USE IT ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* What It Does */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-normal text-neutral-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What It Does</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-neutral-600">
              {tool.whatItDoes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-brand-electric font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to Use It */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-normal text-neutral-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-electric" />
              <span>When to Use It</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-neutral-600">
              {tool.whenToUseIt.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-brand-electric font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── 05. INPUTS & OUTPUTS SPECIFICATION ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inputs Required */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-normal text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-700" />
              <span>Inputs Required</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-neutral-600">
              {tool.inputsRequired.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-mono">[{idx + 1}]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Will Be Generated */}
          <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-normal text-neutral-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-neutral-700" />
              <span>Generated Output</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-neutral-600">
              {tool.outputDetails.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-mono">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── 06. METHODOLOGY & CONTEXTUAL LIMITATIONS ─────────────────── */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-[4px] p-5 sm:p-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-semibold uppercase tracking-wider text-[10px]">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Important Methodological Context &amp; Scope</span>
          </div>
          <p className="font-light leading-relaxed text-amber-900/90">
            {tool.methodologyNotes}
          </p>
          {tool.limitationNote && (
            <p className="font-light leading-relaxed text-amber-900/90 pt-1 border-t border-amber-200/60">
              <strong>Professional Standard:</strong> {tool.limitationNote}
            </p>
          )}
        </div>

        {/* ── 07. CONNECTED LOBBY ECOSYSTEM CROSS-LINKS ─────────────────── */}
        <div className="bg-white border border-neutral-200/90 rounded-[4px] p-6 sm:p-8 shadow-2xs space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold block">
            THE CONNECTED LOBBY
          </span>
          <h3 className="text-xl font-extralight text-neutral-900">
            Related Resources Across The Lobby
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <Link
              href={tool.relatedCheckUrl || '/lobby/check'}
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">CHECK</span>
              <h4 className="text-sm font-normal text-neutral-900">Compliance Obligation</h4>
              <p className="text-[11px] font-light text-neutral-500">Review statutory duties &rarr;</p>
            </Link>

            <Link
              href={tool.relatedKnowUrl || '/lobby/know'}
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">KNOW</span>
              <h4 className="text-sm font-normal text-neutral-900">Market Intelligence</h4>
              <p className="text-[11px] font-light text-neutral-500">See latest regulatory shifts &rarr;</p>
            </Link>

            <Link
              href={tool.relatedFindUrl || '/lobby/find'}
              className="p-4 bg-neutral-50 rounded-[4px] border border-neutral-200 hover:border-neutral-400 transition-colors space-y-1"
            >
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">FIND</span>
              <h4 className="text-sm font-normal text-neutral-900">Verified Suppliers</h4>
              <p className="text-[11px] font-light text-neutral-500">Source vetted trade contractors &rarr;</p>
            </Link>
          </div>
        </div>

        {/* ── 08. BOTTOM LAUNCH BAR ────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200/90">
          <Link
            href="/lobby/do"
            className="text-xs font-light text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1"
          >
            <span>&larr; Back to FM Toolbox</span>
          </Link>

          <Link
            href={tool.launchUrl}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-2xs font-medium inline-flex items-center gap-2"
          >
            <span>Launch Tool Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
