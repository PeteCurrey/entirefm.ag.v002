'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, RotateCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const maskedEmail = searchParams?.get('email') || 'your registered work email';
  const rawEmail = searchParams?.get('raw') || '';
  const errorParam = searchParams?.get('error');

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setResendStatus(null);

    const emailToSend = rawEmail || (maskedEmail.includes('@') && !maskedEmail.includes('•') ? maskedEmail : '');

    try {
      const res = await fetch('/api/member/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend || prompt('Please enter your registration email address:') }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setCooldown(data.cooldownRemaining || 60);
        setResendStatus({ success: false, message: data.error });
      } else if (res.ok) {
        setCooldown(60);
        setResendStatus({
          success: true,
          message: 'A fresh verification link has been dispatched to your inbox.',
        });
      } else {
        setResendStatus({ success: false, message: data.error || 'Failed to resend email.' });
      }
    } catch {
      setResendStatus({ success: false, message: 'An unexpected network error occurred.' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-5 bg-brand-electric" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light">
            Verification Required
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
          Check your email
        </h1>
        <p className="text-sm font-light text-neutral-600 leading-relaxed">
          We&apos;ve sent a cryptographic verification link to activate your professional Lobby Membership.
        </p>
      </div>

      {/* ── Invalid/Expired Error ──────────────────────────────────── */}
      {errorParam && (
        <div
          role="alert"
          className="p-4 rounded-[6px] border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium">Verification link expired or invalid</span>
            <p className="font-light text-amber-800">
              The verification token may have expired. Please click below to dispatch a new link to your inbox.
            </p>
          </div>
        </div>
      )}

      {/* ── Resend Status Feedback ─────────────────────────────────── */}
      {resendStatus && (
        <div
          role="status"
          className={`p-4 rounded-[6px] border text-xs flex items-start gap-2.5 animate-fadeIn ${
            resendStatus.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {resendStatus.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-light leading-relaxed">{resendStatus.message}</span>
        </div>
      )}

      {/* ── Primary Inbox Information Card ────────────────────────── */}
      <div className="p-6 rounded-[8px] border border-neutral-200/90 bg-white shadow-2xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-light text-neutral-500 uppercase tracking-wider">Dispatched To</div>
            <div className="text-sm font-light text-neutral-900">{maskedEmail}</div>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
          Click the link inside the confirmation email to verify your email address and unlock full access to The Lobby research desk, statutory indexes, and member roundtables.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full bg-[#0B1220] hover:bg-[#1E293B] text-white py-3 px-4 rounded-[6px] text-xs font-light tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
          >
            <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
            <span>
              {resending
                ? 'Dispatching verification link…'
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend verification email'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Footer Navigation ───────────────────────────────────────── */}
      <div className="pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-light text-neutral-600">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to sign in</span>
        </Link>

        <Link
          href="/join"
          className="text-brand-electric hover:underline"
        >
          Use another email address &rarr;
        </Link>
      </div>
    </div>
  );
}

export function TemplateVerifyEmail() {
  return (
    <AuthSplitLayout
      activeRoute="verify-email"
      imageSrc="/images/editorial/entirefm-hvac-refrigerant-check-1200w.webp"
      imageAlt="Commercial HVAC diagnostics and precision refrigerant manifold inspection"
      badgeText="THE LOBBY · EMAIL VERIFICATION"
      headline="Mandatory cryptographic verification for all Lobby Member accounts."
      subheadline="Every account must be verified before participating in peer roundtables or generating sourced research exports."
    >
      <Suspense fallback={<div className="h-80 bg-neutral-200/40 animate-pulse rounded-[8px]" />}>
        <VerifyEmailContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
