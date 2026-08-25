'use client';

import React from 'react';
import { ASSETS_TO_INSPECT, PlannerInspectionInput } from '@/config/dronePlanner';
import { Check, Layers, Sun } from 'lucide-react';

interface StepAssetsProps {
  inspection: PlannerInspectionInput;
  onChange: (updated: Partial<PlannerInspectionInput>) => void;
}

export function StepAssets({ inspection, onChange }: StepAssetsProps) {
  const selectedAssets = new Set(inspection.assetsToInspect || []);

  const toggleAsset = (assetId: string) => {
    const next = new Set(selectedAssets);
    if (next.has(assetId)) {
      next.delete(assetId);
    } else {
      next.add(assetId);
    }
    onChange({ assetsToInspect: Array.from(next) });
  };

  const hasRoof = selectedAssets.has('Roof') || selectedAssets.has('Gutters / Roof Drainage');
  const hasSolar = selectedAssets.has('Solar PV Array');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          What assets or areas need inspecting?
        </h2>
        <p className="text-sm text-slate-300">
          Select all areas of interest (multiple selections supported).
        </p>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ASSETS_TO_INSPECT.map((asset) => {
          const isSelected = selectedAssets.has(asset.id);
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => toggleAsset(asset.id)}
              className={`p-3.5 rounded-sm border text-left transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-brand-pink/15 border-brand-pink text-white shadow-glow-sm'
                  : 'bg-brand-carbon border-brand-edge-dark text-slate-300 hover:border-white/30 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
                {asset.label}
              </span>
              <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-slate-600 bg-brand-graphite'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progressive Disclosure 1: Roof Type */}
      {hasRoof && (
        <div className="p-5 rounded-sm bg-brand-carbon border border-brand-pink/40 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-pink" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Roof Profile Type (If Known)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['Flat', 'Pitched', 'Mixed', 'Unknown'] as const).map((type) => {
              const isChosen = inspection.roofType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ roofType: type })}
                  className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                    isChosen
                      ? 'bg-brand-pink text-white border-brand-pink'
                      : 'bg-brand-graphite text-slate-300 border-brand-edge-dark hover:text-white hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progressive Disclosure 2: Solar PV Size */}
      {hasSolar && (
        <div className="p-5 rounded-sm bg-brand-carbon border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Approximate Solar PV Installation Scale
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {(['Small commercial', 'Medium commercial', 'Large commercial', 'Utility-scale', 'Unknown'] as const).map((cap) => {
              const isChosen = inspection.solarCapacity === cap;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => onChange({ solarCapacity: cap })}
                  className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                    isChosen
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                      : 'bg-brand-graphite text-slate-300 border-brand-edge-dark hover:text-white hover:border-white/20'
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
