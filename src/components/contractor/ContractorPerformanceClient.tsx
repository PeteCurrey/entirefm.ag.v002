'use client';

/**
 * CLIENT COMPONENT: ContractorPerformanceClient
 * =============================================
 * Performance analytics view with strict separation between:
 *   1. EntireFM Network Performance
 *   2. My Business Performance (Independent operations)
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  Coins,
  Users,
  FileText,
  Building,
  BarChart3,
  Star,
} from 'lucide-react';
import { ContractorPerformanceMetrics } from '@/server/contractor/performance-service';

interface Props {
  metrics: ContractorPerformanceMetrics;
}

export function ContractorPerformanceClient({ metrics }: Props) {
  const [activeTab, setActiveTab] = useState<'network' | 'my_business'>('my_business');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              CONTRACTOR OPERATING ANALYTICS
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Business &amp; Network Performance</h1>
          <p className="text-xs text-brand-mist/70">
            Real-time operating benchmarks for {metrics.contractorName}.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-1 text-xs">
          <button
            onClick={() => setActiveTab('my_business')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'my_business'
                ? 'bg-brand-electric text-white shadow-md shadow-brand-electric/20'
                : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> My Business Performance
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'network'
                ? 'bg-brand-electric text-white shadow-md shadow-brand-electric/20'
                : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> EntireFM Network KPIs
          </button>
        </div>
      </div>

      {/* ─── TAB 1: MY BUSINESS PERFORMANCE ──────────────────────────────── */}
      {activeTab === 'my_business' && (
        <div className="space-y-6">
          {/* Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Independent Jobs</span>
              <p className="text-2xl font-light text-white">{metrics.myBusiness.totalIndependentJobs}</p>
              <span className="text-[10.5px] text-brand-mist/40 block">
                {metrics.myBusiness.completedIndependentJobs} Completed &bull; {metrics.myBusiness.activeIndependentJobs} Active
              </span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Private Revenue</span>
              <p className="text-2xl font-light text-emerald-400">£{Math.round(metrics.myBusiness.totalRevenueGbp)}</p>
              <span className="text-[10.5px] text-emerald-400/60 block">Direct customer billing</span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Sign-Off Rate</span>
              <p className="text-2xl font-light text-brand-electric-bright">{metrics.myBusiness.customerSignOffRatePct}%</p>
              <span className="text-[10.5px] text-brand-mist/40 block">Customer satisfaction</span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Operative Utilisation</span>
              <p className="text-2xl font-light text-cyan-400">{metrics.myBusiness.engineerUtilisationPct}%</p>
              <span className="text-[10.5px] text-brand-mist/40 block">Quote Conv: {metrics.myBusiness.quoteConversionRatePct}%</span>
            </div>
          </div>

          {/* Trade Revenue Distribution */}
          <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-electric" /> Revenue Breakdown by Trade Service
            </h3>

            {metrics.myBusiness.tradeDistribution.length === 0 ? (
              <p className="text-xs text-brand-mist/40 py-4">No private trade revenue recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {metrics.myBusiness.tradeDistribution.map((t) => (
                  <div key={t.trade} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-brand-mist/80">
                      <span className="font-medium text-white">{t.trade}</span>
                      <span className="font-mono text-emerald-400">£{t.revenueGbp.toFixed(2)} ({t.count} jobs)</span>
                    </div>
                    <div className="h-2 w-full bg-brand-void rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${metrics.myBusiness.totalRevenueGbp > 0 ? (t.revenueGbp / metrics.myBusiness.totalRevenueGbp) * 100 : 0}%`,
                        }}
                        className="h-full bg-brand-electric rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: ENTIREFM NETWORK PERFORMANCE ─────────────────────────── */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Partner Tier</span>
              <p className="text-2xl font-light text-brand-electric-bright">Tier 1 Premium</p>
              <span className="text-[10.5px] text-brand-mist/40 block">Network rank</span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">SLA Adherence</span>
              <p className="text-2xl font-light text-emerald-400">{metrics.network.slaAdherenceRatePct}%</p>
              <span className="text-[10.5px] text-brand-mist/40 block">First-Time Fix: {metrics.network.firstTimeFixRatePct}%</span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Acceptance Rate</span>
              <p className="text-2xl font-light text-white">{metrics.network.acceptanceRatePct}%</p>
              <span className="text-[10.5px] text-brand-mist/40 block">{metrics.network.totalAssignmentsAccepted} Accepted</span>
            </div>

            <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-mist/50">Network Rating</span>
              <p className="text-2xl font-light text-amber-400 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {metrics.network.performanceRating}
              </p>
              <span className="text-[10.5px] text-brand-mist/40 block">Out of 5.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
