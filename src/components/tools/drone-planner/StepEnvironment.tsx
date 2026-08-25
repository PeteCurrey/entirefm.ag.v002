'use client';

import React from 'react';
import { ENVIRONMENTS, PlannerSiteInput } from '@/config/dronePlanner';
import { Check } from 'lucide-react';

interface StepEnvironmentProps {
  environment: string;
  onChange: (val: string) => void;
}

export function StepEnvironment({ environment, onChange }: StepEnvironmentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Which best describes the surrounding site environment?
        </h2>
        <p className="text-sm text-slate-300">
          This helps our aviation team anticipate pedestrian density, obstacles, and localized flight planning.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ENVIRONMENTS.map((env) => {
          const isSelected = environment === env.id;
          return (
            <button
              key={env.id}
              type="button"
              onClick={() => onChange(env.id)}
              className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                {env.label}
              </span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
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
