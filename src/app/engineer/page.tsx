import React from 'react';
import type { Metadata } from 'next';
import { listTodayVisitsForEngineer } from '@/server/field/operations-store';
import { EngineerTodayClient } from '@/components/engineer/EngineerTodayClient';

export const metadata: Metadata = {
  title: 'Today &bull; Field Engineer Mobile Execution | EntireFM CAFM',
  description: 'Mobile field operative execution queue for assigned site visits, digital job packs, and attendance.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerDashboardPage() {
  const operativeId = 'op-jack-turner';
  const providerOrgId = 'sup-test-01';
  const visits = await listTodayVisitsForEngineer(operativeId, providerOrgId);

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <div className="border-b border-slate-200 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          FIELD OPERATIVE TODAY QUEUE
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">
          What do I need to do today?
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {todayFormatted} &bull; Jack Turner (Lead Engineer)
        </p>
      </div>

      <EngineerTodayClient initialVisits={visits} operativeId={operativeId} />
    </div>
  );
}
