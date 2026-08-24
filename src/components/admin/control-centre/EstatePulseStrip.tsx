'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle, ShieldCheck, Activity, DollarSign, Building2, Wrench } from 'lucide-react';

export interface EstatePulseData {
  sitesCount: number;
  assetsCount: number;
  openJobsCount: number;
  slaPerformancePercent: number;
  compliancePercent: number;
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
      value: data.sitesCount.toLocaleString(),
      subtext: 'Across UK & IRE',
      icon: Building2,
      trend: '+2 this qtr',
      alert: false,
    },
    {
      key: 'assets',
      label: 'In-Service Assets',
      value: data.assetsCount.toLocaleString(),
      subtext: '99.4% registered',
      icon: Activity,
      trend: '100% telemetry',
      alert: false,
    },
    {
      key: 'open_jobs',
      label: 'Open Jobs',
      value: data.openJobsCount.toString(),
      subtext: data.criticalJobsCount ? `${data.criticalJobsCount} P1 critical` : 'Active dispatch',
      icon: Wrench,
      alert: (data.criticalJobsCount || 0) > 0,
      trend: data.criticalJobsCount ? `${data.criticalJobsCount} P1` : undefined,
    },
    {
      key: 'sla',
      label: 'SLA Performance',
      value: `${data.slaPerformancePercent.toFixed(1)}%`,
      subtext: data.slaBreachRiskCount ? `${data.slaBreachRiskCount} at risk (<60m)` : 'Target 95.0%',
      icon: AlertCircle,
      alert: (data.slaBreachRiskCount || 0) > 0,
      trend: data.slaPerformancePercent >= 95 ? 'On Target' : 'Under Target',
    },
    {
      key: 'compliance',
      label: 'Statutory Compliance',
      value: `${data.compliancePercent.toFixed(1)}%`,
      subtext: 'Audit-ready status',
      icon: ShieldCheck,
      alert: data.compliancePercent < 95,
      trend: 'Zero breaches',
    },
    {
      key: 'works_value',
      label: 'Current Works WIP',
      value: `£${(data.currentWorksGbp / 1000).toFixed(0)}k`,
      subtext: 'Committed & WIP',
      icon: DollarSign,
      trend: 'Under budget',
      alert: false,
    },
  ];

  return (
    <div className="rounded-[14px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-2">
        <div className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#686866]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B24]" />
          ESTATE PULSE · REAL-TIME TELEMETRY STRIP
        </div>
        <div className="font-mono text-[10px] text-[#9B9B97]">
          CLICK METRIC TO INSPECT
        </div>
      </div>

      {/* Grid of Precision Instrumentation Tiles */}
      <div className="grid grid-cols-2 divide-y divide-[#E4E4E1] sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:grid-cols-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isSelected = activeMetric === m.key;

          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onMetricClick && onMetricClick(m.key)}
              className={`p-4 text-left transition-all duration-150 relative group ${
                isSelected
                  ? 'bg-[#FFF7ED] ring-1 ring-inset ring-[#FF6B24]'
                  : 'hover:bg-[#F5F5F3]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF6B24]" />
              )}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#686866] truncate font-medium">
                  {m.label}
                </span>
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${
                    m.alert ? 'text-[#B91C1C]' : 'text-[#9B9B97] group-hover:text-[#101010]'
                  }`}
                />
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-light tracking-tight tabular-nums ${
                    m.alert ? 'text-[#B91C1C] font-normal' : 'text-[#101010]'
                  }`}
                >
                  {m.value}
                </span>
                {m.trend && (
                  <span
                    className={`font-mono text-[9.5px] font-medium ${
                      m.alert
                        ? 'text-[#B91C1C]'
                        : m.trend.includes('Target') || m.trend.includes('Zero')
                        ? 'text-[#15803D]'
                        : 'text-[#686866]'
                    }`}
                  >
                    {m.trend}
                  </span>
                )}
              </div>

              <div className="mt-1 truncate text-[11px] text-[#9B9B97]">
                {m.subtext}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
