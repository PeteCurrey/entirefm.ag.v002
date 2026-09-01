import { Metadata } from 'next';
import Link from 'next/link';
import { getMobilisationDashboardMetrics, listMobilisations } from '@/server/estate/mobilisation';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Wrench,
  Users,
  Activity,
  FileCheck,
  Building,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Operational Mobilisation Engine | EntireFM Admin' };

export default async function MobilisationsOverviewPage() {
  const metrics = await getMobilisationDashboardMetrics();
  const mobilisations = await listMobilisations();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-pink-400 font-light">
            ENTIRECAFM OPERATIONAL MOBILISATION ENGINE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Contract Mobilisation Control</h1>
          <p className="text-sm text-zinc-400">
            Controlled operational onboarding transitioning won commercial contracts into live EntireCAFM delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/commercial/pipeline"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg transition-colors"
          >
            ← Sales Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">AWAITING HANDOFF</div>
          <div className="mt-1 text-xl font-light text-amber-400">{metrics.awaitingHandoffCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">ACTIVE MOBILISATIONS</div>
          <div className="mt-1 text-xl font-light text-white">{metrics.activeMobilisationsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">AT RISK</div>
          <div className="mt-1 text-xl font-light text-red-400">{metrics.atRiskCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">TASKS OVERDUE</div>
          <div className="mt-1 text-xl font-light text-zinc-300">{metrics.tasksOverdueCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">READY FOR GO-LIVE</div>
          <div className="mt-1 text-xl font-light text-pink-400">{metrics.readyForGoLiveCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">LIVE / STABILISATION</div>
          <div className="mt-1 text-xl font-light text-emerald-400">{metrics.goLivesThisMonthCount}</div>
        </div>
      </div>

      {/* Main Table: Active Mobilisations */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            All Contract Mobilisations ({mobilisations.length})
          </h3>
          <span className="text-xs text-zinc-500 font-normal">12-Phase Operational Gate</span>
        </div>

        {mobilisations.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-normal">
            Zero active mobilisations. When commercial opportunities are marked WON, they initiate here for operational onboarding.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Client / Mobilisation</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Target Go-Live</th>
                <th className="py-3 px-4">Operations Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {mobilisations.map((mob) => (
                <tr key={mob.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-light text-white">{mob.client_name}</div>
                    <div className="text-[11px] text-zinc-500">{mob.name}</div>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{mob.template_type}</td>
                  <td className="py-3.5 px-4 text-pink-400 font-normal">
                    {new Date(mob.target_go_live_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3.5 px-4 font-normal text-zinc-400">{mob.operations_owner}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded font-light border ${
                        mob.status === 'LIVE_STABILISATION' || mob.status === 'COMPLETE'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : mob.status === 'GO_LIVE_REVIEW' || mob.status === 'READY'
                          ? 'bg-pink-950/60 text-pink-300 border-pink-800/40'
                          : mob.status === 'AT_RISK'
                          ? 'bg-red-950/60 text-red-300 border-red-800/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {mob.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/mobilisations/${mob.id}`}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded font-light border border-zinc-700 inline-flex items-center gap-1"
                    >
                      Open Dossier <ArrowRight className="h-3 w-3" />
                    </Link>
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
