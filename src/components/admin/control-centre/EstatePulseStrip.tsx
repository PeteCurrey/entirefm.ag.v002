'use client';

import React from 'react';
import { AlertCircle, ShieldCheck, Activity, DollarSign, Building2, Wrench } from 'lucide-react';

export interface EstatePulseData {
  sitesCount: number;
  assetsCount: number;
  openJobsCount: number;
  slaPerformancePercent: number | null;
  compliancePercent: number | null;
  currentWorksGbp: number;
  criticalJobsCount?: number;
  slaBreachRiskCount?: number;
}

interface EstatePulseStripProps {
  data: EstatePulseData;
  onMetricClick?: (metricKey: string) => void;
  activeMetric?: string | null;
}

export function EstatePulseStrip({
  data,
  onMetricClick,
  activeMetric,
}: EstatePulseStripProps) {
  const metrics = [
    {
      key: 'sites',
      label: 'Sites',
      value: data.sitesCount > 0 ? data.sitesCount.toLocaleString() : '—',
      subtext: data.sitesCount > 0 ? 'Managed facilities' : 'No sites yet',
      icon: Building2,
      alert: false,
    },
    {
      key: 'assets',
      label: 'In-Service Assets',
      value: data.assetsCount > 0 ? data.assetsCount.toLocaleString() : '—',
      subtext: data.assetsCount > 0 ? 'Asset register' : 'No assets yet',
      icon: Activity,
      alert: false,
    },
    {
      key: 'open_jobs',
      label: 'Open Jobs',
      value: data.openJobsCount > 0 ? data.openJobsCount.toString() : '—',
      subtext: data.criticalJobsCount ? `${data.criticalJobsCount} P1 critical` : 'No open jobs',
      icon: Wrench,
      alert: (data.criticalJobsCount || 0) > 0,
    },
    {
      key: 'sla',
      label: 'SLA Performance',
      value: data.slaPerformancePercent !== null ? `${data.slaPerformancePercent.toFixed(1)}%` : 'NO DATA',
      subtext: data.slaBreachRiskCount ? `${data.slaBreachRiskCount} at risk` : 'Requires SLA tracking',
      icon: AlertCircle,
      alert: (data.slaBreachRiskCount || 0) > 0,
      noData: data.slaPerformancePercent === null,
    },
    {
      key: 'compliance',
      label: 'Statutory Compliance',
      value: data.compliancePercent !== null ? `${data.compliancePercent.toFixed(1)}%` : 'NO DATA',
      subtext: data.compliancePercent !== null ? 'Obligations tracked' : 'No obligations configured',
      icon: ShieldCheck,
      alert: data.compliancePercent !== null && data.compliancePercent < 95,
      noData: data.compliancePercent === null,
    },
    {
      key: 'works_value',
      label: 'Unbilled WIP',
      value: data.currentWorksGbp > 0 ? `£${(data.currentWorksGbp / 1000).toFixed(0)}k` : '£0',
      subtext: data.currentWorksGbp > 0 ? 'Open WIP' : 'No active works',
      icon: DollarSign,
      alert: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => {
        const Icon = m.icon;
        const isActive = activeMetric === m.key;
        const isNoData = (m as any).noData;
        return (
          <button
            key={m.key}
            onClick={() => onMetricClick?.(m.key)}
            className={`rounded-[14px] border p-3.5 text-left transition-all ${
              isActive
                ? 'border-[#FF6B24] bg-[#FFF7F3] shadow-[0_0_0_2px_rgba(255,107,36,0.15)]'
                : 'border-[#E4E4E1] bg-[#FFFFFF] hover:border-[#D0D0CD]'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Icon className={`h-3.5 w-3.5 ${m.alert ? 'text-red-500' : 'text-[#686866]'}`} />
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9B9B97]">
                {m.label}
              </span>
            </div>
            <div className={`font-mono text-[18px] font-light tabular-nums ${
              isNoData ? 'text-[#B0B0AD]' : m.alert ? 'text-red-500' : 'text-[#101010]'
            }`}>
              {m.value}
            </div>
            <div className="text-[10.5px] text-[#9B9B97] mt-0.5 leading-tight">
              {m.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
}
