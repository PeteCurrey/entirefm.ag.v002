/**
 * FIELD ENGINEER PORTAL LAYOUT — /engineer
 * ==========================================
 * Premium mobile-first field operating system shell.
 * Scope: Authenticated engineer session, offline sync status, bottom navigation.
 */
import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import EngineerShell from '@/components/engineer/EngineerShell';

export const metadata: Metadata = {
  title: {
    template: '%s • EntireCAFM Field OS',
    default: 'Field Engineer • EntireCAFM',
  },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function EngineerLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?redirect=/engineer');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  const isEngineer = session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER';
  const isInternal = session.orgType === 'ENTIREFM';

  if (!isEngineer && !isViewAs && !isInternal) {
    redirect('/login?error=forbidden_engineer');
  }

  return (
    <EngineerShell
      session={{
        personId: session.personId,
        displayName: session.name || 'Field Operative',
        email: session.email,
        role: session.role,
        isViewAs,
        operatorEmail: session.viewAsContext?.operatorEmail,
      }}
    >
      {children}
    </EngineerShell>
  );
}
