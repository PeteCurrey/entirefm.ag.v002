import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EngineerJobsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const { data: visits } = await dbQuery<any[]>(
    `visits?engineer_person_id=eq.${session.personId}&order=scheduled_date.desc,scheduled_start_time.asc&limit=30&select=id,status,scheduled_date,scheduled_start_time,work_order:work_orders(id,reference,description,priority),site:sites(name,town)`
  );

  const allVisits = visits || [];

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      <h1 className="text-white text-xl font-light">Assigned Jobs</h1>

      {allVisits.length === 0 ? (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-8 text-center">
          <p className="text-white font-light">No assigned jobs</p>
          <p className="text-brand-mist text-sm mt-1">Visits assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allVisits.map(visit => (
            <Link
              key={visit.id}
              href={`/engineer/visits/${visit.id}`}
              className="block bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 hover:border-brand-electric/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-brand-mist text-xs font-mono">{visit.work_order?.reference || visit.id.slice(0, 8)}</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-brand-void text-brand-electric">
                  {visit.status}
                </span>
              </div>
              <h2 className="text-white font-light text-base mb-1">{visit.site?.name || 'Site'}</h2>
              <div className="flex items-center gap-4 text-xs text-brand-mist">
                {visit.scheduled_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {visit.scheduled_date}
                  </span>
                )}
                {visit.site?.town && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {visit.site.town}
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
