import { Metadata } from 'next';
import Link from 'next/link';
import { getEnergyDashboardMetrics, listMeters, listEnergyProjects } from '@/server/energy';
import {
  Zap,
  Flame,
  Droplets,
  Activity,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Gauge,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Energy & Building Performance | EntireFM Admin' };

export default async function EnergyOverviewPage() {
  const metrics = await getEnergyDashboardMetrics();
  const meters = await listMeters();
  const projects = await listEnergyProjects();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-light">
            ENTIRECAFM BUILDING PERFORMANCE &amp; ENERGY INTELLIGENCE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Energy &amp; Building Performance</h1>
          <p className="text-sm text-zinc-400">
            Real interval consumption telemetry, baseload tracking, out-of-hours detection, and verified M&amp;V savings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/energy/meters"
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Gauge className="h-3.5 w-3.5" /> Meter Registry
          </Link>
          <Link
            href="/admin/energy/projects"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            M&amp;V Projects
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">TOTAL METERS</div>
          <div className="mt-1 text-xl font-light text-white font-mono">{metrics.totalMetersCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">ACTIVE FEEDS</div>
          <div className="mt-1 text-xl font-light text-emerald-400 font-mono">{metrics.activeMetersCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">STALE FEEDS</div>
          <div className="mt-1 text-xl font-light text-amber-400 font-mono">{metrics.staleFeedsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">BASELOAD ALERTS</div>
          <div className="mt-1 text-xl font-light text-purple-400 font-mono">{metrics.baseloadAlertsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">ACTIVE PROJECTS</div>
          <div className="mt-1 text-xl font-light text-blue-400 font-mono">{metrics.activeProjectsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">VERIFIED SAVINGS</div>
          <div className="mt-1 text-xl font-light text-emerald-400 font-mono">
            {metrics.verifiedSavingsGbp > 0 ? `£${metrics.verifiedSavingsGbp.toLocaleString()}` : '—'}
          </div>
        </div>
      </div>

      {/* Meter Health & Ingestion Registry */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Connected Estate Meters ({meters.length})
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Multi-Utility Ingestion</span>
        </div>

        {meters.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">
            Zero connected meters recorded. Half-hourly, smart meter, or CSV utility feeds will populate here.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Meter Reference &amp; Name</th>
                <th className="py-3 px-4">Utility</th>
                <th className="py-3 px-4">Hierarchy</th>
                <th className="py-3 px-4">Interval</th>
                <th className="py-3 px-4">Feed Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {meters.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-light text-white">{m.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{m.meter_reference}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">{m.utility_type}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{m.meter_hierarchy}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{m.interval_minutes} mins</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-light">
                      {m.feed_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
