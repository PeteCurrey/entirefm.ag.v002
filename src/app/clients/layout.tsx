/**
 * CANONICAL CLIENT PORTAL LAYOUT — /clients
 * =========================================
 * Dedicated client operating environment with scope indicator and navigation.
 * Strict server-side authorization and noindex enforcement.
 * Formatted with the unified EntireCAFM backend design system.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { Badge, Button } from '@/components/ui';
import { Building2, Plus, ArrowUpRight, LogOut } from 'lucide-react';
import '../admin/cafm.css';

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
    { name: 'Jobs & Requests', href: '/clients/work-orders' },
    { name: 'Sites & Properties', href: '/clients/sites' },
    { name: 'Compliance Radar', href: '/clients/compliance' },
    { name: 'Quotes & Approvals', href: '/clients/quotes' },
    { name: 'Document Vault', href: '/clients/documents' },
    { name: 'Asset Registry', href: '/clients/assets' },
  ];

  return (
    <div className="min-h-screen bg-cafm-surface-canvas text-cafm-text-primary font-cafm selection:bg-cafm-orange/20 selection:text-cafm-text-primary cafm-app">
      {/* Top Banner for Audited View-As Mode */}
      {isViewAs && (
        <div className="bg-cafm-warning-surface border-b border-cafm-warning-border px-6 py-2 text-center text-[12px] font-normal text-cafm-warning-text">
          ⚠️ AUDITED SUPPORT VIEW-AS: Viewing as <strong>{session.name}</strong> ({session.orgName}) · Operator: {session.viewAsContext?.operatorEmail}
        </div>
      )}

      {/* Visual Distinction Accent: EntireCAFM Orange Brand Indicator */}
      <div className="h-1 bg-cafm-orange" />

      {/* Main Client Top Navigation */}
      <header className="border-b border-cafm-border bg-cafm-surface-card/95 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/clients" className="flex items-center gap-2 shrink-0">
              <span className="text-[17px] font-light tracking-tight text-cafm-text-primary">
                Entire<span className="font-medium text-cafm-orange">FM</span>
              </span>
              <Badge variant="orange" size="xs">
                Client Dashboard
              </Badge>
            </Link>
            <span className="hidden md:inline-block rounded-full bg-cafm-surface-muted border border-cafm-border px-2.5 py-0.5 font-normal text-[11.5px] text-cafm-text-primary truncate max-w-[200px]">
              {session.orgName}
            </span>
            <span className="hidden lg:inline-block rounded-[4px] border border-cafm-border bg-cafm-surface-muted px-2 py-0.5 font-normal text-[10.5px] text-cafm-text-secondary">
              {scopeLabel} · Authorised Access
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-[13px] shrink-0">
            {/* Context Switch: Back to The Lobby */}
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1 rounded-[6px] border border-cafm-border bg-cafm-surface-muted px-2.5 py-1.5 text-xs text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-subtle transition-colors"
              title="Switch to The Lobby Community & Intelligence"
            >
              <span>The Lobby</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>

            {/* Log a Job Primary Action */}
            <Link href="/log-a-job">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-3.5 w-3.5" />}
              >
                Log a Job
              </Button>
            </Link>

            <span className="hidden md:inline text-cafm-text-secondary text-xs">
              {session.name}
            </span>

            <form action="/api/auth/logout" method="post">
              <Button variant="outline" size="xs" type="submit" icon={<LogOut className="h-3 w-3" />}>
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Secondary Navigation Strip */}
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 py-2 border-t border-cafm-border bg-cafm-surface-muted/50">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[6px] px-3 py-1.5 text-[12px] font-normal transition-all whitespace-nowrap text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-subtle"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
