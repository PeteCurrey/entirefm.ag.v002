'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Search, Filter, ShieldCheck, User } from 'lucide-react';
import {
  TrainingMatrixItem,
  CANONICAL_COMPETENCIES,
  CompetencyStatus,
} from '@/server/contractor/workforce-service';
import { CanonicalCompetencyDef } from '@/server/contractor/competency-framework';

interface Props {
  initialMatrix: TrainingMatrixItem[];
  competencies: CanonicalCompetencyDef[];
  onSelectOperative?: (operativeId: string) => void;
}

export function TrainingMatrixTable({ initialMatrix, competencies, onSelectOperative }: Props) {
  const [matrix, setMatrix] = useState<TrainingMatrixItem[]>(initialMatrix);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');

  const filteredMatrix = matrix.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!item.operativeName.toLowerCase().includes(q) && !item.jobTitle.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedTrade !== 'ALL') {
      if (!item.trades.some((t) => t.toUpperCase().includes(selectedTrade))) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status: CompetencyStatus, daysRemaining?: number | null) => {
    if (status === 'VALID') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-normal">
          <CheckCircle2 className="w-3 h-3" />
          VALID
        </span>
      );
    }
    if (status === 'EXPIRING') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-normal">
          <Clock className="w-3 h-3" />
          {daysRemaining !== null && daysRemaining !== undefined ? `${daysRemaining}d` : 'EXPIRING'}
        </span>
      );
    }
    if (status === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
          <XCircle className="w-3 h-3" />
          EXPIRED
        </span>
      );
    }
    if (status === 'MISSING') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800 text-[10px] font-normal">
          MISSING
        </span>
      );
    }
    return (
      <span className="text-brand-mist/30 text-[10px] font-normal">
        —
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-brand-mist/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter engineers by name or role..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-carbon border border-brand-edge-dark text-white text-xs placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-normal uppercase text-brand-mist/40">Trade:</span>
          {['ALL', 'ELECTRICAL', 'GAS', 'HVAC'].map((trade) => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`px-2.5 py-1 rounded text-xs font-normal transition-colors ${
                selectedTrade === trade
                  ? 'bg-brand-electric text-white font-medium'
                  : 'bg-brand-carbon border border-brand-edge-dark text-brand-mist/70 hover:text-white'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:block rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-brand-void/90 border-b border-brand-edge-dark text-brand-mist/60 uppercase font-normal text-[10px]">
                <th className="py-3 px-4 sticky left-0 bg-brand-void z-10">Operative</th>
                {competencies.map((comp) => (
                  <th key={comp.code} className="py-3 px-3 min-w-[130px] text-center">
                    <span className="block truncate max-w-[130px]">{comp.title || (comp as any).name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30">
              {filteredMatrix.map((item) => (
                <tr
                  key={item.operativeId}
                  onClick={() => onSelectOperative?.(item.operativeId)}
                  className="hover:bg-brand-edge-dark/20 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-normal text-white sticky left-0 bg-brand-carbon z-10 border-r border-brand-edge-dark/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold text-xs">
                        {item.operativeName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-white block">{item.operativeName}</span>
                        <span className="text-[10px] font-normal text-brand-mist/50 block">{item.jobTitle}</span>
                      </div>
                    </div>
                  </td>

                  {competencies.map((comp) => {
                    const compData = item.competencies[comp.code] || { status: 'NOT_REQUIRED' };
                    return (
                      <td key={comp.code} className="py-3 px-3 text-center">
                        {getStatusBadge(compData.status, compData.daysRemaining)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Transformation View */}
      <div className="block lg:hidden space-y-3">
        {filteredMatrix.map((item) => (
          <div
            key={item.operativeId}
            onClick={() => onSelectOperative?.(item.operativeId)}
            className="p-4 rounded-xl border border-brand-edge-dark bg-brand-carbon space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold text-xs">
                  {item.operativeName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{item.operativeName}</h4>
                  <p className="text-xs text-brand-mist/50 font-normal">{item.jobTitle}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-edge-dark/40">
              {competencies.slice(0, 6).map((comp) => {
                const compData = item.competencies[comp.code] || { status: 'NOT_REQUIRED' };
                if (compData.status === 'NOT_REQUIRED') return null;
                return (
                  <div key={comp.code} className="p-2 rounded bg-brand-void border border-brand-edge-dark/40">
                    <span className="text-[9.5px] font-normal text-brand-mist/50 block truncate">{comp.title || (comp as any).name}</span>
                    <div className="mt-1">{getStatusBadge(compData.status, compData.daysRemaining)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
