'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';
import {
  CookiePreferencesModal,
  CookiePreferences,
  DEFAULT_PREFERENCES,
} from './CookiePreferencesModal';

export function CookieConsentBanner() {
  const [hasConsented, setHasConsented] = useState<boolean>(true); // default true to avoid flash
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('efm_consent_prefs');
      if (!stored) {
        setHasConsented(false);
      } else {
        setHasConsented(true);
      }
    } catch {
      setHasConsented(true);
    }

    // Global event listener to reopen modal from footer or links
    const handleOpenSettings = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('efm-open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('efm-open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('efm_consent_prefs', JSON.stringify(prefs));
      // Also write cookie for edge/middleware compatibility
      document.cookie = `efm_consent_prefs=${encodeURIComponent(
        JSON.stringify(prefs)
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
    setHasConsented(true);

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('efm-cookie-consent-updated', { detail: prefs })
      );
    }
  };

  const handleAcceptAll = () => {
    const allPrefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: '2026.1',
    };
    savePreferences(allPrefs);
  };

  const handleRejectNonEssential = () => {
    const minPrefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '2026.1',
    };
    savePreferences(minPrefs);
  };

  return (
    <>
      {/* Floating Consent Banner */}
      {!hasConsented && (
        <aside
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-4xl animate-fade-in rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Cookie className="h-4 w-4" />
                </span>
                <p className="text-sm font-normal text-slate-900">
                  Privacy & Cookie Governance
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                We use strictly necessary cookies to ensure secure operations, authentication, and statutory facilities management services. With your consent, we also use functional storage and privacy-first analytics to improve our services. Read our{' '}
                <Link
                  href="/legal/cookies"
                  className="font-light text-indigo-600 underline hover:text-indigo-700"
                >
                  Cookies Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/legal/privacy"
                  className="font-light text-indigo-600 underline hover:text-indigo-700"
                >
                  Privacy Notice
                </Link>.
              </p>
            </div>

            {/* 3 buttons with equal prominence */}
            <div className="flex flex-col gap-2 shrink-0 sm:flex-row lg:flex-row">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-3.5 w-3.5" />
                Manage Preferences
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-normal text-slate-800 transition-colors hover:bg-slate-200"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-normal text-white shadow-xs transition-colors hover:bg-slate-800"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={savePreferences}
      />
    </>
  );
}
