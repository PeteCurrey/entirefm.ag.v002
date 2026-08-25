'use client';

import React from 'react';
import { HEIGHT_BANDS, ACCESS_CONSTRAINTS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, ShieldCheck } from 'lucide-react';

interface StepHeightAccessProps {
  inspection: PlannerInspectionInput;
  onChange: (updated: Partial<PlannerInspectionInput>) => void;
}

export function StepHeightAccess({ inspection, onChange }: StepHeightAccessProps) {
  const selectedConstraints = new Set(inspection.accessConstraints || []);

  const toggleConstraint = (id: string) => {
    const next = new Set(selectedConstraints);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange({ accessConstraints: Array.from(next) });
  };

  return (
    <div className="space-y-8">
      {/* Height Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Building Height &amp; Vertical Scale
          </h2>
          <p className="text-sm text-slate-300">
            Select the approximate storeys or height band of the structure.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HEIGHT_BANDS.map((hb) => {
            const isSelected = inspection.heightBand === hb.id;
            return (
              <button
                key={hb.id}
                type="button"
                onClick={() => onChange({ heightBand: hb.id })}
                className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                    : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                  {hb.label}
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                  isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Access Constraints Section */}
      <div className="space-y-4 pt-4 border-t border-brand-edge-dark">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Are there notable access constraints or airspace limits?
          </h3>
          <p className="text-sm text-slate-300">
            Select any factors that may influence flight safety or ground cordons (multiple selections supported).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACCESS_CONSTRAINTS.map((con) => {
            const isSelected = selectedConstraints.has(con.id);
            return (
              <button
                key={con.id}
                type="button"
                onClick={() => toggleConstraint(con.id)}
                className={`p-3.5 rounded-sm border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                    : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                  {con.label}
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
      </div>
    </div>
  );
}
