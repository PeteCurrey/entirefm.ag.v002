'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldAlert, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

interface AdminLoginClientProps {
  errorCode: string | null;
  nextUrl: string | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  '1': 'Invalid credentials or security token. Access refused.',
  invalid_credentials: 'Invalid admin credentials or access key. Access refused.',
  missing_credentials: 'Email / Identifier and Password are required.',
  invalid_2fa: 'Invalid two-factor authentication code. Please try again.',
  forbidden_admin: 'Your account does not possess internal EntireFM Administrator clearance.',
  session_expired: 'Your admin session has expired. Please authenticate again.',
  server: 'An internal authentication error occurred. Please try again.',
};

export function AdminLoginClient({ errorCode, nextUrl }: AdminLoginClientProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorText, setErrorText] = useState<string | null>(
    errorCode ? ERROR_MESSAGES[errorCode] || 'Authentication failed. Please verify your credentials.' : null
  );

  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] flex flex-col justify-between selection:bg-[#EA580C]/30 selection:text-white font-sans antialiased">
      {/* Precision Top Bar */}
      <header className="h-16 border-b border-white/[0.08] bg-[#050811]/90 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[17px] font-extralight tracking-[0.08em] text-white">
            Entire<span className="font-bold text-[#EA580C]">FM</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-[11px] font-normal uppercase tracking-[0.18em] text-slate-400">
            Control Plane Access
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            System Operational
          </span>
        </div>
      </header>

      {/* Main Authentication Terminal */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="rounded-sm border border-white/[0.12] bg-[#0B0F19] p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Subtle top accent bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EA580C] to-transparent" />

            {/* Header / Clearance Badge */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/[0.04] border border-white/[0.08] text-[10.5px] font-normal uppercase tracking-[0.16em] text-[#EA580C] mb-3">
                <Lock className="w-3 h-3" />
                <span>Internal System Gate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-white">
                Operations Control Centre
              </h1>
              <p className="mt-2 text-[12.5px] font-light leading-relaxed text-slate-400">
                Authorised EntireFM management and engineering dispatch personnel only.
              </p>
            </div>

            {/* Error Banner */}
            {errorText && (
              <div className="mb-6 rounded-sm border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] font-light text-rose-300 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>{errorText}</div>
              </div>
            )}

            {/* Form */}
            <form action="/api/admin/login" method="post" className="space-y-4">
              {nextUrl && <input type="hidden" name="next" value={nextUrl} />}

              {/* Email / Username */}
              <div>
                <label
                  htmlFor="admin-identifier"
                  className="block text-[10.5px] font-normal uppercase tracking-[0.14em] text-slate-400 mb-1.5"
                >
                  Admin Identifier / Email
                </label>
                <input
                  id="admin-identifier"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@entirefm.com"
                  className="w-full rounded-sm border border-white/[0.12] bg-[#050811] px-3.5 py-2.5 text-[13.5px] font-light text-white placeholder:text-slate-600 focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-[10.5px] font-normal uppercase tracking-[0.14em] text-slate-400"
                  >
                    Security Key / Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-sm border border-white/[0.12] bg-[#050811] px-3.5 py-2.5 pr-10 text-[13.5px] font-light text-white placeholder:text-slate-600 focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional 2FA Challenge Token */}
              <div>
                <label
                  htmlFor="admin-2fa"
                  className="block text-[10.5px] font-normal uppercase tracking-[0.14em] text-slate-400 mb-1.5"
                >
                  2FA Security Token <span className="text-slate-500 font-sans normal-case">(if configured)</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-2fa"
                    name="two_factor_code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="6-digit authenticator code"
                    className="w-full rounded-sm border border-white/[0.12] bg-[#050811] px-3.5 py-2.5 text-[13.5px] font-normal text-white placeholder:text-slate-600 focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] transition-colors"
                  />
                  <KeyRound className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-sm bg-[#EA580C] hover:bg-[#EA580C]/90 py-2.5 text-[13.5px] font-medium text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
              >
                Authenticate & Enter Cockpit
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-7 pt-5 border-t border-white/[0.08] text-center">
              <p className="text-[11px] font-normal text-slate-500">
                All login attempts are cryptographically signed, timestamped, and audited.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-white/[0.06] bg-[#050811]/80 px-6 flex items-center justify-between text-[11px] font-normal text-slate-500">
        <span>EntireFM Operations Control Platform v2.4</span>
        <span>Node: ag-iad1-secure</span>
      </footer>
    </div>
  );
}
