import React from 'react';

interface LobbySectionHeaderProps {
  number?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export function LobbySectionHeader({
  number,
  eyebrow,
  title,
  subtitle,
  badge,
  align = 'left',
  dark = false,
}: LobbySectionHeaderProps) {
  return (
    <div className={`mb-8 sm:mb-12 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-4xl'}`}>
      <div className={`flex items-center gap-3 mb-3 ${align === 'center' ? 'justify-center' : ''}`}>
        {number && (
          <span className={`text-[11px] font-normal tracking-widest${dark ? 'text-brand-electric-bright' : 'text-brand-electric'}`}>
            [{number}]
          </span>
        )}
        <span className={`text-[11px] font-medium uppercase tracking-[0.2em] ${dark ? 'text-brand-mist/60' : 'text-brand-silver'}`}>
          {eyebrow}
        </span>
        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-normal border ${
            dark ? 'bg-white/10 text-white/90 border-white/20' : 'bg-brand-surface text-brand-slate border-brand-edge'
          }`}>
            {badge}
          </span>
        )}
      </div>

      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-tight leading-[1.12] ${
        dark ? 'text-white' : 'text-brand-graphite'
      }`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base font-light leading-relaxed max-w-2xl ${
          align === 'center' ? 'mx-auto' : ''
        } ${
          dark ? 'text-brand-mist/75' : 'text-brand-silver'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
