/**
 * CANONICAL CLIENT PORTAL LAYOUT — /clients
 * =========================================
 * Dedicated client operating environment with scope indicator and navigation.
 * Strict server-side authorization and noindex enforcement.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Client Portal — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientsLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  // Enforce client authorization or audited View-As context
  if (!session) {
    redirect('/login?redirect=/clients');
  }

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CLIENT' && !isViewAs) {
    redirect('/login?error=forbidden_client');
  }

  const siteScopes = session.scopes.filter((s) => s.type === 'SITE');
  const scopeLabel =
    siteScopes.length === 1
      ? `1 Property`
      : siteScopes.length > 1
      ? `${siteScopes.length} Properties`
      : 'Full Portfolio';

  const navLinks = [
    { name: 'Overview', href: '/clients' },
    { name: 'Log a Job', href: '/log-a-job', highlight: true },
    { name: 'Jobs', href: '/clients/work-orders' },
    { name: 'Sites & Properties', href: '/clients/sites' },
    { name: 'Compliance', href: '/clients/compliance' },
    { name: 'Quotes & Approvals', href: '/clients/quotes' },
    { name: 'Documents', href: '/clients/documents' },
  ];

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist selection:bg-brand-electric selection:text-white">
      {/* Top Banner for Audited View-As Mode */}
      {isViewAs && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-2 text-center text-[12px] font-normal text-amber-300">
          ⚠️ AUDITED SUPPORT VIEW-AS: Viewing as {session.name} ({session.orgName}) · Operator: {session.viewAsContext?.operatorEmail}
        </div>
      )}

      {/* Visual Distinction Accent: High-trust Client Environment Strip */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-brand-electric to-emerald-400" />

      {/* Main Client Top Navigation */}
      <header className="border-b border-brand-edge-dark bg-brand-carbon/95 backdrop-blur-md sticky top-0 z-20 shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/clients" className="flex items-center gap-2.5">
              <span className="text-[16px] font-light tracking-tight text-white">
                Entire<span className="font-light text-brand-electric">FM</span>
              </span>
              <span className="rounded border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 font-medium text-[10px] uppercase tracking-widest text-emerald-300">
                Client Dashboard
              </span>
            </Link>
            <span className="rounded-full bg-brand-electric/10 border border-brand-electric/30 px-2.5 py-0.5 font-normal text-[11px] text-brand-electric-bright">
              {session.orgName}
            </span>
            <span className="hidden sm:inline-block rounded border border-brand-edge-dark bg-brand-void/60 px-2 py-0.5 font-normal text-[10.5px] text-brand-mist/50">
              {scopeLabel} · Authorised Access
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[13px]">
            {/* Quick Context Switch: Back to The Lobby */}
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1.5 rounded-sm border border-brand-edge-dark/80 bg-brand-void/60 px-2.5 sm:px-3 py-1.5 text-xs text-brand-mist/80 hover:text-white hover:border-brand-mist/40 transition-colors"
              title="Switch to The Lobby Community & Intelligence"
            >
              <span>The Lobby ↗</span>
            </Link>

            {/* Log a Job CTA matching header CTA design */}
            <Link
              href="/log-a-job"
              className="inline-flex items-center justify-center rounded-sm border border-brand-electric/40 bg-brand-electric/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-light tracking-wide text-brand-electric-bright transition-all duration-300 ease-brand hover:border-brand-electric/70 hover:bg-brand-electric/20 hover:text-white"
            >
              Log a Job
            </Link>

            <span className="hidden md:inline text-brand-mist/70">
              {session.name} <span className="font-normal text-[11px] text-brand-mist/40">({session.role})</span>
            </span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded border border-brand-edge-dark px-3 py-1 text-[12px] text-brand-mist hover:bg-brand-void hover:text-white transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Secondary Navigation Strip */}
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-6 py-2.5 border-t border-brand-edge-dark/40">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-sm px-3 py-1.5 text-[12.5px] font-light transition-all whitespace-nowrap ${
                (item as any).highlight
                  ? 'border border-brand-electric/40 bg-brand-electric/10 text-brand-electric-bright hover:border-brand-electric/70 hover:bg-brand-electric/20 hover:text-white'
                  : 'text-brand-mist/70 hover:bg-brand-void hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
