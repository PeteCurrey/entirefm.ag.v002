import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MapPin, Clock, ChevronRight, Mic } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Visit {
  id: string;
  status: string;
  scheduled_date?: string;
  scheduled_start_time?: string;
  work_order?: {
    id: string;
    reference: string;
    description?: string;
    priority: string;
    sla_snapshot?: { attendance_deadline?: string };
  };
  site?: {
    name: string;
    address_line1?: string;
    town?: string;
  };
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    P1: 'bg-red-600 text-white',
    P2: 'bg-amber-500 text-black',
    P3: 'bg-blue-600 text-white',
    P4: 'bg-green-700 text-white',
    P5: 'bg-zinc-600 text-white',
  };
  return map[priority] || 'bg-zinc-700 text-white';
}

function visitStatusLabel(status: string) {
  const map: Record<string, string> = {
    PLANNED: 'Planned',
    CONFIRMED: 'Confirmed',
    EN_ROUTE: 'En Route',
    ON_SITE: 'On Site',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    NO_ACCESS: 'No Access',
  };
  return map[status] || status;
}

function visitStatusColor(status: string) {
  const map: Record<string, string> = {
    EN_ROUTE: 'text-blue-400',
    ON_SITE: 'text-brand-electric',
    IN_PROGRESS: 'text-green-400',
    COMPLETED: 'text-zinc-500',
    NO_ACCESS: 'text-red-400',
  };
  return map[status] || 'text-brand-mist';
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatLongDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default async function EngineerPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const today = new Date().toISOString().split('T')[0];

  // Fetch today's visits for this engineer
  const { data: visits } = await dbQuery<Visit[]>(
    `visits?engineer_person_id=eq.${session.personId}&scheduled_date=eq.${today}&order=scheduled_start_time.asc&select=id,status,scheduled_date,scheduled_start_time,work_order:work_orders(id,reference,description,priority,sla_snapshot),site:sites(name,address_line1,town)`
  );

  const allVisits = visits || [];
  // Next actionable visit: not yet completed
  const nextVisit = allVisits.find(v => !['COMPLETED', 'CANCELLED', 'NO_ACCESS'].includes(v.status));

  const firstName = (session.name ?? 'Engineer').split(' ')[0];

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-brand-mist text-sm">{formatLongDate()}</p>
        <h1 className="text-white text-2xl font-bold mt-1">
          {formatGreeting()}, {firstName}
        </h1>
      </div>

      {/* Next Job hero */}
      <section aria-label="Next job" className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-5">
        <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-3">Next job</p>

        {nextVisit ? (
          <>
            <div className="flex items-start gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${priorityBadge(nextVisit.work_order?.priority ?? 'P3')}`}>
                {nextVisit.work_order?.priority ?? 'P3'}
              </span>
              <span className="text-brand-mist text-sm font-mono">{nextVisit.work_order?.reference}</span>
            </div>
            <h2 className="text-white text-lg font-semibold leading-tight mb-1">
              {nextVisit.site?.name ?? 'Site'}
            </h2>
            {nextVisit.site?.address_line1 && (
              <p className="text-brand-mist text-sm flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {nextVisit.site.address_line1}{nextVisit.site.town ? `, ${nextVisit.site.town}` : ''}
              </p>
            )}
            {nextVisit.scheduled_start_time && (
              <p className="text-brand-mist text-sm flex items-center gap-1.5 mb-4">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Attend by {formatDate(nextVisit.scheduled_start_time)}
              </p>
            )}
            <Link
              href={`/engineer/visits/${nextVisit.id}`}
              className="block w-full bg-brand-electric text-black font-bold text-center py-4 rounded-xl text-base hover:bg-brand-electric-bright transition-colors active:scale-98"
              style={{ minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Open Job
            </Link>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-white font-semibold">All caught up</p>
            <p className="text-brand-mist text-sm mt-1">No outstanding visits today</p>
          </div>
        )}
      </section>

      {/* Today's schedule */}
      {allVisits.length > 0 && (
        <section aria-label="Today's schedule">
          <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-3">Today&apos;s schedule</p>
          <div className="space-y-2">
            {allVisits.map(visit => (
              <Link
                key={visit.id}
                href={`/engineer/visits/${visit.id}`}
                className="flex items-center justify-between bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 hover:border-brand-electric/50 transition-colors active:scale-99"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {visit.scheduled_start_time && (
                    <span className="text-brand-mist text-xs font-mono w-10 shrink-0">
                      {formatDate(visit.scheduled_start_time)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{visit.site?.name ?? 'Site'}</p>
                    <p className="text-brand-mist text-xs font-mono">{visit.work_order?.reference}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`text-xs font-medium ${visitStatusColor(visit.status)}`}>
                    {visitStatusLabel(visit.status)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-brand-mist" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Talk to EntireFM */}
      <section>
        <Link
          href="/engineer/talk"
          className="flex items-center gap-4 bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 hover:border-brand-electric/50 transition-colors"
          style={{ minHeight: '72px' }}
        >
          <div className="w-12 h-12 rounded-full bg-brand-electric/10 flex items-center justify-center shrink-0">
            <Mic className="w-6 h-6 text-brand-electric" />
          </div>
          <div>
            <p className="text-white font-semibold">Talk to EntireFM</p>
            <p className="text-brand-mist text-sm">Speak naturally — capture observations, defects, notes</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
