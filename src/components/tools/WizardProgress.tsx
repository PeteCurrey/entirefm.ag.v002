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
    <div className="w-full mb-10">
      {/* Desktop Architectural Engineering Stepper */}
      <nav aria-label="Progress" className="hidden md:block border-b border-slate-800/90 pb-5">
        <ol className="flex items-center justify-between gap-4">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isClickable = Boolean(onSelectStep && isDone);
            const stepNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
            const cleanTitle = step.title.replace(/^\d+\s*/, '');

            return (
              <li key={step.id} className="flex-1 flex items-center min-w-0">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStep?.(idx)}
                  className={`group flex flex-col text-left transition-all w-full ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'text-white'
                          : isDone
                          ? 'text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-300'
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
                    <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">
                      {isDone ? 'COMPLETE' : isCurrent ? 'ACTIVE' : 'QUEUED'}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold tracking-wider uppercase transition-colors truncate ${
                      isCurrent
                        ? 'text-white'
                        : isDone
                        ? 'text-slate-300'
                        : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {cleanTitle}
                  </span>

                  {/* Engineering Indicator Bar */}
                  <div className="mt-2.5 w-full h-[2px] rounded-full overflow-hidden bg-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-full bg-gradient-to-r from-[#0284C7] to-[#FF3E9D]'
                          : isDone
                          ? 'w-full bg-emerald-500'
                          : 'w-0 bg-transparent'
                      }`}
                    />
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="h-4 w-px bg-slate-800 mx-2 self-center shrink-0 hidden lg:block" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Compact Engineering Progress */}
      <div className="md:hidden border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="text-sm font-bold text-white mt-0.5">
            {steps[currentStep]?.title.replace(/^\d+\s*/, '')}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-7 bg-gradient-to-r from-[#0284C7] to-[#FF3E9D]'
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
