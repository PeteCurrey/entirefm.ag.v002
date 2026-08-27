import React from 'react';
import type { Metadata } from 'next';
import { listPendingApprovals } from '@/server/commercial';
import { ApprovalsPageClient } from './ApprovalsPageClient';

export const metadata: Metadata = {
  title: 'Approvals & Authorizations | EntireFM Admin',
  description: 'Manage pending financial approvals, variation requests, and completion sign-offs.',
};

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const approvals = await listPendingApprovals();

  return <ApprovalsPageClient initialApprovals={approvals} />;
}
