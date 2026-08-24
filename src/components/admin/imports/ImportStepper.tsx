'use client';

import React from 'react';
import { Check, Upload, Shuffle, CheckCircle, AlertTriangle, Play, FileCheck } from 'lucide-react';

export type ImportStep = 'UPLOAD' | 'MAP' | 'VALIDATE' | 'REVIEW' | 'CONFIRM' | 'RESULT';

interface ImportStepperProps {
  currentStep: ImportStep;
  batchId?: string;
}

const steps: Array<{ key: ImportStep; label: string; icon: React.ElementType }> = [
  { key: 'UPLOAD', label: '1. Upload', icon: Upload },
  { key: 'MAP', label: '2. Map Columns', icon: Shuffle },
  { key: 'VALIDATE', label: '3. Validate', icon: CheckCircle },
  { key: 'REVIEW', label: '4. Review Conflicts', icon: AlertTriangle },
  { key: 'CONFIRM', label: '5. Confirm Import', icon: Play },
  { key: 'RESULT', label: '6. Results', icon: FileCheck },
];

export function ImportStepper({ currentStep }: ImportStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-medium transition-all ${
                    isCompleted
                      ? 'bg-[#15803D] text-white'
                      : isCurrent
                      ? 'bg-[#FF6B24] text-white ring-4 ring-[#FF6B24]/20'
                      : 'bg-[#F0F0EE] text-[#9B9B97]'
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span
                  className={`text-[12.5px] font-medium ${
                    isCurrent ? 'text-[#101010]' : isCompleted ? 'text-[#15803D]' : 'text-[#9B9B97]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 shrink-0 rounded-full transition-colors ${
                    idx < currentIndex ? 'bg-[#15803D]' : 'bg-[#E4E4E1]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
