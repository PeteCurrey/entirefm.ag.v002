'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Download,
  RefreshCw,
  Search,
  Globe,
  Users,
  Mail,
  ShieldCheck,
  MousePointer,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet,
  FileSpreadsheet,
  ExternalLink,
  ChevronDown,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  AnalyticsPeriod,
  AnalyticsSummary,
  MetricDelta,
  PagePerformanceItem,
  SearchQueryItem,
  SearchPageItem,
  ServicePerformanceItem,
  LocationPerformanceItem,
  ToolPerformanceItem,
  SeoOpportunity,
} from '@/server/analytics/types';

interface AnalyticsDashboardClientProps {
  initialData: AnalyticsSummary;
}

export function AnalyticsDashboardClient({ initialData }: AnalyticsDashboardClientProps) {
  const [data, setData] = useState<AnalyticsSummary>(initialData);
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialData.period);
  const [activeTab, setActiveTab] = useState<'overview' | 'acquisition' | 'seo' | 'pages' | 'conversions' | 'integrations'>('overview');
  const [loading, setLoading] = useState<boolean>(false);
  const [trafficMetric, setTrafficMetric] = useState<'users' | 'sessions' | 'organicClicks'>('users');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const router = useRouter();

  const handlePeriodChange = async (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${newPeriod}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error('[ANALYTICS_PERIOD_CHANGE_ERR]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}&refresh=true`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error('[ANALYTICS_REFRESH_ERR]', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = (filename: string, rows: Array<Record<string, any>>) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            let val = row[header] ?? '';
            if (typeof val === 'string') {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${period}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { kpis, integrations, timeSeries } = data;

  const renderDeltaPill = (delta: MetricDelta, suffix = '') => {
    if (delta.changePct === null) return null;
    return (
      <span
        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-normal ${
          delta.trend === 'up'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : delta.trend === 'down'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
        }`}
      >
        {delta.trend === 'up' ? (
          <TrendingUp className="h-3 w-3 text-emerald-600" />
        ) : delta.trend === 'down' ? (
          <TrendingDown className="h-3 w-3 text-red-600" />
        ) : (
          <Minus className="h-3 w-3 text-zinc-500" />
        )}
        <span>
          {delta.changePct > 0 ? `+${delta.changePct}%` : `${delta.changePct}%`}
          {suffix}
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E4E4E1] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#FF3E9D]" />
            <span className="text-[11px] font-normal uppercase tracking-wider text-[#FF3E9D]">
              WEBSITE PERFORMANCE &amp; COMMERCIAL INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[#101010]">
            Website Analytics &amp; Demand Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#686866] mt-1">
            Verified production data across traffic acquisition, Google search rankings, interactive tools, and commercial lead generation.
          </p>
        </div>

        {/* Date Controls & Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector */}
          <div className="flex items-center rounded-[8px] border border-[#E4E4E1] bg-white p-1 shadow-sm">
            {(
              [
                { key: '7d', label: '7D' },
                { key: '30d', label: '30D' },
                { key: '90d', label: '90D' },
                { key: 'this_month', label: 'Month' },
                { key: 'this_year', label: 'Year' },
              ] as const
            ).map((p) => (
              <button
                key={p.key}
                onClick={() => handlePeriodChange(p.key)}
                disabled={loading}
                className={`px-3 py-1 text-xs font-normal rounded-[6px] transition-colors ${
                  period === p.key
                    ? 'bg-[#101010] text-white shadow-sm'
                    : 'text-[#686866] hover:bg-[#F5F5F3] hover:text-[#101010]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#E4E4E1] bg-white text-xs font-normal text-[#686866] hover:text-[#101010] hover:bg-[#F5F5F3] shadow-sm transition-all"
            title="Force refresh data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#FF3E9D]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Integration Warning Banner if missing GA4 or Search Console */}
      {(!integrations.ga4.connected || !integrations.searchConsole.connected) && (
        <div className="rounded-[12px] border border-[#FDE68A] bg-[#FFFBEB] p-4 text-xs text-[#92400E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <strong className="font-light text-[#78350F]">
                External Analytics Credentials Required for Full Telemetry.
              </strong>
              <p className="mt-0.5 text-[#92400E]">
                {!integrations.ga4.connected && !integrations.searchConsole.connected
                  ? 'Google Analytics 4 and Google Search Console service account credentials are not configured in environment variables. Database enquiries and local attribution are active.'
                  : !integrations.ga4.connected
                  ? 'Google Analytics 4 is not connected. Add GOOGLE_ANALYTICS_PROPERTY_ID to enable user session tracking.'
                  : 'Google Search Console is not connected. Add SEARCH_CONSOLE_SITE_URL to enable live keyword ranking data.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('integrations')}
            className="inline-flex items-center gap-1 bg-[#78350F] text-white px-3 py-1.5 rounded-[6px] font-light hover:bg-[#92400E] transition-colors shrink-0"
          >
            <span>View Integration Guide</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 2. Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Users */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-light text-[#686866]">Website Users</span>
            <Users className="h-4 w-4 text-[#9B9B97]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extralight text-[#101010]">
              {integrations.ga4.connected ? kpis.users.current.toLocaleString() : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            {integrations.ga4.connected ? renderDeltaPill(kpis.users) : <span className="text-[10px] font-normal text-zinc-400">GA4 Not Connected</span>}
            <span className="text-[10px] text-[#9B9B97] font-normal">vs prev {data.dateRange.label.toLowerCase()}</span>
          </div>
        </div>

        {/* Sessions */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-light text-[#686866]">Total Sessions</span>
            <Globe className="h-4 w-4 text-[#9B9B97]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extralight text-[#101010]">
              {integrations.ga4.connected ? kpis.sessions.current.toLocaleString() : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            {integrations.ga4.connected ? renderDeltaPill(kpis.sessions) : <span className="text-[10px] font-normal text-zinc-400">GA4 Not Connected</span>}
            <span className="text-[10px] text-[#9B9B97] font-normal">vs prev period</span>
          </div>
        </div>

        {/* Enquiries */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-light text-[#686866]">Inbound Enquiries</span>
            <Mail className="h-4 w-4 text-[#FF3E9D]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extralight text-[#FF3E9D]">
              {kpis.enquiries.current.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            {renderDeltaPill(kpis.enquiries)}
            <span className="text-[10px] text-[#9B9B97] font-normal">EntireFM DB Sink</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-[12px] border border-[#E4E4E1] bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-light text-[#686866]">Website Conversion</span>
            <Zap className="h-4 w-4 text-[#15803D]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extralight text-[#15803D]">
              {kpis.conversionRate.current}%
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            {renderDeltaPill(kpis.conversionRate)}
            <span className="text-[10px] text-[#9B9B97] font-normal">Enquiries ÷ Sessions</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex border-b border-[#E4E4E1] overflow-x-auto gap-2 text-xs font-normal text-[#686866]">
        {[
          { key: 'overview', label: 'Executive Overview' },
          { key: 'acquisition', label: 'Traffic & Acquisition' },
          { key: 'seo', label: 'SEO & Search Console' },
          { key: 'pages', label: 'Pages, Services & Locations' },
          { key: 'conversions', label: 'Conversions & Interactive Tools' },
          { key: 'integrations', label: 'Data Sources & Setup' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap ${
              activeTab === t.key
                ? 'border-[#101010] text-[#101010]'
                : 'border-transparent text-[#686866] hover:text-[#101010]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Panels */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Traffic Trend & Enquiries vs Traffic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Time Series Chart */}
            <div className="lg:col-span-8 rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E4E1] pb-3">
                <div>
                  <h3 className="text-sm font-normal text-[#101010]">Website Traffic &amp; Enquiries Timeline</h3>
                  <p className="text-[11.5px] text-[#686866]">Daily trend for {data.dateRange.label.toLowerCase()}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['users', 'sessions', 'organicClicks'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setTrafficMetric(m)}
                      className={`px-2.5 py-1 rounded text-[11px] font-normal capitalize transition-colors ${
                        trafficMetric === m
                          ? 'bg-[#101010] text-white'
                          : 'bg-[#F5F5F3] text-[#686866] hover:text-[#101010]'
                      }`}
                    >
                      {m === 'organicClicks' ? 'Google Clicks' : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visualizer */}
              {timeSeries.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-xs text-[#686866] gap-2">
                  <BarChart3 className="h-8 w-8 text-[#9B9B97]" />
                  <p className="font-light text-slate-800">No Time-Series Data Available for This Period</p>
                  <p className="text-[11px] text-slate-500">Connect Google Analytics 4 to stream live traffic time series.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-56 flex items-end gap-1.5 pt-6 pb-2 px-2 overflow-x-auto border-b border-[#E4E4E1]">
                    {timeSeries.map((pt, idx) => {
                      const val = pt[trafficMetric] || 0;
                      const maxVal = Math.max(...timeSeries.map((t) => t[trafficMetric] || 0), 10);
                      const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
                      const enquiriesCount = pt.enquiries || 0;

                      return (
                        <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center gap-1.5 group relative">
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-[#101010] text-white p-2 rounded-[6px] text-[10px] font-normal whitespace-nowrap z-20 shadow-lg pointer-events-none">
                            <span className="font-light">{pt.date}</span>
                            <span>{trafficMetric}: {val.toLocaleString()}</span>
                            <span>Enquiries: {enquiriesCount}</span>
                          </div>

                          {/* Enquiries Indicator Pin */}
                          {enquiriesCount > 0 && (
                            <span className="h-2 w-2 rounded-full bg-[#FF3E9D] ring-2 ring-white" title={`${enquiriesCount} enquiry`} />
                          )}

                          {/* Bar */}
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-[3px] transition-all ${
                              enquiriesCount > 0
                                ? 'bg-gradient-to-t from-[#101010] to-[#FF3E9D]'
                                : 'bg-[#101010]/80 group-hover:bg-[#101010]'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] font-normal text-[#9B9B97] px-2">
                    <span>{timeSeries[0]?.date}</span>
                    <span>{timeSeries[timeSeries.length - 1]?.date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Channels & Conversion Breakdown */}
            <div className="lg:col-span-4 rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <div className="border-b border-[#E4E4E1] pb-3">
                <h3 className="text-sm font-normal text-[#101010]">Enquiries by Acquisition Channel</h3>
                <p className="text-[11.5px] text-[#686866]">Which marketing channels convert</p>
              </div>

              {data.trafficSources.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#686866]">
                  No channel attribution recorded in selected period.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.trafficSources.slice(0, 6).map((src) => (
                    <div key={src.channel} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-light text-[#101010]">{src.channel}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-light text-[#FF3E9D]">{src.enquiries} leads</span>
                          <span className="font-normal text-[11px] text-[#686866]">({src.sharePct}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#F0F0EE] overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.max(5, src.sharePct))}%` }}
                          className="h-full bg-[#101010] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Lead Generating Pages Table */}
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E4E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F8]">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Pages Generating Commercial Enquiries</h3>
                <p className="text-[11.5px] text-[#686866]">Direct page attribution joined with database lead sink</p>
              </div>
              <button
                onClick={() => exportToCsv('entirefm-top-pages', data.topPages)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E4E4E1] bg-white text-xs font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {data.topPages.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#686866]">
                No page performance rows found for this date range.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#333332]">
                  <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                    <tr>
                      <th className="py-3 px-4">Page Path</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Page Views</th>
                      <th className="py-3 px-4 text-right">Sessions</th>
                      <th className="py-3 px-4 text-right">Enquiries</th>
                      <th className="py-3 px-4 text-right">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E1]">
                    {data.topPages.slice(0, 10).map((p) => (
                      <tr key={p.path} className="hover:bg-[#FAFAF9] transition-colors">
                        <td className="py-3.5 px-4 font-normal text-[#101010] max-w-xs truncate">
                          <a href={p.path} target="_blank" rel="noreferrer" className="hover:text-[#FF3E9D] flex items-center gap-1">
                            <span>{p.path}</span>
                            <ExternalLink className="h-3 w-3 text-[#9B9B97]" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[9.5px] font-normal uppercase bg-[#F0F0EE] text-[#686866]">
                            {p.pageType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-normal">{p.views.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-normal">{p.sessions.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-right font-light text-[#FF3E9D]">
                          {p.enquiries > 0 ? p.enquiries : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-light text-[#15803D]">
                          {p.conversionRate !== null ? `${p.conversionRate}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: ACQUISITION */}
      {activeTab === 'acquisition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <div className="border-b border-[#E4E4E1] pb-3">
                <h3 className="text-sm font-normal text-[#101010]">Marketing Channels (GA4)</h3>
                <p className="text-[11.5px] text-[#686866]">Default Channel Grouping with Enquiry Conversion</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#333332]">
                  <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                    <tr>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3 text-right">Sessions</th>
                      <th className="py-2.5 px-3 text-right">Share</th>
                      <th className="py-2.5 px-3 text-right">Enquiries</th>
                      <th className="py-2.5 px-3 text-right">Conv %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E1]">
                    {data.trafficSources.map((src) => (
                      <tr key={src.channel} className="hover:bg-[#FAFAF9]">
                        <td className="py-2.5 px-3 font-light text-[#101010]">{src.channel}</td>
                        <td className="py-2.5 px-3 text-right font-normal">{src.sessions.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-normal">{src.sharePct}%</td>
                        <td className="py-2.5 px-3 text-right font-light text-[#FF3E9D]">{src.enquiries}</td>
                        <td className="py-2.5 px-3 text-right font-normal text-[#15803D]">
                          {src.conversionRate !== null ? `${src.conversionRate}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referring Domains */}
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <div className="border-b border-[#E4E4E1] pb-3">
                <h3 className="text-sm font-normal text-[#101010]">Top Referring Websites</h3>
                <p className="text-[11.5px] text-[#686866]">Inbound referrals from external domains &amp; partner portals</p>
              </div>

              {data.referringSites.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#686866]">
                  No external referral traffic recorded in this period.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#333332]">
                    <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                      <tr>
                        <th className="py-2.5 px-3">Source Domain</th>
                        <th className="py-2.5 px-3">Medium</th>
                        <th className="py-2.5 px-3 text-right">Sessions</th>
                        <th className="py-2.5 px-3 text-right">Leads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E1]">
                      {data.referringSites.slice(0, 8).map((ref, idx) => (
                        <tr key={idx} className="hover:bg-[#FAFAF9]">
                          <td className="py-2.5 px-3 font-normal text-[#101010]">{ref.source}</td>
                          <td className="py-2.5 px-3 font-normal text-slate-500">{ref.medium}</td>
                          <td className="py-2.5 px-3 text-right font-normal">{ref.sessions.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-light text-[#FF3E9D]">{ref.enquiries}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Device & Geographic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-normal text-[#101010] border-b border-[#E4E4E1] pb-3">Device Mix</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Monitor className="h-4 w-4 text-slate-400" />
                    Desktop
                  </span>
                  <span className="font-light">{data.deviceBreakdown.desktopPct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                    Mobile
                  </span>
                  <span className="font-light">{data.deviceBreakdown.mobilePct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Tablet className="h-4 w-4 text-slate-400" />
                    Tablet
                  </span>
                  <span className="font-light">{data.deviceBreakdown.tabletPct}%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-normal text-[#101010] border-b border-[#E4E4E1] pb-3">Top Visitor Geographies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.geographicBreakdown.slice(0, 8).map((geo, idx) => (
                  <div key={idx} className="p-3 bg-[#FBFBFA] border border-[#E4E4E1] rounded-[8px] space-y-1">
                    <span className="text-xs font-normal text-[#101010] block truncate">
                      {geo.city ? `${geo.city}` : geo.country}
                    </span>
                    <span className="text-[11px] font-normal text-[#686866] block">
                      {geo.sessions.toLocaleString()} sessions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SEO & SEARCH CONSOLE */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-[12px] bg-white border border-[#E4E4E1] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-light text-[#686866] block">Organic Clicks</span>
              <span className="text-2xl font-extralight text-[#101010]">
                {integrations.searchConsole.connected ? kpis.organicClicks.current.toLocaleString() : '—'}
              </span>
              {integrations.searchConsole.connected && renderDeltaPill(kpis.organicClicks)}
            </div>

            <div className="p-4 rounded-[12px] bg-white border border-[#E4E4E1] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-light text-[#686866] block">Search Impressions</span>
              <span className="text-2xl font-extralight text-[#101010]">
                {integrations.searchConsole.connected ? kpis.organicImpressions.current.toLocaleString() : '—'}
              </span>
              {integrations.searchConsole.connected && renderDeltaPill(kpis.organicImpressions)}
            </div>

            <div className="p-4 rounded-[12px] bg-white border border-[#E4E4E1] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-light text-[#686866] block">Average CTR</span>
              <span className="text-2xl font-extralight text-[#101010]">
                {integrations.searchConsole.connected ? `${kpis.avgCtr.current}%` : '—'}
              </span>
              {integrations.searchConsole.connected && renderDeltaPill(kpis.avgCtr)}
            </div>

            <div className="p-4 rounded-[12px] bg-white border border-[#E4E4E1] shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-light text-[#686866] block">Average Position</span>
              <span className="text-2xl font-extralight text-[#101010]">
                {integrations.searchConsole.connected ? kpis.avgPosition.current : '—'}
              </span>
              {integrations.searchConsole.connected && renderDeltaPill(kpis.avgPosition)}
            </div>
          </div>

          {/* Deterministic SEO Opportunities */}
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-3">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Deterministic SEO &amp; Growth Opportunities</h3>
                <p className="text-[11.5px] text-[#686866]">
                  Data-driven recommendations computed from real Search Console queries and conversion rates
                </p>
              </div>
              <span className="text-xs font-light text-[#FF3E9D]">
                {data.seoOpportunities.length} actionable items
              </span>
            </div>

            {data.seoOpportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#686866]">
                No deterministic SEO anomalies detected in this date range.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.seoOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-[10px] bg-[#FBFBFA] border border-[#E4E4E1] space-y-2 hover:border-[#D1D1CD] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-normal text-[#101010] leading-snug">{opp.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[9.5px] uppercase font-light ${
                          opp.impact === 'HIGH'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : opp.impact === 'QUICK_WIN'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {opp.impact}
                      </span>
                    </div>

                    <p className="text-[11.5px] text-[#686866] leading-relaxed">{opp.reason}</p>

                    <div className="p-2.5 rounded-[6px] bg-white border border-[#E4E4E1] text-[11px] text-[#333332]">
                      <strong className="font-light text-[#101010]">Action:</strong> {opp.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Search Queries Table */}
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E4E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F8]">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Google Search Queries</h3>
                <p className="text-[11.5px] text-[#686866]">Genuine Google Search Console queries and click-through rates</p>
              </div>
              <button
                onClick={() => exportToCsv('entirefm-search-queries', data.searchQueries)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E4E4E1] bg-white text-xs font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {data.searchQueries.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#686866]">
                No search queries returned from Search Console for this range.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left text-xs text-[#333332]">
                  <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1] sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Search Query</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Impressions</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E1]">
                    {data.searchQueries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFAF9]">
                        <td className="py-3 px-4 font-normal text-[#101010]">{q.query}</td>
                        <td className="py-3 px-4 text-right font-light">{q.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-normal text-[#686866]">{q.impressions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-normal text-[#15803D]">{q.ctr}%</td>
                        <td className="py-3 px-4 text-right font-light text-[#FF3E9D]">{q.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PAGES, SERVICES & LOCATIONS */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          {/* Canonical Services Performance */}
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E4E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F8]">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Canonical Service Lines Performance</h3>
                <p className="text-[11.5px] text-[#686866]">Enquiries generated per commercial service capability</p>
              </div>
              <button
                onClick={() => exportToCsv('entirefm-service-performance', data.servicePerformance)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E4E4E1] bg-white text-xs font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#333332]">
                <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                  <tr>
                    <th className="py-3 px-4">Service Line</th>
                    <th className="py-3 px-4">Canonical Path</th>
                    <th className="py-3 px-4 text-right">Sessions</th>
                    <th className="py-3 px-4 text-right">Enquiries</th>
                    <th className="py-3 px-4 text-right">Qualified Leads</th>
                    <th className="py-3 px-4 text-right">Conv Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E1]">
                  {data.servicePerformance.map((srv) => (
                    <tr key={srv.serviceName} className="hover:bg-[#FAFAF9]">
                      <td className="py-3.5 px-4 font-light text-[#101010]">{srv.serviceName}</td>
                      <td className="py-3.5 px-4 font-normal text-[#686866]">{srv.canonicalPath}</td>
                      <td className="py-3.5 px-4 text-right font-normal">{srv.sessions.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-light text-[#FF3E9D]">{srv.enquiries}</td>
                      <td className="py-3.5 px-4 text-right font-light text-[#15803D]">{srv.qualifiedLeads}</td>
                      <td className="py-3.5 px-4 text-right font-normal text-[#686866]">
                        {srv.conversionRate !== null ? `${srv.conversionRate}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Canonical Location Performance */}
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E4E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F8]">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Regional &amp; City Landing Pages</h3>
                <p className="text-[11.5px] text-[#686866]">Search visibility and commercial lead volume by metro region</p>
              </div>
              <button
                onClick={() => exportToCsv('entirefm-location-performance', data.locationPerformance)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#E4E4E1] bg-white text-xs font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#333332]">
                <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                  <tr>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4 text-right">Google Clicks</th>
                    <th className="py-3 px-4 text-right">Impressions</th>
                    <th className="py-3 px-4 text-right">Enquiries</th>
                    <th className="py-3 px-4 text-right">Conv %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E1]">
                  {data.locationPerformance.map((loc) => (
                    <tr key={loc.locationName} className="hover:bg-[#FAFAF9]">
                      <td className="py-3.5 px-4 font-light text-[#101010]">{loc.locationName}</td>
                      <td className="py-3.5 px-4 font-normal text-[#686866]">{loc.canonicalPath}</td>
                      <td className="py-3.5 px-4 text-right font-normal">{loc.organicClicks.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-normal text-[#686866]">{loc.organicImpressions.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-light text-[#FF3E9D]">{loc.enquiries}</td>
                      <td className="py-3.5 px-4 text-right font-normal text-[#15803D]">
                        {loc.conversionRate !== null ? `${loc.conversionRate}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONVERSIONS & INTERACTIVE TOOLS */}
      {activeTab === 'conversions' && (
        <div className="space-y-6">
          <div className="rounded-[16px] border border-[#E4E4E1] bg-white overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E4E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F9F8]">
              <div>
                <h3 className="text-sm font-normal text-[#101010]">Interactive Resource Tools Performance</h3>
                <p className="text-[11.5px] text-[#686866]">
                  Usage, completion rates, and lead generation from interactive engineering calculators and builders
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#333332]">
                <thead className="bg-[#F5F5F3] font-normal uppercase text-[10px] text-[#686866] border-b border-[#E4E4E1]">
                  <tr>
                    <th className="py-3 px-4">Interactive Tool</th>
                    <th className="py-3 px-4">Tool Path</th>
                    <th className="py-3 px-4 text-right">Tool Visits</th>
                    <th className="py-3 px-4 text-right">Starts</th>
                    <th className="py-3 px-4 text-right">Completions</th>
                    <th className="py-3 px-4 text-right">Completion Rate</th>
                    <th className="py-3 px-4 text-right">Leads Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E1]">
                  {data.toolPerformance.map((tool) => (
                    <tr key={tool.toolId} className="hover:bg-[#FAFAF9]">
                      <td className="py-3.5 px-4 font-light text-[#101010]">{tool.toolName}</td>
                      <td className="py-3.5 px-4 font-normal text-[#686866]">
                        <a href={tool.path} target="_blank" rel="noreferrer" className="hover:text-[#FF3E9D]">
                          {tool.path}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right font-normal">{tool.views.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-normal">{tool.starts.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-normal">{tool.completions.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-light text-[#15803D]">
                        {tool.completionRate !== null ? `${tool.completionRate}%` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-light text-[#FF3E9D]">{tool.enquiries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INTEGRATIONS & SETUP */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Analytics 4 Setup */}
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-[8px] bg-[#FFF5F9] border border-[#FF3E9D]/30 flex items-center justify-center text-[#FF3E9D]">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#101010]">Google Analytics 4 Data API</h3>
                    <span className="text-[11px] font-normal text-[#686866]">Traffic, Users, &amp; Engagement</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-light border ${
                    integrations.ga4.connected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {integrations.ga4.connected ? 'Connected' : 'Requires Config'}
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#686866]">
                <p>
                  Streams real session, active user, device, and landing-page engagement metrics directly into the EntireFM command centre via the GA4 Data API v1beta.
                </p>
                <div className="p-3 bg-[#FBFBFA] border border-[#E4E4E1] rounded-[8px] font-normal text-[11px] space-y-1">
                  <div className="text-slate-500 font-light">REQUIRED ENVIRONMENT VARIABLES:</div>
                  <div>GOOGLE_ANALYTICS_PROPERTY_ID=987654321</div>
                  <div>GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com</div>
                  <div>GOOGLE_PRIVATE_KEY=&quot;-----BEGIN PRIVATE KEY-----\n...&quot;</div>
                </div>
              </div>
            </div>

            {/* Google Search Console Setup */}
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4E4E1] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#101010]">Google Search Console API</h3>
                    <span className="text-[11px] font-normal text-[#686866]">Rankings, Keywords, &amp; CTR</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-light border ${
                    integrations.searchConsole.connected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {integrations.searchConsole.connected ? 'Connected' : 'Requires Config'}
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#686866]">
                <p>
                  Provides verified search queries, organic impressions, click-through rates, and average SERP positions for all EntireFM web properties.
                </p>
                <div className="p-3 bg-[#FBFBFA] border border-[#E4E4E1] rounded-[8px] font-normal text-[11px] space-y-1">
                  <div className="text-slate-500 font-light">REQUIRED ENVIRONMENT VARIABLES:</div>
                  <div>SEARCH_CONSOLE_SITE_URL=https://entirefm.com</div>
                  <div>GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com</div>
                  <div>GOOGLE_PRIVATE_KEY=&quot;-----BEGIN PRIVATE KEY-----\n...&quot;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
