/**
 * CANONICAL CLIENT DASHBOARD — /clients
 * ======================================
 * Estate overview: Needs Your Attention, activity summary,
 * property cards, and recent activity. Strictly scoped to
 * client organisation and assigned sites.
 * Built with the unified EntireCAFM backend design system.
 */

import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  MapPin,
  Building2,
  FileCheck,
  CalendarClock,
  Plus,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { Card, Badge, Button, StatTile } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s: any) => s.type === 'SITE').map((s: any) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';
  const siteIdFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  // --- TENANT SCOPING: Resolve client account IDs for this organisation ---
  let clientAccountIds: string[] = [];
  if (session.orgId) {
    const { data: caRows } = await dbQuery<any[]>(
      `client_accounts?organisation_id=eq.${encodeURIComponent(session.orgId)}&select=id`
    );
    clientAccountIds = (caRows || []).map((r) => r.id);
  }

  // Build tenant-scoped quote filter — if no client accounts exist, return no quotes
  const quotesFilter =
    clientAccountIds.length > 0
      ? `&client_account_id=in.(${clientAccountIds.map(encodeURIComponent).join(',')})`
      : '&id=eq.00000000-0000-0000-0000-000000000000';

  // Build tenant-scoped compliance filter using site IDs
  const complianceScopeFilter =
    siteScopes.length > 0
      ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})`
      : clientAccountIds.length > 0
        ? ''
        : '&id=eq.00000000-0000-0000-0000-000000000000';

  const [
    sitesRes,
    openWoRes,
    awaitingClientWoRes,
    ppmUpcomingRes,
    pendingQuotesRes,
    complianceAttentionRes,
    recentCompletedRes,
  ] = await Promise.all([
    dbQuery<any[]>(
      `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city,postcode,address_line1,site_type,status`
    ),
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,priority,status,disposition_state,site_id,created_at&order=created_at.desc&limit=50`
    ),
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&disposition_state=in.(AWAITING_CLIENT_APPROVAL,AWAITING_ACCESS)&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,disposition_state,site_id&limit=10`
    ),
    dbQuery<any[]>(
      `maintenance_occurrences?status=in.(PLANNED,GENERATED)${siteIdFilter}&planned_date=gte.${new Date().toISOString().slice(0,10)}&select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name)&order=planned_date.asc&limit=5`
    ),
    dbQuery<any[]>(
      `quotes?status=in.(DRAFT,ISSUED,PENDING_APPROVAL)${quotesFilter}&select=id,quote_number,title,total_price_gbp,status,site_id&limit=10`
    ),
    dbQuery<any[]>(
      `compliance_obligations?status=in.(OVERDUE,DUE_SOON)${complianceScopeFilter}&select=id,title,status,next_due_at,responsible_party,site:sites(name)&limit=5`
    ),
    dbQuery<any[]>(
      `work_orders?organisation_id=eq.${encodeURIComponent(session.orgId)}&status=in.(COMPLETED,CLOSED)&select=id,work_order_number,title,status,completed_at,site_id&order=completed_at.desc&limit=5`
    ),
  ]);

  const sites = sitesRes.data || [];
  const openWorkOrders = (openWoRes.data || []).filter(
    (wo: any) => siteScopes.length === 0 || siteScopes.includes(wo.site_id)
  );
  const awaitingClientJobs = awaitingClientWoRes.data || [];
  const upcomingPpm = ppmUpcomingRes.data || [];
  const pendingQuotes = pendingQuotesRes.data || [];
  const complianceAttention = complianceAttentionRes.data || [];
  const recentCompleted = recentCompletedRes.data || [];

  // Build attention items list
  const attentionItems: Array<{ type: string; message: string; href: string; urgent?: boolean }> = [];

  pendingQuotes.forEach((q: any) => {
    attentionItems.push({
      type: 'QUOTE',
      message: `Quote ${q.quote_number} — ${q.title || 'Remedial Works'} requires your approval`,
      href: '/clients/quotes',
    });
  });

  awaitingClientJobs.forEach((wo: any) => {
    const label =
      wo.disposition_state === 'AWAITING_ACCESS'
        ? `${wo.work_order_number} requires facility access to be arranged`
        : `${wo.work_order_number} requires client approval to proceed`;
    attentionItems.push({
      type: 'JOB',
      message: label,
      href: `/clients/work-orders/${wo.id}`,
    });
  });

  complianceAttention.forEach((ob: any) => {
    if (ob.status === 'OVERDUE') {
      attentionItems.push({
        type: 'COMPLIANCE',
        message: `${ob.title || 'Statutory Obligation'} at ${ob.site?.name || 'your estate'} is overdue`,
        href: '/clients/compliance',
        urgent: true,
      });
    }
  });

  // Build per-site open job counts
  const openJobsBySite: Record<string, number> = {};
  openWorkOrders.forEach((wo: any) => {
    if (wo.site_id) openJobsBySite[wo.site_id] = (openJobsBySite[wo.site_id] || 0) + 1;
  });

  // Upcoming PPM: first date
  const nextPpmDate = upcomingPpm.length > 0 ? upcomingPpm[0].planned_date : null;

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 lg:space-y-8 font-cafm">
      {/* ─── GREETING & COMMAND HEADER ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cafm-border pb-5">
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-cafm-text-secondary font-normal block">
            {greeting}
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-cafm-text-primary tracking-tight mt-0.5">
            {session.orgName}
          </h1>
          <p className="text-[13px] text-cafm-text-secondary mt-1">
            {sites.length === 0
              ? 'No properties currently under active management.'
              : sites.length === 1
              ? 'Real-time operational status for your managed property.'
              : `Real-time operational status across ${sites.length} managed properties.`}
          </p>
        </div>
        <Link href="/log-a-job" className="shrink-0">
          <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />}>
            Log a Job
          </Button>
        </Link>
      </div>

      {/* ─── NEEDS YOUR ATTENTION ─────────────────────────────────────────── */}
      <Card
        title="Needs Your Attention"
        subtitle="Action items requiring client review, authorization, or access confirmation"
        icon={<AlertCircle className="h-3.5 w-3.5 text-cafm-orange" />}
        compact
      >
        {attentionItems.length === 0 ? (
          <div className="py-6 px-4 flex items-center gap-3 bg-cafm-nominal-surface/30 rounded-[8px] border border-cafm-nominal-border/40">
            <CheckCircle2 className="w-5 h-5 text-cafm-nominal-dot shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-cafm-text-primary">You&apos;re completely up to date.</p>
              <p className="text-[11.5px] text-cafm-text-secondary mt-0.5">
                All maintenance requests, quotations, and statutory obligations are nominal.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-cafm-border">
            {attentionItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-cafm-surface-muted rounded-[6px] transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Badge
                    variant={
                      item.type === 'COMPLIANCE'
                        ? 'critical'
                        : item.type === 'QUOTE'
                        ? 'orange'
                        : 'warning'
                    }
                    size="xs"
                  >
                    {item.type}
                  </Badge>
                  <span className="text-[13px] text-cafm-text-primary group-hover:text-cafm-orange transition-colors truncate">
                    {item.message}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* ─── ACTIVITY SUMMARY — 3 STAT TILES ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Open Jobs */}
        <StatTile
          label="Open Work Orders"
          value={openWorkOrders.length}
          sublabel="Active maintenance requests"
          icon={<Wrench className="h-3.5 w-3.5" />}
          href="/clients/work-orders"
          active={openWorkOrders.length > 0}
        />

        {/* PPM */}
        <StatTile
          label="Planned Preventive Maintenance"
          value={upcomingPpm.length}
          sublabel={
            nextPpmDate
              ? `Next visit: ${new Date(nextPpmDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
              : 'No upcoming visits scheduled'
          }
          icon={<CalendarClock className="h-3.5 w-3.5" />}
          href="/clients/ppm"
        />

        {/* Compliance */}
        <StatTile
          label="Statutory Compliance"
          value={
            complianceAttention.some((o: any) => o.status === 'OVERDUE')
              ? `${complianceAttention.filter((o: any) => o.status === 'OVERDUE').length} Overdue`
              : complianceAttention.length > 0
              ? `${complianceAttention.length} Due Soon`
              : '100% Compliant'
          }
          sublabel={
            complianceAttention.some((o: any) => o.status === 'OVERDUE')
              ? 'Immediate duty-holder action required'
              : complianceAttention.length > 0
              ? 'Upcoming obligations in next 30 days'
              : 'All statutory certificates current'
          }
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          href="/clients/compliance"
          variant={
            complianceAttention.some((o: any) => o.status === 'OVERDUE')
              ? 'critical'
              : complianceAttention.length > 0
              ? 'warning'
              : 'nominal'
          }
        />
      </div>

      {/* ─── YOUR PROPERTIES ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[13px] font-medium text-cafm-text-primary uppercase tracking-wide">
              Managed Properties &amp; Portfolios
            </h2>
            <p className="text-[11.5px] text-cafm-text-secondary">
              Physical facilities under active EntireFM operational management
            </p>
          </div>
          <Link
            href="/clients/sites"
            className="text-xs text-cafm-orange font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>View All ({sites.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {sites.length === 0 ? (
          <Card compact className="p-8 text-center bg-cafm-surface-muted border-dashed">
            <Building2 className="w-8 h-8 text-cafm-text-muted mx-auto mb-2" />
            <p className="text-[13px] text-cafm-text-primary font-medium">No properties assigned yet.</p>
            <p className="text-[11.5px] text-cafm-text-secondary mt-0.5">
              Contact your EntireFM account manager to associate facilities with your account.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.slice(0, 6).map((site: any) => {
              const openCount = openJobsBySite[site.id] || 0;
              return (
                <Card
                  key={site.id}
                  hoverable
                  compact
                  className="group"
                >
                  <Link href={`/clients/sites/${site.id}`} className="block space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge variant="neutral" size="xs">
                            {site.site_code}
                          </Badge>
                          <span className="text-[10px] uppercase text-cafm-text-secondary">
                            {site.site_type?.replace(/_/g, ' ') || 'Commercial Site'}
                          </span>
                        </div>
                        <h3 className="text-[14px] font-medium text-cafm-text-primary group-hover:text-cafm-orange transition-colors truncate">
                          {site.name}
                        </h3>
                        <p className="text-[11.5px] text-cafm-text-secondary mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cafm-text-muted shrink-0" />
                          <span className="truncate">
                            {[site.city, site.postcode].filter(Boolean).join(', ')}
                          </span>
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <div className="pt-2 border-t border-cafm-border flex items-center justify-between text-[11px]">
                      {openCount > 0 ? (
                        <Badge variant="orange" size="xs">
                          {openCount} Open Job{openCount !== 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="nominal" size="xs">
                          Zero Open Jobs
                        </Badge>
                      )}
                      <span className="text-cafm-orange font-medium group-hover:underline">
                        Launch Site 360 →
                      </span>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── RECENT COMPLETIONS ───────────────────────────────────────────── */}
      {recentCompleted.length > 0 && (
        <Card
          title="Recent Completions & Sign-Offs"
          subtitle="Recently resolved work orders across your property portfolio"
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-cafm-nominal-dot" />}
          compact
        >
          <div className="divide-y divide-cafm-border">
            {recentCompleted.map((wo: any) => (
              <Link
                key={wo.id}
                href={`/clients/work-orders/${wo.id}`}
                className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-cafm-surface-muted rounded-[6px] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-cafm-nominal-dot shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-cafm-text-primary group-hover:text-cafm-orange transition-colors truncate">
                      {wo.title}
                    </p>
                    <p className="text-[11px] text-cafm-text-secondary mt-0.5">
                      {wo.work_order_number}
                      {wo.completed_at
                        ? ` · Completed ${new Date(wo.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                        : ''}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
