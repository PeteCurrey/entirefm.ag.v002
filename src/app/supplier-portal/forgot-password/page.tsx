import React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2 } from 'lucide-react';

type Props = {
  searchParams: Promise<{ sent?: string; to?: string; error?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, to, error } = await searchParams;
  const hasSent = sent === '1';

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white">
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
            href="/supplier-portal/sign-in"
            className="text-[12px] font-normal text-slate-400 transition-colors hover:text-white"
          >
            ← Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">

            {hasSent ? (
              /* Confirmation State */
              <div className="text-center space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-light text-white">Check your email</h1>
                  {to && (
                    <p className="mt-2 text-[13px] text-slate-400">
                      If an account exists for <span className="text-white font-medium">{decodeURIComponent(to)}</span>, we&apos;ve sent a password reset link.
                    </p>
                  )}
                  <p className="mt-3 text-[12px] text-slate-500">
                    Didn&apos;t receive it? Check your spam folder or contact{' '}
                    <a href="mailto:supplier-support@entirefm.com" className="text-brand-pink hover:underline">
                      supplier-support@entirefm.com
                    </a>
                  </p>
                </div>
                <Link
                  href="/supplier-portal/sign-in"
                  className="inline-block w-full rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white hover:bg-brand-pink/90 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              /* Request Form */
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 mb-4">
                    <Mail className="h-3.5 w-3.5" />
                    Password Reset
                  </div>
                  <h1 className="text-2xl font-light tracking-tight text-white">
                    Forgot your password?
                  </h1>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    Enter your supplier account email and we&apos;ll send a reset link.
                  </p>
                </div>

                {error === 'invalid_email' && (
                  <div className="mb-5 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300">
                    Please enter a valid email address.
                  </div>
                )}

                <form action="/api/supplier/auth/forgot-password" method="post" className="space-y-4">
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

                  <button
                    type="submit"
                    className="w-full rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99]"
                  >
                    Send Reset Link
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/supplier-portal/sign-in" className="text-[13px] text-slate-400 hover:text-white transition-colors">
                    ← Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Secure Supplier Portal
      </footer>
    </div>
  );
}
