import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import { User, Wrench, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContractorEngineersPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const { data: resources } = await dbQuery<any[]>(
    `provider_resources?provider_org_id=eq.${orgId}&order=created_at.desc&select=*,person:persons(first_name,last_name,email,phone)`
  );

  const engineers = resources || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Provider Engineers & Resources</h1>
        <p className="text-brand-mist text-sm mt-1">Manage field workforce, verified trades, and dispatch eligibility.</p>
      </div>

      {engineers.length === 0 ? (
        <EmptyState
          title="No Engineers Registered"
          description="Add your employed and subcontracted engineers to enable assignment dispatch."
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engineers.map(e => (
            <div
              key={e.id}
              className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-electric/10 text-brand-electric flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">
                      {e.person ? `${e.person.first_name} ${e.person.last_name}` : 'Field Engineer'}
                    </h2>
                    <p className="text-xs text-brand-mist">{e.employment_status || 'EMPLOYED'}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>

              {e.trades_json && e.trades_json.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-brand-edge-dark">
                  <span className="text-xs font-semibold text-brand-mist uppercase tracking-wider block">Trades</span>
                  <div className="flex flex-wrap gap-1.5">
                    {e.trades_json.map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-brand-void text-white border border-brand-edge-dark flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-brand-electric" />
                        {t}
                      </span>
                    ))}
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
