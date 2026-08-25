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
      ? `Site Scope: ${siteScopes[0].id}`
      : siteScopes.length > 1
      ? `Sites: ${siteScopes.length} Restricted`
      : 'Scope: Full Portfolio';

  const navLinks = [
    { name: 'Dashboard', href: '/clients' },
    { name: 'Sites', href: '/clients/sites' },
    { name: 'Assets', href: '/clients/assets' },
    { name: 'Work Orders', href: '/clients/work-orders' },
    { name: 'PPM', href: '/clients/ppm' },
    { name: 'Compliance', href: '/clients/compliance' },
    { name: 'Documents', href: '/clients/documents' },
    { name: 'Quotes', href: '/clients/quotes' },
    { name: 'Invoices', href: '/clients/invoices' },
  ];

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist selection:bg-brand-electric selection:text-white">
      {/* Top Banner for Audited View-As Mode */}
      {isViewAs && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-2 text-center text-[12px] font-mono text-amber-300">
          ⚠️ AUDITED SUPPORT VIEW-AS: Viewing as {session.name} ({session.orgName}) · Operator: {session.viewAsContext?.operatorEmail}
        </div>
      )}

      {/* Main Client Top Navigation */}
      <header className="border-b border-brand-edge-dark bg-brand-carbon/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/clients" className="flex items-center gap-2.5">
              <span className="text-[16px] font-light tracking-tight text-white">
                Entire<span className="font-light text-brand-electric">FM</span>
              </span>
              <span className="rounded border border-brand-edge-dark bg-brand-void/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-mist/70">
                Client Portal
              </span>
            </Link>
            <span className="rounded-full bg-brand-electric/10 border border-brand-electric/30 px-2.5 py-0.5 font-mono text-[11px] text-brand-electric-bright">
              {session.orgName}
            </span>
            <span className="hidden sm:inline-block rounded border border-brand-edge-dark bg-brand-void/60 px-2 py-0.5 font-mono text-[10.5px] text-brand-mist/50">
              {scopeLabel}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[13px]">
            <span className="hidden md:inline text-brand-mist/70">
              {session.name} <span className="font-mono text-[11px] text-brand-mist/40">({session.role})</span>
            </span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded border border-brand-edge-dark px-3 py-1 text-[12px] text-brand-mist hover:bg-brand-void hover:text-white transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Secondary Navigation Strip */}
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-2 border-t border-brand-edge-dark/40">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-1.5 text-[12.5px] font-normal text-brand-mist/70 hover:bg-brand-void hover:text-white transition-colors whitespace-nowrap"
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
