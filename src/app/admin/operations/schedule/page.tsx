import React from 'react';
import type { Metadata } from 'next';
import { listVisits } from '@/server/work';
import { SchedulePageClient } from './SchedulePageClient';

export const metadata: Metadata = {
  title: 'Schedule & Site Visits | EntireFM Operations',
  description: 'Daily and weekly engineer attendance calendar, travel coordination, and planned site visits.',
};

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const visits = await listVisits();

  return <SchedulePageClient initialVisits={visits} />;
}
