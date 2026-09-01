/**
 * FIELD ENGINEER MOBILE APP — /engineer (Phase 0M Addendum)
 * ==========================================================
 * Mobile-first operational dashboard for field operatives.
 * Displays today's queue, SLA countdowns, journey tracking, and active visit status.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { listTodayVisitsForEngineer } from '@/server/field/operations-store';
import { EngineerTodayClient } from '@/components/engineer/EngineerTodayClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Today • Field Engineer Mobile App — EntireFM',
  description: 'Mobile field operative execution queue for assigned site visits, digital job packs, and attendance.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer');

  const operativeId = session.personId;
  const providerOrgId = session.orgId;

  const visits = await listTodayVisitsForEngineer(operativeId, providerOrgId);

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <div className="border-b border-brand-edge-dark pb-3">
        <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
          FIELD OPERATIVE TODAY QUEUE
        </span>
        <h1 className="text-xl font-bold text-white mt-0.5">
          What do I need to do today?
        </h1>
        <p className="text-xs text-brand-mist/60 font-normal mt-0.5">
          {todayFormatted} &bull; {session.name}
        </p>
      </div>

      <EngineerTodayClient initialVisits={visits} operativeId={operativeId} />
    </div>
  );
}
