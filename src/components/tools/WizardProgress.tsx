'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export interface WizardStep {
  id: number | string;
  title: string;
  subtitle?: string;
}

export function WizardProgress({
  steps,
  currentStep,
  onSelectStep,
}: {
  steps: WizardStep[];
  currentStep: number;
  onSelectStep?: (index: number) => void;
}) {
  return (
    <div className="w-full mb-8">
      {/* Desktop Stepper */}
      <div className="hidden sm:grid grid-cols-4 gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isClickable = onSelectStep && isDone;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStep(idx)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all duration-200 ${
                isCurrent
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : isDone
                  ? 'text-slate-300 hover:bg-slate-800/50 cursor-pointer'
                  : 'text-slate-500 cursor-default opacity-60'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isCurrent
                    ? 'bg-[#FF3E9D]/20 text-[#FF3E9D] border border-[#FF3E9D]/40'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : `0${idx + 1}`}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold tracking-tight truncate leading-none">
                  {step.title}
                </div>
                {step.subtitle && (
                  <div className="text-[10px] text-slate-400 truncate mt-1 leading-none font-normal">
                    {step.subtitle}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile compact Stepper */}
      <div className="sm:hidden flex items-center justify-between bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-[#FF3E9D]/20 text-[#FF3E9D] border border-[#FF3E9D]/40 flex items-center justify-center font-mono text-xs font-bold">
            0{currentStep + 1}
          </span>
          <div>
            <div className="text-xs font-bold text-white leading-none">
              {steps[currentStep]?.title}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-6 bg-[#FF3E9D]'
                  : i < currentStep
                  ? 'w-2.5 bg-emerald-500'
                  : 'w-2.5 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
