import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'orange'
    | 'warning'
    | 'nominal'
    | 'critical'
    | 'info'
    | 'neutral'
    | 'dark'
    | 'green'
    | 'amber'
    | 'red'
    | 'blue'; // aliases for backward-compatibility
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

/**
 * CAFM Shared Badge / Pill Component
 * ===================================
 * Semantic status indicators with optional live pulse animation,
 * driven by the centralized CAFM design tokens.
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  className = '',
}: BadgeProps) {
  // Normalize alias variants
  const resolvedVariant =
    variant === 'green'
      ? 'nominal'
      : variant === 'amber'
      ? 'warning'
      : variant === 'red'
      ? 'critical'
      : variant === 'blue'
      ? 'info'
      : variant;

  const variantStyles: Record<string, string> = {
    orange: 'bg-cafm-orange-light text-cafm-orange-hover border-cafm-orange-border',
    warning: 'bg-cafm-warning-surface text-cafm-warning-text border-cafm-warning-border',
    nominal: 'bg-cafm-nominal-surface text-cafm-nominal-text border-cafm-nominal-border',
    critical: 'bg-cafm-critical-surface text-cafm-critical-text border-cafm-critical-border',
    info: 'bg-cafm-info-surface text-cafm-info-text border-cafm-info-border',
    neutral: 'bg-cafm-surface-muted text-cafm-text-secondary border-cafm-border',
    dark: 'bg-cafm-text-primary text-white border-cafm-text-primary',
  };

  const dotStyles: Record<string, string> = {
    orange: 'bg-cafm-orange',
    warning: 'bg-cafm-warning-dot',
    nominal: 'bg-cafm-nominal-dot',
    critical: 'bg-cafm-critical-dot',
    info: 'bg-cafm-info-dot',
    neutral: 'bg-cafm-text-muted',
    dark: 'bg-white',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[9.5px] rounded-[3px]',
    sm: 'px-2 py-0.5 text-[11px] rounded-[4px]',
    md: 'px-2.5 py-1 text-[12px] rounded-[4px]',
  };

  const currentVariant = variantStyles[resolvedVariant] || variantStyles.neutral;
  const currentDot = dotStyles[resolvedVariant] || dotStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase tracking-wider font-medium border ${currentVariant} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${currentDot}`}
          />
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${currentDot}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
