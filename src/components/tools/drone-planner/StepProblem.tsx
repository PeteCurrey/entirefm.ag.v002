'use client';

import React from 'react';
import { INSPECTION_REASONS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, Droplets, CloudLightning, CalendarClock } from 'lucide-react';

interface StepProblemProps {
  inspection: PlannerInspectionInput;
  onChange: (updated: Partial<PlannerInspectionInput>) => void;
}

export function StepProblem({ inspection, onChange }: StepProblemProps) {
  const selectedReasons = new Set(inspection.inspectionReasons || []);

  const toggleReason = (reasonId: string) => {
    const next = new Set(selectedReasons);
    if (next.has(reasonId)) {
      next.delete(reasonId);
    } else {
      next.add(reasonId);
    }
    onChange({ inspectionReasons: Array.from(next) });
  };

  const hasWaterLeak = selectedReasons.has('Water ingress / leak');
  const hasStorm = selectedReasons.has('Storm damage');
  const hasPpm = selectedReasons.has('Routine PPM inspection') || selectedReasons.has('Planned condition survey');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          What are you trying to understand or investigate?
        </h2>
        <p className="text-sm text-slate-300">
          Select the primary drivers or issues (multiple selections supported).
        </p>
      </div>

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INSPECTION_REASONS.map((r) => {
          const isSelected = selectedReasons.has(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggleReason(r.id)}
              className={`p-3.5 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                {r.label}
              </span>
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditional Disclosure 1: Water Ingress Detail */}
      {hasWaterLeak && (
        <div className="p-5 rounded-sm bg-brand-carbon border border-blue-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-light uppercase text-white tracking-wider">
              Water Ingress Nature
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['active leak', 'intermittent leak', 'historic issue', 'unknown'] as const).map((status) => {
              const isChosen = inspection.waterLeakStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ waterLeakStatus: status })}
                  className={`px-3 py-2 rounded-sm text-xs font-normal border transition-colors capitalize ${
                    isChosen
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-brand-graphite text-slate-300 border-brand-edge-dark hover:text-white hover:border-white/20'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Conditional Disclosure 2: Storm Damage Detail */}
      {hasStorm && (
        <div className="p-5 rounded-sm bg-brand-carbon border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-light uppercase text-white tracking-wider">
              Storm Damage Severity
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['recent', 'active safety concern', 'insurance claim involved'] as const).map((status) => {
              const isChosen = inspection.stormStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ stormStatus: status })}
                  className={`px-3 py-2 rounded-sm text-xs font-normal border transition-colors capitalize ${
                    isChosen
                      ? 'bg-amber-500 text-slate-950 font-light border-amber-500'
                      : 'bg-brand-graphite text-slate-300 border-brand-edge-dark hover:text-white hover:border-white/20'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Conditional Disclosure 3: Routine PPM Detail */}
      {hasPpm && (
        <div className="p-5 rounded-sm bg-brand-carbon border border-brand-pink/40 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-brand-pink" />
            <h3 className="text-xs font-light uppercase text-white tracking-wider">
              Condition Survey Framework
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['one-off baseline', 'recurring programme', 'unknown'] as const).map((ppm) => {
              const isChosen = inspection.ppmType === ppm;
              return (
                <button
                  key={ppm}
                  type="button"
                  onClick={() => onChange({ ppmType: ppm })}
                  className={`px-3 py-2 rounded-sm text-xs font-normal border transition-colors capitalize ${
                    isChosen
                      ? 'bg-brand-pink text-white border-brand-pink'
                      : 'bg-brand-graphite text-slate-300 border-brand-edge-dark hover:text-white hover:border-white/20'
                  }`}
                >
                  {ppm}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
