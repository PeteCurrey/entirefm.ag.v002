import { getCurrentSession } from '@/server/identity';
import { getContractorDashboardMetrics, listContractorAssignments } from '@/server/supply-chain';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Inbox, Briefcase, Calendar, AlertCircle, ShieldAlert, CheckSquare, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ContractorDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const metrics = await getContractorDashboardMetrics(orgId, session);
  const pendingOffers = await listContractorAssignments(orgId, 'OFFERED', session);

  const kpis = [
    { label: 'Offers Awaiting Response', value: metrics.offersAwaitingResponse, icon: <Inbox className="w-5 h-5 text-amber-400" />, href: '/contractor/work' },
    { label: 'Active Assignments', value: metrics.activeAssignments, icon: <Briefcase className="w-5 h-5 text-brand-electric" />, href: '/contractor/work' },
    { label: 'Visits Today', value: metrics.visitsToday, icon: <Calendar className="w-5 h-5 text-green-400" />, href: '/contractor/schedule' },
    { label: 'SLA At Risk', value: metrics.slaAtRisk, icon: <AlertCircle className="w-5 h-5 text-red-400" />, href: '/contractor/work' },
    { label: 'Compliance Warnings', value: metrics.complianceWarnings, icon: <ShieldAlert className="w-5 h-5 text-amber-400" />, href: '/contractor/compliance' },
    { label: 'Completions Pending Review', value: metrics.completionsPendingReview, icon: <CheckSquare className="w-5 h-5 text-purple-400" />, href: '/contractor/work' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Partner Command Centre</h1>
        <p className="text-brand-mist text-sm mt-1">Live dispatch, active jobs, resource allocation and compliance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.href}
            className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 hover:border-brand-edge transition-all block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-mist">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">{kpi.value}</span>
              <span className="text-xs text-brand-mist group-hover:text-brand-electric flex items-center gap-1 transition-colors">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Offers Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Offers Requiring Response</h2>
          <Link href="/contractor/work" className="text-xs text-brand-electric hover:underline">
            View All Work →
          </Link>
        </div>

        {pendingOffers.length === 0 ? (
          <EmptyState
            title="No Pending Work Offers"
            description="When EntireFM dispatches new jobs to your organisation, they will appear here for acceptance."
            icon="Inbox"
          />
        ) : (
          <div className="space-y-3">
            {pendingOffers.slice(0, 5).map(offer => (
              <div
                key={offer.id}
                className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5 rounded font-mono">
                      OFFERED
                    </span>
                    <span className="text-white font-mono text-sm font-semibold">
                      {offer.work_order_id ? `WO-${offer.work_order_id.slice(0, 8)}` : offer.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-sm text-brand-mist mt-1">
                    Offered at {new Date(offer.created_at).toLocaleString('en-GB')}
                  </p>
                </div>
                <Link
                  href="/contractor/work"
                  className="bg-brand-electric text-black px-4 py-2 rounded-lg text-sm font-bold text-center hover:bg-brand-electric-bright transition-colors"
                >
                  Review Offer
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
