import React from 'react';
import { Check, X, Shield, Cpu, User, AlertTriangle } from 'lucide-react';

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
      <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
            Safety & Operational Boundary
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Can Column */}
          <div className="p-6 rounded-xl bg-pink-950/15 border border-pink-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 border-b border-pink-500/20 pb-3">
                <div className="flex items-center gap-2 text-pink-400">
                  <Cpu className="w-4 h-4" />
                  <h4 className="font-bold text-base text-white">AI Capabilities</h4>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700">
                  Algorithms &amp; Models
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                {aiCapabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-pink-500/20 text-[11px] font-mono text-pink-300/80">
              Role: Triage, calculation, pattern recognition, and administrative speed.
            </div>
          </div>

          {/* Humans Must Column */}
          <div className="p-6 rounded-xl bg-blue-950/15 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 border-b border-blue-500/20 pb-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <User className="w-4 h-4" />
                  <h4 className="font-bold text-base text-white">Human Engineering Mandate</h4>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">
                  Certified Engineers
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                {humanMandates.map((man, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                    <span>{man}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-blue-500/20 text-[11px] font-mono text-blue-300/80">
              Role: Physical execution, statutory safety compliance, and legal liability.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom / General 2-column comparison
  return (
    <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="max-w-2xl mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h4 className="font-bold text-base text-white">{leftTitle || 'Method A'}</h4>
            {leftBadge && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{leftBadge}</span>}
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            {(leftPoints || []).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-pink-950/20 border border-pink-500/30">
          <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
            <h4 className="font-bold text-base text-white">{rightTitle || 'Method B'}</h4>
            {rightBadge && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700">{rightBadge}</span>}
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            {(rightPoints || []).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
