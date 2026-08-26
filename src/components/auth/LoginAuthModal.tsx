'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Eye, EyeOff } from 'lucide-react';

export type LoginRole = 'CLIENT' | 'SUPPLIER' | 'ENGINEER';

interface LoginAuthModalProps {
  role: LoginRole | null;
  onClose: () => void;
  errorCode?: string | null;
  redirectParam?: string;
}

const ROLE_META: Record<LoginRole, {
  label: string;
  eyebrow: string;
  placeholder: string;
  accentColor: string;
  redirectHint: string;
}> = {
  CLIENT: {
    label: 'Client',
    eyebrow: 'CLIENT ACCESS',
    placeholder: 'client@yourcompany.com',
    accentColor: 'text-brand-electric-bright',
    redirectHint: 'You will be directed to the Client Portal after sign in.',
  },
  SUPPLIER: {
    label: 'Supplier',
    eyebrow: 'SUPPLIER PORTAL',
    placeholder: 'supplier@yourcompany.com',
    accentColor: 'text-brand-pink-light',
    redirectHint: 'You will be directed to the Supplier Portal after sign in.',
  },
  ENGINEER: {
    label: 'Engineer',
    eyebrow: 'ENGINEER ACCESS',
    placeholder: 'engineer@entirefm.com',
    accentColor: 'text-violet-300',
    redirectHint: 'You will be directed to the Field Engineer Portal after sign in.',
  },
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Invalid email or password. Please try again.',
  '1': 'Invalid email or password. Please try again.',
  expired: 'Your session has expired. Please sign in again.',
  forbidden_client: 'Access denied. This account does not have Client access.',
  forbidden_contractor: 'Access denied. This account does not have Supplier access.',
  forbidden_engineer: 'Access denied. This account does not have Engineer access.',
  no_active_membership: 'No active membership found. Contact EntireFM Support.',
};

export function LoginAuthModal({ role, onClose, errorCode, redirectParam }: LoginAuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = role !== null;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!role) return null;
  const meta = ROLE_META[role];
  const errorText = errorCode ? (ERROR_MESSAGES[errorCode] ?? null) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${meta.label} sign in`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[400px] bg-brand-carbon border border-brand-edge-dark rounded-sm shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal header */}
        <div className="px-7 pt-7 pb-5 border-b border-brand-edge-dark flex items-start justify-between gap-4">
          <div>
            <span className={`text-[10px] font-normal uppercase tracking-[0.18em] block mb-2 ${meta.accentColor}`}>
              {meta.eyebrow}
            </span>
            <h2 className="text-xl font-light tracking-tight text-white">
              Sign in as {meta.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-white/15 text-brand-mist/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Form — SUPPLIER routes to its own dedicated auth endpoint */}
        <form
          action={role === 'SUPPLIER' ? '/api/supplier/auth/signin' : '/api/auth/login'}
          method="post"
          className="px-7 py-6 space-y-5"
        >
          <input type="hidden" name="role_hint" value={role} />
          {redirectParam && <input type="hidden" name="redirect" value={redirectParam} />}

          {/* Error banner */}
          {errorText && (
            <div className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[12.5px] font-light text-rose-300">
              {errorText}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="modal-email"
              className="block text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/60 mb-1.5"
            >
              Email Address
            </label>
            <input
              ref={inputRef}
              id="modal-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder={meta.placeholder}
              className="w-full rounded-sm border border-brand-edge-dark bg-brand-void/80 px-3.5 py-2.5 text-[13.5px] font-light text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="modal-password"
              className="block text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/60 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="modal-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-sm border border-brand-edge-dark bg-brand-void/80 px-3.5 py-2.5 pr-10 text-[13.5px] font-light text-white placeholder:text-brand-mist/30 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mist/40 hover:text-brand-mist/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-brand-electric/90 hover:bg-brand-electric py-2.5 text-[13.5px] font-light text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 focus:ring-offset-brand-carbon"
          >
            Continue as {meta.label}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] font-light text-brand-mist/40 text-center leading-relaxed">
            {meta.redirectHint}
          </p>
        </form>
      </div>
    </div>
  );
}
