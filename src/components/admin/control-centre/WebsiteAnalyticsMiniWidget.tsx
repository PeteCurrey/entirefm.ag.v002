'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight, TrendingUp, TrendingDown, Minus, Globe, Sparkles } from 'lucide-react';
import { AnalyticsSummary } from '@/server/analytics/types';

interface WebsiteAnalyticsMiniWidgetProps {
  analytics?: AnalyticsSummary | null;
}

export function WebsiteAnalyticsMiniWidget({ analytics }: WebsiteAnalyticsMiniWidgetProps) {
  if (!analytics) {
    return null;
  }

  const { kpis, integrations } = analytics;

  const renderTrend = (changePct: number | null, trend: 'up' | 'down' | 'flat') => {
    if (changePct === null) return null;
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[10.5px] font-mono font-light ${
          trend === 'up' ? 'text-[#15803D]' : trend === 'down' ? 'text-[#DC2626]' : 'text-[#686866]'
        }`}
      >
        {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        <span>{changePct > 0 ? `+${changePct}%` : `${changePct}%`}</span>
      </span>
    );
  };

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <BarChart3 className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
              Website &amp; Conversion Analytics
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              Real-time inbound digital telemetry (30 Days)
            </p>
          </div>
        </div>

        <Link
          href="/admin/analytics"
          className="text-[11.5px] font-normal text-[#EA580C] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>Analytics Hub</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Integration Notice if GA4 or Search Console pending */}
      {(!integrations.ga4.connected || !integrations.searchConsole.connected) && (
        <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 text-[11px] text-[#92400E] flex items-center justify-between">
          <span>
            {!integrations.ga4.connected && !integrations.searchConsole.connected
              ? 'GA4 & Search Console credentials pending configuration in environment variables.'
              : !integrations.ga4.connected
              ? 'GA4 Property ID not connected.'
              : 'Search Console site URL not connected.'}
          </span>
          <Link href="/admin/analytics?tab=integrations" className="font-light underline ml-2">
            Configure Integration
          </Link>
        </div>
      )}

      {/* Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E4E4E1] bg-[#FBFBFA]">
        {/* Users */}
        <div className="p-4 space-y-1">
          <span className="font-mono text-[10px] uppercase font-light text-[#686866] block">
            Website Users
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extralight text-[#101010]">
              {integrations.ga4.connected ? kpis.users.current.toLocaleString() : '—'}
            </span>
            {integrations.ga4.connected && renderTrend(kpis.users.changePct, kpis.users.trend)}
          </div>
          <span className="text-[10px] text-[#9B9B97] block font-mono">
            {integrations.ga4.connected ? 'GA4 verified' : 'Requires GA4'}
          </span>
        </div>

        {/* Inbound Enquiries */}
        <div className="p-4 space-y-1">
          <span className="font-mono text-[10px] uppercase font-light text-[#686866] block">
            Inbound Enquiries
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extralight text-[#FF3E9D]">
              {kpis.enquiries.current.toLocaleString()}
            </span>
            {renderTrend(kpis.enquiries.changePct, kpis.enquiries.trend)}
          </div>
          <span className="text-[10px] text-[#9B9B97] block font-mono">
            EntireFM DB Verified
          </span>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 space-y-1">
          <span className="font-mono text-[10px] uppercase font-light text-[#686866] block">
            Conversion Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extralight text-[#15803D]">
              {kpis.conversionRate.current}%
            </span>
            {renderTrend(kpis.conversionRate.changePct, kpis.conversionRate.trend)}
          </div>
          <span className="text-[10px] text-[#9B9B97] block font-mono">
            Enquiries ÷ Sessions
          </span>
        </div>

        {/* Organic Search Clicks */}
        <div className="p-4 space-y-1">
          <span className="font-mono text-[10px] uppercase font-light text-[#686866] block">
            Organic Search Clicks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extralight text-[#101010]">
              {integrations.searchConsole.connected ? kpis.organicClicks.current.toLocaleString() : '—'}
            </span>
            {integrations.searchConsole.connected && renderTrend(kpis.organicClicks.changePct, kpis.organicClicks.trend)}
          </div>
          <span className="text-[10px] text-[#9B9B97] block font-mono">
            {integrations.searchConsole.connected ? 'Search Console' : 'Requires GSC'}
          </span>
        </div>
      </div>
    </div>
  );
}
