'use client';

import React from 'react';
import { Camera, Map, Layers, LayoutGrid } from 'lucide-react';

export type SiteVisualMode = 'PHOTO' | 'PLAN' | 'ASSETS' | 'MAP';

interface VisualModeSelectorProps {
  mode: SiteVisualMode;
  onChange: (mode: SiteVisualMode) => void;
}

export function VisualModeSelector({ mode, onChange }: VisualModeSelectorProps) {
  const modes: Array<{ id: SiteVisualMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'PHOTO', label: 'Photo Reality', icon: Camera },
    { id: 'PLAN', label: 'Floor Plans / CAD', icon: LayoutGrid },
    { id: 'ASSETS', label: 'Asset Hierarchy', icon: Layers },
    { id: 'MAP', label: 'Spatial / Access', icon: Map },
  ];

  return (
    <div className="inline-flex items-center rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-all ${
              isActive
                ? 'bg-[#101010] text-white shadow-sm'
                : 'text-[#686866] hover:text-[#101010] hover:bg-[#F5F5F3]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
