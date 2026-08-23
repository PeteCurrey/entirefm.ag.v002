import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { getOperationalMetrics } from '@/server/reporting';
import { listActiveSLARisks, listWorkOrders } from '@/server/work';
import { listComplianceObligations } from '@/server/compliance';
import { listQuotes } from '@/server/commercial';
import { listAIActions, listAIRuns } from '@/server/ai';
import { listAuditEvents } from '@/server/audit';
import { isDbConfigured } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function AdminCommandCentrePage() {
  const session = await getCurrentSession();
  const dbConnected = isDbConfigured();

  const [
    metrics,
    slaRisks,
    activeIncidents,
    statutoryTasks,
    pendingApprovals,
    aiActions,
    recentAudits,
  ] = await Promise.all([
    getOperationalMetrics(),
    listActiveSLARisks(),
    listWorkOrders({ priority: 'P1_CRITICAL', limit: 5 }),
    listComplianceObligations('OVERDUE'),
    listQuotes('SUBMITTED'),
    listAIActions('PENDING_APPROVAL'),
    listAuditEvents(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Cockpit Title & Status */}
      <div className="flex flex-col gap-4 border-b border-brand-edge-dark pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand-electric-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-pulse" />
            Live Unified Operations Command
          </div>
          <h1 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
            Command Centre
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-3 py-1.5 font-mono text-[11px] text-brand-mist/70">
            Tenant: <span className="text-white font-medium">{session?.orgName}</span>
          </div>
          <Link
            href="/admin/operations/work-orders"
            className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow transition-all hover:bg-brand-indigo"
          >
            + Create Work Order
          </Link>
        </div>
      </div>

      {!dbConnected && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-[13px] text-amber-200">
          <strong className="font-semibold text-amber-100">Database Connection Notice:</strong>{' '}
          Live database credentials are currently loading or not set in environment variables. Showing schema-aligned operational indicators. Run migration{' '}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[11px]">0002_unified_operations_platform.sql</code> in your Supabase SQL editor to instantiate tables.
        </div>
      )}

      {/* Operational KPI Strip (Dense, tabular, real figures) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="Active Work Orders"
          value={metrics.activeWorkOrders}
          subtext="In execution or dispatch"
          href="/admin/operations/work-orders"
        />
        <MetricCard
          label="P1 Critical Incidents"
          value={metrics.criticalIncidents}
          subtext="Priority 1 active"
          alert={metrics.criticalIncidents > 0}
          href="/admin/operations/work-orders?priority=P1_CRITICAL"
        />
        <MetricCard
          label="SLA Breach Risks"
          value={metrics.slaBreachRiskCount}
          subtext="Under 60m remaining"
          alert={metrics.slaBreachRiskCount > 0}
          href="/admin/operations/sla"
        />
        <MetricCard
          label="Statutory Overdue"
          value={metrics.statutoryDueCount}
          subtext="Compliance tasks"
          alert={metrics.statutoryDueCount > 0}
          href="/admin/compliance/obligations"
        />
        <MetricCard
          label="Commercial Approvals"
          value={metrics.pendingApprovalsCount}
          subtext="Quotes & POs pending"
          href="/admin/commercial/quotes"
        />
        <MetricCard
          label="Active Assets"
          value={metrics.totalAssetsCount}
          subtext="In service estate"
          href="/admin/estate/assets"
        />
      </div>

      {/* 4 Quadrants: NOW · AT RISK · NEEDS REVIEW · AUTOMATED */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quadrant 1: NOW (Live Incidents & Reactive Dispatch) */}
        <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
                NOW · Live Incidents & Critical Work
              </h2>
            </div>
            <Link
              href="/admin/operations/work-orders"
              className="text-[11.5px] text-brand-electric-bright hover:underline"
            >
              View all ({metrics.activeWorkOrders}) →
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeIncidents.length > 0 ? (
              activeIncidents.map((wo) => (
                <div
                  key={wo.id}
                  className="flex items-start justify-between rounded border border-brand-edge-dark/80 bg-brand-void/80 p-3 text-[13px]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-brand-mist/50">
                        {wo.work_order_number}
                      </span>
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.2 font-mono text-[9.5px] uppercase text-rose-300">
                        {wo.priority}
                      </span>
                    </div>
                    <div className="mt-1 truncate font-medium text-white">{wo.title}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      {wo.site?.name || 'Site location'} · Status: {wo.status}
                    </div>
                  </div>
                  <Link
                    href={`/admin/operations/work-orders`}
                    className="ml-3 shrink-0 rounded border border-brand-edge-dark bg-brand-carbon px-2.5 py-1 text-[11px] font-medium text-white hover:border-brand-electric"
                  >
                    Inspect
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12.5px] text-brand-mist/50">
                <p className="font-medium text-brand-mist/70">No P1 Critical Incidents Active</p>
                <p className="mt-1 text-[11.5px]">
                  All reactive dispatch tickets and emergency call-outs will populate here upon intake.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quadrant 2: AT RISK (SLA Timeouts & Statutory Expiries) */}
        <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
                AT RISK · SLA Trajectory & Statutory Expiries
              </h2>
            </div>
            <Link
              href="/admin/operations/sla"
              className="text-[11.5px] text-brand-electric-bright hover:underline"
            >
              SLA Matrix →
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {slaRisks.length > 0 || statutoryTasks.length > 0 ? (
              <>
                {slaRisks.slice(0, 3).map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center justify-between rounded border border-amber-500/30 bg-amber-500/5 p-3 text-[13px]"
                  >
                    <div>
                      <div className="font-medium text-white">{wo.title}</div>
                      <div className="text-[11px] text-amber-300/70">
                        {wo.work_order_number} · Target Due:{' '}
                        {wo.sla_resolution_due_at
                          ? new Date(wo.sla_resolution_due_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Imminent'}
                      </div>
                    </div>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                      SLA RISK
                    </span>
                  </div>
                ))}
                {statutoryTasks.slice(0, 2).map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between rounded border border-brand-edge-dark bg-brand-void/80 p-3 text-[13px]"
                  >
                    <div>
                      <div className="font-medium text-white">Statutory Obligation Overdue</div>
                      <div className="text-[11px] text-brand-mist/50">
                        {st.site?.name} · Next Due: {st.next_due_at}
                      </div>
                    </div>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] text-rose-300">
                      STATUTORY
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12.5px] text-brand-mist/50">
                <p className="font-medium text-brand-mist/70">Zero SLA Breaches or Expiries</p>
                <p className="mt-1 text-[11.5px]">
                  All active SLAs and statutory compliance tasks are within operating parameters.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quadrant 3: NEEDS REVIEW (Approvals, Quotes, Exceptions) */}
        <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-brand-electric" />
              <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
                NEEDS REVIEW · Approvals & Commercial Gate
              </h2>
            </div>
            <Link
              href="/admin/commercial/quotes"
              className="text-[11.5px] text-brand-electric-bright hover:underline"
            >
              Approval Queue →
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded border border-brand-edge-dark bg-brand-void/80 p-3 text-[13px]"
                >
                  <div>
                    <div className="font-medium text-white">Quote {q.quote_number}</div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      Amount: £{Number(q.total_amount_gbp).toFixed(2)} · Status: {q.status}
                    </div>
                  </div>
                  <Link
                    href="/admin/commercial/quotes"
                    className="rounded bg-brand-electric px-2.5 py-1 text-[11px] font-medium text-white hover:bg-brand-indigo"
                  >
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12.5px] text-brand-mist/50">
                <p className="font-medium text-brand-mist/70">Approval Queue Clear</p>
                <p className="mt-1 text-[11.5px]">
                  Quotes, major purchase orders, and contractor rate cards awaiting sign-off will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quadrant 4: AUTOMATED (AI Control Plane & Background Workflows) */}
        <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-purple-400" />
              <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
                AUTOMATED · AI Action Stream & Autonomy Ledger
              </h2>
            </div>
            <Link
              href="/admin/ai/control"
              className="text-[11.5px] text-brand-electric-bright hover:underline"
            >
              Control Centre →
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {aiActions.length > 0 ? (
              aiActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between rounded border border-brand-edge-dark bg-brand-void/80 p-3 text-[13px]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] text-purple-300">
                        {action.agent?.name || 'AI Assistant'}
                      </span>
                      <span className="rounded bg-purple-500/20 px-1.5 py-0.2 font-mono text-[9px] text-purple-300">
                        {action.action_type}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-brand-mist/50">
                      Status: {action.status}
                    </div>
                  </div>
                  <Link
                    href="/admin/ai/control"
                    className="rounded border border-brand-edge-dark bg-brand-carbon px-2.5 py-1 text-[11px] text-white hover:border-brand-electric"
                  >
                    Inspect
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12.5px] text-brand-mist/50">
                <p className="font-medium text-brand-mist/70">AI Governance Policies Active</p>
                <p className="mt-1 text-[11.5px]">
                  All AI agent actions operate under strict ASSIST governance with human sign-off thresholds.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Real-time Audit & Activity Pulse */}
      <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
        <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
            Immutable Domain Event Ledger
          </h2>
          <Link
            href="/admin/platform/audit"
            className="text-[11.5px] text-brand-electric-bright hover:underline"
          >
            Full Ledger →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-sans text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark text-[10.5px] font-semibold uppercase tracking-wider text-brand-mist/40 font-mono">
                <th className="py-2">Timestamp</th>
                <th className="py-2">Event Type</th>
                <th className="py-2">Actor</th>
                <th className="py-2">Object</th>
                <th className="py-2">Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {recentAudits.length > 0 ? (
                recentAudits.map((event) => (
                  <tr key={event.id} className="text-brand-mist/80">
                    <td className="py-2.5 font-mono text-[11px] text-brand-mist/50">
                      {new Date(event.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 font-medium text-white">{event.event_type}</td>
                    <td className="py-2.5">{event.actor_type}</td>
                    <td className="py-2.5 font-mono text-[11px]">
                      {event.object_type} · {event.object_id.substring(0, 8)}
                    </td>
                    <td className="py-2.5 font-mono text-[10px] text-brand-mist/40">
                      {event.correlation_id}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[12px] text-brand-mist/50">
                    Audit ledger is initialized and capturing all domain events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  href,
  alert,
}: {
  label: string;
  value: number;
  subtext: string;
  href: string;
  alert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-lg border p-4 transition-all hover:border-brand-electric/60 hover:bg-brand-carbon/80 ${
        alert
          ? 'border-rose-500/40 bg-rose-500/5'
          : 'border-brand-edge-dark bg-brand-carbon/50'
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-wider text-brand-mist/50 group-hover:text-brand-mist/80">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-light tracking-tight tabular-nums sm:text-3xl ${
          alert ? 'text-rose-400 font-normal' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="mt-1 truncate text-[11px] text-brand-mist/40">{subtext}</div>
    </Link>
  );
}
