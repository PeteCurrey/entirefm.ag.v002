'use client';

import React from 'react';
import { REMEDIATION_OPTIONS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, Wrench, ShieldCheck } from 'lucide-react';

interface StepRemediationProps {
  remediation: PlannerInspectionInput['remediationInterest'];
  onChange: (val: PlannerInspectionInput['remediationInterest']) => void;
}

export function StepRemediation({ remediation, onChange }: StepRemediationProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-brand-pink font-mono text-[10px] font-normal uppercase">
          <Wrench className="w-3 h-3" />
          <span>EntireFM Direct Trade Capability</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          If defects are identified, would you like EntireFM to help with the remedial work?
        </h2>
        <p className="text-sm text-slate-300">
          EntireFM operates in-house industrial rope access, BMU maintenance, roofing, M&amp;E, and drainage divisions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REMEDIATION_OPTIONS.map((opt) => {
          const isSelected = remediation === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-5 rounded-sm border text-left transition-all flex items-start justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-normal group-hover:text-white transition-colors leading-relaxed">
                {opt.label}
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

      <div className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>No obligation:</strong> Remedial works are never mandatory. We happily provide standalone diagnostic survey reports or comprehensive survey-plus-remedial turnkey packages.
        </span>
      </div>
    </div>
  );
}
