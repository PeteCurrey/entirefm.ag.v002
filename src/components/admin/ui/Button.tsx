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
      'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none select-none tracking-tight';

    const sizeStyles = {
      xs: 'h-6 px-2 text-[11px] rounded-[6px] gap-1',
      sm: 'h-8 px-3 text-[12px] rounded-[8px] gap-1.5',
      md: 'h-9 px-3.5 text-[13px] rounded-[8px] gap-2',
      lg: 'h-10 px-4 text-[14px] rounded-[10px] gap-2',
    };

    const variantStyles = {
      primary:
        'bg-[#FF6B24] text-white hover:bg-[#E9540F] active:bg-[#D44708] shadow-[0_1px_2px_rgba(255,107,36,0.2)] border border-[#FF6B24]',
      secondary:
        'bg-[#F0F0EE] text-[#101010] hover:bg-[#E4E4E1] active:bg-[#D8D8D4] border border-[#E4E4E1]',
      outline:
        'bg-[#FFFFFF] text-[#101010] hover:bg-[#F5F5F3] hover:border-[#D1D1CD] active:bg-[#F0F0EE] border border-[#E4E4E1] shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
      ghost:
        'bg-transparent text-[#686866] hover:text-[#101010] hover:bg-[#F0F0EE] active:bg-[#E4E4E1]',
      danger:
        'bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] active:bg-[#FECACA] border border-[#FECACA]',
      icon:
        'h-8 w-8 p-0 bg-[#FFFFFF] text-[#686866] hover:text-[#101010] hover:bg-[#F5F5F3] border border-[#E4E4E1] rounded-[8px]',
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
