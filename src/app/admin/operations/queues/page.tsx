/**
 * ENTIREFM OPERATIONAL QUEUES DASHBOARD (Phase 0M Addendum)
 * ==========================================================
 * Operator view across ALL active job queue states.
 * Human Helpdesk manages EXCEPTIONS — not routine orchestration tasks.
 *
 * Queue strips:
 *   NEW / UNTRIAGED
 *   AWAITING ASSIGNMENT
 *   AWAITING CONTRACTOR ACKNOWLEDGEMENT
 *   SLA AT RISK
 *   AWAITING UPDATE
 *   AWAITING QUOTE
 *   AWAITING CLIENT APPROVAL
 *   RETURN VISIT REQUIRED
 *   COMPLETION VERIFICATION
 *   READY FOR BILLING
 *   BILLING EXCEPTIONS
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  AlertCircle,
  UserCheck,
  Bell,
  AlertTriangle,
  MessageSquare,
  FileQuestion,
  ThumbsUp,
  RotateCcw,
  ShieldCheck,
  Banknote,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Operational Queues | EntireFM Admin' };
export const dynamic = 'force-dynamic';

interface QueueStripProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  items: any[];
  color: 'red' | 'amber' | 'blue' | 'violet' | 'emerald' | 'pink' | 'zinc';
  href: string;
  priority?: boolean;
}

function QueueStrip({ icon, label, count, items, color, href, priority }: QueueStripProps) {
  const countCls = {
    red: 'text-red-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    pink: 'text-pink-400',
    zinc: 'text-zinc-400',
  }[color];

  const borderCls = {
    red: 'border-red-900/40',
    amber: 'border-amber-900/40',
    blue: 'border-blue-900/40',
    violet: 'border-violet-900/40',
    emerald: 'border-emerald-900/40',
    pink: 'border-pink-900/40',
    zinc: 'border-zinc-700/40',
  }[color];

  return (
    <div className={`bg-brand-carbon border ${borderCls} rounded-xl overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-edge-dark/60">
        <div className="flex items-center gap-2.5">
          <span className={countCls}>{icon}</span>
          <div>
            <div className="text-[10px] uppercase font-medium text-brand-mist/50">{label}</div>
            <div className={`text-lg font-extralight${countCls}`}>{count}</div>
          </div>
        </div>
        <Link
          href={href}
          className="text-[10.5px] font-normal text-brand-electric hover:text-white flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {count === 0 ? (
        <div className="px-4 py-3 text-[11px] text-zinc-600 italic">Queue empty</div>
      ) : (
        <div className="divide-y divide-brand-edge-dark/30">
          {items.slice(0, 4).map((item: any) => (
            <Link
              key={item.id}
              href={`/admin/operations/work-orders/${item.id}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-void/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-light text-white truncate">
                  {item.work_order_number || item.id?.slice(0, 8)?.toUpperCase()} — {item.title || item.description || 'Work Order'}
                </div>
                <div className="text-[10.5px] text-brand-mist/50 font-normal mt-0.5">
                  {item.priority || 'P3'} · {item.trade || 'GENERAL'} · {item.sites?.name || item.site_id?.slice(0, 8)}
                </div>
              </div>
              <ArrowRight className="h-3 w-3 text-zinc-600 group-hover:text-brand-electric transition-colors shrink-0 ml-2" />
            </Link>
          ))}
          {count > 4 && (
            <div className="px-4 py-2 text-[10.5px] text-zinc-500 font-normal">
              + {count - 4} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default async function OperationalQueuesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'operations:read')) redirect('/admin');

  // ─── FETCH ALL QUEUE COUNTS IN PARALLEL ───────────────────────────────────
  const [
    untriaged,
    awaitingAssignment,
    awaitingAcknowledgement,
    slaAtRisk,
    awaitingUpdate,
    awaitingQuote,
    awaitingClientApproval,
    returnVisitRequired,
    completionVerification,
    readyForBilling,
    billingExceptions,
  ] = await Promise.all([
    dbQuery<any[]>(`work_orders?status=eq.OPEN&provider_organisation_id=is.null&select=id,work_order_number,title,description,priority,trade,site_id,sites:sites(name)&order=created_at.asc&limit=10`),
    dbQuery<any[]>(`work_orders?status=eq.ISSUED&select=id,work_order_number,title,description,priority,trade,site_id,sites:sites(name)&order=created_at.asc&limit=10`),
    dbQuery<any[]>(`work_assignments?status=eq.OFFERED&select=id,work_order_id,work_orders:work_orders(id,work_order_number,title,description,priority,trade,site_id,sites:sites(name))&order=assigned_at.asc&limit=10`),
    dbQuery<any[]>(`work_orders?status=not.in.(COMPLETED,CLOSED,CANCELLED)&sla_resolution_due_at=not.is.null&select=id,work_order_number,title,description,priority,trade,sla_resolution_due_at,site_id,sites:sites(name)&order=sla_resolution_due_at.asc&limit=10`),
    dbQuery<any[]>(`work_orders?status=eq.IN_PROGRESS&select=id,work_order_number,title,description,priority,trade,updated_at,site_id,sites:sites(name)&order=updated_at.asc&limit=10`),
    dbQuery<any[]>(`quotes?status=eq.DRAFT&select=id,work_order_id,title,created_at,work_orders:work_orders(id,work_order_number,title,priority,trade,site_id,sites:sites(name))&order=created_at.asc&limit=10`),
    dbQuery<any[]>(`quotes?status=in.(ISSUED,PENDING_APPROVAL)&select=id,work_order_id,total_price_gbp,created_at,work_orders:work_orders(id,work_order_number,title,priority,trade,site_id,sites:sites(name))&order=created_at.asc&limit=10`),
    dbQuery<any[]>(`work_orders?status=eq.IN_PROGRESS&select=id,work_order_number,title,description,priority,trade,site_id,sites:sites(name)&order=updated_at.asc&limit=10`),
    dbQuery<any[]>(`work_orders?status=eq.COMPLETED&select=id,work_order_number,title,description,priority,trade,completed_at,site_id,sites:sites(name)&order=completed_at.desc&limit=10`),
    dbQuery<any[]>(`billing_items?status=eq.READY_FOR_BILLING&select=id,work_order_id,billable_gross_gbp,created_at&order=created_at.asc&limit=10`),
    dbQuery<any[]>(`billing_items?status=eq.EXCEPTION&select=id,work_order_id,exception_reason,created_at&order=created_at.asc&limit=10`),
  ]);

  function items(r: { data: any[] | null }) {
    return r.data || [];
  }

  // Flatten assignment-linked WO refs
  const ackItems = items(awaitingAcknowledgement).map((a: any) => a.work_orders || { id: a.work_order_id });
  const quoteItems = items(awaitingClientApproval).map((q: any) => q.work_orders || { id: q.work_order_id });

  const totalAtRisk = items(slaAtRisk).filter(
    (wo: any) =>
      wo.sla_resolution_due_at &&
      (new Date(wo.sla_resolution_due_at).getTime() - Date.now()) < 2 * 3600000
  );

  const totalActionRequired =
    items(untriaged).length +
    items(awaitingAssignment).length +
    ackItems.length +
    totalAtRisk.length +
    quoteItems.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Operational Job Queues"
        description="Real-time visibility across all active job states. The Helpdesk manages exceptions — routine orchestration is automated."
      />

      {/* Action Required Header Strip */}
      {totalActionRequired > 0 && (
        <div className="bg-red-950/30 border border-red-900/40 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <div>
            <span className="text-sm font-light text-red-300">
              {totalActionRequired} item{totalActionRequired !== 1 ? 's' : ''} require immediate action
            </span>
            <span className="text-[11px] text-red-400/60 ml-2 font-normal">Untriaged · Unassigned · Unacknowledged · SLA At Risk</span>
          </div>
        </div>
      )}

      {/* ─── QUEUE GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

        <QueueStrip
          icon={<AlertCircle className="h-4 w-4" />}
          label="New / Untriaged"
          count={items(untriaged).length}
          items={items(untriaged)}
          color="red"
          href="/admin/operations/service-requests"
          priority
        />

        <QueueStrip
          icon={<UserCheck className="h-4 w-4" />}
          label="Awaiting Assignment"
          count={items(awaitingAssignment).length}
          items={items(awaitingAssignment)}
          color="amber"
          href="/admin/operations/allocation"
        />

        <QueueStrip
          icon={<Bell className="h-4 w-4" />}
          label="Awaiting Contractor Acknowledgement"
          count={ackItems.length}
          items={ackItems}
          color="amber"
          href="/admin/operations/dispatch"
        />

        <QueueStrip
          icon={<AlertTriangle className="h-4 w-4" />}
          label="SLA At Risk"
          count={totalAtRisk.length}
          items={totalAtRisk}
          color="red"
          href="/admin/operations/sla-control"
          priority
        />

        <QueueStrip
          icon={<MessageSquare className="h-4 w-4" />}
          label="Awaiting Update (On Site)"
          count={items(awaitingUpdate).length}
          items={items(awaitingUpdate)}
          color="blue"
          href="/admin/operations/work-orders"
        />

        <QueueStrip
          icon={<FileQuestion className="h-4 w-4" />}
          label="Awaiting Quote Preparation"
          count={items(awaitingQuote).length}
          items={items(awaitingQuote).map((q: any) => q.work_orders || { id: q.work_order_id })}
          color="violet"
          href="/admin/operations/defects"
        />

        <QueueStrip
          icon={<ThumbsUp className="h-4 w-4" />}
          label="Awaiting Client Approval"
          count={quoteItems.length}
          items={quoteItems}
          color="amber"
          href="/admin/operations/defects"
        />

        <QueueStrip
          icon={<RotateCcw className="h-4 w-4" />}
          label="Return Visit Required"
          count={items(returnVisitRequired).length}
          items={items(returnVisitRequired)}
          color="violet"
          href="/admin/operations/schedule"
        />

        <QueueStrip
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Completion Verification"
          count={items(completionVerification).length}
          items={items(completionVerification)}
          color="blue"
          href="/admin/operations/completion-review"
        />

        <QueueStrip
          icon={<Banknote className="h-4 w-4" />}
          label="Ready for Billing"
          count={items(readyForBilling).length}
          items={items(readyForBilling).map((b: any) => ({ id: b.work_order_id, work_order_number: b.work_order_id?.slice(0, 8)?.toUpperCase() }))}
          color="emerald"
          href="/admin/finance/billing-ready"
        />

        <QueueStrip
          icon={<XCircle className="h-4 w-4" />}
          label="Billing Exceptions"
          count={items(billingExceptions).length}
          items={items(billingExceptions).map((b: any) => ({ id: b.work_order_id, work_order_number: b.work_order_id?.slice(0, 8)?.toUpperCase(), title: b.exception_reason || 'Exception' }))}
          color="red"
          href="/admin/finance/exceptions"
          priority
        />
      </div>
    </div>
  );
}
