'use client';

import React from 'react';
import { Check } from 'lucide-react';

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
      {/* Desktop Architectural Stepper */}
      <nav aria-label="Progress" className="hidden md:block border-b border-slate-800 pb-4">
        <ol className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isClickable = Boolean(onSelectStep && isDone);
            const stepNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <li key={step.id} className="flex-1 flex items-center min-w-0">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStep?.(idx)}
                  className={`group flex items-center gap-2.5 text-left transition-colors ${
                    isClickable ? 'cursor-pointer hover:text-slate-200' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`text-xs font-mono font-bold transition-colors ${
                      isCurrent
                        ? 'text-white border-b-2 border-[#FF3E9D] pb-0.5'
                        : isDone
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        {stepNum}
                      </span>
                    ) : (
                      stepNum
                    )}
                  </span>
                  <span
                    className={`text-xs font-semibold tracking-wide uppercase transition-colors truncate ${
                      isCurrent
                        ? 'text-white'
                        : isDone
                        ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title.replace(/^\d+\s*/, '')}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-800 mx-3" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Compact Progress */}
      <div className="md:hidden border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="text-sm font-bold text-white mt-0.5">
            {steps[currentStep]?.title.replace(/^\d+\s*/, '')}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-6 bg-[#FF3E9D]'
                  : idx < currentStep
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
