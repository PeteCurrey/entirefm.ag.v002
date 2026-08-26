import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminLoginClient } from '@/components/admin/auth/AdminLoginClient';

export const metadata: Metadata = {
  title: { absolute: 'EntireFM Control Plane · Internal Authenticate' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next: nextParam } = await searchParams;
  const session = await getCurrentSession();

  // If already authenticated as internal EntireFM staff, bounce directly into the cockpit
  if (session && session.orgType === 'ENTIREFM' && !error) {
    const destination = nextParam || '/admin';
    redirect(destination);
  }

  return (
    <AdminLoginClient
      errorCode={error ?? null}
      nextUrl={nextParam ?? null}
    />
  );
}
