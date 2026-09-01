'use client';

/**
 * CLIENT COMPONENT: LiveWorkOrderTriageClient
 * ===========================================
 * Operational Live Work Order Triage Board and Table with real-time sync,
 * multi-tier filtering, SLA radar warnings, and Kanban buckets.
 */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Wrench,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Coins,
  Radio,
} from 'lucide-react';
import { WorkOrderTriageItem, CanonicalTriageBucket } from '@/server/work/triage-service';

interface LiveWorkOrderTriageClientProps {
  initialWorkOrders: WorkOrderTriageItem[];
  orgName: string;
}

const BUCKET_DEFINITIONS: Array<{ key: CanonicalTriageBucket; label: string; color: string }> = [
  { key: 'NEW', label: 'New / Reported', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
  { key: 'NEEDS_TRIAGE', label: 'Needs Triage', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
  { key: 'ASSIGNED', label: 'Assigned / Dispatched', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
  { key: 'SCHEDULED', label: 'Scheduled / En Route', color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400' },
  { key: 'IN_PROGRESS', label: 'In Progress (On Site)', color: 'border-brand-electric/40 bg-brand-electric/10 text-brand-electric-bright' },
  { key: 'AWAITING', label: 'Awaiting Client / Parts', color: 'border-orange-500/30 bg-orange-500/5 text-orange-400' },
  { key: 'COMPLETED', label: 'Completed / QA', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
];

export function LiveWorkOrderTriageClient({
  initialWorkOrders,
  orgName,
}: LiveWorkOrderTriageClientProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrderTriageItem[]>(initialWorkOrders);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [selectedSite, setSelectedSite] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedSlaState, setSelectedSlaState] = useState('ALL');
  const [selectedBucket, setSelectedBucket] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time polling every 12 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/work-orders/triage');
        if (res.ok) {
          const data = await res.json();
          if (data.workOrders) {
            setWorkOrders(data.workOrders);
            setLastUpdated(new Date());
          }
        }
      } catch (err) {
        console.warn('[TRIAGE_POLL_WARN]', err);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/work-orders/triage');
      if (res.ok) {
        const data = await res.json();
        if (data.workOrders) {
          setWorkOrders(data.workOrders);
          setLastUpdated(new Date());
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const sites = useMemo(() => {
    const set = new Set<string>();
    workOrders.forEach((wo) => {
      if (wo.site_name) set.add(wo.site_name);
    });
    return Array.from(set);
  }, [workOrders]);

  const filteredOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchSearch =
        !search ||
        wo.work_order_number.toLowerCase().includes(search.toLowerCase()) ||
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        wo.description?.toLowerCase().includes(search.toLowerCase()) ||
        wo.asset_reference?.toLowerCase().includes(search.toLowerCase());

      const matchSite = selectedSite === 'ALL' || wo.site_name === selectedSite;
      const matchPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;
      const matchSla = selectedSlaState === 'ALL' || wo.sla_status.status === selectedSlaState;
      const matchBucket = selectedBucket === 'ALL' || wo.canonical_bucket === selectedBucket;

      return matchSearch && matchSite && matchPriority && matchSla && matchBucket;
    });
  }, [workOrders, search, selectedSite, selectedPriority, selectedSlaState, selectedBucket]);

  const atRiskCount = useMemo(() => workOrders.filter((w) => w.sla_status.status === 'AT_RISK').length, [workOrders]);
  const breachedCount = useMemo(() => workOrders.filter((w) => w.sla_status.status === 'BREACHED').length, [workOrders]);
  const awaitingClientCount = useMemo(() => workOrders.filter((w) => w.is_awaiting_client).length, [workOrders]);

  return (
    <div className="space-y-6">
      {/* ─── HEADER & REAL-TIME SYNC STATUS ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              OPERATIONAL WORK ORDER TRIAGE &bull; LIVE RADAR
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Sync Active
            </span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Work Order Triage</h1>
          <p className="text-xs text-brand-mist/70">
            Live reactive tickets, scheduled attendances, and SLA compliance tracking across {orgName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-0.5">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-brand-electric text-white shadow-sm'
                  : 'text-brand-mist/60 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-electric text-white shadow-sm'
                  : 'text-brand-mist/60 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-brand-edge-dark bg-brand-carbon/60 text-brand-mist text-xs hover:bg-brand-void hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            href="/clients/log-a-job"
            className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all shadow-md shadow-brand-electric/20"
          >
            + Log a Job
          </Link>
        </div>
      </div>

      {/* ─── LIVE SLA RADAR BANNER ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10.5px] text-brand-mist/50 uppercase">Total Active WOs</span>
            <p className="text-xl font-light text-white mt-0.5">{workOrders.length}</p>
          </div>
          <Wrench className="w-5 h-5 text-brand-electric/60" />
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10.5px] text-amber-400 uppercase">SLA At Risk (&lt;60m)</span>
            <p className="text-xl font-light text-amber-400 mt-0.5">{atRiskCount}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-400/60 animate-pulse" />
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10.5px] text-rose-400 uppercase">SLA Breached</span>
            <p className="text-xl font-light text-rose-400 mt-0.5">{breachedCount}</p>
          </div>
          <AlertCircle className="w-5 h-5 text-rose-400/60" />
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10.5px] text-purple-400 uppercase">Awaiting Client / Quote</span>
            <p className="text-xl font-light text-purple-300 mt-0.5">{awaitingClientCount}</p>
          </div>
          <Coins className="w-5 h-5 text-purple-400/60" />
        </div>
      </div>

      {/* ─── FILTER CONTROLS ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-mist/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by WO reference, issue title, equipment ref..."
              className="w-full rounded-xl bg-brand-void border border-brand-edge-dark pl-9 pr-4 py-2 text-xs text-white placeholder-brand-mist/30 focus:border-brand-electric focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All Sites</option>
              {sites.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1_CRITICAL">P1 — Critical (2h SLA)</option>
              <option value="P2_HIGH">P2 — High (4h SLA)</option>
              <option value="P3_MEDIUM">P3 — Medium (24h SLA)</option>
              <option value="P4_LOW">P4 — Low (72h SLA)</option>
              <option value="P5_SCHEDULED">P5 — Scheduled</option>
            </select>

            <select
              value={selectedSlaState}
              onChange={(e) => setSelectedSlaState(e.target.value)}
              className="rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-xs text-brand-mist focus:border-brand-electric focus:outline-none"
            >
              <option value="ALL">All SLA States</option>
              <option value="AT_RISK">SLA At Risk (&lt;60m)</option>
              <option value="BREACHED">SLA Breached</option>
              <option value="ON_TRACK">On Track</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── KANBAN BOARD VIEW ───────────────────────────────────────────── */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 items-start overflow-x-auto pb-4">
          {BUCKET_DEFINITIONS.map((b) => {
            const bucketItems = filteredOrders.filter((wo) => wo.canonical_bucket === b.key);
            return (
              <div
                key={b.key}
                className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 flex flex-col min-w-[240px] max-h-[750px] shadow-lg"
              >
                {/* Bucket Header */}
                <div className="p-3 border-b border-brand-edge-dark flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{b.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${b.color}`}>
                    {bucketItems.length}
                  </span>
                </div>

                {/* Bucket Card List */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[140px]">
                  {bucketItems.length === 0 ? (
                    <div className="p-6 text-center text-brand-mist/30 text-xs">
                      No active jobs
                    </div>
                  ) : (
                    bucketItems.map((wo) => {
                      const isBreached = wo.sla_status.status === 'BREACHED';
                      const isAtRisk = wo.sla_status.status === 'AT_RISK';

                      return (
                        <Link
                          key={wo.id}
                          href={`/clients/work-orders/${wo.id}`}
                          className={`block p-3 rounded-xl border bg-brand-void/90 hover:border-brand-electric transition-all group space-y-2 relative shadow-md ${
                            isBreached
                              ? 'border-rose-500/40 hover:border-rose-500'
                              : isAtRisk
                              ? 'border-amber-500/40 hover:border-amber-500'
                              : 'border-brand-edge-dark'
                          }`}
                        >
                          {/* Top Row: Ref & Priority */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[11px] font-medium text-brand-electric-bright group-hover:underline">
                              {wo.work_order_number}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.5 rounded border border-brand-edge-dark bg-brand-carbon text-brand-mist/70">
                              {wo.priority}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-normal text-white line-clamp-2 leading-tight">
                            {wo.title}
                          </h4>

                          {/* Site & Asset */}
                          <div className="text-[10.5px] text-brand-mist/60 space-y-0.5">
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-brand-electric shrink-0" />
                              <span className="truncate">{wo.site_name}</span>
                            </div>
                            {wo.asset_reference && (
                              <div className="flex items-center gap-1 text-brand-mist/50">
                                <span className="font-mono text-[10px] text-brand-electric-bright/80">{wo.asset_reference}</span>
                              </div>
                            )}
                          </div>

                          {/* SLA & Status Badges */}
                          <div className="pt-1.5 border-t border-brand-edge-dark/30 flex items-center justify-between gap-1">
                            {isBreached ? (
                              <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> SLA BREACHED
                              </span>
                            ) : isAtRisk ? (
                              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 animate-pulse" /> {Math.round(wo.sla_status.minutesRemaining || 0)}m left
                              </span>
                            ) : (
                              <span className="text-[10px] text-brand-mist/40 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(wo.created_at).toLocaleDateString('en-GB')}
                              </span>
                            )}

                            {wo.is_awaiting_quote && (
                              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-medium">
                                Quote Req
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── DENSE TABLE LIST VIEW ───────────────────────────────────────── */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-brand-edge-dark bg-brand-void/80 text-brand-mist/60 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">WO Number</th>
                <th className="px-5 py-3.5">Issue Description</th>
                <th className="px-5 py-3.5">Site Location</th>
                <th className="px-5 py-3.5">Assigned Contractor</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">SLA Radar</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-brand-mist/40">
                    No work orders found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((wo) => {
                  const isBreached = wo.sla_status.status === 'BREACHED';
                  const isAtRisk = wo.sla_status.status === 'AT_RISK';

                  return (
                    <tr key={wo.id} className="hover:bg-brand-void/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-brand-electric-bright">
                        <Link href={`/clients/work-orders/${wo.id}`} className="hover:underline">
                          {wo.work_order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        <span className="text-white font-normal block truncate">{wo.title}</span>
                        {wo.asset_reference && (
                          <span className="text-[10.5px] text-brand-mist/50">Tag: {wo.asset_reference}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-brand-mist/80">{wo.site_name}</td>
                      <td className="px-5 py-3.5 text-brand-mist/80">
                        {wo.provider_name ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-brand-electric" /> {wo.provider_name}
                          </span>
                        ) : (
                          <span className="text-brand-mist/40">Triage / Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-normal">{wo.priority}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isBreached ? (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                            <AlertCircle className="w-3 h-3" /> BREACHED
                          </span>
                        ) : isAtRisk ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400 animate-pulse">
                            <Clock className="w-3 h-3" /> {Math.round(wo.sla_status.minutesRemaining || 0)}m remaining
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> On Track
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 text-[10px] text-brand-electric-bright">
                          {wo.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/clients/work-orders/${wo.id}`}
                          className="px-2.5 py-1 rounded-lg border border-brand-edge-dark bg-brand-void/60 text-brand-mist hover:text-white hover:border-brand-electric/50 text-[11px] inline-flex items-center gap-1 transition-all"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
