import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

interface ConversionBridgeProps {
  headline: string;
  body: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  accent?: 'blue' | 'emerald' | 'amber' | 'violet';
}

const ACCENT_STYLES: Record<string, { border: string; btn: string; glow: string }> = {
  blue: {
    border: 'border-blue-500/25',
    btn: 'bg-brand-electric hover:bg-blue-500',
    glow: 'bg-blue-600/5',
  },
  emerald: {
    border: 'border-emerald-500/25',
    btn: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'bg-emerald-600/5',
  },
  amber: {
    border: 'border-amber-500/25',
    btn: 'bg-amber-600 hover:bg-amber-500',
    glow: 'bg-amber-600/5',
  },
  violet: {
    border: 'border-violet-500/25',
    btn: 'bg-violet-600 hover:bg-violet-500',
    glow: 'bg-violet-600/5',
  },
};

export function ResultsConversionBridge({
  headline,
  body,
  ctaPrimary,
  ctaSecondary,
  accent = 'blue',
}: ConversionBridgeProps) {
  const cls = ACCENT_STYLES[accent] ?? ACCENT_STYLES.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-sm border ${cls.border} bg-brand-graphite p-8 print:hidden`}
    >
      {/* Subtle background tint */}
      <div className={`absolute inset-0 ${cls.glow} pointer-events-none`} />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div className="space-y-2 max-w-xl">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 font-semibold">
            Ready to act on this?
          </p>
          <h3 className="text-lg font-bold text-white leading-snug">{headline}</h3>
          <p className="text-sm text-brand-mist/65 leading-relaxed">{body}</p>
        </div>

        <div className="flex flex-col sm:items-end gap-3 shrink-0">
          <Link
            href={ctaPrimary.href}
            className={`inline-flex items-center gap-2 ${cls.btn} text-white text-sm font-semibold px-5 py-3 rounded-sm transition-colors whitespace-nowrap`}
          >
            {ctaPrimary.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className="inline-flex items-center gap-1.5 text-xs text-brand-mist/60 hover:text-brand-mist transition-colors"
            >
              <Phone className="h-3 w-3" />
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
