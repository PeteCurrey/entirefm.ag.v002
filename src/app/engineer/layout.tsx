/**
 * FIELD ENGINEER PORTAL LAYOUT — /engineer
 * ==========================================
 * Mobile-first interface for field engineers.
 * Scope: ONLY visits assigned to the authenticated engineer (person_id).
 * Internal admin can VIEW-AS to audit field journey.
 */
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Field Engineer — EntireFM' },
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

  const navLinks = [
    { name: 'Today', href: '/engineer' },
    { name: 'Jobs', href: '/engineer/jobs' },
    { name: 'Talk-to-Job', href: '/engineer/talk', badge: 'AI' },
    { name: 'Profile', href: '/engineer/profile' },
  ];

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist">
      {/* View-As Banner */}
      {isViewAs && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-[12px] font-mono text-amber-300">
          ⚠️ AUDITED VIEW-AS · Operator: {session.viewAsContext?.operatorEmail}
        </div>
      )}

      {/* Mobile-optimised header */}
      <header className="border-b border-brand-edge-dark bg-brand-carbon sticky top-0 z-20">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/engineer" className="flex items-center gap-2">
            <span className="text-[15px] font-light text-white">
              Entire<span className="font-light text-brand-electric">FM</span>
            </span>
            <span className="rounded border border-brand-edge-dark px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brand-mist/50">
              Field
            </span>
          </Link>
          <span className="text-[12.5px] text-brand-mist/70">{session.name}</span>
        </div>

        {/* Tab navigation */}
        <div className="flex border-t border-brand-edge-dark/40">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-2.5 text-center text-[12px] font-normal text-brand-mist/60 hover:bg-brand-void hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              {item.name}
              {item.badge && (
                <span className="rounded bg-brand-electric/20 border border-brand-electric/40 px-1 py-0.2 font-mono text-[9px] text-brand-electric-bright">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">{children}</main>
    </div>
  );
}
