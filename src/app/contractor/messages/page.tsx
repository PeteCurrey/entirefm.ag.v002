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
    <div className="space-y-6 font-sans">
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Operational Communications</h1>
        <p className="text-[#6D6D68] text-xs mt-1 leading-relaxed">
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
              className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] p-5 space-y-2 hover:border-[#D4D4D0] transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#111111]">{thread.subject || 'Dispatch Communication'}</h2>
                <span className="text-[11.5px] text-[#6D6D68] flex items-center gap-1 font-normal">
                  <Clock className="w-3.5 h-3.5 text-[#9A9A95]" />
                  {new Date(thread.updated_at || thread.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>
              <p className="text-xs text-[#6D6D68] font-normal">
                Thread: <span className="font-mono">{thread.id.slice(0, 8)}</span> {thread.work_order_id ? `| Work Order: WO-${thread.work_order_id.slice(0, 8)}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
