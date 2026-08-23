import { Metadata } from 'next';
import Link from 'next/link';
import { getMobilisationById, listMobilisationTasks } from '@/server/estate/mobilisation';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  FileCheck,
  Building,
  Users,
  Activity,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Mobilisation Dossier & Plan | EntireFM Admin' };

export default async function MobilisationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const mob = await getMobilisationById(resolvedParams.id);
  const tasks = mob ? await listMobilisationTasks(mob.id) : [];

  if (!mob) {
    return (
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Mobilisation Record Not Found</h2>
          <p className="text-xs text-zinc-400">No active mobilisation matches ID &ldquo;{resolvedParams.id}&rdquo;.</p>
          <Link
            href="/admin/mobilisations"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-semibold border border-zinc-700 inline-block"
          >
            ← Back to Mobilisations
          </Link>
        </div>
      </main>
    );
  }

  const domainReadiness = [
    { name: '1. Commercial Handoff', state: mob.domain_commercial_handoff },
    { name: '2. Estate Discovery', state: mob.domain_estate_discovery },
    { name: '3. Asset Baseline', state: mob.domain_asset_baseline },
    { name: '4. Compliance Baseline', state: mob.domain_compliance_baseline },
    { name: '5. PPM Development', state: mob.domain_ppm_development },
    { name: '6. Supply Chain Setup', state: mob.domain_supply_chain },
    { name: '7. Helpdesk & SLA Setup', state: mob.domain_helpdesk_sla },
    { name: '8. Client Portal Setup', state: mob.domain_client_portal },
    { name: '9. Reporting Setup', state: mob.domain_reporting },
    { name: '10. Billing Readiness', state: mob.domain_billing_readiness },
    { name: '11. Go-Live Readiness Review', state: mob.domain_go_live_review },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            CONTRACT MOBILISATION DOSSIER · ENTIRECAFM
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">{mob.client_name}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
            <span>Template: {mob.template_type}</span>
            <span>·</span>
            <span>Target Go-Live: {new Date(mob.target_go_live_date).toLocaleDateString('en-GB')}</span>
            <span>·</span>
            <span>Status: {mob.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/mobilisations"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← All Mobilisations
          </Link>
        </div>
      </div>

      {/* Domain Readiness Matrix Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Domain Readiness &amp; Go-Live Gates (No Misleading Percentages)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {domainReadiness.map((d, idx) => (
            <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-zinc-300 block text-[11px] truncate">{d.name}</span>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold inline-block ${
                  d.state === 'READY'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    : d.state === 'IN_PROGRESS'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                    : d.state === 'BLOCKED'
                    ? 'bg-red-950/60 text-red-300 border border-red-800/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {d.state}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Phase Mobilisation Tasks */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            12-Phase Mobilisation Action Plan ({tasks.length} Milestones)
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Operations Delivery Framework</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Phase &amp; Milestone</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Gate Type</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">{t.title}</div>
                  <div className="text-[11px] text-zinc-500">{t.phase_name}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">{t.owner}</td>
                <td className="py-3.5 px-4 font-mono text-pink-400">
                  {new Date(t.due_date).toLocaleDateString('en-GB')}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      t.is_blocking ? 'bg-red-950/60 text-red-300 border border-red-800/40' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t.is_blocking ? 'BLOCKING GATE' : 'NON-BLOCKING'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      t.status === 'COMPLETE'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
