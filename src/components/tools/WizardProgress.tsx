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
      {/* Desktop Stepper */}
      <nav aria-label="Progress" className="hidden md:block border-b border-slate-200 pb-5">
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
                      className={`text-xs font-mono font-bold transition-colors inline-flex items-center gap-1.5 ${
                        isCurrent
                          ? 'text-brand-electric'
                          : isDone
                          ? 'text-emerald-600'
                          : 'text-slate-600 group-hover:text-slate-900'
                      }`}
                    >
                      {isDone ? (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
                          isCurrent ? 'bg-brand-electric text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {stepNum}
                        </span>
                      )}
                      <span>STEP {stepNum}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden xl:inline">
                      {isDone ? 'COMPLETE' : isCurrent ? 'ACTIVE' : 'QUEUED'}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium tracking-tight transition-colors truncate ${
                      isCurrent
                        ? 'text-slate-900 font-semibold'
                        : isDone
                        ? 'text-slate-700'
                        : 'text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {cleanTitle}
                  </span>

                  {/* Indicator Track */}
                  <div className="mt-2.5 w-full h-[3px] rounded-full overflow-hidden bg-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-full bg-gradient-to-r from-brand-electric via-brand-indigo to-brand-violet'
                          : isDone
                          ? 'w-full bg-emerald-500'
                          : 'w-0 bg-transparent'
                      }`}
                    />
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="h-4 w-px bg-slate-200 mx-3 self-center shrink-0 hidden lg:block" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Compact Progress */}
      <div className="md:hidden border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-600 uppercase font-semibold">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {steps[currentStep]?.title.replace(/^\d+\s*/, '')}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-6 bg-gradient-to-r from-brand-electric to-brand-violet'
                  : idx < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
