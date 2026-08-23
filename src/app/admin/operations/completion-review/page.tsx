import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import { CheckCircle2, XCircle, FileText, Clock, User, Building } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCompletionReviewPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const { data: reports } = await dbQuery<any[]>(
    `service_reports?status=eq.SUBMITTED&order=submitted_at.desc&limit=50&select=*,site:sites(name,town),work_order:work_orders(reference,priority)`
  );

  const pendingReports = reports || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Service Completion Review Desk</h1>
        <p className="text-brand-mist text-sm mt-1">
          Review field service reports, verify evidence, check signatory declarations, and authorise operational closure.
        </p>
      </div>

      {pendingReports.length === 0 ? (
        <EmptyState
          title="No Completions Awaiting Review"
          description="Submitted field reports from engineers and contractors will appear here for operational sign-off."
          icon="CheckCircle"
        />
      ) : (
        <div className="space-y-4">
          {pendingReports.map(r => (
            <div
              key={r.id}
              className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-edge-dark pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-white">{r.report_number}</span>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded font-mono font-semibold">
                    AWAITING REVIEW
                  </span>
                  {r.work_order?.reference && (
                    <span className="text-xs text-brand-mist font-mono">
                      WO: {r.work_order.reference}
                    </span>
                  )}
                </div>
                <div className="text-xs text-brand-mist flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {r.submitted_at ? new Date(r.submitted_at).toLocaleString('en-GB') : 'Recently'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-brand-mist block">Location</span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-brand-mist" />
                    {r.site?.name || 'Site'} {r.site?.town ? `(${r.site.town})` : ''}
                  </span>
                </div>

                {r.signatory_name && (
                  <div>
                    <span className="text-xs text-brand-mist block">Site Signatory</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-brand-mist" />
                      {r.signatory_name} {r.signatory_organisation ? `(${r.signatory_organisation})` : ''}
                    </span>
                  </div>
                )}
              </div>

              {r.ai_draft_narrative && (
                <div className="bg-brand-void rounded-lg p-3 border border-brand-edge-dark">
                  <span className="text-xs text-brand-mist uppercase tracking-wider font-semibold block mb-1">
                    Field Summary
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed font-mono">
                    {r.ai_draft_narrative}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold text-xs rounded-lg transition-colors">
                  Accept & Authorise Closure
                </button>
                <button className="px-4 py-2 bg-brand-void border border-red-800 text-red-400 hover:bg-red-950/40 font-semibold text-xs rounded-lg transition-colors">
                  Reject with Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
