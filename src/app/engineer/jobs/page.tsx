/**
 * FIELD ENGINEER — ASSIGNED JOBS DIRECTORY
 * =========================================
 * Mobile-first search, filter, and management of all work orders and visits.
 */

import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import { EngineerJobsClient, EngineerJobItem } from '@/components/engineer/EngineerJobsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assigned Jobs • Field Directory',
  description: 'View and filter all assigned site visits and work orders for your operative profile.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerJobsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer/jobs');

  // Query canonical visits assigned to this engineer
  const { data: visits } = await dbQuery<any[]>(
    `visits?assigned_resource_id=eq.${encodeURIComponent(
      session.personId
    )}&order=scheduled_start_at.desc&limit=50&select=id,status,scheduled_start_at,scheduled_end_at,work_order:work_orders(id,work_order_number,title,description,priority,status),site:sites(id,name,town,address_line1)`
  );

  // Also query work orders where engineer is assigned as lead_engineer_id
  const { data: leadOrders } = await dbQuery<any[]>(
    `work_orders?lead_engineer_id=eq.${encodeURIComponent(
      session.personId
    )}&order=created_at.desc&limit=50&select=id,work_order_number,title,description,priority,status,target_start_at,site:sites(id,name,town,address_line1)`
  );

  const visitWorkOrderIds = new Set(
    (visits || []).map((v) => v.work_order?.id).filter(Boolean)
  );

  const items: EngineerJobItem[] = [
    ...(visits || []).map((v) => ({
      id: v.id,
      linkHref: `/engineer/visits/${v.id}`,
      reference: v.work_order?.work_order_number || `VIS-${v.id.slice(0, 8)}`,
      title: v.work_order?.title || 'Assigned Site Visit',
      status: v.status || 'SCHEDULED',
      priority: v.work_order?.priority || 'NORMAL',
      siteName: v.site?.name || 'Commercial Site',
      location: v.site?.town || v.site?.address_line1 || '',
      siteId: v.site?.id,
      workOrderId: v.work_order?.id,
      date: v.scheduled_start_at
        ? new Date(v.scheduled_start_at).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        : null,
      time: v.scheduled_start_at
        ? new Date(v.scheduled_start_at).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : null,
    })),
    ...(leadOrders || [])
      .filter((wo) => !visitWorkOrderIds.has(wo.id))
      .map((wo) => ({
        id: wo.id,
        linkHref: `/engineer/visits/${wo.id}`,
        reference: wo.work_order_number || `WO-${wo.id.slice(0, 8)}`,
        title: wo.title || 'Assigned Work Order',
        status: wo.status || 'OPEN',
        priority: wo.priority || 'NORMAL',
        siteName: wo.site?.name || 'Commercial Site',
        location: wo.site?.town || wo.site?.address_line1 || '',
        siteId: wo.site?.id,
        workOrderId: wo.id,
        date: wo.target_start_at
          ? new Date(wo.target_start_at).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })
          : null,
        time: null,
      })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
            OPERATIVE WORK ORDERS
          </span>
          <h1 className="text-xl font-bold text-white mt-0.5">Assigned Jobs</h1>
        </div>
        <span className="bg-brand-carbon border border-brand-edge-dark text-xs text-brand-mist px-2.5 py-1 rounded-full font-medium">
          {items.length} {items.length === 1 ? 'Job' : 'Jobs'} Total
        </span>
      </div>

      <EngineerJobsClient initialItems={items} />
    </div>
  );
}
