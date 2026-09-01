import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, requireAdminSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { dbQuery } from '@/server/db/client';

export const metadata: Metadata = {
  title: 'CEO Command — Query History',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false } },
};

export const dynamic = 'force-dynamic';

export default async function CeoCommandHistoryPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login?next=/admin/command/history');
  try { requireAdminSession(session); } catch { redirect('/admin/access-denied'); }

  if (!hasPermission(session, 'enterprise_intelligence:history_view' as any)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-8 max-w-md text-center">
          <div className="text-sm font-normal text-red-400 mb-2">ACCESS DENIED</div>
          <div className="text-white font-light">enterprise_intelligence:history_view permission required.</div>
        </div>
      </div>
    );
  }

  const { data: sessions } = await dbQuery<any[]>(
    `ceo_query_sessions?person_id=eq.${encodeURIComponent(session.personId)}&select=*,messages:ceo_query_messages(id,role,content,intent_category,data_status,created_at)&order=last_message_at.desc&limit=50`
  );
  const querySessions = sessions || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="CEO Command"
        title="Executive Query History"
        description="Audited log of all questions asked via CEO Command. Read-only."
      />
      {querySessions.length === 0 ? (
        <EmptyState
          title="No query history"
          description="CEO Command queries will appear here once you start using Ask EntireFM."
          action={{ label: 'Go to CEO Command', href: '/admin/command' }}
        />
      ) : (
        <div className="space-y-4">
          {querySessions.map((s: any) => (
            <div key={s.id} className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-normal text-brand-mist/40">
                  {new Date(s.started_at).toLocaleString('en-GB', { timeZone: 'Europe/London' })}
                </div>
                <div className="text-[10px] font-normal text-brand-mist/30">
                  {s.messages?.length ?? 0} message{(s.messages?.length ?? 0) === 1 ? '' : 's'}
                </div>
              </div>
              <div className="space-y-2">
                {(s.messages || []).slice(0, 6).map((m: any) => (
                  <div key={m.id} className={`flex gap-3 text-[12px] ${m.role === 'USER' ? '' : 'pl-4'}`}>
                    <span className={`shrink-0 font-normal text-[10px] pt-0.5${m.role === 'USER' ? 'text-brand-orange' : 'text-emerald-400'}`}>
                      {m.role === 'USER' ? 'YOU' : 'EFM'}
                    </span>
                    <span className="text-brand-mist/70 line-clamp-2">{m.content}</span>
                    {m.data_status && m.data_status !== 'LIVE' && (
                      <span className="ml-auto shrink-0 text-[9px] font-normal text-brand-mist/30 self-center">
                        {m.data_status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
