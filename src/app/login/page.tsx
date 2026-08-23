/**
 * SHARED AUTHENTICATION PORTAL — /login
 * =====================================
 * Single identity entrypoint for EntireFM Operations, Clients, Contractors, and Engineers.
 * Role-aware redirection upon successful authentication.
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
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getCurrentSession();

  // If already signed in, redirect to user's assigned portal
  if (session) {
    const destination = getPostLoginRedirect(session.role, session.orgType);
    redirect(destination);
  }

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

      {/* Main Login Form Box */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="rounded-lg border border-brand-edge-dark/80 bg-brand-carbon/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-electric/30 bg-brand-electric/10 px-2.5 py-1 text-[11px] font-medium text-brand-electric-bright">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-pulse" />
                Operational Access Gate
              </div>
              <h1 className="mt-4 text-2xl font-light tracking-tight text-white">
                Sign in to your account
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-mist/60">
                Single sign-on for Internal Operations, Clients, Contractors, and Field Engineers.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
                Invalid email or password. Please verify your credentials or contact the EntireFM Helpdesk.
              </div>
            )}

            {/* Login Form */}
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
                  <span className="text-[11px] text-brand-mist/40">Secured with SHA-256</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="mt-1.5 w-full rounded border border-brand-edge-dark bg-brand-void/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-brand-electric px-4 py-3 text-[13.5px] font-semibold text-white shadow-lg transition-all hover:bg-brand-indigo active:scale-[0.99]"
              >
                Authenticate & Enter Portal
              </button>
            </form>

            {/* Platform Role Routing Notice */}
            <div className="mt-8 border-t border-brand-edge-dark/60 pt-5">
              <div className="grid grid-cols-2 gap-2 text-[11.5px] text-brand-mist/50">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand-electric" />
                  <span>Operations / CEO</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span>Client Portals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  <span>Contractor Network</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-purple-400" />
                  <span>Field Engineers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-edge-dark/50 py-4 text-center font-mono text-[11px] text-brand-mist/40">
        EntireFM Unified Operations Platform · Enterprise CAFM/IWMS · ISO 27001 Compliant
      </footer>
    </div>
  );
}
