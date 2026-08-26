'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SupplierRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'][strength];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    // Client-side validation
    const clientErrors: string[] = [];
    if (!form.firstName.trim()) clientErrors.push('First name is required.');
    if (!form.lastName.trim()) clientErrors.push('Last name is required.');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      clientErrors.push('A valid work email address is required.');
    if (form.password.length < 10) clientErrors.push('Password must be at least 10 characters.');
    if (!/[A-Z]/.test(form.password)) clientErrors.push('Password must contain at least one uppercase letter.');
    if (!/\d/.test(form.password)) clientErrors.push('Password must contain at least one number.');
    if (form.password !== form.confirmPassword) clientErrors.push('Passwords do not match.');

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/supplier/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        window.location.href = data.redirectUrl || `/supplier-portal/verify-email?email=${encodeURIComponent(form.email)}`;
        return;
      }

      setErrors(data.errors || [data.error || 'Registration failed. Please verify your details and try again.']);
    } catch {
      setErrors(['Network error. Please check your connection and try again.']);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white selection:bg-brand-pink selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[17px] font-light tracking-tight text-white">
              Entire<span className="font-light text-brand-pink">FM</span>
            </span>
            <span className="rounded border border-slate-700 bg-slate-900/60 px-2 py-0.5 font-light text-[10.5px] uppercase tracking-wider text-slate-400">
              Supplier Portal
            </span>
          </Link>
          <Link
            href="/suppliers/apply"
            className="text-[12px] font-normal text-slate-400 transition-colors hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Heading */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-pink/10 px-2.5 py-1 text-[11px] font-normal text-brand-pink mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure Account Creation
              </div>
              <h1 className="text-2xl font-extralight tracking-tight text-white">
                Create your supplier account
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                Create your secure account to start, save and manage your EntireFM supplier application.
              </p>
            </div>

            {/* Error Banner */}
            {errors.length > 0 && (
              <div className="mb-6 rounded border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-300 space-y-1">
                {errors.map((e, i) => <div key={i}>· {e}</div>)}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
                <div>
                  <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@yourcompany.co.uk"
                  className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 10 chars, uppercase & number"
                    className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-light text-[11.5px] uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full rounded border border-slate-700 bg-slate-950/90 px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-slate-500 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-400">Passwords do not match.</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded bg-brand-pink py-2.5 text-center text-[13.5px] font-medium text-white shadow-md transition-all hover:bg-brand-pink/90 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Creating Account…' : (
                  <>Create Supplier Account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            {/* Sign-in link */}
            <div className="mt-7 border-t border-slate-800/60 pt-6 text-center">
              <p className="text-[13px] text-slate-400">
                Already have an account?{' '}
                <Link
                  href="/supplier-portal/sign-in"
                  className="text-brand-pink font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Trust note */}
          <p className="mt-5 text-center text-[11.5px] text-slate-500 font-light">
            Your application data is encrypted and organisation-scoped · EntireFM Supplier Portal
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        EntireFM Partner Network · Secure Supplier Application
      </footer>
    </div>
  );
}
