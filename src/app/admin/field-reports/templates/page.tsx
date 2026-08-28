import { getCurrentSession } from '@/server/identity';
import { listReportTemplates, SEED_TEMPLATES } from '@/server/field-reports';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText, ShieldCheck, Zap, Wrench, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReportTemplatesPage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/admin/login');
  }

  const templates = await listReportTemplates();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>ENTIREFM CAFM</span>
            <span>/</span>
            <span>CONTROLLED DOCUMENT SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Field Report Templates</h1>
          <p className="text-sm text-slate-400 mt-1">
            Revision 4.0 Standard Operating Forms (Controlled Document Standard &bull; MAR 2026)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Rev 4.0 Code-Managed
          </span>
        </div>
      </div>

      {/* Controlled System Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold">
            4.0
          </div>
          <div>
            <div className="font-semibold text-white">Controlled Document Governance</div>
            <div className="text-slate-400">
              PDF geometry, headers, typography, and mathematical validation are enforced server-side.
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 shrink-0">
          3 PILOTS PRODUCTION READY
        </span>
      </div>

      {/* Template Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Template Code</th>
              <th className="py-3.5 px-4 font-semibold">Template Name</th>
              <th className="py-3.5 px-4 font-semibold">Discipline</th>
              <th className="py-3.5 px-4 font-semibold">Type</th>
              <th className="py-3.5 px-4 font-semibold">Revision</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {templates.map((tpl) => {
              const seedMatch = SEED_TEMPLATES.find((s) => s.template_code === tpl.template_code);
              const revision = seedMatch?.version.revision || '4.0';
              const effectiveDate = seedMatch?.version.effective_date || 'MAR 2026';

              return (
                <tr key={tpl.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-sky-400">
                    {tpl.template_code}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white text-sm">{tpl.name}</div>
                    {tpl.description && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {tpl.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {tpl.discipline}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tpl.report_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    v{revision} ({effectiveDate})
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    <button
                      disabled
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[11px] cursor-not-allowed opacity-60"
                      title="Controlled template code-managed"
                    >
                      Locked
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
