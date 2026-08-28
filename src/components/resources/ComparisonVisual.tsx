'use client';

import React from 'react';
import { Cpu, User } from 'lucide-react';

interface ComparisonVisualProps {
  type?: 'ai-vs-human' | 'ppm-vs-pdm' | 'legacy-vs-entirecafm' | 'custom';
  title?: string;
  subtitle?: string;
  leftTitle?: string;
  leftBadge?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightBadge?: string;
  rightPoints?: string[];
}

export function ComparisonVisual({
  type = 'ai-vs-human',
  title = 'The Operational Division of Responsibility',
  subtitle = 'Defining the immutable boundary between algorithmic capability and mandatory human engineering sign-off.',
  leftTitle,
  leftBadge,
  leftPoints,
  rightTitle,
  rightBadge,
  rightPoints,
}: ComparisonVisualProps) {
  if (type === 'ai-vs-human') {
    const aiCapabilities = [
      'Parse unstructured tenant complaint emails and free-text tickets into structured metadata',
      'Correlate reported spatial locations to exact CAFM equipment asset tags',
      'Detect sub-audible vibration frequency shifts and thermal telemetry anomalies',
      'Predict SLA breach probability and calculate optimal engineer travel routing',
      'Extract statutory re-test expiry dates and defect codes from PDF certificates',
      'Synthesize portfolio-wide energy demand against weather degree-day forecasts',
    ];

    const humanMandates = [
      'Perform physical isolations, lock-out tag-out (LOTO), and safe system of work procedures',
      'Execute Gas Safe, NICEIC, F-Gas and statutory engineering inspections',
      'Authorize chargeable commercial thresholds and major plant capital replacements',
      'Exercise diagnostic judgement when physical site conditions contradict sensor telemetry',
      'Provide on-site tenant reassurance and manage sensitive building emergency evacuations',
      'Sign statutory legal declarations and maintain ultimate duty-of-care responsibility',
    ];

    return (
      <div className="my-12 p-8 sm:p-12 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm text-white font-sans">
        <div className="max-w-3xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
              Safety &amp; Operational Boundary
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extralight text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-300 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Can Column */}
          <div className="p-8 rounded-sm bg-brand-carbon border border-brand-pink/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 border-b border-brand-edge-dark pb-4">
                <div className="flex items-center gap-2.5 text-brand-pink">
                  <Cpu className="w-4 h-4" />
                  <h4 className="font-light text-lg text-white">AI Capabilities</h4>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30">
                  Algorithms &amp; Models
                </span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 font-light">
                {aiCapabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-brand-edge-dark text-xs text-slate-400 font-light">
              <strong className="text-white font-medium">Role:</strong> Triage, calculation, pattern recognition, and administrative velocity.
            </div>
          </div>

          {/* Humans Must Column */}
          <div className="p-8 rounded-sm bg-brand-carbon border border-blue-500/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 border-b border-brand-edge-dark pb-4">
                <div className="flex items-center gap-2.5 text-blue-400">
                  <User className="w-4 h-4" />
                  <h4 className="font-light text-lg text-white">Human Engineering Mandate</h4>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-sm bg-blue-950 text-blue-300 border border-blue-700">
                  Certified Engineers
                </span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 font-light">
                {humanMandates.map((man, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{man}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-brand-edge-dark text-xs text-slate-400 font-light">
              <strong className="text-white font-medium">Role:</strong> Physical execution, statutory safety compliance, and legal liability.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom / General 2-column comparison
  return (
    <div className="my-12 p-8 sm:p-12 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
      <div className="max-w-2xl mb-8 space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">{title}</h3>
        <p className="text-sm text-slate-300 font-light leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark">
          <div className="flex items-center justify-between mb-4 border-b border-brand-edge-dark pb-3">
            <h4 className="font-light text-lg text-white">{leftTitle || 'Method A'}</h4>
            {leftBadge && <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-sm bg-white/10 text-slate-300">{leftBadge}</span>}
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-light">
            {(leftPoints || []).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 rounded-sm bg-brand-carbon border border-brand-pink/30">
          <div className="flex items-center justify-between mb-4 border-b border-brand-edge-dark pb-3">
            <h4 className="font-light text-lg text-white">{rightTitle || 'Method B'}</h4>
            {rightBadge && <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-sm bg-brand-pink/10 text-brand-pink border border-brand-pink/30">{rightBadge}</span>}
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-light">
            {(rightPoints || []).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
