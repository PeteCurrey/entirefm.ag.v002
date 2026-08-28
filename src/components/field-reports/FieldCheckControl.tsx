'use client';

import React from 'react';
import type { CheckResult } from '@/server/field-reports/types';

interface Props {
  label: string;
  sublabel?: string;
  value: CheckResult | undefined;
  onChange: (val: CheckResult) => void;
  disabled?: boolean;
}

export default function FieldCheckControl({
  label,
  sublabel,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium text-white">{label}</h4>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* PASS */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('PASS')}
          className={`py-3 rounded-lg font-bold text-xs tracking-wider transition-all border ${
            value === 'PASS'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          ✓ PASS
        </button>

        {/* FAIL */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('FAIL')}
          className={`py-3 rounded-lg font-bold text-xs tracking-wider transition-all border ${
            value === 'FAIL'
              ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          ✕ FAIL
        </button>

        {/* N/A */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('NA')}
          className={`py-3 rounded-lg font-bold text-xs tracking-wider transition-all border ${
            value === 'NA'
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          N/A
        </button>
      </div>
    </div>
  );
}
