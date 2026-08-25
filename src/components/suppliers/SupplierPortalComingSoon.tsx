'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export function SupplierPortalComingSoon() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
  };

  return (
    <div className="min-h-screen bg-brand-carbon text-white flex flex-col justify-between">
      <main className="flex-1 py-20">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Explanatory Copy & CAFM Feature Preview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-sm border border-brand-electric/30 bg-brand-electric/10 px-3 py-1 font-mono text-[11px] text-brand-electric-bright">
                <span className="h-2 w-2 rounded-full bg-brand-electric-bright animate-pulse" />
                ENTIRECAFM // SUPPLIER &amp; CONTRACTOR PORTAL
              </div>

              <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                Contractor Operating Environment.{' '}
                <span className="font-semibold block mt-1 text-brand-mist">
                  Coming in CAFM Phase 2.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-brand-mist/70 font-light leading-relaxed">
                The EntireCAFM Supplier Operations Portal is currently in active staging integration. Approved subcontractors will receive credentials to manage digital work orders, upload RAMS and evidence sheets, and track invoice matching.
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-xs font-mono uppercase tracking-wider text-brand-mist/50">
                  FORTHCOMING PORTAL CAPABILITIES:
                </p>
                {[
                  'Live GPS work order dispatch with asset-level specifications and SFG20 schedules',
                  'Mobile photographic and calibrated diagnostic evidence capture',
                  'Automated SSIP, insurance, and operative ticket expiry management',
                  'Transparent invoice matching and pre-authorised payment status tracking',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-brand-mist/90">
                    <CheckCircle2 className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/suppliers/apply"
                  className="btn-primary text-xs"
                >
                  Apply for Approved Status <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/suppliers"
                  className="btn-ghost-light text-xs"
                >
                  Return to Supplier Hub
                </Link>
              </div>
            </div>

            {/* Right: Mock Enterprise Portal Login Frame */}
            <div className="lg:col-span-5 bg-brand-graphite border border-brand-edge-dark p-8 sm:p-10 rounded-sm shadow-xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-brand-edge-dark mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/50">AUTHORISED ACCESS</span>
                  <h3 className="text-lg font-bold text-white">Supplier Portal Login</h3>
                </div>
                <Lock className="h-5 w-5 text-brand-electric-bright" />
              </div>

              {attempted ? (
                <div className="p-4 bg-brand-carbon border border-brand-electric/30 rounded-sm text-xs text-brand-mist/90 space-y-2">
                  <div className="flex items-center gap-2 text-brand-electric-bright font-bold">
                    <Clock className="h-4 w-4" />
                    <span>Portal Staging Environment</span>
                  </div>
                  <p className="leading-relaxed">
                    Direct self-service logins are not yet enabled for public accounts. If you are an active supplier awaiting credentials, our procurement desk will issue access upon onboarding sign-off.
                  </p>
                  <button
                    onClick={() => setAttempted(false)}
                    className="text-white underline pt-1 block"
                  >
                    Back to login form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLoginAttempt} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-brand-mist/60 mb-1">
                      Supplier ID or Business Email
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contractor@company.co.uk"
                      className="w-full px-3.5 py-2.5 bg-brand-carbon border border-brand-edge-dark rounded-sm text-xs text-white placeholder-brand-mist/30 focus:outline-none focus:border-brand-electric"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-brand-mist/60 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-brand-carbon border border-brand-edge-dark rounded-sm text-xs text-white placeholder-brand-mist/30 focus:outline-none focus:border-brand-electric"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-electric hover:bg-brand-electric-bright text-slate-900 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                    >
                      Authenticate Contractor Access
                    </button>
                  </div>

                  <p className="text-[11px] text-brand-mist/40 text-center pt-2 font-mono">
                    Protected by EntireFM Enterprise Security Policy
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
