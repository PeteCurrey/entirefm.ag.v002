import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  accent?: 'blue' | 'emerald' | 'amber' | 'violet';
}

const STEP_ACCENT: Record<string, { active: string; done: string; line: string }> = {
  blue: { active: 'border-blue-500 bg-blue-500/10 text-blue-300', done: 'bg-blue-600 border-blue-600 text-white', line: 'bg-blue-600' },
  emerald: { active: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', done: 'bg-emerald-600 border-emerald-600 text-white', line: 'bg-emerald-600' },
  amber: { active: 'border-amber-500 bg-amber-500/10 text-amber-300', done: 'bg-amber-600 border-amber-600 text-white', line: 'bg-amber-600' },
  violet: { active: 'border-violet-500 bg-violet-500/10 text-violet-300', done: 'bg-violet-600 border-violet-600 text-white', line: 'bg-violet-600' },
};

export function StepProgress({ steps, currentStep, accent = 'blue' }: StepProgressProps) {
  const cls = STEP_ACCENT[accent] ?? STEP_ACCENT.blue;

  return (
    <div className="w-full print:hidden" aria-label="Progress steps">
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
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300',
                    isDone ? cls.done : '',
                    isActive ? cls.active : '',
                    isFuture ? 'border-brand-edge-dark bg-brand-graphite text-brand-mist/30' : '',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <span>{idx + 1}</span>}
                </span>
                {/* Label */}
                <span
                  className={[
                    'text-[10px] font-mono uppercase tracking-wider text-center hidden sm:block leading-tight max-w-[80px]',
                    isDone || isActive ? 'text-brand-mist/70' : 'text-brand-mist/30',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 h-px relative">
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
