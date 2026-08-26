'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qEmail = searchParams?.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setError(null);
    setResent(false);

    try {
      const res = await fetch('/api/supplier/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setResent(true);
      } else {
        setError(data.error || 'Failed to resend confirmation email.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">

        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink/10 border border-brand-pink/30 mx-auto">
          <Mail className="h-8 w-8 text-brand-pink" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-light tracking-tight text-white">Verify your work email</h1>
          <p className="text-[13.5px] text-slate-300">
            A verification link has been sent to:
          </p>
          {email ? (
            <p className="text-[14px] font-medium text-white bg-slate-800 rounded px-4 py-2 font-mono break-all">
              {email}
            </p>
          ) : (
            <p className="text-[13px] text-slate-400 italic">
              your registered email address
            </p>
          )}
          <p className="text-[12.5px] text-slate-400 leading-relaxed pt-1">
            Please check your inbox and click the confirmation link to activate your supplier account and proceed to organisation setup.
          </p>
        </div>

        {resent && (
          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-[12.5px] text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Verification email resent successfully.</span>
          </div>
        )}

        {error && (
          <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-[12.5px] text-rose-300">
            {error}
          </div>
        )}

        <div className="border-t border-slate-700/60 pt-5 space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 py-2.5 text-[13px] font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Resending…' : 'Resend verification email'}
          </button>

          <div className="pt-2">
            <Link
              href="/supplier-portal/org-setup"
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none"
            >
              Continue to Organisation Setup <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            Already verified? Proceed to setup. If not received, please check your spam folder or contact{' '}
            <a href="mailto:supplier-support@entirefm.com" className="text-brand-pink hover:underline">
              supplier-support@entirefm.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
        <Suspense fallback={<div className="text-slate-400 text-sm">Loading verification...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Canonical Supabase Auth
      </footer>
    </div>
  );
}
