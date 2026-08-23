'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import type { TemplateProps } from '../types';

export function TemplateUnsubscribe({ route }: TemplateProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isTest = searchParams.get('test') === '1';

  const [loading, setLoading] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'unsubscribed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetch(`/api/newsletter/unsubscribe?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) setSubscriberEmail(data.email);
        })
        .catch(() => {});
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    if (isTest) {
      setStatus('unsubscribed');
      return;
    }

    if (!token) {
      setErrorMessage('Missing or invalid unsubscribe token.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, reason: 'User requested unsubscribe via web link' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to process unsubscribe.');
        return;
      }

      setStatus('unsubscribed');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header solid />
      <main id="main" className="flex-1 py-20 sm:py-24 bg-brand-foam flex items-center justify-center">
        <div className="container-custom max-w-lg">
          <div className="bg-white border border-brand-edge rounded-sm p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-pink-500 font-bold">
                THE FM BRIEFING · PREFERENCE CENTRE
              </span>
              <h1 className="text-2xl font-bold text-brand-graphite mt-2">
                Unsubscribe &amp; Preferences
              </h1>
            </div>

            {status === 'unsubscribed' ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-brand-graphite">Successfully Unsubscribed</h3>
                <p className="text-xs text-brand-slate mt-2 leading-relaxed">
                  {subscriberEmail ? (
                    <><strong>{subscriberEmail}</strong> has been removed from The FM Briefing mailing list and added to our suppression database.</>
                  ) : (
                    <>You have been unsubscribed and added to our suppression database.</>
                  )}
                </p>
                <p className="text-xs text-brand-silver mt-4">
                  You will no longer receive recurring newsletter editions.
                </p>
                <div className="mt-6 pt-6 border-t border-brand-edge">
                  <Link
                    href="/"
                    className="inline-block text-xs font-bold text-brand-graphite hover:text-brand-electric"
                  >
                    &larr; Return to EntireFM Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-brand-slate leading-relaxed">
                  We are sorry to see you go. Confirm below if you would like to stop receiving weekly editions of <strong>The FM Briefing</strong>.
                </p>

                {subscriberEmail && (
                  <div className="p-3 bg-brand-foam rounded border border-brand-edge text-xs font-mono text-brand-graphite flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-silver" />
                    {subscriberEmail}
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Unsubscribe'}
                  </button>

                  <Link
                    href="/fm-briefing"
                    className="w-full text-center border border-brand-edge hover:bg-brand-foam text-brand-graphite font-semibold text-xs py-2.5 px-4 rounded transition-colors"
                  >
                    Cancel &amp; Keep Subscription
                  </Link>
                </div>

                <p className="text-[10px] text-brand-silver text-center pt-2">
                  Immediate 1-click unsubscribe per UK PECR / GDPR regulations.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
