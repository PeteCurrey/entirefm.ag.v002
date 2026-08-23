import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  iconType?: 'work' | 'estate' | 'compliance' | 'supply' | 'commercial' | 'ai' | 'general';
  icon?: any;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  iconType = 'general',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-brand-edge-dark/60 bg-brand-carbon/40 p-10 text-center backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-edge-dark bg-brand-void/80 text-brand-electric-bright">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-[15px] font-medium text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-brand-mist/60">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded border border-brand-electric/40 bg-brand-electric/10 px-3.5 py-1.5 text-[12.5px] font-medium text-brand-electric-bright transition-colors hover:bg-brand-electric hover:text-white"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
