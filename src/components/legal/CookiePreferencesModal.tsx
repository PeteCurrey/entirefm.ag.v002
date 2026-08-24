'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Lock, Info, ExternalLink } from 'lucide-react';
import { COOKIE_INVENTORY, CookieInventoryItem } from '@/config/legal';

export interface CookiePreferences {
  essential: boolean; // always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: '2026.1',
};

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: CookiePreferences) => void;
}

export function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
}: CookiePreferencesModalProps) {
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [activeTab, setActiveTab] = useState<'preferences' | 'inventory'>('preferences');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('efm_consent_prefs');
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (category: keyof Omit<CookiePreferences, 'essential' | 'timestamp' | 'version'>) => {
    setPrefs((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSaveSelected = () => {
    const updated: CookiePreferences = {
      ...prefs,
      essential: true,
      timestamp: new Date().toISOString(),
    };
    onSave(updated);
    onClose();
  };

  const handleAcceptAll = () => {
    const updated: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: '2026.1',
    };
    onSave(updated);
    onClose();
  };

  const handleRejectNonEssential = () => {
    const updated: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '2026.1',
    };
    onSave(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 id="cookie-modal-title" className="text-lg font-bold text-slate-900">
                Privacy & Cookie Preferences
              </h2>
              <p className="text-xs text-slate-500">
                UK GDPR, PECR & Data (Use and Access) Act 2025 Compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close preferences modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'preferences'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Categories & Consent
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === 'inventory'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Cookie Inventory ({COOKIE_INVENTORY.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700">
          {activeTab === 'preferences' ? (
            <div className="space-y-6">
              <p className="text-xs leading-relaxed text-slate-600">
                EntireFM uses strictly necessary cookies to operate secure authentication and core portal features. With your permission, we also use functional storage and privacy-safe analytics to optimize your experience. We do not use third-party behavioral advertising trackers.
              </p>

              {/* 1. Strictly Necessary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Strictly Necessary & Security</span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      Always Active
                    </span>
                  </div>
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Required for user authentication (<code className="text-indigo-700">efm_session</code>), role-based portal security, CSRF defence, and recording your cookie preferences. Cannot be disabled.
                </p>
              </div>

              {/* 2. Functional & Journey Memory */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Functional & Session Journey Memory</span>
                    <p className="text-xs text-slate-500">Session Storage (No cross-site tracking)</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={prefs.functional}
                      onChange={() => handleToggle('functional')}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Enables in-session journey memory (<code className="text-indigo-700">efm_journey_trail</code>) so that when you request a maintenance quote, your browsing context is attached for fast, accurate service scoping.
                </p>
              </div>

              {/* 3. Analytics (GA4 Zero-PII) */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Performance & Analytics</span>
                    <p className="text-xs text-slate-500">Google Analytics 4 (Zero-PII Mode)</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={() => handleToggle('analytics')}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Helps us understand aggregated visitor traffic, popular FM compliance tools, and general site health. IP addresses are anonymized and form inputs are strictly scrubbed.
                </p>
              </div>

              {/* 4. Marketing & Commercial Communications */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Direct Marketing Communications</span>
                    <p className="text-xs text-slate-500">Commercial updates & FM Intelligence</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={prefs.marketing}
                      onChange={() => handleToggle('marketing')}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Permits tailored commercial updates and intelligence reports based on explicit subscriptions. We never sell or share your contact data with third-party brokers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Below is the live inventory of all storage and cookie technologies audited on this platform:
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">Name</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Provider</th>
                      <th className="px-3 py-2.5">Duration</th>
                      <th className="px-3 py-2.5">Statutory Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COOKIE_INVENTORY.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-mono font-semibold text-slate-900">{item.name}</td>
                        <td className="px-3 py-2 capitalize">{item.category}</td>
                        <td className="px-3 py-2">{item.provider}</td>
                        <td className="px-3 py-2">{item.duration}</td>
                        <td className="px-3 py-2 text-[11px] text-slate-500">{item.statutoryBasis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Equal Prominence Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleRejectNonEssential}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Reject Non-Essential
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleSaveSelected}
              className="rounded-lg border border-indigo-600 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
