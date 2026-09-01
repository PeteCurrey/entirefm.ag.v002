import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export function LobbyAcademyTeaser() {
  return (
    <div className="border border-brand-edge-dark bg-brand-carbon text-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-elevated relative overflow-hidden">
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] items-center gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-normal uppercase tracking-[0.2em] text-purple-300">
              COMING NEXT · ENTIREFM ACADEMY
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-tight tracking-tight">
            Learn. Test. Prove.
          </h3>

          <p className="text-sm font-light text-brand-mist/80 leading-relaxed text-pretty">
            While <strong className="font-normal text-white">The Lobby</strong> is where UK facilities professionals come every day to know what’s changed and get practical tools, <strong className="font-normal text-white">EntireFM Academy</strong> is being engineered as the hands-on operational learning environment for estate teams and building custodians.
          </p>
        </div>

        <div className="rounded-sm bg-brand-void/80 border border-white/10 p-6 space-y-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-brand-mist/50">
              Future Integration
            </span>
            <p className="text-xs font-light text-brand-mist/90">
              CPD-accredited engineering modules, statutory compliance assessments, and estate diagnostic simulations.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-xs font-normal text-purple-300 hover:text-white transition-colors"
            >
              <span>Preview current Academy fundamentals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
