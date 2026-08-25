'use client';

import React from 'react';
import { OUTPUT_OPTIONS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, Sparkles } from 'lucide-react';

interface StepOutputsProps {
  outputs: string[];
  onChange: (outputs: string[]) => void;
}

export function StepOutputs({ outputs, onChange }: StepOutputsProps) {
  const selectedOutputs = new Set(outputs || []);

  const toggleOutput = (outId: string) => {
    const next = new Set(selectedOutputs);
    if (outId === 'Not Sure — Recommend for Me') {
      if (next.has(outId)) {
        next.delete(outId);
      } else {
        next.clear();
        next.add(outId);
      }
    } else {
      next.delete('Not Sure — Recommend for Me');
      if (next.has(outId)) {
        next.delete(outId);
      } else {
        next.add(outId);
      }
    }
    onChange(Array.from(next));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          What technical deliverables would you like to receive?
        </h2>
        <p className="text-sm text-slate-300">
          Select desired deliverables, or choose &ldquo;Not Sure&rdquo; to let our engine recommend the best outputs based on your requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {OUTPUT_OPTIONS.map((opt) => {
          const isSelected = selectedOutputs.has(opt.id);
          const isNotSure = opt.id === 'Not Sure — Recommend for Me';
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOutput(opt.id)}
              className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? isNotSure 
                    ? 'bg-purple-950/40 border-purple-400 text-white shadow-glow-sm'
                    : 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isNotSure && <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </div>

              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected 
                  ? isNotSure ? 'border-purple-400 bg-purple-500 text-white' : 'border-brand-pink bg-brand-pink text-white' 
                  : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
