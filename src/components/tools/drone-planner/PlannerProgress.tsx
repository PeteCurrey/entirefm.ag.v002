'use client';

import React from 'react';

interface PlannerProgressProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
}

export function PlannerProgress({ currentStep, totalSteps, stepName }: PlannerProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-brand-pink font-bold uppercase tracking-wider">
          STEP {currentStep} OF {totalSteps}: <span className="text-white">{stepName}</span>
        </span>
        <span className="text-slate-400 font-medium">
          {percentage}% Complete
        </span>
      </div>

      <div 
        className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden" 
        role="progressbar" 
        aria-valuenow={percentage} 
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-label={`Progress: Step ${currentStep} of ${totalSteps} (${percentage}%)`}
      >
        <div 
          className="h-full bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
