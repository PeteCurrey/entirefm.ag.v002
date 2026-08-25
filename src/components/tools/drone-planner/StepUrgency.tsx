'use client';

import React from 'react';
import { URGENCY_OPTIONS, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, AlertTriangle, ShieldAlert } from 'lucide-react';

interface StepUrgencyProps {
  urgency: PlannerInspectionInput['urgency'];
  onChange: (val: PlannerInspectionInput['urgency']) => void;
}

export function StepUrgency({ urgency, onChange }: StepUrgencyProps) {
  const isEmergency = urgency === 'Emergency / Immediate Concern';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          How urgent is this inspection requirement?
        </h2>
        <p className="text-sm text-slate-300">
          This helps us triage aviation resources and evaluate operational mobilization windows.
        </p>
      </div>

      {/* Urgency List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {URGENCY_OPTIONS.map((opt) => {
          const isSelected = urgency === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-4 rounded-sm border text-left transition-all flex items-start justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-brand-pink transition-colors">
                  {opt.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {opt.desc}
                </p>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Restrained Safety Warning for Emergencies */}
      {isEmergency && (
        <div className="p-5 rounded-sm bg-red-950/40 border border-red-500/50 flex items-start gap-3.5 mt-4">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-red-200 leading-relaxed">
            <strong className="text-white font-semibold block text-sm">
              Immediate Safety Priority Notice
            </strong>
            <p>
              If there is an immediate danger to people, occupants or adjacent property (e.g. falling debris or structural collapse), implement appropriate ground safety cordons and emergency site controls first. Drone inspections provide rapid visual evidence but do not replace immediate site safety protocols.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
