'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { updateGoogleConsent } from '@/lib/analytics/tracker';

export interface CookiePreferences {
  version: string;
  necessary: boolean;
  essential?: boolean; // backwards compatibility
  functional?: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  version: '2026.1',
  necessary: true,
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: '',
};

type BannerState = 'hidden' | 'compact' | 'customise' | 'details';

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [state, setState] = useState<BannerState>('hidden');
  const [isClosing, setIsClosing] = useState<boolean>(false);
  
  // Local state for category switches
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(false);
  const [marketingAllowed, setMarketingAllowed] = useState<boolean>(false);

  // Load preferences from localStorage or cookie
  const loadSavedPreferences = useCallback((): CookiePreferences | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('efm_consent_prefs');
      if (stored) {
        return JSON.parse(stored);
      }
      const match = document.cookie.match(/(?:^|; )efm_consent_prefs=([^;]*)/);
      if (match) {
        return JSON.parse(decodeURIComponent(match[1]));
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    const saved = loadSavedPreferences();
    if (!saved) {
      // First-time visitor: display compact banner at bottom-left
      setState('compact');
    } else {
      // Returning visitor: ensure Google Consent Mode is updated with existing choices
      setAnalyticsAllowed(saved.analytics === true);
      setMarketingAllowed(saved.marketing === true);
      updateGoogleConsent({
        analytics: saved.analytics === true,
        marketing: saved.marketing === true,
      });
    }

    // Global event listener to reopen preferences panel from footer or in-content links
    const handleOpenSettings = () => {
      const current = loadSavedPreferences() || DEFAULT_PREFERENCES;
      setAnalyticsAllowed(current.analytics === true);
      setMarketingAllowed(current.marketing === true);
      setIsClosing(false);
      setState('customise');
    };

    window.addEventListener('efm-open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('efm-open-cookie-settings', handleOpenSettings);
    };
  }, [loadSavedPreferences]);

  // Handle escape key to dismiss customise/details view if opened
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (state === 'customise' || state === 'details')) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  const persistConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem('efm_consent_prefs', JSON.stringify(prefs));
      document.cookie = `efm_consent_prefs=${encodeURIComponent(
        JSON.stringify(prefs)
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }

    // Genuinely synchronize with Google Consent Mode v2
    updateGoogleConsent({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    });

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('efm-cookie-consent-updated', { detail: prefs })
      );
    }
  };

  const closeWithTransition = () => {
    setIsClosing(true);
    setTimeout(() => {
      setState('hidden');
      setIsClosing(false);
    }, 220);
  };

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      version: '2026.1',
      necessary: true,
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsAllowed(true);
    setMarketingAllowed(true);
    persistConsent(prefs);
    closeWithTransition();
  };

  const handleRejectOptional = () => {
    const prefs: CookiePreferences = {
      version: '2026.1',
      necessary: true,
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    persistConsent(prefs);
    closeWithTransition();
  };

  const handleSavePreferences = () => {
    const prefs: CookiePreferences = {
      version: '2026.1',
      necessary: true,
      essential: true,
      functional: analyticsAllowed || marketingAllowed,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      timestamp: new Date().toISOString(),
    };
    persistConsent(prefs);
    closeWithTransition();
  };

  const handleDismiss = () => {
    closeWithTransition();
  };

  if (!mounted || state === 'hidden') {
    return null;
  }

  const isExpanded = state === 'customise' || state === 'details';
  const showDetails = state === 'details';

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-7 sm:left-7 z-50 transition-all duration-200 ease-out pb-[env(safe-area-inset-bottom,0px)] ${
        isClosing
          ? 'opacity-0 translate-y-2 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div
        className={`w-full bg-white text-slate-800 border border-slate-200/90 rounded-lg shadow-[0_10px_35px_-5px_rgba(11,18,32,0.14),0_2px_8px_-1px_rgba(11,18,32,0.06)] overflow-hidden transition-all duration-250 ease-out font-sans ${
          isExpanded
            ? 'sm:w-[450px] max-w-[calc(100vw-32px)] max-h-[85vh] overflow-y-auto'
            : 'sm:w-[370px] max-w-[calc(100vw-32px)]'
        }`}
      >
        {/* ========================================================= */}
        {/* STATE 1: COMPACT BANNER                                    */}
        {/* ========================================================= */}
        {state === 'compact' && (
          <div className="p-5 sm:p-5.5 space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-[13px] font-semibold tracking-wider uppercase text-slate-900">
                Cookie Settings
              </h2>
              <p className="text-[12.5px] leading-relaxed text-slate-600 font-light">
                We use cookies to keep EntireFM working properly and, with your
                permission, to understand how the website is used and improve
                your experience.
              </p>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-row items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-[#ED3899] px-3.5 py-2 text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#D92584] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED3899] cursor-pointer"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 cursor-pointer"
              >
                Reject optional
              </button>
            </div>

            {/* Customise Link */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setState('customise')}
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 rounded-xs"
              >
                <span>Customise preferences</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATE 2 & 3: CUSTOMISE / DETAILS PREFERENCES PANEL         */}
        {/* ========================================================= */}
        {isExpanded && (
          <div className="p-5 sm:p-5.5 space-y-4.5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-[13.5px] font-semibold text-slate-900">
                Cookie preferences
              </h2>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-slate-400 cursor-pointer"
                aria-label="Close preferences"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category Rows */}
            <div className="space-y-3.5 divide-y divide-slate-100/80">
              {/* Category 1: Necessary */}
              <div className="space-y-1.5 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-900">
                    Necessary
                  </span>
                  <div className="inline-flex items-center gap-1.5 rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    <Lock className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    <span>ON — LOCKED</span>
                  </div>
                </div>
                {showDetails && (
                  <p className="text-[11.5px] leading-relaxed text-slate-500 font-light pt-0.5 animate-fade-in">
                    Required for core website functionality, security, account
                    access and remembering your cookie preferences. These cannot
                    be switched off.
                  </p>
                )}
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="space-y-1.5 pt-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="toggle-analytics"
                    className="text-xs font-medium text-slate-900 cursor-pointer"
                  >
                    Analytics & performance
                  </label>
                  <button
                    type="button"
                    id="toggle-analytics"
                    role="switch"
                    aria-checked={analyticsAllowed}
                    onClick={() => setAnalyticsAllowed((prev) => !prev)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED3899] ${
                      analyticsAllowed ? 'bg-[#ED3899]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        analyticsAllowed ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {showDetails && (
                  <p className="text-[11.5px] leading-relaxed text-slate-500 font-light pt-0.5 animate-fade-in">
                    Helps us understand how visitors use EntireFM so we can
                    improve website performance, navigation and content.
                  </p>
                )}
              </div>

              {/* Category 3: Marketing */}
              <div className="space-y-1.5 pt-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="toggle-marketing"
                    className="text-xs font-medium text-slate-900 cursor-pointer"
                  >
                    Marketing
                  </label>
                  <button
                    type="button"
                    id="toggle-marketing"
                    role="switch"
                    aria-checked={marketingAllowed}
                    onClick={() => setMarketingAllowed((prev) => !prev)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ED3899] ${
                      marketingAllowed ? 'bg-[#ED3899]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        marketingAllowed ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {showDetails && (
                  <p className="text-[11.5px] leading-relaxed text-slate-500 font-light pt-0.5 animate-fade-in">
                    Allows marketing and advertising services to measure campaign
                    performance and, where applicable, provide more relevant
                    advertising.
                  </p>
                )}
              </div>
            </div>

            {/* Save Preferences Button & Quick Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 cursor-pointer"
              >
                Save preferences
              </button>

              <div className="flex items-center justify-between pt-1 text-[11.5px]">
                {/* Toggle details expansion */}
                <button
                  type="button"
                  onClick={() =>
                    setState(showDetails ? 'customise' : 'details')
                  }
                  className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 rounded-xs"
                >
                  {showDetails ? (
                    <>
                      <span>Hide details</span>
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <span>View details</span>
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </>
                  )}
                </button>

                <Link
                  href="/legal/cookies"
                  className="text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
                >
                  Cookies Policy
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
