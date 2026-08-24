/**
 * CONTRACTOR DASHBOARD — /contractor
 * ====================================
 * Shows only assigned work orders, active jobs, and engineers assigned to this contractor.
 * Strict data boundary: queries are filtered by session.orgId (ProviderOrganisation).
 * Site access is per-work-order, NOT estate-wide.
 */
import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ContractorDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const [assignedWosRes, engineersRes, visitsRes] = await Promise.all([
    // Work orders assigned to this contractor — NOT all work orders
    dbQuery<any[]>(
      `work_orders?assigned_provider_id=eq.${encodeURIComponent(session.orgId)}&status=not.in.(COMPLETED,CLOSED,CANCELLED)&select=id,work_order_number,title,priority,status,site:sites(name,site_code)&order=created_at.desc&limit=10`
    ),
    // Engineers registered under this contractor
    dbQuery<any[]>(
      `persons?provider_organisation_id=eq.${encodeURIComponent(session.orgId)}&is_field_engineer=eq.true&select=id,first_name,last_name,engineer_status&limit=10`
    ),
    // Visits scheduled today for this contractor's engineers
    dbQuery<any[]>(
      `visits?provider_organisation_id=eq.${encodeURIComponent(session.orgId)}&planned_start_date=gte.${new Date().toISOString().split('T')[0]}&select=id,planned_start_time,status,site:sites(name)&order=planned_start_time.asc&limit=10`
    ),
  ]);

  const assignedWos = assignedWosRes.data || [];
  const engineers = engineersRes.data || [];
  const visits = visitsRes.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">
          Contractor Overview — <span className="font-medium text-brand-electric-bright">{session.orgName}</span>
        </h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Assigned work orders, field engineers, and today's site visits.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Active Jobs</div>
          <div className="mt-2 text-3xl font-light text-brand-electric-bright">{assignedWos.length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Assigned work orders</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Field Engineers</div>
          <div className="mt-2 text-3xl font-light text-emerald-400">{engineers.length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Registered in your team</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50">Visits Today</div>
          <div className="mt-2 text-3xl font-light text-cyan-400">{visits.length}</div>
          <div className="mt-1 text-[11.5px] text-brand-mist/40">Scheduled site attendances</div>
        </div>
      </div>

      {/* Assigned Work Orders */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6">
        <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
          <h2 className="text-[15px] font-medium text-white">Active Work Orders</h2>
          <Link href="/contractor/work" className="text-[12px] text-brand-electric hover:underline">
            View All →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-brand-edge-dark/30">
          {assignedWos.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-brand-mist/40">
              No active work orders assigned to your organisation.
            </div>
          ) : (
            assignedWos.map((wo) => (
              <div key={wo.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-[13.5px] font-medium text-white">{wo.title}</div>
                  <div className="text-[11.5px] text-brand-mist/50 font-mono">
                    {wo.work_order_number} · {wo.site?.name || 'Site TBC'} · Priority {wo.priority}
                  </div>
                </div>
                <span className="rounded bg-brand-electric/10 border border-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                  {wo.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
