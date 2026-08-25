'use client';

import React from 'react';
import { ShieldCheck, Award, AlertTriangle, Users, FileCheck, Layers, AlertCircle, Building2 } from 'lucide-react';
import { ExecutiveSupplyChainMetrics } from '@/server/suppliers/types';

export function SupplierMetricCards({ metrics }: { metrics: ExecutiveSupplyChainMetrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Approved Suppliers
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-light text-slate-900">{metrics.approvedSuppliers}</span>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Active Network</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Preferred &amp; Strategic
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-light text-slate-900">
            {metrics.preferredSuppliers + metrics.strategicPartners}
          </span>
          <Award className="h-4 w-4 text-brand-pink" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Priority Tiers</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Coverage Gaps
        </span>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-mono font-light ${metrics.geographicCoverageGaps > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {metrics.geographicCoverageGaps}
          </span>
          <AlertCircle className="h-4 w-4 text-rose-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Zero-Coverage Cities</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Single Dependencies
        </span>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-mono font-light ${metrics.singleSupplierDependencies > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {metrics.singleSupplierDependencies}
          </span>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Concentration Risks</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Target Partners
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-light text-slate-900">{metrics.strategicTargetsNotYetEngaged}</span>
          <Building2 className="h-4 w-4 text-slate-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Recruitment Queue</span>
      </div>

      <div className="p-3.5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
          Total Organisations
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-mono font-light text-slate-900">{metrics.totalOrganisations}</span>
          <Layers className="h-4 w-4 text-slate-400" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Database Total</span>
      </div>
    </div>
  );
}
