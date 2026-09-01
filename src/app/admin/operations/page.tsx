import { Metadata } from 'next';
import Link from 'next/link';
import { getLiveControlMetrics, listOperationalExceptions } from '@/server/work/live-control';
import {
  Activity,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Wrench,
  FileCheck,
  Building,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Flame,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Live Contract Control Centre | EntireFM Admin' };

export default async function LiveOperationsControlCentrePage() {
  const metrics = await getLiveControlMetrics();
  const exceptions = await listOperationalExceptions({ status: 'ACTIVE' });

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-pink-400 font-light">
            ENTIRECAFM LIVE OPERATIONS &amp; EXCEPTION CONTROL
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Live Contract Control Centre</h1>
          <p className="text-sm text-zinc-400">
            Real-time exception triage across live FM contracts, SLA at-risk clocks, overdue PPMs, and client action bottlenecks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/operations/today"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Clock className="h-3.5 w-3.5" /> Today&rsquo;s Exceptions
          </Link>
          <Link
            href="/admin/operations/contracts"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            Contract Health
          </Link>
        </div>
      </div>

      {/* High-Density KPI Exception Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">CRITICAL EXCEPTIONS</div>
          <div className="mt-1 text-xl font-light text-red-400">{metrics.criticalExceptionsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">SLA AT RISK</div>
          <div className="mt-1 text-xl font-light text-amber-400">{metrics.slaAtRiskCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">OVERDUE PPM</div>
          <div className="mt-1 text-xl font-light text-purple-400">{metrics.overduePpmCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">CRITICAL DEFECTS</div>
          <div className="mt-1 text-xl font-light text-pink-400">{metrics.openCriticalDefectsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">CLIENT BOTTLENECKS</div>
          <div className="mt-1 text-xl font-light text-blue-400">{metrics.clientActionsOverdueCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">SUPPLY GAPS</div>
          <div className="mt-1 text-xl font-light text-zinc-300">{metrics.contractorCoverageGapsCount}</div>
        </div>
      </div>

      {/* Main Operational Grid: Active Exceptions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Active Operational Exceptions ({exceptions.length})
          </h3>
          <span className="text-xs text-zinc-500 font-normal">Exception-First Prioritisation</span>
        </div>

        {exceptions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-normal">
            Zero active operational exceptions. All live contracts, SLAs, and maintenance schedules are operating within parameters.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Exception</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {exceptions.map((exc) => (
                <tr key={exc.id} className="hover:bg-zinc-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-light text-white">{exc.title}</div>
                    <div className="text-[11px] text-zinc-500">{exc.details}</div>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{exc.exception_type}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded font-light ${
                        exc.severity === 'CRITICAL'
                          ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {exc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{exc.owner}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-light">{exc.status}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded font-light border border-zinc-700">
                      Triage
                    </button>
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
