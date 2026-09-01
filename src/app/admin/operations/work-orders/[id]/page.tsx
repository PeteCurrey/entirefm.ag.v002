/**
 * Work Order Orchestration Detail Page
 * ─────────────────────────────────────
 * Live operational snapshot of every dimension of a Work Order:
 *   WHO OWNS IT / WHAT IS DUE / SLA STATE / CLIENT VIEW / BILLING STATE / TIMELINE
 *
 * Built on top of the canonical orchestrator engine — no duplicate status system.
 */
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { getWorkOrder } from '@/server/work';
import {
  deriveJobOrchestrationSnapshot,
  RawWorkOrderState,
  RawLifecycleArtifacts,
} from '@/server/work/orchestrator/lifecycle';
import {
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Banknote,
  Camera,
  FileText,
  RotateCcw,
  ChevronRight,
  CalendarClock,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Work Order ${id} | EntireFM Operations` };
}

function SLABadge({ state, minsRemaining }: { state: string; minsRemaining: number }) {
  const colour =
    state === 'BREACHED'
      ? 'bg-red-950/60 text-red-300 border-red-800/40'
      : state === 'AT_RISK'
      ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
      : state === 'ACHIEVED'
      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
      : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40';

  const label =
    state === 'BREACHED'
      ? `SLA BREACHED ${Math.abs(minsRemaining)}m ago`
      : state === 'AT_RISK'
      ? `SLA AT RISK — ${minsRemaining}m remaining`
      : state === 'ACHIEVED'
      ? 'SLA ACHIEVED'
      : `SLA ON TRACK — ${minsRemaining}m remaining`;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border font-light${colour}`}>
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}

