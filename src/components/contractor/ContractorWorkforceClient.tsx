'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Grid,
  List,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { OperativeProfile, TrainingMatrixItem, CANONICAL_COMPETENCIES } from '@/server/contractor/workforce-service';
import { TrainingMatrixTable } from './TrainingMatrixTable';
import { OperativeProfileModal } from './OperativeProfileModal';

interface Props {
  initialOperatives: OperativeProfile[];
  initialMatrix: TrainingMatrixItem[];
  competencies: typeof CANONICAL_COMPETENCIES;
  orgId: string;
}

export function ContractorWorkforceClient({
  initialOperatives,
  initialMatrix,
  competencies,
  orgId,
}: Props) {
  const [operatives, setOperatives] = useState<OperativeProfile[]>(initialOperatives);
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'MATRIX'>('ROSTER');
  const [selectedOperative, setSelectedOperative] = useState<OperativeProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOperatives = operatives.filter((op) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return op.fullName.toLowerCase().includes(q) || op.jobTitle.toLowerCase().includes(q);
  });

  const handleSelectOperativeById = (operativeId: string) => {
    const found = operatives.find((o) => o.id === operativeId);
    if (found) setSelectedOperative(found);
  };

  const fullyCompliantCount = operatives.filter((o) => o.isEligibleForDispatch).length;
  const actionRequiredCount = operatives.length - fullyCompliantCount;

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Active Operatives</span>
          <p className="text-2xl font-light text-white mt-1">{operatives.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Registered engineers</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Fully Compliant</span>
          <p className="text-2xl font-light text-emerald-400 mt-1">{fullyCompliantCount}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Eligible for work allocation</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Action Required</span>
          <p className={`text-2xl font-light mt-1 ${actionRequiredCount > 0 ? 'text-amber-400' : 'text-white'}`}>
            {actionRequiredCount}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Expired/missing certificates</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">Competency Matrix</span>
          <p className="text-2xl font-light text-cyan-400 mt-1">{competencies.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Tracked qualifications</span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`px-4 py-2 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
              activeTab === 'ROSTER'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            <List className="w-4 h-4" />
            Operative Roster ({operatives.length})
          </button>

          <button
            onClick={() => setActiveTab('MATRIX')}
            className={`px-4 py-2 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
              activeTab === 'MATRIX'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            <Grid className="w-4 h-4" />
            Training &amp; Competency Matrix
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {activeTab === 'ROSTER' ? (
        <div className="space-y-4">
          {filteredOperatives.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-brand-edge-dark bg-brand-carbon/40 space-y-3">
              <Users className="w-8 h-8 text-brand-mist/30 mx-auto" />
              <h3 className="text-base font-light text-white">No operatives registered</h3>
              <p className="text-xs text-brand-mist/50 max-w-sm mx-auto">
                Add your field operatives and engineers to track competencies, assign work orders, and manage trade eligibility.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOperatives.map((op) => (
                <div
                  key={op.id}
                  onClick={() => setSelectedOperative(op)}
                  className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-5 space-y-4 hover:border-brand-electric/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold text-sm border border-brand-electric/20 group-hover:scale-105 transition-transform">
                        {op.firstName.charAt(0)}{op.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-brand-electric-bright transition-colors">
                          {op.fullName}
                        </h4>
                        <p className="text-xs text-brand-mist/50 font-mono">{op.jobTitle}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        op.isEligibleForDispatch
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {op.isEligibleForDispatch ? 'ELIGIBLE' : 'ACTION'}
                    </span>
                  </div>

                  {op.trades && op.trades.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-brand-edge-dark/50">
                      <span className="text-[10px] font-mono uppercase text-brand-mist/40 block">Approved Trades</span>
                      <div className="flex flex-wrap gap-1">
                        {op.trades.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-brand-void text-[11px] font-light text-brand-mist border border-brand-edge-dark"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-mono text-brand-mist/40 pt-2 border-t border-brand-edge-dark/30">
                    <span>{op.employmentStatus}</span>
                    <span>{op.qualifications.length} Certs Held</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <TrainingMatrixTable
          initialMatrix={initialMatrix}
          competencies={competencies}
          onSelectOperative={handleSelectOperativeById}
        />
      )}

      {/* Operative Profile Modal */}
      <OperativeProfileModal
        operative={selectedOperative}
        onClose={() => setSelectedOperative(null)}
      />
    </div>
  );
}
