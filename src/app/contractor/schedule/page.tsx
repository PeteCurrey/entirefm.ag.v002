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
    <div className="space-y-6 font-sans">
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Resource Schedule Matrix</h1>
        <p className="text-[#6D6D68] text-xs mt-1 leading-relaxed">
          Timeline view of scheduled field visits across your deployed engineers.
        </p>
      </div>

      {scheduleVisits.length === 0 ? (
        <EmptyState
          title="No Scheduled Visits"
          description="Visits scheduled for your engineering team will appear in this timeline matrix."
          icon="Calendar"
        />
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#6D6D68]">
              <thead className="bg-[#FAFAF8] text-[11px] uppercase font-bold text-[#6D6D68] border-b border-[#E8E8E5]">
                <tr>
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Work Order</th>
                  <th className="p-4">Site Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {scheduleVisits.map(v => (
                  <tr key={v.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-4 font-normal text-[#111111]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#9A9A95]" />
                        <span>{v.scheduled_date || 'Unscheduled'}</span>
                        {v.scheduled_start_time && (
                          <span className="text-[11px] text-[#6D6D68] ml-1">({v.scheduled_start_time})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#111111]">
                      {v.work_order?.reference || v.id.slice(0, 8)}
                    </td>
                    <td className="p-4 text-[#111111]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#9A9A95]" />
                        <span>{v.site?.name || 'Site'} {v.site?.town ? `(${v.site.town})` : ''}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-[#FAFAF8] border border-[#E8E8E5] text-[#111111]">
                        {v.work_order?.priority || 'P3'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-[4px] font-medium bg-[#FFF7ED] border border-[#FFEDD5] text-[#EA580C]">
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
