import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EngineerJobsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  // Query canonical visits assigned to this engineer
  const { data: visits } = await dbQuery<any[]>(
    `visits?assigned_resource_id=eq.${encodeURIComponent(session.personId)}&order=scheduled_start_at.desc&limit=30&select=id,status,scheduled_start_at,scheduled_end_at,work_order:work_orders(id,work_order_number,title,description,priority,status),site:sites(name,town,address_line1)`
  );

  // Also query work orders where engineer is assigned as lead_engineer_id
  const { data: leadOrders } = await dbQuery<any[]>(
    `work_orders?lead_engineer_id=eq.${encodeURIComponent(session.personId)}&order=created_at.desc&limit=30&select=id,work_order_number,title,description,priority,status,target_start_at,site:sites(name,town,address_line1)`
  );

  const visitWorkOrderIds = new Set(
    (visits || []).map((v) => v.work_order?.id).filter(Boolean)
  );

  const items = [
    ...(visits || []).map((v) => ({
      id: v.id,
      linkHref: `/engineer/visits/${v.id}`,
      reference: v.work_order?.work_order_number || `VIS-${v.id.slice(0, 8)}`,
      title: v.work_order?.title || 'Assigned Visit',
      status: v.status || 'SCHEDULED',
      siteName: v.site?.name || 'Site',
      location: v.site?.town || v.site?.address_line1 || '',
      date: v.scheduled_start_at
        ? new Date(v.scheduled_start_at).toLocaleDateString('en-GB')
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
        reference: wo.work_order_number,
        title: wo.title,
        status: wo.status,
        siteName: wo.site?.name || 'Site',
        location: wo.site?.town || wo.site?.address_line1 || '',
        date: wo.target_start_at
          ? new Date(wo.target_start_at).toLocaleDateString('en-GB')
          : null,
        time: null,
      })),
  ];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-light">Assigned Jobs</h1>
        <span className="text-xs text-brand-mist/60">
          {items.length} {items.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-8 text-center">
          <p className="text-white font-light">No assigned jobs</p>
          <p className="text-brand-mist text-sm mt-1">Visits assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.linkHref}
              className="block bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 hover:border-brand-electric/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-brand-mist text-xs font-mono">{item.reference}</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-brand-void text-brand-electric border border-brand-electric/20">
                  {item.status}
                </span>
              </div>
              <h2 className="text-white font-medium text-base mb-1">{item.title}</h2>
              <p className="text-brand-mist/80 text-xs mb-2.5">{item.siteName}</p>
              <div className="flex items-center gap-4 text-xs text-brand-mist border-t border-brand-edge-dark/50 pt-2.5">
                {item.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                )}
                {item.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.time}
                  </span>
                )}
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
