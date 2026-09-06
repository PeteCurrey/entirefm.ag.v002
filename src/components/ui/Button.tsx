import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * CAFM Shared Button Component
 * =============================
 * Authority primary actions in CAFM orange, accompanied by
 * muted secondary/outline surfaces, with clean active states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'sm',
      icon,
      loading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-120 disabled:opacity-40 disabled:pointer-events-none select-none tracking-tight';

    const sizeStyles = {
      xs: 'h-6 px-2 text-[11px] rounded-[4px] gap-1',
      sm: 'h-8 px-3 text-[12px] rounded-[6px] gap-1.5',
      md: 'h-9 px-3.5 text-[13px] rounded-[6px] gap-2',
      lg: 'h-10 px-4 text-[14px] rounded-[8px] gap-2',
    };

    const variantStyles = {
      primary:
        'bg-cafm-orange text-white hover:bg-cafm-orange-hover active:bg-cafm-orange-active border border-cafm-orange shadow-xs',
      secondary:
        'bg-cafm-surface-muted text-cafm-text-primary hover:bg-cafm-surface-subtle active:bg-cafm-border border border-cafm-border',
      outline:
        'bg-cafm-surface-card text-cafm-text-primary hover:bg-cafm-surface-muted hover:border-cafm-border-subtle active:bg-cafm-surface-subtle border border-cafm-border',
      ghost:
        'bg-transparent text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-muted active:bg-cafm-surface-subtle',
      danger:
        'bg-cafm-critical-surface text-cafm-critical-text hover:bg-cafm-critical-border/50 active:bg-cafm-critical-border border border-cafm-critical-border',
      icon:
        'h-8 w-8 p-0 bg-cafm-surface-card text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-muted border border-cafm-border rounded-[6px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
