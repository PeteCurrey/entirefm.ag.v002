import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContractorSchedulePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const { data: visits } = await dbQuery<any[]>(
    `visits?provider_org_id=eq.${orgId}&order=scheduled_date.asc,scheduled_start_time.asc&limit=50&select=*,site:sites(name,town),work_order:work_orders(reference,priority)`
  );

  const scheduleVisits = visits || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extralight text-white tracking-tight">Resource Schedule Matrix</h1>
        <p className="text-brand-mist text-sm mt-1">Timeline view of scheduled field visits across your deployed engineers.</p>
      </div>

      {scheduleVisits.length === 0 ? (
        <EmptyState
          title="No Scheduled Visits"
          description="Visits scheduled for your engineering team will appear in this timeline matrix."
          icon="Calendar"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-mist">
              <thead className="bg-brand-void text-xs uppercase font-light text-brand-mist border-b border-brand-edge-dark">
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Work Order</th>
                  <th className="p-4">Site Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark">
                {scheduleVisits.map(v => (
                  <tr key={v.id} className="hover:bg-brand-edge-dark/30 transition-colors">
                    <td className="p-4 font-mono text-white">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-mist" />
                        <span>{v.scheduled_date || 'Unscheduled'}</span>
                        {v.scheduled_start_time && (
                          <span className="text-xs text-brand-mist ml-1">({v.scheduled_start_time})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-light text-white">
                      {v.work_order?.reference || v.id.slice(0, 8)}
                    </td>
                    <td className="p-4 text-white">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-mist" />
                        <span>{v.site?.name || 'Site'} {v.site?.town ? `(${v.site.town})` : ''}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-normal px-2 py-0.5 rounded bg-brand-void text-white">
                        {v.work_order?.priority || 'P3'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-brand-edge-dark text-brand-electric">
                        {v.status}
                      </span>
                    </td>
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
