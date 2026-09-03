import React from 'react';

export interface StepItem {
  step: string | number;
  title: string;
  description: string;
  detail?: string;
  badge?: string;
}

export interface ContractorStepByStepProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: StepItem[];
  columns?: 1 | 2;
}

export function ContractorStepByStep({
  eyebrow = 'OPERATIONAL METHODOLOGY',
  title,
  subtitle,
  steps,
  columns = 1,
}: ContractorStepByStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h3 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {steps.map((item, idx) => {
          const stepNumber = typeof item.step === 'number' ? String(item.step).padStart(2, '0') : item.step;
          return (
            <div
              key={idx}
              className="p-5 sm:p-6 bg-[#FAFAF8] border border-slate-200 rounded-sm hover:border-[#EA580C]/40 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-sm">
                    STEP {stepNumber}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-slate-900">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.detail && (
                <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 font-light italic">
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
