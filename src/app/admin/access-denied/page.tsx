import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { AdminAccessDeniedClient } from '@/components/admin/auth/AdminAccessDeniedClient';

export const metadata: Metadata = {
  title: { absolute: 'Access Denied · EntireFM Control Plane' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AdminAccessDeniedPage() {
  const session = await getCurrentSession();

  return <AdminAccessDeniedClient session={session} />;
}
