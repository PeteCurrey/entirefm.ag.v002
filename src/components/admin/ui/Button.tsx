import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

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
        'bg-[#EA580C] text-white hover:bg-[#C2410C] active:bg-[#9A3412] border border-[#EA580C]',
      secondary:
        'bg-[#FAFAF8] text-[#111111] hover:bg-[#F0F0EE] active:bg-[#E8E8E5] border border-[#E8E8E5]',
      outline:
        'bg-[#FFFFFF] text-[#111111] hover:bg-[#FAFAF8] hover:border-[#D4D4D0] active:bg-[#F0F0EE] border border-[#E8E8E5]',
      ghost:
        'bg-transparent text-[#6D6D68] hover:text-[#111111] hover:bg-[#FAFAF8] active:bg-[#F0F0EE]',
      danger:
        'bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] active:bg-[#FECACA] border border-[#FECACA]',
      icon:
        'h-8 w-8 p-0 bg-[#FFFFFF] text-[#6D6D68] hover:text-[#111111] hover:bg-[#FAFAF8] border border-[#E8E8E5] rounded-[6px]',
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
