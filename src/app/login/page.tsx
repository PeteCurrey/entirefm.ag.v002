/**
 * LOGIN ROLE GATEWAY — /login
 * ===========================
 * Three full-height visual panels (Client | Supplier | Engineer).
 * Selecting a role opens a premium auth modal overlay.
 * Admin is intentionally absent — /admin remains private, direct URL only.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, getPostLoginRedirect } from '@/server/identity';
import { redirect } from 'next/navigation';
import { LoginGatewayClient } from '@/components/auth/LoginGatewayClient';

export const metadata: Metadata = {
  title: { absolute: 'Sign In — EntireFM Platform' },
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect: redirectParam } = await searchParams;
  const session = await getCurrentSession();

  // Already authenticated — bounce straight to correct portal
  if (session && !error) {
    const destination = redirectParam || getPostLoginRedirect(session.role, session.orgType);
    redirect(destination);
  }

  return (
    <LoginGatewayClient errorCode={error ?? null} redirectParam={redirectParam ?? null} />
  );
}
