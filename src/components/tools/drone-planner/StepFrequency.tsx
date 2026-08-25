'use client';

import React from 'react';
import { FREQUENCY_OPTIONS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, CalendarClock, TrendingUp } from 'lucide-react';

interface StepFrequencyProps {
  frequency: PlannerInspectionInput['frequency'];
  onChange: (val: PlannerInspectionInput['frequency']) => void;
}

export function StepFrequency({ frequency, onChange }: StepFrequencyProps) {
  const isRecurring = frequency !== 'One-Off Inspection' && frequency !== 'Not Sure';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Is this likely to be a recurring inspection requirement?
        </h2>
        <p className="text-sm text-slate-300">
          Planned drone inspections can be scheduled cyclically into your SFG20 Planned Preventative Maintenance (PPM) regime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {FREQUENCY_OPTIONS.map((opt) => {
          const isSelected = frequency === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                {opt.label}
              </span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Drone PPM Value Callout */}
      {isRecurring && (
        <div className="p-5 rounded-sm bg-brand-graphite border border-brand-pink/40 flex items-start gap-3.5">
          <CalendarClock className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-light block text-sm">
              Drone PPM Advantage
            </strong>
            <p>
              By embedding recurring drone audits into your planned maintenance programme (e.g. quarterly box gutter sweeps, biannual roof fabric checks, and annual thermal scans), facilities teams track multi-year condition trends in EntireCAFM and avoid emergency reactive interventions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
