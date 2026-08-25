import { Metadata } from 'next';
import Link from 'next/link';
import { getCommercialDashboardMetrics, listOpportunities, listCommercialTasks } from '@/server/commercial/pipeline';
import {
  TrendingUp,
  Users,
  Target,
  FileCheck,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Commercial Operations & Pipeline Control | EntireFM Admin' };

export default async function CommercialOverviewPage() {
  const metrics = await getCommercialDashboardMetrics();
  const opportunities = await listOpportunities();
  const tasks = await listCommercialTasks('PENDING');

  const now = new Date();
  const overdueTasks = tasks.filter((t) => new Date(t.due_date) < now);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-light">
            COMMERCIAL PIPELINE &amp; SALES OPERATIONS
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Commercial Control Centre</h1>
          <p className="text-sm text-zinc-400">
            End-to-end management of inbound enquiries, discovery, proposals, tenders, and mobilisation handoffs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/commercial/pipeline"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Briefcase className="h-3.5 w-3.5" /> Pipeline Board
          </Link>
          <Link
            href="/admin/commercial/tasks"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            Follow-Up Tasks
          </Link>
        </div>
      </div>

      {/* Top Section KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">QUALIFIED OPPS</div>
          <div className="mt-1 text-xl font-light text-white font-mono">{metrics.qualifiedOpportunitiesCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">PROPOSALS OUT</div>
          <div className="mt-1 text-xl font-light text-pink-400 font-mono">{metrics.proposalsOutCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">SURVEYS PENDING</div>
          <div className="mt-1 text-xl font-light text-blue-400 font-mono">{metrics.surveysPendingCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">OVERDUE TASKS</div>
          <div className="mt-1 text-xl font-light text-amber-400 font-mono">{metrics.overdueTasksCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">WON THIS MONTH</div>
          <div className="mt-1 text-xl font-light text-emerald-400 font-mono">{metrics.wonThisMonthCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">PIPELINE VALUE</div>
          <div className="mt-1 text-xl font-light text-purple-400 font-mono">
            {metrics.totalPipelineValueGbp > 0 ? `£${metrics.totalPipelineValueGbp.toLocaleString()}` : 'NO DATA YET'}
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Action Queue & Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Priorities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
                Commercial Priority Action Queue ({tasks.length})
              </h3>
              <Link
                href="/admin/commercial/tasks"
                className="text-xs text-pink-400 hover:text-pink-300 font-light"
              >
                View all tasks &rarr;
              </Link>
            </div>

            {tasks.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Zero overdue tasks or pending follow-ups. All commercial enquiries are currently actionable.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {tasks.slice(0, 6).map((task) => {
                  const isOverdue = new Date(task.due_date) < now;
                  return (
                    <div key={task.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-light ${
                              task.priority === 'URGENT'
                                ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {task.task_type}
                          </span>
                          <span className="font-light text-white">{task.title}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Owner: {task.owner} · Due: {new Date(task.due_date).toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      {isOverdue ? (
                        <span className="text-[10px] font-mono text-red-400 font-light whitespace-nowrap">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Hub Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/admin/commercial/pipeline"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-pink-300 flex items-center gap-1">
                Commercial Pipeline <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Stage tracking from Discovery to Tender and Won.</p>
            </Link>

            <Link
              href="/admin/commercial/site-surveys"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-blue-300 flex items-center gap-1">
                Site Surveys <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Manage technical asset inspections and surveyor schedules.</p>
            </Link>

            <Link
              href="/admin/commercial/proposals"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-emerald-300 flex items-center gap-1">
                Proposals &amp; Quotes <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Issued quotes, internal approvals, and version control.</p>
            </Link>
          </div>
        </div>

        {/* Right Column: Active Commercial Opportunities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-normal text-zinc-300 uppercase tracking-wider">
                Active Opportunities ({opportunities.length})
              </h3>
              <Link
                href="/admin/commercial/pipeline"
                className="text-xs text-pink-400 hover:text-pink-300 font-light"
              >
                View Pipeline &rarr;
              </Link>
            </div>

            {opportunities.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No active opportunities in pipeline. Qualified leads will appear here when converted.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {opportunities.slice(0, 5).map((opp) => (
                  <div key={opp.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-light text-white">{opp.company}</div>
                      <div className="text-[11px] text-zinc-400">
                        {opp.service} · {opp.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-pink-400 font-light">
                        {opp.stage}
                      </span>
                      <div className="text-[11px] font-mono text-zinc-300 mt-1">
                        {opp.estimated_value_gbp ? `£${opp.estimated_value_gbp.toLocaleString()}` : '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
