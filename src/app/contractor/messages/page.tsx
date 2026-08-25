import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import { MessageSquare, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContractorMessagesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const { data: threads } = await dbQuery<any[]>(
    `communication_threads?order=updated_at.desc&limit=50&select=*`
  );

  const messageThreads = threads || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extralight text-white tracking-tight">Operational Communications</h1>
        <p className="text-brand-mist text-sm mt-1">
          Unified communications linked to work orders, dispatch enquiries, and technical queries.
        </p>
      </div>

      {messageThreads.length === 0 ? (
        <EmptyState
          title="No Active Message Threads"
          description="Direct communications with the EntireFM Helpdesk and Dispatch team will appear here."
          icon="MessageSquare"
        />
      ) : (
        <div className="space-y-3">
          {messageThreads.map(thread => (
            <div
              key={thread.id}
              className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-2 hover:border-brand-edge transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-light text-white">{thread.subject || 'Dispatch Communication'}</h2>
                <span className="text-xs text-brand-mist flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(thread.updated_at || thread.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
              <p className="text-xs text-brand-mist font-mono">
                Thread: {thread.id.slice(0, 8)} {thread.work_order_id ? `| Work Order: WO-${thread.work_order_id.slice(0, 8)}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
