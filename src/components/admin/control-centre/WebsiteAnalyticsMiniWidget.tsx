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
        className={`inline-flex items-center gap-0.5 text-[10.5px] font-mono font-semibold ${
          trend === 'up' ? 'text-[#15803D]' : trend === 'down' ? 'text-[#DC2626]' : 'text-[#686866]'
        }`}
      >
        {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        <span>{changePct > 0 ? `+${changePct}%` : `${changePct}%`}</span>
      </span>
    );
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F9F9F8] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#101010] text-white">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              WEBSITE &amp; COMMERCIAL CONVERSION
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              Real website traffic and enquiry conversion performance (Last 30 Days)
            </p>
          </div>
        </div>

        <Link
          href="/admin/analytics"
          className="text-[11.5px] font-semibold text-[#101010] hover:text-[#FF3E9D] inline-flex items-center gap-1 transition-colors"
        >
          <span>Executive Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
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
          <Link href="/admin/analytics?tab=integrations" className="font-bold underline ml-2">
            Configure Integration
          </Link>
        </div>
      )}

      {/* Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E4E4E1] bg-[#FBFBFA]">
        {/* Users */}
        <div className="p-4 space-y-1">
          <span className="font-mono text-[10px] uppercase font-bold text-[#686866] block">
            Website Users
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#101010]">
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
          <span className="font-mono text-[10px] uppercase font-bold text-[#686866] block">
            Inbound Enquiries
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#FF3E9D]">
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
          <span className="font-mono text-[10px] uppercase font-bold text-[#686866] block">
            Conversion Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#15803D]">
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
          <span className="font-mono text-[10px] uppercase font-bold text-[#686866] block">
            Organic Search Clicks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#101010]">
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
