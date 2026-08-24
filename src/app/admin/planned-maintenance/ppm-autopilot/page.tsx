import React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  Wrench,
  Zap,
  Flame,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Calendar,
  Layers,
  Cpu,
  TrendingUp,
  AlertCircle,
  Building,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────
// TEMPORARY MARKETING MOCK DATA FOR SCREENSHOTS
// (To be removed/reverted when marketing assets are captured)
// ─────────────────────────────────────────────────────────────

const MOCK_METRICS = {
  activePlanItems: 1428,
  dueThisWeek: 42,
  dueThisMonth: 186,
  overdue: 0,
  satisfied: 1242,
  exceptions: 3,
  statutoryComplianceScore: '100%',
  autoDispatchedRate: '94.2%',
};

const MOCK_ACTIVE_PLANS = [
  {
    id: 'plan-001',
    plan_number: 'PPM-2026-001',
    name: 'Manchester City Tower — Core M&E & Life Safety',
    client_name: 'Aviva Real Estate UK',
    version: '3.2',
    effective_from: '2026-01-01T00:00:00Z',
    total_assets_count: 420,
    total_requirements_count: 84,
    total_annual_visits_est: 168,
    compliance_rate: '100%',
    status: 'ACTIVE',
    lead_discipline: 'Mechanical & Electrical',
  },
  {
    id: 'plan-002',
    plan_number: 'PPM-2026-004',
    name: 'London Southbank Plaza — Commercial HVAC & BMS',
    client_name: 'Savills Property Management',
    version: '2.1',
    effective_from: '2026-01-15T00:00:00Z',
    total_assets_count: 312,
    total_requirements_count: 62,
    total_annual_visits_est: 124,
    compliance_rate: '99.4%',
    status: 'ACTIVE',
    lead_discipline: 'HVAC & Refrigeration',
  },
  {
    id: 'plan-003',
    plan_number: 'PPM-2026-008',
    name: 'Birmingham Logistics Hub — High Voltage & Fire Systems',
    client_name: 'Prologis UK Distribution',
    version: '1.4',
    effective_from: '2026-02-01T00:00:00Z',
    total_assets_count: 188,
    total_requirements_count: 38,
    total_annual_visits_est: 76,
    compliance_rate: '100%',
    status: 'ACTIVE',
    lead_discipline: 'Electrical & Fire Safety',
  },
  {
    id: 'plan-004',
    plan_number: 'PPM-2026-012',
    name: 'Leeds Innovation Campus — Critical Plant & Water Hygiene',
    client_name: 'CBRE Global Workplace Solutions',
    version: '2.0',
    effective_from: '2026-03-01T00:00:00Z',
    total_assets_count: 254,
    total_requirements_count: 51,
    total_annual_visits_est: 102,
    compliance_rate: '98.8%',
    status: 'ACTIVE',
    lead_discipline: 'Water Hygiene & HVAC',
  },
  {
    id: 'plan-005',
    plan_number: 'PPM-2026-015',
    name: 'Midlands Commercial Estates — Statutory Compliance Register',
    client_name: 'Knight Frank Asset Management',
    version: '1.0',
    effective_from: '2026-04-01T00:00:00Z',
    total_assets_count: 254,
    total_requirements_count: 49,
    total_annual_visits_est: 98,
    compliance_rate: '100%',
    status: 'ACTIVE',
    lead_discipline: 'Statutory Compliance',
  },
];

const MOCK_SCHEDULED_OCCURRENCES = [
  {
    id: 'occ-01',
    occ_number: 'OCC-2026-0842',
    asset_tag: 'CH-01-ROOF',
    asset_name: 'Water-Cooled Chiller (450kW)',
    site_location: 'Manchester City Tower · Roof Deck',
    standard: 'SFG20 01-04 (Q3 Inspection)',
    due_date: 'Tomorrow, 08:30',
    assigned_engineer: 'Dave Miller (F-Gas Cat 1)',
    dispatch_status: 'DISPATCHED',
    trade: 'HVAC',
  },
  {
    id: 'occ-02',
    occ_number: 'OCC-2026-0843',
    asset_tag: 'MSB-01-B1',
    asset_name: 'Main Low Voltage Distribution Board',
    site_location: 'London Southbank Plaza · Switchroom B1',
    standard: 'BS 7671 / Thermographic Survey',
    due_date: '27 Aug 2026, 09:00',
    assigned_engineer: 'James Wilson (NICEIC Qualified)',
    dispatch_status: 'CONFIRMED',
    trade: 'Electrical',
  },
  {
    id: 'occ-03',
    occ_number: 'OCC-2026-0844',
    asset_tag: 'BLR-01/02',
    asset_name: 'Commercial Gas Boiler Cascade (600kW)',
    site_location: 'Leeds Campus · Basement Plantroom',
    standard: 'Gas Safety Reg 35 (CP15 Annual)',
    due_date: '28 Aug 2026, 08:00',
    assigned_engineer: 'Sarah Jenkins (Gas Safe Commercial)',
    dispatch_status: 'SCHEDULED',
    trade: 'Gas',
  },
  {
    id: 'occ-04',
    occ_number: 'OCC-2026-0845',
    asset_tag: 'CWST-02',
    asset_name: 'Cold Water Storage Tank & Calorifier',
    site_location: 'Birmingham Logistics Hub · Riser 2',
    standard: 'ACOP L8 / HSG274 Monthly Check',
    due_date: '29 Aug 2026, 11:30',
    assigned_engineer: 'Alex Taylor (Water Hygiene)',
    dispatch_status: 'READY',
    trade: 'Water',
  },
];

