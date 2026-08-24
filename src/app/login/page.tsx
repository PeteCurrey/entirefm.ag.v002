/**
 * SHARED AUTHENTICATION PORTAL — /login
 * =====================================
 * Single identity entrypoint for EntireFM Operations, Clients, Contractors, and Engineers.
 * Role-aware redirection and multi-context selector.
 *
 * NEVER INDEXED:
 * Private portal marked with strict noindex metadata.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession, getPostLoginRedirect } from '@/server/identity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Sign In — EntireFM Unified Platform' },
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; select_context?: string; redirect?: string }>;
}) {
  const { error, select_context, redirect: redirectParam } = await searchParams;
  const session = await getCurrentSession();

  // If user is already authenticated with multiple contexts and requests selection
  const showContextSelector = session && (select_context === '1' || (session.availableContexts && session.availableContexts.length > 1));

  if (session && !showContextSelector && !error) {
    const destination = redirectParam || getPostLoginRedirect(session.role, session.orgType);
    redirect(destination);
  }

  const getErrorMessage = (code?: string) => {
    switch (code) {
      case 'forbidden_admin':
        return 'Access Denied: /admin is restricted to EntireFM internal operations staff.';
      case 'forbidden_client':
        return 'Access Denied: /clients is restricted to authorised client accounts.';
      case 'forbidden_contractor':
        return 'Access Denied: /contractor is restricted to approved contractor organisations.';
      case 'forbidden_engineer':
        return 'Access Denied: /engineer is restricted to field engineer accounts.';
      case 'unauthorized_context':
        return 'You do not have active membership in the selected organization.';
      case 'expired':
        return 'Your session has expired. Please sign in again.';
      case 'no_active_membership':
        return 'Your account does not have an active membership. Please contact EntireFM Support.';
      case 'invalid_credentials':
      case '1':
        return 'Invalid email or password. Please verify your credentials.';
      default:
        return null;
    }
  };

  const errorText = getErrorMessage(error);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-brand-void text-brand-mist selection:bg-brand-electric selection:text-white">
      {/* Top Header */}
      <header className="border-b border-brand-edge-dark/80 bg-brand-void/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[17px] font-light tracking-tight text-white">
              Entire<span className="font-semibold text-brand-electric">FM</span>
            </span>
            <span className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-mist/60">
              Unified Platform
            </span>
          </Link>
          <Link
            href="/"
            className="text-[12px] font-medium text-brand-mist/70 transition-colors hover:text-white"
          >
            ← Back to Public Website
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="rounded-lg border border-brand-edge-dark/80 bg-brand-carbon/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-electric/30 bg-brand-electric/10 px-2.5 py-1 text-[11px] font-medium text-brand-electric-bright">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-pulse" />
                Operational Access Gate
              </div>
              <h1 className="mt-4 text-2xl font-light tracking-tight text-white">
                {showContextSelector ? 'Select your active context' : 'Sign in to your account'}
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-mist/60">
                {showContextSelector
                  ? 'Your account has access to multiple applications. Choose where to continue.'
                  : 'Single sign-on for Internal Operations, Clients, Contractors, and Field Engineers.'}
              </p>
            </div>

            {/* Error Banner */}
            {errorText && (
              <div className="mb-6 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
                {errorText}
              </div>
            )}

            {/* Multi-Context Selector */}
            {showContextSelector && session.availableContexts && (
              <div className="space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/70">
                  Available Memberships
                </div>
                <div className="space-y-2">
                  {session.availableContexts.map((ctx) => (
                    <form key={ctx.orgId} action="/api/auth/switch-context" method="post">
                      <input type="hidden" name="orgId" value={ctx.orgId} />
                      <button
                        type="submit"
                        className="w-full text-left rounded border border-brand-edge-dark bg-brand-void/80 hover:border-brand-electric p-3.5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-white group-hover:text-brand-electric-bright">
                            {ctx.orgName}
                          </span>
                          <span className="rounded bg-brand-carbon border border-brand-edge-dark px-2 py-0.5 font-mono text-[10px] text-brand-mist/70">
                            {ctx.portal}
                          </span>
                        </div>
                        <div className="mt-1 text-[12px] text-brand-mist/50">
                          Role: {ctx.role}
                        </div>
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            )}

            {/* Normal Sign In Form */}
            {!showContextSelector && (
              <form action="/api/auth/login" method="post" className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[11px] uppercase tracking-wider text-brand-mist/70"
                  >
                    Email Address or Admin Key
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="name@entirefm.com"
                    className="mt-1.5 w-full rounded border border-brand-edge-dark bg-brand-void/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block font-mono text-[11px] uppercase tracking-wider text-brand-mist/70"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded border border-brand-edge-dark bg-brand-void/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded bg-brand-electric py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-electric-bright focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-brand-void active:scale-[0.99]"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* Footer Notice */}
            <div className="mt-8 border-t border-brand-edge-dark/60 pt-6 text-center">
              <p className="font-mono text-[11px] text-brand-mist/40">
                Protected Enterprise Environment · All access audited
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-brand-edge-dark/60 py-4 text-center text-[11px] text-brand-mist/40">
        EntireFM Unified Operations Platform · Secure Multi-Tenant Access
      </footer>
    </div>
  );
}
