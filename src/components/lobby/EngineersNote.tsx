import React from 'react';
import Link from 'next/link';
import { Wrench, Terminal, Cpu, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import type { EngineersNoteItem } from '@/data/lobby/types';

interface EngineersNoteProps {
  data: EngineersNoteItem;
}

export function EngineersNote({ data }: EngineersNoteProps) {
  return (
    <div className="border border-brand-edge-dark bg-brand-carbon text-white rounded-sm overflow-hidden shadow-elevated">
      {/* Header Bar */}
      <div className="bg-brand-void border-b border-brand-edge-dark px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-brand-electric/20 text-brand-electric-bright border border-brand-electric/40 text-[10px] font-mono">
            EN
          </span>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand-electric-bright">
            THE ENGINEER’S NOTE · Technical Diagnostic
          </span>
        </div>
        <span className="text-[11px] font-mono text-brand-mist/50">
          Discipline: {data.discipline}
        </span>
      </div>

      <div className="p-6 sm:p-8 lg:p-10 space-y-6">
        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug tracking-tight">
            {data.title}
          </h3>
          <p className="text-sm sm:text-base font-light text-brand-mist/70 italic">
            "{data.subtitle}"
          </p>
        </div>

        {/* Diagnostic Narrative Grid */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 pt-2">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mist/40 block mb-1">
                Site Observation
              </span>
              <p className="text-sm sm:text-[15px] font-light text-brand-mist/90 leading-relaxed">
                {data.leadParagraph}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mist/40 block mb-1">
                Root Cause Analysis
              </span>
              <p className="text-sm sm:text-[15px] font-light text-brand-mist/90 leading-relaxed">
                {data.technicalObservation}
              </p>
            </div>
          </div>

          {/* Practical Field Rule Box */}
          <div className="flex flex-col justify-between rounded-sm bg-brand-void border border-brand-edge-dark p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-4 h-4 text-brand-electric-bright" />
                <span className="text-xs font-mono uppercase tracking-wider text-brand-electric-bright">
                  Actionable Operational Rule
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-sm leading-relaxed">
                {data.fieldRule}
              </p>
            </div>

            {data.diagramNote && (
              <p className="text-[11px] font-mono text-brand-mist/50 border-t border-white/[0.08] pt-3">
                Telemetry Log: {data.diagramNote}
              </p>
            )}
          </div>
        </div>

        {/* Engineer Sign-off */}
        <div className="pt-6 border-t border-brand-edge-dark flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-electric/20 border border-brand-electric/40 text-brand-electric-bright flex items-center justify-center text-xs font-mono">
              MV
            </div>
            <div>
              <p className="text-xs font-normal text-white">{data.author.name}</p>
              <p className="text-[11px] font-light text-brand-mist/60">{data.author.credentials}</p>
            </div>
          </div>

          <Link
            href="/mechanical-electrical"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-brand-electric-bright hover:underline"
          >
            <span>M&E Engineering Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
