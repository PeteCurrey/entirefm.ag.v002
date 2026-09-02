/**
 * CLIENT PLANNED MAINTENANCE (PPM) — /clients/ppm
 * ================================================
 * Shows upcoming and recently completed planned maintenance
 * visits for the client's authorised estate sites.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planned Maintenance | Client Portal — EntireFM',
  description: 'Upcoming and completed planned preventative maintenance across your managed properties.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

function statusBadge(status: string) {
  const s = status?.toUpperCase() || '';
  if (s === 'COMPLETED') {
    return <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-normal text-emerald-400">Completed</span>;
  }
  if (s === 'OVERDUE') {
    return <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-normal text-rose-400">Overdue</span>;
  }
  return <span className="rounded border border-brand-electric/20 bg-brand-electric/10 px-2 py-0.5 text-[10px] font-normal text-brand-electric-bright">Scheduled</span>;
}

export default async function ClientPpmPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s: any) => s.type === 'SITE').map((s: any) => s.id);
  const siteIdFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const today = new Date().toISOString().slice(0, 10);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const ninetyDaysAhead = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [upcomingRes, recentRes] = await Promise.all([
    dbQuery<any[]>(
      `maintenance_occurrences?status=in.(PLANNED,GENERATED)${siteIdFilter}&planned_date=gte.${today}&planned_date=lte.${ninetyDaysAhead}&select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name),asset:assets(name,asset_reference,site:sites(name))&order=planned_date.asc&limit=50`
    ),
    dbQuery<any[]>(
      `maintenance_occurrences?status=eq.COMPLETED${siteIdFilter}&planned_date=gte.${ninetyDaysAgo}&select=id,occurrence_code,planned_date,status,plan:maintenance_plans(name),asset:assets(name,asset_reference,site:sites(name))&order=planned_date.desc&limit=20`
    ),
  ]);

  const upcoming = upcomingRes.data || [];
  const recent = recentRes.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Planned Maintenance</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Upcoming scheduled maintenance visits and recently completed service records for {session.orgName}.
        </p>
      </div>

      {/* Upcoming */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-brand-electric-bright" />
          <h2 className="text-sm font-normal text-white">Upcoming Visits</h2>
          <span className="rounded border border-brand-edge-dark px-2 py-0.5 text-[10px] text-brand-mist/50">
            Next 90 days
          </span>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 px-6 py-10 text-center">
            <Clock className="w-7 h-7 text-brand-mist/30 mx-auto mb-3" />
            <p className="text-sm text-brand-mist/60">No planned maintenance visits are currently scheduled.</p>
            <p className="text-xs text-brand-mist/40 mt-1">
              Your EntireFM account manager can confirm the maintenance programme for your properties.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                <tr>
                  <th className="px-6 py-3">Asset / Service</th>
                  <th className="px-6 py-3">Maintenance Plan</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Planned Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                {upcoming.map((occ) => (
                  <tr key={occ.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-normal text-white">{occ.asset?.name || 'General Service'}</div>
                      {occ.asset?.asset_reference && (
                        <div className="text-[11px] text-brand-mist/40 mt-0.5">{occ.asset.asset_reference}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-brand-mist/70">{occ.plan?.name || 'Planned Maintenance'}</td>
                    <td className="px-6 py-3.5 text-brand-mist/70">{occ.asset?.site?.name || '—'}</td>
                    <td className="px-6 py-3.5 font-normal text-white">
                      {occ.planned_date
                        ? new Date(occ.planned_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5">{statusBadge(occ.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent completions */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-normal text-white">Recently Completed</h2>
            <span className="rounded border border-brand-edge-dark px-2 py-0.5 text-[10px] text-brand-mist/50">
              Last 90 days
            </span>
          </div>
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                <tr>
                  <th className="px-6 py-3">Asset / Service</th>
                  <th className="px-6 py-3">Maintenance Plan</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Completed</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                {recent.map((occ) => (
                  <tr key={occ.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-normal text-white">{occ.asset?.name || 'General Service'}</div>
                      {occ.asset?.asset_reference && (
                        <div className="text-[11px] text-brand-mist/40 mt-0.5">{occ.asset.asset_reference}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-brand-mist/70">{occ.plan?.name || 'Planned Maintenance'}</td>
                    <td className="px-6 py-3.5 text-brand-mist/70">{occ.asset?.site?.name || '—'}</td>
                    <td className="px-6 py-3.5 font-normal text-[12px]">
                      {occ.planned_date
                        ? new Date(occ.planned_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5">{statusBadge(occ.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
