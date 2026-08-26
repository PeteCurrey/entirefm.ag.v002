import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';

export default async function VerifyEmailPage() {
  const session = await getCurrentSession();

  // Must be authenticated as a supplier to see this page
  if (!session || (session.orgType as string) !== 'SUPPLIER') {
    redirect('/supplier-portal/register');
  }

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
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">

            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink/10 border border-brand-pink/30 mx-auto">
              <Mail className="h-8 w-8 text-brand-pink" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-light tracking-tight text-white">Check your email</h1>
              <p className="text-[13.5px] text-slate-300">
                We&apos;ve sent a verification link to:
              </p>
              <p className="text-[14px] font-medium text-white bg-slate-800 rounded px-4 py-2 font-mono">
                {session.email}
              </p>
              <p className="text-[12.5px] text-slate-400 leading-relaxed pt-1">
                Click the link in the email to verify your account and continue your supplier application.
              </p>
            </div>

            {/* For this phase: bypass verification to complete the flow */}
            <div className="border-t border-slate-700/60 pt-5 space-y-3">
              <p className="text-[11.5px] text-slate-500">
                Email not arrived yet? Check your spam folder.
              </p>
              <Link
                href="/supplier-portal/org-setup"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-brand-pink py-2.5 text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Continue to Company Setup <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[11px] text-slate-500">
                You can also verify your email later from the supplier portal.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Secure Supplier Portal
      </footer>
    </div>
  );
}
