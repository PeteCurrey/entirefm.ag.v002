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
      <span className="text-[#9A9A95] text-[10px] font-normal">
        —
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#9A9A95] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter engineers by name or role..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E8E8E5] text-white text-xs placeholder:text-[#9A9A95] focus:border-brand-electric focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-normal uppercase text-[#9A9A95]">Trade:</span>
          {['ALL', 'ELECTRICAL', 'GAS', 'HVAC'].map((trade) => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`px-2.5 py-1 rounded text-xs font-normal transition-colors ${
                selectedTrade === trade
                  ? 'bg-brand-electric text-white font-medium'
                  : 'bg-white border border-[#E8E8E5] text-[#6D6D68] hover:text-white'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:block rounded-xl border border-[#E8E8E5] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E8E8E5] text-[#6D6D68] uppercase font-normal text-[10px]">
                <th className="py-3 px-4 sticky left-0 bg-[#FAFAF8] z-10">Operative</th>
                {competencies.map((comp) => (
                  <th key={comp.code} className="py-3 px-3 min-w-[130px] text-center">
                    <span className="block truncate max-w-[130px]">{comp.title || (comp as any).name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {filteredMatrix.map((item) => (
                <tr
                  key={item.operativeId}
                  onClick={() => onSelectOperative?.(item.operativeId)}
                  className="hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-normal text-white sticky left-0 bg-white z-10 border-r border-[#E8E8E5]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold text-xs">
                        {item.operativeName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-[#111111] block">{item.operativeName}</span>
                        <span className="text-[10px] font-normal text-[#9A9A95] block">{item.jobTitle}</span>
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
            className="p-4 rounded-xl border border-[#E8E8E5] bg-white shadow-sm space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold text-xs">
                  {item.operativeName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#111111]">{item.operativeName}</h4>
                  <p className="text-xs text-[#9A9A95] font-normal">{item.jobTitle}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E8E5]">
              {competencies.slice(0, 6).map((comp) => {
                const compData = item.competencies[comp.code] || { status: 'NOT_REQUIRED' };
                if (compData.status === 'NOT_REQUIRED') return null;
                return (
                  <div key={comp.code} className="p-2 rounded bg-[#FAFAF8] border border-[#E8E8E5]">
                    <span className="text-[9.5px] font-normal text-[#9A9A95] block truncate">{comp.title || (comp as any).name}</span>
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
