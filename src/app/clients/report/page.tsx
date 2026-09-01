/**
 * REPORT AN ISSUE — /clients/report (Phase 0M Addendum)
 * ====================================================
 * Client Helpdesk conversational and standard issue intake page.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import ClientHelpdeskConversationalClient from './ClientHelpdeskConversationalClient';

export const metadata: Metadata = {
  title: 'Report an Issue | Client Helpdesk — EntireFM',
  description: 'Log maintenance and facilities issues directly with the EntireFM Helpdesk.',
};

export const dynamic = 'force-dynamic';

export default async function ClientReportIssuePage() {
  redirect('/clients/log-a-job');
}
