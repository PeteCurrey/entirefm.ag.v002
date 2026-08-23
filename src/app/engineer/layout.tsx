import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Field Engineer Application — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

export default async function EngineerLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-brand-void text-white">
      <header className="border-b border-brand-edge-dark bg-brand-carbon px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-electric">EntireFM</span>
            <span className="rounded bg-brand-electric/20 px-1.5 py-0.5 font-mono text-[10px] text-brand-electric-bright">
              Field App
            </span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="text-[12px] text-brand-mist/60 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
