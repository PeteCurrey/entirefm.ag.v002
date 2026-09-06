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
    <div className="rounded-[10px] border border-cafm-border bg-cafm-surface-card overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-cafm-border">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isActive = activeMetric === m.key;
          const isNoData = (m as any).noData;
          return (
            <button
              key={m.key}
              onClick={() => onMetricClick?.(m.key)}
              className={`p-4 text-left transition-all relative ${
                isActive
                  ? 'bg-cafm-surface-muted shadow-[inset_0_-2px_0_#EA580C]'
                  : 'hover:bg-cafm-surface-muted'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="text-[11px] font-normal text-cafm-text-secondary uppercase tracking-wide">
                  {m.label}
                </span>
                <Icon className={`h-3.5 w-3.5 ${m.alert ? 'text-cafm-critical-dot' : 'text-cafm-text-muted'}`} />
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl lg:text-3xl font-light tracking-tight ${
                    isNoData
                      ? 'text-cafm-text-muted'
                      : m.alert
                      ? 'text-cafm-critical-dot font-normal'
                      : 'text-cafm-text-primary font-normal'
                  }`}
                >
                  {m.value}
                </span>
              </div>

              <div className="mt-1 text-[11.5px] text-cafm-text-secondary truncate">
                {m.subtext}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
