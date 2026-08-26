/**
 * /supplier-portal/org-setup
 * ===========================
 * Hardened Server-Side Guard for Supplier Organisation Setup.
 *
 * Rules:
 * 1. Requires a valid, active Supabase Auth user identity.
 * 2. If no valid session or auth user has been deleted -> redirect to /supplier-portal/register.
 * 3. If valid auth user but email unverified -> redirect to /supplier-portal/verify-email.
 * 4. If valid auth user with organisation -> redirect to lifecycle resume destination.
 * 5. Only genuinely authenticated, verified users with no organisation see Company Setup.
 */

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import {
  validateSupplierAuthUser,
  resolveResumeDestination,
} from '@/server/suppliers/supplier-auth-store';
import { OrgSetupForm } from './org-setup-form';

export const dynamic = 'force-dynamic';

export default async function OrgSetupPage() {
  const session = await getCurrentSession();

  // 1. Session Existence & OrgType Guard
  if (!session || session.orgType !== 'SUPPLIER') {
    redirect('/supplier-portal/register');
  }

  // 2. Live Supabase Auth User Validation (Fail-closed against deleted/stale users)
  const authState = await validateSupplierAuthUser(session.personId || session.authUserId || '');

  if (!authState.valid || !authState.authUser) {
    // Deleted from Supabase Auth -> Route to registration
    redirect('/supplier-portal/register');
  }

  // 3. Email Verification Guard
  if (!authState.isVerified) {
    redirect('/supplier-portal/verify-email');
  }

  // 4. Existing Organisation Guard
  if (authState.supplierUser?.organisation_id) {
    const dest = await resolveResumeDestination(authState.authUser.id);
    if (dest !== '/supplier-portal/org-setup') {
      redirect(dest);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white">
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
        </div>
      </header>

      {/* Progress indicator */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="text-emerald-400">✓ Account Created</span>
          <span className="text-slate-600">→</span>
          <span className="text-white font-bold">Company Setup</span>
          <span className="text-slate-600">→</span>
          <span>Supplier Application</span>
        </div>
      </div>

      <main className="flex flex-1 items-start justify-center px-4 py-12">
        <OrgSetupForm />
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Secure Supplier Portal
      </footer>
    </div>
  );
}
