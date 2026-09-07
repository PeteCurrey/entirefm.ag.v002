/**
 * FIELD ENGINEER — OPERATIVE PROFILE & SETTINGS
 * ==============================================
 * Operative identity, assigned competencies, offline cache, and session controls.
 */

import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Shield,
  LogOut,
  HardHat,
  Wifi,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Building,
  KeyRound,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile & Settings • Field Operative',
  description: 'Manage engineer credentials, offline cache status, and application preferences.',
};

export const dynamic = 'force-dynamic';

export default async function EngineerProfilePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/engineer/profile');

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-6 text-center space-y-3 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-brand-electric/15 border-2 border-brand-electric/30 text-brand-electric-bright flex items-center justify-center mx-auto shadow-lg shadow-brand-electric/20">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{session.name || 'Field Operative'}</h1>
          <p className="text-xs text-brand-mist/70 mt-0.5">{session.email}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-void rounded-full text-xs text-brand-electric-bright border border-brand-edge-dark font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Role: {session.role}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-void rounded-full text-xs text-emerald-300 border border-emerald-500/30 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Operative</span>
          </span>
        </div>
      </div>

      {/* Field System Information */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-5 space-y-3 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-mist flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-brand-electric-bright" />
          <span>Field Operating System Specifications</span>
        </h2>

        <div className="space-y-2 text-xs divide-y divide-brand-edge-dark/60">
          <div className="flex justify-between py-1.5">
            <span className="text-brand-mist/70">Application Core</span>
            <span className="font-bold text-white">EntireFM Field v2.0 (Mobile)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-brand-mist/70">Offline Storage Engine</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active (IndexedDB Store)
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-brand-mist/70">Talk to Quote AI</span>
            <span className="text-brand-electric-bright font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Enabled &bull; Rate Card Connected
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-brand-mist/70">Organization Domain</span>
            <span className="font-medium text-white">{session.orgType} &bull; EntireFM</span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <Link
        href="/api/auth/sign-out"
        className="w-full bg-brand-carbon hover:bg-rose-950/20 border border-rose-500/30 text-rose-300 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
        style={{ minHeight: '48px' }}
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of Field Session</span>
      </Link>
    </div>
  );
}
