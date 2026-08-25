/**
 * FIELD ENGINEER TODAY VIEW — /engineer
 * ========================================
 * Shows ONLY today's visits assigned to this engineer (filtered by person_id).
 * No cross-engineer visibility. No estate-wide data.
 */
import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

const today = new Date().toISOString().split('T')[0];

export default async function EngineerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  // CRITICAL: filter strictly by this engineer's person_id
  const { data: todayVisits } = await dbQuery<any[]>(
    `visits?assigned_engineer_id=eq.${encodeURIComponent(session.personId)}&planned_start_date=eq.${today}&select=id,planned_start_time,planned_end_time,status,work_order:work_orders(title,work_order_number,priority),site:sites(name,site_code,address_line1,city,postcode)&order=planned_start_time.asc`
  );

  const visits = todayVisits || [];

  const statusColour = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-brand-electric/10 border-brand-electric/20 text-brand-electric-bright';
      case 'COMPLETED': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'TRAVEL': return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
      default: return 'bg-brand-carbon border-brand-edge-dark text-brand-mist/60';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-light text-white">
          Today&apos;s Visits
        </h1>
        <p className="mt-0.5 text-[12.5px] text-brand-mist/50 font-mono">{today}</p>
      </div>

      {visits.length === 0 ? (
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
          <div className="text-[14px] text-brand-mist/40">No visits scheduled for today.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((v) => (
            <div key={v.id} className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-4 space-y-3">
              {/* Time + Status row */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-white">
                  {v.planned_start_time?.slice(0, 5) || '–'}
                  {v.planned_end_time ? ` → ${v.planned_end_time.slice(0, 5)}` : ''}
                </span>
                <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${statusColour(v.status)}`}>
                  {v.status || 'PLANNED'}
                </span>
              </div>

              {/* Work Order */}
              {v.work_order && (
                <div>
                  <div className="text-[14px] font-normal text-white">{v.work_order.title}</div>
                  <div className="text-[11.5px] text-brand-mist/50 font-mono mt-0.5">
                    {v.work_order.work_order_number} · Priority {v.work_order.priority}
                  </div>
                </div>
              )}

              {/* Site */}
              {v.site && (
                <div className="rounded border border-brand-edge-dark/60 bg-brand-void/60 p-3 text-[12.5px]">
                  <div className="font-normal text-white">{v.site.name}</div>
                  <div className="text-brand-mist/50 mt-0.5">
                    {[v.site.address_line1, v.site.city, v.site.postcode].filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
