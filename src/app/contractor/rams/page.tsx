'use client';

import React, { useState } from 'react';
import { Shield, FileText, Plus, Download, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { RamsWizardModal } from '@/components/contractor/RamsWizardModal';

export default function ContractorRamsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const savedRams = [
    {
      id: 'rams-01',
      title: 'Commercial HVAC AHU & Chiller Servicing',
      trade: 'HVAC & Mechanical',
      version: 'v2.1',
      status: 'APPROVED',
      updatedAt: '12 August 2026',
    },
    {
      id: 'rams-02',
      title: 'Commercial Distribution Board Testing (EICR)',
      trade: 'Electrical',
      version: 'v1.4',
      status: 'APPROVED',
      updatedAt: '04 July 2026',
    },
    {
      id: 'rams-03',
      title: 'Working at Height - Gutter & Roof Inspection',
      trade: 'Building Fabric',
      version: 'v1.0',
      status: 'DRAFT',
      updatedAt: '22 August 2026',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
            HEALTH &amp; SAFETY ASSURANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            RAMS &amp; Safety Job Packs
          </h1>
          <p className="text-xs text-brand-mist/70 font-light max-w-xl">
            Create, store, and issue task-specific Risk Assessments and Method Statements linked directly to EntireFM work orders.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-5 py-3 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all shadow-md shadow-brand-electric/25 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New RAMS
        </button>
      </div>

      {/* Saved RAMS List */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
          <h3 className="text-sm font-medium text-white">Active RAMS Templates &amp; Job Packs</h3>
          <span className="text-xs font-mono text-brand-mist/40">{savedRams.length} Compiled</span>
        </div>

        <div className="divide-y divide-brand-edge-dark/30">
          {savedRams.map((rams) => (
            <div key={rams.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-void border border-brand-edge-dark flex items-center justify-center text-brand-mist">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-normal text-white">{rams.title}</h4>
                  <p className="text-xs font-mono text-brand-mist/50">
                    {rams.trade} &bull; {rams.version} &bull; Updated {rams.updatedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <span
                  className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                    rams.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-brand-void text-brand-mist border-brand-edge-dark'
                  }`}
                >
                  {rams.status}
                </span>

                <button
                  onClick={() => alert(`Downloading PDF for ${rams.title}`)}
                  className="p-1.5 rounded-lg border border-brand-edge-dark bg-brand-void text-brand-mist hover:text-white hover:border-brand-electric transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RamsWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}
