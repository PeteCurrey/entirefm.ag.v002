'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, ArrowRight, RotateCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export function TemplateVerifyEmail() {
  const searchParams = useSearchParams();
  const maskedEmail = searchParams.get('email') || 'your work email';
  const rawEmail = searchParams.get('raw') || '';
  const errorParam = searchParams.get('error');

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
          message: 'A new verification link has been dispatched to your inbox.',
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
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      <Header solid={true} />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-full max-w-xl mx-auto text-center space-y-8">
          
          {/* Status Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric mx-auto">
            <Mail className="w-7 h-7 stroke-[1.5]" />
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-light">
                Membership Verification
              </span>
              <span className="h-px w-6 bg-brand-electric" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-neutral-900 leading-tight">
              Check your email
            </h1>

            <p className="text-base sm:text-lg font-extralight text-neutral-600 max-w-md mx-auto leading-relaxed">
              We&apos;ve sent a verification link to{' '}
              <span className="font-light text-neutral-900 bg-neutral-200/70 px-2 py-0.5 rounded-[4px] font-mono text-sm">
                {maskedEmail}
              </span>
            </p>
            <p className="text-xs sm:text-sm font-extralight text-neutral-500 max-w-md mx-auto">
              Open the email and click the confirmation link to activate your EntireFM Lobby Membership.
            </p>
          </div>

          {/* Expired / Invalid Notice */}
          {errorParam === 'invalid_or_expired' && (
            <div className="flex items-start gap-3 text-left p-4 rounded-[6px] border border-amber-500/30 bg-amber-500/10 text-amber-900 text-xs font-light">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-normal text-amber-950">This verification link has expired or is invalid.</p>
                <p className="mt-0.5 text-amber-800">Please request a new confirmation email below.</p>
              </div>
            </div>
          )}

          {/* Feedback banner */}
          {resendStatus && (
            <div
              className={`flex items-center justify-center gap-2 p-3.5 rounded-[6px] text-xs font-light transition-all ${
                resendStatus.success
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-900'
                  : 'border border-rose-500/30 bg-rose-500/10 text-rose-900'
              }`}
            >
              {resendStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{resendStatus.message}</span>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {resending
                  ? 'Sending...'
                  : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend verification email'}
              </span>
            </button>

            <Link
              href="/join"
              className="w-full sm:w-auto px-6 py-3 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 hover:text-neutral-900 font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center justify-center gap-2"
            >
              <span>Use a different email</span>
            </Link>
          </div>

          {/* Return to Lobby */}
          <div className="pt-6 border-t border-neutral-200">
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1.5 text-xs font-extralight text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to The Lobby</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