const MOCK_AI_INSIGHTS = [
  {
    id: 'insight-1',
    type: 'PROXIMITY_OPTIMIZATION',
    title: 'Cluster Proximity Bundle Applied',
    description: 'Auto-bundled 4 Air Handling Unit quarterly filter services with Chiller CH-01 annual inspection at Manchester City Tower.',
    impact: 'Saved £320 in travel surcharges · 1 engineer dispatched vs 2 separate callouts.',
    timestamp: 'Today, 06:14',
  },
  {
    id: 'insight-2',
    type: 'STATUTORY_REVISION',
    title: 'SFG20 Standard Auto-Leveling',
    description: 'Updated 14 distribution board inspection tasks to match latest BS 7671 Amendment 3 thermography frequency guidelines.',
    impact: '100% statutory audit trail preserved · Digital work orders updated.',
    timestamp: 'Yesterday, 18:30',
  },
  {
    id: 'insight-3',
    type: 'SKILL_MATCHING',
    title: 'Accreditation Matrix Auto-Verification',
    description: 'Verified valid F-Gas Category 1 and Gas Safe Commercial certifications for all 18 scheduled mobile engineers prior to work order release.',
    impact: 'Zero compliance dispatch violations.',
    timestamp: 'Yesterday, 14:05',
  },
];

