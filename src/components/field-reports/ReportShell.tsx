'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Clock, ShieldCheck, Download, Printer } from 'lucide-react';
import type { FullReportPack, ReportStatus } from '@/server/field-reports/types';

interface Props {
  pack: FullReportPack;
  activeSectionIndex: number;
  totalSections: number;
  completedSections: number;
  autosaveState: 'SAVING' | 'SAVED' | 'ERROR';
  onSelectSection: (index: number) => void;
  children: React.ReactNode;
  onSubmitReport?: () => void;
  isSubmitting?: boolean;
}

export default function ReportShell({
  pack,
  activeSectionIndex,
  totalSections,
  completedSections,
  autosaveState,
  onSelectSection,
  children,
  onSubmitReport,
  isSubmitting,
}: Props) {
  const { instance, template } = pack;
  const isIssued = instance.status === 'ISSUED' || instance.status === 'APPROVED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* ── STICKY OPERATIONAL HEADER ── */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={instance.visit_id ? `/engineer/visits/${instance.visit_id}` : '/engineer/jobs'}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-400">{template.template_code}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  REV 4.0
                </span>
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  isIssued ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {instance.status}
                </span>
              </div>
              <h1 className="text-sm font-semibold text-white truncate">{instance.site?.name || 'Site Estate'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* AUTOSAVE PILL */}
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-mono">
                {autosaveState === 'SAVING' && <span className="text-amber-400 animate-pulse">SAVING…</span>}
                {autosaveState === 'SAVED' && <span className="text-emerald-400">✓ SAVED</span>}
                {autosaveState === 'ERROR' && <span className="text-rose-400">SAVE FAILED</span>}
              </div>
              <div className="text-[10px] text-slate-400">
                {completedSections} of {totalSections} steps
              </div>
            </div>

            {/* PRINT / PDF BUTTONS */}
            <a
              href={`/api/field/reports/${instance.id}/pdf?format=html`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Document View"
            >
              <Printer className="w-4 h-4" />
            </a>
            <a
              href={`/api/field/reports/${instance.id}/pdf?format=pdf`}
              download={`${instance.report_number}.pdf`}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Download Controlled PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${Math.round((completedSections / Math.max(totalSections, 1)) * 100)}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── WORK ORDER CONTEXT STRIP ── */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-300">WO: {instance.work_order?.work_order_number || 'N/A'}</span>
            <span>&bull;</span>
            <span className="truncate max-w-[260px]">{instance.work_order?.title || instance.title}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            REF: {instance.report_number}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* ── FIXED BOTTOM SUBMIT BAR (Mobile-Optimised) ── */}
      {!isIssued && onSubmitReport && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-white">{completedSections} of {totalSections}</span> sections completed
            </div>
            <button
              onClick={onSubmitReport}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-950 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Finalising Document…' : 'Complete & Issue Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
