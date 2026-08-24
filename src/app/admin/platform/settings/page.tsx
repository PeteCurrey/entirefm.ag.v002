import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { PlatformSettingsClient } from '@/components/admin/platform/PlatformSettingsClient';

export const metadata: Metadata = {
  title: 'System Settings & Profile — EntireFM CAFM',
};

export const dynamic = 'force-dynamic';

export default async function PlatformSettingsPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?redirect=/admin/platform/settings');
  }

  try {
    requireAdminSession(session);
  } catch {
    redirect('/login?error=forbidden_admin');
  }

  return <PlatformSettingsClient session={session} />;
}
