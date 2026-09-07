'use client';

import React, { useState } from 'react';
import { X, Lock, Send, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';

export interface ToolPdfGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  toolTitle: string;
  annualSavingFormatted?: string;
  leadSource: string;
  conversionPage: string;
  contextPayload: Record<string, any>;
  showCallbackPreference?: boolean;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  callbackTime: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  callbackTime: '',
};

export function ToolPdfGateModal({
  isOpen,
  onClose,
  onSuccess,
  toolTitle,
  annualSavingFormatted,
  leadSource,
  conversionPage,
  contextPayload,
  showCallbackPreference = true,
}: ToolPdfGateModalProps) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'turnstile', string>>>({});
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData | 'turnstile', string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Full name is required (min 2 characters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      errs.email = 'A valid work email is required';
    }
    if (!form.company.trim()) {
      errs.company = 'Company or organisation name is required';
    }
    if (!turnstileToken) {
      errs.turnstile = 'Security verification is completing. Please wait a moment.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const messageText = [
      `${toolTitle} formal PDF appraisal download request.`,
      annualSavingFormatted ? `Projected Annual Saving: ${annualSavingFormatted}` : null,
      form.callbackTime ? `Preferred callback window: ${form.callbackTime}` : null,
      `Organisation: ${form.company}`,
    ]
      .filter(Boolean)
      .join(' | ');

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      phone: form.phone.trim() || 'Not provided',
      service: toolTitle,
      location: 'UK Commercial Portfolio',
      message: messageText,
      conversion_page: conversionPage,
      landing_page: conversionPage,
      form_id: 'tool-pdf-gate-modal',
      lead_source: leadSource,
      lead_priority: 'HIGH',
      turnstile_token: turnstileToken,
      asset_scanner_context: {
        tool: leadSource,
        callback_preference: form.callbackTime || 'None specified',
        annual_saving: annualSavingFormatted,
        ...contextPayload,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[TOOL_GATE_SUBMISSION_REJECTED]', {
          status: res.status,
          errorData,
          lead: { email: form.email, company: form.company },
        });
      }
    } catch (fetchErr) {
      console.error('[TOOL_GATE_NETWORK_ERROR: Attempting Beacon & Client Backup]', fetchErr);
      // Client-side fail-safe: Store failed lead payload in localStorage so high-intent data is never lost
      try {
        const failedQueue = JSON.parse(localStorage.getItem('efm_failed_leads_queue') || '[]');
        failedQueue.push({ ...payload, failedAt: new Date().toISOString(), error: String(fetchErr) });
        localStorage.setItem('efm_failed_leads_queue', JSON.stringify(failedQueue));
      } catch (storageErr) {
        console.warn('[TOOL_GATE_STORAGE_FALLBACK_FAILED]', storageErr);
      }

      // Try navigator.sendBeacon if available
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/enquiry', blob);
        } catch {
          // Non-blocking
        }
      }
    }

    // Mark submitted and trigger PDF fulfillment
    setSubmitted(true);
    setSubmitting(false);

    setTimeout(() => {
      onSuccess();
      onClose();
      setSubmitted(false);
      setForm(EMPTY_FORM);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          disabled={submitting}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-medium text-blue-700">
            <Sparkles className="w-3 h-3" />
            <span>Formal Commercial Document</span>
          </div>
          <h2 id="gate-modal-title" className="text-xl font-bold text-slate-900">
            Download Your Complete Appraisal
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            {annualSavingFormatted ? (
              <>
                We&apos;ll prepare your multi-page PDF breakdown and highlight operational consolidation steps before
                your projected <strong className="text-slate-900 font-semibold">{annualSavingFormatted}</strong> annual saving.
              </>
            ) : (
              'Enter your business details below to generate and download your tailored multi-page PDF executive appraisal.'
            )}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Appraisal Ready</h3>
            <p className="text-xs text-slate-500 font-light">Generating your formal multi-page PDF report now...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g. Sarah Jenkins"
                  className={`w-full text-xs px-3 py-2 rounded-md border ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900`}
                />
                {errors.name && <p className="text-[10px] text-rose-600 mt-1 font-light">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="s.jenkins@company.co.uk"
                  className={`w-full text-xs px-3 py-2 rounded-md border ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900`}
                />
                {errors.email && <p className="text-[10px] text-rose-600 mt-1 font-light">{errors.email}</p>}
              </div>
            </div>

            {/* Company & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company / Organisation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => {
                    setForm({ ...form, company: e.target.value });
                    if (errors.company) setErrors({ ...errors, company: undefined });
                  }}
                  placeholder="e.g. Apex Property Holdings"
                  className={`w-full text-xs px-3 py-2 rounded-md border ${
                    errors.company ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900`}
                />
                {errors.company && <p className="text-[10px] text-rose-600 mt-1 font-light">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Direct Phone <span className="text-slate-400 font-light">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="07700 900123"
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            {/* Optional Callback Window for High-Intent Commercial Leads */}
            {showCallbackPreference && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                  <span>Best Time for a Consultation Call</span>
                  <span className="text-[10px] text-slate-400 font-light">Optional</span>
                </label>
                <div className="relative">
                  <select
                    value={form.callbackTime}
                    onChange={(e) => setForm({ ...form, callbackTime: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
                  >
                    <option value="">No preference / Contact via email first</option>
                    <option value="Morning (09:00–12:00)">Morning (09:00 – 12:00)</option>
                    <option value="Afternoon (12:00–15:00)">Afternoon (12:00 – 15:00)</option>
                    <option value="Late Afternoon (15:00–17:30)">Late Afternoon (15:00 – 17:30)</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Cloudflare Turnstile Verification Widget */}
            <div className="pt-1">
              <TurnstileWidget
                onVerify={(token) => {
                  setTurnstileToken(token);
                  if (errors.turnstile) setErrors({ ...errors, turnstile: undefined });
                }}
                onExpire={() => setTurnstileToken('')}
              />
              {errors.turnstile && <p className="text-[10px] text-rose-600 mt-1 font-light">{errors.turnstile}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Preparing Document...</span>
                  </>
                ) : (
                  <>
                    <span>Generate &amp; Download PDF Appraisal</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center font-light flex items-center justify-center gap-1 pt-1">
              <Lock className="w-3 h-3" />
              <span>Commercial confidentiality guaranteed. No unrequested sales spam.</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
