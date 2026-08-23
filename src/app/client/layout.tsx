import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Client Portal — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-brand-surface text-brand-graphite">
      <header className="border-b border-brand-edge bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold text-brand-graphite">EntireFM</span>
            <span className="rounded bg-brand-surface px-2 py-0.5 font-mono text-[11px] font-medium text-brand-silver">
              Client Portal
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="text-brand-silver">{session.name} ({session.orgName})</span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="font-medium text-brand-electric hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
