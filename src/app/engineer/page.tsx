/**
 * FIELD ENGINEER MOBILE APP — /engineer
 * =====================================
 * Mobile-first operational overview for field engineers.
 * Displays greeting, today metrics, next job spotlight, and execution queue.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { listTodayVisitsForEngineer } from '@/server/field/operations-store';
import { EngineerTodayClient } from '@/components/engineer/EngineerTodayClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Today • Field Queue',
  description: 'Mobile field operative execution queue for assigned site visits, digital job packs, and attendance.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer');

  const operativeId = session.personId;
  const providerOrgId = session.orgId;

  const visits = await listTodayVisitsForEngineer(operativeId, providerOrgId);

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = session.name.split(' ')[0] || 'Engineer';

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Top Field Briefing Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
            FIELD OPERATIONS &bull; {todayFormatted}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
            {timeGreeting}, {firstName}
          </h1>
          <p className="text-xs text-brand-mist/70 mt-0.5">
            You have <strong className="text-white">{visits.length}</strong> site {visits.length === 1 ? 'visit' : 'visits'} assigned for today.
          </p>
        </div>
      </div>

      <EngineerTodayClient
        initialVisits={visits}
        operativeId={operativeId}
        engineerName={session.name}
      />
    </div>
  );
}
