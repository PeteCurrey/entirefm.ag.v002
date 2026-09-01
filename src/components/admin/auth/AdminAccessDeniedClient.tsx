'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, LogOut, ArrowLeft } from 'lucide-react';
import { UserSession } from '@/server/identity';

interface AdminAccessDeniedClientProps {
  session: UserSession | null;
}

export function AdminAccessDeniedClient({ session }: AdminAccessDeniedClientProps) {
  // Determine appropriate return destination based on actual active role
  let returnPortalName = 'Public Homepage';
  let returnPortalUrl = '/';
  let roleDescription = 'Unauthenticated Visitor';

  if (session) {
    if (session.orgType === 'CLIENT') {
      returnPortalName = 'Client Portal';
      returnPortalUrl = '/clients';
      roleDescription = `Client Account (${session.orgName || 'Client Organisation'})`;
    } else if (session.orgType === 'SUPPLIER') {
      returnPortalName = 'Supplier Portal';
      returnPortalUrl = '/supplier-portal/resume';
      roleDescription = `Approved Supplier (${session.name})`;
    } else if (session.role === 'ENGINEER' || session.role === 'CONTRACTOR_ENGINEER') {
      returnPortalName = 'Field Engineer Portal';
      returnPortalUrl = '/engineer';
      roleDescription = `Field Engineer (${session.name})`;
    } else if (session.orgType === 'CONTRACTOR') {
      returnPortalName = 'Contractor Portal';
      returnPortalUrl = '/contractor';
      roleDescription = `Contractor Partner (${session.orgName || 'Contractor Organisation'})`;
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col justify-between selection:bg-[#EA580C]/30 selection:text-white font-sans antialiased">
      {/* Top Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#050811]/90 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="text-[17px] font-extralight tracking-[0.08em] text-white">
          Entire<span className="font-bold text-[#EA580C]">FM</span>
        </Link>

        <Link
          href={returnPortalUrl}
          className="text-[12px] font-light text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to {returnPortalName}</span>
        </Link>
      </header>

      {/* Access Denied Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px]">
          <div className="rounded-sm border border-rose-500/30 bg-[#0B0F19] p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Top red accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-rose-500" />

            {/* Icon & Eyebrow */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-rose-500/10 border border-rose-500/20 text-[10.5px] font-normal uppercase tracking-[0.16em] text-rose-400 mb-3">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Restricted Environment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white">
                Access Denied
              </h1>
              <p className="mt-2 text-[13px] font-light leading-relaxed text-slate-300">
                You do not have permission to access EntireFM Administration.
              </p>
            </div>

            {/* Account Status Card */}
            <div className="mb-6 rounded-sm border border-white/[0.08] bg-[#050811] p-4 text-[12px] space-y-1.5">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Authenticated Active Identity
              </div>
              <div className="font-medium text-white flex items-center gap-2">
                <span>{session?.email || 'Guest User'}</span>
              </div>
              <div className="text-slate-400 text-[11.5px]">
                Active Profile: <span className="text-slate-200">{roleDescription}</span>
              </div>
            </div>

            <p className="mb-6 text-[12.5px] font-light leading-relaxed text-slate-400">
              The EntireFM Operations Control Centre is strictly limited to internal EntireFM corporate management and dispatch personnel. Your session is active and valid for your assigned operational portal.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={returnPortalUrl}
                className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#EA580C] hover:bg-[#EA580C]/90 py-2.5 text-[13.5px] font-medium text-white shadow-lg transition-all duration-200"
              >
                Return to {returnPortalName}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-sm border border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.06] py-2.5 text-[12.5px] font-light text-slate-400 hover:text-white transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Current Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-white/[0.06] bg-[#050811]/80 px-6 flex items-center justify-between text-[11px] font-normal text-slate-500">
        <span>Security Audit Reference: SEC-403-ADM</span>
        <span>EntireFM Unified Operations Platform</span>
      </footer>
    </div>
  );
}