export default async function PPMAutopilotPage() {
  const metrics = MOCK_METRICS;
  const activePlans = MOCK_ACTIVE_PLANS;

  return (
    <div className="space-y-8">
      {/* 1. Header with Live Status Pill */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-edge-dark pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-electric-bright">
              Planned Preventative Maintenance
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PPM AUTOPILOT ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            PPM Autopilot Control Desk
          </h1>
          <p className="text-xs sm:text-sm text-brand-mist/70 mt-1 max-w-3xl">
            Autonomous maintenance planning engine — orchestrating asset registers, SFG20 statutory schedules, engineer skill matrices, and field dispatch across commercial estates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/estate/mobilisations"
            className="rounded bg-brand-electric px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-indigo inline-flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Mobilise New Estate Plan
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Plan Items</span>
            <Layers className="w-3.5 h-3.5 text-brand-electric-bright" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">{metrics.activePlanItems.toLocaleString()}</div>
          <div className="mt-1 text-[10px] text-brand-mist/50 font-mono">Across 5 Active Portfolios</div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Due This Week</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-blue-400">{metrics.dueThisWeek}</div>
          <div className="mt-1 text-[10px] text-emerald-400 font-mono">100% Dispatched &amp; Assigned</div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Due This Month</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-indigo-400">{metrics.dueThisMonth}</div>
          <div className="mt-1 text-[10px] text-brand-mist/50 font-mono">Rolling 30-Day Window</div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Statutory Compliance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">{metrics.statutoryComplianceScore}</div>
          <div className="mt-1 text-[10px] text-emerald-400 font-mono">0 Missed / 0 Overdue</div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Satisfied Visits</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">{metrics.satisfied.toLocaleString()}</div>
          <div className="mt-1 text-[10px] text-brand-mist/50 font-mono">YTD Verified Sign-Offs</div>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="flex items-center justify-between text-brand-mist/50 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Auto-Dispatch Rate</span>
            <Cpu className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-pink-400">{metrics.autoDispatchedRate}</div>
          <div className="mt-1 text-[10px] text-brand-mist/50 font-mono">Autonomous Batching</div>
        </div>
      </div>

      {/* 3. Autopilot Engine Optimization & Live Activity Feed */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-edge-dark pb-3">
          <div className="flex items-center gap-2 text-white">
            <Cpu className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold tracking-wide">
              Live Autopilot Planning &amp; Optimization Feed
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-brand-mist/60">
            <span>Next Autonomous Run: <strong className="text-white">Today at 18:00 (42 Visits)</strong></span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">Engine Healthy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MOCK_AI_INSIGHTS.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-brand-graphite/70 border border-brand-edge-dark space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-brand-mist/50 mb-1">
                  <span className="text-pink-400 font-semibold uppercase">{item.type.replace('_', ' ')}</span>
                  <span>{item.timestamp}</span>
                </div>
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[11.5px] text-brand-mist/75 leading-relaxed mt-1">{item.description}</p>
              </div>
              <div className="pt-2 border-t border-brand-edge-dark/60 text-[10.5px] font-mono text-emerald-400">
                {item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Maintenance Programmes Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Active Estate Maintenance Programmes
            </h2>
            <p className="text-xs text-brand-mist/60">
              Approved planned preventative maintenance contracts operating under SFG20 &amp; statutory UK frequencies.
            </p>
          </div>
          <span className="text-xs font-mono text-brand-mist/50">
            Showing {activePlans.length} Active Programmes
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-brand-edge-dark bg-brand-carbon/40 shadow-xl">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10px] uppercase tracking-wider text-brand-mist/40 bg-brand-void/50">
                <th className="px-5 py-3">Plan Number</th>
                <th className="px-5 py-3">Estate / Building Name</th>
                <th className="px-5 py-3">Client Account</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-4 py-3 text-right">Assets</th>
                <th className="px-4 py-3 text-right">Tasks</th>
                <th className="px-4 py-3 text-right">Annual Visits</th>
                <th className="px-4 py-3 text-center">Compliance</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {activePlans.map((p) => (
                <tr key={p.id} className="text-brand-mist/80 hover:bg-brand-void/60 transition-colors">
                  <td className="px-5 py-4 font-mono text-[11px] font-bold text-white">{p.plan_number}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[10.5px] text-brand-mist/50 font-mono mt-0.5">{p.lead_discipline}</div>
                  </td>
                  <td className="px-5 py-4 text-brand-mist/75">{p.client_name}</td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/60">v{p.version}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/90">{p.total_assets_count}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] text-brand-mist/90">{p.total_requirements_count}</td>
                  <td className="px-4 py-4 text-right font-mono text-[11px] font-bold text-brand-electric-bright">{p.total_annual_visits_est}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {p.compliance_rate}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-brand-electric/15 text-brand-electric-bright border border-brand-electric/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Live Upcoming Planned Occurrences (Next 14 Days) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Upcoming Planned Maintenance Occurrences
            </h2>
            <p className="text-xs text-brand-mist/60">
              Live queue of statutory maintenance visits scheduled and auto-dispatched to certified field engineers.
            </p>
          </div>
          <Link
            href="/admin/planned-maintenance/schedule"
            className="text-xs font-mono text-brand-electric-bright hover:underline"
          >
            View Full 52-Week Master Schedule →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-brand-edge-dark bg-brand-carbon/40 shadow-xl">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10px] uppercase tracking-wider text-brand-mist/40 bg-brand-void/50">
                <th className="px-5 py-3">Occurrence #</th>
                <th className="px-5 py-3">Target Asset</th>
                <th className="px-5 py-3">Site / Plantroom</th>
                <th className="px-5 py-3">Maintenance Standard</th>
                <th className="px-5 py-3">Scheduled Window</th>
                <th className="px-5 py-3">Assigned Engineer</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {MOCK_SCHEDULED_OCCURRENCES.map((occ) => (
                <tr key={occ.id} className="text-brand-mist/80 hover:bg-brand-void/60 transition-colors">
                  <td className="px-5 py-4 font-mono text-[11px] font-semibold text-brand-electric-bright">
                    {occ.occ_number}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{occ.asset_name}</div>
                    <div className="text-[10px] font-mono text-brand-mist/50">{occ.asset_tag}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-brand-mist/80">{occ.site_location}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-slate-300">{occ.standard}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-brand-mist/70">{occ.due_date}</td>
                  <td className="px-5 py-4 text-xs font-mono text-white">{occ.assigned_engineer}</td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        occ.dispatch_status === 'DISPATCHED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : occ.dispatch_status === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {occ.dispatch_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Quick Navigation Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
        <Link
          href="/admin/estate/mobilisations"
          className="group rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition-all shadow-md"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric-bright flex items-center justify-between">
            <span>Estate Mobilisations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Import asset registers, run AI column matching, and verify equipment hierarchies.
          </div>
        </Link>

        <Link
          href="/admin/planned-maintenance/requirements"
          className="group rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition-all shadow-md"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric-bright flex items-center justify-between">
            <span>Maintenance Standards &amp; SFG20</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Review approved statutory frequencies, British Standards, and equipment task libraries.
          </div>
        </Link>

        <Link
          href="/admin/planned-maintenance/exceptions"
          className="group rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 hover:border-brand-electric/50 transition-all shadow-md"
        >
          <div className="text-[13px] font-semibold text-white group-hover:text-brand-electric-bright flex items-center justify-between">
            <span>PPM Exceptions &amp; SLA Desk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-1 text-[11.5px] text-brand-mist/60">
            Monitor client access restrictions, asset anomalies, and contractor SLA escalations.
          </div>
        </Link>
      </div>
    </div>
  );
}
