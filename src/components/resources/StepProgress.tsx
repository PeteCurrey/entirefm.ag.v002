'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  accent?: 'pink' | 'blue' | 'emerald' | 'amber' | 'violet';
}

const STEP_ACCENT: Record<string, { active: string; done: string; line: string }> = {
  pink: { active: 'border-brand-pink bg-brand-pink/10 text-brand-pink', done: 'bg-brand-pink border-brand-pink text-white', line: 'bg-brand-pink' },
  blue: { active: 'border-blue-500 bg-blue-500/10 text-blue-300', done: 'bg-blue-600 border-blue-600 text-white', line: 'bg-blue-600' },
  emerald: { active: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', done: 'bg-emerald-600 border-emerald-600 text-white', line: 'bg-emerald-600' },
  amber: { active: 'border-amber-500 bg-amber-500/10 text-amber-300', done: 'bg-amber-600 border-amber-600 text-white', line: 'bg-amber-600' },
  violet: { active: 'border-violet-500 bg-violet-500/10 text-violet-300', done: 'bg-violet-600 border-violet-600 text-white', line: 'bg-violet-600' },
};

export function StepProgress({ steps, currentStep, accent = 'pink' }: StepProgressProps) {
  const cls = STEP_ACCENT[accent] ?? STEP_ACCENT.pink;

  return (
    <div className="w-full font-sans print:hidden" aria-label="Progress steps">
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          const isFuture = idx > currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <li key={idx} className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}>
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <span
                  className={[
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border text-xs font-medium transition-all duration-300',
                    isDone ? cls.done : '',
                    isActive ? cls.active : '',
                    isFuture ? 'border-brand-edge-dark bg-brand-carbon text-slate-500' : '',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <span>0{idx + 1}</span>}
                </span>
                {/* Label */}
                <span
                  className={[
                    'text-[10px] uppercase tracking-wider font-medium text-center hidden sm:block leading-tight max-w-[80px]',
                    isDone || isActive ? 'text-slate-200' : 'text-slate-500',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-3 h-px relative">
                  <div className="absolute inset-0 bg-brand-edge-dark" />
                  {isDone && (
                    <div className={`absolute inset-0 ${cls.line} transition-all duration-500`} />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
