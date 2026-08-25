'use client';

import React from 'react';
import { SITE_TYPES } from '@/config/dronePlanner';
import { Building2, Check } from 'lucide-react';

interface StepSiteTypeProps {
  value: string;
  otherValue?: string;
  onChange: (siteType: string, otherValue?: string) => void;
}

export function StepSiteType({ value, otherValue, onChange }: StepSiteTypeProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          What type of site or property are we inspecting?
        </h2>
        <p className="text-sm text-slate-300">
          Select the option that best describes the primary facility or property archetype.
        </p>
      </div>

      {/* Grid of Site Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SITE_TYPES.map((type) => {
          const isSelected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id, otherValue)}
              className={`p-4 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors">
                {type.label}
              </span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditional Other Textbox */}
      {value === 'Other' && (
        <div className="p-4 rounded-sm bg-brand-carbon border border-brand-pink/50 space-y-2 mt-4">
          <label htmlFor="otherSiteDesc" className="block text-xs font-mono font-light uppercase text-brand-pink">
            Please describe the property archetype:
          </label>
          <input
            id="otherSiteDesc"
            type="text"
            value={otherValue || ''}
            onChange={(e) => onChange('Other', e.target.value)}
            placeholder="e.g. Historic church spire, communications tower, mixed retail/residential"
            className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
