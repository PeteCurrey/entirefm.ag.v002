'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificationBadgeProps {
  targetRole: string;
  pathTitle?: string;
  issueDate?: string;
  publicCertId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CertificationBadge({
  targetRole,
  pathTitle,
  issueDate,
  publicCertId,
  size = 'md',
  className = '',
}: CertificationBadgeProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`relative rounded-xl border border-amber-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-amber-950/40 p-6 text-white shadow-xl overflow-hidden ${
        isLarge ? 'p-8 max-w-md' : isSmall ? 'p-4 max-w-xs' : 'max-w-sm'
      } ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-brand-pink/10 blur-2xl pointer-events-none" />

      {/* Outer border ring */}
      <div className="relative flex flex-col items-center text-center space-y-4">
        {/* Crest */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-[2px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-neutral-900 shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Badge Header */}
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 font-medium">
            EntireFM Academy Credential
          </p>
          <h3 className={`font-semibold tracking-tight text-white ${isLarge ? 'text-2xl' : 'text-xl'}`}>
            {targetRole}
          </h3>
          {pathTitle && (
            <p className="text-xs text-neutral-400 font-light line-clamp-2 max-w-xs">
              {pathTitle}
            </p>
          )}
        </div>

        {/* Verification Strip */}
        <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
          {formattedDate && <span>Issued {formattedDate}</span>}
        </div>

        {publicCertId && (
          <div className="text-[10px] font-mono text-neutral-500 tracking-wider">
            ID: {publicCertId}
          </div>
        )}
      </div>
    </div>
  );
}
