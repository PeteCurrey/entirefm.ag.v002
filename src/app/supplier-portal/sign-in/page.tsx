import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SupplierSignInPage({ searchParams }: Props) {
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    invalid_credentials: 'Incorrect email or password. Please try again.',
    missing_credentials: 'Please enter your email and password.',
    account_suspended: 'Your account has been suspended. Please contact supplier support.',
    server: 'A server error occurred. Please try again.',
    session_expired: 'Your session has expired. Please sign in again.',
    auth_required: 'Authentication required. Please sign in to continue.',
  };

  const errorText = error ? (errorMessages[error] ?? 'Sign in failed. Please try again.') : null;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white selection:bg-brand-pink selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[17px] font-light tracking-tight text-white">
              Entire<span className="font-light text-brand-pink">FM</span>
            </span>
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Supplier Portal
            </span>
          </Link>
          <Link
            href="/suppliers/apply"
            className="text-[12px] font-normal text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Apply Page
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-light tracking-tight text-white">
                Supplier Portal Sign In
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                Sign in to access your supplier application or approved partner account.
              </p>
            </div>

            {/* Error Banner */}
            {errorText && (
              <div className="mb-6 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
                {errorText}
              </div>
            )}

            {/* Form */}
            <form action="/api/supplier/auth/signin" method="post" className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@yourcompany.co.uk"
                  className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block font-mono text-[11px] uppercase tracking-wider text-slate-400"
                  >
                    Password
                  </label>
                  <Link
                    href="/supplier-portal/forgot-password"
                    className="text-[11px] text-brand-pink hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••"
                  className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Register link */}
            <div className="mt-7 border-t border-slate-800/60 pt-6 text-center space-y-2">
              <p className="text-[13px] text-slate-400">
                New to EntireFM?{' '}
                <Link
                  href="/supplier-portal/register"
                  className="text-brand-pink font-medium hover:underline"
                >
                  Start Supplier Application
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500 font-mono">
            EntireFM Partner Network · Secure Supplier Portal
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Unified Operations Platform · Supplier Access
      </footer>
    </div>
  );
}