function OwnerBadge({ owner }: { owner: string }) {
  const colours: Record<string, string> = {
    CONTRACTOR: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
    ENGINEER: 'bg-violet-950/60 text-violet-300 border-violet-800/40',
    CLIENT: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    HELPDESK: 'bg-pink-950/60 text-pink-300 border-pink-800/40',
    FINANCE: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
    SYSTEM: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border font-light${colours[owner] || colours.SYSTEM}`}>
      <User className="h-3 w-3" />
      {owner}
    </span>
  );
}

function BillingBadge({ state }: { state: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    READY_FOR_BILLING: { label: 'READY FOR BILLING', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' },
    AWAITING_COMPLETION: { label: 'AWAITING COMPLETION', cls: 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40' },
    AWAITING_EVIDENCE: { label: 'AWAITING EVIDENCE', cls: 'bg-amber-950/60 text-amber-300 border-amber-800/40' },
    AWAITING_SUPPLIER_COST: { label: 'AWAITING SUPPLIER COST', cls: 'bg-blue-950/60 text-blue-300 border-blue-800/40' },
    AWAITING_QUOTE_APPROVAL: { label: 'AWAITING QUOTE APPROVAL', cls: 'bg-amber-950/60 text-amber-300 border-amber-800/40' },
    BILLING_EXCEPTION: { label: 'BILLING EXCEPTION', cls: 'bg-red-950/60 text-red-300 border-red-800/40' },
    BILLED: { label: 'BILLED', cls: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30' },
    NOT_READY: { label: 'NOT READY', cls: 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40' },
  };
  const { label, cls } = map[state] || { label: state, cls: 'bg-zinc-800/60 text-zinc-400 border-zinc-700/40' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] border font-light${cls}`}>
      <Banknote className="h-3 w-3" />
      {label}
    </span>
  );
}

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'operations:read')) redirect('/admin');

  const workOrder = await getWorkOrder(id).catch(() => null);
  if (!workOrder) notFound();

  // Assemble orchestration snapshot from canonical work order fields
  const woState: RawWorkOrderState = {
    id: workOrder.id,
    work_order_number: workOrder.work_order_number || workOrder.id.slice(0, 8).toUpperCase(),
    title: workOrder.title || workOrder.description || 'Work Order',
    priority: workOrder.priority || 'P3_MEDIUM',
    trade: (workOrder as any).trade || workOrder.trade_id || 'GENERAL',
    status: workOrder.status || 'OPEN',
    billing_status: workOrder.billing_status,
    site_id: workOrder.site_id,
    site_name: workOrder.site?.name,
    client_id: workOrder.organisation_id,
    client_name: workOrder.organisation?.name,
    provider_organisation_id: workOrder.provider_organisation_id,
    provider_organisation_name: workOrder.provider_organisation?.name,
    assigned_engineer_id: workOrder.lead_engineer_id,
    assigned_engineer_name: (workOrder as any).assigned_engineer?.full_name,
    sla_resolution_due_at: workOrder.sla_resolution_due_at,
    sla_attendance_due_at: workOrder.sla_attendance_due_at,
    created_at: workOrder.created_at || new Date().toISOString(),
    updated_at: workOrder.created_at || new Date().toISOString(),
    completed_at: workOrder.actual_completion_at,
    total_revenue_gbp: workOrder.total_revenue_gbp,
    total_cost_gbp: workOrder.total_cost_gbp,
  };

  const artifacts: RawLifecycleArtifacts = {};

  const snapshot = deriveJobOrchestrationSnapshot(woState, artifacts);

  const priorityColour =
    snapshot.priority === 'P1_CRITICAL'
      ? 'text-red-400'
      : snapshot.priority === 'P2_HIGH'
      ? 'text-amber-400'
      : snapshot.priority === 'P3_MEDIUM'
      ? 'text-blue-400'
      : 'text-zinc-400';

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-medium uppercase tracking-widest text-brand-mist/50">
            Work Order
          </span>
          <h1 className="text-xl font-extralight text-white mt-0.5">
            {snapshot.work_order_number} — {snapshot.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`font-normal text-[11px]${priorityColour}`}>{snapshot.priority}</span>
            <span className="text-zinc-600 text-[11px]">•</span>
            <span className="text-brand-mist/60 text-[11px] font-normal">{snapshot.trade}</span>
            {snapshot.site_name && (
              <>
                <span className="text-zinc-600 text-[11px]">•</span>
                <span className="text-brand-mist/60 text-[11px]">{snapshot.site_name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SLABadge state={snapshot.sla_state} minsRemaining={snapshot.sla_minutes_remaining} />
          <BillingBadge state={snapshot.billing_readiness.billing_state} />
        </div>
      </div>

      {/* ── ORCHESTRATION SNAPSHOT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Current Stage */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Current Stage</div>
          <div className="text-base font-light text-white">{snapshot.current_stage}</div>
          <div className="text-[11px] text-brand-electric mt-1 font-normal">
            Client sees: {snapshot.client_status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Next Required Action */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Next Required Action</div>
          <div className="text-sm font-light text-white leading-relaxed">{snapshot.next_required_action}</div>
          <div className="flex items-center gap-1.5 mt-2">
            <OwnerBadge owner={snapshot.action_owner} />
          </div>
        </div>

        {/* Action Due */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Action Due</div>
          <div className="text-sm font-light text-white">
            {new Date(snapshot.action_due_at).toLocaleString('en-GB', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </div>
          {snapshot.chase_state.is_chase_due && (
            <div className="mt-2 text-[11px] text-amber-400 font-normal flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Chase {snapshot.chase_state.chase_type?.replace(/_/g, ' ')} due
            </div>
          )}
        </div>

        {/* Assignment */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Assigned Provider</div>
          {snapshot.assigned_provider_name ? (
            <>
              <div className="text-sm font-light text-white">{snapshot.assigned_provider_name}</div>
              {snapshot.assigned_engineer_name && (
                <div className="text-[11px] text-brand-mist/60 mt-0.5">Engineer: {snapshot.assigned_engineer_name}</div>
              )}
            </>
          ) : (
            <div className="text-sm text-zinc-500 italic">Not yet assigned</div>
          )}
        </div>

        {/* Evidence State */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Evidence State</div>
          <div className="flex items-center gap-2">
            {snapshot.evidence_state === 'VERIFIED' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : snapshot.evidence_state === 'PARTIAL' ? (
              <Camera className="h-4 w-4 text-amber-400" />
            ) : (
              <Camera className="h-4 w-4 text-zinc-500" />
            )}
            <span className="text-sm font-light text-white">{snapshot.evidence_state}</span>
          </div>
          {snapshot.completion_gate.blocking_reasons.length > 0 && (
            <div className="mt-2 space-y-1">
              {snapshot.completion_gate.blocking_reasons.map((r, i) => (
                <div key={i} className="text-[10.5px] text-red-400 font-normal">• {r}</div>
              ))}
            </div>
          )}
        </div>

        {/* Commercial State */}
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-4">
          <div className="text-[10px] uppercase font-medium text-brand-mist/50 mb-2">Commercial State</div>
          {snapshot.billing_readiness.client_price_net_gbp ? (
            <>
              <div className="text-sm font-light text-white">
                Net £{snapshot.billing_readiness.client_price_net_gbp?.toFixed(2)} / Gross £{snapshot.billing_readiness.client_price_gross_gbp?.toFixed(2)}
              </div>
              {snapshot.billing_readiness.expected_margin_pct !== undefined && (
                <div className="text-[11px] text-emerald-400 mt-0.5 font-normal">
                  Margin {snapshot.billing_readiness.expected_margin_pct}%
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-zinc-500 italic">Pricing not yet determined</div>
          )}
          {snapshot.billing_readiness.exceptions.map((e, i) => (
            <div key={i} className="text-[10.5px] text-amber-400 mt-1 font-normal">• {e}</div>
          ))}
        </div>
      </div>

      {/* ── JOB TIMELINE ── */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-brand-edge-dark flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-brand-mist/50" />
          <span className="text-sm font-light text-white">Job Timeline</span>
        </div>
        <div className="divide-y divide-brand-edge-dark/40">
          {snapshot.timeline.length === 0 ? (
            <div className="px-5 py-4 text-sm text-zinc-500 italic">No timeline events recorded yet.</div>
          ) : (
            snapshot.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-4 px-5 py-3.5 hover:bg-brand-void/30 transition-colors">
                <div className="text-[10.5px] font-normal text-brand-mist/50 min-w-[90px] mt-0.5 tabular-nums">
                  {new Date(event.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-light text-white">{event.title}</div>
                  {event.detail && <div className="text-[11px] text-brand-mist/60 mt-0.5">{event.detail}</div>}
                  {event.actor_name && <div className="text-[11px] text-brand-electric mt-0.5">{event.actor_name}</div>}
                </div>
                <span className={`text-[10px] font-normal px-2 py-0.5 rounded ${
                  event.source === 'CLIENT' ? 'bg-blue-950/50 text-blue-400' :
                  event.source === 'ENGINEER' ? 'bg-violet-950/50 text-violet-400' :
                  event.source === 'CONTRACTOR' ? 'bg-amber-950/50 text-amber-400' :
                  event.source === 'HELPDESK' ? 'bg-pink-950/50 text-pink-400' :
                  event.source === 'FINANCE' ? 'bg-emerald-950/50 text-emerald-400' :
                  'bg-zinc-800/50 text-zinc-400'
                }`}>
                  {event.source}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── COMPLETION GATE DETAIL ── */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-brand-mist/50" />
          <span className="text-sm font-light text-white">Completion Gate</span>
          {snapshot.completion_gate.is_verified ? (
            <span className="ml-auto text-[11px] font-normal text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> VERIFIED
            </span>
          ) : (
            <span className="ml-auto text-[11px] font-normal text-red-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> NOT VERIFIED
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Operational Work', pass: snapshot.completion_gate.operational_work_complete },
            { label: 'Evidence', pass: snapshot.completion_gate.mandatory_evidence_passed },
            { label: 'Service Report', pass: snapshot.completion_gate.service_report_passed },
            { label: 'No Open Quote', pass: !snapshot.completion_gate.has_unapproved_quote },
            { label: 'No Return Visit', pass: !snapshot.completion_gate.has_outstanding_return_visit },
          ].map((gate) => (
            <div key={gate.label} className="flex items-center gap-2">
              {gate.pass ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
              )}
              <span className="text-[11px] text-brand-mist/70">{gate.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
